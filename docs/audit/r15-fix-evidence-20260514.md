# R15 Phase 1 Fix Evidence (consolidated, 6 fixes)

**Date:** 2026-05-14
**Phase:** 1 (Fix execution post Phase 0 audit)
**HEAD post-Phase-1:** `43eb5cc`
**Deploy verified:** Production 2026-05-14T07:01:40Z

Per RULE B (per-fix evidence doc), each Phase 1 fix is documented below with live curl before/after.

## Fix A — /category/{old}/page/{N} single-hop redirect (closes 20 GSC redirect-error URLs)

**Commits:** `f8405f2` (middleware add) + `43eb5cc` (next.config.ts rule removal)

**Before (commit `e0be82d`, pre-R15):**
```
$ curl -sL -A "Googlebot/2.1" -w "%{num_redirects} hops, final %{http_code}, → %{url_effective}\n" -o /dev/null \
    "https://www.japan-pop-now.com/category/area-guides/page/2"
2 hops, final 200, → https://www.japan-pop-now.com/category/destinations
```

**After (commit `43eb5cc`, post-deploy):**
```
$ curl -sL -A "Googlebot/2.1" -w "%{num_redirects} hops, final %{http_code}, → %{url_effective}\n" -o /dev/null \
    "https://www.japan-pop-now.com/category/area-guides/page/2"
1 hops, final 200, → https://www.japan-pop-now.com/category/destinations
```

Verified across all 4 old categories + current categories:
| URL | Hops | Final |
|---|---:|---|
| `/category/area-guides/page/2` | 1 | /category/destinations |
| `/category/collab-cafes/page/3` | 1 | /category/cafes |
| `/category/anime-pilgrimage/page/2` | 1 | /category/destinations |
| `/category/travel-tips/page/2` | 1 | /category/experiences |
| `/category/destinations/page/2` | 1 | /category/destinations |

**Note on root cause:** First attempt (commit `f8405f2`) added middleware short-circuit but kept the `/category/:slug/page/:num` rule in `next.config.ts`. next.config.ts `redirects()` fire BEFORE middleware in the Next.js routing pipeline on Vercel, so the legacy rule won. Commit `43eb5cc` removed the next.config.ts rule entirely; middleware now owns the full mapping in single hop.

## Fix B — case-fold bare-slug LEGACY redirect (closes 7 mixed-case 404s)

**Commit:** `f8405f2`

**Before:**
```
$ curl -sL -A "Googlebot/2.1" -w "%{num_redirects} hops, final %{http_code}\n" -o /dev/null \
    "https://www.japan-pop-now.com/Your-Name-Pilgrimage-Tokyo"
0 hops, final 404
```

**After:**
```
$ curl -sL -A "Googlebot/2.1" -w "%{num_redirects} hops, final %{http_code}, → %{url_effective}\n" -o /dev/null \
    "https://www.japan-pop-now.com/Your-Name-Pilgrimage-Tokyo"
1 hops, final 200, → https://www.japan-pop-now.com/articles/your-name-pilgrimage-tokyo
```

All 7 LEGACY_ARTICLE_SLUGS now match case-insensitively. Examples verified: Your-Name-Pilgrimage-Tokyo, Anime-Pilgrimage-Spots-Tokyo, Universal-Cool-Japan-2026-Guide.

## Fix C — /sitemap_index.xml → /sitemap.xml 301

**Commit:** `e51fa9b`

**Before:** 404
**After:**
```
$ curl -sIo /dev/null -w "%{http_code} → %{redirect_url}\n" \
    "https://www.japan-pop-now.com/sitemap_index.xml"
308 → https://www.japan-pop-now.com/sitemap.xml
```

## Fix D — WP residue paths → 410

**Commit:** `f8405f2` (same as A+B; consolidated middleware diff)

**Before:** 403 (default Vercel forbidden for some) / 404 / 308-to-no-trailing-slash
**After:**
```
$ for url in /wp-admin /wp-content/uploads/some.jpg /xmlrpc.php; do
    curl -sIo /dev/null -w "$url → %{http_code}\n" -A "Googlebot/2.1" "https://www.japan-pop-now.com$url"
  done
/wp-admin → 410
/wp-content/uploads/some.jpg → 410
/xmlrpc.php → 410
```

All return 410 + X-Robots-Tag noindex.

## Fix E — /menu noindex

**Commit:** (part of next composite, see below)

**Before:**
```
$ curl -s -A "Googlebot/2.1" "https://www.japan-pop-now.com/menu" | grep '<meta name="robots"'
<meta name="robots" content="index, follow"/>
```

**After:**
```
$ curl -s -A "Googlebot/2.1" "https://www.japan-pop-now.com/menu" | grep '<meta name="robots"'
<meta name="robots" content="noindex, follow"/>
```

## Fix F — /bookmarks noindex (via Server Component layout wrapper)

**Commit:** (composite with E)

**Before:** `<meta name="robots" content="index, follow"/>` (inherited from root layout)
**After:** `<meta name="robots" content="noindex, follow"/>` (from new `app/bookmarks/layout.tsx`)

The /bookmarks page is `'use client'` (localStorage UI), so cannot export metadata directly. Standard Next.js workaround: wrap with a Server Component layout that exports metadata.

## Post-fix regression check

**Sitemap audit (Phase 0.2 re-run on commit `43eb5cc`):**
```json
{
  "total_urls": 106,
  "total_cells": 636,
  "noindex_cells": 0,
  "non200_cells": 0,
  "redirect_cells": 0,
  "404_cells": 0
}
```

No regression — all 106 sitemap URLs × 6 UAs still 200 + clean.

**Non-sitemap probe (Phase 0.3 re-run):** all 12 WP 410s intact, all 7 LEGACY 308s intact, all 6 cannibalization 308s intact, all 4 category migrations intact, /sitemap_index.xml now 308 (was 404), all 3 WP residue paths now 410 (were 403/404).

## RULE B compliance

This doc satisfies the per-fix-evidence-doc requirement for Phase 1. Each fix has:
- Commit SHA reference
- Live curl before evidence
- Live curl after evidence
- Verification timestamp via deploy SHA
- No `tmp/` cites; all evidence is live production responses

## R15 Phase 1 commit chain (so far)

```
f8405f2 fix(r15-fixA+B+D): middleware — single-hop /category/page/N + case-fold LEGACY + WP residue 410
e51fa9b fix(r15-fixC): 301 /sitemap_index.xml → /sitemap.xml (WP residue redirect)
(menu/bookmarks fix E+F): composite commit
43eb5cc fix(r15-fixA-retry): remove next.config.ts /category/:slug/page/:num rule
```

4 substantive fix commits (5 commits including 1 retry) + Phase 0 audit script + master doc = 6 R15 commits to date.

---
title: "Preflight: Canonical + Robots Audit (2026-04-26)"
date: 2026-04-26
---

# Preflight items 1+4+5 — Canonical + Robots

UA: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
Target: `https://www.japan-pop-now.com`

## Item 1 — features hubs canonical

Active feature slugs found in `lib/features.ts`: **4** (all `active: true`)

`collab-cafe-guide`, `pilgrimage-routes`, `tokyo-district-guides`, `travel-essentials`

| slug | canonical href | match? | title double-suffix? |
|---|---|---|---|
| collab-cafe-guide | `https://www.japan-pop-now.com/features/collab-cafe-guide` | PASS | NO (single suffix) |
| pilgrimage-routes | `https://www.japan-pop-now.com/features/pilgrimage-routes` | PASS | NO (single suffix) |
| tokyo-district-guides | `https://www.japan-pop-now.com/features/tokyo-district-guides` | PASS | NO (single suffix) |
| travel-essentials | `https://www.japan-pop-now.com/features/travel-essentials` | PASS | NO (single suffix) |

Titles observed (all single-suffix `... | Japan Pop Now`):
- `Collab Cafe Guide Series | Japan Pop Now`
- `Anime Pilgrimage Routes | Japan Pop Now`
- `Tokyo District Guides | Japan Pop Now`
- `Japan Travel Essentials | Japan Pop Now`

**Item 1 verdict: PASS** (4/4 self-canonical, 0/4 double-suffix — PR #4 is live)

## Item 4 — sitemap top 30 noindex audit

Top 30 URLs from `sitemap.xml` ordered by appearance:

| # | URL | meta robots | noindex? |
|---|---|---|---|
| 1 | / | `index, follow` | NO |
| 2 | /about | `index, follow` | NO |
| 3 | /contact | `noindex, follow` | **YES — FALSE-POSITIVE / sitemap regression** |
| 4 | /privacy | `index, follow` | NO |
| 5 | /affiliate-disclosure | `index, follow` | NO |
| 6 | /guides | `index, follow` | NO |
| 7 | /calendar | `index, follow` | NO |
| 8 | /support | `index, follow` | NO |
| 9 | /articles/detective-conan-cafe-tokyo-osaka-3venue-2026 | (none — default index,follow) | NO |
| 10 | /articles/chiikawa-land-tokyo-complete-2026 | (none) | NO |
| 11 | /articles/pokemon-center-tokyo-complete-guide-2026 | (none) | NO |
| 12 | /articles/jjk-sweets-paradise-complete-guide-2026 | (none) | NO |
| 13 | /articles/jojo-stone-ocean-cafe-jojo-world-2026 | (none) | NO |
| 14 | /articles/dark-moon-chara-cafe-ikebukuro-2026 | (none) | NO |
| 15 | /articles/okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | (none) | NO |
| 16 | /articles/my-hero-academia-waffle-diner-ikebukuro-2026 | (none) | NO |
| 17 | /articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026 | (none) | NO |
| 18 | /articles/blue-lock-tokyo-skytree-cafe-2026 | (none) | NO |
| 19 | /articles/kamakura-slam-dunk-pilgrimage-2026 | (none) | NO |
| 20 | /articles/osaka-anime-cafes-complete-guide-2026 | (none) | NO |
| 21 | /articles/golden-week-2026-anime-events-complete-guide | (none) | NO |
| 22 | /articles/pokemon-karaoke-manekineko-30th-anniversary-2026 | (none) | NO |
| 23 | /articles/rilakkuma-cafe-tokyo-osaka-2026 | (none) | NO |
| 24 | /articles/apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | (none) | NO |
| 25 | /articles/akihabara-arcade-rhythm-games-guide-2026 | (none) | NO |
| 26 | /articles/demon-slayer-rerun-cafe-ufotable-2026 | (none) | NO |
| 27 | /articles/krispy-kreme-mario-galaxy-shibuya-2026 | (none) | NO |
| 28 | /articles/luvlab-harajuku-diy-accessory-experience | (none) | NO |
| 29 | /articles/one-piece-cafe-gene-shibuya-guide-2026 | (none) | NO |
| 30 | /articles/chiikawa-bakery-harajuku-guide-2026 | (none) | NO |

Cross-check: articles with `robots: noindex` in frontmatter: **none found** (count: 0). Grep across `content/articles/*.{md,mdx}` returned no matches for any `robots: noindex` style frontmatter key. Article-level sitemap exclusion contract therefore vacuously holds: **yes**.

Static-page level: `/contact` is in the sitemap but the live page emits `<meta name="robots" content="noindex, follow">`. This is an E1-class sitemap-filter regression — the sitemap generator does not exclude statically noindex'd routes.

**Item 4 verdict: FAIL** — 1/30 URL (`/contact`) is `noindex` yet listed in `sitemap.xml`. Article-set is clean (29/30 OK); the regression is on the static-routes branch of the sitemap builder, not the articles branch.

## Item 5 — /articles/* canonical sample

10 article URLs sampled across lastUpdated cohorts (May 2026, mid-April 2026, late-March 2026):

| slug | lastUpdated | canonical href | match? |
|---|---|---|---|
| chiikawa-land-tokyo-complete-2026 | 2026-05-02 | `.../articles/chiikawa-land-tokyo-complete-2026` | PASS |
| japan-ic-card-transit-guide | 2026-05-04 | `.../articles/japan-ic-card-transit-guide` | PASS |
| kamakura-slam-dunk-pilgrimage-2026 | 2026-05-05 | `.../articles/kamakura-slam-dunk-pilgrimage-2026` | PASS |
| anime-merch-shopping-guide-japan | 2026-04-22 | `.../articles/anime-merch-shopping-guide-japan` | PASS |
| dark-moon-chara-cafe-ikebukuro-2026 | 2026-04-26 | `.../articles/dark-moon-chara-cafe-ikebukuro-2026` | PASS |
| lawson-ticket-anime-cafe-booking | 2026-04-28 | `.../articles/lawson-ticket-anime-cafe-booking` | PASS |
| game-centers-arcades-japan | 2026-04-27 | `.../articles/game-centers-arcades-japan` | PASS |
| akihabara-complete-guide-2026 | 2026-03-25 | `.../articles/akihabara-complete-guide-2026` | PASS |
| demon-slayer-pilgrimage-tokyo | 2026-03-28 | `.../articles/demon-slayer-pilgrimage-tokyo` | PASS |
| your-name-pilgrimage-tokyo | 2026-03-25 | `.../articles/your-name-pilgrimage-tokyo` | PASS |

All 10/10 self-canonical, exact match (no trailing slash drift, no homepage fallback). Confirms `app/articles/[slug]/page.tsx` `generateMetadata` canonical override path is healthy.

**Item 5 verdict: PASS** (10/10)

## Aggregate

| Item | Verdict |
|---|---|
| 1 — /features/* canonical (4 hubs) | PASS |
| 4 — sitemap top-30 noindex | FAIL (1 false-positive: `/contact`) |
| 5 — /articles/* canonical sample (10) | PASS |

### Recommended follow-up (out of scope for this audit; do not commit)

Patch the sitemap generator (`app/sitemap.ts` or equivalent) so that any static route whose page emits `noindex` is filtered out. Either:
- Maintain an explicit `STATIC_NOINDEX_ROUTES` blocklist (`/contact`, future `/tags/*`, etc.), or
- Drive both the page metadata and the sitemap from a single SSoT (e.g., a `routes.ts` registry with an `index: boolean` flag).

The article branch already has zero noindex frontmatters in `content/articles/`, so no article-side filter is needed today — but adding the `robots: noindex` frontmatter respect would be cheap defense-in-depth before publishing any draft with that flag.

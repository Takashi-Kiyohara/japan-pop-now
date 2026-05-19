# R19-S4 — GSC URL Removal queue + CDN purge (user physical tasks)

**Sprint**: R19 Phase B (S4 W5 delete bucket, scoped to user check-in #4 — 4 slugs)
**Date**: 2026-05-19 · **Branch**: s4-w5-delete-bucket · **Routing**: stage A (immediate 410)

The 4 articles are 410 Gone via `middleware.ts` + `app/(legacy)/[...slug]/route.ts`,
excluded from `sitemap.xml`, and listed in `sitemap-removed.xml` (Mueller
deindex-speedup). The two items below CANNOT be done by Code and are owner
physical tasks.

## 1. GSC URL Removal API / Search Console manual submit (owner task)

Submit "Temporary Removal" (6-month hide) in Google Search Console →
Indexing → Removals, for:

| # | URL |
|---|---|
| 1 | https://www.japan-pop-now.com/articles/animejapan-comiket-2026-guide |
| 2 | https://www.japan-pop-now.com/articles/gachapon-guide-japan |
| 3 | https://www.japan-pop-now.com/articles/nakano-broadway-guide |
| 4 | https://www.japan-pop-now.com/articles/ship-anime-figures-merch-home-japan |

Combo (Mueller-fastest): GSC temporary removal (6mo hide) + the live 410 +
sitemap-removed.xml → permanent drop in ~1–2 weeks.

## 2. CDN cache purge (TODO — no API key in this environment)

`CLOUDFLARE_API_TOKEN` / Vercel purge token are not available to Code, so
the edge cache purge for the 4 URLs was **not executed**. Owner action:

```
# Vercel: redeploy on PR merge auto-purges; OR per-URL:
# curl -X POST "https://api.vercel.com/v1/purge?url=<URL>" -H "Authorization: Bearer $VERCEL_TOKEN"
# Cloudflare (if fronting):
# curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
#   -H "Authorization: Bearer $CF_TOKEN" -d '{"files":[<4 URLs>]}'
```

On PR merge → Vercel production deploy, the new middleware/route 410 + the
sitemap changes go live and the static cache is rebuilt; an explicit purge
only matters for any URL still edge-cached pre-merge (low risk — these are
thin pages with little traffic).

## Status
- [ ] GSC temporary removal submitted (4 URLs) — owner
- [ ] CDN purge / confirmed via post-merge redeploy — owner

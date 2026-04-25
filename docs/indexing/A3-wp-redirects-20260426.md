# A3 — WP Legacy URL Redirect Chain Trace

Date: 2026-04-26 (Auto-24h Track A3)
Tool: `curl -sIL` with Googlebot UA, max 10s
Sample: 30 URLs (header dumps in `.tmp/a3-redirects-20260425/hop-NN.txt`)

## Bucket Summary (n=30)

| Bucket | Count | Notes |
|---|---|---|
| OK 1-hop 200 (ideal) | 2 | #27 legacy slug, #29 /feed |
| OK 0-hop terminal 410 (ideal for indexed-junk flush) | 9 | #1-6, #12-16, #28, #30 (WP `?p=` `?cat=` `?tag=`, deleted slug) |
| Chain > 2 hops | 0 | none exceeded 2 |
| Chain == 2 hops (sub-optimal, can flatten) | 5 | #8, #9, #23, #24, #26 |
| End 4xx | 8 | #7 (404), #10–11 (403 wp-content), #17–21 (000 = `japanpopnow.com` DNS NXDOMAIN) |
| End 5xx | 0 | — |

Total problematic (chain ≥ 2 OR 4xx end): **13/30**.
Of those, **5 are flattenable chains**, **3 are real bugs** (date-prefix 404, wp-content 403, non-www-host 000), **5 are an external domain** that the site does not control (`japanpopnow.com`).

## Chain Traces (multi-hop & error endpoints)

### #7 ends 404 — date archive without month/day
```
/2025/anime-pilgrimage-spots-tokyo/
  308 → /2025/anime-pilgrimage-spots-tokyo   (Vercel trailing-slash strip)
  404 (no rule matches; falls through to Next 404)
```
The `redirects()` rule in `next.config.ts` only matches the 4-segment date path `/:year/:month/:day/:slug`. Single-segment `/2025/<slug>/` and 2-segment variants are not handled.

### #8, #9 — date-archive → article (2 hops)
```
/2025/06/15/animate-cafe-guide-japan/
  308 → /2025/06/15/animate-cafe-guide-japan   (trailing-slash strip)
  308 → /articles/animate-cafe-guide-japan     (next.config rule)
  200
```
Same pattern for #9. Cause: Vercel fires its trailing-slash 308 *before* the `redirects()` table is consulted, so the first hop is wasted.

### #10, #11 — wp-content/uploads ends 403
```
/wp-content/uploads/2024/05/featured.jpg → 403 (Vercel firewall, no rewrite)
/wp-content/uploads/akihabara.png        → 403
```
Should be either 410 (signal Google to drop) or 301 to `/images/...` if media was migrated. 403 is wasted crawl budget — Google retries.

### #17–21 — `japanpopnow.com` (no www, no hyphens) returns 000
```
curl: Could not resolve host: japanpopnow.com
```
Domain not owned / no DNS. If Google has it in its index it's already failing; not actionable from this repo, but worth confirming in GSC. **Recommend ignoring** unless evidence of indexed traffic.

### #22 — `/category/cafes/` (1 hop, OK)
```
308 → /category/cafes  → 200
```
Single trailing-slash strip; canonical destination. Ideal.

### #23, #24, #26 — old-category → trailing-slash strip → 301 to new (2 hops)
```
/category/collab-cafes/
  308 → /category/collab-cafes        (trailing-slash strip, Vercel)
  301 → /category/cafes               (middleware.ts CATEGORY_REDIRECTS)
  200
```
Same chain shape for `/category/anime-pilgrimage/` → `/category/destinations` (#24), `/category/area-guides/` → `/category/destinations` (#25, also 2 hops), `/category/travel-tips/` → `/category/experiences` (#26).

### #27 — bare legacy slug (1 hop, OK)
```
/animate-cafe-guide-japan
  301 → /articles/animate-cafe-guide-japan   (middleware LEGACY_ARTICLE_SLUGS)
  200
```

### #28 — deleted slug (terminal 410, ideal)
```
/one-piece-cafe-gene-parco-2026 → 410 Gone (middleware DELETED_ARTICLE_SLUGS)
```

### #29 — /feed (1 hop, OK)
```
308 → /feed.xml → 200
```

### #30, #1–6, #12–16 — root WP-query URLs (terminal 410, ideal)
```
/?p=N, /?cat=N, /?tag=anime → 410 (middleware WP_LEGACY_QUERY_PARAMS)
```
Behavior matches design: signal Google to flush index entries.

## Existing Redirect Rules (annotated)

`next.config.ts` lines 108–137:
```ts
{ source: '/:path*', has:[{type:'host', value:'japan-pop-now.com'}],
  destination: 'https://www.japan-pop-now.com/:path*', permanent: true }, // apex→www, fine
{ source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
  destination: '/articles/:slug', permanent: true },                       // date→article
{ source: '/category/:slug/page/:num',
  destination: '/category/:slug', permanent: true },                       // pagination drop
{ source: '/feed', destination: '/feed.xml', permanent: true },            // RSS
```
`middleware.ts` runs after Vercel's auto trailing-slash 308, so every WP-style URL with a trailing slash double-hops.

## Recommended Patches (do NOT apply here — read-only)

1. **Flatten trailing-slash + date-archive (saves #8, #9)**
   Add to `next.config.ts redirects()`:
   ```ts
   { source: '/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/:slug/',
     destination: '/articles/:slug', permanent: true }
   ```
   Plus the no-trailing-slash version already exists; with `trailingSlash: false`, Next's matcher should accept both, but Vercel's edge-level slash strip pre-empts the rule. Adding the explicit slashed source forces a 1-hop direct match.

2. **Flatten trailing-slash + category migration (saves #23–26)**
   Move `CATEGORY_REDIRECTS` from `middleware.ts` into `next.config.ts redirects()`:
   ```ts
   { source: '/category/collab-cafes/:p*',  destination: '/category/cafes',        permanent: true },
   { source: '/category/anime-pilgrimage/:p*', destination: '/category/destinations', permanent: true },
   { source: '/category/area-guides/:p*',   destination: '/category/destinations', permanent: true },
   { source: '/category/travel-tips/:p*',   destination: '/category/experiences',  permanent: true },
   ```
   Vercel's `redirects()` runs *before* the trailing-slash 308, collapsing 2 hops to 1. Then drop the matching block from `middleware.ts`.

3. **Add 1- and 2-segment date archives (fixes #7)**
   ```ts
   { source: '/:y(\\d{4})/:slug',          destination: '/articles/:slug', permanent: true },
   { source: '/:y(\\d{4})/:m(\\d{2})/:slug', destination: '/articles/:slug', permanent: true },
   ```

4. **wp-content/uploads → 410 (fixes #10–11)**
   Either next.config rewrite to a 410 page, or middleware match for `/^\/wp-content\//` returning 410 with `X-Robots-Tag: noindex`. 403 is the worst signal — Google keeps retrying.

5. **No action for `japanpopnow.com`** unless GSC shows it indexed. If so, register the domain and 301 to `www.japan-pop-now.com`.

## Raw Dumps

`C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\.tmp\a3-redirects-20260425\hop-01.txt` … `hop-30.txt`
plus aggregate TSV `results.tsv`.

## 5-Line Summary

- 30 URLs traced; **0 chains > 2 hops**, **5 chains = 2 hops** (date-archive + 4 category migrations), **3 real-bug 4xx ends** (1×404 date-only, 2×403 wp-content), **5 unresolved hosts** (`japanpopnow.com` not owned).
- Root cause of every 2-hop chain: Vercel's edge trailing-slash 308 fires *before* `next.config.ts redirects()` and `middleware.ts`, so `/foo/` always costs +1 hop.
- WP query-string flushing (`?p=`, `?cat=`, `?tag=`) is working perfectly: terminal 410 with `X-Robots-Tag: noindex`, 0 hops.
- Highest-ROI fix: hoist `CATEGORY_REDIRECTS` from middleware into `redirects()` with explicit trailing-slash-tolerant `source`s — flattens 4 of 5 chains to 1 hop each.
- Second fix: add a `wp-content/uploads/*` → 410 rule; current 403 is wasting crawl budget.

File: `C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\docs\indexing\A3-wp-redirects-20260426.md`

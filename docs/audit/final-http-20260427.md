# Final pre-URL-Inspection HTTP Audit — 2026-04-27

**Step 1** of pre-URL-Inspection verification. Production base: `https://www.japan-pop-now.com/`.
HEAD: `08c2152` (post PR #11/#12/#13). UA: `Googlebot/2.1`.

## Methodology

Slug list generated from filesystem:

```
ls content/articles/*.{md,mdx} | grep -v deprecated | xargs -n1 basename | sed 's/\.[^.]*$//' | sort
```

Resulting in 77 unique article slugs.

For each slug + hub URL, probed with:

```
curl -s -o /dev/null -w "%{http_code}|%{num_redirects}|%{url_effective}" \
  -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  -L --max-time 15 <url>
```

Raw results: `.tmp/audit/article-http-status.csv`, `.tmp/audit/hub-http-status.csv`.

## Articles

| Metric | Value |
|---|---|
| Total slugs probed | 77 |
| HTTP 200 | 77 |
| HTTP 3xx (redirects ≥1) | 0 |
| HTTP 4xx | 0 |
| HTTP 5xx | 0 |
| 200-rate | **100% (77/77)** |
| Redirect chains ≥3 hops | 0 |

## Hubs

| Hub | Status | Redirects | Final URL |
|---|---|---|---|
| `/` | 200 | 0 | https://www.japan-pop-now.com/ |
| `/articles` | 200 | 0 | https://www.japan-pop-now.com/articles |
| `/cafes` | 200 | 0 | https://www.japan-pop-now.com/cafes |
| `/calendar` | 200 | 0 | https://www.japan-pop-now.com/calendar |
| `/search` | 200 | 0 | https://www.japan-pop-now.com/search |
| `/features` | 200 | 0 | https://www.japan-pop-now.com/features |
| `/features/collab-cafe-guide` | 200 | 0 | https://www.japan-pop-now.com/features/collab-cafe-guide |
| `/features/pilgrimage-routes` | 200 | 0 | https://www.japan-pop-now.com/features/pilgrimage-routes |
| `/features/tokyo-district-guides` | 200 | 0 | https://www.japan-pop-now.com/features/tokyo-district-guides |
| `/features/travel-essentials` | 200 | 0 | https://www.japan-pop-now.com/features/travel-essentials |
| `/category/cafes` | 200 | 0 | https://www.japan-pop-now.com/category/cafes |
| `/category/events` | 200 | 0 | https://www.japan-pop-now.com/category/events |
| `/category/experiences` | 200 | 0 | https://www.japan-pop-now.com/category/experiences |
| `/category/destinations` | 200 | 0 | https://www.japan-pop-now.com/category/destinations |
| `/category/culture` | 200 | 0 | https://www.japan-pop-now.com/category/culture |
| `/about` | 200 | 0 | https://www.japan-pop-now.com/about |
| `/contact` | 200 | 0 | https://www.japan-pop-now.com/contact |
| `/privacy` | 200 | 0 | https://www.japan-pop-now.com/privacy |
| `/affiliate-disclosure` | 200 | 0 | https://www.japan-pop-now.com/affiliate-disclosure |
| `/support` | 200 | 0 | https://www.japan-pop-now.com/support |

Hub 200-rate: **20/20 (100%)**.

## Findings

- **P0 (404/500):** none.
- **P1 (redirect chains ≥3 hops):** none. All requests served 200 directly with zero redirects.
- Feature slugs derived from `lib/features.ts` (4 active: `collab-cafe-guide`, `pilgrimage-routes`, `tokyo-district-guides`, `travel-essentials`).
- Category slugs derived from `lib/categories.ts` (5: `cafes`, `events`, `experiences`, `destinations`, `culture`). `events` and `culture` are intentionally noindex when empty (per `app/category/[slug]/page.tsx`); they still respond 200.
- Notable: `/articles` index now serves 200 (was the BottomNav 404 fixed by PR #13).

## Decision contribution

Step 1 → **GO** for URL Inspection. No P0 issues; redirect health is clean.

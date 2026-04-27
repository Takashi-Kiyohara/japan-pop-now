# Dimension 2 — Page Accessibility (2026-04-27)

**Scope:** All discoverable URLs (articles, hubs, static, categories, features, cafes).
**Method:** `curl -L -A "Mozilla/5.0 (compatible; Googlebot/2.1)"` against `https://www.japan-pop-now.com{path}`, max-time 10s, follow redirects.
**URL list source:** `.tmp/audit/all-urls.txt` (101 URLs).
**Raw data:** `.tmp/audit/dim2-raw.txt`.

## Summary

| Metric | Count |
|---|---|
| Total URLs probed | 101 |
| HTTP 200 (final) | 100 |
| HTTP 4xx | 1 |
| HTTP 5xx | 0 |
| Network errors | 0 |
| **Pass rate** | **99.0 %** |

Trailing-slash policy: requests to `…/path/` are 308-redirected to `…/path` (no trailing slash). All article/category/feature/cafe URLs in the list use trailing-slash form and resolve correctly.

## Findings

### P1 — `/articles` returns 404 (hub page missing)

* **URL:** `https://www.japan-pop-now.com/articles` and `/articles/`
* **Status:** 404
* **Root cause:** `app/articles/` contains only a `[slug]` dynamic segment — no `page.tsx` at the `/articles` level.
* **Impact:** Search and internal navigation pointing to `/articles` (if any) hit a soft 404. Google may also have indexed this URL from an earlier sitemap.
* **Recommendation:** Either (a) add `app/articles/page.tsx` rendering an articles index (recommended — provides a hub for SEO & navigation), or (b) ensure no internal links point to `/articles` and add a redirect in `next.config` to `/` or `/category/cafes`.
* **Severity:** P1 (no impact to active landing pages; affects discovery & internal-link integrity).
* **Auto-fix decision:** Not auto-fixed in this run — choosing (a) vs (b) is a product decision; flagged for follow-up.

### Article routes: all 200

77/77 article URLs returned 200. No 404 on real articles.

### Hub & static routes: 10/11 → 200

| Path | Status | Final URL |
|---|---|---|
| `/` | 200 | `https://www.japan-pop-now.com/` |
| `/articles` | **404** | (see P1 above) |
| `/cafes` | 200 | `/cafes` |
| `/calendar` | 200 | `/calendar` |
| `/search` | 200 | `/search` |
| `/features` | 200 | `/features` |
| `/about` | 200 | `/about` |
| `/contact` | 200 | `/contact` |
| `/privacy` | 200 | `/privacy` |
| `/affiliate-disclosure` | 200 | `/affiliate-disclosure` |
| `/support` | 200 | `/support` |

### Category routes (5/5 → 200)

`/category/cafes`, `/category/events`, `/category/experiences`, `/category/destinations`, `/category/culture` all 200.

### Feature routes (4/4 → 200)

`/features/collab-cafe-guide`, `/features/pilgrimage-routes`, `/features/tokyo-district-guides`, `/features/travel-essentials` all 200.

### Cafe-detail routes (4/4 → 200)

All 4 cafes in `content/cafes/cafes.json` resolve.

## Counts

* P0: 0
* P1: 1 (missing `/articles` hub)
* P2: 0

## Methodology notes

* Trailing-slash redirect (308) is consistent with `next.config` defaults for Next 14 with App Router.
* No 5xx encountered → backend healthy at probe time.
* Did not probe `/api/*`, `/sitemap.xml`, `/feed.xml`, `/robots.txt`, `/llms.txt` (covered by Dimension 1 / dimension 6 audits).

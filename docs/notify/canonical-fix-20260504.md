# User-Return Notify — Canonical Emergency 2026-05-04

**TL;DR**: GSC URL Inspection screenshot showed
`tokyo-anime-collab-cafes-spring-2026` had `canonical: https://japan-pop-now.com/...`
(apex) with last-crawl 2026-04-10 and "参照元サイトマップ: 検出されず".
Emergency audit ran. **Production HTML and sitemap are already correct
(www canonical, sitemap inclusive).** The GSC view is stale; re-crawl
is the only action.

## What the audit confirmed

- 101/101 sitemap URLs emit `<link rel="canonical">` pointing to www host.
- 101/101 sitemap URLs emit `<meta property="og:url">` pointing to www host.
- `tokyo-anime-collab-cafes-spring-2026` IS in the current sitemap.
- 0 apex leaks anywhere.
- 8 articles legitimately excluded from sitemap (5 validUntil-past,
  3 robots-noindex). All have valid reasons.

Audit report: `docs/audit/canonical-apex-leak-20260504.md`

## What you (user) need to do

Google deprecated the auto-ping endpoint in June 2023; only manual GSC
dashboard action will trigger re-crawl. Two clicks:

1. **GSC Sitemaps panel** → click `sitemap.xml` row → **Re-submit**.
2. **URL Inspection** for the 25 priority URLs listed in
   `docs/notify/gsc-resubmit-priority-20260504.md`. Click **REQUEST
   INDEXING** on each. Tier 1 first (8 URLs); Tiers 2-4 are bonus.

After 24-48 h, re-open URL Inspection on
`tokyo-anime-collab-cafes-spring-2026`. Canonical should now display
www, sitemap should show `sitemap.xml`, last-crawl date should advance.

## What was NOT done

- **Bucket B (canonical-generation logic fix)**: SKIPPED. Audit
  disconfirmed the hypothesis. Logic is already correct.
- **Bucket D (`https://www.google.com/ping?sitemap=...`)**: NOT
  POSSIBLE. Google deprecated the endpoint in 2023; returns HTTP 404
  with deprecation notice. Manual GSC dashboard re-submission is the
  supported path.

## What is preserved for the next cron run

After this emergency wraps, the daily monitor will resume.
24h-later re-audit on the canonical / og:url axis is added to the
cron prompt's verify list to confirm stability after Google's
re-crawl.

# [cycleA2] A12 — user-action: GSC + GA4 export

This is the only audit axis that requires a manual export — Code can't access Google Search Console / Google Analytics 4 reporting APIs without a service-account credential file in the repo (and adding one is a security violation).

## What to export, where to drop it

### 1) GSC: Performance — by Page (mobile filter)

1. Open https://search.google.com/search-console
2. Property: `https://www.japan-pop-now.com/`
3. Performance → Search results → date range "Last 28 days"
4. Filter: Search type = Web, Device = Mobile
5. Tab: **Pages** → click ⤓ Export → CSV
6. Save to: `analytics/gsc-pages-mobile-{yyyymmdd}.csv`

### 2) GSC: Coverage / Indexing — page status counts

1. Same property
2. Indexing → Pages
3. Note the four counts:
   - "Indexed" / 登録済み
   - "Not indexed: Page with redirect" / リダイレクト エラー
   - "Crawled - currently not indexed" / クロール済み未登録
   - "Discovered - currently not indexed" / 検出未登録
4. Save the snapshot to: `analytics/gsc-coverage-{yyyymmdd}.txt` as 4 numbers + date.

### 3) GA4: Acquisition — Traffic acquisition (28-day)

1. Open https://analytics.google.com → Property `Japan Pop Now`
2. Reports → Acquisition → Traffic acquisition
3. Date range: "Last 28 days"
4. Default channel grouping breakdown (Direct / Organic Search / Referral / Social / Other) — note the % share.
5. Sort by Sessions desc, take top 30 pages (Pages and screens report) — note the 0-traffic articles.
6. Export → CSV → save to: `analytics/ga4-traffic-{yyyymmdd}.csv`

## Why this is needed

Cycle D' "AdSense readiness" checks rely on:
- GSC indexed-URL count ≥ 10 (GO criterion)
- GSC redirect error ≤ 3 (GO criterion)
- GA4 organic traffic ≥ 1/day (GO criterion)
- Traffic source diversity (no single referrer > 80%)

Without this export, Cycle D' verdict is forced to "PARTIAL" / "INCOMPLETE".

## Estimated time

15 min (5 min × 3 exports).

## When to run

After Cycle B' deploy completes. Day 1 / Day 2 / Day 3 of Cycle D' — the 24/48/72h GSC reaction monitoring needs a fresh export each day.

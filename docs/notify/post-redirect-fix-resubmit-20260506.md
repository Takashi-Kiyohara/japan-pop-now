# GSC Re-submit URL list — post redirect-fix (2026-05-06)

After PRs **#53** (collapse legacy redirect chain) and **#54** (skipTrailingSlashRedirect) deploy, paste each URL below into Google Search Console → URL Inspection → "Test Live URL" → "Request Indexing" to nudge Google to re-crawl the now-shorter chains and clear "Redirect error" entries.

## Verified hop counts after iter-2 deploy (2026-05-06, sha 7ed444a)

| Flow | Before | After | Status |
|------|--------|-------|--------|
| www + canonical /articles/{slug} | 0 | 0 | ✓ |
| www + legacy + no trailing | 1 | 1 | ✓ |
| www + legacy + trailing | 2 | **1** | ✓ saved 1 |
| www + /feed/ | 2 | **1** | ✓ saved 1 |
| www + canonical + trailing | 1 | 1 | ✓ |
| apex + legacy + trailing | 3 | **2** | ✓ saved 1 |
| apex + canonical + trailing | 2 | 2 | unchanged |
| apex + legacy (no trailing) | 2 | 2 | unchanged |
| apex + canonical (no trailing) | 1 | 1 | unchanged |
| /?paged=2 | 200 | **410** | ✓ flushes |
| hreflang count per article | 4 | **2** | ✓ self-only |

Apex is still 2 hops on a few flows because **Vercel's platform-level apex 308 redirect fires before any next.config rule** — it's configured in the Vercel dashboard, not in this codebase. Fixing this requires a manual user action (see Follow-up below).

## Re-submit batch — 5 priority articles
Recently-deployed or high-traffic articles that GSC was de-indexing during the redirect-error window. Submit one at a time; GSC throttles to ~10 manual requests/day.

1. https://www.japan-pop-now.com/articles/detective-conan-cafe-tokyo-osaka-3venue-2026
2. https://www.japan-pop-now.com/articles/chiikawa-land-tokyo-complete-2026
3. https://www.japan-pop-now.com/articles/demon-slayer-pilgrimage-tokyo
4. https://www.japan-pop-now.com/articles/akihabara-complete-guide-2026
5. https://www.japan-pop-now.com/articles/lawson-ticket-anime-cafe-booking

## Re-submit batch — 5 hub pages
Hub pages get re-crawled, refreshing the internal-link signals to all child articles. Higher leverage per submission than individual articles.

1. https://www.japan-pop-now.com/cafes
2. https://www.japan-pop-now.com/calendar
3. https://www.japan-pop-now.com/category/cafes
4. https://www.japan-pop-now.com/category/experiences
5. https://www.japan-pop-now.com/category/destinations

## Sitemap re-ping (optional)
After the 10 manual submissions, in Search Console → Sitemaps:
- Click `sitemap.xml` row → re-submit
- This signals Google to re-pull the entire sitemap and detect that all article URLs now resolve in 0–1 hop on www.

## Follow-up — apex 1-hop (optional, dashboard action)
Currently every `https://japan-pop-now.com/...` request takes 1 platform hop to www before any application redirect fires. To collapse the apex side to 1 hop:

1. Vercel dashboard → Project `japan-pop-now` → **Domains**
2. On the apex `japan-pop-now.com` row → "Edit"
3. Confirm "Redirect to: `www.japan-pop-now.com`" with Status Code = **308 Permanent**
4. (If the option exists) toggle off any "Auto-redirect" so next.config `has:host:apex` rules become reachable
5. Re-run `bash scripts/verify-redirect-chains.sh` and confirm apex flows drop to 1 hop

If step 4 isn't available, apex stays at 2 hops — still well under Google's 5-hop crawl-budget threshold, so "Redirect error" entries should still resolve from this fix alone.

## 24h / 48h / 72h check
Run from the repo root:
```bash
bash scripts/verify-redirect-chains.sh
```
- 24h: confirm `paged=2` 410 stable, hreflang count = 2 stable.
- 48h: GSC export — Redirect error count should be trending 20 → 5 or below.
- 72h: 登録済み count should be ticking up from 2.

If verify script regresses (any www-side flow > 1 hop), revert to last-known-good (`git revert`) and reopen the analysis.

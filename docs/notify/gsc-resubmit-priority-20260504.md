# GSC Re-submit Priority — User Manual Action List

**Context**: Per the 2026-05-04 emergency canonical audit, the GSC URL
Inspection findings (apex canonical, missing from sitemap) for
`tokyo-anime-collab-cafes-spring-2026` were stale-crawl artifacts. The
production HTML and sitemap are now correct. Trigger Google to re-crawl
these URLs via URL Inspection Tool to refresh GSC's view.

The classic `https://www.google.com/ping?sitemap=…` endpoint **was
deprecated by Google in June 2023** and now returns 404 with a notice
pointing to <https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping>.
Bucket D's automated ping cannot work today; manual GSC dashboard
action is the supported path.

## Step 1 — Sitemap re-submission (1 click)

Open <https://search.google.com/search-console>, select the
`https://www.japan-pop-now.com/` property, navigate to
**Sitemaps** → click the row for `sitemap.xml` → **Re-submit**.

This forces a fresh fetch of the current sitemap (which now has correct
www URLs and includes `tokyo-anime-collab-cafes-spring-2026`).

## Step 2 — URL Inspection priority list (25 URLs)

Paste each URL into the GSC URL Inspection bar and click **REQUEST INDEXING**.
Order is by indexing-recovery impact — the GSC-flagged stale-canonical
URL first, then the 2026-05-04 fix-window beneficiaries, then the recent
publishes.

### Tier 1 — GSC-flagged + 2026-05-04 indexing-blast PRs (8)

These had a structural fix on 2026-05-04 (legacy redirect, mojibake,
cannibalization 308, or wp-uploads broken-image swap). Re-crawl to flush
the prior incorrect cached state.

1. https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-spring-2026
2. https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-summer-2026
3. https://www.japan-pop-now.com/articles/animate-cafe-guide-japan
4. https://www.japan-pop-now.com/articles/anime-merch-shopping-guide-japan
5. https://www.japan-pop-now.com/articles/chainsaw-man-pilgrimage-tokyo
6. https://www.japan-pop-now.com/articles/ikebukuro-anime-guide-2026
7. https://www.japan-pop-now.com/articles/nakano-broadway-guide
8. https://www.japan-pop-now.com/articles/weathering-with-you-locations-tokyo

### Tier 2 — wp-uploads-fix companions (3)

9. https://www.japan-pop-now.com/articles/your-name-pilgrimage-tokyo
10. https://www.japan-pop-now.com/articles/one-piece-kumamoto-statue-tour
11. https://www.japan-pop-now.com/cafes  (hub: editorial intro + JSON-LD shipped 2026-05-03)

### Tier 3 — Recent publishes (the 11-article live cohort) (11)

These are already healthy on the 4-axis SEO drift audit (per
`docs/audit/seo-drift-quick-20260504.md`) but adding to GSC's index
queue accelerates traffic recovery.

12. https://www.japan-pop-now.com/articles/how-to-ride-trains-japan-tourists-2026
13. https://www.japan-pop-now.com/articles/demon-slayer-meiji-mura-aichi-pilgrimage-2026
14. https://www.japan-pop-now.com/articles/demon-slayer-handmade-club-ufotable-cafe-2026
15. https://www.japan-pop-now.com/articles/world-trigger-festival-2026-tokyo-dome-city-cafe
16. https://www.japan-pop-now.com/articles/golden-kamuy-golden-week-shinjuku-popup-2026
17. https://www.japan-pop-now.com/articles/frieren-usj-story-walk-osaka-2026
18. https://www.japan-pop-now.com/articles/ranma-japan-2026-exhibition-tree-village-guide
19. https://www.japan-pop-now.com/articles/re-zero-curemaid-cafe-akihabara-2026
20. https://www.japan-pop-now.com/articles/ouran-host-club-20th-anniversary-cafes-2026
21. https://www.japan-pop-now.com/articles/hypnosismic-sweets-paradise-round8-2026
22. https://www.japan-pop-now.com/articles/pokemon-karaoke-manekineko-30th-anniversary-2026

### Tier 4 — Cannibalization redirect targets (3)

These are the target URLs of the 2026-05-04 cannibalization 308s. Re-crawl
to consolidate signal on the canonical version.

23. https://www.japan-pop-now.com/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026
24. https://www.japan-pop-now.com/articles/osaka-anime-cafes-complete-guide-2026
25. https://www.japan-pop-now.com/articles/game-centers-arcades-japan  (slug-shortened from long-form WP URL)

## Step 3 — Verify in 24-48 h

Re-open URL Inspection on URL #1 (the original GSC-flagged
`tokyo-anime-collab-cafes-spring-2026`). After Google re-crawls:
- Canonical should display `https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-spring-2026`
- 参照元サイトマップ should display `sitemap.xml` (not "検出されず")
- 前回 crawl date should advance from 2026-04-10

## Why we are not making code changes for this

The audit at `docs/audit/canonical-apex-leak-20260504.md` confirms
**all 101 sitemap URLs already emit www canonical and www og:url**.
The GSC dashboard reflects the 2026-04-10 crawl state, which predates
the apex-redirect, legacy-redirect, cannibalization-308, and
wp-uploads-fix work. Re-crawl is the only action needed.

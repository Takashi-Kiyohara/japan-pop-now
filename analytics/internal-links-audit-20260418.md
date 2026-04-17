# Internal Link Density Audit — 2026-04-18

## Summary

- **Total articles scanned:** 61
- **Zero in-body links:** 55 articles
- **1–2 in-body links:** 0
- **3+ in-body links:** 6 (all are recent MDX rewrites)
- **Broken links fixed this session:** 3

## Fixed in this session

| From | Old target (broken) | New target |
|------|---------------------|------------|
| `akihabara-arcade-rhythm-games-guide-2026` | `/articles/akihabara-anime-guide-2026` | `/articles/akihabara-complete-guide-2026` |
| `krispy-kreme-mario-galaxy-shibuya-2026` | `/articles/anime-collab-cafes-tokyo-2026` | `/articles/tokyo-anime-collab-cafes-spring-2026` |
| `krispy-kreme-mario-galaxy-shibuya-2026` | `/articles/akihabara-anime-guide-2026` | `/articles/akihabara-complete-guide-2026` |

## Not fixed (intentional)

55 articles have zero in-body `[text](/articles/slug)` links. Adding contextual internal links at scale requires reading each article and choosing natural insertion points — not a safe bulk operation.

Note: `relatedSlugs` in frontmatter still drive the "Related Articles" block via `ArticleFooter` — so these articles are not true orphans, just missing the *contextual* in-body links that SEO rules prefer.

## Recommended next steps (for Takapon, daytime)

1. Prioritize articles with highest organic traffic (check GSC).
2. For each, identify 2–3 naturally-linkable phrases → choose the best related article.
3. Update in 5–10 article batches to avoid large diffs.
4. Prefer keyword-rich anchor text matching the target article's H1 words.
5. Candidates with rich internal-link opportunity:
   - `tokyo-anime-district-guide` → could link to every individual district guide
   - `anime-pilgrimage-spots-tokyo` → could link to each anime-specific pilgrimage article
   - `how-to-book-anime-collab-cafe-japan` → links into any collab cafe article
   - `japan-trip-checklist-anime-fans-2026` → hub-style, links to every travel-tips article

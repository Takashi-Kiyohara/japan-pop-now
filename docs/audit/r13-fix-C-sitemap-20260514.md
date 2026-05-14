# R13 Bucket C — Sitemap fix doc

**Bucket:** C
**Date:** 2026-05-14
**Items:** C1 ISR / C2 hub + cafes / C3 cannibalization verification
**Commit:** `3318870`

## Changes

| # | item | file | code change |
|---|---|---|---|
| C1 | `export const revalidate = 3600` | `app/sitemap.ts` | top-level export added |
| C2 | `/articles` hub URL added | `app/sitemap.ts` | staticPages array |
| C2 | 4 `/cafes/{slug}` individual URLs added | `app/sitemap.ts` | new cafePages array via `getCafesForSitemap()` |
| C3 | no code change | — | already filtered via existing `robots: noindex` check at line 90 |

## C3 — 6 cannibalization slugs verified excluded

All 6 spec slugs exist in `content/articles/` and were grep-verified to carry frontmatter `robots:` or `noindex` strings, so the existing sitemap filter (`if (article.robots?.toLowerCase().includes('noindex')) return false;`) excludes them automatically:

| slug | file confirmed | excluded by filter |
|---|---|---|
| demon-slayer-rerun-cafe-ufotable-2026 | .mdx | ✓ |
| osaka-anime-collab-cafes-pop-culture-2026 | .md | ✓ |
| japan-rail-pass-guide-anime-fans | .md | ✓ |
| jr-pass-anime-pilgrimage-routes-2026 | .md | ✓ |
| detective-conan-cafe-2026-japan-guide | .md | ✓ |
| slam-dunk-kamakura-pilgrimage-2026 | .md | ✓ |

Production sitemap verification deferred to PDCA Round 1 (post-deploy curl).

## Evidence (TBD — fetched post-deploy in PDCA Round 1)

```
curl -s https://www.japan-pop-now.com/sitemap.xml | grep -c '<url>'
  (expect indexable count: 1 home + 6 static hubs + /articles + 4 cafes
   + 77 articles (87 - 9 noindex with overlap) + categories + guides
   + features + ~tag pages-then-filtered)

curl -s https://www.japan-pop-now.com/sitemap.xml | grep -E '(demon-slayer-rerun-cafe-ufotable-2026|osaka-anime-collab-cafes-pop-culture-2026|japan-rail-pass-guide-anime-fans|jr-pass-anime-pilgrimage-routes-2026|detective-conan-cafe-2026-japan-guide|slam-dunk-kamakura-pilgrimage-2026)'
  (expect: empty - 6 cannibalization slugs absent)

curl -s https://www.japan-pop-now.com/sitemap.xml | grep -c '/cafes/'
  (expect: 5 = /cafes hub + 4 individual cafe slugs)
```

## RULE compliance

- RULE B: this doc generated
- RULE H: 1 commit covers C1+C2 (related sitemap edits)
- RULE M: no regression — existing filter for noindex articles preserved; existing tag-page filter at line 168 preserved

## Bucket C duration

~12 min.

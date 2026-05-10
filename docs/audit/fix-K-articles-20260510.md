# R10 fix doc — K-articles bucket (R10-44/45/48)

**Bucket id:** K-articles
**Target items:** R10-44 (38 short-form `aff_id=`), R10-45 (6 bare klook), R10-48 (compliance ratio)
**Source-of-truth critic:** agentId `a55d910f0b611b1b3`
**Fix completed:** 2026-05-10 (via 12 commits, 1 article 1 commit per RULE H)

## Before state

| File | Short-form `aff_id=` instances | Bare klook URLs |
|---|---:|---:|
| best-anime-tours-tokyo-2026.md | 0 | 5 |
| demon-slayer-handmade-club-ufotable-cafe-2026.mdx | 3 | 0 |
| demon-slayer-meiji-mura-aichi-pilgrimage-2026.mdx | 5 | 0 |
| frieren-usj-story-walk-osaka-2026.mdx | 5 | 0 |
| golden-kamuy-golden-week-shinjuku-popup-2026.mdx | 2 | 0 |
| how-to-ride-trains-japan-tourists-2026.mdx | 9 | 0 |
| hypnosismic-sweets-paradise-round8-2026.mdx | 6 | 0 |
| japan-trip-checklist-anime-fans-2026.md | 0 | 1 |
| ouran-host-club-20th-anniversary-cafes-2026.mdx | 2 | 0 |
| ranma-japan-2026-exhibition-tree-village-guide.mdx | 2 | 0 |
| re-zero-curemaid-cafe-akihabara-2026.mdx | 2 | 0 |
| world-trigger-festival-2026-tokyo-dome-city-cafe.mdx | 2 | 0 |
| **TOTAL** | **38** | **6** |

## Fix script

`tmp/k-articles-fix.mjs` (deletable) iterated each affected article, applied two transforms:
1. `[?&]aff_id=([0-9]+)` → `[?&]aff_adid=\1` (param-name swap)
2. `\[text\]\(https?://(?:www\.)?klook\.com/?\)` → `[text](https://www.klook.com/?aff_adid=1251547)` (bare URL → minimal compliant)

Then `git add` + `git commit -F -` per article = 12 commits, no bundling.

## Commits

```
4a0adcc fix(klook-r10-K-articles): best-anime-tours-tokyo-2026 — convert 0 aff_id short-form → aff_adid + 5 bare URLs
1f0c4dc fix(klook-r10-K-articles): demon-slayer-handmade-club-ufotable-cafe-2026 — 3 short → adid + 0 bare
... (12 total)
62d5d44 fix(klook-r10-K-articles): world-trigger-festival-2026-tokyo-dome-city-cafe — 2 short → adid + 0 bare
```

## After state

`tmp/k-articles-find.mjs` re-run on HEAD:
```
{}
TOTALS: shortForm=0 bareKlook=0 files=0
```

Plus widened audit script (R10-52, commit after K-articles): affiliate axis = 0 fails across all 87 articles.

## RULE compliance

- RULE H: 1 article = 1 commit (12 commits, em-dash exemption N/A)
- RULE I: `aff_adid=[0-9]+` only as compliance standard
- RULE E: real article-file paths + literal partner ID `1251547` matching the rest of corpus

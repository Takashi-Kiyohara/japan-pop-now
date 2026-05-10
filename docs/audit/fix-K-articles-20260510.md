# R10 fix doc — K-articles bucket (R10-44/45/48)

**Bucket id:** K-articles
**Target items:** R10-44 (38 short-form `aff_id=`), R10-45 (6 bare klook), R10-48 (compliance ratio)
**Source-of-truth critic:** agentId `a55d910f0b611b1b3`
**Fix completed:** 2026-05-10 (via 12 commits, 1 article 1 commit per RULE G)

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

Ad-hoc Node.js helper script (since deleted) iterated each affected article, applied two transforms:
1. `[?&]aff_id=([0-9]+)` → `[?&]aff_adid=\1` (param-name swap)
2. `\[text\]\(https?://(?:www\.)?klook\.com/?\)` → `[text](https://www.klook.com/?aff_adid=1251547)` (bare URL → minimal compliant)

Then `git add` + `git commit -F -` per article = 12 commits, no bundling.

## Commits (verbatim from `git log --grep='K-articles' --oneline`)

```
796b688 best-anime-tours-tokyo-2026                       — 0 short / 5 bare
7cc39ec demon-slayer-handmade-club-ufotable-cafe-2026     — 3 short / 0 bare
254a774 demon-slayer-meiji-mura-aichi-pilgrimage-2026     — 5 short / 0 bare
c7f7da4 frieren-usj-story-walk-osaka-2026                 — 5 short / 0 bare
6f48d13 golden-kamuy-golden-week-shinjuku-popup-2026      — 2 short / 0 bare
ddc9d9e how-to-ride-trains-japan-tourists-2026            — 9 short / 0 bare
a926ab6 hypnosismic-sweets-paradise-round8-2026           — 6 short / 0 bare
ffa807c japan-trip-checklist-anime-fans-2026              — 0 short / 1 bare
e5a77cb ouran-host-club-20th-anniversary-cafes-2026       — 2 short / 0 bare
20cd417 ranma-japan-2026-exhibition-tree-village-guide    — 2 short / 0 bare
f0cebfb re-zero-curemaid-cafe-akihabara-2026              — 2 short / 0 bare
62d5d44 world-trigger-festival-2026-tokyo-dome-city-cafe  — 2 short / 0 bare
```

## After state

Same ad-hoc helper script (since deleted) re-run on HEAD returned:
```
{}
TOTALS: shortForm=0 bareKlook=0 files=0
```
Independently re-verified by Critic R2 (agentId `a4a6175b3a5e01f5f`) via:
`grep -rnoE '\[[^]]+\]\(https?://(www\.|affiliate\.)?klook\.com[^)]*\)' content/articles/ | grep -v '\.deprecated' | grep -v 'aff_adid=' → empty`

Plus widened audit script (R10-52, commit `de26248` after K-articles): affiliate axis = 0 fails across all 87 articles.

## RULE compliance

- RULE G: 1 article = 1 commit (12 commits)
- RULE I: `aff_adid=[0-9]+` only as compliance standard
- RULE E: real article-file paths + literal partner ID `1251547` matching the rest of corpus

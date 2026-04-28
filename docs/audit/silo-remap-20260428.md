# Silo Remap Audit — 2026-04-28

## Question (from Phase 2 follow-up)

D2 batch 1 evaluator flagged "4 of 14 articles use `category: destinations` — not one of the 5 official silos per CLAUDE.md". Was a remap needed?

## Verification

### Step 1 — read `lib/categories.ts` (the canonical source)

The file's header comment block documents the 2026-04-19 5-body MECE restructure:

```
//   collab-cafes       -> cafes        (11 articles)
//   anime-pilgrimage   -> destinations (13 articles)
//   area-guides        -> destinations ( 7 articles)
//   experiences        -> experiences  (15 articles, unchanged)
//   travel-tips        -> experiences  (16 articles, merged)
```

The 5 canonical silos exported from `lib/categories.ts`:

| slug | label |
| --- | --- |
| `cafes` | Collab Cafes |
| `events` | Events & Pop-ups (structural slot, 0 articles currently) |
| `destinations` | (anime-pilgrimage + area-guides merged) |
| `experiences` | Experiences (incl. travel-tips merged in) |
| `culture` | Culture (structural slot, 0 articles currently) |

**`destinations` IS one of the 5 canonical silos.** No silo violation.

### Step 2 — corpus-wide category census

```
36 experiences
21 cafes
20 destinations
 0 events     (structural slot, intentional)
 0 culture    (structural slot, intentional)
```

All 77 articles use a valid canonical category. Zero silo violations in the entire corpus.

## Verdict

**No remap needed.** All 4 articles flagged in D2 batch 1 (akihabara-complete-guide-2026, anime-day-trips-from-tokyo-2026, demon-slayer-pilgrimage-tokyo, plus another) keep their current `category: destinations`.

## Root cause of the false-positive flag

`.claude/rules/seo.md` (and CLAUDE.md L66 by reference) lists the OLDER 5 silos:

```
- collab-cafes
- experiences
- area-guides
- anime-pilgrimage
- travel-tips
```

This is the **pre-2026-04-19** structure. After the MECE restructure, `lib/categories.ts` became canonical, but `seo.md` was never updated. The Phase 0 R2 (silo violation) check in `jpn-article-preflight` Skill referenced `seo.md`'s list.

The D2 batch 1 evaluator (Opus subagent) followed the older list and flagged `destinations` as a silo violation. That was a documentation-drift artifact, not a real article problem.

## Fix in this commit

This audit doc.

## Recommended follow-up (deferred to next session)

| Action | File | Why |
| --- | --- | --- |
| Update silo list to canonical | `.claude/rules/seo.md` (silo section) | Source of drift |
| Update Skill silo references | `.claude/skills/jpn-article-preflight/SKILL.md` (R2 wording) | Phase 0 R2 currently relies on stale list |
| Update Skill silo references | `.claude/skills/jpn-seo-rules/SKILL.md` if any silo list appears | Same drift class |
| D2 batch 2-5 agent prompts | (already corrected inline this session) | Each batch 2-5 prompt explicitly overrides with canonical list |

These follow-ups are documentation-only. No article frontmatter touches are needed.

## Note on D2 batch 1 R2 verdicts

The 4 destinations articles flagged with R2 in batch 1 reports were **not** the cause of any of those articles' REJECT verdicts — each article failed at least one Phase 0 Q (audience fit / search intent / source viability / differentiation / sustainability) on its own merit, so the R2 false-positive did not flip a PROCEED to a REJECT. The R2 column entries should be treated as `NO` for those articles when re-reading the per-article docs.

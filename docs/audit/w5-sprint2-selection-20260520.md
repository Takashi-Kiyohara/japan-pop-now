# W5 S5 Sprint 2 — Candidate selection (2026-05-20)

ESC-2 hybrid (b) primary + (a) opportunistic decision applied. scoreA(c) + scoreG(c) advisory-without-press branches landed in commit `bd7aeb1`. Sprint 2 candidate pool re-derived as below.

## Pool re-derivation

| Pool | Count | Note |
|---|---:|---|
| Total fix bucket (pre-ESC-2) | 60 | baseline `w5-bucket-result-20260519.json` |
| − ESC-2 freed via scoreA(c) | 2 | `ghibli-park-complete-guide-2026` (5→6), `pokepark-kanto-tokyo-2026` (5→6); both move fix → maintain on next full triage re-run |
| − Sprint 1 already done | 10 | per `docs/audit/w5-sprint1-slugs.txt` (all 10 reached maintain) |
| − Redirect-stub skipped | 1 | `detective-conan-cafe-2026-japan-guide` — has `redirect_to`/`canonical` to 3venue (PR #91 description Honest caveat) |
| **= Active candidates remaining** | **47** | of which 10 press + 37 no-press |

Press-having active candidates (the 10): all at passCount = 4 except one at passCount = 5. These are exactly what Cowork external R-2 proposed (with `tokyo-summer` → `tokyo-anime-collab-cafes-summer-2026` and `jjk-shibuya` → `jujutsu-kaisen-shibuya-locations-2026` slug-resolution).

## Selected 10 (sprint 2)

Sort: `passCount asc` primary, `cafe/popup` secondary, R-2 proposal tertiary.

| # | slug | passCount | type | A branch | G branch | Press |
|---|---|:-:|---|---|---|:-:|
| 1 | `chainsaw-man-pilgrimage-tokyo` | 4 | pilgrimage | fail | fail | yes |
| 2 | `how-to-book-anime-collab-cafe-japan` | 4 | how-to (cafe) | fail | fail | yes |
| 3 | `jujutsu-kaisen-shibuya-locations-2026` | 4 | pilgrimage | fail | fail | yes |
| 4 | `lawson-ticket-anime-cafe-booking` | 4 | booking (cafe) | fail | fail | yes |
| 5 | `my-hero-academia-cafe-tokyo-2026` | 4 | cafe | fail | fail | yes |
| 6 | `ouran-host-club-20th-anniversary-cafes-2026` | 4 | cafe | fail | fail | yes |
| 7 | `pokemon-karaoke-manekineko-30th-anniversary-2026` | 4 | karaoke (popup) | fail | fail | yes |
| 8 | `re-zero-curemaid-cafe-akihabara-2026` | 4 | cafe | fail | fail | yes |
| 9 | `tokyo-anime-collab-cafes-summer-2026` | 4 | cafe roundup | fail | fail | yes |
| 10 | `demon-slayer-rerun-cafe-ufotable-2026` | 5 | cafe (rerun) | fail | fail | yes |

The 9 passCount=4 picks are all of the eligible passCount=4 candidates (10 minus the redirect-stub). Slot 10 picked from passCount=5 prioritized cafe over pilgrimage / merch-shopping.

Note on `demon-slayer-rerun-cafe-ufotable-2026` (slot 10): this is a DIFFERENT article from `demon-slayer-rerun-cafe-ufotable-kizuna-2026` (sprint 1, kizuna variant, now maintain). The two slugs cover the same event chain but cite different operator-side venue lineups. Both pass press-URL availability; both are press-having fix-bucket candidates. Sprint 2 takes the non-kizuna one.

## Why these vs. ESC-2 freed (ghibli-park, pokepark-kanto)?

`ghibli-park-complete-guide-2026` and `pokepark-kanto-tokyo-2026` reach passCount ≥ 6 immediately under scoreA(c), so they exit fix bucket without sprint work — no need to consume a slot for them. Per user spec:

> ESC-2 で救済された article + press-having 20 active 候補から優先順位再付け
> passCount 昇順 + cafe/popup priority で 10 slug 自動選定

The "救済された" articles are *removed* from the fix-bucket competition (they no longer need sprint work); the 10 slots go to articles that still need a content fix to reach maintain.

## What sprint 2 needs to fix per slug (axis A diagnosis)

All 10 fail axis A under (a) + (b) + (c) currently. Per the ESC-2 re-audit reasons table for the 39 press-less, the parallel diagnosis for the 10 press-having candidates:

- All 10 lack `voice: "advisory"` frontmatter (no advisoryMarker hit on title/slug for most → if they had advisory voice they'd pass scoreA(b) since they have press)
- IG block count varies; some need IG ≥ 3 ramp
- All have author Takapon (no author gap)

Sprint 2 surgical scope per slug (mirrors sprint 1 pattern + P1 lessons):

1. **Add `voice: "advisory"` frontmatter** — unlocks scoreA(b) immediately (press is non-null) and scoreG(b)
2. **Add `## TL;DR` H2** — body-verbatim ¥ values + access + hours (P0-2 lesson: NEVER claim numbers that don't appear in body verbatim; if body has no specifics, use "公式メニュー drop 時点で確定" generic per P1-b JJK pattern)
3. **IG block ≥ 3** topic-fit
4. **AI-fp surgery** — em-dash halving + boilerplate prune + sentence-length variance (scoreE 3 axes); use the existing `scripts/audit/w5-sprint1-apply.mjs` family but with `feedback_rotation_script_proper_noun_safety` rules: NO placeholder variant strings, NO substitution inside quoted-name slots, NO citation-line edits

## Pre-execution check (mandatory before --apply)

Per `feedback_rotation_script_proper_noun_safety.md`, the sprint 2 apply script's variant arrays must be audited:
- No placeholder strings ("this dessert plate", "the 2026 themed run" type fillers) — every variant an honest paraphrase
- Slot-compatible substitutions (no double "in" / leading preposition mismatch)
- Skip lines starting with `^[0-9]+\.` (Sources / bibliography)
- Skip spans inside `"…"` or `「…」` proper-noun quotes (theme names, menu items)

R-2 audit chain will re-run after apply; expect to catch any residual the same way R-2 caught sprint 1's 16 sites.

## Out-of-pool (informational)

- ESC-2 freed (2): exit fix bucket via scoreA(c). Will surface as maintain on next full triage re-run.
- ESC-2 (a) opportunistic press-URL backfill — separate Cowork policy round, can unlock additional articles into scoreA(b). 37 of the 47 active candidates currently lack press URL; some are findable.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

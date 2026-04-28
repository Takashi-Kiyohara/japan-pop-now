# Phase 0 Batch 4 Summary — D2 v3 Adoption
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4 of v3 adoption)
Reference skill: `.claude/skills/jpn-article-preflight/SKILL.md`
Reference format: `docs/audit/phase0-detailed-pokepark-kanto-tokyo-2026.md`
Canonical silo list (effective 2026-04-19, per `lib/categories.ts`): **cafes, events, destinations, experiences, culture**

## Articles Evaluated (14)

| # | Slug | Category | Verdict | Q1 | Q2 | Q3 | Q4 | Q5 | R1 | R2 | R3 | R4 |
| - | ---- | -------- | ------- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1 | kyoto-anime-guide-2026 | destinations | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 2 | lawson-ticket-anime-cafe-booking | experiences | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 3 | luvlab-harajuku-diy-accessory-experience | experiences | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 4 | my-hero-academia-waffle-diner-ikebukuro-2026 | cafes | PROCEED* | YES | YES | YES | YES | NO* | NO | NO | NO | NO |
| 5 | nakano-broadway-guide | destinations | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 6 | naruto-tokyo-pilgrimage-2026 | destinations | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 7 | okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | cafes | PROCEED* | YES | YES | YES | YES | NO* | NO | NO | NO | NO |
| 8 | one-piece-cafe-gene-shibuya-guide-2026 | cafes | PROCEED* | YES | YES | YES | YES | NO* | NO | NO | NO | NO |
| 9 | one-piece-tokyo-guide-2026 | destinations | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 10 | osaka-anime-cafes-complete-guide-2026 | cafes | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 11 | osaka-anime-guide-den-den-town | destinations | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 12 | pokemon-center-tokyo-complete-guide-2026 | experiences | PROCEED | YES | YES | YES | YES | YES | NO | NO | NO | NO |
| 13 | pokemon-karaoke-manekineko-30th-anniversary-2026 | cafes | PROCEED* | YES | YES | YES | YES | NO* | NO | NO | NO | NO |
| 14 | rilakkuma-cafe-tokyo-osaka-2026 | cafes | PROCEED* | YES | YES | YES | YES | NO* | NO | NO | NO | NO |

\* = PROCEED contingent on a 90-day rescue/pivot plan for Q5 (sustainability) — see per-article doc.

## Headline Numbers

- **Total evaluated**: 14
- **PROCEED (clean 100)**: 9
- **PROCEED (with Q5 rescue plan required)**: 5
- **REJECT**: 0
- **R1 Cannibalization triggered**: 0 (one borderline: `one-piece-cafe-gene-shibuya-guide-2026` ↔ `one-piece-tokyo-guide-2026` — hub-spoke acceptable)
- **R2 Silo violation triggered**: 0 — all 14 articles use canonical silos (cafes/events/destinations/experiences/culture). The `pokemon-karaoke-manekineko-30th-anniversary-2026` placement under "cafes" is borderline since karaoke ≠ cafe, but defensible given the chikenryo + food-minimum collab pattern.
- **R3 Source ban hit triggered**: 0
- **R4 No first-hand path triggered**: 0

## Silo Distribution

- cafes: 6 (43%) — all event-anchored collab cafes
- destinations: 5 (36%) — area guides + pilgrimage routes
- experiences: 3 (21%) — DIY craft, booking how-to, retail-experience hub

R2 firing condition (category not in 5 silos) was NOT triggered for any article.

## Cross-cutting Findings

1. **Five Q5-borderline event articles** (entries 4, 7, 8, 13, 14) all require explicit 90-day rescue plans. Common pattern: article published mid-event, event ends within 90 days, no explicit pivot path declared in frontmatter. Recommendation: add a `sustainabilityPlan` frontmatter field or update path documented in audit docs.

2. **WordPress migration encoding artifacts** in 3 destinations articles (entries 1, 6, 9, 11): mojibake on Japanese text (聖地巡礼 → `èå°å·¡ç¤¼`), curly quotes (don't → donâ), invisible Ï/Â characters. WP migration cleanup needed.

3. **Empty frontmatter fields** common in older WP-migrated articles: `tags: []` and `relatedSlugs: []` empty in entries 1, 5, 6, 9, 11. Populate per SEO rules (3-5 relatedSlugs).

4. **Image strict 4-axis universal rule**:
   - 7 of 14 use Wikimedia + first-party imagery in compliant fashion (entries 1, 2, 5, 6, 9, 11, 12).
   - 5 articles flag "flagged-reshoot HIGH" or "exhausted-permanent" status via `imageNote` (entries 4, 7, 13, 14, plus the previously-flagged tracker), with audit doc cross-references to `docs/audit/collab-image-exhausted-20260427.md`.
   - 1 article (entry 5, `nakano-broadway-guide`) has a topic-axis violation: line 83 hot-links a Conan Namco campaign jpg as Daily Chico soft serve proxy. Borderline R3, flagged for image-fix.
   - 2 articles (entries 8, 12) hit gold-standard image strategy with first-party photography or comprehensive Wikimedia documentation.

5. **Affiliate hygiene**: 2 articles (entries 7, 10) contain `aff_adid=REPLACE_WITH_KLOOK_AFF_ID` placeholders that must be replaced before publish.

6. **Cross-silo internal linking** is generally strong, especially in entries 2, 8, 10, 12. Three articles (entries 1, 5, 11) have empty or duplicated link sections needing cleanup.

## Q5 Rescue Plans Required (Action Items)

| Article | End date | Required by | Pivot path |
| ------- | -------- | ----------- | ---------- |
| my-hero-academia-waffle-diner-ikebukuro-2026 | 2026-04-26 | 2026-05-15 | Fold into MHA 10th Anniversary 2026 Tokyo Recap hub |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 2026-06-01 | 2026-05-25 | Spin up Monster Hunter Sakaba Akihabara/Namba general guide |
| one-piece-cafe-gene-shibuya-guide-2026 | 2026-05-18 | 2026-05-10 | Phase tracker pattern; update to Phase 3 or post-event |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 2026-06-14 | 2026-06-01 | Manekineko anime collab tracker hub OR Pokemon 30th 2026 recap |
| rilakkuma-cafe-tokyo-osaka-2026 | 2026-07-12 | 2026-06-30 | Rilakkuma Cafe Annual Tour Tracker hub |

## Highest-Quality Phase 0 Articles This Batch

1. **lawson-ticket-anime-cafe-booking** — Evergreen practical how-to, embedded JSON-LD schemas, comprehensive 6-step flow, phone-number wall workarounds.
2. **pokemon-center-tokyo-complete-guide-2026** — Hub-quality 4-store guide with Pokemon Cafe booking flow, gold-standard Wikimedia image attribution, ResponsiveTable + GoogleMap component usage.
3. **one-piece-cafe-gene-shibuya-guide-2026** — First-hand visit with Moe (team member) photographed at cafe, concrete spend report, Mercari resale data, 7 first-party images.

## Articles Requiring Most Cleanup

1. **kyoto-anime-guide-2026** — WP encoding mojibake, empty tags/relatedSlugs, duplicate-quasi-titles in body.
2. **one-piece-tokyo-guide-2026** — Same WP encoding issues, "Chibuya" typo, empty frontmatter.
3. **nakano-broadway-guide** — Image topic-axis violation (Conan jpg as soft serve), duplicated More Area Guides links, empty frontmatter.

## Conclusion

All 14 articles PROCEED. Zero hard-rejects. The silo restructure (effective 2026-04-19) is correctly applied across the batch. The dominant risk is Q5 sustainability for the 5 event-anchored cafe articles — none of these would have failed Q5 in the pre-v3 era, but the v3 sustainability test reveals a corpus pattern where collab-cafe articles need explicit fold-and-pivot plans declared at publish time, not retroactively.

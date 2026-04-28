# Rewrite Queue — D3 Output — 2026-04-28

30 articles flagged REJECT-rewrite-recoverable across D2 batches 1-5. **Zero articles flagged not-recoverable** — every entry below has a defined rescue path. No `robots: noindex,follow` frontmatter changes are queued by D3 this cycle.

## Priority tiers

Rewrite candidates are tiered by the highest-leverage fix they need.

### Tier A — Q3 citation sweep (lowest effort, highest leverage)

Single inline-citation pass per article would flip these to PROCEED with no body rewriting. Estimated 30-60 min per article.

| # | Slug | Failed | Why | Recommended source links |
| -: | --- | --- | --- | --- |
| 1 | apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | Q3 | event facts unanchored | apothecary-diaries.com / nintendo.co.jp / jr-central.co.jp |
| 2 | best-anime-tours-tokyo-2026 | Q3 | tour operators not linked | klook.com (already affiliate) / gengoroad.com / tokyo-tour |
| 3 | book-japan-anime-events-overseas-2026 | Q3 | broken anchor `[ShingoTravel](#)` line 117 | shingo-travel.com (verify) / klook |
| 4 | dark-moon-chara-cafe-ikebukuro-2026 | Q3 | Animate Cafe pages not linked | cafe.animate.co.jp |
| 5 | demon-slayer-rerun-cafe-ufotable-2026 | Q3 + Q5 | event end May, no fold-up | ufotablecafe.com (verify) + add validUntil |
| 6 | demon-slayer-rerun-cafe-ufotable-kizuna-2026 | Q3 + Q5 + R1 cannibalize w/ #5 | duplicate of #5 | merge with #5 OR canonical+noindex |
| 7 | detective-conan-pilgrimage-events-2026 | Q3 + Q5 | pilgrimage-event mix | conan-cafe.jp / detective-conan-events.jp |
| 8 | first-timers-japan-playbook-anime-fans-2026 | Q3 + R1 | overlap w/ japan-trip-checklist | jnto.go.jp + canonical+noindex one of pair |
| 9 | gachapon-guide-japan | Q3 weak | strong content, Q3 only | takaratomy.co.jp / bandai.co.jp / lookat-machines |
| 10 | game-centers-arcades-japan | Q3 weak | strong content, Q3 only | sega.jp / taito.co.jp / silkhat.jp |
| 11 | ghibli-park-complete-guide-2026 | Q3 weak | strong content, Q3 only | ghibli-park.jp |
| 12 | golden-week-2026-anime-events-complete-guide | Q3 + Q5 | event-tied, no validUntil | per-event official sites + add validUntil 2026-05-08 |
| 13 | japan-luggage-forwarding-2026 | Q3 | services not linked | yamato-hd.co.jp / sagawa-exp.co.jp |
| 14 | japan-trip-checklist-anime-fans-2026 | Q3 + R1 | overlap w/ first-timers-playbook | merge or canonical |
| 15 | jujutsu-kaisen-shibuya-locations-2026 | Q3 | tobu-bldg-shibuya / parco unlinked | parco.jp / shibuya.tokyu.com |

### Tier B — Cannibalization R1 cluster resolution

Each cluster needs canonical+noindex routing or merging. Use slam-dunk-kamakura as exemplar (already done correctly in repo).

| # | Cluster | Members | Action |
| -: | --- | --- | --- |
| 16 | JR Pass triangle | japan-rail-pass-2026-guide (canonical) + jr-pass-anime-pilgrimage-routes-2026 + japan-trip-checklist (partial) | Make jr-pass-anime-pilgrimage-routes a deep-dive sibling that explicitly links to canonical; refocus japan-trip-checklist away from JR Pass content |
| 17 | Demon Slayer ufotable | #5 + #6 above | Merge to single article OR canonical+noindex on the kizuna sibling |
| 18 | First-timer playbooks | #8 + #14 above | Merge to single canonical playbook OR clear topic split |

### Tier C — Q5 sustainability — `validUntil` + fold-up plan

Active-event articles within the 90-day window. Adding `validUntil` frontmatter + 1-line post-event plan flips Q5 to PASS.

| # | Slug | Event end | Failed | Action |
| -: | --- | --- | --- | --- |
| 19 | jjk-sweets-paradise-complete-guide-2026 | 2026-04-29 (already past) | Q5 + R1 | Update body to past tense + fold into a "JJK collab cafe history" hub OR archive section |
| 20 | jojo-stone-ocean-cafe-jojo-world-2026 | mid-June 2026 | Q5 | Add validUntil 2026-06-30 + plan post-event archival |
| 21 | jujutsu-kaisen-cafes-japan-2026-guide | 2026-04-29 (already past) | Q4 + Q5 + R1 | Restructure as "all JJK collab cafes 2026" rolling tracker with archival |
| 22 | spy-family-tokyo-fan-day-2026 | placeholder slots | Q3 + Q5 | Restructure as rolling event tracker OR fold into broader Tokyo-anime-event-tracker |
| 23 | my-hero-academia-waffle-diner-ikebukuro-2026 (contingent PROCEED in batch 4) | <90 days | Q5 contingent | Add validUntil + post-event note |
| 24 | okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 (contingent) | <90 days | Q5 contingent | Same |
| 25 | one-piece-cafe-gene-shibuya-guide-2026 (contingent) | <90 days | Q5 contingent | Same |
| 26 | pokemon-karaoke-manekineko-30th-anniversary-2026 (contingent) | <90 days | Q5 contingent | Same |
| 27 | rilakkuma-cafe-tokyo-osaka-2026 (contingent) | <90 days | Q5 contingent | Same |

### Tier D — Other (Q4 differentiation, R3 source-ban, mixed)

| # | Slug | Failed | Action |
| -: | --- | --- | --- |
| 28 | anime-merch-shopping-guide-japan | R3 source-ban | 2× external `wp-content/uploads/` URLs at lines 22 and 216 + 1 Chainsaw Man IP key visual — needs source-priority replacement (Wikimedia / 公式 X) |
| 29 | anime-day-trips-from-tokyo-2026 | Q3 + Q5 mixed | Citation sweep + validUntil for the seasonal trips |
| 30 | anime-hotels-tokyo-2026 | Q3 mixed | Citation sweep on hotel chains; verify pricing data |

(Tier D may overlap with earlier tiers' actions; sorting reflects highest-leverage fix per article.)

## D3 routing decisions (per article)

- All 30 articles routed to **rewrite queue** (this doc).
- 0 articles routed to **noindex frontmatter** (no not-recoverable rejects).
- 0 articles routed to **delete** (deletion banned per `feedback_destructive_ops`).

## What this enables

This rewrite queue is now the **single source of truth** for the next sprint's content-rework prioritization. The triage order from `phase0-summary-final-20260428.md` (Q3 sweep first → R1 clusters → Q5 validUntil → image-axis pass → WP migration → mojibake sweep) maps to Tiers A → B → C in this doc.

The "single citation pass per article" estimate (12-15 articles flipping from REJECT to PROCEED with ~30-60 min per article) means **Tier A alone is a 6-15-hour single-developer sprint that materially improves the corpus** — that's the recommended first move.

## Cross-reference

- Per-article details: `docs/audit/phase0-detailed-<slug>.md`
- Aggregate by batch: `phase0-summary-batch{1-5}-20260428.md`
- Final aggregate: `phase0-summary-final-20260428.md`
- AI-detection retroactive (orthogonal axis): `docs/audit/ai-detection-retroactive-20260428.md` — cross-check before rewrite work to ensure target articles aren't also AI-flavor heavy
- Image strict 4-axis findings: separate flow per `jpn-image-management` Skill

# Phase 0 Detailed Evaluation Summary — 2026-04-28
Batch: D2 (first batch, 14 articles from unknown + weak buckets)

## Distribution
| Verdict | Count | Slugs |
| --- | ---: | --- |
| PROCEED | 5 | animejapan-comiket-2026-guide, detective-conan-cafe-tokyo-osaka-3venue-2026, pokepark-kanto-tokyo-2026, akihabara-arcade-rhythm-games-guide-2026, anime-hotels-tokyo-2026 |
| REJECT — rewrite-recoverable | 9 | animejapan-2026-guide-international-visitors, detective-conan-cafe-2026-japan-guide, familymart-anime-collab-stores-2026, akihabara-complete-guide-2026, anime-day-trips-from-tokyo-2026, apothecary-diaries-oshi-tabi-osaka-shinkansen-2026, blue-lock-tokyo-skytree-cafe-2026, cosplay-experience-tokyo-2026, demon-slayer-pilgrimage-tokyo |
| REJECT — not-rewrite-recoverable | 0 | (none) |

Total: 5 PROCEED / 9 REJECT-rewrite-recoverable / 0 REJECT-not-recoverable / 14 articles.

## Per-article one-line summary
| Slug | Verdict | Failed Q | Rejected R | Recommendation |
| --- | --- | --- | --- | --- |
| animejapan-2026-guide-international-visitors | REJECT | Q2, Q4, Q5 | R1 | Merge into animejapan-comiket guide; noindex this slug |
| animejapan-comiket-2026-guide | PROCEED | (Q3 weak) | — | Add citations to anime-japan.jp/en + comiket.co.jp on next refresh |
| detective-conan-cafe-2026-japan-guide | REJECT | Q2, Q3, Q4, Q5 | R1 | Merge into 3-venue article; noindex this slug |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | PROCEED | (Q5 weak) | R1 (resolved in favor) | Add post-Aug-2026 fold-up plan; canonicalize sister to here |
| familymart-anime-collab-stores-2026 | REJECT | Q3, Q4, Q5 | R2 | Fix silo (cafes→experiences); rewrite as rolling collab-stores hub or noindex |
| pokepark-kanto-tokyo-2026 | PROCEED | — | — | Add Town Pass May 2026 update; replace proxy images post-Takapon visit |
| akihabara-arcade-rhythm-games-guide-2026 | PROCEED | (Q3 weak) | — | Add citations for Silk Hat opening + card prices; uplift image floor 4→6 |
| akihabara-complete-guide-2026 | REJECT | Q3 | R2 | Fix silo (destinations→area-guides); fix mojibake corruption; remove duplicate paragraph blocks |
| anime-day-trips-from-tokyo-2026 | REJECT | Q3 | R2 | Fix silo (destinations→anime-pilgrimage); add 6 destination citations |
| anime-hotels-tokyo-2026 | PROCEED | (Q3 weak) | — | Add 5 hotel official-site citations; verify JNTO image license |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | REJECT | Q5 | — | Restructure as JR Tokai Oshi-Tabi rolling hub OR add post-July-2026 fold-up plan |
| blue-lock-tokyo-skytree-cafe-2026 | REJECT | Q3, Q5 | — | Restructure as Blue Lock experiences rolling hub; add Skytree/Cafe Honpo/EGOIST citations |
| cosplay-experience-tokyo-2026 | REJECT | Q3, Q4 | — | Add studio + event-rule citations; commission Takapon first-hand session at Studio Crown |
| demon-slayer-pilgrimage-tokyo | REJECT | Q3 | R2 | Fix silo (destinations→anime-pilgrimage); fix external image URL at line 98; add shrine/park citations |

## Patterns observed across batch
- **Pattern 1 — Silo violation is a corpus-wide bug, not an article-level bug.** 4 of 14 articles in this batch use `category: "destinations"` (akihabara-complete, anime-day-trips, demon-slayer-pilgrimage; familymart was different — `cafes` mis-applied). The 5 official silos per CLAUDE.md / seo.md are collab-cafes, experiences, area-guides, anime-pilgrimage, travel-tips — `destinations` is not one of them. Per the prescreen, 8+ articles use `destinations` — strong signal that the silo migration noted in the SEO rules ("post 2026-04-16 restructure") was incomplete. Recommend a separate corpus-wide silo-remap sweep BEFORE continuing per-article rewrites; this would auto-resolve R2 across the corpus.

- **Pattern 2 — Source citation is the corpus-wide weak link.** 8 of 14 articles fail or weakly-pass Q3 (source viability). The articles that PASS Q3 all have explicit inline `[official site](https://...)` links (detective-conan 3-venue cites conan-cafe.jp, apothecary-diaries cites JR Tokai press release with quoted Japanese, animejapan-international-visitors cites GO TOKYO + anime-japan.jp). The articles that fail Q3 use bold text + numbered claims without anchor links. Suggests an editorial gap: the writers (or LLM drafts) include verifiable facts but skip the citation step. This is high-leverage to fix because Q3 is binary and a single citation pass per article flips many to PROCEED.

- **Pattern 3 — Event-tied articles without fold-up plans fail Q5.** 3 of 14 articles (apothecary-diaries-oshi-tabi, blue-lock-tokyo-skytree, detective-conan-2026-japan-guide) are tied to events that close inside the 90-day window from eval date. None have documented post-event update paths in frontmatter (e.g., `validUntil` field, planned merge into a hub). Per skill text: "Time-limited event → Will it become anchor for future iterations? Set `validUntil` + plan post-event update path." Adding a `validUntil` field convention to frontmatter would systematize Q5 evaluation. Recommend establishing this as a frontmatter contract for all event-tied articles going forward.

- **Pattern 4 — The "weak" bucket has more save-able content than the prescreen image-floor metric suggests.** 3 of 5 PROCEED verdicts came from the "weak" bucket (anime-hotels-tokyo, akihabara-arcade-rhythm-games, animejapan-comiket). The image-floor miss was the dominant prescreen weakness signal but did not predict Phase 0 outcome. Suggests image-floor uplift can be a tactical fix without rewriting articles — many "weak" articles need 2-3 more images and 5-7 inline citations rather than full rewrites.

- **Pattern 5 — Cannibalization clusters around major events.** Both Conan articles overlap heavily; both AnimeJapan articles overlap. The pattern: an "overview" article and a "specific deep-dive" article were both published. The deep-dive is consistently the stronger sibling (Q3, Q4 both pass). Recommend a corpus-wide R1 sweep where overview/deep-dive pairs exist — keep the deep-dive, noindex the overview, redirect canonical to deep-dive.

## Next D2 batch recommendation
Articles to prioritize next (from prescreen weak/unknown buckets, skipping already-evaluated). Rank ordering reflects (a) inbound link count = highest value when fixed, (b) image-floor gap severity = effort estimate, (c) corpus-wide pattern coverage value.

1. **chiikawa-land-tokyo-complete-2026** (weak, 0 inbound, image floor 3/8) — orphan-receiving + image-poor, but Chiikawa is a high-search IP for 2026. Test the rolling-event-hub rescue pattern.
2. **demon-slayer-rerun-cafe-ufotable-kizuna-2026** (weak, 3 inbound, image floor 5/7) — active spring 2026 collab, Demon Slayer momentum. Useful for testing event-fold-up pattern.
3. **jjk-sweets-paradise-complete-guide-2026** (weak, 1 inbound, image floor 6/10) — JJK is mentioned in `jpn-article-preflight` skill as the example primary keyword. Highest evaluation-template fit.
4. **chainsaw-man-pilgrimage-tokyo** (strong, 2 inbound) — strong-bucket spot-check, validates the prescreen's "strong = auto-pass" assumption.
5. **how-to-book-anime-collab-cafe-japan** (weak, 52 inbound, image floor 5/8) — extremely high inbound count (corpus-anchor candidate); fixing this is high-leverage.
6. **japan-rail-pass-2026-guide** (weak, 27 inbound, image floor 6/10) — travel-tips silo anchor; needs evaluation for a corpus already heavily linked to it.
7. **japan-ic-card-transit-guide** (weak, 35 inbound, image floor 6/9) — same as above for IC card guidance.
8. **kamakura-slam-dunk-pilgrimage-2026** (weak, 0 inbound, image floor 8/13) — orphan + suspected duplicate of `slam-dunk-kamakura-pilgrimage-2026`. Cannibalization sweep test case.
9. **slam-dunk-kamakura-pilgrimage-2026** (weak, 3 inbound, image floor 7/8) — pair with #8 to confirm or resolve duplication.
10. **kyoto-anime-guide-2026** (weak, 0 inbound, image floor 7/10) — Kyoto coverage is weak in corpus per the "Coming Soon" note in body footers. Tests the area-guides silo population.
11. **chiikawa-bakery-harajuku-guide-2026** (strong, 2 inbound) — strong-bucket spot-check #2.
12. **best-anime-tours-tokyo-2026** (weak, 2 inbound, image floor 4/12) — biggest image-floor gap; tests whether image-uplift alone can flip a verdict.
13. **first-timers-japan-playbook-anime-fans-2026** (weak, 1 inbound, image floor 4/7) — playbook content; if it cannibalizes japan-trip-checklist, that's a corpus-anchor cannibalization.
14. **japan-trip-checklist-anime-fans-2026** (weak, 6 inbound, image floor 4/12) — pair with #13.
15. **detective-conan-pilgrimage-events-2026** (weak, 2 inbound, image floor 5/7) — third Detective Conan article; complete the cannibalization triangle started in this batch.

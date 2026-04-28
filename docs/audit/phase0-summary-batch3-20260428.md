# Phase 0 Detailed Evaluation Summary — Batch 3 — 2026-04-28
Batch: D2 batch 3 of v3 adoption (14 articles, slugs how-to-book → kamakura-slam-dunk)

## Distribution
| Verdict | Count | Slugs |
| --- | ---: | --- |
| PROCEED | 6 | how-to-book-anime-collab-cafe-japan, japan-esim-pocket-wifi-sim-card, japan-ic-card-transit-guide, japan-proxy-shopping-2026, japan-travel-insurance-2026, kamakura-slam-dunk-pilgrimage-2026 |
| REJECT — rewrite-recoverable | 8 | japan-luggage-forwarding-2026, japan-rail-pass-2026-guide, japan-trip-checklist-anime-fans-2026, jjk-sweets-paradise-complete-guide-2026, jojo-stone-ocean-cafe-jojo-world-2026, jr-pass-anime-pilgrimage-routes-2026, jujutsu-kaisen-cafes-japan-2026-guide, jujutsu-kaisen-shibuya-locations-2026 |
| REJECT — not-rewrite-recoverable | 0 | (none) |

Total: 6 PROCEED / 8 REJECT-rewrite-recoverable / 0 REJECT-not-recoverable / 14 articles.

## Per-article one-line summary
| Slug | Verdict | Failed Q | Rejected R | Recommendation |
| --- | --- | --- | --- | --- |
| how-to-book-anime-collab-cafe-japan | PROCEED | — | — | Add platform deep-links to BOX cafe&space / Animate Cafe / etc.; uplift image floor 5→9 with on-day photos |
| japan-esim-pocket-wifi-sim-card | PROCEED | — | — | Verify line 135 `body5.jpg` license (only non-Wikimedia body image); quarterly refresh on provider price tables |
| japan-ic-card-transit-guide | PROCEED | — | — | Replace hero (flagged as flat-color schematic failing real-photo axis); add JR East English Mobile Suica deep-link |
| japan-luggage-forwarding-2026 | REJECT | Q3 | — | Add 4-5 inline citations (Yamato global English, Sagawa English, JAL ABC service page); verify line 195 `4.jpg` license |
| japan-proxy-shopping-2026 | PROCEED | — | — | Refresh real-purchase examples to 2026-current prices; clarify affiliate vs direct link disclosure |
| japan-rail-pass-2026-guide | REJECT | — | R1 | R1 dominant in JR Pass triangle (vs `japan-rail-pass-guide-anime-fans` + `jr-pass-anime-pilgrimage-routes-2026`); KEEP this as canonical, noindex/refocus the two siblings |
| japan-travel-insurance-2026 | PROCEED | — | — | Disclose affiliate-vs-direct status on World Nomads / SafetyWing / Allianz / AIG links; quarterly price re-quote |
| japan-trip-checklist-anime-fans-2026 | REJECT | Q3 | R1 | R1 vs `first-timers-japan-playbook-anime-fans-2026` (canonicalize to here); add 5-7 citations (anime-japan.jp, comiket.co.jp, ghibli-jp); verify featuredImage JNTO license |
| jjk-sweets-paradise-complete-guide-2026 | REJECT | Q5 | R1 | R1 vs `jujutsu-kaisen-cafes-japan-2026-guide` (canonicalize to here, NOT to sibling); add `validUntil` 2026-04-29 + post-event fold-up plan (rolling JJK collab hub) |
| jojo-stone-ocean-cafe-jojo-world-2026 | REJECT | Q5 | — | Add `validUntil` 2026-06-15 + restructure as "JoJo World Harajuku — every arc collab" rolling hub (3-4 collabs/year per article line 56) |
| jr-pass-anime-pilgrimage-routes-2026 | REJECT | Q3 | R1, R2 | R1 in JR Pass triangle (noindex + canonical→japan-rail-pass-2026-guide OR refocus to anime-only routes); R2 fix category destinations→experiences; restore corrupted line 82 paragraph; add 5+ citations |
| jujutsu-kaisen-cafes-japan-2026-guide | REJECT | Q4, Q5 | R1 | R1 vs `jjk-sweets-paradise-complete-guide-2026` (this is WEAKER sibling — noindex + canonical→sibling, no rewrite needed) |
| jujutsu-kaisen-shibuya-locations-2026 | REJECT | Q3 | — | Add 5-7 external citations (jujutsukaisen.jp episode references, MAPPA / Sunghoo Park source, Walnut Cafe / Ichiran / Omotesando Koffee URLs); featuredImage credit missing in frontmatter |
| kamakura-slam-dunk-pilgrimage-2026 | PROCEED | — | — | Add Enoden official English deep-link; consider TouristAttraction schema; image strict 4-axis exemplar — use as corpus reference |

## Patterns observed across batch
- **Pattern 1 — JR Pass triangle is the structural cannibalization risk of this batch.** Three articles overlap heavily on JR Pass content: `japan-rail-pass-2026-guide` (canonical math/calculator, 27 inbound), `japan-rail-pass-guide-anime-fans` (anime-overview), `jr-pass-anime-pilgrimage-routes-2026` (route-driven). All three duplicate the buying flow + JR Exchange office list + pricing table. The 2026-guide is the strongest sibling and should be retained; the other two should be either noindex+canonical or refocused to non-overlapping angles. This is the same R1 cluster pattern flagged in batch 1 (Detective Conan + AnimeJapan); now confirmed as a corpus-wide tendency for "overview + deep-dive" sibling pairs.

- **Pattern 2 — Active-event articles fail Q5 without `validUntil` + fold-up plan.** Three articles in this batch are tied to events ending inside the 90-day window: jjk-sweets-paradise (4/29 end), jujutsu-kaisen-cafes-japan-guide (4/29 end), jojo-stone-ocean-cafe (mid-June end). NONE have `validUntil` frontmatter. The skill explicitly mandates "Time-limited event → Will it become anchor for future iterations? Set `validUntil` + plan post-event update path." Three patterns to consider: (a) per-event articles with documented fold-up plans, (b) per-IP rolling hubs ("JoJo World Harajuku — every arc collab"), (c) per-chain rolling hubs ("JJK x Sweets Paradise — every collab"). The frontmatter `validUntil` field convention from batch 1 recommendation should be enforced corpus-wide.

- **Pattern 3 — Source citation density correlates with Q3 pass.** 5 articles fail or weakly-pass Q3 (luggage-forwarding, trip-checklist, jr-pass-anime-pilgrimage-routes, jujutsu-kaisen-shibuya-locations, plus weak-pass on japan-rail-pass-2026-guide). The articles that strongly pass Q3 (japan-ic-card-transit-guide, japan-esim, jjk-sweets-paradise-complete-guide-2026) all use inline `[official site](https://...)` anchor links. The articles that fail Q3 list providers/sources by name without anchors. Repeating the batch-1 pattern: this is fixable in a single citation pass per article.

- **Pattern 4 — The "weak" bucket is more save-able than image-floor metric suggests.** 3 of 6 PROCEED verdicts came from the prescreen "weak" bucket (how-to-book-anime-collab-cafe-japan with 52 inbound, japan-ic-card-transit-guide with 35 inbound, japan-rail-pass-2026-guide effectively with 27 inbound — although the last got R1 rejected, it's still the canonical sibling). Inbound link count is a stronger Phase 0 predictor than image-floor gap.

- **Pattern 5 — Travel-tips silo is corpus-anchor territory.** 6 of the 14 articles in this batch are travel-tips (esim, ic-card, luggage, proxy, rail-pass, insurance). 5 of those 6 PROCEED; the only REJECT (luggage-forwarding) is recoverable via a single citation pass. Travel-tips silo is structurally well-positioned and should be the lowest-effort area to clear corpus-wide. The silo migration (`travel-tips → experiences` per 2026-04-19 categories.ts comment) appears to have completed cleanly for this batch (all 6 use `experiences`).

- **Pattern 6 — JJK has THREE-article overlap, not two.** This batch evaluated `jjk-sweets-paradise-complete-guide-2026` and `jujutsu-kaisen-cafes-japan-2026-guide` as a pair; but `jujutsu-kaisen-shibuya-locations-2026` is a third JJK article (different intent — pilgrimage not cafe — so no R1 on that axis). The pair has clear winner (complete-guide-2026 stronger). Recommend the corpus-wide R1 sweep (recommended in batch 1 summary) explicitly handle multi-article IP clusters: typically a "complete guide" > "comparison overview" > "specific deep-dive" — keep the deep-dive AND the strongest comparison-or-complete; canonicalize the rest.

- **Pattern 7 — Image strict 4-axis compliance is uneven.** kamakura-slam-dunk-pilgrimage-2026 is the exemplar (explicit "Wikimedia Commons sources verified for license and high-resolution origin (≥1600px longest side); WebP q88 method=6 with EXIF transpose applied" — line 303). Other articles vary: some have hero/body license inconsistencies (japan-ic-card hero flagged as schematic, japan-trip-checklist featuredImage uses ambiguous "© JNTO" credit, jr-pass-anime-pilgrimage-routes featuredImage no credit, japan-luggage line 195 `4.jpg` non-Wikimedia naming, japan-esim line 135 `body5.jpg` non-Wikimedia naming, jujutsu-kaisen-shibuya-locations featuredImage no frontmatter credit). Recommend a focused image-license audit pass across the corpus using kamakura-slam-dunk as the floor template.

## Cumulative D2 progress so far
- Batch 1 + 2 + 3 = 42 articles evaluated (14 + 14 + 14).
- Cumulative PROCEED count: 5 + 7 (assumed batch 2 = 7 to fit) + 6 = ~18 (estimate; actual batch 2 count not retrieved).
- Cumulative REJECT-rewrite-recoverable: 9 + 7 + 8 = ~24.
- Cumulative REJECT-not-recoverable: 0.
- Approximately 35-38 articles remain in the corpus (77 total - 42 evaluated = 35).

## Next D2 batch recommendation
Articles to prioritize next from the remaining slugs:

1. **japan-rail-pass-guide-anime-fans** — third leg of JR Pass triangle. Need to evaluate to confirm noindex+canonical recommendation.
2. **first-timers-japan-playbook-anime-fans-2026** — sibling to japan-trip-checklist; needed to confirm cannibalization R1 direction.
3. **slam-dunk-kamakura-pilgrimage-2026** — already noindex'd + canonical to kamakura-slam-dunk-pilgrimage-2026; sanity-check the canonical resolution.
4. **lawson-ticket-anime-cafe-booking** — child of how-to-book-anime-collab-cafe-japan; verify hierarchy distinct.
5. **animate-cafe-guide-japan** — child of how-to-book-anime-collab-cafe-japan; verify hierarchy distinct.
6. **tokyo-anime-collab-cafes-spring-2026** — referenced from many of the batch 3 articles as the "current rolling hub" — needs evaluation as the corpus's primary rolling-hub exemplar.
7. **anime-merch-shopping-guide-japan** — sibling to japan-proxy-shopping-2026; verify distinct intent (in-Japan vs international shopping).
8. **gachapon-guide-japan** — referenced from japan-proxy-shopping; verify niche fit.
9. **chiikawa-bakery-harajuku-guide-2026** + **chiikawa-land-tokyo-complete-2026** — Chiikawa pair; cannibalization candidate.
10. **demon-slayer-rerun-cafe-ufotable-kizuna-2026** + **demon-slayer-rerun-cafe-ufotable-2026** — Demon Slayer cafe pair; obvious R1 candidate.
11. **detective-conan-pilgrimage-events-2026** — third Conan article; complete the cannibalization triangle started in batch 1.
12. **golden-week-2026-anime-events-complete-guide** — Golden Week (April 29 - May 5) is starting tomorrow as of evaluation date; high time-pressure article to verify Q5 fold-up plan.
13. **gaming-tokyo-2026** — Pokemon-mention article referenced in batch 1; Q3 test for gaming-specific sourcing.
14. **best-anime-tours-tokyo-2026** — biggest image-floor gap from prescreen (4/12); test whether image uplift alone flips verdict.
</content>

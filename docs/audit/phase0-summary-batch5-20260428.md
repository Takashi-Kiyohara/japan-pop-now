# Phase 0 Detailed Evaluation Summary — Batch 5 — 2026-04-28
Batch: D2 batch 5 (last batch of v3 adoption — 9 articles)
Evaluator: Claude Opus (1M context)

## Distribution
| Verdict | Count | Slugs |
| --- | ---: | --- |
| PROCEED | 8 | shibuya-harajuku-pop-culture-guide, ship-anime-figures-merch-home-japan, slam-dunk-kamakura-pilgrimage-2026 (canonical-resolved), tokyo-anime-collab-cafes-spring-2026, tokyo-anime-collab-cafes-summer-2026, tokyo-anime-district-guide, wonder-festival-figure-events-japan-2026, your-name-pilgrimage-tokyo |
| REJECT — rewrite-recoverable | 1 | spy-family-tokyo-fan-day-2026 |
| REJECT — not-rewrite-recoverable | 0 | (none) |

Total: 8 PROCEED / 1 REJECT-rewrite-recoverable / 0 REJECT-not-recoverable / 9 articles.

## Per-article one-line summary
| Slug | Verdict | Failed Q | Rejected R | Recommendation |
| --- | --- | --- | --- | --- |
| shibuya-harajuku-pop-culture-guide | PROCEED | (Q3 weak) | — | Add nintendo-tokyo.jp / pokemoncenter / kiddyland citations; uplift image floor 2→6; deduplicate footer link clusters |
| ship-anime-figures-merch-home-japan | PROCEED | (Q3 weak) | — | Verify body3.jpg/body4.jpg exist; add 5+ official-source citations (Japan Post, Buyee, ZenMarket, Yamato); add `lastVerifiedRates` frontmatter for quarterly-drift section |
| slam-dunk-kamakura-pilgrimage-2026 | PROCEED (canonical-resolved) | (Q3 weak) | R1 (resolved by noindex+canonical) | Fix mojibake (description, body em-dashes, JP characters); add Kamakura-City + enoden.co.jp citations; consider deprecating .md in favor of canonical .mdx sibling |
| spy-family-tokyo-fan-day-2026 | REJECT | Q3, Q5 | — | Restructure as rolling event tracker OR fold into broader Tokyo-anime-event-tracker; cite spyfamily-pj.com + venue official sources |
| tokyo-anime-collab-cafes-spring-2026 | PROCEED | — | — | Migrate 4 wp-content/uploads/ images to repo-local /images/articles/; fix alt-text/caption mismatch at line 20; add `validUntil: 2026-05-31`; H2-formatted-link cleanup at line 316 |
| tokyo-anime-collab-cafes-summer-2026 | PROCEED | (Q3 weak, Q5 weak) | — | Add 4-5 per-cafe URL citations (Maid-sama!/Ouran/AMNESIA/Magical Promise); fix mojibake; verify image at line 218; add `validUntil: 2026-08-31` + fall-2026 fold-up plan |
| tokyo-anime-district-guide | PROCEED | (Q3 weak) | — | Add mandarake/animate/parco citations; deduplicate triple-Osaka-link footer at lines 209-211; expand "Beyond the Big Five" section with table format |
| wonder-festival-figure-events-japan-2026 | PROCEED | (Q3 weak) | — | Add wonderfestival.jp + l-tike.com WonFes campaign + Yokoyama Exhibition citations; cross-link to ship-anime-figures-merch-home-japan; add `validUntil: 2026-07-31` |
| your-name-pilgrimage-tokyo | PROCEED | (Q3 weak) | — (R3 caveat) | **Critical**: replace Trigun-cafe topic-axis-fail body image at line 39; fix mis-wired internal links in footer (JJK→demon-slayer, Chainsaw→weathering, Kyoto→Osaka); add suga-jinja/nact.jp citations |

## Patterns observed across batch

- **Pattern A — The cafes silo and pilgrimage sub-silo are the corpus's strongest content.** 8 of 9 articles in this batch PROCEED, the highest hit rate of any batch run so far. The two collab-cafes-spring/summer-2026 articles plus the tokyo-anime-district-guide hub are exemplar templates: per-venue inline citations, weekly update cadence, hub-and-spoke linking. The single REJECT (spy-family-tokyo-fan-day-2026) fails not on intent or differentiation but on the structural mismatch between an evergreen-frame article and time-limited event content — the same Q5 pattern flagged in batch 1's blue-lock-tokyo-skytree-cafe and apothecary-diaries-oshi-tabi.

- **Pattern B — Q3 weak-pass dominates the batch.** 8 of 9 articles weakly-pass Q3 — facts are accurate, but inline anchor links to official sources are sparse. The two strong-Q3 exemplars (tokyo-anime-collab-cafes-spring-2026 with cafe.parco.jp + collabocafe.tokyo + animatecafe.jp + my-charaful + jujutsu_plaza X handle) demonstrate the achievable bar. The other 7 PROCEED articles each need a 5-10 inline-citation pass to flip from weak-pass to strong-pass. This is the same Pattern 2 noted in batch 1 (8 of 14 articles fail/weak-pass Q3); the corpus-wide pattern is consistent.

- **Pattern C — Image-source legacy bleed: wp-content/uploads/ paths are still in active articles.** Three articles in this batch still reference WordPress-CDN-hosted body images: tokyo-anime-collab-cafes-spring-2026 (4 instances), your-name-pilgrimage-tokyo (1 instance, also a topic-axis fail with Trigun cafe photo on a Your Name article). Per the strict 4-axis universal rule, repo-local storage is required for resolution + topic axes to pass. The migration from WP to Next.js was incomplete — recommend a corpus-wide grep for `wp-content/uploads` and a body-image migration sweep before the next strict-mode pass.

- **Pattern D — Mojibake corruption affects multiple articles in the same import generation.** slam-dunk-kamakura-pilgrimage-2026 (em-dashes, Japanese characters) and tokyo-anime-collab-cafes-summer-2026 (em-dashes) both show "â" character-encoding artifacts. Same import job, same charset bug. Recommend a `grep -l 'â' content/articles/*.md` sweep + UTF-8 re-encoding pass corpus-wide. This blocks the 4-axis-image rule from passing because mojibake'd alt-text breaks both the SEO image-rule and the content-quality-rule.

- **Pattern E — Cannibalization handled correctly via canonical+noindex when present.** slam-dunk-kamakura-pilgrimage-2026 (.md, this audit) has explicit `robots: noindex,follow` + `canonical: kamakura-slam-dunk-pilgrimage-2026.mdx` in frontmatter — R1 is real but resolved by SEO signals, allowing both files to coexist. This is the correct pattern for legacy-source-file deprecation (vs the unhandled cannibalization seen in batch 1 with detective-conan and animejapan articles). Recommend documenting this canonical-redirect pattern in the rewrite playbook as the standard handoff for migrating legacy .md to current .mdx.

- **Pattern F — Image-topic axis fails are subtle but real.** your-name-pilgrimage-tokyo embeds a Trigun cafe photo as a Your-Name-article body image (line 39). Not source-banned (it's the site's own legacy CDN), but topically wrong. The image strict 4-axis universal rule treats topic-mismatch as a fail. spy-family-tokyo-fan-day-2026 also flagged a topic-axis weak-pass via documented `imageNote` (proxy host venues stand-in for collab-specific photography). Recommend a corpus-wide image-topic audit using a vision-model pass on every body image vs the article's primary subject keyword — currently this can only be detected by manual reading.

- **Pattern G — Footer-link-block duplication is a content-bloat pattern across multiple articles.** tokyo-anime-district-guide has the same Osaka-anime-guide-den-den-town link 3x in immediate sequence (lines 209-211). shibuya-harajuku-pop-culture-guide has duplicate "Tokyo Anime District Guide" link clusters at lines 184 and 191. your-name-pilgrimage-tokyo has overlapping "More Pilgrimages" / "More Anime Pilgrimages" / "Related Guides" sections. Suggests automated link-injection during the WP-to-MD migration didn't deduplicate. Recommend a corpus-wide footer-link-block deduplication pass.

## Next steps
- This was the LAST batch of D2 v3 adoption per mission framing. Aggregate summary across batches 1-5 should be written by main session (this batch's per-article one-liners feed into phase0-summary-final-20260428.md).
- High-leverage corpus-wide fixes implied by this batch:
  1. Inline-citation pass on all 8 weak-Q3 PROCEED articles → flip to strong-Q3.
  2. wp-content/uploads/ image migration sweep → corpus-wide.
  3. Mojibake UTF-8 re-encode sweep → corpus-wide.
  4. Footer-link-block deduplication → corpus-wide.
  5. Topic-axis image audit (vision-model pass) → flag mismatched body images for replacement.
  6. spy-family-tokyo-fan-day-2026 rewrite (only REJECT) → either rolling-tracker OR fold-up.

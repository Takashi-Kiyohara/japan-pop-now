# Phase 0 Detailed Evaluation Summary — Batch 2 — 2026-04-28
Batch: D2 batch 2 (14 articles from "weak" bucket of D1 prescreen)

## Distribution
| Verdict | Count | Slugs |
| --- | ---: | --- |
| PROCEED | 3 | chiikawa-land-tokyo-complete-2026, game-centers-arcades-japan, ghibli-park-complete-guide-2026 *(weakly: ghibli passes Q3 borderline if Q3 = anchor link presence; here listed as REJECT — see below)* |
| PROCEED (clean) | 2 | chiikawa-land-tokyo-complete-2026, game-centers-arcades-japan |
| REJECT — rewrite-recoverable | 12 | anime-merch-shopping-guide-japan, best-anime-tours-tokyo-2026, book-japan-anime-events-overseas-2026, dark-moon-chara-cafe-ikebukuro-2026, demon-slayer-rerun-cafe-ufotable-2026, demon-slayer-rerun-cafe-ufotable-kizuna-2026, detective-conan-pilgrimage-events-2026, first-timers-japan-playbook-anime-fans-2026, gachapon-guide-japan, gaming-tokyo-2026, ghibli-park-complete-guide-2026, golden-week-2026-anime-events-complete-guide |
| REJECT — not-rewrite-recoverable | 0 | (none) |

Total: 2 PROCEED-clean / 12 REJECT-rewrite-recoverable / 0 REJECT-not-recoverable / 14 articles.

## Per-article one-line summary
| Slug | Verdict | Failed Q | Triggered R | Recommendation |
| --- | --- | --- | --- | --- |
| anime-merch-shopping-guide-japan | REJECT | Q3 | R3 | Replace external WP-uploads URLs (lines 22, 216) + Chainsaw Man key visual; add 5-7 official-site citations |
| best-anime-tours-tokyo-2026 | REJECT | Q3, Q5 | — | Add Klook/Viator/GYG product-page citations; add quarterly refresh frontmatter |
| book-japan-anime-events-overseas-2026 | REJECT | Q3 | — | Fix broken `[ShingoTravel](#)` anchor (line 117); add JTA stat citation; add platform docs links |
| chiikawa-land-tokyo-complete-2026 | PROCEED | — | — | Strongest of batch. Same-IP-proxy image template should be replicated across corpus |
| dark-moon-chara-cafe-ikebukuro-2026 | REJECT | Q5 | — | Add `validUntil: "2026-05-06"`; restructure as K-pop/Webtoon collab tracker |
| demon-slayer-rerun-cafe-ufotable-2026 | REJECT | Q5 | R1 | Cannibalization with kizuna sister; redirect/noindex this slug (kizuna is canonical) |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | REJECT | Q5 | R1 | Keep as canonical of pair; add `validUntil`; restructure as ufotable-Demon-Slayer rolling tracker |
| detective-conan-pilgrimage-events-2026 | REJECT | Q3, Q5 | — | Add 30th-anniv tour + USJ + Sunshine City citations; split evergreen-pilgrimage from time-bound events |
| first-timers-japan-playbook-anime-fans-2026 | REJECT | Q3 | R1 | Cannibalization vs `japan-trip-checklist-anime-fans-2026`; merge or split topics; add JR Pass / eSIM citations |
| gachapon-guide-japan | REJECT | Q3 | — | Add Bandai Gashapon / Toy Industry Association / shop-official citations (5-7 inserts) |
| game-centers-arcades-japan | PROCEED | (Q3 weak) | — | Strong myth-busting differentiation. Add anchor-linked official sources; uplift image floor 2→4-5 |
| gaming-tokyo-2026 | REJECT | Q3, Q4 | — | Add anchor-linked store-official citations; needs structural differentiation angle (comparative ranking or insider mechanic) |
| ghibli-park-complete-guide-2026 | REJECT | Q3 | — | Pure citation-formatting fix: convert text-only URLs to anchor links (~6-8 inserts). Otherwise top-tier article |
| golden-week-2026-anime-events-complete-guide | REJECT | Q5 | — | Add `validUntil: "2026-05-05"`; restructure as rolling annual GW hub for 2027 reuse |

## Patterns observed across batch 2

- **Pattern 1 — Q3 citation discipline is the dominant failure mode (10 of 14 articles).** Of the 12 REJECTs, 10 fail Q3. The pattern matches batch 1 exactly: writers (or LLM drafts) produce articles with verifiable facts but skip the inline anchor-link step. This is a single-pass editorial fix per article. Several articles (ghibli-park, gachapon, game-centers) are otherwise PROCEED-quality and are blocked only by anchor-formatting. **Recommendation**: a corpus-wide "convert bare URLs and named-source mentions into `[text](URL)` anchors" sweep would flip ~6-7 articles from REJECT to PROCEED with no rewriting needed.

- **Pattern 2 — Event-tied articles without fold-up plans fail Q5 (5 of 14).** dark-moon (May 6 end), both demon-slayer ufotable articles (May 6 end), detective-conan-pilgrimage-events (June-Aug ends), golden-week (May 5 end). None have `validUntil` frontmatter or documented post-event paths. This is the same Pattern 3 from batch 1 amplified — the corpus has a chronic event-architecture gap. **Recommendation**: add `validUntil` and `postEventPlan` as frontmatter contract requirements for any article tied to an event date. Establish rolling-annual-hub patterns for predictable seasonal events (Golden Week 2026 → Golden Week 2027 → ...).

- **Pattern 3 — Cannibalization clusters around the same corpus anti-pattern as batch 1 (2 explicit pairs in batch 2).** The Demon Slayer ufotable pair (`-2026.mdx` and `-kizuna-2026.mdx`) is a near-100% topic-overlap duplicate — same dates, same prices, same lottery cadence, same alarm strategy, same Tokushima fallback. The first-timers-playbook + japan-trip-checklist pair is a likely soft-overlap (would need batch 3 to confirm). Combined with batch 1's Detective Conan and AnimeJapan pairs, the corpus has ≥4 known cannibalization clusters. **Recommendation**: a corpus-wide R1 sweep using the prescreen tool BEFORE continuing per-article rewrites would auto-resolve a meaningful chunk of REJECTs.

- **Pattern 4 — Image-source compliance is mostly strong (1 of 14 fails R3).** Only `anime-merch-shopping-guide-japan` triggers R3, due to external WP-uploads URLs and a Chainsaw Man key visual. The other 13 articles have either clean local hero images or properly-attributed Wikimedia Commons body images with explicit licenses. The corpus's image discipline (visible especially in chiikawa-land, dark-moon, demon-slayer-kizuna, ghibli-park, gachapon) demonstrates the project memory's "Wikimedia Commons → 公式 X → 公式 web press" priority is being followed. The `imageNote` frontmatter field used by chiikawa-land and dark-moon is exemplary and should be standardized.

- **Pattern 5 — The "weak" prescreen bucket continues to underestimate save-able content.** Of 14 evaluated, 0 are not-rewrite-recoverable. All 12 REJECTs have a clear path to PROCEED via 1-3 fixes (citations, validUntil, anchor formatting, or sister-article redirect). The image-floor metric used by the prescreen does not predict Phase 0 outcome — chiikawa-land (PROCEED) had a low image-floor before this batch's evaluation; ghibli-park (REJECT only on Q3 anchor formatting) has 7 image attributions. **Recommendation**: prescreen should use Q3 citation density and Q5 event-validity as primary signals, not image floor alone.

## Blockers (mojibake / external URLs / corrupt frontmatter)
- **Mojibake**: None observed. All 14 articles render Japanese text correctly (e.g., 鬼滅の刃, ちいかわ, 八重洲).
- **External URLs in image src**: 1 article triggers — `anime-merch-shopping-guide-japan.md` has 2 external `https://japan-pop-now.com/wp-content/uploads/...` URLs (lines 22, 216). Also a Chainsaw Man IP key visual. Single article fix.
- **Corrupt frontmatter**: None. All frontmatter parses cleanly. The most architecturally-rich frontmatter (chiikawa-land, dark-moon, demon-slayer-kizuna with `imageNote`, `heroBadge`, `template`, `voice` fields) is in MDX articles; the older `.md` articles (anime-merch, best-anime-tours, book-overseas, gachapon, etc.) have minimal frontmatter — `tags: []`, `relatedSlugs: []` empty, `wpPostId:` legacy field. Not corrupt, but inconsistent with newer template.
- **Other**: `[ShingoTravel](#)` broken-anchor placeholder in book-japan-anime-events-overseas-2026 line 117 — single-line fix. Otherwise clean.

## Cross-batch totals (batch 1 + batch 2)
- Total evaluated: 28 articles
- PROCEED: 7 (5 from batch 1, 2 clean from batch 2)
- REJECT — rewrite-recoverable: 21
- REJECT — not-rewrite-recoverable: 0

## Next batch recommendation (D2 batch 3)
Per Pattern 3 (cannibalization), batch 3 should prioritize the cannibalization-pair completions:
1. `japan-trip-checklist-anime-fans-2026` (pairs with first-timers-playbook from this batch)
2. `chiikawa-bakery-harajuku-guide-2026` (sibling to chiikawa-land — confirm distinct or consolidate)
3. `kamakura-slam-dunk-pilgrimage-2026` + `slam-dunk-kamakura-pilgrimage-2026` (suspected duplicate per batch 1's ranking)
4. `how-to-book-anime-collab-cafe-japan` (52 inbound — corpus anchor)
5. `japan-rail-pass-2026-guide` (27 inbound — corpus anchor)
6. `japan-ic-card-transit-guide` (35 inbound — corpus anchor)
7. `jjk-sweets-paradise-complete-guide-2026` (skill template fit)
8. `chainsaw-man-pilgrimage-tokyo` (strong-bucket spot-check)

Then complete the corpus-wide R1 sweep before more rewrites.

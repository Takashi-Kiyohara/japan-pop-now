# Phase 0 Detailed Eval: best-anime-tours-tokyo-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/best-anime-tours-tokyo-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Tour-platform comparison (Klook vs Viator vs GetYourGuide, lines 41-46), exact USD/JPY pricing for each option, cancellation policy comparison (lines 330-337) — directly trip-actionable. The "Skip the tour if…" decision tree (lines 298-304) is unusually honest content. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "anime tours tokyo" is well-trafficked. Klook/Viator/GYG dominate top-3 search positions but their pages are product-listings, not comparative reviews. This article fills the comparison-shopping gap. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Tour pricing claims ($68 / JPY 10,200 etc) are stated as "as of April 2026" but have no inline citations to Klook/Viator product pages. The "Arigato Travel" recommendation (line 161) is unsourced. Tour-operator names (Kenji, Yuki, Maria, Hiroshi, Sakura, Keisuke) are presented as if first-hand but unverifiable — a reviewer could not check these. Per skill Q3 strictness: fails. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) explicit platform-vs-platform pricing comparison with cancellation windows (lines 41-46), (b) 6 categorized tour types tested across 3 platforms ($185k JPY claimed spend, line 24), (c) "skip the tour" anti-recommendations are absent from competitor pages that exist to sell tours. Differentiation is structural. |
| Q5 | Sustainability (will have value 90 days from now) | NO | Tour prices change monthly, operator names change, platform discount codes (KLOOK15, line 315) expire. The "as of April 2026" hedging is right but the article structure has no quarterly refresh cadence baked in. Without a documented refresh path, in 90 days the specific price points and operators will be stale. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No direct competitor in corpus. `how-to-book-anime-collab-cafe-japan` is reservation-flow, `book-japan-anime-events-overseas-2026` is event-booking, neither overlaps with tour comparison. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 6). Valid. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images use `/images/articles/best-anime-tours-tokyo-2026/body-wikimedia-{n}.webp` format with explicit Wikimedia Commons attribution (lines 60, 187, 284) — public domain or CC-BY 4.0 / 2.0. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | First-person "I've taken this tour twice" (line 73), specific guide names, specific shop encounters (Mandarake building, line 75) suggest first-hand experience. Could be embellished but path is at minimum claimed. |

## Verdict
REJECT (0) — Q3 + Q5 fail

## Recommendation
- REJECT, but rewrite-recoverable. Two fixes:
  1. **Q3 fix**: Add inline citations to actual Klook/Viator/GYG product pages for at least the 6 tours described. Pricing claims need a "verified [date], at [URL]" footer pattern. The Arigato Travel reference (line 161) needs an arigatotravel.com link or removal. Tokyo Cosplay Studio (line 281) is OK because tokyocosplaystudio.jp is linked.
  2. **Q5 fix**: Add a `validUntil` or `refreshCadence: quarterly` frontmatter field, OR restructure as a comparison-framework article (the framework lasts; the prices don't) where prices live in a separate dynamically-updateable JSON/MDX block.
- After fixes, re-run Phase 0 — should flip to PROCEED.
- Note: image floor appears OK (3 Wikimedia + presumed body3.jpg). The platform-comparison angle is genuinely strong differentiation; this is salvageable content with editorial work, not a structural rewrite.

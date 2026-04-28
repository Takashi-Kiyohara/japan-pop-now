# Phase 0 Detailed Eval: demon-slayer-rerun-cafe-ufotable-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/demon-slayer-rerun-cafe-ufotable-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Active collab through May 6, 2026 (line 30). 7-venue table with addresses + reservation rules (line 122-128), Thursday 6 PM lottery walk-through (line 154-156), exact Seibu Shinjuku Line transit instructions from Shinjuku to Nogata (line 134) — every section is trip-actionable for the next 8 days plus likely Phase 2 extensions. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | Demon Slayer = top global anime IP. The "ufotable cafe" + "Demon Slayer rerun" search combo has clear demand from EN-speaking fans. EN competitors typically cover the cafe's existence but not the LivePocket lottery mechanics (Step 1/2 weekly cadence at lines 154-167). This is the booking-system gap. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Inline citations: ufotable.co.jp/cafe/collaboration/kimetu/ (line 63), collabo-cafe.com event listing (line 63). Two official cross-checks for Phase 1 dates and merch lineup. Pricing (1,200/1,400/650 yen) is falsifiable against the cited sources. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the alarm-set-for-5:55-PM-Thursday booking strategy (line 168), (b) the merch-only 30-min-after-cafe-session admission window (line 188), (c) the comparative table vs generic pop-ups vs Animate Cafe (lines 196-204). The Tokushima-walk-in fallback (lines 116, 175) is a real route most EN guides don't surface. |
| Q5 | Sustainability (will have value 90 days from now) | NO | Phase 1 ends May 6, 2026 (8 days from eval). Phase 2 is "expected" (line 238) but unconfirmed. The article hedges with "additional cafe phases will likely continue through 2026" — but no `validUntil`, no defined fold-up. Will be stranded after May 6 unless the rebroadcast triggers a confirmed Phase 2 article-update. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | A nearly-identical sibling article exists: `demon-slayer-rerun-cafe-ufotable-kizuna-2026.mdx` (this batch, separate eval). Same event window (March 31 - May 6, 2026), same 7 venues (one calls 5 cities, one 7 venues but venues overlap), same lottery flow, same Thursday 6 PM mechanic, same prices. Frontmatter title here: "Demon Slayer Rerun Cafe ufotable 2026: Menu & Booking" (line 2). Sister article: "Demon Slayer Cafe Tokyo 2026: Kizuna ufotable Guide". Topic overlap is >90%. **Clear R1 trigger.** |
| R2 | Silo violation (not in 5 silos) | NO | `category: "cafes"` (line 9). Valid. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero (line 27): Nogata Station Wikimedia Commons CC0. Body images (lines 80, 170): Wikimedia Commons CC BY-SA 4.0 / CC BY 3.0 — all attributed. No IP key visuals reproduced. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I visited the Tokyo location last week" (line 30) — first-hand visit claimed within the active collab window. Specific menu observation about the charcoal-grilled chicken bowl. Path viable. |

## Verdict
REJECT (0) — R1 cannibalization + Q5 fail

## Recommendation
- REJECT — and this is a corpus-architecture fix, not a per-article rewrite.
- The two near-identical Demon Slayer ufotable articles must be consolidated. Recommendation: **keep `demon-slayer-rerun-cafe-ufotable-kizuna-2026.mdx`** as canonical (it has better frontmatter discipline, the Kizuna theme name in the title, and the FAQ/structure is slightly tighter), and **noindex/redirect this slug** to it. Both currently rank for the same primary keywords and will cannibalize each other in GSC.
- Independent Q5 fix needed for the surviving article: define `validUntil: "2026-05-06"` and a Phase 2 fold-up plan tied to the rebroadcast schedule.
- Cross-reference: this is the same R1 pattern observed in batch 1 (Detective Conan overview vs deep-dive). The corpus has a recurring "two articles for one event" anti-pattern that needs a corpus-wide cannibalization sweep.

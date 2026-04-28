# Phase 0 Detailed Eval: demon-slayer-rerun-cafe-ufotable-kizuna-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Active March 31 - May 6 collab (line 34). 5-venue table with addresses + reservation rules (lines 70-76), Thursday 6 PM weekly lottery walk-through (line 130-138), Lawson Ticket fallback (line 140), Seibu Shinjuku Line transit instructions (line 82). All trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | Same as the sister article — Demon Slayer global IP, ufotable cafe + Kizuna 2026 keywords have clear search demand and minimal-quality EN coverage of LivePocket booking mechanics. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Inline citations: ufotable.co.jp/cafe/collaboration/kimetu/ (line 61), collabo-cafe.com Kimetsu Rerun listing (line 61, 215). Image Credits section explicitly cross-checks venue facts against both official sources. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Differentiation hits: (a) the booking-strategy alarm pattern (line 146), (b) Tokushima walk-in fallback explicitly framed (line 174), (c) the "Why Japanese People Love This" section (lines 148-152) explaining the 40.4 billion yen Mugen Train cultural context. EN competitors miss the cultural framing. |
| Q5 | Sustainability (will have value 90 days from now) | NO | Same Q5 weakness as sister article. Phase 1 ends May 6, 2026 (8 days). The text hedges with "follow-up ufotable cafe phases are likely but unannounced as of April 2026" (line 181) — but no `validUntil` field, no architectural fold-up. Article will be stranded after May 6. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | Sister article `demon-slayer-rerun-cafe-ufotable-2026.mdx` covers the identical event window with overlapping content (same 4 food items, same 8 pair drinks, same lottery cadence, same alarm-at-5:55 booking strategy). Topic overlap is >90%. **Clear R1 trigger.** |
| R2 | Silo violation (not in 5 silos) | NO | `category: "cafes"` (line 9). Valid. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero (line 31): Nogata Station Wikimedia CC0. Body images (lines 80, 109, 154): Shinjuku Kabukicho neon, residential street, Nakano Ward street — illustrative neighborhood context with explicit captions noting "not 2026 collab decor." Frontmatter line 21: "Limited collab visuals available; supplemented with Nogata Station venue context photo. Official Kizuna key art from ufotable.co.jp/cafe is IP-licensed and not reproduced here." Best-practice transparency. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I booked the Tokyo slot last Thursday at exactly 6:01 PM and got in on a Saturday — 4 hours and 2 trains later I was holding a Tanjiro and Nezuko sibling parfait next to a wall covered in production cels" (line 34) — specific, falsifiable first-hand experience. Path viable. |

## Verdict
REJECT (0) — R1 cannibalization + Q5 fail

## Recommendation
- REJECT, BUT this is the **canonical-keep** article in the pair. Recommendation: keep this one, redirect/noindex the sister `demon-slayer-rerun-cafe-ufotable-2026.mdx`. Reasons:
  1. Better frontmatter discipline (`heroBadge`, `imageNote`, explicit IP-licensing note)
  2. The "Kizuna" theme name in the title matches the actual collab branding (themed event name)
  3. Cleaner ResponsiveTable usage (lines 42-53)
  4. Image Credits section + cross-checks against both official sources
- Q5 fix required: add `validUntil: "2026-05-06"` to frontmatter, and either (a) document the Phase 2 fold-up plan in body OR (b) restructure as a rolling "ufotable Cafe Demon Slayer Tracker" that absorbs each Phase as it lands.
- After R1 (sister redirected) + Q5 (fold-up plan added) — flips to PROCEED.
- Cross-batch pattern: this is the second cannibalization-pair flagged in D2 (after Detective Conan in batch 1), confirming a corpus-wide overview-vs-deep-dive anti-pattern. Recommend a dedicated R1 sweep before continuing per-article rewrites.

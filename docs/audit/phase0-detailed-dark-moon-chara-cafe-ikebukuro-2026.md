# Phase 0 Detailed Eval: dark-moon-chara-cafe-ikebukuro-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/dark-moon-chara-cafe-ikebukuro-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Live 12-day collab (April 25 to May 6, 2026), specific Grandscape Ikebukuro 2F venue address (line 32), LivePocket booking flow with no-Japanese-mobile-required note (line 63), Ikebukuro K-pop walk-around (lines 105-113) — everything is actionable for a fan on the ground during the window. Golden Week overlap warning (line 34) is exactly the kind of friction-saving tip Q1 wants. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | DARK MOON is HYBE/Naver Webtoon-driven with explicit ENHYPEN tie-in — high K-pop crossover demand. The 24-episode Troyca anime aired Jan-Mar 2026 (line 53), pushing Japan search to Q1 peak. EN competitors don't exist for this 12-day collab; the article fills a near-zero-coverage niche. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Frontmatter (line 25): "Dates, prices, and the venue floor were cross-checked against the collabo-cafe.com event page, the Jiji Press release from HYBE Japan, and THE Chara CAFE's official Grandscape Ikebukuro listing." Three official cross-checks. LivePocket URL referenced (livepocket.jp). Dates falsifiable against the cited sources. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) ENHYPEN-member-to-clan-leader mapping context (line 53) that requires both K-pop and webtoon knowledge, (b) random-bromide draw math (line 83: "Two drinks plus two food items across two visits stacks four draws, roughly 52 percent chance of at least one Heli"), (c) explicit walk-around itinerary integration with the K-pop retail cluster (lines 105-113). EN competitors usually don't even cover this collab. |
| Q5 | Sustainability (will have value 90 days from now) | NO | The collab ends May 6, 2026 — 8 days from eval date. After that, the article's primary topic is dead. No `validUntil` field in frontmatter, no documented post-event fold-up plan (no statement like "this becomes part of a Naver Webtoon collab archive after May 6"). Article will be stranded after May 6 unless rescued into a hub. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No other DARK MOON / THE Chara CAFE / Naver Webtoon articles in corpus. Unique. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "cafes"` (line 8). Valid (one of the 5 silos per lib/categories.ts). |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero image is Sunshine City fountain (Wikimedia, line 21). Body image of Grandscape Ikebukuro is "by NickeldimeC, Wikimedia Commons, CC BY-SA 4.0" (line 103). Image note (frontmatter line 22) explicitly states: "Limited DARK MOON collab visuals available; HYBE / Naver Webtoon key art is IP-licensed. Hero is illustrative Ikebukuro neighborhood context only." Compliant — no IP key visual reproduction. Best-practice transparency. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I have waited at Grandscape Ikebukuro during another collab" (line 36) — first-hand venue experience claimed, even if not for this specific collab. Path viable for the author to attend within the 12-day window. |

## Verdict
REJECT (0) — Q5 fail

## Recommendation
- REJECT, but rewrite-recoverable. One fix:
  1. **Q5 fix**: Add `validUntil: "2026-05-06"` and `postEventPlan: "fold into THE Chara CAFE rolling archive / link to next K-pop webtoon collab"` to frontmatter. OR restructure the article as a rolling "K-pop & Webtoon Collab Cafe Tracker" that absorbs DARK MOON as one entry and continues to live past May 6 by adding the next collab.
- After fix, re-run Phase 0 — should flip to PROCEED.
- This is the kind of high-quality but ephemeral content the Phase 0 skill flags. The body work is strong (Q1-Q4 all pass cleanly with sources cited and image-policy compliant) — the architectural fix is just the post-event plan.
- Note: the frontmatter image discipline (`imageNote` field) is an excellent pattern that other articles should adopt.

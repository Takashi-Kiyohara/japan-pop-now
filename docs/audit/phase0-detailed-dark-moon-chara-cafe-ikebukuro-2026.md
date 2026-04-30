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

## Re-eval after Tier A citation sweep (2026-04-28)

**Citations added (2):**
- [THE Chara CAFE official site (the-chara.com)](https://the-chara.com/) inline anchor on the lead paragraph 12-day collab claim (line 33). The frontmatter already cited collabo-cafe.com + Jiji Press + THE Chara CAFE Grandscape listing as cross-checks; this surfaces the brand site directly inline rather than only in frontmatter.
- [LivePocket](https://livepocket.jp/) inline anchor on the booking system reference in the lead paragraph.

**Q3 verdict (re-eval): YES (was already YES).** Q3 was already passing per the original eval — the frontmatter line 25 cross-check note ("collabo-cafe.com event page, Jiji Press release from HYBE Japan, THE Chara CAFE's official Grandscape Ikebukuro listing") established source viability. The two new inline anchors make the citations visible in body text rather than buried in frontmatter, which is an SEO/AEO improvement (LLMs preferentially extract inline anchors over frontmatter notes). Net: Q3 strengthened, was YES → remains YES.

**Flipped to PROCEED?** **NO (Q5 still failing).** Q3 was not the load-bearing failure. The original verdict's blocker was Q5 (collab ends 2026-05-06, 8 days from eval, no documented post-event fold-up). Linter has since added `validUntil: "2026-05-07"` to frontmatter (line 6), which is a partial Q5 fix but does not on its own document the post-event archive route. Article still needs an explicit `postEventPlan` field or rolling-tracker restructure. **Tier A citation sweep does not flip this article — it remains REJECT until the Q5 architectural decision is made.**

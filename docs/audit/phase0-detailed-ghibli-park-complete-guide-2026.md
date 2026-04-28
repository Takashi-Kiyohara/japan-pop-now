# Phase 0 Detailed Eval: ghibli-park-complete-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/ghibli-park-complete-guide-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Tiered ticket comparison (lines 42-48), 14:00-JST-on-the-10th release timing (line 59), 3 booking option walkthrough including overseas English booking page (line 63), 5-area prioritization with time estimates (lines 78-106), Tokyo-via-Nagoya transit table (line 119-123), one-day-vs-two-day realism check (lines 138-145), specific hotel comparison (lines 156-161). Every section is trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | Ghibli Park is high-search globally. The "is one day enough" question (line 132-145) is a top-of-funnel search the article addresses honestly. EN competitors typically don't cover the Standard vs Premium pass tradeoff with the same specificity (line 50-52: "the ¥4,000 difference between Standard and Premium buys you access to interiors you can't see otherwise"). |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Despite mentioning the official English booking page at "ghibli-park.jp/en/ticket/" (line 64), the link is text-only not anchor-linked. Pricing claims (¥7,300/¥7,800 etc) lack inline citations. The Klook redirect is concrete. Boo-Woo / Lawson Ticket l-tike.com is mentioned by URL but not anchor-linked. Per Q3 strictness: fails the linked-citation test. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) explicit Standard-vs-Premium tradeoff math with the recommendation logic ("if you flew to Japan… ¥4,000 difference… you didn't fly to Japan to stand outside Satsuki and Mei's house," line 52) — most EN guides just list the prices, (b) one-day-realism honesty ("not comfortably," line 134), (c) hotel proximity comparison with Linimo line specificity (line 156-161). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Ghibli Park is permanent. Ticket release cadence (10th of the month, 14:00 JST) is stable. April 2026 exhibition reference (line 84: "Delicious! Animating Memorable Meals Expanded Edition runs through June 8") is the time-bound element but that's contained to one paragraph. Annual refresh cadence works. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No other Ghibli Park article in corpus. The `book-japan-anime-events-overseas-2026` article mentions Ghibli Park as one of 3 theme parks in a 1-paragraph stub — no overlap. PASS. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 6). Valid per canonical 5 silos. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images all use `body-wikimedia-{1-7}.webp` pattern with explicit "Photo: Kyu3a / Wikimedia Commons, CC BY-SA 4.0" attribution at lines 38, 57, 79, 113, 135, 152, 217. Hero `featured.jpg` is local. Compliant — and the 7 Wikimedia images is excellent image-floor density. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I've visited twice since the Valley of Witches opened in 2024" (line 19) — first-hand visits dated. Specific observations like "the violin-making workshop, the grandfather clock collection, and the ceramic cat figurines" (line 90) require ground-truth visiting. Path strong. |

## Verdict
REJECT (0) — Q3 fail

## Recommendation
- REJECT, but rewrite-recoverable. One fix needed:
  1. **Q3 fix**: Convert text-only URLs to anchor-linked citations — `[official English ticket page](https://ghibli-park.jp/en/ticket/)`, `[Lawson Ticket](https://l-tike.com/)`, link to the specific April 2026 exhibition page on the official site, link to Linimo official transit page, link to Hotel Route Inn Grand Fujigaoka official. Roughly 6-8 anchor-link insertions.
- After Q3 fix — flips to PROCEED. The body work is otherwise very strong.
- Note: this is actually one of the highest-quality articles in the batch — first-hand visits documented, image-floor exceeds expectations (7 Wikimedia attributions), differentiation is structural, Q5 is naturally evergreen. The Q3 gap is purely an editorial discipline issue (links present in text but not formatted as anchors).
- Consider this article a template for the corpus's image discipline — the consistent `body-wikimedia-{n}.webp` filename pattern with paired attribution captions should be the standard.

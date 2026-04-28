# Phase 0 Detailed Eval: anime-merch-shopping-guide-japan
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/anime-merch-shopping-guide-japan.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Tax-free shopping mechanics (line 148, "Most large anime retailers offer tax-free purchases for tourists spending over ¥5,000"), district decision tree (lines 50-54), shipping & customs notes (lines 164-168) — all directly trip-actionable for a visitor. The "Quick decision guide" by goal is the strongest feature. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Anime merch shopping Japan" has clear demand. Top-10 EN competitors (Tokyo Cheapo, Tofugu) cover Akihabara but rarely contrast Mandarake vs Surugaya vs Animate at the budget-tier level. Tax-free + shipping section is a differentiator most don't include. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Zero direct citations to official sources. Specific claims like "$5 billion annually" (line 24), "250+ stores" (line 255), "30-50% lower than international retail" (line 24) are stated without anchor links. Tabelog/TripAdvisor are cited as anti-patterns elsewhere in skill, but here even authoritative sources (Animate.co.jp, Mandarake.co.jp) aren't linked. Per skill: "All hard facts traceable to ≥ 1 official source within 10 minutes of WebFetch" — fails. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) Live JJK PLAZA Chair:Black pop-up integration (line 26-38) with venue-status dates table — actively-maintained Recency angle, (b) explicit cross-store price comparison table (lines 240-248), (c) budget-tier-to-district mapping (lines 50-54). EN competitors usually do single-store walkthroughs. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen guide by definition. The JJK pop-up section (line 26-38) is time-bound and will need a refresh cycle, but the broader article is long-term. Last updated April 22, 2026 with ongoing-pop-up tracking pattern is sustainable. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No direct overlap with `gachapon-guide-japan` (subset topic), `game-centers-arcades-japan` (different vertical), `nakano-broadway-guide`, or `akihabara-complete-guide-2026` (district-not-merch focus). This is the corpus's merch-shopping anchor. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 6). One of the 5 valid silos. PASS. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | YES | Hero image is hosted on `https://japan-pop-now.com/wp-content/uploads/2026/04/chainsaw-man-merch-2026.jpg` (line 22) — external WordPress URL, plus Chainsaw Man IP key visual without verified permission. Second body image at line 216 also external WP-uploads URL. Per CLAUDE.md: "every image path in `.md` MUST have a corresponding file in `public/`" — these aren't in `public/`. Per project memory image strict rule: external WP-uploads URLs fail the source priority chain. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I've spent more yen on gachapon than I care to admit" voice in sister article suggests Takapon visits these. Mandarake/Animate flagship visits are routine for the team. First-hand path viable. |

## Verdict
REJECT (0) — R3 image source ban hit + Q3 citation gap

## Recommendation
- REJECT, but rewrite-recoverable. Two structural fixes flip both blockers:
  1. Replace external WP-uploads URLs (lines 22, 216) with Wikimedia Commons images of the cited stores (Mandarake Nakano Broadway is well-photographed on Wikimedia under CC; Animate flagship has CC-BY photos available) OR with Takapon original photography. Remove Chainsaw Man key visual entirely — it's IP-without-permission per memory rule.
  2. Add inline citations to animate.co.jp, mandarake.co.jp, surugaya.jp, kotobukiya.co.jp for the floor-count and price claims. The "$5 billion annually" stat needs a Japan METI or industry report citation.
- Then re-run Phase 0 — should flip to PROCEED on Q3 + R3.
- Image floor: appears low (2 visible in source), likely needs 4-6 for a 3500-word article per Q3 of skill. Add Akihabara Chuo-dori, Nakano Broadway floor map, Pokemon Center MEGA — all available CC.

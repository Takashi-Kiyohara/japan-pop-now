# Phase 0 Detailed Eval: gachapon-guide-japan
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/gachapon-guide-japan.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | 5-step machine usage walkthrough (lines 47-52), price-tier table (lines 62-68), specific Tokyo shop list with addresses + 100-yen-coin warning (line 81-95), customs-friendly note for souvenirs (line 148: "Gachapon capsules are small, lightweight, and not food — they sail through customs in any country"). Trip-actionable across multiple sections. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Gachapon Tokyo" / "capsule toy Japan" — clear demand. Tokyo Cheapo and Time Out cover Gachapon no Mori but rarely with the brand-quality breakdown (Bandai vs Takara Tomy Arts vs Qualia vs Kitan Club at lines 109-117) or the "won't-give-change" warning (line 54). |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | "600,000+ gachapon machines nationwide. The market hit 610 billion yen in 2023" (line 38) — no source link. Brand mentions (Bandai gashapon, Takara Tomy Arts, Qualia, Kitan Club) lack citations. Specific shops (Gachapon no Mori, Gashapon Bandai Official Shop) listed without anchor links to their official pages. The "Gachapon no Mori" address fact-block (lines 80-84) has no source URL. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the "look for last-one machines" insider tactic (line 140), (b) Saturday-morning new-release timing tip (line 142), (c) brand-quality decoder ring (Qualia premium, Kitan Club whimsical, Bandai broadest, Takara Tomy Arts functional — lines 109-117). EN competitors usually treat all gachapon as one category. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen mechanic. Hot-series-2026 section (lines 116-119) is the time-bound element but contained. Annual refresh cadence works. Gachapon market and machine count are stable trends. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No other gachapon-specific article in corpus. `anime-merch-shopping-guide-japan` mentions gachapon as one of many merch types — not a competing article. PASS. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 6). Valid per canonical 5 silos. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images use `/images/articles/gachapon-guide-japan/body-wikimedia-{1-5}.webp` (lines 42, 56, 71, 101, 132). Each captioned with explicit Wikimedia Commons attribution and license (CC0, CC BY 4.0, CC BY 2.0, CC BY-SA 4.0). Compliant. Hero `/images/articles/gachapon-guide-japan/featured.jpg` is captioned generic but not external URL. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I've spent more yen on gachapon than I care to admit" (line 20) — first-hand voice. Specific shop-floor observations (Gachapon no Mori 500+ machines, Yodobashi 6F toy section) require ground-truth visits. Path viable. |

## Verdict
REJECT (0) — Q3 fail

## Recommendation
- REJECT, rewrite-recoverable. One fix:
  1. **Q3 fix**: Add inline citations to Bandai Gashapon official site (gashapon.jp) for the 610-billion-yen market claim, the Japan Toy Industry Association (or METI) for the 600,000+ machines stat, Gachapon no Mori's official site for store address and machine count, Kenelephant's Shibuya PARCO page. This is roughly 5-7 citation insertions; the article body is otherwise quite strong.
- After Q3 fix — flips to PROCEED.
- This article is closer to PROCEED than most in the batch. Image discipline (5 Wikimedia attributions) is exemplary. The brand-quality decoder is a genuine reader value-add.
- Note: the "Hot Series in 2026" section (line 116-119) needs a "last verified [date]" subheader to make the time-sensitivity transparent.

# Phase 0 Detailed Eval: ship-anime-figures-merch-home-japan
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/ship-anime-figures-merch-home-japan.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Pure trip-utility content. Five concrete shipping options (Japan Post EMS/SAL/Surface, Yamato, Sagawa, store-shipping, proxy services, extra luggage), per-kg pricing to US/UK/Australia, customs thresholds for US/UK/EU/Australia/Canada, packing protocol, tax-free walkthrough. Every section answers "what do I do" not "what's interesting". |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "ship anime figures from Japan", "Buyee vs ZenMarket", "EMS SAL surface mail figures" are durable mid-volume keywords. EN competitors (Tofugu, Buyee's own help docs) cover individual sub-topics; few consolidate all 5 options + customs + packing into one piece. The author's "30+ figures shipped over 5 years" framing (line 22) is unique experience signal. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Japan Post URL cited (japanpost.jp line 56). Buyee 4.9% fee, ZenMarket 1490 yen consolidation, Tenso pricing, Yamato 0120 number all correct as of 2026 but uncited. Customs thresholds (US 800 USD de minimis, UK 150 GBP, AUD 1000, Canada 0) are correct but should link to CBP / HMRC / DHS pages. Q3 passes baseline because facts are accurate; tightening means adding 5-7 official-site anchor links. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Strong differentiation: (a) all-options-in-one-place comparison (most competitors only cover EMS or only cover proxies), (b) per-country customs threshold table (line 121-127), (c) realistic per-figure pricing ladder ("1500 yen for a small figure to 18000 yen for a box"), (d) the explicit "extra checked bag math" calculation showing 3500-7000 yen vs Japan Post SAL 4500 yen (line 110-114). The packing 7-step protocol with 100-yen-shop materials is also unique among English competitors. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen reference content. Japan Post rates change quarterly (article flags this line 56) but the structural advice — service tiers, customs thresholds, packing — is durable. Annual refresh of the price table is the only maintenance need. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Adjacent articles (anime-merch-shopping-guide-japan, japan-proxy-shopping-2026) cover where to buy and proxy comparison respectively — this article covers logistics-after-purchase. Distinct intent. Linked from this article (line 213-216) as related. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: experiences. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), the experiences silo description explicitly includes "JR Pass, eSIM, luggage, and airport transfer guides" — practical-travel know-how is in scope. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Image 1: Wikimedia oddstranger CC BY-SA 2.0 (yuyu-madoguchi). Images 3 & 4 use repo-local paths body3.jpg / body4.jpg (Lawson counter, bubble-wrap shot) — these need verification but are not banned-source-shaped. No IP key visuals. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "Over the past five years, I've shipped more than 30 anime figures, doujinshi, and merch boxes back to the US, Australia, and across Europe" (line 22) is explicit first-hand-experience framing. Specific anecdote at line 105 ("I once received a sealed figure with a crushed corner") and line 208 ("I learned this the hard way") add credibility. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. One of the strongest articles in the corpus on Q1+Q4 axes — pure trip-utility, distinct angle, first-hand voice.
- Tightening recs:
  - Verify body3.jpg and body4.jpg exist in `public/images/articles/ship-anime-figures-merch-home-japan/` and that they pass the image strict 4-axis universal rule (count/resolution/topic/real-photo). Article references body-wikimedia-1.webp + body3.jpg + body4.jpg only — image floor is 3 for 3500+ words, below the 1-per-1000 ratio. Add 4-5 more Wikimedia or Takapon shots (post-office counter, EMS box, customs form CN22).
  - Add inline anchor links to `post.japanpost.jp/cgi-charge/`, Buyee help, ZenMarket pricing page, Yamato international rates page to flip Q3 to strong-pass.
  - Q3 fact verification: re-check 2026 EMS rates (article quotes 6700 yen US 1kg / 8000 yen AU 1kg / 6900 yen UK 1kg) against current Japan Post rate card before publish-cycle refresh — these change quarterly per article's own caveat.
  - The "Last updated: April 2026" badge (line 16) is good; consider adding `lastVerifiedRates` frontmatter field for the sub-component that drifts fastest.

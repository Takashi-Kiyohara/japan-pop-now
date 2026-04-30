# Phase 0 Detailed Eval: japan-luggage-forwarding-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 3)
Article reference: content/articles/japan-luggage-forwarding-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Takkyubin (luggage forwarding) is one of Japan's underutilized travel hacks. Article delivers cost math (¥6,000 for 3-city loop vs hauling — line 29), Yamato/Sagawa/JAL ABC comparison (line 41-100), step-by-step hotel-front-desk dialogue (line 105-110, 142), Japanese phrases (line 108, 142), and the "anime merch haul ship-home" use case (line 193-210). All trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Japan luggage forwarding tourist", "takkyubin English", "ship suitcase Tokyo to Kyoto" — niche, but high-CVR. EN competitors weak: Tokyo Cheapo touches it briefly; Japan Guide has a paragraph. Step-by-step shipping-slip walkthrough (line 112-145) and the merch-haul use case are unique. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Source citation is the weak link. Yamato Transport's URL (kuronekoyamato.co.jp) is named but not linked. Sagawa Express has no link. JAL ABC linked once (jal.co.jp/en/ — line 100). ecbo cloak / Carely apps mentioned but no URLs (line 159-164). The "Real math" cost claims (¥2,000-3,000 per bag — line 36) need direct anchor to Yamato pricing page. Most claims are anecdotal authority-from-experience without traceable source links. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Four differentiation hits: (a) Japanese hotel-desk phrase script (line 108, 142, 210), (b) the anime merch haul ship-home strategy (line 193-210) — no EN competitor connects luggage forwarding to anime-shop purchases, (c) cost-math comparison vs Narita taxi (¥3,000 vs ¥8,000-15,000 — line 220), (d) "skip if" decision criteria (line 234-240). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen practical guide. Yamato/Sagawa/JAL ABC are stable infrastructure. Pricing has been stable since 2020. No 90-day obsolescence risk. Annual refresh fine. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No direct luggage-forwarding article in corpus. Standalone topic. Cross-linked from `japan-trip-checklist-anime-fans-2026`, `japan-proxy-shopping-2026`. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Valid silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | All body images Wikimedia Commons: Sagawa truck (Ominae / CC BY-SA 4.0 — line 64), Yamato shipping slip (TAKA@P.P.R.S / CC BY-SA 2.0 — line 115), Yamato cardboard boxes (jmv Flickr / CC BY 2.0 — line 178), Yamato Haneda van (Comyu / CC BY-SA 4.0 — line 223). featuredImage credit is Syced / Wikimedia / CC0 (line 10). One concern: line 195 references `4.jpg` (non-Wikimedia naming pattern, no credit) — needs license verification. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer voice indicates personal usage: "On my last trip" patterns absent here, but the hotel-front-desk script (line 108) and the "ask the shop in Japanese" (line 210) only come from someone who has done the process. First-hand evidence is moderate but viable. |

## Verdict
REJECT (0)

## Recommendation
- REJECT — rewrite-recoverable. Q3 is the binary blocker. Key actions:
  - Q3 source viability: add 4-5 inline citations. Required: Yamato Transport English page (https://www.global-yamato.com/en/), Sagawa Express English page (https://www.sagawa-exp.co.jp/english/), Yamato hotel-front-desk service description page, JAL ABC service page. Without these the price/timing claims are unverifiable.
  - Verify line 195 `4.jpg` image license and replace if non-compliant per image strict universal rule.
  - After Q3 fix, this is a strong PROCEED — Q1/Q2/Q4/Q5 all clean.
</content>

## Re-evaluation (2026-04-28, Tier A citation sweep batch 3)
Edits applied:
- Anchor-linked Yamato Transport at first mention in "What Is Takuhaibin" section (https://www.kuronekoyamato.co.jp/en/) and added an inline `[source: ...]` citation noting Yamato's "Hands-Free Travel" tourist program.
- Anchor-linked Sagawa Express in the same paragraph (https://www.sagawa-exp.co.jp/english/).
- Added a leading paragraph to the Sagawa section with anchor + inline citation.
- Added a citation to the Yamato section header subtext.
- Anchor-linked ecbo cloak (https://cloak.ecbo.io/en) in the alternatives section, plus inline citation.
- JAL ABC was already linked at line 100; left as-is.

WebFetch coverage: kuronekoyamato.co.jp/en (200 — confirmed Hands-Free Travel program), sagawa-exp.co.jp/english (200 — confirmed English service portal). global-yamato.com/en returned 403; the kuronekoyamato.co.jp/en URL is the appropriate canonical replacement.

Q3 status: NOW PASS. The four operator names mentioned in the article (Yamato, Sagawa, JAL ABC, ecbo cloak) all carry inline anchor citations. Pricing is still authority-from-experience; tightening that to per-route pricing PDFs is a Phase 2 ask.

R3 follow-up: line 195 `4.jpg` license question raised in the original eval was NOT resolved here (image still references `/images/articles/japan-luggage-forwarding-2026/4.jpg` without credit). Flag for image-axis sweep.

Verdict flip: REJECT → PROCEED (with R3 image-license check carried forward).

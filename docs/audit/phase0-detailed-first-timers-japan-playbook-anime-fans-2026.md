# Phase 0 Detailed Eval: first-timers-japan-playbook-anime-fans-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/first-timers-japan-playbook-anime-fans-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | The 6-step arrival plan (lines 53-59), 7-item pre-flight booking list (lines 71-77), cash-vs-card breakdown by situation (lines 96-114), 12-item pre-trip checklist (lines 122-133), 6-section etiquette guide (lines 141-151) — all directly trip-actionable for a first-timer. The "Visit Japan Web QR code" mention (line 54) is current to 2026 procedures. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "First time Japan tips for anime fans" — clear search demand. EN competitors include Tokyo Cheapo, Tofugu, but most generalist guides skip the anime-fan-specific angle (collab cafe booking warnings at line 74, the Yamanote Line etiquette at line 142, seichi junrei keep-quiet rule at line 151). |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Specific claims ("7-day JR Pass was 50,000 yen as of November 2024," line 73; "10% tax refund... over 5,000 yen" — implied; eSIM "2,500 to 5,000 yen," line 175) lack inline citations. The article cites internal links (japan-rail-pass-2026-guide, japan-esim-pocket-wifi-sim-card) which probably have the sources, but Q3 wants traceable to ≥1 official source per claim within 10 minutes of WebFetch — fails the strict version of the test. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) explicit anime-fan-specific framing throughout (the "buying merchandise needs a day bag" line 129, the seichi junrei etiquette section at line 151), (b) the "unspoken rules" section (lines 137-151) covering Yamanote Line silence, walk-on-left/right, shrine 5-yen-coin tradition — most generalist guides don't unify these, (c) the 9-cash-only-situations list (lines 96-105) is unusually specific. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen first-time-traveler advice. JR Pass price reference is hedged ("as of November 2024," line 73). Procedural elements (Visit Japan Web QR, IC card options, eSIM workflow) change slowly. With annual updates, the article is multi-year sustainable. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | `japan-trip-checklist-anime-fans-2026.md` exists (per glob result). The frontmatter on this article links to it (relatedSlugs line 17, line 19). Both target the same primary search intent ("first time Japan checklist for anime fans"). The differentiation between "playbook" and "checklist" is fuzzy — readers searching for either will land on whichever ranks. Likely >60% topic overlap. **R1 fires pending verification of the sister article's topic depth.** |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 7). Valid per canonical 5 silos. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero `/images/articles/first-timers-japan-playbook-anime-fans-2026/featured.jpg` (line 10). Body images at `/images/articles/first-timers-japan-playbook-anime-fans-2026/body{1-3}.jpg` (lines 63, 116, 163) — assumed Takapon original or licensed. No external URLs, no IP key visuals reproduced. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I have watched this play out in person more than 40 times with friends flying in from the US, UK, Singapore, and Brazil" (line 29) — first-hand observational depth from local-hosting context. Plausible. |

## Verdict
REJECT (0) — R1 cannibalization (pending sister-article confirmation) + Q3 fail

## Recommendation
- REJECT, rewrite-recoverable. Two fixes:
  1. **R1 fix (highest priority)**: Read `japan-trip-checklist-anime-fans-2026.md` and decide canonical owner. The "checklist" framing is more searched ("japan trip checklist") but the "playbook" framing has narrative voice. Recommendation: merge — keep the playbook narrative, fold checklist items into it, redirect/noindex the checklist slug. OR keep both but enforce a cleaner topic split: playbook = arrival + etiquette + cultural context; checklist = packing + customs + merch-specific gear.
  2. **Q3 fix**: Add citations for JR Pass official price page, NTT Docomo / SoftBank eSIM official rates, JNTO Visit Japan Web procedure page, ATM operator official tax-free shopping rules. The author probably has these in their head from running this advice 40 times — they need to land in the article.
- After R1 sister-decision + Q3 citations — flips to PROCEED.
- Note: the article voice ("This playbook is what I wish someone had handed me on my first Tokyo trip") is genuinely good and worth preserving; rewrite should expand it rather than stripping voice for citations.

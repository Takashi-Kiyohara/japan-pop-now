# Phase 0 Detailed Eval: akihabara-arcade-rhythm-games-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/akihabara-arcade-rhythm-games-guide-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Article frames a precise first-timer decision: which rhythm machine to play first, which arcade to enter, how to pay (line 47-104). Specific machine recommendations (Taiko first, then maimai, then CHUNITHM) and the unwritten-rules section (line 113) are exactly what a foreign visitor needs. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Akihabara rhythm games" / "maimai for foreigners" / "first time at Japanese arcade" — long-tail with thin EN coverage. r/Otoge subreddit and a few YouTube videos are the main competitors, no comprehensive in-place guide. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | The article makes specific claims (GiGO 1st closed Aug 2025, Silkhat opened Nov 2025 in same red building, 33-year SEGA Akihabara legacy) but cites zero sources. These are verifiable but the article doesn't link to the official Silk Hat / Matahari Entertainment press release or to GiGO's announcements. Card pricing (Aime ¥300, e-amusement pass ¥330, Banapassport ¥300) is also uncited. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | (a) Insider mechanic — the "100 yen on the cabinet = next turn" queue convention (line 119), grip glove note (line 53), tunnel-Wi-Fi caveat (line 88). (b) Comparative — 7-machine difficulty/cost matrix (line 60-71). (c) Stack-level — combines machine choice + arcade choice + payment + etiquette. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Arcade scene is stable; machines have multi-year lifecycles. Silk Hat opened late 2025 so is fresh. Annual refresh cadence works. Closure of GiGO 1st handled. Evergreen. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Overlaps somewhat with `akihabara-complete-guide-2026` (Silk Hat section, GiGO closure) but at much greater depth on rhythm games specifically. `game-centers-arcades-japan` is broader and doesn't drill into specific Akihabara machines. <60% overlap. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Fits. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero is /hero.webp (Takapon-style first-person shot of maimai cabinet, lines 25-26). Body images at /body-maimai.webp, /body-gigo-floor.webp, /body-sound-voltex.webp suggest first-hand photography. No banned sources detected, though local file provenance should be verified per the 5-step image gate (memory: Image claim verify strict gate). |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Article voice claims 3-day machine testing with ~4,000 yen spent in coins (line 28). E-E-A-T strong. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Tightening recs:
  - Address Q3: add inline citations for Silk Hat opening date (Matahari Entertainment press release), GiGO 1st closure (SEGA / GENDA announcement), and player-card prices (sega.jp, konami.com, bandainamco.com).
  - Image floor: prescreen showed 4 of 6 needed. Article reads as having 4 body images plus hero — need 2 more body shots to clear `ceil(2224/400)=6` floor.
  - Fix Klook affiliate placeholder URL `?aff_adid=REPLACE_WITH_KLOOK_AFF_ID` (line 44, 109, 170) — these break the 'no hardcoded affiliate IDs' rule but ALSO leave dead placeholders that should resolve via `lib/affiliate.ts` helper per CLAUDE.md affiliate rules.

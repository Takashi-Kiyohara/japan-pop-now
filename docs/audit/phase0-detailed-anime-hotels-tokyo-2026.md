# Phase 0 Detailed Eval: anime-hotels-tokyo-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/anime-hotels-tokyo-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Hotel choice is one of the highest-stakes pre-trip decisions. Article delivers 5 anime-themed properties with price tier, location, vibe, and honest pros/cons (lines 30-187). Neighborhood guide (lines 192-211) helps overseas readers narrow location. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Anime hotel Tokyo" / "manga hotel Tokyo" / "Sunshine City Prince anime collab" — long-tail with thin EN comprehensive coverage. Most EN coverage is single-property (Hotel Gracery Godzilla). The 5-property comparative angle is unique. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Article cites zero official sources. No links to gracery.com, princehotels.com, tavinos.com, mangaarthotel.com, or astrostation.jp. All hotel claims (price ranges, IKEPRI25 collabs with Demon Slayer/AoT/JJK rotating, 4-star property, breakfast quality) need official citations. The "200 anime-themed hotels" stat (line 222) is uncited. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | The price-tier-vs-experience analysis (lines 213-220), the neighborhood pairing matrix, and the "what you're actually paying for" framing are differentiated. EN competitors mostly list properties with descriptions, not strategic-choice frameworks. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Hotels are evergreen; price ranges drift slowly. IKEPRI25 collab floors rotate (need quarterly refresh). Annual refresh cadence works. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No direct anime-hotel sibling. `tokyo-anime-district-guide` and area guides mention some hotels in passing. <60% overlap. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Hotels-as-experience fits experiences silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia Commons (Hotel Gracery Shinjuku, APA Hotel Asakusa, Sunshine City, Capsule Inn Akihabara, Akihabara street — lines 27, 38, 157, 189, 205, 253, 256). featured.jpg credit "Photo: © JNTO" (line 11) — Japan National Tourism Organization images are licensed for travel-promotion use; verify this hero is part of JNTO photo library license. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I've stayed in all of them" voice (line 273), "spent the last three months testing six anime-themed hotels" (line 21). Personal review angle. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Tightening recs:
  - Address Q3: add inline citation per property — at minimum link the official hotel website for each of the 5 properties. The Sunshine City Prince IKEPRI25 page on princehotels.com.
  - Image floor: 7 of 8 needed per prescreen — add 1 more image (e.g., Manga Art Hotel Jimbocho exterior or pod interior from Wikimedia or property press kit).
  - Verify featured.jpg JNTO licensing terms — JNTO images allow editorial use but the per-image release should be confirmed.
  - The "Sunshine City Prince Hotel" name in the article doesn't match the canonical Sunshine City Prince Hotel Tokyo Bay or Sunshine City Prince Hotel Ikebukuro — clarify which property.
  - Affiliate URLs (Booking.com / Agoda) lack proper UTM and `?aid=` params per CLAUDE.md affiliate rules — should route through `lib/affiliate.ts` helpers.

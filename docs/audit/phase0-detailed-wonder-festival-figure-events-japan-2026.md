# Phase 0 Detailed Eval: wonder-festival-figure-events-japan-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/wonder-festival-figure-events-japan-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | High trip-utility for figure collectors. Specific date (July 26 2026), venue (Makuhari Messe), access from Tokyo Station (30min via JR Keiyo Line, Kaihin-Makuhari Station), ticket tiers with prices (¥3500 advance / ¥4000 day-of / ¥2200 U22 / ¥2300 afternoon entry / free under elementary), buying strategy, ATM tip, packing materials checklist, post-event shipping options. WonFes attendance ~30k makes it a major draw for the international figure community. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Wonder Festival 2026", "WonFes tickets English", "WonFes Tokyo guide" are seasonal-spike keywords with predictable July-cycle demand. Most EN coverage is forum-post-level (Reddit r/anime / Twitter threads); a structured guide with ticket pricing + Loppi instructions + post-event shipping doesn't exist in EN. The author's Loppi-walkthrough pointer to the dedicated Loppi guide is unique. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Date and venue concrete (July 26, 2026, Makuhari Messe — line 39). Pricing tiers from Lawson Ticket. l-tike.com mentioned but no inline anchor link. wonderfestival.jp (the official site) not linked anywhere in the article. Hiroshi Yokoyama Exhibition 2026 mentioned (line 53) as the special exhibition without source. Biannual/event-history claim ("running since 1984" line 39) correct but uncited. Q3 weakly passes — facts correct, citations sparse. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the dealer-hall-first / corporate-zone-later prioritization (line 84) is real insider tactical advice that competitors miss, (b) the "bring cash + budget ¥30,000-100,000+" calibration (line 78), (c) the post-event shipping section integrating EMS / Yamato / proxy services (this article's natural pairing with the ship-anime-figures-merch-home-japan article also in this batch). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Event date is July 26, 2026 — exactly within the 90-day window from eval date (2026-04-28). Post-event the article folds nicely into the same article re-purposed for WonFes Winter 2027 (Feb date), then the next Summer 2027. The biannual cadence makes this article an evergreen-anchor candidate with semi-annual refreshes. Other-figure-events section (Comiket, AnimeJapan, Treasure Festa) at line 117-123 provides standing utility even between WonFes editions. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No WonFes-specific sister. animejapan-comiket-guide and animejapan-comiket-2026-guide cover different events (Comiket / AnimeJapan are distinct from WonFes per article line 117-123). Adjacent articles linked but not overlapping. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: experiences. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `experiences` covers single-spot pop-culture experiences and theme-park-style events. Could arguably be `events` (the Events & Pop-ups silo description matches), but `experiences` is defensible. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Four body images all Wikimedia (CC BY-SA): Makuhari Messe North Hall exterior, Messe-Ohashi Bridge approach, Good Smile Company corporate booth display, Nendoroid 1000 banner. All credited. No IP key visuals. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Specific tactical advice — "lines form from 7:00-8:00 AM" (line 80), "ATMs at Kaihin-Makuhari Station" (line 78), "Lockers at Kaihin-Makuhari Station fill up fast" (line 144) — implies on-the-ground experience. WonFes is open-admission, accessible to Takapon. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Strong fit for the experiences silo. The biannual-event evergreen pattern is genuine.
- Tightening recs:
  - Add inline links to wonderfestival.jp (or wf.kaiyodo.net), l-tike.com WonFes ticket page, Hiroshi Yokoyama Exhibition official source. Currently 0 inline citations to official sources for any of the load-bearing facts. This is the single highest-leverage fix.
  - Verify ticket prices (¥3500 advance / ¥4000 door / ¥2200 U22 / ¥2300 afternoon) against the official Lawson Ticket listing for WonFes 2026 Summer — pricing tiers can shift between editions and the article should match the active campaign.
  - Cross-link to the ship-anime-figures-merch-home-japan article (also in this batch) — currently only the inline luggage-forwarding link points to a related how-to. Strong contextual pairing for the buying-then-shipping reader journey.
  - Image floor: 4 body Wikimedia images for ~2300 words is acceptable (matches 1-per-1000 floor). Topic axis is weak though — Makuhari Messe + GSC corporate booth photos are venue/proxy, not WonFes-specific. Per project memory's image strict 4-axis rule, the topic axis warns. Until a Takapon WonFes-day photoshoot exists, this image set is the best available; document the proxy nature in an `imageNote` frontmatter field similar to spy-family-tokyo-fan-day-2026's pattern (line 10).
  - Add `validUntil: "2026-07-31"` (post-event) to systematize the post-July fold-into-Winter-2027-edition refresh.
  - Body line 19 has bilingual mojibake risk on "ワンダーフェスティバル" rendering but the file otherwise looks clean — sample passes UTF-8 spot-check, unlike the slam-dunk-kamakura article.

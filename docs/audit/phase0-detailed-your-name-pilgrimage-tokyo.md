# Phase 0 Detailed Eval: your-name-pilgrimage-tokyo
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/your-name-pilgrimage-tokyo.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Pure trip-actionable seichi junrei content. Five Tokyo locations (Suga Shrine, Shinjuku South Exit overpass, Shinanomachi Station, National Art Center Roppongi, Yotsuya Station) with addresses, station + exit + walk-time, hours, cost. Half-day walking route 13:00-15:50 with 9 timestamps + optional Roppongi extension (line 98-110). Hida/Takayama Itomori-region extension explained for multi-day trips. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Your Name pilgrimage Tokyo", "Suga Shrine stairs", "Kimi no Na wa locations" are durable mid-tail keywords with continuing demand 10 years post-release (Your Name was 2016; international fan-pilgrimage culture is sustained). EN competitors (Sora News, blog posts) cover the Suga Shrine stairs alone; the 5-location route + Hida extension is unique. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Suga Shrine address (5 Sugacho, Shinjuku-ku 160-0018) and access (JR Yotsuya South Exit) concrete and correct. National Art Center hours/closures (Tuesday closed, Friday-Saturday until 20:00) factual. Hida-Furukawa Shinkansen route correct. However zero inline citations: no link to suga-jinja official page, nact.jp (National Art Center), Hida tourism site. The ¥150-200 train fare claim and the ¥1500-2500 exhibition fee are correct ranges but uncited. Facts accurate, citations missing. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the multi-stop Tokyo-only walking route (most EN competitors only cover Suga Shrine stairs), (b) the late-afternoon-light-matching tip with specific time window 3:00-5:00 PM (line 57, 123), (c) the residential-neighborhood-respect framing (line 127) that addresses a real ongoing community-relations concern at Suga Shrine. The Hida-Furukawa extension (line 115-118) is comprehensive in a way competitors aren't. |
| Q5 | Sustainability (will have value 90 days from now) | YES | The film is an evergreen anchor (2016 release, sustained pilgrimage tourism through 2026 per article line 20). Locations are permanent public spaces. National Art Center is a permanent institution. Hida region is permanent. Annual refresh on hours / fares is sufficient. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Adjacent articles weathering-with-you-locations-tokyo and demon-slayer-pilgrimage-tokyo cover different IPs. anime-pilgrimage-spots-tokyo is the parent hub (linked at line 132). Hub-and-spoke pattern, not cannibalization. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: destinations. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `destinations` explicitly covers "Your Name locations, and the real-world places behind your favorite series" in the description. Perfect fit — this article is what the silo description literally references. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO (with caveat) | Wikimedia images at line 42 (Suga Shrine, Monado, CC BY-SA 2.5) and line 80 (National Art Center, Kakidai, CC BY-SA 4.0) — both correctly attributed. **However** line 39 references `https://japan-pop-now.com/wp-content/uploads/2026/04/trigun-chugai-grace-cafe-2026.jpg` — a Trigun cafe photo as Your-Name-article body image. This is a **topic-axis violation** of the strict 4-axis universal image rule (project memory feedback_image_strict_universal_rule). The image is on-platform legacy WP CDN (not banned source), but it has zero topical relationship to the article. Counts as image-quality fail, not R3 hard-reject — but flagged. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | First-person voice ("Standing at the top of these stairs and looking down is one of those moments..." line 49), specific time-of-day matching observation (line 57), residential-respect framing (line 127) all imply on-the-ground experience. Suga Shrine is 10 min from Yotsuya Station — easily Takapon-revisitable. |

## Verdict
PROCEED (100) — with image fix required before next strict-mode pass

## Recommendation
- PROCEED. Phase 0 is clean across all 5 Q's, all 4 R's. The article is one of the corpus's strongest seichi-junrei pieces.
- Tightening recs:
  - **Critical**: Replace line 39's `wp-content/uploads/.../trigun-chugai-grace-cafe-2026.jpg` body image. Trigun cafe photo on a Your Name pilgrimage article is a topic-axis fail per the image strict universal rule. Replace with a Wikimedia Yotsuya residential street photo or a Takapon-shot stairway approach photo. This is image-strict-universal-rule severity even though it's not source-banned.
  - Add inline citations to suga-jinja.jp (Suga Shrine official), nact.jp (National Art Center), city.takayama.lg.jp/tourism (Hida tourism). Currently zero official-source anchors.
  - Body has 2 inline images (lines 42, 80) plus the broken line 39 — image floor is 2 working topical images for ~1500 word body, just barely meeting the article-quality.md 1-per-1000 floor. Add 2-3 more Wikimedia or Takapon shots of Yotsuya streets, Shinjuku South Exit overpass, Shinanomachi pedestrian bridge to strengthen the image floor.
  - The "Save scene screenshots" advice at line 121 + the duplicate "Save comparison screenshots" at line 125 are nearly the same paragraph repeated — consolidate or differentiate.
  - The footer at line 161-166 has an apparent error: "Jujutsu Kaisen Shibuya Pilgrimage Guide" links to /articles/demon-slayer-pilgrimage-tokyo (wrong target). "Chainsaw Man Tokyo Pilgrimage Guide" links to /articles/weathering-with-you-locations-tokyo (also wrong). "Kyoto Anime Guide 2026" links to /articles/osaka-anime-guide-den-den-town (wrong city). These are mis-wired internal links that need correction.

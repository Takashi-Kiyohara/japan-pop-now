# Phase 0 Detailed Eval: tokyo-anime-collab-cafes-summer-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/tokyo-anime-collab-cafes-summer-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Trip-actionable for summer (June-August) travelers. Specific cafes confirmed: Haikyuu!! Animate Cafe Stand Ikebukuro Jul 26-Aug 20, Maid-sama! My Charaful through Aug 23, Ouran Host Club through Jul 5, AMNESIA × Collar × Malice Animate Cafe Jul 28-Aug 23, Magical Promise Animate Cafe Jul 21-Sep 13. Per-chain booking system breakdown for Animate, Collabo Cafe Honpo, BOX CAFE, GiGO, My Charaful, walk-in venues. Multi-cafe routing (line 144-150). |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | Same demand profile as the spring 2026 sibling — "Tokyo collab cafes summer 2026", "Haikyuu cafe Tokyo", "Animate cafe summer" are predictable mid-tail keywords. Summer Comiket / international school-holiday traffic is explicitly called out (line 21) as the demand window. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Inline links to reserve.animatecafe.jp (line 70), tablecheck.com Collabo Cafe Honpo (line 79), collabo-cafe.com aggregator (line 60). However, fewer official-source citations per cafe than the spring sibling — Maid-sama!, Ouran, AMNESIA, Magical Promise are listed without URL anchors. Q3 baseline-passes because Animate Cafe + Collabo Cafe Honpo official systems are linked, but tightening means adding 4-5 more inline links to cafe-specific landing pages. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Per-chain booking-system explainer is the unique differentiator: (a) Animate Cafe lottery vs seat reservation (line 72-74), (b) Collabo Cafe Honpo TableCheck English support (line 79), (c) BOX CAFE Loppi requirement workaround pointer (line 89), (d) 3-cafe-Ikebukuro-route at line 144-150. EN competitors generally cover one chain at a time without the cross-chain comparison. |
| Q5 | Sustainability (will have value 90 days from now) | YES (weak) | Same rolling-quarterly pattern as the spring sibling. From eval date (2026-04-28), the 90-day window covers exactly the Jun-Aug 2026 timeframe this article targets. After Aug 31 the article should fold into tokyo-anime-collab-cafes-fall-2026 (not yet drafted). The pattern works — but only if the fall article is created on schedule (mid-July latest to capture summer-anime-premiere announcements). Q5 weakly passes because the seasonal-handoff plan is implicit in the corpus structure but not documented in this article's frontmatter. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Spring sibling covers Mar-May, this covers Jun-Aug — non-overlapping time windows. how-to-book and animate-cafe-guide are abstract booking-method references, distinct intent. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: cafes. Perfect fit. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | All five body images Wikimedia (Guilhem Vellut CC BY 2.0, Tofeiku CC0, Kakidai CC BY-SA 3.0, Basile Morin CC BY-SA 4.0, スケトウダラ CC BY-SA 4.0). Hero image and final image use repo-local paths but credits are present. No IP key visuals reproduced. The Wikimedia attributions follow the official-source-priority rule. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I'll update it as new cafes are announced" + "I check it weekly" (line 47, 60) are first-person editorial-presence signals. Animate Cafe / Collabo Cafe Honpo / GiGO are visit-able by Takapon. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Strong sibling to the spring 2026 article; same template, slightly fewer per-cafe citations.
- Tightening recs:
  - Add inline citations to Maid-sama!, Ouran, AMNESIA, Magical Promise official cafe / Animate Cafe campaign pages — each currently listed only by IP name + date in the table at line 49-58. Same pattern as the spring sibling's per-cafe URL anchors would flip Q3 from weak-pass to strong-pass.
  - Body image at line 218 (`/images/articles/tokyo-anime-collab-cafes-summer-2026/6.jpg`) is alt-text-templated ("Never Miss a Cafe Opening or Anime Event — Tokyo Anime Collab Cafes Summer 2026") suggesting auto-generated placeholder. Verify file exists and matches the topic axis of the strict 4-axis rule.
  - Frontmatter has mojibake corruption: line 18, 19, 21, 47 contain literal "â" characters where em-dashes should be. Same issue as the slam-dunk-kamakura-pilgrimage-2026 article (different file, same import bug). Charset fix recommended on next refresh.
  - Add `validUntil: "2026-08-31"` to frontmatter. Add a "fold-up plan" comment marker referencing tokyo-anime-collab-cafes-fall-2026 as the planned successor to systematize Q5.
  - Verify slot numbers consistent: line 49 table claims 6 cafes, line 51 claims 15+ running across the season. Reader expectation from "Summer 2026" should be set early — this article currently flips between "5 confirmed" and "15-20 typically running" without resolving the gap. Recommend an explicit "5 confirmed today + 10-15 more launching July-August once summer anime announcements drop" framing.

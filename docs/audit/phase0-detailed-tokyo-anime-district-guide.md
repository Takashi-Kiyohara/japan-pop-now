# Phase 0 Detailed Eval: tokyo-anime-district-guide
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/tokyo-anime-district-guide.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | The orientation piece for first-time anime-fan visitors. Five-district decision matrix (Akihabara/Ikebukuro/Nakano/Shibuya/Harajuku) at line 28-35 with "best for / vibe / time needed" criteria. One-day, two-day, three-day routing options (line 138-152) with train transfer table (line 154-161). Suica/Pasmo recommendation. The "Akihabara isn't all of anime Tokyo" thesis (line 22-25) is a real corrective for visitors. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Tokyo anime district", "where to go for anime in Tokyo", "anime neighborhoods Tokyo" are durable high-intent keywords. The comparison-table-first format directly serves AEO/featured-snippet patterns per seo.md rules. EN competitors typically pick one district per article; the cross-district orientation gap is real. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Stations, exits, line names, peak hours all concrete and correct as of 2026. Mandarake "30 individual specialty stores" (line 86), Animate Ikebukuro "headquarters and largest branch" (line 67), Nakano Broadway "300 shops" (line 86), PARCO 6F flagship lineup all factual. Internal links to all 5 district deep-dives (Akihabara, Ikebukuro, Nakano, Shibuya/Harajuku) are working. Q3 weakly passes — facts are correct but uncited (no anchor links to mandarake.co.jp, animate.co.jp, parco.jp). |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the 5-district comparison table on a single criteria axis (line 28-35) — none of TimeOut/JapanGuide/Tokyo Cheapo do this systematically, (b) the "which district matches your fandom" framing (mecha → Akihabara, BL/otome → Ikebukuro, vintage → Nakano, official flagships → Shibuya, kawaii → Harajuku), (c) the cross-district train transfer table with times and lines (line 154-161). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Pure evergreen. Districts don't move. Stations don't change. Mandarake / Animate / PARCO 6F are permanent installs. Annual or biannual refresh of peak-hours / new-store openings is sufficient. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | This is the parent hub for individual district guides (akihabara-complete-guide-2026, ikebukuro-anime-guide-2026, nakano-broadway-guide, shibuya-harajuku-pop-culture-guide — all linked from this article). Hub-and-spoke architecture, not cannibalization. The hub provides decision-making; spokes provide deep-dive. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: destinations. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `destinations` is valid and explicitly covers "otaku neighborhood guides — Akihabara, Ikebukuro, Nakano Broadway". Perfect fit. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Five body images all Wikimedia attribution: Akihabara (Basile Morin CC BY-SA 4.0), Ikebukuro (Guilhem Vellut CC BY 2.0), Nakano (User:Kentin CC BY-SA 3.0), Shibuya PARCO (Syced CC0), Harajuku (Syced CC0). All correctly attributed in italic captions. No IP key visuals. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "Tokyo doesn't have one anime district. It has at least five, and each one serves a completely different type of fan" (line 21) is the kind of orientation framing only a Tokyo-resident can write. Specific tactical advice (e.g., "Akihabara's main strip vs side streets pricing" line 47) is on-the-ground knowledge. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. This article is the corpus's destinations-silo orientation hub. Strong on all five Phase 0 axes.
- Tightening recs:
  - Image floor good (5 images for ~2200 words — meets the 1-per-1000 ratio in article-quality.md). All Wikimedia. No action needed on count axis.
  - Add inline citations to mandarake.co.jp/test/about (line 86 "since 1980 + 300 shops" claims), animate.co.jp/shop/ikebukuro (line 67), parco.jp/shibuya/cyberspace (line 104) to flip Q3 from weak-pass to strong-pass.
  - Multiple footer-link blocks at line 201-220 have substantial duplication (Osaka anime guide repeated 3x at lines 209-211). Cleanup pass needed.
  - The "Beyond the Big Five" section (line 165-174) under-served: Odaiba/Shinjuku/Jimbocho/Mitaka deserve their own one-line "best for" entry in the comparison table, OR a sub-table. Currently they're prose-only.
  - Line 165-174 mentions Jimbocho without an internal link — if there's no Jimbocho article in the corpus, this is fine; if there is one, link it.
  - Consider adding a `lastUpdated` cadence note for the comparison table since peak-hour patterns and shop openings drift faster than the rest of the article. Quarterly refresh recommended as opposed to the rest's annual pattern.

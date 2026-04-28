# Phase 0 Detailed Eval: akihabara-complete-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/akihabara-complete-guide-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Foundational hub guide — Radio Kaikan, Animate Akihabara, Mandarake, Super Potato, Silkhat, side-street structure (lines 41-202). Maid cafe scam-avoidance section (lines 224-251) is uniquely valuable for safety-conscious overseas readers. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Akihabara guide" is high-volume but TimeOut/JapanGuide/TripAdvisor own positions 1-3. However: 67 inbound internal links (per prescreen) signal this is a corpus-anchor hub. The article ranks via long-tail (specific shop names) where EN competitors miss the side-street layer. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Hard facts (Silkhat opening date Nov 22 2025, GiGO 1st closure Aug 31 2025, 33-year SEGA history, Chiyoda Ward 2021 tout designation) are ALL uncited. The Chiyoda Ward "tout prevention priority zone" claim (line 227) needs a city.chiyoda.lg.jp citation. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Multiple unique angles: (a) The maid-cafe scam typology (lines 230-249) is a safety differentiation — reproduces "5ch golden rule" in Japanese. (b) The "vertical dimension" framing of Akihabara shops on floors 3-8 (line 33). (c) Side-street specialist shop cluster discussion (line 134). EN competitors typically do top-10 lists, not these meta-frames. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Foundational area guide — evergreen with annual refresh. Some specifics (Silkhat opening, GiGO closure) need to be archived as "since" rather than "new." |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | This is the hub article. `akihabara-arcade-rhythm-games-guide-2026` is a child detailing one section deeper. Hub-child relationship, not cannibalization. |
| R2 | Silo violation (not in 5 silos) | YES | Category in frontmatter is "destinations" (line 6). The 5 official silos (per CLAUDE.md / seo.md) are: collab-cafes, experiences, area-guides, anime-pilgrimage, travel-tips. "destinations" is NOT one of the 5 silos — should be `area-guides`. Several other articles in the prescreen also use `destinations` (8+ articles), suggesting a corpus-wide silo-mapping issue, not unique to this article. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia Commons used (Akihabara Station, Akihabara at night, Akiba ICHI, Itasha — lines 38, 45, 127, 200). Hero `/featured.jpg` provenance unverified — needs check. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "Written from weekly visits — not from a single tourist trip" (line 16). Strong E-E-A-T. |

## Verdict
REJECT (0)

## Recommendation
- REJECT — rewrite-recoverable. R2 silo violation is the load-bearing issue. Action: change `category: "destinations"` to `category: "area-guides"` in frontmatter. This is a structural fix, not a rewrite. NOTE: this affects 8+ articles in prescreen using `destinations` — the silo violation is corpus-wide, suggesting a separate sweep task.
- Additional concerns to address before re-running Phase 0:
  - Mojibake corruption throughout the article (line 16: "â not from", line 30: "ä¸­å¤®éã", line 48: "ã©ã¸ãªä¼é¤¨" etc.) — UTF-8 encoding broken on Japanese characters. This is a content-quality blocker that must be fixed.
  - Duplicate paragraph blocks (lines 222-298 — the "tout problem" and "Where to Eat" sections appear twice). Indicates a botched merge or copy-paste error in the source. Article body is corrupted.
  - Add inline citations to Chiyoda Ward and SEGA / Matahari Entertainment for the dated claims.
  - Image floor: 4 of 12 needed per prescreen — substantial uplift needed.
- If silo can be fixed to `area-guides` AND mojibake repaired AND duplication cleaned, this article re-runs Phase 0 with strong PROCEED prospects given inbound count of 67. Currently REJECT due to R2 + content corruption.

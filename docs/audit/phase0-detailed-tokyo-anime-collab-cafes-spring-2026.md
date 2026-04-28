# Phase 0 Detailed Eval: tokyo-anime-collab-cafes-spring-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/tokyo-anime-collab-cafes-spring-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Single most trip-actionable article structure on the site: 12 dated/located cafes (JJK PLAZA Solamachi Mar 28-Apr 26, One Piece GENE PARCO Apr 1-May 18, My Dress-Up Darling Ikebukuro until Apr 19, MHA DECOTTO from Apr 3, Conan BOX cafe&space from Apr 10, Blue Lock Honpo Akihabara Apr 15-May 24 etc), each with address, station + walk time, hours, reservation system, budget, official URL. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Tokyo anime collab cafe", "Tokyo collab cafes spring 2026", "JJK plaza Tokyo", "One Piece cafe Shibuya PARCO" are durable mid-tail keywords with continuous demand. Per CLAUDE.md the cafes silo is the site's "killer feature (~92% traffic)". EN competitors don't track current Tokyo collab cafes with weekly cadence — collabo-cafe.com is JP-only and aggregator-style without booking guidance. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Inline links to cafe.parco.jp (line 117), collabocafe.tokyo (line 135), mycharaful.com (line 146), animatecafe.jp + @animate_cafe (line 193), @jujutsu_plaza (line 95). Address, hours, dates, prices all sourced. Strong Q3 — exemplar pattern for the corpus. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Highest-density differentiation in the corpus: (a) translated Japanese-only event data into English with weekly update cadence (line 18: "Updated weekly. Last update: April 2, 2026"), (b) the booking-difficulty-first / location-second / merch-third prioritization framework (line 78), (c) per-cafe local tip ("Period 2 starts April 1 with new menu" line 121, "DECOTTO is the 1F Animate Annex not main store" line 195, "the bonus item system is random — but you can trade" line 257). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Built-in sustainability via "This Guide Is Updated Weekly" pattern + sister article tokyo-anime-collab-cafes-summer-2026 covering the next quarter. Each season's article serves as the rolling current-data anchor. The "Live Collab Cafe Calendar" link (line 322) is the always-fresh companion surface. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Sister article tokyo-anime-collab-cafes-summer-2026 covers June-August separately — different time window, no overlap. how-to-book-anime-collab-cafe-japan covers the booking mechanism abstractly — different intent. anime-collab-cafe-calendar (page route) is the live companion. Hub-and-spoke pattern, not cannibalization. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: cafes. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `cafes` is the dedicated silo and Collab Cafes is its label. Perfect fit. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Three Wikimedia body images at line 124, 266, 296 (all attributed). However lines 20, 55, 82, 103 reference `https://japan-pop-now.com/wp-content/uploads/...` paths — these are external-WP-CDN images, not repo-local. Per security.md "Allowlisted image hosts only" and per the universal image strict rule, these should be migrated to repo-local /images/articles/{slug}/ paths. **Not a hard R3 trigger** because the source is the site's own legacy WP CDN, not Unsplash/Getty/IP-key-visual — but it's a violation of the strict 4-axis rule's resolution + repo-local-storage axes. Flag for image migration, not hard-reject. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Author voice is explicitly Tokyo-local ("Insider Tips from a Tokyo Local" line 252). The trade-bonus-items tip (line 257) and the underrated-last-time-slot tip (line 263) are clearly first-hand experiential. Tokyo cafes are visit-able. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. This article is one of the corpus anchors — strong on every Phase 0 axis. Refer to this as the gold-standard template for cafes-silo articles.
- Tightening recs:
  - **Critical**: Migrate the 4 wp-content/uploads/2026/04/*.jpeg images (lines 20, 55, 82, 103) to repo-local `/images/articles/tokyo-anime-collab-cafes-spring-2026/` paths. External WP CDN paths violate the strict 4-axis universal rule's resolution-axis and bypass next/image optimization. They also create a single-point-of-failure dependency on the WP site that this article was migrated from.
  - Body has quirky alt-text mismatches: line 20 alt is "SPY×FAMILY anime fair at Animate" but caption text is "Shibuya street scene near PARCO" — these don't match each other and neither matches the actual described visual. Caption + alt + visual must agree per article-quality.md image rules.
  - Add structured `validUntil` field to YAML frontmatter (e.g., `validUntil: "2026-05-31"`) to systematize the seasonal-article fold-up plan that this article correctly does in body but not in frontmatter.
  - The "## [FamilyMart Anime Collab Stores 2026]" heading at line 316 with the link inside the heading is a markdown anomaly — should be a regular link inside a body block, not an H2 heading.

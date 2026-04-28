# Phase 0 Detailed Eval: spy-family-tokyo-fan-day-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/spy-family-tokyo-fan-day-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Multi-stop fan-day itinerary: WAKUWAKU PARK Ikebukuro/Shibuya, Shibuya Loft October pop-up, collab cafe rotation, Tokyo Character Street + Jump Shop Tokyo Station, game center prize routes, conbini collabs. Full-day 9:30-18:00 itinerary with budgets at line 113-129. Trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "SPY x FAMILY Tokyo events", "Anya merch Tokyo", "Spy x Family pop-up Shibuya" are continually-trending mid-tail keywords (Anya is one of the biggest single-character merch IPs of 2024-2026 per article line 93). EN competitors (TimeOut, IGN) cover individual events but no consolidated fan-day plan exists. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Critical Q3 weakness. WAKUWAKU PARK is described as "seasonal and unpredictable" (line 33) without official site link. Shibuya Loft pop-up is described as annual without 2026 confirmation. Collab cafes mentioned generically without dates or venues. The text repeatedly hedges ("usually runs", "often", "may not be running") because no live event data is anchored. The article lacks the official-source citation pattern that strong Q3 articles have (e.g., spyfamily-pj.com would be the home source). All factual claims are pattern-based not event-anchored. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES (weak) | The full-day itinerary stitching merch + cafe + game center + conbini is the unique stack. The trade-off (line 99): "second-hand prize figures sell at Mandarake and Surugaya for ¥800-2500 — often cheaper than what you'd spend trying to win them" is real insider knowledge. But the lack of dated/cited current events (Q3 weakness) bleeds into Q4 — competitors with current event data win on freshness even with thinner stacks. |
| Q5 | Sustainability (will have value 90 days from now) | NO | The article is structurally an evergreen frame with placeholder sections for time-limited events. WAKUWAKU PARK section says "If you're visiting in April 2026, it may not be running" (line 33) — that's an article-acknowledged Q5 failure. Without running events, the article reduces to "go to Tokyo Character Street, browse Mandarake, check conbini" — too thin. Article needs either (a) a rolling event-tracker that updates monthly, OR (b) a fold-up plan into a SPY×FAMILY hub anchored to confirmed permanent retail. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No SPY×FAMILY-specific sister article. Adjacent: spy-family-tokyo-guide path mentioned in tokyo-anime-district-guide line 227, but no .md file at that exact slug. Article occupies a unique niche. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: experiences. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `experiences` is valid for single-spot pop-culture experiences. Could arguably be `events` (Events & Pop-ups silo description explicitly mentions "time-limited anime exhibitions, pop-up shops"), but `experiences` is a defensible fit and the canonical silo migration noted both as legitimate. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | All three body images are Wikimedia with full attribution: Tokyo Skytree (CC BY-SA 4.0), Tokyo Solamachi (Kakidai, CC BY-SA 3.0), Sunshine City (Maplestrip, CC BY 3.0). Image Credits block at line 190-194 properly catalogs them. The frontmatter `imageNote` (line 10) explicitly flags "host venues" used as proxy for collab-specific photography pending Takapon visit — compliant with the universal image rule. No IP key visuals reproduced. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Tokyo Skytree, Solamachi, Sunshine City, Tokyo Character Street, Mandarake all easily accessible by Takapon. Game-center / Mandarake claims (line 93-99) imply prior visits. |

## Verdict
REJECT (0) — fails Q3 (source viability) and Q5 (sustainability)

## Recommendation
- REJECT — rewrite-recoverable. Two paths to flip:
  - **Path A (rolling hub):** Restructure as a SPY×FAMILY rolling event tracker — monthly refresh of currently-running pop-ups, cafes, conbini collabs with date stamps. Anchor permanent sections (Jump Shop Tokyo Station, Mandarake, Animate) as the evergreen base. Add `lastUpdated` weekly cadence to the YAML frontmatter (currently shows 2026-04-03). This converts Q5 NO → YES.
  - **Path B (fold-up):** If rolling-hub maintenance isn't viable, fold this article into a broader Tokyo-anime-event-tracker with SPY×FAMILY as one of 5-10 IPs covered. The `tokyo-anime-collab-cafes-spring-2026` article (also in this batch) is structurally close to this pattern.
- Q3 fix on either path: cite spyfamily-pj.com (official IP site), shibuya.loft.co.jp event archive, kbsfm.co.jp (TBS partnership), specific Animate collab pages with URLs. Currently zero inline citations to official IP/venue sources.
- Image side: 3 Wikimedia body images for ~1500 words is fine on count axis, but the topic axis is weak (host-venue exteriors used as proxy for SPY×FAMILY-specific events) — flagged in the article's own `imageNote` and in docs/audit/collab-image-exhausted-20260427.md per project memory. Unless a current SPY×FAMILY collab is running and Takapon-photographed, this image set is the best available; the strict 4-axis rule should clear under the documented exhausted-image escape valve.
- Don't ship the rewrite without resolving Q3 and Q5 — the structural issues here are not a citation pass alone.

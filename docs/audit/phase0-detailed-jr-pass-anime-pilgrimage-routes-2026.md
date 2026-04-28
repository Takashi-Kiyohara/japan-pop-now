# Phase 0 Detailed Eval: jr-pass-anime-pilgrimage-routes-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 3)
Article reference: content/articles/jr-pass-anime-pilgrimage-routes-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Anime-pilgrimage-route-specific JR Pass guide. Article delivers 4 specific routes (Tokyo→Kamakura→Hakone, Tokyo→Kyoto→Osaka, Tokyo→Kumamoto, Tokyo→Chichibu→Kawagoe) with per-route cost math, JR Pass break-even calculations (line 92-148), and route-level decisions ("skip pass on Chichibu trip" — line 148). Trip-actionable for the multi-city anime fan. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "JR Pass anime pilgrimage", "JR Pass One Piece Kumamoto" — niche-but-existing demand. EN competitors don't typically frame JR Pass through anime routes specifically. Useful positioning, but Q2 is "yes" on niche intent only — overall volume is moderate. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Sourcing is weak. JR Pass prices (50,000 yen / 80,000 yen / 100,000 yen — line 43-44) repeated from sister articles without independent citation. Klook / Viator / GetYourGuide named as authorized retailers (line 162) but URLs not provided. JR exchange office locations listed without official source link. Wikimedia images for trains/passes are well-credited (line 117, 152) but the textual facts (route fares Tokyo-Kumamoto 24,150 yen, etc.) are uncited. Q3 fails on source-anchor density. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) anime-route-specific framing (Your Name + Evangelion together, Demon Slayer + Detective Conan together — line 32-33), (b) explicit route-by-route ¥-saving math with pass-loses-on-Chichibu (line 142-148), (c) the personal "I've blown money on a pass where IC cards would have saved 15,000 yen" anecdote (line 18). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Annual refresh-cadence article (slug includes 2026). JR Pass pricing and route fares are stable. Refresh in Q1 each year captures any pricing changes. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | This is the SAME R1 trigger as flagged in `japan-rail-pass-2026-guide` evaluation. The JR-Pass triangle: (a) `japan-rail-pass-2026-guide` (math/calculator, dominant — 27 inbound), (b) `japan-rail-pass-guide-anime-fans` (anime overview), (c) `jr-pass-anime-pilgrimage-routes-2026` (this article — route-driven). Topic overlap >60% with both siblings. The three articles share buying-flow instructions, exchange-office lists, and JR Pass pricing tables. Per cannibalization sweep recommendation: keep `japan-rail-pass-2026-guide` as canonical, fold this article's route content into the canonical, OR refocus this article tightly to "anime-pilgrimage-only routes" (drop buying instructions, drop pricing, just route comparisons). R1 triggers; recoverable via consolidation. |
| R2 | Silo violation (not in 5 silos) | YES | **R2 TRIGGER**. Category in frontmatter is `destinations` (line 6). Per article content (JR Pass route math + buying flow), this is a transit/practical guide — the canonical category should be `experiences` (matching the other two JR Pass siblings, both `experiences`). The category was set when destinations was a valid silo (pre-2026-04-19) but the canonical migration shows route-pilgrimage articles map to `destinations`. However: this article is more about PASS BUYING than about the destinations themselves; sister `slam-dunk-kamakura-pilgrimage-2026` also uses `experiences`. Inconsistency in the corpus. R2 still fires under strict canonical mapping (the article content is travel-tips/transit, not destination guide). |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images all Wikimedia Commons: Shinkansen N700 Hakata (ERIC SALARD / CC BY-SA 2.0 — line 118), JR Rail Pass cards (Emile Donzel / CC BY-SA 4.0 — line 153). featuredImage `featured.jpg` (line 8) is non-Wikimedia naming pattern with no credit — needs license verification per image strict universal rule. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer voice indicates lived experience: "I've done this route twice now (once in 2024, once in early 2026)" (line 113), "I've blown money on a pass where IC cards would have saved 15,000 yen" (line 18). Multi-trip framing; first-hand confirmed. |

## Verdict
REJECT (0) — R1 cannibalization + R2 silo + Q3 source viability

## Recommendation
- REJECT — three blockers but each independently fixable:
  - **R1 fix**: this article is the WEAKER sibling in the JR Pass triangle. Strong recommendation: noindex + canonical→japan-rail-pass-2026-guide. OR refocus tightly to "anime-only routes for JR Pass holders" (drop the JR Pass system explanation and buying flow at line 38-78 and line 155-188; assume reader has the system understanding from the canonical sibling).
  - **R2 fix**: change category from `destinations` to `experiences` to match the canonical 5-silo mapping AND match the other two JR Pass siblings. The article's primary intent (transit decision tool) is travel-tips/experiences, not destination guide.
  - **Q3 fix**: add inline citations for JR Pass pricing (japanrailpass.net), Klook / GetYourGuide / Viator URLs (line 162), and JR exchange office hours/locations (line 175-180).
  - **Tactical fix**: line 82 has a corrupted opening fragment ("s the long haul. Kumamoto is home to..." — looks like a paste error losing the Route 3 heading). Restore the full Route 3 intro with a clear `## Route 3:` heading.
  - Once all four fixes addressed, Q1/Q4/Q5 already pass — this could become PROCEED.
</content>

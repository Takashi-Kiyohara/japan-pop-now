# Phase 0 Detailed Eval: anime-day-trips-from-tokyo-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/anime-day-trips-from-tokyo-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Article delivers a Tokyo-base traveler's exact decision: which day trip, what cost, what train. Six destinations with travel time, cost, JR Pass coverage table (line 42-50). Hour-by-hour Kamakura half-day (line 86), Hakone full-day (line 94-102). Fully trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Anime day trips from Tokyo" / "anime pilgrimage day trip" — niche enough that EN competitors are pilgrimage-specific (Slam Dunk, Evangelion blogs) rather than comparative. The 6-destination JR-Pass-math angle has thin EN coverage. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | The article cites zero outbound sources. Specific claims — Hakone Free Pass ¥6,100 from Shinjuku, Romance Car ¥2,470, Anohana free pilgrimage maps at Seibu-Chichibu Station, Oarai Ankou Festival 155,000 visitors in 2025 — all need official citations (odakyu.jp, oarai.jp, seibu-railway.jp). The 155,000 figure is an Oarai tourism stat that needs sourcing. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | The JR Pass coverage breakdown (line 71-78) is the key differentiation — converts each destination into pass-economics. EN competitors usually do "top day trips" without the rail-pass math. The "best with JR Pass: Nikko + Oarai" insight is genuinely useful. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Day trip destinations are stable — Kamakura, Hakone, Nikko, etc. are evergreen. Annual refresh for ticket prices and JR Pass rates. No event-tied risk. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Tangential overlap with `slam-dunk-kamakura-pilgrimage-2026`, `kamakura-slam-dunk-pilgrimage-2026`, and `jr-pass-anime-pilgrimage-routes-2026`. But this is parent/hub vs. specific deep-dives. <60%. The Slam-Dunk Kamakura double-up (two slugs at content/articles/slam-dunk-kamakura-pilgrimage-2026 and kamakura-slam-dunk-pilgrimage-2026) is a separate cannibalization issue NOT involving this article. |
| R2 | Silo violation (not in 5 silos) | YES | Category: "destinations" (line 6) — not one of the 5 silos. Should be `anime-pilgrimage` (because the article frames every day trip around an anime IP). Same corpus-wide silo issue as `akihabara-complete-guide-2026`. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia Commons used (Kamakura Daibutsu, Lake Ashi cruise, Nikko Toshogu, Mt. Fuji at Kawaguchi, Chichibu Bridge, Oarai shrine — lines 38, 96, 117, 132, 146, 163). featured.jpg uncertain provenance. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Voice is generic ("I've organized these six destinations") — could be desk research. But all six destinations are publicly accessible day trips; first-hand path remains viable. |

## Verdict
REJECT (0)

## Recommendation
- REJECT — rewrite-recoverable. R2 silo violation is fixable in frontmatter (`destinations` → `anime-pilgrimage`).
- Tightening recs after silo fix:
  - Q3: add 6 inline citations — one per destination — to the official tourism office or rail company site (odakyu.jp for Hakone Free Pass, oarai.jp for festival numbers, jrpass.com or canonical JR for pass coverage).
  - Image floor: 6 of 7 needed per prescreen — uplift by 1 image.
  - Verify the 155,000 visitor 2025 Oarai Ankou Festival claim against an official 2025 figure.
- Re-run Phase 0 after silo fix and citations land.

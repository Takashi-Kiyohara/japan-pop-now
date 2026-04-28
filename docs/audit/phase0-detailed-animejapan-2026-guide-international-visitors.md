# Phase 0 Detailed Eval: animejapan-2026-guide-international-visitors
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/animejapan-2026-guide-international-visitors.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Article addresses overseas visitors directly with venue access, family compatibility (Family Anime Festa), and Odaiba pairings (line 16-22). Concrete decision frame: should I prioritize this event on my March 28-29 weekend? |
| Q2 | Search intent fit (demand exists; English competitors weak) | NO | "AnimeJapan 2026" is a major brand keyword; the official anime-japan.jp/en/ site dominates positions 1-3, plus GO TOKYO official tourism (cited as source [1]). Hard to outrank a year-after-year canonical event listing with ~1700 words and no insider hook. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Sources cited inline — GO TOKYO official tourism listing and anime-japan.jp/en/ (lines 149-150). Dates, venue halls, station distances all traceable to official channels. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | NO | The article's value-add (family angle, "build trip around the weekend", Odaiba pairing) is generic-tier. No insider mechanic — no ticket lottery walkthrough, no booth priority strategy, no merch queue timing. Reads like a re-statement of the GO TOKYO listing. |
| Q5 | Sustainability (will have value 90 days from now) | NO | Event is March 28-29, 2026 — already passed by 2026-04-28. The article has 1 inbound link (per prescreen) and no folding plan into a hub. Will become orphaned post-event. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | `animejapan-comiket-2026-guide` covers AnimeJapan tickets, access, and survival in more detail (line 16-60 of that article). The two articles overlap by >60% on AnimeJapan content; the comiket-comparison version is the stronger parent. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Fits the 5-silo set. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia Commons photos used (Tokyo Big Sight imagery, lines 21,49,141). Featured image at /featured.jpg uncertain provenance — needs verification but no clear ban hit. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Wording is generic ("If this is your first convention day in Japan, build in extra buffer time") — could be written without ever attending. But event is annual and walkable, so first-hand path remains viable for future refresh. |

## Verdict
REJECT (0)

## Recommendation
- REJECT — rewrite-recoverable. The cannibalization with `animejapan-comiket-2026-guide` is the load-bearing failure. Action: merge content into the AnimeJapan vs Comiket guide as a dedicated AnimeJapan section, then 301-redirect this slug or set `noindex,follow`. Keep the AnimeJapan brand in the comiket comparison guide — that's the article that has the differentiation hook (vs. Comiket comparison) the standalone version lacks. Per CLAUDE.md "Never delete files from the repo," prefer noindex over deletion.

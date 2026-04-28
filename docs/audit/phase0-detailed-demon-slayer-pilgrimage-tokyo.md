# Phase 0 Detailed Eval: demon-slayer-pilgrimage-tokyo
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch)
Article reference: content/articles/demon-slayer-pilgrimage-tokyo.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Demon Slayer is the highest-volume anime IP for tourism in 2024-2026. Article delivers Asakusa Senso-ji connection, two guardian shrines (Numabukuro Hikawa for Tomioka Giyu, Takinogawa Hachiman for Kocho Shinobu) with addresses, Mt. Kumotori hike route, and Ashikaga Flower Park wisteria connection. Trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Demon Slayer pilgrimage Tokyo" / "Tomioka Giyu shrine" / "Tanjiro mountain Tokyo" — moderate volume, EN competitors are JapanTravel.com and TimeOut with surface coverage. The two-shrine ubusuna-jinja angle and Mt. Kumotori inclusion are unique. 19 inbound links per prescreen. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Article cites zero sources. Verifiable claims — Numabukuro Hikawa founded 1346, Takinogawa Hachiman 800 years, ¥300-500 goshuin price, ufotable cafe lottery system, Kimetsu Food Hall pop-up at Yurakucho Marui — none have inline citations. Mt. Kumotori 2,017m is verifiable; the ubusuna-jinja "Two Shrines Tour" official program needs citation to its official source. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | (a) Insider mechanic — the two-shrine combo half-day routing (line 61), the Kaminarimon "burned 1865, rebuilt 1960" historical note explaining anime's absent gate (line 27). (b) Mt. Kumotori detailed hike logistics with elevation, season, transit (line 63-82). (c) Ashikaga Flower Park wisteria-LED-show fallback for off-season (line 151). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Demon Slayer continues as a marquee IP through Infinity Castle film cycle 2026-2027. The shrines and Mt. Kumotori are permanent. Cafe pop-ups need annual refresh. Evergreen with refresh. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | `anime-pilgrimage-spots-tokyo` covers some pilgrimage spots but at hub-level breadth. This article is the Demon Slayer-specific deep-dive. <60% overlap. |
| R2 | Silo violation (not in 5 silos) | YES | Category: "destinations" (line 6). Should be `anime-pilgrimage`. Same corpus-wide silo issue affecting this and other "destinations" articles. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia Commons used for Kaminarimon (line 30) and Mt. Kumotori summit (line 70). One image at line 98 references `https://japan-pop-now.com/wp-content/uploads/2026/04/demon-slayer-capsule-merch-2026.jpg` — this is an external HTTP URL, not a /public/ path, which is non-standard for the project (CLAUDE.md: "Every image path in `.md` MUST have a corresponding file in `public/`"). Provenance unclear; could be an in-house photo but the path violates the local-image rule. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Both shrines and Asakusa are publicly accessible. Mt. Kumotori is a public mountain. First-hand path viable. Voice doesn't strongly claim visit but doesn't fabricate either. |

## Verdict
REJECT (0)

## Recommendation
- REJECT — rewrite-recoverable. Two issues:
  1. R2 silo violation: change `category: "destinations"` to `category: "anime-pilgrimage"`. Structural fix.
  2. Image rule violation at line 98: external HTTP URL `https://japan-pop-now.com/wp-content/uploads/...` violates local-image rule. Either move that image into `/public/images/articles/demon-slayer-pilgrimage-tokyo/` and update the path, or remove if provenance is uncertain.
- Tightening recs after R2 fix:
  - Q3: add 5-6 inline citations — Numabukuro Hikawa Shrine official site, Takinogawa Hachiman Shrine official site, Mt. Kumotori Chichibu-Tama-Kai National Park page on env.go.jp, ashikaga.flower-park.co.jp for wisteria dates, ufotable.com for cafe info.
  - Image floor: 3 of 6 needed per prescreen — substantial uplift required (50% gap).
- Strong content but R2 silo fail + image-path violation make this REJECT pending fixes. With those handled, re-run Phase 0 — this is high-value content (19 inbound links).

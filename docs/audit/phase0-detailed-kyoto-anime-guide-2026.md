# Phase 0 Detailed Eval: kyoto-anime-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/kyoto-anime-guide-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Kyoto is a top-3 Japan trip city. KyoAni / Hibike Euphonium / K-On! pilgrimage routes are concretely actionable: Byodo-in (¥700, 8:30-17:30), Ujigami Shrine, Fushimi Inari, Toei/Uzumasa Kyoto Village (¥2,800), Animate Kyoto. Specific addresses, hours, station access — all trip-ready. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Kyoto anime guide" / "Hibike Euphonium pilgrimage" / "KyoAni shop Uji" — solid long-tail demand. English competitors are mostly single-IP single-spot blog posts. A multi-IP comprehensive Kyoto anime hub with pilgrimage + shopping + studio context is a real gap. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Byodo-in fees, Ujigami Shrine hours, Fushimi Inari (free 24/7), Toei/Uzumasa Kyoto Village rename (March 28, 2026) and pricing — all verifiable on official .jp sites. KyoAni Shop and Animate Kyoto have official web presence. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) Comparative — covers KyoAni connection + Hibike + K-On! + Fushimi Inari + Toei Studio Park + Animate in one stack-level guide; English competitors usually do single-series; (b) Recency — captures the March 28, 2026 Toei → Uzumasa Kyoto Village rename; (c) Practical April 2026 events overlap (JJK Sweets Paradise, FFXIV pop-up, Miyako Odori). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Kyoto pilgrimage sites are evergreen — Byodo-in, Fushimi Inari, KyoAni Uji are permanent. Annual refresh cadence works (event listings rotate, but core route is stable). The Toei rename note becomes future history rather than obsolete. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No existing Kyoto-anime hub. Some overlap with `osaka-anime-guide-den-den-town` (Kansai region) but Kyoto vs Osaka are distinct destinations. No `your-name-pilgrimage-tokyo` overlap because that targets Tokyo-based locations. |
| R2 | Silo violation (not in 5 silos) | NO | Category: destinations. Valid silo (cafes/events/destinations/experiences/culture). |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia photos used throughout: Kyoto Station (Falbisoner CC BY-SA 4.0), KyoAni HQ (Konomi PD), Byodo-in Phoenix Hall (Falbisoner CC BY-SA 4.0), Ujigami (663highland CC BY-SA 3.0), Tetsugaku no Michi (Reggaeman CC BY-SA 3.0), Fushimi senbon-torii (Jason Zhang CC BY-SA 3.0), Toei studio aerial (Grinenko CC BY-SA 4.0). All compliant per official-source-priority rule. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer claims first-person KyoAni pilgrimage (line 23: "I've spent weeks tracking these locations"), Hibike route walked (line 69), Fushimi at dawn (line 122), Toei March visit (line 143). Kyoto is accessible — first-hand path viable for refresh. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Strong Phase 0. Tightening recs:
  - Excerpt and description show truncated text starting "Last updated: April 2026. Kyoto Anime..." with broken syntax (line 3, 11) — should be rewritten as proper unique meta description.
  - Title contains "Pilgrimages, Studios & Otaku Culture" but H1/intro repeat as plain text rather than title-cased H2 (line 18-21 has duplicate quasi-titles). Cleanup needed.
  - Line 21 has mojibake characters (`èå°å·¡ç¤¼` should be 聖地巡礼). Same on line 22, 78, 204, 232 — encoding issue from WP migration.
  - `relatedSlugs: []` is empty; populate with 3-5 (e.g., `osaka-anime-guide-den-den-town`, `tokyo-anime-district-guide`, `your-name-pilgrimage-tokyo`).
  - Per image strict universal rule: 7 Wikimedia images deliver topic axis well (KyoAni HQ, Phoenix Hall, Ujigami, Tetsugaku, Fushimi, Toei). Real-photo axis PASS, count axis adequate for ~3000 word article.

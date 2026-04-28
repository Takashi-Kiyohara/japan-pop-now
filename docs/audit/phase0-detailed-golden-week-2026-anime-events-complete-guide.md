# Phase 0 Detailed Eval: golden-week-2026-anime-events-complete-guide
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/golden-week-2026-anime-events-complete-guide.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | GW 2026 starts in 1 day from eval date (April 29). 15-event comparison table with reservation status (lines 53-69), top-5 ranked recommendations (lines 71-77), reservation timing tiers (lines 79-100), three one-hour Tokyo neighborhood plans (lines 113-140), pre-visit checklist (lines 148-157). All immediately trip-actionable for the 7-day window April 29 - May 5. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Golden Week 2026 anime events" is a near-zero-EN-coverage long-tail. Domestic JP coverage is strong but in Japanese; English-speaking GW visitors have no comparable resource. The article is timely — published April 20, evaluated April 28, GW starts April 29. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Frontmatter line 21: "Dates, prices, and reservation status re-verified against operator official sites on the same day." Body line 162-163: "Dates and prices verified against: operator official sites (ufotable.com, cafe.animate.co.jp, sweets-paradise.jp, box-cafe.jp, ohmycafe.jp, sun-and-the-moon.jp, sanrio.co.jp, krispykreme.jp)" — explicit cross-check list. Internal links to the Demon Slayer ufotable guide + my-hero-academia-cafe-tokyo-2026 deep-dives. PASSES Q3. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the 15-event matrix that consolidates IP × venue × city × dates × reservation status — no EN site does this for GW, (b) three "fail → success" stories from GW 2025 (lines 142-146) that encode insider experience, (c) one-hour neighborhood plans (Ikebukuro Animate Cafe corridor, Akihabara loop, Shibuya-to-Omotesando strip — lines 113-140) with timed step-by-step routes most EN guides don't produce. |
| Q5 | Sustainability (will have value 90 days from now) | NO | GW ends May 5. After that, the specific events are over and the article's primary value evaporates. The article does have a "Next scheduled refresh: May 1, 2026 (mid-GW)" annotation (line 161) and lists "How fresh is this guide?" (line 158) — that's the right discipline. But there's no documented post-event fold-up plan ("becomes the GW 2026 retrospective" / "rebuilds for GW 2027"), no `validUntil` field. After May 5 the article will be stranded unless reformatted. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No other GW 2026 hub article. The Demon Slayer ufotable, MHA Cafe Tokyo etc are referenced as deep-dives, not duplicated content. This is the umbrella article above the deep-dives — distinct topic. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 8). Valid per canonical 5 silos. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero image at `/images/articles/golden-week-2026-anime-events-complete-guide/featured.webp` is described as "Spring 2026 anime collab cafe storefront in Tokyo with Golden Week queue forming" — assumed Takapon original. Frontmatter line 14 credits "Photo: Guilhem Vellut via Wikimedia Commons (CC BY 2.0)" for an alternate (koinobori carp streamers) image. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "After running the circuit through last year's GW and cross-checking every 2026 event against operator calendars on April 20, here is the honest English-first guide" (line 28). The 3 fail→success stories from GW 2025 (lines 142-146) explicitly anchor first-hand experience. Path strong. |

## Verdict
REJECT (0) — Q5 fail

## Recommendation
- REJECT, rewrite-recoverable. One fix:
  1. **Q5 fix**: Add `validUntil: "2026-05-05"` to frontmatter and document the post-GW transition. Best architectural option: structure the article as a rolling annual hub — `golden-week-anime-events-japan` (no year) — that gets year-bumped each spring. Each year's content becomes the historical reference for the next year's "fail → success" stories. This makes Q5 sustainable in perpetuity.
- After Q5 fix — flips to PROCEED. All other Phase 0 questions and reject criteria pass cleanly.
- Note: this is exactly the kind of high-quality, time-bound content that the corpus produces well but doesn't yet have a fold-up architecture for. Establishing the rolling-annual-hub pattern with this article would set a precedent for future seasonal/event coverage (Comiket, Halloween, Year-End, etc).
- The "Re-verify within 48 hours of your visit" header (line 164) is excellent reader-trust discipline and should be replicated across event-tied articles.

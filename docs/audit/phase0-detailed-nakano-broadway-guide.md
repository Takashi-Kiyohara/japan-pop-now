# Phase 0 Detailed Eval: nakano-broadway-guide
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/nakano-broadway-guide.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Nakano Broadway is one of Tokyo's top-3 anime shopping destinations. Article delivers floor-by-floor breakdown (B1 Daily Chico → 4F specialty), 30+ Mandarake stores explained, walking route from Shinjuku (5 min JR Chuo), price guide for figures/manga/cels, Wednesday closure warning, weekday afternoon timing tip. Concretely useful. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Nakano Broadway guide" / "Mandarake Nakano" / "Daily Chico ice cream" — solid steady demand. English competitors exist (Tokyo Cheapo has coverage) but typically thinner — article's vintage-vs-Akihabara comparison angle and floor-by-floor depth is competitive. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Address (5-52-15 Nakano), JR Chuo Line 5 minutes ¥200, building hours 10:00-20:00, third-Wednesday-of-Feb annual closure — all verifiable on Nakano Broadway / Mandarake official sites. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) Comparative — explicit Nakano vs Akihabara head-to-head table (line 95-103); (b) Insider mechanic — "most shops open at 12:00 not 10:00" (line 133), Wednesday closure warning, weekday afternoon timing; (c) Stack-level — area-guide stack (hero → 1-hour anchor → 4-hour anchor → access map → eat → CTA) per article-quality.md spec. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Nakano Broadway is a permanent destination since 1966. Article is evergreen by silo definition (destinations / area-guides). Annual refresh sufficient. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Distinct from `akihabara-complete-guide-2026` (different district), `ikebukuro-anime-guide-2026` (different district). Comparative content references Akihabara/Ikebukuro but doesn't duplicate them. |
| R2 | Silo violation (not in 5 silos) | NO | Category: destinations. Valid silo. Area-guide content correctly placed in destinations post-2026-04-19 migration. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Wikimedia images: Mandarake Nakano (LeLaisserPasserA38 CC0, line 16-17) and Nakano Broadway entrance (Kentin CC BY-SA 3.0, line 30-31). **One concern**: line 83 references `https://japan-pop-now.com/wp-content/uploads/2026/04/conan-namco-campaign-2026.jpg` for the Daily Chico soft serve — this is a hot-link to a Conan campaign image hosted on the production WordPress URL, used as a **proxy** for soft serve. This is a topic-axis violation: a Detective Conan Namco campaign image is not soft serve, regardless of whether it's first-party hosted. Strict 4-axis rule (project memory) requires topic match. **Borderline R3**, doesn't strictly hit the source-ban list (Unsplash/Getty/IP-without-permission/generation), but is a topic-mismatch. Logging as a NO for R3 but flagging as a Phase 2 image-fix requirement. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | First-person voice throughout (line 21: "the people who actually collect…they go to Nakano Broadway"; line 35: "Don't skip Nakano Sun Mall"; line 91: "People try. It never ends well."). E-E-A-T signal present. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Strong area-guide. Required tightening:
  - **Image fix (high priority)**: Replace line 83 image (Conan Namco campaign jpg used as Daily Chico soft serve proxy) with either a Wikimedia Daily Chico photo or a Takapon-shot Nakano Broadway soft serve image. This is a topic-axis fail per project memory's strict 4-axis universal rule.
  - `relatedSlugs: []` empty — populate with `akihabara-complete-guide-2026`, `ikebukuro-anime-guide-2026`, `tokyo-anime-district-guide`, `shibuya-harajuku-pop-culture-guide` etc.
  - `tags: []` empty — populate.
  - `wpPostId: 204` indicates WordPress migration; check excerpt/description duplication risk.
  - Internal link section (line 161-170) has duplicates (Akihabara, Ikebukuro listed twice). Cleanup needed.

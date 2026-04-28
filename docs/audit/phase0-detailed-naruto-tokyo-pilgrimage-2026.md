# Phase 0 Detailed Eval: naruto-tokyo-pilgrimage-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/naruto-tokyo-pilgrimage-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES — but qualified | Naruto fans visiting Tokyo will find concrete actionable content: Anime Tokyo Station Ikebukuro, Princess Cafe collabs, Animate Cafe Stand Hareza, Jump Shop Shibuya MIYASHITA PARK, Mugiwara/etc. **However**, the article's own thesis is that "Naruto's primary pilgrimage destinations lie far from the capital" (line 19) — the actual Naruto seichi (Tokushima Naruto City, Okayama Nagi, Awaji Nijigen no Mori) are NOT in Tokyo. Article is fundamentally about Tokyo touchpoints rather than true pilgrimage. Useful but framed honestly as a workaround. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Naruto Tokyo" / "Naruto pilgrimage Japan" / "Naruto cafe Tokyo" — Naruto's massive global fanbase generates steady demand. English competitors exist but tend to focus on Awaji or Tokushima; a Tokyo-centric guide that's honest about the limits is differentiation. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES — but soft | Anime Tokyo Station, Jump Shop Shibuya MIYASHITA PARK, Nijigen no Mori (¥3,300 day pass) — verifiable on official sites. Princess Cafe scheduling cited but generic ("November 2025 event slot"). Sources section (line 301-308) lists 6 official URLs. Some pricing notes are conservative ranges rather than exact. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Two differentiation hits: (a) Honest framing — explicitly states Naruto pilgrimage centers outside Tokyo (line 19), then maps the realistic Tokyo touchpoints; (b) Practical routing — 6-8 hour Tokyo route (line 209), seasonal collab calendar (line 234-238). The "honest about limits" angle is rare. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Naruto remains a top-tier evergreen IP with Boruto continuity. Tokyo touchpoints (Jump Shop, Anime Tokyo Station, Animate Cafe Stand) are permanent. Annual refresh sufficient. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No existing Naruto pilgrimage article in corpus. References related articles (Demon Slayer Pilgrimage, JJK Shibuya Locations, Your Name) which are sibling pilgrimages, not duplicates. |
| R2 | Silo violation (not in 5 silos) | NO | Category: destinations. Valid silo (anime-pilgrimage merged into destinations post-2026-04-19). |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images are Wikimedia Commons (Hareza Ikebukuro, Shibuya PARCO Hulic, Otome Road, MIYASHITA PARK aerial, Animate Annex, Ikebukuro Station east — all Wikimedia per featuredImageAlt and standard project pattern). Hero credit: "Photo: Dick Thomas Johnson via Wikimedia Commons (CC BY 2.0)" line 10. No IP key visuals reproduced. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO — but soft | Writer claims first-person research ("My first stop was…", "When I visited…", "I observed…"). However, line 138-141 explicitly says "I cannot personally complete this journey within article timeframe constraints" for Nagi Town. Tokyo first-hand viable; remote pilgrimage points explicitly flagged as not visited. Acceptable. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Acceptable but flag for refresh:
  - The thesis "primary destinations lie far from the capital" is honest and adds credibility, but readers searching "Naruto Tokyo" want pure Tokyo content. Consider splitting into "Naruto Tokyo Touchpoints Guide" (focused) + "Naruto Pilgrimage Beyond Tokyo (Awaji, Tokushima, Okayama)" (extended) to better match search intent.
  - Princess Cafe specifics are dated ("November 2025 event slot") — needs current 2026 event calendar.
  - `wpPostId: 0` and `relatedSlugs: []` and `tags: ["Naruto", "anime-tourism", ...]` — relatedSlugs empty, populate.
  - Several "Sources" listed (line 301-308) — strong E-E-A-T.
  - Image strict universal rule: 6 Wikimedia photos, all properly attributed. Topic axis decent (pilgrimage venue context shots), real-photo PASS, count axis adequate.
  - Line 264: "Tag us in your Naruto pilgrimage photos on Instagram: @japanpopnow" — typo, should be @japan_pop_now.
  - Cross-silo links (line 285 "/category/food-tourism/", line 287 "/category/creator-interviews/") point to non-existent categories per the 5-silo lib/categories.ts. Fix.

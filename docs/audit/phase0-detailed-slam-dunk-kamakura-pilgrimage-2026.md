# Phase 0 Detailed Eval: slam-dunk-kamakura-pilgrimage-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 5)
Article reference: content/articles/slam-dunk-kamakura-pilgrimage-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Trip-actionable: exact crossing address (line 55), 1-min walk from Kamakurakokomae Station, Enoden 12-min frequency, 9:00-17:00 staff hours (line 139), JR Yokosuka direct from Tokyo Station 55min/¥950 (line 92), Shonan-Shinjuku from Shinjuku 60min/¥950 (line 107), 3-4hr half-day route with hour-by-hour timing (line 117-131). |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Slam Dunk crossing", "Kamakura High School", "Kamakurakokomae station" are post-First-Slam-Dunk-movie keywords with steady demand from EN/CN/KR fans (article notes multilingual signage at line 139). EN competitors (TimeOut, JapanGuide) cover Kamakura generally but not the Slam-Dunk-specific photo-spot framing with managed-tourism-system context. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES (weak) | Address, station, fares, train frequency all concrete and correct as of 2026. Mentions "managed tourism program that started in October 2025" (line 138) — this is a Kamakura City policy that should link to city.kamakura.kanagawa.jp source. Enoden Day Pass ¥800 (line 96) should link to enoden.co.jp. Box-office ¥16.2 billion claim (line 23) should link to Kogyo Tsushinsha. Facts correct, citations missing. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) the managed-tourism-system framing — explicit acknowledgement of the 2023 chaos vs the 2025+ Koegoe Rakko Park designated photography area (line 139), (b) the Ryonan-vs-Shohoku high school clarification (line 73 + FAQ 200) — most EN content gets this wrong, (c) early-morning-before-7am tip + Shichirigahama → Hase Daibutsu sequencing that lets you cover the major spot + Kamakura's iconic Big Buddha in one pass. |
| Q5 | Sustainability (will have value 90 days from now) | YES | The crossing is a permanent public location. The IP (Slam Dunk, post-2022 movie) has long tail. Managed-tourism rules are stable and recently implemented (Oct 2025), unlikely to change in 90 days. Evergreen with annual refresh on staff hours / fare prices. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES (resolved) | content/articles/kamakura-slam-dunk-pilgrimage-2026.mdx exists and covers the same primary keyword + same locations. **However** this article (slam-dunk-kamakura-pilgrimage-2026.md) already has `robots: "noindex,follow"` and `canonical: "https://www.japan-pop-now.com/articles/kamakura-slam-dunk-pilgrimage-2026"` in frontmatter (line 14-15), correctly pointing to the .mdx sibling. R1 has been pre-resolved by canonical assignment. The .mdx article is the canonical surface; this .md article is the historical / archive copy. Both can coexist if the noindex+canonical signals are honored. |
| R2 | Silo violation (not in 5 silos: cafes, events, destinations, experiences, culture) | NO | Category: destinations. Per canonical 5-silo list (lib/categories.ts effective 2026-04-19), `destinations` is a valid silo and explicitly covers anime-pilgrimage content per the description ("Your Name locations, and the real-world places behind your favorite series"). |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Image 1 explicitly Wikimedia (Yuya Tamai, CC BY 2.0, line 48). Images 2-7 are repo-local paths (1-7.jpg/.webp). No IP key visuals from Slam Dunk reproduced — locations only. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Image 1 caption indicates Yuya Tamai's Wikimedia photo. Article references on-the-ground details (the 4:00-5:00 PM golden hour line 64, the Amalfi Cafe terrace line 124, the Hase-dera area restaurants line 127) — Kamakura is 1hr from Tokyo, easy first-hand visit by Takapon. |

## Verdict
PROCEED (100) — but treat as canonical-resolved sister; primary index target is the .mdx version

## Recommendation
- PROCEED with caveat: this article is already noindex+canonical-redirected to kamakura-slam-dunk-pilgrimage-2026.mdx. Phase 0 still passes for the content quality, but R1 cannibalization is real and resolved by SEO signals only.
- Tightening recs:
  - Frontmatter shows mojibake corruption: line 4 description has "Â¥4,700-5,700" and line 21 body has "â" instead of em-dash — these are character-encoding artifacts from a bad import. Mojibake hits Japanese characters too: line 50 ("éåé«æ ¡å1å·è¸å") should read "鎌倉高校前1号踏切". Fix charset on next refresh.
  - Add inline citations: Kamakura City managed tourism page, enoden.co.jp day pass page, Kogyo Tsushinsha box office figure to flip Q3 to strong-pass.
  - Body images at line 47, 68, 86, 113, 135, 151, 235 — verify all 1-7.jpg/.webp exist in `public/images/articles/slam-dunk-kamakura-pilgrimage-2026/` and that lines 135 and 151 ("Is the Crossing Still Crowded in 2026?" and "What Should You Know About Etiquette and Local Rules?") aren't placeholder-quality. The image alt-text format on those is suspicious: matches `${heading} — ${title}` template, suggesting auto-generated alt-text on a generic body shot.
  - Consider deprecating this .md in favor of the .mdx — once content is fully migrated, redirect this slug to /articles/kamakura-slam-dunk-pilgrimage-2026 at the Next.js routing layer rather than keeping two source files.

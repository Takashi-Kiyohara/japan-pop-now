# Phase 0 Detailed Eval: detective-conan-pilgrimage-events-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/detective-conan-pilgrimage-events-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | 30th anniversary year, 12-city tour with date schedule (lines 60-68), 29th movie tie-in for Yokohama (line 53), Sunshine City collab through June 7 (line 84-100), USJ Conan World through June 30 (line 132-141), Tottori Conan Town logistics (lines 113-129). The article packs 5+ distinct trip-actionable events into one piece. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | Detective Conan 30th anniversary is the year's biggest non-Demon-Slayer anime moment in Japan. EN coverage is thin — most non-Japanese fans don't even know about Conan Town in Tottori. Long-tail search demand: "conan station tottori," "USJ conan world," "conan 30th exhibition tour" — all underserved by EN content. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Sparse inline citations. Mentions "Lawson Ticket (l-tike.com)" (line 70) and "conan-cafe.jp" (line 110), "e-tix.jp/gamf/" (line 118), "usj.co.jp" (line 143) — these are URL mentions not anchor-linked citations. Specific dates ("Apr 4 – Apr 26 Tottori, May 2 – May 31 Sapporo," lines 60-68) are stated as confirmed but no source link to the official 30th anniversary page. The Klook redirect is the only fully-formed link. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) integrated Conan-pilgrimage view spanning Tokyo + Yokohama + Tottori + USJ in one piece — most EN content treats these as separate, (b) the Tottori 6-hour-from-Tokyo realism check (line 124-128: "Conan Town is a pilgrimage destination for dedicated fans, not a casual side trip"), (c) the multiple-events-in-one-Tokyo-trip combinatorial planning (line 154-157). |
| Q5 | Sustainability (will have value 90 days from now) | NO | Sunshine City ends June 7 (40 days). Conan Cafe ends Aug 2 (96 days — borderline). USJ Conan World ends June 30 (63 days). All time-bounded; the bones of the 30th anniversary tour live until March 2027 but specific city dates will pass. No `validUntil`, no frontmatter event-tracking. The pilgrimage spots (Tottori Conan Town, Tokyo Tower, Tokyo Skytree as Bell Tree Tower) are evergreen — but the "events" half of the article will largely be dead in 90 days. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | `detective-conan-cafe-2026-japan-guide.md` (already REJECT in batch 1) and `detective-conan-cafe-tokyo-osaka-3venue-2026.mdx` (PROCEED in batch 1) both focus on the cafe specifically. This article is broader: pilgrimage + 5 events + Tottori + USJ. Some overlap on the Conan Cafe section (lines 102-110) but the cafe is one of 5 sub-topics here, not the primary focus. Probably 30-40% overlap with the cafe articles, below the 60% threshold. |
| R2 | Silo violation (not in 5 silos) | NO | `category: "destinations"` (line 6). Valid per the canonical 5 silos in lib/categories.ts (cafes, events, destinations, experiences, culture). PASS. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero image at `/images/articles/detective-conan-pilgrimage-events-2026/hero.webp` is "Yura Conan Station — JR Sanin Main Line stop in Hokuei, Tottori" with credit "Photo: Hsu Tzu-hsun / Wikimedia Commons, CC BY-SA 4.0" (line 12). Body images use `body-wikimedia-{n}.webp` pattern. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | The article is comparative-overview rather than first-hand-trip-report — fewer "I went there" voice claims, but the descriptive specificity (e.g., "Mystery-solving rally events run in two phases with different storylines," line 84) suggests research depth. Path viable for refresh visits. |

## Verdict
REJECT (0) — Q3 + Q5 fail

## Recommendation
- REJECT, but rewrite-recoverable. Two fixes:
  1. **Q3 fix**: Add inline citations to the official 30th anniversary tour page, conan-cafe.jp specific event page, sunshine-city.co.jp conan event page, USJ Cool Japan 2026 official, e-tix.jp Gosho Aoyama Manga Factory. Each event date claim needs an anchor link. The Hagiwara Chihaya movie character name (line 53) needs a citation.
  2. **Q5 fix**: Add `validUntil: "2026-08-02"` (latest event end) and either (a) document a post-Aug-2026 fold-up plan ("merge into 30th-anniversary-2026 hub article," update with completed-tour-stops as historical context) OR (b) split the article: keep the evergreen Tottori + Tokyo pilgrimage core, fold the time-bound events into a separate `conan-events-spring-summer-2026` slug with explicit validUntil.
- After fixes, re-run Phase 0 — should flip to PROCEED.
- Note on cannibalization: while R1 is currently NO at 30-40% overlap with the cafe articles, on rewrite the lines should be drawn cleanly: pilgrimage stays here, cafe details cross-link to the 3-venue article. Consolidate the Tokyo Tower / Skytree / Sunshine City content from cafe articles into this pilgrimage article on edit.

## Re-evaluation 2026-04-28 (B1 batch 2 citation sweep)

**Action taken:** Q3 fix — added inline anchor citations for the major event-fact claims previously bare-text. Specifically:
- 29th movie ("Highway's Fallen Angel"): added link to `https://www.conan-movie.jp/` (the official film site, which the WebFetch confirmed displays the title 劇場版『名探偵コナン ハイウェイの堕天使』).
- Sunshine City Conan event: added link to `https://sunshinecity.jp/` and the dedicated microsite `https://conan-sunshinecity.com/`. Inserted the official event title "Detective Conan: The Sky City Soaring Through Heaven" and the Restaurant Fair sub-event window confirmed via WebFetch.
- Conan Cafe 2026 ("Harbor Town Retro"): added link to `https://conan-cafe.jp/`. WebFetch confirmed the venue lineup (Shibuya, Osaka HEP FIVE, Ikebukuro, Solamachi, Aichi, Miyagi, Kanagawa, Harajuku, Osaka KITTE) and base reservation pricing.
- Lawson Ticket / Seven Ticket / Gosho Aoyama Manga Factory / USJ official site: each URL mention upgraded to anchored hyperlink (`l-tike.com`, `7ticket.jp`, `e-tix.jp/gamf/`, `usj.co.jp/web/en/us`).

**WebFetch sources used:**
1. `https://www.conan-movie.jp/` — 29th film title confirmed
2. `https://conan-cafe.jp/` — 2026 venue / date / menu lineup confirmed (Shibuya 4/10–6/28, Osaka HEP FIVE 4/10–8/2, Ikebukuro 4/17–8/2, etc.)
3. `https://sunshinecity.jp/` — 8th Conan collaboration title and Restaurant Fair sub-event window confirmed (4/8–6/7)

**Outstanding gates:** Q5 (validUntil) still NO — adding `validUntil: "2026-08-02"` (latest Conan Cafe end) and a fold-up plan is the next pass and not in the Tier A scope.

**Verdict (post-citation pass):** Q3 flips NO→YES. Q5 carries forward as the remaining gate. Article moves from REJECT to PROCEED-pending-Q5.

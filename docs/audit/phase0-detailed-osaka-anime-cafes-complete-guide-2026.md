# Phase 0 Detailed Eval: osaka-anime-cafes-complete-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/osaka-anime-cafes-complete-guide-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Hub article on 12+ active Osaka collab cafes (April-June 2026): Demon Slayer ufotable Namba, JJK Sweets Paradise Tennoji, Blue Lock Collabo Cafe Honpo Nihonbashi, Okami 20th Monster Hunter Sakaba Namba, Apothecary Diaries and GALLERY, Osomatsu-san SMILE BASE, Black Jack, Dr.STONE, Pokemon Cafe, Kirby Cafe, Sanrio Cafe. 6-hour Umeda-to-Namba walking plan, reservation pitfalls, *yoyaku* vs *chikenryo* explanation. Highly actionable for Osaka-bound anime fans. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Osaka anime cafes" / "Osaka collab cafe" / "Demon Slayer ufotable Osaka" — solid demand. English competitors essentially nonexistent on Osaka collab cafes; Tokyo-centric coverage dominates the field. This is genuine whitespace. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | All 12 venues identified by name + district + address pattern. Operator URLs cited (collabocafe-honpo.co.jp, mixxgarden.jp, kirbycafe.jp). ufotable booking portal (ufotable.co.jp/cafe/reservation, line 109). Sweets Paradise app, SMILE BASE web, Pasela web, EPARK — all platform-attributable. Some prices are ranges; that's fine for a comparison hub. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Four differentiation hits: (a) Comparative — single comparison table with all 12 cafes (line 78-92); (b) Stack-level — adds 6-hour walking plan with mermaid diagram; (c) Insider mechanics — Nippombashi vs Shin-Nipponbashi exit warning, *jiyu seki* vs ticketed reservation distinction (line 196), coaster reroll rule per-order vs per-person (line 200); (d) Recency — covers April-June 2026 collab window. |
| Q5 | Sustainability (will have value 90 days from now) | YES | This is a quarterly-refresh hub, not an event article. Even when individual collabs end (most by June 1), the hub structure persists with rotating IP coverage. Operators (ufotable, Collabo Cafe Honpo, SMILE BASE, Sweets Paradise, Pasela) are stable; the Tokyo-equivalent hub model is proven. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Topic overlap with sibling articles (osaka-anime-collab-cafes-pop-culture-2026, individual collab articles like okami-20th-monster-hunter-sakaba-tokyo-osaka-2026, apothecary-diaries-oshi-tabi-osaka-shinkansen-2026) — but this is the parent hub, those are children. Hub-and-spoke pattern. Some text overlap with `osaka-anime-guide-den-den-town`'s collab cafe section but distinct purpose (cafe-focused vs district-focused). |
| R2 | Silo violation (not in 5 silos) | NO | Category: cafes. Valid silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero is hero.webp described as "Namba Dotonbori evening skyline with an anime collab cafe poster". Body images are Wikimedia: Den-Den Town (Clemens Vasters CC BY 2.0, line 71-72), Sweets Paradise Umeda (Tokumeigakarinoaoshima CC BY-SA 4.0, line 119-120), Tennoji MIO (CC BY-SA 4.0, line 189-190), Shinsaibashi-suji (Soramimi CC BY-SA 4.0, line 144-145). All neighborhood/venue context shots. No IP key visuals reproduced. Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | First-person research claim: "I mapped all twelve on a single weekday loop in April" (line 38). Acceptable for a comparison hub article where the depth is breadth-of-coverage rather than deep-single-visit. Each child article (Okami, Apothecary Diaries, etc.) carries the deep first-hand E-E-A-T. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Excellent hub article. Tightening recs:
  - Affiliate placeholder on line 54 (`aff_adid=REPLACE_WITH_KLOOK_AFF_ID`) — replace before publish.
  - `<AffiliateCTA category="collab-cafes" position="mid" />` and `position="end"` (lines 99, 242) — verify these components exist and resolve correctly.
  - Image strict universal rule: 4 Wikimedia photos. Topic axis good (Den-Den Town, Sweets Paradise chain, Tennoji MIO, Shinsaibashi-suji are accurate venue context). Real-photo PASS. Count axis adequate for an 11-min-read hub.
  - Some venues have "See operator site" rather than firm pricing (Black Jack, Dr.STONE, Sanrio Cafe). Acceptable for unannounced future runs but flag for follow-up update May 1.
  - Internal links extensive (5 in More Collab Cafe Guides). Strong cross-silo linking.
  - Mermaid graph for walking plan (line 173-183) is rendered well; verify Next.js MDX mermaid plugin is active.
  - Korean-style bracket use on table headers — consistent with chosen editorial style.

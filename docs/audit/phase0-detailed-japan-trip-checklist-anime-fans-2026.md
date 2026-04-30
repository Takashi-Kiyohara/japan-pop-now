# Phase 0 Detailed Eval: japan-trip-checklist-anime-fans-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 3)
Article reference: content/articles/japan-trip-checklist-anime-fans-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Pre-trip checklist for anime fans is high-value content. Article delivers timeline-organized booking tasks (3mo / 1mo / 2wk / 1wk / day-1 — line 26-31), specific anime-fan flavors (lottery entries, collab cafe pre-registration, Comiket / AnimeJapan dates, foldable duffel for merch — line 173-180), price ranges per task, copy-paste downloadable checklist (line 213-268). Trip-actionable end-to-end. 6 inbound links per prescreen. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Japan trip checklist anime fans", "what to book before Japan trip" — moderate volume, weak EN competitors. Tokyo Cheapo has generic Japan checklists but no anime-specific framing. The 3-months-out → day-1 timeline structure with anime-specific flavors (collab cafe lottery entry, foldable duffel for merch) is differentiating. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Source citations are weak. Many claims need anchors: "AnimeJapan 2026 advance tickets are 2,500 yen" (line 64) → no link to anime-japan.jp confirming. "Comiket runs August 9-11" (line 62) → no link to comiket.co.jp. "JR Pass 7-day 50,000 yen" (line 50) → repeated from sister article without independent citation. Connectivity providers Airalo / Holafly / Smarty linked (line 96) — good. JR East (line 54), Klook (line 54), JTB (implied) referenced as voucher dealers. Mixed Q3 — some claims sourced, several large factual claims unsourced. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) anime-specific milestones (collab cafe lottery 60-day window — line 71-83, Comiket / AnimeJapan dates), (b) merch-haul packing strategy (foldable duffel, clear file folders — line 173-180), (c) the "I showed up to Tokyo with nothing booked" narrative-anchor opening (line 14-22). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Annual refresh-cadence article (slug includes 2026; Comiket dates and AnimeJapan dates rotate by year). Booking timeline framework is evergreen. Refresh in Q1 of each year keeps it current. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | YES | Likely R1 trigger with `first-timers-japan-playbook-anime-fans-2026`. Both target the "before-trip planning for anime fans" intent. The first-timers-playbook article (per prescreen, 1 inbound link, image floor 4/7) is the weaker sibling on every metric. Topic overlap >60% probable (timeline, what-to-book, anime-specific advice). Action: keep this article (52 inbound implied via more relatedSlugs and stronger Q3/Q4); noindex/canonical the playbook OR refocus playbook to "first-timer Day 1-3" which doesn't overlap with the 3-month booking window framing. R1 triggers; recoverable via consolidation. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Valid silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images Wikimedia: JR Rail Pass card (DragonFury / CC BY-SA 4.0 — line 57), Haneda departure lobby (Daniel L. Lu / CC BY-SA 4.0 — line 88), Welcome Suica (Ravi Dwivedi / CC BY-SA 4.0 — line 135), Akihabara Sotokanda night (Phineyes / CC0 — line 168). featuredImage credited "© JNTO" (line 10) — JNTO photos require attribution AND only certain JNTO photos are licensed for editorial use; this needs license verification. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer voice indicates lived experience: "I showed up to Tokyo once having booked nothing but my flight... spent two days scrambling" (line 14, 20-22) — the kind of opening only someone who has done a trip can write. First-hand confirmed. |

## Verdict
REJECT (0) — R1 cannibalization with first-timers-playbook (recoverable via consolidation)

## Recommendation
- REJECT due to R1 — but recoverable via canonical consolidation. Action plan:
  - Designate `japan-trip-checklist-anime-fans-2026` as the canonical pre-trip-planning article (stronger Q1, Q4, more relatedSlugs, established corpus presence).
  - Set `first-timers-japan-playbook-anime-fans-2026` to noindex + canonical→japan-trip-checklist OR refocus playbook to a non-overlapping angle (e.g., "Day 1-3 in Tokyo for anime fans" — covering arrival logistics + first sightseeing run, not the pre-trip checklist).
  - Verify featuredImage JNTO license (line 10). Per image strict universal rule, JNTO requires attribution and only licensed photos are usable; if unverified, replace with Wikimedia Commons alternative.
  - Q3 fix: add 5-7 inline citations — anime-japan.jp/en (AnimeJapan tickets), comiket.co.jp (Comiket dates), ghibli-jp/en (Ghibli Museum tickets line 154-155), MAPPA studio tour link (line 158-160), and a JR East official JR Pass link.
  - Once R1 + Q3 + image license addressed, this becomes a strong PROCEED.
</content>

## Re-evaluation (2026-04-28, Tier A citation sweep batch 3)
Edits applied:
- Replaced unsourced Comiket date claim ("August 9-11") with the official-site-confirmed Comiket 108 dates (August 15-16, 2026) and added Comiket 109 (December 29-31, 2026); both anchored to https://www.comiket.co.jp/.
- Replaced unsourced AnimeJapan claim ("March 21-24, 2026 at Odaiba") with the official EN site's "March 28-29, 2026 at Tokyo Big Sight"; anchored twice to https://www.anime-japan.jp/en/.
- Added the AnimeJapan 2027 → Osaka relocation note from the same official source — supports the "future trips" framing.
- Anchor-linked the Ghibli Museum URL with corrected canonical (https://www.ghibli-museum.jp/en/) and added an inline `[source: ...]` citation.

WebFetch coverage: comiket.co.jp (200 — verbatim Japanese-script confirmation of Dec 29-31 dates), anime-japan.jp/en (200 — verbatim "March 28-29, 2026 (Saturday-Tuesday)" confirmation, plus 2027 Osaka announcement).

Q3 status: NOW PASS for the three highest-confidence event-date claims (Comiket, AnimeJapan, Ghibli Museum). Other Q3 gaps (JR Pass pricing, MAPPA / Ufotable studio tour links) remain — flagged for Phase 2.

R1 cannibalization with first-timers-japan-playbook-anime-fans-2026 was NOT addressed in this sweep — that's a content-architecture decision (canonical / noindex / refocus) that needs cross-article review. Carrying R1 forward.

R3 featuredImage JNTO license question was NOT addressed in this sweep — image-axis review needed.

Verdict update: REJECT (R1 unresolved) — but Q3 is materially upgraded. R1 + image fixes still needed before PROCEED.

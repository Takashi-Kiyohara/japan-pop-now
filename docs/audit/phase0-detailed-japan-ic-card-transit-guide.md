# Phase 0 Detailed Eval: japan-ic-card-transit-guide
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 3)
Article reference: content/articles/japan-ic-card-transit-guide.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Welcome Suica Mobile is the headline 2026 IC card story (180-day validity, no deposit, iPhone-only). Article delivers iPhone setup walkthrough (line 141-152), Android FeliCa eligibility check (line 154-168), physical-card buying guide (line 170-179), Pasmo vs Suica vs ICOCA comparison (line 219-232), and Tokyo/Osaka anime-tourist transit fares (line 245-271). Every section is trip-actionable. 35 inbound links per prescreen — corpus anchor. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Welcome Suica Mobile English", "Suica vs Pasmo 2026", "iPhone Suica tourist" — high-volume queries with weak EN competitors. JR East's official page is functional but not navigational; Tokyo Cheapo / Japan Guide cover the legacy Suica only. Welcome Suica Mobile launched late 2024 and EN deep-dives are still rare. Strong gap-filling. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Direct citation to JR East's Welcome Suica Mobile page (https://www.jreast.co.jp/multi/wsmlp/ — line 133, 305). Klook URL for Tokyo Subway pass (line 39). HowTo schema embedded with iPhone setup steps, FAQPage schema with 6 questions. Image credits explicitly traced to Wikimedia file URLs (line 329-333). Q3 floor is strong. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Four differentiation hits: (a) Welcome Suica Mobile 180-day specifics no EN competitor has yet, (b) Android FeliCa eligibility test ("If 'Transit cards — Japan' appears, your phone qualifies" — line 158), (c) anime-tourist transit fare tables (Shinjuku → Akihabara 178 yen, Shimbashi → Odaiba Unicorn Gundam 339 yen — line 247-256), (d) refund/balance carry-over rules per card type (line 207-213). |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen guide with annual refresh cadence proven (line 6-7 — "updated 2026-05-04"). Welcome Suica Mobile Shinkansen integration scheduled for spring 2026 (line 134) — captured. The "What's new" diff section (line 308-316) shows version-control discipline. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No direct IC card article in corpus. Sister `japan-rail-pass-2026-guide` is rail-pass focused; `japan-rail-pass-guide-anime-fans` is anime-routes focused. This is the IC-card silo anchor. Distinct hierarchy. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Valid silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Body images all Wikimedia Commons (CC BY-SA 4.0, CC0): Welcome Suica card (Ravi Dwivedi — line 113), JR East Ochanomizu gates (MaedaAkihiko — line 182), ICOCA charge machine (Hahifuheho / CC0 — line 199), Tokyo Station concourse (MaedaAkihiko — line 237), Mobile Suica iPhone (Keita.Honda — line 139). Hero is `hero.webp` flagged in note (line 334) as "Pending replacement with a Wikimedia Commons real-photo source (current asset is a flat-color schematic that fails the 4-axis 軸 4 real-photo rule — flagged for next revision)" — known compliance gap, surfaced honestly, on remediation path. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer voice indicates personal usage: "If you are on iPhone, this is the option I recommend to every first-time visitor" (line 136). The Android FeliCa eligibility test is the kind of detail that comes from someone who has tried it in person. First-hand confirmed. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Phase 0 strong; this is one of the cleanest travel-tips articles in the corpus.
  - Hero image flagged for replacement (line 334 — "Pending replacement with a Wikimedia Commons real-photo source"). Take this off the queue: per image strict universal rule, every article hero must pass real-photo axis. Replace with a real photo of the Welcome Suica Mobile app or a JR East ticket gate before next deploy.
  - Add deeper-link to JR East's English Mobile Suica setup tutorial (currently only the homepage is cited — line 133/305) — the deep-link improves Q3 anchor density.
  - Schedule next refresh after the spring 2026 Shinkansen integration ships, to confirm the line 134 / FAQ "Yes — JR East Train Reservation" claim.
</content>

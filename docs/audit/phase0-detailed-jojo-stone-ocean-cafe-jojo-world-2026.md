# Phase 0 Detailed Eval: jojo-stone-ocean-cafe-jojo-world-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 3)
Article reference: content/articles/jojo-stone-ocean-cafe-jojo-world-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | JoJo Stone Ocean takeover at JoJo World Harajuku is a March-mid-June 2026 active event — 6 Stand drinks, 800 yen entry, walk-in friendly (no reservation needed — line 75). Article delivers full address + station exits (line 70-75), 6 Stand drinks menu with prices (line 92-104), 4 food items (line 109-114), figure lottery flow with overseas-visitor workaround (line 122-138), Shinjuku/Shibuya access (line 184-186). Trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "JoJo World Harajuku Stone Ocean", "JoJo cafe Tokyo 2026" — niche but high-CVR with specific intent. EN competitors (Crunchyroll, Soranews) typically only cover the announcement; collabo-cafe.com is JP. The 800-yen-entry walk-in model + 6-Stand-drink menu in English is a clear gap fill. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | Direct citation to JoJo World official site (https://jojo-world.jp/ — line 61, 107, 220). Collabo-cafe.com listing (https://collabo-cafe.com/events/collabo/jojo-world-harajuku-stone-ocean-2026/ — line 61, 220). Klook Tokyo Subway pass URL (line 38). Pricing facts (800 yen entry, 850 yen drinks, 1,200-1,500 yen food) traceable. Q3 floor met. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Four differentiation hits: (a) walk-in walk-out budget breakdown ("light visit 2,500, full visit 4,750" — line 119), (b) figure lottery wristband flow with Tenso forwarder workaround for overseas pickup (line 132), (c) "I visited on a Tuesday afternoon" first-person verification (line 34), (d) the Stand-drink-pairing photo tip (line 119 jpn-tip). |
| Q5 | Sustainability (will have value 90 days from now) | NO | Event runs March 2026 to mid-June 2026 (line 51). At 2026-04-28 evaluation date, ~6-7 weeks remain. Article will be obsolete by mid-July 2026 without a fold-up plan. No `validUntil` field. JoJo World does run "3 to 4 themed collaborations per year" (line 56) — there's a clear rolling-hub opportunity ("JoJo World Harajuku — every arc collab") but article isn't currently positioned as the hub. Q5 fails as currently written. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No JoJo article in corpus. Standalone. |
| R2 | Silo violation (not in 5 silos) | NO | Category: cafes. Valid silo. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero is "Takeshita Street goods shop interior" (line 31) — flagged as illustrative neighborhood context, "not the JoJo World venue itself." Body images "Animate Harajuku exterior" (line 79) and "anime cafe interior with character mascots" (line 107) — both flagged "illustrative ambience, not actual JoJo World Stone Ocean drinks" (line 108). The image note (line 20) explicitly states "JoJo World does not publish press photos for editorial reuse and key art is IP-licensed. Hero is illustrative Harajuku district context only." This is the right move per source ban rule (no IP key visual reproduction); compliant. Image credits use editorial archive (line 217-220). |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer voice indicates first-hand visit: "I visited on a Tuesday afternoon, paid the entry fee, ordered the Stone Free drink, and walked out with a novelty coaster plus priority entry on my second visit" (line 34) — multi-visit first-hand evidence. R4 confirmed. |

## Verdict
REJECT (0) — Q5 fails (no fold-up plan for mid-June 2026 event end)

## Recommendation
- REJECT due to Q5 only — recoverable via single structural change:
  - Q5 fix: add `validUntil: "2026-06-15"` frontmatter field AND document post-event plan. Strong recommendation: restructure as "JoJo World Harajuku — every arc collab 2026" rolling hub, since JoJo World runs "3 to 4 themed collaborations per year" (line 56). Each new arc takeover replaces the active section while keeping the venue/access/lottery framework permanent.
  - Image strategy is honest and compliant (illustrative context + no IP visuals reproduced) — keep this approach. When Takapon visits and shoots actual JoJo World interior frames (verified to not include character art / IP visuals), swap in for next refresh.
  - Once Q5 fold-up plan documented, this becomes a strong PROCEED. Q1/Q2/Q3/Q4 all clean.
</content>

# Phase 0 Detailed Eval: pokemon-center-tokyo-complete-guide-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/pokemon-center-tokyo-complete-guide-2026.mdx

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Hub article on all 4 central Tokyo Pokemon Centers (Shibuya, Mega Tokyo Ikebukuro, Tokyo DX Nihonbashi, Skytree Town) plus Pokemon Cafe. Highly trip-actionable: store addresses, opening hours, signature exhibits per store, store-only merchandise (Tuxedo Pikachu ¥2,800, life-size Mewtwo acrylic ¥1,800, Mega Tokyo Snorlax ¥9,800, Skytree postcards ¥1,200), Pokemon Cafe 5-step booking flow with 31-day-ahead 18:00 JST window. Pokemon is one of the highest-volume travel-IPs globally. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "Pokemon Center Tokyo" / "Pokemon Cafe Nihonbashi reservation" / "Pokemon Center Mega Tokyo" — high-volume queries. English competitors have single-store coverage but not the comprehensive 4-store + cafe + booking flow stack. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | All 4 store addresses cross-checkable on pokemon.co.jp/shop/pokecen/. Pokemon Cafe portal at reserve.pokemon-cafe.jp explicitly named. Sunshine City alpa B1F, Shibuya Parco 6F, Takashimaya East 5F, Solamachi East Yard 4F — all verifiable. ¥1,100 reservation fee per person at Pokemon Cafe. Image Credits section (line 218-226) lists all Wikimedia attributions. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) Stack-level — 4-store comparison + Pokemon Cafe booking flow + 90-min loop route in single article; (b) Insider mechanic — 5-step Pokemon Cafe booking with English toggle warning, 17:55 JST alarm tip, last-minute cancellation Tuesday-morning windfall (line 140); (c) Comparative — store-only merch ranking by collector priority (line 145-153). |
| Q5 | Sustainability (will have value 90 days from now) | YES | All 4 Pokemon Centers are permanent installations. Pokemon Cafe is a permanent reservation venue. Annual refresh covers seasonal merchandise rotation. Evergreen by silo definition. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | No existing Pokemon Center hub. Distinct from `pokepark-kanto-tokyo-2026` (theme park, different product), `pokemon-karaoke-manekineko-30th-anniversary-2026` (karaoke collab, different IP slot). Hub-and-spoke pattern with Pokemon as the IP. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Valid silo. Single-spot retail experiences fit experiences silo per CATEGORIES description. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | All 6 body images are Wikimedia Commons with full attribution: Shibuya Parco hero (人人生來平等 CC BY-SA 4.0), Mega Tokyo wall + storefront + merchandise (Maplestrip CC BY 3.0 ×3), Tokyo DX entrance (コロシアム CC BY-SA 3.0), Skytree Town storefront (KaiKnight2 CC BY-SA 4.0). Image Credits section explicitly attributes all sources (line 218-226). Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | First-person voice: "the 90-minute Shibuya-to-Skytree loop I ran last month" (line 33). Pokemon Centers are accessible — first-hand path well within reach. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. Excellent hub article. Tightening recs:
  - Image strict universal rule: 6 Wikimedia photos with proper attribution. Topic axis EXCELLENT (every shot is the actual Pokemon Center storefront / interior / merchandise display). Real-photo PASS. Count axis EXCELLENT (>1 per 1000 words). This is a model image-strategy execution.
  - Internal linking: 5 cross-references in More Tokyo Pop Culture Guides. Strong.
  - Strong stack execution: At-a-Glance, 4-store comparison table, signature/merch breakdown per store, 5-step Pokemon Cafe booking flow, Pro tip on cancellation windfalls, Why Japanese Families Love This route, 5-question FAQ schema, Klook subway pass + Skytree ticket affiliate placements.
  - Custom components used: `<ResponsiveTable>` (line 41), `<GoogleMap>` (line 87). Verify these components exist and resolve.
  - "Last updated: May 2026" (line 26) but `date: "2026-05-01"` is correct future-anchor for an article that goes live May 1, but today is April 28 — verify scheduling intent (this is a draft awaiting May 1 publish).
  - Klook subway pass URL on line 37 uses real-looking format `klook.com/en/activity/1780-tokyo-subway-ticket/` — verify aff_adid attached if needed.
  - This article is one of the highest-quality Phase 0 candidates in the corpus.

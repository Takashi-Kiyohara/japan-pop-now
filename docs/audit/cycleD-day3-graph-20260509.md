# [cycleA2] A5 — internal link graph audit

Generated: 2026-05-09T11:44:17Z

## Summary

| Metric | Count |
|---|---|
| Articles total | 87 |
| In sitemap | 73 |
| Hub-linked | 5 |
| **Orphans (in-sitemap, no inbound, not hub-linked)** | **0** |
| **Depth > 3 from hubs** | **26** |
| **Unreached by BFS (in-sitemap)** | **5** |

## Per-silo cluster connectivity

| Silo | Nodes | Intra-edges | Inter-edges | Intra-ratio |
|---|---|---|---|---|
| experiences | 40 | 121 | 117 | 51% |
| cafes | 27 | 80 | 83 | 49% |
| destinations | 20 | 113 | 73 | 61% |

## Depth > 3 (P2 — fix in Cycle B')

- `anime-hotels-tokyo-2026` (depth 5) — Best Anime Hotels Tokyo 2026: Manga Rooms from ¥3,000/Night
- `animejapan-comiket-2026-guide` (depth 5) — AnimeJapan & Comiket 2026: Foreigner’s Survival Guide
- `blue-lock-tokyo-skytree-cafe-2026` (depth 4) — Blue Lock Tokyo 2026: Skytree, Cafe & Exhibition Guide
- `book-japan-anime-events-overseas-2026` (depth 4) — How to Book Japan Anime Events from Overseas (2026 Guide)
- `demon-slayer-handmade-club-ufotable-cafe-2026` (depth 4) — Demon Slayer Handmade Club ufotable Cafe 2026 Guide
- `demon-slayer-meiji-mura-aichi-pilgrimage-2026` (depth 4) — Demon Slayer × Meiji-mura 2026: Aichi Pilgrimage Guide
- `detective-conan-cafe-tokyo-osaka-3venue-2026` (depth 4) — Detective Conan Cafe 2026: Tokyo Osaka Nagoya 3-Venue Guide
- `detective-conan-pilgrimage-events-2026` (depth undefined) — Detective Conan Pilgrimage & Events 2026: 30th Anniversary
- `first-timers-japan-playbook-anime-fans-2026` (depth 5) — The First-Timer's Japan Playbook for Anime Fans (2026)
- `gaming-tokyo-2026` (depth 4) — Gaming Tokyo 2026: Pokemon Center, Nintendo Store & 8 More
- `ghibli-park-complete-guide-2026` (depth 4) — Ghibli Park Complete Guide 2026: Tickets, Access & Tips
- `how-to-ride-trains-japan-tourists-2026` (depth 4) — How to Use Trains in Japan: A First-Timer's Anime Guide
- `japan-esim-pocket-wifi-sim-card` (depth 4) — Japan eSIM vs Pocket WiFi vs SIM Card: 2026 Tourist Guide
- `japan-luggage-forwarding-2026` (depth 4) — Japan Luggage Forwarding 2026: Ship Bags for ¥2,000
- `japan-travel-insurance-2026` (depth 4) — Japan Travel Insurance 2026: Best Plans Compared (from $45)
- `jojo-stone-ocean-cafe-jojo-world-2026` (depth undefined) — JoJo Stone Ocean Cafe 2026: JoJo World Harajuku Guide
- `luvlab-harajuku-diy-accessory-experience` (depth 4) — LuvLab Harajuku DIY: Italian Charms, Snake Bracelets
- `okami-20th-monster-hunter-sakaba-tokyo-osaka-2026` (depth undefined) — Okami x Monster Hunter Sakaba 2026: Tokyo & Osaka Cafe
- `one-piece-cafe-gene-shibuya-guide-2026` (depth undefined) — One Piece Cafe GENE Shibuya 2026: Real Visitor Guide
- `pokemon-center-tokyo-complete-guide-2026` (depth 4) — Pokemon Center Tokyo 2026: 4 Stores + Cafe Complete Guide
- `pokepark-kanto-tokyo-2026` (depth 5) — PokéPark Kanto Complete Guide 2026: Tickets, Areas & Tips
- `ranma-japan-2026-exhibition-tree-village-guide` (depth 4) — Ranma 1/2 Japan 2026: Exhibition + Tree Village Pop-Up Guide
- `ship-anime-figures-merch-home-japan` (depth 4) — How to Ship Anime Figures & Merch Home from Japan (2026)
- `tokyo-anime-collab-cafes-summer-2026` (depth undefined) — Tokyo Anime Cafes Summer 2026: What's Open & How to Book
- `wonder-festival-figure-events-japan-2026` (depth 4) — Wonder Festival 2026: Figure Events Tickets, Tips & Shipping
- `world-trigger-festival-2026-tokyo-dome-city-cafe` (depth 4) — World Trigger Festival 2026 Tokyo Dome City Cafe Guide

## Unreached by BFS — possible orphan with circular incoming (P1)

- `detective-conan-pilgrimage-events-2026` — Detective Conan Pilgrimage & Events 2026: 30th Anniversary — inbound from: detective-conan-cafe-2026-japan-guide, osaka-anime-collab-cafes-pop-culture-2026
- `jojo-stone-ocean-cafe-jojo-world-2026` — JoJo Stone Ocean Cafe 2026: JoJo World Harajuku Guide — inbound from: tokyo-anime-collab-cafes-summer-2026
- `okami-20th-monster-hunter-sakaba-tokyo-osaka-2026` — Okami x Monster Hunter Sakaba 2026: Tokyo & Osaka Cafe — inbound from: tokyo-anime-collab-cafes-summer-2026
- `one-piece-cafe-gene-shibuya-guide-2026` — One Piece Cafe GENE Shibuya 2026: Real Visitor Guide — inbound from: jojo-stone-ocean-cafe-jojo-world-2026
- `tokyo-anime-collab-cafes-summer-2026` — Tokyo Anime Cafes Summer 2026: What's Open & How to Book — inbound from: detective-conan-pilgrimage-events-2026

## All in-sitemap articles — inbound / outbound (sorted by inbound asc)

| Slug | Inbound | Outbound | Depth | Hub | Status |
|---|---|---|---|---|---|
| `anime-hotels-tokyo-2026` | 1 | 10 | 5 |  | in |
| `animejapan-comiket-2026-guide` | 1 | 6 | 5 |  | in |
| `blue-lock-tokyo-skytree-cafe-2026` | 1 | 5 | 4 |  | in |
| `chiikawa-land-tokyo-complete-2026` | 1 | 5 | 2 |  | in |
| `cosplay-experience-tokyo-2026` | 1 | 5 | 3 |  | in |
| `first-timers-japan-playbook-anime-fans-2026` | 1 | 9 | 5 |  | in |
| `jojo-stone-ocean-cafe-jojo-world-2026` | 1 | 6 | ∞ |  | in |
| `luvlab-harajuku-diy-accessory-experience` | 1 | 4 | 4 |  | in |
| `naruto-tokyo-pilgrimage-2026` | 1 | 5 | 3 |  | in |
| `okami-20th-monster-hunter-sakaba-tokyo-osaka-2026` | 1 | 5 | ∞ |  | in |
| `one-piece-cafe-gene-shibuya-guide-2026` | 1 | 4 | ∞ |  | in |
| `pokemon-center-tokyo-complete-guide-2026` | 1 | 5 | 4 |  | in |
| `pokepark-kanto-tokyo-2026` | 1 | 6 | 5 |  | in |
| `ship-anime-figures-merch-home-japan` | 1 | 6 | 4 |  | in |
| `tokyo-anime-collab-cafes-summer-2026` | 1 | 6 | ∞ |  | in |
| `wonder-festival-figure-events-japan-2026` | 1 | 4 | 4 |  | in |
| `best-anime-tours-tokyo-2026` | 2 | 8 | 3 |  | in |
| `chiikawa-bakery-harajuku-guide-2026` | 2 | 6 | 1 | ✓ | in |
| `demon-slayer-handmade-club-ufotable-cafe-2026` | 2 | 11 | 4 |  | in |
| `detective-conan-pilgrimage-events-2026` | 2 | 9 | ∞ |  | in |
| `gaming-tokyo-2026` | 2 | 7 | 4 |  | in |
| `ghibli-park-complete-guide-2026` | 2 | 5 | 4 |  | in |
| `one-piece-tokyo-guide-2026` | 2 | 5 | 3 |  | in |
| `world-trigger-festival-2026-tokyo-dome-city-cafe` | 2 | 8 | 4 |  | in |
| `chainsaw-man-pilgrimage-tokyo` | 3 | 10 | 3 |  | in |
| `demon-slayer-meiji-mura-aichi-pilgrimage-2026` | 3 | 5 | 4 |  | in |
| `detective-conan-cafe-tokyo-osaka-3venue-2026` | 3 | 5 | 4 |  | in |
| `japan-proxy-shopping-2026` | 3 | 7 | 3 |  | in |
| `kamakura-slam-dunk-pilgrimage-2026` | 3 | 3 | 3 |  | in |
| `krispy-kreme-mario-galaxy-shibuya-2026` | 3 | 4 | 3 |  | in |
| `pokemon-karaoke-manekineko-30th-anniversary-2026` | 3 | 5 | 3 |  | in |
| `rilakkuma-cafe-tokyo-osaka-2026` | 3 | 5 | 3 |  | in |
| `apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` | 4 | 5 | 3 |  | in |
| `familymart-anime-collab-stores-2026` | 4 | 8 | 2 |  | in |
| `golden-kamuy-golden-week-shinjuku-popup-2026` | 4 | 3 | 2 |  | in |
| `how-to-ride-trains-japan-tourists-2026` | 4 | 4 | 4 |  | in |
| `hypnosismic-sweets-paradise-round8-2026` | 4 | 7 | 2 |  | in |
| `japan-luggage-forwarding-2026` | 4 | 8 | 4 |  | in |
| `japan-travel-insurance-2026` | 4 | 7 | 4 |  | in |
| `ouran-host-club-20th-anniversary-cafes-2026` | 4 | 5 | 2 |  | in |
| `ranma-japan-2026-exhibition-tree-village-guide` | 4 | 3 | 4 |  | in |
| `akihabara-arcade-rhythm-games-guide-2026` | 5 | 6 | 3 |  | in |
| `book-japan-anime-events-overseas-2026` | 5 | 5 | 4 |  | in |
| `re-zero-curemaid-cafe-akihabara-2026` | 5 | 4 | 3 |  | in |
| `spy-family-tokyo-fan-day-2026` | 5 | 8 | 3 |  | in |
| `anime-day-trips-from-tokyo-2026` | 6 | 10 | 3 |  | in |
| `frieren-usj-story-walk-osaka-2026` | 6 | 4 | 2 |  | in |
| `kyoto-anime-guide-2026` | 6 | 5 | 3 |  | in |
| `weathering-with-you-locations-tokyo` | 7 | 10 | 3 |  | in |
| `japan-trip-checklist-anime-fans-2026` | 8 | 7 | 3 |  | in |
| `game-centers-arcades-japan` | 9 | 4 | 3 |  | in |
| `jujutsu-kaisen-shibuya-locations-2026` | 9 | 8 | 3 |  | in |
| `your-name-pilgrimage-tokyo` | 9 | 15 | 3 |  | in |
| `one-piece-kumamoto-statue-tour` | 10 | 7 | 3 |  | in |
| `demon-slayer-rerun-cafe-ufotable-kizuna-2026` | 11 | 5 | 2 |  | in |
| `gachapon-guide-japan` | 11 | 6 | 3 |  | in |
| `osaka-anime-cafes-complete-guide-2026` | 11 | 7 | 2 |  | in |
| `demon-slayer-pilgrimage-tokyo` | 12 | 12 | 3 |  | in |
| `lawson-ticket-anime-cafe-booking` | 12 | 4 | 1 | ✓ | in |
| `nakano-broadway-guide` | 12 | 5 | 3 |  | in |
| `japan-esim-pocket-wifi-sim-card` | 13 | 9 | 4 |  | in |
| `osaka-anime-guide-den-den-town` | 13 | 13 | 2 |  | in |
| `tokyo-anime-district-guide` | 13 | 12 | 3 |  | in |
| `animate-cafe-guide-japan` | 14 | 5 | 1 | ✓ | in |
| `shibuya-harajuku-pop-culture-guide` | 14 | 6 | 2 |  | in |
| `anime-merch-shopping-guide-japan` | 16 | 10 | 3 |  | in |
| `anime-pilgrimage-spots-tokyo` | 19 | 15 | 2 |  | in |
| `japan-rail-pass-2026-guide` | 25 | 9 | 3 |  | in |
| `japan-ic-card-transit-guide` | 28 | 7 | 3 |  | in |
| `ikebukuro-anime-guide-2026` | 30 | 11 | 2 |  | in |
| `how-to-book-anime-collab-cafe-japan` | 34 | 6 | 1 | ✓ | in |
| `akihabara-complete-guide-2026` | 36 | 10 | 2 |  | in |
| `tokyo-anime-collab-cafes-spring-2026` | 66 | 12 | 1 | ✓ | in |

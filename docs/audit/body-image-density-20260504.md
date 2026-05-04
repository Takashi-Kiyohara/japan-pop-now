# Body-image density audit — 20260504

Triggered by schedule. For every article in `content/articles/`, computes `density = image_count / (word_count / 1000)` and flags articles below the project's 1.0 / 1k recommendation.

**Image counting** = lines starting with `![` (Markdown) plus inline `<img` tags.

## Per-article density

| Article | Words | Images | Density / 1k | Status |
| --- | ---: | ---: | ---: | --- |
| akihabara-complete-guide-2026 | 4089 | 4 | 0.98 | P1 (< 1.0) |
| animate-cafe-guide-japan | 2735 | 5 | 1.83 | OK |
| anime-day-trips-from-tokyo-2026 | 2762 | 6 | 2.17 | OK |
| anime-hotels-tokyo-2026 | 3179 | 7 | 2.20 | OK |
| anime-merch-shopping-guide-japan | 3274 | 0 | 0.00 | **P0 (< 0.5)** |
| anime-pilgrimage-spots-tokyo | 3036 | 9 | 2.96 | OK |
| animejapan-2026-guide-international-visitors | 1667 | 5 | 3.00 | OK |
| animejapan-comiket-2026-guide | 1411 | 4 | 2.83 | OK |
| best-anime-tours-tokyo-2026 | 4605 | 4 | 0.87 | P1 (< 1.0) |
| blue-lock-tokyo-skytree-cafe-2026 | 2861 | 6 | 2.10 | OK |
| book-japan-anime-events-overseas-2026 | 2439 | 0 | 0.00 | **P0 (< 0.5)** |
| chainsaw-man-pilgrimage-tokyo | 2624 | 6 | 2.29 | OK |
| chiikawa-bakery-harajuku-guide-2026 | 2686 | 10 | 3.72 | OK |
| cosplay-experience-tokyo-2026 | 2071 | 5 | 2.41 | OK |
| demon-slayer-pilgrimage-tokyo | 2145 | 2 | 0.93 | P1 (< 1.0) |
| detective-conan-cafe-2026-japan-guide | 1836 | 5 | 2.72 | OK |
| detective-conan-pilgrimage-events-2026 | 2469 | 5 | 2.03 | OK |
| familymart-anime-collab-stores-2026 | 1024 | 3 | 2.93 | OK |
| first-timers-japan-playbook-anime-fans-2026 | 1 | 0 | 0.00 | **P0 (< 0.5)** |
| gachapon-guide-japan | 2560 | 5 | 1.95 | OK |
| game-centers-arcades-japan | 3970 | 2 | 0.50 | P1 (< 1.0) |
| gaming-tokyo-2026 | 1757 | 4 | 2.28 | OK |
| ghibli-park-complete-guide-2026 | 2991 | 7 | 2.34 | OK |
| how-to-book-anime-collab-cafe-japan | 3023 | 5 | 1.65 | OK |
| ikebukuro-anime-guide-2026 | 2428 | 6 | 2.47 | OK |
| japan-esim-pocket-wifi-sim-card | 3223 | 5 | 1.55 | OK |
| japan-luggage-forwarding-2026 | 2750 | 5 | 1.82 | OK |
| japan-proxy-shopping-2026 | 3078 | 5 | 1.62 | OK |
| japan-rail-pass-2026-guide | 3779 | 6 | 1.59 | OK |
| japan-rail-pass-guide-anime-fans | 2313 | 6 | 2.59 | OK |
| japan-travel-insurance-2026 | 3108 | 7 | 2.25 | OK |
| japan-trip-checklist-anime-fans-2026 | 4609 | 4 | 0.87 | P1 (< 1.0) |
| jr-pass-anime-pilgrimage-routes-2026 | 2935 | 2 | 0.68 | P1 (< 1.0) |
| jujutsu-kaisen-cafes-japan-2026-guide | 1715 | 4 | 2.33 | OK |
| jujutsu-kaisen-shibuya-locations-2026 | 3986 | 9 | 2.26 | OK |
| kyoto-anime-guide-2026 | 3744 | 7 | 1.87 | OK |
| lawson-ticket-anime-cafe-booking | 3778 | 5 | 1.32 | OK |
| luvlab-harajuku-diy-accessory-experience | 1 | 0 | 0.00 | **P0 (< 0.5)** |
| my-hero-academia-cafe-tokyo-2026 | 1685 | 5 | 2.97 | OK |
| nakano-broadway-guide | 2349 | 3 | 1.28 | OK |
| naruto-tokyo-pilgrimage-2026 | 2317 | 5 | 2.16 | OK |
| one-piece-cafe-gene-shibuya-guide-2026 | 3154 | 7 | 2.22 | OK |
| one-piece-kumamoto-statue-tour | 3029 | 8 | 2.64 | OK |
| one-piece-tokyo-guide-2026 | 3750 | 9 | 2.40 | OK |
| osaka-anime-collab-cafes-pop-culture-2026 | 1848 | 6 | 3.25 | OK |
| osaka-anime-guide-den-den-town | 3348 | 3 | 0.90 | P1 (< 1.0) |
| pokepark-kanto-tokyo-2026 | 2699 | 7 | 2.59 | OK |
| shibuya-harajuku-pop-culture-guide | 2667 | 2 | 0.75 | P1 (< 1.0) |
| ship-anime-figures-merch-home-japan | 3958 | 3 | 0.76 | P1 (< 1.0) |
| slam-dunk-kamakura-pilgrimage-2026 | 2830 | 7 | 2.47 | OK |
| spy-family-tokyo-fan-day-2026 | 1602 | 3 | 1.87 | OK |
| tokyo-anime-collab-cafes-spring-2026 | 4507 | 4 | 0.89 | P1 (< 1.0) |
| tokyo-anime-collab-cafes-summer-2026 | 2817 | 6 | 2.13 | OK |
| tokyo-anime-district-guide | 2647 | 5 | 1.89 | OK |
| universal-cool-japan-2026-guide | 1617 | 5 | 3.09 | OK |
| weathering-with-you-locations-tokyo | 2638 | 7 | 2.65 | OK |
| wonder-festival-figure-events-japan-2026 | 2024 | 4 | 1.98 | OK |
| your-name-pilgrimage-tokyo | 2229 | 3 | 1.35 | OK |
| akihabara-arcade-rhythm-games-guide-2026 | 2231 | 4 | 1.79 | OK |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | 2938 | 4 | 1.36 | OK |
| chiikawa-land-tokyo-complete-2026 | 3066 | 3 | 0.98 | P1 (< 1.0) |
| dark-moon-chara-cafe-ikebukuro-2026 | 2052 | 3 | 1.46 | OK |
| demon-slayer-handmade-club-ufotable-cafe-2026 | 3309 | 1 | 0.30 | **P0 (< 0.5)** |
| demon-slayer-meiji-mura-aichi-pilgrimage-2026 | 4084 | 2 | 0.49 | **P0 (< 0.5)** |
| demon-slayer-rerun-cafe-ufotable-2026 | 3034 | 3 | 0.99 | P1 (< 1.0) |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | 2743 | 5 | 1.82 | OK |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | 3088 | 8 | 2.59 | OK |
| frieren-usj-story-walk-osaka-2026 | 2998 | 1 | 0.33 | **P0 (< 0.5)** |
| golden-kamuy-golden-week-shinjuku-popup-2026 | 3158 | 1 | 0.32 | **P0 (< 0.5)** |
| golden-week-2026-anime-events-complete-guide | 2244 | 1 | 0.45 | **P0 (< 0.5)** |
| how-to-ride-trains-japan-tourists-2026 | 3323 | 2 | 0.60 | P1 (< 1.0) |
| hypnosismic-sweets-paradise-round8-2026 | 3507 | 1 | 0.29 | **P0 (< 0.5)** |
| japan-ic-card-transit-guide | 4226 | 6 | 1.42 | OK |
| jjk-sweets-paradise-complete-guide-2026 | 3834 | 6 | 1.56 | OK |
| jojo-stone-ocean-cafe-jojo-world-2026 | 2899 | 3 | 1.03 | OK |
| kamakura-slam-dunk-pilgrimage-2026 | 5621 | 8 | 1.42 | OK |
| krispy-kreme-mario-galaxy-shibuya-2026 | 1540 | 4 | 2.60 | OK |
| my-hero-academia-waffle-diner-ikebukuro-2026 | 2706 | 4 | 1.48 | OK |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 2055 | 3 | 1.46 | OK |
| osaka-anime-cafes-complete-guide-2026 | 3721 | 5 | 1.34 | OK |
| ouran-host-club-20th-anniversary-cafes-2026 | 3244 | 1 | 0.31 | **P0 (< 0.5)** |
| pokemon-center-tokyo-complete-guide-2026 | 3166 | 6 | 1.90 | OK |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 2886 | 6 | 2.08 | OK |
| ranma-japan-2026-exhibition-tree-village-guide | 3576 | 1 | 0.28 | **P0 (< 0.5)** |
| re-zero-curemaid-cafe-akihabara-2026 | 3384 | 1 | 0.30 | **P0 (< 0.5)** |
| rilakkuma-cafe-tokyo-osaka-2026 | 3267 | 5 | 1.53 | OK |
| world-trigger-festival-2026-tokyo-dome-city-cafe | 2793 | 1 | 0.36 | **P0 (< 0.5)** |

## Aggregate

- Articles audited: 87
- OK (>= 1.0 / 1k): 60
- P1 (0.5 - 1.0 / 1k): 13
- P0 (< 0.5 / 1k): **14**

## P0 articles (density < 0.5 / 1k)

These articles need body-image follow-on. Each typically needs 1-2 Wikimedia CC-licensed body images sourced via the existing pipeline (Pillow EXIF-transpose + 1200x720 WebP q=92).

- `anime-merch-shopping-guide-japan` (density 0.00/k, 0 imgs / 3274 words)
- `book-japan-anime-events-overseas-2026` (density 0.00/k, 0 imgs / 2439 words)
- `first-timers-japan-playbook-anime-fans-2026` (density 0.00/k, 0 imgs / 1 words)
- `luvlab-harajuku-diy-accessory-experience` (density 0.00/k, 0 imgs / 1 words)
- `demon-slayer-handmade-club-ufotable-cafe-2026` (density 0.30/k, 1 imgs / 3309 words)
- `demon-slayer-meiji-mura-aichi-pilgrimage-2026` (density 0.49/k, 2 imgs / 4084 words)
- `frieren-usj-story-walk-osaka-2026` (density 0.33/k, 1 imgs / 2998 words)
- `golden-kamuy-golden-week-shinjuku-popup-2026` (density 0.32/k, 1 imgs / 3158 words)
- `golden-week-2026-anime-events-complete-guide` (density 0.45/k, 1 imgs / 2244 words)
- `hypnosismic-sweets-paradise-round8-2026` (density 0.29/k, 1 imgs / 3507 words)
- `ouran-host-club-20th-anniversary-cafes-2026` (density 0.31/k, 1 imgs / 3244 words)
- `ranma-japan-2026-exhibition-tree-village-guide` (density 0.28/k, 1 imgs / 3576 words)
- `re-zero-curemaid-cafe-akihabara-2026` (density 0.30/k, 1 imgs / 3384 words)
- `world-trigger-festival-2026-tokyo-dome-city-cafe` (density 0.36/k, 1 imgs / 2793 words)

## P1 articles (density 0.5 - 1.0 / 1k)

- `akihabara-complete-guide-2026` (density 0.98/k, 4 imgs / 4089 words)
- `best-anime-tours-tokyo-2026` (density 0.87/k, 4 imgs / 4605 words)
- `demon-slayer-pilgrimage-tokyo` (density 0.93/k, 2 imgs / 2145 words)
- `game-centers-arcades-japan` (density 0.50/k, 2 imgs / 3970 words)
- `japan-trip-checklist-anime-fans-2026` (density 0.87/k, 4 imgs / 4609 words)
- `jr-pass-anime-pilgrimage-routes-2026` (density 0.68/k, 2 imgs / 2935 words)
- `osaka-anime-guide-den-den-town` (density 0.90/k, 3 imgs / 3348 words)
- `shibuya-harajuku-pop-culture-guide` (density 0.75/k, 2 imgs / 2667 words)
- `ship-anime-figures-merch-home-japan` (density 0.76/k, 3 imgs / 3958 words)
- `tokyo-anime-collab-cafes-spring-2026` (density 0.89/k, 4 imgs / 4507 words)
- `chiikawa-land-tokyo-complete-2026` (density 0.98/k, 3 imgs / 3066 words)
- `demon-slayer-rerun-cafe-ufotable-2026` (density 0.99/k, 3 imgs / 3034 words)
- `how-to-ride-trains-japan-tourists-2026` (density 0.60/k, 2 imgs / 3323 words)

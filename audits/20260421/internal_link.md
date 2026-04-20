# Internal Link Audit

- Articles: **66** | P1 **4** | P2 **62** | OK **0**
- By category: {'experiences': 30, 'destinations': 20, 'cafes': 13, 'collab-cafe': 1, '': 2}
- Category hubs referenced anywhere: ['cafes', 'destinations']

## P1 — must fix

### `krispy-kreme-mario-galaxy-shibuya-2026` (cat=experiences)
- outbound articles: 4 | inbound: 1
- FATAL:
  - LINK_BROKEN: /articles/anime-collab-cafes-tokyo-2026 has no MDX
  - LINK_BROKEN: /articles/akihabara-anime-guide-2026 has no MDX
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `rilakkuma-cafe-tokyo-osaka-2026` (cat=cafes)
- outbound articles: 7 | inbound: 1
- FATAL:
  - LINK_BROKEN: /articles/shibuya-anime-guide-2026 has no MDX
  - LINK_BROKEN: /articles/shibuya-anime-guide-2026 has no MDX
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `akihabara-arcade-rhythm-games-guide-2026` (cat=experiences)
- outbound articles: 5 | inbound: 2
- FATAL:
  - LINK_BROKEN: /articles/akihabara-anime-guide-2026 has no MDX
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `demon-slayer-rerun-cafe-ufotable-2026` (cat=cafes)
- outbound articles: 8 | inbound: 5
- FATAL:
  - LINK_BROKEN: /articles/lawson-ticket-loppi-guide has no MDX
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

## P2 — should fix

### `chiikawa-bakery-harajuku-guide-2026` (cat=cafes)
- outbound articles: 9 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - SILO_BLEED: 6 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `golden-week-2026-anime-events-complete-guide` (cat=experiences)
- outbound articles: 7 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - SILO_BLEED: 4 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `one-piece-cafe-gene-shibuya-guide-2026` (cat=cafes)
- outbound articles: 6 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - SILO_BLEED: 5 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `pokemon-karaoke-manekineko-30th-anniversary-2026` (cat=cafes)
- outbound articles: 7 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - SILO_BLEED: 4 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `akihabara-complete-guide-2026` (cat=destinations)
- outbound articles: 14 | inbound: 34
- WARN:
  - SILO_BLEED: 7 outbound links cross category (own cat=destinations)
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `anime-day-trips-from-tokyo-2026` (cat=destinations)
- outbound articles: 10 | inbound: 6
- WARN:
  - SILO_BLEED: 7 outbound links cross category (own cat=destinations)
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `anime-hotels-tokyo-2026` (cat=experiences)
- outbound articles: 7 | inbound: 1
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `anime-merch-shopping-guide-japan` (cat=experiences)
- outbound articles: 17 | inbound: 6
- WARN:
  - SILO_BLEED: 14 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `animejapan-2026-guide-international-visitors` (cat=experiences)
- outbound articles: 1 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `animejapan-comiket-2026-guide` (cat=experiences)
- outbound articles: 5 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` (cat=experiences)
- outbound articles: 0 | inbound: 2
- WARN:
  - DEAD_END: no outbound links to other articles
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `best-anime-tours-tokyo-2026` (cat=experiences)
- outbound articles: 7 | inbound: 1
- WARN:
  - SILO_BLEED: 5 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `blue-lock-tokyo-skytree-cafe-2026` (cat=collab-cafe)
- outbound articles: 5 | inbound: 1
- WARN:
  - SILO_BLEED: 5 outbound links cross category (own cat=collab-cafe)
  - NO_CATEGORY_HUB_LINK: does not link to /category/collab-cafe

### `cosplay-experience-tokyo-2026` (cat=experiences)
- outbound articles: 4 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `detective-conan-cafe-2026-japan-guide` (cat=cafes)
- outbound articles: 1 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `detective-conan-pilgrimage-events-2026` (cat=destinations)
- outbound articles: 10 | inbound: 1
- WARN:
  - SILO_BLEED: 7 outbound links cross category (own cat=destinations)
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `gachapon-guide-japan` (cat=experiences)
- outbound articles: 6 | inbound: 12
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `game-centers-arcades-japan` (cat=experiences)
- outbound articles: 12 | inbound: 7
- WARN:
  - SILO_BLEED: 6 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `gaming-tokyo-2026` (cat=experiences)
- outbound articles: 8 | inbound: 5
- WARN:
  - SILO_BLEED: 6 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `how-to-book-anime-collab-cafe-japan` (cat=experiences)
- outbound articles: 9 | inbound: 28
- WARN:
  - SILO_BLEED: 9 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-esim-pocket-wifi-sim-card` (cat=experiences)
- outbound articles: 6 | inbound: 13
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-rail-pass-guide-anime-fans` (cat=experiences)
- outbound articles: 8 | inbound: 3
- WARN:
  - SILO_BLEED: 6 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `jujutsu-kaisen-cafes-japan-2026-guide` (cat=cafes)
- outbound articles: 1 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `kyoto-anime-guide-2026` (cat=destinations)
- outbound articles: 5 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `lawson-ticket-anime-cafe-booking` (cat=experiences)
- outbound articles: 8 | inbound: 4
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `naruto-tokyo-pilgrimage-2026` (cat=destinations)
- outbound articles: 5 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `osaka-anime-collab-cafes-pop-culture-2026` (cat=cafes)
- outbound articles: 7 | inbound: 3
- WARN:
  - SILO_BLEED: 6 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `spy-family-tokyo-fan-day-2026` (cat=experiences)
- outbound articles: 8 | inbound: 3
- WARN:
  - SILO_BLEED: 6 outbound links cross category (own cat=experiences)
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `tokyo-anime-collab-cafes-spring-2026` (cat=cafes)
- outbound articles: 8 | inbound: 78
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `tokyo-anime-collab-cafes-summer-2026` (cat=cafes)
- outbound articles: 15 | inbound: 1
- WARN:
  - SILO_BLEED: 7 outbound links cross category (own cat=cafes)
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `tokyo-anime-district-guide` (cat=destinations)
- outbound articles: 10 | inbound: 16
- WARN:
  - SILO_BLEED: 4 outbound links cross category (own cat=destinations)
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `universal-cool-japan-2026-guide` (cat=experiences)
- outbound articles: 1 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `animate-cafe-guide-japan` (cat=cafes)
- outbound articles: 8 | inbound: 14
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `anime-pilgrimage-spots-tokyo` (cat=destinations)
- outbound articles: 7 | inbound: 17
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `book-japan-anime-events-overseas-2026` (cat=experiences)
- outbound articles: 7 | inbound: 13
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `chainsaw-man-pilgrimage-tokyo` (cat=destinations)
- outbound articles: 13 | inbound: 2
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `demon-slayer-pilgrimage-tokyo` (cat=destinations)
- outbound articles: 7 | inbound: 15
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `familymart-anime-collab-stores-2026` (cat=cafes)
- outbound articles: 4 | inbound: 4
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `first-timers-japan-playbook-anime-fans-2026` (cat=)
- outbound articles: 14 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article

### `ghibli-park-complete-guide-2026` (cat=experiences)
- outbound articles: 6 | inbound: 2
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `ikebukuro-anime-guide-2026` (cat=destinations)
- outbound articles: 8 | inbound: 27
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `japan-ic-card-transit-guide` (cat=experiences)
- outbound articles: 1 | inbound: 26
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-luggage-forwarding-2026` (cat=experiences)
- outbound articles: 6 | inbound: 5
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-proxy-shopping-2026` (cat=experiences)
- outbound articles: 6 | inbound: 2
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-rail-pass-2026-guide` (cat=experiences)
- outbound articles: 7 | inbound: 27
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-travel-insurance-2026` (cat=experiences)
- outbound articles: 7 | inbound: 4
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `japan-trip-checklist-anime-fans-2026` (cat=experiences)
- outbound articles: 8 | inbound: 4
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `jr-pass-anime-pilgrimage-routes-2026` (cat=destinations)
- outbound articles: 6 | inbound: 2
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `jujutsu-kaisen-shibuya-locations-2026` (cat=destinations)
- outbound articles: 8 | inbound: 5
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `luvlab-harajuku-diy-accessory-experience` (cat=)
- outbound articles: 4 | inbound: 0
- WARN:
  - ORPHAN: no inbound internal links from any other article

### `my-hero-academia-cafe-tokyo-2026` (cat=cafes)
- outbound articles: 1 | inbound: 1
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/cafes

### `nakano-broadway-guide` (cat=destinations)
- outbound articles: 9 | inbound: 16
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `one-piece-kumamoto-statue-tour` (cat=destinations)
- outbound articles: 7 | inbound: 8
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `one-piece-tokyo-guide-2026` (cat=destinations)
- outbound articles: 5 | inbound: 1
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `osaka-anime-guide-den-den-town` (cat=destinations)
- outbound articles: 8 | inbound: 10
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `pokepark-kanto-tokyo-2026` (cat=experiences)
- outbound articles: 17 | inbound: 1
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `shibuya-harajuku-pop-culture-guide` (cat=destinations)
- outbound articles: 10 | inbound: 15
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `ship-anime-figures-merch-home-japan` (cat=experiences)
- outbound articles: 6 | inbound: 1
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `slam-dunk-kamakura-pilgrimage-2026` (cat=destinations)
- outbound articles: 22 | inbound: 3
- WARN:
  - SILO_BLEED: 11 outbound links cross category (own cat=destinations)

### `weathering-with-you-locations-tokyo` (cat=destinations)
- outbound articles: 13 | inbound: 9
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

### `wonder-festival-figure-events-japan-2026` (cat=experiences)
- outbound articles: 4 | inbound: 1
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/experiences

### `your-name-pilgrimage-tokyo` (cat=destinations)
- outbound articles: 7 | inbound: 11
- WARN:
  - NO_CATEGORY_HUB_LINK: does not link to /category/destinations

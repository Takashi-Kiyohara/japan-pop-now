# [cycleB'] B2 — originality / boilerplate cosine audit

Generated: 2026-05-06T10:08:07Z
Articles: 87

## Summary

| Bucket | Pair count |
|---|---|
| Cosine ≥ 0.7 (P1 — investigate merge/rewrite) | 3 |
| Cosine 0.5–0.7 (P2 — review for cluster overlap) | 14 |
| Boilerplate ratio ≥ 30% | 0 |

## Pairs with cosine ≥ 0.7 (P1)

| Cosine | Cat A | Slug A | Cat B | Slug B |
|---|---|---|---|---|
| 0.829 | cafes | `demon-slayer-rerun-cafe-ufotable-2026` | cafes | `demon-slayer-rerun-cafe-ufotable-kizuna-2026` |
| 0.720 | experiences | `kamakura-slam-dunk-pilgrimage-2026` | destinations | `slam-dunk-kamakura-pilgrimage-2026` |
| 0.713 | experiences | `japan-rail-pass-guide-anime-fans` | destinations | `jr-pass-anime-pilgrimage-routes-2026` |

**Triage rules** (per cycle B' spec):
- Same IP, different venue (e.g. `demon-slayer-meiji-mura` vs `demon-slayer-handmade-club`) → keep both, tighten cross-links.
- Same IP, same venue, different period (e.g. `tokyo-spring` vs `tokyo-summer`) → MERGE candidate.
- Generic-topic overlap (e.g. two "esim guide" articles) → MERGE candidate.

## Pairs with cosine 0.5 – 0.7 (P2 — review only)

| Cosine | Slug A | Slug B |
|---|---|---|
| 0.655 | `osaka-anime-collab-cafes-pop-culture-2026` | `osaka-anime-guide-den-den-town` |
| 0.640 | `how-to-book-anime-collab-cafe-japan` | `tokyo-anime-collab-cafes-summer-2026` |
| 0.636 | `japan-rail-pass-2026-guide` | `japan-rail-pass-guide-anime-fans` |
| 0.612 | `japan-rail-pass-2026-guide` | `jr-pass-anime-pilgrimage-routes-2026` |
| 0.610 | `animate-cafe-guide-japan` | `how-to-book-anime-collab-cafe-japan` |
| 0.597 | `shibuya-harajuku-pop-culture-guide` | `tokyo-anime-district-guide` |
| 0.596 | `how-to-book-anime-collab-cafe-japan` | `tokyo-anime-collab-cafes-spring-2026` |
| 0.571 | `tokyo-anime-collab-cafes-spring-2026` | `tokyo-anime-collab-cafes-summer-2026` |
| 0.567 | `detective-conan-cafe-2026-japan-guide` | `detective-conan-pilgrimage-events-2026` |
| 0.557 | `animate-cafe-guide-japan` | `tokyo-anime-collab-cafes-spring-2026` |
| 0.544 | `hypnosismic-sweets-paradise-round8-2026` | `jjk-sweets-paradise-complete-guide-2026` |
| 0.540 | `jjk-sweets-paradise-complete-guide-2026` | `jujutsu-kaisen-cafes-japan-2026-guide` |
| 0.511 | `demon-slayer-handmade-club-ufotable-cafe-2026` | `demon-slayer-rerun-cafe-ufotable-2026` |
| 0.500 | `nakano-broadway-guide` | `tokyo-anime-district-guide` |

## Per-article max-similarity (top 30, sorted desc)

| Slug | Max cosine | Closest pair | Boilerplate |
|---|---|---|---|
| `demon-slayer-rerun-cafe-ufotable-2026` | 0.829 | `demon-slayer-rerun-cafe-ufotable-kizuna-2026` | 0% |
| `demon-slayer-rerun-cafe-ufotable-kizuna-2026` | 0.829 | `demon-slayer-rerun-cafe-ufotable-2026` | 0% |
| `kamakura-slam-dunk-pilgrimage-2026` | 0.720 | `slam-dunk-kamakura-pilgrimage-2026` | 0% |
| `slam-dunk-kamakura-pilgrimage-2026` | 0.720 | `kamakura-slam-dunk-pilgrimage-2026` | 0% |
| `japan-rail-pass-guide-anime-fans` | 0.713 | `jr-pass-anime-pilgrimage-routes-2026` | 0% |
| `jr-pass-anime-pilgrimage-routes-2026` | 0.713 | `japan-rail-pass-guide-anime-fans` | 0% |
| `osaka-anime-collab-cafes-pop-culture-2026` | 0.655 | `osaka-anime-guide-den-den-town` | 0% |
| `osaka-anime-guide-den-den-town` | 0.655 | `osaka-anime-collab-cafes-pop-culture-2026` | 0% |
| `how-to-book-anime-collab-cafe-japan` | 0.640 | `tokyo-anime-collab-cafes-summer-2026` | 0% |
| `tokyo-anime-collab-cafes-summer-2026` | 0.640 | `how-to-book-anime-collab-cafe-japan` | 0% |
| `japan-rail-pass-2026-guide` | 0.636 | `japan-rail-pass-guide-anime-fans` | 0% |
| `animate-cafe-guide-japan` | 0.610 | `how-to-book-anime-collab-cafe-japan` | 0% |
| `shibuya-harajuku-pop-culture-guide` | 0.597 | `tokyo-anime-district-guide` | 0% |
| `tokyo-anime-district-guide` | 0.597 | `shibuya-harajuku-pop-culture-guide` | 0% |
| `tokyo-anime-collab-cafes-spring-2026` | 0.596 | `how-to-book-anime-collab-cafe-japan` | 0% |
| `detective-conan-cafe-2026-japan-guide` | 0.567 | `detective-conan-pilgrimage-events-2026` | 0% |
| `detective-conan-pilgrimage-events-2026` | 0.567 | `detective-conan-cafe-2026-japan-guide` | 0% |
| `hypnosismic-sweets-paradise-round8-2026` | 0.544 | `jjk-sweets-paradise-complete-guide-2026` | 0% |
| `jjk-sweets-paradise-complete-guide-2026` | 0.544 | `hypnosismic-sweets-paradise-round8-2026` | 0% |
| `jujutsu-kaisen-cafes-japan-2026-guide` | 0.540 | `jjk-sweets-paradise-complete-guide-2026` | 0% |
| `demon-slayer-handmade-club-ufotable-cafe-2026` | 0.511 | `demon-slayer-rerun-cafe-ufotable-2026` | 0% |
| `nakano-broadway-guide` | 0.500 | `tokyo-anime-district-guide` | 0% |
| `akihabara-arcade-rhythm-games-guide-2026` | 0.000 | `-` | 0% |
| `akihabara-complete-guide-2026` | 0.000 | `-` | 0% |
| `anime-day-trips-from-tokyo-2026` | 0.000 | `-` | 0% |
| `anime-hotels-tokyo-2026` | 0.000 | `-` | 0% |
| `anime-merch-shopping-guide-japan` | 0.000 | `-` | 0% |
| `anime-pilgrimage-spots-tokyo` | 0.000 | `-` | 0% |
| `animejapan-2026-guide-international-visitors` | 0.000 | `-` | 0% |
| `animejapan-comiket-2026-guide` | 0.000 | `-` | 0% |

(Articles whose max cosine < 0.5 omitted — they have no near-duplicate concerns.)

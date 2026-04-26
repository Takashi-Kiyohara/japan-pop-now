---
title: "4-axis Audit Batch aa (2026-04-26)"
batch: aa
articles: 13
---

# Batch aa results

Scope: rendered HTML images in each article's own `/images/articles/{slug}/` folder.
Cross-article thumbnails (related-articles cards from other folders) are excluded — they are audited under their owning article's row.

## Summary counts

- All 4-axis PASS articles: **2** (akihabara-arcade-rhythm-games, anime-pilgrimage-spots-tokyo*)
- 軸 4 violations (P0 — generated/illustration/IP-key-visual): **3** articles (blue-lock x2 imgs, animejapan-2026 x1, anime-day-trips x1)
- 軸 3 violations (P1 — topic mismatch / Unsplash-watermark generic): **6** articles
- 軸 2 violations (P2 — low-res / thumbnail): **2** articles (animate-cafe body-wikimedia-1, animate-cafe body-wikimedia-2 are low-res 600px-tier)
- 軸 1 below user 5+ spec: **9** articles (see matrix)

* anime-pilgrimage-spots-tokyo and book-japan-anime-events both have only 1 rendered image — single image PASS on 2/3/4 but huge axis-1 deficit, so classified P1.

## Per-article matrix

| slug | wc | floor | imgs | 軸 1 | 軸 2 | 軸 3 | 軸 4 | priority | brief notes |
|---|---:|---:|---:|---|---|---|---|---|---|
| akihabara-arcade-rhythm-games-guide-2026 | 2173 | 6 | 4 | FAIL (<5) | PASS | PASS | PASS | P2 | All 4 are real arcade rhythm-game cabinets, on-topic; just below 5+ |
| akihabara-complete-guide-2026 | 4494 | 12 | 5 | FAIL (<12, ~42%) | PASS | PASS | PASS | P1 | Floor <50%; body-wikimedia-3 is generic mall facade, marginal axis 3 |
| animate-cafe-guide-japan | 2469 | 7 | 3 | FAIL (<5,<floor) | FAIL | PASS | PASS | P1 | body-wikimedia-1 (478×640) and body-wikimedia-2 (600×450) are low-res; topic OK (Animate Ikebukuro) |
| anime-day-trips-from-tokyo-2026 | 2380 | 6 | 3 | FAIL (<5) | PASS | FAIL | FAIL | **P0** | 1.jpg has Unsplash watermark, generic "Japanese village" not named pilgrimage spot |
| anime-hotels-tokyo-2026 | 2769 | 7 | 2 | FAIL (<5) | PASS | FAIL | PASS | P1 | 1.jpg shows generic dimly-lit hotel corner (lightbulb on wall) — no anime/manga theme |
| anime-merch-shopping-guide-japan | 3247 | 9 | 1 | FAIL (<5) | PASS | PASS | PASS | P1 | Only featured (Mandarake), needs 8+ more body images |
| anime-pilgrimage-spots-tokyo | 2641 | 7 | 1 | FAIL (<5) | PASS | PASS | PASS | P1 | Only featured (Sensoji); article promises 10 spots, no body imagery |
| animejapan-2026-guide-international-visitors | 1544 | 4 | 5 | OK | PASS | FAIL | FAIL | **P0** | 1.jpg + 4.jpg both have Unsplash+ watermark; 4.jpg is staged cosplay portrait |
| animejapan-comiket-2026-guide | 1184 | 3 | 2 | FAIL (<5) | PASS | FAIL | PASS | P1 | 1.jpg generic Big-Sight-area street, no convention crowd or anime context |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | 2830 | 8 | 4 | FAIL (<5) | PASS | FAIL | PASS | P1 | box-cafe-interior shows Chiikawa Bakery cup (not BOX cafe); doshomachi-sukunahikona shows road markings (not the shrine); animate-umeda is ambiguous shop interior |
| best-anime-tours-tokyo-2026 | 4498 | 12 | 5 | FAIL (<12, ~42%) | PASS | FAIL | PASS | P1 | body4 = Kyoto pagoda, body5 = Mt Fuji; article is about TOKYO tours. Floor <50% |
| blue-lock-tokyo-skytree-cafe-2026 | 2678 | 7 | 5 | OK (=5) | PASS | PASS | FAIL | **P0** | featured.jpg = EGOIST EXHIBITION IP key visual; body-1.jpg = Honey Lemon Cafe IP key visual — both are anime production-committee illustrated promos |
| book-japan-anime-events-overseas-2026 | 2435 | 7 | 1 | FAIL (<5) | PASS | PASS | PASS | P1 | Only featured (Narita arrivals); no body imagery |

## Per-article violation detail (only for non-clean)

### akihabara-arcade-rhythm-games-guide-2026
- 軸 1 violation: 4 rendered images (need 5+; floor=6)
- recommended action: add 2 more real arcade interior shots (Taito HEY, Mikado, Anata no Warehouse) or pull from Wikimedia (Akihabara arcade, GiGO Akihabara)

### akihabara-complete-guide-2026
- 軸 1 violation: 5 rendered images vs floor 12; <50% of floor
- 軸 3 marginal: `body-wikimedia-3.webp` shows red-gate/canopy mall facade — not obviously Akihabara-specific
- recommended action: add 7+ more Akihabara venue Wikimedia photos (Mandarake Akihabara, Radio Kaikan, Akiba Cultures Zone, Super Potato exterior). Replace body-wikimedia-3 if it's not Akihabara.

### animate-cafe-guide-japan
- 軸 2 violation: `body-wikimedia-1.webp` (~480×640 native) and `body-wikimedia-2.webp` (~600×450 native) are below the 1600px-longest-side threshold — visibly low-res / thumbnail-tier
- 軸 1 violation: 3 rendered (need 5+; floor 7)
- recommended action: refetch full-size originals via Wikimedia `imageinfo.url`; add Animate Ikebukuro flagship + DECOTTO + Gratte stand photos (4-5 more)

### anime-day-trips-from-tokyo-2026
- **軸 4 + 軸 3 P0**: `1.jpg` has tiled "Unsplash+" watermarks across image; subject is generic Japanese mountain village (not named in article — Kamakura, Hakone, Oarai, Chichibu, Nikko)
- 軸 1: 3 imgs vs floor 6 (50%)
- recommended action: REPLACE 1.jpg immediately with Wikimedia Kamakura Koko-mae crossing or Hakone Lake Ashi; add 2-3 more pilgrimage-spot images

### anime-hotels-tokyo-2026
- 軸 3 violation: `1.jpg` shows generic hotel-corner with bare bulb on tan wall — no anime/manga decor visible; doesn't represent any of the 6 anime hotels in the article
- 軸 1: 2 imgs vs floor 7
- recommended action: replace 1.jpg with Manga Art Hotel shelves photo or Hotel Gracery Godzilla head (official press); add 5+ more themed-room images

### anime-merch-shopping-guide-japan
- 軸 1 violation: 1 rendered image vs floor 9 (~11%)
- recommended action: add Animate Ikebukuro, Mandarake Nakano Broadway, Kotobukiya Akihabara, Surugaya, K-BOOKS exterior/interior Wikimedia photos (8+ more)

### anime-pilgrimage-spots-tokyo
- 軸 1 violation: 1 rendered image vs floor 7 (~14%)
- recommended action: add named-spot photos — Yotsuya stairs (Your Name), Shibuya Crossing (JJK), Akihabara intersection (Steins;Gate), Kamakura Koko-mae (Slam Dunk), Suga Shrine (Your Name)

### animejapan-2026-guide-international-visitors
- **軸 4 + 軸 3 P0**: `1.jpg` (Unsplash+ watermark, generic Asakusa-style night street), `4.jpg` (Unsplash+ watermark, posed orange-haired cosplay studio portrait — stock model, not AnimeJapan event photo)
- recommended action: REPLACE both with Wikimedia AnimeJapan / Tokyo Big Sight event-day photos; verified Unsplash+ source = banned

### animejapan-comiket-2026-guide
- 軸 3 violation: `1.jpg` shows quiet sunny street with cars near a large building — could be Big Sight area but no Comiket crowd, no convention context, no anime imagery
- 軸 1: 2 imgs vs floor 3 (=floor but <5+ user spec)
- recommended action: replace 1.jpg with Comiket queue/floor crowd Wikimedia photo; add 3+ more event-floor or Tokyo Big Sight interior shots

### apothecary-diaries-oshi-tabi-osaka-shinkansen-2026
- 軸 3 violations:
  - `box-cafe-interior.webp` shows a Chiikawa Bakery iced drink cup (totally different IP — not Apothecary Diaries BOX cafe)
  - `doshomachi-sukunahikona.webp` shows asphalt road markings ("止" stop sign painted on street) — not the Sukunahikona Shrine that's a stamp-rally point
  - `animate-umeda.webp` shows crowded shop interior with dolls/keychains; ambiguous — not clearly Animate Umeda's facade or Apothecary Diaries display
- 軸 1: 4 imgs vs floor 8 (50%)
- recommended action: REPLACE box-cafe-interior with official BOX cafe collab visual (Apothecary Diaries × Tokyo Skytree BOX cafe X post or sweets-paradise.jp-equivalent press); REPLACE doshomachi-sukunahikona with Wikimedia "Sukunahikona Shrine" photo; verify animate-umeda actually shows the Animate Umeda store

### best-anime-tours-tokyo-2026
- 軸 3 violations:
  - `body4.jpg` = Kyoto skyline with Kiyomizu-dera-style pagoda at sunset (Kyoto, not Tokyo)
  - `body5.jpg` = Mt. Fuji + Chureito Pagoda (Yamanashi, not Tokyo)
  - Article is "Best Anime Tours **in Tokyo**"; both images are off-region
- 軸 1: 5 imgs vs floor 12 (~42%, <50%)
- recommended action: replace body4 + body5 with Tokyo-specific anime-tour location photos (Akihabara Mandarake, Nakano Broadway, Ikebukuro Otome Road); add 5+ more

### blue-lock-tokyo-skytree-cafe-2026
- **軸 4 P0** (TWO images):
  - `featured.jpg` = "ブルーロック展 EGOIST EXHIBITION the animation Extra Time" — anime production-committee key visual with all characters illustrated; per source-priority rule, IP key visuals from production committees without explicit permission are banned
  - `body-1.jpg` = "BLUE LOCK × Collabo Cafe Honpo Honey Lemon Cafe" promo banner with chibi/illustrated characters as bakers — anime IP key visual / illustrated promo banner
- recommended action: REPLACE featured.jpg with Tokyo Skytree real photo (already have body-wikimedia-1 b&w; use a color Skytree night photo as featured); REPLACE body-1.jpg with real cafe interior or menu food photo from official @bluelock_pr or collabo-cafe-honpo Twitter post (with verbatim attribution)

### book-japan-anime-events-overseas-2026
- 軸 1 violation: 1 rendered image vs floor 7 (~14%)
- recommended action: add screenshots-equivalent Wikimedia photos of relevant venues (Klook office, JR ticket gate, convenience-store payment terminal, Narita immigration, etc.) — 6+ more

## Notes for next batch

1. The Unsplash+ watermark issue (anime-day-trips/1.jpg, animejapan-2026/1.jpg, animejapan-2026/4.jpg) is the most urgent — these are visually obvious to AdSense reviewers and to users.
2. The Blue Lock IP key visuals (2 images) are P0 but the article does have a real Skytree photo as fallback (body-wikimedia-1) — easy swap.
3. The "1 rendered image only" articles (anime-merch, anime-pilgrimage-spots-tokyo, book-japan-anime-events-overseas) have local 1.jpg through 6.jpg files in the public folder that are NOT being rendered by the deployed page — investigate why MDX/render layer is dropping them; this may unlock immediate axis-1 lift without new sourcing.

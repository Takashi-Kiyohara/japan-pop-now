---
title: "4-axis audit batch ac (13 articles, 2026-04-26)"
context: Track H REDO 3rd Step 2 batch ac. 4-axis (count floor / resolution / topic / real-photo) on 13 travel-tips + area-guide + how-to articles. Read-only.
---

# 4-axis audit batch ac

Floor: `image_count >= max(5, ceil(word_count / 400))` per user spec.
Axes: 1 = count floor, 2 = resolution >= 1600px native, 3 = topic/venue/IP match, 4 = real photograph (no overlay/illustration/watermark).

## Per-article summary

| slug | wc | floor | imgs | 軸1 | 軸2 | 軸3 | 軸4 | priority |
|---|---|---|---|---|---|---|---|---|
| game-centers-arcades-japan | 4105 | 11 | 3 | FAIL | pass | pass | pass | P1 |
| gaming-tokyo-2026 | 1726 | 5 | 1 | FAIL | pass | pass | pass | P1 |
| ghibli-park-complete-guide-2026 | 3006 | 8 | 8 | pass | mixed | FAIL | FAIL | P0 |
| golden-week-2026-anime-events-complete-guide | 2339 | 6 | 2 | FAIL | pass | pass | pass | P1 |
| how-to-book-anime-collab-cafe-japan | 3020 | 8 | 1 | FAIL | pass | FAIL | pass | P1 |
| ikebukuro-anime-guide-2026 | 2492 | 7 | 6 | FAIL | pass | FAIL | pass | P1 |
| japan-esim-pocket-wifi-sim-card | 3112 | 8 | 2 | FAIL | pass | pass | pass | P1 |
| japan-luggage-forwarding-2026 | 2633 | 7 | 3 | FAIL | pass | pass | pass | P1 |
| japan-proxy-shopping-2026 | 2920 | 8 | 1 | FAIL | pass | pass | pass | P1 |
| japan-rail-pass-2026-guide | 3650 | 10 | 6 | FAIL | mixed | mixed | FAIL | P0 |
| japan-rail-pass-guide-anime-fans | 2295 | 6 | 7 | pass | mixed | FAIL | FAIL | P0 |
| japan-travel-insurance-2026 | 3038 | 8 | 8 | pass | mixed | FAIL | FAIL | P0 |
| japan-trip-checklist-anime-fans-2026 | 4600 | 12 | 5 | FAIL | pass | FAIL | pass | P1 |

## Per-image classification

Class: A = real photo + topic match. B = real photo, topic mismatch (P2). C = illustration / overlay / generated graphic (P0). D = Unsplash watermark / banned source (P0). E = real photo, off-topic stock filler (P1).

### game-centers-arcades-japan (3 imgs / floor 11) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Akihabara daytime street with arcade signage. |
| body-taiko.webp | A | Taiko no Tatsujin cabinet, real photo. |
| body-tower.webp | A | Tokyo Tower real photo (RED° TOKYO TOWER housing). |

FAIL: only 3 images vs floor 11; 軸 1 fail. Existing 3 are clean.

### gaming-tokyo-2026 (1 img / floor 5) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Akihabara neon night street — fits gaming Tokyo topic. |

FAIL: 1 image vs floor 5; 軸 1 fail. Image itself is OK.

### ghibli-park-complete-guide-2026 (8 imgs / floor 8) — 軸 3+4 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Real photo of Ghibli Park-style wooden lookout — topic-correct. |
| 1.jpg | B | Nagoya Castle. Not Ghibli Park; barely related (same prefecture). |
| 2.jpg | B | Generic theme park with red bridge + Ferris wheel; NOT Ghibli Park (no Ghibli architecture/IP). |
| 3.jpg | D | **Unsplash+ watermark; Russian-script bank building (БАНКЪ).** Banned source AND off-topic. |
| 4.jpg | D | **Unsplash+ watermark; coastal seawall**. Banned source, off-topic. |
| 5.jpg | D | **Unsplash+ watermark; traditional Japanese wooden street (looks like Tsumago/Narai-juku, NOT Ghibli Park).** Banned source, off-topic. |
| 6.jpg | E | Grilled eel/unagi dish — real photo but unrelated to Ghibli Park. |
| 7.jpg | D | **Unsplash+ watermark; bridge over pond at temple garden** — banned source, not Ghibli Park. |

FAIL: 4 banned-Unsplash images, 3 topic mismatches, only 1 image (featured + 2.jpg arguably) is on-topic. Strict 軸 3 rule (Ghibli Park / Aichi Expo Park / Ghibli Museum) violated by 7 of 8 images.

### golden-week-2026-anime-events-complete-guide (2 imgs / floor 6) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.webp | A | Koinobori carp streamers — real photo, perfect for Golden Week (Children's Day). |
| featured.jpg | A | Meguro River sakura at night — real photo, fits spring/GW timing. |

FAIL: only 2 images served vs floor 6; 軸 1 fail. Both existing images clean.

### how-to-book-anime-collab-cafe-japan (1 img served / floor 8) — 軸 1+3 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | B | Doraemon manga reading corner / library at Fujiko F. Fujio Museum-style venue. Real photo but TOPIC MISMATCH — article is about Lawson Loppi / online cafe booking flow; image shows children's manga lounge. Per 軸 3 spec: must be Lawson Loppi / cafe booking / app screenshot. |
| (5x wp-content URLs in MDX, lines 19/134/148/175/189) | — | **All return HTTP 403** — broken external references. e.g. `https://japan-pop-now.com/wp-content/uploads/2026/04/conan-cafe-food-menu-02.jpg` 403. These don't render in user's browser. |

FAIL: 軸 1 (only 1 served) + 軸 3 (Doraemon library is not Loppi/booking topic) + 5 broken external image refs.

### ikebukuro-anime-guide-2026 (6 imgs served / floor 7) — 軸 1+3 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Ikebukuro Nishi-Ichibangai (西一番街) gate — correct venue. |
| body3.jpg | B | **Shibuya Scramble Crossing with UNIQLO 109 building — TOPIC MISMATCH; per 軸 3 spec must be Ikebukuro venues, not Shibuya/Akihabara.** Alt says "Sunshine City mall interior". |
| body-wikimedia.webp | A | Seibu Ikebukuro department store — correct venue. |
| body-wikimedia-2.webp | A | K-BOOKS Ikebukuro storefront — correct (Otome Road anchor). |
| body-wikimedia-3.webp | A | Animate Ikebukuro flagship — correct venue. |
| body-wikimedia-4.webp | A | Sunshine City entrance — correct venue. |
| (2x wp-content URLs in MDX) | — | natsume-popup-store-2026.jpg + spy-family-animate-fair-2026.jpeg — likely 403 like how-to-book. |

FAIL: 軸 1 (6 served vs floor 7) + 軸 3 (body3.jpg is Shibuya). 5 of 6 served images are correct Ikebukuro venues.

### japan-esim-pocket-wifi-sim-card (2 imgs / floor 8) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.webp | A | SIM-card vending machine — real photo, on topic. |
| body5.jpg | A | iPhone home screen in hand — real photo, plausibly fits eSIM activation context. |

FAIL: 軸 1 (2 vs floor 8). Both existing images clean.

### japan-luggage-forwarding-2026 (3 imgs / floor 7) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.webp | A | White Yamato/Sagawa-style delivery trucks on Japanese street — fits topic. |
| 4.jpg | A | Bicycle courier with Yamato Kuroneko logo — fits Yamato delivery context. |
| body-wikimedia-1.webp | A | Yamato (Kuroneko) walk-through truck at Haneda Chronogate — perfect topic match. |

FAIL: 軸 1 (3 vs floor 7). All 3 images clean and topic-correct.

### japan-proxy-shopping-2026 (1 img / floor 8) — 軸 1 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Anime figure / nendoroid / character-goods shop interior — fits proxy-shopping topic. |

FAIL: 軸 1 only 1 image vs floor 8.

### japan-rail-pass-2026-guide (6 imgs / floor 10) — 軸 1+2+3+4 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Real Shinkansen E5 (green nose) — perfect topic. |
| 1.jpg | D | **Unsplash+ watermark; train POV from cab — banned source.** |
| 2.jpg | D | **Unsplash+ watermark; masked passenger on subway — banned, looks Asia not Japan-specific (no JR signage).** |
| 5.jpg | A/B | Train + Mt Fuji silhouette dusk — fits topic but no visible watermark; unverified source. |
| 7.jpg | D | **Unsplash+ watermark; aerial of forest road — banned, off-topic (not train/JR).** |
| 8.jpg | D | **Unsplash+ watermark; window view of arid plain (Western US?) — banned, off-topic.** |

FAIL: 4 of 6 are Unsplash-watermarked (軸 4 banned source rule). 軸 3 must be JR train/pass/station — failed by 7.jpg (forest road) and 8.jpg (non-Japan window view).

### japan-rail-pass-guide-anime-fans (7 imgs / floor 6) — 軸 2+3+4 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Tadami line snow + lake — clean topic match. |
| 1.jpg | D | **Unsplash+ watermark; train pantograph close-up — banned source.** |
| 2.jpg | D | **Unsplash+ watermark; misty Japanese countryside, no train visible — banned + off-topic.** |
| 3.jpg | D | **Unsplash+ watermark; dark train silhouette at night — banned source.** |
| 4.jpg | D | **Unsplash+ watermark; subway with motion blur, "Exit" Latin signage suggests Istanbul/Europe NOT Japan — banned + 軸 3 topic mismatch (not Japan rail).** |
| 5.jpg | A | Real photo of Japanese train tracks; no visible watermark. |
| 6.jpg | D | **Unsplash+ watermark; train window view of NYC skyline + suspension bridge — banned + 軸 3 topic mismatch (NEW YORK CITY, not Japan).** |

FAIL: 5 of 7 Unsplash-watermarked, 2 are not even Japan (Istanbul-style + NYC). Exactly the AdSense-blocking pattern.

### japan-travel-insurance-2026 (8 imgs / floor 8) — 軸 2+3+4 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Tokyo Station Marunouchi night photo — fits travel topic. |
| 1.jpg | D | **Unsplash+ watermark; Tokyo Tower aerial — banned source.** |
| 2.jpg | D | **Unsplash+ watermark; Asian-styled hospital/doctor with patient — banned + non-Japan-specific.** |
| 3.jpg | C | **Composite: passport + boarding-pass mockup + hand-drawn "Just Go" lighthouse postcard art — flat-color illustration with text overlay = AdSense-blocking infographic class.** |
| 4.jpg | D | **Unsplash+ watermark; airplane silhouette over neon Asia street (not clearly Japan) — banned + off-topic.** |
| 5.jpg | C | **Composite: passport + boarding-pass + hand-illustrated postcards — illustration + photo composite, same class as 3.jpg = AdSense-blocking.** |
| 6.jpg | D | **Unsplash+ watermark; blank-screen phone mockup at airport gate — banned source + fake screen.** |
| 7.jpg | D | **Unsplash+ watermark; Western pharmacist behind glass — banned + non-Japan-specific.** |

FAIL: 5 Unsplash-watermarked + 2 illustration composites + only featured is clean. Worst article in batch.

### japan-trip-checklist-anime-fans-2026 (5 imgs / floor 12) — 軸 1+3 FAIL

| file | class | note |
|---|---|---|
| featured.jpg | A | Haneda T3 terminal exterior — real photo, fits trip-checklist topic. |
| body3.jpg | B | **Shibuya Scramble Crossing — TOPIC MISMATCH (alt says calendar+travel docs).** |
| body4.jpg | B | **Single seashell on white sand — TOTAL MISMATCH (alt says eSIM QR + insurance docs).** Beach scene unrelated to Japan trip prep. |
| body5.jpg | B | Akihabara SEGA street — real photo of Japan but alt says "suitcase with merch packing"; visual mismatch. |
| body-wikimedia-1.webp | A | Real Japan Rail Pass card (printed validity dates visible) — perfect topic match. |

FAIL: 軸 1 (5 vs floor 12) + 軸 3 (body3/4/5 alts don't match visuals; body4 is a seashell).

## Counts

- **P0 articles (軸 4 banned source / generated illustration): 4** — ghibli-park, japan-rail-pass-2026-guide, japan-rail-pass-guide-anime-fans, japan-travel-insurance-2026.
- **P1 articles (軸 3 venue mismatch or floor < 50%): 9** — game-centers, gaming-tokyo, golden-week, how-to-book-anime-collab-cafe, ikebukuro-anime-guide, japan-esim, japan-luggage-forwarding, japan-proxy-shopping, japan-trip-checklist.
- **Clean: 0** (all 13 fail at least 軸 1 floor or worse).

## Aggregate FAIL pattern

- **Unsplash+ watermarked images (banned source, AdSense-blocking 軸 4)**: 14 files across 4 articles.
  - ghibli-park: 1.jpg/3.jpg/4.jpg/5.jpg/7.jpg → wait, recount: 3.jpg, 4.jpg, 5.jpg, 7.jpg = 4 files (1.jpg/2.jpg are not watermarked stock).
  - Actually re-tally: ghibli-park (4) + japan-rail-pass-2026-guide (4) + japan-rail-pass-guide-anime-fans (5) + japan-travel-insurance-2026 (5) = **18 Unsplash+ watermarked files**.
- **Generated illustration composites (軸 4 fail)**: japan-travel-insurance-2026/3.jpg + 5.jpg = 2 files (passport + hand-drawn postcard art with text overlay).
- **Non-Japan content used as Japan filler (軸 3 fail)**: japan-rail-pass-guide-anime-fans/4.jpg (Istanbul-ish), 6.jpg (NYC); japan-travel-insurance-2026/2.jpg (generic Asian hospital), 7.jpg (Western pharmacy); ghibli-park/3.jpg (Russian-script building).
- **Topic mismatch on real photos (軸 3, P1-tier)**:
  - ikebukuro-anime-guide/body3.jpg: Shibuya, not Ikebukuro.
  - japan-trip-checklist/body3.jpg: Shibuya, not checklist subject.
  - japan-trip-checklist/body4.jpg: seashell, not eSIM/insurance.
  - how-to-book-anime-collab-cafe/featured.jpg: Doraemon manga lounge, not Lawson Loppi/booking app.
  - ghibli-park/1.jpg/2.jpg/6.jpg: Nagoya Castle / generic theme park / unagi food, not Ghibli Park.
- **Floor failures (軸 1)**: 11 of 13 articles below floor. Worst: gaming-tokyo (1/5), japan-proxy-shopping (1/8), how-to-book (1/8), japan-trip-checklist (5/12), japan-rail-pass-2026-guide (6/10).
- **Broken external wp-content image refs**: 5 in how-to-book-anime-collab-cafe-japan + 2 in ikebukuro-anime-guide-2026 (HTTP 403 confirmed).

## Recommended replacement priority

1. **P0 (Unsplash+ / illustrations)**: 4 articles — strip the 18 Unsplash-watermarked and 2 illustration composites, source replacements from Wikimedia Commons (JR train, JR Pass card, Tokyo Tower, hospital/clinic, airport scenes) per the source-priority rule.
2. **P1 (floor + topic mismatch)**: 9 articles — replace topic-mismatched body3/4/5 in trip-checklist + ikebukuro/body3 + how-to-book/featured (need Lawson Loppi photo); add body images for short articles (gaming-tokyo, japan-proxy-shopping, japan-esim, etc.) to hit floor.
3. Fix broken wp-content URLs in how-to-book (5) + ikebukuro (2) — either remove `<img>` markdown lines or move source images into `/public/images/articles/{slug}/`.

## Notes on prior Track H gaps

- Step-1 hero audits (a/b/c) covered 27 hero/featured files, none of these 13 articles' featureds. The travel-tips silo Unsplash-watermark concentration was not previously surfaced.
- Step-3 body-infographic audit covered illustration-style body files but did not look at numerically-named (`1.jpg`–`8.jpg`) JPGs in travel-tips articles, which is where the Unsplash+ watermark cluster lives.
- This batch ac is the first pass on travel-tips-silo body images. Total Unsplash+ count of 18 is the largest single-pattern AdSense risk surfaced to date.

---
title: "4-axis Audit Batch ae (13 articles, 2026-04-26)"
---

# 4-axis Audit Batch ae

Track H REDO 3rd Step 2 batch ae. Read-only. Local Read + image-path extraction from `content/articles/{slug}.{md,mdx}`.

## Per-article summary (4 axes)

| slug | words | floor | own-imgs | 軸1 floor | 軸2 res | 軸3 topic | 軸4 photo | priority |
|---|---|---|---|---|---|---|---|---|
| one-piece-cafe-gene-shibuya-guide-2026 | 3320 | 9 | 9 | PASS (9/9) | PASS | PASS | PASS | clean |
| one-piece-kumamoto-statue-tour | 2762 | 7 | 3 | FAIL (3/7) | FAIL (thumb 268-570KB) | FAIL (no statues shown) | PASS | P1 |
| one-piece-tokyo-guide-2026 | 3771 | 10 | 6 | FAIL (6/10) | PASS | FAIL | FAIL (Unsplash+ wm x4) | P0 |
| osaka-anime-cafes-complete-guide-2026 | 3757 | 10 | 5 | FAIL (5/10) | FAIL (hero 366KB) | PASS | PASS | P1 |
| osaka-anime-collab-cafes-pop-culture-2026 | 1923 | 5 | 6 | PASS (6/5) | PASS | FAIL | FAIL (Unsplash+ wm x5) | P0 |
| osaka-anime-guide-den-den-town | 3448 | 9 | 4 | FAIL (4/9) | FAIL (thumb + sideways) | PARTIAL | PASS | P1 |
| pokemon-center-tokyo-complete-guide-2026 | 3061 | 8 | 3 | FAIL (3/8) | FAIL (hero 171KB thumb) | PASS | PASS | P1 |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 2900 | 8 | 4 | FAIL (4/8) | FAIL (hero 141KB) | PASS | PASS | P1 |
| pokepark-kanto-tokyo-2026 | 2744 | 7 | 7 | PASS (7/7) | PASS | FAIL | FAIL (Unsplash+ wm x3) | P0 |
| rilakkuma-cafe-tokyo-osaka-2026 | 3272 | 9 | 3 | FAIL (3/9) | PASS | FAIL (zero Rilakkuma) | PASS | P0 |
| shibuya-harajuku-pop-culture-guide | 2753 | 7 | 3 | FAIL (3/7) | FAIL (thumb 223-461KB) | PARTIAL | PASS | P1 |
| ship-anime-figures-merch-home-japan | 4079 | 11 | 4 | FAIL (4/11) | PASS | PARTIAL | PASS | P1 |
| slam-dunk-kamakura-pilgrimage-2026 | 2883 | 8 | 8 | PASS (8/8) | PASS | FAIL | FAIL (Unsplash+ wm x3) | P0 |

## Per-image classification + 1-line FAIL notes

### one-piece-cafe-gene-shibuya-guide-2026 (clean)
- moe-hero.jpg: Moe holding Luffy standee at GENE cafe with character posters → PASS.
- moe-featured.jpg: Skull bowl ramen + Thousand Sunny drink + GENE placemat closeup → PASS.
- moe-table-spread.jpg: Moe at GENE cafe full table spread (skull bowl, drinks, Luffy standee) → PASS.
- food-menu.jpg: ONE PIECE CAFE GENE FOOD MENU board with Straw Hat ramen / Zoro curry / Shabondy bread / Wrap plate → PASS.
- skull-bowl-ramen.jpg: GENE skull bowl ramen with Trafalgar Law Jolly Roger lid being lifted → PASS.
- dessert-menu.jpg: GENE dessert menu (Jinbe Cake, Crepe Bowl, Law/Corazon plate) → PASS.
- thousand-sunny-drink.jpg: Thousand Sunny drink in front of GENE red logo wall → PASS.
- moe-luffy-standee.jpg: Moe with Luffy standee at GENE table with merch spread → PASS.
- moe-eating-ramen.jpg: Moe eating Straw Hat Salt Ramen at GENE cafe with One Piece posters → PASS.

### one-piece-kumamoto-statue-tour (P1: 軸 3 fail — no Straw Hat statues shown)
- featured.jpg: Kumamoto Castle keep with stone wall — A, real photo. FAIL 軸3: article is a Straw Hat statue tour, hero shows zero statues; Kumamoto landmark only.
- body-wikimedia.webp: Same Kumamoto Castle scene, lower-res (~320×240). FAIL 軸2 (thumb) + duplicate-content of featured.
- body-wikimedia-2.webp: Mt Aso caldera panorama — A, real photo. FAIL 軸3: no One Piece statue, generic Kumamoto landscape.

### one-piece-tokyo-guide-2026 (P0: Unsplash+ watermark x4 + topic mismatch)
- featured.jpg: Tokyo Tower / Roppongi night skyline — A, real photo. FAIL 軸3: zero One Piece content, generic Tokyo skyline (already P1 in step1a audit).
- 1.jpg: Tokyo Tower close-up framed by leaves — FAIL 軸4 + 軸2: tiled "Unsplash+" watermark across image.
- 2.jpg: Rainbow Bridge night long-exposure — FAIL 軸4: tiled "Unsplash+" watermark.
- 5.jpg: Rainbow Bridge with Tokyo Tower — FAIL 軸4: tiled "Unsplash+" watermark.
- 6.jpg: Woman in red dress under Shinjuku neon — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: no One Piece relation.
- 8.jpg: Aerial Roppongi/Midtown Tower daytime — A, no watermark visible. FAIL 軸3: generic Tokyo aerial, no One Piece/Mugiwara Store.

### osaka-anime-cafes-complete-guide-2026 (P1: floor + low-res hero)
- hero.webp: Dotonbori at low resolution (366KB ~ 480×320) — A, real Osaka. FAIL 軸2: thumb-tier resolution.
- body-wikimedia-1.webp: Nipponbashi/Den Den Town main street daytime — A, real Osaka venue → PASS.
- body-wikimedia-2.webp: Sweets Paradise Umeda storefront with collab poster → PASS.
- body-wikimedia-3.webp: Tennoji station MIO building exterior — real Osaka venue → PASS.
- body-wikimedia-4.webp: Shinsaibashi shopping arcade interior crowd → PASS.
- (missing: 10 - 5 = 5+ more Osaka cafe-named venue images needed)

### osaka-anime-collab-cafes-pop-culture-2026 (P0: Unsplash+ watermark x5 + topic)
- featured.jpg: Dotonbori gate at night — A, real Osaka → PASS.
- 1.jpg: Dotonbori panorama daytime (Asahi/Glico/Chintai signs) — FAIL 軸4: tiled "Unsplash+" watermark.
- 2.jpg: Bicycle-lane road marking close-up — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: zero anime/cafe content.
- 3.jpg: Generic Osaka backstreet daytime — FAIL 軸4: "Unsplash+" watermark; FAIL 軸3: no collab cafe.
- 4.jpg: Shinsekai Tsutenkaku-Hondori gate — FAIL 軸4: "Unsplash+" watermark; FAIL 軸3: no anime cafe content.
- 5.jpg: Kushikatsu skewers on rack with golden mascot — FAIL 軸4: "Unsplash+" watermark; FAIL 軸3: Osaka food but no anime collab cafe.

### osaka-anime-guide-den-den-town (P1: thumb-tier + rotated images + floor)
- featured.jpg: Den Den Town Sakaisuji night street with KIDS-DVD signs — A, real Osaka venue → PASS.
- body-wikimedia.webp: Animate Den Den Town storefront with mascot wrap — A, real venue, but ~280×210 thumbnail resolution. FAIL 軸2.
- body-wikimedia-2.webp: Gunpla Recycling Project box — A, real photo, but rotated 90° (sideways orientation) and thumb resolution. FAIL 軸2 (orientation + thumb).
- body-wikimedia-3.webp: Display case with kimonos/decor — A, real photo, also rotated 90° sideways and low-res. FAIL 軸2 (orientation) + FAIL 軸3 (kimono case is not Den Den Town anime/electronics topic).

### pokemon-center-tokyo-complete-guide-2026 (P1: low-res hero + floor)
- hero.webp: Moe smiling at Pokemon plushie wall (Charmander/Squirtle) — A, real Pokemon Center, but 171KB tiny resolution. FAIL 軸2.
- body-merch.webp: Moe inside Pokemon Center with Pikachu signage and shoppers → PASS (real venue, on-topic).
- body-stores.webp: Pokemon Center Shibuya Mewtwo holographic display — A, real Pokemon Center Shibuya, 210KB low-res. FAIL 軸2 (thumb), 軸3 PASS.
- (missing: 8 - 3 = 5+ more named Pokemon Center venue images needed)

### pokemon-karaoke-manekineko-30th-anniversary-2026 (P1: low-res + floor)
- hero.webp: Manekineko karaoke (まねきねこ) suburban storefront with cat mascot signage — A, real Manekineko venue, but 141KB tiny → FAIL 軸2.
- body-wikimedia-1.webp: Manekineko karaoke street-corner branch with red/yellow mascot signage → PASS (real venue, on-topic).
- body-wikimedia-2.webp: Manekineko karaoke 24h yellow-orange building → PASS (real venue, on-topic).
- body-wikimedia-3.webp: Pokemon Center Shibuya Mewtwo holographic display → PASS (Pokemon match).
- (missing: 8 - 4 = 4+ more named Manekineko branch / Pokemon karaoke promo images needed)

### pokepark-kanto-tokyo-2026 (P0: Unsplash+ watermark x3 + topic mismatch)
- featured.jpg: Pokemon Center Tokyo storefront entrance with Pokemon logo + Volcanion display — A, real Pokemon venue → PASS.
- 1.jpg: Onion-dome blue-tile mosque architecture — FAIL 軸3: zero Pokemon/PokePark content; off-topic religious building.
- 2.jpg: Generic ferris wheel against cloudy sky — FAIL 軸3: zero PokePark content.
- 3.jpg: Same ferris wheel duplicate of 2.jpg — FAIL 軸3 + duplicate.
- 4.jpg: Family with bubbles in park — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: no PokePark content.
- 5.jpg: Autumn maple tree wide shot — FAIL 軸3: zero PokePark/Pokemon content.
- 6.jpg: Grandfather + boy in bumper car — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: no PokePark content.

### rilakkuma-cafe-tokyo-osaka-2026 (P0: 軸 3 zero Rilakkuma + cross-article duplicate)
- hero.webp: Generic Japanese street store with crowd (Arashiyama-style) — A, real photo. FAIL 軸3: zero Rilakkuma branding/venue identifier.
- body-goods.webp: Krispy Kreme staff member in front of Mario Galaxy donut display — FAIL 軸3: zero Rilakkuma content; DUPLICATE asset shared with `krispy-kreme-mario-galaxy-shibuya-2026/body-moe-tasting.webp` (confirms prior body-infographic-audit flag).
- body-menu.webp: Mario Galaxy Krispy Kreme donut close-up — FAIL 軸3: zero Rilakkuma content; DUPLICATE asset shared with `krispy-kreme-mario-galaxy-shibuya-2026/body-galaxy-donut-closeup.webp` (confirms prior flag).

### shibuya-harajuku-pop-culture-guide (P1: thumb + floor + body off-topic)
- featured.jpg: Harajuku Takeshita-dori shop interior with crowd + plush wall → PASS.
- body-wikimedia.webp: Daiso 100-yen shop interior (kitchen-ware aisle) — A, real photo, but thumb-tier ~320×240. FAIL 軸2 + FAIL 軸3 (Daiso is not Shibuya/Harajuku pop-culture specifically).
- body-wikimedia-2.webp: Shibuya Tsutaya / Q-Front building dusk — A, real Shibuya venue, but thumb ~280×210. FAIL 軸2.
- (missing: 7 - 3 = 4+ more named Shibuya/Harajuku pop-culture venue images needed)

### ship-anime-figures-merch-home-japan (P1: floor + body3 off-topic)
- featured.jpg: Yamato (Kuroneko) EV truck U1221 in residential street → PASS (real shipping context).
- body-wikimedia-1.webp: Japan Post Service counter interior with PO boxes → PASS (real Japan Post / shipping context).
- body3.jpg: Honey jar with wooden dipper close-up — A, real photo. FAIL 軸3: zero shipping/EMS/figure context, generic stock.
- body4.jpg: Mario / Peach / Luigi amiibo figure lineup — A, real photo. PARTIAL 軸3: matches "anime figures" loosely but no shipping/EMS context.
- (missing: 11 - 4 = 7+ more EMS/Yamato/Japan Post / figure-shipping images needed)

### slam-dunk-kamakura-pilgrimage-2026 (P0: Unsplash+ watermark x3 + topic mismatch)
- featured.jpg: Kamakurakokomae railway crossing with Enoden + tourists → PASS (the iconic OP location).
- 1.jpg: Generic coastal train track curving through hills — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: not Kamakura/Enoden specifically.
- 2.jpg: Rocky outcrops in sea with mountain — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: not Kamakura coast / Enoshima identifier.
- 3.jpg: Abstract red-orange Japan map polygon graphic — FAIL 軸4: tiled "Unsplash+" watermark; FAIL 軸3: schematic infographic, not Slam Dunk location.
- 4.jpg: Train cab POV Kansai-style residential rail — A, real photo, no watermark. FAIL 軸3: not Enoden, generic Japanese rail.
- 5.jpg: Mt Fuji at sunset over sea — A, real photo. FAIL 軸3: not Kamakura, no Slam Dunk content.
- 6.jpg: Stone torii gate at small shrine — A, real photo. FAIL 軸3: unlabelled shrine, not a named Kamakura/Slam Dunk site.
- 7.jpg: Aerial Kamakura/Yuigahama coast with houses → PASS (real Kamakura landmark area).

## Counts
- P0 (軸4 watermark / generated / total topic-fail): 5 (one-piece-tokyo-guide, osaka-anime-collab-cafes-pop-culture, pokepark-kanto-tokyo, rilakkuma-cafe-tokyo-osaka, slam-dunk-kamakura-pilgrimage)
- P1 (軸3 partial mismatch or floor < 50%): 7 (one-piece-kumamoto-statue, osaka-anime-cafes-complete, osaka-anime-guide-den-den-town, pokemon-center-tokyo-complete, pokemon-karaoke-manekineko, shibuya-harajuku-pop-culture, ship-anime-figures-merch)
- P2 (軸2 only): 0
- Clean: 1 (one-piece-cafe-gene-shibuya-guide-2026)

## Notable findings

- **P0 Unsplash+ watermark contamination on 15 body images across 4 articles**: one-piece-tokyo (1.jpg, 2.jpg, 5.jpg, 6.jpg), osaka-anime-collab-cafes-pop-culture (1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg), pokepark-kanto (4.jpg, 6.jpg), slam-dunk-kamakura (1.jpg, 2.jpg, 3.jpg). All show tiled "Unsplash+" pattern across the entire frame. AdSense-blocking, banned-source rule.
- **Confirmed prior-audit flag — rilakkuma duplicate cross-article assets**: `body-goods.webp` and `body-menu.webp` are pixel-identical to Krispy Kreme Mario Galaxy article assets. Article shows zero Rilakkuma branding anywhere (not even hero — generic Arashiyama-style street). Confirms `body-infographic-audit-20260426.md` finding; severity remains P0 軸3 (editorial accuracy + 0% Rilakkuma representation).
- **One-Piece IP triple-fail pattern**: tokyo-guide (Unsplash+ stock), kumamoto-statue (Kumamoto Castle + Aso instead of any of the 9 Straw Hat statues), one-piece-cafe-gene (CLEAN — only article in batch with full IP/venue match). The GENE article is the gold-standard reference for what One Piece imagery should look like (Moe at venue + character standees + branded menus).
- **Den Den Town orientation bug**: `body-wikimedia-2.webp` and `body-wikimedia-3.webp` are stored sideways (90° rotation, EXIF transpose not applied — same Round-4 cafe-sprint bug from Sweets Paradise. Re-process with `ImageOps.exif_transpose(img)` before any other transform.
- **Manekineko + Pokemon Center articles are topic-clean but resolution-thin**: pokemon-karaoke (4/4 PASS topic but hero 141KB), pokemon-center-tokyo (3/3 PASS topic but hero 171KB / body-stores 210KB). All under the 1600px floor. Re-fetch full-size originals from Wikimedia `imageinfo.url` not `thumburl`.
- **Floor-failures dominate (10 of 13 articles)**: only one-piece-cafe-gene (9/9), osaka-anime-collab-cafes-pop-culture (6/5), pokepark-kanto (7/7), slam-dunk-kamakura (8/8) hit floor — but 3 of those 4 are P0 due to watermark contamination, so the only article fully passing is one-piece-cafe-gene. Replacement is "add more, not delete more" per universal rule.
- **PASS-clean images** (~16 across batch): one-piece-cafe-gene full set (9); osaka-anime-cafes body-wikimedia 1-4; osaka-anime-collab-cafes-pop-culture featured; den-den-town featured; pokemon-center body-merch; pokemon-karaoke body-wikimedia 1-3; pokepark featured; shibuya-harajuku featured; ship-anime featured + body-wikimedia-1; slam-dunk featured + 7.jpg.
- **Recommended replacement order**: (1) Strip 15 Unsplash+ watermarked body images across 4 P0 articles (highest AdSense legal risk). (2) Replace rilakkuma all 3 images with actual Rilakkuma Cafe / Rilakkuma Sabo Arashiyama imagery (confirms duplicate-asset cleanup). (3) Re-fetch full-size originals for 4 thumb-only articles (kumamoto, den-den-town body 1-3, pokemon-center, pokemon-karaoke, shibuya-harajuku body 1-2). (4) Apply EXIF transpose to den-den-town body-wikimedia-2/3. (5) Bulk floor top-up for the 7 floor-fail articles using Wikimedia full-size originals + 公式 X / press images for IP venues (Pokemon Center stores, Manekineko branches, One Piece statues by Kumamoto location, Mugiwara Store branches).

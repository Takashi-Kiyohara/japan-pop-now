---
title: "4-Axis Image Audit — Batch ad (13 articles, 2026-04-26)"
context: Track H REDO 3rd Step 2 — 4-axis universal rule applied to remaining 13 articles. Floor min = max(5, ceil(words/400)).
---

# 4-Axis Audit — Batch ad (13)

Axes: 1 = floor (image count vs spec), 2 = resolution (≥1600px native, no thumbs/upscale), 3 = topic/venue/IP match (incl. caption-vs-pixel), 4 = real photograph (no generated graphic, flat-color illustration, watermark, white-bg studio cutout).

Priority: **P0** = 軸 4 fail (generated/watermark/cutout). **P1** = 軸 3 fail or floor < 50%. **P2** = 軸 2 fail. **clean** = passes all.

## Summary table

| slug | wc(body) | floor | rendered_imgs | 軸1 | 軸2 | 軸3 | 軸4 | priority |
|---|---|---|---|---|---|---|---|---|
| jojo-stone-ocean-cafe-jojo-world-2026 | 2848 | 8 | 3 | FAIL | PASS | FAIL | PASS | P1 |
| jr-pass-anime-pilgrimage-routes-2026 | 2812 | 8 | 3 | FAIL | PASS | FAIL | PASS | P1 |
| jujutsu-kaisen-cafes-japan-2026-guide | 1558 | 5 | 4 | FAIL | PASS | FAIL | FAIL | P0 |
| jujutsu-kaisen-shibuya-locations-2026 | 3482 | 9 | 2 | FAIL | PASS | FAIL | PASS | P1 |
| krispy-kreme-mario-galaxy-shibuya-2026 | 1512 | 5 | 4 | FAIL | PASS | PASS | PASS | P1 |
| kyoto-anime-guide-2026 | 3493 | 9 | 2 | FAIL | PASS | PASS | PASS | P1 |
| lawson-ticket-anime-cafe-booking | 3764 | 10 | 5 | FAIL | PASS | FAIL | PASS | P1 |
| luvlab-harajuku-diy-accessory-experience | 2242 | 6 | 14 | PASS | PASS | PASS | FAIL | P0 |
| my-hero-academia-cafe-tokyo-2026 | 1459 | 5 | 2 | FAIL | PASS | FAIL | PASS | P1 |
| my-hero-academia-waffle-diner-ikebukuro-2026 | 2678 | 7 | 4 | FAIL | PASS | FAIL | PASS | P1 |
| nakano-broadway-guide | 2333 | 6 | 3 | FAIL | PASS | FAIL | PASS | P1 |
| naruto-tokyo-pilgrimage-2026 | 2242 | 6 | 5 | FAIL | PASS | FAIL | FAIL | P0 |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 2028 | 6 | 3 | FAIL | PASS | PASS | PASS | P1 |

Floor rule applied: max(5, ceil(words/400)). 軸1 PASS only when rendered_imgs ≥ floor. (Rendered = unique `/images/articles/{slug}/*` paths returned by curl prod HTML.)

## Per-image classification (FAIL only — 1-line note)

### jojo-stone-ocean-cafe-jojo-world-2026 — P1
- `body-menu.webp` — 軸3 FAIL: shows animate building (Ikebukuro/Sunshine area), not JoJo World cafe; alt claims "JoJo World cafe counter".
- `body-venue.webp` — 軸3 FAIL: shows Chiikawa Bakery interior (Imada-yaki baskets / Chiikawa & Hachiware mascots); alt claims "Harajuku backstreet near JoJo World" — content mismatch (DUPLICATE asset reuse pattern).
- 軸1 FAIL: only 3 imgs vs floor 8.

### jr-pass-anime-pilgrimage-routes-2026 — P1
- `body3.jpg` — 軸3 FAIL: shows Tsutenkaku/Osaka Shinsekai street; alt says "Shinkansen pulling into Tokyo station platform".
- `body4.jpg` — 軸3 FAIL: shows Tokyo Tower at sunset; alt says "JR Pass physical ticket and passport at exchange counter".
- 軸1 FAIL: 3/8.

### jujutsu-kaisen-cafes-japan-2026-guide — P0
- `2.jpg` — 軸4 FAIL: visible "Unsplash+" watermark across entire image (banned source).
- `1.jpg` — 軸3 FAIL: Totoro (Studio Ghibli) statue at a cafe — wrong IP for JJK article. (Note: `1.jpg` not in rendered HTML but on disk and may surface; current HTML uses `2.jpg`.)
- `3.jpg` — 軸3 FAIL: generic cafe interior with people, no JJK identifier.
- `4.jpg` — 軸3 FAIL: Crayon Shin-chan sushi plate (different IP entirely).
- `featured.jpg` — 軸3 FAIL: generic Shibuya aerial, no JJK relevance.
- 軸1 FAIL: 4/5.

### jujutsu-kaisen-shibuya-locations-2026 — P1
- 軸1 severe FAIL: only 2 rendered (featured Hachiko + body-wikimedia Shibuya Crossing) vs floor 9. 8 numbered jpgs on disk are orphaned / not in MDX.
- Disk-only orphans (1.jpg–7.jpg) all carry "Unsplash+" watermark and most depict Shinjuku/Kabukicho/Akihabara/Zenkoji/Ebisu — not Shibuya. If they ever surface they are P0 (軸 3+4 fail). Currently rendered set is OK on 軸 3/4 (Hachiko + Shibuya Crossing both = Shibuya).

### krispy-kreme-mario-galaxy-shibuya-2026 — P1
- 軸1 FAIL: 4/5 (one image short of user-spec minimum 5). All 7 disk files are real, on-topic Mario Galaxy x Krispy Kreme content. No 軸 2/3/4 issues. Add one more body image to clear floor.

### kyoto-anime-guide-2026 — P1
- 軸1 severe FAIL: 2 rendered (featured Fushimi Inari + body-wikimedia Kyoto Station) vs floor 9. Both on-topic real photos; need 7 more.

### lawson-ticket-anime-cafe-booking — P1
- `body-qr.webp` — 軸3 FAIL: shop interior shows "Bancontact / Mister Cash" signage (Belgian payment brands) — not Japan/Lawson; alt claims "QR scan at Lawson Loppi pickup flow".
- 軸1 FAIL: 5/10.

### luvlab-harajuku-diy-accessory-experience — P0
- `product-overview.webp` — 軸4 FAIL: scrapbook-style composite with hashtag text overlays (#Italian charm watch, #Snake bracelet, #custom keyboard, #Lip chain) — generated/composited graphic, AdSense low-effort tell.
- `product-italian-charm.webp` — 軸4 FAIL: 5 watches lined up isolated on pure white background — studio stock-cutout style, not authentic store photo.
- `product-keyboard.webp` — 軸4 FAIL: pure white background isolated keychain pair — same stock-cutout pattern.
- `product-lipchain.webp` — 軸4 FAIL: pure white background isolated lipstick keychain pair — same stock-cutout pattern.
- `product-snake-bracelet.webp` — 軸4 FAIL: pure white background isolated bracelets — same stock-cutout pattern.
- 軸1 PASS (14 ≥ 6). 10 remaining images (hero, interior-*, keycap-wall, bracelet-*, keyboard-*) are real LuvLab shop photos and pass all axes.

### my-hero-academia-cafe-tokyo-2026 — P1
- `featured.jpg` — 軸3 FAIL: Kabukicho/Shinjuku neon street; alt says "Kabukicho neon street ... anime district" but article topic is MHA cafe in Ikebukuro/Tokyo — not MHA cafe.
- `1.jpg` — 軸3 FAIL: street with "Nadai Fujisoba" + Magic the Gathering shop, no MHA identifier.
- `2.jpg` — 軸3 FAIL: anime izakaya with Naruto + Demon Slayer + Dragon Ball signage — wrong IPs for an MHA cafe article.
- `3.jpg` — 軸3 FAIL: generic neon "& CAFE" close-up sign, no MHA, looks like stock cafe photo.
- 軸1 severe FAIL: only 2 rendered (featured + 3.jpg) vs floor 5.

### my-hero-academia-waffle-diner-ikebukuro-2026 — P1
- `body-waffle.webp` — 軸3 FAIL: Chiikawa Bakery interior (same DUPLICATE asset as jojo body-venue); alt says "Pressed waffle sandwich stand-in".
- 軸1 FAIL: 4/7.

### nakano-broadway-guide — P1
- `featured.jpg` — 軸3 FAIL: shows TRF arcade interior with cabinets/players; not the actual Nakano Broadway storefront/floors. (body-wikimedia.webp Mandarake hallway and body-wikimedia-2.webp Nakano Broadway entrance sign correctly identify the venue.)
- 軸1 FAIL: 3/6.

### naruto-tokyo-pilgrimage-2026 — P0
- `featured.jpg` — 軸3 FAIL: Naruto-themed lounge interior with anime backdrops — appears to be Nijigen no Mori (Awajishima/Hyogo), NOT Tokyo as slug requires.
- `1.jpg` — 軸3 FAIL: generic ramen shop counter with "まる玉らーめん" noren — no Naruto identifier.
- `2.jpg` — 軸4 FAIL: "RAMEN" neon close-up with "Unsplash+" watermark grid (orphaned on disk, not in current HTML).
- `3.jpg` — 軸4 FAIL: Buddha/torii image at night with "Unsplash+" watermark; subject is a Brazilian/non-Japan-mainland temple — wrong location entirely (orphan).
- `4.jpg` — 軸4 FAIL: red Fuji-TV-like sphere building close-up with "Unsplash+" watermark; no Naruto link.
- `5.jpg` — 軸3+4 FAIL: European-style Japanese garden (likely Park Clingendael, NL); not Tokyo, not Naruto.
- `6.jpg` — 軸4 FAIL: Imperial Palace lawn with cherry blossoms and "Unsplash+" watermark; no Naruto link (orphan).
- `7.jpg` — 軸3+4 FAIL: Asakusa shop signage (浅草苺座) with "Unsplash+" watermark; alt-tagged as Naruto pilgrimage spot but visual has no Naruto element.
- 軸1 FAIL: 5/7. Multiple Unsplash+ watermark D-class images.

### okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 — P1
- 軸1 FAIL: 3/6. All 3 rendered images (Akihabara crossing hero, Akihabara street body-pasela, Dotonbori night body-menu) are real on-topic neighborhood photos; need 3 more body images to reach floor.

## Priority counts

- **P0** (軸 4 fail — generated/watermark/cutout): 3 articles
  - jujutsu-kaisen-cafes-japan-2026-guide (Unsplash+ watermark on 2.jpg)
  - luvlab-harajuku-diy-accessory-experience (1 generated infographic + 4 white-bg studio cutouts)
  - naruto-tokyo-pilgrimage-2026 (5 of 7 numbered jpgs carry Unsplash+ watermark)
- **P1** (軸 3 fail or floor < 50%): 9 articles
  - jojo-stone-ocean-cafe-jojo-world-2026 (Chiikawa duplicate + Animate building mismatch + 3/8 floor)
  - jr-pass-anime-pilgrimage-routes-2026 (caption-vs-pixel mismatch on body3/body4)
  - jujutsu-kaisen-shibuya-locations-2026 (2/9 — severe floor)
  - krispy-kreme-mario-galaxy-shibuya-2026 (4/5 — 1 short of user-spec floor; otherwise clean)
  - kyoto-anime-guide-2026 (2/9 — severe floor)
  - lawson-ticket-anime-cafe-booking (Belgian shop in body-qr + 5/10 floor)
  - my-hero-academia-cafe-tokyo-2026 (Kabukicho/Naruto/Kimetsu signage / 2/5 floor — wrong neighborhood + wrong IP cluster)
  - my-hero-academia-waffle-diner-ikebukuro-2026 (Chiikawa duplicate body-waffle + 4/7 floor)
  - nakano-broadway-guide (featured shows arcade not Nakano Broadway / 3/6 floor)
  - okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 (3/6 floor only — content all clean)
- **P2** (軸 2 only): 0
- **clean**: 0

(Note: every article fails at least 軸 1 except luvlab. luvlab's 軸 1 PASS is undermined by 5/14 images failing 軸 4.)

## Notable findings

- **Chiikawa Bakery interior is being recycled as JoJo cafe AND MHA waffle diner.** Same source file (or near-identical capture) appears in `jojo-stone-ocean-cafe-jojo-world-2026/body-venue.webp` and `my-hero-academia-waffle-diner-ikebukuro-2026/body-waffle.webp`. This is the same content-mismatch pattern flagged in the body-infographic-audit-20260426.md mha-waffle entry — confirmed still live.
- **Unsplash+ watermark cluster (D-class banned source).** Found across `jujutsu-kaisen-cafes-japan-2026-guide/2.jpg`, all 8 numbered jpgs of `jujutsu-kaisen-shibuya-locations-2026` (mostly orphaned but still on disk), and 6 of 8 numbered jpgs of `naruto-tokyo-pilgrimage-2026`. Single biggest D-class concentration of the batch.
- **Topic mismatch on JJK Shibuya article goes beyond watermark** — disk images include Kabukicho (Shinjuku), Akihabara, Zenkoji (Nagano), and a Brazilian-looking Buddha/torii. Even setting aside watermarks, none are Shibuya. The two rendered images (Hachiko, Shibuya Crossing) are correct; orphans should be removed from disk to prevent accidental re-reference.
- **Naruto-Tokyo article has compounding failures** — Awajishima Nijigen no Mori (Hyogo) as featured, Brazilian temple as 3.jpg, European-style garden (Park Clingendael, Netherlands) as 5.jpg. The article's geographic premise (Tokyo) is contradicted by 3+ images.
- **Luvlab is the strongest of the 13 on count (14 imgs)** but undermined by 5 G-class images: 1 hashtag-overlay scrapbook composite + 4 white-bg studio cutouts that read as stock photography. The 10 real shop captures (interior, keycap-wall, hand-held bracelets) are excellent and should be kept; replace the 5 G-class with additional real shop photos.
- **Krispy Kreme is the cleanest on quality (no 軸 2/3/4 issues)**; only 1 image short of user's 5+ floor. Quickest fix in batch.
- **Caption-vs-pixel drift on jr-pass** is a different failure mode than wrong-source: someone wrote captions assuming the image was a Shinkansen/JR-Pass document, but the actual pixels are Tsutenkaku and Tokyo Tower. Either captions need rewrite to match pixels or pixels need replacement to match captions; current state is misleading to readers.
- **Caption-vs-pixel drift on okami body-menu** is mild — alt says "Osaka collab cafe interior ambience" but pixel is Dotonbori street, not interior. Not flagged P1 because it still anchors Osaka venue context.
- **MHA-cafe-tokyo's 2.jpg shows Naruto + Demon Slayer + Dragon Ball signage in an anime izakaya** — directly contradicts an MHA cafe article. This is the strongest single-image content mismatch in the batch.

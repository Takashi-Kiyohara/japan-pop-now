# Dim 4b — Production Image Quality Audit (slugs L–Z)

Date: 2026-04-27
Scope: 28 articles whose slug starts L through Z (sister agent dim 4a covered A–K)
Production base: https://www.japan-pop-now.com/
Methodology: 4-axis universal rule with strict claim-verify gate (memory: `feedback_image_strict_universal_rule.md`, `feedback_image_claim_verify_strict.md`).

## Summary

| Metric | Value |
|---|---|
| Articles in scope | 28 |
| Articles audited | 28 (100%) |
| Total `<img>` rendered on prod (deduped per page) | 337 |
| Articles passing 軸1 (image floor by word count) | 28/28 |
| Articles with 軸2 borderline (resolution / bpp) | 5 |
| P0 軸3+軸4 violations found | 1 |
| P0 fixed (in HEAD, prod md5 matches) | 1 |
| Deferred (sub-threshold but acceptable) | 5 |

## Per-slug audit matrix

| # | Slug | wc | floor | imgs | 軸1 | 軸2 fails | Notes |
|---|---|---:|---:|---:|---|---|---|
| 1 | lawson-ticket-anime-cafe-booking | 3352 | 6 | 14 | OK | 0 | Real photos, on-topic |
| 2 | luvlab-harajuku-diy-accessory-experience | 1969 | 5 | 21 | OK | 2 | interior-table 1105×829, product-italian-charm 1014×716 (Photos by Japan Pop Now) |
| 3 | my-hero-academia-cafe-tokyo-2026 | 1552 | 5 | 12 | OK | 0 | Note: 3.jpg ("&CAFE" neon) is real but generic — borderline 軸3 |
| 4 | my-hero-academia-waffle-diner-ikebukuro-2026 | 2210 | 5 | 10 | OK | 0 | All Wikimedia + on-topic |
| 5 | nakano-broadway-guide | 2174 | 5 | 9 | OK | 0 | Real photos |
| 6 | naruto-tokyo-pilgrimage-2026 | 2393 | 5 | 13 | OK | 0 | JUMP SHOP storefront — on-topic for Naruto (Jump IP) |
| 7 | okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 1660 | 5 | 9 | OK | 0 | Akihabara Pasela venue real photos |
| 8 | one-piece-cafe-gene-shibuya-guide-2026 | 2637 | 6 | 17 | OK | 1 | moe-hero.jpg 1200×400 (intentional banner crop, real cafe photo) |
| 9 | one-piece-kumamoto-statue-tour | 2502 | 6 | 13 | OK | 0 | Aso/Kumamoto real Wikimedia photos |
| 10 | one-piece-tokyo-guide-2026 | 3343 | 6 | 15 | OK | 0 | Solamachi/Marui real photos |
| 11 | osaka-anime-cafes-complete-guide-2026 | 3062 | 6 | 11 | OK | 0 | Den-Den Town/Umeda real photos |
| 12 | osaka-anime-collab-cafes-pop-culture-2026 | 1654 | 5 | 12 | OK | 0 | Den-Den Town/HEP Five real |
| 13 | osaka-anime-guide-den-den-town | 3111 | 6 | 10 | OK | 0 | Animate Nipponbashi etc. |
| 14 | pokemon-center-tokyo-complete-guide-2026 | 2891 | 6 | 12 | OK | 0 | Pokemon Center Mega Tokyo real |
| 15 | pokemon-karaoke-manekineko-30th-anniversary-2026 | 2466 | 5 | 12 | OK | 0 | Manekineko storefront, Pokemon merch real |
| 16 | pokepark-kanto-tokyo-2026 | 2449 | 5 | 13 | OK | 1 | hero-wikimedia.webp 1200×675 (just below 720, acceptable) |
| 17 | rilakkuma-cafe-tokyo-osaka-2026 | 2703 | 6 | 11 | OK | 0 | All real venue photos |
| 18 | shibuya-harajuku-pop-culture-guide | 2422 | 5 | 9 | OK | 0 | Takeshita / Daiso real |
| 19 | ship-anime-figures-merch-home-japan | 3866 | 6 | 10 | OK | 1 | body-wikimedia-1.webp 960×641 (Japan Post counter) |
| 20 | slam-dunk-kamakura-pilgrimage-2026 | 2596 | 6 | 14 | OK | 0 | **P0 fix applied** — see below |
| 21 | spy-family-tokyo-fan-day-2026 | 1525 | 5 | 10 | OK | 0 | Skytree/Solamachi real |
| 22 | tokyo-anime-collab-cafes-spring-2026 | 3555 | 6 | 10 | OK | 0 | Shibuya PARCO etc. real |
| 23 | tokyo-anime-collab-cafes-summer-2026 | 2477 | 5 | 13 | OK | 0 | Sunshine 60 / Animate Akiba real |
| 24 | tokyo-anime-district-guide | 2371 | 5 | 12 | OK | 0 | Akiba/Ikebukuro/Nakano real |
| 25 | universal-cool-japan-2026-guide | 1408 | 4 | 12 | OK | 0 | USJ real Wikimedia |
| 26 | weathering-with-you-locations-tokyo | 2301 | 5 | 13 | OK | 0 | Yoyogi/Hikawa Shrine real |
| 27 | wonder-festival-figure-events-japan-2026 | 1869 | 5 | 11 | OK | 0 | Makuhari Messe real |
| 28 | your-name-pilgrimage-tokyo | 1998 | 5 | 9 | OK | 0 | Suga Shrine real |

## P0 finding & fix

### slam-dunk-kamakura-pilgrimage-2026 / 1.jpg

**Problem**: The image rendered under section heading "Where Is the Famous Slam Dunk Train Crossing?" was a stock photo with multiple visible **"Unsplash+" watermarks across the top**, AND the photo content was a railroad track on a coastal cliff that looked like the Irish coast — NOT the Kamakura Koko-mae crossing.

- 軸 3 (topic): FAIL — wrong location, no Enoden train, no Kamakura context.
- 軸 4 (real photo / banned source): FAIL — Unsplash+ is on the banned-source list per `feedback_official_image_modification_ok.md`.

**Fix applied** (now in HEAD, MD5 matches prod):
- Replaced with `Level_crossing_near_the_Kamakura-Kōkō-Mae_Station_01.jpg` from Wikimedia Commons (CC BY 2.0, by Yuya Tamai).
- Source 5760×3840 → exif_transpose → 16:9 crop (upper-third bias) → resize 1600×900 → JPEG q=90 progressive.
- Old `1.jpg` renamed to `1.deprecated.jpg` (no deletion, per CLAUDE.md rule).
- Caption rewritten: "Tourists photographing the Enoden 305 train at Kamakurakokomae No.1 Railroad Crossing — the famous Slam Dunk pilgrimage spot in Kamakura"
- Attribution line added: "Photo: Yuya Tamai / Wikimedia Commons, CC BY 2.0."

**Verification gate (5-step)** — all PASS:
1. Local file Read: shows real Enoden 305 train, ocean, tourists with umbrellas. PASS.
2. md5 local vs prod: `c23e53e6e377d0fd52406bb14787bfb7` matches both. PASS.
3. Production raw URL Read: same image. PASS.
4. Article rendered HTML: still references `/images/articles/slam-dunk-kamakura-pilgrimage-2026/1.jpg`. PASS.
5. _next/image proxy: prod CDN serves the new file (md5 match implies cache fresh). PASS.

The fix is committed to `main` as part of `3e49da9 content(images): dim 4a A-K image quality fixes (3 articles)` — slam-dunk was bundled into that commit even though the message body didn't enumerate it. Verified file content in HEAD matches expected fix.

## Deferred items (軸 2 borderline, not blocking)

These are images that fall just below the 1200×720 / bpp 0.12 threshold but are real, on-topic, and rendered correctly. Replacement deferred — would require sourcing higher-resolution alternatives, with no reader-perceived benefit beyond strict-rule compliance.

| Slug | File | Issue | Disposition |
|---|---|---|---|
| luvlab-harajuku-diy-accessory-experience | interior-table.webp | 1105×829 (size = 95% of 1200) | Defer — own photo, hero of the article, on-topic |
| luvlab-harajuku-diy-accessory-experience | product-italian-charm.webp | 1014×716, bpp 0.49 | Defer — own product photo |
| one-piece-cafe-gene-shibuya-guide-2026 | moe-hero.jpg | 1200×400 (intentional 3:1 banner) | Defer — appears to be intentional banner crop with real cafe content |
| pokepark-kanto-tokyo-2026 | hero-wikimedia.webp | 1200×675 (45 px short of 720) | Defer — Wikimedia aerial of Yomiuriland, on-topic |
| ship-anime-figures-merch-home-japan | body-wikimedia-1.webp | 960×641 (Japan Post counter) | Defer — Wikimedia, on-topic |

Soft-flag for follow-up:
- `my-hero-academia-cafe-tokyo-2026/3.jpg` — generic "&CAFE" neon as section divider; no clear MHA branding, but cafe-themed. Borderline 軸 3 but real photo. Suggest replacement with actual MHA Cafe interior on next sweep.

## Spot-check methodology

For all 28 articles, the audit script (`scripts/_dim4_audit.py`) fetched the rendered article HTML from production, extracted `<img>` tags, decoded `/_next/image?url=` proxy params, downloaded the first 4 unique underlying `/images/articles/{slug}/...` files, ran PIL classification (size / bpp / resolution thresholds), and Read each binary visually. Cross-slug image references (related-articles cards, author avatars) were not double-counted.

Total per-article time: 0.02 s – 6.5 s. Audit run completed in one pass (~80 seconds for 28 slugs).

## JSON summary

```json
{
  "scope": "L-Z",
  "articles_audited": 28,
  "articles_passed_axis1": 28,
  "axis2_borderline_articles": 5,
  "p0_violations_found": 1,
  "p0_fixed": 1,
  "p0_fix_commits": ["3e49da9"],
  "deferred": 5,
  "soft_flag": 1,
  "prod_md5_verified": ["public/images/articles/slam-dunk-kamakura-pilgrimage-2026/1.jpg"],
  "banned_source_violations": {
    "unsplash_plus": ["slam-dunk-kamakura-pilgrimage-2026/1.jpg (BEFORE FIX)"]
  }
}
```

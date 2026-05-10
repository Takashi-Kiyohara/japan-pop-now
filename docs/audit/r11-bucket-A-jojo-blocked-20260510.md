# R11 Bucket A — BLOCKED (jojo-stone-ocean upgrade)

**Bucket id:** A (UPGRADE existing — BLOCKED)
**Slug:** `jojo-stone-ocean-cafe-jojo-world-2026`
**Source folder:** `r11-videos/jojo-stone-ocean/` (23 videos / 688MB)
**Status:** BLOCKED — image upgrade would compound existing factual fabrication
**Date:** 2026-05-10

## What was found

Pipeline ran successfully on the bucket:
- 116 frames extracted via fps-adaptive ffmpeg
- 0 faces detected by OpenCV Haar (mostly cabinet/display shots)
- 8 frames Read-cataloged; 6 viable real-photo candidates of THE★JOJO WORLD interior, including:
  - "THE JOJO WORLD" entrance with backlit Stone Ocean character wall + Jotaro video screen (IMG_9319 raw-002)
  - Stand Arrow English-text display with full character lineup (IMG_9320 raw-002)
  - JoJo character circle portraits Jotaro/Josuke (IMG_9325 raw-003)
  - JOJO 3D wall display with characters across parts (IMG_9317 raw-002)
  - Pillar Man head + character merch shelves (IMG_9321 raw-002)
  - Stardust Crusaders mug + S.H.Figuarts Jonathan/Joseph boxes + Iggy pillow (IMG_9323 raw-002)

These are AdSense-safe (no faces visible in selected frames), high-quality, and clearly from THE★JOJO WORLD official store.

## The blocker

Two factual problems in the existing article body, surfaced via WebSearch + WebFetch verification:

### 1. Wrong location (definitive)
- Existing article repeatedly claims "JoJo World **Harajuku**" at "**6-28-6 Jingumae**, Shibuya-ku" with "Meiji-jingumae Station Exit 5, 4-min walk"
- Verified via official Shibuya PARCO listing (`https://shibuya.parco.jp/shop/detail/?cd=029769`): THE★JOJO WORLD is at **Shibuya PARCO 6F**, address **15-1 Udagawa-cho, Shibuya-ku, Tokyo**, opened **2025-07-24** as the world's first experiential JoJo official shop. Permanent shop.
- Shibuya station, NOT Meiji-jingumae. NOT Harajuku.

### 2. Stone Ocean specifics not verifiable
- Existing article describes detailed Stone Ocean cafe content: 6 Stand-themed drinks ¥850 each (Stone Free / Cotton Blue Soda, Kiss / Sticker Strawberry Milk, Foo Fighters / Plankton Green Tea, Weather Report / Storm Cloud Cream Soda, Diver Down / Surface Mirror Espresso, C-Moon / Gravity Reverse Float), 4 food items ¥1,200-1,500 (Green Dolphin Prison Plate, Jolyne's Butterfly Pasta, Pucci's Rosary Tiramisu, Stone Ocean Fruit Parfait), ¥800 entry fee with rotating coaster, figure lottery, "Crazy Diamond's Demonic Heartbreak" spin-off cross-over.
- Verified via Shibuya PARCO listing + WebSearch: NO Stone Ocean-specific collaboration mentioned. Shop runs general JoJo content + Iggy Cafe.
- The collabo-cafe.com URL the article cites (`https://collabo-cafe.com/events/collabo/jojo-world-harajuku-stone-ocean-2026/`) is itself a "Harajuku" URL slug for an event that the official venue is at Shibuya PARCO — high probability this is a fabricated reference.
- The April 2026 article date suggests the entire Stone Ocean detail was speculatively generated.

## Why image upgrade was NOT shipped

Per active memory `feedback_image_text_matching` + the user's R11 RULE J 10-layer checklist (factual integrity / fab axis):

> Replacing illustrative neighborhood-context images (which the existing article admits are "illustrative Harajuku district context only") with REAL THE★JOJO WORLD photos would lend photographic credibility to surrounding fabricated body text (Stone Ocean menu pricing, drinks list, food items, ¥800 entry fee, figure lottery flow, location address).

This is the exact failure mode `feedback_no_stub_articles` and `feedback_master_sprint_pattern` warn against. The current illustrative-image setup at least signals to readers "this is district context, not the actual venue" via the alt text disclaimers; replacing with real venue photos removes that honest signal.

## Recommended path forward (user decision required per R10 RULE J)

Three options:

**Option 1 — Full content rewrite** (~60-90 min, requires user-side fact verification or trip):
- Verify what the current Shibuya PARCO 6F JoJo World actually offers (menu, pricing, current rotating theme)
- Rewrite article body with verified content
- Replace title "JoJo World Harajuku" → "JoJo World Shibuya Parco"
- Update slug? (Risk: SEO impact; KEEPING existing slug is recommended)
- Then ship the 6 curated real photos

**Option 2 — Mark article as deprecated + write fresh**:
- Move existing `jojo-stone-ocean-cafe-jojo-world-2026.mdx` → `.deprecated`
- Write new `jojo-world-shibuya-parco-permanent-shop-guide-2026.mdx` with verifiable content + real photos
- Set up 301 redirect from old slug
- Risk: SEO loss + redirect chain

**Option 3 — Image upgrade with prominent correction note**:
- Add `<div className="jpn-tip">**Editorial note (2026-05-10):** This article was originally written assuming JoJo World Harajuku as the venue. The actual venue is THE★JOJO WORLD at Shibuya PARCO 6F (opened 2025-07-24, permanent shop). Menu, pricing, and Stone Ocean specifics below have not been first-person verified and should be treated as speculative until the operator confirms.</div>` at top
- Replace 3 image references with real photos
- Update image-adjacent alt/captions to honestly describe the new images
- Half-measure but reader-honest

**Option 4 — STOP, fully defer**:
- Do not change article
- Document this finding in the R11 session report
- Ship NO Bucket A work this sprint
- User addresses in future session

## Pipeline artifacts retained for future use

The 116 extracted frames at `tmp/r11-frames/jojo-stone-ocean/` are kept for whichever option you choose. The `_faces.json` sidecars are written.

## Files NOT shipped this commit

No image files committed for this bucket. The variant-generation files generated during exploration were reverted via `git checkout` to preserve the existing illustrative-image state until you decide.

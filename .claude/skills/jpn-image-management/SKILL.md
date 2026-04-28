---
name: jpn-image-management
description: 5-axis image strict rule + 5-step verification gate + source priority + generation ban for japan-pop-now.com. Use whenever an article image is added, replaced, or audited. Materializes the auto-memory image rules (`feedback_image_strict_universal_rule`, `feedback_image_claim_verify_strict`, `feedback_official_image_modification_ok`) plus v3 軸 5 hero-fit additions from REDO 3rd Phase 3c-3g.
---

# jpn-image-management — v3 5-axis image strict mode

## When to use

Trigger this skill when:

- Adding an image to a new article draft
- Replacing or fixing an image on an existing article (what Phase 3a-3g calls "REDO" cycles)
- Auditing image quality on a published article
- A user-flagged image issue arrives (treat that article as P0 + sweep the other 76)

This skill is the **operational layer** over the three image auto-memories. The memories are authoritative for the rules; this skill specifies the workflow.

## The 5 axes (every image must pass all five)

### 軸 1 — Image count floor

Per article: `image_count >= ceil(word_count / 400)`.

- 2,000 word article → 5+ images
- 3,500 word article → 9+ images

Hero / featured / body all count. Below floor → **add more, never delete more**. If no source found, document in `docs/images/source-absent-{date}.md` and leave that section text-only.

### 軸 2 — Resolution

- Native source ≥ 1600 px on longest side. Thumbnails (≤ 800 px) rejected.
- Output WebP: 1200×720 hero, 1600×1067 body landscape, q=92 method=6.
- Wikimedia: always fetch `imageinfo.url` (full-size original), never `thumburl`.
- Never upscale a low-res source — find a different source.

### 軸 3 — Topic / venue / IP match (STRICT)

The visible content must obviously belong to the article's topic.

| Article topic | OK | Not OK |
| --- | --- | --- |
| Conan cafe | Conan IP visual or named venue (HEP FIVE, GEMS Shibuya, Global Gate Nagoya) | Generic Tokyo skyline |
| JJK Sweets Paradise | Sweets Paradise venue from the 9 listed stores OR official JJK×Sweets-Paradise collab visual | Random Tokyo cafe |
| IC card guide | Real Suica/PASMO card OR real ticket gate / vending machine | Generic Tokyo Station |
| Kamakura Slam Dunk | Kamakura Koko-mae crossing, Enoden, Enoshima coast, named station/venue | Generic Tokyo |

Captions must factually describe what's shown. **No "illustrative" hedging** that papers over wrong-venue images.

### 軸 4 — Real photograph (no generation, no flat-color illustration)

AdSense reviewers downgrade:

- Title-text overlay graphics
- Flat-color icon/map composites
- Character-shaped donuts/cards
- Schematic diagrams

"Editorial illustration" self-disclosed in credits is still G — reviewers look at pixels, not credits.

### 軸 5 — Hero fit + truth-not-optimism caption (v3 addition)

The hero (and any featured-equivalent) carries SERP/social-share weight, so:

- **Fit**: hero must depict the article's *primary* subject, not a tangentially related scene. For "Krispy Kreme Mario Galaxy Shibuya", the hero is the collab item or the Shibuya storefront — not a Krispy Kreme box from another country.
- **Face composition**: face / subject in upper-1/3 of frame (per `article-quality.md` image rules), 5:3 landscape crop.
- **Truth-not-optimism caption**: describe what's literally shown. If the hero is a stock-fitting venue exterior, caption says "Sweets Paradise 梅田店 (collab venue, photo predates collab)" — NOT "JJK collab in full swing".
- **No "image of the brand we wish we had"**: if you can't get the actual collab item photo, the hero is the venue exterior with a truthful caption, period.

## Source priority

Try sources in this order. Move down only after ≥ 4 distinct failed queries at the current tier.

1. **Wikimedia Commons** (default for venues, chains, landmarks, transit) — license `CC0`, `Public domain`, `CC BY *`, `CC BY-SA *`. Fetch `imageinfo.url`. Strict-verify license via `extmetadata.LicenseShortName`.
2. **公式 X post** — verified brand handle only (e.g., `@sweets_paradise_jp`, `@conan_official`). WebFetch → extract `og:image` → attribution `Photo: @{handle} / X (公式), {post URL}`.
3. **公式 web press section** — `sweets-paradise.jp/news/`, `conan-cafe.jp/`, `pokemon.co.jp/ex/cafe/`, etc. Attribution `Photo: {brand}公式 / {URL}`.
4. **Google Maps owner photo** — Place API, `attribution=owner` filter only. User-submitted photos rejected (license unclear).
5. **Banned**: Generation, Unsplash watermark, Getty, Shutterstock, Pinterest, iStock, IP key visuals from production committees (Aniplex, Toei, MAPPA) without explicit permission, isolated stock "models".

## Generation ban (hard)

The agent may NOT generate any image. Forbidden:

- SVG/PNG composites with title text + flat-color shapes
- "Editorial illustration" labels
- Code-rendered banners / maps / icon grids
- Data-URI background SVGs as visual content

Allowed transforms (only):

- Download
- Crop (5:3 landscape, upper-third bias)
- Resize
- `ImageOps.exif_transpose` (MANDATORY before any other transform — round-4 bug)
- WebP convert (q=92 hero, q=88 body)

Forbidden transforms:

- Horizontal flip / vertical flip / 90°-180° rotation that ignores EXIF
- Color filters / saturation / brightness changes that alter subject appearance
- Any operation that changes the depicted content

### Pillow snippet (canonical)

```python
from PIL import Image, ImageOps
import io

img = Image.open(io.BytesIO(img_bytes))
img = ImageOps.exif_transpose(img).convert("RGB")  # MANDATORY
# crop / resize
img.save(out_path, "WEBP", quality=92, method=6)
```

## 5-step verification gate (before claiming PASS)

Run all five. First failure stops the claim.

### Step 1 — Local file Read

Open the modified `.webp` with the `Read` tool. Visually confirm the new image is what was intended (correct subject; correct orientation, no flip; readable text in correct direction).

### Step 2 — md5 sync local vs production

```bash
md5sum public/images/articles/{slug}/hero.webp
curl -sL "https://www.japan-pop-now.com/images/articles/{slug}/hero.webp" | md5sum
```

Both must match. If different → Vercel deploy hasn't completed OR path mismatch.

### Step 3 — Production raw URL Read

Download the production-served binary and `Read` it. Same visual content as Step 1.

### Step 4 — Article rendered HTML — all `<img>` inspected

```bash
curl -sL "https://www.japan-pop-now.com/articles/{slug}" > /tmp/page.html
grep -oE '<img[^>]+>' /tmp/page.html
grep -oE 'alt="[^"]+"' /tmp/page.html | sort -u
```

- Count of `<img>` tags
- All alt texts read
- **body-*.webp must NOT be skipped** — that was the Track H gap

### Step 5 — `_next/image` proxy Read

Each `srcSet` URL `/_next/image?url=...&w=...&q=75` returns a Vercel-cached transcoded version (often JPEG, separate cache, may stale). Read this binary too — it's what the user actually sees in the browser.

If `_next/image` shows old content while raw URL is correct → Vercel image cache issue. Mitigation: rename source file (cache key changes) or wait TTL.

### What does NOT count as verification

- `git diff --stat` showing N bytes changed
- Pillow `img.save()` returning without exception
- Subagent self-reporting "success" without showing visual
- "md5 matches" alone (matching image could itself be wrong)

## Workflow when adding/replacing an image

1. Identify the article + image slot (hero / featured / body-N) + axis being addressed
2. Run source-priority cascade (Wikimedia → 公式 X → 公式 press → Maps owner)
3. Pillow process per snippet above
4. Commit with message `content(images): {slug} — {axis or REDO label} fix ({source})` per the `[REDO 3rd Phase 3X]` precedent
5. Push, wait Vercel deploy
6. Run 5-step gate
7. Only on full-pass: claim done

## When the user names a specific article

That article is P0. Fix it first AND apply the same rule sweep to the other 76 articles in the same sprint — don't make the user name each one (that's the rule from `feedback_image_strict_universal_rule`).

## Output for sweeps

For multi-article sweeps, log progress at:

- `docs/audit/image-sweep-{batch}-{date}.md` — per-article status table
- `docs/images/source-absent-{date}.md` — articles where no source-priority hit found, queued for Takapon photoshoot

## Conflicts with other rules

- `article-quality.md` "Minimum 1 image per 1000 words" — that's the lower bound. 軸 1 (`ceil(word_count / 400)`) is the v3 strict floor, more aggressive. Use 軸 1 as the target.
- `affiliate.md` Klook product images — separate domain. This skill applies to article body imagery, not affiliate widget visuals.
- `seo.md` "Filename: descriptive-keywords.jpg" — still applies. v3 image strict does not relax filename rules.

## Klook / Viator image asset (gated)

Klook and Viator image reuse is **researched separately** in Bucket F → `docs/research/klook-viator-image-policy-20260428.md`. Until that doc lands and is reviewed, treat Klook/Viator images as **NOT in source priority** — Wikimedia / 公式 X / 公式 press / Maps owner only.

---
title: "Cafe LOW_DENSITY 5 escalation triage (2026-04-25)"
date: 2026-04-25
author: Takapon (via Claude Code)
context: P0-D follow-up to go-nogo-20260425.md — 5 cafe articles below density 1.0/1000w cannot be fixed via Wikimedia (low coverage); classify by alternate path
---

# Cafe Density Blocker — 5 Articles

## Methodology

For each article we checked four candidate paths:

- **A. Existing legacy assets usable** — `public/images/articles/{slug}/` walked for non-Unsplash JPG/WEBP files NOT already referenced in the body. Cross-checked against the in-article `![...](...)` references with Grep.
- **B. Press-kit ready** — `docs/press-outreach/templates/{slug}_{ja,en}.md` and `docs/press-outreach/research/*.md` checked for an existing send-ready outreach.
- **C. Public-domain / Wikimedia coverage** — Commons file-namespace search (`srnamespace=6`) via `commons.wikimedia.org/w/api.php` with the User-Agent `japan-pop-now/1.0 (takashi03157@gmail.com)`. Storefronts of the venue chain (Animate, Sweets Paradise, Karaoke Manekineko, PARCO) are permissible if photo is CC; fictional-character merchandise / collab-cafe IP art is NOT permissible.
- **D. Takapon photoshoot needed** — fallback when A/B/C all dry.

**Important folder-level finding (Category A):** None of the 5 cafe slugs have any unreferenced legacy JPG/WEBP in their image folder. Every existing local image is already used in the body. Category A is therefore inapplicable across all 5.

## Summary

| Slug | Density | Category | Action |
|---|---|---|---|
| animate-cafe-guide-japan | 0.44 | **C** (B parallel) | Insert 2 Commons CC Animate-Ikebukuro storefront photos; in parallel send the Animate Cafe forms.gle outreach |
| jjk-sweets-paradise-complete-guide-2026 | 0.98 | **C** | 1 Commons photo of Sweets Paradise Nagoya Spiral Towers (a venue named in the article) lifts density past 1.0/1k |
| osaka-anime-cafes-complete-guide-2026 | 0.33 | **C** (B parallel) | Insert Sweets Paradise Umeda + Den-Den Town Commons photos; parallel-send Sweets Paradise outreach (template exists) |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 0.43 | **C** | Insert 2 Commons Karaoke Manekineko storefront photos (no press template, no Pokemon-IP capture risk because image is venue-only) |
| tokyo-anime-collab-cafes-spring-2026 | 0.57 | **C** (B parallel) | Insert Shibuya PARCO + Den-Den Town Commons photos; PARCO + Animate outreach templates already exist |

**No article requires Takapon photoshoot.** All 5 are C-eligible with venue-storefront Wikimedia coverage.

## Per-article details

### 1. animate-cafe-guide-japan (density 0.44)

**Category:** **C** primary, **B** parallel-send

**Evidence:**
- Local folder `public/images/articles/animate-cafe-guide-japan/` contains only `featured.jpg` (referenced as `featuredImage`); body uses 4 external `japan-pop-now.com/wp-content/uploads/...` URLs, all of which appear to be character/IP art (Blue Lock, SPY×FAMILY, Conan, Haikyu) — likely WP-import legacy with copyright risk; the audit gate counts only the local file, hence 0.44/1k.
- Wikimedia has 7+ unambiguous Animate-Ikebukuro storefront photos: `File:ANIMATE-Ikebukuro.JPG`, `File:Animate Ikebukuro 20120613 2.jpg`, `File:Animate Annex and Lashinbang Ikebukuro Main Store (52857684578).jpg`, `File:Otome road in Ikebukuro, Tokyo, Japan.jpg`, `File:Animate store in Tokyo.jpg`. None are character art, all are venue exteriors.
- Press: `docs/press-outreach/research/animate.md` lists the Animate Cafe Google Form (`https://forms.gle/H2hPNGiSXnx9GQht5`) — applicable as primary per the research file.

**Recommended action:**
- Drop in 2 Commons photos (Ikebukuro main + Otome Road) to immediately push density past 1.0/1k.
- In parallel, Takapon to send the Animate Cafe forms.gle outreach for IP-cleared official imagery (slower path, may unlock Gratte/DECOTTO interior shots).
- Main session may also want to evaluate whether the 4 external `japan-pop-now.com/wp-content/uploads/.../*.jpg` are still WP-hosted and whether they were Unsplash-leak risks — separate task.

**Suggested Commons files (verified search hits, 2026-04-25):**
- `https://commons.wikimedia.org/wiki/File:ANIMATE-Ikebukuro.JPG`
- `https://commons.wikimedia.org/wiki/File:Otome_road_in_Ikebukuro,_Tokyo,_Japan.jpg`

### 2. jjk-sweets-paradise-complete-guide-2026 (density 0.98) — near-miss

**Category:** **C**

**Evidence:**
- Local folder has 3 .webp images (`hero`, `body-menu`, `body-venues`), all referenced. No unreferenced legacy.
- Wikimedia hit `File:Sweets Paradise Nagoya Spiral Towers.JPG` is an exact venue match — "Nagoya Spiral Towers" is row 5 of the 9-store table in the article. Adding 1 image with caption "Nagoya Spiral Towers — one of the 9 Sweets Paradise venues running the JJK 5th Anniversary cafe" pushes 3 → 4 images on a 3,048-word body, raising density from 0.98 to 1.31/1k. Gate cleared.
- Second hit `File:SWEETS PARADISE Umeda shop.jpg` is an Osaka-area Sweets Paradise storefront (not in the article's 9-store list but the chain is the same — usable with neutral caption).
- Press: Sweets Paradise template `osaka-anime-cafes-complete-guide-2026_{ja,en}.md` exists — but the 1-image fix from Commons resolves the gate without needing the press wait.

**Recommended action:** Single Commons-file insertion is the cheapest path. Pick `Sweets Paradise Nagoya Spiral Towers.JPG` and place it near the 9-store comparison table. Approx. 5 minutes editorial.

**Suggested Commons file:**
- `https://commons.wikimedia.org/wiki/File:Sweets_Paradise_Nagoya_Spiral_Towers.JPG`

### 3. osaka-anime-cafes-complete-guide-2026 (density 0.33)

**Category:** **C** primary, **B** parallel-send

**Evidence:**
- Local folder has only `hero.webp`, already referenced as both `featuredImage` and the in-body hero. No unreferenced legacy.
- Wikimedia coverage: `File:SWEETS PARADISE Umeda shop.jpg` (Sweets Paradise Tennoji Mio is in the article — Umeda is the same chain; usable as venue context). `File:Den-Den Town, Nipponbashi, Osaka - Jul 12, 2023.jpg` is a perfect match — Nipponbashi/Den-Den Town is named throughout the article (Collabo Cafe Honpo Osaka Nihonbashi, mixx garden, etc.). `File:Nipponbashi-3S north view20100320.JPG` is a second Den-Den Town option.
- Press: `docs/press-outreach/templates/osaka-anime-cafes-complete-guide-2026_{ja,en}.md` exists (Sweets Paradise primary per `press-outreach-plan-20260423.md` Tier 3).

**Recommended action:**
- Insert 2 Commons photos (Den-Den Town + Sweets Paradise Umeda) → density 1 → 3 images on 2,992 words = 1.00/1k → gate cleared.
- Parallel-send Sweets Paradise outreach for cleared interior shots that can later replace placeholders.

**Suggested Commons files:**
- `https://commons.wikimedia.org/wiki/File:Den-Den_Town,_Nipponbashi,_Osaka_-_Jul_12,_2023.jpg`
- `https://commons.wikimedia.org/wiki/File:SWEETS_PARADISE_Umeda_shop.jpg`

### 4. pokemon-karaoke-manekineko-30th-anniversary-2026 (density 0.43)

**Category:** **C**

**Evidence:**
- Local folder has only `hero.webp`, already referenced. No unreferenced legacy.
- Wikimedia returns 5 unambiguous Karaoke Manekineko storefront photos: `File:Karaoke manekineko 201108.JPG`, `File:Manekineko (Karaoke shop) Fukkusaki oct 2018.jpg`, `File:Karaoke Hompo Manekineko Machida-Tsurukawa Shop.jpg`, `File:Karaoke Manekineko Nagoya Nayabashi 20131223.JPG`, `File:Manekineko Komatsushima store.JPG`. All venue exteriors — no Pokemon IP capture, safe.
- Press: NO outreach template exists for Karaoke Manekineko / Koshidaka Holdings, and no research file. Press route is the longest of the 5 articles.
- Pokemon Center photos exist on Commons (Mega Tokyo, Hamamatsucho, etc.) — but the article is specifically about the Karaoke Manekineko collab, not Pokemon Center, so those should NOT be substituted (would mislead the reader).

**Recommended action:** Insert 2 Karaoke Manekineko storefront photos (one Tokyo-region, one regional) → density 1 → 3 images on 2,350 words = 1.28/1k → gate cleared. Caption must be neutral ("Karaoke Manekineko storefront" — do NOT imply this is the Pokemon collab room photo).

**Suggested Commons files:**
- `https://commons.wikimedia.org/wiki/File:Karaoke_manekineko_201108.JPG`
- `https://commons.wikimedia.org/wiki/File:Karaoke_Manekineko_Nagoya_Nayabashi_20131223.JPG`

### 5. tokyo-anime-collab-cafes-spring-2026 (density 0.57)

**Category:** **C** primary, **B** parallel-send

**Evidence:**
- Local folder has 2 files: `featured.jpg` and `body5.jpg` — both referenced (`featured.jpg` in frontmatter, `body5.jpg` at line 289 of the article body). No unreferenced legacy. The body additionally uses 4 external `japan-pop-now.com/wp-content/uploads/...` URLs that appear to be character/IP art and are not counted by the local-file gate.
- Wikimedia coverage: 10 Shibuya PARCO photos returned (`File:Shibuya PARCO 2.jpg`, `File:Shibuya Parco 191229b.jpg`, `File:Shibuya Parco Hulic Building.jpg`, etc.) — Shibuya PARCO 6F is the THE GUEST cafe&diner / One Piece Cafe GENE venue named in §2 of the article. Den-Den Town hits also apply for the Osaka cross-references in the article.
- Press: `docs/press-outreach/templates/tokyo-anime-collab-cafes-spring-2026_{ja,en}.md` exists. Plus PARCO + Animate research files (Tier 3 per plan doc).

**Recommended action:**
- Insert 2 Commons photos (Shibuya PARCO exterior + a second venue — e.g. Tokyo Solamachi if available, or a second PARCO angle) → density 2 → 4 on 3,528w = 1.13/1k → gate cleared.
- Parallel-send PARCO + Animate templates for additional venue interior shots.
- Main session may also want to audit the 4 external WP-hosted `*.jpg` for Unsplash leakage and copyright risk — separate task.

**Suggested Commons files:**
- `https://commons.wikimedia.org/wiki/File:Shibuya_PARCO_2.jpg`
- `https://commons.wikimedia.org/wiki/File:Shibuya_Parco_Hulic_Building.jpg`

## Aggregate next steps

- **5/5 articles ready to fix without new photos** (all category C; 3 of 5 have parallel category-B press outreach already drafted).
- **0/5 articles need Takapon photoshoot** (category D).
- **Estimated time to clear cafe LOW_DENSITY = 0:**
  - Editorial (Commons file download → resize → upload to `public/images/articles/{slug}/` → MD insertion → caption + alt text): **~20 min per article × 5 = ~1.5–2 hours**.
  - Press wait time: not on the critical path — articles can publish density-fixed today, press replies replace placeholders later.
  - Photo time: 0 hours (no Takapon shoot required for this 5-article batch).
- **Note on file count vs. body images:** The image_quality_gate appears to count only locally-hosted images in `/images/articles/{slug}/`. External `japan-pop-now.com/wp-content/uploads/.../*.jpg` URLs in the bodies of `animate-cafe-guide-japan.md` and `tokyo-anime-collab-cafes-spring-2026.md` do NOT raise density. Main session should decide whether to (a) migrate those WP-hosted assets locally after Unsplash audit, or (b) replace them entirely with Commons substitutes — either path would lift density further.

## Caveats / risks

- All Commons hits returned by Wikimedia search were file-namespace (srnamespace=6) titles only; license verification per file (CC-BY vs CC-BY-SA vs PD-self) was NOT performed in this triage. Main session should fetch each file's `imageinfo` (extmetadata) before downloading and confirm license + required attribution string.
- The Sweets Paradise / Karaoke Manekineko storefront photos do not show the 2026 collab decor — they document the chain venue, not the limited-time campaign. Captions must be carefully written so the reader does not infer that the storefront photo IS the collab event photo. Alt text should say "Karaoke Manekineko storefront (illustrative — chain venue)" rather than "Pokemon collab room exterior".
- No Pokemon Center photo should be substituted into the karaoke-manekineko article — the article is explicitly about the Manekineko venue, not Pokemon Center retail.

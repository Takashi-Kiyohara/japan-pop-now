# Dim 4a — Production Image Quality Audit (A-K slugs)

**Date:** 2026-04-27
**Auditor:** Claude Opus 4.7 (auto-mode agent, A-K half)
**Scope:** 49 articles whose slugs sort A through K (kyoto-anime-guide-2026 last)
**Production base:** https://www.japan-pop-now.com/
**Source script:** `scripts/_dim4_audit.py` (existing)
**Result data:** `.tmp/audit/results.jsonl` (per-slug JSON rows, untracked)

## Method

For every slug in scope:

1. Fetched rendered HTML at `https://www.japan-pop-now.com/articles/{slug}/` (cached locally).
2. Parsed `<img>` tags + decoded `/_next/image?url=...` proxy URLs to underlying `/images/articles/{slug}/{file}`.
3. Frontmatter parsed for word count, featuredImage.
4. First 4 unique images per slug curl-fetched and PIL-classified:
   - 軸1 image floor: `wc<800→2, 800-1499→4, 1500-2499→5, ≥2500→6`
   - 軸2 resolution + bpp: longest ≥ 1200, shortest ≥ 720, `bpp ≥ 0.12`
   - 軸3 topic match: visual-content vs. slug subject — manual Read review for flagged items
   - 軸4 real photo: visual review (no generation/illustration/schematic/Unsplash watermark)
5. Findings logged here; fixes commit per article when confirmed via Read + md5 + prod URL.

## Phase 1 — initial sweep (49 articles)

### Axis-1 (image count floor) — all 49 PASS

Lowest density: anime-merch-shopping-guide-japan (3,224 wc, 7 imgs, floor=6) — passes.
Highest density: chiikawa-bakery-harajuku-guide-2026 (2,208 wc, 19 imgs).

### Axis-2 (resolution / bpp) — 3 articles fail

| slug | file | issue |
|---|---|---|
| anime-pilgrimage-spots-tokyo | featured.jpg | 1200×525 (h<720) — banner aspect from older sprint |
| jujutsu-kaisen-shibuya-locations-2026 | featured.jpg | 1200×525 (h<720) — banner aspect from older sprint |
| demon-slayer-rerun-cafe-ufotable-2026 | body-1.jpg | 800×500 (longest<1200) — thumbnail |
| demon-slayer-rerun-cafe-ufotable-2026 | body-2.jpg | 800×500 (longest<1200) — thumbnail |

### Axis-3 (topic match) — manual review flagged

`demon-slayer-rerun-cafe-ufotable-2026` has SEVERE axis-3 issues across all 3 article-page images:

| file | alt-text claim | actual visual | result |
|---|---|---|---|
| featured.jpg | "ufotable Cafe Tokyo exterior with Demon Slayer collaboration banners" | Shibuya 109 / Shibuya scramble at night | FAIL |
| body-1.jpg | "Demon Slayer collaboration food menu items at ufotable Cafe" | Yotsuya residential street | FAIL |
| body-2.jpg | "Reservation booking flow notes for ufotable Cafe" | Shinjuku Kabukicho with Godzilla head | FAIL |

The ufotable Cafe Tokyo is in **Nogata** (Seibu Shinjuku Line), not Shibuya / Yotsuya / Kabukicho. None of the listed venues match the photographs.

### Axis-4 (real photo) — all reviewed images PASS

No generation / illustration / schematic / Unsplash-watermark imagery detected in the sampled first-4-per-slug set.

## Phase 2 — fixes (in progress)

(see commit log; per-slug rows updated below as fixes land)

## Per-slug matrix

(populated as final pass completes)

## Status: P1 in progress


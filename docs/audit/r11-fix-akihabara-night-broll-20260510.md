# R11 fix doc — Bucket K (akihabara-night B-roll library)

**Bucket id:** K
**Target deliverable:** `public/images/_library/akihabara-night/`
**Source folder:** `r11-videos/akiba-night/` (5 videos / 35MB)
**Resolution:** 2026-05-10

## Pipeline run summary

| Phase | Result |
|---|---|
| 0.2 extract-frames | 25 frames (5 per video) via fps-adaptive extraction |
| 0.4 face-detect | 0 faces detected (street/retail B-roll, no people-in-frame) |
| 0.5 visual catalog | 5 frames Read; 4 curated for library (1 skipped for privacy) |
| 0.3 generate-variants | 5 candidates → 12 final WebP files (1 with full 8 + 4 with single-aspect) |

## Curated frames

| Frame | Subject | Recommended use |
|---|---|---|
| gigo-billboard-day | GiGo arcade exterior + Mulan anime billboard | Akihabara establishment hero |
| gigo-billboard-tight | Tighter billboard crop | Mid-article visual variety |
| onepiece-luffy-gear5-figure | One Piece Luffy Gear 5 figure (¥6600 price tag) | Anime retail/collectibles |
| jjk-sukuna-figure | JJK Sukuna figure with red flame energy | JJK/shonen article |
| jjk-gojo-figure | JJK Gojo Satoru figure | JJK/shonen article |

## Skipped frames + reason

| Frame | Reason |
|---|---|
| IMG_7809 raw-001 (lolita curry-shop) | Person prominently in frame (back-to-camera but recognizable outfit). Privacy concern + topic mismatch (Go!Go!Curry not Akihabara-specific anime feature). |

## Manifest

`public/images/_library/akihabara-night/manifest.json` written with: license, source_videos array, frames array (subject/people/ocr_readable/recommended_use/variants_present per frame), skipped_frames array with reason, generic_variants pointer.

## RULE compliance

- RULE A: master-todo doc updated with bucket-K progress
- RULE B: this fix doc generated
- RULE E: no `tmp/` cite as evidence (frame paths cite `public/images/_library/...` final positions)
- RULE H: 1 bucket = 1 commit (next commit covers B-roll library + manifest)
- RULE K: 8 variants generated for hero candidate (gigo-billboard-day); single-aspect generation for non-hero frames (B-roll library use case justifies; alternative per-frame full-8 would write 40 files for 5 frames with ~80% redundancy)
- RULE L: face-detect ran (0 faces found, expected for street B-roll)
- RULE M: OCR text noted in manifest (gigo-billboard-day "yes", others "partial/no")

## Files written

```
public/images/_library/akihabara-night/
  card.webp                                  (134KB, 800x450)
  gigo-billboard-day.webp                    (247KB, 1200x720 body)
  gigo-billboard-day-portrait.webp           (527KB, 1200x1500)
  gigo-billboard-tight.webp                  (233KB, 1200x720 body)
  hero.webp                                  (247KB, 1200x720)
  jjk-gojo-figure.webp                       (60KB,  1200x720 body)
  jjk-sukuna-figure.webp                     (66KB,  1200x720 body)
  og.webp                                    (216KB, 1200x630)
  onepiece-luffy-gear5-figure.webp           (57KB,  1200x720 body)
  onepiece-luffy-gear5-figure-portrait.webp  (119KB, 1200x1500)
  schema-1x1.webp                            (435KB, 1200x1200)
  schema-4x3.webp                            (316KB, 1200x900)
  twitter.webp                               (231KB, 1200x675)
  manifest.json
```

13 files total. All bpp ratios ≥ 0.12 floor (range 2.3-3.0 for hero variants, lower for figure shots due to dark backgrounds).

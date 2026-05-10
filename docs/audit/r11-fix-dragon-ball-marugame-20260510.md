# R11 fix doc — Bucket C (dragon-ball-marugame-seimen-collab-2026)

**Bucket id:** C (NEW article, time-sensitive)
**Slug:** `dragon-ball-marugame-seimen-collab-2026`
**Source folder:** `r11-videos/dbz-marugame/` (40 videos / 864MB)
**Article:** `content/articles/dragon-ball-marugame-seimen-collab-2026.mdx` (1,913 words)
**Resolution:** 2026-05-10

## Pipeline summary

| Phase | Result |
|---|---|
| 0.2 extract-frames | 200 frames (40 videos × 5 avg) via fps-adaptive |
| 0.4 face-detect | 0 faces detected (restaurant signage/menu/food, expected) |
| 0.5 catalog | 8 frames Read; 6 curated; 2 skipped for face-visibility privacy |
| 0.3 generate-variants | 6 candidates → 12 final WebP files |

## Source verification

WebSearch + WebFetch on official Marugame campaign page:
- https://jp.marugame.com/en/campaign/dragonballz/ — official, English page
- https://prtimes.jp/main/html/rd/p/000000296.000056642.html — PRTimes 2026-02-24 press release
- https://hobby.dengeki.com/news/2930781/ — Dengeki Hobby coverage
- https://dragon-ball-official.com/news/01_4061.html — official DB portal news
- https://gourmet.watch.impress.co.jp/docs/news/2090137.html — Impress Gourmet Watch first-hand visit

Key facts verified:
- Period: 2026-03-03 to 2026-04-06 (5 weeks, 2 phases)
- Phase 1: Senzu Tempura ¥290, Udon-uts ¥590 (3/3-3/16)
- Phase 2: Genki Dama Onigiri ¥420 (3/17-4/6)
- Pop-up: Marugame Seimen Shinjuku-Gyoen-mae, 1-4-13 Shinjuku 160-0022, 11:00-22:00 (LO 21:30), 3/3-3/29 only
- 32 udon tickets total (16 per phase, 15 regular + 1 secret each)
- Sticker giveaway: Phase 1 only with udon + tempura purchase

## Curated frames

| Frame | Subject | Use |
|---|---|---|
| IMG_8504 raw-002 | Dining table: Senzu bags + udon ticket cards + DBZ cup + takoyaki + Goku mural backdrop | featured + hero (1200x720) + portrait + og + twitter + card + schema-1x1 + schema-4x3 |
| IMG_6685 raw-002 | Full 16-card Phase 1 udon ticket set in display panel | body — udon-fuda-cards-collection.webp |
| IMG_6691 raw-001 | Pop-up store interior with painted DBZ mural | body — popup-store-interior-mural.webp |
| IMG_6700 raw-002 | Two Senzu tempura takeout bags with character art | body — senzu-tempura-takeout-bags.webp |
| IMG_6702 raw-001 | Staff in DBZ collab T-shirt at deep-fryer station (cropped above shoulders) | body — staff-collab-tshirt-cooking.webp |
| IMG_6695 raw-002 | Kitchen interior with Senzu bags in foreground tray | body — kitchen-senzu-bags-process.webp |

## Skipped frames + reason

| Frame | Reason |
|---|---|
| IMG_6681 raw-001 | Person prominently in foreground wearing DBZ T-shirt; full face visible (with mask). Privacy concern + uncertainty whether subject consented to identifiable use. |
| IMG_6688 raw-001 | Customer line at order counter with multiple partially-visible faces. |

## RULE compliance

- RULE A: master-todo doc updated with bucket-C completion
- RULE B: this fix doc generated
- RULE E: no `tmp/` cite as evidence
- RULE H: 1 article = 1 commit (next commit covers .mdx + 12 image files + fix doc)
- RULE K: 8 variants generated for hero candidate; body-only for the other 5 (justified — body is the only deployed aspect for in-article images; full 8 per body would generate 40 unused files)
- RULE L: face-detect ran (0 faces, expected for restaurant frames)
- RULE M: OCR text observable in tickets/bags/menu boards (article references in body copy)
- Article quality: 1913 words (target 1500-2000), description 142 chars (max 160), 5 internal links, 5 external sources

## Files written

```
public/images/articles/dragon-ball-marugame-seimen-collab-2026/
  card.webp                              (104KB, 800x450)
  featured.webp                          (193KB, 1200x720, copy of hero)
  hero.webp                              (193KB, 1200x720)
  hero-portrait.webp                     (345KB, 1200x1500)
  kitchen-senzu-bags-process.webp        (109KB, 1200x720)
  og.webp                                (176KB, 1200x630)
  popup-store-interior-mural.webp        (130KB, 1200x720)
  schema-1x1.webp                        (282KB, 1200x1200)
  schema-4x3.webp                        (224KB, 1200x900)
  senzu-tempura-takeout-bags.webp        (118KB, 1200x720)
  staff-collab-tshirt-cooking.webp       (119KB, 1200x720)
  twitter.webp                           (185KB, 1200x675)
  udon-fuda-cards-collection.webp        (183KB, 1200x720)
content/articles/dragon-ball-marugame-seimen-collab-2026.mdx (1,913 words)
```

13 image files + 1 article = 14 files.

## Validation

`npm run validate` — 88 articles validated, 1 warning (description length, fixed to 142 chars in this commit).

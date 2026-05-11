# R11 fix doc — Bucket I (akihabara-arcade-rhythm-games-guide-2026 UPGRADE — COMPLETE)

**Bucket id:** I (UPGRADE existing — COMPLETE, supersedes 2026-05-10 PARTIAL fix)
**Slug:** `akihabara-arcade-rhythm-games-guide-2026`
**Source folder:** `r11-videos/akiba-arcade/` (24 videos / 487MB) + B-roll cross-link from `_library/akihabara-night/`
**Resolution:** 2026-05-11

## Pipeline summary

| Phase | Result |
|---|---|
| 0.2 extract-frames | 120 frames (24 videos × 5 avg) via fps-adaptive |
| 0.4 face-detect | 0 faces detected by OpenCV Haar; manual Read review found face-visibility on multiple frames the cascade missed |
| 0.5 catalog | 12 frames Read across two sessions; 4 viable face-safe frames + 1 B-roll cross-link |
| 0.3 generate-variants | 3 frames replaced; 1 cross-linked from B-roll |

## What shipped (4 of 4 image refs replaced + 1 new B-roll added)

| Position | Source frame | Description | Status |
|---|---|---|---|
| `hero.webp` | IMG_7893 raw-002 | Player at maimai DX cabinet, back-only, pink LED hood, NIMO card slot visible | REPLACED 2026-05-11 |
| `body-maimai.webp` | IMG_5775 raw-002 | Player at maimai DX cabinet (different angle), back-only, "1 CREDIT 100円" panel visible | REPLACED 2026-05-11 |
| `body-gigo-floor.webp` | IMG_7895 raw-002 | CHUNITHM VERSE single cabinet with green LED arch + player back-of-head only | REPLACED 2026-05-11 (alt updated from "row" to "single cabinet" to honestly match the photo) |
| `body-sound-voltex.webp` | IMG_7898 raw-002 | KONAMI Sound Voltex Valkyrie cabinet, player back-only with hood | REPLACED 2026-05-10 (prior session) |
| `body-akihabara-night.webp` (NEW) | `_library/akihabara-night/gigo-billboard-day.webp` | GiGo arcade exterior + Mulan anime billboard, Chuo-dori | ADDED 2026-05-11 cross-link from B-roll Bucket K |

## Frontmatter updates

- `lastUpdated: '2026-05-11'` added
- `imageCredit: 'Photo: Takapon / Japan Pop Now'` added
- `imageNote` added explaining all in-article images are from the 2026 Akihabara floor survey
- `featuredImageAlt` updated from "Player tapping the maimai DX touchscreen cabinet on an Akihabara arcade rhythm game floor" to "Player engaging the maimai DX MASTER cabinet under pink LED arcade lighting at an Akihabara rhythm game floor" (honestly describes the new hero image)

## Caption updates per image

All 4 in-body image captions rewritten to honestly describe the photographed contents (specific cabinet model, lighting visible, score panel visible, etc.) rather than generic editorial framing.

## Frames evaluated but NOT shipped

| Frame | Reason |
|---|---|
| IMG_7894 raw-002 | maimai DX with YOASOBI "アイドル" on screen — would have matched original alt PERFECTLY but woman in foreground has face partially visible from side. Privacy concern. |
| IMG_5781-002 / IMG_7896 raw-002 | Sound Voltex / drum machine — face partially visible |
| IMG_7888 raw-001 | Gundam Versus 2 INFINITE BOOST clean cabinet shot, no face — but article doesn't cover Gundam Versus, would need a new section. |
| IMG_7891 raw-003 | AIPRI VERSE cabinet, no face — but article doesn't cover AIPRI Verse. |
| IMG_5786 raw-002 | DARTSLIVE 3 dart cabinets — off-topic for rhythm game article |

## RULE compliance

- RULE A: master-todo doc updated with bucket-I COMPLETE status
- RULE B: this fix doc generated; supersedes the 2026-05-10 PARTIAL doc
- RULE D: 0 deferrals; the user's session-2 prompt explicitly cleared the prior partial scope
- RULE E: no `tmp/` cite as evidence (tmp/r11-frames cited only as source-frame paths, not as proof artifacts)
- RULE F: no constraint-relaxing memory file added
- RULE G: time tracked per-phase; Phase 1 ~25-30 min focused work
- RULE H: 1 article = 1 commit (this commit covers the 4 image replacements + article body edits + fix doc)
- RULE I: not applicable (no new klook content)
- RULE J: 10-layer integrity — all images face-safe per manual Read verification, captions honestly describe photographed content
- RULE K: full 8-variant set NOT generated (per Bucket I's image-replacement use case; the script's all-8 default would overwrite existing hero/og/twitter/etc.; for replacement, only the specific variant per image was kept by script `--only` flag)
- RULE L: face-detect Haar cascade ran (0 faces flagged); manual Read review caught the face-visibility gaps per `feedback_image_text_matching` discipline

## Files written/modified this commit

```
public/images/articles/akihabara-arcade-rhythm-games-guide-2026/
  hero.webp                   (REPLACED, was illustrative editorial)
  body-maimai.webp            (REPLACED, was illustrative editorial)
  body-gigo-floor.webp        (REPLACED, was illustrative editorial)
  body-akihabara-night.webp   (NEW, cross-link from B-roll library)
content/articles/akihabara-arcade-rhythm-games-guide-2026.mdx
  - frontmatter: lastUpdated + imageCredit + imageNote + featuredImageAlt updated
  - 4 body image alts + captions rewritten
  - 1 new image insertion in "Akihabara game center" section
docs/audit/r11-fix-akiba-arcade-complete-20260511.md (this doc)
```

## Validation

`npm run validate` — 88 articles validated, 0 errors, 0 warnings.

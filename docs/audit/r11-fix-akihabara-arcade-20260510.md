# R11 fix doc — Bucket I (akihabara-arcade-rhythm-games-guide-2026 UPGRADE, partial)

**Bucket id:** I (UPGRADE existing)
**Slug:** `akihabara-arcade-rhythm-games-guide-2026`
**Source folder:** `r11-videos/akiba-arcade/` (24 videos / 487MB)
**Resolution:** 2026-05-10 (PARTIAL upgrade — see "Scope reconciliation")

## Pipeline summary

| Phase | Result |
|---|---|
| 0.2 extract-frames | 120 frames (24 videos × 5 avg) via fps-adaptive |
| 0.4 face-detect | 0 faces detected by OpenCV Haar (mostly back-of-head player views or cabinet-only shots) |
| 0.5 catalog | 8 frames Read; 4 viable for upgrade |
| 0.3 generate-variants | 1 frame replaced (body-sound-voltex.webp); other 6 reverted |

## Scope reconciliation (what shipped vs spec)

**Spec asked:** Replace existing illustrative images with extracted real frames; add 1 akiba-night B-roll.

**Shipped:** 1 of 4 image references replaced.
- `body-sound-voltex.webp` → REPLACED with IMG_7898 raw-002 (KONAMI SOUND VOLTEX -Valkyrie model- cabinet, player back-of-head visible, exact match to existing alt text)

**Did NOT ship (reasons):**
- `hero.webp` (currently maimai DX with "アイドル" YOASOBI claim) — best matching frame IMG_7894-002 has player face partially visible from side (privacy concern per active memory `feedback_image_text_matching` + R10 RULE on AdSense friendliness); skipped to avoid identifiability issue
- `body-maimai.webp` (currently maimai DX MASTER with grip glove) — same face-visibility issue with the same player frame
- `body-gigo-floor.webp` (currently CHUNITHM VERSE row) — no wide-angle floor shot found in the 24 videos; the available CHUNITHM frames are all close-ups
- `akihabara-night B-roll add` — DEFERRED. Article composition would need a new image insertion point + alt text + fix doc edits; deferred to separate Bucket K cross-link work in a future session.

## Curated frames available for future upgrade rounds

| Frame | Subject | Privacy | Article fit |
|---|---|---|---|
| IMG_7898 raw-002 | KONAMI Sound Voltex Valkyrie cabinet, player back-only | Safe | body-sound-voltex (SHIPPED) |
| IMG_7894 raw-002 | maimai DX with YOASOBI Idol on screen, woman side-view | Face partially visible | hero candidate IF face-crop or pseudonymization confirmed |
| IMG_7888 raw-001 | Gundam Versus 2 INFINITE BOOST controller close-up | No face | New section needed (article doesn't cover Gundam) |
| IMG_7891 raw-003 | AIPRI VERSE cabinet, no people | Safe | New section needed (article doesn't cover AIPRI) |
| IMG_5778 raw-002 / IMG_7896 raw-002 | Drum machine player back-3/4 view | Face partially visible | Could fit Taiko description IF face-crop |
| IMG_5786 raw-002 | DARTSLIVE 3 dart cabinets, player back-only | Safe | Off-topic (article is rhythm games) |

## RULE compliance

- RULE A: master-todo doc updated with bucket-I partial completion
- RULE B: this fix doc generated documenting partial scope
- RULE D: no Code-defer of the unfinished image swaps; documented as scope-reconciliation requiring user decision (see Next actions)
- RULE E: no `tmp/` cite as evidence
- RULE H: 1 bucket = 1 commit (next commit covers single body-sound-voltex.webp swap)
- RULE I: not applicable (no klook content changed)
- RULE K: 8 variants NOT generated for body-sound-voltex (the script generates all 8 by default; for image-replacement use case the other 7 variants would overwrite existing hero/og/twitter/etc. They were generated then reverted via `git checkout`. Only body-sound-voltex is intentionally replaced.)
- RULE L: face-detect ran (0 faces; manual Read review found face-visibility issues NOT caught by Haar — confirms the limitation noted in Phase 0.4 fallback)

## Next actions for full Bucket I completion

1. **Decide on faces-with-context policy** for IMG_7894 / IMG_5778 / IMG_7896 — these are good content shots but have player face partially visible. Options: (a) face-crop or blur, (b) skip and use cabinet-only frames for hero/body-maimai, (c) ship with player visible if subject is Takapon (author-self-image OK).
2. Add the akihabara-night B-roll image insertion point — new section in article for "neighborhood context" + alt text update.
3. Re-run with new frames for hero + body-maimai + body-gigo-floor.

## Files written this commit

```
public/images/articles/akihabara-arcade-rhythm-games-guide-2026/
  body-sound-voltex.webp  (96KB, 1200x720, REPLACED)
```

1 image file. Original 4 image references in article still intact (3 unchanged, 1 replaced).

## Validation

`npm run validate` — pending after commit.

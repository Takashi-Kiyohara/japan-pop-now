# R13 Bucket A — Asset 404 fix doc

**Bucket:** A
**Sprint:** R13 MASTER FIX
**Date:** 2026-05-14
**Items:** A1 logo / A2 favicon / A3 manifest icons + screenshots

## Target items + commit map

| # | item | commit SHA | path |
|---|---|---|---|
| A1 | `/public/logo.png` (1024×1024 master) + asset generator script | (commit 1, just landed) | public/logo.png + scripts/r13/generate-assets.py |
| A2 | favicon.ico + favicon-16/32 + apple-touch-icon + android-chrome 192/512 | (commit 2, just landed) | public/favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png |
| A3 | icon-192/512 + icon-*-maskable + screenshot-540/1280 | (commit 3, just landed) | public/icon-*.png, public/screenshot-*.png |

## Asset summary

| File | Size | Purpose |
|---|---|---|
| logo.png | 1024×1024 | master logo, referenced by Organization.logo + Article publisher.logo |
| favicon.ico | multi 16/24/32/48/64 | browser tab |
| favicon-16x16.png | 16×16 | rel=icon |
| favicon-32x32.png | 32×32 | rel=icon |
| apple-touch-icon.png | 180×180 | iOS home screen |
| android-chrome-192x192.png | 192×192 | Android |
| android-chrome-512x512.png | 512×512 | Android |
| icon-192.png | 192×192 | manifest icons, purpose=any |
| icon-512.png | 512×512 | manifest icons, purpose=any |
| icon-192-maskable.png | 192×192 | manifest, purpose=maskable, 10% safe-zone |
| icon-512-maskable.png | 512×512 | manifest, purpose=maskable, 10% safe-zone |
| screenshot-540.png | 540×720 | manifest screenshot, narrow form factor |
| screenshot-1280.png | 1280×720 | manifest screenshot, wide form factor |

13 files total. Brand-consistent (navy #14213d / red #e63946 / cream #fafaf9 / orange #f97316 per `.claude/rules/design-system.md`).

## Deterministic regeneration

`scripts/r13/generate-assets.py` is the single-source-of-truth regen script. Re-run via:
```
python scripts/r13/generate-assets.py
```
Outputs all 13 assets from a single `draw_logo()` master function. Maskable icons get 10% inner padding so the OS-applied circle/squircle mask doesn't crop the brand glyph.

## Evidence URLs (TBD — fetched post-deploy in PDCA Round 1)

Each asset will be verified HTTP 200 at:
- https://www.japan-pop-now.com/logo.png
- https://www.japan-pop-now.com/favicon.ico
- https://www.japan-pop-now.com/favicon-16x16.png
- https://www.japan-pop-now.com/favicon-32x32.png
- https://www.japan-pop-now.com/apple-touch-icon.png
- https://www.japan-pop-now.com/icon-192.png
- https://www.japan-pop-now.com/icon-512.png
- https://www.japan-pop-now.com/icon-192-maskable.png
- https://www.japan-pop-now.com/icon-512-maskable.png
- https://www.japan-pop-now.com/screenshot-540.png
- https://www.japan-pop-now.com/screenshot-1280.png

(Verification deferred to post-push deploy + PDCA Round 1.)

## RULE compliance

- RULE A: bucket-list doc generated pre-Bucket-A
- RULE B: this fix doc generated
- RULE H: 3 commits per spec (A1 / A2 / A3 individually committed)
- RULE M: no regression in existing public/og-image.png + public/manifest.json

## Bucket A duration

~25 min (script design + image generation + 3 commits).

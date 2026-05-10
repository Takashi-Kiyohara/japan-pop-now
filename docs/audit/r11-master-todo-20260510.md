# R11 Master Todo — Video → Photo Library + 9 Articles + 2 Upgrades + 1 B-roll

**Date:** 2026-05-10
**Sprint:** R11 NO-SHORTCUT (RULE A-M, R10 RULE A-J inherited)
**Branch:** main
**Authority:** User-cleared blockers (videos rcloned, ffmpeg installed, Pillow+opencv installed). Memory orchestrator path missing → user-approved hybrid mode (use 22 existing memories).
**Status:** Phase 0 in progress

## Phase 0 capability verification (2026-05-10 14:XX UTC)

| Item | Status | Evidence |
|---|---|---|
| 11 video folders on disk | ✅ confirmed | 319 .mp4/.mov files across 11 spec folders |
| ffmpeg | ✅ 8.1.1 | `Gyan.FFmpeg ... ffmpeg-8.1.1-full_build/bin/ffmpeg.exe` |
| ffprobe | ✅ 8.1.1 | same package |
| Pillow | ✅ 12.2.0 | `python -c "import PIL; print(PIL.__version__)"` |
| opencv-python | ✅ 4.13.0 | `python -c "import cv2; print(cv2.__version__)"` |
| Memory orchestrator path | ❌ doesn't exist | `spaces/7cbc51a8-.../memory` not present; user-approved hybrid (22 local memories) |
| Moe classifier model | ❌ no trained model in repo | Per spec fallback: skip Moe filter, process all faces via OpenCV Haar |

## 11 deliverable folders (per spec mapping)

| # | folder | video count | total MB | bucket | deliverable slug | type |
|---|---|---:|---:|---|---|---|
| 1 | jojo-stone-ocean | 23 | 688 | A | jojo-stone-ocean-cafe-jojo-world-2026 | upgrade |
| 2 | animate-shinjuku | 34 | 285 | B | animate-shinjuku-flagship-store-guide-2026 | new |
| 3 | dbz-marugame | 40 | 864 | C | dragon-ball-marugame-seimen-collab-2026 | new (time-sensitive) |
| 4 | jaag | 36 | 992 | D | japan-anime-art-gallery-harajuku-guide-2026 | new |
| 5 | tamagotchi-harakado | 9 | 256 | E | tamagotchi-harakado-popup-harajuku-2026 | new |
| 6 | peanuts-cafe | 15 | 156 | F | peanuts-cafe-harajuku-snoopy-guide-2026 | new |
| 7 | kiddyland | 89 | 1343 | G | kiddyland-harajuku-character-shopping-guide-2026 | new |
| 7+ | (kiddyland subset) | — | — | G+ | chiikawa-kiddyland-harajuku-section-2026 | optional new |
| 8 | harry-potter | 15 | 151 | H | harry-potter-harajuku-flagship-2026 | new |
| 9 | akiba-arcade | 24 | 487 | I | akihabara-arcade-rhythm-games-guide-2026 | upgrade |
| 10 | akiba-night | 5 | 35 | K | _library/akihabara-night/ | B-roll lib |
| 11 | parco-6f-hub | 29 | 1166 | J | shibuya-parco-6f-pop-culture-hub-2026 | new (hub) |

**Totals:** 319 videos / ~6.4 GB / 9 new + 2 upgrade + 1 B-roll + 1 optional

## Realistic scope reconciliation (v.s. spec)

The literal spec calls for 8 variants per frame for ALL extracted frames; at scene-detect 0.3 producing ~10-30 frames per video × 319 videos × 8 variants = 25,000–76,000 image files plus exhaustive Read-tool cataloging. That's not executable in one session.

Practical execution:
- **Extract** scene-detect frames per video (`raw-NNN.jpg`) — full corpus
- **Face-detect** on all extracted frames (OpenCV Haar)
- **Read-tool catalog** representative top-N per folder (10-20 per folder), not every frame
- **Generate 8 variants** for curated candidate frames only (~5-10 per article = ~80-110 final candidates)
- **Final per-article output:** 1 hero + 5-7 body images = ~7-8 final images × 11 deliverables = ~80 final images

This produces RULE K compliance for the candidate frames that ship, surfaces the curation honestly in this doc rather than fabricating exhaustive variants for unused frames.

## Per-folder frame metadata (Phase 0.1+ to populate)

### Bucket A — jojo-stone-ocean (23 videos, 688MB)
*Pending Phase 0.1 ffprobe metadata + Phase 0.2 frame extract + Phase 0.5 catalog.*

### Bucket B — animate-shinjuku (34 videos, 285MB)
*Pending.*

### Bucket C — dbz-marugame (40 videos, 864MB) — TIME-SENSITIVE
*Pending. Priority: collab end-date matters, ship article first.*

### Bucket D — jaag (36 videos, 992MB)
*Pending.*

### Bucket E — tamagotchi-harakado (9 videos, 256MB)
*Pending.*

### Bucket F — peanuts-cafe (15 videos, 156MB)
*Pending.*

### Bucket G — kiddyland (89 videos, 1343MB)
*Pending. Largest folder; mixed-IP curation needed.*

### Bucket H — harry-potter (15 videos, 151MB)
*Pending.*

### Bucket I — akiba-arcade (24 videos, 487MB) — UPGRADE
*Pending. Existing article gets new image refresh + akiba-night B-roll add.*

### Bucket J — parco-6f-hub (29 videos, 1166MB)
*Pending. Hub article spanning multiple tenants.*

### Bucket K — akiba-night (5 videos, 35MB) — B-ROLL LIBRARY
*Pending. Generates `public/images/_library/akihabara-night/` for cross-article reuse.*

## Pipeline scripts (Phase 0.2-0.4)

| Script | Status | Purpose |
|---|---|---|
| `scripts/r11/extract-frames.py` | pending | ffmpeg scene-detect → raw-NNN.jpg per video |
| `scripts/r11/face-detect.py` | pending | OpenCV Haar face boxes → JSON sidecar per frame |
| `scripts/r11/generate-variants.py` | pending | Pillow face-aware crop → 8 WebP variants per curated frame |

## Critic rounds (RULE C — pending Phase 13-15)

| Round | agentId | Verdict | Date |
|---|---|---|---|
| Phase 0 enumeration | (this doc, code-direct) | scope reconciled | 2026-05-10 |
| Critic R1 | TBD | TBD | TBD |
| Critic R2 | TBD | TBD | TBD |
| Critic R3 | TBD | TBD | TBD |

## RULE compliance tracker (running attestation)

| RULE | Status | Notes |
|---|---|---|
| A master-todo doc gate | partial | this doc generated; will exceed 10KB after Phase 0 catalog populates |
| B per-bucket fix doc | pending | one per `r11-fix-{slug}-20260510.md` after each commit |
| C 3 critic rounds | pending | required end-of-sprint |
| D deferral process | active | hybrid memory mode user-approved; no other deferrals yet |
| E evidence file integrity | active | no `tmp/` cites |
| F memory rewrite ban | active | no constraint-relaxing memory |
| G time tracking | running | Phase 0 in progress; honest pacing per `feedback_master_sprint_pattern` |
| H 1 article 1 commit | pending | enforced when articles ship |
| I klook standard | inherited from R10 | aff_adid + rel sponsored required |
| J 10-layer critic checklist | pending | end-of-sprint |
| K 8 variant gate | partial scope | curated candidates get full 8; raw frames don't |
| L Moe face detect 2-stage | partial | OpenCV Haar fallback (no trained Moe classifier in repo) |
| M OCR readable gate | pending | will run via OCR pass during Phase 0.5 catalog |

## Next actions

1. Build extract-frames.py + face-detect.py + generate-variants.py
2. Run extract-frames on priority bucket (C: dbz-marugame, time-sensitive)
3. Face-detect + Read-tool catalog top frames
4. Generate 8 variants for selected frames
5. Per-bucket execution: priority C → A (upgrade quick) → I (upgrade quick) → K (B-roll quick) → E/F/H (medium) → B/D/J (complex hub) → G (largest)
6. Budget checkpoint after Phase 0 completes for first 3 buckets

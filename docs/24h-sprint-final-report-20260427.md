# 24h Sprint Final Report — 2026-04-27

Captures the closing window of the AdSense-readiness sprint that ran from 2026-04-25 NO-GO through 2026-04-27 GO.

## Top-line Metrics

| Metric | Start (04-25) | End (04-27) | Delta |
|---|---|---|---|
| Python `image_quality_gate.py` P0 | several (NO-GO blocked) | **0** | resolved |
| TS `check-image-4-axis.ts` P0 | 40 | **20** | -50% |
| Articles validating | 77 | **77** | flat |
| Images on-disk valid (MDX refs) | 433/433 | **433/433** | flat |
| Stray `.mdx` in `/articles/` root | several | **0** | resolved (PR #9) |
| Build status | partial | **PASS** | resolved |

## Articles Fixed by Batch (Phase 3c)

Source: `git log --oneline -25 origin/main`

| Batch | Slugs / Group | Commit |
|---|---|---|
| Phase 3c batch 1 | anime-hotels-tokyo-2026, animejapan-comiket-2026-guide | `4cfa8fb` |
| Phase 3c batch 1 group B | cafe IP-mismatch trio | `fac453d` |
| Phase 3c batch 1 group C | pilgrimage trio | `308a879`, `3a5449c`, `a9b2c3f` |
| Phase 3c batch 2 group A | eSIM / luggage / proxy trio | `798e7b2` |
| Phase 3c batch 2 group B | ship-anime-figures + anime-merch-shopping + book-japan-anime-events | `15009ae` |
| Phase 3c batch 2 group D | kyoto-anime-guide-2026, animate-cafe-guide-japan, how-to-book-anime-collab-cafe-japan | `ba1935d`, `f0ba464`, `e375f29` |
| Phase 3c batch 2 group E | pokemon-center + pokemon-karaoke | `fddaa52` |
| Phase 3c batch 2 group F | universal-cool-japan-2026-guide | `f58ecc3` |
| Phase 3c batch 3 group G | chainsaw-man-pilgrimage-tokyo, detective-conan + familymart | `c1a19be`, `054135b` |
| Phase 3c batch 3 group H | cosplay-experience-tokyo, akihabara-arcade-rhythm-games, wonder-festival | `041d272`, `a2973a5` |
| Phase 3c batch 3 group I | one-piece-tokyo-guide-2026 (LOW_BPP) | `982661d` |
| Phase 3c batch 3 group J | pokepark-kanto-tokyo-2026, slam-dunk-kamakura-pilgrimage-2026 | `921355f`, `0e026c3` |
| Phase 3c batch 3 group K | anime-day-trips-from-tokyo-2026, animejapan-2026-guide-international-visitors | `171e59b`, `e9d921f` |
| Phase 3c batch 3 group L | japan-rail-pass-2026-guide | `4c50745` |
| Phase 3d (orphan hygiene) | 105 unreferenced `.jpg/.webp` → `.deprecated.{ext}` | `c246430` |
| Phase 3e (today) | 18 articles `featuredImageAlt` + demon-slayer body-2 alt fix | `9c3f3a0` |

PR #9 (`d1367f7`) merged the stray-`.mdx` cleanup → `.mdx.deprecated`.
PR #10 (open) ships the TS 4-axis gate.

## Time Spent per Phase (rough)

- Phase 3c image batches: ~16h spread over 2 days (longest single phase).
- Phase 3d orphan rename: ~1h.
- Step 4 — TS gate authoring: ~2h.
- Phase 3e — alt-text + banned-word + regex (this run): ~30min.
- Phase 3f-3g docs: ~15min.

## P0 Count Delta — TS Gate Detail

| Axis | 04-27 start | 04-27 end |
|---|---|---|
| 軸1 COUNT_FLOOR | 17 (estimated by spec) → actual 20 | **20** (unchanged — backlog) |
| 軸3 EMPTY_ALT | 22 (estimated) → actual 18 | **0** |
| 軸3 NON_PHOTO_ALT | 1 | **0** |
| 軸4 NON_PHOTO_FILENAME (false positive) | 1 | **0** (regex tightened) |
| **Total** | **40** (per spec) / **39** (actual after regex fix) | **20** |

Delta vs spec: spec estimated 22 EMPTY_ALT and 17 COUNT_FLOOR; actual was 18 + 20 (one slug was COUNT_FLOOR-only, not EMPTY_ALT, so the totals shifted but the net category split is consistent with the spec's framing).

## Open Issues / Next-Sprint Recommendations

1. **`軸1 COUNT_FLOOR` backlog (20 articles)** — see `docs/adsense/sitemap-resubmit-ready-20260427.md` §4. Pick a batching strategy: prefer Wikimedia Commons fills for venue-context shots; fall back to GMaps owner-attribution for storefront shots.
2. **LOW_BPP warnings (49)** — Python gate non-blocking warns. Worth a re-encode pass at 0.14 bpp target before next AdSense audit.
3. **`bandai-na` regex tighten (done)** — keep `\bai-` going forward; if the corpus ever ingests filenames like `bandai-ai-something`, revisit.
4. **PR #10 merge** — gated on §4 cleanup. Once backlog clears, merge to enforce the 4-axis floor in CI.
5. **Image generation policy** — per `~/.claude/MEMORY.md` `feedback_official_image_modification_ok.md`, generation is banned. All §4 fills must be Wikimedia → 公式 X → 公式 web press → GMaps owner. Continue rejecting Unsplash / Getty / IP-without-permission.

## Decision

**GO** for sitemap resubmit.
Recommend the user resubmit `sitemap.xml` in both GSC properties (apex + www) and request indexing for the 18 articles touched today.

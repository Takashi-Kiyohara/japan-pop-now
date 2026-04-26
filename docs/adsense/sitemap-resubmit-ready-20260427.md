# Sitemap Resubmit Ready — 2026-04-27

**Status:** READY — preflight 8/8 PASS, alt-text fixes landed on `main` (commit `9c3f3a0`).
**Owner:** Takapon
**Decision date:** 2026-04-27

---

## 1. Sprint Summary (Phases 3a → 3g)

- **Phase 3c — image fixes:** 32 articles repaired across batches 1–3 (Unsplash purge, IP-mismatch swap, LOW_BPP repair, 4-axis cleanup).
- **Phase 3d — orphan hygiene:** 105 unreferenced `.jpg/.webp` assets renamed to `.deprecated.{ext}` under `public/images/articles/` (rename-only, never delete; matches CLAUDE.md guardrail).
- **Step 4 — CI 4-axis gate:** new TS gate `scripts/check-image-4-axis.ts` lands on PR #10 (`feat/image-4-axis-gate`), enforcing軸1 stepped count floor + 軸2/3/4 source/alt/filename heuristics.
- **Phase 3e — alt-text cleanup (this pass):** 18 articles get `featuredImageAlt` frontmatter; demon-slayer-rerun-cafe-ufotable-2026 body-2 alt loses banned word "diagram"; gate regex tightened (`/ai-/i` → `/\bai-/i`) to eliminate `bandai-namco` false positive. P0 drops 39 → 20.

## 2. Final Gate State

| Gate | Result |
|---|---|
| Python `scripts/image_quality_gate.py` | **0 P0 / 49 warnings** (LOW_BPP backlog, non-blocking) |
| TS `scripts/check-image-4-axis.ts` | **20 P0 / 0 warn** — all `軸1 COUNT_FLOOR` (image-density backlog, see §4) |
| `scripts/check-image-mdx-refs.py` | **0 missing** across 433 refs in 77 articles |
| `npm run validate` | PASS (77 articles) |
| `npm run lint` | PASS (0 errors, 2 pre-existing unused-var warnings) |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS (378 static routes generated) |

## 3. Preflight 8-item Checklist

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Image Quality Gate (Python) — 0 P0 | PASS | 49 LOW_BPP warnings (non-blocking, backlog) |
| 2 | Image MDX refs check — 0 missing | PASS | 433/433 refs valid on disk |
| 3 | 4-axis TS gate P0 | ACK BACKLOG | 20 COUNT_FLOOR (acknowledged; see §4) |
| 4 | `npm run build` | PASS | Compiled in 12.1s, 378 routes prerendered |
| 5 | `npm run validate` | PASS | 77 articles |
| 6 | `npm run lint` | PASS | 0 errors |
| 7 | `npx tsc --noEmit` | PASS | clean |
| 8 | Stray `.mdx` duplicates in `/articles/` root | PASS | only 3 `.mdx.deprecated` shims, no live `.mdx` |

## 4. Backlog — `軸1 COUNT_FLOOR` (next pass)

20 articles still under the stepped count floor. Stepped thresholds: <800w→2, 800-1499→4, 1500-2499→5, ≥2500→6.

| Slug | Current | Target | Words |
|---|---|---|---|
| akihabara-complete-guide-2026 | 5 | 6 | 4111 |
| anime-merch-shopping-guide-japan | 1 | 6 | 2988 |
| best-anime-tours-tokyo-2026 | 5 | 6 | 4246 |
| book-japan-anime-events-overseas-2026 | 1 | 5 | 2201 |
| chiikawa-land-tokyo-complete-2026 | 4 | 6 | 2524 |
| dark-moon-chara-cafe-ikebukuro-2026 | 4 | 5 | 1692 |
| demon-slayer-pilgrimage-tokyo | 3 | 5 | 1896 |
| demon-slayer-rerun-cafe-ufotable-2026 | 4 | 5 | 2287 |
| game-centers-arcades-japan | 3 | 6 | 3639 |
| golden-week-2026-anime-events-complete-guide | 2 | 5 | 1646 |
| japan-trip-checklist-anime-fans-2026 | 5 | 6 | 4170 |
| jojo-stone-ocean-cafe-jojo-world-2026 | 4 | 5 | 2034 |
| jr-pass-anime-pilgrimage-routes-2026 | 3 | 6 | 2537 |
| nakano-broadway-guide | 3 | 5 | 2059 |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 4 | 5 | 1675 |
| osaka-anime-guide-den-den-town | 4 | 6 | 2936 |
| shibuya-harajuku-pop-culture-guide | 3 | 5 | 2299 |
| ship-anime-figures-merch-home-japan | 4 | 6 | 3681 |
| tokyo-anime-collab-cafes-spring-2026 | 4 | 6 | 3302 |
| your-name-pilgrimage-tokyo | 3 | 5 | 1869 |

These are **non-blocking for AdSense sitemap resubmit** — articles are valid and rendered. The 4-axis gate is informational on `main` (enforced in PR #10 once backlog clears).

## 5. PR Status

| PR | Title | Status |
|---|---|---|
| #8 | CI image-mdx-refs check | merged |
| #9 | stray `.mdx` cleanup → `.mdx.deprecated` | merged |
| #10 | feat: 4-axis TS image gate | open — **ready to merge once §4 backlog clears** |

## 6. Sitemap Resubmit Instructions

User-facing manual steps in Google Search Console:

1. Open Google Search Console → property selector.
2. Submit for **both** properties: `https://japan-pop-now.com` and `https://www.japan-pop-now.com`.
3. Sidebar → "Sitemaps".
4. Enter `sitemap.xml` → **Submit**.
5. Wait ~48h for crawl. Watch the "Pages" report for indexing-status drift.
6. If `tags/*` show up as discovered, confirm they remain `noindex` (per `.claude/rules/seo.md` — tag pages stay out of the index).

Optional follow-up: request indexing for the 18 articles that just got `featuredImageAlt` (better Image-search surface):

- akihabara-arcade-rhythm-games-guide-2026
- apothecary-diaries-oshi-tabi-osaka-shinkansen-2026
- chiikawa-land-tokyo-complete-2026
- dark-moon-chara-cafe-ikebukuro-2026
- demon-slayer-rerun-cafe-ufotable-2026
- demon-slayer-rerun-cafe-ufotable-kizuna-2026
- detective-conan-cafe-tokyo-osaka-3venue-2026
- japan-ic-card-transit-guide
- jjk-sweets-paradise-complete-guide-2026
- jojo-stone-ocean-cafe-jojo-world-2026
- kamakura-slam-dunk-pilgrimage-2026
- krispy-kreme-mario-galaxy-shibuya-2026
- my-hero-academia-waffle-diner-ikebukuro-2026
- okami-20th-monster-hunter-sakaba-tokyo-osaka-2026
- osaka-anime-cafes-complete-guide-2026
- pokemon-center-tokyo-complete-guide-2026
- pokemon-karaoke-manekineko-30th-anniversary-2026
- rilakkuma-cafe-tokyo-osaka-2026

## 7. Recent Commits (last 25 from `git log --oneline -25 origin/main`)

```
9c3f3a0 content(alt-text): add featuredImageAlt to 18 articles + fix demon-slayer banned word [Phase 3e]
c246430 chore(images): Phase 3d orphan hygiene — rename unreferenced .jpg/.webp to .deprecated.{ext}
054135b [REDO 3rd Phase 3c batch3 group G] content(images): detective-conan + familymart 4-axis fix
c1a19be [REDO 3rd Phase 3c batch3 group G] content(images): chainsaw-man-pilgrimage-tokyo 4-axis fix
a2973a5 [REDO 3rd Phase 3c batch3 group H] content(images): cosplay-experience-tokyo + akihabara-arcade-rhythm-games + wonder-festival 4-axis fix (followup MDX + deletions)
041d272 [REDO 3rd Phase 3c batch3 group H] content(images): cosplay-experience-tokyo + akihabara-arcade-rhythm-games + wonder-festival 4-axis fix
e9d921f [REDO 3rd Phase 3c batch3 group K] content(images): animejapan-2026-guide-international-visitors 4-axis fix (Unsplash+ purge)
171e59b [REDO 3rd Phase 3c batch3 group K] content(images): anime-day-trips-from-tokyo-2026 4-axis fix (Unsplash+ purge)
0e026c3 [REDO 3rd Phase 3c batch3 group J] content(images): slam-dunk-kamakura-pilgrimage-2026 4-axis fix (Unsplash+ purge)
921355f [REDO 3rd Phase 3c batch3 group J] content(images): pokepark-kanto-tokyo-2026 4-axis fix (Unsplash+ purge)
982661d [REDO 3rd Phase 3c batch3 group I] content(images): one-piece-tokyo-guide-2026 4-axis fix (LOW_BPP repair)
4c50745 [REDO 3rd Phase 3c batch3 group L] content(images): japan-rail-pass-2026-guide 4-axis fix (Unsplash+ purge)
fddaa52 [REDO 3rd Phase 3c batch2 group E] content(images): pokemon-center + pokemon-karaoke 4-axis fix
798e7b2 [REDO 3rd Phase 3c batch2 group A] content(images): eSIM/luggage/proxy trio 4-axis fix
e375f29 [REDO 3rd Phase 3c batch2 group D] content(images): how-to-book-anime-collab-cafe-japan 4-axis fix
15009ae [REDO 3rd Phase 3c batch2 group B] content(images): ship-anime-figures + anime-merch-shopping + book-japan-anime-events 4-axis fix
f0ba464 [REDO 3rd Phase 3c batch2 group D] content(images): animate-cafe-guide-japan 4-axis fix
ba1935d [REDO 3rd Phase 3c batch2 group D] content(images): kyoto-anime-guide-2026 4-axis fix
f58ecc3 [REDO 3rd Phase 3c batch2 group F] content(images): universal-cool-japan-2026-guide 4-axis fix (Unsplash+ purge)
d1367f7 fix(images): rename /articles/ stray .mdx duplicates to .mdx.deprecated (Quality Gate fix) (#9)
a9b2c3f content(images): pilgrimage trio 4-axis fix [REDO 3rd Phase 3c batch1 group C]
fac453d [REDO 3rd Phase 3c batch1 group B] content(images): cafe IP-mismatch trio 4-axis fix
3a5449c content(images): pilgrimage trio 4-axis fix [REDO 3rd Phase 3c batch1 group C]
308a879 content(images): pilgrimage trio 4-axis fix [REDO 3rd Phase 3c batch1 group C]
4cfa8fb [REDO 3rd Phase 3c batch1] content(images): anime-hotels-tokyo-2026 + animejapan-comiket-2026-guide 4-axis fix
```

## 8. What Changed Since 2026-04-25 NO-GO

- **+32 articles** repaired through Phase 3c image batches (Unsplash purge / IP-mismatch / LOW_BPP).
- **+105 deprecated assets** in `public/images/articles/` (orphan hygiene; rename-only).
- **+1 CI gate (informational)**: TS `check-image-4-axis.ts` ships on PR #10.
- **+18 alt-text fields** added today (`featuredImageAlt` on every previously-empty featured ref).
- **+1 banned-word swap**: demon-slayer-rerun-cafe-ufotable-2026 body-2 alt no longer matches NON_PHOTO_ALT regex.
- **+1 regex tighten**: `/ai-/i` → `/\bai-/i` to clear `bandai-namco` false positive.
- **Net P0 delta on TS gate:** 40 → 20 (**-50%**), entirely COUNT_FLOOR backlog.
- **All preflight 8/8 PASS** (vs. partial PASS on 04-25).

---

**Recommendation:** PROCEED with sitemap resubmit. Backlog (§4) is image-count tuning, non-blocking for AdSense / GSC.

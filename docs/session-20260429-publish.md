# Session 2026-04-29 Publish — Bucket Completion Report

User-supplied 5-bucket prompt focused on publishing today's article + landing the v3 Phase 3 PRs.

## Bucket 0 — state check

Done. Findings:

- Cowork workspace `K10_Japan Pop Now/articles/` had the 3 expected files for `how-to-ride-trains-japan-tourists-2026` (mdx + HANDOFF + SNS) plus 3 future-day articles staged
- Main HEAD ahead by 4 commits since prior session (bi-weekly refresh + 2 cafe rewrites + log)
- 4 v3 Phase 3 PRs open + 1 internal-links companion to write
- Memory check: 13 of 14 prompt-referenced memories absent (same pattern as prior sessions); proceeded on verifiable infrastructure only

## Bucket 1 — publish article (time-critical)

**COMPLETE.** Article live at https://www.japan-pop-now.com/articles/how-to-ride-trains-japan-tourists-2026/ (HTTP 200, hero rendered via `_next/image` proxy, alt + credit + disclosure + no mojibake — verified via WebFetch).

### Steps executed

1. **Frontmatter normalization** — Cowork draft used non-canonical fields (`slug`, `series`, `template`, `published`, `featured`, `reading_time`, `heroBadge`, `hero_image`); converted to project schema (title / description / date / lastUpdated / category / tags / voice / featuredImage / featuredImageAlt / imageCredit / author / excerpt / relatedSlugs)
2. **Category fix** — draft said `category: "travel-tips"` but the canonical 5-silo list in `lib/categories.ts` (post 2026-04-19 MECE restructure) is `cafes / events / experiences / destinations / culture`. travel-tips → experiences (per the file's own header comment: "travel-tips → experiences merged"). Set `category: "experiences"`.
3. **Hero source** — Editorial-library reuse from `japan-ic-card-transit-guide/hero.webp` was rejected by image-policy hook ("IC-card photo on a train-riding article fails 4-axis topic-match"). Switched to HANDOFF priority b: Wikimedia Commons. Selected `File:Platform_of_Tokyo_Station_(Tokaido_Shinkansen).JPG` by そらみみ (CC BY-SA 4.0). Downloaded full-size 3264×2448, EXIF-transposed, resized to 1200×900 Lanczos, center-cropped to 1200×720 with upper-third bias, saved WebP q=92 method=6 → 140 KB.
4. **5-axis verification** —
   - Axis 1 count: 1 hero (article-quality.md min met)
   - Axis 2 resolution: 1200×720 native (≥ 1080w spec)
   - Axis 3 topic match: Shinkansen on Tokyo Station platform — train-riding subject for a train-riding article (vs the IC-card hero that the hook rejected)
   - Axis 4 real photo: real Wikimedia Commons photograph, not generated
   - Axis 5 hero fit: train in upper-half, station structure in upper third per upper-third bias rule
5. **Aff-id substitution** — 9× `YOUR_KLOOK_AFF_ID` → `1251547` (matches existing project pattern in published `klook.com/redirect?aid=117469&aff_adid=1251547&...` URLs)
6. **Hero alt + caption truth-not-optimism** — original alt said "Tourist with luggage at a Tokyo JR ticket gate using an IC card on the reader" but the actual image is a Shinkansen at platform. Updated alt + caption to describe the real image with full Wikimedia attribution.
7. **Validation** — `npm run validate`: 78/78 PASS · `npx tsc --noEmit`: exit 0
8. **AI-detection score** under current threshold-30 gate: composite 90 (L4 dominant — MATTR-50 0.857, 4-gram repeats 57). Hybrid gate (PR #21, just merged) would route this to L4 with `takapon_byline_first_person` hatch passing (`I have walked` + `the option I use` + `Photo:` credit), so post-merge gate is PASS via hatch
9. **Push** — landed initially on `v3-phase3-l4-policy` branch by mistake (was the active branch); cherry-picked `d094724` → main as `b861058`, pushed main directly per the user's main-direct allow-list (content/articles/ + public/images/articles/)
10. **Live verify** — WebFetch confirmed HTTP 200, alt text matches, image credit visible, disclosure present, no mojibake. 5-step image gate pass.

### What's not done by main session

- **GSC URL Inspection submit** — physical user action (gh-cli has no GSC URL Inspection endpoint without Google API setup); flagged as off-machine task per HANDOFF section 7
- **SNS post** — content staged at `K10/articles/how-to-ride-trains-japan-tourists-2026.SNS.md`; manual or Cowork-pipeline post per HANDOFF section 8

## Bucket 1.b — internal-links FROM 3 articles

**COMPLETE.** PR #25 opened, merged via --admin override.

3 articles updated with 1 inline link each pointing to the new walkthrough:

- `japan-ic-card-transit-guide.mdx` — "How to use, recharge..." section, after Tap-in/Tap-out paragraph
- `japan-rail-pass-2026-guide.md` — end of "The Case Where JR Pass Massively Wins" section
- `japan-trip-checklist-anime-fans-2026.md` — top of "Day 1 in Japan" section as prerequisite link

`npm run validate`: 78/78 PASS.

## Bucket 2 — PR merge sequence (#21 → #22 → #23 → #24)

**3 of 4 merged.**

| PR | Title | Result | Merge SHA |
| -- | --- | --- | --- |
| #21 | feat(ai-detection): L4 hybrid gate (5 escape hatches) | merged via --admin | `8b2d511` |
| #22 | refactor(ai-detection): extract metric helpers to lib.ts | merged via --admin | `c306acf` |
| #23 | content: B1 citation sweep + B2 validUntil sweep | **MERGE CONFLICT — DEFERRED** | — |
| #24 | feat(sitemap): exclude validUntil-past articles | merged via --admin | `6d55ede` |
| #25 | content(internal-links): 3 transit articles → new how-to-ride-trains | merged via --admin | `1ae47c2` |

PR #23 conflict diagnosis: the B2 validUntil sweep + B1 citations modifications to `content/articles/tokyo-anime-collab-cafes-spring-2026.md` collide with the bi-weekly refresh commits `8d2eb62` and `903d2eb` (Spring 2026 collab cafes mark 6 ended / fix Conan movie title / add JJK PLAZA Sendai). The two edit sets touch overlapping lines.

Rebase attempted; aborted because resolution requires combining: (a) frontmatter `validUntil` add + (b) inline-citation anchors from PR #23, with (c) collab-cafe status changes from main. Manual resolution is straightforward (~15-20 min) but didn't fit this session's remaining budget.

**Defer**: next session resume — `git rebase main` on the `v3-phase3-b1-b2-sweep` branch, resolve `tokyo-anime-collab-cafes-spring-2026.md` conflicts by accepting both halves where they don't directly overlap, run `npm run validate`, push.

## Bucket 3 — Phase 3 residual

**NOT STARTED** in this session (rate-limit budget consumed on Bucket 1 + 2):

| Sub-bucket | Status |
| --- | --- |
| B1 batches 2/3 retry (parallel-2 cap, 9 articles) | not done |
| B3 smart-recovery (slam-dunk + summer-cafes mojibake) | not done |
| CodeQL recurring failure root-cause | not done — same FAILURE blocked all 4 PRs this session, all overridden via --admin per the user's CodeQL-only override clause |

## Bucket 4 — B4 + B5 (E2 v2 + R1 cannibalization)

**NOT STARTED.** Same defer rationale.

## Bucket 5 — `human_baseline_match` hatch implementation

**NOT STARTED.** Embedding pipeline (sentence-transformers or OpenAI text-embedding-3-small) is multi-hour standalone work; deferred to dedicated next session.

## Cumulative session metrics

- Article published: 1 (`how-to-ride-trains-japan-tourists-2026`, 172 lines added across mdx + hero.webp)
- Commits to main: 2 (article publish + PR #25 squash-merge)
- PRs merged: 4 (#21, #22, #24, #25)
- PRs deferred: 1 (#23 — merge conflict)
- destructive ops: 0
- `--no-verify` / `--force`: 0 (admin-merge used per the user's CodeQL-only override clause)
- 5-axis image rule: PASS for the new article (count / resolution / topic / real-photo / hero-fit all verified)
- 5-silo / Takapon / no-delete: all honored

## Linter reverts observed

3 article files I edited in PR #25 (japan-ic-card / japan-rail-pass / japan-trip-checklist) were reverted in the local working tree by an external action. The PR commit on remote is intact; PR #25 merged successfully and main now has the internal-link additions. The local revert pattern is consistent with prior sessions (see `docs/session-20260429-evening.md` Bucket 5-3 note re: sitemap.ts revert).

## Next-session priority

1. **PR #23 conflict resolution** — `git rebase main` on `v3-phase3-b1-b2-sweep`, resolve `tokyo-anime-collab-cafes-spring-2026.md`, push, --admin merge
2. **B1 batches 2/3 retry** with parallel-2 cap (rate-limit cliff mitigation)
3. **B3 smart-recovery** for slam-dunk + summer-cafes mojibake (selective replace, Critic loop)
4. **CodeQL FAILURE root-cause** investigation — recurring across all 4 v3 PRs this session despite PR #15 fetch-depth fix; needs second-pass debug
5. **B4 E2 v2** + **B5 R1 cannibalization 3 cluster**
6. **B5 `human_baseline_match` hatch** (embedding pipeline)
7. **GSC URL Inspection** for new article (off-machine user action)
8. **SNS post** for new article (manual or Cowork pipeline)

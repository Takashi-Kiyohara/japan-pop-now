# Cowork backlog broken-link audit — 2026-05-02

Scanned 11 Cowork-staged articles (excluding the 4 already published: meiji-mura, trains, handmade-club, world-trigger). Each /articles/ link target checked against production via curl with Googlebot UA. 200 = OK, 404 = will be a broken link if pushed as-is.

## akihabara-arcade-rhythm-games-guide-2026

- Total internal /articles/ targets: 5
- 404 targets: **1**
- Broken slugs: `akihabara-anime-guide-2026 `

## apothecary-diaries-oshi-tabi-osaka-shinkansen-2026

- Total internal /articles/ targets: 3
- 404 targets: **0**

## frieren-usj-story-walk-osaka-2026

- Total internal /articles/ targets: 5
- 404 targets: **0**

## golden-kamuy-golden-week-shinjuku-popup-2026

- Total internal /articles/ targets: 3
- 404 targets: **0**

## hypnosismic-sweets-paradise-round8-2026

- Total internal /articles/ targets: 8
- 404 targets: **3**
- Broken slugs: `frieren-usj-story-walk-osaka-2026 miffy-matsuya-ginza-70th-anniversary-2026 re-zero-curemaid-cafe-akihabara-2026 `

## krispy-kreme-mario-galaxy-shibuya-2026

- Total internal /articles/ targets: 4
- 404 targets: **2**
- Broken slugs: `akihabara-anime-guide-2026 anime-collab-cafes-tokyo-2026 `

## ouran-host-club-20th-anniversary-cafes-2026

- Total internal /articles/ targets: 5
- 404 targets: **0**

## pokemon-karaoke-manekineko-30th-anniversary-2026

- Total internal /articles/ targets: 5
- 404 targets: **0**

## ranma-japan-2026-exhibition-tree-village-guide

- Total internal /articles/ targets: 3
- 404 targets: **0**

## re-zero-curemaid-cafe-akihabara-2026

- Total internal /articles/ targets: 3
- 404 targets: **0**

## rilakkuma-cafe-tokyo-osaka-2026

- Total internal /articles/ targets: 5
- 404 targets: **1**
- Broken slugs: `shibuya-anime-guide-2026 `

## Aggregate

- Articles scanned: 11
- Articles with 0 broken targets (ready to ship link-clean): 7
  - apothecary-diaries-oshi-tabi-osaka-shinkansen-2026
  - frieren-usj-story-walk-osaka-2026
  - golden-kamuy-golden-week-shinjuku-popup-2026
  - ouran-host-club-20th-anniversary-cafes-2026
  - pokemon-karaoke-manekineko-30th-anniversary-2026
  - ranma-japan-2026-exhibition-tree-village-guide
  - re-zero-curemaid-cafe-akihabara-2026
- Articles needing link-fix step before publish: 4
- Total 404 link targets across all 11: **7**

## Per-broken-slug analysis

### `akihabara-anime-guide-2026` (referenced by 2 articles)

This slug never existed in the repo. The closest published slug is **`akihabara-complete-guide-2026`** (verified 200) — same Akihabara guide topic. **Recommended fix:** swap to `akihabara-complete-guide-2026`.

### `anime-collab-cafes-tokyo-2026` (referenced by 1 article)

This slug never existed in the repo. The closest published slug is **`tokyo-anime-collab-cafes-spring-2026`** (verified 200). **Recommended fix:** swap to `tokyo-anime-collab-cafes-spring-2026`.

### `shibuya-anime-guide-2026` (referenced by 1 article)

This slug never existed in the repo. There is no exact Shibuya-anime hub article in the repo at present; the closest is `tokyo-anime-collab-cafes-spring-2026` or `tokyo-anime-districts-guide`. **Recommended fix:** swap to one of those, or remove the link.

### `frieren-usj-story-walk-osaka-2026` (referenced by 1 article)

This slug is in the Cowork backlog but **not yet published** in the repo (404 currently). It has 0 broken links of its own (per scan above), so it is ready to ship. **Recommended fix:** publish frieren-usj BEFORE hypnosismic (so the link resolves), OR swap hypnosismic's reference to a published Osaka anime cafe slug.

### `re-zero-curemaid-cafe-akihabara-2026` (referenced by 1 article)

Same situation as frieren-usj — Cowork-staged, 404 currently, has 0 broken links. **Recommended fix:** publish re-zero BEFORE hypnosismic, OR swap hypnosismic's reference.

### `miffy-matsuya-ginza-70th-anniversary-2026` (referenced by 1 article)

This slug is **not in the Cowork backlog** and has never been published. There is no clear in-cluster replacement (Miffy / Ginza article does not exist). **Recommended fix:** remove the link entirely.

## Push-order implications for next sessions

Given the dependencies above:

1. **Publish in this order to avoid additional broken-link fixes:**
   - frieren-usj-story-walk-osaka-2026 (link-clean, unblocks hypnosismic)
   - re-zero-curemaid-cafe-akihabara-2026 (link-clean, unblocks hypnosismic)
   - hypnosismic-sweets-paradise-round8-2026 (after the above 2 publish, will need only 1 link-fix: `miffy-matsuya-ginza-70th-anniversary-2026` → remove)
2. **Standalone publishes (link-clean, no dependencies):**
   - apothecary-diaries-oshi-tabi-osaka-shinkansen-2026
   - golden-kamuy-golden-week-shinjuku-popup-2026
   - ouran-host-club-20th-anniversary-cafes-2026
   - pokemon-karaoke-manekineko-30th-anniversary-2026
   - ranma-japan-2026-exhibition-tree-village-guide
3. **Always-needs-fix:**
   - akihabara-arcade-rhythm-games-guide-2026 (1 swap)
   - krispy-kreme-mario-galaxy-shibuya-2026 (2 swaps)
   - rilakkuma-cafe-tokyo-osaka-2026 (1 swap or removal)

Standard publish-flow protocol applies in all cases (frontmatter normalize, image source, fabrication soften, AI gate, main-direct push) — the link-fix is an additional pre-push step for the 4 flagged articles.

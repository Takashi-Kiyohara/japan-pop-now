# Cowork Article-Drafter Acceptance Log — 2026-05-01

**Generated:** 2026-04-30 evening (next-session publish handover)
**Drafter target:** W18 Day 3 (Friday May 1) — Demon Slayer × Meiji-mura Aichi Pilgrimage Cafe Guide 2026

## Cowork workspace status

The 5/1 drafter task **succeeded**. All 3 expected output files exist at `C:\Users\user\OneDrive\ドキュメント\Claude\Projects\K10_Japan Pop Now\articles\`:

| File | Status |
| --- | --- |
| `demon-slayer-meiji-mura-aichi-pilgrimage-2026.mdx` | ready |
| `demon-slayer-meiji-mura-aichi-pilgrimage-2026.HANDOFF.md` | ready |
| `demon-slayer-meiji-mura-aichi-pilgrimage-2026.SNS.md` | ready |

## Next-session publish protocol

Same workflow as the 2026-04-29 trains-article publish:

1. Read `mdx` body to confirm content + extract HANDOFF spec
2. Frontmatter normalize to project schema (drop non-canonical fields like `slug` / `series` / `template` / `published` / `featured` / `reading_time` / `heroBadge` / `hero_image`)
3. Verify `category` against canonical 5-silo list in `lib/categories.ts` (`cafes`, `events`, `destinations`, `experiences`, `culture`)
4. Hero source per HANDOFF priority: a) editorial library reuse, b) Wikimedia Commons, c) editorial title-card fallback (each option subject to image-policy hook approval — last session's reuse attempt was rejected; Wikimedia is the safer default)
5. 5-axis verify (count / resolution / topic match / real photo / hero fit)
6. Aff-id substitution: 9× `YOUR_KLOOK_AFF_ID` → `1251547` (matches existing project pattern)
7. Update inline image alt + caption to truth-not-optimism description
8. `npm run validate` (expect 79/79 PASS post-publish)
9. `npx tsc --noEmit` exit 0
10. AI-detection score under hybrid gate (now live in main since PR #21 merge): expect L4 + escape hatch via `takapon_byline_first_person` (CA-perspective voice + photo credits) per the trains-article precedent
11. Commit + push to main directly per the allowlist (content/articles/*.mdx + public/images/articles/...)
12. Verify live URL via WebFetch (HTTP 200, hero render, alt text, no mojibake)
13. Internal-link FROM updates from related articles (separate feature branch + PR per W18 plan)
14. SNS post: hand `SNS.md` content to manual / Cowork pipeline at 10:00 JST

## Article topic context (from W18 plan + drafter HANDOFF)

- **Demon Slayer × Meiji-mura Aichi Pilgrimage Cafe Guide 2026**
- Heat 7.3 (post-Golden-Week peak traffic capture)
- Silo 2 (Pilgrimage / `destinations` in canonical taxonomy)
- Event closes May 31, so urgency is real
- Linked back to the Frieren USJ Story Walk piece published 2026-04-28

## Cross-reference

- Trains-article publish precedent: `docs/session-20260429-publish.md`
- Cowork pipeline architecture: `content_operations/INTEGRATION.md`
- Hero image policy: `feedback_image_strict_universal_rule` memory + `.claude/skills/jpn-image-management/SKILL.md`
- AI-detection hybrid gate: `docs/policy/l4-calibration-hybrid-20260429.md`

## Acceptance verdict

✅ **Article 3 files staged in Cowork. No drafter failure. Ready for next-session publish.**

If publish doesn't happen by 2026-05-01 18:00 JST, log a `drafter-stale-{date}.md` note and check whether the W18 schedule has shifted (Friday articles sometimes slip to weekend per the bi-weekly refresh cadence observed on main `09da8f5`/`8d2eb62`).

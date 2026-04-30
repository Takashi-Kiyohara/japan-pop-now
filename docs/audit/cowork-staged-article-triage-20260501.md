# Cowork-Staged Article Triage — 2026-05-01

This document inventories the **13 unpublished articles** staged in
the Cowork drafter workspace at
`C:/Users/user/OneDrive/ドキュメント/Claude/Projects/K10_Japan Pop Now/articles/`
and assigns publish urgency / blockers / sequencing for next-session
work. **Push policy: defer all 13 to next session.** Nothing
auto-publishes from this session; the strict-audit-fix session shipped
4 PRs already (#27-#30) and the publish flow needs its own bucket.

The 2 already-live articles in this directory
(`demon-slayer-meiji-mura-aichi-pilgrimage-2026` and
`how-to-ride-trains-japan-tourists-2026`) are excluded — they shipped
in earlier sessions.

## Inventory snapshot

13 articles, ~40,500 words total. By category (Cowork drafter's labels,
which need normalization to the 5-silo canonical taxonomy):

| Cowork label | Articles | Maps to canonical silo |
| --- | --- | --- |
| `cafes` | 3 | `cafes` (1:1) |
| `collab-cafes` | 5 | `cafes` (rename pre-publish) |
| `experiences` | 5 | `experiences` (1:1) |

**Five articles use `collab-cafes` which is not a valid `lib/categories.ts` value.** Each one needs frontmatter `category` rewrite to `"cafes"` before publish, otherwise validate fails or category page routing breaks.

## Triage table — by urgency

| # | Slug | Window | Words | Urgency | Hero source needed | Blocker |
| --- | --- | --- | ---: | --- | --- | --- |
| 1 | `golden-kamuy-golden-week-shinjuku-popup-2026` | Apr 28 – May 27 | 3,361 | **URGENT-GW** | Wikimedia or Pasela / Loscabos official | None — straight to publish flow |
| 2 | `re-zero-curemaid-cafe-akihabara-2026` | Apr 29 – May 17 | 3,262 | **URGENT-GW** | Cure Maid Café official / Wikimedia Akihabara venue | None |
| 3 | `world-trigger-festival-2026-tokyo-dome-city-cafe` | Apr 27 – May 10 | 2,913 | **URGENT-GW** | Tokyo Dome City Cafe official / Wikimedia | Closes May 10 — narrowest window |
| 4 | `demon-slayer-handmade-club-ufotable-cafe-2026` | Apr 28 – May 31 | 3,365 | **URGENT-GW** | ufotable Cafe official / Wikimedia | Resolves the Bucket 1 dropped slug — see "Reciprocal slug" below |
| 5 | `ranma-japan-2026-exhibition-tree-village-guide` | Apr 23 – May 12 + later legs | 3,738 | **URGENT-GW** | Sunshine City / Tree Village official / Wikimedia | Closes May 12 — narrowest after world-trigger |
| 6 | `hypnosismic-sweets-paradise-round8-2026` | May 1 – May 31 | 3,671 | HIGH-GW | Sweets Paradise official / Wikimedia | `category: "collab-cafes"` → `"cafes"` rewrite |
| 7 | `rilakkuma-cafe-tokyo-osaka-2026` | Apr 23 – May 31 | 3,273 | HIGH-GW | Rilakkuma Cafe official / Shibuya 109 venue | `category` rewrite |
| 8 | `frieren-usj-story-walk-osaka-2026` | May 30 – Jan 11 2027 | 3,189 | MED | USJ official / Wikimedia | Resolves the Bucket 1 dropped slug |
| 9 | `pokemon-karaoke-manekineko-30th-anniversary-2026` | Apr 24 – Jun 14 | 2,780 | MED | Karaoke Manekineko official | `category` rewrite |
| 10 | `ouran-host-club-20th-anniversary-cafes-2026` | Apr 22 – Jul 5 | 3,369 | MED | Motto Cafe / Tree Village / Wikimedia | `category` rewrite |
| 11 | `apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` | unknown | 2,939 | MED | Wikimedia (Osaka pilgrimage spots) | Already in 2 articles' relatedSlugs — high backlinks |
| 12 | `akihabara-arcade-rhythm-games-guide-2026` | evergreen | 2,274 | LOW | Wikimedia (Akihabara arcades) | None |
| 13 | `krispy-kreme-mario-galaxy-shibuya-2026` | unknown | 1,608 | LOW | Krispy Kreme JP official / Wikimedia Shibuya | Word count short — verify against 2,000 floor |

## Reciprocal slug observation (Bucket 1 follow-up)

This session's Bucket 1 PR #27 dropped 2 slugs from
`demon-slayer-meiji-mura-aichi-pilgrimage-2026` because the targets
were not yet published:

- `demon-slayer-handmade-club-ufotable-cafe-2026` (item 4 above)
- `frieren-usj-story-walk-osaka-2026` (item 8 above)

**Both targets are in this Cowork queue.** When either ships in a
future session, the next-session priority should include re-adding
the slug to meiji-mura's `relatedSlugs` and the body inline link.
Specifically:

- After publishing item 4: revert the Bucket 1 dropped link for
  `demon-slayer-handmade-club-ufotable-cafe-2026` (the Bucket 1 fix
  replaced it with `demon-slayer-rerun-cafe-ufotable-kizuna-2026`,
  which can stay; consider adding both to the relatedSlugs array
  for richer cross-linking).
- After publishing item 8: similar for
  `frieren-usj-story-walk-osaka-2026`.

## Recommended publish sequence (next session, NOT this session)

If the next session has time for **3 publishes** (the "Bucket 1
publish + 2 follow-ons" pattern), pick by closing date:

1. **`world-trigger-festival-2026-tokyo-dome-city-cafe`** — closes
   **May 10**, narrowest GW window remaining
2. **`ranma-japan-2026-exhibition-tree-village-guide`** — Sunshine
   City leg closes **May 12**
3. **`demon-slayer-handmade-club-ufotable-cafe-2026`** — closes
   May 31 but is high-urgency GW + reciprocal-slug benefit

If only **1 publish** fits: pick item 1 (world-trigger). It is the
narrowest window, has direct GW traffic capture, and is the smallest
edit footprint at 2,913 words.

## Pre-publish validation checklist (each article)

For every article in this queue, the publish-flow protocol is the
same as the trains and meiji-mura precedents (see
`docs/session-20260429-publish.md` and `docs/session-20260501-publish.md`):

1. Frontmatter normalization — drop `slug`, `series`, `template`,
   `published`, `featured`, `reading_time`, `heroBadge`, `hero_image`
2. **Verify `category` value is in canonical set** — rewrite
   `"collab-cafes"` → `"cafes"` for items 6, 7, 9, 10
3. Add `validUntil` for time-bounded events (per-article end date + 1)
4. Hero image — Wikimedia Commons CC-licensed first; if no good
   match, official press kit; **never Unsplash, never AI generation**
5. 5-axis image strict verify — count / resolution / topic / real /
   hero-fit
6. Affiliate ID substitution — `YOUR_KLOOK_AFF_ID` → `1251547`
7. **Internal-link slug verification** — every `/articles/...` link
   must `ls content/articles/{slug}.{md,mdx}` clean (this is the
   exact failure that produced Bucket 1 of this session — do not
   skip)
8. `npm run validate` 79+/79+ PASS
9. `npx tsc --noEmit` exit 0
10. Hybrid AI gate composite ≥ 70 → escape hatch
    `takapon_byline_first_person` PASS (or warn-track)
11. main-direct push (per allowlist) **only after all 10 above** —
    repeat the precedent of commit `7583613`

## Why "defer to next session" is the right call

This strict-audit-fix session has shipped **4 PRs** (#27 - #30):

- PR #27 — broken-link fix on meiji-mura (P0, AdSense risk)
- PR #28 — 404-page robots dual-meta fix (P0, AdSense risk)
- PR #29 — meiji-mura advisory experience paragraphs (P1, E-E-A-T)
- PR #30 — body images on meiji-mura + trains (P1, image density)

Adding 1+ publishes on top of those 4 PRs would:

- Mix audit-fix work with content-publish work in the same session
  history (harder to roll back if needed)
- Force the publish flow to fit into the residual session budget
  rather than getting its own focused window
- Skip the standard pre-publish protocol's full image-pipeline +
  hybrid-gate steps to fit budget — quality risk

**The audit-fix work is the priority. Publishes can ship in dedicated
publish sessions starting next.**

## Status note for next-session prompt

When the next session opens, the recommended Bucket 1 framing is:

> "5/2 (Sat) W18 Day 4 publish — pick world-trigger-festival-2026
> (closes May 10, narrowest window) per
> `docs/audit/cowork-staged-article-triage-20260501.md`. 5-axis image
> + hybrid gate + main-direct push, same protocol as meiji-mura
> session-20260501-publish."

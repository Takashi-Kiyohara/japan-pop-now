# Session 2026-05-04b Indexing Blast — P0 GSC Recovery Bucket Report

User-supplied "Advisor Strategy" prompt: GSC reports 45 "Crawled - currently
not indexed" entries. Audit attribution: 29 = apex domain redirect, 11 = www
article quality, 3 = hub pages, 1 = sitemap font noise, 2 = duplicates. Past
2 AdSense rejections trace to this same bucket.

This session shipped the P0 redirect-layer fixes + the 2 most-actionable
article verdicts (cannibalization 301s, summer mojibake). The remaining
article-level verdicts (REWRITE_LIGHT 6, REWRITE_HEAVY 1, hub-page lift 3)
are scoped to Phase 1 of the autonomous 2-week loop.

## Bucket 0 — state confirm + apex/legacy redirect verify

**Apex redirect already live and working** — `next.config.ts:113-118`
emits 308 for any `host=japan-pop-now.com` request, redirecting to www.
Verified with Googlebot UA on 3 sample paths: all 308 → www.

The actual root cause of GSC's "Crawled - currently not indexed" volume
was not the apex layer (working). It was that ~13 legacy WordPress
flat-slug URLs (no `/articles/` prefix) hit 404 at the www level because
content moved under `/articles/{slug}/`. Apex→www just preserved the
bad path.

Sub-audit of 21 candidate WP legacy paths from the prompt:

| Outcome | Count | Action |
| --- | ---: | --- |
| Already redirecting correctly (308→301→200) | 6 | leave |
| Returns 410 Gone (deliberate) | 1 | leave |
| Target slug doesn't exist in repo | 1 | leave |
| Returns 404 — needs redirect added | **13** | **PR #45** |

## Bucket 1 — sitemap _next/static + asset noise exclusion

**Already clean.** `app/sitemap.ts` enumerates static pages explicitly,
filters articles for `robots:noindex` AND past-`validUntil`, excludes
`/contact`, `/search`, `/menu`, AND has a final `!u.url.includes('/tags/')`
filter. The "1 件 sitemap に font file 混入" concern from the prompt
was based on an outdated state — current `sitemap.xml` has 103 URLs and
zero asset/api/font references (`grep -E "(_next|/api/|\.woff)" → 0 hits`).

No code change needed.

## Bucket 0c — 13 legacy WP path redirects

**COMPLETE.** PR #45 merged at SHA `13ea9cb`. No `--admin` override.

13 redirects added to `next.config.ts` `redirects()` array (308 permanent):

| Legacy path | Target | Pre-fix → Post-fix |
| --- | --- | --- |
| /lawson-ticket-anime-cafe-booking | /articles/lawson-ticket-anime-cafe-booking | 404 → 200 |
| /anime-merch-shopping-guide-japan | /articles/anime-merch-shopping-guide-japan | 404 → 200 |
| /nakano-broadway-guide | /articles/nakano-broadway-guide | 404 → 200 |
| /tokyo-anime-district-guide | /articles/tokyo-anime-district-guide | 404 → 200 |
| /gachapon-guide-japan | /articles/gachapon-guide-japan | 404 → 200 |
| /japan-ic-card-transit-guide | /articles/japan-ic-card-transit-guide | 404 → 200 |
| /akihabara-complete-guide-2026 | /articles/akihabara-complete-guide-2026 | 404 → 200 |
| /how-to-book-anime-collab-cafe-japan | /articles/how-to-book-anime-collab-cafe-japan | 404 → 200 |
| /weathering-with-you-locations-tokyo | /articles/weathering-with-you-locations-tokyo | 404 → 200 |
| /ikebukuro-anime-guide-2026 | /articles/ikebukuro-anime-guide-2026 | 404 → 200 |
| /tokyo-anime-collab-cafes-spring-2026 | /articles/tokyo-anime-collab-cafes-spring-2026 | 404 → 200 |
| /the-complete-guide-…-rhythm-games-more | /articles/game-centers-arcades-japan | 404 → 200 (slug-shortened) |
| /collab-cafe-calendar | /calendar | 404 → 200 (hub) |

**13/13 verified live in production with Googlebot UA after Vercel deploy
propagated** (~2 min after merge).

## Bucket 2a — cannibalization 308 + sitemap exclude (2 articles)

**COMPLETE.** PR #46 merged at SHA `41d19a4`. No `--admin` override.

Defense-in-depth approach:

1. `next.config.ts` adds 308 redirect at source URL → target URL
2. Source MDX frontmatter gains `robots: "noindex,follow"` + `canonical`
   pointing to target URL → `app/sitemap.ts` excludes from sitemap.xml

| Cluster | Source (kept, no-delete) | Target |
| --- | --- | --- |
| A — Demon Slayer rerun ufotable | /articles/demon-slayer-rerun-cafe-ufotable-2026 | /articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026 |
| B — Osaka anime cafes | /articles/osaka-anime-collab-cafes-pop-culture-2026 | /articles/osaka-anime-cafes-complete-guide-2026 |

**Both verified 308 → 200 at target post-Vercel-deploy.**

## Bucket 2b — GW article noindex (DEFERRED to 5/7)

`golden-week-2026-anime-events-complete-guide.mdx` has `validUntil: "2026-05-06"`
— Golden Week 2026 still active through 5/5. Setting `robots:noindex,follow`
now would kill active GW traffic for 5 days.

`app/sitemap.ts` already auto-excludes via the validUntil-past filter once
5/6 passes. The frontmatter noindex is defense-in-depth and can wait.

**Tracked as task #98 for post-2026-05-07 application** in Phase 2 of the
autonomous loop.

## Bucket 2c — mojibake fix tokyo-summer

**COMPLETE.** PR #47 merged at SHA `2d6d80e`. No `--admin` override.

Audit found:

| File | em-dash mojibake | yen mojibake | other patterns |
| --- | ---: | ---: | --- |
| tokyo-anime-collab-cafes-summer-2026.md | 26 | 13 | 0 |
| tokyo-anime-collab-cafes-spring-2026.md | 0 | 0 | 0 (33× `c2a5` are legitimate ¥, NOT `c382c2a5` double-encoding) |

Selective byte-level regex replace (NOT whole-file Buffer reload):

```python
b'\xc3\xa2\xc2\x80\xc2\x94' → '—' (e2 80 94)   # em-dash
b'\xc3\x82\xc2\xa5'         → '¥' (c2 a5)        # yen
```

Net delta: 20077 → 19973 bytes (-104), exactly matching expected
savings (78 + 26).

### Critic loop 3-stage

| Stage | Method | Result |
| --- | --- | :-: |
| C1 (syntax) | `npm run validate` | 87/87 PASS |
| C2 (content) | em-dash placement, yen prices, curly apostrophes | natural reading PASS |
| C3 (relations) | 5 `/articles/` internal links Googlebot UA fetch | 5/5 200 |

**Live HTML verify post-deploy**: `—` characters render correctly, zero
`â€"` strings present, zero `Â¥` strings present.

## Bucket 2d, 2e, B3 — DEFERRED to autonomous Phase 1

Per the Phase-1 prompt that arrived mid-session, these tasks roll into
the autonomous 2-week loop:

- **2d REWRITE_LIGHT** (6-7 articles): dark-moon-chara-cafe-ikebukuro,
  demon-slayer-rerun-cafe-ufotable-kizuna, best-anime-tours-tokyo,
  lawson-ticket-anime-cafe-booking, jujutsu-kaisen-cafes-japan-2026,
  guides/japan-travel-essentials. Plus `my-hero-academia-cafe-tokyo-2026`
  if present in repo (not in current sitemap).
- **2e REWRITE_HEAVY** (1 article): akihabara-arcade-rhythm-games-guide-2026.
- **B3 hub-page lift** (3): /category/experiences, /cafes, /calendar —
  CollectionPage schema + 200+ word editorial intro + 5+ inbound links + hero.

These will be picked up in Phase 1 day 1-3 of the autonomous loop, plus
expanded to cover the full 45-URL "Crawled - currently not indexed" set
per the new prompt's deeper verdict scope.

## Cumulative session metrics

| Metric | This session |
| --- | --- |
| PRs merged | 3 (#45 legacy redirects, #46 cannibalization, #47 mojibake) |
| main-direct commits | 0 |
| Articles touched | 3 (2 frontmatter, 1 mojibake byte-fix) |
| Config changes | 1 (next.config.ts: +15 redirects) |
| New audit / session docs | 1 (this report) |
| `--admin` overrides | **0** |
| `--no-verify` / `--force` / destructive ops | 0 |
| `git push --force` to main | 0 |
| AI-detection gate hiccups | 0 |
| Critic-loop applications | 1 (mojibake fix, all 3 stages PASS) |
| Live verifications post-deploy | 13 + 2 + 1 = 16 URLs, 16/16 PASS |
| 5-axis image / Takapon / 5-silo / no-delete | 100% honored |
| False-claim discipline | 0 violations |

## Production state at session close

- **Apex redirect**: ✓ (was already live)
- **WP legacy paths → /articles/**: 13/13 redirecting correctly
- **Cannibalization 308s**: 2/2 redirecting correctly + sitemap excluding
- **tokyo-summer mojibake**: 0 byte-level mojibake patterns remaining
- **Sitemap clean state**: 103 URLs, 0 asset/api/font/tags/ noise
- **Articles in repo**: 87 (validate 87/87 PASS)

## Session complete

Hand-off state for Phase 1 of the autonomous 2-week loop:

1. **Continue article-level verdicts** from Bucket 2d (6-7 REWRITE_LIGHT)
   + Bucket 2e (1 REWRITE_HEAVY) — scoped in Phase 1b of the 2-week prompt.
2. **Hub-page quality lift** from Bucket B3 — scoped in Phase 1.
3. **Pending deferred**: GW article noindex on/after 2026-05-07 (task #98).
4. **Stale state preserved**: `git stash@{0}` ("WIP: abandoned mojibake-5
   prior session") holds partial mojibake work on chainsaw-man, kyoto,
   one-piece-tokyo, slam-dunk. Out of current scope (slam-dunk already
   has `robots:noindex,follow`). Recoverable if needed.
5. **Open PRs**: PR #44 (wp-uploads-broken-9, AI-gate FAILURE — needs
   rebase on main to pull voice_marker phrases from PR #42 before
   re-running CI), PR #10 (image 4-axis gate, older infra), PR #2/#1
   (image inbox, older infra).

CodeQL action v3.35.2 (PR #26, 2026-04-30) now stable across **23
consecutive PRs/pushes** without `--admin`.

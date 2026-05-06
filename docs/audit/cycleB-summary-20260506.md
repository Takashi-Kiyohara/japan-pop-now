# [cycleB'] Polish + originality — 2026-05-06

Applied B'-1 fix in code, B'-2 ran originality cosine analysis, B'-3 ran freshness audit, B'-4 reclassified the prior P2 items after closer inspection. Result: **1 P1 fix shipped, 1 new P1 (JR Pass cluster) deferred to user decision, 4 P2 informational findings.**

## B'-1 — P1-A5-1 stale links → fixed ✓

`content/articles/anime-day-trips-from-tokyo-2026.md` (2 occurrences) and `content/articles/detective-conan-pilgrimage-events-2026.md` (1 occurrence) — replaced `[…](/articles/slam-dunk-kamakura-pilgrimage-2026)` with `[…](/articles/kamakura-slam-dunk-pilgrimage-2026)` so inbound traffic and PageRank flow directly to the canonical slug instead of bouncing through the deprecated `noindex,follow` slug's canonical chain.

Verification:
```
$ grep -nE '\]\(/articles/slam-dunk-kamakura-pilgrimage-2026' content/articles/*.{md,mdx}
(no matches in cross-article links)
$ grep -nE '\]\(/articles/kamakura-slam-dunk-pilgrimage-2026' content/articles/*.{md,mdx}
content/articles/anime-day-trips-from-tokyo-2026.md:92  ...
content/articles/anime-day-trips-from-tokyo-2026.md:196 ...
content/articles/detective-conan-pilgrimage-events-2026.md:174 ...
```

## B'-2 — originality / boilerplate

Built `scripts/audit/originality-cosine.ts` (TF-IDF + cosine, no embedding API). Ran across 87 articles. Full output: `docs/audit/cycleB-originality-20260506.md`.

### Pair counts
| Bucket | Count |
|---|---|
| Cosine ≥ 0.7 (P1) | 3 |
| Cosine 0.5–0.7 (P2 — review) | 14 |
| Boilerplate ratio ≥ 30% | **0** |

### P1 pairs — triage

| Cosine | Slug A | Slug B | Disposition |
|---|---|---|---|
| 0.829 | `demon-slayer-rerun-cafe-ufotable-2026` | `demon-slayer-rerun-cafe-ufotable-kizuna-2026` | **Already handled** — old article has `robots:noindex,follow` + canonical to kizuna; cannibalization 308 in next.config.ts. |
| 0.720 | `kamakura-slam-dunk-pilgrimage-2026` | `slam-dunk-kamakura-pilgrimage-2026` | **Already handled** — old slug has noindex+canonical, plus B'-1 just fixed the 3 inbound links. |
| 0.713 | `japan-rail-pass-guide-anime-fans` | `jr-pass-anime-pilgrimage-routes-2026` | **NEW P1 — user decision needed** |

### P1 deferred to user decision: 3 JR-Pass articles cluster

Three articles are mutually similar above the 0.6 threshold:
- `japan-rail-pass-2026-guide` (the canonical "main JR Pass guide")
- `japan-rail-pass-guide-anime-fans` (JR Pass framed for anime fans)
- `jr-pass-anime-pilgrimage-routes-2026` (JR Pass + specific pilgrimage routes)

Pair similarities:
- 0.713 — `japan-rail-pass-guide-anime-fans` × `jr-pass-anime-pilgrimage-routes-2026`
- 0.636 — `japan-rail-pass-2026-guide` × `japan-rail-pass-guide-anime-fans`
- 0.612 — `japan-rail-pass-2026-guide` × `jr-pass-anime-pilgrimage-routes-2026`

All three are in the sitemap. Likely Google sees them as competing for the same query intent ("JR Pass for anime travelers"), splitting PageRank.

**Triage options** (choose 1, requires user decision):
1. **MERGE** — pick one as canonical (probably `japan-rail-pass-2026-guide` for the main keyword), 308 the other two to it via next.config.ts cannibalization rules. Lose 2 article URLs but consolidate ranking.
2. **DIFFERENTIATE** — narrow each article's scope so they target distinct sub-queries ("JR Pass for anime fans" vs "JR Pass + Kansai pilgrimage" vs "JR Pass general"). Rewrite intros + headers to make the angle obvious. ~30 min/article.
3. **KEEP & ACCEPT** — let Google figure it out. Risk: spread PageRank, weaker SERP performance for any single article.

Recommended: **option 2** for SEO + content-strategy balance. Filed as P1 follow-up; needs Takapon's call on which angle each article should keep.

### P2 pairs (0.5–0.7) — review only

Top-5 highest:
- 0.655 `osaka-anime-collab-cafes-pop-culture-2026` × `osaka-anime-guide-den-den-town` — already cannibalized (the pop-culture one redirects to `osaka-anime-cafes-complete-guide-2026`).
- 0.640 `how-to-book-anime-collab-cafe-japan` × `tokyo-anime-collab-cafes-summer-2026`
- 0.612 `japan-rail-pass-2026-guide` × `jr-pass-anime-pilgrimage-routes-2026` (subset of P1 cluster above)
- 0.610 `animate-cafe-guide-japan` × `how-to-book-anime-collab-cafe-japan`
- 0.597 `shibuya-harajuku-pop-culture-guide` × `tokyo-anime-district-guide`

Most are "different angle on adjacent topic" — fine for SEO. Logged for Cycle D' polish in case AdSense reviewer flags any.

### Boilerplate ratio
**0 articles ≥ 30%.** Article intros / outros / disclosures are unique enough across the 87-article corpus. Disclosures appear via the `<AffiliateDisclosure />` component (auto-injected, not literal-text), so the cosine algorithm correctly treats them as 1-token-mention rather than 50-word repeats.

## B'-3 — sitemap freshness

### Frontmatter `lastUpdated` ahead of git last-commit date
9 articles have FM `lastUpdated` ahead of their git last-commit date by 1–4 days:

| Slug | FM lastUpdated | git last commit |
|---|---|---|
| chiikawa-land-tokyo-complete-2026 | 2026-05-02 | 2026-05-01 |
| demon-slayer-handmade-club-ufotable-cafe-2026 | 2026-05-02 | 2026-05-01 |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | 2026-05-03 | 2026-05-01 |
| golden-kamuy-golden-week-shinjuku-popup-2026 | 2026-05-02 | 2026-05-01 |
| japan-ic-card-transit-guide | 2026-05-04 | 2026-05-01 |
| kamakura-slam-dunk-pilgrimage-2026 | 2026-05-05 | 2026-05-01 |
| ranma-japan-2026-exhibition-tree-village-guide | 2026-05-03 | 2026-05-01 |
| re-zero-curemaid-cafe-akihabara-2026 | 2026-05-03 | 2026-05-01 |
| world-trigger-festival-2026-tokyo-dome-city-cafe | 2026-05-02 | 2026-05-01 |

**Disposition**: schema.org `dateModified` is a content-review timestamp, not a code-commit timestamp. If Takapon (or Cowork) genuinely reviewed the content on those dates, the value is honest. Borderline P3 — recommend Takapon confirm. No automatic correction made.

### Stale `lastUpdated` (>30 days, in-sitemap, no validUntil exclusion) — 20 articles
These are evergreen guides (area guides, transit, general anime culture). Top-5 oldest:
- 42d — `your-name-pilgrimage-tokyo`, `ikebukuro-anime-guide-2026`, `anime-pilgrimage-spots-tokyo`
- 39d — `weathering-with-you-locations-tokyo`, `tokyo-anime-district-guide`, etc.

Evergreen content age isn't a hard problem, but Google rewards freshness signals. **P2 — schedule a quarterly freshness sweep**: spot-check + bump `lastUpdated` if accurate.

## B'-4 — P2 reclassifications

After closer inspection, two of the prior P2 items aren't real:

- **P2-1 (Cycle A): `/tags/anime` missing `, follow` modifier** — REJECTED. `/tags/anime` returns **404**, not 200. The `noindex` meta tag on the 404 page is correct behavior. There's no `anime` tag (only compound tags like `anime-pilgrimage`). Withdrawn.
- **P2-A4-1 (Cycle A2): UTF-8 BOM in 2 article files** — DEFERRED. gray-matter handles BOM correctly in production; only my audit script tripped. Cosmetic only, no SEO impact.

Real P2 from prior cycles still open:
- Apex 2-hop (Vercel platform — user dashboard action only, documented)
- /author/takapon 404 (optional /author page or remove sameAs claim)
- A7-1: 11 articles with <3 external official-source links
- A7-2: Person sameAs has 2 entries (could add /about for 3)
- A9-1: CWV audit pending (PageSpeed API quota; reschedule)
- A12-1: GA4 traffic audit pending (user export)

## P0 / P1 / P2 ledger after cycle B'

### Fixed this cycle
- **P1-A5-1** stale slam-dunk links — done ✓

### New finding from this cycle
- **P1-B2-1** JR Pass 3-article cluster cannibalization — needs user-decision merge/differentiate. **Not blocking AdSense readiness** but reduces SEO efficiency for JR Pass queries.

### Open backlog for Cycle D' / future
- **P2** — A7 external-link density (11 articles)
- **P2** — A7 Person sameAs (1 line in lib/author.ts)
- **P2** — A9 CWV audit (reschedule once API quota refreshes or service-account configured)
- **P2** — A12 GA4 traffic audit (user export)
- **P2** — B2 14 mid-similarity pairs (review during Cycle D')
- **P2** — B3 stale `lastUpdated` (>30d) on 20 evergreen articles — quarterly sweep
- **P3** — B3 9 articles with FM ahead of git date (informational; user confirmation)

## Cycle B' status
**Critic agent — pending verification of B'-1 P1 fix.** If GREEN, `cycleB-DONE.flag` is created.

Critic-loop iter cap: max 3.

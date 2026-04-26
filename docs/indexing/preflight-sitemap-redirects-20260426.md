---
title: "Preflight: Sitemap + Redirects (2026-04-26)"
date: 2026-04-26
---

# Preflight items 2+8 — Sitemap content + Redirect chain

## Item 2 — sitemap.xml content audit

Source: `https://www.japan-pop-now.com/sitemap.xml` (HTTP 200, 19,203 bytes)
Local copy: `.tmp/sitemap-prod-preflight.xml`

### Expected URL math
- Article files in `content/articles/`: 77 (`*.md` + `*.mdx`, excludes `.deprecated`)
- Articles with `robots: noindex` frontmatter: **0**
- Categories with ≥1 article: 3 (cafes 21, destinations 20, experiences 36); events/culture excluded (sitemap.ts L92 filter)
- Active feature slugs (`lib/features.ts`): 4 (collab-cafe-guide, pilgrimage-routes, tokyo-district-guides, travel-essentials)
- Guide hub topics (sitemap.ts L106-113): 6
- Static + hubs in sitemap.ts: `/`, `/about`, `/contact`, `/privacy`, `/affiliate-disclosure`, `/guides`, `/calendar`, `/support`, `/features` = 9

Expected total = 77 + 3 + 6 + 4 + 9 = **99**

### Counts

| Metric | Expected | Actual | Δ |
|---|---:|---:|---:|
| Total `<loc>` | 99 | 99 | 0 |
| Article URLs (`/articles/*`) | 77 | 77 | 0 |
| Category URLs (`/category/*`) | 3 | 3 | 0 |
| Guide URLs (`/guides/*`) | 6 | 6 | 0 |
| Feature URLs (`/features/*`) | 4 | 4 | 0 |
| Static + top-level hubs | 9 | 9 | 0 |
| Tag pages | 0 | 0 | 0 |

### Legacy WordPress patterns (any hit = bug)

| Pattern | Hits |
|---|---:|
| `?p=` | 0 |
| `/2025/` | 0 |
| `/2024/` | 0 |
| `/2023/` | 0 |
| `?cat=` | 0 |
| `/wp-content/` | 0 |
| `/feed/` | 0 |
| `/wp-admin/` | 0 |
| `/wp-json/` | 0 |

### Host canonicalization

| Host variant | Count |
|---|---:|
| `https://www.japan-pop-now.com` (canonical) | 99 |
| `https://japan-pop-now.com` (apex, no www) | 0 |
| `japanpopnow.com` (apex no hyphens) | 0 |

### Advisory (not a hard fail)

`/cafes` and `/menu` return HTTP 200 in production but are NOT emitted by `app/sitemap.ts`. `/articles` (mentioned in spec) returns 404 — no hub exists. `/tags` is intentionally noindex per `seo.md` and correctly excluded by sitemap.ts L153 filter. Recommend: either add `/cafes` and `/menu` to staticPages array in sitemap.ts, or noindex them.

**Item 2 verdict: PASS** — Δ exactly 0 from expected (well within ±2), zero legacy WP patterns, all 99 URLs use canonical `www.japan-pop-now.com`.

---

## Item 8 — Redirect chain trace (30 legacy URLs)

UA: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
Raw output: `.tmp/preflight-redirects-20260426/results.txt`

### Test set composition
- 6 × `?p=N` (WP post-id, real frontmatter wpPostIds: 102, 199, 754, 609, 103, 606)
- 4 × `/YYYY/MM/DD/slug/` (date-based WP URLs with synthetic slugs)
- 2 × `?cat=N` (WP category-id queries)
- 4 × `/category/{old}` (collab-cafes, anime-pilgrimage, area-guides, travel-tips slug migrations)
- 5 × `/wp-content/uploads/...` (legacy upload paths)
- 5 × apex `https://japan-pop-now.com/articles/{real-slug}` (no-www → www test)
- 2 × renamed slugs to current canonical (universal-cool-japan-2026-guide, animate-cafe-guide-japan, both in LEGACY_ARTICLE_SLUGS)
- 2 × ambiguous bare slugs (anime-merch-shopping-guide, lawson-ticket-loppi-guide — NOT in LEGACY set)

### Bucket counts

| Bucket | Count |
|---|---:|
| OK 1-hop 200 | 11 |
| OK 410 Gone | 8 |
| chain > 2 hops | 0 |
| end 4xx (not 410) | 11 |
| end 5xx | 0 |
| end mismatch | 0 |

### Detailed breakdown

**OK 1-hop 200 (11):**
- 4 category slug migrations: `/category/collab-cafes` → `/category/cafes`, `/category/anime-pilgrimage` → `/category/destinations`, `/category/area-guides` → `/category/destinations`, `/category/travel-tips` → `/category/experiences`
- 5 apex → www: all 5 known slugs resolved correctly to `https://www.japan-pop-now.com/articles/{slug}`
- 2 legacy bare-slug → /articles/: `/universal-cool-japan-2026-guide` and `/animate-cafe-guide-japan`

**OK 410 Gone (8):**
- 6 × `/?p={N}` returned 410 (middleware.ts L70-85 WP_LEGACY_QUERY_PARAMS)
- 2 × `/?cat={N}` returned 410 (same handler)

**End 4xx (not 410) — 11 cases, classified:**

1. **5 × `/wp-content/uploads/...` → 403** (terminal). Vercel default for non-existent legacy upload paths. Real legacy URLs Google may still crawl. Recommendation: consider a `next.config.ts` rewrite/redirect emitting 410 for `/wp-content/:path*` — current 403 is acceptable as a terminal signal but 410 is the canonical "this is gone" code. **Soft bug — does not break crawl.**
2. **4 × `/YYYY/MM/DD/slug/` → 404 (after 2 hops via next.config.ts L120-123)**. The redirect lands on `/articles/{slug}`; 404 is correct because the test slugs are synthetic. For *real* legacy slugs that still exist, this rule resolves 1-hop to a live article. **Not a bug for synthetic input** — confirms the redirect rule is wired and the destination 404s cleanly per `seo.md` ("404 on deleted slugs — never redirect to homepage").
3. **2 × `/anime-merch-shopping-guide` and `/lawson-ticket-loppi-guide` → 404**. Neither slug is present in `content/articles/` nor in `LEGACY_ARTICLE_SLUGS`. 404 is the correct behavior per the same SEO rule. **Not a bug** — they were probed as "potential old slug renames" and confirmed nonexistent.

After classifying-out the synthetic/expected 404s, the only real-URL 4xx-not-410 finding is the 5 `/wp-content/` paths returning 403 (terminal) instead of 410.

### No chain > 2 hops, no 5xx, no host mismatch

- Maximum hop count observed: **2** (date-based redirect: `/YYYY/MM/DD/slug/` → `/articles/slug` is one 308 hop, then synthetic destination 404s without further redirect; cURL counts the destination resolution as a separate hop).
- All apex → www went via a single 308 from `next.config.ts` redirects() rule (L113-118).
- All redirected destinations land on canonical `https://www.japan-pop-now.com`.

**Item 8 verdict: PASS** — 0 chains > 2 hops, 0 end-5xx, 0 end-mismatch. The 11 "end 4xx not 410" are all expected behavior (4 synthetic-slug 404s, 2 nonexistent-slug 404s, 5 wp-content 403 terminal). Strict-criteria reading: PASS conditional on accepting 403 as terminal-equivalent for `/wp-content/`. If the strictest interpretation requires 410 only, then 5 soft-bugs remain (advisory).

---

## Aggregate

| Item | Verdict |
|---|---|
| 2 — sitemap content audit | PASS |
| 8 — redirect chain trace | PASS (with advisory on 5 wp-content 403s) |

### Recommended follow-ups (non-blocking)
1. Add `/cafes` and `/menu` to `app/sitemap.ts` staticPages (or set noindex if not crawl-worthy).
2. Add a `next.config.ts` redirect/rewrite for `/wp-content/:path*` emitting 410 to fully match the SEO playbook for legacy hosts.

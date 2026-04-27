# Final pre-URL-Inspection Sitemap Audit — 2026-04-27

**Step 4** of pre-URL-Inspection verification. Validates content of production
`sitemap.xml` against the filesystem slug list and required hubs.

Source: `https://www.japan-pop-now.com/sitemap.xml` (fetched 2026-04-27).
Snapshot: `.tmp/audit/sitemap-final.xml` (19,000 bytes).
Generator: `app/sitemap.ts`.

## Matrix

| Check | Expected | Actual | Result |
|---|---|---|---|
| Total `<loc>` entries | ≥ 95 (77 articles + ~20 hubs/guides) | 98 | OK |
| URLs prefixed `https://www.japan-pop-now.com/` | 100% | 98/98 | OK |
| WP-legacy patterns (`?p=`, `/YYYY/`, `?cat=`) | 0 | 0 | OK |
| `/contact` present (should be absent — noindex) | 0 | 0 | OK |
| `.deprecated` slugs present | 0 | 0 | OK |
| Articles in sitemap vs filesystem | 76 sitemap = 77 fs minus 1 noindex | 76 vs 77 (-1) | OK |
| `/cafes` present | yes | yes | OK |
| `/features` + 4 active feature children | yes (5) | yes (5) | OK |
| `/category/{slug}` for non-empty categories (cafes, experiences, destinations) | 3 | 3 | OK |
| `/category/events`, `/category/culture` (empty → noindex by design) | absent | absent | OK |
| `/guides` + 6 hub topics | yes (7) | yes (7) | OK |
| `/search` (noindex by design) | absent | absent | OK |

## Articles delta (filesystem vs sitemap)

- **Filesystem slugs:** 77 (`.tmp/audit/slugs.txt`).
- **Sitemap article URLs:** 76.
- **Filesystem-not-in-sitemap:** 1 → `slam-dunk-kamakura-pilgrimage-2026`.
  - Verified: this MD has `robots: "noindex,follow"` + `canonical:` pointing to
    `kamakura-slam-dunk-pilgrimage-2026` (which IS in the sitemap).
  - Behavior matches `app/sitemap.ts` lines 81-82 (filter out `noindex`).
  - **Status: BY DESIGN — not a P0/P1.**
- **Sitemap-not-in-filesystem:** 0 (no orphan article URLs).

## Hub coverage

| Hub | In sitemap | By design? | Status |
|---|---|---|---|
| `/` | YES | — | OK |
| `/articles` | NO | NOT excluded by code; appears to be missed when PR #13 added the route | **P1 — sitemap gap** |
| `/cafes` | YES | — | OK |
| `/calendar` | YES | — | OK |
| `/search` | NO | YES — `app/sitemap.ts:69-71` excludes (noindex per `app/search/layout.tsx`) | OK |
| `/features` | YES | — | OK |
| `/features/collab-cafe-guide` | YES | — | OK |
| `/features/pilgrimage-routes` | YES | — | OK |
| `/features/tokyo-district-guides` | YES | — | OK |
| `/features/travel-essentials` | YES | — | OK |
| `/category/cafes` | YES | — | OK |
| `/category/events` | NO | YES — `app/sitemap.ts:91-93` filters empty categories; `app/category/[slug]/page.tsx:106` sets noindex when empty | OK |
| `/category/experiences` | YES | — | OK |
| `/category/destinations` | YES | — | OK |
| `/category/culture` | NO | YES — same empty-category rule | OK |
| `/about` | YES | — | OK |
| `/contact` | NO | YES — `app/sitemap.ts:30-32` excludes (noindex per `app/contact/page.tsx`) | OK |
| `/privacy` | YES | — | OK |
| `/affiliate-disclosure` | YES | — | OK |
| `/support` | YES | — | OK |

## Findings

### P0 (blocking) — 0

None.

### P1 (informational) — 1

**`/articles` index page is missing from sitemap.xml.**

- Route added by PR #13 (`dd5f19f`), exposed via BottomNav, returns HTTP 200,
  `index:true,follow:true`, sets self-canonical.
- `app/sitemap.ts` was not updated alongside PR #13, so the URL is absent.
- Impact: low — the homepage `/` already covers the landing intent and the page
  is internally linked from the BottomNav, so Googlebot will discover and
  index it organically. Not blocking the URL Inspection / sitemap resubmit
  gate.
- **Recommended fix (separate PR, not this audit run):** add a `staticPages`
  entry for `${baseUrl}/articles` with `priority: 0.8`, `changeFrequency:
  'daily'`, `lastModified: latestArticleDate`.

## Sample entries

First 5 entries:
- `https://www.japan-pop-now.com`
- `https://www.japan-pop-now.com/about`
- `https://www.japan-pop-now.com/privacy`
- `https://www.japan-pop-now.com/affiliate-disclosure`
- `https://www.japan-pop-now.com/guides`

Last 5 entries:
- `https://www.japan-pop-now.com/features`
- `https://www.japan-pop-now.com/features/collab-cafe-guide`
- `https://www.japan-pop-now.com/features/pilgrimage-routes`
- `https://www.japan-pop-now.com/features/tokyo-district-guides`
- `https://www.japan-pop-now.com/features/travel-essentials`

## Decision contribution

Step 4 → **GO** for URL Inspection / sitemap resubmit. No P0 issues. One P1
informational gap (`/articles` missing) recommended for a follow-up PR but does
not block submission.

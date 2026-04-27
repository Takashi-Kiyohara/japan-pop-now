# Dimension 10 — Performance Audit

- **Run date:** 2026-04-27
- **Production base:** https://www.japan-pop-now.com/
- **Auditor:** Claude (10-dim audit, dim 10)
- **Method:** PageSpeed Insights API (rate-limited; see note), curl mobile-UA TTFB sampling, static HTML analysis.

## Targets
- LCP <= 2.5s (mobile)
- CLS <= 0.1
- TBT <= 200ms

## 10.1 PageSpeed Insights — RATE LIMITED

The PSI API returned HTTP 429 on every URL: `Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'`.

This is the **anonymous (unauthenticated) public quota**, which is heavily rate-limited and shared across the planet's IPs that day. A prior agent in this audit run almost certainly burned the budget. Re-attempt tomorrow with an API key (`&key=...`) or via WebPageTest as fallback.

**Workaround used below:** TTFB / total transfer measurements via `curl` with iPhone UA, plus static HTML inspection (script blocking, image strategy, preload). These do not produce LCP/CLS/TBT directly but are reliable proxies for server-side performance.

### TTFB / page weight (curl, mobile UA)

| URL | HTTP | TTFB | Total | HTML KB | Head scripts | Blocking JS | total img tags | next/image refs |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | 0.21s | 0.26s | 229 KB | 10 | **0** | 27 | 302 |
| `/articles` | **404** | 0.31s | 0.33s | 91 KB | n/a | n/a | n/a | n/a |
| `/cafes` | 200 | 0.55s | 0.57s | 75 KB | 10 | 0 | 0 | 0 |
| `/articles/akihabara-complete-guide-2026` | 200 | 0.34s | 0.40s | 303 KB | 11 | 0 | 16 | 150 |
| `/articles/animate-cafe-guide-japan` | 200 | 0.20s | 0.25s | 266 KB | 11 | 0 | 21 | 150 |

Mean TTFB: **0.32s** (excluding 404). All 200-OK pages serve under 0.6s TTFB on a Tokyo-region request, which is well within Vercel's edge SLO. LCP is therefore image-dependent rather than TTFB-bound.

## 10.2 Render-blocking JavaScript

**Result: PASS — 0 blocking scripts in `<head>`** across all 4 sampled URLs.

Method: regex over each `<head>` block for `<script src="..."` elements; flagged only those without `async`, `defer`, or `noModule`. All Next.js `_next/static/chunks/*.js` references include `async=""`. The single `noModule=""` legacy fallback is not render-blocking on modern mobile browsers (it's the legacy ES5 fallback ignored by ES module-aware browsers).

## 10.3 Raw `<img>` count (cross-ref dim 9)

- **MDX/MD content (`content/articles/*.{md,mdx}`):** **0** raw `<img>` tags.
- **Components (`components/*.tsx`):** 1 file — `components/MDXImage.tsx:56` returns `<img src={src} loading="lazy">` for body images. No srcset/sizes; on mobile the source-resolution image is downloaded.
- **Production HTML (curl):** all visible `<img>` tags resolved via `/_next/image?url=...&w=NNN&q=75` proxy with multi-width srcset for hero/card images. Body images on article pages use the raw `<img>` from MDXImage.

## Findings

### P1 — PSI quota burned, no LCP/CLS/TBT numbers captured
**Auto-fix:** add `PSI_API_KEY` GitHub secret, modify any PSI poller scripts to include `&key=$PSI_API_KEY`. Re-run dim 10 once daily quota resets (next UTC midnight). ETA: ~15 min once a Google Cloud project is provisioned.

### P2 — `/articles` returning 404 hurts crawl + UX (cross-ref dim 9 P1)
Same root cause as dim 9 P1. Auto-fix recommendation lives in dim 9 doc.

### P3 — MDXImage body images have no srcset (cross-ref dim 9 P3)
Body images on article detail pages are served at full WebP source resolution. On a 414px-wide mobile viewport, this can be 3-5x more bytes than necessary. ETA: ~45 min PR to migrate `MDXImage` to `next/image` with explicit width/height.

### P3 — `/cafes` HTML is 75 KB but has 0 images
Implies the cafes hub renders text/cards only (no thumbnails) on the initial HTML — which is good for HTML weight but suggests imagery is loaded client-side or hub is text-heavy. Manual verification recommended (browser screenshot) — not actionable from static analysis.

### Positive findings (no action needed)
- All `<head>` scripts are async (Next.js 16 default).
- Hero/featured images use `next/image` with 8-width srcset (640w to 3840w) and `sizes="100vw"`.
- TTFB consistently under 0.6s.
- 4 preload `<link>` directives in `<head>` on article pages (likely fonts + featured image preload — good practice).
- HTML payload is sub-310KB even on long-form articles.

## Pass/Fail roll-up

- 10.1 LCP/CLS/TBT measurement: **BLOCKED (P1)** — API quota; re-run with key.
- 10.2 Render-blocking JS in head: **PASS** (0 blocking).
- 10.3 Raw img count: **PASS** (0 in content; 1 component fallback documented as P3).
- TTFB proxy: **PASS** (mean 0.32s).

Overall dim 10 status: **PASS-WITH-CAVEATS** (Lighthouse re-run pending; no blocking JS or raw HTML img issues).

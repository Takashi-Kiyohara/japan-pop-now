# Final Mobile + Performance Smoke

**Date:** 2026-04-27
**Origin/main HEAD:** `08c2152` (PR #11/#12/#13 merged)
**Production base:** https://www.japan-pop-now.com/

## A. Mobile UA smoke (10 articles)

**User-Agent:** `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1`

**Sample selection:** top-10 alphabetical from `content/articles/` (deterministic).

| # | slug | HTTP | size (KB) | viewport meta | BottomNav (`nav[aria-label="Primary mobile navigation"]`) | LCP candidate | result |
|---|------|:----:|----------:|:-------------:|:----------------------------------------------------------:|---------------|:------:|
| 1 | `akihabara-arcade-rhythm-games-guide-2026` | 200 | 238.7 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fakihabara-arcade-rhythm-games-…` | PASS |
| 2 | `akihabara-complete-guide-2026` | 200 | 303.6 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fakihabara-complete-guide-2026%…` | PASS |
| 3 | `animate-cafe-guide-japan` | 200 | 266.2 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanimate-cafe-guide-japan%2Ffea…` | PASS |
| 4 | `anime-day-trips-from-tokyo-2026` | 200 | 258.3 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanime-day-trips-from-tokyo-202…` | PASS |
| 5 | `anime-hotels-tokyo-2026` | 200 | 272.0 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanime-hotels-tokyo-2026%2Ffeat…` | PASS |
| 6 | `anime-merch-shopping-guide-japan` | 200 | 292.4 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanime-merch-shopping-guide-jap…` | PASS |
| 7 | `anime-pilgrimage-spots-tokyo` | 200 | 270.2 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanime-pilgrimage-spots-tokyo%2…` | PASS |
| 8 | `animejapan-2026-guide-international-visitors` | 200 | 253.9 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanimejapan-2026-guide-internat…` | PASS |
| 9 | `animejapan-comiket-2026-guide` | 200 | 237.5 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fanimejapan-comiket-2026-guide%…` | PASS |
| 10 | `apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` | 200 | 254.8 | OK | Y | `/_next/image?url=%2Fimages%2Farticles%2Fapothecary-diaries-oshi-tabi-o…` | PASS |

**Pass-rate: 10/10 = 100%**

**Viewport content (sample, identical across all 10):**

```
width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=cover
```

**LCP candidate observation:** All 10 articles show the featured hero `<Image>` (Next.js `/_next/image?url=…/featured.jpg`) as first/priority image. This is the expected LCP element. CLS risk low (Image components include explicit width/height).

## B. PageSpeed Insights API

**Re-attempt date:** 2026-04-27. **Result: DEFERRED — daily quota still exhausted (HTTP 429).**

Error response (truncated):

```
"Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
of service 'pagespeedonline.googleapis.com'
for consumer 'project_number:583797351490'.
```

Per spec: this DOES NOT BLOCK. Re-run scheduled for next day (quota resets midnight Pacific).

**URLs queued (5):**

- `https://www.japan-pop-now.com/` — deferred (429)
- `https://www.japan-pop-now.com/articles` — deferred (429)
- `https://www.japan-pop-now.com/cafes` — deferred (429)
- `https://www.japan-pop-now.com/articles/apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` — deferred (429)
- `https://www.japan-pop-now.com/articles/osaka-anime-guide-den-den-town` — deferred (429)

### Historical baseline (2026-04-19, local Lighthouse v2)

Targets: LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms.

| URL | perf | LCP (s) | CLS | TBT (ms) | FCP (s) | SI (s) | meets target? |
|-----|-----:|--------:|----:|---------:|--------:|-------:|:-------------:|
| https://www.japan-pop-now.com/ | 0.45 | 4.63 | 0.001 | 1147 | 3.28 | 11.2 | N |
| https://www.japan-pop-now.com/articles/animate-cafe-guide-japan | 0.38 | 5.24 | 0.001 | 1529 | 4.41 | 8.68 | N |
| https://www.japan-pop-now.com/calendar | 0.43 | 4.28 | 0.001 | 1608 | 3.99 | 8.36 | N |

**Note:** 2026-04-19 LCP/TBT exceeded targets (LCP 4.28-5.24s, TBT 1147-1608ms). PR #11/#12/#13 do **not** address Core Web Vitals (those PRs are SEO-only: title.absolute, og:url, /articles index). Performance work is a separate workstream. Re-running PSI tomorrow will reflect the same code path, just confirms current production state.

## Findings

- **Mobile UA smoke: PASS (10/10 = 100%).** All articles 200 OK, viewport correct, BottomNav present, identifiable LCP candidate.
- **PSI: DEFERRED.** Quota 429 — re-run next day. Not a blocker per spec.
- **Historical CWV** (2026-04-19) shows known LCP/TBT regression, separate workstream — no new regression introduced by PR #11/#12/#13 (SEO-only patches).

## GO/NO-GO contribution

**GO** — Step 5 mobile UA smoke passes 10/10. PSI deferred is explicitly non-blocking per spec.

Combined with Step 3 (SEO P0=0/P1=0), audit pre-URL-Inspection state is GO for sitemap resubmit.

## Methodology

```bash
# Mobile UA fetch
curl -s -L -A 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)…' --max-time 15 \
  https://www.japan-pop-now.com/articles/{slug}/ > .tmp/audit/mobile/{slug}.html
# Extract: <meta name=viewport>, <nav aria-label="Primary mobile navigation">, first <img>

# PSI v5
curl -s --max-time 90 \
  'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={URL}&strategy=mobile&category=performance'
```

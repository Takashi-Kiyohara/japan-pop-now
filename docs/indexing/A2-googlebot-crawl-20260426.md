# A2 Googlebot Crawl — 2026-04-26

**Scope:** All 99 URLs in `https://www.japan-pop-now.com/sitemap.xml` (no sampling needed; under 100 cap).
**UA:** `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
**Method:** `curl -A <UA> -sL --max-time 8 -o body -w "%{http_code}\t%{url_effective}\t%{num_redirects}"` per URL.
**Raw artifacts:** `.tmp/a2-crawl-20260426/` (sitemap.xml, robots.txt, crawl-results.tsv, extracted.tsv, pages/p*.html).

## Summary counts

| Bucket | Count | Note |
|---|---|---|
| Total URLs crawled | 99 | from sitemap |
| HTTP 200 | 99 | 100% |
| HTTP non-200 (4xx/5xx) | 0 | clean |
| Redirects (any hops) | 0 | no chains |
| Missing canonical | 0 | all pages declare one |
| **Canonical mismatch** | **4** | /features/* hubs canonicalize to homepage |
| **noindex set** | **1** | /contact (intentional, OK) |
| Missing `<title>` | 0 | clean |
| Thin content (<500 words rough) | 0 | smallest page ~1000 words (incl. nav/JSON) |

Word-count buckets (rough, includes nav/footer/JSON-LD): >=5000: 86, 2000-4999: 8, 1000-1999: 5.

## Anomalies — full list

### Bucket: canonical mismatch (HIGH severity — blocks indexing)

These 4 hub pages return HTTP 200 with `index, follow`, but their `<link rel="canonical">` points to the homepage. Google will treat them as duplicates of `/` and drop them from the index.

| URL | Final URL | Canonical (raw) | Robots |
|---|---|---|---|
| `https://www.japan-pop-now.com/features/collab-cafe-guide` | same | `https://www.japan-pop-now.com` | index, follow |
| `https://www.japan-pop-now.com/features/pilgrimage-routes` | same | `https://www.japan-pop-now.com` | index, follow |
| `https://www.japan-pop-now.com/features/tokyo-district-guides` | same | `https://www.japan-pop-now.com` | index, follow |
| `https://www.japan-pop-now.com/features/travel-essentials` | same | `https://www.japan-pop-now.com` | index, follow |

Raw evidence (verbatim from response body):
```
<link rel="canonical" href="https://www.japan-pop-now.com"/>
<meta name="robots" content="index, follow"/>
<title>Collab Cafe Guide Series | Japan Pop Now | Japan Pop Now</title>
```
Side note: titles on these 4 pages also have a duplicated `| Japan Pop Now | Japan Pop Now` suffix (cosmetic, not indexing-blocking but worth fixing alongside).

### Bucket: noindex set (informational — appears intentional)

| URL | Robots | Canonical |
|---|---|---|
| `https://www.japan-pop-now.com/contact` | `noindex, follow` | `https://www.japan-pop-now.com/contact` |

Standard practice for a contact page; canonical is self-referential and consistent. **No action needed**, but consider removing it from `sitemap.xml` (sitemaps should not list noindex URLs — Google flags this in Search Console).

### Bucket: non-200 / redirect chain / missing canonical / thin

None.

## Top 10 most-broken URLs to prioritize

Only 5 issues were found total. Listed in priority order:

1. `https://www.japan-pop-now.com/features/collab-cafe-guide` — canonical -> homepage
2. `https://www.japan-pop-now.com/features/pilgrimage-routes` — canonical -> homepage
3. `https://www.japan-pop-now.com/features/tokyo-district-guides` — canonical -> homepage
4. `https://www.japan-pop-now.com/features/travel-essentials` — canonical -> homepage
5. `https://www.japan-pop-now.com/contact` — listed in sitemap but `noindex` (low priority cleanup)

## robots.txt content + interpretation

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

User-Agent: Googlebot
Allow: /

User-Agent: Bingbot
Allow: /
... (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, Applebot-Extended all Allow: /)

Host: https://www.japan-pop-now.com
Sitemap: https://www.japan-pop-now.com/sitemap.xml
```

**Interpretation:** Clean. Googlebot has an explicit `Allow: /` block that overrides the wildcard. **No `Disallow` rules apply to `/articles/` or `/features/`** for Googlebot. The wildcard `Disallow` for `/api/`, `/_next/`, `/admin/` is correct (these are infra paths, not content). Sitemap is correctly declared. No robots.txt-level indexing blockers.

## Conclusion

The crawl is overall very healthy: 99/99 pages return 200, no redirects, no missing titles or canonicals, no robots.txt blocks on content paths. **The single material problem** is the 4 `/features/*` hub pages incorrectly canonicalizing to the homepage. Recommend investigating the page-template / metadata code for `/features/[slug]` (likely a default-canonical bug where a hub layout falls back to the site root).

---
**Generated:** 2026-04-25 (Auto-24h Track A2). Read-only crawl. No code modified.

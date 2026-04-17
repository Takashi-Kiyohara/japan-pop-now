---
name: sitemap-llms-audit-20260418
description: Sitemap gained /features hub + 4 feature series; robots.txt AI-crawler allowlist verified; llms.txt UTF-8 clean.
type: report
---

# Sitemap / Robots / llms.txt Audit — 2026-04-18

## Sitemap changes

**Added:** `/features` hub + every active feature-series slug (from `getActiveFeatureSlugs()` in `lib/features.ts`). Previously absent from `app/sitemap.ts`.

```diff
+ /features               (priority 0.7, weekly)
+ /features/{slug}        (priority 0.7, weekly)
```

**Already present:**
- `/` (1.0), `/about` `/contact` `/privacy` `/affiliate-disclosure` (0.3–0.5)
- `/guides` + 6 guide topics
- `/calendar` (0.9), `/support` (0.5), `/search` (0.3)
- 58 article URLs (priority 0.9)
- 5 category hubs (priority 0.7)

**Intentionally excluded:**
- `/tags/*` — filtered out at the end of `sitemap()` (noindex policy, see `seo.md` GSC Hygiene)
- `/cafes` + `/cafes/[slug]` — looks experimental; flag for Takapon review
- `/author/[slug]` — no such route (author profile lives elsewhere)

## Robots.txt

`app/robots.ts` is clean:
- `allow: /` for `*`, Googlebot, Bingbot
- AI crawlers explicitly allowed: GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, Applebot-Extended
- `disallow: ['/api/', '/_next/', '/admin/']`
- `host: https://www.japan-pop-now.com`
- `sitemap: [https://www.japan-pop-now.com/sitemap.xml]`

No action required.

## llms.txt / llms-full.txt

Re-verified UTF-8 cleanliness:

| File | Bytes | Chars | U+FFFD | Mojibake seqs |
|------|------:|------:|-------:|-------------:|
| `public/llms.txt` | 2138 | 2122 | 0 | 0 |
| `public/llms-full.txt` | 5888 | 5782 | 0 | 0 |

No mojibake. No replacement characters. No action required.

## Follow-up for Takapon

1. Decide whether `/cafes` hub + `/cafes/[slug]` should be indexed. If live content, add to sitemap.
2. After next deploy, resubmit sitemap to GSC (both `japan-pop-now.com` and `www.japan-pop-now.com` properties).
3. `/features` Kimetsu series (Task 13) still pending — skeleton not added (see wake-up report).

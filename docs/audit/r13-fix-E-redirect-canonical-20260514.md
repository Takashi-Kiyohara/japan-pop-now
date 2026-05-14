# R13 Bucket E — Redirect + canonical fix doc

**Bucket:** E
**Date:** 2026-05-14
**Items:** E1 date-URL guard / E2 frontmatter canonical / E3 hreflang dedup
**Commit:** `3256b17`

## E1 — WP date-URL existence guard (middleware-side)

- `next.config.ts`: removed `/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug` blind 308 rule
- `middleware.ts`: added matcher + existence-checked redirect/410:
  ```ts
  const dateUrlMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/)
  if (dateUrlMatch) {
    const dateSlug = dateUrlMatch[4]
    if (getAllArticleSlugs().includes(dateSlug)) {
      return NextResponse.redirect(new URL(`/articles/${dateSlug}`, request.url), 308)
    }
    return new NextResponse('410 Gone...', { status: 410, headers: { 'X-Robots-Tag': 'noindex' } })
  }
  ```
- Middleware runtime switched to `'nodejs'` so `fs`-backed `getAllArticleSlugs()` can be called.

## E2 — Frontmatter canonical override

- `lib/articles.ts:11-33`: `Article` type gets `canonical?: string`
- `lib/articles.ts:78-84`: `canonical: typeof data.canonical === 'string' ? data.canonical : undefined`
- `app/articles/[slug]/page.tsx:87`: `const canonicalUrl = article.canonical ?? url`
- 6 cannibalization slugs can now point `canonical:` at their hub article via frontmatter

## E3 — Hreflang dedup

- `app/articles/[slug]/page.tsx:91-97`: removed `'en': url` from languages; kept `'x-default': canonicalUrl`
- `app/layout.tsx:92-97`: same change for site-wide layout metadata
- Rationale: english-only site emitting both `en` and `x-default` at same URL is duplicate noise

## Evidence (post-deploy in PDCA Round 1)

```
curl -sI -A "Googlebot" https://www.japan-pop-now.com/2024/03/15/some-deleted-slug
  → 410

curl -sI -A "Googlebot" https://www.japan-pop-now.com/2024/03/15/akihabara-arcade-rhythm-games-guide-2026
  → 308 Location: /articles/akihabara-arcade-rhythm-games-guide-2026

curl -s https://www.japan-pop-now.com/articles/akihabara-arcade-rhythm-games-guide-2026 \
  | grep -c 'hreflang'
  → 1 (was 2 prior)
```

## RULE compliance

- RULE B: this doc generated
- RULE H: 1 commit covers all 3 related changes
- RULE M: no regression — existing `LEGACY_ARTICLE_SLUGS` redirect logic preserved, R12-P0 bot-whitelist preserved

## Bucket E duration

~22 min (incl. build re-verification post-runtime-switch).

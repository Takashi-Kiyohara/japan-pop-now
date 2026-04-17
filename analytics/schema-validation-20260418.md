---
name: schema-validation-20260418
description: JSON-LD schema audit — all articles carry valid NewsArticle + BreadcrumbList + FAQPage; one relative-image fix applied.
type: report
---

# JSON-LD Schema Validation Report — 2026-04-18

## Method

Sampled 5 representative articles via production `curl` + Python JSON-LD block extractor (`.tmp/schema-check.py`):

- `/articles/gaming-tokyo-2026` (experiences hub)
- `/articles/krispy-kreme-mario-galaxy-shibuya-2026` (latest)
- `/articles/tokyo-anime-district-guide` (hub)
- `/articles/akihabara-complete-guide-2026` (area-guide)
- `/articles/nakano-broadway-guide` (area-guide)

## Findings

### PASS

- Every article emits 8–11 JSON-LD blocks (WebSite, Organization, SiteNavigationElement, NewsArticle, BreadcrumbList, FAQPage; plus enhanced types TouristAttraction / Event / HowTo / Product where applicable).
- `NewsArticle.author.@type = Person`, `name = Takapon`, correct `sameAs = [threads, x]`.
- `datePublished` + `dateModified` populated per frontmatter.
- `publisher.logo.url` = absolute `https://www.japan-pop-now.com/logo.png`.
- `mainEntityOfPage.@id` = absolute URL.
- `Organization.sameAs` now uses `AUTHOR_SAME_AS` SSoT (Threads + X only, Instagram/TikTok purged in commit 6538a18).
- `FAQPage.mainEntity[].acceptedAnswer.text` present for every Q&A H2.

### FIXED THIS RUN

**Relative image URL in structured-data generators.** `getArticleSchema` used `article.featuredImage` raw (e.g. `/images/articles/{slug}/featured.jpg`), which Google's Rich Results Test accepts but flags as a warning in some validators. Applied `absolutize()` helper to:

- `getArticleSchema.image`
- `getEventSchema.image` (optional)
- `getTouristAttractionSchema.image` (optional)
- `getHowToSchema.image` (optional)

All now resolve relative paths to `${SITE_URL}${path}` and pass through absolute URLs unchanged.

## No action required

- No duplicate `@type: NewsArticle` blocks per page.
- No stale social URLs anywhere in emitted JSON-LD (audited post-Task-2).
- Breadcrumb positions sequential 1..N, `item` uses absolute URLs.
- WebSite `potentialAction` SearchAction has valid `urlTemplate`.

## Next

Post-deploy, re-run Rich Results Test on 5 sample URLs once Vercel picks up this commit. Any residual warnings will come from validator preferences (e.g. `ImageObject` vs string), not schema correctness.

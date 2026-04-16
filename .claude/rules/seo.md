---
paths:
  - "content/articles/**/*.md"
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "lib/seo*.ts"
  - "lib/metadata*.ts"
---

# SEO / AEO / GEO Rules — japan-pop-now.com

## Title Tag Rules
- Max 60 characters (Google cuts ~580px)
- Include primary keyword near the front
- Odd numbers in listicles outperform even (+38% CTR)
- Use brackets for context: `[2026 Update]`, `[Guide]`, `[Tokyo]`
- Verb-first for action searches: "How to…", "Find…", "Book…"

## Meta Description Rules
- Max 155 chars (mobile SERP truncation)
- MUST be unique across all articles (duplicate = de-index risk)
- Include primary + secondary keyword
- End with a light CTA: "Book now", "See the guide"

## Answer-First Content (AEO / GEO)
- First 134–167 words must answer the search intent directly
- Use definition-first paragraph: `X is …` (LLM citation signal)
- Include a "Quick Answer" block for long articles
- Target featured-snippet length: 40–60 words per answer
- Include Q&A-style H2s: "What is X?", "How much does X cost?", "When does X open?"

## Internal Linking
- Every article: 2–3 contextual internal links in body
- Hub pages: link to ALL child articles; child articles link up to hub
- Use descriptive anchor text (never "click here" or "read more")
- Cross-silo links: experiences → collab-cafes when relevant
- `relatedSlugs` in frontmatter: 3–5 related articles

## Structured Data
- Article schema: required for all `.md` articles
- FAQPage schema: when article contains Q&A H2s
- Event schema: for time-limited events/collabs
- BreadcrumbList: every hub and child page
- Organization + WebSite: root layout only
- Person schema + AuthorBox: profile pages

## Silo Structure
Five categories (post 2026-04-16 restructure):
- `collab-cafes` — current killer feature (~92% traffic)
- `experiences` — NEW silo for hands-on activities
- `area-guides` — neighborhood-focused
- `anime-pilgrimage` — seichi junrei
- `travel-tips` — practical how-tos

Each silo: `/{silo}/` hub page → child articles → hub (no orphans)

## Image SEO
- Filename: `descriptive-keywords.jpg` (not `IMG_1234.jpg`)
- Alt text: natural sentence, keyword included but not stuffed
- next/image with `priority` only for above-fold hero
- `width`/`height` always set (CLS prevention)
- WebP auto-served by next/image; keep source as JPG

## URL Structure
- `/{category}/{slug}/` — slug is kebab-case, ≤ 60 chars
- No dates in URLs (evergreen)
- No query params for core routes
- Canonical always set via `app/{path}/page.tsx` metadata

## GSC Hygiene
- Submit sitemap: both `japan-pop-now.com` and `www.japan-pop-now.com` properties
- `/tags/*` pages: noindex (thin content)
- 404 on deleted slugs — never redirect to homepage (soft-404 penalty)

## DO NOT
- Keyword stuff: density > 3% triggers penalty
- Exact-match anchor text > 30% of inbound links
- Duplicate H1 (Next.js App Router uses `<h1>` from title)
- Block crawlers via robots.txt from public pages
- Reuse meta description across 2+ articles

---
paths:
  - "content/articles/**/*.md"
  - "lib/articles*.ts"
  - "components/Article*.tsx"
---

# Article Quality Rules — japan-pop-now.com

## Frontmatter (REQUIRED fields)
```yaml
title: string (max 60 chars for SEO)
description: string (max 155 chars, unique per article)
date: "YYYY-MM-DD"
category: "collab-cafes" | "experiences" | "area-guides" | "anime-pilgrimage" | "travel-tips"
tags: string[]
featuredImage: "/images/articles/{slug}/featured.jpg"
featuredImageAlt: string (descriptive, SEO-friendly)
author: "Takapon"
excerpt: string
relatedSlugs: string[]
```

## Content Structure
- H2 sections only (no H1, no H3 in article body)
- Every H2 section should be 150-300 words
- Include TL;DR box at top for long articles (>1500 words)
- Quick info card for venue-based articles (address, hours, price, access)

## Image Rules
- featuredImage: 1200x720 landscape, face in upper-1/3
- Body images: `/images/articles/{slug}/body-{n}.jpg`
- Alt text required for every image
- Minimum 1 image per 1000 words
- NEVER use Unsplash/stock — official or authentic photos only
- Verify file exists in public/ before referencing

## Markdown Restrictions
- No footnotes ([^1] syntax breaks remark-gfm)
- No tables inside div wrappers (parsing breaks)
- Use className not class in HTML attributes
- Custom boxes: `<div className="jpn-info-box">`, `<div className="jpn-tip">`, `<div className="jpn-cta">`
- GFM tables: use remark-gfm compatible syntax only

## Collab Cafe Articles (9-element stack)
1. TL;DR summary box
2. Comparison table (if multiple locations)
3. Menu ranking (top 3-5 items)
4. Limited merchandise/loot guide
5. 1-hour plan (time budget)
6. Common mistakes → success tips
7. Pre-visit checklist
8. Freshness date badge
9. Booking CTA (Klook affiliate where applicable)

## Fact Verification
- Prices, hours, addresses: MUST web-search before publishing
- Dates: use hedging language ("as of April 2026") for time-sensitive info
- Never state past years (2023/2024) as current
- Official URLs preferred over third-party

## SEO
- Title: action verb + number/bracket for CTR
- Description: unique, answers search intent
- Internal links: 2-3 natural contextual links per article
- relatedSlugs: 3-5 related articles

## Writing Voice
- Second-person "you" in intros for engagement
- Hedge time-sensitive facts: "as of April 2026", "confirmed via official site"
- Short paragraphs (2-4 sentences)
- Concrete, specific nouns over generic ones (e.g. "Shibuya Scramble Square" not "a mall")
- No AI-flavored phrasing: avoid "Let's dive in", "In today's world", "truly unique"

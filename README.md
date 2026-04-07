# Japan Pop Now

Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.

Built with [Next.js 14](https://nextjs.org) (App Router), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com), and [MDX](https://mdxjs.com).

## Quick Start

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

- **`app/`** — Next.js 14 App Router pages
  - `page.tsx` — Homepage with featured articles and categories
  - `articles/[slug]/` — Article detail pages with MDX rendering
  - `category/[slug]/` — Category pages with filtered articles
  - `layout.tsx` — Global layout with Header, Footer, and structured data
  - `globals.css` — Global styles, prose formatting, and utilities
  - `sitemap.ts` — Dynamic sitemap generation
  - `robots.ts` — SEO robots configuration

- **`components/`** — Reusable React components
  - `Header.tsx` — Sticky navigation with mobile menu
  - `Footer.tsx` — Footer with links and social
  - `ArticleCard.tsx` — Article card component (sm/md/lg sizes)
  - `AdUnit.tsx` — Google AdSense integration

- **`lib/`** — Utilities and data fetching
  - `articles.ts` — Article loading, filtering, categories
  - `structured-data.ts` — Schema.org JSON-LD generators
  - `date-utils.ts` — Date formatting utilities

- **`content/articles/`** — Markdown articles with frontmatter

## Adding Articles

Create a new `.md` file in `content/articles/`:

```markdown
---
title: "Article Title"
description: "Short description for SEO"
date: "2026-04-08"
category: "collab-cafes"
tags: ["tag1", "tag2"]
featuredImage: "https://images.unsplash.com/..."
featuredImageAlt: "Image alt text"
author: "Japan Pop Now"
excerpt: "Short excerpt for cards"
---

# Article Title

Your article content in Markdown...
```

Supported categories: `collab-cafes`, `anime-pilgrimage`, `area-guides`, `travel-tips`

## Styling

The site uses Tailwind CSS with custom variables and prose styles for article content. Key colors:

- Primary (Pink): `#c2185b`
- Secondary (Navy): `#1a1f36`
- Accent (Blue): `#1976d2`

## Deployment

Deploy to [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## SEO Features

- Server-side rendering with Next.js
- Structured data (Article, Organization, WebSite schemas)
- Automatic sitemap and robots.txt
- Open Graph meta tags
- Mobile-responsive design
- Image optimization with Next.js Image

## License

Copyright 2026 Japan Pop Now. All rights reserved.

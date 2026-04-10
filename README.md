# Japan Pop Now

Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.

Built with [Next.js 16.2.2](https://nextjs.org) (App Router, Turbopack), [React 19.2.4](https://react.dev), [TypeScript 5](https://www.typescriptlang.org), [Tailwind CSS 4](https://tailwindcss.com), and [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) for MDX article rendering.

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

## Tooling Scripts

The repo ships a handful of CLI tools under `scripts/` that you can run via `npm run <name>`:

| Script | Purpose |
|---|---|
| `npm run lint` | ESLint (Next.js + TypeScript config). Must pass with 0 errors before merging. |
| `npm run validate` | Frontmatter validation for `content/articles/*.md` (title length, description, tags, author). |
| `npm run check-meta` | SEO meta sanity check — duplicate descriptions, title > 60 chars, description > 155 chars, forbidden author names. Exits 1 on any violation. |
| `npm run check-env` | Validates `.env.local` / `.env.production.local` against `lib/env.ts`. Detects legacy `_AFF_ID` typos. |
| `npm run images` | Walks `public/images/**/*.{jpg,png,webp}` with `image-size` and writes `lib/image-manifest.json`. Run after adding new images so `<MDXImage>` can supply correct width/height to `next/image`. |
| `npm run debt-report` | Tech-debt snapshot — counts eslint-disable directives, explicit `any`, TODO/FIXME, noindex pages, empty data files, missing featuredImage. Outputs `debt-report.json`. |
| `npm run score` | Article quality scoring (0–100) based on word count, headings, internal links, FAQs, etc. |
| `npm run freshness` | Flags articles older than the freshness threshold for review. |
| `npm run auto-link` | Suggest internal links between articles via the `lib/internal-links.ts` keyword table. |
| `npm run ping` | Submit URLs to Google / Bing / IndexNow after a deploy. |

## Project Structure

- **`app/`** — Next.js App Router pages
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

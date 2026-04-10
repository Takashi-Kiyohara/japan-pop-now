import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import {
  getSiteUrl,
  articleUrl as getArticleUrl,
} from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const articles = getAllArticles();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.4,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date(),
    },
  ];
  // Note: /guides, /features, /category/*, /features/*, /guides/* are excluded
  // from sitemap as of 2026-04-10 (AdSense low-value content fix). Hub pages
  // are noindex,follow until unique editorial content is added to each.

  // Article pages with lastModified dates
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: getArticleUrl(article.slug),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    lastModified: new Date(article.date),
  }));

  // Category pages and guide hub pages are NOT included in sitemap.
  // All hub pages are noindex,follow (see app/category/[slug]/page.tsx,
  // app/guides/[topic]/page.tsx, app/features/[slug]/page.tsx).
  // Removed 2026-04-10 to resolve AdSense "low-value content" policy violation.
  const categoryPages: MetadataRoute.Sitemap = [];
  const guidePages: MetadataRoute.Sitemap = [];

  // Cafe hub + individual cafe pages — excluded from sitemap until cafes.json
  // is populated. Hub is noindex,follow as of 2026-04-10 (AdSense fix).
  const cafeHubPage: MetadataRoute.Sitemap = [];
  const cafePages: MetadataRoute.Sitemap = [];

  // Feature series hub pages are NOT in sitemap either (noindex,follow).
  // See app/features/[slug]/page.tsx and app/features/page.tsx.
  const featurePages: MetadataRoute.Sitemap = [];

  // Tag archive pages are intentionally excluded from sitemap.
  // All tag pages are noindex,follow (see app/tags/[tag]/page.tsx).
  // Removed 2026-04-10 to resolve the "detected — not indexed" GSC issue caused
  // by ~97 thin tag pages. See tag_page_noindex_spec_20260410.md.

  return [
    ...staticPages,
    ...articlePages,
    ...categoryPages,
    ...guidePages,
    ...featurePages,
    ...cafeHubPage,
    ...cafePages,
  ];
}

import { MetadataRoute } from 'next';
import { getAllArticleSlugs, getAllArticles, CATEGORIES } from '@/lib/articles';
import { getAllUniqueTags } from '@/lib/auto-tags';
import { getSiteUrl, articleUrl as getArticleUrl, tagUrl, guideUrl } from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const slugs = getAllArticleSlugs();
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
      url: `${baseUrl}/guides`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/calendar`,
      changeFrequency: 'daily',
      priority: 0.9,
      lastModified: new Date(),
    },
  ];

  // Article pages with lastModified dates
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: getArticleUrl(article.slug),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    lastModified: new Date(article.date),
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified: new Date(),
  }));

  // Guide hub pages
  const hubTopics = [
    'tokyo-anime-cafes',
    'anime-pilgrimage-tokyo',
    'osaka-anime-guide',
    'day-trips-from-tokyo',
    'japan-travel-essentials',
  ];
  const guidePages: MetadataRoute.Sitemap = hubTopics.map((topic) => ({
    url: guideUrl(topic),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  // Tag archive pages
  const tags = getAllUniqueTags(articles);
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: tagUrl(tag),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
    lastModified: new Date(),
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...guidePages, ...tagPages];
}

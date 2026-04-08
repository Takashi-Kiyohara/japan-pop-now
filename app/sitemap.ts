import { MetadataRoute } from 'next';
import { getAllArticleSlugs, getAllArticles, CATEGORIES } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://japan-pop-now.com';
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
  ];

  // Article pages with lastModified dates
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
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

  return [...staticPages, ...articlePages, ...categoryPages];
}

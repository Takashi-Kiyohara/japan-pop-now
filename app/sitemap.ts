import { MetadataRoute } from 'next';
import { getAllArticleSlugs, CATEGORIES } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://japan-pop-now.com';
  const slugs = getAllArticleSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Article pages
  const articlePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}

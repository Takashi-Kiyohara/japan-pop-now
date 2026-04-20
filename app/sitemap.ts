import { MetadataRoute } from 'next';
import { getAllArticles, CATEGORIES } from '@/lib/articles';
import { getAllUniqueTags } from '@/lib/auto-tags';
import { getActiveFeatureSlugs } from '@/lib/features';
import { getSiteUrl, articleUrl as getArticleUrl, tagUrl, guideUrl } from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const articles = getAllArticles();

  // Derive the most recent article date for category/guide pages
  const latestArticleDate = articles.length > 0
    ? new Date(Math.max(...articles.map((a) => new Date(a.lastUpdated || a.date).getTime())))
    : new Date('2026-04-10');

  // Static pages — use fixed dates, NOT new Date()
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
      lastModified: latestArticleDate,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
      lastModified: new Date('2026-04-10'),
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.4,
      lastModified: new Date('2026-04-10'),
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date('2026-04-10'),
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      changeFrequency: 'monthly',
      priority: 0.3,
      lastModified: new Date('2026-04-10'),
    },
    {
      url: `${baseUrl}/guides`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: latestArticleDate,
    },
    {
      url: `${baseUrl}/calendar`,
      changeFrequency: 'daily',
      priority: 0.9,
      lastModified: new Date('2026-04-17'),
    },
    {
      url: `${baseUrl}/support`,
      changeFrequency: 'monthly',
      priority: 0.5,
      lastModified: new Date('2026-04-17'),
    },
    // /search intentionally excluded — SERPs should never index per Google
    // guidance, and the page itself now returns robots=noindex (see
    // app/search/layout.tsx).
  ];

  // Article pages — use actual lastUpdated or date from frontmatter
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: getArticleUrl(article.slug),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    lastModified: new Date(article.lastUpdated || article.date),
  }));

  // Category pages — use latest article date in that category.
  // Empty categories (events / culture) are excluded from the sitemap AND
  // robots=noindex (see app/category/[slug]/page.tsx) until they have at
  // least one article. Keeps thin hubs out of Google's index attempts.
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES
    .map((category) => {
      const categoryArticles = articles.filter((a) => a.category === category.slug);
      if (categoryArticles.length === 0) return null;
      const latestInCategory = new Date(
        Math.max(...categoryArticles.map((a) => new Date(a.lastUpdated || a.date).getTime()))
      );
      return {
        url: `${baseUrl}/category/${category.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        lastModified: latestInCategory,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  // Guide hub pages — use latest article date overall
  const hubTopics = [
    'tokyo-anime-cafes',
    'anime-pilgrimage-tokyo',
    'osaka-anime-guide',
    'day-trips-from-tokyo',
    'japan-anime-experiences',
    'japan-travel-essentials',
  ];
  const guidePages: MetadataRoute.Sitemap = hubTopics.map((topic) => ({
    url: guideUrl(topic),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    lastModified: latestArticleDate,
  }));

  // Features hub + individual feature series
  const featurePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/features`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: latestArticleDate,
    },
    ...getActiveFeatureSlugs().map((slug) => ({
      url: `${baseUrl}/features/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: latestArticleDate,
    })),
  ];

  // Tag archive pages — use latest article date for each tag
  const tags = getAllUniqueTags(articles);
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => {
    const tagArticles = articles.filter((a) => a.tags?.includes(tag));
    const latestInTag = tagArticles.length > 0
      ? new Date(Math.max(...tagArticles.map((a) => new Date(a.lastUpdated || a.date).getTime())))
      : new Date('2026-04-10');
    return {
      url: tagUrl(tag),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      lastModified: latestInTag,
    };
  });

  const all = [...staticPages, ...articlePages, ...categoryPages, ...guidePages, ...featurePages, ...tagPages];
  return all.filter((u) => !u.url.includes('/tags/'));
}

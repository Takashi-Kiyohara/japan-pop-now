import { NextResponse } from 'next/server';
import { getAllArticles, getArticlesByFeature } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { FEATURES, getActiveFeatureSlugs } from '@/lib/features';

export const revalidate = 86400; // ISR: regenerate daily (push on-demand)

export async function GET() {
  const articles = getAllArticles();
  const now = new Date().toISOString().split('T')[0];

  // Group articles by category
  const grouped = new Map<string, typeof articles>();
  for (const cat of CATEGORIES) {
    grouped.set(cat.slug, []);
  }
  for (const a of articles) {
    const list = grouped.get(a.category);
    if (list) list.push(a);
    else grouped.set(a.category, [a]);
  }

  // Category labels
  const catLabels: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    catLabels[cat.slug] = cat.label;
  }

  // Build category blocks with numbered articles
  const categoryBlocks = CATEGORIES.map((cat) => {
    const catArticles = grouped.get(cat.slug) || [];
    const lines = catArticles.map((a, i) => {
      const desc = a.description ? ` — ${a.description}` : '';
      return `${i + 1}. ${a.title}${desc}\n   URL: https://japan-pop-now.com/articles/${a.slug}`;
    });
    return `### ${cat.label} (${catArticles.length} articles)\n${lines.join('\n')}`;
  }).join('\n\n');

  // Collect all unique tags
  const tagSet = new Set<string>();
  articles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet).sort();

  // Key topics organized by theme
  const topics = [
    'Anime collab cafe booking and schedules',
    'Sacred anime pilgrimage locations across Japan',
    'Tokyo districts: Akihabara, Ikebukuro, Shibuya, Nakano',
    'Osaka and Kyoto anime destinations',
    'Japan Rail Pass and transit for anime fans',
    'International visitor essentials (eSIM, luggage, insurance)',
    'Anime tourism events and conventions',
    'Merchandise shopping and shipping',
  ];

  const content = `# Japan Pop Now — Complete Content Index
> Your ultimate guide to Japan's anime and pop culture scene for international visitors.

## About
Japan Pop Now is an English-language media site covering anime collab cafes, pilgrimage spots, area guides, and travel tips for visitors to Japan.
- Author: Takapon — Kyoto-born, Tokyo-based, UK-based graduate student in International Relations
- Total articles: ${articles.length}
- Last generated: ${now}

## Content Categories

${categoryBlocks}

## Guide Hubs
- Tokyo Anime Cafes: https://japan-pop-now.com/guides/tokyo-anime-cafes
- Anime Pilgrimage Tokyo: https://japan-pop-now.com/guides/anime-pilgrimage-tokyo
- Osaka Anime Guide: https://japan-pop-now.com/guides/osaka-anime-guide
- Day Trips from Tokyo: https://japan-pop-now.com/guides/day-trips-from-tokyo
- Japan Travel Essentials: https://japan-pop-now.com/guides/japan-travel-essentials

## Feature Series (editorial columns, orthogonal to categories)
Long-running editorial series that collect multi-article investigations across categories.
Articles can optionally belong to one feature series alongside their required category.

${FEATURES.filter((f) => getActiveFeatureSlugs().includes(f.slug))
  .map((f) => {
    const seriesArticles = getArticlesByFeature(f.slug);
    const lines = seriesArticles.map(
      (a, i) =>
        `${i + 1}. ${a.title}\n   URL: https://japan-pop-now.com/articles/${a.slug}`
    );
    return `### ${f.label} (${seriesArticles.length} articles)\n${f.description}\nSeries URL: https://japan-pop-now.com/features/${f.slug}\n${lines.join('\n')}`;
  })
  .join('\n\n')}

## Key Topics & Concepts
${topics.map((t) => `- ${t}`).join('\n')}

## All Tags
${allTags.map((t) => t.replace(/-/g, ' ')).join(', ')}

## Links
- Homepage: https://japan-pop-now.com
- RSS Feed: https://japan-pop-now.com/feed.xml
- Sitemap: https://japan-pop-now.com/sitemap.xml

## Audience
International visitors aged 20-40 interested in anime, manga, and Japanese pop culture. Seeking practical guides, real-world location information, and cultural insights.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

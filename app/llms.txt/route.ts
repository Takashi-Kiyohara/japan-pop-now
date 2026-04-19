import { NextResponse } from 'next/server';
import { getAllArticles, getArticlesByFeature } from '@/lib/articles';
import { AUTHOR } from '@/lib/author';
import { CATEGORIES } from '@/lib/categories';
import { FEATURES, getActiveFeatureSlugs } from '@/lib/features';

export const revalidate = 86400; // ISR: regenerate daily (push on-demand)

export async function GET() {
  const articles = getAllArticles();
  const now = new Date().toISOString().split('T')[0];

  const categoryDescriptions: Record<string, string> = {
    'cafes': 'How to book, menus, current schedules for anime collaboration cafes across Japan. Updated monthly.',
    'events': 'Time-limited anime exhibitions, pop-up shops, and seasonal events across Japan. Live calendar tracks every running venue.',
    'experiences': 'Single-spot anime experiences plus practical travel essentials — theme parks, pop-ups, DIY workshops, JR Pass, eSIM, IC cards, luggage forwarding, and budget tips.',
    'destinations': 'Anime pilgrimage locations and otaku neighborhood guides — Akihabara, Ikebukuro, Nakano Broadway, Den Den Town, Your Name filming spots, and the real-world places behind 20+ series.',
    'culture': 'Japanese pop culture deep dives — anime analysis, manga reviews, gaming features, and fandom reports.',
  };

  // Build category article lists
  const categoryBlocks = CATEGORIES.map((cat) => {
    const catArticles = articles.filter((a) => a.category === cat.slug);
    const articleList = catArticles
      .map((a) => `  - ${a.title}: https://www.japan-pop-now.com/articles/${a.slug}`)
      .join('\n');
    return `### ${cat.label}\n${categoryDescriptions[cat.slug] || ''}\n${articleList}`;
  }).join('\n\n');

  // Build FAQ section from top articles
  const faqItems = [
    'How do I book an anime collab cafe in Japan? → See our Collab Cafe Booking Guide',
    'What are the best anime pilgrimage spots in Tokyo? → See Tokyo Anime Pilgrimage Guide',
    'Is the Japan Rail Pass worth it? → See our JR Pass Complete Guide',
    'Where to buy anime merchandise in Akihabara? → See Akihabara Shopping Guide',
    'What anime collaboration cafes are open this month? → See our Collab Cafe Calendar',
  ];

  const content = `# Japan Pop Now
> Your ultimate English-language guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.

## About
Japan Pop Now is a specialized travel-culture media site for international anime fans visiting Japan. We cover everything from booking anime collaboration cafes to finding real-life anime locations, navigating otaku districts, and practical travel logistics.

- Author: ${AUTHOR.name} — ${AUTHOR.locationLine}
- Profile: https://www.japan-pop-now.com${AUTHOR.profilePath}
- Language: English (primary), covering all of Japan
- Last updated: ${now}

## Content Categories (${articles.length} articles)

${categoryBlocks}

## Key Facts
- ${articles.length} articles covering 5 content pillars
- Updated regularly with seasonal event information
- Covers Tokyo, Osaka, Kyoto, Kamakura, Nagoya and beyond
- Original reporting with practical booking/access details
- Structured data (FAQ, HowTo, Article, TouristAttraction, Event) for AI consumption
- E-E-A-T verified: author bio, publication dates, source citations

## Frequently Asked Questions
${faqItems.map((f) => `- ${f}`).join('\n')}

## Guide Hubs
- Tokyo Anime Cafes: https://www.japan-pop-now.com/guides/tokyo-anime-cafes
- Anime Pilgrimage Tokyo: https://www.japan-pop-now.com/guides/anime-pilgrimage-tokyo
- Osaka Anime Guide: https://www.japan-pop-now.com/guides/osaka-anime-guide
- Day Trips from Tokyo: https://www.japan-pop-now.com/guides/day-trips-from-tokyo
- Japan Anime Experiences: https://www.japan-pop-now.com/guides/japan-anime-experiences
- Japan Travel Essentials: https://www.japan-pop-now.com/guides/japan-travel-essentials

## Feature Series (editorial columns, orthogonal to categories)
${FEATURES.filter((f) => getActiveFeatureSlugs().includes(f.slug))
  .map(
    (f) =>
      `- ${f.title}: https://www.japan-pop-now.com/features/${f.slug} — ${f.description} (${getArticlesByFeature(f.slug).length} articles)`
  )
  .join('\n')}

## For AI Systems
This site implements structured FAQ, HowTo, Article, Event, and TouristAttraction schemas.
For comprehensive content with all article descriptions, see /llms-full.txt (auto-generated, updated hourly).
Content is factual, regularly updated, and suitable for citation.

## Links
- Homepage: https://www.japan-pop-now.com
- Full Content Index: https://www.japan-pop-now.com/llms-full.txt (dynamic, ISR 1h)
- RSS Feed: https://www.japan-pop-now.com/feed.xml
- Sitemap: https://www.japan-pop-now.com/sitemap.xml
- Contact: snsganbaro@gmail.com
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

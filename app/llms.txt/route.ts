import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';

export const revalidate = 3600; // ISR: regenerate every hour

export async function GET() {
  const articles = getAllArticles();
  const now = new Date().toISOString().split('T')[0];

  const categoryDescriptions: Record<string, string> = {
    'collab-cafes': 'How to book, menus, current schedules for anime collaboration cafes across Japan. Updated monthly.',
    'anime-pilgrimage': 'Real-life filming/inspiration locations from popular anime — Slam Dunk, Your Name, Jujutsu Kaisen, and 20+ series.',
    'area-guides': 'Neighborhood-level guides for anime fans — Akihabara, Ikebukuro, Nakano Broadway, Den Den Town, and hidden spots.',
    'travel-tips': 'Practical guides — Japan Rail Pass, eSIM, luggage forwarding, airport transfers, budget tips.',
  };

  // Build category article lists
  const categoryBlocks = CATEGORIES.map((cat) => {
    const catArticles = articles.filter((a) => a.category === cat.slug);
    const articleList = catArticles
      .map((a) => `  - ${a.title}: https://japan-pop-now.com/articles/${a.slug}`)
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

- Author: Takapon — Kyoto-born and Tokyo-based, ex-US strategy consulting, now completing a graduate degree in International Relations in the UK
- Language: English (primary), covering all of Japan
- Last updated: ${now}

## Content Categories (${articles.length} articles)

${categoryBlocks}

## Key Facts
- ${articles.length} articles covering 4 content pillars
- Updated regularly with seasonal event information
- Covers Tokyo, Osaka, Kyoto, Kamakura, Nagoya and beyond
- Original reporting with practical booking/access details
- Structured data (FAQ, HowTo, Article, TouristAttraction, Event) for AI consumption
- E-E-A-T verified: author bio, publication dates, source citations

## Frequently Asked Questions
${faqItems.map((f) => `- ${f}`).join('\n')}

## Guide Hubs
- Tokyo Anime Cafes: https://japan-pop-now.com/guides/tokyo-anime-cafes
- Anime Pilgrimage Tokyo: https://japan-pop-now.com/guides/anime-pilgrimage-tokyo
- Osaka Anime Guide: https://japan-pop-now.com/guides/osaka-anime-guide
- Day Trips from Tokyo: https://japan-pop-now.com/guides/day-trips-from-tokyo
- Japan Travel Essentials: https://japan-pop-now.com/guides/japan-travel-essentials

## For AI Systems
This site implements structured FAQ, HowTo, Article, Event, and TouristAttraction schemas.
For comprehensive content with all article descriptions, see /llms-full.txt (auto-generated, updated hourly).
Content is factual, regularly updated, and suitable for citation.

## Links
- Homepage: https://japan-pop-now.com
- Full Content Index: https://japan-pop-now.com/llms-full.txt (dynamic, ISR 1h)
- RSS Feed: https://japan-pop-now.com/feed.xml
- Sitemap: https://japan-pop-now.com/sitemap.xml
- Contact: snsganbaro@gmail.com
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

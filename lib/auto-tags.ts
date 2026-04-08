/**
 * Auto-tag generation for articles with empty tags.
 * Extracts tags from slug, title, and category to enable tag archive pages
 * without requiring manual frontmatter updates for 53 articles.
 */

const KEYWORD_TAG_MAP: Record<string, string[]> = {
  // Locations
  'tokyo': ['tokyo'],
  'akihabara': ['tokyo', 'akihabara'],
  'ikebukuro': ['tokyo', 'ikebukuro'],
  'shibuya': ['tokyo', 'shibuya'],
  'harajuku': ['tokyo', 'harajuku'],
  'nakano': ['tokyo', 'nakano'],
  'shinjuku': ['tokyo', 'shinjuku'],
  'osaka': ['osaka', 'kansai'],
  'kyoto': ['kyoto', 'kansai'],
  'kamakura': ['kamakura', 'day-trip'],
  'kumamoto': ['kumamoto', 'kyushu'],
  'ghibli': ['ghibli', 'studio-ghibli'],
  'hakone': ['hakone', 'day-trip'],

  // Anime IPs
  'one-piece': ['one-piece'],
  'jujutsu-kaisen': ['jujutsu-kaisen'],
  'demon-slayer': ['demon-slayer', 'kimetsu'],
  'spy-family': ['spy-x-family'],
  'chainsaw-man': ['chainsaw-man'],
  'slam-dunk': ['slam-dunk'],
  'your-name': ['your-name', 'makoto-shinkai'],
  'weathering': ['weathering-with-you', 'makoto-shinkai'],
  'hero-academia': ['my-hero-academia'],
  'detective-conan': ['detective-conan'],

  // Topics
  'collab-cafe': ['collab-cafe', 'anime-cafe'],
  'cafe': ['collab-cafe'],
  'pilgrimage': ['pilgrimage', 'seichi-junrei'],
  'hotel': ['accommodation', 'hotel'],
  'merch': ['shopping', 'merchandise'],
  'shopping': ['shopping'],
  'gachapon': ['shopping', 'gachapon'],
  'cosplay': ['cosplay'],
  'gaming': ['gaming', 'arcade'],
  'arcade': ['gaming', 'arcade'],
  'esim': ['connectivity', 'esim'],
  'wifi': ['connectivity'],
  'rail-pass': ['jr-pass', 'transport'],
  'jr-pass': ['jr-pass', 'transport'],
  'ic-card': ['transport', 'ic-card'],
  'luggage': ['logistics'],
  'insurance': ['logistics', 'insurance'],
  'checklist': ['planning'],
  'proxy': ['shopping', 'proxy'],
  'ship': ['shipping', 'logistics'],
  'booking': ['booking', 'howto'],
  'animejapan': ['anime-event', 'convention'],
  'comiket': ['anime-event', 'convention'],
  'wonder-festival': ['anime-event', 'figures'],
  'universal': ['universal-studios', 'theme-park'],
  'pokepark': ['pokemon', 'theme-park'],
  'lawson': ['booking', 'convenience-store'],
  'familymart': ['convenience-store'],
  'tour': ['tour', 'guided'],
  'day-trip': ['day-trip'],
  'guide': ['guide'],
  'budget': ['budget'],
};

export function generateAutoTags(slug: string, title: string, category: string): string[] {
  const tags = new Set<string>();
  const searchText = `${slug} ${title}`.toLowerCase();

  // Category-based tags
  switch (category) {
    case 'collab-cafes':
      tags.add('collab-cafe');
      break;
    case 'anime-pilgrimage':
      tags.add('pilgrimage');
      tags.add('seichi-junrei');
      break;
    case 'area-guides':
      tags.add('area-guide');
      break;
    case 'travel-tips':
      tags.add('travel-tips');
      break;
  }

  // Keyword matching
  for (const [keyword, matchedTags] of Object.entries(KEYWORD_TAG_MAP)) {
    if (searchText.includes(keyword)) {
      matchedTags.forEach((t) => tags.add(t));
    }
  }

  // Year tags
  if (searchText.includes('2026')) tags.add('2026');

  return Array.from(tags);
}

/** Get all unique tags across all articles (for generating tag archive pages) */
export function getAllUniqueTags(
  articles: { slug: string; title: string; category: string; tags: string[] }[]
): string[] {
  const tagSet = new Set<string>();
  for (const a of articles) {
    const tags = a.tags.length > 0 ? a.tags : generateAutoTags(a.slug, a.title, a.category);
    tags.forEach((t) => tagSet.add(t));
  }
  return Array.from(tagSet).sort();
}

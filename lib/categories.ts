// Separate file so client components can import CATEGORIES without pulling in Node.js `fs`

export interface Category {
  slug: string;
  label: string;
  icon: string;
  lucideIcon: string;
  color: string;
  description: string;
  hubSlug: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'collab-cafes',
    label: 'Collab Cafes',
    icon: '☕',
    lucideIcon: 'Coffee',
    color: '#f97316',
    description: 'Complete guides to anime collaboration cafes across Japan — booking tips, current menus, limited-time events, and honest reviews from Tokyo, Osaka, and beyond.',
    hubSlug: 'tokyo-anime-cafes',
  },
  {
    slug: 'anime-pilgrimage',
    label: 'Anime Pilgrimage',
    icon: '⛩️',
    lucideIcon: 'MapPin',
    color: '#22c55e',
    description: 'Visit the real-world locations that inspired your favorite anime. Detailed route guides with exact spots, photo angles, and access info for 20+ series.',
    hubSlug: 'anime-pilgrimage-tokyo',
  },
  {
    slug: 'area-guides',
    label: 'Area Guides',
    icon: '🗺️',
    lucideIcon: 'Map',
    color: '#3b82f6',
    description: 'Neighborhood-by-neighborhood guides for anime fans — Akihabara, Ikebukuro, Nakano Broadway, Den Den Town, and the hidden otaku spots tourists miss.',
    hubSlug: 'osaka-anime-guide',
  },
  {
    slug: 'experiences',
    label: 'Experiences',
    icon: '🎟️',
    lucideIcon: 'Sparkles',
    color: '#0d9488',
    description: 'Single-spot experiences for anime fans — themed cafes, exhibitions, pop-ups, theme parks, DIY workshops, and one-of-a-kind venues across Japan.',
    hubSlug: 'japan-anime-experiences',
  },
  {
    slug: 'travel-tips',
    label: 'Travel Tips',
    icon: '🧳',
    lucideIcon: 'Compass',
    color: '#f97316',
    description: 'Practical travel guides for anime fans visiting Japan — JR Pass comparisons, eSIM setup, luggage forwarding, airport transfers, budgeting, and etiquette.',
    hubSlug: 'japan-travel-essentials',
  },
]

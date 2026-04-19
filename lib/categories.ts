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

// 2026-04-19 category migration (5-body MECE restructure, approved 2026-04-16):
//   collab-cafes       -> cafes        (11 articles)
//   anime-pilgrimage   -> destinations (13 articles)
//   area-guides        -> destinations ( 7 articles)
//   experiences        -> experiences  (15 articles, unchanged)
//   travel-tips        -> experiences  (16 articles, merged as practical experiences)
// `events` and `culture` are new structural slots that currently hold zero
// articles; events points English-speaking readers at /calendar, culture
// reserves space for future pop-culture essays and IP deep-dives.

export const CATEGORIES: Category[] = [
  {
    slug: 'cafes',
    label: 'Collab Cafes',
    icon: '☕',
    lucideIcon: 'Coffee',
    color: '#f97316',
    description: 'Complete guides to anime collaboration cafes across Japan — booking tips, current menus, limited-time events, and honest reviews from Tokyo, Osaka, and beyond.',
    hubSlug: 'tokyo-anime-cafes',
  },
  {
    slug: 'events',
    label: 'Events & Pop-ups',
    icon: '🎉',
    lucideIcon: 'Calendar',
    color: '#e63946',
    description: 'Time-limited anime exhibitions, pop-up shops, and seasonal events across Japan. Live calendar at /calendar shows every running event; this hub collects recap and guide articles.',
    hubSlug: 'tokyo-anime-cafes',
  },
  {
    slug: 'experiences',
    label: 'Experiences',
    icon: '🎟️',
    lucideIcon: 'Sparkles',
    color: '#0d9488',
    description: 'Single-spot experiences and practical travel know-how for anime fans — themed cafes, pop-ups, theme parks, plus JR Pass, eSIM, luggage, and airport transfer guides.',
    hubSlug: 'japan-anime-experiences',
  },
  {
    slug: 'destinations',
    label: 'Destinations',
    icon: '🗺️',
    lucideIcon: 'MapPin',
    color: '#22c55e',
    description: 'Anime pilgrimage sites and otaku neighborhood guides — Akihabara, Ikebukuro, Nakano Broadway, Den Den Town, Your Name locations, and the real-world places behind your favorite series.',
    hubSlug: 'anime-pilgrimage-tokyo',
  },
  {
    slug: 'culture',
    label: 'Pop Culture',
    icon: '🎌',
    lucideIcon: 'Sparkles',
    color: '#8b5cf6',
    description: 'Deep dives into Japanese pop culture — anime analysis, manga reviews, gaming features, and fandom reports that sit alongside our travel coverage.',
    hubSlug: 'japan-anime-experiences',
  },
]

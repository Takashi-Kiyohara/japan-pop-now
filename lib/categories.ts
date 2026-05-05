// Separate file so client components can import CATEGORIES without pulling in Node.js `fs`

export interface Category {
  slug: string;
  label: string;
  icon: string;
  lucideIcon: string;
  color: string;
  description: string;
  hubSlug: string;
  /** Optional 200+ word editorial intro rendered as multi-paragraph
   * prose under the page-level description. Hub-page lift target per
   * the AdSense/indexing playbook — articulate what the category
   * covers, who it serves, and how to navigate the listing below. */
  editorialIntro?: string[];
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
    editorialIntro: [
      'The Experiences category collects two related but distinct families of content: single-spot anime experiences (theme park attractions, pop-up retail, character cafes, DIY workshops, fan-day events) and practical travel essentials that overseas anime fans need to actually reach those experiences (JR Pass logistics, eSIM and pocket Wi-Fi, luggage forwarding, IC card transit, proxy shopping, airport transfers, and Japan-specific booking platform mechanics). The 2026-04 site restructure merged the legacy Travel Tips silo into Experiences because the practical guides were always read alongside the spot-experience write-ups in the same trip-planning sessions; keeping them in one category mirrors how visitors actually use them.',
      'For overseas readers planning a Japan anime trip, the Experiences silo answers the operational questions that come after the destinations are chosen: which theme park attraction needs an in-park integer-ticket pull, which IC card to load before arrival, how to ship a Mandarake haul home before flying, when an eSIM beats a pocket Wi-Fi, and which Klook/Viator/GetYourGuide listing actually delivers what it markets. Articles below tend to be longer-form (2,000–4,500 words) because they replace the Japanese-language operator UI with English procedural detail. Expect price bands in yen with rough USD equivalents, English-friendliness ratings, and confirm-against-operator-site posture on every time-sensitive claim.',
      'Browse the listing below by recency, or jump straight to the most-used reference articles via the booking walkthrough, IC card guide, or JR Pass primer. Time-limited events (an anime collaboration that closes in May, a single-day fan event) are flagged with end-date badges; permanent attractions stay listed without an expiry. New experiences land in this category most weeks during the spring and summer broadcast seasons.',
    ],
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

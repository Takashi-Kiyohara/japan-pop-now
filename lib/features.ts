/**
 * lib/features.ts — Editorial feature series definitions
 * Each "feature" is a curated content series grouping articles by theme.
 */

export interface Feature {
  slug: string;
  title: string;
  description: string;
  /** Tags used to match articles to this feature */
  tags: string[];
  active: boolean;
  /** Optional cover image path for OG image */
  cover?: string;
}

export const FEATURES: Feature[] = [
  {
    slug: 'collab-cafe-guide',
    title: 'Collab Cafe Guide Series',
    description: 'Complete guides to anime collaboration cafes across Japan — booking, menus, and real visit notes.',
    tags: ['collab-cafe', 'anime-cafe'],
    active: true,
  },
  {
    slug: 'pilgrimage-routes',
    title: 'Anime Pilgrimage Routes',
    description: 'Visit the real-life locations from your favorite anime — exact spots, photo angles, and access info.',
    tags: ['pilgrimage', 'holy-land', 'seichi-junrei'],
    active: true,
  },
  {
    slug: 'tokyo-district-guides',
    title: 'Tokyo District Guides',
    description: 'Neighborhood-by-neighborhood coverage of Tokyo anime and pop culture hotspots.',
    tags: ['tokyo', 'area-guide', 'district'],
    active: true,
  },
  {
    slug: 'travel-essentials',
    title: 'Japan Travel Essentials',
    description: 'Practical guides for international visitors — rail passes, eSIM, IC cards, and money tips.',
    tags: ['travel-tips', 'essential', 'budget'],
    active: true,
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function getActiveFeatureSlugs(): string[] {
  return FEATURES.filter((f) => f.active).map((f) => f.slug);
}

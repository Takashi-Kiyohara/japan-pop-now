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
  /** Display label (defaults to title) */
  label: string;
  /** Short tagline (defaults to description) */
  tagline: string;
  /** CSS color for UI accent */
  color: string;
  /** Primary category this feature maps to */
  primaryCategory: string;
}

export const FEATURES: Feature[] = [
  {
    slug: 'collab-cafe-guide',
    title: 'Collab Cafe Guide Series',
    label: 'Collab Cafe Guide Series',
    description: 'Complete guides to anime collaboration cafes across Japan — booking, menus, and real visit notes.',
    tagline: 'Booking, menus, and real visit notes for anime cafes across Japan.',
    tags: ['collab-cafe', 'anime-cafe'],
    active: true,
    color: '#e91e8c',
    primaryCategory: 'cafes',
  },
  {
    slug: 'pilgrimage-routes',
    title: 'Anime Pilgrimage Routes',
    label: 'Anime Pilgrimage Routes',
    description: 'Visit the real-life locations from your favorite anime — exact spots, photo angles, and access info.',
    tagline: 'Exact spots, photo angles, and access info for anime holy lands.',
    tags: ['pilgrimage', 'holy-land', 'seichi-junrei'],
    active: true,
    color: '#2563eb',
    primaryCategory: 'destinations',
  },
  {
    slug: 'tokyo-district-guides',
    title: 'Tokyo District Guides',
    label: 'Tokyo District Guides',
    description: 'Neighborhood-by-neighborhood coverage of Tokyo anime and pop culture hotspots.',
    tagline: 'Neighborhood-by-neighborhood Tokyo pop culture hotspots.',
    tags: ['tokyo', 'area-guide', 'district'],
    active: true,
    color: '#16a34a',
    primaryCategory: 'destinations',
  },
  {
    slug: 'travel-essentials',
    title: 'Japan Travel Essentials',
    label: 'Japan Travel Essentials',
    description: 'Practical guides for international visitors — rail passes, eSIM, IC cards, and money tips.',
    tagline: 'Rail passes, eSIM, IC cards, and money tips for visitors.',
    tags: ['travel-tips', 'essential', 'budget'],
    active: true,
    color: '#d97706',
    primaryCategory: 'experiences',
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function getActiveFeatureSlugs(): string[] {
  return FEATURES.filter((f) => f.active).map((f) => f.slug);
}

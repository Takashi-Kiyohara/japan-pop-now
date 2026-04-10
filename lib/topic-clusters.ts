/**
 * Topic Cluster Configuration for SEO Silos
 * Organizes 53 articles into 4 main silos with pillar and cluster articles
 * This enables topical authority and improved internal linking strategy
 */

export interface TopicCluster {
  id: string;
  name: string;
  description: string;
  pillarArticle: string; // slug
  clusterArticles: string[]; // array of slugs
  category: string;
}

/**
 * Complete topic cluster definition
 * These represent the 4 main content silos
 */
export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'anime-pilgrimage',
    name: 'Anime Pilgrimage & Locations',
    description: 'Real-world anime locations, pilgrimage spots, and filming locations',
    pillarArticle: 'anime-pilgrimage-spots-tokyo',
    clusterArticles: [
      'chainsaw-man-pilgrimage-tokyo',
      'demon-slayer-pilgrimage-tokyo',
      'jujutsu-kaisen-shibuya-locations-2026',
      'your-name-pilgrimage-tokyo',
      'weathering-with-you-locations-tokyo',
      'slam-dunk-kamakura-pilgrimage-2026',
      'one-piece-kumamoto-statue-tour',
      'one-piece-tokyo-guide-2026',
      'detective-conan-pilgrimage-events-2026',
      'spy-family-tokyo-fan-day-2026',
      'ghibli-park-complete-guide-2026',
    ],
    category: 'anime-pilgrimage',
  },
  {
    id: 'collab-cafes',
    name: 'Anime Collaboration Cafes',
    description: 'How to book and visit anime collaboration cafes across Japan',
    pillarArticle: 'how-to-book-anime-collab-cafe-japan',
    clusterArticles: [
      'tokyo-anime-collab-cafes-spring-2026',
      'tokyo-anime-collab-cafes-summer-2026',
      'osaka-anime-collab-cafes-pop-culture-2026',
      'animate-cafe-guide-japan',
      'detective-conan-cafe-2026-japan-guide',
      'jujutsu-kaisen-cafes-japan-2026-guide',
      'my-hero-academia-cafe-tokyo-2026',
      'lawson-ticket-anime-cafe-booking',
    ],
    category: 'collab-cafes',
  },
  {
    id: 'area-guides',
    name: 'Anime Shopping Districts & Area Guides',
    description: 'Neighborhood guides to Tokyo, Osaka, Kyoto pop culture districts',
    pillarArticle: 'tokyo-anime-district-guide',
    clusterArticles: [
      'akihabara-complete-guide-2026',
      'ikebukuro-anime-guide-2026',
      'nakano-broadway-guide',
      'shibuya-harajuku-pop-culture-guide',
      'kyoto-anime-guide-2026',
      'osaka-anime-guide-den-den-town',
      'anime-day-trips-from-tokyo-2026',
      'anime-hotels-tokyo-2026',
      'gachapon-guide-japan',
      'game-centers-arcades-japan',
      'gaming-tokyo-2026',
      'cosplay-experience-tokyo-2026',
    ],
    category: 'area-guides',
  },
  {
    id: 'travel-tips',
    name: 'Travel Essentials for Anime Fans',
    description: 'Practical guides for international visitors (rail pass, eSIM, logistics)',
    pillarArticle: 'japan-trip-checklist-anime-fans-2026',
    clusterArticles: [
      'japan-rail-pass-2026-guide',
      'japan-rail-pass-guide-anime-fans',
      'jr-pass-anime-pilgrimage-routes-2026',
      'japan-esim-pocket-wifi-sim-card',
      'japan-ic-card-transit-guide',
      'japan-luggage-forwarding-2026',
      'japan-travel-insurance-2026',
      'book-japan-anime-events-overseas-2026',
      'ship-anime-figures-merch-home-japan',
      'japan-proxy-shopping-2026',
      'anime-merch-shopping-guide-japan',
      'best-anime-tours-tokyo-2026',
      'animejapan-2026-guide-international-visitors',
      'animejapan-comiket-2026-guide',
      'wonder-festival-figure-events-japan-2026',
      'universal-cool-japan-2026-guide',
      'familymart-anime-collab-stores-2026',
    ],
    category: 'travel-tips',
  },
];

/**
 * Map of all articles to their cluster
 * Makes it easy to find related articles for internal linking
 */
export function getClusterForArticle(slug: string): TopicCluster | null {
  for (const cluster of TOPIC_CLUSTERS) {
    if (
      cluster.pillarArticle === slug ||
      cluster.clusterArticles.includes(slug)
    ) {
      return cluster;
    }
  }
  return null;
}

/**
 * Get all articles in a cluster (pillar + cluster articles)
 * @param clusterId - Cluster ID (e.g., 'anime-pilgrimage')
 * @returns Array of all article slugs in the cluster
 */
export function getClusterArticles(clusterId: string): string[] {
  const cluster = TOPIC_CLUSTERS.find((c) => c.id === clusterId);
  if (!cluster) return [];
  return [cluster.pillarArticle, ...cluster.clusterArticles];
}

/**
 * Get the pillar article for a given article's cluster
 * @param slug - Article slug
 * @returns Pillar article slug or null if not in any cluster
 */
export function getPillarArticleForSlug(slug: string): string | null {
  const cluster = getClusterForArticle(slug);
  return cluster?.pillarArticle || null;
}

/**
 * Get related articles within the same cluster
 * Useful for "Related Articles" sections
 * @param slug - Current article slug
 * @param exclude - Slugs to exclude (e.g., current article)
 * @param limit - Max number of related articles to return
 * @returns Array of related article slugs
 */
export function getRelatedArticlesInCluster(
  slug: string,
  exclude: string[] = [],
  limit: number = 3
): string[] {
  const cluster = getClusterForArticle(slug);
  if (!cluster) return [];

  const allInCluster = getClusterArticles(cluster.id);
  return allInCluster
    .filter((s) => !exclude.includes(s))
    .slice(0, limit);
}

/**
 * Get all clusters
 * @returns Array of all TopicCluster objects
 */
export function getAllClusters(): TopicCluster[] {
  return TOPIC_CLUSTERS;
}

/**
 * Get cluster by ID
 * @param clusterId - Cluster ID
 * @returns TopicCluster or null
 */
export function getClusterById(clusterId: string): TopicCluster | null {
  return TOPIC_CLUSTERS.find((c) => c.id === clusterId) || null;
}

/**
 * Get all articles organized by cluster
 * @returns Object with cluster IDs as keys and article slugs as values
 */
export function getArticlesByCluster(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const cluster of TOPIC_CLUSTERS) {
    result[cluster.id] = [
      cluster.pillarArticle,
      ...cluster.clusterArticles,
    ];
  }
  return result;
}

/**
 * Validate cluster configuration
 * Checks for duplicate articles, missing articles, etc.
 * @returns Array of validation errors (empty if valid)
 */
export function validateClusters(): string[] {
  const errors: string[] = [];
  const allSlugs = new Set<string>();

  for (const cluster of TOPIC_CLUSTERS) {
    if (!cluster.id || !cluster.pillarArticle) {
      errors.push(
        `Cluster "${cluster.name}" is missing id or pillarArticle`
      );
    }

    // Check for duplicates
    if (allSlugs.has(cluster.pillarArticle)) {
      errors.push(
        `Duplicate article: "${cluster.pillarArticle}" appears in multiple clusters`
      );
    }
    allSlugs.add(cluster.pillarArticle);

    for (const slug of cluster.clusterArticles) {
      if (allSlugs.has(slug)) {
        errors.push(
          `Duplicate article: "${slug}" appears in multiple clusters`
        );
      }
      allSlugs.add(slug);
    }
  }

  return errors;
}

/**
 * Get statistics about cluster organization
 * @returns Statistics object
 */
export function getClusterStats() {
  let totalArticles = 0;
  const totalClusters = TOPIC_CLUSTERS.length;

  for (const cluster of TOPIC_CLUSTERS) {
    totalArticles += 1 + cluster.clusterArticles.length;
  }

  return {
    totalClusters,
    totalArticles,
    avgArticlesPerCluster: (totalArticles / totalClusters).toFixed(1),
    clusterBreakdown: TOPIC_CLUSTERS.map((c) => ({
      id: c.id,
      name: c.name,
      articleCount: 1 + c.clusterArticles.length,
    })),
  };
}

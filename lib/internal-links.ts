import { ArticleMeta } from './articles';

interface InternalLinkMatch {
  text: string;
  slug: string;
  position: number;
}

// Keyword aliases for improved matching.
// Keys MUST be actual article slugs. Aliases should be distinctive phrases
// unlikely to appear incidentally in unrelated articles.
const KEYWORD_ALIASES: Record<string, string[]> = {
  // Area guides
  'akihabara-complete-guide-2026': ['akihabara', 'electric town'],
  'shibuya-harajuku-pop-culture-guide': ['shibuya crossing', 'takeshita street'],
  'ikebukuro-anime-guide-2026': ['ikebukuro', 'otome road', 'sunshine city'],
  'nakano-broadway-guide': ['nakano broadway'],
  'osaka-anime-guide-den-den-town': ['den den town', 'nipponbashi'],
  'kyoto-anime-guide-2026': ['kyoto anime', 'uji'],
  'tokyo-anime-district-guide': ['anime districts', 'anime neighborhoods'],

  // Travel / logistics
  'japan-rail-pass-2026-guide': ['japan rail pass', 'jr pass'],
  'japan-esim-pocket-wifi-sim-card': ['esim', 'pocket wifi', 'sim card'],
  'japan-ic-card-transit-guide': ['suica', 'pasmo', 'ic card'],
  'japan-luggage-forwarding-2026': ['luggage forwarding', 'takuhaibin', 'yamato transport'],
  'japan-travel-insurance-2026': ['travel insurance'],
  'japan-proxy-shopping-2026': ['proxy shopping', 'buyee', 'zenmarket'],
  'japan-trip-checklist-anime-fans-2026': ['trip checklist'],
  'first-timers-japan-playbook-anime-fans-2026': ['first timers', 'first time in japan'],
  'ship-anime-figures-merch-home-japan': ['ship figures home', 'ship merch home'],

  // Franchise pilgrimages
  'demon-slayer-pilgrimage-tokyo': ['demon slayer', 'kimetsu no yaiba'],
  'chainsaw-man-pilgrimage-tokyo': ['chainsaw man', 'denji'],
  'jujutsu-kaisen-shibuya-locations-2026': ['jujutsu kaisen', 'jjk shibuya'],
  'jujutsu-kaisen-cafes-japan-2026-guide': ['jujutsu kaisen cafe', 'jjk cafe'],
  'naruto-tokyo-pilgrimage-2026': ['naruto'],
  'slam-dunk-kamakura-pilgrimage-2026': ['slam dunk', 'kamakura koko-mae', 'inoue takehiko'],
  'your-name-pilgrimage-tokyo': ['your name', 'kimi no na wa'],
  'weathering-with-you-locations-tokyo': ['weathering with you', 'tenki no ko'],
  'anime-pilgrimage-spots-tokyo': ['anime pilgrimage', 'seichi junrei'],
  'one-piece-tokyo-guide-2026': ['one piece tokyo'],
  'one-piece-kumamoto-statue-tour': ['one piece statues', 'kumamoto statue'],
  'spy-family-tokyo-fan-day-2026': ['spy family', 'spy x family'],

  // Cafes / collabs
  'animate-cafe-guide-japan': ['animate cafe'],
  'one-piece-cafe-gene-shibuya-guide-2026': ['one piece cafe', 'gene cafe'],
  'my-hero-academia-cafe-tokyo-2026': ['my hero academia cafe', 'mha cafe'],
  'detective-conan-cafe-2026-japan-guide': ['detective conan cafe', 'case closed cafe'],
  'detective-conan-pilgrimage-events-2026': ['detective conan', 'case closed'],
  'lawson-ticket-anime-cafe-booking': ['lawson ticket', 'l-code'],
  'how-to-book-anime-collab-cafe-japan': ['book collab cafe', 'collab cafe booking'],
  'tokyo-anime-collab-cafes-spring-2026': ['spring 2026 collab cafe'],
  'tokyo-anime-collab-cafes-summer-2026': ['summer 2026 collab cafe'],
  'osaka-anime-collab-cafes-pop-culture-2026': ['osaka collab cafe'],
  'chiikawa-bakery-harajuku-guide-2026': ['chiikawa bakery', 'chiikawa'],
  'familymart-anime-collab-stores-2026': ['familymart collab', 'family mart anime'],

  // Shopping / merch
  'anime-merch-shopping-guide-japan': ['anime merch shopping', 'anime shopping'],
  'gachapon-guide-japan': ['gachapon', 'gashapon', 'capsule toys'],
  'game-centers-arcades-japan': ['game centers', 'arcades', 'ufo catcher'],

  // Events / experiences
  'animejapan-2026-guide-international-visitors': ['animejapan'],
  'animejapan-comiket-2026-guide': ['comiket', 'comic market'],
  'wonder-festival-figure-events-japan-2026': ['wonder festival', 'wonfes'],
  'book-japan-anime-events-overseas-2026': ['book anime events overseas'],
  'universal-cool-japan-2026-guide': ['universal cool japan', 'ucj', 'usj'],
  'ghibli-park-complete-guide-2026': ['ghibli park'],
  'pokepark-kanto-tokyo-2026': ['pokepark', 'pokemon park'],
  'cosplay-experience-tokyo-2026': ['cosplay experience', 'cosplay studio'],
  'luvlab-harajuku-diy-accessory-experience': ['luvlab', 'diy accessory'],
  'gaming-tokyo-2026': ['gaming in tokyo', 'tokyo gaming'],

  // Tours / hotels / day trips
  'best-anime-tours-tokyo-2026': ['anime tours tokyo'],
  'anime-hotels-tokyo-2026': ['anime hotels', 'themed hotel'],
  'anime-day-trips-from-tokyo-2026': ['day trips from tokyo'],
  'jr-pass-anime-pilgrimage-routes-2026': ['pilgrimage routes'],
  'japan-rail-pass-guide-anime-fans': ['jr pass for anime fans'],
};

/**
 * Automatically inserts internal links to related articles in markdown content
 * Uses multiple matching strategies: exact title, slug-based, case-insensitive keywords
 * @param content - The markdown content to process
 * @param articles - Array of all available articles
 * @param excludeSlug - Slug of the current article (to avoid self-linking)
 * @param maxLinks - Maximum number of links to insert (default: 5)
 * @returns Modified markdown content with internal links inserted
 */
export function insertInternalLinks(
  content: string,
  articles: ArticleMeta[],
  excludeSlug: string,
  maxLinks: number = 5
): string {
  let result = content;
  const insertedLinks: Set<string> = new Set();
  const matches: InternalLinkMatch[] = [];

  // Filter out the current article
  const availableArticles = articles.filter((a) => a.slug !== excludeSlug);

  // Find potential article mentions in the content using multiple strategies
  availableArticles.forEach((article) => {
    // Strategy 1: Exact title match (case-insensitive)
    const titleRegex = new RegExp(
      `\\b${escapeRegex(article.title)}\\b`,
      'gi'
    );

    let match;
    while ((match = titleRegex.exec(content)) !== null) {
      if (!isAlreadyLinked(content, match.index, match[0].length)) {
        matches.push({
          text: match[0],
          slug: article.slug,
          position: match.index,
        });
      }
    }

    // Strategy 2: DISABLED — single slug-word matching was too aggressive.
    // Words like "one", "tokyo", "guide" appear in dozens of slugs and cause
    // false matches (e.g. "one" → One Piece article in unrelated sentences).
    // Use Strategy 3 (keyword aliases) for targeted keyword linking instead.

    // Strategy 3: Keyword aliases
    const aliases = KEYWORD_ALIASES[article.slug] || [];
    for (const alias of aliases) {
      const aliasRegex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'gi');
      while ((match = aliasRegex.exec(content)) !== null) {
        if (!isAlreadyLinked(content, match.index, match[0].length)) {
          matches.push({
            text: match[0],
            slug: article.slug,
            position: match.index,
          });
        }
      }
    }
  });

  // Remove duplicates and sort by position (descending) to avoid index shifting
  const uniqueMatches = removeDuplicateMatches(matches);
  uniqueMatches.sort((a, b) => b.position - a.position);

  // Insert links up to maxLinks
  for (const match of uniqueMatches) {
    if (insertedLinks.size >= maxLinks) break;

    if (!insertedLinks.has(match.slug)) {
      const linkMarkdown = `[${match.text}](/articles/${match.slug})`;
      result =
        result.substring(0, match.position) +
        linkMarkdown +
        result.substring(match.position + match.text.length);

      insertedLinks.add(match.slug);
    }
  }

  return result;
}

/**
 * Check if text at position is already inside a markdown link
 */
function isAlreadyLinked(content: string, position: number, length: number): boolean {
  const contextStart = Math.max(0, position - 100);
  const contextEnd = Math.min(content.length, position + length + 100);
  const context = content.substring(contextStart, contextEnd);
  return /\[.*?\]\(.*?\)/.test(context);
}

/**
 * Remove duplicate slug matches, keeping the earliest occurrence
 */
function removeDuplicateMatches(matches: InternalLinkMatch[]): InternalLinkMatch[] {
  const seenSlugs = new Set<string>();
  const result: InternalLinkMatch[] = [];

  // Sort by position first to keep earliest
  const sorted = [...matches].sort((a, b) => a.position - b.position);

  for (const match of sorted) {
    if (!seenSlugs.has(match.slug)) {
      result.push(match);
      seenSlugs.add(match.slug);
    }
  }

  return result;
}

/**
 * Find related articles based on category and tags
 * @param article - The current article
 * @param allArticles - Array of all articles
 * @param limit - Number of related articles to return
 * @returns Array of related article slugs
 */
export function findRelatedArticleSlugs(
  article: ArticleMeta,
  allArticles: ArticleMeta[],
  limit: number = 5
): string[] {
  const relatedArticles: Array<{ slug: string; score: number }> = [];

  allArticles.forEach((otherArticle) => {
    if (otherArticle.slug === article.slug) return;

    let score = 0;

    // Same category: +10 points
    if (otherArticle.category === article.category) {
      score += 10;
    } else {
      // Cross-category bonus: ensures at least some cross-silo links
      score += 3;
    }

    // Shared tags: +5 points each
    const sharedTags = article.tags.filter((tag) =>
      otherArticle.tags.includes(tag)
    );
    score += sharedTags.length * 5;

    // Similar title keywords: +3 points each
    const articleTitleWords = article.title.toLowerCase().split(/\s+/);
    const sharedTitleWords = articleTitleWords.filter((word) =>
      otherArticle.title.toLowerCase().includes(word) &&
      word.length > 3 // Ignore short words
    );
    score += sharedTitleWords.length * 3;

    if (score > 0) {
      relatedArticles.push({ slug: otherArticle.slug, score });
    }
  });

  // Sort by score (descending) and return top results
  return relatedArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.slug);
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

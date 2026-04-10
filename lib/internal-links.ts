import { ArticleMeta } from './articles';

interface InternalLinkMatch {
  text: string;
  slug: string;
  position: number;
}

// Keyword aliases for improved matching
const KEYWORD_ALIASES: Record<string, string[]> = {
  'akihabara-guide': ['akihabara', 'electric town'],
  'shibuya-spots': ['shibuya', 'shibuya crossing'],
  'harajuku-fashion': ['harajuku', 'takeshita street'],
  'jr-pass': ['japan rail pass', 'jr pass', 'jrpass'],
  'esim-japan': ['esim', 'sim card', 'data plan'],
  'collab-cafe': ['collaboration cafe', 'collab cafe', 'themed cafe'],
  'pokemon': ['pokemon', 'pikachu'],
  'slam-dunk': ['slam dunk', 'inoue'],
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

    // Strategy 2: Slug-based matching - extract meaningful words from slug
    const slugWords = article.slug
      .split('-')
      .filter((word) => word.length > 2);

    for (const slugWord of slugWords) {
      const slugWordRegex = new RegExp(`\\b${escapeRegex(slugWord)}\\b`, 'gi');
      while ((match = slugWordRegex.exec(content)) !== null) {
        // Check if it's not already linked and slug word is relevant
        if (!isAlreadyLinked(content, match.index, match[0].length)) {
          matches.push({
            text: match[0],
            slug: article.slug,
            position: match.index,
          });
        }
      }
    }

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

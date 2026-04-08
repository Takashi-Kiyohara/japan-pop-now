import { ArticleMeta } from './articles';

interface InternalLinkMatch {
  text: string;
  slug: string;
  position: number;
}

/**
 * Automatically inserts internal links to related articles in markdown content
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

  // Find potential article mentions in the content
  availableArticles.forEach((article) => {
    // Match article titles (case-insensitive, word boundaries)
    const titleRegex = new RegExp(
      `\\b${escapeRegex(article.title)}\\b`,
      'gi'
    );

    let match;
    while ((match = titleRegex.exec(content)) !== null) {
      // Don't match if already linked
      const isAlreadyLinked = /\[.*?\]\(.*?\)/.test(
        content.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
      );

      if (!isAlreadyLinked) {
        matches.push({
          text: match[0],
          slug: article.slug,
          position: match.index,
        });
      }
    }
  });

  // Sort by position (descending) to avoid index shifting
  matches.sort((a, b) => b.position - a.position);

  // Insert links up to maxLinks
  for (const match of matches) {
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

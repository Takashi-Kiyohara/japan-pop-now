/**
 * Content Analysis & Optimization for Articles
 * Analyzes markdown content for reading time, word count, structure, and SEO completeness
 */

export interface ContentMetrics {
  wordCount: number;
  readingTimeMinutes: number;
  readingTimeISO: string; // ISO 8601 duration (e.g., "PT5M")
  headings: HeadingInfo[];
  images: number;
  links: number;
  lists: number;
  codeBlocks: number;
  paragraphs: number;
}

export interface HeadingInfo {
  level: number;
  text: string;
  id?: string;
}

export interface ContentScore {
  completeness: number; // 0-100
  readability: number; // 0-100
  structure: number; // 0-100
  seoReady: boolean;
  issues: string[];
  suggestions: string[];
}

/**
 * Calculate reading time from markdown content
 * Average reading speed: 200-250 words per minute
 * @param markdown - Raw markdown content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(
  markdown: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = countWords(markdown);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Convert reading time to ISO 8601 duration format
 * @param minutes - Number of minutes
 * @returns ISO 8601 duration string (e.g., "PT5M", "PT1H30M")
 */
export function readingTimeToISO8601(minutes: number): string {
  if (minutes < 1) return 'PT0M';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (mins > 0) result += `${mins}M`;

  return result;
}

/**
 * Count total words in markdown content
 * Excludes markdown syntax, code blocks, and HTML
 * @param markdown - Raw markdown content
 * @returns Word count
 */
export function countWords(markdown: string): number {
  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '');
  // Remove markdown links
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove markdown images
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Remove markdown syntax
  text = text.replace(/[#*_`~\-\[\]()]/g, ' ');
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Split on whitespace and filter empty strings
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Extract all headings from markdown
 * @param markdown - Raw markdown content
 * @returns Array of heading objects with level and text
 */
export function extractHeadings(markdown: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // Generate simple ID from text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      headings.push({ level, text, id });
    }
  });

  return headings;
}

/**
 * Count elements in markdown
 * @param markdown - Raw markdown content
 * @returns Count of images, links, lists, and code blocks
 */
export function countMarkdownElements(markdown: string): {
  images: number;
  links: number;
  lists: number;
  codeBlocks: number;
  paragraphs: number;
} {
  // Count images: ![alt](url)
  const images = (markdown.match(/!\[([^\]]*)\]\([^\)]+\)/g) || []).length;

  // Count links: [text](url)
  const links = (markdown.match(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/g) || [])
    .length;

  // Count lists (unordered and ordered)
  const listItems = (markdown.match(/^[\s]?[-*+]\s/m) || []).length;
  const orderedItems = (markdown.match(/^\s?\d+\.\s/m) || []).length;
  const lists = Math.max(1, Math.ceil((listItems + orderedItems) / 5)); // Group items into "lists"

  // Count code blocks
  const codeBlocks = (markdown.match(/```[\s\S]*?```/g) || []).length;

  // Count paragraphs (separated by double newlines)
  const paragraphs = markdown.split(/\n\n+/).filter((p) => p.trim().length > 0)
    .length;

  return { images, links, lists, codeBlocks, paragraphs };
}

/**
 * Analyze overall content quality and SEO readiness
 * @param markdown - Raw markdown content
 * @param title - Article title
 * @param description - Article description
 * @returns ContentScore object with completeness, readability, and suggestions
 */
export function analyzeContent(
  markdown: string,
  title: string,
  description: string
): ContentScore {
  const wordCount = countWords(markdown);
  const headings = extractHeadings(markdown);
  const elements = countMarkdownElements(markdown);
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Scoring criteria
  let completenessScore = 50;
  let readabilityScore = 50;
  let structureScore = 50;

  // Word count analysis (target: 1000-3000 words)
  if (wordCount < 500) {
    issues.push('Content is too short (< 500 words)');
    completenessScore -= 20;
    suggestions.push('Aim for at least 1000 words of quality content');
  } else if (wordCount >= 1000 && wordCount <= 3000) {
    completenessScore += 20;
  } else if (wordCount > 3000) {
    completenessScore += 10; // Bonus but not critical
  }

  // Title length (target: 50-60 characters)
  if (title.length < 30) {
    suggestions.push('Title might be too short for SEO');
  } else if (title.length > 70) {
    suggestions.push('Title might be truncated in search results');
  }

  // Description length (target: 150-160 characters)
  if (description.length < 120) {
    issues.push('Meta description is too short');
  } else if (description.length > 160) {
    suggestions.push('Meta description might be truncated');
  }

  // Heading structure (should have at least 3 H2 headings)
  const h2Count = headings.filter((h) => h.level === 2).length;
  if (h2Count < 2) {
    issues.push('Missing main section headings (H2)');
    structureScore -= 15;
  } else if (h2Count >= 3) {
    structureScore += 15;
  }

  // Check for H1
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    suggestions.push('Consider adding an H1 heading');
  }

  // Images (target: at least 1-2 images)
  if (elements.images === 0) {
    issues.push('No images in content');
    completenessScore -= 10;
  } else if (elements.images >= 2) {
    completenessScore += 10;
  }

  // Internal links (target: 2+ internal links)
  if (elements.links === 0) {
    suggestions.push('Add internal links to related articles');
  } else if (elements.links >= 3) {
    readabilityScore += 10;
  }

  // Lists (target: at least 1 list)
  if (elements.lists === 0) {
    suggestions.push('Consider adding lists for better readability');
  } else {
    readabilityScore += 10;
  }

  // Paragraphs (good content has varied paragraph length)
  if (elements.paragraphs < 5) {
    issues.push('Content needs better paragraph structure');
    readabilityScore -= 15;
  } else if (elements.paragraphs >= 10) {
    readabilityScore += 10;
  }

  // Normalize scores to 0-100
  const completeness = Math.max(0, Math.min(100, completenessScore));
  const readability = Math.max(0, Math.min(100, readabilityScore));
  const structure = Math.max(0, Math.min(100, structureScore));

  const seoReady = issues.length === 0 && completeness >= 70;

  return {
    completeness,
    readability,
    structure,
    seoReady,
    issues,
    suggestions,
  };
}

/**
 * Get comprehensive metrics for an article
 * @param markdown - Raw markdown content
 * @param wordCount - Optional pre-calculated word count
 * @returns ContentMetrics object
 */
export function getContentMetrics(markdown: string, wordCount?: number): ContentMetrics {
  const wc = wordCount ?? countWords(markdown);
  const readingTime = calculateReadingTime(markdown);
  const headings = extractHeadings(markdown);
  const elements = countMarkdownElements(markdown);

  return {
    wordCount: wc,
    readingTimeMinutes: readingTime,
    readingTimeISO: readingTimeToISO8601(readingTime),
    headings,
    images: elements.images,
    links: elements.links,
    lists: elements.lists,
    codeBlocks: elements.codeBlocks,
    paragraphs: elements.paragraphs,
  };
}

/**
 * Generate SEO-optimized reading time text
 * @param minutes - Reading time in minutes
 * @returns Formatted text (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Check if content structure follows best practices
 * @param markdown - Raw markdown content
 * @returns Validation report
 */
export function validateContentStructure(markdown: string): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const headings = extractHeadings(markdown);
  const elements = countMarkdownElements(markdown);
  const wordCount = countWords(markdown);

  // Check heading hierarchy
  if (headings.length > 0) {
    const firstHeading = headings[0];
    if (firstHeading.level !== 1 && firstHeading.level !== 2) {
      warnings.push('First heading should be H1 or H2');
    }

    // Check for proper hierarchy
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currLevel = headings[i].level;
      if (currLevel > prevLevel + 1) {
        warnings.push(
          `Heading hierarchy jump: H${prevLevel} to H${currLevel}`
        );
      }
    }
  }

  // Check word count
  if (wordCount < 300) {
    warnings.push('Content is very short');
  }

  // Recommendations
  if (elements.images === 0) {
    recommendations.push('Add at least one featured image');
  }
  if (elements.links < 2) {
    recommendations.push('Add internal links to related content');
  }
  if (headings.length < 3) {
    recommendations.push('Add more section headings for better structure');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations,
  };
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(
  markdown: string
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];

  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Add IDs to markdown headings for anchor linking
 */
export function addHeadingIds(markdown: string): string {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return markdown.replace(headingRegex, (match, hashes, text) => {
    const id = slugify(text.trim());
    return `${hashes} ${text.trim()} {#${id}}`;
  });
}

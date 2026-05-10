/**
 * FAQ Schema Generator for JSON-LD structured data
 * Supports both manual FAQ creation and auto-extraction from markdown content
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

/**
 * Generate FAQ Schema (FAQPage) from an array of FAQ items
 * This creates JSON-LD structured data for Google Rich Results
 * @param faqs - Array of {question, answer} objects
 * @returns JSON-LD FAQPage schema
 */
export function generateFAQSchema(faqs: FAQItem[]): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdown(faq.answer),
      },
    })),
  };
}

/**
 * Extract FAQ items from markdown content
 * Looks for ## Level 2 headings as questions and the first paragraph as the answer
 * @param markdown - Raw markdown content
 * @returns Array of FAQItem objects
 */
export function extractFAQFromContent(markdown: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Split by level 2 headings (##)
  const sections = markdown.split(/^## /m);

  // First section is usually intro, so skip it
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');

    if (lines.length === 0) continue;

    // First line is the question (heading text)
    const question = lines[0].trim();

    // Find the first non-empty paragraph
    let answer = '';
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      // Stop at next heading. Break on true list items (- item, * item with
      // trailing space) but NOT on **bold** paragraph leads that share the
      // '*' prefix.
      if (line.startsWith('#') || /^[-*]\s/.test(line)) {
        break;
      }
      if (line.length > 0) {
        answer += line + ' ';
      }
      // Take just the first paragraph
      if (answer.length > 100 && line.endsWith('.')) {
        break;
      }
    }

    if (question && answer) {
      faqs.push({
        question: question.trim(),
        answer: answer.trim(),
      });
    }
  }

  return faqs;
}

/**
 * Extract heading-based Q&A from markdown
 * Alternative method: uses H2 headings as questions, next paragraph as answer
 * More lenient than extractFAQFromContent
 * @param markdown - Raw markdown content
 * @returns Array of FAQItem objects
 */
// R8-K (2026-05-10): exclude scaffolding H2s (FAQ wrapper, Related/More/Image
// sections, Table of Contents, etc.) from Q-extraction. These are container
// headings whose body is bullets/links, not prose, so the prior implementation
// produced empty acceptedAnswer entries that broke Google Rich Results Test.
const FAQ_QUESTION_DENYLIST = [
  /^FAQ:?\s/i, // "FAQ: Frequently Asked Questions"
  /^Frequently Asked Questions/i,
  /^More\s/i, // "More Collab Cafe Guides"
  /^Related\s/i, // "Related Articles", "Related Resources"
  /^Image Credits?$/i,
  /^Photo Credits?$/i,
  /^Table of Contents$/i,
  /^See also/i,
  /^Sources?$/i,
  /^References?$/i,
  /^Sources and (further reading|further info)/i,
  /^Explore by\s/i, // "Explore by Area"
  /^Footnotes?$/i,
];

export function extractQAFromHeadings(markdown: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  const lines = markdown.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for level 2 or 3 headings
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const question = line.replace(/^#{2,3}\s*/, '').trim();
      // Skip scaffolding H2/H3 (FAQ wrapper, Related/More, Image Credits, etc.)
      if (FAQ_QUESTION_DENYLIST.some((re) => re.test(question))) {
        i++;
        continue;
      }

      // Standard markdown puts a blank line between a heading and the
      // paragraph that follows. The original logic broke out of the loop
      // the moment it hit that blank line, so the answer was always empty
      // and the whole FAQ array came back length 0.
      //
      // Fix: skip blank lines immediately after the heading to find the
      // first paragraph, then collect it until the next blank or heading.
      let answer = '';
      i++;
      while (i < lines.length && !lines[i].trim()) {
        i++;
      }
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (!nextLine || nextLine.startsWith('#')) {
          break;
        }
        // Skip list items (- item, * item with trailing space) and code
        // fences (```). Do NOT skip paragraphs that open with **bold** or
        // *italic* — those share the '*' prefix but are prose, not bullets.
        const isBullet = /^[-*]\s/.test(nextLine);
        const isCodeFence = nextLine.startsWith('```');
        if (!isBullet && !isCodeFence) {
          answer += nextLine + ' ';
        }
        i++;
      }

      if (question && answer.trim()) {
        faqs.push({
          question: question.trim(),
          answer: answer.trim(),
        });
      }
      continue;
    }

    i++;
  }

  return faqs;
}

/**
 * Remove markdown formatting from text
 * Strips **bold**, *italic*, [links](url), code blocks, etc.
 * @param text - Markdown text
 * @returns Plain text
 */
export function stripMarkdown(text: string): string {
  return (
    text
      // Remove links: [text](url) -> text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remove bold: **text** -> text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // Remove italic: *text* or _text_ -> text
      .replace(/[*_]([^*_]+)[*_]/g, '$1')
      // Remove inline code: `text` -> text
      .replace(/`([^`]+)`/g, '$1')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Validate FAQ items for common issues
 * @param faqs - Array of FAQ items to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateFAQ(faqs: FAQItem[]): string[] {
  const errors: string[] = [];

  if (faqs.length === 0) {
    errors.push('FAQ must have at least one item');
  }

  if (faqs.length > 100) {
    errors.push('FAQ should not exceed 100 items for best performance');
  }

  faqs.forEach((faq, index) => {
    if (!faq.question || faq.question.trim().length === 0) {
      errors.push(`FAQ item ${index + 1}: Question is empty`);
    }
    if (!faq.answer || faq.answer.trim().length === 0) {
      errors.push(`FAQ item ${index + 1}: Answer is empty`);
    }
    if (faq.question && faq.question.length > 500) {
      errors.push(`FAQ item ${index + 1}: Question exceeds 500 characters`);
    }
    if (faq.answer && faq.answer.length > 5000) {
      errors.push(`FAQ item ${index + 1}: Answer exceeds 5000 characters`);
    }
  });

  return errors;
}

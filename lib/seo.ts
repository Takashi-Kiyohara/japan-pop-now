import { ArticleMeta } from './articles';

export const SITE_URL = 'https://japan-pop-now.com';
export const SITE_NAME = 'Japan Pop Now';
export const DEFAULT_DESCRIPTION =
  "Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate complete metadata for an article page
 */
export function generateArticleMetadata(article: ArticleMeta, slug: string) {
  const canonicalUrl = `${SITE_URL}/articles/${slug}`;

  return {
    title: article.title,
    description: article.description || article.excerpt.slice(0, 155),
    canonical: canonicalUrl,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article' as const,
      url: canonicalUrl,
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage,
              width: 1200,
              height: 630,
              alt: article.featuredImageAlt,
            },
          ]
        : [
            {
              url: DEFAULT_OG_IMAGE,
              width: 1200,
              height: 630,
              alt: SITE_NAME,
            },
          ],
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: article.title,
      description: article.description,
      creator: '@japanpopnow',
      image: article.featuredImage || DEFAULT_OG_IMAGE,
    },
  };
}

/**
 * Generate breadcrumb structured data items
 */
export function generateBreadcrumbs(
  items: Array<{ name: string; url?: string }>
) {
  return items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: item.url,
  }));
}

/**
 * Generate breadcrumb schema for article page
 */
export function generateArticleBreadcrumbs(
  articleTitle: string,
  categorySlug: string,
  categoryLabel: string
) {
  return generateBreadcrumbs([
    { name: 'Home', url: SITE_URL },
    { name: categoryLabel, url: `${SITE_URL}/category/${categorySlug}` },
    { name: articleTitle, url: undefined }, // Current page
  ]);
}

/**
 * Generate breadcrumb schema for category page
 */
export function generateCategoryBreadcrumbs(categoryLabel: string) {
  return generateBreadcrumbs([
    { name: 'Home', url: SITE_URL },
    { name: categoryLabel, url: undefined }, // Current page
  ]);
}

/**
 * Format URL for canonical links
 */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Generate structured data for FAQ section
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate how-to schema for guides
 */
export interface HowToStep {
  name: string;
  description: string;
  image?: string;
}

export function generateHowToSchema(
  title: string,
  description: string,
  steps: HowToStep[],
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image: image || DEFAULT_OG_IMAGE,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.description,
      image: step.image,
    })),
  };
}

/**
 * Generate person schema for author
 */
export function generatePersonSchema(
  name: string,
  url?: string,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: url || `${SITE_URL}/about`,
    image,
  };
}

/**
 * Generate local business schema (for Japan Pop Now as a media brand)
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    sameAs: ['https://twitter.com/japanpopnow'],
    image: DEFAULT_OG_IMAGE,
  };
}

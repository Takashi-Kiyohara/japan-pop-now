import { Article } from './articles'
import { AUTHOR, AUTHOR_SAME_AS } from './author'
import { getSiteUrl } from './url'

const SITE_URL = getSiteUrl()
const SITE_NAME = 'Japan Pop Now'
const LOGO_URL = `${SITE_URL}/logo.png`

export interface ArticleSchemaOptions {
  wordCount?: number;
  readingTime?: string; // ISO 8601 duration (e.g., "PT5M")
  about?: string[];
  mentions?: string[];
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Your ultimate guide to Japan\'s anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
    sameAs: [...AUTHOR_SAME_AS],
  }
}

function absolutize(path: string): string {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function getArticleSchema(article: Article, url: string, options?: ArticleSchemaOptions) {
  // R13-D1 (2026-05-14): conditional NewsArticle vs BlogPosting.
  // NewsArticle is intended for time-sensitive editorial with a clear
  // expiry signal (validUntil). Evergreen content fails Google Rich Results
  // when typed as NewsArticle without dateCreated/expiry. We type:
  //   - cafes/experiences WITH validUntil -> NewsArticle (event-driven)
  //   - everything else                   -> BlogPosting (evergreen safe)
  const isTimeSensitive =
    (article.category === 'cafes' || article.category === 'experiences') &&
    typeof article.validUntil === 'string' &&
    article.validUntil.length > 0
  const articleType = isTimeSensitive ? 'NewsArticle' : 'BlogPosting'

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: article.title,
    description: article.description,
    image: article.featuredImage ? absolutize(article.featuredImage) : LOGO_URL,
    datePublished: article.date,
    dateModified: article.lastUpdated || article.date,
    // R13-D2 (2026-05-14): pass includeContext=false so nested Person schema
    // doesn't emit a redundant inner @context. JSON-LD context only needs
    // to appear on the outermost graph node.
    author: getAuthorSchema(undefined, undefined, undefined, false),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  // Add optional enhanced properties
  if (options?.wordCount) {
    schema.wordCount = options.wordCount
  }

  if (options?.readingTime) {
    schema.timeRequired = options.readingTime
  }

  if (options?.about && options.about.length > 0) {
    schema.about = options.about.map((topic) => ({
      '@type': 'Thing',
      name: topic,
    }))
  }

  if (options?.mentions && options.mentions.length > 0) {
    schema.mentions = options.mentions.map((entity) => ({
      '@type': 'Thing',
      name: entity,
    }))
  }

  return schema
}

export function getArticleSchemaWithSpeakable(
  article: Article,
  url: string,
  options?: ArticleSchemaOptions
) {
  const schema = getArticleSchema(article, url, options)

  // Add speakable property for voice search optimization
  schema.speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: [
      'article h1',
      'article header',
      '.prose h2',
      '.prose p:first-of-type',
    ],
  }

  return schema
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Event schema for collab cafe / event articles
 */
export function getEventSchema(
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  location: { name: string; address: string },
  url: string,
  image?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'JP',
        addressLocality: location.address,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url,
    ...(image ? { image: absolutize(image) } : {}),
  }
}

/**
 * Generate TouristAttraction schema for pilgrimage/area guide articles
 */
export function getTouristAttractionSchema(
  name: string,
  description: string,
  address: string,
  url: string,
  image?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressLocality: address,
    },
    url,
    isAccessibleForFree: true,
    ...(image ? { image: absolutize(image) } : {}),
  }
}

/**
 * Generate Author schema for the site's editorial voice.
 * Driven by lib/author.ts (single source of truth). Overrides exist for tests
 * and the rare authored-by-guest case; default path uses the SSoT.
 */
export function getAuthorSchema(
  name: string = AUTHOR.name,
  url?: string,
  image?: string,
  includeContext: boolean = true
) {
  // R13-D2 (2026-05-14): includeContext defaults true for standalone Person
  // schema injection. Callers nesting Person inside Article/Organization should
  // pass false to avoid redundant inner @context emission.
  const base: Record<string, unknown> = {
    '@type': 'Person',
    name,
    url: url || `${SITE_URL}${AUTHOR.profilePath}`,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.tagline,
    image: image || `${SITE_URL}${AUTHOR.avatar}`,
    sameAs: [...AUTHOR_SAME_AS],
    knowsAbout: [...AUTHOR.knowsAbout],
  }
  return includeContext
    ? { '@context': 'https://schema.org', ...base }
    : base
}

/**
 * Generate HowTo schema for how-to and guide articles
 */
export function getHowToSchema(
  title: string,
  description: string,
  steps: { name: string; text?: string }[],
  url: string,
  image?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    url,
    ...(image ? { image: absolutize(image) } : {}),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      ...(step.text ? { text: step.text } : {}),
    })),
  }
}

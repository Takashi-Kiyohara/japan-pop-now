import { Article } from './articles'
import { getSiteUrl } from './url'

const SITE_URL = getSiteUrl()
const SITE_NAME = 'Japan Pop Now'
const LOGO_URL = `${SITE_URL}/logo.png`

export interface ArticleSchemaOptions {
  wordCount?: number;
  readingTime?: string; // ISO 8601 duration (e.g., "PT5M")
  about?: string[];
  mentions?: string[];
  isPartOf?: { name: string; url: string }; // Feature series hub
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
    sameAs: [
      'https://www.instagram.com/pop_now_jp/',
      'https://www.tiktok.com/@pop_now_jp',
    ],
  }
}

export function getArticleSchema(article: Article, url: string, options?: ArticleSchemaOptions) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.featuredImage || LOGO_URL,
    datePublished: article.date,
    dateModified: article.date,
    author: getAuthorSchema(),
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

  if (options?.isPartOf) {
    schema.isPartOf = {
      '@type': 'CreativeWorkSeries',
      name: options.isPartOf.name,
      url: options.isPartOf.url,
    }
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
    ...(image ? { image } : {}),
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
    ...(image ? { image } : {}),
  }
}

/**
 * Generate Author schema for editorial team
 */
export function getAuthorSchema(
  name: string = 'Japan Pop Now',
  url?: string,
  image?: string
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: url || `${SITE_URL}/about`,
    sameAs: [
      'https://www.instagram.com/pop_now_jp/',
      'https://www.tiktok.com/@pop_now_jp',
    ],
  }

  if (image) {
    schema.image = image
  }

  // Add expertise topics
  schema.knowsAbout = [
    'Anime',
    'Manga',
    'Japanese Pop Culture',
    'Travel in Japan',
    'Tourism',
    'Anime Locations',
  ]

  return schema
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
    ...(image ? { image } : {}),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      ...(step.text ? { text: step.text } : {}),
    })),
  }
}

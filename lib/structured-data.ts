import { Article } from './articles'

const SITE_URL = 'https://japan-pop-now.com'
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
    sameAs: [
      'https://twitter.com/japanpopnow',
    ],
  }
}

export function getArticleSchema(article: Article, url: string, options?: ArticleSchemaOptions) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.featuredImage || LOGO_URL,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${SITE_URL}/about`,
    },
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
    xPath: [
      '/html/head/title',
      '/html/body/article/h1[1]',
      '/html/body/article/p[1]',
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
 * Generate Author schema for editorial team
 */
export function getAuthorSchema(
  name: string = 'Japan Pop Now',
  url?: string,
  image?: string
) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: url || `${SITE_URL}/about`,
    sameAs: [
      'https://twitter.com/japanpopnow',
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

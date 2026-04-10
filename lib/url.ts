const SITE_URL = 'https://japan-pop-now.com'

export function articleUrl(slug: string): string {
  return `${SITE_URL}/articles/${slug}`
}

export function categoryUrl(slug: string): string {
  return `${SITE_URL}/category/${slug}`
}

export function guideUrl(topic: string): string {
  return `${SITE_URL}/guides/${topic}`
}

export function tagUrl(tag: string): string {
  return `${SITE_URL}/tags/${tag}`
}

export function cafesHubUrl(): string {
  return `${SITE_URL}/cafes`
}

export function cafeUrl(slug: string): string {
  return `${SITE_URL}/cafes/${slug}`
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}

export function getSiteUrl(): string {
  return SITE_URL
}

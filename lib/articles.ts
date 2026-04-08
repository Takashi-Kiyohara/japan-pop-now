import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { generateAutoTags } from './auto-tags'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

export type Article = {
  slug: string
  title: string
  description: string
  date: string
  lastUpdated?: string
  category: string
  tags: string[]
  featuredImage: string
  featuredImageAlt: string
  author: string
  content: string
  excerpt: string
  relatedSlugs?: string[]
}

export type ArticleMeta = Omit<Article, 'content'>

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const title = data.title || '';
  const category = data.category || 'general';
  const rawTags = data.tags || [];
  // Auto-generate tags if frontmatter tags are empty
  const tags = rawTags.length > 0 ? rawTags : generateAutoTags(slug, title, category);

  return {
    slug,
    title,
    description: data.description || '',
    date: data.date || '',
    lastUpdated: data.lastUpdated || '',
    category,
    tags,
    featuredImage: data.featuredImage || '',
    featuredImageAlt: data.featuredImageAlt || title || '',
    author: data.author || 'Japan Pop Now',
    content,
    excerpt: data.excerpt || content.slice(0, 160).replace(/\n/g, ' '),
    relatedSlugs: data.relatedSlugs || [],
  }
}

export function getAllArticles(): ArticleMeta[] {
  const slugs = getAllArticleSlugs()
  return slugs
    .map((slug) => {
      const a = getArticleBySlug(slug)
      if (!a) return null
      const { content, ...meta } = a
      return meta
    })
    .filter(Boolean)
    .sort((a, b) => (a!.date > b!.date ? -1 : 1)) as ArticleMeta[]
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  )
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  )
}

export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const article = getArticleBySlug(slug)
  if (!article) return []

  // First use explicitly defined related slugs
  if (article.relatedSlugs && article.relatedSlugs.length > 0) {
    return article.relatedSlugs
      .map((s) => {
        const a = getArticleBySlug(s)
        if (!a) return null
        const { content, ...meta } = a
        return meta
      })
      .filter(Boolean)
      .slice(0, limit) as ArticleMeta[]
  }

  // Fallback: same category
  return getArticlesByCategory(article.category)
    .filter((a) => a.slug !== slug)
    .slice(0, limit)
}

// Re-export from categories.ts for backward compatibility (server-side imports)
export { CATEGORIES } from './categories'

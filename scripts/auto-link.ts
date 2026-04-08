#!/usr/bin/env node

/**
 * Internal Links Auto-Inserter
 * Intelligently adds internal links between related articles
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface ArticleMetadata {
  slug: string
  title: string
  keywords: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

function extractKeywords(title: string, tags: string[]): string[] {
  const keywords = [
    ...title.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
    ...tags.map((t) => t.toLowerCase()),
  ]
  return [...new Set(keywords)] // Remove duplicates
}

function buildArticleIndex(): Map<string, ArticleMetadata> {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return new Map()
  }

  const index = new Map<string, ArticleMetadata>()
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'))

  files.forEach((file) => {
    const slug = file.replace('.md', '')
    const filePath = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    const keywords = extractKeywords(data.title || '', data.tags || [])

    index.set(slug, {
      slug,
      title: data.title || '',
      keywords,
    })
  })

  return index
}

function findLinkOpportunities(
  content: string,
  slug: string,
  index: Map<string, ArticleMetadata>
): Array<{ keyword: string; targetSlug: string; targetTitle: string }> {
  const opportunities: Array<{
    keyword: string
    targetSlug: string
    targetTitle: string
  }> = []

  // Get existing links
  const existingLinks = new Set(
    (content.match(/\[([^\]]+)\]\(\/([a-z0-9\-]+)\)/g) || []).map((link) => {
      const match = link.match(/\]\(\/([a-z0-9\-]+)\)/)
      return match?.[1]
    })
  )

  // Find opportunities
  index.forEach((article, targetSlug) => {
    if (targetSlug === slug || existingLinks.has(targetSlug)) {
      return
    }

    for (const keyword of article.keywords) {
      // Check if keyword appears in content (case-insensitive, word boundary)
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      if (regex.test(content)) {
        opportunities.push({
          keyword,
          targetSlug,
          targetTitle: article.title,
        })
        break // Only one link per article
      }
    }
  })

  return opportunities.slice(0, 5) // Max 5 links per article
}

function insertLinks(
  content: string,
  opportunities: Array<{ keyword: string; targetSlug: string; targetTitle: string }>
): string {
  let result = content
  const processed = new Set<string>()

  // Sort by keyword length (longest first for best match)
  opportunities.sort((a, b) => b.keyword.length - a.keyword.length)

  for (const opp of opportunities) {
    if (processed.has(opp.targetSlug)) continue

    // Find first occurrence of keyword not already linked
    const regex = new RegExp(`\\b(${opp.keyword})\\b`, 'i')
    const match = result.match(regex)

    if (match) {
      const index = result.indexOf(match[0])
      const before = result.substring(0, index)
      const keyword = match[1]
      const after = result.substring(index + keyword.length)

      // Check if already part of a link
      const beforeHasLink = before.includes('[') && !before.includes(']')
      if (!beforeHasLink) {
        result = `${before}[${keyword}](/${opp.targetSlug})${after}`
        processed.add(opp.targetSlug)
      }
    }
  }

  return result
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const apply = args.includes('--apply')

  if (!dryRun && !apply) {
    console.log('\nUsage: npx tsx scripts/auto-link.ts [--dry-run | --apply]\n')
    console.log('  --dry-run  Show what would change without writing')
    console.log('  --apply    Make changes to files\n')
    process.exit(0)
  }

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`Articles directory not found: ${ARTICLES_DIR}`)
    process.exit(1)
  }

  const index = buildArticleIndex()
  if (index.size === 0) {
    console.log('No articles found')
    return
  }

  console.log(`\n📎 Internal Links Auto-Inserter`)
  console.log(`   Index: ${index.size} articles\n`)

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'))
  let totalLinksAdded = 0

  for (const file of files) {
    const slug = file.replace('.md', '')
    const filePath = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    const opportunities = findLinkOpportunities(content, slug, index)

    if (opportunities.length === 0) {
      continue
    }

    const updated = insertLinks(content, opportunities)
    const newContent = `---\n${Object.entries(data)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: ${JSON.stringify(v)}`
        }
        if (typeof v === 'string' && v.includes('\n')) {
          return `${k}: |\n  ${v.split('\n').join('\n  ')}`
        }
        return `${k}: ${JSON.stringify(v)}`
      })
      .join('\n')}\n---\n${updated}`

    console.log(`${file}:`)
    opportunities.forEach((opp) => {
      console.log(`  + [${opp.keyword}](/${opp.targetSlug})`)
    })
    console.log('')

    if (apply) {
      fs.writeFileSync(filePath, newContent)
      totalLinksAdded += opportunities.length
    }
  }

  if (dryRun) {
    console.log('🏃 Dry run complete. Use --apply to make changes.\n')
  } else if (apply) {
    console.log(`✅ Added ${totalLinksAdded} internal links!\n`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

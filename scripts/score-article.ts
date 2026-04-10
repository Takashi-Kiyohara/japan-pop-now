#!/usr/bin/env node

/**
 * Article Quality Scorer
 * Scores articles 0-100 based on multiple content quality criteria
 */

import fs from 'fs'
import matter from 'gray-matter'

interface ScoreBreakdown {
  wordCount: number
  headingStructure: number
  internalLinks: number
  externalLinks: number
  images: number
  faqSection: number
  metaDescription: number
  titleQuality: number
  readability: number
  total: number
}

function countWords(text: string): number {
  let content = text.replace(/```[\s\S]*?```/g, '')
  content = content.replace(/`[^`]+`/g, '')
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
  content = content.replace(/<[^>]+>/g, '')
  content = content.replace(/[#*_`~\-\[\]()]/g, ' ')
  content = content.replace(/\s+/g, ' ').trim()

  return content.split(/\s+/).filter((word) => word.length > 0).length
}

function scoreWordCount(count: number): number {
  // 0-15 points: 1500+ words = 15 points
  if (count >= 1500) return 15
  if (count >= 1000) return 12
  if (count >= 750) return 10
  if (count >= 500) return 5
  return 0
}

function scoreHeadingStructure(content: string): number {
  const lines = content.split('\n')
  const headings = lines.filter((line) => /^#{1,6}\s+/.test(line))
  const h2Count = lines.filter((line) => /^##\s+/.test(line)).length
  const h3Count = lines.filter((line) => /^###\s+/.test(line)).length

  // 0-15 points: proper h2/h3 hierarchy
  if (h2Count >= 4 && h3Count >= 3) return 15
  if (h2Count >= 3 && h3Count >= 2) return 12
  if (h2Count >= 2) return 8
  if (headings.length > 0) return 5
  return 0
}

function scoreInternalLinks(content: string): number {
  // Count relative links (internal)
  const relativeLinks = (
    content.match(/\[([^\]]+)\]\(\/[a-z0-9\-]+(?:\/[a-z0-9\-]+)*\)/g) || []
  ).length

  // 0-10 points: 3+ internal links = 10
  if (relativeLinks >= 5) return 10
  if (relativeLinks >= 3) return 8
  if (relativeLinks >= 2) return 5
  if (relativeLinks >= 1) return 2
  return 0
}

function scoreExternalLinks(content: string): number {
  // Count external links
  const externalLinks = (content.match(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/g) || []).length

  // 0-5 points: 2+ external links = 5
  if (externalLinks >= 3) return 5
  if (externalLinks >= 2) return 4
  if (externalLinks >= 1) return 2
  return 0
}

function scoreImages(content: string): number {
  const images = (content.match(/!\[([^\]]*)\]\([^\)]+\)/g) || []).length

  // 0-10 points: 3+ images = 10
  if (images >= 5) return 10
  if (images >= 3) return 8
  if (images >= 2) return 5
  if (images >= 1) return 2
  return 0
}

function scoreFaqSection(content: string): number {
  // 0-10 points: check for FAQ section
  const hasFaq = content.toLowerCase().includes('faq') || content.toLowerCase().includes('frequently asked')
  const faqQAs = (content.match(/^### .+\?$/m) || []).length

  if (hasFaq && faqQAs >= 3) return 10
  if (hasFaq && faqQAs >= 2) return 7
  if (hasFaq) return 5
  return 0
}

function scoreMetaDescription(description: string): number {
  // 0-10 points: 120-155 chars optimal
  const len = description.length

  if (len >= 120 && len <= 155) return 10
  if (len >= 110 && len <= 165) return 8
  if (len >= 100 && len <= 180) return 5
  if (len >= 80 && len <= 200) return 2
  return 0
}

function scoreTitleQuality(title: string): number {
  // 0-10 points: <60 chars, contains keywords
  let score = 0

  if (title.length < 60 && title.length > 20) score += 5
  else if (title.length <= 70 && title.length >= 30) score += 3

  // Check for power words and numbers (SEO boost)
  const powerWords = [
    'guide',
    'how to',
    'tips',
    'complete',
    'best',
    'ultimate',
    'essential',
    'must',
  ]
  if (powerWords.some((word) => title.toLowerCase().includes(word))) score += 3
  if (/\d{4}|\d+/.test(title)) score += 2

  return Math.min(10, score)
}

function scoreReadability(content: string): number {
  // 0-15 points: short paragraphs, varied sentence length
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0)
  const sentences = content.match(/[.!?]+/g) || []

  let score = 0

  // Good paragraph count (5-20 is ideal)
  if (paragraphs.length >= 10 && paragraphs.length <= 20) score += 5
  else if (paragraphs.length >= 5) score += 3

  // Average sentence length (15-25 words is good)
  const words = countWords(content)
  const avgSentenceLength = words / sentences.length
  if (avgSentenceLength >= 12 && avgSentenceLength <= 30) score += 5

  // Use of lists
  const lists = (content.match(/^[\s]*[-*+]\s/m) || []).length
  if (lists >= 5) score += 5
  else if (lists >= 1) score += 2

  return Math.min(15, score)
}

function scoreArticle(filePath: string): ScoreBreakdown {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const wordCount = countWords(content)

  const breakdown: ScoreBreakdown = {
    wordCount: scoreWordCount(wordCount),
    headingStructure: scoreHeadingStructure(content),
    internalLinks: scoreInternalLinks(content),
    externalLinks: scoreExternalLinks(content),
    images: scoreImages(content),
    faqSection: scoreFaqSection(content),
    metaDescription: scoreMetaDescription(data.description || ''),
    titleQuality: scoreTitleQuality(data.title || ''),
    readability: scoreReadability(content),
    total: 0,
  }

  breakdown.total = Math.round(
    breakdown.wordCount +
      breakdown.headingStructure +
      breakdown.internalLinks +
      breakdown.externalLinks +
      breakdown.images +
      breakdown.faqSection +
      breakdown.metaDescription +
      breakdown.titleQuality +
      breakdown.readability
  )

  return breakdown
}

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/score-article.ts <file-path>')
    console.error('Example: npx tsx scripts/score-article.ts content/articles/my-article.md')
    process.exit(1)
  }

  const filePath = args[0]
  const breakdown = scoreArticle(filePath)

  console.log(`\n📊 Article Quality Score: ${breakdown.total}/100\n`)

  console.log('Breakdown:')
  console.log(`  Word Count (0-15):        ${breakdown.wordCount} pts`)
  console.log(`  Heading Structure (0-15): ${breakdown.headingStructure} pts`)
  console.log(`  Internal Links (0-10):    ${breakdown.internalLinks} pts`)
  console.log(`  External Links (0-5):     ${breakdown.externalLinks} pts`)
  console.log(`  Images (0-10):            ${breakdown.images} pts`)
  console.log(`  FAQ Section (0-10):       ${breakdown.faqSection} pts`)
  console.log(`  Meta Description (0-10):  ${breakdown.metaDescription} pts`)
  console.log(`  Title Quality (0-10):     ${breakdown.titleQuality} pts`)
  console.log(`  Readability (0-15):       ${breakdown.readability} pts`)
  console.log(`  ─────────────────────────────`)
  console.log(`  TOTAL:                    ${breakdown.total}/100\n`)

  // Quality assessment
  if (breakdown.total >= 90) {
    console.log('✨ Excellent article! Ready for publication.')
  } else if (breakdown.total >= 75) {
    console.log('✓ Good article. Consider minor improvements.')
  } else if (breakdown.total >= 60) {
    console.log('⚠️  Article needs work. Review sections below 50%.')
  } else {
    console.log('❌ Article quality is low. Significant revisions needed.')
  }

  console.log(
    '\nJSON Output:',
    JSON.stringify(breakdown, null, 2)
  )
}

main()

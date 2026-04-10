#!/usr/bin/env node

/**
 * Article Frontmatter & Content Validation Script
 * Validates all articles in content/articles/ for proper structure
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface ValidationError {
  file: string
  type: 'error' | 'warning'
  message: string
}

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const VALID_CATEGORIES = ['collab-cafes', 'anime-pilgrimage', 'area-guides', 'travel-tips']
const MIN_WORD_COUNT = 500
const MIN_HEADINGS = 2

function countWords(text: string): number {
  // Remove frontmatter
  let content = text.split('---').slice(2).join('---')
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '')
  // Remove inline code
  content = content.replace(/`[^`]+`/g, '')
  // Remove markdown links
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  // Remove images
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, '')
  // Remove markdown syntax
  content = content.replace(/[#*_`~\-\[\]()]/g, ' ')
  // Remove extra whitespace
  content = content.replace(/\s+/g, ' ').trim()

  return content.split(/\s+/).filter((word) => word.length > 0).length
}

function extractHeadings(text: string): number {
  const lines = text.split('\n')
  return lines.filter((line) => /^#{1,6}\s+/.test(line)).length
}

function validateFrontmatter(data: Record<string, unknown>, file: string): ValidationError[] {
  const errors: ValidationError[] = []

  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push({ file, type: 'error', message: 'Missing or invalid title field' })
  } else if (data.title.length > 70) {
    errors.push({
      file,
      type: 'warning',
      message: `Title too long (${data.title.length} chars, max 70)`,
    })
  } else if (data.title.length < 20) {
    errors.push({
      file,
      type: 'warning',
      message: `Title too short (${data.title.length} chars, min 20)`,
    })
  }

  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.push({ file, type: 'error', message: 'Missing or invalid description field' })
  } else if (data.description.length > 160) {
    errors.push({
      file,
      type: 'warning',
      message: `Description too long (${data.description.length} chars, max 160)`,
    })
  } else if (data.description.length < 80) {
    errors.push({
      file,
      type: 'warning',
      message: `Description too short (${data.description.length} chars, min 80)`,
    })
  }

  // Date validation
  if (!data.date) {
    errors.push({ file, type: 'error', message: 'Missing date field' })
  } else if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(String(data.date))) {
    errors.push({
      file,
      type: 'error',
      message: `Invalid date format: ${data.date}. Use YYYY-MM-DD or ISO 8601.`,
    })
  }

  // Category validation
  if (!data.category) {
    errors.push({ file, type: 'error', message: 'Missing category field' })
  } else if (typeof data.category !== 'string' || !VALID_CATEGORIES.includes(data.category)) {
    errors.push({
      file,
      type: 'error',
      message: `Invalid category: ${String(data.category)}. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
    })
  }

  // Tags validation
  if (!Array.isArray(data.tags)) {
    errors.push({ file, type: 'warning', message: 'Tags should be an array' })
  }

  // Author validation
  if (!data.author || typeof data.author !== 'string') {
    errors.push({ file, type: 'warning', message: 'Missing or invalid author field' })
  }

  // Featured image validation
  if (!data.featuredImage || typeof data.featuredImage !== 'string') {
    errors.push({ file, type: 'warning', message: 'Missing or empty featuredImage field' })
  }

  return errors
}

function validateContent(raw: string, file: string): ValidationError[] {
  const errors: ValidationError[] = []

  // Extract content without frontmatter
  const content = raw.split('---').slice(2).join('---').trim()
  const wordCount = countWords(raw)
  const headingCount = extractHeadings(content)

  // Word count validation
  if (wordCount < MIN_WORD_COUNT) {
    errors.push({
      file,
      type: 'error',
      message: `Content too short: ${wordCount} words (min ${MIN_WORD_COUNT})`,
    })
  }

  // Heading structure validation
  if (headingCount < MIN_HEADINGS) {
    errors.push({
      file,
      type: 'error',
      message: `Not enough section headings: ${headingCount} found (min ${MIN_HEADINGS})`,
    })
  }

  // FAQ section check
  if (!content.includes('##') || !content.toLowerCase().includes('faq')) {
    errors.push({
      file,
      type: 'warning',
      message: 'Missing FAQ section (best practice)',
    })
  }

  return errors
}

function validateArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`Articles directory not found: ${ARTICLES_DIR}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()

  if (files.length === 0) {
    console.log('No articles found to validate')
    return
  }

  let allErrors: ValidationError[] = []

  files.forEach((file) => {
    const filePath = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    const frontmatterErrors = validateFrontmatter(data, file)
    const contentErrors = validateContent(raw, file)

    allErrors = allErrors.concat(frontmatterErrors, contentErrors)
  })

  // Separate errors and warnings
  const errors = allErrors.filter((e) => e.type === 'error')
  const warnings = allErrors.filter((e) => e.type === 'warning')

  // Display results
  console.log(`\n✓ Validated ${files.length} articles\n`)

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`)
    errors.forEach((e) => {
      console.log(`   ${e.file}: ${e.message}`)
    })
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`)
    warnings.forEach((w) => {
      console.log(`   ${w.file}: ${w.message}`)
    })
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✨ All articles pass validation!')
  }

  console.log('')

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1)
  }
}

validateArticles()

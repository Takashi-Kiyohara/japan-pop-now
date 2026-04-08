#!/usr/bin/env node

/**
 * Content Freshness Checker
 * Flags articles that need updates due to age or outdated information
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface FreshnessWarning {
  slug: string
  title: string
  date: string
  daysOld: number
  warnings: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const FRESHNESS_THRESHOLD = 90 // days
const CURRENT_YEAR = new Date().getFullYear()

function parseDate(dateString: string): Date {
  return new Date(dateString)
}

function daysBetween(date1: Date, date2: Date): number {
  const diff = date2.getTime() - date1.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function analyzeContent(
  content: string,
  publishDate: Date
): {
  hasYearReferences: boolean
  potentiallyOutdated: boolean
  issues: string[]
} {
  const issues: string[] = []
  let hasYearReferences = false
  let potentiallyOutdated = false
  const now = new Date()

  // Check for year references (e.g., "2025", "2024")
  const yearPattern = /\b(20\d{2})\b/g
  const yearMatches = content.match(yearPattern) || []

  if (yearMatches.length > 0) {
    hasYearReferences = true

    // Check if year is older than current
    const years = yearMatches.map((y) => parseInt(y))
    const oldYears = years.filter((y) => y < CURRENT_YEAR)

    if (oldYears.length > 0) {
      const uniqueYears = [...new Set(oldYears)].sort()
      issues.push(`References outdated year(s): ${uniqueYears.join(', ')}`)
      potentiallyOutdated = true
    }
  }

  // Check for season references
  const seasonReferences = content.match(/\b(spring|summer|autumn|fall|winter)\s+20\d{2}\b/gi)
  if (seasonReferences && seasonReferences.length > 0) {
    const now = new Date()
    // If article is from more than a year ago and mentions seasons, it's probably outdated
    if (daysBetween(publishDate, now) > 365) {
      issues.push(`Contains season-specific information (${seasonReferences[0]})`)
      potentiallyOutdated = true
    }
  }

  // Check for price information
  if (content.match(/\¥|\$|\€|price|cost|fee|free/gi)) {
    if (daysBetween(publishDate, now) > 180) {
      issues.push('Contains pricing information (may be outdated)')
      potentiallyOutdated = true
    }
  }

  // Check for event dates
  if (
    content.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/gi
    )
  ) {
    if (daysBetween(publishDate, now) > 90) {
      issues.push('Contains specific event dates (may be outdated)')
      potentiallyOutdated = true
    }
  }

  // Check for "current" or "latest" references
  if (content.match(/\b(current|latest|new|upcoming|next|this year)\b/gi)) {
    if (daysBetween(publishDate, now) > 180) {
      issues.push('Contains time-sensitive references ("current", "upcoming", etc.)')
      potentiallyOutdated = true
    }
  }

  // Check for operating hours or availability
  if (content.match(/hours?|open|closed|available|available|operation/gi)) {
    if (daysBetween(publishDate, now) > 90) {
      issues.push('May contain outdated hours or availability info')
      potentiallyOutdated = true
    }
  }

  return {
    hasYearReferences,
    potentiallyOutdated,
    issues,
  }
}

function checkFreshness() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`Articles directory not found: ${ARTICLES_DIR}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()

  if (files.length === 0) {
    console.log('No articles found')
    return
  }

  const now = new Date()
  const warnings: FreshnessWarning[] = []

  files.forEach((file) => {
    const slug = file.replace('.md', '')
    const filePath = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    const publishDate = parseDate(data.date)
    const daysOld = daysBetween(publishDate, now)
    const analysis = analyzeContent(content, publishDate)

    // Flag if old AND contains year references, or potentially outdated
    if ((daysOld > FRESHNESS_THRESHOLD && analysis.hasYearReferences) || analysis.potentiallyOutdated) {
      warnings.push({
        slug,
        title: data.title || 'Untitled',
        date: data.date,
        daysOld,
        warnings: [
          ...(daysOld > FRESHNESS_THRESHOLD ? [`Article is ${daysOld} days old`] : []),
          ...analysis.issues,
        ],
      })
    }
  })

  // Display results
  console.log(`\n🔄 Content Freshness Report`)
  console.log(`   Scanned: ${files.length} articles`)
  console.log(`   Threshold: ${FRESHNESS_THRESHOLD} days\n`)

  if (warnings.length === 0) {
    console.log('✅ All articles look fresh!\n')
  } else {
    console.log(`⚠️  ${warnings.length} article(s) may need updates:\n`)

    warnings.forEach((w) => {
      console.log(`📄 ${w.slug}`)
      console.log(`   Title: ${w.title}`)
      console.log(`   Published: ${w.date} (${w.daysOld} days ago)`)
      console.log(`   Issues:`)
      w.warnings.forEach((warning) => {
        console.log(`     - ${warning}`)
      })
      console.log('')
    })

    console.log(`📝 Suggested action: Review and update the ${warnings.length} flagged article(s).`)
    console.log('   Update publish date and check year/season/price references.\n')
  }
}

checkFreshness()

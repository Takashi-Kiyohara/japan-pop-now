#!/usr/bin/env node
/**
 * Generate SNS draft posts from MDX article files
 * Usage: node scripts/generate-sns-posts.mjs content/articles/slug.md
 * Output: creates files in sns-drafts/{slug}/
 *   - x-post.txt (280 chars max, with hashtags)
 *   - ig-caption.txt (2200 chars max, with hashtags)
 *   - ig-story-slides.txt (3 slides of text)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename, dirname } from 'path'

const articlePath = process.argv[2]
if (!articlePath) {
  console.error('Usage: node generate-sns-posts.mjs <article.md>')
  process.exit(1)
}

let content
try {
  content = readFileSync(articlePath, 'utf-8')
} catch (e) {
  console.error(`Error reading file: ${articlePath}`)
  console.error(e.message)
  process.exit(1)
}

// Extract frontmatter
const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
if (!fmMatch) {
  console.error('Error: No frontmatter found (must start with ---)')
  process.exit(1)
}

const frontmatter = fmMatch[1]
const body = content.replace(/^---[\s\S]*?---\n/, '')

// Parse key fields from frontmatter (handle both quoted and unquoted values)
function getFmValue(key) {
  const match = frontmatter.match(
    new RegExp(`^${key}:\\s*(?:"([^"]*)"|(\\S.*?)(?=\\n|$))`, 'm')
  )
  return (match ? match[1] || match[2] : '').trim()
}

function getFmArray(key) {
  const match = frontmatter.match(
    new RegExp(`^${key}:\\s*\\[([^\\]]+)\\]`, 'm')
  )
  if (!match) return []
  return match[1]
    .split(',')
    .map(item => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

const title = getFmValue('title')
const slug = getFmValue('slug')
const excerpt = getFmValue('excerpt') || getFmValue('description')
const category = getFmValue('category')
const tags = getFmArray('tags')

if (!title) {
  console.error('Error: title not found in frontmatter')
  process.exit(1)
}

if (!slug) {
  console.error('Error: slug not found in frontmatter')
  process.exit(1)
}

if (!excerpt) {
  console.error('Error: excerpt or description not found in frontmatter')
  process.exit(1)
}

// Generate hashtags from tags (take first 5, remove spaces/dashes)
const tagHashtags = tags
  .slice(0, 5)
  .map(t => '#' + t.replace(/[\s-]/g, ''))
  .join(' ')

const brandHashtags = '#japantravel #anime #tokyo #japanpopnow'

// Helper: truncate text to max length while preserving whole words
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text
  const truncated = text.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > maxLen * 0.8 ? truncated.slice(0, lastSpace) : truncated
}

// X Post (280 chars max)
const xExcerpt = truncate(excerpt, 150)
const xBase = `${title}\n\n${xExcerpt}...\n\nhttps://www.japan-pop-now.com/${slug}/\n\n${tagHashtags} ${brandHashtags}`
const xPost = xBase.slice(0, 280)

// IG Caption (2200 chars max)
const igBase = `${title}\n\n${excerpt}\n\nFull guide with prices, access info, and insider tips:\nhttps://www.japan-pop-now.com/${slug}/\n\n${tagHashtags} ${brandHashtags} #japantrip #otaku #animetravel`
const igCaption = truncate(igBase, 2200)

// IG Story Slides (3 slides, separated by ---)
const h2s = body.match(/^## .+$/gm) || []
const slide2Title = h2s[1] ? h2s[1].replace(/^## /, '').trim() : 'Key Details'
const storySlides = [
  `📱 ${title}`,
  `✨ ${slide2Title}`,
  `🔗 Full guide in bio!\n@japan_pop_now`
].join('\n\n---\n\n')

// Write outputs
const outDir = join('sns-drafts', slug)
try {
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'x-post.txt'), xPost, 'utf-8')
  writeFileSync(join(outDir, 'ig-caption.txt'), igCaption, 'utf-8')
  writeFileSync(join(outDir, 'ig-story-slides.txt'), storySlides, 'utf-8')
  writeFileSync(
    join(outDir, 'metadata.json'),
    JSON.stringify(
      {
        title,
        slug,
        category,
        tags,
        generatedAt: new Date().toISOString(),
        stats: {
          xPostChars: xPost.length,
          igCaptionChars: igCaption.length
        }
      },
      null,
      2
    ),
    'utf-8'
  )

  console.log(`✓ SNS drafts generated in ${outDir}/`)
  console.log(`  X post: ${xPost.length}/280 chars`)
  console.log(`  IG caption: ${igCaption.length}/2200 chars`)
  console.log(`  Story slides: 3 slides`)
} catch (e) {
  console.error(`Error writing output files: ${e.message}`)
  process.exit(1)
}

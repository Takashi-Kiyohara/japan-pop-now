#!/usr/bin/env tsx
/**
 * Cycle E2 — image axis-5 full audit (deterministic axes only).
 *
 * For every image referenced in non-deprecated content/articles/*.{md,mdx}
 * (frontmatter featuredImage + body markdown ![alt](path)):
 *
 * Axis 1 (count / density):
 *   - article must have at least 1 hero/featured image
 *   - body image density target: ≥ 1 per 1000 words
 *
 * Axis 2 (resolution):
 *   - hero/featured image: ≥ 1080px wide for next/image responsive serving
 *
 * Axis 3 (topic match — keyword overlap heuristic):
 *   - alt text + filename must share ≥ 1 token with article slug or title
 *
 * Axis 4 (real-photo signal — filename pattern heuristic):
 *   - allowed signals: "wikimedia", "press", "official", "takapon",
 *     "editorial", "cc-by", numeric/generic hero/body filenames are
 *     considered Takapon editorial unless flagged
 *   - banned signals: "ai-generated", "midjourney", "stable-diffusion",
 *     "dalle", "generated", "synthetic"
 *
 * Axis 5 (hero frame fit) — SKIPPED in this script. Aspect-ratio sanity
 * (close to 16:9 / 4:3 / 3:2) is reported as advisory; subject-position
 * verification needs visual inspection (out of scope here).
 *
 * Usage:
 *   npx tsx scripts/audit/image-axis5-full.ts > docs/audit/cycleE-image-audit-{date}.md
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { execSync } from 'child_process'
import sizeOf from 'image-size'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const PUBLIC_ROOT = path.join(process.cwd(), 'public')

const REAL_PHOTO_SIGNALS = ['wikimedia', 'press', 'official', 'takapon', 'editorial', 'cc-by', 'wiki', 'commons']
const BANNED_GENERATION_SIGNALS = ['ai-generated', 'midjourney', 'stable-diffusion', 'dalle', 'generated', 'synthetic', 'sd-xl', 'sdxl']
const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'guide', '2026'])

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|gif)$/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
}

function getImageDimensions(absPath: string): { w: number; h: number } | null {
  try {
    const buf = fs.readFileSync(absPath)
    const r = sizeOf(buf)
    if (r.width && r.height) return { w: r.width, h: r.height }
  } catch {}
  return null
}

function isDeprecatedFile(filename: string): boolean {
  return filename.includes('.deprecated')
}

function getWordCount(content: string): number {
  return content.split(/\s+/).filter((w) => w.length > 0).length
}

type ImageRecord = {
  articleSlug: string
  imagePath: string
  alt: string
  isHero: boolean
  exists: boolean
  width?: number
  height?: number
  axis2Pass?: boolean
  axis3Pass?: boolean
  axis3Reason?: string
  axis4Pass?: boolean
  axis4Reason?: string
  axis5AspectRatio?: number
}

type ArticleRecord = {
  slug: string
  title: string
  wordCount: number
  imageCount: number
  density: number
  hasHero: boolean
  axis1Pass: boolean
  axis1Reason?: string
}

function main() {
  const articleRecords: ArticleRecord[] = []
  const imageRecords: ImageRecord[] = []

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (isDeprecatedFile(file)) continue
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue

    const slug = file.replace(/\.mdx?$/, '')
    const fp = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(fp, 'utf-8').replace(/^﻿/, '')
    const { data, content } = matter(raw)
    const title = typeof data.title === 'string' ? data.title : '(untitled)'

    const slugTokens = new Set([...tokenize(slug), ...tokenize(title)])

    // Featured image
    const featured = typeof data.featuredImage === 'string' ? data.featuredImage : null
    const featuredAlt = typeof data.featuredImageAlt === 'string' ? data.featuredImageAlt : ''
    if (featured) {
      const abs = path.join(PUBLIC_ROOT, featured)
      const exists = fs.existsSync(abs)
      const dim = exists ? getImageDimensions(abs) : null

      const filenameTokens = tokenize(path.basename(featured))
      const altTokens = tokenize(featuredAlt)
      const overlap = [...filenameTokens, ...altTokens].some((t) => slugTokens.has(t))
      const lowerName = path.basename(featured).toLowerCase()
      const lowerAlt = featuredAlt.toLowerCase()
      const banned = BANNED_GENERATION_SIGNALS.find((s) => lowerName.includes(s) || lowerAlt.includes(s))
      const realSignal = REAL_PHOTO_SIGNALS.find((s) => lowerName.includes(s)) || (data.imageCredit ? 'imageCredit-set' : null)

      imageRecords.push({
        articleSlug: slug,
        imagePath: featured,
        alt: featuredAlt,
        isHero: true,
        exists,
        width: dim?.w,
        height: dim?.h,
        axis2Pass: dim ? dim.w >= 1080 : undefined,
        axis3Pass: overlap,
        axis3Reason: overlap ? '' : `no token overlap with slug+title (alt: "${featuredAlt.slice(0, 60)}")`,
        axis4Pass: !banned,
        axis4Reason: banned ? `banned signal: ${banned}` : (realSignal ? `real-signal: ${realSignal}` : 'no explicit signal'),
        axis5AspectRatio: dim ? dim.w / dim.h : undefined,
      })
    }

    // Body images
    const bodyMatches = [...content.matchAll(/!\[([^\]]*)\]\((\/images\/articles\/[^)]+)\)/g)]
    for (const m of bodyMatches) {
      const alt = m[1]
      const imgPath = m[2]
      const abs = path.join(PUBLIC_ROOT, imgPath)
      const exists = fs.existsSync(abs)
      const dim = exists ? getImageDimensions(abs) : null

      const filenameTokens = tokenize(path.basename(imgPath))
      const altTokens = tokenize(alt)
      const overlap = [...filenameTokens, ...altTokens].some((t) => slugTokens.has(t))
      const lowerName = path.basename(imgPath).toLowerCase()
      const lowerAlt = alt.toLowerCase()
      const banned = BANNED_GENERATION_SIGNALS.find((s) => lowerName.includes(s) || lowerAlt.includes(s))
      const realSignal = REAL_PHOTO_SIGNALS.find((s) => lowerName.includes(s))

      imageRecords.push({
        articleSlug: slug,
        imagePath: imgPath,
        alt,
        isHero: false,
        exists,
        width: dim?.w,
        height: dim?.h,
        axis2Pass: dim ? dim.w >= 800 : undefined,  // body images relaxed to 800w
        axis3Pass: overlap,
        axis3Reason: overlap ? '' : `no token overlap with slug+title (alt: "${alt.slice(0, 60)}")`,
        axis4Pass: !banned,
        axis4Reason: banned ? `banned signal: ${banned}` : (realSignal ? `real-signal: ${realSignal}` : 'no explicit signal'),
        axis5AspectRatio: dim ? dim.w / dim.h : undefined,
      })
    }

    const wordCount = getWordCount(content)
    const articleImages = imageRecords.filter((r) => r.articleSlug === slug)
    const bodyImages = articleImages.filter((r) => !r.isHero)
    const density = wordCount > 0 ? (bodyImages.length / wordCount) * 1000 : 0
    const hasHero = articleImages.some((r) => r.isHero && r.exists)
    const axis1Pass = hasHero && density >= 1.0

    articleRecords.push({
      slug,
      title,
      wordCount,
      imageCount: articleImages.length,
      density,
      hasHero,
      axis1Pass,
      axis1Reason: !hasHero ? 'no featured image' : (density < 1.0 ? `density ${density.toFixed(2)}/1k < 1.0` : ''),
    })
  }

  console.log(`# [cycleE'] E2 — image axis-5 full audit (deterministic axes)`)
  console.log(``)
  console.log(`Generated: ${new Date().toISOString().slice(0, 19)}Z`)
  console.log(`Articles audited: ${articleRecords.length}`)
  console.log(`Images audited: ${imageRecords.length}`)
  console.log(``)
  console.log(`## Summary`)
  console.log(``)
  console.log(`| Axis | Pass | Fail | Notes |`)
  console.log(`|---|---|---|---|`)

  const axis1Fail = articleRecords.filter((r) => !r.axis1Pass)
  console.log(`| 1 — count/density | ${articleRecords.length - axis1Fail.length} | ${axis1Fail.length} | hero present + body density ≥ 1.0/1k words |`)

  const axis2Fail = imageRecords.filter((r) => r.exists && r.axis2Pass === false)
  const axis2Unknown = imageRecords.filter((r) => !r.exists || r.axis2Pass === undefined)
  console.log(`| 2 — resolution | ${imageRecords.length - axis2Fail.length - axis2Unknown.length} | ${axis2Fail.length} | hero ≥1080w; body ≥800w |`)

  const axis3Fail = imageRecords.filter((r) => r.exists && !r.axis3Pass)
  console.log(`| 3 — topic match | ${imageRecords.length - axis3Fail.length} | ${axis3Fail.length} | alt+filename overlap with slug+title |`)

  const axis4Fail = imageRecords.filter((r) => !r.axis4Pass)
  console.log(`| 4 — real photo | ${imageRecords.length - axis4Fail.length} | ${axis4Fail.length} | no banned-generation filename/alt |`)

  console.log(`| 5 — hero frame fit | (visual; skipped) | — | aspect ratio reported only |`)
  console.log(``)

  if (axis1Fail.length) {
    console.log(`## Axis 1 — articles failing density / hero (P2)`)
    console.log(``)
    console.log(`| Slug | Words | Images | Density/1k | Has hero? | Reason |`)
    console.log(`|---|---|---|---|---|---|`)
    for (const r of axis1Fail) {
      console.log(`| \`${r.slug}\` | ${r.wordCount} | ${r.imageCount} | ${r.density.toFixed(2)} | ${r.hasHero ? '✓' : '✗'} | ${r.axis1Reason} |`)
    }
    console.log(``)
  }

  if (axis2Fail.length) {
    console.log(`## Axis 2 — images failing resolution (P2)`)
    console.log(``)
    console.log(`| Article | Image | Width | Required | Hero? |`)
    console.log(`|---|---|---|---|---|`)
    for (const r of axis2Fail.slice(0, 30)) {
      const need = r.isHero ? 1080 : 800
      console.log(`| \`${r.articleSlug}\` | \`${path.basename(r.imagePath)}\` | ${r.width} | ${need} | ${r.isHero ? '✓' : ''} |`)
    }
    if (axis2Fail.length > 30) console.log(`| ... | ${axis2Fail.length - 30} more | | | |`)
    console.log(``)
  }

  if (axis3Fail.length) {
    console.log(`## Axis 3 — images failing topic match (P2)`)
    console.log(``)
    console.log(`Filename + alt should share ≥ 1 token with the article slug or title. Failure here usually means a generic alt ("Photo: Japan Pop Now") or a stock-style filename.`)
    console.log(``)
    console.log(`| Article | Image | Alt (truncated) |`)
    console.log(`|---|---|---|`)
    for (const r of axis3Fail.slice(0, 30)) {
      const altTrunc = r.alt.replace(/\|/g, '\\|').slice(0, 60)
      console.log(`| \`${r.articleSlug}\` | \`${path.basename(r.imagePath)}\` | ${altTrunc} |`)
    }
    if (axis3Fail.length > 30) console.log(`| ... | ${axis3Fail.length - 30} more | |`)
    console.log(``)
  }

  if (axis4Fail.length) {
    console.log(`## Axis 4 — images failing real-photo signal (P0 — AdSense risk)`)
    console.log(``)
    for (const r of axis4Fail) {
      console.log(`- \`${r.articleSlug}\`: \`${path.basename(r.imagePath)}\` — ${r.axis4Reason}`)
    }
    console.log(``)
  } else {
    console.log(`## Axis 4 — real-photo signal`)
    console.log(``)
    console.log(`✓ 0 images carry a banned-generation filename or alt-text marker. Note: heuristic only — flags lexical signals, doesn't AI-detect the image content. Visual axis 5 is needed for full confidence.`)
    console.log(``)
  }
}

main()

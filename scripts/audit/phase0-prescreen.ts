#!/usr/bin/env node

/**
 * Phase 0 retroactive pre-screen for v3 adoption.
 *
 * Reads every article in content/articles/, computes measurable signals
 * (word count, days since publish, image count, internal inbound links,
 * frontmatter completeness), and buckets each article into:
 *
 *   強い (strong)   — recent + meaty + linked + image-rich
 *   弱い (weak)     — short / orphaned / image-light
 *   古い (old)      — published > 180 days ago, regardless of strength
 *   不明 (unknown)  — fallback
 *
 * Output: docs/audit/phase0-prescreen-20260428.md (matrix table) +
 * .tmp/phase0-prescreen.json (raw per-article data).
 *
 * GSC click data and competitor uniqueness are NOT computed here — they
 * require external API access. Output flags those gaps for manual
 * addition before D2 Opus detailed evaluation.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const TODAY = new Date('2026-04-28')

interface ArticleMetrics {
  slug: string
  category: string
  date: string
  daysSincePublish: number
  wordCount: number
  imageCount: number
  imageFloor: number
  imageFloorMet: boolean
  hasHero: boolean
  hasFeaturedAlt: boolean
  internalOutbound: number
  internalInbound: number
  outboundOfficial: number
  bucket: 'strong' | 'weak' | 'old' | 'unknown'
  notes: string[]
}

function countWords(text: string): number {
  let content = text.replace(/```[\s\S]*?```/g, '')
  content = content.replace(/`[^`]+`/g, '')
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
  content = content.replace(/<[^>]+>/g, '')
  content = content.replace(/[#*_`~\-\[\]()]/g, ' ')
  content = content.replace(/\s+/g, ' ').trim()
  return content.split(/\s+/).filter((w) => w.length > 0).length
}

function countImages(content: string): number {
  const md = (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length
  const jsx = (content.match(/<(Image|img|Hero|FeaturedImage)[^>]*>/g) || []).length
  return md + jsx
}

function countInternalOutbound(content: string, allSlugs: Set<string>): number {
  const internalLinks = content.match(/\]\((\/[^)]*)\)/g) || []
  let count = 0
  for (const m of internalLinks) {
    const url = m.replace(/^\]\(/, '').replace(/\)$/, '')
    for (const slug of allSlugs) {
      if (url.includes(`/${slug}`)) {
        count++
        break
      }
    }
  }
  return count
}

function countOutboundOfficial(content: string): number {
  const httpsLinks = content.match(/https?:\/\/[^\s)"']+/g) || []
  const aggregatorHosts = [
    'tripadvisor.com',
    'tabelog.com',
    'hotpepper.jp',
    'amazon.',
    'rakuten.',
    'klook.com',
    'agoda.com',
    'booking.com',
    'getyourguide',
    'viator.com',
  ]
  return httpsLinks.filter((url) => {
    const lower = url.toLowerCase()
    return !aggregatorHosts.some((h) => lower.includes(h))
  }).length
}

function bucketize(m: ArticleMetrics): ArticleMetrics['bucket'] {
  if (m.daysSincePublish > 180) return 'old'
  if (
    m.wordCount >= 1500 &&
    m.hasHero &&
    m.imageFloorMet &&
    m.internalInbound >= 2 &&
    m.daysSincePublish < 180
  ) {
    return 'strong'
  }
  if (
    m.wordCount < 800 ||
    !m.hasHero ||
    !m.imageFloorMet ||
    m.internalInbound === 0
  ) {
    return 'weak'
  }
  return 'unknown'
}

function main() {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  const allSlugs = new Set(files.map((f) => f.replace(/\.mdx?$/, '')))

  const inboundMap = new Map<string, number>()
  for (const slug of allSlugs) inboundMap.set(slug, 0)

  // First pass: build inbound link counts
  const parsed: Array<{ file: string; slug: string; data: matter.GrayMatterFile<string> }> = []
  for (const f of files) {
    const full = path.join(ARTICLES_DIR, f)
    const raw = fs.readFileSync(full, 'utf8')
    const data = matter(raw)
    const slug = f.replace(/\.mdx?$/, '')
    parsed.push({ file: f, slug, data })

    for (const targetSlug of allSlugs) {
      if (targetSlug === slug) continue
      const re = new RegExp(`\\]\\(/[^)]*${targetSlug}[^)]*\\)`, 'g')
      const hits = (data.content.match(re) || []).length
      if (hits > 0) {
        inboundMap.set(targetSlug, (inboundMap.get(targetSlug) || 0) + hits)
      }
    }
  }

  const results: ArticleMetrics[] = []
  for (const { slug, data } of parsed) {
    const fm = data.data as Record<string, unknown>
    const dateStr = (fm.date as string) || '1970-01-01'
    const dt = new Date(dateStr)
    const days = Math.floor((TODAY.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24))
    const wc = countWords(data.content)
    const ic = countImages(data.content)
    const floor = Math.ceil(wc / 400)
    const hasHero = !!(fm.featuredImage || fm.hero_image || fm.heroImage)
    const hasFAlt = !!fm.featuredImageAlt
    const out = countInternalOutbound(data.content, allSlugs)
    const inbound = inboundMap.get(slug) || 0
    const offSrc = countOutboundOfficial(data.content)

    const notes: string[] = []
    if (!hasFAlt) notes.push('missing featuredImageAlt')
    if (out === 0) notes.push('no internal outbound (orphan-emitting)')
    if (inbound === 0) notes.push('no internal inbound (orphan-receiving)')
    if (offSrc === 0) notes.push('no outbound official-source links')
    if (floor > ic) notes.push(`image floor not met (${ic} of ${floor})`)

    const m: ArticleMetrics = {
      slug,
      category: (fm.category as string) || 'unknown',
      date: dateStr,
      daysSincePublish: days,
      wordCount: wc,
      imageCount: ic,
      imageFloor: floor,
      imageFloorMet: ic >= floor,
      hasHero,
      hasFeaturedAlt: hasFAlt,
      internalOutbound: out,
      internalInbound: inbound,
      outboundOfficial: offSrc,
      bucket: 'unknown',
      notes,
    }
    m.bucket = bucketize(m)
    results.push(m)
  }

  results.sort((a, b) => a.slug.localeCompare(b.slug))

  // Write JSON
  const tmpDir = path.join(process.cwd(), '.tmp')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  fs.writeFileSync(
    path.join(tmpDir, 'phase0-prescreen.json'),
    JSON.stringify(results, null, 2),
  )

  // Write Markdown matrix
  const counts = {
    strong: results.filter((r) => r.bucket === 'strong').length,
    weak: results.filter((r) => r.bucket === 'weak').length,
    old: results.filter((r) => r.bucket === 'old').length,
    unknown: results.filter((r) => r.bucket === 'unknown').length,
  }

  const lines: string[] = []
  lines.push('# Phase 0 Retroactive Pre-Screen — 2026-04-28')
  lines.push('')
  lines.push('Auto-generated by `scripts/audit/phase0-prescreen.ts`. No GSC click data')
  lines.push('and no competitor-uniqueness signal — those require external API access')
  lines.push('and must be added manually (or via Bucket D2 Opus detailed evaluation).')
  lines.push('')
  lines.push('## Bucket distribution')
  lines.push('')
  lines.push('| Bucket | Count | Threshold |')
  lines.push('| --- | ---: | --- |')
  lines.push(`| 強い (strong) | ${counts.strong} | wc≥1500 AND hero AND image floor met AND inbound≥2 AND days<180 |`)
  lines.push(`| 弱い (weak) | ${counts.weak} | wc<800 OR no hero OR image-floor miss OR inbound=0 |`)
  lines.push(`| 古い (old) | ${counts.old} | days≥180 (regardless of strength — refresh cycle candidate) |`)
  lines.push(`| 不明 (unknown) | ${counts.unknown} | fallback — needs Opus look |`)
  lines.push(`| **Total** | **${results.length}** | |`)
  lines.push('')
  lines.push('## Per-article matrix')
  lines.push('')
  lines.push(
    '| slug | bucket | cat | days | words | imgs (floor) | hero | inbound | outbnd | off-src | notes |',
  )
  lines.push(
    '| --- | --- | --- | ---: | ---: | --- | :-: | ---: | ---: | ---: | --- |',
  )
  for (const r of results) {
    const imgsCell = `${r.imageCount}${r.imageFloorMet ? '' : ` (need ${r.imageFloor})`}`
    const heroCell = r.hasHero ? '✓' : '—'
    const notesCell = r.notes.length === 0 ? '' : r.notes.join('; ')
    lines.push(
      `| ${r.slug} | ${r.bucket} | ${r.category} | ${r.daysSincePublish} | ${r.wordCount} | ${imgsCell} | ${heroCell} | ${r.internalInbound} | ${r.internalOutbound} | ${r.outboundOfficial} | ${notesCell} |`,
    )
  }
  lines.push('')
  lines.push('## Recommendations for D2 routing')
  lines.push('')
  lines.push('- **強い**: Phase 0 confirmation form is sufficient — score 100/100, keep.')
  lines.push('- **弱い + 不明**: Opus detailed evaluation (D2). Apply Phase 0 5-question + 4-reject criteria.')
  lines.push('- **古い**: refresh-cycle review. If still rankworthy, refresh frontmatter `date` and update; otherwise consider `robots: noindex,follow` per `feedback_destructive_ops.md` (NEVER delete).')
  lines.push('')
  lines.push('## Data caveats')
  lines.push('')
  lines.push('1. `internalInbound` counts how many *other* articles\' bodies contain a link path including the slug. relatedSlugs frontmatter is NOT counted (would inflate without contextual signal).')
  lines.push('2. `outboundOfficial` excludes known aggregator hosts (TripAdvisor/Tabelog/HotPepper/Amazon/Rakuten/Klook/Agoda/Booking/GetYourGuide/Viator) per affiliate policy — outbound to those is not "official source".')
  lines.push('3. `daysSincePublish` is from `frontmatter.date`, not git history. Republished articles will reset to the new date.')
  lines.push('4. `imageCount` counts markdown `![]()` plus JSX `<Image>`/`<img>`/`<Hero>`/`<FeaturedImage>` tags. Does not count `<srcset>` images or CSS backgrounds.')
  lines.push('5. Word count strips code fences, inline code, link/image markdown, HTML tags, and markdown punctuation before counting whitespace tokens.')
  lines.push('')

  const docPath = path.join(process.cwd(), 'docs/audit/phase0-prescreen-20260428.md')
  fs.writeFileSync(docPath, lines.join('\n'))

  console.log(
    `Phase 0 pre-screen complete: ${results.length} articles processed.`,
  )
  console.log(
    `Buckets: ${counts.strong} strong / ${counts.weak} weak / ${counts.old} old / ${counts.unknown} unknown.`,
  )
  console.log(`Doc: ${docPath}`)
  console.log(`JSON: .tmp/phase0-prescreen.json`)
}

main()

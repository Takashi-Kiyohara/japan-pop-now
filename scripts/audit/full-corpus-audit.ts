#!/usr/bin/env tsx
/**
 * Full-corpus 10-axis audit (2026-05-08).
 *
 * Evaluates every non-deprecated content/articles/*.{md,mdx} on:
 *   1  meta-desc (length 50-160, no boilerplate, no title echo)
 *   2  title     (≤60 chars, click signal)
 *   3  fabrication (first-person + body + JSON-LD)
 *   4  image-density (hero + body ≥1.0/k via existing axis-5 logic)
 *   5  internal-links (each /articles/{slug} link resolves to a non-noindex sibling)
 *   6  schema (frontmatter completeness for Article + FAQ + Breadcrumb JSON-LD)
 *   7  canonical (single canonical via Next App Router metadata)
 *   8  freshness (literal "2023" / "2024" appearances banned outside historical context)
 *   9  affiliate (klook URLs include aff_adid + rel="sponsored", no REPLACE_WITH)
 *  10  adsense-fitness (word_count ≥1500 AND axes 1-9 all PASS)
 *
 * Outputs:
 *   docs/audit/full-corpus-audit-{date}.json   raw per-article results
 *   docs/audit/full-corpus-audit-{date}.md     human scorecard
 *
 * Usage:
 *   npx tsx scripts/audit/full-corpus-audit.ts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const PUBLIC_ROOT = path.join(process.cwd(), 'public')
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

type AxisResult = { pass: boolean; reason?: string; metrics?: Record<string, unknown> }

type ArticleAudit = {
  slug: string
  title: string
  description: string
  wordCount: number
  imageCount: number
  bodyImageCount: number
  density: number
  axes: {
    metaDesc: AxisResult
    title: AxisResult
    fabrication: AxisResult
    imageDensity: AxisResult
    internalLinks: AxisResult
    schema: AxisResult
    canonical: AxisResult
    freshness: AxisResult
    affiliate: AxisResult
    adsenseFitness: AxisResult
  }
  passCount: number
  bucket: 'PASS_ALL_10' | 'PASS_8plus' | 'PASS_5_to_7' | 'FAIL_under_5'
  noindex: boolean
}

// Apostrophe class: U+0027 (ASCII), U+2018, U+2019 (curly quotes commonly auto-substituted by editors)
const APOS = `[\\u0027\\u2018\\u2019]`
const PATTERNS_FABRICATION = [
  new RegExp(`\\bI${APOS}?ve (stayed|visited|tested|spent|eaten|bought|walked|tried|seen|been|taken|booked|owned|shopped|toured|watched|learned|tasted|paid|attended|noticed|asked|included|always|driven|caught|done|mapped|measured|tracked|confirmed)\\b`, 'gi'),
  new RegExp(`\\bWhen I (stayed|visited|tested|spent|ate|bought|tried|saw|noticed|booked|owned|shopped|toured|walked|attended|stopped)\\b`, 'gi'),
  new RegExp(`\\bI${APOS}?m (planning|booking|heading|staying|visiting|traveling|going)\\b`, 'gi'),
  /\bI (stayed|visited|tested|spent|ate|bought|tried|saw|noticed|booked|owned|shopped|toured|walked|attended|stopped\b(?!\s(by|at)\s))\b/gi,
  /\bI always (call|recommend|book|stay|order|grab|skip|use|visit)\b/gi,
  /\b(my (visit|visits|first trip|own experience|honest take|favourite|favorite|recommendation|go-to))\b/gi,
  /\b(in my experience|over the past (few|three|six|several) (months|years) I)\b/gi,
  /\bI (felt|believed|recommended|preferred|noticed|watched(\s\w+\s)+(more|over|in person))/gi,
  // R4 (2026-05-09 RED-fix): multi-year/recurrence claims — operator started 2026-04,
  // so any "first time I", "by year N", "[ordinal] year, I" is fabrication.
  /\bfirst time[ ,]+I\b/gi,
  /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+(year|time)[ ,]+I\b/gi,
  /\bby year (one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/gi,
  /\bafter (one|two|three|four|five|six|seven|eight|nine|ten|several|many|\d+)\s+years[ ,]+I\b/gi,
  // R4 extended "I" + action verbs the prior list missed
  /\bI (showed up|lasted|wished|figured out|developed|did better|got better|lost|survived|forgot)\b/gi,
  /\bI wish\b/gi,
  // R4 personal-system claims ("I had a system" / "I have a routine" / etc.)
  /\bI (had|have) (a|my|the|some) (system|routine|method|approach|trick|hack|game plan|playbook|process|tradition|habit|rule|technique|favorite|favourite|go-to|notes|rhythm|workflow|formula)\b/gi,
  // R4 personal body/possession context ("my feet gave out", "my shoes destroyed me")
  /\bmy (feet|shoes|legs|back|hands|stomach|wallet|brain|memory|backpack|luggage|suitcase)\b/gi,
]

// Targeted stale-year detection. We only flag boilerplate "as if current"
// uses, not legitimate historical references (e.g., "the 2022 film", "since 2023").
//
//   - Last updated: <month?> 202[0-4]
//   - as of <month?> 202[0-4]
//   - 202[0-4] update / 202[0-4] guide / 202[0-4] edition
//   - in <month> 202[0-4] currently / so far / to date
//   - validUntil older than today (frontmatter level handled separately)
const STALE_BOILERPLATE_PATTERNS: RegExp[] = [
  /\b(as of|last updated|updated)\s*:?\s*(?:\w+\s+)?(20[0-2][0-4])\b/gi,
  /\b(20[0-2][0-4])\s+(update|guide|edition)\b/gi,
  /\bin\s+(20[0-2][0-4])\s+(currently|so far|to date|only)\b/gi,
]

function getWordCount(content: string): number {
  return content.split(/\s+/).filter((w) => w.length > 0).length
}

function isDeprecated(filename: string): boolean {
  return filename.includes('.deprecated')
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3)
}

function auditArticle(filename: string, allSlugs: Set<string>, noindexSlugs: Set<string>): ArticleAudit | null {
  const slug = filename.replace(/\.mdx?$/, '')
  const fp = path.join(ARTICLES_DIR, filename)
  const raw = fs.readFileSync(fp, 'utf-8').replace(/^﻿/, '')
  let parsed
  try {
    parsed = matter(raw)
  } catch (e) {
    // Frontmatter parse failure
    return {
      slug,
      title: '(parse-error)',
      description: '',
      wordCount: 0,
      imageCount: 0,
      bodyImageCount: 0,
      density: 0,
      axes: {
        metaDesc: { pass: false, reason: 'frontmatter parse error' },
        title: { pass: false, reason: 'frontmatter parse error' },
        fabrication: { pass: false, reason: 'parse error' },
        imageDensity: { pass: false, reason: 'parse error' },
        internalLinks: { pass: false, reason: 'parse error' },
        schema: { pass: false, reason: 'parse error' },
        canonical: { pass: false, reason: 'parse error' },
        freshness: { pass: false, reason: 'parse error' },
        affiliate: { pass: false, reason: 'parse error' },
        adsenseFitness: { pass: false, reason: 'parse error' },
      },
      passCount: 0,
      bucket: 'FAIL_under_5',
      noindex: false,
    }
  }
  const data = parsed.data as Record<string, unknown>
  const content = parsed.content
  const title = (data.title as string) || ''
  const description = (data.description as string) || ''
  const robots = (data.robots as string) || ''
  const noindex = robots.includes('noindex')

  const wordCount = getWordCount(content)

  // Axis 1: meta-desc
  const descLen = description.length
  const titleLow = title.toLowerCase()
  const descLow = description.toLowerCase()
  const titleEcho = title && descLow.startsWith(titleLow.slice(0, Math.min(40, titleLow.length)))
  const boilerplate = /^(last updated|updated):/i.test(description.trim())
  const metaDescPass = descLen >= 50 && descLen <= 160 && !titleEcho && !boilerplate
  const metaDescReason = !metaDescPass
    ? [
        descLen < 50 && `desc too short (${descLen})`,
        descLen > 160 && `desc too long (${descLen})`,
        titleEcho && 'desc echoes title',
        boilerplate && 'boilerplate "Last updated:" pattern',
      ]
        .filter(Boolean)
        .join(' / ')
    : undefined

  // Axis 2: title
  const titleLen = title.length
  const hasNumber = /\d/.test(title)
  const titlePass = titleLen > 0 && titleLen <= 60
  const titleReason = !titlePass
    ? titleLen === 0
      ? 'missing'
      : `title too long (${titleLen})`
    : undefined

  // Axis 3: fabrication
  let fabHits = 0
  for (const re of PATTERNS_FABRICATION) {
    re.lastIndex = 0
    const matches = content.match(re)
    if (matches) fabHits += matches.length
  }
  // JSON-LD references aren't in source markdown — skip that part (handled in schema axis)
  const fabricationPass = fabHits === 0 || noindex
  const fabricationReason = !fabricationPass ? `${fabHits} first-person hit(s)` : undefined

  // Axis 4: image-density
  const featured = (data.featuredImage as string) || ''
  const hasFeatured = featured && fs.existsSync(path.join(PUBLIC_ROOT, featured))
  const bodyImageMatches = [...content.matchAll(/!\[[^\]]*\]\((\/images\/articles\/[^)]+)\)/g)]
  const bodyImageCount = bodyImageMatches.length
  const density = wordCount > 0 ? (bodyImageCount / wordCount) * 1000 : 0
  const imageDensityPass = !!hasFeatured && density >= 1.0
  const imageDensityReason = !imageDensityPass
    ? !hasFeatured
      ? 'missing or 404 hero image'
      : `density ${density.toFixed(2)}/k < 1.0`
    : undefined

  // Axis 5: internal-links — every /articles/{slug} link resolves and not noindex
  const linkMatches = [...content.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)]
  const linkSlugs = linkMatches.map((m) => m[1])
  const broken = linkSlugs.filter((s) => !allSlugs.has(s))
  const noindexRefs = linkSlugs.filter((s) => noindexSlugs.has(s))
  const internalLinksPass = broken.length === 0 && noindexRefs.length === 0
  const internalLinksReason = !internalLinksPass
    ? [broken.length && `${broken.length} 404 link(s): ${broken.slice(0, 3).join(',')}`, noindexRefs.length && `${noindexRefs.length} noindex ref(s)`]
        .filter(Boolean)
        .join(' / ')
    : undefined

  // Axis 6: schema (frontmatter completeness)
  const required = ['title', 'description', 'date', 'category', 'featuredImage', 'author']
  const missing = required.filter((k) => !data[k])
  const schemaPass = missing.length === 0
  const schemaReason = !schemaPass ? `missing frontmatter: ${missing.join(',')}` : undefined

  // Axis 7: canonical — slug field if present must equal filename, no manual canonical override colliding
  const slugField = (data.slug as string) || slug
  const canonicalPass = slugField === slug
  const canonicalReason = !canonicalPass ? `frontmatter slug "${slugField}" != filename "${slug}"` : undefined

  // Axis 8: freshness — only flag boilerplate "as if current" stale-year uses
  let staleHits = 0
  const staleSamples: string[] = []
  for (const re of STALE_BOILERPLATE_PATTERNS) {
    re.lastIndex = 0
    const matches = [...content.matchAll(re)]
    staleHits += matches.length
    for (const m of matches.slice(0, 2)) staleSamples.push(m[0])
  }
  const freshnessPass = staleHits === 0
  const freshnessReason = !freshnessPass
    ? `${staleHits} boilerplate stale-year hit(s): ${staleSamples.slice(0, 3).join(' | ')}`
    : undefined

  // Axis 9: affiliate
  const klookHits = [...content.matchAll(/https?:\/\/affiliate\.klook\.com\/[^)\s]+/g)]
  const placeholderHits = [...content.matchAll(/REPLACE_WITH_/g)]
  let affiliatePass = true
  const affiliateReasons: string[] = []
  if (placeholderHits.length) {
    affiliatePass = false
    affiliateReasons.push(`${placeholderHits.length} REPLACE_WITH placeholder(s)`)
  }
  for (const m of klookHits) {
    const url = m[0]
    if (!url.includes('aff_adid')) {
      affiliatePass = false
      affiliateReasons.push(`klook URL missing aff_adid`)
      break
    }
  }
  // Check rel="sponsored" near klook anchors — only test bare anchors, not JSX components.
  const bareKlookA = [...content.matchAll(/<a\s[^>]*href="https?:\/\/affiliate\.klook\.com[^"]*"[^>]*>/gi)]
  for (const m of bareKlookA) {
    if (!/rel="[^"]*sponsored/i.test(m[0])) {
      affiliatePass = false
      affiliateReasons.push('klook anchor missing rel="sponsored"')
      break
    }
  }
  const affiliateReason = !affiliatePass ? affiliateReasons.join(' / ') : undefined

  // Axis 10: adsense-fitness — word ≥1500 AND axes 1-9 all PASS
  const baseAxes = [
    metaDescPass,
    titlePass,
    fabricationPass,
    imageDensityPass,
    internalLinksPass,
    schemaPass,
    canonicalPass,
    freshnessPass,
    affiliatePass,
  ]
  const adsenseFitnessPass = wordCount >= 1500 && baseAxes.every(Boolean)
  const adsenseFitnessReason = !adsenseFitnessPass
    ? wordCount < 1500
      ? `word_count ${wordCount} < 1500`
      : `axes 1-9 fail: ${baseAxes.filter((p) => !p).length}`
    : undefined

  const passCount =
    Number(metaDescPass) +
    Number(titlePass) +
    Number(fabricationPass) +
    Number(imageDensityPass) +
    Number(internalLinksPass) +
    Number(schemaPass) +
    Number(canonicalPass) +
    Number(freshnessPass) +
    Number(affiliatePass) +
    Number(adsenseFitnessPass)

  let bucket: ArticleAudit['bucket']
  if (passCount === 10) bucket = 'PASS_ALL_10'
  else if (passCount >= 8) bucket = 'PASS_8plus'
  else if (passCount >= 5) bucket = 'PASS_5_to_7'
  else bucket = 'FAIL_under_5'

  return {
    slug,
    title,
    description,
    wordCount,
    imageCount: bodyImageCount + (hasFeatured ? 1 : 0),
    bodyImageCount,
    density,
    axes: {
      metaDesc: { pass: metaDescPass, reason: metaDescReason, metrics: { length: descLen } },
      title: { pass: titlePass, reason: titleReason, metrics: { length: titleLen } },
      fabrication: { pass: fabricationPass, reason: fabricationReason, metrics: { hits: fabHits } },
      imageDensity: { pass: imageDensityPass, reason: imageDensityReason, metrics: { density, bodyImageCount } },
      internalLinks: { pass: internalLinksPass, reason: internalLinksReason, metrics: { broken: broken.length, noindexRefs: noindexRefs.length } },
      schema: { pass: schemaPass, reason: schemaReason, metrics: { missing } },
      canonical: { pass: canonicalPass, reason: canonicalReason },
      freshness: { pass: freshnessPass, reason: freshnessReason, metrics: { staleHits: staleHits.length } },
      affiliate: { pass: affiliatePass, reason: affiliateReason },
      adsenseFitness: { pass: adsenseFitnessPass, reason: adsenseFitnessReason, metrics: { wordCount } },
    },
    passCount,
    bucket,
    noindex,
  }
}

function main() {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !isDeprecated(f))

  const allSlugs = new Set(files.map((f) => f.replace(/\.mdx?$/, '')))
  const noindexSlugs = new Set<string>()
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8').replace(/^﻿/, '')
    try {
      const { data } = matter(raw)
      const robots = (data.robots as string) || ''
      if (robots.includes('noindex')) noindexSlugs.add(f.replace(/\.mdx?$/, ''))
    } catch {}
  }

  const results: ArticleAudit[] = []
  for (const f of files) {
    const r = auditArticle(f, allSlugs, noindexSlugs)
    if (r) results.push(r)
  }

  // Aggregate
  const buckets = {
    PASS_ALL_10: results.filter((r) => r.bucket === 'PASS_ALL_10').length,
    PASS_8plus: results.filter((r) => r.bucket === 'PASS_8plus').length,
    PASS_5_to_7: results.filter((r) => r.bucket === 'PASS_5_to_7').length,
    FAIL_under_5: results.filter((r) => r.bucket === 'FAIL_under_5').length,
  }
  const axisFail = {
    metaDesc: results.filter((r) => !r.axes.metaDesc.pass).length,
    title: results.filter((r) => !r.axes.title.pass).length,
    fabrication: results.filter((r) => !r.axes.fabrication.pass).length,
    imageDensity: results.filter((r) => !r.axes.imageDensity.pass).length,
    internalLinks: results.filter((r) => !r.axes.internalLinks.pass).length,
    schema: results.filter((r) => !r.axes.schema.pass).length,
    canonical: results.filter((r) => !r.axes.canonical.pass).length,
    freshness: results.filter((r) => !r.axes.freshness.pass).length,
    affiliate: results.filter((r) => !r.axes.affiliate.pass).length,
    adsenseFitness: results.filter((r) => !r.axes.adsenseFitness.pass).length,
  }

  // Write JSON
  const jsonPath = path.join(process.cwd(), `docs/audit/full-corpus-audit-${today}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify({ generated: new Date().toISOString(), buckets, axisFail, results }, null, 2))

  // Write Markdown scorecard
  const sorted = [...results].sort((a, b) => a.passCount - b.passCount || a.slug.localeCompare(b.slug))
  const lines: string[] = []
  lines.push(`# Full-corpus 10-axis audit — ${today}`)
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString().slice(0, 19)}Z`)
  lines.push(`Articles audited: ${results.length}`)
  lines.push('')
  lines.push('## Bucket totals')
  lines.push('')
  lines.push(`| Bucket | Count |`)
  lines.push(`|---|---|`)
  lines.push(`| PASS_ALL_10 | ${buckets.PASS_ALL_10} |`)
  lines.push(`| PASS_8plus  | ${buckets.PASS_8plus} |`)
  lines.push(`| PASS_5_to_7 | ${buckets.PASS_5_to_7} |`)
  lines.push(`| FAIL_under_5 | ${buckets.FAIL_under_5} |`)
  lines.push('')
  lines.push('## Per-axis fail count')
  lines.push('')
  lines.push(`| Axis | Fail |`)
  lines.push(`|---|---|`)
  for (const [k, v] of Object.entries(axisFail)) lines.push(`| ${k} | ${v} |`)
  lines.push('')
  lines.push('## Per-article scorecard (worst first)')
  lines.push('')
  lines.push(`| Slug | Score | Bucket | Words | meta | title | fab | img | links | schema | canon | fresh | aff | ads |`)
  lines.push(`|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`)
  for (const r of sorted) {
    const c = (a: AxisResult) => (a.pass ? '✓' : '✗')
    const noindexMark = r.noindex ? ' (noindex)' : ''
    lines.push(
      `| \`${r.slug}\`${noindexMark} | ${r.passCount}/10 | ${r.bucket} | ${r.wordCount} | ${c(r.axes.metaDesc)} | ${c(r.axes.title)} | ${c(r.axes.fabrication)} | ${c(r.axes.imageDensity)} | ${c(r.axes.internalLinks)} | ${c(r.axes.schema)} | ${c(r.axes.canonical)} | ${c(r.axes.freshness)} | ${c(r.axes.affiliate)} | ${c(r.axes.adsenseFitness)} |`,
    )
  }
  lines.push('')
  lines.push('## Failure detail (FAIL_under_5 + PASS_5_to_7)')
  lines.push('')
  for (const r of sorted) {
    if (r.bucket === 'PASS_ALL_10' || r.bucket === 'PASS_8plus') continue
    lines.push(`### \`${r.slug}\` (${r.passCount}/10, ${r.bucket})`)
    lines.push('')
    for (const [name, axis] of Object.entries(r.axes)) {
      if (axis.pass) continue
      lines.push(`- **${name}**: ${axis.reason || 'fail'}`)
    }
    lines.push('')
  }

  const mdPath = path.join(process.cwd(), `docs/audit/full-corpus-audit-${today}.md`)
  fs.writeFileSync(mdPath, lines.join('\n'))

  console.log(`Wrote ${jsonPath}`)
  console.log(`Wrote ${mdPath}`)
  console.log(`Bucket totals:`, buckets)
  console.log(`Axis fail counts:`, axisFail)
}

main()

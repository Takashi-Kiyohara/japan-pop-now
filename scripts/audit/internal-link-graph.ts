#!/usr/bin/env tsx
/**
 * Internal link graph audit (Phase C).
 *
 * Builds a directed graph from /articles/{slug} markdown links + frontmatter
 * relatedSlugs[]. Reports:
 *  - per-article in-degree / out-degree
 *  - orphan articles (in-degree 0, not noindex)
 *  - link target validity (404 or noindex)
 *  - cluster size by silo (category)
 *  - hub-spoke balance
 *  - cluster cannibalization (multiple articles targeting same primary keyword)
 *
 * Outputs:
 *   docs/audit/internal-link-graph-{date}.json
 *   docs/audit/internal-link-graph-{date}.md
 *
 * Usage: npx tsx scripts/audit/internal-link-graph.ts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

type ArticleMeta = {
  slug: string
  title: string
  category: string
  noindex: boolean
  outgoing: string[]
  incoming: string[]
  primaryKeyword?: string
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !['the', 'and', 'for', 'with', 'guide', '2026'].includes(t))
}

function main() {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.includes('.deprecated'))

  const articles: Map<string, ArticleMeta> = new Map()

  // Pass 1: build article registry + collect outgoing
  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8').replace(/^﻿/, '')
    let parsed
    try {
      parsed = matter(raw)
    } catch {
      continue
    }
    const data = parsed.data as Record<string, unknown>
    const slug = file.replace(/\.mdx?$/, '')
    const title = (data.title as string) || ''
    const category = (data.category as string) || 'unknown'
    const robots = (data.robots as string) || ''
    const noindex = robots.includes('noindex')

    // Outgoing: markdown links + relatedSlugs
    const linkMatches = [...parsed.content.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)]
    const linkSlugs = linkMatches.map((m) => m[1])
    const related = Array.isArray(data.relatedSlugs) ? (data.relatedSlugs as string[]) : []
    const outgoing = Array.from(new Set([...linkSlugs, ...related]))

    // Primary keyword: first 2 distinct slug tokens
    const keywordTokens = tokenize(slug).slice(0, 2)
    const primaryKeyword = keywordTokens.join(' ')

    articles.set(slug, {
      slug,
      title,
      category,
      noindex,
      outgoing,
      incoming: [],
      primaryKeyword,
    })
  }

  // Pass 2: populate incoming edges
  for (const meta of articles.values()) {
    for (const target of meta.outgoing) {
      const t = articles.get(target)
      if (t) t.incoming.push(meta.slug)
    }
  }

  // Analysis
  const all = [...articles.values()]
  const orphans = all.filter((m) => m.incoming.length === 0 && !m.noindex)
  const lowIncoming = all.filter((m) => m.incoming.length === 1 && !m.noindex)
  const lowOutgoing = all.filter((m) => m.outgoing.length < 2 && !m.noindex)
  const brokenLinks: { from: string; to: string }[] = []
  const noindexRefs: { from: string; to: string }[] = []
  for (const m of all) {
    for (const t of m.outgoing) {
      const tgt = articles.get(t)
      if (!tgt) brokenLinks.push({ from: m.slug, to: t })
      else if (tgt.noindex) noindexRefs.push({ from: m.slug, to: t })
    }
  }

  // Silo distribution
  const bySilo: Record<string, number> = {}
  for (const m of all) {
    if (m.noindex) continue
    bySilo[m.category] = (bySilo[m.category] || 0) + 1
  }

  // Cluster cannibalization: articles sharing primary keyword (first 2 tokens of slug)
  const byKeyword: Record<string, ArticleMeta[]> = {}
  for (const m of all) {
    if (m.noindex) continue
    if (!m.primaryKeyword) continue
    if (!byKeyword[m.primaryKeyword]) byKeyword[m.primaryKeyword] = []
    byKeyword[m.primaryKeyword].push(m)
  }
  const cannibalClusters = Object.entries(byKeyword).filter(([, ms]) => ms.length >= 2)

  // Write JSON
  const json = {
    generated: new Date().toISOString(),
    totals: {
      articles: all.length,
      noindex: all.filter((m) => m.noindex).length,
      orphans: orphans.length,
      lowIncoming: lowIncoming.length,
      lowOutgoing: lowOutgoing.length,
      brokenLinks: brokenLinks.length,
      noindexRefs: noindexRefs.length,
    },
    bySilo,
    orphans: orphans.map((o) => ({ slug: o.slug, category: o.category, title: o.title })),
    lowIncoming: lowIncoming.map((o) => ({ slug: o.slug, incoming: o.incoming })),
    cannibalClusters: cannibalClusters.map(([k, ms]) => ({ keyword: k, members: ms.map((m) => m.slug) })),
    brokenLinks,
    noindexRefs,
    graph: all.map((m) => ({
      slug: m.slug,
      category: m.category,
      noindex: m.noindex,
      outgoing: m.outgoing,
      incoming: m.incoming,
      inDegree: m.incoming.length,
      outDegree: m.outgoing.length,
    })),
  }
  fs.writeFileSync(path.join(process.cwd(), `docs/audit/internal-link-graph-${today}.json`), JSON.stringify(json, null, 2))

  // Write Markdown
  const md: string[] = []
  md.push(`# Internal link graph audit — ${today}`)
  md.push('')
  md.push(`Generated: ${new Date().toISOString().slice(0, 19)}Z`)
  md.push('')
  md.push('## Totals')
  md.push('')
  md.push(`| Metric | Count |`)
  md.push(`|---|---|`)
  for (const [k, v] of Object.entries(json.totals)) md.push(`| ${k} | ${v} |`)
  md.push('')
  md.push('## Silo distribution (excl. noindex)')
  md.push('')
  md.push(`| Silo | Articles |`)
  md.push(`|---|---|`)
  for (const [k, v] of Object.entries(bySilo).sort((a, b) => b[1] - a[1])) md.push(`| ${k} | ${v} |`)
  md.push('')
  if (orphans.length) {
    md.push(`## Orphan articles (incoming = 0, indexed)`)
    md.push('')
    md.push('These articles have no inbound internal links from any other article. Add 2-3 contextual references from related hub or peer articles.')
    md.push('')
    md.push(`| Slug | Category | Title |`)
    md.push(`|---|---|---|`)
    for (const o of orphans) md.push(`| \`${o.slug}\` | ${o.category} | ${o.title} |`)
    md.push('')
  }
  if (lowIncoming.length) {
    md.push(`## Low-incoming articles (incoming = 1)`)
    md.push('')
    md.push(`| Slug | From |`)
    md.push(`|---|---|`)
    for (const m of lowIncoming.slice(0, 20)) md.push(`| \`${m.slug}\` | \`${m.incoming[0]}\` |`)
    if (lowIncoming.length > 20) md.push(`| ... | ${lowIncoming.length - 20} more |`)
    md.push('')
  }
  if (cannibalClusters.length) {
    md.push(`## Potential cluster cannibalization (≥2 articles sharing first 2 slug tokens)`)
    md.push('')
    md.push(`Review for canonical consolidation or differentiated keyword positioning.`)
    md.push('')
    md.push(`| Keyword | Members |`)
    md.push(`|---|---|`)
    for (const c of cannibalClusters) {
      md.push(`| ${c[0]} | ${(c[1] as ArticleMeta[]).map((m) => `\`${m.slug}\``).join(', ')} |`)
    }
    md.push('')
  }
  if (brokenLinks.length) {
    md.push(`## Broken internal links (target slug not found)`)
    md.push('')
    for (const b of brokenLinks) md.push(`- \`${b.from}\` -> \`${b.to}\``)
    md.push('')
  }
  if (noindexRefs.length) {
    md.push(`## Noindex references (linking to noindex articles)`)
    md.push('')
    for (const r of noindexRefs) md.push(`- \`${r.from}\` -> \`${r.to}\` (noindex)`)
    md.push('')
  }

  fs.writeFileSync(path.join(process.cwd(), `docs/audit/internal-link-graph-${today}.md`), md.join('\n'))

  console.log(`Wrote internal-link-graph-${today}.json + .md`)
  console.log('Totals:', json.totals)
  console.log('Silo:', bySilo)
}

main()

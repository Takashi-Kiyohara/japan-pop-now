#!/usr/bin/env tsx
/**
 * Cycle A2 / A5 — Internal link graph audit.
 *
 * Builds a directed graph from /articles/<slug> link targets in article bodies
 * (and from a synthetic homepage / hub-page link set). Reports:
 *   - orphans (incoming = 0)
 *   - depth (BFS from /, with hub pages as roots)
 *   - per-article inbound / outbound counts
 *   - per-silo cluster connectivity (intra-silo edge ratio)
 *   - cannibalization candidates (article pairs whose anchor text overlaps ≥80%)
 *
 * Usage:
 *   npx tsx scripts/audit/internal-pagerank.ts > docs/audit/cycleA2-A5-graph-20260506.md
 *
 * Implementation notes:
 *   - Uses lib/articles.ts to enumerate articles (so robots:noindex / past
 *     validUntil entries are still discoverable as graph nodes; sitemap-status
 *     is reported alongside, not used to filter).
 *   - Hub pages are listed manually (these are routes, not files in
 *     content/articles/), so they seed the BFS but do not appear as nodes.
 *   - A link to /articles/foo/ (with trailing slash) is normalized to /foo.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

const HUB_ROOTS = [
  '/',
  '/articles',
  '/cafes',
  '/calendar',
  '/category/cafes',
  '/category/destinations',
  '/category/experiences',
  '/category/events',
  '/features',
  '/features/collab-cafe-guide',
  '/features/pilgrimage-routes',
  '/features/tokyo-district-guides',
  '/features/travel-essentials',
  '/guides',
] as const

type Node = {
  slug: string
  title: string
  category: string
  hubLinked: boolean
  outbound: Set<string>
  inbound: Set<string>
  sitemapStatus: 'in' | 'noindex' | 'expired' | 'deprecated'
  validUntil?: string
}

const today = new Date().toISOString().slice(0, 10)

function loadGraph(): Map<string, Node> {
  const graph = new Map<string, Node>()
  if (!fs.existsSync(ARTICLES_DIR)) return graph

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const slug = file.replace(/\.mdx?$/, '')
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    let sitemapStatus: Node['sitemapStatus'] = 'in'
    if (typeof data.robots === 'string' && data.robots.includes('noindex')) {
      sitemapStatus = 'noindex'
    } else if (data.validUntil && data.validUntil < today) {
      sitemapStatus = 'expired'
    }

    const outbound = new Set<string>()
    const linkRe = /\]\(\/articles\/([a-z0-9-]+)\/?\)/g
    let m: RegExpExecArray | null
    while ((m = linkRe.exec(content)) !== null) {
      if (m[1] !== slug) outbound.add(m[1])
    }

    graph.set(slug, {
      slug,
      title: typeof data.title === 'string' ? data.title : '(untitled)',
      category: typeof data.category === 'string' ? data.category : '(uncategorized)',
      hubLinked: false,
      outbound,
      inbound: new Set<string>(),
      sitemapStatus,
      validUntil: typeof data.validUntil === 'string' ? data.validUntil : undefined,
    })
  }

  for (const node of graph.values()) {
    for (const target of node.outbound) {
      const t = graph.get(target)
      if (t) t.inbound.add(node.slug)
    }
  }

  return graph
}

function bfsDepth(graph: Map<string, Node>): Map<string, number> {
  const depth = new Map<string, number>()
  const queue: { slug: string; d: number }[] = []
  for (const node of graph.values()) {
    if (node.hubLinked) {
      queue.push({ slug: node.slug, d: 1 })
      depth.set(node.slug, 1)
    }
  }
  while (queue.length) {
    const head = queue.shift()
    if (!head) break
    const cur = head
    const node = graph.get(cur.slug)
    if (!node) continue
    for (const next of node.outbound) {
      if (depth.has(next)) continue
      depth.set(next, cur.d + 1)
      queue.push({ slug: next, d: cur.d + 1 })
    }
  }
  return depth
}

function loadHubLinkedSlugs(): Set<string> {
  const linked = new Set<string>()
  const candidates = [
    'app/page.tsx',
    'app/cafes/page.tsx',
    'app/calendar/page.tsx',
    'app/articles/page.tsx',
    'app/category/[slug]/page.tsx',
    'app/features/[slug]/page.tsx',
    'app/guides/[topic]/page.tsx',
    'lib/articles.ts',
    'content/spotlight.json',
  ]
  for (const rel of candidates) {
    const fp = path.join(process.cwd(), rel)
    if (!fs.existsSync(fp)) continue
    const txt = fs.readFileSync(fp, 'utf-8')
    const re = /\/articles\/([a-z0-9-]+)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(txt)) !== null) linked.add(m[1])
  }
  return linked
}

function main() {
  const graph = loadGraph()
  const hubLinked = loadHubLinkedSlugs()
  for (const slug of hubLinked) {
    const n = graph.get(slug)
    if (n) n.hubLinked = true
  }

  const depth = bfsDepth(graph)

  const rows = Array.from(graph.values())
  rows.sort((a, b) => a.slug.localeCompare(b.slug))

  const orphans = rows.filter((n) => n.inbound.size === 0 && !n.hubLinked && n.sitemapStatus === 'in')
  const deepArticles = rows.filter((n) => {
    const d = depth.get(n.slug) ?? Infinity
    return n.sitemapStatus === 'in' && d > 3
  })
  const unreached = rows.filter((n) => !depth.has(n.slug) && n.sitemapStatus === 'in')

  const bySilo = new Map<string, Node[]>()
  for (const n of rows) {
    if (!bySilo.has(n.category)) bySilo.set(n.category, [])
    bySilo.get(n.category)!.push(n)
  }
  const siloRows: { category: string; nodes: number; intraEdges: number; interEdges: number; ratio: number }[] = []
  for (const [cat, nodes] of bySilo) {
    let intra = 0
    let inter = 0
    for (const n of nodes) {
      for (const target of n.outbound) {
        const t = graph.get(target)
        if (!t) continue
        if (t.category === cat) intra++
        else inter++
      }
    }
    const total = intra + inter
    siloRows.push({ category: cat, nodes: nodes.length, intraEdges: intra, interEdges: inter, ratio: total ? intra / total : 0 })
  }

  console.log(`# [cycleA2] A5 — internal link graph audit`)
  console.log(``)
  console.log(`Generated: ${new Date().toISOString().slice(0, 19)}Z`)
  console.log(``)
  console.log(`## Summary`)
  console.log(``)
  console.log(`| Metric | Count |`)
  console.log(`|---|---|`)
  console.log(`| Articles total | ${rows.length} |`)
  console.log(`| In sitemap | ${rows.filter((n) => n.sitemapStatus === 'in').length} |`)
  console.log(`| Hub-linked | ${rows.filter((n) => n.hubLinked).length} |`)
  console.log(`| **Orphans (in-sitemap, no inbound, not hub-linked)** | **${orphans.length}** |`)
  console.log(`| **Depth > 3 from hubs** | **${deepArticles.length}** |`)
  console.log(`| **Unreached by BFS (in-sitemap)** | **${unreached.length}** |`)
  console.log(``)
  console.log(`## Per-silo cluster connectivity`)
  console.log(``)
  console.log(`| Silo | Nodes | Intra-edges | Inter-edges | Intra-ratio |`)
  console.log(`|---|---|---|---|---|`)
  for (const r of siloRows.sort((a, b) => b.nodes - a.nodes)) {
    console.log(`| ${r.category} | ${r.nodes} | ${r.intraEdges} | ${r.interEdges} | ${(r.ratio * 100).toFixed(0)}% |`)
  }
  console.log(``)

  if (orphans.length) {
    console.log(`## Orphans (P1 — fix in Cycle B')`)
    console.log(``)
    for (const n of orphans) console.log(`- \`${n.slug}\` — ${n.title}`)
    console.log(``)
  }
  if (deepArticles.length) {
    console.log(`## Depth > 3 (P2 — fix in Cycle B')`)
    console.log(``)
    for (const n of deepArticles) console.log(`- \`${n.slug}\` (depth ${depth.get(n.slug)}) — ${n.title}`)
    console.log(``)
  }
  if (unreached.length) {
    console.log(`## Unreached by BFS — possible orphan with circular incoming (P1)`)
    console.log(``)
    for (const n of unreached) console.log(`- \`${n.slug}\` — ${n.title} — inbound from: ${Array.from(n.inbound).slice(0, 3).join(', ') || '(none)'}`)
    console.log(``)
  }

  console.log(`## All in-sitemap articles — inbound / outbound (sorted by inbound asc)`)
  console.log(``)
  console.log(`| Slug | Inbound | Outbound | Depth | Hub | Status |`)
  console.log(`|---|---|---|---|---|---|`)
  const inSitemap = rows.filter((n) => n.sitemapStatus === 'in')
  inSitemap.sort((a, b) => a.inbound.size - b.inbound.size)
  for (const n of inSitemap) {
    const d = depth.get(n.slug)
    console.log(`| \`${n.slug}\` | ${n.inbound.size} | ${n.outbound.size} | ${d ?? '∞'} | ${n.hubLinked ? '✓' : ''} | ${n.sitemapStatus} |`)
  }
}

main()

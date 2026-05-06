#!/usr/bin/env tsx
/**
 * Cycle B' / B2 — Originality / boilerplate audit via TF-IDF cosine similarity.
 *
 * For each pair of articles, computes:
 *   1. TF-IDF cosine similarity over body text (post-frontmatter, post-MDX-tag).
 *   2. Boilerplate ratio — how much of the doc is repeat sentences vs unique.
 *
 * Reports:
 *   - All pairs with cosine ≥ 0.5 (sorted desc)
 *   - Articles with boilerplate ratio ≥ 30%
 *   - Per-article unique-content stats
 *
 * Usage:
 *   npx tsx scripts/audit/originality-cosine.ts > docs/audit/cycleB-originality-20260506.md
 *
 * No external embedding API. TF-IDF is cheap, well-documented, and good enough
 * for "is this article a near-duplicate of that one" — which is the AdSense /
 * Google duplicate-content concern.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
  'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'in', 'on',
  'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 's', 't', 'just', 'don', 'now', 'd', 'll', 'm', 'o', 're', 've',
  'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven',
  'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren',
  'won', 'wouldn',
])

function strip(text: string): string {
  // Remove MDX/HTML tags, code fences, image/link syntax bits, frontmatter
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`>]/g, ' ')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .toLowerCase()
}

function tokenize(text: string): string[] {
  return strip(text)
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
}

type Doc = {
  slug: string
  title: string
  category: string
  body: string
  tokens: string[]
  tf: Map<string, number>
  vec: Map<string, number>
  norm: number
  boilerplateRatio: number
}

function buildDocs(): Doc[] {
  const docs: Doc[] = []
  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const slug = file.replace(/\.mdx?$/, '')
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8')
    const { data, content } = matter(raw.replace(/^﻿/, ''))

    const body = strip(content)
    const tokens = tokenize(content)
    const tf = new Map<string, number>()
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)

    docs.push({
      slug,
      title: typeof data.title === 'string' ? data.title : '(untitled)',
      category: typeof data.category === 'string' ? data.category : '(uncategorized)',
      body,
      tokens,
      tf,
      vec: new Map(),
      norm: 0,
      boilerplateRatio: 0,
    })
  }
  return docs
}

function computeIDF(docs: Doc[]): Map<string, number> {
  const df = new Map<string, number>()
  for (const d of docs) {
    for (const t of new Set(d.tf.keys())) df.set(t, (df.get(t) ?? 0) + 1)
  }
  const idf = new Map<string, number>()
  const N = docs.length
  for (const [t, c] of df) idf.set(t, Math.log(N / (1 + c)) + 1)
  return idf
}

function vectorize(docs: Doc[], idf: Map<string, number>) {
  for (const d of docs) {
    const len = d.tokens.length || 1
    for (const [t, freq] of d.tf) {
      const w = (freq / len) * (idf.get(t) ?? 0)
      d.vec.set(t, w)
    }
    let s = 0
    for (const w of d.vec.values()) s += w * w
    d.norm = Math.sqrt(s)
  }
}

function cosine(a: Doc, b: Doc): number {
  if (a.norm === 0 || b.norm === 0) return 0
  let dot = 0
  const small = a.vec.size < b.vec.size ? a.vec : b.vec
  const big = a.vec.size < b.vec.size ? b.vec : a.vec
  for (const [t, wa] of small) {
    const wb = big.get(t)
    if (wb !== undefined) dot += wa * wb
  }
  return dot / (a.norm * b.norm)
}

function computeBoilerplate(docs: Doc[]) {
  // Boilerplate = sentences appearing verbatim in 3+ articles.
  const sentenceCount = new Map<string, number>()
  const docSentences = new Map<string, string[]>()
  for (const d of docs) {
    const raw = d.body.replace(/\s+/g, ' ').trim()
    const sentences = raw
      .split(/(?<=\.)\s+/)
      .filter((s) => s.length > 30 && s.length < 500)
    docSentences.set(d.slug, sentences)
    for (const s of new Set(sentences)) {
      sentenceCount.set(s, (sentenceCount.get(s) ?? 0) + 1)
    }
  }
  for (const d of docs) {
    const sents = docSentences.get(d.slug) ?? []
    if (!sents.length) {
      d.boilerplateRatio = 0
      continue
    }
    let boiler = 0
    for (const s of sents) if ((sentenceCount.get(s) ?? 0) >= 3) boiler++
    d.boilerplateRatio = boiler / sents.length
  }
}

function main() {
  const docs = buildDocs()
  const idf = computeIDF(docs)
  vectorize(docs, idf)
  computeBoilerplate(docs)

  console.log(`# [cycleB'] B2 — originality / boilerplate cosine audit`)
  console.log(``)
  console.log(`Generated: ${new Date().toISOString().slice(0, 19)}Z`)
  console.log(`Articles: ${docs.length}`)
  console.log(``)

  const pairs: { a: Doc; b: Doc; sim: number }[] = []
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const sim = cosine(docs[i], docs[j])
      if (sim >= 0.5) pairs.push({ a: docs[i], b: docs[j], sim })
    }
  }
  pairs.sort((x, y) => y.sim - x.sim)

  const above07 = pairs.filter((p) => p.sim >= 0.7)
  const between0507 = pairs.filter((p) => p.sim >= 0.5 && p.sim < 0.7)

  console.log(`## Summary`)
  console.log(``)
  console.log(`| Bucket | Pair count |`)
  console.log(`|---|---|`)
  console.log(`| Cosine ≥ 0.7 (P1 — investigate merge/rewrite) | ${above07.length} |`)
  console.log(`| Cosine 0.5–0.7 (P2 — review for cluster overlap) | ${between0507.length} |`)
  console.log(`| Boilerplate ratio ≥ 30% | ${docs.filter((d) => d.boilerplateRatio >= 0.3).length} |`)
  console.log(``)

  if (above07.length) {
    console.log(`## Pairs with cosine ≥ 0.7 (P1)`)
    console.log(``)
    console.log(`| Cosine | Cat A | Slug A | Cat B | Slug B |`)
    console.log(`|---|---|---|---|---|`)
    for (const p of above07) {
      console.log(`| ${p.sim.toFixed(3)} | ${p.a.category} | \`${p.a.slug}\` | ${p.b.category} | \`${p.b.slug}\` |`)
    }
    console.log(``)
    console.log(`**Triage rules** (per cycle B' spec):`)
    console.log(`- Same IP, different venue (e.g. \`demon-slayer-meiji-mura\` vs \`demon-slayer-handmade-club\`) → keep both, tighten cross-links.`)
    console.log(`- Same IP, same venue, different period (e.g. \`tokyo-spring\` vs \`tokyo-summer\`) → MERGE candidate.`)
    console.log(`- Generic-topic overlap (e.g. two "esim guide" articles) → MERGE candidate.`)
    console.log(``)
  }

  if (between0507.length) {
    console.log(`## Pairs with cosine 0.5 – 0.7 (P2 — review only)`)
    console.log(``)
    console.log(`| Cosine | Slug A | Slug B |`)
    console.log(`|---|---|---|`)
    for (const p of between0507.slice(0, 30)) {
      console.log(`| ${p.sim.toFixed(3)} | \`${p.a.slug}\` | \`${p.b.slug}\` |`)
    }
    if (between0507.length > 30) console.log(`| ... | ${between0507.length - 30} more pairs | |`)
    console.log(``)
  }

  const heavyBoiler = docs.filter((d) => d.boilerplateRatio >= 0.3).sort((a, b) => b.boilerplateRatio - a.boilerplateRatio)
  if (heavyBoiler.length) {
    console.log(`## Articles with boilerplate ratio ≥ 30% (P2)`)
    console.log(``)
    console.log(`| Boilerplate | Slug |`)
    console.log(`|---|---|`)
    for (const d of heavyBoiler) console.log(`| ${(d.boilerplateRatio * 100).toFixed(0)}% | \`${d.slug}\` |`)
    console.log(``)
  }

  // Per-article max similarity (signals the cannibalization risk per article)
  const maxByDoc = docs.map((d) => {
    let max = 0
    let pair = ''
    for (const p of pairs) {
      if (p.a.slug === d.slug && p.sim > max) { max = p.sim; pair = p.b.slug }
      else if (p.b.slug === d.slug && p.sim > max) { max = p.sim; pair = p.a.slug }
    }
    return { slug: d.slug, max, pair, boiler: d.boilerplateRatio }
  })
  maxByDoc.sort((a, b) => b.max - a.max)

  console.log(`## Per-article max-similarity (top 30, sorted desc)`)
  console.log(``)
  console.log(`| Slug | Max cosine | Closest pair | Boilerplate |`)
  console.log(`|---|---|---|---|`)
  for (const m of maxByDoc.slice(0, 30)) {
    console.log(`| \`${m.slug}\` | ${m.max.toFixed(3)} | \`${m.pair || '-'}\` | ${(m.boiler * 100).toFixed(0)}% |`)
  }
  console.log(``)
  console.log(`(Articles whose max cosine < 0.5 omitted — they have no near-duplicate concerns.)`)
}

main()

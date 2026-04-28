#!/usr/bin/env node

/**
 * Price extraction (Bucket E1 of v3 adoption).
 *
 * Walks content/articles/*.mdx, extracts every monetary value mention
 * (¥XXX, X円, $X, X dollars, X yen, X euros), and pairs each with the
 * nearest preceding URL link in the article body. Outputs a flat list
 * for use by Bucket E2 (price verification batch via WebFetch).
 *
 * Usage:
 *   npx tsx scripts/price-audit/extract-prices.ts            # all articles
 *   npx tsx scripts/price-audit/extract-prices.ts <slug>     # one article
 *
 * Output:
 *   .tmp/price-audit/extracted.json — array of price records
 *   stdout — summary count by article
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

interface PriceRecord {
  slug: string
  category: string
  raw: string
  amount: number
  currency: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'KRW' | 'unknown'
  context: string
  nearestUrl: string | null
  lineNumber: number
}

const PRICE_PATTERNS: Array<{
  re: RegExp
  currency: PriceRecord['currency']
  toAmount: (m: RegExpMatchArray) => number
}> = [
  // ¥1,580 / ¥1580
  {
    re: /¥\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'JPY',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // 1,580円 / 1580円
  {
    re: /([0-9][0-9,]*(?:\.[0-9]+)?)\s?円/g,
    currency: 'JPY',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // 1,580 yen
  {
    re: /([0-9][0-9,]*(?:\.[0-9]+)?)\s+yen\b/gi,
    currency: 'JPY',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // $19.99 / $1,580
  {
    re: /\$\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'USD',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // 19.99 USD / 1580 USD
  {
    re: /([0-9][0-9,]*(?:\.[0-9]+)?)\s+USD\b/g,
    currency: 'USD',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // €19.99 / €1,580
  {
    re: /€\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'EUR',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // £19.99
  {
    re: /£\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'GBP',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // CN¥1580 (Chinese yuan, sometimes used for Klook listings)
  {
    re: /CN¥\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'CNY',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
  // ₩19,000 (Korean won)
  {
    re: /₩\s?([0-9][0-9,]*(?:\.[0-9]+)?)/g,
    currency: 'KRW',
    toAmount: (m) => Number(m[1].replace(/,/g, '')),
  },
]

const URL_RE = /https?:\/\/[^\s)"']+/g

function findNearestUrl(content: string, position: number): string | null {
  let nearest: string | null = null
  let nearestDistance = Infinity
  for (const m of content.matchAll(URL_RE)) {
    const idx = m.index ?? -1
    if (idx < 0) continue
    const distance = idx <= position ? position - idx : idx - position
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = m[0]
    }
  }
  return nearest
}

function getLineNumber(content: string, position: number): number {
  let line = 1
  for (let i = 0; i < position && i < content.length; i++) {
    if (content[i] === '\n') line++
  }
  return line
}

function getContext(content: string, position: number, raw: string): string {
  const start = Math.max(0, position - 60)
  const end = Math.min(content.length, position + raw.length + 60)
  return content.slice(start, end).replace(/\s+/g, ' ').trim()
}

function extractFromArticle(slug: string, fm: Record<string, unknown>, body: string): PriceRecord[] {
  const records: PriceRecord[] = []
  const seen = new Set<string>()

  for (const { re, currency, toAmount } of PRICE_PATTERNS) {
    re.lastIndex = 0
    for (const m of body.matchAll(re)) {
      const idx = m.index ?? -1
      if (idx < 0) continue
      const dedupeKey = `${idx}|${m[0]}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)

      const amount = toAmount(m)
      if (!Number.isFinite(amount) || amount <= 0) continue

      records.push({
        slug,
        category: (fm.category as string) || 'unknown',
        raw: m[0],
        amount,
        currency,
        context: getContext(body, idx, m[0]),
        nearestUrl: findNearestUrl(body, idx),
        lineNumber: getLineNumber(body, idx),
      })
    }
  }

  records.sort((a, b) => a.lineNumber - b.lineNumber)
  return records
}

function main() {
  const argSlug = process.argv[2]
  const all = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .filter((f) => !argSlug || f === `${argSlug}.mdx` || f === `${argSlug}.md`)

  if (all.length === 0) {
    console.error(`No articles matched (slug=${argSlug ?? 'all'})`)
    process.exit(1)
  }

  const allRecords: PriceRecord[] = []
  const perSlug: Record<string, number> = {}
  for (const f of all) {
    const full = path.join(ARTICLES_DIR, f)
    const raw = fs.readFileSync(full, 'utf8')
    const data = matter(raw)
    const slug = f.replace(/\.mdx?$/, '')
    const records = extractFromArticle(slug, data.data, data.content)
    allRecords.push(...records)
    perSlug[slug] = records.length
  }

  const tmpDir = path.join(process.cwd(), '.tmp/price-audit')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  const outPath = path.join(tmpDir, 'extracted.json')
  fs.writeFileSync(
    outPath,
    JSON.stringify({ extractedAt: '2026-04-28', count: allRecords.length, records: allRecords }, null, 2),
  )

  // Summary by currency
  const byCurrency: Record<string, number> = {}
  for (const r of allRecords) byCurrency[r.currency] = (byCurrency[r.currency] || 0) + 1
  const articlesWithPrices = Object.values(perSlug).filter((n) => n > 0).length

  console.log(`Articles scanned: ${all.length}`)
  console.log(`Articles with at least 1 price: ${articlesWithPrices}`)
  console.log(`Total price mentions: ${allRecords.length}`)
  console.log(`By currency:`, byCurrency)
  console.log(`Top 10 articles by price-mention count:`)
  Object.entries(perSlug)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([slug, n]) => console.log(`  ${n.toString().padStart(3)} ${slug}`))
  console.log(`Output: ${outPath}`)
}

main()

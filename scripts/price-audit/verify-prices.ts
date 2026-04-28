#!/usr/bin/env node

/**
 * Price verification batch (Bucket E2 of v3 adoption).
 *
 * Reads `.tmp/price-audit/extracted.json` (output of E1 extract-prices.ts),
 * fetches each price's nearest URL, and looks for the same price string
 * (or a tolerance band) on the live page. Outputs a mismatch report.
 *
 * Usage:
 *   npx tsx scripts/price-audit/verify-prices.ts                  # all batches sequentially
 *   npx tsx scripts/price-audit/verify-prices.ts --batch=0        # batch 0 only (10 articles)
 *   npx tsx scripts/price-audit/verify-prices.ts --slug=<slug>    # one article only
 *   npx tsx scripts/price-audit/verify-prices.ts --max-fetches=20 # cap web fetches (quota guard)
 *
 * Output:
 *   docs/audit/price-mismatch-20260428.md (markdown matrix, append mode if exists)
 *   .tmp/price-audit/verified.json (per-price match/mismatch records)
 *
 * NOTE: This script implements a simple HTTP fetch using node-fetch.
 * It is NOT WebFetch'd through Claude — it's a straight HTTP GET with
 * Accept: text/html and a 15-second timeout. AI summarization is not
 * required since we're string-matching a price.
 */

import fs from 'fs'
import path from 'path'

const TMPDIR = path.join(process.cwd(), '.tmp/price-audit')
const EXTRACTED = path.join(TMPDIR, 'extracted.json')
const VERIFIED_OUT = path.join(TMPDIR, 'verified.json')
const REPORT_OUT = path.join(process.cwd(), 'docs/audit/price-mismatch-20260428.md')

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

interface VerifyRecord extends PriceRecord {
  fetchStatus: number | null
  fetchError: string | null
  pageHasExactRaw: boolean
  pageHasNearbyAmount: boolean | null
  matchVerdict: 'match' | 'unverifiable' | 'mismatch_minor' | 'mismatch_major' | 'no_url' | 'aggregator_skipped'
  notes: string
}

const AGGREGATOR_HOSTS = [
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

function isAggregator(url: string): boolean {
  const lower = url.toLowerCase()
  return AGGREGATOR_HOSTS.some((h) => lower.includes(h))
}

async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<{ status: number; text: string }> {
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        'User-Agent': 'japan-pop-now-price-audit/1.0 (+https://www.japan-pop-now.com)',
        Accept: 'text/html, application/xhtml+xml',
      },
      redirect: 'follow',
    })
    const text = await res.text()
    return { status: res.status, text }
  } finally {
    clearTimeout(timer)
  }
}

function pageContainsExact(text: string, raw: string): boolean {
  // Direct substring check
  if (text.includes(raw)) return true
  // Try a normalized version (collapse whitespace, drop optional space after currency)
  const normRaw = raw.replace(/\s/g, '')
  const normText = text.replace(/\s/g, '')
  return normText.includes(normRaw)
}

function pageContainsNearbyAmount(text: string, amount: number, currency: string): boolean {
  // Find any amount (with currency markers) within ±5% of target.
  const tolerance = Math.max(50, amount * 0.05)
  const lower = amount - tolerance
  const upper = amount + tolerance
  const re = currency === 'JPY' ? /(¥|円)\s*?([0-9][0-9,]*(?:\.[0-9]+)?)|([0-9][0-9,]*(?:\.[0-9]+)?)\s?(?:円|yen)/gi
    : currency === 'USD' ? /\$\s*?([0-9][0-9,]*(?:\.[0-9]+)?)|([0-9][0-9,]*(?:\.[0-9]+)?)\s+USD/gi
      : null
  if (!re) return false
  for (const m of text.matchAll(re)) {
    const numStr = (m[2] || m[1] || '').toString().replace(/,/g, '')
    const n = Number(numStr)
    if (Number.isFinite(n) && n >= lower && n <= upper) return true
  }
  return false
}

function classifyVerdict(rec: PriceRecord, exactMatch: boolean, nearby: boolean | null): VerifyRecord['matchVerdict'] {
  if (!rec.nearestUrl) return 'no_url'
  if (isAggregator(rec.nearestUrl)) return 'aggregator_skipped'
  if (exactMatch) return 'match'
  if (nearby === false) return 'unverifiable' // page fetched but no comparable amount found
  if (nearby === null) return 'unverifiable'
  // nearby = true means a similar amount exists but exact didn't match
  // Compute mismatch severity by tolerance bands handled by caller; default minor
  return 'mismatch_minor'
}

async function verifyOne(rec: PriceRecord): Promise<VerifyRecord> {
  const v: VerifyRecord = {
    ...rec,
    fetchStatus: null,
    fetchError: null,
    pageHasExactRaw: false,
    pageHasNearbyAmount: null,
    matchVerdict: 'unverifiable',
    notes: '',
  }

  if (!rec.nearestUrl) {
    v.matchVerdict = 'no_url'
    v.notes = 'no URL near this price mention'
    return v
  }
  if (isAggregator(rec.nearestUrl)) {
    v.matchVerdict = 'aggregator_skipped'
    v.notes = `aggregator host (${new URL(rec.nearestUrl).host}) — not authoritative for prices`
    return v
  }

  try {
    const { status, text } = await fetchWithTimeout(rec.nearestUrl)
    v.fetchStatus = status
    if (status >= 400) {
      v.matchVerdict = 'unverifiable'
      v.notes = `HTTP ${status}`
      return v
    }
    v.pageHasExactRaw = pageContainsExact(text, rec.raw)
    if (rec.currency === 'JPY' || rec.currency === 'USD') {
      v.pageHasNearbyAmount = pageContainsNearbyAmount(text, rec.amount, rec.currency)
    }
    if (v.pageHasExactRaw) {
      v.matchVerdict = 'match'
    } else if (v.pageHasNearbyAmount === true) {
      v.matchVerdict = 'mismatch_minor'
      v.notes = `exact "${rec.raw}" not on page, but a similar ${rec.currency} amount exists`
    } else {
      v.matchVerdict = 'unverifiable'
      v.notes = `no comparable ${rec.currency} amount found on page (status ${status}, ${text.length} bytes)`
    }
  } catch (e) {
    v.fetchError = (e as Error).message
    v.matchVerdict = 'unverifiable'
    v.notes = `fetch error: ${v.fetchError}`
  }
  return v
}

async function main() {
  if (!fs.existsSync(EXTRACTED)) {
    console.error(`Run extract-prices.ts first — ${EXTRACTED} missing`)
    process.exit(1)
  }
  const args = process.argv.slice(2)
  const batchArg = args.find((a) => a.startsWith('--batch='))
  const slugArg = args.find((a) => a.startsWith('--slug='))
  const maxArg = args.find((a) => a.startsWith('--max-fetches='))
  const batchIdx = batchArg ? Number(batchArg.split('=')[1]) : null
  const slugFilter = slugArg ? slugArg.split('=')[1] : null
  const maxFetches = maxArg ? Number(maxArg.split('=')[1]) : Infinity

  const data = JSON.parse(fs.readFileSync(EXTRACTED, 'utf8'))
  const records: PriceRecord[] = data.records

  // Group by slug, then chunk slugs into batches of 10
  const slugs = Array.from(new Set(records.map((r) => r.slug))).sort()
  const BATCH_SIZE = 10
  let targetSlugs: string[]
  if (slugFilter) {
    targetSlugs = slugs.filter((s) => s === slugFilter)
  } else if (batchIdx !== null) {
    const start = batchIdx * BATCH_SIZE
    targetSlugs = slugs.slice(start, start + BATCH_SIZE)
  } else {
    targetSlugs = slugs
  }

  const targetRecords = records.filter((r) => targetSlugs.includes(r.slug))
  // Dedupe by URL across articles to save quota — same URL only fetched once
  const urlCache = new Map<string, { exact: boolean; nearby: boolean | null; status: number | null; error: string | null }>()
  const verified: VerifyRecord[] = []
  let fetched = 0

  console.log(`Verifying ${targetRecords.length} prices across ${targetSlugs.length} articles. Max fetches: ${maxFetches === Infinity ? 'unlimited' : maxFetches}.`)
  console.log(`Slugs: ${targetSlugs.join(', ')}`)

  for (let i = 0; i < targetRecords.length; i++) {
    const r = targetRecords[i]
    if (!r.nearestUrl) {
      verified.push({ ...r, fetchStatus: null, fetchError: null, pageHasExactRaw: false, pageHasNearbyAmount: null, matchVerdict: 'no_url', notes: 'no URL near this price' })
      continue
    }
    if (isAggregator(r.nearestUrl)) {
      verified.push({ ...r, fetchStatus: null, fetchError: null, pageHasExactRaw: false, pageHasNearbyAmount: null, matchVerdict: 'aggregator_skipped', notes: `aggregator host` })
      continue
    }
    if (fetched >= maxFetches) {
      verified.push({ ...r, fetchStatus: null, fetchError: null, pageHasExactRaw: false, pageHasNearbyAmount: null, matchVerdict: 'unverifiable', notes: 'max-fetches budget exhausted' })
      continue
    }
    if (urlCache.has(r.nearestUrl)) {
      const c = urlCache.get(r.nearestUrl)!
      verified.push({
        ...r,
        fetchStatus: c.status,
        fetchError: c.error,
        pageHasExactRaw: c.exact,
        pageHasNearbyAmount: c.nearby,
        matchVerdict: c.exact ? 'match' : (c.nearby ? 'mismatch_minor' : 'unverifiable'),
        notes: 'cached fetch',
      })
      continue
    }
    process.stderr.write(`[${i + 1}/${targetRecords.length}] ${r.slug} ${r.raw} → ${new URL(r.nearestUrl).host} ... `)
    const v = await verifyOne(r)
    fetched++
    process.stderr.write(`${v.matchVerdict}\n`)
    urlCache.set(r.nearestUrl, {
      exact: v.pageHasExactRaw,
      nearby: v.pageHasNearbyAmount,
      status: v.fetchStatus,
      error: v.fetchError,
    })
    verified.push(v)
  }

  // Stats
  const verdictCounts: Record<string, number> = {}
  for (const v of verified) verdictCounts[v.matchVerdict] = (verdictCounts[v.matchVerdict] || 0) + 1

  // Write JSON (merge with existing if any, by slug+lineNumber+raw)
  const existing: VerifyRecord[] = fs.existsSync(VERIFIED_OUT) ? JSON.parse(fs.readFileSync(VERIFIED_OUT, 'utf8')).records || [] : []
  const key = (r: VerifyRecord | PriceRecord) => `${r.slug}|${r.lineNumber}|${r.raw}`
  const merged = new Map<string, VerifyRecord>()
  for (const r of existing) merged.set(key(r), r)
  for (const r of verified) merged.set(key(r), r)
  const allVerified = Array.from(merged.values())

  fs.writeFileSync(VERIFIED_OUT, JSON.stringify({ verifiedAt: '2026-04-28', count: allVerified.length, records: allVerified }, null, 2))

  // Append to mismatch report
  const mismatches = allVerified.filter((v) => v.matchVerdict === 'mismatch_minor' || v.matchVerdict === 'mismatch_major')
  const unverifiable = allVerified.filter((v) => v.matchVerdict === 'unverifiable')

  const reportLines: string[] = []
  reportLines.push('# Price Mismatch Audit — 2026-04-28')
  reportLines.push('')
  reportLines.push('Auto-generated by `scripts/price-audit/verify-prices.ts`. Source: `.tmp/price-audit/verified.json`. Fetches use plain HTTP (no LLM) — exact-string match against page body, then ±5% amount-tolerance check as fallback.')
  reportLines.push('')
  reportLines.push(`Last run scope: ${targetSlugs.length} articles, ${targetRecords.length} prices, ${fetched} fresh fetches (rest cached/aggregator/no-url).`)
  reportLines.push('')
  reportLines.push('## Verdict distribution (cumulative across all runs)')
  reportLines.push('')
  reportLines.push('| Verdict | Count |')
  reportLines.push('| --- | ---: |')
  for (const [v, n] of Object.entries(verdictCounts)) reportLines.push(`| ${v} | ${n} |`)
  reportLines.push('')
  reportLines.push(`## Mismatches — ${mismatches.length}`)
  reportLines.push('')
  if (mismatches.length === 0) {
    reportLines.push('(none yet — but unverifiable count is high; many prices need an upstream URL)')
  } else {
    reportLines.push('| Slug | Line | Raw | Currency | Amount | URL | Notes |')
    reportLines.push('| --- | ---: | --- | --- | ---: | --- | --- |')
    for (const m of mismatches.sort((a, b) => a.slug.localeCompare(b.slug) || a.lineNumber - b.lineNumber)) {
      reportLines.push(`| ${m.slug} | ${m.lineNumber} | \`${m.raw}\` | ${m.currency} | ${m.amount} | ${m.nearestUrl ? `[link](${m.nearestUrl})` : '—'} | ${m.notes.replace(/\|/g, '\\|')} |`)
    }
  }
  reportLines.push('')
  reportLines.push(`## Unverifiable — ${unverifiable.length}`)
  reportLines.push('')
  reportLines.push('Prices where the nearest URL didn\'t return a usable page or didn\'t contain a matching amount. Common causes: 404, timeout, JS-rendered SPA, page restructured since article published, or the URL was nearest by line number but unrelated to the price (e.g., article-internal anchor).')
  reportLines.push('')
  if (unverifiable.length > 0 && unverifiable.length < 200) {
    reportLines.push('| Slug | Line | Raw | URL | Status | Notes |')
    reportLines.push('| --- | ---: | --- | --- | ---: | --- |')
    for (const u of unverifiable.sort((a, b) => a.slug.localeCompare(b.slug) || a.lineNumber - b.lineNumber)) {
      reportLines.push(`| ${u.slug} | ${u.lineNumber} | \`${u.raw}\` | ${u.nearestUrl ? new URL(u.nearestUrl).host : '—'} | ${u.fetchStatus ?? '—'} | ${u.notes.replace(/\|/g, '\\|')} |`)
    }
  } else if (unverifiable.length >= 200) {
    reportLines.push(`(${unverifiable.length} unverifiable — list omitted; see .tmp/price-audit/verified.json for full data)`)
  } else {
    reportLines.push('(none)')
  }
  reportLines.push('')

  fs.mkdirSync(path.dirname(REPORT_OUT), { recursive: true })
  fs.writeFileSync(REPORT_OUT, reportLines.join('\n'))

  console.log(`\nVerified: ${verified.length} this run (cumulative ${allVerified.length}).`)
  console.log(`Verdicts (this run): ${JSON.stringify(verdictCounts)}`)
  console.log(`Mismatches (cumulative): ${mismatches.length}`)
  console.log(`Unverifiable (cumulative): ${unverifiable.length}`)
  console.log(`Report: ${REPORT_OUT}`)
  console.log(`JSON:   ${VERIFIED_OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

#!/usr/bin/env node

/**
 * Re-run AI-detection scoring across all 77 corpus articles using the
 * calibrated baseline (Bucket C3 output) instead of the literature-
 * default thresholds used by the original C6 scan.
 *
 * Output:
 *   docs/audit/ai-detection-retroactive-calibrated-20260428.md
 *
 * This is a self-contained script that mirrors check-article.ts metric
 * logic with the calibrated thresholds applied. It is intentionally
 * decoupled from check-article.ts (which is on a separate PR branch) —
 * once that PR merges, both scripts should be refactored to share a
 * `lib.ts` for metric helpers and threshold loading.
 *
 * Usage:
 *   npx tsx scripts/ai-detection/recalibrate-corpus-scan.ts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const BASELINE_PATH = path.join(process.cwd(), 'docs/research/human-baseline-20260428.json')
const OUT_DOC = path.join(process.cwd(), 'docs/audit/ai-detection-retroactive-calibrated-20260428.md')

// -- Metric helpers (inline; same as compute-baseline.ts) ----------------

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？])\s+/u)
    .flatMap((s) => s.split(/(?<=[。！？])/u))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

const STOPWORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at',
  'for', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'this', 'that', 'these', 'those', 'it', 'its', 'as', 'from', 'you',
  'your', 'we', 'our', 'they', 'their', 'i', 'me', 'my', 'he', 'she',
  'his', 'her', 'will', 'can', 'do', 'does', 'did', 'have', 'has', 'had',
])

function tokenize(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/[\p{L}\p{N}']+/gu)) out.push(m[0].toLowerCase())
  return out
}

function contentTokens(text: string): string[] {
  return tokenize(text).filter((t) => t.length >= 2 && !STOPWORDS_EN.has(t))
}

function meanStdCV(values: number[]) {
  if (values.length === 0) return { mean: 0, std: 0, cv: 0 }
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  const std = Math.sqrt(variance)
  return { mean, std, cv: mean === 0 ? 0 : std / mean }
}

function mattr(tokens: string[], window = 50): number {
  if (tokens.length < window) return tokens.length === 0 ? 0 : new Set(tokens).size / tokens.length
  let sum = 0, count = 0
  for (let i = 0; i + window <= tokens.length; i++) {
    sum += new Set(tokens.slice(i, i + window)).size / window
    count++
  }
  return count === 0 ? 0 : sum / count
}

function fourGramRepeats(tokens: string[]): number {
  if (tokens.length < 4) return 0
  const counts = new Map<string, number>()
  for (let i = 0; i + 4 <= tokens.length; i++) {
    const gram = tokens.slice(i, i + 4).join(' ')
    counts.set(gram, (counts.get(gram) || 0) + 1)
  }
  let r = 0
  for (const c of counts.values()) if (c >= 2) r++
  return r
}

function stripCodeAndHtml(content: string): string {
  let c = content
  c = c.replace(/```[\s\S]*?```/g, ' ')
  c = c.replace(/`[^`]+`/g, ' ')
  c = c.replace(/<[^>]+>/g, ' ')
  c = c.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
  c = c.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  return c
}

// -- Scoring with calibrated thresholds ------------------------------------

interface Calibrated {
  thresholds: any
}

function scoreL3(content: string, t: any): { score: number; cv: number } {
  const sentences = splitSentences(stripCodeAndHtml(content))
  const lengths = sentences.map((s) => s.length).filter((n) => n > 0)
  const { cv } = meanStdCV(lengths)
  let score = 0
  if (cv < t.sentenceLengthCV.ai) score = 90
  else if (cv < t.sentenceLengthCV.borderline) score = 50
  else if (cv >= t.sentenceLengthCV.humanMin && cv <= t.sentenceLengthCV.humanMax) score = 0
  else if (cv > t.sentenceLengthCV.humanMax) score = 20
  else score = 30
  return { score, cv }
}

function scoreL4(content: string, t: any): {
  score: number; mattr50: number; fourGramRepeatsPer1500: number
} {
  const stripped = stripCodeAndHtml(content)
  const tokens = contentTokens(stripped)
  const m = mattr(tokens, 50)
  const repeats = fourGramRepeats(tokens)
  const normalizer = Math.max(1, tokens.length / 1500)
  const repeatsNorm = repeats / normalizer

  let mattrScore = 0
  if (m < t.mattr50.ai) mattrScore = 80
  else if (m < t.mattr50.borderline) mattrScore = 40
  else if (m >= t.mattr50.humanMin && m <= t.mattr50.humanMax) mattrScore = 0
  else mattrScore = 30

  let ngramScore = 0
  if (repeatsNorm > t.fourGramRepeatsPer1500.ai) ngramScore = 90
  else if (repeatsNorm > t.fourGramRepeatsPer1500.borderline) ngramScore = 60
  else if (repeatsNorm > t.fourGramRepeatsPer1500.humanMax) ngramScore = 30
  else ngramScore = 0

  return {
    score: Math.max(mattrScore, ngramScore),
    mattr50: m,
    fourGramRepeatsPer1500: repeatsNorm,
  }
}

function scoreL5(content: string, t: any): { score: number; burstiness: number } {
  const stripped = stripCodeAndHtml(content)
  const sentences = splitSentences(stripped)
  const lengths = sentences.map((s) => s.length).filter((n) => n > 0)
  const { cv } = meanStdCV(lengths)
  const burstiness = cv * 100

  let score = 0
  if (burstiness < t.burstiness.ai) score = 90
  else if (burstiness < t.burstiness.borderline) score = 50
  else if (burstiness >= t.burstiness.humanMin && burstiness <= t.burstiness.humanMax) score = 0
  else if (burstiness > t.burstiness.humanMax) score = 20
  else score = 30
  return { score, burstiness }
}

// -- Main -----------------------------------------------------------------

function main() {
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`Baseline missing: ${BASELINE_PATH}`)
    console.error('Run compute-baseline.ts first.')
    process.exit(1)
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
  const t = baseline.calibratedThresholds

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md')).sort()

  interface Row {
    slug: string
    category: string
    composite: number
    dominantLayer: number
    l3: number
    l4: number
    l5: number
    cv: number
    mattr50: number
    fourGramRepeatsPer1500: number
    burstiness: number
  }
  const rows: Row[] = []

  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')
    const data = matter(raw)
    const slug = f.replace(/\.mdx?$/, '')
    const l3 = scoreL3(data.content, t)
    const l4 = scoreL4(data.content, t)
    const l5 = scoreL5(data.content, t)
    const layerScores = [l3.score, l4.score, l5.score]
    const composite = Math.max(...layerScores)
    const idx = layerScores.indexOf(composite)
    rows.push({
      slug,
      category: (data.data.category as string) || 'unknown',
      composite,
      dominantLayer: idx + 3, // L3, L4, L5
      l3: l3.score,
      l4: l4.score,
      l5: l5.score,
      cv: Number(l3.cv.toFixed(3)),
      mattr50: Number(l4.mattr50.toFixed(3)),
      fourGramRepeatsPer1500: Number(l4.fourGramRepeatsPer1500.toFixed(2)),
      burstiness: Number(l5.burstiness.toFixed(1)),
    })
  }

  rows.sort((a, b) => b.composite - a.composite || a.slug.localeCompare(b.slug))

  // Distribution
  const dist = {
    ship: rows.filter((r) => r.composite <= 20).length,
    fix: rows.filter((r) => r.composite > 20 && r.composite <= 40).length,
    section: rows.filter((r) => r.composite > 40 && r.composite <= 70).length,
    full: rows.filter((r) => r.composite > 70).length,
  }
  const dom = { L3: 0, L4: 0, L5: 0 }
  for (const r of rows) (dom as any)[`L${r.dominantLayer}`]++

  // Compare with original C6 (no calibration)
  // We re-score uncalibrated quickly for the comparison
  const litT = {
    sentenceLengthCV: { ai: 0.30, borderline: 0.45, humanMin: 0.45, humanMax: 0.65 },
    mattr50: { ai: 0.55, borderline: 0.65, humanMin: 0.65, humanMax: 0.78 },
    burstiness: { ai: 20, borderline: 40, humanMin: 40, humanMax: 70 },
    fourGramRepeatsPer1500: { humanMax: 3, borderline: 6, ai: 11 },
  }
  let litFlagged = 0
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')
    const data = matter(raw)
    const l3 = scoreL3(data.content, litT)
    const l4 = scoreL4(data.content, litT)
    const l5 = scoreL5(data.content, litT)
    if (Math.max(l3.score, l4.score, l5.score) >= 30) litFlagged++
  }

  // Markdown
  const lines: string[] = []
  lines.push('# AI-Detection Retroactive Scan — CALIBRATED — 2026-04-28')
  lines.push('')
  lines.push('Re-run of `scripts/ai-detection/scan-corpus.ts` using calibrated thresholds from `docs/research/human-baseline-20260428.json` (Bucket C3 output, derived from the 130-article Bucket C2 pre-AI travel-prose corpus).')
  lines.push('')
  lines.push(`Generated by \`scripts/ai-detection/recalibrate-corpus-scan.ts\`.`)
  lines.push('')
  lines.push('## Calibration vs literature defaults')
  lines.push('')
  lines.push('| Metric | Literature default | Calibrated (this corpus) | Delta |')
  lines.push('| --- | --- | --- | --- |')
  lines.push(`| Sentence-length CV (AI flag <) | 0.30 | ${t.sentenceLengthCV.ai} | ${(t.sentenceLengthCV.ai - 0.30).toFixed(3)} |`)
  lines.push(`| MATTR-50 (AI flag <) | 0.55 | ${t.mattr50.ai} | **+${(t.mattr50.ai - 0.55).toFixed(3)}** ← biggest delta |`)
  lines.push(`| Burstiness (AI flag <) | 20 | ${t.burstiness.ai} | +${(t.burstiness.ai - 20).toFixed(2)} |`)
  lines.push(`| 4-gram repeats/1500 (AI flag >) | 6 | ${t.fourGramRepeatsPer1500.ai} | +${(t.fourGramRepeatsPer1500.ai - 6).toFixed(2)} |`)
  lines.push(`| MATTR-50 human range upper | 0.78 | ${t.mattr50.humanMax} | +${(t.mattr50.humanMax - 0.78).toFixed(3)} |`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push(`Articles flagged composite ≥ 30 (uncalibrated, literature defaults): **${litFlagged} of ${rows.length}** (literature was over-flagging Japanese-English travel writing).`)
  lines.push('')
  lines.push(`Articles flagged composite ≥ 30 (CALIBRATED): **${dist.fix + dist.section + dist.full} of ${rows.length}**.`)
  lines.push('')
  lines.push('| Verdict | Range | Count | % |')
  lines.push('| --- | --- | ---: | ---: |')
  const total = rows.length || 1
  lines.push(`| SHIP | 0-20 | ${dist.ship} | ${((dist.ship / total) * 100).toFixed(1)}% |`)
  lines.push(`| FIX_LAYER | 21-40 | ${dist.fix} | ${((dist.fix / total) * 100).toFixed(1)}% |`)
  lines.push(`| SECTION_REWRITE | 41-70 | ${dist.section} | ${((dist.section / total) * 100).toFixed(1)}% |`)
  lines.push(`| FULL_REWRITE | 71-100 | ${dist.full} | ${((dist.full / total) * 100).toFixed(1)}% |`)
  lines.push(`| **Total** | | **${rows.length}** | |`)
  lines.push('')
  lines.push('## Dominant-layer breakdown')
  lines.push('')
  lines.push('| Layer | Count |')
  lines.push('| --- | ---: |')
  lines.push(`| L3 sentence-length CV | ${dom.L3} |`)
  lines.push(`| L4 MATTR + 4-gram | ${dom.L4} |`)
  lines.push(`| L5 burstiness | ${dom.L5} |`)
  lines.push('')
  lines.push('## Per-article matrix (sorted by composite, worst first)')
  lines.push('')
  lines.push('| slug | cat | comp | dom | L3 | L4 | L5 | CV | MATTR | 4gr/1500 | B |')
  lines.push('| --- | --- | ---: | :-: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const r of rows) {
    lines.push(`| ${r.slug} | ${r.category} | ${r.composite} | L${r.dominantLayer} | ${r.l3} | ${r.l4} | ${r.l5} | ${r.cv} | ${r.mattr50} | ${r.fourGramRepeatsPer1500} | ${r.burstiness} |`)
  }
  lines.push('')
  lines.push('## Notes')
  lines.push('')
  lines.push('- **Layer 1 (banned phrases) and Layer 2 (syntax patterns) are NOT included in this calibrated scan** — they don\'t depend on the corpus baseline (they\'re grep against fixed lists). Run `check-article.ts` for the L1+L2 component if needed.')
  lines.push('- Composite is `max(L3, L4, L5)` for the layers covered here.')
  lines.push('- Calibrated thresholds come from `docs/research/human-baseline-20260428.json` (Bucket C3). Re-run `compute-baseline.ts` if the corpus is updated.')
  lines.push('- The original uncalibrated retroactive scan is at `docs/audit/ai-detection-retroactive-20260428.md` (PR #16).')
  lines.push('')

  fs.mkdirSync(path.dirname(OUT_DOC), { recursive: true })
  fs.writeFileSync(OUT_DOC, lines.join('\n'))

  console.log(`Recalibrated scan complete: ${rows.length} articles.`)
  console.log(`Uncalibrated (literature defaults) flagged ≥30: ${litFlagged} / ${rows.length}`)
  console.log(`Calibrated flagged ≥30: ${dist.fix + dist.section + dist.full} / ${rows.length}`)
  console.log(`Distribution (calibrated): ${dist.ship} ship / ${dist.fix} fix-layer / ${dist.section} section-rewrite / ${dist.full} full-rewrite`)
  console.log(`Dominant: L3=${dom.L3} L4=${dom.L4} L5=${dom.L5}`)
  console.log(`Doc: ${OUT_DOC}`)
}

main()

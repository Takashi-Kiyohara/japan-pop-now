#!/usr/bin/env node

/**
 * Compute human-baseline statistics from the pre-AI corpus
 * (Bucket C3 of v3 adoption).
 *
 * Reads `.tmp/pre-ai-corpus/*.txt` (collected in C2), computes the
 * Layer 3-5 statistical metrics from `jpn-anti-ai-detection` Skill on
 * each, and produces a per-metric distribution (mean / std / min / max
 * / p10 / p50 / p90) at `docs/research/human-baseline-20260428.json`.
 *
 * Also derives **z-score-based calibrated thresholds** for use by
 * `check-article.ts` and `scan-corpus.ts`. The AI-flag threshold per
 * metric is set at the corpus mean − 2σ (or +2σ depending on direction
 * of the metric), so an article flagged AI has prose statistics
 * deviating > 2 standard deviations from human travel-prose norms.
 *
 * Usage:
 *   npx tsx scripts/ai-detection/compute-baseline.ts
 *
 * Output:
 *   docs/research/human-baseline-20260428.json
 *   stdout — summary of per-metric distributions and recommended thresholds
 */

import fs from 'fs'
import path from 'path'
import {
  contentTokens,
  fourGramRepeats,
  mattr,
  meanStdCV,
  paragraphLengths,
  splitSentences,
  tokenize,
} from './lib'

const CORPUS_DIR = path.join(process.cwd(), '.tmp/pre-ai-corpus')
const OUTPUT_PATH = path.join(process.cwd(), 'docs/research/human-baseline-20260428.json')

// -- Per-article metric pack ----------------------------------------------

interface ArticleMetrics {
  filename: string
  wordCount: number
  sentenceCount: number
  sentenceLengthCV: number
  mattr50: number
  fourGramRepeatsPer1500: number  // length-normalized
  burstiness: number              // = sentence-length CV × 100
  paragraphLengthCV: number
}

function scoreOne(filename: string, content: string): ArticleMetrics {
  const sentences = splitSentences(content)
  const lengths = sentences.map((s) => s.length).filter((n) => n > 0)
  const { cv } = meanStdCV(lengths)

  const tokens = contentTokens(content)
  const m50 = mattr(tokens, 50)
  const repeats = fourGramRepeats(tokens)
  const normalizer = Math.max(1, tokens.length / 1500)

  const paraLens = paragraphLengths(content)
  const para = meanStdCV(paraLens)

  return {
    filename,
    wordCount: tokenize(content).length,
    sentenceCount: sentences.length,
    sentenceLengthCV: cv,
    mattr50: m50,
    fourGramRepeatsPer1500: repeats / normalizer,
    burstiness: cv * 100,
    paragraphLengthCV: para.cv,
  }
}

// -- Distribution stats ---------------------------------------------------

function distribution(values: number[]) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length
  const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / sorted.length
  const std = Math.sqrt(variance)
  const pick = (q: number) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(q * sorted.length)))]
  return {
    n: sorted.length,
    mean: Number(mean.toFixed(4)),
    std: Number(std.toFixed(4)),
    min: Number(sorted[0].toFixed(4)),
    max: Number(sorted[sorted.length - 1].toFixed(4)),
    p10: Number(pick(0.1).toFixed(4)),
    p50: Number(pick(0.5).toFixed(4)),
    p90: Number(pick(0.9).toFixed(4)),
  }
}

// -- Main -----------------------------------------------------------------

function main() {
  if (!fs.existsSync(CORPUS_DIR)) {
    console.error(`Corpus dir missing: ${CORPUS_DIR}`)
    console.error('Run C2 corpus collection first (or check the .gitignored .tmp/pre-ai-corpus/ exists locally).')
    process.exit(1)
  }

  const files = fs.readdirSync(CORPUS_DIR).filter((f) => f.endsWith('.txt'))
  if (files.length === 0) {
    console.error('No .txt files in corpus dir.')
    process.exit(1)
  }

  console.log(`Loading ${files.length} corpus files from ${CORPUS_DIR}...`)
  const metrics: ArticleMetrics[] = []
  for (const f of files) {
    const content = fs.readFileSync(path.join(CORPUS_DIR, f), 'utf8')
    if (content.length < 400) continue  // skip empty / tiny
    metrics.push(scoreOne(f, content))
  }

  if (metrics.length === 0) {
    console.error('No valid corpus articles after filtering.')
    process.exit(1)
  }

  console.log(`Computed metrics for ${metrics.length} articles.`)

  // Aggregate distributions
  const dists = {
    sentenceLengthCV: distribution(metrics.map((m) => m.sentenceLengthCV)),
    mattr50: distribution(metrics.map((m) => m.mattr50)),
    fourGramRepeatsPer1500: distribution(metrics.map((m) => m.fourGramRepeatsPer1500)),
    burstiness: distribution(metrics.map((m) => m.burstiness)),
    paragraphLengthCV: distribution(metrics.map((m) => m.paragraphLengthCV)),
  }

  // Source breakdown
  const sourceTags = ['wikivoyage', 'atlas-obscura', 'natgeo', 'wayback', 'blog']
  const bySource: Record<string, number> = {}
  for (const m of metrics) {
    const tag = sourceTags.find((t) => m.filename.toLowerCase().startsWith(t)) || 'other'
    bySource[tag] = (bySource[tag] || 0) + 1
  }

  // Calibrated thresholds: z-score-based.
  // For metrics where higher = more human (CV, MATTR, burstiness, paraCV):
  //   AI flag if value < mean - 2σ (≥2σ below human mean)
  //   Borderline if mean-2σ <= value < mean-1σ
  // For metrics where higher = more AI (4-gram repeats):
  //   AI flag if value > mean + 2σ
  //   Borderline if mean+1σ < value <= mean+2σ
  function thrLower(d: NonNullable<ReturnType<typeof distribution>>) {
    return {
      ai: Number((d.mean - 2 * d.std).toFixed(4)),
      borderline: Number((d.mean - 1 * d.std).toFixed(4)),
      humanMin: Number((d.mean - 0.5 * d.std).toFixed(4)),
      humanMax: Number((d.mean + 1.5 * d.std).toFixed(4)),
    }
  }
  function thrUpper(d: NonNullable<ReturnType<typeof distribution>>) {
    return {
      humanMin: Number((d.mean - 1.5 * d.std).toFixed(4)),
      humanMax: Number((d.mean + 0.5 * d.std).toFixed(4)),
      borderline: Number((d.mean + 1 * d.std).toFixed(4)),
      ai: Number((d.mean + 2 * d.std).toFixed(4)),
    }
  }

  const baseline = {
    computedAt: '2026-04-28',
    corpus: {
      file: '.tmp/pre-ai-corpus/*.txt',
      sourceListDoc: 'docs/research/pre-ai-corpus-20260428.md',
      articleCount: metrics.length,
      totalWords: metrics.reduce((a, b) => a + b.wordCount, 0),
      sourceBreakdown: bySource,
    },
    methodology: {
      direction: 'For sentence-length CV / MATTR-50 / burstiness / paragraph-length CV: HIGHER = more human-like (variance, lexical diversity). For 4-gram repetition: HIGHER = more AI-like.',
      thresholds: 'AI-flag at 2σ from human mean (in the AI-direction); borderline at 1σ; human-target straddles the mean.',
      caveat: 'Travel-writing register only. Calibrate separately for academic prose, journalism, technical writing.',
    },
    distributions: dists,
    calibratedThresholds: {
      sentenceLengthCV: thrLower(dists.sentenceLengthCV!),
      mattr50: thrLower(dists.mattr50!),
      burstiness: thrLower(dists.burstiness!),
      paragraphLengthCV: thrLower(dists.paragraphLengthCV!),
      fourGramRepeatsPer1500: thrUpper(dists.fourGramRepeatsPer1500!),
    },
    perArticle: metrics,  // optional: kept for reproducibility
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(baseline, null, 2))

  console.log('\n=== Distributions ===')
  for (const [k, d] of Object.entries(dists)) {
    if (!d) continue
    console.log(`  ${k.padEnd(28)} mean=${d.mean.toString().padEnd(8)} std=${d.std.toString().padEnd(8)} p10=${d.p10.toString().padEnd(8)} p90=${d.p90.toString().padEnd(8)}  (n=${d.n})`)
  }

  console.log('\n=== Calibrated thresholds (vs. literature defaults) ===')
  const lit = {
    sentenceLengthCV: { ai: 0.30, humanMin: 0.45, humanMax: 0.65 },
    mattr50: { ai: 0.55, humanMin: 0.65, humanMax: 0.78 },
    burstiness: { ai: 20, humanMin: 40, humanMax: 70 },
    fourGramRepeatsPer1500: { ai: 6 },
  }
  console.log(`  sentenceLengthCV  AI<: ${baseline.calibratedThresholds.sentenceLengthCV.ai} (lit: <${lit.sentenceLengthCV.ai}) | human range: ${baseline.calibratedThresholds.sentenceLengthCV.humanMin}-${baseline.calibratedThresholds.sentenceLengthCV.humanMax} (lit: ${lit.sentenceLengthCV.humanMin}-${lit.sentenceLengthCV.humanMax})`)
  console.log(`  mattr50           AI<: ${baseline.calibratedThresholds.mattr50.ai} (lit: <${lit.mattr50.ai}) | human range: ${baseline.calibratedThresholds.mattr50.humanMin}-${baseline.calibratedThresholds.mattr50.humanMax} (lit: ${lit.mattr50.humanMin}-${lit.mattr50.humanMax})`)
  console.log(`  burstiness        AI<: ${baseline.calibratedThresholds.burstiness.ai} (lit: <${lit.burstiness.ai}) | human range: ${baseline.calibratedThresholds.burstiness.humanMin}-${baseline.calibratedThresholds.burstiness.humanMax} (lit: ${lit.burstiness.humanMin}-${lit.burstiness.humanMax})`)
  console.log(`  fourGramRepeats   AI>: ${baseline.calibratedThresholds.fourGramRepeatsPer1500.ai} (lit: >${lit.fourGramRepeatsPer1500.ai})`)
  console.log(`\nOutput: ${OUTPUT_PATH}`)
}

main()

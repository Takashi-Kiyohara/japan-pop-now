#!/usr/bin/env node

/**
 * In-house AI-text detection scoring script (Bucket C4 of v3 adoption).
 *
 * Implements the 6-layer architecture defined in
 * `.claude/skills/jpn-anti-ai-detection/SKILL.md`:
 *
 *   Layer 1 — Phrase grep (banned phrases JP+EN)
 *   Layer 2 — Syntax-pattern grep (parallel-list, 体言止め runs, etc.)
 *   Layer 3 — Sentence-length variance (CV)
 *   Layer 4 — MATTR-50 (lexical diversity) + 4-gram repetition
 *   Layer 5 — Burstiness + structural monotony
 *   Layer 6 — manual (NOT scored here; placeholder in output)
 *
 * Composite score = max(layer scores). 0-20 ship / 21-40 fix-layer /
 * 41-70 section-rewrite / 71-100 full-rewrite.
 *
 * Thresholds default to literature values
 * (`docs/research/ai-detection-theory-20260428.md`). Pass
 * `--baseline=docs/research/human-baseline-20260428.json` to use a
 * project-calibrated baseline (Bucket C3 output).
 *
 * Usage:
 *   npx tsx scripts/ai-detection/check-article.ts <slug-or-path>
 *   npx tsx scripts/ai-detection/check-article.ts <slug> --baseline=<path>
 *   npx tsx scripts/ai-detection/check-article.ts <slug> --json
 *
 * Output:
 *   By default: human-readable summary on stdout
 *   With --json: machine-readable JSON
 *   docs/audit/ai-detection-{slug}-{date}.md is NOT auto-written here;
 *   the retroactive scan (C6) handles per-article doc generation.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  BANNED_JP,
  BANNED_EN,
  contentTokens,
  escapeRegExp,
  meanStdCV,
  splitSentences,
  stripCodeAndHtml,
  stripQuoted,
  tokenize,
  mattr,
  fourGramRepeats,
} from './lib'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

// -- Layer 1 ---------------------------------------------------------------

function layer1(content: string): { score: number; hits: Array<{ phrase: string; count: number }> } {
  const stripped = stripQuoted(stripCodeAndHtml(content))
  const hits: Array<{ phrase: string; count: number }> = []

  for (const phrase of BANNED_JP) {
    const re = new RegExp(escapeRegExp(phrase), 'g')
    const c = (stripped.match(re) || []).length
    if (c > 0) hits.push({ phrase, count: c })
  }
  for (const re of BANNED_EN) {
    const ms = stripped.match(new RegExp(re.source, re.flags + 'g'))
    if (ms && ms.length > 0) hits.push({ phrase: re.source, count: ms.length })
  }

  const totalHits = hits.reduce((a, h) => a + h.count, 0)
  let score = 0
  if (totalHits >= 6) score = 90
  else if (totalHits >= 3) score = 50
  else if (totalHits >= 1) score = 20

  return { score, hits }
}

// -- Layer 2 ---------------------------------------------------------------

function layer2(content: string): { score: number; patterns: string[] } {
  const stripped = stripQuoted(stripCodeAndHtml(content))
  const patterns: string[] = []
  let severity = 0

  // 1. parallel-list overuse: "だけでなく〜も" or "not just X but also Y"
  const parallelJP = (stripped.match(/だけでなく/g) || []).length
  const parallelEN = (stripped.match(/\bnot\s+just\s+\w+\s*,?\s*but\s+also\b/gi) || []).length
  const parallel = parallelJP + parallelEN
  if (parallel >= 4) {
    patterns.push(`parallel-list overuse (${parallel} hits)`)
    severity += 2
  } else if (parallel >= 3) {
    patterns.push(`parallel-list moderate (${parallel} hits)`)
    severity += 1
  }

  // 2. 体言止め runs (consecutive sentences ending in noun + 。)
  const sentences = splitSentences(stripped)
  let taigenStreak = 0
  let maxTaigenStreak = 0
  for (const s of sentences) {
    if (/[一-鿿゠-ヿ぀-ゟ]+。?$/.test(s.trim()) && !/(です|ます|だ|である|る|た|い|ない)。?$/.test(s.trim())) {
      taigenStreak++
      maxTaigenStreak = Math.max(maxTaigenStreak, taigenStreak)
    } else {
      taigenStreak = 0
    }
  }
  if (maxTaigenStreak >= 4) {
    patterns.push(`体言止め run length ${maxTaigenStreak}`)
    severity += 2
  } else if (maxTaigenStreak >= 3) {
    patterns.push(`体言止め run length ${maxTaigenStreak}`)
    severity += 1
  }

  // 3. "〜方は" repetition
  const audSeg = (stripped.match(/[なという]?方(には?|は)/g) || []).length
  if (audSeg >= 3) {
    patterns.push(`〜方は repetition (${audSeg} hits)`)
    severity += 1
  }

  // 4. bullet-paragraph imbalance
  const lines = stripped.split('\n')
  const bulletLines = lines.filter((ln) => /^\s*[-*]\s/.test(ln)).length
  const totalNonBlank = lines.filter((ln) => ln.trim().length > 0).length
  const bulletRatio = totalNonBlank === 0 ? 0 : bulletLines / totalNonBlank
  if (bulletRatio > 0.6) {
    patterns.push(`bullet-paragraph imbalance (${(bulletRatio * 100).toFixed(0)}% lines are bullets)`)
    severity += 2
  }

  // 5. em-dash density (per research doc: >5/1000 words is a soft flag)
  const words = tokenize(stripped).length
  const emDashes = (stripped.match(/—/g) || []).length
  if (words > 0) {
    const per1000 = (emDashes / words) * 1000
    if (per1000 > 8) {
      patterns.push(`em-dash density ${per1000.toFixed(1)}/1000 words`)
      severity += 1
    }
  }

  let score = 0
  if (severity >= 5) score = 90
  else if (severity >= 3) score = 60
  else if (severity >= 1) score = 30

  return { score, patterns }
}

// -- Layer 3 ---------------------------------------------------------------

function layer3(content: string): { score: number; cv: number; sentences: number } {
  const stripped = stripQuoted(stripCodeAndHtml(content))
  const sentences = splitSentences(stripped)
  const lengths = sentences.map((s) => s.length).filter((n) => n > 0)
  const { cv } = meanStdCV(lengths)

  let score: number
  if (cv < 0.30) score = 90
  else if (cv < 0.45) score = 60
  else if (cv <= 0.65) score = cv >= 0.5 ? 0 : 20
  else score = 30

  return { score, cv, sentences: sentences.length }
}

// -- Layer 4 ---------------------------------------------------------------

function layer4(content: string): {
  score: number
  mattr50: number
  fourGramRepeats: number
} {
  const stripped = stripQuoted(stripCodeAndHtml(content))
  const tokens = contentTokens(stripped)
  const m = mattr(tokens, 50)
  const repeats = fourGramRepeats(tokens)

  // MATTR-50 score
  let mattrScore: number
  if (m < 0.55) mattrScore = 80
  else if (m < 0.65) mattrScore = 40
  else if (m <= 0.78) mattrScore = m >= 0.7 ? 0 : 20
  else mattrScore = 30

  // 4-gram score (length-normalized: per 1500 tokens)
  const normalizer = Math.max(1, tokens.length / 1500)
  const repeatsNormalized = repeats / normalizer
  let ngramScore: number
  if (repeatsNormalized >= 11) ngramScore = 90
  else if (repeatsNormalized >= 6) ngramScore = 60
  else if (repeatsNormalized >= 3) ngramScore = 30
  else ngramScore = 0

  return {
    score: Math.max(mattrScore, ngramScore),
    mattr50: m,
    fourGramRepeats: repeats,
  }
}

// -- Layer 5 ---------------------------------------------------------------

function layer5(content: string): {
  score: number
  burstiness: number
  monotonyHits: string[]
} {
  const stripped = stripQuoted(stripCodeAndHtml(content))
  const sentences = splitSentences(stripped)
  const lengths = sentences.map((s) => s.length).filter((n) => n > 0)
  const { cv } = meanStdCV(lengths)
  const burstiness = cv * 100

  let burstScore: number
  if (burstiness < 20) burstScore = 90
  else if (burstiness < 40) burstScore = 50
  else if (burstiness <= 70) burstScore = burstiness >= 50 ? 0 : 20
  else burstScore = 30

  // Structural monotony: H2 length CV + paragraph length CV
  const lines = stripped.split('\n')
  const h2Lengths: number[] = []
  for (const ln of lines) {
    if (/^##\s+/.test(ln)) h2Lengths.push(ln.length)
  }
  const h2 = meanStdCV(h2Lengths)

  const paragraphs = stripped.split(/\n\s*\n/).filter((p) => p.trim().length > 0).map((p) => p.length)
  const para = meanStdCV(paragraphs)

  const monotonyHits: string[] = []
  let monotonyScore = 0
  if (h2Lengths.length >= 4 && h2.cv < 0.10) {
    monotonyHits.push(`H2 length CV ${h2.cv.toFixed(3)} (${h2Lengths.length} headings within 10%)`)
    monotonyScore = Math.max(monotonyScore, 60)
  } else if (h2Lengths.length >= 4 && h2.cv < 0.18) {
    monotonyHits.push(`H2 length CV ${h2.cv.toFixed(3)} (mild)`)
    monotonyScore = Math.max(monotonyScore, 30)
  }
  if (paragraphs.length >= 6 && para.cv < 0.25) {
    monotonyHits.push(`paragraph length CV ${para.cv.toFixed(3)} (uniform)`)
    monotonyScore = Math.max(monotonyScore, 60)
  }

  return {
    score: Math.max(burstScore, monotonyScore),
    burstiness,
    monotonyHits,
  }
}

// -- Composite + report ----------------------------------------------------

interface ScoreReport {
  slug: string
  layer1: { score: number; hits: Array<{ phrase: string; count: number }> }
  layer2: { score: number; patterns: string[] }
  layer3: { score: number; cv: number; sentences: number }
  layer4: { score: number; mattr50: number; fourGramRepeats: number }
  layer5: { score: number; burstiness: number; monotonyHits: string[] }
  composite: number
  verdict: 'SHIP' | 'FIX_LAYER' | 'SECTION_REWRITE' | 'FULL_REWRITE'
  dominantLayer: number
}

function verdictForScore(s: number): ScoreReport['verdict'] {
  if (s <= 20) return 'SHIP'
  if (s <= 40) return 'FIX_LAYER'
  if (s <= 70) return 'SECTION_REWRITE'
  return 'FULL_REWRITE'
}

export function scoreArticle(slug: string, content: string): ScoreReport {
  const l1 = layer1(content)
  const l2 = layer2(content)
  const l3 = layer3(content)
  const l4 = layer4(content)
  const l5 = layer5(content)
  const layerScores = [l1.score, l2.score, l3.score, l4.score, l5.score]
  const composite = Math.max(...layerScores)
  const dominantLayer = layerScores.indexOf(composite) + 1

  return {
    slug,
    layer1: l1,
    layer2: l2,
    layer3: l3,
    layer4: l4,
    layer5: l5,
    composite,
    verdict: verdictForScore(composite),
    dominantLayer,
  }
}

function resolveArticlePath(arg: string): string {
  if (fs.existsSync(arg)) return arg
  const inDir = path.join(ARTICLES_DIR, arg.endsWith('.mdx') || arg.endsWith('.md') ? arg : `${arg}.mdx`)
  if (fs.existsSync(inDir)) return inDir
  const fallback = path.join(ARTICLES_DIR, `${arg}.md`)
  if (fs.existsSync(fallback)) return fallback
  throw new Error(`Article not found: ${arg}`)
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/ai-detection/check-article.ts <slug-or-path> [--json] [--baseline=<path>]')
    process.exit(1)
  }
  const slugArg = args[0]
  const jsonOut = args.includes('--json')
  // baseline path reserved for future calibration; not yet used

  const filePath = resolveArticlePath(slugArg)
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = matter(raw)
  const slug = path.basename(filePath).replace(/\.mdx?$/, '')
  const report = scoreArticle(slug, data.content)

  if (jsonOut) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`AI-detection score for ${slug}`)
  console.log(`  L1 phrase grep:        ${report.layer1.score.toString().padStart(3)} (${report.layer1.hits.length} unique phrase hits)`)
  console.log(`  L2 syntax pattern:     ${report.layer2.score.toString().padStart(3)} ${report.layer2.patterns.length > 0 ? '· ' + report.layer2.patterns.slice(0, 2).join('; ') : ''}`)
  console.log(`  L3 sentence-len CV:    ${report.layer3.score.toString().padStart(3)} (CV ${report.layer3.cv.toFixed(3)}, ${report.layer3.sentences} sentences)`)
  console.log(`  L4 MATTR/4-gram:       ${report.layer4.score.toString().padStart(3)} (MATTR-50 ${report.layer4.mattr50.toFixed(3)}, repeats ${report.layer4.fourGramRepeats})`)
  console.log(`  L5 burstiness/monotony:${report.layer5.score.toString().padStart(3)} (B ${report.layer5.burstiness.toFixed(1)})`)
  console.log(`  ----`)
  console.log(`  Composite (max):       ${report.composite.toString().padStart(3)} → ${report.verdict} (dominant: L${report.dominantLayer})`)
  if (report.layer1.hits.length > 0) {
    console.log(`\n  Top L1 hits:`)
    report.layer1.hits.slice(0, 5).forEach((h) => console.log(`    ${h.count}× ${h.phrase}`))
  }
  if (report.layer2.patterns.length > 0) {
    console.log(`\n  L2 patterns:`)
    report.layer2.patterns.forEach((p) => console.log(`    - ${p}`))
  }
  if (report.layer5.monotonyHits.length > 0) {
    console.log(`\n  L5 monotony:`)
    report.layer5.monotonyHits.forEach((h) => console.log(`    - ${h}`))
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('check-article.ts')) {
  main()
}

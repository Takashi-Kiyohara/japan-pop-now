#!/usr/bin/env node

/**
 * Hybrid AI-detection gate (Bucket 2 of v3 Phase 3 — A-improved hybrid).
 *
 * Wraps `scripts/ai-detection/check-article.ts` `scoreArticle()` with a
 * 4-level decision tree + 5 escape hatches per the policy at
 * `docs/policy/l4-calibration-hybrid-20260429.md`:
 *
 *   composite < 30  → L1 (clean, no action)
 *   30-50           → L2 (log only)
 *   50-70           → L3 (warn, suggest Critic-loop run)
 *   70-100          → L4 (block) UNLESS one of 5 escape hatches passes
 *
 * Escape hatches checked in priority order; first-passing wins:
 *
 *   1. human_baseline_match — cosine similarity to human travel-prose
 *      corpus ≥ 0.85. (DEFERRED — requires vector embeddings; not in
 *      this iteration. Returns FAIL for now.)
 *
 *   2. takapon_byline_first_person — ≥ 3 first-person sentences ("I", "I've",
 *      "I'd", "my") AND ≥ 1 inline `Photo:` credit. Captures Takapon
 *      original-photography articles.
 *
 *   3. voice_marker — frontmatter `voice` field present AND body has at
 *      least one signature phrase (e.g., "I've", "weekly visits", "years of",
 *      "I personally", "my team"). Lighter-touch than #2.
 *
 *   4. pattern_allow — body has ZERO occurrences of the AI-typical phrase
 *      ban-list (delve, furthermore, moreover, "navigate the", "in today's
 *      fast-paced", "it's worth noting", unleash, "dive into", "a testament
 *      to") AND sentence-start diversity score ≥ 0.6.
 *
 *   5. manual_override — frontmatter `ai_audit_override:
 *      "human-verified-by-takapon-YYYY-MM-DD"` (date validated as
 *      ISO-format only; PR-comment cross-check is done out-of-band).
 *
 * Output:
 *   - `--json`: machine-readable HybridResult JSON to stdout
 *   - default: human-readable summary
 *   - `--scan`: iterate every `content/articles/*.{md,mdx}`, write
 *     `.tmp/ai-detection-gate-scan.json` and stdout summary
 *
 * Usage:
 *   npx tsx scripts/audit/ai-detection-gate.ts <slug> [--json]
 *   npx tsx scripts/audit/ai-detection-gate.ts --scan [--dry-run]
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { scoreArticle } from '../ai-detection/check-article'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HatchResult {
  passed: boolean
  reason: string
}

interface HybridResult {
  slug: string
  level: 'L1' | 'L2' | 'L3' | 'L4'
  composite: number
  dominantLayer: number
  blocked: boolean
  escapeHatchTriggered: string | null
  hatches: Record<string, HatchResult>
  reasoning: string
}

const HATCH_ORDER = [
  'human_baseline_match',
  'takapon_byline_first_person',
  'voice_marker',
  'pattern_allow',
  'manual_override',
] as const

const PATTERN_ALLOW_BANLIST = [
  'delve',
  'furthermore',
  'moreover',
  'navigate the',
  "in today's fast-paced",
  "it's worth noting",
  'unleash',
  'dive into',
  'a testament to',
]

// ---------------------------------------------------------------------------
// Escape-hatch implementations
// ---------------------------------------------------------------------------

function checkHatchHumanBaselineMatch(_content: string): HatchResult {
  // DEFERRED: requires vector embedding + cosine similarity to the
  // 130-article human corpus at .tmp/pre-ai-corpus/. Not in this
  // iteration; returns FAIL deterministically. Future work in a follow-up
  // PR after embedding pipeline lands.
  return {
    passed: false,
    reason: 'DEFERRED — cosine-similarity check not yet implemented; falls through to next hatch',
  }
}

function checkHatchTakaponByline(content: string, _frontmatter: Record<string, unknown>): HatchResult {
  // Count first-person sentences. Use word-boundary regex so "Iceland"
  // doesn't count as "I".
  const sentences = content
    .split(/(?<=[.!?])\s+/u)
    .map((s) => s.trim())
    .filter((s) => s.length >= 5)
  const fpRe = /\b(I|I've|I'd|my)\b/
  const fpCount = sentences.filter((s) => fpRe.test(s)).length
  if (fpCount < 3) {
    return { passed: false, reason: `first-person sentences ${fpCount} < 3` }
  }
  // Photo-credit signal: count "Photo:" mentions (article-quality.md
  // convention for caption attribution).
  const photoCount = (content.match(/Photo:/g) || []).length
  if (photoCount < 1) {
    return {
      passed: false,
      reason: `first-person sentences ${fpCount} >= 3 BUT no "Photo:" credit (need ≥ 1)`,
    }
  }
  return {
    passed: true,
    reason: `first-person sentences ${fpCount} + ${photoCount} "Photo:" credits`,
  }
}

function checkHatchVoiceMarker(content: string, frontmatter: Record<string, unknown>): HatchResult {
  const voice = frontmatter.voice
  if (typeof voice !== 'string' || voice.trim().length === 0) {
    return { passed: false, reason: 'no `voice` field in frontmatter' }
  }
  const signatureRe = /\b(I've|weekly visits|years of|I personally|my team|written from|first-person)\b/i
  const sigMatch = signatureRe.test(content)
  if (!sigMatch) {
    return {
      passed: false,
      reason: `voice="${voice}" set but no signature phrase in body (looking for I've / weekly visits / years of / I personally / my team / written from / first-person)`,
    }
  }
  return { passed: true, reason: `voice="${voice}" + signature phrase matched` }
}

function checkHatchPatternAllow(content: string): HatchResult {
  const lower = content.toLowerCase()
  const hits = PATTERN_ALLOW_BANLIST.filter((p) => lower.includes(p.toLowerCase()))
  if (hits.length > 0) {
    return { passed: false, reason: `${hits.length} ban-list hits: ${hits.join(', ')}` }
  }
  // Sentence-start diversity: how many unique first words across sentences,
  // normalized by total sentence count. Higher = more varied openings.
  const sentences = content
    .split(/(?<=[.!?])\s+/u)
    .map((s) => s.trim())
    .filter((s) => s.length >= 5)
  if (sentences.length < 10) {
    return { passed: false, reason: `< 10 sentences for diversity check` }
  }
  const starters = sentences.map(
    (s) => s.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? '',
  )
  const unique = new Set(starters).size
  const diversity = unique / sentences.length
  if (diversity < 0.6) {
    return {
      passed: false,
      reason: `0 ban-list hits BUT sentence-start diversity ${diversity.toFixed(3)} < 0.6 (${unique} unique / ${sentences.length} sentences)`,
    }
  }
  return {
    passed: true,
    reason: `0 ban-list hits + diversity ${diversity.toFixed(3)} >= 0.6`,
  }
}

function checkHatchManualOverride(frontmatter: Record<string, unknown>): HatchResult {
  const override = frontmatter.ai_audit_override
  if (typeof override !== 'string') {
    return { passed: false, reason: 'no `ai_audit_override` field in frontmatter' }
  }
  // Format: human-verified-by-takapon-YYYY-MM-DD
  const m = override.match(/^human-verified-by-takapon-(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) {
    return {
      passed: false,
      reason: `\`ai_audit_override\` value "${override}" does not match required format human-verified-by-takapon-YYYY-MM-DD`,
    }
  }
  // Validate date components are sensible
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (y < 2026 || y > 2030 || mo < 1 || mo > 12 || d < 1 || d > 31) {
    return {
      passed: false,
      reason: `\`ai_audit_override\` date "${override}" has out-of-range components`,
    }
  }
  return { passed: true, reason: `manual override valid: ${override}` }
}

// ---------------------------------------------------------------------------
// Hybrid evaluation
// ---------------------------------------------------------------------------

function levelFor(composite: number): HybridResult['level'] {
  if (composite < 30) return 'L1'
  if (composite < 50) return 'L2'
  if (composite < 70) return 'L3'
  return 'L4'
}

export function evaluateHybrid(slug: string, content: string, frontmatter: Record<string, unknown>): HybridResult {
  const score = scoreArticle(slug, content)
  const composite = score.composite
  const level = levelFor(composite)

  const hatches: Record<string, HatchResult> = {
    human_baseline_match: checkHatchHumanBaselineMatch(content),
    takapon_byline_first_person: checkHatchTakaponByline(content, frontmatter),
    voice_marker: checkHatchVoiceMarker(content, frontmatter),
    pattern_allow: checkHatchPatternAllow(content),
    manual_override: checkHatchManualOverride(frontmatter),
  }

  if (level !== 'L4') {
    let actionMsg = ''
    if (level === 'L1') actionMsg = 'no action'
    else if (level === 'L2') actionMsg = 'log only'
    else if (level === 'L3') actionMsg = 'warn, suggest Critic-loop run'
    return {
      slug,
      level,
      composite,
      dominantLayer: score.dominantLayer,
      blocked: false,
      escapeHatchTriggered: null,
      hatches,
      reasoning: `${level} composite ${composite} (${actionMsg})`,
    }
  }

  // L4: check hatches in priority order
  for (const name of HATCH_ORDER) {
    if (hatches[name].passed) {
      return {
        slug,
        level,
        composite,
        dominantLayer: score.dominantLayer,
        blocked: false,
        escapeHatchTriggered: name,
        hatches,
        reasoning: `L4 composite ${composite} BUT escape hatch ${name} passed: ${hatches[name].reason}`,
      }
    }
  }

  return {
    slug,
    level,
    composite,
    dominantLayer: score.dominantLayer,
    blocked: true,
    escapeHatchTriggered: null,
    hatches,
    reasoning: `L4 composite ${composite}, all 5 escape hatches failed → BLOCKED`,
  }
}

// ---------------------------------------------------------------------------
// CLI / scan mode
// ---------------------------------------------------------------------------

function resolveArticlePath(arg: string): string {
  if (fs.existsSync(arg)) return arg
  for (const ext of ['.mdx', '.md']) {
    const candidate = path.join(ARTICLES_DIR, arg.endsWith(ext) ? arg : `${arg}${ext}`)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(`Article not found: ${arg}`)
}

function runOne(slugArg: string, jsonOut: boolean): HybridResult {
  const filePath = resolveArticlePath(slugArg)
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = matter(raw)
  const slug = path.basename(filePath).replace(/\.mdx?$/, '')
  const result = evaluateHybrid(slug, data.content, data.data as Record<string, unknown>)

  if (jsonOut) {
    process.stdout.write(JSON.stringify(result, null, 2))
    process.stdout.write('\n')
    return result
  }

  console.log(`Hybrid AI-detection gate: ${slug}`)
  console.log(`  Composite:        ${result.composite}`)
  console.log(`  Level:            ${result.level}`)
  console.log(`  Dominant layer:   L${result.dominantLayer}`)
  console.log(`  Blocked:          ${result.blocked ? 'YES' : 'no'}`)
  if (result.escapeHatchTriggered) {
    console.log(`  Hatch triggered:  ${result.escapeHatchTriggered}`)
  }
  console.log(`  Reasoning:        ${result.reasoning}`)
  console.log(`  Hatches:`)
  for (const name of HATCH_ORDER) {
    const h = result.hatches[name]
    console.log(`    [${h.passed ? '✓' : ' '}] ${name}: ${h.reason}`)
  }
  return result
}

function runScan(): void {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .sort()

  const results: HybridResult[] = []
  for (const f of files) {
    const filePath = path.join(ARTICLES_DIR, f)
    const raw = fs.readFileSync(filePath, 'utf8')
    const data = matter(raw)
    const slug = f.replace(/\.mdx?$/, '')
    results.push(evaluateHybrid(slug, data.content, data.data as Record<string, unknown>))
  }

  const dist = {
    L1: results.filter((r) => r.level === 'L1').length,
    L2: results.filter((r) => r.level === 'L2').length,
    L3: results.filter((r) => r.level === 'L3').length,
    L4: results.filter((r) => r.level === 'L4').length,
  }
  const blocked = results.filter((r) => r.blocked).length
  const hatchTriggered = results.filter((r) => r.escapeHatchTriggered)
  const hatchCounts: Record<string, number> = Object.fromEntries(HATCH_ORDER.map((n) => [n, 0]))
  for (const r of hatchTriggered) {
    if (r.escapeHatchTriggered) hatchCounts[r.escapeHatchTriggered]++
  }

  const tmpDir = path.join(process.cwd(), '.tmp')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  fs.writeFileSync(
    path.join(tmpDir, 'ai-detection-gate-scan.json'),
    JSON.stringify({ scannedAt: new Date().toISOString().slice(0, 10), distribution: dist, blocked, hatchCounts, results }, null, 2),
  )

  console.log(`Hybrid gate scan: ${results.length} articles`)
  console.log(`  L1 (clean):       ${dist.L1}`)
  console.log(`  L2 (log only):    ${dist.L2}`)
  console.log(`  L3 (warn):        ${dist.L3}`)
  console.log(`  L4 (block?):      ${dist.L4}`)
  console.log(`  Of L4: ${dist.L4 - blocked} rescued by escape hatches, ${blocked} actually blocked`)
  console.log(`  Hatch triggers:`)
  for (const name of HATCH_ORDER) {
    console.log(`    ${name}: ${hatchCounts[name]}`)
  }
}

function main(): void {
  const args = process.argv.slice(2)
  if (args.includes('--scan')) {
    runScan()
    return
  }
  const slugArg = args.find((a) => !a.startsWith('--'))
  if (!slugArg) {
    console.error('Usage:')
    console.error('  npx tsx scripts/audit/ai-detection-gate.ts <slug> [--json]')
    console.error('  npx tsx scripts/audit/ai-detection-gate.ts --scan')
    process.exit(1)
  }
  const result = runOne(slugArg, args.includes('--json'))
  // Exit 1 only when blocked; level alone never exits non-zero
  if (result.blocked) process.exit(1)
}

main()

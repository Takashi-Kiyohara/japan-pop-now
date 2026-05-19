/**
 * R19-S3 W5 — calibration (Draft 2 §"w5-calibrate.mjs").
 *
 * Extract μ+σ for the 3 ESL-baseline metrics from the 5
 * human-confirmed firsthand articles (lib/audit/calibration-baseline.json),
 * so scoreE subtracts Takashi's personal style baseline (R2 R-1 ESL FP fix).
 *
 * Pure + deterministic (no network, fixed input set) → idempotent. Exported
 * for w5-content-triage.mjs to import; runnable standalone to inspect/freeze
 * the baseline to /tmp/w5-baseline.json.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { randomUUID } from 'node:crypto'
import process from 'node:process'
import {
  REPO, readArticleBySlug, stripSections, countEmDash, wordCount,
  countBoilerplate, stdDevSentenceLength, mean, stdDev, round4,
} from './w5-lib.mjs'

export function calibrate() {
  const cb = JSON.parse(
    fs.readFileSync(path.join(REPO, 'lib', 'audit', 'calibration-baseline.json'), 'utf-8'),
  )
  const slugs = cb.human_confirmed_articles || []
  const acc = { em_dash_density: [], boilerplate_hits: [], sentence_length_variance: [] }
  const used = []
  for (const slug of slugs) {
    const a = readArticleBySlug(slug) // .mdx→.md safe (3/5 are .md)
    if (!a) {
      console.error(`[calibrate] WARN: calibration article not found: ${slug}`)
      continue
    }
    const body = stripSections(a.content)
    const wc = wordCount(body) || 1
    acc.em_dash_density.push((countEmDash(body) / wc) * 100)
    acc.boilerplate_hits.push(countBoilerplate(body))
    acc.sentence_length_variance.push(stdDevSentenceLength(body))
    used.push(slug)
  }
  if (used.length === 0) throw new Error('[calibrate] FATAL: 0 calibration articles resolved')
  return {
    _meta: { calibrated_from: used, n: used.length, active_method: cb.active_method },
    em_dash_density: { mu: round4(mean(acc.em_dash_density)), sigma: round4(stdDev(acc.em_dash_density)) },
    boilerplate_hits: { mu: round4(mean(acc.boilerplate_hits)), sigma: round4(stdDev(acc.boilerplate_hits)) },
    sentence_length_variance: { mu: round4(mean(acc.sentence_length_variance)), sigma: round4(stdDev(acc.sentence_length_variance)) },
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('w5-calibrate.mjs')) {
  const baseline = calibrate()
  // R19-S4 F4 (CodeQL): predictable /tmp path was symlink-attackable.
  // Use os.tmpdir() + an unguessable filename.
  const out = path.join(os.tmpdir(), `w5-baseline-${randomUUID()}.json`)
  fs.writeFileSync(out, JSON.stringify(baseline, null, 2))
  console.log(JSON.stringify(baseline, null, 2))
  console.error(`[calibrate] baseline written → ${out} (n=${baseline._meta.n})`)
}

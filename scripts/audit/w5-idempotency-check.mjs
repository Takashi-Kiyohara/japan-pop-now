/**
 * R19-S3 W5 — idempotency verifier (Critic R-2 patch E).
 *
 * Usage: node scripts/audit/w5-idempotency-check.mjs <run1.json> <run2.json>
 * PASS iff: same slug set, bucket.type identical per slug, every numeric
 * score field differs by < 0.001. Exit 1 on any violation.
 */
import fs from 'node:fs'
import process from 'node:process'

const [, , f1, f2] = process.argv
if (!f1 || !f2) { console.error('usage: w5-idempotency-check.mjs <run1.json> <run2.json>'); process.exit(2) }
const r1 = JSON.parse(fs.readFileSync(f1, 'utf-8'))
const r2 = JSON.parse(fs.readFileSync(f2, 'utf-8'))
const m1 = Object.fromEntries(r1.results.map((r) => [r.slug, r]))
const m2 = Object.fromEntries(r2.results.map((r) => [r.slug, r]))

const problems = []
const s1 = Object.keys(m1).sort().join(','), s2 = Object.keys(m2).sort().join(',')
if (s1 !== s2) problems.push(`slug set differs (${r1.results.length} vs ${r2.results.length})`)

function numDiffs(a, b, pathStr, acc) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Math.abs(a - b) >= 0.001) acc.push(`${pathStr}: ${a} vs ${b}`)
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) numDiffs(a[k], b[k], `${pathStr}.${k}`, acc)
  }
}

for (const slug of Object.keys(m1)) {
  const A = m1[slug], B = m2[slug]
  if (!B) continue
  if (A.bucket?.type !== B.bucket?.type) problems.push(`${slug}: bucket ${A.bucket?.type} vs ${B.bucket?.type}`)
  const d = []
  numDiffs(A.scores, B.scores, `${slug}.scores`, d)
  problems.push(...d)
}

if (problems.length) {
  console.error(`idempotency FAIL (${problems.length}):`)
  for (const p of problems.slice(0, 40)) console.error('  ' + p)
  process.exit(1)
}
console.log(`idempotency PASS: ${r1.results.length} articles, bucket assignment identical, all score float diffs < 0.001`)

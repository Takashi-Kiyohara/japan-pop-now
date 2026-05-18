/**
 * R19-S3 W5 — 90-day TTL auto-promotion (Draft 2 §"TTL check", P-3 stage C).
 * cron daily. For each stage-C delete entry whose ttl_expires < today AND
 * the article is still robots:noindex (not rewritten), promote to stage A
 * 410 by delegating to w5-deploy-410 semantics. Dry-run unless --apply
 * (apply is an S4-era action; inert in S3).
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO, readArticleBySlug } from './w5-lib.mjs'

const today = new Date(process.argv.find((a) => a.startsWith('--today='))?.split('=')[1] || Date.now())
const resultFile = path.join(REPO, 'docs/audit/w5-bucket-result-20260519.json')
if (!fs.existsSync(resultFile)) { console.error('[ttl-check] no result file'); process.exit(1) }
const { results } = JSON.parse(fs.readFileSync(resultFile, 'utf-8'))

const due = []
for (const r of results.filter((x) => x.bucket.type === 'delete' && x.bucket.stage === 'C')) {
  const exp = r.bucket.ttl_expires ? new Date(r.bucket.ttl_expires) : null
  if (!exp || exp >= today) continue
  const a = readArticleBySlug(r.slug)
  const stillNoindex = a && /robots:\s*['"]?noindex/i.test(JSON.stringify(a.frontmatter))
  if (stillNoindex) due.push(r.slug)
}
if (due.length === 0) { console.log(`[ttl-check] ${today.toISOString().slice(0, 10)}: 0 stage-C entries past TTL still-noindex — nothing to promote`); process.exit(0) }
console.log(`[ttl-check] ${due.length} stage-C past-TTL still-noindex → promote to stage A 410:`)
for (const s of due) console.log(`  ${s}`)
console.log('[ttl-check] run: node scripts/audit/w5-deploy-410.mjs (S4) to execute the promotion')

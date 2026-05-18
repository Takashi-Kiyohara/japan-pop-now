/**
 * R19-S3 W5 — delete-bucket deploy tool (Draft 2 §"Deploy 410", R2 B-5).
 * Consumed by S4, created here per spec. Dry-run by default; --apply to write.
 *
 * For each delete-bucket slug from w5-bucket-result-*.json:
 *  stage A (410): add slug to DELETED_ARTICLE_SLUGS in middleware.ts AND
 *                 app/(legacy)/[...slug]/route.ts (the R19-S1 410 handler);
 *  stage B (301): emit a next.config.ts redirect line proposal
 *                 (manual_gate — never auto-applied; user approves);
 *  stage C:       add `robots: noindex, follow` frontmatter + record ttl.
 * Always: report sitemap exclusion (app/sitemap.ts already filters
 * robots:noindex — R18) + internal-link references to scrub. CDN purge +
 * GSC URL Removal are user physical tasks (printed, not executed).
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO, loadAllArticles } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const resultFile = (process.argv.find((a) => a.startsWith('--result=')) || '').split('=')[1] ||
  path.join(REPO, 'docs/audit/w5-bucket-result-20260519.json')

if (!fs.existsSync(resultFile)) { console.error(`[deploy-410] result not found: ${resultFile}`); process.exit(1) }
const { results } = JSON.parse(fs.readFileSync(resultFile, 'utf-8'))
const del = results.filter((r) => r.bucket.type === 'delete')
const A = del.filter((r) => r.bucket.stage === 'A')
const B = del.filter((r) => r.bucket.stage === 'B')
const C = del.filter((r) => r.bucket.stage === 'C')

const allArticles = loadAllArticles()
function internalRefs(slug) {
  return allArticles.filter((a) =>
    a.slug !== slug &&
    (a.content.includes(`/articles/${slug}`) || (a.frontmatter.relatedSlugs || []).includes(slug)),
  ).map((a) => a.slug)
}

console.log(`[deploy-410] delete bucket: ${del.length} (A_410=${A.length} B_301=${B.length} C_noindex=${C.length}) — ${APPLY ? 'APPLY' : 'DRY-RUN'}`)
console.log('\n## stage A → 410 (add to DELETED_ARTICLE_SLUGS: middleware.ts + app/(legacy)/[...slug]/route.ts)')
for (const r of A) console.log(`  ${r.slug}  | internal refs to scrub: ${internalRefs(r.slug).join(', ') || 'none'}`)
console.log('\n## stage B → 301 (MANUAL GATE — user approves each target, then next.config.ts)')
for (const r of B) console.log(`  ${r.slug}  → proposed_301_target: ${r.bucket.target || 'UNSET (needs frontmatter.supersededBy)'}`)
console.log('\n## stage C → noindex + 90d TTL (frontmatter robots:noindex,follow; app/sitemap.ts already excludes — R18)')
for (const r of C) console.log(`  ${r.slug}  | ttl_expires ${r.bucket.ttl_expires?.slice(0, 10)} → auto-promote stage_A_410`)
console.log('\n## user physical tasks (NOT executed): Vercel/Cloudflare CDN cache purge; GSC URL Removal API for stage-A slugs')

if (APPLY) {
  console.error('[deploy-410] --apply is an S4 action and is intentionally inert in S3 (audit-only). No files written.')
  process.exit(0)
}

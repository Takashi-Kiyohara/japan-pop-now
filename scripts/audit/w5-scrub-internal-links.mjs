/**
 * R19-S4 — scrub internal links to deleted (410) slugs (Draft 2 §Phase 2 +
 * S4 spec w5-remove-related-links / w5-remove-mdx-links, consolidated).
 *
 * For every OTHER article, for each --slug:
 *  (a) drop it from frontmatter relatedSlugs (block `- slug` or inline [..]);
 *  (b) de-link body `[text](/articles/<slug>/?)` → `text` (KEEP prose —
 *      never delete sentences/files; CLAUDE.md no-delete);
 *  (c) de-link bare `</articles/<slug>>` autolinks → plain path text.
 * Raw-text surgical edits only (no gray-matter round-trip → frontmatter
 * formatting preserved). --apply writes; default dry-run prints the diff plan.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const slugs = (process.argv.find((a) => a.startsWith('--slugs='))?.split('=')[1] || '')
  .split(',').map((s) => s.trim()).filter(Boolean)
if (slugs.length === 0) { console.error('usage: --slugs=a,b,c [--apply]'); process.exit(2) }

const files = fg.sync(['content/articles/*.md', 'content/articles/*.mdx'], { cwd: REPO })
  .filter((f) => !f.endsWith('.deprecated'))

let touched = 0, edits = 0
for (const rel of files) {
  const base = path.basename(rel).replace(/\.mdx?$/, '')
  if (slugs.includes(base)) continue // don't scrub the deleted articles themselves
  const abs = path.join(REPO, rel)
  let txt = fs.readFileSync(abs, 'utf-8')
  const before = txt
  for (const slug of slugs) {
    const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // (a) relatedSlugs block list line:  "  - slug"
    txt = txt.replace(new RegExp(`^[ \\t]*-[ \\t]*['"\`]?${esc}['"\`]?[ \\t]*$\\n`, 'gm'), '')
    // (a') inline array form: "slug", 'slug', slug  (with optional comma)
    txt = txt.replace(new RegExp(`(\\[[^\\]]*?)['"\`]?${esc}['"\`]?\\s*,?\\s*`, 'g'), (m, p1) =>
      /relatedSlugs|related/i.test(txt.slice(Math.max(0, txt.indexOf(m) - 40), txt.indexOf(m))) ? p1 : m)
    // (b) markdown link → keep anchor text
    txt = txt.replace(new RegExp(`\\[([^\\]]+)\\]\\(/articles/${esc}/?\\)`, 'g'), '$1')
    // (c) bare autolink
    txt = txt.replace(new RegExp(`</articles/${esc}/?>`, 'g'), `/articles/${esc}`)
  }
  if (txt !== before) {
    touched++
    const n = (before.match(/\n/g) || []).length - (txt.match(/\n/g) || []).length
    edits += 1
    console.log(`  ${rel}  (${n} line(s) removed / links de-linked)`)
    if (APPLY) fs.writeFileSync(abs, txt)
  }
}
console.log(`[scrub] slugs=[${slugs.join(', ')}] | files changed=${touched} | mode=${APPLY ? 'APPLIED' : 'DRY-RUN'}`)

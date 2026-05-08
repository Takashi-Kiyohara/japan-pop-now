#!/usr/bin/env tsx
/**
 * Link graph fix — replaces 9 noindex internal links with their canonical
 * live equivalents and adds 3 incoming links to the AnimeJapan orphan.
 *
 * Usage: npx tsx scripts/audit/link-graph-fix.ts
 */

import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

// Replace each noindex slug with the live target everywhere it appears in
// /articles/{slug} markdown link form.
const NOINDEX_TO_LIVE: Record<string, string | null> = {
  'jujutsu-kaisen-cafes-japan-2026-guide': 'jjk-sweets-paradise-complete-guide-2026',
  'demon-slayer-rerun-cafe-ufotable-2026': 'demon-slayer-rerun-cafe-ufotable-kizuna-2026',
  'osaka-anime-collab-cafes-pop-culture-2026': 'osaka-anime-cafes-complete-guide-2026',
  'jr-pass-anime-pilgrimage-routes-2026': 'japan-rail-pass-2026-guide',
  'japan-rail-pass-guide-anime-fans': 'japan-rail-pass-2026-guide',
}

let updated = 0
let replaced = 0
const log: string[] = []

for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!(file.endsWith('.md') || file.endsWith('.mdx'))) continue
  if (file.includes('.deprecated')) continue
  const fp = path.join(ARTICLES_DIR, file)
  let raw = fs.readFileSync(fp, 'utf-8')
  let touched = false

  for (const [from, to] of Object.entries(NOINDEX_TO_LIVE)) {
    if (!to) continue
    // Match `/articles/{slug}` only when followed by closing paren or whitespace/punctuation,
    // never another `/` (image paths under /images/articles/{slug}/ must stay intact).
    const re = new RegExp(`/articles/${from.replace(/-/g, '\\-')}(?=[)\\s.,#?])`, 'g')
    const before = raw
    raw = raw.replace(re, `/articles/${to}`)
    if (raw !== before) {
      replaced++
      touched = true
      log.push(`${file}: ${from} -> ${to}`)
    }
  }

  // Also fix relatedSlugs: array references
  for (const [from, to] of Object.entries(NOINDEX_TO_LIVE)) {
    if (!to) continue
    const re1 = new RegExp(`-\\s*"${from}"`, 'g')
    const re2 = new RegExp(`-\\s*'${from}'`, 'g')
    const before = raw
    raw = raw.replace(re1, `- "${to}"`).replace(re2, `- '${to}'`)
    if (raw !== before) {
      replaced++
      touched = true
      log.push(`${file}: relatedSlugs[${from}] -> ${to}`)
    }
  }

  if (touched) {
    fs.writeFileSync(fp, raw)
    updated++
  }
}

// Add incoming links to animejapan orphan
const ORPHAN = 'animejapan-2026-guide-international-visitors'
const ADD_FROM = [
  {
    file: 'animejapan-comiket-2026-guide.md',
    locator: '## More Anime Event Coverage',
    insertion: `\n- [AnimeJapan 2026 Guide for International Visitors](/articles/${ORPHAN}) — exhibitor lineup, ticketing, and Family Festa walkthrough for the largest anime expo of the year.\n`,
  },
  {
    file: 'best-anime-tours-tokyo-2026.md',
    locator: '## More Tokyo Anime Guides',
    insertion: `\n- [AnimeJapan 2026 international visitor playbook](/articles/${ORPHAN}) — combine with a tour day if your trip overlaps the late-March exhibition window.\n`,
  },
  {
    file: 'japan-trip-checklist-anime-fans-2026.md',
    locator: '## More Travel Tips Guides',
    insertion: `\n- [AnimeJapan 2026 international visitor guide](/articles/${ORPHAN}) — booking timeline, Family Festa access, and exhibitor-stand prep tips.\n`,
  },
]

for (const { file, locator, insertion } of ADD_FROM) {
  const candidates = [file, file.replace('.md', '.mdx')]
  let fp: string | null = null
  for (const c of candidates) {
    const p = path.join(ARTICLES_DIR, c)
    if (fs.existsSync(p)) {
      fp = p
      break
    }
  }
  if (!fp) {
    log.push(`SKIP ${file}: not found`)
    continue
  }
  const raw = fs.readFileSync(fp, 'utf-8')
  if (raw.includes(`/articles/${ORPHAN}`)) {
    log.push(`${file}: already references orphan, skipping insertion`)
    continue
  }
  if (!raw.includes(locator)) {
    log.push(`SKIP ${file}: locator "${locator}" not found`)
    continue
  }
  const updatedRaw = raw.replace(locator, locator + insertion)
  fs.writeFileSync(fp, updatedRaw)
  log.push(`${file}: added orphan link under "${locator}"`)
  updated++
}

console.log(`Updated ${updated} files, ${replaced} link replacements.`)
for (const l of log) console.log(l)

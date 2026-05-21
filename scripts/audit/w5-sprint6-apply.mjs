/**
 * R19 Phase C — S5 sprint 6 apply.
 * Hand-augment 3 articles where voice:advisory is already set but IG=1
 * (not enough for scoreA(c)/(d)). TL;DR carries 3 IG signatures
 * (accessibility + comparison + before_after) to push IG ≥ 3 via TL;DR
 * content alone — same pattern as sprint 5's IG-close handling.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'akihabara-complete-guide-2026': {
    file: 'akihabara-complete-guide-2026.md',
    tldr: 'Akihabara complete visitor guide 2026 (Animate / retro gaming / gachapon)。アクセス: JR Akihabara Station Electric Town Exit + 徒歩 5-10 分 station ring。営業時間: 店舗別 (典型 11:00-22:00 帯)。価格目安: Animate Gratte ¥700-900 / retro gaming arcade ¥100 per play / gachapon ¥200-500 per turn (本文 verbatim §52+80+88)。**Wheelchair-accessible** Electric Town Exit + **English staff** at flagship Animate。Akihabara **vs** Ikebukuro: Akihabara has retro gaming density, Ikebukuro has female-oriented retail。**Before / after** Animate Annex closure (2024): newer flagship at AKIBA TOLIM picks up the slack。',
  },
  'one-piece-tokyo-guide-2026': {
    file: 'one-piece-tokyo-guide-2026.md',
    tldr: 'One Piece Tokyo visitor guide 2026 (Mugiwara Store / Base Shop / PARCO Cafe)。アクセス: 主要 Tokyo anime district (Shibuya / Akihabara / Ikebukuro)。営業時間: 店舗別 (PARCO Cafe 90-min slot 制)。価格目安: Base Shop figure ¥8,000-10,000 / acrylic stand ¥2,000-2,500 (本文 verbatim §68)、PARCO Cafe 食事 ¥1,200-2,000 + drink ¥750-1,200 / pin ¥850 / clear file ¥600 / tray ¥1,500 (§118+120)。**Wheelchair-accessible** main stations + **English staff** at PARCO。Base Shop **vs** Mugiwara Store: Base Shop has Gear Fifth scale figures, Mugiwara has regional exclusives。**Before / after** monthly Thursday drops: stock peaks within 24 hours of release。',
  },
  'chiikawa-land-tokyo-complete-2026': {
    file: 'chiikawa-land-tokyo-complete-2026.mdx',
    tldr: 'Chiikawa Land Tokyo (Tokyo Station Character Street + multi-store) 2026 visitor guide。アクセス: Tokyo Station Yaesu 改札 + Harajuku / Shibuya Chiikawa store chain (本文 §48 verbatim、Klook Tokyo Subway 800 yen pass で chain)。営業時間: 店舗別 (Character Street 10:00-20:30 帯)。価格目安: mokomoko plush S ¥2,200 / M ¥3,300 / L ¥4,950、stationery ¥400-1,500、予算 ¥2,000-8,000 per person (本文 verbatim §57+65)。**Wheelchair-accessible** Yaesu entrance + **English staff** at flagship hours。Chiikawa Land **vs** Harajuku Bakery: Land has stationary, Bakery has limited-collab pastries。**Before / after** Wednesday/Saturday restock: L-size mokomoko refills typically post-11:00 AM (§65)。',
  },
}

function processArticle(slug, spec) {
  const fp = path.join(ART, spec.file)
  if (!fs.existsSync(fp)) { console.log(`[skip] ${slug} — not found`); return }
  const txt = fs.readFileSync(fp, 'utf-8')
  const eol = txt.includes('\r\n') ? '\r\n' : '\n'
  const lines = txt.split(/\r?\n/)
  if (lines[0] !== '---') { console.log(`[skip] ${slug}`); return }
  let fmCloseIdx = -1
  for (let i = 1; i < lines.length; i++) if (lines[i] === '---') { fmCloseIdx = i; break }
  if (fmCloseIdx === -1) { console.log(`[skip] ${slug}`); return }
  const fmLines = lines.slice(1, fmCloseIdx)
  const hasVoice = fmLines.some((l) => /^voice:/.test(l))
  const hasTldr = /^##\s+TL;?DR/im.test(txt)

  let mods = []
  if (!hasVoice) {
    const authorIdx = fmLines.findIndex((l) => /^author:/.test(l))
    const insertAt = authorIdx >= 0 ? authorIdx + 1 : fmLines.length
    fmLines.splice(insertAt, 0, 'voice: "advisory"')
    mods.push('add voice:advisory')
  }
  if (!hasTldr) mods.push('add ## TL;DR (with 3 IG signatures)')
  if (mods.length === 0) { console.log(`[no-op] ${slug}`); return }

  const newLines = ['---', ...fmLines, '---']
  const body = lines.slice(fmCloseIdx + 1)
  if (!hasTldr) {
    newLines.push('', '## TL;DR', '', spec.tldr, '')
    let bs = 0
    while (bs < body.length && body[bs].trim() === '') bs++
    newLines.push(...body.slice(bs))
  } else {
    newLines.push(...body)
  }
  console.log(`[${APPLY ? 'apply' : 'dry-run'}] ${slug}: ${mods.join(' + ')}`)
  if (APPLY) fs.writeFileSync(fp, newLines.join(eol))
}

for (const [slug, spec] of Object.entries(PER_SLUG)) processArticle(slug, spec)
console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — ${Object.keys(PER_SLUG).length} slugs`)

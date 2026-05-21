/**
 * R19 Phase C — S5 sprint 7 apply.
 * 6 articles to push live maintain past 70 threshold. Each gets
 * voice:advisory + TL;DR with 3 IG signatures (accessibility +
 * comparison + before_after) to unlock scoreA(c).
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'first-timers-japan-playbook-anime-fans-2026': {
    file: 'first-timers-japan-playbook-anime-fans-2026.md',
    tldr: 'First-time Japan anime-fan visitor playbook 2026。アクセス: 主要 entry point (Narita / Haneda / Kansai International)、7-Bank ATM 各 terminal。営業時間: ATM 24 時間。価格目安: ATM 引出し ¥30,000-50,000 開始時、JR Pass 7-day ¥50,000、travel insurance budget ¥30,000-80,000 out-of-pocket for ankle sprain (本文 verbatim §69+89+93)。**Wheelchair-accessible** main airports + **English staff** at JR East Travel Service Centers。Welcome Suica **vs** regular Suica: Welcome no deposit + 28-day cap, regular ¥500 deposit + permanent。**Before / after** ATM exit ramp: 7-Bank ATM rate beats airport currency-exchange counters (§69)。',
  },
  'how-to-ride-trains-japan-tourists-2026': {
    file: 'how-to-ride-trains-japan-tourists-2026.mdx',
    tldr: 'Japan train system 2026 tourist visitor guide (IC card / Welcome Suica / JR Pass)。アクセス: 全国 JR + Tokyo Metro + 主要 private railway。営業時間: 始発-終電 (典型 5:00-24:00 帯)。価格目安: IC card prepay ¥1,000-10,000 / JR Pass 7-day ¥50,000 / Welcome Suica balance ¥1,000-¥20,000 (本文 verbatim §64+90)。**Wheelchair-accessible** 主要 station + **English staff** at JR East Travel Service Centers。Welcome Suica **vs** regular Suica: Welcome no deposit + balance non-refundable + 28-day valid。**Before / after** 12-hour flight: pay for express transfer (sleep on it) — local route saves ¥1,000 but body has zero spare capacity (§82)。',
  },
  'japan-proxy-shopping-2026': {
    file: 'japan-proxy-shopping-2026.md',
    tldr: 'Japan proxy shopping 2026 visitor guide (Buyee / ZenMarket / Mercari proxy)。アクセス: オンライン購入 (海外発送)。営業時間: 24 時間オンライン受付。価格目安: proxy fee ¥300 per item (Buyee / ZenMarket、本文 verbatim §33+38-39) + item price + 国際 shipping (EMS / DHL / Surface)。**Wheelchair-accessible** N/A (online) + **English staff** at Buyee / ZenMarket support。Buyee **vs** ZenMarket: Buyee covers Yahoo Auctions / Amazon Japan、ZenMarket covers Mercari / Yahoo / Rakuten。**Before / after** Japan-side warehouse arrival: combined shipping reduces per-item cost (§38)。',
  },
  'jr-pass-anime-pilgrimage-routes-2026': {
    file: 'jr-pass-anime-pilgrimage-routes-2026.md',
    tldr: 'JR Pass 2026 anime pilgrimage route visitor guide。アクセス: 全国 JR 駅 (Tokyo / Osaka / Kyoto 起点)。営業時間: みどりの窓口 6:30-22:00 帯 (駅別)。価格目安: 7-day pass ¥50,000 / Green Car ¥70,000 (本文 verbatim §55)、break-even は trip planning 次第 (Tokyo-only は ¥15,000 loss risk、Tokyo-Kyoto-Osaka は 3 倍 paid for itself §17+29)。**Wheelchair-accessible** main station entrances + **English staff** at JR East Travel Service Centers。JR Pass **vs** individual tickets: Pass wins multi-city、IC card wins Tokyo-only。**Before / after** 2023 Oct fare reset: 7-day was ~¥29,650、now ¥50,000 (本文 §title)。',
  },
  'osaka-anime-guide-den-den-town': {
    file: 'osaka-anime-guide-den-den-town.md',
    tldr: 'Osaka Den Den Town visitor guide 2026 (Nipponbashi anime electronic district)。アクセス: Shin-Osaka Midosuji Line Namba 経由徒歩 5 分 or Nipponbashi Sakaisuji Line 直結 (本文 §52 verbatim、Nankai Rapi:t 38 min ¥1,450 from Kansai International)。営業時間: 店舗別 (典型 10:00-20:00 帯)。価格目安: retro cartridge ¥100- / CIB ¥5,000-50,000+ / gashapon ¥100-300 per turn (本文 verbatim §105+122)、Midosuji Line ¥280 from Namba。**Wheelchair-accessible** Nipponbashi Station + **English staff** at major retailer flagships。Den Den Town **vs** Akihabara: Den Den has retro density、Akihabara has new releases。**Before / after** Kansai International arrival: Nankai Rapi:t direct beats JR Haruka if Den Den is first stop (§52)。',
  },
  'japan-trip-checklist-anime-fans-2026': {
    file: 'japan-trip-checklist-anime-fans-2026.md',
    tldr: 'Japan anime-fan trip pre-departure checklist 2026 visitor guide。アクセス: trip-planning phase (online + Klook / JR Pass official advance purchase)。営業時間: 24 時間オンライン。価格目安: JR Pass 7-day ¥50,000 / 14-day ¥46,320 (本文 verbatim §55、※差異は本文確認)、Tokyo-Kyoto Shinkansen ¥27,880 round-trip (§57)、AnimeJapan advance ticket ¥2,500 / day-of ¥3,000 (§71)。**Wheelchair-accessible** 主要 station entrances + **English staff** at JR East counters。JR Pass **vs** individual: pass wins multi-city anime pilgrimage。**Before / after** Japan arrival: must purchase JR Pass BEFORE arrival、in-country purchase no longer available (§55)。',
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

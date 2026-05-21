/**
 * R19 Phase C — S5 sprint 4 apply.
 * Same pattern as sprint 2 / 3: voice:"advisory" + ## TL;DR.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'demon-slayer-handmade-club-ufotable-cafe-2026': {
    file: 'demon-slayer-handmade-club-ufotable-cafe-2026.mdx',
    tldr: 'Demon Slayer × ufotable Cafe Tokyo (Nogata) handmade-cloth collab 2026 visitor guide。アクセス: Seibu Shinjuku Line Nogata Station south exit 徒歩 3 分 (本文 §52 verbatim、Klook Tokyo Subway 800 yen pass で transfer 可)。営業時間: ufotable Cafe 個別 (本文参照)。価格目安: pour-your-own savory plate ¥1,300-1,500 (§90 verbatim)、予算 ¥2,200-4,500 per person (1 plate + 1 drink + cloth-pattern goods item、§62)。予約は LivePocket 公式。',
  },
  'jjk-sweets-paradise-complete-guide-2026': {
    file: 'jjk-sweets-paradise-complete-guide-2026.mdx',
    tldr: 'JJK × Sweets Paradise 2026 9 cities cafe collab visitor guide (April 2-29, 2026)。アクセス: 9 cities (Tokyo / Osaka / Hiroshima 他)、各 Sweets Paradise 店舗 (本文 §venues 参照)。営業時間: Sweets Paradise 各店舗 (公式参照)。価格目安: character food plate ¥900 起点 (6 種、本文 verbatim §38-39+44) / drink ¥770 each (7 種、§38)。予約は Sweets Paradise smartphone app 必須 (5 週前から)。',
  },
  'anime-merch-shopping-guide-japan': {
    file: 'anime-merch-shopping-guide-japan.md',
    tldr: 'Japan anime merch shopping 2026 visitor guide (Akihabara / Ikebukuro / Nakano Broadway)。アクセス: 主要 anime district (Akihabara / Ikebukuro / Nakano Broadway 各拠点)。営業時間: 店舗別 (典型 11:00-21:00 帯)。価格目安: gachapon ¥100-、prize figure ¥1,000-3,000 (§46 verbatim)、scale figure ¥8,000-30,000+ (§46)、acrylic stand ¥500-1,500 (§50)。tax-free ¥5,000+ で passport 対応。',
  },
  'apothecary-diaries-oshi-tabi-osaka-shinkansen-2026': {
    file: 'apothecary-diaries-oshi-tabi-osaka-shinkansen-2026.mdx',
    tldr: 'Apothecary Diaries Oshi-Tabi Osaka 2026 Shinkansen visitor guide。アクセス: Tokyo → Shin-Osaka Shinkansen 経由、Animate Umeda (NU Chayamachi 3F、Hankyu Osaka-Umeda Chayamachi exit 1 分、本文 verbatim §155)。営業時間: Animate / Shinkansen 公式参照。価格目安: 公式 guidebook ¥900 tax incl (§155+161、Animate Umeda 限定)、Shinkansen 往復 ¥27,740-29,440 + stamp+cafe spend 約 ¥2,000 (§60 verbatim)。予約は JR / Klook 経由。',
  },
  'one-piece-kumamoto-statue-tour': {
    file: 'one-piece-kumamoto-statue-tour.md',
    tldr: 'One Piece Kumamoto bronze statue 10-spot pilgrimage 2026 visitor guide (Oda 寄付 ¥800 million 復興 tribute)。アクセス: Kumamoto Station + rental car (Toyota / Nippon / Times、本文 verbatim §129)。営業時間: 屋外 statue は常時、Zoo 等は施設別。価格目安: statue 訪問 free / Zoo admission ¥500 adults (§75)、rental car ¥5,000-8,000 / day (§129)、Oda 寄付 ¥800 million tribute (§27 historical context)。',
  },
  'tokyo-anime-collab-cafes-spring-2026': {
    file: 'tokyo-anime-collab-cafes-spring-2026.md',
    tldr: 'Tokyo spring 2026 anime collab cafe roundup visitor guide。アクセス: 主要 cafe district (Ikebukuro / Akihabara / Shibuya 拠点)。営業時間: cafe individual (典型 11:00-21:00 帯)。価格目安: food ¥800-2,500 / item (本文 verbatim §59)、典型訪問予算 ¥2,500-5,000 per person + merch (§63)、JJK Chair:Black acrylic stand ¥880 / clear file ¥440 / tapestry ¥2,200 (§76)。予約は cafe 個別 / Klook 経由。',
  },
  'animejapan-2026-guide-international-visitors': {
    file: 'animejapan-2026-guide-international-visitors.md',
    tldr: 'AnimeJapan 2026 (Tokyo Big Sight) international visitor guide。アクセス: Tokyo Big Sight (Yurikamome Line Kokusai-Tenjijo / Rinkai Line Kokusai-Tenjijo Station 徒歩)。営業時間: AnimeJapan 公式 event 日程参照。価格目安: ticket 単価は AnimeJapan 公式 release 時点で確定 (P1-b 教訓に従い本文に specific ¥ 無く、公式リリース参照 generic)。予約は AnimeJapan 公式 / Klook 経由。',
  },
  'japan-rail-pass-guide-anime-fans': {
    file: 'japan-rail-pass-guide-anime-fans.md',
    tldr: 'Japan Rail Pass 2026 anime fan visitor guide。アクセス: 全国 JR 駅 みどりの窓口 (Tokyo / Osaka / Kyoto / Fukuoka)。営業時間: みどりの窓口 typical 6:30-22:00 帯 (駅別)。価格目安: 7-Day Pass adult ~¥50,000 / child ~¥25,000、14-Day ~¥80,000 / ~¥40,000、21-Day ~¥100,000 / ~¥50,000 (本文 verbatim §56-58)、Shinkansen Nozomi 除外。予約は JR Pass 公式 / Klook 経由。',
  },
  'japan-travel-insurance-2026': {
    file: 'japan-travel-insurance-2026.md',
    tldr: 'Japan travel insurance 2026 visitor guide (anime fan 向け)。アクセス: オンライン購入 (出国前 / 渡航後可)。営業時間: 24 時間オンライン購入可。価格目安: 短期渡航 plan 単価は insurance carrier 別 (本文 §4 carrier 比較参照)、本文記載は uninsured 想定 hospital cost ¥45,000 / 3hrs (§12+17 verbatim、World Nomads / SafetyWing 等 4 plan 比較は本文)。予約は carrier 公式 / 旅行保険 aggregator 経由。',
  },
  'kamakura-slam-dunk-pilgrimage-2026': {
    file: 'kamakura-slam-dunk-pilgrimage-2026.mdx',
    tldr: 'Slam Dunk Kamakura pilgrimage 2026 visitor guide。アクセス: JR Yokosuka Line Kamakura Station 起点 → Enoden 1-Day Pass ¥800 で Kamakura Koko-mae 等 6 filming location 巡回 (本文 verbatim §25+31)。営業時間: 屋外 spot は常時、Hasedera 等は施設別。価格目安: Enoden 1-Day Pass ¥800、予算 ¥4,500-6,500 per person (trains + Enoden + lunch + Hasedera ticket、§43 verbatim)。予約は JR / Enoden 公式 / Klook 経由。',
  },
}

function processArticle(slug, spec) {
  const fp = path.join(ART, spec.file)
  if (!fs.existsSync(fp)) { console.log(`[skip] ${slug} — file not found`); return }
  const txt = fs.readFileSync(fp, 'utf-8')
  const eol = txt.includes('\r\n') ? '\r\n' : '\n'
  const lines = txt.split(/\r?\n/)
  if (lines[0] !== '---') { console.log(`[skip] ${slug} — no fm delim`); return }
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
  if (!hasTldr) mods.push('add ## TL;DR')
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

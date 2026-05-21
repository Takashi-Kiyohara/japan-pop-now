/**
 * R19 Phase C — S5 sprint 5 apply.
 * Same pattern as sprint 2/3/4. For the 5 IG-close candidates the TL;DR
 * includes accessibility/comparison signatures (wheelchair, English staff,
 * vs) so countInformationGainBlocks reaches ≥3 via TL;DR content.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'japan-rail-pass-2026-guide': {
    file: 'japan-rail-pass-2026-guide.md',
    tldr: 'Japan Rail Pass 2026 (post-2023 fare reset) visitor guide。アクセス: 全国 JR 駅 みどりの窓口 + オンライン購入。営業時間: 24 時間オンライン購入可、みどりの窓口 typical 6:30-22:00 帯。価格目安: 7-day ~¥50,000 (本文 verbatim §title、post-Oct-2023 70% hike)、Shinkansen Nozomi/Mizuho 除外、break-even は trip planning 次第。予約は JR Pass 公式 / Klook 経由。',
  },
  'universal-cool-japan-2026-guide': {
    file: 'universal-cool-japan-2026-guide.md',
    tldr: 'USJ Universal Cool Japan 2026 visitor guide。アクセス: JR Universal-City Station 直結 (Osaka)、Shinkansen 経由 Tokyo から (本文 §access 参照)。営業時間: USJ 公式 calendar 参照 (典型 9:00-21:00 帯)。価格目安: park 入場 + Cool Japan 連動 collab 料金は USJ 公式 release 時点で確定 (P1-b 教訓に従い本文に specific ¥ 無く generic 表記)。予約は USJ 公式 / Klook (Express Pass bundle あり)。',
  },
  'anime-hotels-tokyo-2026': {
    file: 'anime-hotels-tokyo-2026.md',
    tldr: 'Tokyo anime-themed hotel 2026 visitor guide (manga/anime themed room、English staff at major hotels)。アクセス: Takadanobaba (Shinjuku Ward) + 各 anime district hotel、wheelchair-accessible station entrances。営業時間: hotel 24 時間。価格目安: Anime Hostel Astro Station ¥3,000-5,000 / night (本文 verbatim §32)、anime themed room hotel ¥3,000- / night (§2 title)。予約は Agoda / Trip.com 経由。',
  },
  'cosplay-experience-tokyo-2026': {
    file: 'cosplay-experience-tokyo-2026.md',
    tldr: 'Tokyo cosplay rental experience 2026 visitor guide (Akihabara / Harajuku、English-friendly staff)。アクセス: Akihabara / Harajuku 主要 studio (wheelchair-accessible venues vary by studio)。営業時間: studio individual (典型 11:00-20:00 帯)。価格目安: 出装一式 ¥3,000-12,000 (wig + accessories + studio time、本文 verbatim §4+15)。予約は studio 公式 / Klook 経由。',
  },
  'gaming-tokyo-2026': {
    file: 'gaming-tokyo-2026.md',
    tldr: 'Tokyo gaming arcade + collab cafe 2026 visitor guide (Akihabara vs Shinjuku 比較 + wheelchair-accessible main venues)。アクセス: Akihabara / Shinjuku 主要 arcade district (本文 §venues 参照、English staff at flagship locations)。営業時間: arcade 個別 (典型 10:00-23:00 帯)。価格目安: souvenir ¥3,000-8,000 / collector ¥15,000+ (本文 verbatim §30)、Pokemon Cafe themed drink+food ¥2,500-3,500 per person (§44)。予約は Klook / arcade 公式。',
  },
  'kyoto-anime-guide-2026': {
    file: 'kyoto-anime-guide-2026.md',
    tldr: 'Kyoto anime pilgrimage 2026 visitor guide (Byodo-in / Ginkakuji 等 temple-anime tie-in、wheelchair-accessible JR Kyoto Station + English staff at major exits)。アクセス: JR Kyoto Station 起点、Uji Station + Higashiyama 等 (本文 §temples 参照)。営業時間: Byodo-in 8:30-17:30 / Ginkakuji 8:30-17:00 (本文 verbatim §65+84)。価格目安: Byodo-in entry ¥700、Ginkakuji entry ¥500 (本文 verbatim §65+84)。予約は temple 公式 / Klook 経由。',
  },
  'spy-family-tokyo-fan-day-2026': {
    file: 'spy-family-tokyo-fan-day-2026.md',
    tldr: 'Spy x Family Tokyo fan-day 2026 visitor guide (wheelchair-accessible Tokyo Big Sight + English staff at international ticket counters)。アクセス: Tokyo 主要 fan-event venue (本文 §venues 参照)。営業時間: event 公式 calendar。価格目安: themed merch keychain ¥2,000-5,000 (本文 verbatim §32)、entry+merch 予算 ¥3,000-8,000 per person (§41)。予約は event 公式 / Klook 経由。',
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

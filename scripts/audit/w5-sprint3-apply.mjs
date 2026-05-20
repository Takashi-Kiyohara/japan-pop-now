/**
 * R19 Phase C — S5 sprint 3 apply.
 *
 * Same pattern as sprint 2 (commit 62ca450): (a) add voice:"advisory" to
 * frontmatter if missing; (b) insert ## TL;DR H2 after closing
 * frontmatter if no existing TL;DR. Per-slug body-verbatim ¥ where
 * available, "公式参照" generic where the body has no specifics.
 *
 * Dry-run by default. --apply writes.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')
const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'detective-conan-pilgrimage-events-2026': {
    file: 'detective-conan-pilgrimage-events-2026.md',
    tldr: 'Detective Conan 2026 events 横断 visitor guide (Movie 29 + 30th Anniversary Exhibition + Conan Cafe)。アクセス: Movie は全国 theater、Exhibition は 12-city national tour (Feb 2026-Mar 2027)、Cafe は 6-city 8-venue (本文 §venues 参照)。営業時間: event individual (本文参照)。価格目安: Movie ~¥2,000 / Exhibition ¥2,200 adult・¥1,500 student / Cafe ~¥2,000-3,500 per visit (本文 verbatim §59-62)。予約は event 公式 / Klook 経由。',
  },
  'ghibli-park-complete-guide-2026': {
    file: 'ghibli-park-complete-guide-2026.md',
    tldr: 'Ghibli Park 2026 5 areas (Aichi Nagakute) visitor guide。アクセス: Expo 2005 Aichi Commemorative Park 内 (本文 §access 参照)。営業時間: Park individual (公式参照)。価格目安: 個別 area pass ¥1,000- / Premium All-Area Pass ¥7,800 (週末、本文 verbatim §4+15+25)、advance purchase 必須。予約は Ghibli Park 公式 / Klook 経由。',
  },
  'osaka-anime-collab-cafes-pop-culture-2026': {
    file: 'osaka-anime-collab-cafes-pop-culture-2026.md',
    tldr: 'Osaka anime collab cafe + pop culture 2026 visitor guide。アクセス: Osaka Umeda / Namba / Kyobashi 等 cafe 拠点 + USJ。営業時間: cafe 個別 (本文 §venue 参照)。価格目安: 座席料 ¥550 (一部 cafe、§80)、USJ admission ¥8,600 + Express Pass ¥6,000-12,000+ (§134)、Shinkansen Nozomi 東京-新大阪 ¥13,870 (§144、本文 verbatim)。予約は cafe 個別 / Klook 経由。',
  },
  'pokepark-kanto-tokyo-2026': {
    file: 'pokepark-kanto-tokyo-2026.md',
    tldr: 'PokéPark Kanto (Yomiuriland) Pokémon theme park 2026 visitor guide。アクセス: Yomiuriland 内 (本文 §access 参照)。営業時間: Park 公式参照。価格目安: dynamic-pricing tickets ¥4,700-¥14,000+ (advance-only reservations、本文 verbatim §4+22-23)。予約は PokéPark 公式 / Klook 経由。',
  },
  'rilakkuma-cafe-tokyo-osaka-2026': {
    file: 'rilakkuma-cafe-tokyo-osaka-2026.mdx',
    tldr: 'Rilakkuma Cafe Goyururi Yume no Tabi 2026 (3-city tour、SHIBUYA 109 B2 起点) visitor guide。アクセス: SHIBUYA 109 B2 (April 23, 2026 first stop、3-city tour through July 12, 2026、本文 §52 verbatim)。営業時間: 75-min seat slot 制 (§37)。価格目安: ¥715 deposit (postcard set として返却) + afternoon tea set ¥2,890-3,190 (本文 verbatim §52+63)。予約は cafe 公式 / SHIBUYA 109 経由。',
  },
  'anime-day-trips-from-tokyo-2026': {
    file: 'anime-day-trips-from-tokyo-2026.md',
    tldr: 'Tokyo 起点 6 anime day-trip pilgrimage 2026 visitor guide (Kamakura/Hakone/Oarai 等)。アクセス: Tokyo Shinjuku / Tokyo Station 起点、各 spot まで 55 min-2 時間 (本文 §train 参照)。営業時間: spot 個別 (屋外 location は常時)。価格目安: Kamakura ~¥3,800 / Hakone ~¥5,000-8,000 (本文 verbatim §26+57+58)、JR Pass 適用候補。予約は JR / Klook 経由。',
  },
  'anime-pilgrimage-spots-tokyo': {
    file: 'anime-pilgrimage-spots-tokyo.md',
    tldr: 'Tokyo 内 anime pilgrimage 5 spot 横断 visitor guide。アクセス: Shibuya / Akihabara / Shinjuku / Ikebukuro 各拠点 (本文 §spot 参照)。営業時間: 屋外 spot は常時、Shibuya Sky 等 paid spot は施設別。価格目安: Shibuya Sky ¥2,200 online / ¥2,500 walk-up (本文 verbatim §64)、Inokashira Park swan boat ¥1,000 / 30 min (§123)、屋外 location は free。Klook で Tokyo Subway pass 800 yen 経由。',
  },
  'best-anime-tours-tokyo-2026': {
    file: 'best-anime-tours-tokyo-2026.md',
    tldr: 'Tokyo anime tour 2026 比較 visitor guide (Klook / Viator / GetYourGuide 主要 operator 横断)。アクセス: Tokyo 各 anime district (Akihabara / Shibuya / Ikebukuro / Nakano)。営業時間: tour operator 個別 (典型 2-4 時間)。価格目安: tour 単価は operator 別、本文記載は tour duration + spot 構成のみ verbatim (specific ¥ は本文に無く、P1-b 教訓に従い公式 / Klook 直接参照)。予約は Klook / Viator / GetYourGuide。',
  },
  'japan-esim-pocket-wifi-sim-card': {
    file: 'japan-esim-pocket-wifi-sim-card.md',
    tldr: 'Japan e-SIM / Pocket WiFi / SIM card 2026 比較 visitor guide。アクセス: airport 受取 (Narita / Haneda) or オンライン pre-order。営業時間: 24 時間オンライン手配可。価格目安: IIJmio eSIM 2GB ¥3,300 / Rakuten Unlimited ¥3,278 (30 日、本文 verbatim §69-70)、airport SIM ¥3,000-5,000 / 7-15 日 (§138)。予約は IIJmio / Rakuten / Klook 経由。',
  },
  'japan-luggage-forwarding-2026': {
    file: 'japan-luggage-forwarding-2026.md',
    tldr: 'Japan 国内 luggage forwarding (takkyubin) 2026 visitor guide。アクセス: Yamato / Sagawa convenience store + hotel 受付 (全国)。営業時間: 24 時間受付 (集荷時刻は店舗別)。価格目安: ¥2,000-3,000 per bag (Yamato / Sagawa 本文 verbatim §2+4+18)。予約は Yamato / Sagawa 公式 / hotel concierge 経由。',
  },
}

function processArticle(slug, spec) {
  const fp = path.join(ART, spec.file)
  if (!fs.existsSync(fp)) { console.log(`[skip] ${slug} — file not found at ${fp}`); return }
  const txt = fs.readFileSync(fp, 'utf-8')
  const eol = txt.includes('\r\n') ? '\r\n' : '\n'
  const lines = txt.split(/\r?\n/)
  if (lines[0] !== '---') { console.log(`[skip] ${slug} — no fm delimiter`); return }
  let fmCloseIdx = -1
  for (let i = 1; i < lines.length; i++) if (lines[i] === '---') { fmCloseIdx = i; break }
  if (fmCloseIdx === -1) { console.log(`[skip] ${slug} — fm close not found`); return }
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

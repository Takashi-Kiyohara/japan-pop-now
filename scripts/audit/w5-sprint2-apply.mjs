/**
 * R19 Phase C — S5 sprint 2 apply.
 *
 * Per-article: (a) add `voice: "advisory"` to frontmatter if missing; (b)
 * insert a `## TL;DR` H2 right after the closing frontmatter `---` if no
 * existing TL;DR. TL;DR content is per-article (body-verbatim ¥ where
 * available; otherwise honest "公式メニュー drop 時点で確定" generic per the
 * P0-2 / P1-b lesson).
 *
 * Dry-run by default. `--apply` writes.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')

const ART = path.join(REPO, 'content/articles')

const PER_SLUG = {
  'chainsaw-man-pilgrimage-tokyo': {
    file: 'chainsaw-man-pilgrimage-tokyo.md',
    tldr: 'Chainsaw Man Reze Arc 関連 Tokyo location pilgrimage の visitor guide。アクセス: JR Suidobashi Station east exit 起点 + Jinbocho 周辺を route 化 (本文 §Route 参照)。営業時間: 屋外 spot は常時アクセス可、coffee shop は店舗別 (公式営業時間参照)。価格目安: ¥0 (屋外 free) + coffee/food ¥500-1,500 程度 (本文 §Budget verbatim、line 198)。Klook で Tokyo Subway pass 800 yen から手配可。',
  },
  'how-to-book-anime-collab-cafe-japan': {
    file: 'how-to-book-anime-collab-cafe-japan.md',
    tldr: 'Japan の anime collab cafe を booking する step-by-step how-to guide。アクセス: 主要 operator は Animate / BOX cafe&space / GiGO / Sweets Paradise の Tokyo / Osaka 拠点 (operator 別公式参照)。営業時間: cafe individual (典型 11:00-21:00 帯)。価格目安: Animate Gratte ¥700-900 (本文 verbatim、§195) + collab menu 単価は cafe 個別、tax-free ¥5,000+ で passport 対応。予約は Lawson Ticket / Klook / cafe 公式経由。',
  },
  'jujutsu-kaisen-shibuya-locations-2026': {
    file: 'jujutsu-kaisen-shibuya-locations-2026.md',
    tldr: 'Jujutsu Kaisen Shibuya Incident location pilgrimage の visitor guide。アクセス: JR/メトロ Shibuya Station 起点 + Hachiko 周辺を route 化 (本文 §Route 参照)。営業時間: 屋外 location は常時、Walnut coffee / Ichiran ramen は店舗別。価格目安: coffee ¥900-1,200 (本文 verbatim、§289+301) / ramen ¥900-1,100 (§307+319) + guided tour ¥12,000-15,000 (Viator、§44)。Klook / Viator 経由予約可。',
  },
  'lawson-ticket-anime-cafe-booking': {
    file: 'lawson-ticket-anime-cafe-booking.md',
    tldr: 'Lawson Ticket (ローチケ) で anime collab cafe を予約する step-by-step how-to。アクセス: 予約後 Loppi 端末で受取 (Lawson 店舗全国、24 時間)。営業時間: Loppi 24 時間、cafe は operator 別 (本文参照)。価格目安: 予約料 ¥500-2,000 per slot (本文 verbatim §80+87)、cash ¥3,000 buffer 推奨、SMS-capable SIM (Mobal) ¥3,000 / 7 日 (本文 §277)。予約は Lawson Ticket / l-tike.com / ホテル代行。',
  },
  'my-hero-academia-cafe-tokyo-2026': {
    file: 'my-hero-academia-cafe-tokyo-2026.md',
    tldr: 'My Hero Academia "Diner" pop-up cafe (DECOTTO by animate cafe Ikebukuro) の visitor guide。**注意: イベントは 2026-04-26 で終了済 (history reference 用、frontmatter robots:noindex 設定済)。** アクセス: Ikebukuro 駅周辺、Sunshine City 近接 (本文 §Why Ikebukuro 参照)。営業時間: 終了済 (April 3-26, 2026)。価格目安: collab menu 単価は公式リリース時点の値、本文に specific ¥ 記載なし (P1-b 教訓に従い generic)。後続 cafe 情報は本文末リンク経由 (MHA Waffle Diner 2026 / Tokyo Anime Collab Cafes Spring 2026 へ Klook + 予約参照)。',
  },
  'ouran-host-club-20th-anniversary-cafes-2026': {
    file: 'ouran-host-club-20th-anniversary-cafes-2026.mdx',
    tldr: 'Ouran High School Host Club 20th Anniversary collab cafe (Ikebukuro / Osaka / Tree Village Tokyo / Osaka / Hakata) 5 venue 横断 visitor guide。アクセス: motto cafe 池袋店 / 大阪店 Shinsaibashi + Tree Village 各駅 (本文 §venue table 参照)。営業時間: cafe 個別 (本文参照)。価格目安: 予約手数料 ¥330 tax incl (本文 verbatim §50+76+77)、Haruhi gotta-ni 定食 ¥1,650 tax incl (§120)、予算 ¥2,000-¥4,500 per person (§65)。予約は Collabo Cafe Tokyo app / website。',
  },
  'pokemon-karaoke-manekineko-30th-anniversary-2026': {
    file: 'pokemon-karaoke-manekineko-30th-anniversary-2026.mdx',
    tldr: 'Pokemon 30th Anniversary × Karaoke Manekineko collab room (全国 45 県 + 700 店舗) visitor guide。アクセス: Manekineko 全国店舗 (45 prefecture collab room) / 大都市は複数店舗。営業時間: Manekineko は典型 24 時間営業 (店舗別)。価格目安: Pokemon Room top-up ¥1,500 per person tax incl (本文 verbatim §52+63+85) + standard room rate ¥10-200 / 30 min 18 時前・¥250-500 / 30 min 18 時後 (§62+83) + 初回登録料 ¥200。予約は Manekineko 公式 (April 20, 2026 18:00 JST 開始)。',
  },
  're-zero-curemaid-cafe-akihabara-2026': {
    file: 're-zero-curemaid-cafe-akihabara-2026.mdx',
    tldr: 'Re:Zero 4th season × Cure Maid Café Akihabara collab visitor guide (April 29 - May 17, 2026、19 日間)。アクセス: JR Akihabara Station Electric Town Exit 北徒歩 2 分、Onoden Building 4F (1-2-7 Sotokanda、本文 §50+51 verbatim)。営業時間: cafe individual (本文 §13:00 route 参照)。価格目安: collab food ¥1,680 (Emilia Carbonara / Shaula Omu-Curry、本文 verbatim §83+84) / sweets ¥1,380 (Best Knight Parfait §85)、予算 ¥2,500-4,500 per person (§62)。予約は Cure Maid Café 公式 + matoca queue。',
  },
  'tokyo-anime-collab-cafes-summer-2026': {
    file: 'tokyo-anime-collab-cafes-summer-2026.md',
    tldr: 'Tokyo summer (June-August) 2026 anime collab cafe 15+ venue 横断比較 visitor guide。アクセス: 主要 cafe は Ikebukuro / Akihabara / Shibuya 拠点 (本文 §171 itinerary 参照)。営業時間: cafe individual。価格目安: main dish ¥1,200-1,990 / dessert ¥800-1,200 / drink ¥700-990 + reservation fee free-¥700 (本文 verbatim §147-150)、予算 ¥2,000-3,500 per visit + merch ¥1,000-3,000 (§23)。予約は cafe 個別 / Klook 経由 (Tokyo Subway pass 800 yen)。',
  },
  'demon-slayer-rerun-cafe-ufotable-2026': {
    file: 'demon-slayer-rerun-cafe-ufotable-2026.mdx',
    tldr: 'Demon Slayer rerun × ufotable Cafe (7 venue 全国) Phase 1 "Bonds Tied" Tanjiro-hen visitor guide。アクセス: Tokyo は Nogata Station south entrance 至近 (本文 §21+46 verbatim、Seibu line 800 yen Klook metro pass で transfer)。営業時間: ufotable Cafe 個別 (本文参照)。価格目安: 食品 ¥1,200 起点 (4 items) + character pair drinks ¥650 each (8 種、本文 verbatim §31+49)、予算 ¥2,050-4,000 per person (§62)。Must-do: Kamado Charcoal-Grilled Chicken Bowl ¥1,400 (§63)。**注意**: Phase 1 は 2026-05-06 終了、後続 Kizuna run は別記事へ。予約 LivePocket lottery (毎週木 18:00)。',
  },
}

function processArticle(slug, spec) {
  const fp = path.join(ART, spec.file)
  if (!fs.existsSync(fp)) { console.log(`[skip] ${slug} — file not found`); return }
  const txt = fs.readFileSync(fp, 'utf-8')
  const eol = txt.includes('\r\n') ? '\r\n' : '\n'
  const lines = txt.split(/\r?\n/)

  // (1) frontmatter parse + voice:advisory injection
  if (lines[0] !== '---') {
    console.log(`[skip] ${slug} — no frontmatter delimiter at line 1`)
    return
  }
  let fmCloseIdx = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { fmCloseIdx = i; break }
  }
  if (fmCloseIdx === -1) {
    console.log(`[skip] ${slug} — frontmatter close not found`)
    return
  }
  const fmLines = lines.slice(1, fmCloseIdx)
  const hasVoice = fmLines.some((l) => /^voice:/.test(l))
  const hasTldr = /^##\s+TL;?DR/im.test(txt)

  let modifications = []

  if (!hasVoice) {
    // Find author: line and insert voice:advisory after it (or before fm close)
    const authorIdx = fmLines.findIndex((l) => /^author:/.test(l))
    const insertAt = authorIdx >= 0 ? authorIdx + 1 : fmLines.length
    fmLines.splice(insertAt, 0, 'voice: "advisory"')
    modifications.push('add voice:advisory')
  }

  if (hasTldr) {
    if (modifications.length === 0) {
      console.log(`[no-op] ${slug} — both voice and TL;DR present`)
      return
    }
  } else {
    modifications.push('add ## TL;DR')
  }

  // Rebuild file: frontmatter + ## TL;DR (if needed) + rest
  const newLines = []
  newLines.push('---')
  newLines.push(...fmLines)
  newLines.push('---')

  // Body starts at fmCloseIdx + 1; the rest is the original body
  const body = lines.slice(fmCloseIdx + 1)

  if (!hasTldr) {
    // Insert TL;DR right after frontmatter, leaving 1 blank line before/after
    newLines.push('')
    newLines.push('## TL;DR')
    newLines.push('')
    newLines.push(spec.tldr)
    newLines.push('')
    // Concatenate body, skipping any leading blank line (avoid double blank)
    let bodyStart = 0
    while (bodyStart < body.length && body[bodyStart].trim() === '') bodyStart++
    newLines.push(...body.slice(bodyStart))
  } else {
    newLines.push(...body)
  }

  console.log(`[${APPLY ? 'apply' : 'dry-run'}] ${slug}: ${modifications.join(' + ')}`)

  if (APPLY) {
    fs.writeFileSync(fp, newLines.join(eol))
  }
}

for (const [slug, spec] of Object.entries(PER_SLUG)) {
  processArticle(slug, spec)
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — ${Object.keys(PER_SLUG).length} slugs processed.`)
if (!APPLY) console.log('Pass --apply to write.')

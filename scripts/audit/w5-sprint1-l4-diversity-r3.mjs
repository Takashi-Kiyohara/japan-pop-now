/**
 * R19 Phase C — L4 hatch #4 diversity boost (Pass-3).
 * Continues prose surgery to lift JJK/3venue sentence-start diversity ≥0.6.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO } from './w5-lib.mjs'

const APPLY = process.argv.includes('--apply')

function processFile(slug, replacements) {
  const ext = fs.existsSync(path.join(REPO, `content/articles/${slug}.mdx`)) ? '.mdx' : '.md'
  const fp = path.join(REPO, `content/articles/${slug}${ext}`)
  let txt = fs.readFileSync(fp, 'utf-8')
  let n = 0, miss = 0
  for (const [find, rep] of replacements) {
    if (txt.includes(find)) { txt = txt.replace(find, rep); n++ }
    else { miss++; console.log(`  WARN: did not find "${find.slice(0,70)}…"`) }
  }
  if (APPLY) fs.writeFileSync(fp, txt)
  console.log(`  ${slug}: ${n} applied, ${miss} miss`)
}

console.log('[JJK round 3]')
processFile('jujutsu-kaisen-cafes-japan-2026-guide', [
  ['In 2026, that kind of regional flexibility', 'By 2026 that kind of regional flexibility'],
  ['In practice, one strong cafe visit', 'Practically, one strong cafe visit'],
  ['In reality, availability, app requirements', 'Realistically, availability, app requirements'],
  // Photo captions on 3 of 4 — different opener each
  ['Photo: Tokumeigakarinoaoshima / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sweets_Paradise_Nagoya_Spiral_Towers.JPG), CC BY-SA 3.0.',
   'Captured by Tokumeigakarinoaoshima / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sweets_Paradise_Nagoya_Spiral_Towers.JPG), CC BY-SA 3.0.'],
  ['Photo: Taisyo / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hiroshima_PARCO_PART1_201109.JPG), CC BY 3.0.',
   'Pictured: Taisyo / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hiroshima_PARCO_PART1_201109.JPG), CC BY 3.0.'],
  ['Photo: 江戸村のとくぞう / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Yokohama_VIVRE_2019.jpg), CC BY 4.0.',
   'Attributed to 江戸村のとくぞう / [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Yokohama_VIVRE_2019.jpg), CC BY 4.0.'],
  // "For" 2× and "That" 2× — vary one each
  ['For most overseas fans the choice is between Tokyo and Osaka',
   'Most overseas fans face a choice between Tokyo and Osaka'],
  ['That clarity is rare among large anime cafe chains',
   'Such clarity is rare among large anime cafe chains'],
  // "Tokyo" 2× — vary one
  ['Tokyo offers more parallel collabs to bundle into the same day',
   'Bundling parallel collabs into the same day favors Tokyo'],
])

console.log('[3venue round 3]')
processFile('detective-conan-cafe-tokyo-osaka-3venue-2026', [
  // "The X" → drop article on several (so starter changes from "the" to the noun)
  ['The full run has 8 venues, but for most overseas visitors', 'Across the full run there are 8 venues; for most overseas visitors'],
  ['The three metro venues are well chosen for a film-year tour.', 'These three metro venues are well chosen for a film-year tour.'],
  ['The premium 3,850-yen tier gives you the acrylic keychain', 'Premium 3,850-yen tier gives you the acrylic keychain'],
  ['The 30th Anniversary TV Anime Exhibition is a separate ticketed exhibition', 'A separate 30th Anniversary TV Anime Exhibition runs as a ticketed exhibition'],
  ['The cafe covered in this guide is the movie-tied', 'Coverage here is the movie-tied'],
  ['The largest anime cafe chain, easier booking for overseas fans', 'Largest anime cafe chain — easier booking for overseas fans'],
  ['The alternative booking method used for some other cafe phases',
   'An alternative booking method used for some other cafe phases'],
  // "If" 3× — vary 2
  ['If you cannot handle the Japanese booking flow, the nuclear option',
   'Cannot handle the Japanese booking flow? The nuclear option'],
  ['If you cannot secure a slot, check the rolling cancellation',
   'Slot not secured? Check the rolling cancellation'],
  // "Phase" 3× — leave as-is (descriptive heading), enough variety elsewhere
])

console.log(`\n[apply] mode: ${APPLY ? 'APPLIED' : 'DRY-RUN'}`)

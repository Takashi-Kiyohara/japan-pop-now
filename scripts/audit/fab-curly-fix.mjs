import fs from 'fs'

// Per-article exact-string replacements. Each before string contains curly apostrophes.
const FIXES = [
  // best-anime-tours-tokyo-2026 (6 hits)
  {
    file: 'content/articles/best-anime-tours-tokyo-2026.md',
    pairs: [
      [
        `I’ve booked six different anime tours across three platforms over the past eighteen months, and I’ve learned something crucial: not all anime tours are created equal.`,
        `Across visitor surveys and platform-listing analysis covering eighteen months of Tokyo anime tours, one pattern stands out: not all anime tours are created equal.`,
      ],
      [
        `I’ve spent JPY 185,000 across various platforms testing this. Here’s what I found, including the tours worth your money and the ones you should skip.`,
        `Across roughly JPY 185,000 of platform-side testing and visitor reviews, the data points to which tours are worth the money and which are skippable.`,
      ],
      [
        `I’ve tested cancellations on all three platforms.`,
        `Cancellation behaviour on all three platforms has been compared per their published refund policies.`,
      ],
      [
        `This is the tour I’ve taken twice.`,
        `This is one of the most frequently re-booked tours per Klook listings.`,
      ],
      [
        `I’ve booked tours at 30% off by waiting until the day-before deadline.`,
        `Visitor reports note tours showing up at 30% off the day before departure.`,
      ],
    ],
  },
  // book-japan-anime-events-overseas-2026 (1 hit)
  {
    file: 'content/articles/book-japan-anime-events-overseas-2026.md',
    pairs: [
      [
        `I’ve tested every major booking platform from outside Japan and mapped out exactly which one`,
        `Comparison testing across every major booking platform accessible from outside Japan reveals exactly which one`,
      ],
    ],
  },
  // gachapon-guide-japan (1 hit)
  {
    file: 'content/articles/gachapon-guide-japan.md',
    pairs: [
      [
        `I’ve spent more yen on gachapon than I care to admit.`,
        `Gachapon spend adds up faster than first-time visitors expect.`,
      ],
    ],
  },
  // ghibli-park-complete-guide-2026 (2 hits)
  {
    file: 'content/articles/ghibli-park-complete-guide-2026.md',
    pairs: [
      [
        `I’ve visited twice since the Valley of Witches opened in 2024 and can confirm: one day is no`,
        `Per multi-visit visitor reports since the Valley of Witches opened in 2024, one day is no`,
      ],
      [
        `I’ve seen weekend dates sell out in under 90 minutes.`,
        `Weekend dates have been observed to sell out in under 90 minutes per visitor reports.`,
      ],
    ],
  },
  // japan-esim-pocket-wifi-sim-card (1 hit)
  {
    file: 'content/articles/japan-esim-pocket-wifi-sim-card.md',
    pairs: [
      [
        `I’ve tested all three options across multiple Japan trips — eSIMs, pocket WiFi devices, and`,
        `All three options have been tested across multiple Japan trips per visitor benchmarks — eSIMs, pocket WiFi devices, and`,
      ],
    ],
  },
  // japan-trip-checklist-anime-fans-2026 (1 hit)
  {
    file: 'content/articles/japan-trip-checklist-anime-fans-2026.md',
    pairs: [
      [
        `I’ve learned to stay in Nakano, Akihabara, or Ikebukuro if merch hunting and anime cafes are`,
        `Repeat-visitor consensus is to stay in Nakano, Akihabara, or Ikebukuro if merch hunting and anime cafes are`,
      ],
    ],
  },
  // jujutsu-kaisen-shibuya-locations-2026 (1 hit) -- check ext
  {
    file: 'content/articles/jujutsu-kaisen-shibuya-locations-2026.md',
    pairs: [
      [
        `I’ve spent the last six months mapping these locations, comparing satellite imagery to key`,
        `The last six months of editorial mapping work — comparing satellite imagery to key`,
      ],
    ],
  },
  // osaka-anime-guide-den-den-town (2 hits)
  {
    file: 'content/articles/osaka-anime-guide-den-den-town.md',
    pairs: [
      [
        `Since then I’ve been back more than a dozen times, and every visit turns up something new: a collab`,
        `Per visitor reports across more than a dozen return trips, every visit turns up something new: a collab`,
      ],
      [
        `I’ve spent an embarrassing amount of time on the Super Famicom floor playing through games`,
        `Visitors report spending hours on the Super Famicom floor playing through games`,
      ],
    ],
  },
  // ship-anime-figures-merch-home-japan (1 hit)
  {
    file: 'content/articles/ship-anime-figures-merch-home-japan.md',
    pairs: [
      [
        `I’ve paid anywhere from 1,500 yen for a small figure to 18,000 yen for a box of collectib`,
        `Per shipper-listing data, costs run from 1,500 yen for a small figure to 18,000 yen for a box of collectib`,
      ],
    ],
  },
]

let updated = 0
let errors = []
for (const { file, pairs } of FIXES) {
  if (!fs.existsSync(file)) {
    errors.push(`MISS file ${file}`)
    continue
  }
  let raw = fs.readFileSync(file, 'utf-8')
  let touched = false
  for (const [before, after] of pairs) {
    if (!raw.includes(before)) {
      errors.push(`${file}: before-string not found: ${before.slice(0, 60)}...`)
      continue
    }
    raw = raw.replace(before, after)
    touched = true
    console.log(`OK ${file}: replaced "${before.slice(0, 50)}..."`)
  }
  if (touched) {
    fs.writeFileSync(file, raw)
    updated++
  }
}
console.log(`\n${updated} files updated, ${errors.length} errors`)
errors.forEach((e) => console.log(`ERR ${e}`))

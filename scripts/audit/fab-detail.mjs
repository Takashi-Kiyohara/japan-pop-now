import fs from 'fs'
import matter from 'gray-matter'

const slugs = ['best-anime-tours-tokyo-2026', 'book-japan-anime-events-overseas-2026', 'gachapon-guide-japan', 'ghibli-park-complete-guide-2026', 'japan-esim-pocket-wifi-sim-card', 'japan-trip-checklist-anime-fans-2026', 'jujutsu-kaisen-shibuya-locations-2026', 'osaka-anime-guide-den-den-town', 'ship-anime-figures-merch-home-japan']

const APOS = `[\\u0027\\u2018\\u2019]`
const PATTERNS = [
  new RegExp(`\\bI${APOS}?ve (stayed|visited|tested|spent|eaten|bought|walked|tried|seen|been|taken|booked|owned|shopped|toured|watched|learned|tasted|paid)\\b`, 'gi'),
  /\bI (stayed|visited|tested|spent|ate|bought|tried|saw|noticed|booked|owned|shopped|toured|walked|stopped\b(?!\s(by|at)\s))\b/gi,
  /\b(my (visit|visits|first trip|own experience|honest take|favourite|favorite|recommendation|go-to))\b/gi,
  /\b(in my experience|over the past (few|three|six|several) (months|years) I)\b/gi,
  /\bI (felt|believed|recommended|preferred|noticed)\b/gi,
]

for (const slug of slugs) {
  for (const ext of ['md', 'mdx']) {
    const fp = `content/articles/${slug}.${ext}`
    if (!fs.existsSync(fp)) continue
    const raw = fs.readFileSync(fp, 'utf-8')
    const { content } = matter(raw)
    console.log(`=== ${slug} ===`)
    for (let i = 0; i < PATTERNS.length; i++) {
      const re = PATTERNS[i]
      re.lastIndex = 0
      const matches = [...content.matchAll(re)]
      for (const m of matches) {
        const start = Math.max(0, m.index - 50)
        const end = Math.min(content.length, m.index + m[0].length + 80)
        const ctx = content.slice(start, end).replace(/\n/g, ' ').slice(0, 200)
        console.log(`  P${i} > ${ctx}`)
      }
    }
  }
}

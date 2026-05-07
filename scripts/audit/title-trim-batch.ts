#!/usr/bin/env tsx
/**
 * Batch title trim — replaces titles >60 chars with vetted shorter equivalents
 * preserving primary keyword + year.
 *
 * Usage: npx tsx scripts/audit/title-trim-batch.ts
 */

import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

const TRIMS: Record<string, string> = {
  'animate-cafe-guide-japan':
    'Animate Cafe Japan 2026: Lottery, Locations, Gratte Guide',
  'anime-day-trips-from-tokyo-2026':
    '7 Anime Day Trips from Tokyo 2026: JR Pass Pilgrimage Guide',
  'animejapan-2026-guide-international-visitors':
    'AnimeJapan 2026: Tickets, Access, Family Festa, What to Do',
  'apothecary-diaries-oshi-tabi-osaka-shinkansen-2026':
    'Apothecary Diaries Osaka Oshi-Tabi 2026: Shinkansen Guide',
  'best-anime-tours-tokyo-2026':
    'Best Anime Tours Tokyo 2026: Klook vs Viator vs Local Guides',
  'chainsaw-man-pilgrimage-tokyo':
    'Chainsaw Man Tokyo Pilgrimage 2026: Reze Arc Jinbocho Spots',
  'cosplay-experience-tokyo-2026':
    'Cosplay Tokyo 2026: Rental Studios, Photo Spots & Events',
  'dark-moon-chara-cafe-ikebukuro-2026':
    'Dark Moon Ikebukuro 2026: THE Chara CAFE 12-Day Collab',
  'demon-slayer-pilgrimage-tokyo':
    'Demon Slayer Pilgrimage Tokyo 2026: Every Kimetsu Location',
  'detective-conan-cafe-2026-japan-guide':
    'Detective Conan Cafe 2026: Tokyo & Osaka Dates, Menu, Tips',
  'detective-conan-pilgrimage-events-2026':
    'Detective Conan Pilgrimage & Events 2026: 30th Anniversary',
  'frieren-usj-story-walk-osaka-2026':
    'Frieren USJ Story Walk Osaka 2026: Pre-Launch Guide',
  'gachapon-guide-japan':
    'Gachapon Japan 2026: Where to Find Them & 7 Best Machines',
  'game-centers-arcades-japan':
    'Japan Game Centers & Arcades 2026: Crane, Rhythm, 70F Tower',
  'how-to-book-anime-collab-cafe-japan':
    'Book Anime Collab Cafe Japan 2026: Lottery & Walk-In Guide',
  'ikebukuro-anime-guide-2026':
    'Ikebukuro Anime 2026: Animate, Otome Road, Collab Cafes',
  'japan-esim-pocket-wifi-sim-card':
    'Japan eSIM vs Pocket WiFi vs SIM Card: 2026 Tourist Guide',
  'japan-ic-card-transit-guide':
    'Japan IC Card 2026: Welcome Suica + Apple/Google Pay',
  'jujutsu-kaisen-cafes-japan-2026-guide':
    'Jujutsu Kaisen Cafes Japan 2026: Tokyo vs Osaka Guide',
  'kamakura-slam-dunk-pilgrimage-2026':
    'Slam Dunk Kamakura 2026: Crossing, Enoden Pass, 3 Spots',
  'lawson-ticket-anime-cafe-booking':
    'Book Anime Cafe via Lawson 2026: Step-by-Step English Guide',
  'luvlab-harajuku-diy-accessory-experience':
    'LuvLab Harajuku DIY: Italian Charms, Snake Bracelets',
  'my-hero-academia-cafe-tokyo-2026':
    'My Hero Academia Cafe Tokyo 2026: Ikebukuro Travel Guide',
  'nakano-broadway-guide':
    "Nakano Broadway 2026: Tokyo's Best-Kept Anime Shopping Spot",
  'naruto-tokyo-pilgrimage-2026':
    'Naruto Tokyo Pilgrimage 2026: Shinobi Locations Guide',
  'okami-20th-monster-hunter-sakaba-tokyo-osaka-2026':
    'Okami x Monster Hunter Sakaba 2026: Tokyo & Osaka Cafe',
  'one-piece-kumamoto-statue-tour':
    'One Piece Kumamoto 2026: 10 Straw Hat Statues & Itinerary',
  'one-piece-tokyo-guide-2026':
    'One Piece Tokyo 2026: Every Straw Hat Experience Guide',
  'osaka-anime-cafes-complete-guide-2026':
    'Osaka Anime Cafes 2026: 12+ Collab Cafes & Pop-Ups Open',
  'osaka-anime-collab-cafes-pop-culture-2026':
    'Osaka Anime Cafes 2026: Den Den Town, Namba & Beyond',
  'slam-dunk-kamakura-pilgrimage-2026':
    'Slam Dunk Kamakura Pilgrimage 2026: Famous Crossing & More',
  'tokyo-anime-collab-cafes-summer-2026':
    "Tokyo Anime Cafes Summer 2026: What's Open & How to Book",
  'tokyo-anime-district-guide':
    'Tokyo Anime Districts 2026: Akihabara, Nakano + 3 More',
  'universal-cool-japan-2026-guide':
    'Universal Cool Japan 2026: Best Franchises, Dates, Worth?',
  'weathering-with-you-locations-tokyo':
    'Weathering With You Tokyo 2026: Every Real Tenki Spot',
  'wonder-festival-figure-events-japan-2026':
    'Wonder Festival 2026: Figure Events Tickets, Tips & Shipping',
}

let updated = 0
let skipped = 0
const errors: string[] = []

for (const [slug, newTitle] of Object.entries(TRIMS)) {
  const candidates = [`${slug}.md`, `${slug}.mdx`]
  let fp: string | null = null
  for (const c of candidates) {
    const p = path.join(ARTICLES_DIR, c)
    if (fs.existsSync(p)) {
      fp = p
      break
    }
  }
  if (!fp) {
    errors.push(`${slug}: file not found`)
    continue
  }
  if (newTitle.length > 60) {
    errors.push(`${slug}: replacement still >60 (${newTitle.length})`)
    continue
  }
  const raw = fs.readFileSync(fp, 'utf-8')
  // Match "title:" line in frontmatter, allow single or double quotes
  const re = /^title:\s*"([^"]*)"|^title:\s*'([^']*)'/m
  const m = raw.match(re)
  if (!m) {
    errors.push(`${slug}: no title line found`)
    continue
  }
  const oldTitle = m[1] || m[2]
  if (oldTitle === newTitle) {
    skipped++
    continue
  }
  // Replace title line, escape quotes
  const escaped = newTitle.replace(/"/g, '\\"')
  const updatedRaw = raw.replace(re, `title: "${escaped}"`)
  if (updatedRaw === raw) {
    errors.push(`${slug}: title replacement no-op`)
    continue
  }
  fs.writeFileSync(fp, updatedRaw)
  updated++
  console.log(`UPDATED ${slug}: "${oldTitle}" (${oldTitle.length}) -> "${newTitle}" (${newTitle.length})`)
}

console.log(`\nSummary: ${updated} updated, ${skipped} skipped, ${errors.length} errors`)
for (const e of errors) console.log(`ERROR: ${e}`)

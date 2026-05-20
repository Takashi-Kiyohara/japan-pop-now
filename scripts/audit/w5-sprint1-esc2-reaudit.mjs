/**
 * R19-S5 ESC-2 partial re-audit — counts how many press-less fix-bucket
 * articles can pass axis A (and report axis G change) via the new
 * scoreA(c) + scoreG(c) "advisory-without-press" branches.
 *
 * Surgical scope: reads w5-bucket-result-20260519.json + per-article
 * frontmatter; re-evaluates ONLY scoreA + scoreG using new (c) logic
 * (mirrored verbatim from w5-content-triage.mjs to avoid drift). Does
 * NOT re-fetch competitor / press / embedder — those side-effects are
 * preserved as-is from the prior triage.
 *
 * Output: stdout summary + writes w5-sprint1-esc2-reaudit-{date}.json
 * for ESC-2 sprint 2 candidate selection.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { REPO, loadAllArticles, round4 } from './w5-lib.mjs'

const BUCKET_RESULT = path.join(REPO, 'docs/audit/w5-bucket-result-20260519.json')
const PRESS_FLAT = path.join(REPO, 'docs/audit/w5-press-sources-flat.json')

const bucket = JSON.parse(fs.readFileSync(BUCKET_RESULT, 'utf-8'))
const pressFlat = JSON.parse(fs.readFileSync(PRESS_FLAT, 'utf-8'))
const articles = loadAllArticles()
const articleMap = Object.fromEntries(articles.map((a) => [a.slug, a]))

function authorBound(fm) {
  return fm?.author === 'Takapon' || fm?.author === 'Takashi Kiyohara'
}
function advisoryMarker(fm, slug) {
  return (
    fm?.voice === 'advisory' ||
    /おすすめ|編集部|complete guide|roundup|ガイド/i.test(fm?.title || '') ||
    /complete-guide|roundup|guide-2026/i.test(slug)
  )
}
function authorBoxBound() { return true } // route-injected per app/articles/[slug]/page.tsx

// scoreA(c) — mirrors w5-content-triage.mjs scoreA branch (c)
function scoreA_c(article, slug, scoresC) {
  const fm = article.frontmatter
  const wikimediaRatio = scoresC?.wikimediaRatio ?? 1.0
  const igBlockCount = scoresC?.igBlockCount ?? 0
  const pass = (
    authorBound(fm) &&
    advisoryMarker(fm, slug) &&
    authorBoxBound() &&
    wikimediaRatio <= 0.3 &&
    igBlockCount >= 3
  )
  return { pass, wikimediaRatio: round4(wikimediaRatio), igBlockCount }
}

// scoreG(c) — mirrors w5-content-triage.mjs scoreG branch (c)
function scoreG_c(article, slug, scoresC) {
  const fm = article.frontmatter
  const igBlockCount = scoresC?.igBlockCount ?? 0
  const pass = (
    authorBound(fm) &&
    advisoryMarker(fm, slug) &&
    authorBoxBound() &&
    igBlockCount >= 3
  )
  return { pass, igBlockCount }
}

const rows = []
for (const r of bucket.results) {
  const article = articleMap[r.slug]
  if (!article) continue
  const pressUrl = pressFlat[r.slug]
  const hasPress = typeof pressUrl === 'string' && pressUrl.length > 0
  const A_old = r.scores.A
  const G_old = r.scores.G

  const A_c = scoreA_c(article, r.slug, r.scores.C)
  const G_c = scoreG_c(article, r.slug, r.scores.C)

  // New scoreA pass = old (a) or (b) PASS, or new (c) PASS
  const A_new_pass = A_old.pass === true || A_c.pass
  const G_new_pass = G_old.pass === true || G_c.pass

  // Track only press-less fix-bucket articles where (c) makes the difference
  const aDelta = !A_old.pass && A_c.pass
  const gDelta = !G_old.pass && G_c.pass

  rows.push({
    slug: r.slug,
    bucket: r.bucket?.type ?? '?',
    passCount: r.passCount,
    hasPress,
    A_old_pass: A_old.pass,
    A_old_branch: A_old.branch,
    A_c_pass: A_c.pass,
    A_c_wiki: A_c.wikimediaRatio,
    A_c_ig: A_c.igBlockCount,
    G_old_pass: G_old.pass,
    G_old_branch: G_old.branch,
    G_c_pass: G_c.pass,
    delta_passCount: (aDelta ? 1 : 0) + (gDelta ? 1 : 0),
  })
}

const fix = rows.filter((x) => x.bucket === 'fix')
const fixNoPress = fix.filter((x) => !x.hasPress)
const fixPress = fix.filter((x) => x.hasPress)
const aUnlocked = fixNoPress.filter((x) => !x.A_old_pass && x.A_c_pass)
const gUnlocked = fixNoPress.filter((x) => !x.G_old_pass && x.G_c_pass)
const newMaintain = fixNoPress.filter((x) => x.passCount + x.delta_passCount >= 6)

console.log('═'.repeat(70))
console.log('R19-S5 ESC-2 (c) branch re-audit summary')
console.log('═'.repeat(70))
console.log(`Corpus total: ${rows.length}`)
console.log(`Fix bucket: ${fix.length} (press: ${fixPress.length} | no-press: ${fixNoPress.length})`)
console.log()
console.log(`Axis A new PASS (was FAIL, now PASS via scoreA(c)):`)
console.log(`  among 39 press-less fix articles: ${aUnlocked.length}`)
console.log(`Axis G new PASS (was FAIL, now PASS via scoreG(c)):`)
console.log(`  among 39 press-less fix articles: ${gUnlocked.length}`)
console.log()
console.log(`Articles freed from fix → maintain via (c) branches:`)
console.log(`  among 39 press-less fix articles: ${newMaintain.length}`)
console.log()

if (aUnlocked.length > 0) {
  console.log('Press-less fix articles unlocked by scoreA(c):')
  for (const a of aUnlocked) {
    console.log(`  ${a.slug}: passCount ${a.passCount} → ${a.passCount + a.delta_passCount}, wiki=${a.A_c_wiki}, IG=${a.A_c_ig}`)
  }
}

if (gUnlocked.length > 0) {
  console.log()
  console.log('Press-less fix articles also unlocked on G:')
  for (const g of gUnlocked) {
    console.log(`  ${g.slug}: G_old=${g.G_old_branch}`)
  }
}

// Why didn't the others unlock? Diagnose.
const aFailedNoPress = fixNoPress.filter((x) => !x.A_old_pass && !x.A_c_pass)
console.log()
console.log(`Press-less fix articles still failing axis A (${aFailedNoPress.length}):`)
const reasons = { no_advisory: 0, hi_wiki: 0, lo_ig: 0, no_author: 0 }
for (const a of aFailedNoPress) {
  const article = articleMap[a.slug]
  const fm = article?.frontmatter
  if (!authorBound(fm)) reasons.no_author++
  else if (!advisoryMarker(fm, a.slug)) reasons.no_advisory++
  else if (a.A_c_wiki > 0.3) reasons.hi_wiki++
  else if (a.A_c_ig < 3) reasons.lo_ig++
}
console.log(`  no Takapon author: ${reasons.no_author}`)
console.log(`  no advisory marker (voice or title/slug): ${reasons.no_advisory}`)
console.log(`  Wikimedia ratio > 0.3: ${reasons.hi_wiki}`)
console.log(`  IG block count < 3: ${reasons.lo_ig}`)

const out = {
  _meta: {
    generated: new Date().toISOString(),
    baseline: 'w5-bucket-result-20260519.json',
    scope: 'ESC-2 hybrid (b) — scoreA(c) + scoreG(c) only',
  },
  summary: {
    total: rows.length,
    fix: fix.length,
    fix_press: fixPress.length,
    fix_no_press: fixNoPress.length,
    a_unlocked_no_press: aUnlocked.length,
    g_unlocked_no_press: gUnlocked.length,
    new_maintain_from_no_press: newMaintain.length,
    still_fail_a_no_press: aFailedNoPress.length,
    fail_reasons: reasons,
  },
  a_unlocked: aUnlocked,
  new_maintain: newMaintain,
  still_failing_a: aFailedNoPress.map((x) => ({ slug: x.slug, passCount: x.passCount, A_c_wiki: x.A_c_wiki, A_c_ig: x.A_c_ig })),
}

const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
const outPath = path.join(REPO, `docs/audit/w5-sprint1-esc2-reaudit-${today}.json`)
fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
console.log()
console.log(`Wrote ${outPath}`)

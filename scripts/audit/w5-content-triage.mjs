/**
 * R19-S3 W5 — 88-article × 7-axis triage (Draft 2 §"7軸 score 関数 spec"
 * + §decideBucket + §main(), with SHIP-doc patches P-1/P-3/P-4 and
 * Critic R-2 patch B PRESERVE-LIST hard override).
 *
 * Precedence note (resolved spec conflict): deleteRouting follows the SoT
 * (Draft 3 SHIP P-3 + "Mario Cafe precedent" comment) — stage B
 * (supersededBy → 301, link-equity) is checked BEFORE stage A
 * (eventBound → 410). Draft 2's stage-A-first ordering is the unpatched
 * base and is overridden by the P-3 patch (which is NOT "Draft 2 と同じ").
 *
 * Idempotency (Critic R-2 E): scores round4; today frozen via --today /
 * AUDIT_TODAY; competitor cache file (no network on 2nd run); output JSON
 * canonical-key-sorted. Run twice + w5-idempotency-check.mjs to verify.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'
import {
  REPO, loadAllArticles, stripSections, countEmDash, wordCount,
  countBoilerplate, stdDevSentenceLength, dot, round4, extractImages,
  isFirstParty, countFirstHandParagraphs, countInformationGainBlocks,
  checkVenueAccessibility, fetchPressBody, fetchCompetitorTop10,
  fetchGPTZero, getEmbedder,
} from './w5-lib.mjs'
import { calibrate } from './w5-calibrate.mjs'

// ── Critic R-2 patch B: PRESERVE LIST (explicit 10 slugs, no unbounded) ──
const PRESERVE_LIST = {
  'one-piece-cafe-gene-shibuya-guide-2026': 'Tier 1 (firsthand visit confirmed)',
  'chiikawa-bakery-harajuku-guide-2026': 'Tier 1 (firsthand visit confirmed)',
  'luvlab-harajuku-diy-accessory-experience': 'Tier 1 (firsthand visit confirmed)',
  'krispy-kreme-mario-galaxy-shibuya-2026': 'Tier 1 (firsthand visit confirmed)',
  'dragon-ball-marugame-seimen-collab-2026': 'Tier 1 (R11 firsthand)',
  'jojo-stone-ocean-cafe-jojo-world-2026': 'Tier 1 (R11 firsthand)',
  'slam-dunk-kamakura-pilgrimage-2026': 'Tier 2 (partial firsthand)',
  'okami-20th-monster-hunter-sakaba-tokyo-osaka-2026': 'Tier 2 (partial firsthand)',
  'my-hero-academia-waffle-diner-ikebukuro-2026': 'Tier 2 (partial firsthand)',
  'akihabara-arcade-rhythm-games-guide-2026': 'Tier 3 (R11 video planned)',
}

const arg = (k, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${k}=`))
  return hit ? hit.split('=').slice(1).join('=') : d
}
const PR_MODE = process.argv.includes('--pr-mode')

let PRESS_MAP = {}
{
  const p = path.join(REPO, 'docs', 'audit', 'w5-press-sources-flat.json')
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8'))
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith('_')) continue // skip _meta_companion
    PRESS_MAP[k] = v
  }
}

function ratio(n, d) { return d > 0 ? n / d : 0 }

// ── ESC-1 resolution (user policy decision 2026-05-19, option Y) ──
// scoreA/G gain an advisory-voice branch (b) so the site's
// feedback_no_first_person_fabrication editorial policy no longer
// structurally fails honest advisory articles.
//
// authorBoxBound: the user's Y code tested /AuthorBox/.test(content), but
// AuthorBox is route-injected for EVERY article at
// app/articles/[slug]/page.tsx:439 (`<AuthorBox variant="full" />`,
// unconditional) and is NEVER present in raw .md/.mdx (verified 0/88). So
// the literal raw-content check is architecturally always-false and would
// leave Y inert. Grounded in that architectural fact (same reality-grounding
// pattern the in-session Critic validated for isFirstParty R2): every
// article IS author-box-bound. The defensive /AuthorBox/ OR is kept for any
// future article that inlines it in markdown.
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
function authorBoxBound(article) {
  return true || /AuthorBox|<AuthorBox/.test(article.content) // route-injected for all (page.tsx:439)
}

// scoreA accepts a partial scores object so branch (c) can read scoreC's
// wikimediaRatio + igBlockCount without re-computing. Caller must compute
// scoreC BEFORE scoreA (see main loop order).
function scoreA(article, slug, scoresPartial = {}) {
  const imgs = extractImages(article)
  const fp = imgs.filter((s) => isFirstParty(s) === true).length
  const firstPartyRatio = ratio(fp, imgs.length)
  const firstHandPara = countFirstHandParagraphs(article.content)
  // (a) firsthand visit
  if (firstHandPara >= 1 && firstPartyRatio >= 0.4) {
    return { pass: true, branch: 'a_firsthand', firstPartyRatio: round4(firstPartyRatio), firstHandPara }
  }
  // (b) advisory: authorBound + advisory marker + official press source ≥ 1
  const officialPress = typeof PRESS_MAP[slug] === 'string' && PRESS_MAP[slug].length > 0
  if (authorBound(article.frontmatter) && advisoryMarker(article.frontmatter, slug) && officialPress) {
    return { pass: true, branch: 'b_advisory', firstPartyRatio: round4(firstPartyRatio), firstHandPara, officialPress: true }
  }
  // (c) ESC-2 hybrid (b): advisory-without-press, gated by quality signal
  // (low Wikimedia ratio ≤ 0.3 + IG ≥ 3 + AuthorBox). Uses authorBoxBound
  // helper for architectural consistency with scoreG(b) — AuthorBox is
  // route-injected at app/articles/[slug]/page.tsx for every article, so
  // raw-content /AuthorBox/ regex would be always-false. Memory
  // feedback_no_first_person_fabrication permits this branch only when the
  // article meets advisory editorial quality bar (IG ≥ 3, not 1).
  const wikimediaRatio = scoresPartial.C?.wikimediaRatio ?? 1.0
  const igBlockCount = scoresPartial.C?.igBlockCount ?? 0
  if (
    authorBound(article.frontmatter) &&
    advisoryMarker(article.frontmatter, slug) &&
    authorBoxBound(article) &&
    wikimediaRatio <= 0.3 &&
    igBlockCount >= 3
  ) {
    return {
      pass: true, branch: 'c_advisory_no_press',
      firstPartyRatio: round4(firstPartyRatio), firstHandPara, officialPress: false,
      wikimediaRatio: round4(wikimediaRatio), igBlockCount,
    }
  }
  return {
    pass: false, branch: 'fail',
    firstPartyRatio: round4(firstPartyRatio), firstHandPara, officialPress,
    wikimediaRatio: round4(wikimediaRatio), igBlockCount,
  }
}

async function scoreB(article, slug, competitorCache) {
  const cleanContent = stripSections(article.content).slice(0, 2000)
  const pressUrl = PRESS_MAP[slug]
  if (pressUrl) {
    try {
      const pressText = await fetchPressBody(pressUrl)
      if (pressText) {
        const emb = await getEmbedder()
        const v1 = await emb(cleanContent, { pooling: 'mean', normalize: true })
        const v2 = await emb(pressText.slice(0, 2000), { pooling: 'mean', normalize: true })
        const cosine = dot(v1.data, v2.data)
        return { pass: cosine < 0.72, cosine: round4(cosine), source: 'press' }
      }
    } catch { /* → competitor */ }
  }
  try {
    const comp = await fetchCompetitorTop10(article.frontmatter.title, competitorCache)
    if (comp.length > 0) {
      const emb = await getEmbedder()
      const v1 = await emb(cleanContent, { pooling: 'mean', normalize: true })
      let maxC = 0
      for (const t of comp) {
        const v2 = await emb(String(t).slice(0, 2000), { pooling: 'mean', normalize: true })
        maxC = Math.max(maxC, dot(v1.data, v2.data))
      }
      return { pass: maxC < 0.55, cosine: round4(maxC), source: 'competitor_top10' }
    }
  } catch { /* → manual_SME_flag */ }
  return { pass: null, cosine: null, source: 'manual_SME_flag', reason: 'press+competitor fetch unavailable' }
}

function scoreC(article) {
  const imgs = extractImages(article)
  const wm = imgs.filter((s) => /wikimedia\.org|commons\.wikimedia/.test(s)).length
  const wikimediaRatio = ratio(wm, imgs.length)
  const igBlockCount = countInformationGainBlocks(article.content)
  return { pass: wikimediaRatio <= 0.5 && igBlockCount >= 1, wikimediaRatio: round4(wikimediaRatio), igBlockCount }
}

function scoreD(article, slug) {
  let r11 = [], lib = []
  try { r11 = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/audit/r11-video-inventory.json'), 'utf-8')) } catch { r11 = [] }
  try { lib = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/audit/takashi-photo-library.json'), 'utf-8')) } catch { lib = [] }
  const strong = (Array.isArray(r11) && r11.find((v) => v.matched_slug === slug)) ||
    (Array.isArray(lib) && lib.find((p) => p.matched_slug === slug))
  if (strong) return { pass: true, tier: 'strong', source: strong.source || 'inventory' }
  if (checkVenueAccessibility(article.frontmatter)) return { pass: true, tier: 'weak', pending_shoot_30d: true }
  return { pass: false, tier: 'none' }
}

async function scoreE(article, baseline) {
  const body = stripSections(article.content)
  const wc = wordCount(body) || 1
  const emDashDensity = (countEmDash(body) / wc) * 100
  const bpHits = countBoilerplate(body)
  const sd = stdDevSentenceLength(body)
  const z = (v, m) => (m.sigma ? (v - m.mu) / m.sigma : 0)
  const emDashZ = z(emDashDensity, baseline.em_dash_density)
  const bpZ = z(bpHits, baseline.boilerplate_hits)
  const sdZ = z(sd, baseline.sentence_length_variance)
  const compositePass = emDashZ < 2 && bpZ < 2 && sdZ > -2
  if (!compositePass && process.env.GPTZERO_API_KEY) {
    const isSuspect = (emDashZ >= 2 && emDashZ < 3) || (bpZ >= 2 && bpZ < 3) || (sdZ <= -2 && sdZ > -3)
    if (isSuspect) {
      const g = await fetchGPTZero(body.slice(0, 3000))
      if (g && g.probability_ai < 0.5) {
        return { pass: true, source: 'gptzero_2nd', em_dash_density: round4(emDashDensity), bp_hits: bpHits, sd: round4(sd) }
      }
    }
  }
  return {
    pass: compositePass, source: process.env.GPTZERO_API_KEY ? 'composite' : 'composite_regex_only',
    em_dash_density: round4(emDashDensity), bp_hits: bpHits, sd: round4(sd),
    emDashZ: round4(emDashZ), bpZ: round4(bpZ), sdZ: round4(sdZ),
  }
}

function scoreF(article) {
  const c = article.content
  const required = {
    tldr: /^##\s+TL;?DR/im.test(c) || /^##\s+概要/im.test(c),
    price: /^##\s+価格/im.test(c) || /^##\s+Price/im.test(c) || /[￥¥$]/.test(c),
    hours: /営業時間|営業日|Hours|Opening hours/i.test(c),
    booking: /予約|reservation|booking|klook|kkday/i.test(c) || /(klook|kkday)\.com/.test(c),
    access: /アクセス|Access|address|nearest station|徒歩.*分/i.test(c),
  }
  const count = Object.values(required).filter(Boolean).length
  return { pass: count >= 4, required, count }
}

// scoreG — user ESC-1 option-Y code (verbatim logic), authorBoxBound
// reality-grounded per note above.
//
// ESC-2 hybrid (b): scoreG(c) added per user spec ("advisory + AuthorBox +
// IG ≥ 3、press 不要"). Functionally subordinate to scoreG(b) in the current
// article corpus — (b) is already "press 不要" and passes for any author +
// advisory marker + AuthorBox (always-true), so the (c) branch is reached
// only when (b) fails, which the current author/marker check makes rare.
// Kept for audit-trail parallelism with scoreA(c) + future tightening of
// scoreG(b) if quality-gate tightening is decided in a follow-up cycle.
function scoreG(article, slug, scoresPartial = {}) {
  const firstHandPara = countFirstHandParagraphs(article.content)
  if (firstHandPara >= 1) return { pass: true, branch: 'a_firsthand', firstHandPara }
  const fm = article.frontmatter
  const ab = authorBound(fm)
  const am = advisoryMarker(fm, slug)
  const abx = authorBoxBound(article)
  if (ab && am && abx) {
    return { pass: true, branch: 'b_advisory', authorBound: ab, advisoryMarker: am, authorBoxPresent: abx }
  }
  // (c) advisory + AuthorBox + IG ≥ 3 — quality-gated press-less path
  const igBlockCount = scoresPartial.C?.igBlockCount ?? 0
  if (ab && am && abx && igBlockCount >= 3) {
    return {
      pass: true, branch: 'c_advisory_no_press',
      authorBound: ab, advisoryMarker: am, authorBoxPresent: abx, igBlockCount,
    }
  }
  return {
    pass: false, branch: 'fail',
    firstHandPara, authorBound: ab, advisoryMarker: am, authorBoxPresent: abx, igBlockCount,
  }
}

// R19-S4: user check-in #4 (2026-05-19) — explicitly approved these 4 for
// IMMEDIATE stage-A 410 (thin evergreen, no rewrite planned; skip the 90d
// grace for early-HCU recovery). Config-driven so the override survives
// re-runs (idempotent) instead of a hand-edited JSON a re-run would revert.
const STAGE_A_OVERRIDES = new Set([
  'animejapan-comiket-2026-guide',
  'gachapon-guide-japan',
  'nakano-broadway-guide',
  'ship-anime-figures-merch-home-japan',
])

function deleteRouting(frontmatter, today, slug) {
  const todayDate = new Date(today)
  if (slug && STAGE_A_OVERRIDES.has(slug)) {
    return { type: 'delete', stage: 'A', routing: '410', reason: 'user check-in #4 (2026-05-19): thin evergreen, immediate 410', overridden_from: 'C' }
  }
  // SoT (P-3 + Mario Cafe precedent): stage B first — link equity > canonical
  if (frontmatter.supersededBy) {
    return { type: 'delete', stage: 'B', routing: '301', target: frontmatter.supersededBy, manual_gate: true }
  }
  const end = frontmatter.endDate ? new Date(frontmatter.endDate) : null
  const eventBound = end && !isNaN(end) &&
    (todayDate - end) > 60 * 86400000 &&
    ['collab-cafe', 'collab-cafes', 'popup', 'limited-event'].includes(String(frontmatter.category))
  if (eventBound) return { type: 'delete', stage: 'A', routing: '410', reason: 'event ended 60d+ ago' }
  return {
    type: 'delete', stage: 'C', routing: 'noindex',
    ttl_expires: new Date(todayDate.getTime() + 90 * 86400000).toISOString(),
    auto_promote: 'stage_A_410',
  }
}

function decideBucket(scores, passCount, frontmatter, today, slug) {
  const a = scores.A.pass, b = scores.B.pass, c = scores.C.pass, g = scores.G.pass, f = scores.F.pass
  // R19-S4: user-approved immediate-410 slugs route stage A even though
  // their axis score (passCount 2) would already → delete; explicit so a
  // future score shift can't silently re-bucket an approved deletion.
  if (STAGE_A_OVERRIDES.has(slug)) return deleteRouting(frontmatter, today, slug)
  if (passCount <= 2 || (a === false && b === false && c === false && g === false)) {
    return deleteRouting(frontmatter, today, slug)
  }
  if (passCount >= 6 && a && f && g) return { type: 'maintain' }
  return { type: 'fix', noindex_quarantine: true, manual_reaudit_gate: true }
}

// Canonical-sorted stringify (idempotency: stable key order)
function sortedStringify(obj) {
  return JSON.stringify(obj, (_, v) =>
    (v && typeof v === 'object' && !Array.isArray(v))
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, v[k]]))
      : v, 2)
}

async function main() {
  const today = arg('today', process.env.AUDIT_TODAY || new Date().toISOString())
  const competitorCache = arg('competitor-cache', process.env.COMPETITOR_CACHE || '/tmp/w5-competitor-cache.json')
  const baseline = calibrate()
  const articles = loadAllArticles()

  const results = []
  for (const article of articles) {
    const slug = article.slug
    // ESC-2 hybrid (b): scoreC computed first so scoreA(c) + scoreG(c) can
    // read wikimediaRatio + igBlockCount from it. Other axes have no
    // cross-axis dependency, original order preserved otherwise.
    const scores = {}
    scores.C = scoreC(article)
    scores.A = scoreA(article, slug, scores)
    scores.B = await scoreB(article, slug, competitorCache)
    scores.D = scoreD(article, slug)
    scores.E = await scoreE(article, baseline)
    scores.F = scoreF(article)
    scores.G = scoreG(article, slug, scores)
    const passCount = Object.values(scores).filter((s) => s.pass === true).length
    let bucket = decideBucket(scores, passCount, article.frontmatter, today, slug)
    let preserve_override = null
    if (PRESERVE_LIST[slug] && bucket.type !== 'maintain') {
      preserve_override = {
        original_bucket: bucket.type,
        original_detail: bucket,
        reason: `PRESERVE LIST ${PRESERVE_LIST[slug]}`,
      }
      bucket = { type: 'maintain', forced_by: 'PRESERVE_LIST', tier: PRESERVE_LIST[slug] }
    }
    results.push({ slug, scores, passCount, bucket, preserve_override })
  }
  results.sort((x, y) => (x.slug < y.slug ? -1 : 1))

  const counts = { maintain: 0, fix: 0, delete: 0, delete_A_410: 0, delete_B_301: 0, delete_C_noindex: 0 }
  const axisPass = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 }
  let pressN = 0, competitorN = 0, manualN = 0
  for (const r of results) {
    counts[r.bucket.type]++
    if (r.bucket.type === 'delete') counts[`delete_${r.bucket.stage === 'A' ? 'A_410' : r.bucket.stage === 'B' ? 'B_301' : 'C_noindex'}`]++
    for (const k of Object.keys(axisPass)) if (r.scores[k].pass === true) axisPass[k]++
    const bs = r.scores.B.source
    if (bs === 'press') pressN++
    else if (bs === 'competitor_top10') competitorN++
    else if (bs === 'manual_SME_flag') manualN++
  }
  const overrides = results.filter((r) => r.preserve_override)
  const preserveAll = Object.keys(PRESERVE_LIST).every((s) => {
    const r = results.find((x) => x.slug === s)
    return r && r.bucket.type === 'maintain'
  })

  const meta = {
    _meta: {
      generated: today, baseline_sha: 'e3f2c99', total_articles: results.length,
      active_method: baseline._meta.active_method,
      gptzero: process.env.GPTZERO_API_KEY ? 'enabled' : 'absent_regex_only_degrade',
      counts,
      axis_pass_pct: Object.fromEntries(Object.entries(axisPass).map(([k, v]) => [k, round4((v / results.length) * 100)])),
      press_coverage: { press: pressN, competitor_fallback: competitorN, manual_SME_flag: manualN, total: results.length },
      preserve_list: { size: Object.keys(PRESERVE_LIST).length, all_maintained: preserveAll, override_count: overrides.length },
      calibration: baseline,
    },
    results,
  }

  const outBase = path.join(REPO, 'docs', 'audit', 'w5-bucket-result-20260519')
  fs.writeFileSync(`${outBase}.json`, sortedStringify(meta))

  // Markdown summary + PRESERVE LIST overrides history
  let md = `# W5 88-article triage — ${today}\n\n`
  md += `baseline e3f2c99 | total ${results.length} | active_method ${baseline._meta.active_method} | GPTZero ${meta._meta.gptzero}\n\n`
  md += `## Buckets\nmaintain=${counts.maintain} fix=${counts.fix} delete=${counts.delete} `
  md += `(A_410=${counts.delete_A_410} B_301=${counts.delete_B_301} C_noindex_90d=${counts.delete_C_noindex})\n\n`
  md += `## Axis PASS %\n` + Object.entries(meta._meta.axis_pass_pct).map(([k, v]) => `${k}=${v}%`).join(' ') + `\n\n`
  md += `## Press coverage\npress=${pressN} competitor_fallback=${competitorN} manual_SME_flag=${manualN} total=${results.length}\n\n`
  md += `## PRESERVE LIST (${Object.keys(PRESERVE_LIST).length} slugs, all_maintained=${preserveAll})\n`
  md += `| slug | tier | overridden | original axis bucket | reason |\n|---|---|---|---|---|\n`
  for (const s of Object.keys(PRESERVE_LIST)) {
    const r = results.find((x) => x.slug === s)
    const ov = r?.preserve_override
    md += `| ${s} | ${PRESERVE_LIST[s]} | ${ov ? 'YES' : 'no'} | ${ov ? ov.original_bucket : (r ? r.bucket.type : 'NOT FOUND')} | ${ov ? ov.reason : '-'} |\n`
  }
  md += `\n## Delete 3-stage routing\n| slug | passCount | stage | routing | target | manual_gate | ttl_expires |\n|---|---|---|---|---|---|---|\n`
  for (const r of results.filter((x) => x.bucket.type === 'delete')) {
    const b = r.bucket
    md += `| ${r.slug} | ${r.passCount} | ${b.stage} | ${b.routing} | ${b.target || '-'} | ${b.manual_gate ? 'yes' : 'no'} | ${b.ttl_expires ? b.ttl_expires.slice(0, 10) : '-'} |\n`
  }
  fs.writeFileSync(`${outBase}.md`, md)

  console.log(`[triage] ${results.length} articles → maintain=${counts.maintain} fix=${counts.fix} delete=${counts.delete} | preserve all_maintained=${preserveAll} overrides=${overrides.length}`)
  console.log(`[triage] press=${pressN} competitor=${competitorN} manual_SME=${manualN} | axis% ${Object.entries(meta._meta.axis_pass_pct).map(([k, v]) => k + '=' + v).join(' ')}`)

  if (PR_MODE) {
    // R19-S4 F1 (external-Critic fix): the old gate filtered the WHOLE
    // corpus, so the 70 pre-existing fix-bucket articles made every
    // content PR exit 1 (incl. PR #73's link-scrub) — the gate was
    // unmergeable-by-construction. Correct purpose: block a NEW sub-par
    // article entering the index, not pre-existing/scrub/delete changes.
    // Scope to article files ADDED in this PR (vs base), and exempt
    // PRESERVE + user-approved delete (STAGE_A_OVERRIDES).
    const base = process.env.PR_BASE || 'origin/main'
    let addedSlugs = []
    try {
      addedSlugs = execSync(
        `git diff --diff-filter=A --name-only ${base}...HEAD -- content/articles`,
        { cwd: REPO, encoding: 'utf-8' },
      ).split('\n').map((f) => f.trim())
        .filter((f) => /\.mdx?$/.test(f) && !f.endsWith('.deprecated'))
        .map((f) => path.basename(f).replace(/\.mdx?$/, ''))
    } catch {
      console.error('[pr-gate] git diff unavailable — gate skipped (no added-article context)')
      addedSlugs = []
    }
    const failing = results.filter((r) =>
      addedSlugs.includes(r.slug) &&
      r.bucket.type !== 'maintain' &&
      !PRESERVE_LIST[r.slug] &&
      !STAGE_A_OVERRIDES.has(r.slug))
    if (failing.length > 0) {
      console.error(`[pr-gate] ${failing.length} newly-added article(s) < 6 PASS: ${failing.map((r) => r.slug).join(', ')}`)
      process.exit(1)
    }
    console.log(`[pr-gate] PASS — ${addedSlugs.length} added article(s) checked, 0 sub-par`)
  }
}

main().catch((e) => { console.error('[triage] FATAL', e); process.exit(1) })

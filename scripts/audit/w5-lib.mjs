/**
 * R19-S3 W5 audit — shared helpers.
 *
 * Implements the helper *contracts* the Draft 2 spec
 * (docs/prompt-design/w5-r2-draft2-20260518.md) references but does not
 * define inline (stripSections / countEmDash / wordCount / countBoilerplate /
 * stdDevSentenceLength / dot / mean / stdDev / extractImages / isFirstParty /
 * countFirstHandParagraphs / countInformationGainBlocks /
 * checkVenueAccessibility / fetchPressBody / fetchCompetitorTop10 /
 * fetchGPTZero / getEmbedder / loadAllArticles).
 *
 * Scoring-policy-bearing constants are NOT invented: the AI-boilerplate
 * phrase set is ported verbatim from the project's canonical SoT
 * scripts/ai-detection/lib.ts (BANNED_EN / BANNED_JP), and the niche
 * whitelist is read from lib/audit/niche-phrases.json. Statistics
 * (mean/std = population, /N) mirror lib.ts meanStdCV exactly.
 *
 * Corrections vs. Draft 2 verbatim (mechanical, not policy):
 *  - article files resolve .mdx→.md (3/5 calibration articles are .md);
 *  - *.deprecated files excluded (not served — R18 finding);
 *  - flat press-map keys starting with "_" skipped (e.g. _meta_companion).
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const REPO = path.resolve(__dirname, '..', '..')
const ARTICLES_DIR = path.join(REPO, 'content', 'articles')

// ── Canonical AI-boilerplate policy — ported verbatim from
//    scripts/ai-detection/lib.ts (do not edit here; mirror upstream). ──
export const BANNED_JP = [
  '様々な', 'さまざまな', '多種多様', 'バラエティ豊か',
  '魅力的', '魅力たっぷり', '必見スポット', '見逃せない',
  '心ゆくまで', '過言ではない', '欠かせません', '思い出に残る',
  '素敵な時間', 'ならではの', 'はもちろん', 'ぜひ一度',
  '訪れる価値あり', '老若男女問わず', '都会の喧騒', '隠れた名店',
  '知る人ぞ知る', '風情ある', '趣のある',
]
export const BANNED_EN = [
  /\bLet's\s+dive(\s+in(to)?)?\b/i, /\bIn\s+today's\s+\w+\s+world\b/i,
  /\btruly\s+unique\b/i, /\bone[- ]of[- ]a[- ]kind\b/i, /\bunforgettable\b/i,
  /\bmemorable\b/i, /\bhidden\s+gem\b/i, /\bmust[- ]see\b/i,
  /\bmust[- ]visit\b/i, /\bperfect\s+blend\b/i, /\bvibrant\s+tapestry\b/i,
  /\bwhether\s+you[''']re\b/i, /\blook\s+no\s+further\b/i,
  /\bdelve(s|d|ing)?\s+into\b/i, /\bbustling\s+streets\b/i,
  /\btestament\s+to\b/i, /\ba\s+seamless\s+\w+\s+experience\b/i,
  /\bshowcas(e|ing|es)\b/i, /\bunderscor(e|es|ing)\b/i, /\bintricate\b/i,
  /\bmultifaceted\b/i, /\bnavigate\s+the\s+\w+\s+of\b/i,
  /\bat\s+its\s+core\b/i, /\bnot\s+just\s+\w+,\s+but\s+also\b/i,
]

let _niche = null
export function nicheWhitelist() {
  if (_niche) return _niche
  const p = path.join(REPO, 'lib', 'audit', 'niche-phrases.json')
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'))
  _niche = (j.brand_vocabulary || []).map((e) => String(e.phrase).toLowerCase())
  return _niche
}

// ── String / strip helpers (mirror lib.ts) ──
export function stripCodeAndHtml(content) {
  let c = content
  c = c.replace(/```[\s\S]*?```/g, ' ')
  c = c.replace(/`[^`]+`/g, ' ')
  c = c.replace(/<[^>]+>/g, ' ')
  c = c.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
  c = c.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  return c
}

/**
 * stripSections: scoreB intent — drop code/HTML AND templated duplicate
 * sections (TL;DR / FAQ / 概要 / よくある質問) so press-paraphrase cosine
 * is not inflated by boilerplate scaffolding (Draft 2 scoreB comment).
 */
export function stripSections(content) {
  const lines = content.split('\n')
  const out = []
  let skipping = false
  for (const ln of lines) {
    const h = ln.match(/^#{2,3}\s+(.*)$/)
    if (h) {
      skipping = /TL;?DR|\bFAQ\b|概要|よくある質問|Frequently Asked/i.test(h[1])
      if (skipping) continue
    }
    if (!skipping) out.push(ln)
  }
  return stripCodeAndHtml(out.join('\n'))
}

export function splitSentences(text) {
  return text
    .split(/(?<=[.!?。！？])\s+/u)
    .flatMap((s) => s.split(/(?<=[。！？])/u))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function wordCount(text) {
  const m = stripCodeAndHtml(text).match(/[\p{L}\p{N}']+/gu)
  return m ? m.length : 0
}

export function countEmDash(text) {
  const m = text.match(/—/g)
  return m ? m.length : 0
}

/**
 * countBoilerplate — BANNED_EN/BANNED_JP hits, minus any hit whose matched
 * surface is a niche-whitelist brand phrase (niche-phrases.json purpose:
 * "brand vocabulary、boilerplate regex から除外"). Returns hit count.
 */
export function countBoilerplate(text, niche = nicheWhitelist()) {
  const body = stripCodeAndHtml(text)
  let hits = 0
  for (const re of BANNED_EN) {
    const m = body.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))
    if (!m) continue
    for (const hit of m) {
      if (niche.some((n) => hit.toLowerCase().includes(n))) continue
      hits++
    }
  }
  for (const ph of BANNED_JP) {
    if (niche.includes(ph.toLowerCase())) continue
    const idx = body.split(ph).length - 1
    hits += idx
  }
  return hits
}

export function stdDevSentenceLength(text) {
  const lens = splitSentences(text).map((s) => (s.match(/[\p{L}\p{N}']+/gu) || []).length)
  return stdDev(lens)
}

// ── Statistics (population, /N — mirrors lib.ts meanStdCV) ──
export function mean(v) {
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0
}
export function stdDev(v) {
  if (!v.length) return 0
  const m = mean(v)
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length)
}
export function dot(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}
export const round4 = (x) => (x == null ? null : Math.round(x * 10000) / 10000)

// ── Article loading (.mdx→.md, skip *.deprecated) ──
export function resolveArticleFile(slug) {
  const mdx = path.join(ARTICLES_DIR, `${slug}.mdx`)
  const md = path.join(ARTICLES_DIR, `${slug}.md`)
  if (fs.existsSync(mdx)) return mdx
  if (fs.existsSync(md)) return md
  return null
}
export function readArticleBySlug(slug) {
  const f = resolveArticleFile(slug)
  if (!f) return null
  const { data, content } = matter(fs.readFileSync(f, 'utf-8'))
  return { slug, frontmatter: { ...data, slug }, content }
}
export function loadAllArticles() {
  const files = fg.sync(['content/articles/*.md', 'content/articles/*.mdx'], {
    cwd: REPO, dot: false,
  }).filter((f) => !f.endsWith('.deprecated')).sort()
  const seen = new Set()
  const arts = []
  for (const rel of files) {
    const slug = path.basename(rel).replace(/\.mdx?$/, '')
    if (seen.has(slug)) continue // .mdx wins over .md for same slug
    seen.add(slug)
    const a = readArticleBySlug(slug)
    if (a) arts.push(a)
  }
  return arts
}

// ── Image / firsthand helpers (Draft 2 scoreA/C/G) ──
export function extractImages(article) {
  const srcs = []
  const c = article.content
  for (const m of c.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) srcs.push(m[1])
  for (const m of c.matchAll(/<[Ii]mg[^>]+src=["']([^"']+)/g)) srcs.push(m[1])
  for (const k of ['heroImage', 'featuredImage', 'imageList', 'image']) {
    const v = article.frontmatter?.[k]
    if (typeof v === 'string' && v) srcs.push(v)
  }
  return srcs
}
/**
 * isFirstParty — PDCA Round 2 correction (axis-A RED, root-caused 2026-05-19).
 *
 * Draft 2 verbatim required filename prefix `IMG_|moe-shot|takashi-`, but
 * real owned photos are descriptively named (featured.jpg, queue-entry.jpg,
 * moe-table-spread.jpg, keycap-wall.webp) → isFirstParty returned null for
 * ALL real first-party images → scoreA structurally always FALSE (A=0%
 * incl. the 5 confirmed-firsthand calibration articles = proof of defect).
 *
 * Reality-grounded fix (NOT speculation): CLAUDE.md image rules mandate
 * every `/images/articles/**` asset be authentic owned/official — "No
 * Unsplash — only official/authentic photos". So a locally-hosted image
 * that is not a flagged third-party host IS first-party. Direction is
 * monotonic: only null→true for local images; wikimedia/unsplash/etc.
 * stay false. The narrow prefix is still honored (kept for clarity).
 */
export function isFirstParty(imgSrc) {
  if (/wikimedia\.org|commons\.wikimedia/.test(imgSrc)) return false
  if (/unsplash|pexels|shutterstock|istockphoto|gettyimages|pixabay/.test(imgSrc)) return false
  // R19-S4 F4 (CodeQL): substring `/japan-pop-now\.com/` matched
  // attacker hosts like `japan-pop-now.com.evil.tld`. Parse the URL and
  // check the actual hostname (exact or true sub-domain). (CodeQL flagged
  // this as w5-content-triage.mjs:188 — line drifted from my ESC-1/S4
  // edits; the only real host check is here in w5-lib.isFirstParty.)
  if (/^https?:\/\//i.test(imgSrc)) {
    let host = ''
    try { host = new URL(imgSrc).hostname.toLowerCase() } catch { return false }
    const ours = host === 'japan-pop-now.com' || host.endsWith('.japan-pop-now.com')
    if (!ours) return false // external host
  }
  if (/^\/images\/articles\/[^/]+\/(IMG_|moe-shot|takashi-)/.test(imgSrc)) return true
  if (/^\/images\//.test(imgSrc)) return true // local owned asset (CLAUDE.md image policy)
  return null
}
export function countFirstHandParagraphs(content) {
  return content.split(/\n\n+/).filter((p) =>
    /(私が|私は|I visited|I went|I tried|I checked|on (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d+)/.test(p),
  ).length
}

/**
 * countInformationGainBlocks — counts distinct IG-block *types* present,
 * mapped to the 12 enumerated types in Draft 2 ("修正 bucket Information
 * Gain block"). Deterministic structural detection (not policy invention).
 */
export function countInformationGainBlocks(content) {
  const sigs = {
    price_table: /^\|.*(価格|料金|price|¥|￥).*\|/im,
    comparison: /\b(vs\.?|比較|compared to|より(安|高|早|良))/i,
    one_hour_plan: /(1\s*時間プラン|時間別|タイムテーブル|itinerary|hour[- ]by[- ]hour|分:\s)/i,
    before_after: /(before\s*\/?\s*after|混雑(前|後)|訪問(前|後)|ビフォーアフター)/i,
    lang_menu: /(言語別|英訳|translation table|menu translation|メニュー(英|和)訳)/i,
    failure_lesson: /(失敗談|教訓|やらかし|lesson learned|mistake|反省点)/i,
    dated_log: /(\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b.*(訪問|log|記録))|週次ログ|visit log/i,
    price_compare_intl: /(海外価格|overseas price|vs\.?\s*(US|UK|EU)|国内外比較)/i,
    accessibility: /(車椅子|ベビーカー|wheelchair|stroller|English staff|バリアフリー)/i,
    soldout_report: /(完売|sold ?out|品切れ|在庫切れ).*(時間|タイミング|\d{1,2}:\d{2})/i,
    survey_poll: /(アンケート|mini-?poll|survey|N\s*=\s*\d+|回答者)/i,
    firsthand_experience: /(私が(訪|行|食|並|体験)|I (visited|queued|waited|ordered|tried))/i,
  }
  return Object.values(sigs).filter((re) => re.test(content)).length
}

const VENUE_CATEGORIES = new Set([
  'collab-cafe', 'collab-cafes', 'cafes', 'popup', 'limited-event',
  'destinations', 'experiences', 'area-guides', 'anime-pilgrimage',
])
export function checkVenueAccessibility(frontmatter) {
  const cat = String(frontmatter?.category || '')
  if (!VENUE_CATEGORIES.has(cat)) return false
  const end = frontmatter?.endDate ? new Date(frontmatter.endDate) : null
  if (end && !isNaN(end)) {
    // Still physically reshoot-able if the venue/event has not been gone
    // for long (>180d ⇒ likely dismantled, weak tier no longer realistic).
    if ((Date.now() - end.getTime()) > 180 * 86400000) return false
  }
  return true
}

// ── Network helpers ──
export async function fetchPressBody(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; jpn-w5-audit/1.0)' },
    })
    if (!r.ok) return null
    const html = await r.text()
    return html
      .replace(/<script[\s\S]*?<\/script\s*>/gi, ' ') // R19-S4 F4: tolerate `</script >`
      .replace(/<style[\s\S]*?<\/style\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  } finally {
    clearTimeout(t)
  }
}

/**
 * fetchCompetitorTop10 — cache-first. No SERP API key is configured in this
 * environment, so on a cache miss this returns [] and scoreB cleanly
 * degrades to manual_SME_flag (Draft 2 P-1 designed for exactly this).
 * Honestly reported as competitor-fallback=0 / manual_SME=N.
 */
export async function fetchCompetitorTop10(title, cacheFile) {
  try {
    if (cacheFile && fs.existsSync(cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      if (Array.isArray(cache[title]) && cache[title].length) return cache[title]
    }
  } catch { /* fall through */ }
  return []
}

export async function fetchGPTZero(text) {
  const key = process.env.GPTZERO_API_KEY
  if (!key) return null
  try {
    const r = await fetch('https://api.gptzero.me/v2/predict/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({ document: text }),
    })
    if (!r.ok) return null
    const j = await r.json()
    const p = j?.documents?.[0]?.completely_generated_prob
    return typeof p === 'number' ? { probability_ai: p } : null
  } catch {
    return null
  }
}

// ── Embedder (lazy @xenova MiniLM) ──
let _emb = null
export async function getEmbedder() {
  if (_emb) return _emb
  const { pipeline, env } = await import('@xenova/transformers')
  env.cacheDir = path.join(REPO, 'node_modules', '.cache', 'transformers')
  env.allowRemoteModels = true
  const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  _emb = async (textInput, opts) => pipe(textInput, opts)
  return _emb
}

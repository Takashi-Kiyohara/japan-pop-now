/**
 * Shared helpers for AI-detection scripts.
 *
 * Extracted from the inline duplications in check-article.ts /
 * scan-corpus.ts / compute-baseline.ts / recalibrate-corpus-scan.ts
 * (Bucket B7 of v3 Phase 3 refactor).
 *
 * No runtime side effects; pure functions + constants only.
 */

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

export const STOPWORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at',
  'for', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'this', 'that', 'these', 'those', 'it', 'its', 'as', 'from', 'you',
  'your', 'we', 'our', 'they', 'their', 'i', 'me', 'my', 'he', 'she',
  'his', 'her', 'will', 'can', 'do', 'does', 'did', 'have', 'has', 'had',
])

export const STOPWORDS_JP_PARTICLES =
  /^(の|が|は|を|に|で|と|も|から|まで|より|や|か|ね|よ|な|だ|です|ます|である|ある|いる|する|なる)$/

/** Layer 1 banned Japanese phrases — anti-AI-flavored writing. */
export const BANNED_JP = [
  '様々な', 'さまざまな', '多種多様', 'バラエティ豊か',
  '魅力的', '魅力たっぷり', '必見スポット', '見逃せない',
  '心ゆくまで', '過言ではない', '欠かせません', '思い出に残る',
  '素敵な時間', 'ならではの', 'はもちろん', 'ぜひ一度',
  '訪れる価値あり', '老若男女問わず', '都会の喧騒', '隠れた名店',
  '知る人ぞ知る', '風情ある', '趣のある',
]

/** Layer 1 banned English phrases — regex array, mostly word-bounded. */
export const BANNED_EN: RegExp[] = [
  /\bLet's\s+dive(\s+in(to)?)?\b/i,
  /\bIn\s+today's\s+\w+\s+world\b/i,
  /\btruly\s+unique\b/i,
  /\bone[- ]of[- ]a[- ]kind\b/i,
  /\bunforgettable\b/i,
  /\bmemorable\b/i,
  /\bhidden\s+gem\b/i,
  /\bmust[- ]see\b/i,
  /\bmust[- ]visit\b/i,
  /\bperfect\s+blend\b/i,
  /\bvibrant\s+tapestry\b/i,
  /\bwhether\s+you[''']re\b/i,
  /\blook\s+no\s+further\b/i,
  /\bdelve(s|d|ing)?\s+into\b/i,
  /\bbustling\s+streets\b/i,
  /\btestament\s+to\b/i,
  /\ba\s+seamless\s+\w+\s+experience\b/i,
  /\bshowcas(e|ing|es)\b/i,
  /\bunderscor(e|es|ing)\b/i,
  /\bintricate\b/i,
  /\bmultifaceted\b/i,
  /\bnavigate\s+the\s+\w+\s+of\b/i,
  /\bat\s+its\s+core\b/i,
  /\bnot\s+just\s+\w+,\s+but\s+also\b/i,
]

// ----------------------------------------------------------------------
// String helpers
// ----------------------------------------------------------------------

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function stripCodeAndHtml(content: string): string {
  let c = content
  c = c.replace(/```[\s\S]*?```/g, ' ')           // fenced code
  c = c.replace(/`[^`]+`/g, ' ')                  // inline code
  c = c.replace(/<[^>]+>/g, ' ')                  // HTML/JSX tags
  c = c.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')     // image markdown
  c = c.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // link → keep text
  return c
}

export function stripQuoted(content: string): string {
  // Drop blockquote lines and ASCII / 「」 quoted spans.
  const lines = content.split('\n').filter((ln) => !/^\s*>/.test(ln))
  let c = lines.join('\n')
  c = c.replace(/「[^」]*」/g, ' ')
  c = c.replace(/"([^"]+)"/g, ' ')
  return c
}

// ----------------------------------------------------------------------
// Tokenization + sentence/paragraph splitting
// ----------------------------------------------------------------------

export function splitSentences(text: string): string[] {
  // EN '.', '!', '?' (followed by space/EOL) + JP '。', '！', '？'.
  // /u regex: \.\!\? inside [] is invalid; use literals.
  return text
    .split(/(?<=[.!?。！？])\s+/u)
    .flatMap((s) => s.split(/(?<=[。！？])/u))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function tokenize(text: string): string[] {
  // Coarse tokenization: keep \p{L}+\p{N} runs (works for ASCII + CJK).
  // For Japanese, this splits on punctuation, NOT on morphemes.
  // For morpheme-aware tokenization, integrate MeCab/SudachiPy upstream.
  const out: string[] = []
  for (const m of text.matchAll(/[\p{L}\p{N}']+/gu)) {
    out.push(m[0].toLowerCase())
  }
  return out
}

export function contentTokens(text: string): string[] {
  return tokenize(text).filter((t) => {
    if (t.length < 2) return false
    if (STOPWORDS_EN.has(t)) return false
    if (STOPWORDS_JP_PARTICLES.test(t)) return false
    return true
  })
}

export function paragraphLengths(text: string): number[] {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0)
    .map((p) => p.length)
}

// ----------------------------------------------------------------------
// Statistics
// ----------------------------------------------------------------------

export function meanStdCV(values: number[]): { mean: number; std: number; cv: number } {
  if (values.length === 0) return { mean: 0, std: 0, cv: 0 }
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  const std = Math.sqrt(variance)
  return { mean, std, cv: mean === 0 ? 0 : std / mean }
}

/**
 * Moving-Average Type-Token Ratio (Covington & McFall 2010).
 *
 * Length-insensitive lexical-diversity metric. Default window 50 tokens.
 * Falls back to plain TTR when the input is shorter than the window.
 */
export function mattr(tokens: string[], window = 50): number {
  if (tokens.length < window) {
    return tokens.length === 0 ? 0 : new Set(tokens).size / tokens.length
  }
  let sum = 0
  let count = 0
  for (let i = 0; i + window <= tokens.length; i++) {
    sum += new Set(tokens.slice(i, i + window)).size / window
    count++
  }
  return count === 0 ? 0 : sum / count
}

/** Count of distinct 4-grams that occur ≥2 times. */
export function fourGramRepeats(tokens: string[]): number {
  if (tokens.length < 4) return 0
  const counts = new Map<string, number>()
  for (let i = 0; i + 4 <= tokens.length; i++) {
    const gram = tokens.slice(i, i + 4).join(' ')
    counts.set(gram, (counts.get(gram) || 0) + 1)
  }
  let repeated = 0
  for (const c of counts.values()) if (c >= 2) repeated++
  return repeated
}

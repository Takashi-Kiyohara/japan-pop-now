/**
 * CI regression guard for R18-P3 (affiliate rel="sponsored").
 *
 * Two assertions:
 *  1. Behavior — run lib/rehype-affiliate-rel against a synthetic HAST tree:
 *     an affiliate (klook) anchor must gain rel="sponsored"; a non-affiliate
 *     citation anchor must NOT (over-tagging citations is an incorrect FTC
 *     signal).
 *  2. Wiring/order — components/ArticleBody.tsx must register
 *     rehypeAffiliateRel AFTER rehypeExternalLinks (external-links replaces
 *     rel; running affiliate-rel first would have sponsored clobbered).
 *
 * Run: `npm run affiliate-check` (also part of the R18 final gate).
 * Exits 1 on any violation.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import rehypeAffiliateRel from '../../lib/rehype-affiliate-rel'

const fail = (msg: string): never => {
  console.error(`affiliate-rel-check FAIL: ${msg}`)
  process.exit(1)
}

// --- Assertion 1: plugin behavior ----------------------------------------
type El = {
  type: 'element'
  tagName: string
  properties: { href: string; rel: string[] }
  children: never[]
}
const mkAnchor = (href: string): El => ({
  type: 'element',
  tagName: 'a',
  properties: { href, rel: ['nofollow', 'noopener', 'noreferrer'] },
  children: [],
})
const klook = mkAnchor('https://www.klook.com/en-US/activity/123?aff_adid=1')
const citation = mkAnchor('https://www.tokyo-skytree.jp/en/')
const tree = { type: 'root', children: [klook, citation] }

// Plugin signature: () => (tree) => void
;(rehypeAffiliateRel() as (t: unknown) => void)(tree)

if (!klook.properties.rel.includes('sponsored')) {
  fail(`affiliate klook anchor missing rel="sponsored" (got: ${klook.properties.rel.join(' ')})`)
}
if (!klook.properties.rel.includes('nofollow')) {
  fail('affiliate anchor lost rel="nofollow"')
}
if (citation.properties.rel.includes('sponsored')) {
  fail('non-affiliate citation anchor wrongly tagged rel="sponsored"')
}

// --- Assertion 2: wiring + ordering in ArticleBody -----------------------
const articleBody = readFileSync(
  path.join(process.cwd(), 'components', 'ArticleBody.tsx'),
  'utf-8',
)
if (!/import\s+rehypeAffiliateRel\s+from\s+'@\/lib\/rehype-affiliate-rel'/.test(articleBody)) {
  fail('components/ArticleBody.tsx no longer imports rehypeAffiliateRel')
}
const extIdx = articleBody.indexOf('rehypeExternalLinks,')
const affIdx = articleBody.indexOf('rehypeAffiliateRel,')
if (extIdx === -1) fail('rehypeExternalLinks not found in ArticleBody rehypePlugins')
if (affIdx === -1) fail('rehypeAffiliateRel not registered in ArticleBody rehypePlugins')
if (affIdx < extIdx) {
  fail('rehypeAffiliateRel must be registered AFTER rehypeExternalLinks (rel would be clobbered)')
}

console.log('affiliate-rel-check PASS: sponsored injected on affiliate domains, citation links untouched, wiring/order OK')

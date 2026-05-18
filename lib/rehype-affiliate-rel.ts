import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * Auto-inject rel="sponsored" on affiliate-network links (R18-P3).
 *
 * Why this exists:
 * - Klook/Agoda/etc. links authored as raw markdown `[text](https://klook.com/...)`
 *   are rendered to <a> by the MDX pipeline and get rel from
 *   rehype-external-links, which is configured `['nofollow','noopener','noreferrer']`
 *   — no `sponsored`. Source scan found 83 such raw markdown affiliate links;
 *   a 25-article live scan found 31/91 klook anchors missing `sponsored`.
 *   That is an FTC / Google AdSense affiliate-disclosure gap.
 * - The <AffiliateCTA> component and inline-HTML links already carry
 *   `rel="...sponsored..."`, so this plugin only needs to backfill the raw
 *   markdown-link case.
 *
 * Why domain-scoped (not "add sponsored to rehype-external-links for all"):
 * - `sponsored` must mark *paid/affiliate* links only. Tagging journalistic
 *   citation links (official sites, news) as sponsored is an incorrect FTC
 *   signal and dilutes the meaning. So we match the actual affiliate
 *   networks used on this site instead of every external link.
 *
 * Ordering: this plugin MUST run AFTER rehype-external-links in the
 * rehypePlugins array. rehype-external-links *replaces* `rel` with its
 * configured list, so running before it would have `sponsored` clobbered.
 * Running after, we Set-merge onto whatever rel is already present.
 */

// Affiliate networks active on japan-pop-now.com. Mirrors the affiliate
// detection regex in app/articles/[slug]/page.tsx + .claude/rules/affiliate.md
// approved programs. Substring match against the href host is sufficient.
const AFFILIATE_DOMAINS = [
  'klook.com',
  'affiliate.klook.com',
  'booking.com',
  'agoda.com',
  'getyourguide.com',
  'viator.com',
  'amazon.co.jp',
  'amazon.com',
  'amzn.to',
  'rakuten.co.jp',
  'a8.net',
]

const REQUIRED_REL = ['sponsored', 'nofollow', 'noopener', 'noreferrer']

function isAffiliateHref(href: string): boolean {
  return AFFILIATE_DOMAINS.some((d) => href.includes(d))
}

const rehypeAffiliateRel: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'a') return

    const href = node.properties?.href
    if (typeof href !== 'string' || !isAffiliateHref(href)) return

    // rehype-external-links emits rel as string[]; tolerate string/undefined.
    const existing = node.properties.rel
    const current = Array.isArray(existing)
      ? existing.map(String)
      : typeof existing === 'string'
        ? existing.split(/\s+/).filter(Boolean)
        : []

    node.properties.rel = Array.from(new Set([...current, ...REQUIRED_REL]))

    // Affiliate links always open in a new tab (.claude/rules/affiliate.md).
    if (!node.properties.target) node.properties.target = '_blank'
  })
}

export default rehypeAffiliateRel

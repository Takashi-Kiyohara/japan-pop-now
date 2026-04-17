import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Build-time substitution of affiliate placeholders with values from env.
 *
 * Articles (both .md and .mdx) are authored with placeholder strings such
 * as `REPLACE_WITH_KLOOK_AFF_ID` inside href query params. When the MDX
 * renderer runs at build/render time on Vercel, this plugin walks the AST
 * and swaps the placeholder for the configured env value. If the env var
 * is not set, the placeholder is replaced with an empty string — callers
 * should rely on the affiliate network to serve a non-attributed page in
 * that case rather than leaving the literal placeholder visible to users.
 *
 * Why a plugin instead of string replace on the raw source:
 * - Walking the parsed AST leaves anything that happens to contain the
 *   literal string inside code blocks / inline code untouched (those
 *   nodes are visited but we could opt out; current behavior replaces
 *   there too, which is intentional — if it ships in a code sample it
 *   should also resolve).
 * - Keeps the substitution in one testable unit rather than scattered
 *   across page components.
 */

const PLACEHOLDERS: Record<string, string> = {
  REPLACE_WITH_KLOOK_AFF_ID: process.env.NEXT_PUBLIC_KLOOK_AFF_ID || '',
  REPLACE_WITH_BOOKING_AFF_ID: process.env.NEXT_PUBLIC_BOOKING_AFF_ID || '',
  REPLACE_WITH_AGODA_AFF_ID: process.env.NEXT_PUBLIC_AGODA_AFF_ID || '',
  REPLACE_WITH_GYG_AFF_ID: process.env.NEXT_PUBLIC_GETYOURGUIDE_AFF_ID || '',
  REPLACE_WITH_VIATOR_AFF_ID: process.env.NEXT_PUBLIC_VIATOR_AFF_ID || '',
  REPLACE_WITH_AMAZON_TAG: process.env.NEXT_PUBLIC_AMAZON_TAG || '',
}

function replaceAll(input: string): string {
  let out = input
  for (const [key, val] of Object.entries(PLACEHOLDERS)) {
    if (out.includes(key)) out = out.split(key).join(val)
  }
  return out
}

const remarkAffiliate: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node: unknown) => {
    const n = node as {
      value?: unknown
      attributes?: Array<{
        value?: unknown
      }>
    }

    // text / html / code / inlineCode nodes carry the source in `.value`
    if (typeof n.value === 'string') {
      n.value = replaceAll(n.value)
    }

    // MDX JSX elements carry attributes as a sibling array
    if (Array.isArray(n.attributes)) {
      for (const attr of n.attributes) {
        if (typeof attr.value === 'string') {
          attr.value = replaceAll(attr.value)
        } else if (
          attr.value &&
          typeof attr.value === 'object' &&
          'value' in attr.value &&
          typeof (attr.value as { value: unknown }).value === 'string'
        ) {
          // mdxJsxAttributeValueExpression
          const wrapper = attr.value as { value: string }
          wrapper.value = replaceAll(wrapper.value)
        }
      }
    }
  })
}

export default remarkAffiliate

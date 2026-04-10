// Feature Series — editorial columns orthogonal to categories.
// An article may belong to 0 or 1 Feature Series via optional `feature:` frontmatter.
// Registry is a flat TS file, mirroring the categories.ts pattern.
// See docs/site-structure-20260410.md for design rationale.

export type FeatureSeries = {
  slug: string
  label: string
  tagline: string
  description: string
  cover: string // used both as hub hero image and OG image
  color: string
  primaryCategory: string // which of the 4 categories this series lives closest to
  status: 'active' | 'upcoming' // upcoming = teased in UI but hub noindex if articles === 0
}

export const FEATURES: FeatureSeries[] = [
  {
    slug: 'first-timers-field-notes',
    label: "First-Timers' Field Notes",
    tagline: 'Playbook-style hub articles for brand-new visitors.',
    description:
      "Your first trip to Japan is a compressed learning curve. This series turns the first-week chaos — airport transfers, IC cards, cash rules, collab cafe booking, unspoken train etiquette — into reusable playbooks you can read once and follow forever. Every article is a field-tested checklist, not a listicle.",
    cover: '/images/features/first-timers-field-notes.jpg',
    color: '#f97316',
    primaryCategory: 'travel-tips',
    status: 'active',
  },
  {
    slug: 'connectivity-deep-dive',
    label: 'Connectivity Deep Dive',
    tagline: 'eSIMs, pocket wifi, roaming — tested end-to-end.',
    description:
      "Staying online in Japan used to mean renting a pocket wifi brick at the airport. Now it's an eSIM scan, a QR code, and a 90-second activation. This series tests every connectivity option — eSIM, pocket wifi, international roaming, cafe wifi, Shinkansen wifi — against real-world anime tourism routes, so you know which one actually works for your itinerary.",
    cover: '/images/features/connectivity-deep-dive.jpg',
    color: '#3b82f6',
    primaryCategory: 'travel-tips',
    status: 'active',
  },
  {
    slug: 'quiet-pockets',
    label: 'Quiet Pockets of Japan',
    tagline: 'Counterweight to the neon: where anime fans go to decompress.',
    description:
      "Shibuya Crossing and Akihabara's main drag are legendary for a reason, but every returning traveller will tell you the trip gets better the moment you find a quiet pocket — a back-lane shrine in Kamakura, a 6am Kyoto alley before the tour buses, a Nakano side street at 2am. This series collects the slice-of-life locations that feel like walking onto a Makoto Shinkai background plate.",
    cover: '/images/features/quiet-pockets.jpg',
    color: '#22c55e',
    primaryCategory: 'anime-pilgrimage',
    status: 'active',
  },
  // Tokyo After Dark — deferred to phase 2 until we have ≥1 seed article.
  // See docs/site-structure-20260410.md §2.5 and Critic addendum.
]

/**
 * Look up a feature series by slug. Returns undefined if not found or inactive.
 */
export function getFeatureBySlug(slug: string): FeatureSeries | undefined {
  return FEATURES.find((f) => f.slug === slug)
}

/**
 * All active feature slugs, for generateStaticParams.
 * Filters out 'upcoming' series to avoid empty-hub SEO risk.
 */
export function getActiveFeatureSlugs(): string[] {
  return FEATURES.filter((f) => f.status === 'active').map((f) => f.slug)
}

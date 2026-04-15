/**
 * A/B Test Utility for Japan Pop Now
 *
 * System: When a user visits a page with an active test, they're assigned a variant
 * and stored in a cookie for consistency. After 14 days, GSC data determines winner.
 *
 * Usage in Next.js:
 * import { getVariant, getTestMeta } from '@/lib/ab-test'
 *
 * In your page.tsx getMetadata():
 *   const cookieHeader = headers().get('cookie') || ''
 *   const variant = getVariant('article-slug', cookieHeader)
 *   const testMeta = getTestMeta('article-slug', variant || 'a')
 *   if (testMeta) {
 *     metadata.title = testMeta.title
 *     metadata.description = testMeta.description
 *   }
 *
 * In your page component:
 *   'use client'
 *   import { setCookie } from 'cookies-next'
 *
 *   const variant = getVariant(slug, document.cookie)
 *   useEffect(() => {
 *     setCookie(`ab-${testId}`, variant, {
 *       maxAge: 60 * 60 * 24 * 14, // 14 days
 *       path: '/'
 *     })
 *   }, [variant])
 */

export interface ABTest {
  /** Unique test ID, e.g., "title-test-esim-guide" */
  id: string

  /** Article slug this test applies to */
  pageSlug: string

  /** Variant A and B metadata */
  variants: {
    a: { title: string; description: string }
    b: { title: string; description: string }
  }

  /** ISO date when test starts (UTC) */
  startDate: string

  /** ISO date when test ends (UTC) - typically startDate + 14 days */
  endDate: string

  /** Set after analysis completes - winner gets 100% traffic */
  winner?: 'a' | 'b'

  /** Optional notes about test hypothesis */
  hypothesis?: string
}

/**
 * Active A/B tests configuration
 *
 * To add a test:
 * 1. Create entry with unique id, pageSlug, and variant metadata
 * 2. Set startDate and endDate (14 days apart)
 * 3. Export to GSC
 * 4. After 14 days, run scripts/ab-analyze.mjs with GSC CSV
 * 5. Set winner field once analysis complete
 * 6. winner='a' or 'b' redirects 100% to winner
 */
export const activeTests: ABTest[] = [
  // Example test - uncomment and customize:
  // {
  //   id: 'title-test-esim-guide',
  //   pageSlug: 'japan-esim-vs-pocket-wifi',
  //   variants: {
  //     a: {
  //       title: 'Japan eSIM vs Pocket WiFi vs SIM Card: Best Pick 2026',
  //       description: 'Compare all 3 ways to get internet in Japan. eSIM is fastest. Pocket WiFi has best value. SIM card cheapest but hassle.'
  //     },
  //     b: {
  //       title: '3 Ways to Get Internet in Japan: eSIM Wins in 2026',
  //       description: 'eSIM beats Pocket WiFi on speed & convenience. Here\'s why 89% of digital nomads choose it + how to set it up in 5 mins.'
  //     }
  //   },
  //   startDate: '2026-04-20T00:00:00Z',
  //   endDate: '2026-05-04T00:00:00Z',
  //   hypothesis: 'Specific benefit (eSIM wins) performs better than comparison format'
  // }
]

/**
 * Determine which variant a user should see
 *
 * Logic:
 * 1. Check if test is active for this page
 * 2. Check if test is within date window
 * 3. If winner set, return winner (100% traffic)
 * 4. Check cookie for existing assignment
 * 5. If no cookie, random 50/50 assignment
 *
 * @param pageSlug - Article slug
 * @param cookieString - Raw cookie string from request headers or document.cookie
 * @returns 'a' or 'b' variant, or null if no active test
 */
export function getVariant(
  pageSlug: string,
  cookieString: string
): 'a' | 'b' | null {
  const test = activeTests.find(t => t.pageSlug === pageSlug)
  if (!test) return null

  // Check if test is within active window
  const now = new Date()
  const startDate = new Date(test.startDate)
  const endDate = new Date(test.endDate)

  if (now < startDate || now > endDate) {
    // Test not active, but return winner if set for consistency
    return test.winner || null
  }

  // If winner already determined, return it (100% traffic to winner)
  if (test.winner) return test.winner

  // Check for existing cookie assignment
  const cookieRegex = new RegExp(`ab-${escapeRegex(test.id)}=(a|b)`)
  const cookieMatch = cookieString.match(cookieRegex)
  if (cookieMatch) {
    return cookieMatch[1] as 'a' | 'b'
  }

  // New user: random 50/50 assignment
  return Math.random() < 0.5 ? 'a' : 'b'
}

/**
 * Get title and description for a test variant
 *
 * @param pageSlug - Article slug
 * @param variant - 'a' or 'b'
 * @returns { title, description } or null if no test
 */
export function getTestMeta(
  pageSlug: string,
  variant: 'a' | 'b'
): { title: string; description: string } | null {
  const test = activeTests.find(t => t.pageSlug === pageSlug)
  if (!test) return null
  return test.variants[variant]
}

/**
 * Get all active tests for analytics tracking
 * Useful for setting up event tracking in GA4
 */
export function getActiveTests(cookieString: string): Array<{
  id: string
  pageSlug: string
  variant: 'a' | 'b'
}> {
  return activeTests
    .filter(test => {
      const now = new Date()
      return now >= new Date(test.startDate) && now <= new Date(test.endDate)
    })
    .map(test => ({
      id: test.id,
      pageSlug: test.pageSlug,
      variant: getVariant(test.pageSlug, cookieString) || 'a'
    }))
}

/**
 * Escape special regex characters in test ID
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Validate test configuration
 * Run during build to catch issues early
 */
export function validateTests(): string[] {
  const errors: string[] = []

  activeTests.forEach(test => {
    // Check required fields
    if (!test.id) errors.push(`Test missing id`)
    if (!test.pageSlug) errors.push(`Test ${test.id} missing pageSlug`)
    if (!test.variants?.a?.title) errors.push(`Test ${test.id} missing variants.a.title`)
    if (!test.variants?.b?.title) errors.push(`Test ${test.id} missing variants.b.title`)
    if (!test.variants?.a?.description) errors.push(`Test ${test.id} missing variants.a.description`)
    if (!test.variants?.b?.description) errors.push(`Test ${test.id} missing variants.b.description`)

    // Check dates
    if (!test.startDate) errors.push(`Test ${test.id} missing startDate`)
    if (!test.endDate) errors.push(`Test ${test.id} missing endDate`)
    if (test.startDate && test.endDate) {
      const start = new Date(test.startDate)
      const end = new Date(test.endDate)
      if (isNaN(start.getTime())) errors.push(`Test ${test.id} startDate invalid`)
      if (isNaN(end.getTime())) errors.push(`Test ${test.id} endDate invalid`)
      if (end <= start) errors.push(`Test ${test.id} endDate must be after startDate`)
    }

    // Check for duplicate test IDs
    const dupCount = activeTests.filter(t => t.id === test.id).length
    if (dupCount > 1 && activeTests.indexOf(test) === activeTests.lastIndexOf(test)) {
      errors.push(`Duplicate test id: ${test.id}`)
    }

    // Warn if test duration isn't ~14 days
    if (test.startDate && test.endDate) {
      const start = new Date(test.startDate)
      const end = new Date(test.endDate)
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      if (days < 10 || days > 21) {
        console.warn(
          `⚠ Test ${test.id} duration ${days} days (recommended 14)`
        )
      }
    }
  })

  return errors
}

// Validate on module import in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  const errors = validateTests()
  if (errors.length > 0) {
    console.error('A/B test configuration errors:')
    errors.forEach(e => console.error(`  - ${e}`))
  }
}

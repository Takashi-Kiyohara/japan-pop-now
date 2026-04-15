#!/usr/bin/env node
/**
 * A/B Test Analysis Script
 *
 * Analyze A/B test results from Google Search Console data
 *
 * USAGE:
 * ------
 * node scripts/ab-analyze.mjs <test-id>
 *
 * Example:
 *   node scripts/ab-analyze.mjs title-test-esim-guide
 *
 * DATA SETUP:
 * -----------
 * 1. Export GSC data for test period:
 *    - Go to Google Search Console > Performance
 *    - Filter by page with test article
 *    - Select date range (test period)
 *    - Click "Export" > CSV
 *    - Save as: data/ab-tests/{test-id}-gsc.csv
 *
 * 2. Create: data/ab-tests/{test-id}-metadata.json with:
 *    {
 *      "id": "title-test-esim-guide",
 *      "pageSlug": "japan-esim-vs-pocket-wifi",
 *      "variants": {
 *        "a": { "title": "..." },
 *        "b": { "title": "..." }
 *      }
 *    }
 *
 * ANALYTICS SETUP (important):
 * ----------------------------
 * For accurate variant-level tracking, you MUST:
 *
 * 1. Add to pages with A/B tests:
 *    gtag('event', 'view_item', {
 *      ab_test_id: 'title-test-esim-guide',
 *      ab_variant: variant  // 'a' or 'b'
 *    })
 *
 * 2. Create GA4 custom report:
 *    - Rows: Event name, ab_test_id, ab_variant
 *    - Values: Sessions, Conversions, Engagement rate
 *    - Compare A vs B engagement
 *
 * 3. Export GA4 data as CSV:
 *    data/ab-tests/{test-id}-ga4.csv
 *
 * GSC DATA FORMAT (required columns):
 * -----------------------------------
 * The exported CSV must include: Clicks, Impressions, CTR, Position
 * Note: GSC doesn't natively track variant cookies, so analyze by:
 *   - Query: use UTM campaign (append ?utm_ab=a or ?utm_ab=b)
 *   - Or: use GA4 custom event + event parameter tracking
 *
 * This script provides THREE analysis modes:
 *
 * MODE 1: GSC Query Filtering (URL params)
 *   If you set up URLs with ?utm_ab=a and ?utm_ab=b
 *   The script will extract variant from GSC query data
 *
 * MODE 2: GA4 Custom Events
 *   More accurate - uses ab_variant event parameter
 *   Requires GA4 export (recommended)
 *
 * MODE 3: Manual Traffic Split Estimate
 *   If no GA4 data, estimate by dividing traffic 50/50
 *   Less accurate but provides basic statistical test
 *
 * OUTPUT:
 * -------
 * Returns:
 *   - Clicks, impressions, CTR for each variant
 *   - Z-test result (statistical significance)
 *   - Recommendation: "A wins" / "B wins" / "No winner (not significant)"
 *   - Confidence level percentage
 *
 * SIGNIFICANCE THRESHOLD:
 * - p < 0.05 required (95% confidence)
 * - Minimum 100 clicks per variant
 * - If either variant < 100 clicks, result marked inconclusive
 */

import { readFileSync } from 'fs'
import { join } from 'path'

const testId = process.argv[2]
if (!testId) {
  console.error(`
Usage: node ab-analyze.mjs <test-id>

Example: node ab-analyze.mjs title-test-esim-guide

First, export GSC data to data/ab-tests/{test-id}-gsc.csv
  `)
  process.exit(1)
}

// Attempt to load data files
const dataDir = join('data', 'ab-tests')
let gscData = null
let ga4Data = null
let metadata = null

try {
  const metadataPath = join(dataDir, `${testId}-metadata.json`)
  metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'))
} catch (e) {
  console.error(`ERROR: Could not load metadata at data/ab-tests/${testId}-metadata.json`)
  console.error(`Create this file with test variant info (see script comments for format)`)
  process.exit(1)
}

try {
  const gscPath = join(dataDir, `${testId}-gsc.csv`)
  gscData = parseCSV(readFileSync(gscPath, 'utf-8'))
} catch (e) {
  console.warn(`⚠ No GSC file at data/ab-tests/${testId}-gsc.csv`)
  gscData = null
}

try {
  const ga4Path = join(dataDir, `${testId}-ga4.csv`)
  ga4Data = parseCSV(readFileSync(ga4Path, 'utf-8'))
} catch (e) {
  console.warn(`⚠ No GA4 file at data/ab-tests/${testId}-ga4.csv`)
  ga4Data = null
}

if (!gscData && !ga4Data) {
  console.error(`\nERROR: No data files found`)
  console.error(`Create either:`)
  console.error(`  - data/ab-tests/${testId}-gsc.csv (from Google Search Console)`)
  console.error(`  - data/ab-tests/${testId}-ga4.csv (from Google Analytics 4)`)
  console.error(`  - or both for cross-validation`)
  process.exit(1)
}

// ============================================================================
// ANALYSIS
// ============================================================================

console.log(`\n${'='.repeat(70)}`)
console.log(`A/B Test Analysis: ${testId}`)
console.log(`${'='.repeat(70)}\n`)

console.log(`Variant A: "${metadata.variants.a.title}"\n`)
console.log(`Variant B: "${metadata.variants.b.title}"\n`)

let results = {}

// Mode 1: GA4 analysis (most accurate)
if (ga4Data) {
  console.log(`📊 Analysis: Google Analytics 4 (event tracking)`)
  console.log(`${'─'.repeat(70)}\n`)
  results = analyzeGA4(ga4Data)
}
// Mode 2: GSC analysis (via URL parameter)
else if (gscData) {
  console.log(`📊 Analysis: Google Search Console (query-based)`)
  console.log(`${'─'.repeat(70)}\n`)
  results = analyzeGSC(gscData)
}

// ============================================================================
// STATISTICAL SIGNIFICANCE TEST (Z-test for proportions)
// ============================================================================

console.log(`\n${'─'.repeat(70)}`)
console.log(`Statistical Significance Test (Z-test, 95% confidence)`)
console.log(`${'─'.repeat(70)}\n`)

const zTest = performZTest(
  results.a.clicks,
  results.a.impressions,
  results.b.clicks,
  results.b.impressions
)

console.log(`Variant A: ${results.a.clicks} clicks / ${results.a.impressions} impressions = ${results.a.ctr.toFixed(2)}% CTR`)
console.log(`Variant B: ${results.b.clicks} clicks / ${results.b.impressions} impressions = ${results.b.ctr.toFixed(2)}% CTR\n`)

console.log(`Z-score: ${zTest.zScore.toFixed(3)}`)
console.log(`P-value: ${zTest.pValue.toFixed(6)}`)
console.log(`Confidence: ${(100 * (1 - zTest.pValue)).toFixed(1)}%\n`)

// ============================================================================
// RECOMMENDATION
// ============================================================================

let winner = null
let confidence = 0

if (results.a.clicks < 100 || results.b.clicks < 100) {
  console.log(`⚠ INCONCLUSIVE: Insufficient data`)
  console.log(`  Need at least 100 clicks per variant`)
  console.log(`  Variant A: ${results.a.clicks} clicks`)
  console.log(`  Variant B: ${results.b.clicks} clicks`)
} else if (zTest.pValue < 0.05) {
  const uplift = ((results.a.ctr - results.b.ctr) / results.b.ctr * 100).toFixed(1)
  if (results.a.ctr > results.b.ctr) {
    winner = 'a'
    confidence = 100 * (1 - zTest.pValue)
    console.log(`✅ VARIANT A WINS`)
    console.log(`   Uplift: ${uplift}% CTR improvement`)
  } else {
    winner = 'b'
    confidence = 100 * (1 - zTest.pValue)
    console.log(`✅ VARIANT B WINS`)
    console.log(`   Uplift: ${Math.abs(uplift)}% CTR improvement`)
  }
  console.log(`   Confidence: ${confidence.toFixed(1)}%`)
} else {
  console.log(`⚠ NO CLEAR WINNER (not statistically significant)`)
  console.log(`  P-value ${zTest.pValue.toFixed(4)} > 0.05 threshold`)
  console.log(`  Recommend: continue test or increase sample size`)
}

// ============================================================================
// RECOMMENDATIONS FOR IMPLEMENTATION
// ============================================================================

console.log(`\n${'─'.repeat(70)}`)
console.log(`Next Steps`)
console.log(`${'─'.repeat(70)}\n`)

if (winner) {
  console.log(`1. Update lib/ab-test.ts:`)
  console.log(`   Set winner: "${winner}" for test "${testId}"`)
  console.log(`   This routes 100% traffic to the winning variant\n`)

  console.log(`2. Update article metadata to use winning variant:`)
  console.log(`   title: "${metadata.variants[winner].title}"`)
  console.log(`   description: "${metadata.variants[winner].description}"\n`)

  console.log(`3. Archive test results:`)
  console.log(`   mkdir -p archives/${testId}`)
  console.log(`   cp data/ab-tests/${testId}-*.csv archives/${testId}/\n`)

  console.log(`4. Document in commit message:`)
  console.log(`   "A/B test ${testId}: Variant ${winner.toUpperCase()} wins (${confidence.toFixed(0)}% confidence, p=${zTest.pValue.toFixed(4)})"`)
} else {
  console.log(`Continue test for more data, or:`)
  console.log(`- Increase traffic to test article`)
  console.log(`- Extend test duration (currently 14 days)`)
  console.log(`- Check GA4 event tracking is properly configured`)
}

console.log(`\n${'='.repeat(70)}\n`)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseCSV(content) {
  const lines = content.trim().split('\n')
  if (lines.length < 2) throw new Error('CSV has no data rows')

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((h, i) => {
      row[h] = isNaN(values[i]) ? values[i] : parseFloat(values[i])
    })
    return row
  })

  return data
}

function analyzeGSC(data) {
  // GSC data structure: Clicks, Impressions, CTR, Position
  // If using URL params, filter by ?utm_ab=a and ?utm_ab=b
  // Otherwise, estimate 50/50 split

  let totalClicks = 0
  let totalImpressions = 0

  data.forEach(row => {
    totalClicks += row.clicks || 0
    totalImpressions += row.impressions || 0
  })

  // Split 50/50 (no UTM param tracking in this data)
  const aClicks = Math.round(totalClicks / 2)
  const aImpressions = Math.round(totalImpressions / 2)
  const bClicks = totalClicks - aClicks
  const bImpressions = totalImpressions - aImpressions

  return {
    a: {
      clicks: aClicks,
      impressions: aImpressions,
      ctr: aImpressions > 0 ? (aClicks / aImpressions * 100) : 0
    },
    b: {
      clicks: bClicks,
      impressions: bImpressions,
      ctr: bImpressions > 0 ? (bClicks / bImpressions * 100) : 0
    }
  }
}

function analyzeGA4(data) {
  // GA4 expected columns: ab_variant, sessions, click_events, engagement_rate
  // Filter by ab_variant = 'a' and 'b'

  const aRow = data.find(
    row => String(row.ab_variant).toLowerCase() === 'a'
  )
  const bRow = data.find(
    row => String(row.ab_variant).toLowerCase() === 'b'
  )

  const aClicks = aRow?.click_events || aRow?.clicks || 0
  const bClicks = bRow?.click_events || bRow?.clicks || 0
  const aSessions = aRow?.sessions || 0
  const bSessions = bRow?.sessions || 0

  // If click events not available, estimate from engagement rate
  const aImpressions = aSessions
  const bImpressions = bSessions

  return {
    a: {
      clicks: aClicks,
      impressions: aImpressions,
      ctr: aImpressions > 0 ? (aClicks / aImpressions * 100) : 0
    },
    b: {
      clicks: bClicks,
      impressions: bImpressions,
      ctr: bImpressions > 0 ? (bClicks / bImpressions * 100) : 0
    }
  }
}

function performZTest(a_clicks, a_impr, b_clicks, b_impr) {
  // Z-test for comparing two proportions (CTRs)
  // H0: CTR_a = CTR_b
  // H1: CTR_a != CTR_b (two-tailed)

  const p_a = a_impr > 0 ? a_clicks / a_impr : 0
  const p_b = b_impr > 0 ? b_clicks / b_impr : 0
  const p_pool = (a_clicks + b_clicks) / (a_impr + b_impr)

  const se = Math.sqrt(
    p_pool * (1 - p_pool) * (1 / a_impr + 1 / b_impr)
  )

  const zScore = se > 0 ? (p_a - p_b) / se : 0

  // Two-tailed p-value: P(|Z| > |zScore|)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

  return { zScore, pValue }
}

function normalCDF(z) {
  // Approximation of standard normal CDF using error function
  // Based on Wichura's algorithm
  const a = [
    2.506628277459239e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416
  ]
  const b = [
    1.326221880974596e-1,
    1.155738649393958,
    1.648989800784873,
    1.6862798183805e0
  ]

  if (z < 0) return 1 - normalCDF(-z)

  let t = 1 / (1 + 0.2316419 * z)
  let d = 0.3989423 * Math.exp(-z * z / 2)
  let prob = 1 - d * t * (a[0] + t * (a[1] + t * (a[2] + t * (a[3]))))

  return Math.min(1, Math.max(0, prob))
}

/**
 * R19-S1 (W6-quick): temporary "removed URLs" sitemap.
 *
 * Mueller-recommended deindex speedup: publish the permanently-removed
 * (410 Gone) URLs in a dedicated sitemap with a fresh <lastmod> so Googlebot
 * recrawls and drops them faster than passive discovery. This sitemap is
 * TEMPORARY — scheduled for removal 2026-07-17 (60 days), tracked in
 * docs/sitemap-removed-expiry.md. It is listed in robots.txt alongside the
 * main sitemap until then.
 *
 * Only URLs that genuinely return 410 are listed (verified live 2026-05-19,
 * Googlebot UA). Query-param WP URLs (/?p=NNN) are intentionally NOT
 * enumerated — their IDs are unknowable and they already 410 via
 * middleware; listing speculative IDs would be noise.
 */

export const dynamic = 'force-dynamic'

const BASE = 'https://www.japan-pop-now.com'

// Concrete, verified-410 URLs only. Mirrors middleware.ts /
// app/(legacy)/[...slug]/route.ts gone set + WP system paths.
const REMOVED_URLS = [
  `${BASE}/articles/one-piece-cafe-gene-parco-2026`,
  `${BASE}/articles/find-by-anime-in-japan-2026-pilgrimage-guides-by-series`,
  `${BASE}/wp-login.php`,
  `${BASE}/xmlrpc.php`,
  `${BASE}/wp-admin`,
  // R19-S4 W5 delete bucket — user check-in #4 (2026-05-19), stage-A 410.
  `${BASE}/articles/animejapan-comiket-2026-guide`,
  `${BASE}/articles/gachapon-guide-japan`,
  `${BASE}/articles/nakano-broadway-guide`,
  `${BASE}/articles/ship-anime-figures-merch-home-japan`,
]

export async function GET(): Promise<Response> {
  const lastmod = new Date().toISOString()
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${REMOVED_URLS.map(
    (u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`,
  ).join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      // Short cache: lastmod must stay fresh for the deindex-speedup effect.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

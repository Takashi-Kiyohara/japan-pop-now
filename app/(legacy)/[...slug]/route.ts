/**
 * R19-S1 (W6-quick): canonical 410 Gone handler for permanently-removed
 * legacy paths.
 *
 * WHY a Route Handler (not middleware): App Router has no native 410 from
 * page.tsx (notFound() = 404), and middleware *rewrite* workarounds get
 * mis-reported as 200 by Vercel's edge cache (R2-critic Y-1). A Route
 * Handler returns a real cacheable 410.
 *
 * STATUS — ADDITIVE, not a migration:
 * middleware.ts already returns correct 410s for the WP legacy patterns and
 * runs BEFORE this handler, so in practice middleware short-circuits these.
 * Live verification (2026-05-19, Googlebot UA) confirmed `/?p=`, `/?page_id=`,
 * `/wp-content/*`, `/wp-login.php`, missing date-URLs all already 410. The
 * WP-410 path in middleware returns early (before the R18-P5
 * `Cache-Control: private,no-store` block), so there is NO R18-P5 conflict
 * to fix there — the R2-critic R-7 premise does not apply to the current
 * middleware structure. This handler is therefore kept as:
 *   1. defense-in-depth (identical semantics to middleware — zero divergence)
 *   2. the reusable skeleton R19-S4 extends for deleted-article 410s.
 * It deliberately mirrors middleware's pattern list exactly so the two
 * sources can never disagree.
 *
 * The `(legacy)` route group adds nothing to the URL; `[...slug]` is a root
 * catch-all and is the LOWEST routing precedence in App Router, so it never
 * shadows app/page.tsx, app/articles/[slug], app/category/[slug], the
 * metadata routes (sitemap/robots), etc.
 */

// Mirrors middleware.ts DELETED_ARTICLE_SLUGS (keep in sync).
const DELETED_ARTICLE_SLUGS = new Set<string>([
  'one-piece-cafe-gene-parco-2026',
  'find-by-anime-in-japan-2026-pilgrimage-guides-by-series',
  // R19-S4 W5 delete bucket — user check-in #4 (2026-05-19), stage A 410.
  'animejapan-comiket-2026-guide',
  'gachapon-guide-japan',
  'nakano-broadway-guide',
  'ship-anime-figures-merch-home-japan',
])

function isGonePath(pathname: string): boolean {
  if (
    pathname === '/wp-admin' ||
    pathname.startsWith('/wp-admin/') ||
    pathname.startsWith('/wp-content/') ||
    pathname.startsWith('/wp-includes/') ||
    pathname === '/wp-login.php' ||
    pathname === '/xmlrpc.php'
  ) {
    return true
  }
  const slug = pathname.startsWith('/articles/')
    ? pathname.replace(/^\/articles\//, '').replace(/\/+$/, '')
    : pathname.replace(/^\/+|\/+$/g, '')
  return DELETED_ARTICLE_SLUGS.has(slug)
}

export async function GET(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)

  if (isGonePath(pathname)) {
    return new Response(
      'This page has been permanently removed.',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          // Long cache: the 410 is permanent; let the edge serve it cheaply.
          'Cache-Control': 'public, max-age=31536000',
        },
      },
    )
  }

  // Everything else: ordinary 404 (unchanged behaviour vs. before this file).
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAllArticleSlugs } from '@/lib/articles'

// Legacy article slugs from pre-Next.js site structure.
// Google still has these old URLs in its index; 301 them to the canonical /articles/{slug}.
// Source: GSC "Crawled - not indexed" + "Redirect error" reports 2026-04-19.
const LEGACY_ARTICLE_SLUGS = new Set<string>([
  'universal-cool-japan-2026-guide',
  'osaka-anime-guide-den-den-town',
  'one-piece-kumamoto-statue-tour',
  'animate-cafe-guide-japan',
  'anime-pilgrimage-spots-tokyo',
  'your-name-pilgrimage-tokyo',
  'japan-esim-pocket-wifi-sim-card',
])

// Permanently deleted articles. Return 410 Gone so Google drops them from the
// index instead of "Crawled - not indexed" loop. Do NOT 301 to /articles/,
// the destination also 404s and the redirect wastes crawl budget.
const DELETED_ARTICLE_SLUGS = new Set<string>([
  'one-piece-cafe-gene-parco-2026',
  'find-by-anime-in-japan-2026-pilgrimage-guides-by-series',
  // R19-S4 W5 delete bucket — user check-in #4 approved 2026-05-19,
  // forced stage A (immediate 410, not noindex-90d): thin evergreen,
  // no rewrite planned, skip the grace period for early-HCU recovery.
  'animejapan-comiket-2026-guide',
  'gachapon-guide-japan',
  'nakano-broadway-guide',
  'ship-anime-figures-merch-home-japan',
])

// 2026-04-19 category slug migration (5-body MECE).
// Map: old /category/<key> -> new /category/<value>. 301 permanent.
const CATEGORY_REDIRECTS: Record<string, string> = {
  'collab-cafes': 'cafes',
  'anime-pilgrimage': 'destinations',
  'area-guides': 'destinations',
  'travel-tips': 'experiences',
}

// System paths that must NOT be treated as legacy article slugs.
const RESERVED_TOP_PATHS = new Set<string>([
  'articles', 'category', 'guides', 'tags', 'features', 'api',
  'calendar', 'about', 'privacy', 'search', 'contact',
  'affiliate-disclosure', 'admin', 'upload', 'robots.txt', 'sitemap.xml',
  'llms.txt', 'favicon.ico', 'ads.txt', '_next',
])

// WordPress-era query params. Pre-DNS-switch these URLs served real articles;
// post-switch (2026-04-09) they all resolve to the homepage, which Google
// then dedupes and drops from the index. Returning 410 tells Google to drop
// the URLs without treating them as duplicates of the homepage. Root-only
// match so legitimate /articles/<slug>?utm_source=... stays unaffected.
const WP_LEGACY_QUERY_PARAMS = [
  'p',         // /?p=NNN    — post by id
  'page_id',   // /?page_id=NNN — page by id
  'cat',       // /?cat=NNN   — category by id
  'tag',       // /?tag=slug  — tag archive
  'author',    // /?author=NNN
  'feed',      // /?feed=rss2
  'm',         // /?m=YYYYMM  — date archive
  's',         // /?s=query   — WP search
  'paged',     // /?paged=N  — WP pagination; current homepage returns 200 and
               //              Google dedupes as homepage variant (登録済み 3→2
               //              deindex, GSC 2026-05-04). 410 flushes cleanly.
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // apex -> www handled in next.config.ts redirects() (earlier in the edge
  // pipeline). Vercel's auto apex redirect fires before middleware.ts, so
  // any middleware-layer apex rule is dead code. See 18e40da postmortem.

  // R9-L9 (2026-05-10): case-canonicalization for /articles/ paths.
  // R8-J tried to do this in next.config.ts redirects() with the rule
  // `{ source: '/Articles/:path*', destination: '/articles/:path*' }` —
  // but Next.js redirects() source matching is case-insensitive by default,
  // so the rule also matched lowercase /articles/foo and 308'd it to itself,
  // causing an infinite loop on every article URL (db5820b revert + critic R8 R2).
  // The middleware-layer fix is safe because we explicitly check for an
  // uppercase letter BEFORE redirecting to the lowercase form, so the
  // destination doesn't trigger the rule.
  if (
    /^\/articles\//i.test(pathname) &&
    pathname.toLowerCase() !== pathname
  ) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, 301)
  }

  // WP legacy query URLs: /?p=NNN etc land on the homepage and look like
  // duplicate content to Google. Return 410 to flush them from the index.
  // Only trigger when the request targets the root path — anything under
  // /articles/, /category/, etc. keeps its existing behavior including
  // analytics params.
  if (pathname === '/' && request.nextUrl.search) {
    const sp = request.nextUrl.searchParams
    const hasWpParam = WP_LEGACY_QUERY_PARAMS.some((k) => sp.has(k))
    if (hasWpParam) {
      return new NextResponse(
        'This legacy WordPress URL has been permanently removed. See https://www.japan-pop-now.com/ for the current site.',
        {
          status: 410,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Robots-Tag': 'noindex',
          },
        }
      )
    }
  }

  // Normalize: strip leading/trailing slashes, take first segment only.
  const trimmed = pathname.replace(/^\/+|\/+$/g, '')

  // R13-E1 (2026-05-14): WordPress-style /:year/:month/:day/:slug URLs.
  // The next.config.ts rule was blind 308 -> /articles/:slug regardless of
  // whether :slug still resolves. That bounced deleted-and-not-listed slugs
  // through /articles/ and 404'd them (GSC "Redirect error"). Middleware
  // version validates :slug against getAllArticleSlugs() first:
  //   - exists -> 308 to /articles/:slug (preserve crawl budget)
  //   - missing -> 410 Gone (drop signal so Google removes the URL cleanly)
  const dateUrlMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/)
  if (dateUrlMatch) {
    const dateSlug = dateUrlMatch[4]
    const existsAsArticle = getAllArticleSlugs().includes(dateSlug)
    if (existsAsArticle) {
      const url = new URL(`/articles/${dateSlug}`, request.url)
      return NextResponse.redirect(url, 308)
    }
    return new NextResponse(
      'This dated URL has been permanently removed.',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
        },
      }
    )
  }

  // 410 Gone for permanently deleted articles — match either /<slug> or
  // /articles/<slug>. Must run before the LEGACY redirect so the deleted
  // slug does not bounce through /articles/ first.
  const articleSlug = pathname.startsWith('/articles/')
    ? pathname.replace(/^\/articles\//, '').replace(/\/+$/, '')
    : trimmed
  if (articleSlug && DELETED_ARTICLE_SLUGS.has(articleSlug)) {
    return new NextResponse(
      'This article has been permanently removed.',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          // R19-S4 F2: long-cache the permanent 410 (parity with
          // app/(legacy)/[...slug]/route.ts) so the edge serves it cheaply.
          'Cache-Control': 'public, max-age=31536000',
        },
      }
    )
  }

  // R15 fix B (2026-05-14): case-fold bare-slug LEGACY lookup. GSC has 7+
  // mixed-case slugs in its index from the WP era (e.g. /Your-Name-Pilgrimage-Tokyo).
  // Without case-folding these returned 404 instead of redirecting to the
  // lowercase article URL. Match case-insensitively against the
  // LEGACY_ARTICLE_SLUGS Set keys.
  if (trimmed && !trimmed.includes('/') && !RESERVED_TOP_PATHS.has(trimmed)) {
    const trimmedLower = trimmed.toLowerCase()
    if (LEGACY_ARTICLE_SLUGS.has(trimmedLower)) {
      const url = new URL(`/articles/${trimmedLower}`, request.url)
      return NextResponse.redirect(url, 301)
    }
  }

  // R15 fix A (2026-05-14): consolidate /category/<old>/page/<N> redirects
  // into a single 301 → /category/<new>. Previously /page/<N> stripped to
  // /category/<old> via next.config.ts redirects(), then /category/<old>
  // hit the migration rule below = 2 hops total. GSC reports 2-hop chains
  // as "redirect error" — 4 old categories × 5 paginated forms = 20 errors.
  // Match the /page/<N> form upfront and short-circuit to the new category.
  const categoryPageMatch = pathname.match(/^\/category\/([^/]+)\/page\/\d+\/?$/)
  if (categoryPageMatch) {
    const oldOrCurrentSlug = categoryPageMatch[1]
    const newSlug = CATEGORY_REDIRECTS[oldOrCurrentSlug] ?? oldOrCurrentSlug
    const url = new URL(`/category/${newSlug}`, request.url)
    return NextResponse.redirect(url, 301)
  }

  // Category slug migration: /category/<old> -> /category/<new>, 301.
  const categoryMatch = pathname.match(/^\/category\/([^/]+)\/?$/)
  if (categoryMatch) {
    const oldSlug = categoryMatch[1]
    const newSlug = CATEGORY_REDIRECTS[oldSlug]
    if (newSlug) {
      const url = new URL(`/category/${newSlug}`, request.url)
      return NextResponse.redirect(url, 301)
    }
  }

  // R15 fix D (2026-05-14): WP residue 410. /wp-admin, /wp-content/uploads/*,
  // /wp-includes/* etc. are pre-Next legacy paths. Currently 403 (default
  // Vercel response for non-existent paths under certain conditions) or 404.
  // Convert to 410 + noindex so Google drops them from the index.
  if (
    pathname === '/wp-admin' ||
    pathname.startsWith('/wp-admin/') ||
    pathname.startsWith('/wp-content/') ||
    pathname.startsWith('/wp-includes/') ||
    pathname === '/wp-login.php' ||
    pathname === '/xmlrpc.php'
  ) {
    return new NextResponse(
      'This WordPress legacy path has been permanently removed.',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
        },
      }
    )
  }

  const response = NextResponse.next()

  // R18-P5 (2026-05-18): Vary:User-Agent abandoned as a mechanism.
  // Live production verification proves NEITHER prior approach gets
  // User-Agent into the response Vary — both the middleware append
  // (commit 4ca138e) and the vercel.json headers stanza (commit ba282a1)
  // are clobbered by Next.js 16's RSC Vary
  // (`rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`),
  // which is the only Vary value the live site emits on `/` and articles.
  // vercel.json's Vary line is left in place (harmless, no-op on RSC
  // routes) but is NOT relied upon. The real risk Vary was meant to
  // mitigate — a UA-variant response poisoning the shared CDN cache — is
  // instead handled at its source below: the ONLY UA-dependent output is
  // the X-Robots-Tag:noindex header set for unknown bots, so that specific
  // response is marked uncacheable rather than depending on Vary surviving.

  // Geo-personalization: Set geo cookie from Vercel geo header
  // Next.js 16+ removed request.geo, use x-vercel-ip-country header directly
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  response.cookies.set('jpn-geo', country, {
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
  })

  // Bot management: Tag unknown bots
  // R12-P0 (2026-05-14): expanded whitelist to cover every Google verification
  // bot AdSense + GSC use. The prior pattern only matched `Googlebot` as a literal
  // substring, so `AdsBot-Google` (AdSense crawler) hit isBotLike via "Bot" yet
  // failed isKnownBot via no `Googlebot` match — receiving X-Robots-Tag:noindex.
  // Likely culprit for the 11-cycle indexation failure surfaced by external
  // Critic Round 2 against the live site. Other Google bots that lack the
  // literal `bot` substring (Mediapartners-Google, Google-InspectionTool,
  // APIs-Google, FeedFetcher-Google) were not noindex-tagged under the old
  // regex but are now explicitly listed for clarity + future-proofing.
  const KNOWN_BOT_PATTERNS = [
    // Google
    /Googlebot/i,
    /Mediapartners-Google/i,
    /AdsBot-Google/i,
    /Google-InspectionTool/i,
    /Googlebot-Image/i,
    /Googlebot-Video/i,
    /APIs-Google/i,
    /FeedFetcher-Google/i,
    // Other major search engines
    /Bingbot/i,
    /DuckDuckBot/i,
    /Baiduspider/i,
    /Yandex/i,
    /Slurp/i,
    /Applebot/i,
    // LLM crawlers
    /GPTBot/i,
    /ClaudeBot/i,
    /PerplexityBot/i,
  ]
  function isKnownBot(ua: string): boolean {
    return KNOWN_BOT_PATTERNS.some((p) => p.test(ua))
  }
  const ua = request.headers.get('user-agent') || ''
  const isBotLike = /bot|crawler|spider|scraper|fetch|curl|wget|python|java(?!script)/i.test(ua)

  if (isBotLike && !isKnownBot(ua)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    // R18-P5: this is the only UA-variant response on the site. Mark it
    // private + non-storable so Vercel's shared CDN cache never stores it
    // and serves the noindex variant to a human (or vice versa). This
    // replaces the unreliable Vary:User-Agent approach (RSC clobbers Vary;
    // see comment above). Unknown bots are low volume and their responses
    // should not be cached anyway, so the cache-hit-rate cost is negligible.
    response.headers.set('Cache-Control', 'private, no-store')
  }

  return response
}

export const config = {
  // R13-E1 (2026-05-14): switch to Node runtime so middleware can call
  // getAllArticleSlugs() from lib/articles.ts (which uses fs/path).
  // Edge runtime trade-off: slightly slower cold start, but the existence
  // guard on the date-URL redirect requires filesystem access, and the
  // bot-whitelist + redirect logic don't benefit enough from edge to
  // justify rebuilding a separate slug-snapshot module.
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory assets
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.well-known).*)',
  ],
}

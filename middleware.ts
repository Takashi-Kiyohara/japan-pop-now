import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
        },
      }
    )
  }

  // Handle legacy slug redirects (301) for alive articles.
  if (trimmed && !trimmed.includes('/') && !RESERVED_TOP_PATHS.has(trimmed)) {
    if (LEGACY_ARTICLE_SLUGS.has(trimmed)) {
      const url = new URL(`/articles/${trimmed}`, request.url)
      return NextResponse.redirect(url, 301)
    }
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

  const response = NextResponse.next()

  // Geo-personalization: Set geo cookie from Vercel geo header
  // Next.js 16+ removed request.geo, use x-vercel-ip-country header directly
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  response.cookies.set('jpn-geo', country, {
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
  })

  // Bot management: Tag unknown bots
  const ua = request.headers.get('user-agent') || ''
  const isKnownBot = /Googlebot|Bingbot|GPTBot|ClaudeBot|PerplexityBot|Applebot|Slurp|DuckDuckBot|Baiduspider|Yandex/i.test(ua)
  const isBotLike = /bot|crawler|spider|scraper|fetch|curl|wget|python|java(?!script)/i.test(ua)

  if (isBotLike && !isKnownBot) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}

export const config = {
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

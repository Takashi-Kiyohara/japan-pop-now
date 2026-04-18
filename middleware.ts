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
  'one-piece-cafe-gene-parco-2026',
  'your-name-pilgrimage-tokyo',
  'japan-esim-pocket-wifi-sim-card',
])

// System paths that must NOT be treated as legacy article slugs.
const RESERVED_TOP_PATHS = new Set<string>([
  'articles', 'category', 'guides', 'tags', 'features', 'api',
  'calendar', 'about', 'privacy', 'search', 'contact',
  'affiliate-disclosure', 'admin', 'upload', 'robots.txt', 'sitemap.xml',
  'llms.txt', 'favicon.ico', 'ads.txt', '_next',
])

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle legacy slug redirects (301) before anything else.
  // Normalize: strip leading/trailing slashes, take first segment only.
  const trimmed = pathname.replace(/^\/+|\/+$/g, '')
  if (trimmed && !trimmed.includes('/') && !RESERVED_TOP_PATHS.has(trimmed)) {
    if (LEGACY_ARTICLE_SLUGS.has(trimmed)) {
      const url = new URL(`/articles/${trimmed}`, request.url)
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

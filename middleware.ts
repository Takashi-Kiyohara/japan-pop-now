import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Geo-personalization: Set geo cookie from Vercel geo header
  // Next.js 16+ removed request.geo — use x-vercel-ip-country header directly
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

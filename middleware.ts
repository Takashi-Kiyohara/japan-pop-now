import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: enforce www canonical domain
 * Non-www requests get 301 redirected to www.japan-pop-now.com
 * This prevents duplicate content and consolidates SEO signals.
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Redirect non-www to www (301 permanent)
  if (hostname === 'japan-pop-now.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.japan-pop-now.com';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static assets and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};

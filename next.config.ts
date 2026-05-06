import type { NextConfig } from "next";

// Pre-Next.js WordPress flat-slug URLs that map straight to /articles/{same-slug}.
// Joined with | to form a path-to-regexp alternation that matches any of them.
// Used in redirect source patterns: `/:slug(${LEGACY_FLAT_SLUGS})`.
const LEGACY_FLAT_SLUGS = [
  // 12 next.config-era 308s (Apr 2026)
  'lawson-ticket-anime-cafe-booking',
  'anime-merch-shopping-guide-japan',
  'nakano-broadway-guide',
  'tokyo-anime-district-guide',
  'gachapon-guide-japan',
  'japan-ic-card-transit-guide',
  'akihabara-complete-guide-2026',
  'how-to-book-anime-collab-cafe-japan',
  'weathering-with-you-locations-tokyo',
  'ikebukuro-anime-guide-2026',
  'tokyo-anime-collab-cafes-spring-2026',
  // 7 middleware-era 301s (kept here so they single-hop at edge before middleware fires)
  'universal-cool-japan-2026-guide',
  'osaka-anime-guide-den-den-town',
  'one-piece-kumamoto-statue-tour',
  'animate-cafe-guide-japan',
  'anime-pilgrimage-spots-tokyo',
  'your-name-pilgrimage-tokyo',
  'japan-esim-pocket-wifi-sim-card',
].join('|');

// Long-form WP slug (renamed at re-publication). Stored separately because it
// maps to a DIFFERENT slug (not /articles/{same-slug}).
const LEGACY_LONG_SLUG = 'the-complete-guide-to-japanese-game-centers-arcades-2026-crane-games-rhythm-games-more';

// Centralized security headers applied to every route via `/:path*`.
// CSP allowlists union the prior config (Beehiiv, Giscus, AdSense) with
// Vercel Live / vercel-insights / YouTube; HSTS bumped to 2 years preload.
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://adservice.google.com https://giscus.app https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://api.beehiiv.com https://vitals.vercel-insights.com https://*.vercel.app",
      "frame-src 'self' https://www.google.com https://pagead2.googlesyndication.com https://giscus.app https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.beehiiv.com",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'japan-pop-now.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.wp.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
    ],
    // Serve optimized WebP/AVIF automatically
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,
  },

  // Compression
  compress: true,

  // Trailing slash consistency (SEO)
  trailingSlash: false,

  // Disable the framework's automatic /:path+/ -> /:path+ trailing-slash strip
  // (which is registered with priority: true and fires BEFORE redirects()).
  // Without this, source patterns containing an explicit trailing slash like
  // `/:slug(LEGACY)/` are dead code: by the time our redirects evaluate, the
  // framework has already stripped the trailing slash. With skip enabled, we
  // own trailing-slash handling, and the explicit `/:slug(LEGACY)/` rule fires
  // for trailing-form legacy URLs in a single hop (avoids the framework strip
  // + legacy rewrite 2-hop chain). A generic /:path+/ -> /:path+ rule at the
  // end of redirects() handles every other trailing-slash path.
  skipTrailingSlashRedirect: true,

  // Experimental performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Bundle analyzer environment hint
  // Run: ANALYZE=true npm run build
  productionBrowserSourceMaps: false,

  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
    // Cache static assets aggressively (production only — Next dev breaks with this header)
    ...(process.env.NODE_ENV === 'production' ? [{
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    }] : []),
    // Cache images
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=2592000, s-maxage=2592000' },
      ],
    },
    // XML/RSS
    {
      source: '/sitemap.xml',
      headers: [{ key: 'Content-Type', value: 'application/xml' }],
    },
    {
      source: '/feed.xml',
      headers: [{ key: 'Content-Type', value: 'application/xml' }],
    },
    {
      source: '/robots.txt',
      headers: [{ key: 'Content-Type', value: 'text/plain' }],
    },
    // llms.txt for AI crawlers
    {
      source: '/llms.txt',
      headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
    },
    {
      source: '/llms-full.txt',
      headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
    },
  ],

  redirects: async () => [
    // ── APEX (japan-pop-now.com) — single-hop normalize to canonical www URL ──
    // Order: most-specific apex rules FIRST so apex+legacy and apex+trailing
    // collapse to 1 hop, then the apex catchall. Per postmortem 869f4c3,
    // middleware cannot catch apex because Vercel's edge fires its default
    // 307 before middleware runs; next.config redirects execute earlier in
    // the same edge pipeline and beat that 307 with a strong 308 signal.

    // Apex + legacy flat slug (no trailing) → www/articles/{slug}
    {
      source: `/:slug(${LEGACY_FLAT_SLUGS})`,
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/articles/:slug',
      permanent: true,
    },
    // Apex + legacy flat slug (with trailing) → www/articles/{slug}
    {
      source: `/:slug(${LEGACY_FLAT_SLUGS})/`,
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/articles/:slug',
      permanent: true,
    },
    // Apex + long legacy slug (any trailing) → www/articles/game-centers-arcades-japan
    {
      source: `/${LEGACY_LONG_SLUG}`,
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/articles/game-centers-arcades-japan',
      permanent: true,
    },
    {
      source: `/${LEGACY_LONG_SLUG}/`,
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/articles/game-centers-arcades-japan',
      permanent: true,
    },
    // Apex + /collab-cafe-calendar (any trailing) → www/calendar
    {
      source: '/collab-cafe-calendar',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/calendar',
      permanent: true,
    },
    {
      source: '/collab-cafe-calendar/',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/calendar',
      permanent: true,
    },
    // Apex + /feed (any trailing) → www/feed.xml
    {
      source: '/feed',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/feed.xml',
      permanent: true,
    },
    {
      source: '/feed/',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/feed.xml',
      permanent: true,
    },
    // Apex + trailing slash on any other path → www/no-trailing (1 hop)
    {
      source: '/:path*/',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/:path*',
      permanent: true,
    },
    // Apex catchall (everything else with no trailing slash)
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'japan-pop-now.com' }],
      destination: 'https://www.japan-pop-now.com/:path*',
      permanent: true,
    },

    // ── www-side single-hop rules ──
    // The framework's trailing-slash strip fires BEFORE middleware (verified
    // 2026-05-04 chain trace), so handling /:slug/ via next.config.ts is the
    // only way to collapse "trailing + legacy" from 2 hops to 1.

    // www + legacy flat slug WITH trailing → /articles/{slug} (beats framework strip)
    {
      source: `/:slug(${LEGACY_FLAT_SLUGS})/`,
      destination: '/articles/:slug',
      permanent: true,
    },
    // www + long slug WITH trailing → /articles/game-centers-arcades-japan
    {
      source: `/${LEGACY_LONG_SLUG}/`,
      destination: '/articles/game-centers-arcades-japan',
      permanent: true,
    },
    // www + /collab-cafe-calendar/ → /calendar (existing rule below handles no-trailing)
    {
      source: '/collab-cafe-calendar/',
      destination: '/calendar',
      permanent: true,
    },
    // www + /feed/ → /feed.xml (existing rule below handles no-trailing)
    {
      source: '/feed/',
      destination: '/feed.xml',
      permanent: true,
    },

    // ── Existing structural rules ──
    // WordPress date-based URLs → Next.js article URLs
    {
      source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
      destination: '/articles/:slug',
      permanent: true,
    },
    // WordPress category URLs → Next.js category URLs
    {
      source: '/category/:slug/page/:num',
      destination: '/category/:slug',
      permanent: true,
    },
    // WordPress feed URLs
    {
      source: '/feed',
      destination: '/feed.xml',
      permanent: true,
    },
    // Legacy WP flat-slug URLs (no /articles/ prefix). Single regex group
    // covers all 18 same-slug entries; long slug + collab-cafe-calendar are
    // separate because their destination differs from /articles/{slug}.
    {
      source: `/:slug(${LEGACY_FLAT_SLUGS})`,
      destination: '/articles/:slug',
      permanent: true,
    },
    { source: `/${LEGACY_LONG_SLUG}`, destination: '/articles/game-centers-arcades-japan', permanent: true },
    // WP standalone calendar → app/calendar/ hub
    { source: '/collab-cafe-calendar', destination: '/calendar', permanent: true },
    // Cannibalization 308s: source articles superseded by newer/stronger
    // companion. Source MDX kept (no-delete) with robots:noindex +
    // canonical pointing to target so sitemap excludes them.
    { source: '/articles/demon-slayer-rerun-cafe-ufotable-2026', destination: '/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026', permanent: true },
    { source: '/articles/osaka-anime-collab-cafes-pop-culture-2026', destination: '/articles/osaka-anime-cafes-complete-guide-2026', permanent: true },

    // Generic trailing-slash strip — REPLACES the framework's internal
    // /:path+/ priority rule that's removed by skipTrailingSlashRedirect.
    // MUST stay LAST so specific legacy + structural rules above can fire
    // first and collapse "trailing + legacy" into a single hop.
    {
      source: '/:path+/',
      destination: '/:path+',
      permanent: true,
    },
  ],
};

export default nextConfig;

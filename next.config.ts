import type { NextConfig } from "next";

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
  ],
};

export default nextConfig;

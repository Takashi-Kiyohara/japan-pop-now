import type { NextConfig } from "next";

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
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()' },
        // HSTS — enforce HTTPS for 1 year, include subdomains, preload-ready
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        // CSP — allow self, Google (Analytics/AdSense), Vercel, Beehiiv, Unsplash
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://adservice.google.com https://giscus.app",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://api.beehiiv.com",
            "frame-src https://www.google.com https://pagead2.googlesyndication.com https://giscus.app",
            "media-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self' https://api.beehiiv.com",
            "frame-ancestors 'self'",
          ].join('; '),
        },
        // Cross-Origin policies
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      ],
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

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

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
      ],
    },
    // Cache static assets aggressively
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
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
    // WordPress → Next.js redirects (activate when DNS switches)
    // {
    //   source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
    //   destination: '/articles/:slug',
    //   permanent: true,
    // },
  ],
};

export default nextConfig;

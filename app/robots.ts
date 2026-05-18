import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      // AI crawlers — explicitly allowed for AEO
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
    ],
    sitemap: [
      'https://www.japan-pop-now.com/sitemap.xml',
      // R19-S1: TEMPORARY removed-URLs sitemap (deindex speedup).
      // Scheduled removal 2026-07-17 — see docs/sitemap-removed-expiry.md.
      'https://www.japan-pop-now.com/sitemap-removed.xml',
    ],
    host: 'https://www.japan-pop-now.com',
  };
}

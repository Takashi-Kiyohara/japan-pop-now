import type { Metadata } from 'next';

// R15 fix F (2026-05-14): /bookmarks is a client-only page rendering the
// user's localStorage-saved articles. No canonical content per request,
// no value to index. Sitemap.ts excludes it. Use a Server Component
// layout to attach noindex metadata since the page itself is 'use client'.
export const metadata: Metadata = {
  title: 'Saved Bookmarks',
  description: 'Your saved articles on Japan Pop Now (local-only, not synced across devices).',
  alternates: { canonical: 'https://www.japan-pop-now.com/bookmarks' },
  robots: { index: false, follow: true },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

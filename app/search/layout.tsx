import type { Metadata } from 'next';

// Search page is a client component (uses useSearchParams), so metadata is
// set from the route segment layout. Per Google's own guidance, SERP
// result pages should never appear in the index — users arriving via
// Google search and then seeing *our* search SERP is a bad loop.
// Keep follow=true so crawlers still trace outbound article links.
export const metadata: Metadata = {
  title: 'Search — Japan Pop Now',
  description: 'Search for anime collab cafes, pop culture events, destination guides, and experiences on Japan Pop Now.',
  alternates: { canonical: 'https://www.japan-pop-now.com/search' },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

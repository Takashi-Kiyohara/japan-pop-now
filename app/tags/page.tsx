import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { getAllUniqueTags } from '@/lib/auto-tags';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'All Tags — Japan Pop Now',
  description: 'Browse all content tags on Japan Pop Now — anime series, locations, travel topics, and more.',
  alternates: { canonical: 'https://www.japan-pop-now.com/tags' },
  // Tags index: noindex,follow (2026-04-10, AdSense low-value fix).
  // Individual /tags/[tag] pages are already noindex.
  robots: {
    index: false,
    follow: true,
  },
};

export default function TagsIndex() {
  const allArticles = getAllArticles();
  const tags = getAllUniqueTags(allArticles);

  // Count articles per tag
  const tagCounts = new Map<string, number>();
  allArticles.forEach((a) => {
    a.tags.forEach((t) => {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    });
  });

  // Sort by count descending
  const sortedTags = tags.sort((a, b) => (tagCounts.get(b) || 0) - (tagCounts.get(a) || 0));

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Tags', href: '/tags' }]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#14213d',
            marginBottom: '0.5rem',
          }}
        >
          All Tags
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#78716c' }}>
          {tags.length} tags across {allArticles.length} articles
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => {
            const count = tagCounts.get(tag) || 0;
            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                  background: '#fff',
                  color: '#44403c',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tag.replace(/-/g, ' ')}
                <span style={{ fontSize: '0.7rem', color: '#a8a29e', fontWeight: 400 }}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

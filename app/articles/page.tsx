import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { absoluteUrl } from '@/lib/url';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

const ARTICLES_INDEX_URL = absoluteUrl('/articles');

export const metadata: Metadata = {
  // Use title.absolute to bypass the root layout's title.template
  // ("%s | Japan Pop Now") and avoid double-suffix in SERPs.
  // Same pattern as PR #11 (b291d26) for hubs/categories.
  title: { absolute: 'All Articles | Japan Pop Now' },
  description:
    'Browse every article on Japan Pop Now: collab cafes, anime pilgrimage, travel tips, and area guides.',
  alternates: {
    canonical: ARTICLES_INDEX_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'All Articles — Japan Pop Now',
    description:
      'Browse every article on Japan Pop Now: collab cafes, anime pilgrimage, travel tips, and area guides.',
    type: 'website',
    url: ARTICLES_INDEX_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Articles — Japan Pop Now',
    site: '@pop_now_jp',
  },
};

export default function ArticlesIndexPage() {
  // Already sorted by date desc inside getAllArticles().
  // R18-P4: exclude noindex articles from the main listing. Promoting
  // noindex (low-quality / deduped / sunset) pages in the site's primary
  // article index sends an HCU-negative signal and inflates the live
  // index count vs. the sitemap. The same filtered set feeds the category
  // counts, the {n} articles label, and the CollectionPage ItemList JSON-LD,
  // so they all stay consistent automatically.
  const articles = getAllArticles().filter(
    (a) => !(a.robots ?? '').toLowerCase().includes('noindex'),
  );

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
  ];

  // Build a category counts map for the in-page filter strip.
  const categoryCounts = new Map<string, number>();
  for (const a of articles) {
    categoryCounts.set(a.category, (categoryCounts.get(a.category) ?? 0) + 1);
  }

  return (
    <>
      {/* Structured Data — CollectionPage + ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'All Articles',
            description:
              'Browse every article on Japan Pop Now: collab cafes, anime pilgrimage, travel tips, and area guides.',
            url: ARTICLES_INDEX_URL,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: absoluteUrl(`/articles/${a.slug}`),
                name: a.title,
              })),
            },
          }),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <h1
            style={{
              fontFamily:
                'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.9rem, 4vw, 2.7rem)',
              fontWeight: 700,
              color: '#14213d',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
            }}
          >
            All Articles
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: '#44403c',
              maxWidth: '720px',
              lineHeight: 1.7,
            }}
          >
            Every article on Japan Pop Now — collab cafes, anime pilgrimage,
            travel tips, and area guides. Sorted by date, newest first.
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#a8a29e',
              marginTop: '0.5rem',
            }}
          >
            {articles.length} articles
          </p>
        </header>

        {/* Category filter strip (links to /category/<slug>) */}
        {CATEGORIES.length > 0 ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const count = categoryCounts.get(c.slug) ?? 0;
                if (count === 0) return null;
                return (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #e7e5e4',
                      background: '#fff',
                      color: '#44403c',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    {c.label}{' '}
                    <span style={{ color: '#a8a29e' }}>({count})</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Articles grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  size="md"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: '#78716c', fontSize: '1rem' }}>
                No articles yet — check back soon.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

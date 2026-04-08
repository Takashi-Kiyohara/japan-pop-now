import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist. Browse our latest anime cafe guides, pilgrimage spots, and travel tips.',
};

export default function NotFound() {
  const articles = getAllArticles().slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: '#14213d',
          marginBottom: '12px',
        }}
      >
        404
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#78716c', maxWidth: '480px', margin: '0 auto 2rem' }}>
        This page got lost somewhere between Akihabara and Shibuya. Let&apos;s get you back on track.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            background: '#f97316',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Go Home
        </Link>
        <Link
          href="/category/collab-cafes"
          style={{
            background: '#fff',
            color: '#14213d',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            border: '1px solid #e7e5e4',
            textDecoration: 'none',
          }}
        >
          Browse Collab Cafes
        </Link>
      </div>

      {/* Quick Search Info */}
      <p style={{ fontSize: '0.9rem', color: '#78716c', marginBottom: '2rem', fontStyle: 'italic' }}>
        Tip: Press <kbd style={{ background: '#f5f5f4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e7e5e4' }}>Cmd+K</kbd> (or <kbd style={{ background: '#f5f5f4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e7e5e4' }}>Ctrl+K</kbd>) to search.
      </p>

      {articles.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#14213d',
              marginBottom: '1.5rem',
            }}
          >
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} size="sm" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArticles } from '@/lib/articles';
import { getAllUniqueTags } from '@/lib/auto-tags';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const articles = getAllArticles();
  const tags = getAllUniqueTags(articles);
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${label} Articles — Japan Pop Now`,
    description: `All articles tagged "${label}" on Japan Pop Now — anime, pop culture, and travel guides for Japan.`,
    alternates: { canonical: `https://www.japan-pop-now.com/tags/${tag}` },
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const allArticles = getAllArticles();
  const allTags = getAllUniqueTags(allArticles);

  if (!allTags.includes(tag)) {
    notFound();
  }

  const articles = allArticles.filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );

  const label = tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tags', href: '/tags' },
    { label, href: `/tags/${tag}` },
  ];

  // Related tags — tags that appear alongside this tag frequently
  const relatedTagCounts = new Map<string, number>();
  articles.forEach((a) => {
    a.tags.forEach((t) => {
      if (t !== tag) {
        relatedTagCounts.set(t, (relatedTagCounts.get(t) || 0) + 1);
      }
    });
  });
  const relatedTags = Array.from(relatedTagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#14213d',
            marginBottom: '0.5rem',
          }}
        >
          {label}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#a8a29e' }}>
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} size="md" />
          ))}
        </div>
      </div>

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#14213d', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Related Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${t}`}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e7e5e4',
                    background: '#fff',
                    color: '#44403c',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  {t.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

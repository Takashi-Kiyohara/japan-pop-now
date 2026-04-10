import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FEATURES,
  getFeatureBySlug,
  getActiveFeatureSlugs,
} from '@/lib/features';
import { getArticlesByFeature, CATEGORIES } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import AdUnit from '@/components/AdUnit';

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Only generate pages for active features. Upcoming series are teased in
// marketing surfaces but their hub pages don't exist until content lands.
export async function generateStaticParams() {
  return getActiveFeatureSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    return { title: 'Feature Not Found' };
  }

  const featureUrl = `https://japan-pop-now.com/features/${slug}`;
  const ogImage = feature.cover.startsWith('http')
    ? feature.cover
    : `https://japan-pop-now.com${feature.cover}`;

  return {
    title: `${feature.label} — Japan Pop Now Features`,
    description: feature.description,
    alternates: {
      canonical: featureUrl,
    },
    // Hub page: noindex while series grows past MVP seed articles.
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${feature.label} — Japan Pop Now`,
      description: feature.tagline,
      type: 'website',
      url: featureUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${feature.label} feature series`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${feature.label} — Japan Pop Now`,
      description: feature.tagline,
      site: '@pop_now_jp',
    },
  };
}

export default async function FeatureSeriesPage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature || feature.status !== 'active') {
    notFound();
  }

  const articles = getArticlesByFeature(slug);
  const primaryCategoryInfo = CATEGORIES.find(
    (c) => c.slug === feature.primaryCategory
  );

  // Critic-approved breadcrumb precedence: category is required, feature is
  // supplementary — so on feature hubs we show Home > Features > {series}, and
  // on article pages we show Home > {category} > {article} (unchanged).
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: feature.label, href: `/features/${slug}` },
  ];

  return (
    <>
      {/* Structured Data — CollectionPage with hasPart articles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${feature.label} — Japan Pop Now`,
            description: feature.description,
            url: `https://japan-pop-now.com/features/${slug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Japan Pop Now',
              url: 'https://japan-pop-now.com',
            },
            hasPart: articles.map((a) => ({
              '@type': 'Article',
              headline: a.title,
              url: `https://japan-pop-now.com/articles/${a.slug}`,
              datePublished: a.date,
            })),
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://japan-pop-now.com/articles/${a.slug}`,
                name: a.title,
              })),
            },
          }),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero */}
        <section
          style={{
            background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`,
            borderTop: `4px solid ${feature.color}`,
            borderBottom: '1px solid #e7e5e4',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: feature.color,
                marginBottom: '12px',
              }}
            >
              Feature Series
              {primaryCategoryInfo && (
                <>
                  {' · '}
                  <Link
                    href={`/category/${feature.primaryCategory}`}
                    style={{ color: feature.color, textDecoration: 'none' }}
                  >
                    {primaryCategoryInfo.label}
                  </Link>
                </>
              )}
            </p>
            <h1
              style={{
                fontFamily:
                  'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 700,
                color: '#14213d',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              {feature.label}
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: '#44403c',
                fontStyle: 'italic',
                marginBottom: '1.25rem',
              }}
            >
              {feature.tagline}
            </p>
            <p
              style={{
                fontSize: '1rem',
                color: '#57534e',
                lineHeight: 1.7,
                maxWidth: '680px',
              }}
            >
              {feature.description}
            </p>
            <div
              style={{
                marginTop: '1.5rem',
                fontSize: '0.85rem',
                color: '#a8a29e',
              }}
            >
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}{' '}
              in this series
            </div>
          </div>
        </section>

        {/* Ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <AdUnit slot="7777777701" format="leaderboard" lazy />
        </div>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} size="md" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: '#78716c', fontSize: '1rem' }}>
                Articles coming soon — this series is being prepared for
                publication.
              </p>
            </div>
          )}
        </section>

        {/* Cross-series navigation */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '2rem' }}>
            <h2
              style={{
                fontFamily:
                  'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#14213d',
                marginBottom: '1rem',
              }}
            >
              Other Feature Series
            </h2>
            <div className="flex flex-wrap gap-3">
              {FEATURES.filter(
                (f) => f.slug !== slug && f.status === 'active'
              ).map((f) => (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${f.color}40`,
                    background: '#fff',
                    color: f.color,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {f.label}
                </Link>
              ))}
              <Link
                href="/features"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                All Features →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

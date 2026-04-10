import { Metadata } from 'next';
import Link from 'next/link';
import { FEATURES, getActiveFeatureSlugs } from '@/lib/features';
import { getArticlesByFeature } from '@/lib/articles';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Features — Long-Form Editorial Columns | Japan Pop Now',
  description:
    'Long-running editorial columns from Japan Pop Now — First-Timers Field Notes, Connectivity Deep Dive, Quiet Pockets of Japan, and more. Multi-article series for anime fans planning deeper Japan trips.',
  alternates: {
    canonical: 'https://japan-pop-now.com/features',
  },
  openGraph: {
    title: 'Features — Long-Form Editorial Columns | Japan Pop Now',
    description:
      'Multi-article editorial columns for anime fans planning deeper Japan trips.',
    type: 'website',
    url: 'https://japan-pop-now.com/features',
    images: [
      {
        url: 'https://japan-pop-now.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Japan Pop Now Features',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features — Long-Form Editorial Columns | Japan Pop Now',
    site: '@pop_now_jp',
  },
};

export default function FeaturesIndexPage() {
  const activeSlugs = getActiveFeatureSlugs();
  const activeFeatures = FEATURES.filter((f) => activeSlugs.includes(f.slug));

  // Compute article count per feature at build time
  const featureData = activeFeatures.map((feature) => ({
    feature,
    articleCount: getArticlesByFeature(feature.slug).length,
  }));

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Features — Japan Pop Now',
            description:
              'Long-running editorial columns for anime fans planning deeper Japan trips.',
            url: 'https://japan-pop-now.com/features',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: activeFeatures.length,
              itemListElement: activeFeatures.map((f, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://japan-pop-now.com/features/${f.slug}`,
                name: f.label,
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
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: '#3b82f6' }}
          >
            Editorial Columns
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#14213d',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Features
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#44403c',
              lineHeight: 1.7,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Long-running editorial series. Each column collects multi-article
            investigations that go deeper than a single guide — playbooks,
            field tests, and slice-of-life locations worth returning to.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureData.map(({ feature, articleCount }) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                style={{
                  background: '#fff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="feature-card hover:shadow-lg"
              >
                <div
                  style={{
                    height: '6px',
                    background: feature.color,
                  }}
                />
                <div style={{ padding: '24px' }}>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: feature.color,
                      marginBottom: '8px',
                    }}
                  >
                    {feature.primaryCategory.replace('-', ' ')}
                  </p>
                  <h2
                    style={{
                      fontFamily:
                        'var(--font-display), "Playfair Display", Georgia, serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#14213d',
                      marginBottom: '8px',
                      lineHeight: 1.25,
                    }}
                  >
                    {feature.label}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: '#57534e',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                    }}
                  >
                    {feature.tagline}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #f5f5f4',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#a8a29e',
                      }}
                    >
                      {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: feature.color,
                      }}
                    >
                      View series →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

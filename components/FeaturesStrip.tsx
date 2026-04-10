import Link from 'next/link';
import { FEATURES, getActiveFeatureSlugs } from '@/lib/features';
import { getArticlesByFeature } from '@/lib/articles';

/**
 * Home page section that teases the Features 5th axis — editorial columns.
 * Orthogonal to the 4 category sections below it.
 * Blue accent (#3b82f6) distinguishes from orange category branding.
 */
export default function FeaturesStrip() {
  const activeSlugs = getActiveFeatureSlugs();
  const activeFeatures = FEATURES.filter((f) => activeSlugs.includes(f.slug));

  // Fail closed: if no active features, render nothing rather than an empty section.
  if (activeFeatures.length === 0) return null;

  const featureData = activeFeatures.map((feature) => {
    const articles = getArticlesByFeature(feature.slug);
    return {
      feature,
      articleCount: articles.length,
      latest: articles[0], // getAllArticles is already date-sorted desc
    };
  });

  return (
    <section style={{ background: '#eff6ff', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              style={{
                width: '4px',
                height: '28px',
                background: '#3b82f6',
                borderRadius: '2px',
                flexShrink: 0,
              }}
            />
            <div>
              <h2
                style={{
                  fontFamily:
                    'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#14213d',
                  lineHeight: 1.2,
                }}
              >
                Features
              </h2>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#57534e',
                  marginTop: '2px',
                }}
              >
                Long-running editorial columns for deeper trips.
              </p>
            </div>
          </div>
          <Link
            href="/features"
            className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1"
            style={{ color: '#3b82f6' }}
          >
            View all
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureData.map(({ feature, articleCount, latest }) => (
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
              className="hover:shadow-lg"
            >
              <div style={{ height: '5px', background: feature.color }} />
              <div style={{ padding: '20px' }}>
                <p
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: feature.color,
                    marginBottom: '6px',
                  }}
                >
                  {feature.primaryCategory.replace('-', ' ')} · {articleCount}{' '}
                  {articleCount === 1 ? 'article' : 'articles'}
                </p>
                <h3
                  style={{
                    fontFamily:
                      'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#14213d',
                    lineHeight: 1.25,
                    marginBottom: '6px',
                  }}
                >
                  {feature.label}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#57534e',
                    lineHeight: 1.5,
                    marginBottom: latest ? '12px' : '0',
                  }}
                >
                  {feature.tagline}
                </p>
                {latest && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#78716c',
                      paddingTop: '10px',
                      borderTop: '1px solid #f5f5f4',
                      lineHeight: 1.4,
                    }}
                  >
                    Latest:{' '}
                    <span style={{ color: '#14213d', fontWeight: 600 }}>
                      {latest.title}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

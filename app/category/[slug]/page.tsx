import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import AdUnit from '@/components/AdUnit';
import AffiliateCTA from '@/components/AffiliateCTA';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

function getCategoryAffiliateCTA(category: { slug: string; label: string }) {
  switch (category.slug) {
    case 'cafes':
      return (
        <AffiliateCTA
          icon="🎫"
          title="Book Anime Cafes with Klook"
          description="Reserve your spot at anime collaboration cafes across Japan with English support and free cancellation on most bookings."
          buttonText="Browse Cafe Experiences"
          href={'https://www.klook.com/en-US/experiences?aff_adid=1251547'}
          program="klook"
          category="cafes"
        />
      );
    case 'destinations':
      return (
        <AffiliateCTA
          icon="⛩️"
          title="Get Your JR Pass"
          description="Reach pilgrimage sites and anime districts across Japan efficiently with the Japan Rail Pass. 7, 14, and 21-day options cover every region."
          buttonText="Compare JR Pass"
          href={'https://www.klook.com/en-US/activity/japan-rail-pass?aff_adid=1251547'}
          program="klook"
          category="destinations"
        />
      );
    case 'experiences':
      return (
        <AffiliateCTA
          icon="🎟️"
          title="Book Anime Experiences in Japan"
          description="Theme parks, pop-ups, DIY workshops, exhibitions plus practical travel essentials — reserve one-of-a-kind experiences with English support."
          buttonText="Browse Experiences"
          href={'https://www.klook.com/en-US/experiences/tokyo?aff_adid=1251547'}
          program="klook"
          category="experiences"
        />
      );
    case 'events':
      return (
        <AffiliateCTA
          icon="📅"
          title="See What's Running This Week"
          description="Time-limited exhibitions, pop-up shops, and seasonal anime events change every week. Check the live calendar for active venues and booking windows."
          buttonText="Open Events Calendar"
          href="/calendar"
          program="klook"
          category="events"
        />
      );
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryUrl = `https://www.japan-pop-now.com/category/${slug}`;

  const articles = getArticlesByCategory(slug);
  const firstWithImage = articles.find((a) => a.featuredImage);

  // Empty categories (events / culture currently) are thin-content liabilities
  // for AdSense and dilute impressions when Google indexes them. Flip to
  // noindex until at least one article lands in the category. follow=true so
  // breadcrumb + Explore Other Categories internal links still pass.
  const categoryIsThin = articles.length === 0;

  return {
    title: { absolute: `${category.label} — Japan Pop Now` },
    description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
    alternates: {
      canonical: categoryUrl,
    },
    robots: categoryIsThin
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
    openGraph: {
      title: `${category.label} — Japan Pop Now`,
      description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
      type: 'website',
      url: categoryUrl,
      images: firstWithImage
        ? [{ url: firstWithImage.featuredImage, width: 1200, height: 630, alt: `${category.label} articles` }]
        : [{ url: 'https://www.japan-pop-now.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.label} — Japan Pop Now`,
      site: '@japanpopnow',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.label, href: `/category/${category.slug}` },
  ];

  return (
    <>
      {/* Structured Data — CollectionPage + ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.label,
            description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
            url: `https://www.japan-pop-now.com/category/${slug}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://www.japan-pop-now.com/articles/${a.slug}`,
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

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
          {category.label}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#44403c', maxWidth: '720px', lineHeight: 1.7 }}>
          {category.description}
        </p>
        {category.editorialIntro && category.editorialIntro.length > 0 ? (
          <div style={{ maxWidth: '780px', marginTop: '1.25rem', fontSize: '0.95rem', color: '#44403c', lineHeight: 1.7 }}>
            {category.editorialIntro.map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: '1rem' }}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#a8a29e' }}>
            {articles.length} articles
          </span>
          {category.hubSlug && (
            <Link
              href={`/guides/${category.hubSlug}`}
              style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}
            >
              View Complete Guide →
            </Link>
          )}
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <AdUnit slot="6666666601" format="leaderboard" lazy />
      </div>

      {/* Contextual Affiliate CTA */}
      {category && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          {getCategoryAffiliateCTA(category)}
        </div>
      )}

      {/* Articles Grid */}
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
              Articles coming soon — we&apos;re working on comprehensive coverage.
            </p>
          </div>
        )}
      </section>

      {/* Cross-category links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#14213d',
              marginBottom: '1rem',
            }}
          >
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="category-strip-link"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                  background: '#fff',
                  color: '#44403c',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {c.label}
              </Link>
            ))}
            <Link
              href="/guides"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fff7ed',
                border: '1px solid #f97316',
                color: '#f97316',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              All Guides →
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

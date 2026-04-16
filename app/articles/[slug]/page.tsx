import { Metadata } from 'next';
import Image from 'next/image';
import ArticleBody from '@/components/ArticleBody';
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
  getAllArticles,
} from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { getArticleSchemaWithSpeakable, getBreadcrumbSchema, getHowToSchema, getEventSchema, getTouristAttractionSchema } from '@/lib/structured-data';
import { getAllEvents } from '@/lib/events';
import { articleUrl as getArticleUrl, absoluteUrl } from '@/lib/url';
import { extractQAFromHeadings, generateFAQSchema } from '@/lib/faq-schema';
import { getContentMetrics } from '@/lib/content-analysis';
import { formatDateFull } from '@/lib/date-utils';
import { extractHeadings } from '@/lib/markdown-utils';
import ArticleCard from '@/components/ArticleCard';
import ScrollProgress from '@/components/ScrollProgress';
import ReadingTime from '@/components/ReadingTime';
import Breadcrumb from '@/components/Breadcrumb';
import Sidebar from '@/components/Sidebar';
import ArticleFooter from '@/components/ArticleFooter';
import NewsletterSignup from '@/components/NewsletterSignup';
import ShareButtons from '@/components/ShareButtons';
import ScrollDepthTracker from '@/components/ScrollDepthTracker';
import dynamic from 'next/dynamic';
import { getBlurPlaceholder } from '@/lib/image-utils';
import { notFound } from 'next/navigation';

const GiscusComments = dynamic(() => import('@/components/GiscusComments'));
const BookmarkButton = dynamic(() => import('@/components/BookmarkButton'));

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const url = getArticleUrl(slug);

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
      languages: {
        'en': url,
        'x-default': url,
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.lastUpdated || article.date,
      authors: [article.author],
      section: article.category,
      tags: article.tags,
      url: url,
      images: article.featuredImage
        ? [{ url: article.featuredImage, width: 1200, height: 630, alt: article.featuredImageAlt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.featuredImage ? [article.featuredImage] : undefined,
      site: '@japanpopnow',
      creator: '@japanpopnow',
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 5);
  const allArticles = getAllArticles();
  const category = CATEGORIES.find((c) => c.slug === article.category);
  const url = getArticleUrl(slug);
  const headings = extractHeadings(article.content);
  const metrics = getContentMetrics(article.content);
  const faqs = extractQAFromHeadings(article.content);

  // Build breadcrumbs with guide hub link if available
  const hubSlug = category?.hubSlug;
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    {
      label: category?.label || 'Articles',
      href: category ? `/category/${category.slug}` : '/',
    },
    ...(hubSlug ? [{ label: 'Guide', href: `/guides/${hubSlug}` }] : []),
    { label: article.title, href: `/articles/${slug}` },
  ];

  // Check if this is a how-to article and extract steps from H2 headings
  const isHowTo = /how.?to|guide/i.test(article.title);
  const h2Headings = headings.filter((h) => h.level === 2);

  const popularArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 5);

  // Latest articles (most recent, excluding current)
  const latestArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 4);

  // Same-category articles for footer circulation
  const categoryArticles = allArticles
    .filter((a) => a.category === article.category && a.slug !== slug)
    .slice(0, 4);

  // Event schemas — only when this article is directly referenced by entries in events.json
  const linkedEvents = getAllEvents().filter((e) => e.articleSlug === slug);

  // TouristAttraction schema — location-centric categories only
  const isLocationGuide =
    article.category === 'area-guides' ||
    article.category === 'anime-pilgrimage' ||
    article.category === 'experiences';
  const inferredLocality = /tokyo/i.test(slug)
    ? 'Tokyo'
    : /osaka/i.test(slug)
    ? 'Osaka'
    : /kyoto/i.test(slug)
    ? 'Kyoto'
    : /kumamoto/i.test(slug)
    ? 'Kumamoto'
    : 'Japan';

  return (
    <>
      <ScrollProgress />
      <ScrollDepthTracker />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getArticleSchemaWithSpeakable(article, url, {
              wordCount: metrics.wordCount,
              readingTime: metrics.readingTimeISO,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema(
            breadcrumbItems.map((item) => ({
              name: item.label,
              url: absoluteUrl(item.href),
            }))
          )),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(faqs)),
          }}
        />
      )}
      {isHowTo && h2Headings.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getHowToSchema(
                article.title,
                article.description,
                h2Headings.map((h) => ({ name: h.text })),
                url,
                article.featuredImage,
              )
            ),
          }}
        />
      )}
      {linkedEvents.map((e) => (
        <script
          key={`event-${e.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getEventSchema(
                e.title,
                e.description,
                e.startDate,
                e.endDate,
                { name: e.venue, address: `${e.city}, ${e.prefecture}` },
                url,
                e.thumbnail,
              )
            ),
          }}
        />
      ))}
      {isLocationGuide && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getTouristAttractionSchema(
                article.title,
                article.description,
                inferredLocality,
                url,
                article.featuredImage,
              )
            ),
          }}
        />
      )}

      <article style={{ background: '#fafaf9' }}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Featured Image — full-width hero */}
        {(article.heroImage || article.featuredImage) && (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: 'clamp(280px, 45vh, 480px)' }}
          >
            <Image
              src={article.heroImage || article.featuredImage}
              alt={article.heroImageAlt || article.featuredImageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={getBlurPlaceholder()}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}
            />
            {article.imageCredit && (
              <span
                className="absolute bottom-2 right-3 text-xs text-white/80"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                {article.imageCredit}
              </span>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <header className="mb-8">
                {category && (
                  <span className="category-pill mb-3 inline-block">{category.label}</span>
                )}

                <h1
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 700,
                    color: '#14213d',
                    lineHeight: 1.2,
                  }}
                >
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: '#78716c' }}>
                  <span>{formatDateFull(article.date)}</span>
                  {article.lastUpdated && article.lastUpdated !== article.date && (
                    <>
                      <span style={{ color: '#d6d3d1' }}>|</span>
                      <span style={{ color: '#f97316', fontWeight: 500 }}>
                        Updated {formatDateFull(article.lastUpdated)}
                      </span>
                    </>
                  )}
                  <span style={{ color: '#d6d3d1' }}>|</span>
                  <span>
                    By <a href="/about" style={{ color: '#14213d', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{article.author}</a>
                  </span>
                  <span style={{ color: '#d6d3d1' }}>|</span>
                  <ReadingTime content={article.content} />
                </div>

                {/* Share Buttons + Bookmark — top of article */}
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <ShareButtons url={url} title={article.title} />
                  <BookmarkButton slug={slug} title={article.title} />
                </div>
              </header>

              {/* Article Body — with auto-inserted ads + affiliate CTAs */}
              <div
                className="mb-8 rounded-xl p-6 md:p-8"
                style={{ background: '#fff', border: '1px solid #e7e5e4' }}
              >
                <ArticleBody
                  content={article.content}
                  category={article.category}
                  slug={slug}
                  relatedSuggestions={relatedArticles.map(a => ({ slug: a.slug, title: a.title }))}
                />
              </div>

              {/* Newsletter CTA */}
              <NewsletterSignup />

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div style={{ width: '4px', height: '24px', background: '#f97316', borderRadius: '2px' }} />
                    <h2
                      style={{
                        fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#14213d',
                      }}
                    >
                      You Might Also Like
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {relatedArticles.map((a) => (
                      <ArticleCard key={a.slug} article={a} size="sm" />
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom Share Buttons */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid #e7e5e4' }}>
                <ShareButtons url={url} title={article.title} />
              </div>

              {/* Article Footer — circulation design */}
              <ArticleFooter
                author={article.author}
                relatedArticles={relatedArticles}
                categoryArticles={categoryArticles}
                crossCategoryArticles={[]}
                category={article.category}
              />

              {/* Comments */}
              <GiscusComments slug={slug} />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky" style={{ top: '80px' }}>
                <Sidebar
                  headings={headings}
                  popularArticles={popularArticles}
                  latestArticles={latestArticles}
                  currentCategory={article.category}
                />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}

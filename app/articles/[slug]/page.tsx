import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
  CATEGORIES,
  getAllArticles,
} from '@/lib/articles';
import { getArticleSchemaWithSpeakable, getBreadcrumbSchema } from '@/lib/structured-data';
import { extractQAFromHeadings, generateFAQSchema } from '@/lib/faq-schema';
import { getContentMetrics } from '@/lib/content-analysis';
import { formatDateFull } from '@/lib/date-utils';
import { extractHeadings } from '@/lib/markdown-utils';
import ArticleCard from '@/components/ArticleCard';
import AdUnit from '@/components/AdUnit';
import ScrollProgress from '@/components/ScrollProgress';
import ReadingTime from '@/components/ReadingTime';
import Breadcrumb from '@/components/Breadcrumb';
import Sidebar from '@/components/Sidebar';
import ArticleFooter from '@/components/ArticleFooter';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage,
              alt: article.featuredImageAlt,
            },
          ]
        : undefined,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(params.slug, 3);
  const allArticles = getAllArticles();
  const category = CATEGORIES.find((c) => c.slug === article.category);
  const articleUrl = `https://japan-pop-now.com/articles/${params.slug}`;
  const headings = extractHeadings(article.content);

  // Get content metrics for AIEO
  const metrics = getContentMetrics(article.content);
  const faqs = extractQAFromHeadings(article.content);

  // Breadcrumb data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    {
      label: category?.label || 'Articles',
      href: category ? `/category/${category.slug}` : '/',
    },
    { label: article.title, href: `/articles/${params.slug}` },
  ];

  // Get popular articles for sidebar
  const popularArticles = allArticles
    .filter((a) => a.slug !== params.slug)
    .slice(0, 5);

  return (
    <>
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Structured Data - Article with Speakable */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getArticleSchemaWithSpeakable(article, articleUrl, {
              wordCount: metrics.wordCount,
              readingTime: metrics.readingTimeISO,
            })
          ),
        }}
      />

      {/* Structured Data - Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema(
            breadcrumbItems.map((item) => ({
              name: item.label,
              url: `https://japan-pop-now.com${item.href}`,
            }))
          )),
        }}
      />

      {/* Structured Data - FAQ (if headings detected) */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(faqs)),
          }}
        />
      )}

      <article className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="w-full h-96 relative">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <header className="mb-8">
                {category && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold mb-4"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.label}
                  </div>
                )}

                <h1 className="text-4xl font-bold text-[#1a1f36] mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600">
                  <span>{formatDateFull(article.date)}</span>
                  <span>By {article.author}</span>
                  <ReadingTime content={article.content} />
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg mb-8">
                <MDXRemote source={article.content} />
              </div>

              {/* Ad Unit in Content */}
              <div className="ad-break my-12">
                <AdUnit slot="5555555555" format="leaderboard" className="justify-center" />
              </div>

              {/* Bottom Ad Unit */}
              <div className="ad-break my-12">
                <AdUnit slot="6666666666" format="rectangle" className="justify-center" />
              </div>

              {/* Article Footer */}
              <ArticleFooter
                author={article.author}
                relatedArticles={relatedArticles}
                category={article.category}
              />
            </div>

            {/* Sidebar - 1 column */}
            <aside className="lg:col-span-1">
              <Sidebar
                headings={headings}
                popularArticles={popularArticles}
                currentCategory={article.category}
              />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}

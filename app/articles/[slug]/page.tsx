import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
  CATEGORIES,
} from '@/lib/articles';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/structured-data';
import { formatDateFull } from '@/lib/date-utils';
import ArticleCard from '@/components/ArticleCard';
import AdUnit from '@/components/AdUnit';
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
  const category = CATEGORIES.find((c) => c.slug === article.category);
  const articleUrl = `https://japan-pop-now.com/articles/${params.slug}`;

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: 'https://japan-pop-now.com' },
    {
      name: category?.label || 'Articles',
      url: category
        ? `https://japan-pop-now.com/category/${category.slug}`
        : 'https://japan-pop-now.com',
    },
    { name: article.title, url: articleUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getArticleSchema(article, articleUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <article className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.url} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-400">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-[#1a1f36]">{crumb.name}</span>
                ) : (
                  <Link href={crumb.url} className="hover:text-[#c2185b]">
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
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

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{formatDateFull(article.date)}</span>
                  <span>By {article.author}</span>
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

              {/* Related Articles at Bottom */}
              {relatedArticles.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((related) => (
                      <ArticleCard
                        key={related.slug}
                        article={related}
                        size="sm"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <aside className="lg:col-span-1">
              {/* Related Articles Sidebar */}
              {relatedArticles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-[#1a1f36] mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.slice(0, 3).map((related) => (
                      <Link
                        key={related.slug}
                        href={`/articles/${related.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-semibold text-[#1a1f36] group-hover:text-[#c2185b] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(related.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Link */}
              {category && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-[#1a1f36] mb-4">
                    Category
                  </h3>
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-2 text-[#c2185b] hover:opacity-80 transition-opacity"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-semibold">{category.label}</span>
                  </Link>
                </div>
              )}

              {/* Popular Tags */}
              {article.tags.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#1a1f36] mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#c2185b] transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}

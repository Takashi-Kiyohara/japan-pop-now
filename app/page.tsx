import { getAllArticles, CATEGORIES } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import AdUnit from '@/components/AdUnit';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  const allArticles = getAllArticles();

  // Split articles into sections
  const featuredArticles = allArticles.slice(0, 2);
  const trendingArticles = allArticles.slice(2, 5);
  const latestArticles = allArticles.slice(5, 11);

  const SectionHeader = ({
    title,
    viewAllHref,
  }: {
    title: string;
    viewAllHref?: string;
  }) => (
    <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[#1a1f36]">
      <h2 className="text-3xl font-bold text-[#1a1f36]">{title}</h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-[#c2185b] hover:opacity-80 transition-opacity font-semibold"
        >
          View All →
        </Link>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero Section - Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.length > 0 ? (
            featuredArticles.map((article) => (
              <div key={article.slug} className="h-80">
                <ArticleCard article={article} size="lg" />
              </div>
            ))
          ) : (
            <>
              <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            </>
          )}
        </div>
      </section>

      {/* Browse by Interest Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader title="Browse by Interest" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => {
            const categoryArticles = allArticles.filter(
              (a) => a.category === category.slug
            );
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="p-4 border-2 border-transparent hover:border-[#c2185b] rounded-lg transition-colors group"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-bold text-[#1a1f36] mb-1 group-hover:text-[#c2185b]">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {categoryArticles.length} articles
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad Unit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot="1234567890" format="leaderboard" className="py-4" />
      </section>

      {/* Trending Now Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader title="Trending Now" viewAllHref="/#trending" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingArticles.length > 0 ? (
            trendingArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="md" />
            ))
          ) : (
            <>
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            </>
          )}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader title="Latest Articles" viewAllHref="/articles" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.length > 0 ? (
            latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="md" />
            ))
          ) : (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"
                />
              ))}
            </>
          )}
        </div>
      </section>

      {/* Bottom Ad Unit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot="9876543210" format="leaderboard" className="py-4" />
      </section>
    </div>
  );
}

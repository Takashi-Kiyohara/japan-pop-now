import { Metadata } from 'next';
import { CATEGORIES, getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryUrl = `https://japan-pop-now.com/category/${params.slug}`;

  return {
    title: `${category.label} — Japan Pop Now`,
    description: `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now — your guide to Japan's anime and pop culture scene.`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${category.label} — Japan Pop Now`,
      description: `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
      type: 'website',
      url: categoryUrl,
    },
    twitter: {
      card: 'summary',
      title: `${category.label} — Japan Pop Now`,
      site: '@japanpopnow',
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section
        className="relative py-16 text-white"
        style={{
          backgroundColor: category.color,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold mb-4">{category.label}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover all our articles about {category.label.toLowerCase()}. Your
            ultimate guide to Japan's pop culture scene.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-gray-600 text-lg">
              No articles found in this category yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

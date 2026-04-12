import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import {
  getFeatureBySlug,
  getActiveFeatureSlugs,
} from '@/lib/features';
import { getAllArticles } from '@/lib/articles';

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getActiveFeatureSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    return { title: 'Series Not Found' };
  }

  const ogImage = feature.cover
    ? feature.cover.startsWith('http')
      ? feature.cover
      : `https://japan-pop-now.com${feature.cover}`
    : 'https://japan-pop-now.com/og-default.jpg';

  return {
    title: `${feature.title} | Japan Pop Now`,
    description: feature.description,
    openGraph: {
      title: feature.title,
      description: feature.description,
      images: [{ url: ogImage }],
    },
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature || !feature.active) {
    notFound();
  }

  const allArticles = getAllArticles();
  const articles = allArticles.filter((a) =>
    feature.tags.some((tag) => a.tags?.includes(tag))
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">{feature.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {feature.description}
        </p>
        <p className="text-sm text-gray-500 mt-2">{articles.length} articles in this series</p>
      </header>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found for this series yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}

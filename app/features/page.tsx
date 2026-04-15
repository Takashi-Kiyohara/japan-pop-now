import { Metadata } from 'next';
import Link from 'next/link';
import { FEATURES, type Feature } from '@/lib/features';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Feature Series | Japan Pop Now',
  description:
    'Curated article series covering collab cafes, pilgrimage routes, Tokyo districts, and travel essentials for Japan pop culture fans.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/features',
  },
};

export default function FeaturesPage() {
  const allArticles = getAllArticles();

  const featuresWithCounts = FEATURES.filter((f) => f.active).map((f) => {
    const count = allArticles.filter((a) =>
      f.tags.some((tag) => a.tags?.includes(tag))
    ).length;
    return { ...f, articleCount: count };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Feature Series | Japan Pop Now',
    description: metadata.description,
    url: 'https://www.japan-pop-now.com/features',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: featuresWithCounts.map(
        (f: Feature & { articleCount: number }, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://www.japan-pop-now.com/features/${f.slug}`,
          name: f.title,
        })
      ),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-3">Feature Series</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Curated article collections on the topics that matter most to Japan
          pop culture visitors.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {featuresWithCounts.map((f) => (
            <Link
              key={f.slug}
              href={`/features/${f.slug}`}
              className="block rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-pink-500 dark:hover:border-pink-400 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{f.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {f.description}
              </p>
              <span className="text-xs text-gray-500">
                {f.articleCount} {f.articleCount === 1 ? 'article' : 'articles'}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

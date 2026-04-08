import { ArticleMeta } from '@/lib/articles';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  articles: ArticleMeta[];
  title?: string;
}

export default function RelatedArticles({
  articles,
  title = 'Related Articles',
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-[#1a1f36] mb-6 pb-4 border-b-2 border-[#1a1f36]">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} size="md" />
        ))}
      </div>
    </section>
  );
}

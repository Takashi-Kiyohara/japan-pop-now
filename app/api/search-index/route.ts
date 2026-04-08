import { getAllArticles } from '@/lib/articles';

export async function GET() {
  try {
    const articles = getAllArticles();

    const searchIndex = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
    }));

    return Response.json(searchIndex);
  } catch (error) {
    console.error('Failed to generate search index:', error);
    return Response.json(
      { error: 'Failed to generate search index' },
      { status: 500 }
    );
  }
}

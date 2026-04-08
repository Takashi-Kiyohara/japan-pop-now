import Link from 'next/link';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import RelatedArticles from './RelatedArticles';
import NewsletterSignup from './NewsletterSignup';

interface ArticleFooterProps {
  author: string;
  relatedArticles: ArticleMeta[];
  category: string;
}

export default function ArticleFooter({
  author,
  relatedArticles,
  category,
}: ArticleFooterProps) {
  const categoryData = CATEGORIES.find((c) => c.slug === category);

  return (
    <footer className="mt-12 pt-12 border-t border-gray-200">
      {/* Author Bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#c2185b] to-[#e91e63] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {author[0]}
          </div>
          <div>
            <h3 className="font-bold text-[#1a1f36]">{author}</h3>
            <p className="text-sm text-gray-600">
              Your guide to Japan's anime and pop culture scene
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} title="Keep Reading" />
      )}

      {/* Newsletter */}
      <NewsletterSignup />

      {/* More in Category */}
      {categoryData && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href={`/category/${categoryData.slug}`}
            className="inline-flex items-center gap-2 text-[#c2185b] hover:opacity-80 transition-opacity font-semibold"
          >
            <span className="text-2xl">{categoryData.icon}</span>
            <span>More in {categoryData.label} →</span>
          </Link>
        </div>
      )}
    </footer>
  );
}

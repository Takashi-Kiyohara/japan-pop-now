import Link from 'next/link';
import { ArticleMeta, CATEGORIES } from '@/lib/articles';
import TableOfContents from './TableOfContents';
import NewsletterSignup from './NewsletterSignup';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface SidebarProps {
  headings: Heading[];
  popularArticles: ArticleMeta[];
  currentCategory?: string;
}

export default function Sidebar({
  headings,
  popularArticles,
  currentCategory,
}: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <TableOfContents headings={headings} />
        </div>
      )}

      {/* Popular Articles */}
      {popularArticles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#1a1f36] mb-4">Popular</h3>
          <ul className="space-y-3">
            {popularArticles.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-sm font-semibold text-[#1a1f36] hover:text-[#c2185b] transition-colors line-clamp-2 block"
                >
                  {article.title}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Links */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#1a1f36] mb-4">Categories</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-[#c2185b] text-white'
                      : 'text-gray-600 hover:text-[#c2185b]'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <NewsletterSignup compact={true} />
    </aside>
  );
}

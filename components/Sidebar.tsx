import Link from 'next/link';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
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
    <aside className="space-y-6">
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
          <TableOfContents headings={headings} />
        </div>
      )}

      {/* Popular Articles */}
      {popularArticles.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
          <h3
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#14213d',
            }}
          >
            Popular Articles
          </h3>
          <ul className="space-y-3">
            {popularArticles.slice(0, 5).map((article, i) => (
              <li key={article.slug} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#fff7ed', color: '#f97316' }}
                >
                  {i + 1}
                </span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-sm font-medium line-clamp-2 transition-colors leading-snug"
                  style={{ color: '#44403c' }}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Links */}
      <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
        <h3
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#14213d',
          }}
        >
          Categories
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{
                    background: isActive ? '#fff7ed' : 'transparent',
                    color: isActive ? '#ea580c' : '#78716c',
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Newsletter CTA */}
      <NewsletterSignup compact />
    </aside>
  );
}

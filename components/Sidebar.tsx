import Link from 'next/link';
import { Coffee, MapPin, Map, Compass } from 'lucide-react';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import TableOfContents from './TableOfContents';
import NewsletterSignup from './NewsletterSignup';
import AdUnit from './AdUnit';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Coffee, MapPin, Map, Compass,
};

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface SidebarProps {
  headings: Heading[];
  popularArticles: ArticleMeta[];
  latestArticles?: ArticleMeta[];
  currentCategory?: string;
}

function SidebarSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
      {title && (
        <h3
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#14213d',
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function ArticleListItem({
  article,
  index,
  showNumber,
}: {
  article: ArticleMeta;
  index: number;
  showNumber?: boolean;
}) {
  const category = CATEGORIES.find((c) => c.slug === article.category);

  return (
    <li className="flex gap-3 items-start">
      {showNumber && (
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#fff7ed', color: '#f97316' }}
        >
          {index + 1}
        </span>
      )}
      <div className="min-w-0">
        {category && (
          <span style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {category.label}
          </span>
        )}
        <Link
          href={`/articles/${article.slug}`}
          className="block text-sm font-medium line-clamp-2 transition-colors leading-snug"
          style={{ color: '#44403c' }}
        >
          {article.title}
        </Link>
      </div>
    </li>
  );
}

export default function Sidebar({
  headings,
  popularArticles,
  latestArticles,
  currentCategory,
}: SidebarProps) {
  return (
    <aside className="space-y-5">
      {/* ── Ad Slot Top ── */}
      <AdUnit slot="8888888801" format="rectangle" lazy />

      {/* ── Table of Contents ── */}
      {headings.length > 0 && (
        <SidebarSection>
          <TableOfContents headings={headings} />
        </SidebarSection>
      )}

      {/* ── Popular in Category ── */}
      {popularArticles.length > 0 && (
        <SidebarSection title={currentCategory ? `Top in ${CATEGORIES.find(c => c.slug === currentCategory)?.label || 'Category'}` : 'Popular Articles'}>
          <ul className="space-y-3">
            {(currentCategory
              ? popularArticles.filter(a => a.category === currentCategory).slice(0, 5)
              : popularArticles.slice(0, 5)
            ).map((article, i) => (
              <ArticleListItem key={article.slug} article={article} index={i} showNumber />
            ))}
          </ul>
        </SidebarSection>
      )}

      {/* ── Latest Articles ── */}
      {latestArticles && latestArticles.length > 0 && (
        <SidebarSection title="Latest">
          <ul className="space-y-3">
            {latestArticles.slice(0, 4).map((article, i) => (
              <ArticleListItem key={article.slug} article={article} index={i} />
            ))}
          </ul>
        </SidebarSection>
      )}

      {/* ── Categories ── */}
      <SidebarSection title="Categories">
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
                  {ICON_MAP[category.lucideIcon] ? (() => {
                    const Icon = ICON_MAP[category.lucideIcon];
                    return <Icon size={15} />;
                  })() : <span>{category.icon}</span>}
                  <span>{category.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </SidebarSection>

      {/* ── Ad Slot Bottom ── */}
      <AdUnit slot="8888888802" format="rectangle" lazy />

      {/* ── Newsletter CTA ── */}
      <NewsletterSignup compact />
    </aside>
  );
}

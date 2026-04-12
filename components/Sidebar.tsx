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
  // Popular tags derived from articles (top 12 by frequency)
  const tagFreq: Record<string, number> = {};
  popularArticles.forEach((a) => a.tags.forEach((t) => { tagFreq[t] = (tagFreq[t] || 0) + 1; }));
  const popularTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag);

  return (
    <aside className="space-y-5" style={{ position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '2px' }}>
      {/* ── Table of Contents (FIRST — stays visible longest) ── */}
      {headings.length > 0 && (
        <SidebarSection>
          <TableOfContents headings={headings} />
        </SidebarSection>
      )}

      {/* ── Ad Slot Top ── */}
      <AdUnit slot="8888888801" format="rectangle" lazy />

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

      {/* ── Popular Tags ── */}
      {popularTags.length > 0 && (
        <SidebarSection title="Popular Topics">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#44403c',
                  background: '#f5f5f4',
                  border: '1px solid #e7e5e4',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#fff7ed';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#ea580c';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#fb923c';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#f5f5f4';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#44403c';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e7e5e4';
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </SidebarSection>
      )}

      {/* ── Ad Slot Bottom ── */}
      <AdUnit slot="8888888802" format="rectangle" lazy />

      {/* ── Newsletter CTA ── */}
      <NewsletterSignup compact />
    </aside>
  );
}

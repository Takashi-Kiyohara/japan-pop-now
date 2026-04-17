import Link from 'next/link';
import { Coffee, MapPin, Map, Sparkles, Compass, Tag, type LucideIcon } from 'lucide-react';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from './ArticleCard';
import AdUnit from './AdUnit';
import AuthorBox from './AuthorBox';
import ReadNext from './ReadNext';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  MapPin,
  Map,
  Sparkles,
  Compass,
};

function iconFor(lucideName?: string): LucideIcon {
  if (lucideName && CATEGORY_ICON_MAP[lucideName]) return CATEGORY_ICON_MAP[lucideName];
  return Tag;
}

interface ArticleFooterProps {
  relatedArticles: ArticleMeta[];
  categoryArticles: ArticleMeta[];
  crossCategoryArticles: ArticleMeta[];
  category: string;
}

export default function ArticleFooter({
  relatedArticles,
  categoryArticles,
  category,
}: ArticleFooterProps) {
  const categoryData = CATEGORIES.find((c) => c.slug === category);

  return (
    <footer className="mt-12">
      {/* ── Read Next ── */}
      <ReadNext
        relatedArticles={relatedArticles}
        categoryArticles={categoryArticles}
        currentCategory={category}
      />

      {/* ── Author Bio ── */}
      <div className="mb-10">
        <AuthorBox variant="full" />
      </div>

      {/* ── Ad — between author and circulation ── */}
      <div className="mb-10">
        <AdUnit slot="9999999901" format="leaderboard" lazy />
      </div>

      {/* ── More in [Category] ── */}
      {categoryArticles.length > 0 && categoryData && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div style={{ width: '4px', height: '24px', background: '#f97316', borderRadius: '2px' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#14213d',
                }}
              >
                {(() => {
                  const Icon = iconFor(categoryData.lucideIcon);
                  return <Icon size={20} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: '6px' }} />;
                })()}
                More in {categoryData.label}
              </h2>
            </div>
            <Link
              href={`/category/${categoryData.slug}`}
              className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1"
              style={{ color: '#f97316' }}
            >
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} size="sm" variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* ── Explore Other Topics (removed — duplicates footer Categories nav) ── */}

      {/* ── Ad — bottom ── */}
      <div className="mb-10">
        <AdUnit slot="9999999902" format="leaderboard" lazy />
      </div>

      {/* ── Category Navigation Strip ── */}
      <section
        className="rounded-xl p-6"
        style={{ background: '#14213d' }}
      >
        <p
          className="text-center mb-4"
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#fff',
          }}
        >
          Browse All Categories
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = iconFor(cat.lucideIcon);
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                style={{
                  background: cat.slug === category ? '#f97316' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: cat.slug === category ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Icon size={14} />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>
    </footer>
  );
}

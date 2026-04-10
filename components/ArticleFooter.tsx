import Link from 'next/link';
import { Coffee, MapPin, Map, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from './ArticleCard';
import AdUnit from './AdUnit';
import ReadNext from './ReadNext';

const ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  MapPin,
  Map,
  Compass,
};

interface ArticleFooterProps {
  author: string;
  relatedArticles: ArticleMeta[];
  categoryArticles: ArticleMeta[];
  crossCategoryArticles: ArticleMeta[];
  category: string;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div style={{ width: '4px', height: '24px', background: '#f97316', borderRadius: '2px' }} />
      <h2
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#14213d',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function ArticleFooter({
  author,
  relatedArticles,
  categoryArticles,
  crossCategoryArticles,
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
      <div
        className="rounded-xl p-5 mb-10"
        style={{ background: '#fff', border: '1px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-4">
          <a
            href="/about"
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ background: 'linear-gradient(135deg, #f97316, #e63946)' }}
          >
            {author[0]}
          </a>
          <div>
            <a
              href="/about"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontWeight: 700,
                color: '#14213d',
                fontSize: '1rem',
              }}
            >
              {author}
            </a>
            <p style={{ color: '#78716c', fontSize: '0.85rem', lineHeight: 1.5, marginTop: '2px' }}>
              Japan-based writer covering anime pop culture, collab cafes, and travel for international visitors.
            </p>
          </div>
        </div>
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
                  const Icon = ICON_MAP[categoryData.lucideIcon];
                  return Icon ? <Icon size={20} className="inline mr-2 align-middle" strokeWidth={1.8} /> : null;
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

      {/* ── Explore Other Topics ── */}
      {crossCategoryArticles.length > 0 && (
        <section className="mb-12">
          <SectionTitle title="Explore Other Topics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crossCategoryArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} size="sm" />
            ))}
          </div>
        </section>
      )}

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
          Continue Exploring
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.lucideIcon];
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: cat.slug === category ? '#f97316' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: cat.slug === category ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {Icon && <Icon size={14} strokeWidth={1.8} />}
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ArticleMeta } from '@/lib/articles';

const DAY = 86_400_000;

type Status = 'new' | 'updated' | null;

function deriveStatus(a: ArticleMeta, today = Date.now()): Status {
  const published = new Date(a.date).getTime();
  if (Number.isFinite(published) && today - published <= 14 * DAY) return 'new';
  if (a.lastUpdated && a.lastUpdated !== a.date) {
    const updated = new Date(a.lastUpdated).getTime();
    if (Number.isFinite(updated) && today - updated <= 30 * DAY) return 'updated';
  }
  return null;
}

function readMinutes(a: ArticleMeta): number {
  // Approximate: ~50 chars/min reading equivalent (excerpt is ~1/10 of body)
  const len = a.excerpt?.length ?? 0;
  return Math.max(3, Math.min(15, Math.ceil(len / 50)));
}

const STATUS_STYLES: Record<NonNullable<Status>, { label: string; bg: string }> = {
  new: { label: 'New', bg: 'bg-emerald-500' },
  updated: { label: 'Updated', bg: 'bg-brand-teal' },
};

interface Props {
  article: ArticleMeta;
}

const ArticleCardV2 = React.memo(function ArticleCardV2({ article }: Props) {
  const status = deriveStatus(article);
  const ipChip = article.tags?.[0];
  const minutes = readMinutes(article);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block h-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
        {article.imageList || article.featuredImage ? (
          <Image
            src={article.imageList || article.featuredImage!}
            alt={article.featuredImageAlt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-teal opacity-50" />
        )}

        {/* Status badge top-left */}
        {status && (
          <span
            className={`absolute top-3 left-3 ${STATUS_STYLES[status].bg} text-white text-[0.65rem] font-bold uppercase tracking-wider rounded-full px-2 py-1 shadow`}
          >
            {STATUS_STYLES[status].label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {ipChip && (
            <span className="rounded-full bg-brand-teal text-white text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-1">
              {ipChip.replace(/-/g, ' ')}
            </span>
          )}
          <span className="text-xs text-stone-500 font-medium">{minutes} min read</span>
        </div>
        <h3
          className="font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-brand-orange transition-colors"
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1.05rem',
          }}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
});

export default ArticleCardV2;

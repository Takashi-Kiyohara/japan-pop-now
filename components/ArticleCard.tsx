import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { formatDate } from '@/lib/date-utils';

type CardSize = 'sm' | 'md' | 'lg';
type CardVariant = 'default' | 'featured' | 'horizontal';

interface ArticleCardProps {
  article: ArticleMeta;
  size?: CardSize;
  variant?: CardVariant;
}

const imageHeights: Record<CardSize, string> = {
  sm: '200px',
  md: '220px',
  lg: '380px',
};

const ArticleCard = React.memo(function ArticleCard({
  article,
  size = 'md',
  variant = 'default',
}: ArticleCardProps) {
  const category = CATEGORIES.find((c) => c.slug === article.category);
  const imgH = imageHeights[size];

  // ── Horizontal card ───────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/articles/${article.slug}`} className="article-card-horizontal group block h-full">
        <article className="flex gap-4 h-full p-3.5 rounded-xl border border-[#e7e5e4] bg-white transition-shadow duration-200 hover:shadow-lg">
          {/* Thumbnail */}
          <div className="flex-shrink-0 rounded-lg overflow-hidden relative" style={{ width: '90px', height: '90px', background: '#e7e5e4' }}>
            {(article.imageList || article.featuredImage) && (
              <Image
                src={article.imageList || article.featuredImage!}
                alt={article.featuredImageAlt || article.title}
                fill
                className="object-cover transition-transform duration-400 group-hover:scale-105"
                sizes="90px"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between min-w-0">
            {category && (
              <span className="category-pill mb-1.5">{category.label}</span>
            )}
            <h3
              className="line-clamp-2 font-semibold leading-snug group-hover:opacity-70 transition-opacity"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '0.95rem',
                color: '#14213d',
              }}
            >
              {article.title}
            </h3>
            <p className="text-xs mt-2" style={{ color: '#78716c' }}>
              {formatDate(article.date)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // ── Default / Featured card ───────────────────────────────────
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article
        className="h-full overflow-hidden rounded-xl border border-[#e7e5e4] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Image */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: imgH, background: '#e7e5e4' }}
        >
          {(article.imageList || article.featuredImage) ? (
            <Image
              src={article.imageList || article.featuredImage!}
              alt={article.featuredImageAlt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={size === 'lg' ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
            />
          ) : (
            <div
              className="w-full h-full opacity-40"
              style={{ background: 'linear-gradient(135deg, #14213d 0%, #e63946 100%)' }}
            />
          )}

          {/* Category badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="category-pill">{category.label}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: size === 'lg' ? '20px 24px 24px' : '14px 16px 18px' }}>
          <h3
            className="group-hover:opacity-70 transition-opacity mb-2.5"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: size === 'lg' ? '1.4rem' : size === 'md' ? '1.1rem' : '1rem',
              fontWeight: 700,
              color: '#14213d',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.title}
          </h3>

          {(size === 'md' || size === 'lg') && article.excerpt && (
            <p
              className="line-clamp-2 mb-3"
              style={{ fontSize: '0.875rem', color: '#78716c', lineHeight: 1.6 }}
            >
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 500 }}>
              {formatDate(article.date)}
            </span>
            <span
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#f97316' }}
            >
              Read
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default ArticleCard;

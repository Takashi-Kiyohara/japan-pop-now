'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleMeta } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';

interface FeaturedCarouselProps {
  articles: ArticleMeta[];
}

export default function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % articles.length);
  }, [articles.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + articles.length) % articles.length);
  }, [articles.length]);

  // Auto-rotate every 6 seconds, pause on hover
  useEffect(() => {
    if (isHovered || articles.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isHovered, next, articles.length]);

  if (!articles.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-[#14213d]"
      style={{ height: 'clamp(300px, 50vh, 560px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {articles.map((article, i) => {
        const category = CATEGORIES.find((c) => c.slug === article.category);
        return (
          <div
            key={article.slug}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
          >
            {/* Background Image */}
            {article.featuredImage ? (
              <Image
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, #14213d 0%, #e63946 100%)`,
                }}
              />
            )}

            {/* Gradient overlay — fades bottom to dark */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)',
              }}
            />

            {/* Text Content — MATCHA style: positioned at bottom-left */}
            <Link href={`/articles/${article.slug}`} className="absolute inset-0 flex flex-col justify-end">
              <div className="px-6 pb-12 md:px-12 md:pb-14 max-w-3xl">
                {/* Category kicker */}
                {category && (
                  <span
                    className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                    style={{ background: '#fb923c', color: '#fff' }}
                  >
                    {category.label}
                  </span>
                )}

                {/* Headline */}
                <h2
                  className="text-white font-bold leading-tight mb-4"
                  style={{
                    fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                  }}
                >
                  {article.title}
                </h2>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl">
                    {article.excerpt}
                  </p>
                )}

                {/* Read More CTA */}
                <div className="mt-5">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/50 px-5 py-2.5 rounded-full hover:bg-white hover:text-[#14213d] transition-all duration-200"
                  >
                    Read Article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous article"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next article"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 right-6 z-20 flex gap-1.5">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? '#fb923c' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

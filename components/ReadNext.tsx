import Link from 'next/link';
import { ArticleMeta } from '@/lib/articles';
import Image from 'next/image';

interface ReadNextProps {
  relatedArticles?: ArticleMeta[];
  categoryArticles?: ArticleMeta[];
  currentCategory: string;
}

export default function ReadNext({
  relatedArticles = [],
  categoryArticles = [],
  currentCategory,
}: ReadNextProps) {
  // Prefer first related article, or fall back to first category article
  const nextArticle = relatedArticles && relatedArticles.length > 0 ? relatedArticles[0] : categoryArticles?.[0];

  if (!nextArticle) {
    return null;
  }

  return (
    <div className="my-10 not-prose">
      <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#ea580c' }}>
        Read Next
      </p>

      <Link href={`/articles/${nextArticle.slug}`} className="block group">
          <div
            className="rounded-lg overflow-hidden transition-transform group-hover:scale-105"
            style={{
              background: '#fff',
              border: '1px solid #e7e5e4',
            }}
          >
            {/* Image section */}
            {nextArticle.featuredImage && (
              <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                <Image
                  src={nextArticle.featuredImage}
                  alt={nextArticle.featuredImageAlt || nextArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content section */}
            <div className="p-6">
              {/* Category pill */}
              {nextArticle.category && (
                <div className="mb-3 inline-block">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(249,115,22,0.1)',
                      color: '#ea580c',
                    }}
                  >
                    {nextArticle.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3
                className="font-semibold mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors"
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.2rem',
                  color: '#14213d',
                }}
              >
                {nextArticle.title}
              </h3>

              {/* Excerpt */}
              {nextArticle.excerpt && (
                <p className="text-sm mb-4 text-gray-600 line-clamp-2">
                  {nextArticle.excerpt}
                </p>
              )}

              {/* CTA */}
              <div className="flex items-center gap-2" style={{ color: '#f97316' }}>
                <span className="text-sm font-semibold">Continue reading</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
      </Link>
    </div>
  );
}

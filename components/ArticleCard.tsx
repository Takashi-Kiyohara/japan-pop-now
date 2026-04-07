import Link from 'next/link';
import Image from 'next/image';
import { ArticleMeta, CATEGORIES } from '@/lib/articles';
import { formatDate } from '@/lib/date-utils';

type CardSize = 'sm' | 'md' | 'lg';

interface ArticleCardProps {
  article: ArticleMeta;
  size?: CardSize;
}

const sizeClasses: Record<CardSize, string> = {
  sm: 'h-64',
  md: 'h-80',
  lg: 'h-96',
};

export default function ArticleCard({
  article,
  size = 'md',
}: ArticleCardProps) {
  const category = CATEGORIES.find(
    (c) => c.slug === article.category
  );

  const heightClass = sizeClasses[size];

  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="group h-full cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image Container */}
        <div className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300`}>
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#c2185b] to-[#1976d2] opacity-30" />
          )}

          {/* Category Badge */}
          {category && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: category.color }}
            >
              {category.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#1a1f36] line-clamp-2 mb-2 group-hover:text-[#c2185b] transition-colors">
            {article.title}
          </h3>

          {/* Excerpt - only show on md/lg */}
          {(size === 'md' || size === 'lg') && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}

          {/* Date */}
          <p className="text-xs text-gray-500">
            {formatDate(article.date)}
          </p>
        </div>
      </article>
    </Link>
  );
}

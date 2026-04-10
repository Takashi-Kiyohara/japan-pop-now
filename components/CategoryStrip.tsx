'use client';

import Link from 'next/link';
import { Coffee, MapPin, Map, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

const ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  MapPin,
  Map,
  Compass,
};

interface CategoryStripProps {
  articleCounts: Record<string, number>;
}

export default function CategoryStrip({ articleCounts }: CategoryStripProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((category) => {
        const IconComponent = ICON_MAP[category.lucideIcon];
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="category-strip-link flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-150"
            style={{
              background: '#f5f5f4',
              border: '1px solid #e7e5e4',
              color: '#44403c',
            }}
          >
            {IconComponent && <IconComponent size={16} strokeWidth={1.8} />}
            <span>{category.label}</span>
            <span
              className="text-xs rounded-full px-1.5 py-0.5"
              style={{ background: '#e7e5e4', color: '#78716c', fontWeight: 500 }}
            >
              {articleCounts[category.slug] ?? 0}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

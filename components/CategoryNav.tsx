'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, MapPin, Map, Compass } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Coffee,
  MapPin,
  Map,
  Compass,
};

interface CategoryNavProps {
  articleCounts?: Record<string, number>;
}

export default function CategoryNav({ articleCounts }: CategoryNavProps) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    return pathname.includes(`/category/${slug}`);
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
      <div className="flex gap-3 pb-2 min-w-min">
        {CATEGORIES.map((category) => {
          const count = articleCounts?.[category.slug] || 0;
          const IconComponent = ICON_MAP[category.lucideIcon];
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                isActive(category.slug)
                  ? 'bg-[#f97316] text-white'
                  : 'bg-gray-100 text-[#1a1f36] hover:bg-gray-200'
              }`}
            >
              {IconComponent ? <IconComponent size={16} /> : <span className="text-lg">{category.icon}</span>}
              <span className="font-medium text-sm">{category.label}</span>
              {count > 0 && (
                <span className="text-xs opacity-75">({count})</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

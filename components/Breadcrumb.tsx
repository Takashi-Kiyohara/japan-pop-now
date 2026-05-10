import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// NOTE: BreadcrumbList JSON-LD intentionally NOT emitted here. Page-level
// emit lives in app/articles/[slug]/page.tsx via getBreadcrumbSchema(). Two
// emits caused crawlers to see duplicate BreadcrumbList structured data
// (R8-I cleanup, 2026-05-10).
export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className="flex items-center gap-2 text-sm text-gray-600"
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <div key={item.href} className="flex items-center gap-2">
          {idx > 0 && <span className="text-gray-400">/</span>}
          {idx === items.length - 1 ? (
            <span className="text-[#1a1f36] font-semibold">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-[#f97316] transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
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
              <Link href={item.href} className="hover:text-[#c2185b] transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

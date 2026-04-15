import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Guides — Japan Pop Now',
  description: 'Comprehensive travel guides for anime fans visiting Japan — collab cafes, pilgrimage routes, area guides, and practical travel tips.',
  alternates: { canonical: 'https://www.japan-pop-now.com/guides' },
  // Hub index: noindex while hub editorial content is thin.
  robots: {
    index: false,
    follow: true,
  },
};

const HUBS = [
  {
    slug: 'tokyo-anime-cafes',
    title: 'Tokyo Anime Collab Cafes',
    description: 'Every anime collaboration cafe currently open in Tokyo — schedules, menus, booking tips.',
    category: 'collab-cafes',
  },
  {
    slug: 'anime-pilgrimage-tokyo',
    title: 'Anime Pilgrimage Spots in Tokyo',
    description: 'Real-life locations from Your Name, Jujutsu Kaisen, Weathering With You, and more.',
    category: 'anime-pilgrimage',
  },
  {
    slug: 'osaka-anime-guide',
    title: 'Osaka Anime & Pop Culture Guide',
    description: 'Den Den Town, Universal Studios Japan, collab cafes, and hidden otaku spots in Osaka.',
    category: 'area-guides',
  },
  {
    slug: 'day-trips-from-tokyo',
    title: 'Anime Day Trips from Tokyo',
    description: 'Kamakura (Slam Dunk), Chichibu (Anohana), Odaiba (Gundam) — all within 2 hours.',
    category: 'anime-pilgrimage',
  },
  {
    slug: 'japan-travel-essentials',
    title: 'Japan Travel Essentials',
    description: 'JR Pass, eSIM, IC cards, budget tips, and everything you need before your trip.',
    category: 'travel-tips',
  },
];

export default function GuidesIndex() {
  const allArticles = getAllArticles();

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Guides', href: '/guides' }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h1
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: '#14213d',
            lineHeight: 1.2,
            marginBottom: '0.75rem',
          }}
        >
          Travel Guides
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#44403c', maxWidth: '640px', lineHeight: 1.7 }}>
          Our in-depth guide hubs bring together everything you need for each aspect of an anime fan&apos;s trip to Japan.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUBS.map((hub) => {
            const count = allArticles.filter(
              (a) => a.category === hub.category || a.tags.some((t) => hub.slug.includes(t))
            ).length;

            return (
              <Link
                key={hub.slug}
                href={`/guides/${hub.slug}`}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  background: '#fff',
                  border: '1px solid #e7e5e4',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <div
                  style={{
                    height: '6px',
                    background: 'linear-gradient(90deg, #f97316 0%, #e63946 100%)',
                  }}
                />
                <div className="p-6">
                  <h2
                    style={{
                      fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#14213d',
                      marginBottom: '8px',
                    }}
                  >
                    {hub.title}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#78716c', lineHeight: 1.6, marginBottom: '12px' }}>
                    {hub.description}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 600 }}>
                    {count} articles →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

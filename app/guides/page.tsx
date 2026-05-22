import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Anime Travel Guides Japan 2026 — Pilgrimage, Cafes & Area Hubs | Japan Pop Now',
  description: 'Plan your anime trip to Japan with hub guides for Tokyo, Osaka, day trips, collab cafes, and travel essentials. Updated monthly from inside Japan.',
  alternates: { canonical: 'https://www.japan-pop-now.com/guides' },
};

const HUBS = [
  {
    slug: 'tokyo-anime-cafes',
    title: 'Tokyo Anime Collab Cafes',
    description: 'Every anime collaboration cafe currently open in Tokyo — schedules, menus, booking tips.',
    category: 'cafes',
  },
  {
    slug: 'anime-pilgrimage-tokyo',
    title: 'Anime Pilgrimage Spots in Tokyo',
    description: 'Real-life locations from Your Name, Jujutsu Kaisen, Weathering With You, and more.',
    category: 'destinations',
  },
  {
    slug: 'osaka-anime-guide',
    title: 'Osaka Anime & Pop Culture Guide',
    description: 'Den Den Town, Universal Studios Japan, collab cafes, and hidden otaku spots in Osaka.',
    category: 'destinations',
  },
  {
    slug: 'day-trips-from-tokyo',
    title: 'Anime Day Trips from Tokyo',
    description: 'Kamakura (Slam Dunk), Chichibu (Anohana), Odaiba (Gundam) — all within 2 hours.',
    category: 'destinations',
  },
  {
    slug: 'japan-anime-experiences',
    title: 'Japan Anime Experiences',
    description: 'Theme parks, pop-ups, DIY workshops, and single-spot experiences — PokéPark, LuvLab, Blue Lock Skytree, and more.',
    category: 'experiences',
  },
  {
    slug: 'japan-travel-essentials',
    title: 'Japan Travel Essentials',
    description: 'JR Pass, eSIM, IC cards, budget tips, and everything you need before your trip.',
    category: 'experiences',
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
        <p style={{ fontSize: '1.05rem', color: '#44403c', maxWidth: '700px', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Our in-depth guide hubs bring together everything you need for each leg of an anime fan&apos;s trip to Japan — by city, by interest, and by experience level.
        </p>

        <div style={{ maxWidth: '720px', color: '#44403c', fontSize: '0.97rem', lineHeight: 1.75 }}>
          <p style={{ marginBottom: '0.9rem' }}>
            <strong>Planning your anime pilgrimage across Japan.</strong> Japan is the only country where the anime you love is woven into the streets, train stations, shrines, and convenience stores you walk past. Tokyo alone hosts dozens of collab cafes, themed pop-ups, and limited-run merchandise events at any given week, while Osaka, Kyoto, and quiet day-trip towns like Kamakura and Chichibu turn into open-air settings from your favorite series.
          </p>
          <p style={{ marginBottom: '0.9rem' }}>
            Each hub on this page bundles our most-read guides on one slice of that trip: <strong>Tokyo Anime Collab Cafes</strong> for live event tracking, <strong>Anime Pilgrimage Spots in Tokyo</strong> for filming-location walking routes, <strong>Osaka Anime &amp; Pop Culture</strong> for Den Den Town and USJ tie-ins, <strong>Anime Day Trips from Tokyo</strong> for Slam Dunk and Anohana sites within two hours of the city, and <strong>Japan Travel Essentials</strong> for the JR Pass, eSIM, IC card, and reservation logistics you have to nail before your flight.
          </p>
          <p style={{ marginBottom: '0.9rem' }}>
            They&apos;re built for first-time visitors who want a clear plan without the trial-and-error, and for repeat travelers chasing a specific franchise, season, or seasonal event. Pilgrimage purists, collab-cafe collectors, casual fans on a family trip — each persona has a recommended starting hub below.
          </p>
          <p style={{ marginBottom: 0, fontSize: '0.92rem', color: '#57534e' }}>
            Updated monthly by Takashi Kiyohara, who lives in Tokyo and re-walks every featured route in person before publishing. If a cafe closes or a route changes, the guide changes with it.
          </p>
        </div>
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

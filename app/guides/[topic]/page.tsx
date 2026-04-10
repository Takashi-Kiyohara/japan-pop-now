import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ticket, Utensils, Hotel, Train, TrainFront, Smartphone, Umbrella, Drama } from 'lucide-react';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import AdUnit from '@/components/AdUnit';
import AffiliateCTA from '@/components/AffiliateCTA';
import { env } from '@/lib/env';

// ── Hub Topic Definitions ────────────────────────────────────
// Each hub page aggregates articles by tags/categories into a themed landing
interface HubTopic {
  slug: string;
  title: string;
  h1: string;
  description: string;
  heroImage?: string;
  heroAlt?: string;
  /** Filter: articles matching ANY of these categories */
  categories?: string[];
  /** Filter: articles matching ANY of these tags */
  tags?: string[];
  /** Intro paragraph displayed above articles */
  intro: string;
  /** Related hub pages to cross-link */
  relatedHubs?: string[];
}

const HUB_TOPICS: HubTopic[] = [
  {
    slug: 'tokyo-anime-cafes',
    title: 'Tokyo Anime Collab Cafes — Complete Guide',
    h1: 'Tokyo Anime Collab Cafes',
    description: 'Every anime collaboration cafe currently open in Tokyo — schedules, menus, booking tips, and what to expect. Updated weekly.',
    categories: ['collab-cafes'],
    tags: ['tokyo', 'collab-cafe', 'anime-cafe'],
    intro: 'Tokyo is the world capital of anime collaboration cafes. From Ikebukuro\'s Animate Cafe to Shibuya pop-ups, dozens of limited-time themed cafes open every month. This hub collects our complete coverage — booking guides, current schedules, and honest reviews.',
    relatedHubs: ['osaka-anime-guide', 'anime-pilgrimage-tokyo'],
  },
  {
    slug: 'anime-pilgrimage-tokyo',
    title: 'Anime Pilgrimage Spots in Tokyo — Holy Land Guide',
    h1: 'Anime Pilgrimage Spots in Tokyo',
    description: 'Visit the real-life locations from your favorite anime in Tokyo — Your Name, Weathering With You, Jujutsu Kaisen, and more.',
    categories: ['anime-pilgrimage'],
    tags: ['tokyo', 'pilgrimage', 'holy-land'],
    intro: 'Anime pilgrimage (seichi junrei) means visiting the real-world locations that inspired scenes in anime and manga. Tokyo is packed with them — from the Suga Shrine steps in Your Name to Shibuya crossing in Jujutsu Kaisen. Our guides cover exact locations, best photo angles, and how to get there.',
    relatedHubs: ['tokyo-anime-cafes', 'day-trips-from-tokyo'],
  },
  {
    slug: 'osaka-anime-guide',
    title: 'Osaka Anime & Pop Culture Travel Guide',
    h1: 'Osaka Anime & Pop Culture Guide',
    description: 'Collab cafes, anime shops, and otaku spots in Osaka — Den Den Town, Universal Studios Japan, and hidden gems.',
    categories: ['collab-cafes', 'area-guides'],
    tags: ['osaka', 'kansai'],
    intro: 'Osaka is Japan\'s second anime city. Den Den Town rivals Akihabara for figure shopping, Universal Studios Japan has exclusive anime attractions, and the collab cafe scene is growing fast. This hub covers everything an anime fan needs to know about visiting Osaka.',
    relatedHubs: ['tokyo-anime-cafes'],
  },
  {
    slug: 'day-trips-from-tokyo',
    title: 'Anime Day Trips from Tokyo — Best Pop Culture Excursions',
    h1: 'Anime Day Trips from Tokyo',
    description: 'The best anime and pop culture day trips within 2 hours of Tokyo — Kamakura, Chichibu, Odaiba, and more.',
    categories: ['anime-pilgrimage', 'area-guides'],
    tags: ['day-trip', 'tokyo', 'excursion'],
    intro: 'Some of Japan\'s best anime locations are just a train ride from Tokyo. The Slam Dunk crossing in Kamakura, Anohana\'s Chichibu, the Gundam in Odaiba — all doable as day trips. These guides cover routes, timing, and what to combine for a perfect day out.',
    relatedHubs: ['anime-pilgrimage-tokyo'],
  },
  {
    slug: 'japan-travel-essentials',
    title: 'Japan Travel Essentials for Anime Fans',
    h1: 'Japan Travel Essentials',
    description: 'Everything you need before visiting Japan — JR Pass, eSIM, IC cards, budget tips, and etiquette for anime tourists.',
    categories: ['travel-tips'],
    tags: ['travel-tips', 'essential', 'budget', 'jr-pass', 'esim'],
    intro: 'Planning your first anime pilgrimage to Japan? These practical guides cover everything you need — from choosing the right rail pass to getting an eSIM, navigating the convenience store ecosystem, and understanding the unwritten rules that\'ll make your trip smoother.',
    relatedHubs: ['day-trips-from-tokyo'],
  },
];

// ── Static Params ────────────────────────────────────────────
export function generateStaticParams() {
  return HUB_TOPICS.map((t) => ({ topic: t.slug }));
}

interface HubPageProps {
  params: Promise<{ topic: string }>;
}

// ── Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: HubPageProps): Promise<Metadata> {
  const { topic } = await params;
  const hub = HUB_TOPICS.find((t) => t.slug === topic);
  if (!hub) return { title: 'Guide Not Found' };

  const url = `https://japan-pop-now.com/guides/${hub.slug}`;
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: url },
    // Hub page: noindex while unique editorial content is being built out.
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url,
      type: 'website',
    },
  };
}

// ── Helper: match articles to hub ─────────────────────────────
function getHubArticles(hub: HubTopic) {
  const all = getAllArticles();
  return all.filter((a) => {
    const catMatch = hub.categories?.includes(a.category);
    const tagMatch = hub.tags?.some((t) =>
      a.tags.map((at) => at.toLowerCase()).includes(t.toLowerCase())
    );
    return catMatch || tagMatch;
  });
}

// ── Helper: get contextual CTAs for hub page ─────────────────
function getHubPlanYourTripCTAs(hub: HubTopic) {
  const baseClookId = env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID;
  const baseBookingId = env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID;

  switch (hub.slug) {
    case 'tokyo-anime-cafes':
      return [
        {
          icon: <Ticket size={24} strokeWidth={1.8} />,
          title: 'Book Tokyo Cafes',
          description: 'Reserve your spot at Tokyo\'s hottest anime collaboration cafes with free cancellation and English support.',
          buttonText: 'Browse Experiences',
          href: `https://www.klook.com/en-US/experiences/tokyo?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'collab-cafes',
        },
        {
          icon: <Utensils size={24} strokeWidth={1.8} />,
          title: 'Anime Restaurant Dining',
          description: 'Special menus and themed dining experiences at collaboration restaurants across Tokyo.',
          buttonText: 'Find Restaurants',
          href: `https://www.klook.com/en-US/experiences/tokyo?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'collab-cafes',
        },
        {
          icon: <Hotel size={24} strokeWidth={1.8} />,
          title: 'Stay in Anime Districts',
          description: 'Hotels and capsule stays in Ikebukuro, Shibuya, Akihabara. Walk to cafes from your accommodation.',
          buttonText: 'Search Hotels',
          href: `https://www.booking.com/searchresults.html?ss=Tokyo&aid=${baseBookingId}`,
          program: 'booking' as const,
          category: 'area-guides',
        },
      ];
    case 'anime-pilgrimage-tokyo':
      return [
        {
          icon: <Train size={24} strokeWidth={1.8} />,
          title: 'JR Pass for Pilgrims',
          description: 'Visit multiple pilgrimage sites efficiently with Japan Rail Pass. Covers trains to all major holy lands from Tokyo.',
          buttonText: 'Get JR Pass',
          href: `https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'anime-pilgrimage',
        },
        {
          icon: <Hotel size={24} strokeWidth={1.8} />,
          title: 'Stay Near Pilgrimage Sites',
          description: 'Hotels near Your Name (Komaichi), Weathering With You (Shinjuku), and other pilgrimage locations.',
          buttonText: 'Find Accommodation',
          href: `https://www.booking.com/searchresults.html?ss=Tokyo&aid=${baseBookingId}`,
          program: 'booking' as const,
          category: 'anime-pilgrimage',
        },
        {
          icon: <Smartphone size={24} strokeWidth={1.8} />,
          title: 'Stay Connected',
          description: 'eSIM and mobile data plans so you can navigate pilgrimage routes offline and share updates.',
          buttonText: 'Get eSIM',
          href: `https://www.klook.com/en-US/activity/japan-esim?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'travel-tips',
        },
      ];
    case 'osaka-anime-guide':
      return [
        {
          icon: <Ticket size={24} strokeWidth={1.8} />,
          title: 'Osaka Anime Experiences',
          description: 'Book anime cafes, Den Den Town tours, and Universal Studios Japan anime attractions.',
          buttonText: 'Browse Osaka',
          href: `https://www.klook.com/en-US/experiences/osaka?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'collab-cafes',
        },
        {
          icon: <Hotel size={24} strokeWidth={1.8} />,
          title: 'Stay in Dotonbori & Beyond',
          description: 'Hotels in anime-friendly districts — Dotonbori, Namba, Shinsaibashi. Walking distance to shops and cafes.',
          buttonText: 'Search Hotels',
          href: `https://www.booking.com/searchresults.html?ss=Osaka&aid=${baseBookingId}`,
          program: 'booking' as const,
          category: 'area-guides',
        },
        {
          icon: <TrainFront size={24} strokeWidth={1.8} />,
          title: 'Kansai Rail Pass',
          description: 'Day trips from Osaka to Kyoto, Kobe, and Nara. Perfect for expanding your anime pilgrimage.',
          buttonText: 'Get Kansai Pass',
          href: `https://www.klook.com/en-US/activity/kansai-rail-pass?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'travel-tips',
        },
      ];
    case 'day-trips-from-tokyo':
      return [
        {
          icon: <Train size={24} strokeWidth={1.8} />,
          title: 'JR Pass (7-Day)',
          description: 'Visit Kamakura, Chichibu, Odaiba, and more all in one week. Perfect for day trip collectors.',
          buttonText: 'Get JR Pass',
          href: `https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'anime-pilgrimage',
        },
        {
          icon: <Umbrella size={24} strokeWidth={1.8} />,
          title: 'Kamakura Day Trip',
          description: 'Book skip-the-line access to temples and visit the Slam Dunk crossing with guided tours.',
          buttonText: 'Book Tour',
          href: `https://www.klook.com/en-US/experiences/kamakura?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'anime-pilgrimage',
        },
        {
          icon: <Drama size={24} strokeWidth={1.8} />,
          title: 'Local Guides & Maps',
          description: 'GetYourGuide offers detailed pilgrimage guides and themed day trip itineraries.',
          buttonText: 'Browse Guides',
          href: `https://www.getyourguide.com/s/?q=Tokyo%20day%20trip&partner_id=${env.NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID}`,
          program: 'getyourguide' as const,
          category: 'anime-pilgrimage',
        },
      ];
    case 'japan-travel-essentials':
      return [
        {
          icon: <Smartphone size={24} strokeWidth={1.8} />,
          title: 'eSIM & Mobile Data',
          description: 'Instant eSIM activation. No physical SIM cards needed. From ¥1,000 for 7 days.',
          buttonText: 'Compare Plans',
          href: `https://www.klook.com/en-US/activity/japan-esim?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'travel-tips',
        },
        {
          icon: <Train size={24} strokeWidth={1.8} />,
          title: 'JR Pass (All Durations)',
          description: '7, 14, or 21-day passes. Compare prices and find the best option for your trip length.',
          buttonText: 'Get JR Pass',
          href: `https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${baseClookId}`,
          program: 'klook' as const,
          category: 'travel-tips',
        },
        {
          icon: <Hotel size={24} strokeWidth={1.8} />,
          title: 'Hotels & Ryokans',
          description: 'Budget capsule hotels to luxury ryokans. Free cancellation on most bookings.',
          buttonText: 'Search Hotels',
          href: `https://www.booking.com/?aid=${baseBookingId}`,
          program: 'booking' as const,
          category: 'area-guides',
        },
      ];
    default:
      return [];
  }
}

// ── Page ─────────────────────────────────────────────────────
export default async function HubPage({ params }: HubPageProps) {
  const { topic } = await params;
  const hub = HUB_TOPICS.find((t) => t.slug === topic);

  if (!hub) notFound();

  const articles = getHubArticles(hub);

  // Pillar = longest articles (deepest content), Cluster = everything else
  const sortedByDepth = [...articles].sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0));
  const pillarArticles = sortedByDepth.slice(0, Math.min(3, Math.ceil(articles.length * 0.3)));
  const pillarSlugs = new Set(pillarArticles.map((a) => a.slug));
  const clusterArticles = articles.filter((a) => !pillarSlugs.has(a.slug));

  const relatedHubs = hub.relatedHubs
    ?.map((slug) => HUB_TOPICS.find((t) => t.slug === slug))
    .filter(Boolean) as HubTopic[] | undefined;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: hub.h1, href: `/guides/${hub.slug}` },
  ];

  return (
    <>
      {/* Structured Data — CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: hub.title,
            description: hub.description,
            url: `https://japan-pop-now.com/guides/${hub.slug}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://japan-pop-now.com/articles/${a.slug}`,
                name: a.title,
              })),
            },
          }),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <h1
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#14213d',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {hub.h1}
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#44403c', maxWidth: '720px', lineHeight: 1.7 }}>
            {hub.intro}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#a8a29e', marginTop: '8px' }}>
            {articles.length} articles · Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <AdUnit slot="5555555501" format="leaderboard" lazy />
        </div>

        {/* Pillar Articles — Featured / Start Here */}
        {pillarArticles.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', background: '#f97316', padding: '3px 10px', borderRadius: '4px' }}>
                Start Here
              </span>
              <span style={{ fontSize: '0.85rem', color: '#78716c' }}>
                Essential reading for this topic
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillarArticles.map((a) => (
                <div key={a.slug} style={{ position: 'relative' }}>
                  <ArticleCard article={a} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#f97316',
                      background: '#fff7ed',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #f97316',
                    }}
                  >
                    Pillar Guide
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Your Trip — Affiliate CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#14213d',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            }}
          >
            Plan Your Trip
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {getHubPlanYourTripCTAs(hub).map((cta, idx) => (
              <AffiliateCTA key={idx} {...cta} />
            ))}
          </div>
        </div>

        {/* Cluster Articles — Deep Dives */}
        {clusterArticles.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#14213d',
                marginBottom: '1rem',
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              }}
            >
              Deep Dives & Specific Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clusterArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        )}

        {articles.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <p style={{ color: '#78716c', textAlign: 'center', padding: '3rem 0' }}>
              Articles coming soon — we&apos;re working on comprehensive coverage for this topic.
            </p>
          </div>
        )}

        {/* Related Hubs — cross-linking for silo strength */}
        {relatedHubs && relatedHubs.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '2rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '1rem',
                }}
              >
                Explore More Guides
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedHubs.map((rh) => (
                  <Link
                    key={rh.slug}
                    href={`/guides/${rh.slug}`}
                    className="category-strip-link"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e7e5e4',
                      background: '#fff',
                      color: '#44403c',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {rh.h1} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <AdUnit slot="5555555502" format="leaderboard" lazy />
        </div>
      </div>
    </>
  );
}

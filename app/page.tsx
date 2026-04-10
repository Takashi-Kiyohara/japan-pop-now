import { getAllArticles, CATEGORIES } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryStrip from '@/components/CategoryStrip';
import FeaturesStrip from '@/components/FeaturesStrip';
import AdUnit from '@/components/AdUnit';
import AffiliateCTA from '@/components/AffiliateCTA';
import Link from 'next/link';
import { Coffee, Train, Hotel } from 'lucide-react';
import { env } from '@/lib/env';

export const revalidate = 3600;

function SectionHeader({
  title,
  viewAllHref,
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px', flexShrink: 0 }} />
        <h2
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#14213d',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1"
          style={{ color: '#f97316' }}
        >
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const allArticles = getAllArticles();

  // Carousel: top 5 articles
  const carouselArticles = allArticles.slice(0, 5);
  // Featured grid: next 3 (1 large + 2 side)
  const featuredArticles = allArticles.slice(5, 8);
  // Latest: next 6
  const latestArticles = allArticles.slice(8, 14);

  // Build count map for CategoryStrip
  const articleCounts: Record<string, number> = {};
  CATEGORIES.forEach((cat) => {
    articleCounts[cat.slug] = allArticles.filter((a) => a.category === cat.slug).length;
  });

  return (
    <div style={{ background: '#fafaf9' }}>

      {/* ── Visually hidden H1 for SEO (shown to crawlers, above carousel) ── */}
      <h1
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        Japan Pop Now — Your Guide to Anime Collab Cafes, Pilgrimage Spots &amp; Pop Culture in Japan
      </h1>

      {/* ── Hero Carousel ──────────────────────────────────── */}
      <FeaturedCarousel articles={carouselArticles} />

      {/* ── Brand stripe ───────────────────────────────────── */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

      {/* ── Category Strip ─────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <CategoryStrip articleCounts={articleCounts} />
        </div>
      </section>

      {/* ── Editor's Picks (asymmetric grid) ───────────────── */}
      {featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader title="Editor's Picks" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {featuredArticles[0] && (
              <div className="lg:col-span-2">
                <ArticleCard article={featuredArticles[0]} size="lg" variant="featured" />
              </div>
            )}
            <div className="flex flex-col gap-5">
              {featuredArticles.slice(1).map((article) => (
                <ArticleCard key={article.slug} article={article} size="sm" variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Ad Unit (Leaderboard — above fold) ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit slot="1111111101" format="leaderboard" className="py-4" />
      </section>

      {/* ── Latest Articles + Sidebar Ad ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Articles Grid */}
          <div className="lg:col-span-2">
            <SectionHeader title="Latest Articles" viewAllHref="/articles" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} size="md" />
              ))}
            </div>
          </div>

          {/* Sidebar Ad */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <AdUnit slot="2222222201" format="rectangle" lazy />
            </div>
          </div>
        </div>
      </section>

      {/* ── Plan Your Trip (Affiliate Section — friend-guide voice) ─── */}
      <section style={{ background: '#f5f5f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader title="Plan Your Trip" />
          <p
            style={{
              maxWidth: '640px',
              marginTop: '-1rem',
              marginBottom: '1.75rem',
              fontSize: '0.95rem',
              color: '#57534e',
              lineHeight: 1.6,
            }}
          >
            The three things we think every anime-fan traveller should lock in
            first. We only link to services we have used ourselves, and we flag
            the affiliate relationship openly on every card.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AffiliateCTA
              icon={<Coffee size={26} strokeWidth={1.8} />}
              title="Reserve a collab cafe before you fly"
              description="Most Tokyo collab cafes fill up two to three weeks ahead, and the booking flow is entirely in Japanese. Klook runs the handful of English-language reservation portals we actually trust — free cancellation and plain-English confirmation emails."
              buttonText="Browse Tokyo cafes"
              href={`https://www.klook.com/en-US/experiences?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`}
              program="klook"
              category="collab-cafes"
            />
            <AffiliateCTA
              icon={<Train size={26} strokeWidth={1.8} />}
              title="Get a JR Pass if your trip needs one"
              description="A JR Pass pays for itself the moment you leave Tokyo twice. We break down the exact breakeven math in our JR Pass guide, but if you already know you want Kamakura plus Hakone plus Kyoto, this is the 7-day buy."
              buttonText="Check JR Pass prices"
              href={`https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`}
              program="klook"
              category="travel-tips"
            />
            <AffiliateCTA
              icon={<Hotel size={26} strokeWidth={1.8} />}
              title="Stay inside an anime district, not outside it"
              description="A 15-minute walk from Akihabara or Ikebukuro is the difference between a normal Tokyo trip and one where you can drop your shopping bags and head back out. Booking.com has the best English filter for anime-friendly neighbourhoods from around 3,000 yen a night."
              buttonText="Find a neighbourhood stay"
              href={`https://www.booking.com/index.html?aid=${env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID}`}
              program="booking"
              category="area-guides"
            />
          </div>
        </div>
      </section>

      {/* ── Features (5th axis — editorial columns) ───────── */}
      <FeaturesStrip />

      {/* ── Per-Category Sections ──────────────────────────── */}
      {CATEGORIES.map((category, i) => {
        const catArticles = allArticles
          .filter((a) => a.category === category.slug)
          .slice(0, 4);
        if (catArticles.length < 2) return null;

        return (
          <section
            key={category.slug}
            style={{ background: i % 2 === 0 ? '#fff' : '#fafaf9' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <SectionHeader
                title={category.label}
                viewAllHref={`/category/${category.slug}`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {catArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} size="sm" />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Newsletter CTA ─────────────────────────────────── */}
      <section style={{ background: '#14213d' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#fb923c' }}>
            Stay Updated
          </p>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            Japan&apos;s Best Anime Events, First
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7 }}>
            Collab cafes, pilgrimage spots, and pop culture news — delivered weekly.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#f97316', color: '#fff', whiteSpace: 'nowrap' }}
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </section>

      {/* ── Bottom Ad (Leaderboard) ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot="1111111102" format="leaderboard" className="py-4" />
      </section>
    </div>
  );
}

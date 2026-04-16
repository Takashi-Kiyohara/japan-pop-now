import { getAllArticles, CATEGORIES } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import CategoryStrip from '@/components/CategoryStrip';
import AdUnit from '@/components/AdUnit';
import AffiliateCTA from '@/components/AffiliateCTA';
import SpotlightSection from '@/components/SpotlightSection';
import CountdownStrip from '@/components/CountdownStrip';
import BentoGrid from '@/components/BentoGrid';
import Link from 'next/link';
import spotlightData from '@/content/spotlight.json';

export const revalidate = 3600;

function SectionHeader({
  title,
  viewAllHref,
  linkText,
}: {
  title: string;
  viewAllHref?: string;
  linkText?: string;
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
          {linkText || "View all"}
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

  // Featured grid: first 3 (1 large + 2 side) — carousel retired for compact hero
  const featuredArticles = allArticles.slice(0, 3);
  // Latest: next 6
  const latestArticles = allArticles.slice(3, 9);

  // Build count map for CategoryStrip
  const articleCounts: Record<string, number> = {};
  CATEGORIES.forEach((cat) => {
    articleCounts[cat.slug] = allArticles.filter((a) => a.category === cat.slug).length;
  });

  return (
    <div style={{ background: '#fafaf9' }}>
      {/* ── Hero (compact, 70vh, gradient) ──────────────────── */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center bg-gradient-to-br from-orange-500 via-orange-400 to-teal-500">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-orange-500/60 via-teal-500/30 to-transparent pointer-events-none"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1
            className="text-white font-bold mb-4 drop-shadow-lg"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Japan&apos;s Anime &amp; Pop Culture Experiences, Today.
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mb-8 drop-shadow">
            Plan your otaku trip today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calendar?filter=active"
              className="rounded-full px-8 py-3 font-semibold bg-white text-slate-900 hover:scale-105 transition-transform shadow-lg"
            >
              See Today&apos;s Cafes
            </Link>
            <Link
              href="/category/experiences"
              className="rounded-full px-8 py-3 font-semibold bg-white/10 text-white border-2 border-white hover:bg-white hover:text-slate-900 transition-all"
            >
              Browse by IP
            </Link>
          </div>
        </div>
      </section>

      {/* ── Countdown strip (top 3 events ending soon) ─────── */}
      <CountdownStrip />

      {/* ── Bento (Active / This Week / Popular / By IP) ───── */}
      <BentoGrid />

      {/* ── Brand stripe ───────────────────────────────────── */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

      {/* ── Browse Events Banner ───────────────────────────────────── */}
      <Link href="/calendar" style={{ textDecoration: 'none', display: 'block' }}>
        <section
          style={{
            background: 'linear-gradient(135deg, #14213d 0%, #1e3a5f 100%)',
            borderBottom: '2px solid #f97316',
            padding: '20px 0',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          className="hover:opacity-95"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  This Week in Tokyo
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'var(--font-display), Georgia, serif',
                }}>
                  15+ Anime Collab Cafes Open Now
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '12px 24px',
                background: '#f97316',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
              }}
            >
              Browse Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>
      </Link>

      {/* ── Category Strip ─────────────────────────────────── */}
      <section style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4' }}>
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

      {/* ── Spotlight (monthly featured — between Editor's Picks and Latest) ── */}
      <SpotlightSection items={spotlightData} />

      {/* ── Ad Unit (Leaderboard — above fold) ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit slot="1111111101" format="leaderboard" className="py-4" />
      </section>

      {/* ── Latest Articles + Sidebar Ad ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Articles Grid */}
          <div className="lg:col-span-2">
            <SectionHeader title="Latest Articles" viewAllHref="/articles" linkText="Browse all articles" />
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

      {/* ── Popular Experiences (Affiliate Section) ────────── */}
      <section style={{ background: '#f5f5f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader title="Popular Experiences" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AffiliateCTA
              icon="🎫"
              title="Book Tokyo Anime Cafes"
              description="Reserve spots at Tokyo's hottest anime collaboration cafes with Klook. Free cancellation, English support, and skip-the-line access."
              buttonText="Browse Tokyo Cafes"
              href={'https://www.klook.com/en-US/search/?query=anime+collab+cafe+experience+tokyo&aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || '')}
              program="klook"
              category="collab-cafes"
            />
            <AffiliateCTA
              icon="🚅"
              title="Japan Rail Pass"
              description="Explore pilgrimage sites across Japan. JR Pass covers trains to most holy lands. 7, 14, and 21-day options available."
              buttonText="Get JR Pass"
              href={'https://www.klook.com/en-US/activity/1523-japan-rail-pass-jr-pass?aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || '')}
              program="klook"
              category="travel-tips"
            />
            <AffiliateCTA
              icon="🏨"
              title="Stay in the Best Districts"
              description="Find hotels and capsule stays in Akihabara, Ikebukuro, Shibuya, and other anime hotspots. From ¥3,000/night upward."
              buttonText="Search Hotels"
              href={'https://www.booking.com/searchresults.html?ss=Ikebukuro%2C+Tokyo&aid=' + (process.env.NEXT_PUBLIC_BOOKING_AFF_ID || '')}
              program="booking"
              category="area-guides"
            />
          </div>
        </div>
      </section>

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
                title={`${category.icon} ${category.label}`}
                viewAllHref={`/category/${category.slug}`}
                linkText={`See all ${category.label}`}
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

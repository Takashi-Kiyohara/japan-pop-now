/**
 * app/calendar/page.tsx — Collab Cafe Calendar
 * Server component. Revalidates every hour.
 */

import type { Metadata } from 'next';
import CalendarBrowser from '@/components/CalendarBrowser';
import { getUpcomingAndOngoing, getVisibleEvents, getCalendarItemListSchema } from '@/lib/events';
import { AUTHOR } from '@/lib/author';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Anime Events & Collab Cafe Calendar Japan 2026 | Japan Pop Now' },
  description:
    'Browse every anime collab cafe, pop-up and themed event open across Japan in 2026. Filter by franchise, genre and city — direct links to official booking pages.',
  openGraph: {
    title: 'Anime Collab Cafe Calendar Japan 2026',
    description:
      'The only English-language tracker of anime collab cafes in Japan. See what\'s open now, opening soon, and recently ended.',
    url: 'https://www.japan-pop-now.com/calendar',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.japan-pop-now.com/calendar',
  },
};

const SITE_URL = 'https://www.japan-pop-now.com';

export default function CalendarPage() {
  const { ongoing, openingSoon, permanent } = getUpcomingAndOngoing(14);
  const allVisible = getVisibleEvents();
  const schema = getCalendarItemListSchema(allVisible, SITE_URL);

  const totalOpen = ongoing.length + permanent.length;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#ea580c',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 2s infinite',
              }}
            />
            Live Tracker
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 800,
              color: '#14213d',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Anime Collab Cafe Calendar 2026
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#57534e',
              maxWidth: '60ch',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}
          >
            Every anime collaboration cafe, pop-up, and themed venue open in Japan right now.
            The only English-language real-time tracker — updated weekly.
          </p>

          {/* Summary stats */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <StatPill value={totalOpen} label="Open now" color="#22c55e" />
            <StatPill value={openingSoon.length} label="Opening soon" color="#eab308" />
            <StatPill value={permanent.length} label="Permanent venues" color="#0ea5e9" />
          </div>
        </div>

        {/* Update notice */}
        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '2rem',
            fontSize: '0.82rem',
            color: '#9a3412',
          }}
        >
          <strong>How to use this page:</strong> Bookmark before your trip and check the week you arrive.
          Dates and availability change fast — always verify via the official site before booking.
          Reservation links open in a new tab.
        </div>

        {/* Two-column layout on desktop */}
        <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '2rem', alignItems: 'start' }}>
          {/* Main calendar */}
          <div>
            <CalendarBrowser events={allVisible} />
          </div>

          {/* Sidebar */}
          <aside className="calendar-sidebar" style={{ position: 'sticky', top: '80px' }}>
            <SidebarGuides />
          </aside>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .calendar-grid { grid-template-columns: 1fr !important; }
          .calendar-sidebar { display: none !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .calendar-guide-link:hover { border-color: #fb923c !important; }
      `}</style>
    </>
  );
}

// ─── Helper: Stat Pill ──────────────────────────────────────────────────────────
function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#fff',
        border: '1px solid #e7e5e4',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '0.82rem',
      }}
    >
      <span style={{ fontWeight: 800, color, fontSize: '1rem' }}>{value}</span>
      <span style={{ color: '#78716c' }}>{label}</span>
    </div>
  );
}

// ─── Sidebar: Related Guides ────────────────────────────────────────────────────
function SidebarGuides() {
  const links = [
    {
      href: '/articles/how-to-book-anime-collab-cafe-japan',
      title: 'How to Book Anime Collab Cafes',
      desc: 'Step-by-step reservation guide',
    },
    {
      href: '/articles/lawson-ticket-anime-cafe-booking',
      title: 'Lawson Ticket Booking Guide',
      desc: 'Book from outside Japan',
    },
    {
      href: '/articles/tokyo-anime-collab-cafes-spring-2026',
      title: 'Tokyo Spring 2026 Cafes',
      desc: 'Full city breakdown',
    },
    {
      href: '/articles/chiikawa-bakery-harajuku-guide-2026',
      title: 'Chiikawa Bakery Guide',
      desc: 'Reservation tips + real visit notes',
    },
    {
      href: '/articles/animate-cafe-guide-japan',
      title: 'Animate Cafe Guide',
      desc: 'Japan\'s largest collab cafe chain',
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e7e5e4',
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#78716c',
          marginBottom: '12px',
        }}
      >
        Planning Guides
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              textDecoration: 'none',
              display: 'block',
              padding: '8px 10px',
              borderRadius: '8px',
              background: '#fafaf9',
              border: '1px solid #f5f5f4',
              transition: 'border-color 0.15s ease',
            }}
            className="calendar-guide-link"
          >
            <p style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 600, color: '#14213d' }}>
              {l.title}
            </p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#78716c' }}>{l.desc}</p>
          </a>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div
        style={{
          marginTop: '16px',
          background: '#14213d',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 4px', fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
          New cafes every week
        </p>
        <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#94a3b8' }}>
          Follow on Threads for real-time updates
        </p>
        <a
          href={AUTHOR.socials.threads}
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{
            display: 'block',
            background: '#f97316',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.78rem',
            padding: '7px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          @pop_now_jp on Threads →
        </a>
      </div>
    </div>
  );
}

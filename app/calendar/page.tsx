import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import EventCalendar from '@/components/EventCalendar';
import {
  getAllEvents,
  getEventStatus,
  getCalendarItemListSchema,
} from '@/lib/events';

// 1-hour revalidate — matches freshness for ongoing events
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anime Collab Cafe Calendar — Japan Pop Now',
  description:
    "Real-time calendar of every anime, manga, and pop-culture collaboration cafe and event in Japan. Updated weekly. The only English-language tracker of Japan's collab cafe scene.",
  alternates: {
    canonical: 'https://www.japan-pop-now.com/calendar',
  },
  openGraph: {
    title: 'Anime Collab Cafe Calendar — Japan Pop Now',
    description:
      'Real-time calendar of anime collab cafes and pop-culture events in Japan. Updated weekly.',
    type: 'website',
    url: 'https://www.japan-pop-now.com/calendar',
    images: [
      {
        url: 'https://www.japan-pop-now.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Japan Pop Now Collab Cafe Calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anime Collab Cafe Calendar — Japan Pop Now',
    site: '@pop_now_jp',
  },
};

export default function CalendarPage() {
  const allEvents = getAllEvents();
  const today = new Date();

  // Partition into current (ongoing + upcoming) vs ended
  const ongoing = allEvents.filter((e) => getEventStatus(e, today) === 'ongoing');
  const upcoming = allEvents.filter((e) => getEventStatus(e, today) === 'upcoming');
  const ended = allEvents.filter((e) => getEventStatus(e, today) === 'ended');

  // Most recent ended events (last 10) for reference
  const recentEnded = [...ended]
    .sort((a, b) => b.endDate.localeCompare(a.endDate))
    .slice(0, 10);

  const currentEvents = [...ongoing, ...upcoming].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );

  const itemListSchema = getCalendarItemListSchema(currentEvents);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calendar', href: '/calendar' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px 64px' }}>
        <Breadcrumb items={breadcrumbs} />

        {/* Hero */}
        <header style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#14213d',
              lineHeight: 1.15,
              margin: '16px 0 12px',
            }}
          >
            Anime Collab Cafe Calendar
          </h1>
          <p style={{ fontSize: '1rem', color: '#44403c', lineHeight: 1.6, margin: 0 }}>
            The only English-language real-time tracker of anime and pop-culture collaboration
            events in Japan. Updated weekly from primary sources.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
              fontSize: '0.85rem',
              color: '#78716c',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <strong style={{ color: '#e63946' }}>{ongoing.length}</strong> now open
            </span>
            <span>•</span>
            <span>
              <strong style={{ color: '#f97316' }}>{upcoming.length}</strong> opening soon
            </span>
            <span>•</span>
            <span>
              <strong style={{ color: '#78716c' }}>{ended.length}</strong> ended
            </span>
          </div>
        </header>

        {/* Current + Upcoming */}
        <EventCalendar
          events={currentEvents}
          emptyMessage="No events currently ongoing or upcoming. Check back soon — we update this calendar weekly."
          referenceDate={today}
        />

        {/* Recently Ended (collapsed-like section) */}
        {recentEnded.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#78716c',
                margin: '0 0 16px 0',
                paddingBottom: '8px',
                borderBottom: '1px solid #e7e5e4',
              }}
            >
              Recently Ended
            </h2>
            <EventCalendar events={recentEnded} referenceDate={today} />
          </section>
        )}

        {/* Info footer */}
        <section
          style={{
            marginTop: '48px',
            padding: '20px',
            background: '#fafaf9',
            borderRadius: '12px',
            border: '1px solid #e7e5e4',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px' }}>
            How we build this calendar
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#44403c', lineHeight: 1.6, margin: 0 }}>
            Japan Pop Now monitors official collaboration cafe announcements from Japanese primary
            sources (collabo-cafe.com, official IP accounts, retailer press releases). Every entry
            is manually verified. Spot a missing event?{' '}
            <a href="/contact" style={{ color: '#e63946', textDecoration: 'underline' }}>
              Let us know
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}

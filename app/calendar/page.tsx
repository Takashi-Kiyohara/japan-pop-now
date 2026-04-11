import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import EventCalendar from '@/components/EventCalendar';
import { getAllEvents, getEventStatus, getCalendarItemListSchema } from '@/lib/events';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anime Collab Cafe Calendar — Japan Pop Now',
  description:
    "What's happening in Japan's anime collab cafe scene right now? Browse ongoing and upcoming collaboration cafes and pop-culture events — updated twice a month.",
  alternates: { canonical: 'https://www.japan-pop-now.com/calendar' },
  openGraph: {
    title: 'Anime Collab Cafe Calendar — Japan Pop Now',
    description: "Ongoing and upcoming anime collab cafes and events in Japan.",
    type: 'website',
    url: 'https://www.japan-pop-now.com/calendar',
    images: [{ url: 'https://www.japan-pop-now.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Anime Collab Cafe Calendar — Japan Pop Now', site: '@pop_now_jp' },
};

export default function CalendarPage() {
  const allEvents = getAllEvents();
  const today = new Date();

  const active = allEvents
    .filter((e) => getEventStatus(e, today) !== 'ended')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const itemListSchema = getCalendarItemListSchema(active);

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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 64px' }}>
        <Breadcrumb items={breadcrumbs} />

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, margin: '0 0 8px', color: '#1c1917' }}>
            Anime Collab Cafe Calendar 🗓
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#78716c', lineHeight: 1.6 }}>
            Ongoing &amp; upcoming collaboration cafes and anime events in Japan.
            Updated twice a month. Click any card for the official site in English.
          </p>
        </div>

        <EventCalendar
          events={active}
          emptyMessage="No events right now — check back soon!"
          referenceDate={today}
        />

        <p style={{ marginTop: '40px', fontSize: '12px', color: '#a8a29e', textAlign: 'center' }}>
          Links open via Google Translate (ja → en). Updated manually ~twice a month.
        </p>
      </main>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getActiveCafes,
  getUpcomingCafes,
  getEndedCafes,
  getAllCafeIps,
  type Cafe,
} from '@/lib/cafes';
import { cafeUrl, cafesHubUrl } from '@/lib/url';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anime Collab Cafes in Japan — Running Now, Opening Soon, Archive',
  description:
    'The only English-language real-time tracker of anime collaboration cafes in Japan. See what is running now, what is opening soon, and browse the archive by IP.',
  alternates: { canonical: cafesHubUrl() },
  // Cafes hub now carries real campaign data (3 seeded in ca8f95f + Fukuoka
  // venue in ec40678). Index on, let the /cafes/<slug> children inherit.
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Anime Collab Cafes in Japan — Japan Pop Now',
    description:
      'Real-time tracker of anime collaboration cafes in Japan. Dates, venues, reservation guides, and English-visitor tips.',
    type: 'website',
    url: cafesHubUrl(),
  },
};

export default function CafesHubPage() {
  const active = getActiveCafes();
  const upcoming = getUpcomingCafes();
  const ended = getEndedCafes();
  const ips = getAllCafeIps();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Collab Cafes', href: '/cafes' },
  ];

  const total = active.length + upcoming.length + ended.length;

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1
          style={{
            fontFamily:
              'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.9rem, 4vw, 2.7rem)',
            fontWeight: 700,
            color: '#14213d',
            marginBottom: '0.5rem',
          }}
        >
          Anime Collab Cafes in Japan
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#57534e',
            maxWidth: '680px',
            lineHeight: 1.6,
          }}
        >
          The only English-language, real-time tracker of anime collaboration
          cafes in Japan. Every entry is cross-checked against the operator{`'`}s
          official site. Dates, reservations, prices, and how to actually get
          a seat as a visitor.
        </p>
      </header>

      {total === 0 ? <EmptyState /> : null}

      {active.length > 0 ? (
        <Section id="running-now" label="Running now" count={active.length}>
          <CafeGrid cafes={active} />
        </Section>
      ) : null}

      {upcoming.length > 0 ? (
        <Section
          id="opening-soon"
          label="Opening soon"
          count={upcoming.length}
        >
          <CafeGrid cafes={upcoming} />
        </Section>
      ) : null}

      {ips.length > 0 ? (
        <Section id="by-ip" label="Browse by anime / IP" count={ips.length}>
          <div className="flex flex-wrap gap-2">
            {ips.map((ip) => (
              <Link
                key={ip.ip_slug}
                href={`/tags/${ip.ip_slug}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e7e5e4',
                  background: '#fff',
                  color: '#44403c',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {ip.ip}{' '}
                <span style={{ color: '#a8a29e' }}>({ip.count})</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {ended.length > 0 ? (
        <Section id="archive" label="Archive" count={ended.length}>
          <CafeGrid cafes={ended.slice(0, 20)} dimmed />
          {ended.length > 20 ? (
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#78716c' }}>
              Showing 20 of {ended.length} archived cafes.
            </p>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}

function Section({
  id,
  label,
  count,
  children,
}: {
  id: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <h2
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#14213d',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.75rem',
        }}
      >
        {label} <span style={{ color: '#a8a29e' }}>({count})</span>
      </h2>
      {children}
    </section>
  );
}

function CafeGrid({ cafes, dimmed = false }: { cafes: Cafe[]; dimmed?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cafes.map((c) => (
        <CafeCard key={c.slug} cafe={c} dimmed={dimmed} />
      ))}
    </div>
  );
}

function CafeCard({ cafe, dimmed = false }: { cafe: Cafe; dimmed?: boolean }) {
  const venue = cafe.venues[0];
  const statusLabel =
    cafe.status === 'active'
      ? 'Running now'
      : cafe.status === 'upcoming'
        ? 'Opening soon'
        : cafe.status === 'ended'
          ? 'Ended'
          : 'Cancelled';
  const statusColor =
    cafe.status === 'active'
      ? '#16a34a'
      : cafe.status === 'upcoming'
        ? '#2563eb'
        : '#a8a29e';
  return (
    <Link
      href={cafeUrl(cafe.slug).replace('https://www.japan-pop-now.com', '')}
      style={{
        display: 'block',
        background: '#fff',
        border: '1px solid #e7e5e4',
        borderRadius: '10px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#14213d',
        opacity: dimmed ? 0.7 : 1,
      }}
    >
      {cafe.hero_image ? (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: `#f5f5f4 url(${cafe.hero_image}) center/cover no-repeat`,
          }}
          aria-hidden
        />
      ) : (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: '#f5f5f4',
          }}
          aria-hidden
        />
      )}
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '999px',
            background: '#f5f5f4',
            color: statusColor,
            fontSize: '0.72rem',
            fontWeight: 600,
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {statusLabel}
        </div>
        <h3
          style={{
            fontSize: '1.02rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '6px',
          }}
        >
          {cafe.title_en}
        </h3>
        {venue ? (
          <>
            <p style={{ fontSize: '0.82rem', color: '#78716c', margin: '0 0 4px' }}>
              {venue.district}, {venue.city} · {venue.dates.start} to {venue.dates.end}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                fontSize: '0.72rem',
                color: '#57534e',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#f5f5f4',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {reservationLabel(venue.reservation)}
              </span>
              {venue.station ? (
                <span style={{ padding: '2px 4px' }}>{venue.station}</span>
              ) : null}
              {cafe.venues.length > 1 ? (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#f5f5f4',
                    fontWeight: 600,
                  }}
                >
                  {cafe.venues.length} venues
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </Link>
  );
}

function reservationLabel(r: string | null | undefined): string {
  if (!r) return 'Check site';
  if (r === 'walk_in') return 'Walk-in';
  if (r === 'required') return 'Reservation required';
  if (r === 'lottery') return 'Lottery';
  if (r === 'optional') return 'Reservation optional';
  return r;
}

function EmptyState() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div
        style={{
          border: '1px dashed #e7e5e4',
          borderRadius: '12px',
          padding: '32px 24px',
          background: '#fff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14213d', marginBottom: '8px' }}>
          Collab cafe calendar is coming
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: 1.6 }}>
          We are building a real-time calendar of every anime collaboration
          cafe in Japan. Check back soon for dates, venues, reservation
          guides, and English-visitor tips.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCafeSlugs,
  getCafeBySlug,
  getRelatedCafes,
  type Cafe,
  type CafeVenue,
} from '@/lib/cafes';
import { cafeUrl, cafesHubUrl } from '@/lib/url';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

interface CafePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCafeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CafePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cafe = getCafeBySlug(slug);
  if (!cafe) return { title: 'Cafe Not Found' };

  const url = cafeUrl(slug);
  return {
    title: cafe.title_en,
    description: cafe.description_en,
    alternates: { canonical: url },
    openGraph: {
      title: cafe.title_en,
      description: cafe.description_en,
      type: 'article',
      url,
      images: cafe.hero_image
        ? [{ url: cafe.hero_image, width: 1200, height: 675, alt: cafe.title_en }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: cafe.title_en,
      description: cafe.description_en,
      images: cafe.hero_image ? [cafe.hero_image] : undefined,
    },
  };
}

export default async function CafePage({ params }: CafePageProps) {
  const { slug } = await params;
  const cafe = getCafeBySlug(slug);
  if (!cafe) notFound();

  const related = getRelatedCafes(cafe, 3);
  const statusLabel = statusToLabel(cafe.status);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Collab Cafes', href: '/cafes' },
    { label: cafe.ip, href: `/tags/${cafe.ip_slug}` },
  ];

  const eventSchema = cafe.venues.map((v) => buildEventJsonLd(cafe, v));
  const faqSchema = buildFaqJsonLd(cafe);

  return (
    <div style={{ background: '#fafaf9' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '999px',
            background: statusBg(cafe.status),
            color: statusFg(cafe.status),
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
          }}
        >
          {statusLabel}
        </div>
        <h1
          style={{
            fontFamily:
              'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: '#14213d',
            lineHeight: 1.2,
            marginBottom: '0.4rem',
          }}
        >
          {cafe.title_en}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#78716c', margin: 0 }}>
          {cafe.title_ja}
        </p>
      </header>

      {cafe.hero_image ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              background: `#f5f5f4 url(${cafe.hero_image}) center/cover no-repeat`,
              borderRadius: '12px',
            }}
            aria-label={`${cafe.title_en} hero image`}
            role="img"
          />
        </div>
      ) : null}

      {/* TL;DR Answer-First box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div
          style={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            borderLeft: '4px solid #14213d',
            borderRadius: '10px',
            padding: '16px 20px',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '6px', color: '#14213d' }}>
            In short
          </strong>
          <p style={{ fontSize: '0.95rem', color: '#44403c', lineHeight: 1.6, margin: 0 }}>
            {cafe.description_en}
          </p>
        </div>
      </div>

      {/* Key facts table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 style={sectionH2}>Venue details</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.88rem',
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '8px',
            }}
          >
            <thead>
              <tr style={{ background: '#f5f5f4', textAlign: 'left' }}>
                <Th>Venue</Th>
                <Th>Dates</Th>
                <Th>Hours</Th>
                <Th>Reservation</Th>
                <Th>Price</Th>
                <Th>English</Th>
              </tr>
            </thead>
            <tbody>
              {cafe.venues.map((v, i) => (
                <tr key={i} style={{ borderTop: '1px solid #e7e5e4' }}>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#78716c' }}>
                      {v.station}
                    </div>
                  </Td>
                  <Td>
                    {v.dates.start}
                    <br />
                    to {v.dates.end}
                  </Td>
                  <Td>{v.hours || '—'}</Td>
                  <Td>{reservationToLabel(v.reservation)}</Td>
                  <Td>
                    {v.price_range_jpy.min > 0 || v.price_range_jpy.max > 0
                      ? `¥${v.price_range_jpy.min.toLocaleString()}–¥${v.price_range_jpy.max.toLocaleString()}`
                      : '—'}
                  </Td>
                  <Td>
                    Menu: {yesNoNull(v.english_menu)}
                    <br />
                    Staff: {yesNoNull(v.english_staff)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reservation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 style={sectionH2}>How to reserve</h2>
        <p style={bodyP}>{cafe.reservation_summary}</p>
        {cafe.venues.some((v) => v.reservation_url) ? (
          <ul style={{ fontSize: '0.9rem', color: '#44403c', marginTop: '10px' }}>
            {cafe.venues
              .filter((v) => v.reservation_url)
              .map((v, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  <a
                    href={v.reservation_url!}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: '#14213d', textDecoration: 'underline' }}
                  >
                    Reserve {v.name}
                  </a>
                </li>
              ))}
          </ul>
        ) : null}
        {cafe.cover_charge_jpy ? (
          <p style={{ ...bodyP, marginTop: '8px', color: '#78716c' }}>
            Cover charge: ¥{cafe.cover_charge_jpy.toLocaleString()}
          </p>
        ) : null}
      </section>

      {/* Menu */}
      {cafe.menu_highlights.length > 0 ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 style={sectionH2}>Menu highlights</h2>
          <ul style={{ fontSize: '0.92rem', color: '#44403c', lineHeight: 1.7 }}>
            {cafe.menu_highlights.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Merch / bonus */}
      {cafe.merch_bonus ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 style={sectionH2}>Merch and bonuses</h2>
          <p style={bodyP}>{cafe.merch_bonus}</p>
        </section>
      ) : null}

      {/* Getting there */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 style={sectionH2}>Getting there</h2>
        {cafe.venues.map((v, i) => (
          <p key={i} style={bodyP}>
            <strong>{v.name}</strong> — {v.address}. {v.station}.
            {v.map_url ? (
              <>
                {' '}
                <a
                  href={v.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#14213d', textDecoration: 'underline' }}
                >
                  Map
                </a>
              </>
            ) : null}
          </p>
        ))}
      </section>

      {/* Sources */}
      {cafe.source_urls.length > 0 ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 style={sectionH2}>Official sources</h2>
          <ul style={{ fontSize: '0.85rem', color: '#44403c' }}>
            {cafe.source_urls.map((u, i) => (
              <li key={i} style={{ marginBottom: '3px' }}>
                <a
                  href={u}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{ color: '#14213d', textDecoration: 'underline', wordBreak: 'break-all' }}
                >
                  {u}
                </a>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.78rem', color: '#a8a29e', marginTop: '8px' }}>
            Last verified: {cafe.last_verified}
          </p>
        </section>
      ) : null}

      {/* Related cafes */}
      {related.length > 0 ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 style={sectionH2}>Related cafes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/cafes/${r.slug}`}
                style={{
                  display: 'block',
                  background: '#fff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  textDecoration: 'none',
                  color: '#14213d',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                  {statusToLabel(r.status)}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.35 }}>
                  {r.title_en}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Back to hub CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href={cafesHubUrl().replace('https://www.japan-pop-now.com', '')}
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#14213d',
            color: '#fff',
            fontSize: '0.88rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          See all collab cafes
        </Link>
      </div>
    </div>
  );
}

// ---- helpers ----

const sectionH2 = {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#14213d',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: '0.65rem',
};

const bodyP = {
  fontSize: '0.92rem',
  color: '#44403c',
  lineHeight: 1.7,
  margin: 0,
  marginBottom: '6px',
};

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '10px 12px',
        fontSize: '0.74rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        color: '#78716c',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: '12px',
        color: '#44403c',
        verticalAlign: 'top',
      }}
    >
      {children}
    </td>
  );
}

function statusToLabel(s: Cafe['status']): string {
  switch (s) {
    case 'active':
      return 'Running now';
    case 'upcoming':
      return 'Opening soon';
    case 'ended':
      return 'Ended';
    case 'cancelled':
      return 'Cancelled';
  }
}

function statusBg(s: Cafe['status']): string {
  switch (s) {
    case 'active':
      return '#dcfce7';
    case 'upcoming':
      return '#dbeafe';
    case 'ended':
      return '#f5f5f4';
    case 'cancelled':
      return '#fee2e2';
  }
}

function statusFg(s: Cafe['status']): string {
  switch (s) {
    case 'active':
      return '#166534';
    case 'upcoming':
      return '#1e40af';
    case 'ended':
      return '#78716c';
    case 'cancelled':
      return '#991b1b';
  }
}

function reservationToLabel(r: CafeVenue['reservation']): string {
  switch (r) {
    case 'walk_in':
      return 'Walk-in';
    case 'required':
      return 'Required';
    case 'optional':
      return 'Optional';
    case 'lottery':
      return 'Lottery';
    case 'first_come':
      return 'First come';
  }
}

function yesNoNull(v: boolean | null): string {
  if (v === null) return 'Not confirmed';
  return v ? 'Yes' : 'No';
}

function buildEventJsonLd(cafe: Cafe, venue: CafeVenue) {
  const eventStatus =
    cafe.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled';
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${cafe.title_en} — ${venue.name}`,
    startDate: venue.dates.start,
    endDate: venue.dates.end,
    eventStatus,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressLocality: venue.district,
        addressRegion: venue.city,
        addressCountry: 'JP',
      },
    },
    offers:
      venue.price_range_jpy.min > 0
        ? {
            '@type': 'Offer',
            priceCurrency: 'JPY',
            price: venue.price_range_jpy.min,
            availability: 'https://schema.org/InStock',
            url: venue.reservation_url ?? cafeUrl(cafe.slug),
          }
        : undefined,
    organizer: {
      '@type': 'Organization',
      name: cafe.brand,
    },
    image: cafe.hero_image ? [cafe.hero_image] : undefined,
    description: cafe.description_en,
  };
}

function buildFaqJsonLd(cafe: Cafe) {
  const v = cafe.venues[0];
  const reservationA =
    v?.reservation === 'walk_in'
      ? 'No, walk-ins are welcome.'
      : v?.reservation === 'lottery'
        ? 'Yes — a lottery reservation is required via the operator website before visiting.'
        : v?.reservation === 'required'
          ? 'Yes, advance reservation is required.'
          : 'Reservation is optional or first-come, first-served.';
  const priceA =
    v && v.price_range_jpy.min > 0
      ? `Menu items range from ¥${v.price_range_jpy.min.toLocaleString()} to ¥${v.price_range_jpy.max.toLocaleString()}.`
      : 'Prices vary by venue and menu item.';
  const englishA =
    v?.english_menu === true
      ? 'Yes, an English menu is available.'
      : v?.english_menu === false
        ? 'No dedicated English menu. Ordering may require pointing at photos or using a translation app.'
        : 'English menu availability is not confirmed — check with the venue before visiting.';

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is a reservation required for ${cafe.title_en}?`,
        acceptedAnswer: { '@type': 'Answer', text: reservationA },
      },
      {
        '@type': 'Question',
        name: 'How much does the menu cost?',
        acceptedAnswer: { '@type': 'Answer', text: priceA },
      },
      {
        '@type': 'Question',
        name: 'Is there an English menu?',
        acceptedAnswer: { '@type': 'Answer', text: englishA },
      },
      {
        '@type': 'Question',
        name: 'Is there a merch bonus or freebie?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            cafe.merch_bonus ??
            'Merch bonuses for this campaign have not been confirmed.',
        },
      },
      {
        '@type': 'Question',
        name: `How do I get to ${cafe.venues[0]?.name ?? 'the venue'}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cafe.venues[0]
            ? `${cafe.venues[0].address}. ${cafe.venues[0].station}.`
            : 'Directions will be posted once venue details are finalised.',
        },
      },
    ],
  };
}

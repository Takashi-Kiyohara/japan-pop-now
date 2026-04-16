/**
 * EventCalendar.tsx — Server component (zero client JS)
 * Renders the collab cafe calendar grouped by status.
 */

import Image from 'next/image';
import Link from 'next/link';
import {
  CollabEvent,
  getEventStatus,
  formatEventDateRange,
  getEventLink,
  isPermanent,
} from '@/lib/events';
import { getIpVisual } from '@/lib/ipGradient';

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReturnType<typeof getEventStatus> | 'permanent' }) {
  const map = {
    open:          { label: 'NOW OPEN', bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    'opening-soon':{ label: 'OPENING SOON', bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
    permanent:     { label: 'PERMANENT', bg: '#e0f2fe', color: '#075985', dot: '#0ea5e9' },
    ended:         { label: 'ENDED', bg: '#f5f5f4', color: '#78716c', dot: '#a8a29e' },
  } as const;

  const s = map[status] ?? map.ended;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        background: s.bg,
        color: s.color,
        borderRadius: '9999px',
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

// ─── Type Badge ────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: CollabEvent['type'] }) {
  const labels: Record<CollabEvent['type'], string> = {
    'collab-cafe': 'Collab Cafe',
    'permanent-cafe': 'Permanent Cafe',
    'pop-up': 'Pop-Up',
    'event': 'Event',
    'collab-food': 'Collab Food',
    'exhibition': 'Exhibition',
  };
  return (
    <span
      style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        color: '#ea580c',
        background: '#fff7ed',
        borderRadius: '9999px',
        padding: '2px 8px',
      }}
    >
      {labels[type] ?? type}
    </span>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: CollabEvent }) {
  const today = new Date();
  const status = isPermanent(event) ? 'permanent' : getEventStatus(event, today);
  const link = getEventLink(event);

  const cardContent = (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 16px',
        background: '#fff',
        border: '1px solid #e7e5e4',
        borderRadius: '12px',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
      }}
      className="event-card-hover"
    >
      {/* Thumbnail (or IP-gradient fallback) */}
      <div className="shrink-0 w-24 h-[72px] rounded-lg overflow-hidden flex items-center justify-center bg-stone-100">
        {event.thumbnail?.startsWith('/') ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            width={96}
            height={72}
            className="object-cover w-full h-full"
          />
        ) : event.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={event.thumbnail}
            alt={event.title}
            width={96}
            height={72}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          (() => {
            const v = getIpVisual(event.ip);
            return (
              <div className={`w-full h-full flex items-center justify-center text-[0.7rem] font-bold text-center px-1 leading-tight ${v.gradient} ${v.textColor}`}>
                {event.ip.length > 14 ? event.ip.split(' ')[0] : event.ip}
              </div>
            );
          })()
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px', alignItems: 'center' }}>
          <StatusBadge status={status} />
          <TypeBadge type={event.type} />
        </div>

        <p style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 700, color: '#14213d', lineHeight: 1.3 }}>
          {event.title}
        </p>

        <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#78716c' }}>
          {event.venue} · {event.city}
        </p>

        <p style={{ margin: '0 0 6px', fontSize: '0.78rem', fontWeight: 600, color: '#ea580c' }}>
          {formatEventDateRange(event)}
        </p>

        <p style={{ margin: 0, fontSize: '0.78rem', color: '#44403c', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.description}
        </p>
      </div>
    </div>
  );

  if (link.isInternal) {
    return (
      <Link href={link.href} style={{ textDecoration: 'none', display: 'block' }}>
        {cardContent}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      {cardContent}
    </a>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
function Section({ title, events, accent }: { title: string; events: CollabEvent[]; accent: string }) {
  if (events.length === 0) return null;
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#14213d',
          borderLeft: `4px solid ${accent}`,
          paddingLeft: '12px',
          marginBottom: '1rem',
          lineHeight: 1.3,
        }}
      >
        {title}
        <span style={{ marginLeft: '8px', fontSize: '0.8rem', fontWeight: 500, color: '#78716c' }}>
          ({events.length})
        </span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
interface EventCalendarProps {
  ongoing: CollabEvent[];
  openingSoon: CollabEvent[];
  permanent: CollabEvent[];
  recentlyEnded: CollabEvent[];
}

export default function EventCalendar({ ongoing, openingSoon, permanent, recentlyEnded }: EventCalendarProps) {
  return (
    <div>
      <Section title="🔴 Open Now" events={ongoing} accent="#22c55e" />
      <Section title="🟠 Opening Soon (next 14 days)" events={openingSoon} accent="#eab308" />
      <Section title="🔵 Permanent Venues" events={permanent} accent="#0ea5e9" />
      {recentlyEnded.length > 0 && (
        <Section title="⚫ Recently Ended" events={recentlyEnded} accent="#a8a29e" />
      )}
    </div>
  );
}

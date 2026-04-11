/**
 * EventCalendar — mobile-first vertical list calendar for collab cafes & events
 *
 * Pure server component (no "use client"), renders:
 *   - NOW OPEN / OPENING SOON / ENDED badges
 *   - grouped by month
 *   - thumbnail, venue, city, date range, CTA to article
 *
 * Used by /calendar and /calendar/[month] pages.
 */

import Link from 'next/link';
import Image from 'next/image';
import {
  type CalendarEvent,
  type EventStatus,
  getEventStatus,
  formatEventDateRange,
} from '@/lib/events';

interface EventCalendarProps {
  events: CalendarEvent[];
  emptyMessage?: string;
  /** Optional ref date — defaults to today. Primarily for testing/SSR. */
  referenceDate?: Date;
}

const STATUS_STYLE: Record<EventStatus, { bg: string; color: string; label: string }> = {
  ongoing: { bg: '#e63946', color: '#fff', label: 'NOW OPEN' },
  upcoming: { bg: '#f97316', color: '#fff', label: 'OPENING SOON' },
  ended: { bg: '#78716c', color: '#fff', label: 'ENDED' },
};

/** Group events by "YYYY-MM" based on their startDate. */
function groupByMonth(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const ym = ev.startDate.slice(0, 7);
    const arr = map.get(ym) ?? [];
    arr.push(ev);
    map.set(ym, arr);
  }
  return map;
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default function EventCalendar({
  events,
  emptyMessage = 'No events scheduled.',
  referenceDate = new Date(),
}: EventCalendarProps) {
  if (events.length === 0) {
    return (
      <div
        style={{
          padding: '48px 16px',
          textAlign: 'center',
          color: '#78716c',
          background: '#fafaf9',
          borderRadius: '12px',
          border: '1px dashed #e7e5e4',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  // Sort by startDate ascending, then group by month
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const groups = Array.from(groupByMonth(sorted).entries());

  return (
    <div className="event-calendar">
      {groups.map(([ym, monthEvents]) => (
        <section key={ym} style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#14213d',
              margin: '0 0 16px 0',
              paddingBottom: '8px',
              borderBottom: '2px solid #e7e5e4',
            }}
          >
            {monthLabel(ym)}
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {monthEvents.map((event) => {
              const status = getEventStatus(event, referenceDate);
              const badge = STATUS_STYLE[status];
              const isInternal = event.article.startsWith('/');
              const opacity = status === 'ended' ? 0.6 : 1;

              const card = (
                <article
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '12px',
                    opacity,
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  }}
                  className="event-card-hover"
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: 'relative',
                      width: '96px',
                      height: '96px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#e7e5e4',
                    }}
                  >
                    {event.thumbnail && (
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        sizes="96px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          background: badge.bg,
                          color: badge.color,
                          textTransform: 'uppercase',
                        }}
                      >
                        {badge.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#78716c' }}>
                        {event.ip}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#14213d',
                        margin: 0,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {event.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#44403c', margin: 0 }}>
                      📍 {event.venue}, {event.city}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#78716c', margin: 0 }}>
                      🗓 {formatEventDateRange(event)}
                    </p>
                  </div>
                </article>
              );

              return (
                <li key={event.id}>
                  {isInternal ? (
                    <Link href={event.article} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      {card}
                    </Link>
                  ) : (
                    <a
                      href={event.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {card}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * EventCalendar — card grid for collab cafes & anime events
 *
 * Pure server component. 2col SP / 3col tablet / 4col desktop.
 * Cards: thumbnail + status badge + IP tag + title + venue + date + GT link.
 */

import Image from 'next/image';
import {
  type CalendarEvent,
  type EventStatus,
  getEventStatus,
  formatEventDateRange,
  getTranslatedUrl,
} from '@/lib/events';

interface EventCalendarProps {
  events: CalendarEvent[];
  emptyMessage?: string;
  referenceDate?: Date;
}

const STATUS_CONFIG: Record<EventStatus, { label: string; bg: string }> = {
  ongoing:  { label: 'NOW OPEN',    bg: '#e63946' },
  upcoming: { label: 'COMING SOON', bg: '#f97316' },
  ended:    { label: 'ENDED',       bg: '#a8a29e' },
};

function EventCard({ event, status }: { event: CalendarEvent; status: EventStatus }) {
  const { label, bg } = STATUS_CONFIG[status];
  const dateRange = formatEventDateRange(event);
  const detailUrl = getTranslatedUrl(event.officialUrl);

  return (
    <a
      href={detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="event-card"
    >
      {/* Thumbnail */}
      <div className="event-card-thumb">
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        <span className="event-badge" style={{ background: bg }}>{label}</span>
      </div>

      {/* Body */}
      <div className="event-card-body">
        <span className="event-ip">{event.ip}</span>
        <p className="event-title">{event.title}</p>
        <p className="event-meta">📍 {event.venue}{event.city !== 'Nationwide' ? `, ${event.city}` : ''}</p>
        <p className="event-meta">🗓 {dateRange}</p>
        <span className="event-cta">Official Site (EN) →</span>
      </div>
    </a>
  );
}

export default function EventCalendar({
  events,
  emptyMessage = 'No events found.',
  referenceDate = new Date(),
}: EventCalendarProps) {
  if (events.length === 0) {
    return (
      <div className="event-empty">{emptyMessage}</div>
    );
  }

  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="event-grid">
      {sorted.map((ev) => (
        <EventCard key={ev.id} event={ev} status={getEventStatus(ev, referenceDate)} />
      ))}
    </div>
  );
}

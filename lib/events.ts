/**
 * Event calendar library — schema v2.0 (simplified)
 *
 * Minimal fields: id, ip, title, venue, city, startDate, endDate, thumbnail, officialUrl, tags
 * Detail links go to Google Translate of officialUrl (ja→en).
 *
 * Used by /calendar page and ItemList JSON-LD for AI Overview.
 */

import fs from 'node:fs';
import path from 'node:path';

export type EventStatus = 'upcoming' | 'ongoing' | 'ended';

export interface CalendarEvent {
  id: string;
  ip: string;
  title: string;
  venue: string;
  city: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  thumbnail: string;
  officialUrl: string; // Japanese official site — linked via Google Translate
  tags: string[];
}

interface EventsFile {
  schema_version: string;
  description: string;
  events: CalendarEvent[];
}

const EVENTS_PATH = path.join(process.cwd(), 'data', 'events.json');

let cachedEvents: CalendarEvent[] | null = null;

export function getAllEvents(): CalendarEvent[] {
  if (cachedEvents) return cachedEvents;
  try {
    if (!fs.existsSync(EVENTS_PATH)) { cachedEvents = []; return cachedEvents; }
    const raw = fs.readFileSync(EVENTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as EventsFile;
    cachedEvents = Array.isArray(parsed.events) ? parsed.events : [];
    return cachedEvents;
  } catch (err) {
    console.warn('[events] Failed to load events.json:', err);
    cachedEvents = [];
    return cachedEvents;
  }
}

export function getEventStatus(event: CalendarEvent, today: Date = new Date()): EventStatus {
  const todayStr = today.toISOString().slice(0, 10);
  if (event.endDate < todayStr) return 'ended';
  if (event.startDate > todayStr) return 'upcoming';
  return 'ongoing';
}

/** Google Translate link: Japanese official URL → English */
export function getTranslatedUrl(officialUrl: string): string {
  return `https://translate.google.com/translate?sl=ja&tl=en&u=${encodeURIComponent(officialUrl)}`;
}

export function formatEventDateRange(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      year: withYear ? 'numeric' : undefined,
      timeZone: 'UTC',
    });
  return `${fmt(start, false)} – ${fmt(end, sameYear)}`;
}

export function getEventsInRange(start: string, end: string): CalendarEvent[] {
  return getAllEvents().filter((e) => !(e.endDate < start || e.startDate > end));
}

export function getEventsByMonth(yearMonth: string): CalendarEvent[] {
  return getEventsInRange(`${yearMonth}-01`, `${yearMonth}-31`);
}

/** ItemList JSON-LD for AI Overview eligibility */
export function getCalendarItemListSchema(
  events: CalendarEvent[],
  siteUrl: string = 'https://www.japan-pop-now.com',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Japan Anime Collab Cafe Calendar',
    description: 'Calendar of anime and pop-culture collaboration cafes and events in Japan.',
    numberOfItems: events.length,
    itemListElement: events.map((e, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Event',
        name: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        url: `${siteUrl}/calendar`,
      },
    })),
  };
}

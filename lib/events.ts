/**
 * Event calendar library
 *
 * Loads anime/pop-culture events from `data/events.json` and provides
 * helper functions for filtering, grouping, and status computation.
 *
 * Used by /calendar page (week/month view), Threads weekly digest,
 * and AI Overview ItemList schema generation.
 */

import fs from 'node:fs';
import path from 'node:path';

export type EventType = 'cafe' | 'exhibition' | 'popup' | 'festival' | 'screening' | 'other';
export type EventStatus = 'upcoming' | 'ongoing' | 'ended';
export type ReservationType = 'walk-in' | 'required' | 'recommended';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface EventAffiliate {
  tablecheck?: string | null;
  klook?: string | null;
  getyourguide?: string | null;
  booking?: string | null;
  [provider: string]: string | null | undefined;
}

export interface CalendarEvent {
  id: string;
  ip: string;
  type: EventType;
  title: string;
  venue: string;
  city: string;
  prefecture: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  thumbnail: string;
  article: string;   // internal /articles/<slug> or external URL
  description: string;
  reservation: ReservationType;
  affiliate: EventAffiliate;
  coordinates: Coordinates;
  tags: string[];
  source: string;
  lastVerified: string; // YYYY-MM-DD
}

interface EventsFile {
  schema_version: string;
  description: string;
  events: CalendarEvent[];
}

const EVENTS_PATH = path.join(process.cwd(), 'data', 'events.json');

// Module-level cache
let cachedEvents: CalendarEvent[] | null = null;

/**
 * Load all events from the JSON file. Cached for the process lifetime.
 * Returns [] if the file is missing or malformed so pages never 500.
 */
export function getAllEvents(): CalendarEvent[] {
  if (cachedEvents) return cachedEvents;
  try {
    if (!fs.existsSync(EVENTS_PATH)) {
      cachedEvents = [];
      return cachedEvents;
    }
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

/**
 * Compute an event's status relative to a reference date (default: today UTC).
 * Uses calendar-date comparison only (timezone-naive).
 */
export function getEventStatus(event: CalendarEvent, today: Date = new Date()): EventStatus {
  const todayStr = today.toISOString().slice(0, 10);
  if (event.endDate < todayStr) return 'ended';
  if (event.startDate > todayStr) return 'upcoming';
  return 'ongoing';
}

/**
 * Get events whose date range overlaps with [start, end] (inclusive).
 */
export function getEventsInRange(start: string, end: string): CalendarEvent[] {
  return getAllEvents().filter((e) => !(e.endDate < start || e.startDate > end));
}

/**
 * Get events for a specific YYYY-MM month.
 */
export function getEventsByMonth(yearMonth: string): CalendarEvent[] {
  const start = `${yearMonth}-01`;
  const end = `${yearMonth}-31`;
  return getEventsInRange(start, end);
}

/**
 * Get events for the week starting on the given ISO date (Monday).
 */
export function getEventsByWeek(mondayIso: string): CalendarEvent[] {
  const monday = new Date(mondayIso);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const end = sunday.toISOString().slice(0, 10);
  return getEventsInRange(mondayIso, end);
}

/**
 * Get ongoing events for the next N days (default 14 days).
 * Used by the calendar homepage default view and Threads digest.
 */
export function getUpcomingAndOngoing(days: number = 14): CalendarEvent[] {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + days);
  const todayStr = today.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  return getEventsInRange(todayStr, endStr)
    .filter((e) => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Filter by IP (e.g. "Chiikawa").
 */
export function getEventsByIp(ip: string): CalendarEvent[] {
  return getAllEvents().filter((e) => e.ip.toLowerCase() === ip.toLowerCase());
}

/**
 * Filter by type (e.g. "cafe").
 */
export function getEventsByType(type: EventType): CalendarEvent[] {
  return getAllEvents().filter((e) => e.type === type);
}

/**
 * Pretty-format a date range for UI ("Apr 5 – May 31, 2026").
 */
export function formatEventDateRange(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: withYear ? 'numeric' : undefined,
      timeZone: 'UTC',
    });
  return `${fmt(start, false)} – ${fmt(end, sameYear)}`;
}

/**
 * Generate schema.org Event JSON-LD for a single calendar event.
 * Safe for server-side inline rendering.
 */
export function getEventSchema(event: CalendarEvent, siteUrl: string = 'https://www.japan-pop-now.com') {
  const url = event.article.startsWith('http') ? event.article : `${siteUrl}${event.article}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressRegion: event.prefecture,
        addressCountry: 'JP',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: event.coordinates.lat,
        longitude: event.coordinates.lng,
      },
    },
    image: event.thumbnail.startsWith('http') ? event.thumbnail : `${siteUrl}${event.thumbnail}`,
    url,
    organizer: {
      '@type': 'Organization',
      name: event.ip,
    },
  };
}

/**
 * Generate an ItemList schema for the full calendar — boosts AI Overview eligibility.
 */
export function getCalendarItemListSchema(
  events: CalendarEvent[],
  siteUrl: string = 'https://www.japan-pop-now.com',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Japan Anime Collab Cafe Calendar',
    description: 'Real-time calendar of anime, manga, and pop-culture collaboration events in Japan.',
    numberOfItems: events.length,
    itemListElement: events.map((e, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Event',
        name: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        url: e.article.startsWith('http') ? e.article : `${siteUrl}${e.article}`,
      },
    })),
  };
}

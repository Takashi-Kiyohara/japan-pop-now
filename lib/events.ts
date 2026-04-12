/**
 * lib/events.ts — Collab Cafe Calendar data layer
 * Reads from data/events.json; all logic is pure functions.
 */

import fs from 'fs';
import path from 'path';

export type EventStatus = 'open' | 'opening-soon' | 'ended';
export type EventType =
  | 'collab-cafe'
  | 'permanent-cafe'
  | 'pop-up'
  | 'event'
  | 'collab-food'
  | 'exhibition';

export interface CollabEvent {
  id: string;
  ip: string;
  type: EventType;
  title: string;
  venue: string;
  city: string;
  prefecture: string;
  startDate: string;      // ISO YYYY-MM-DD
  endDate: string;        // ISO YYYY-MM-DD or "2099-12-31" for permanent
  thumbnail: string;
  articleSlug?: string;   // internal article slug (no /articles/ prefix)
  description: string;
  reservation: string;
  tags: string[];
  source: string;
  lastVerified: string;   // ISO YYYY-MM-DD
}

// ─── Module-level cache ────────────────────────────────────────────────────────
let _cachedEvents: CollabEvent[] | null = null;

export function getAllEvents(): CollabEvent[] {
  if (_cachedEvents) return _cachedEvents;
  const file = path.join(process.cwd(), 'data/events.json');
  const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
  _cachedEvents = raw.events as CollabEvent[];
  return _cachedEvents;
}

// ─── Status ────────────────────────────────────────────────────────────────────
export function getEventStatus(event: CollabEvent, today: Date = new Date()): EventStatus {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const todayMs = today.getTime();
  const DAY = 86_400_000;

  if (todayMs > end.getTime() + DAY) return 'ended';
  if (todayMs < start.getTime()) {
    return (start.getTime() - todayMs) <= 14 * DAY ? 'opening-soon' : 'ended'; // hide far-future
  }
  return 'open';
}

export function isPermanent(event: CollabEvent): boolean {
  return event.endDate === '2099-12-31';
}

// ─── Filtering ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUpcomingAndOngoing(days = 14, today: Date = new Date()): {
  ongoing: CollabEvent[];
  openingSoon: CollabEvent[];
  permanent: CollabEvent[];
  recentlyEnded: CollabEvent[];
} {
  const all = getAllEvents();
  const DAY = 86_400_000;
  const cutoff = new Date(today.getTime() - 10 * DAY); // show ended up to 10 days ago

  const ongoing: CollabEvent[] = [];
  const openingSoon: CollabEvent[] = [];
  const permanent: CollabEvent[] = [];
  const recentlyEnded: CollabEvent[] = [];

  for (const e of all) {
    const end = new Date(e.endDate);

    if (isPermanent(e)) {
      permanent.push(e);
      continue;
    }

    const status = getEventStatus(e, today);
    if (status === 'open') {
      ongoing.push(e);
    } else if (status === 'opening-soon') {
      openingSoon.push(e);
    } else if (end >= cutoff) {
      recentlyEnded.push(e);
    }
  }

  // Sort ongoing by end date (soonest ending first)
  ongoing.sort((a, b) => a.endDate.localeCompare(b.endDate));
  openingSoon.sort((a, b) => a.startDate.localeCompare(b.startDate));
  recentlyEnded.sort((a, b) => b.endDate.localeCompare(a.endDate));

  return { ongoing, openingSoon, permanent, recentlyEnded };
}

export function getEventsByIp(ip: string): CollabEvent[] {
  return getAllEvents().filter((e) => e.ip.toLowerCase() === ip.toLowerCase());
}

// ─── Formatting ────────────────────────────────────────────────────────────────
export function formatEventDateRange(event: CollabEvent): string {
  if (isPermanent(event)) return 'Permanent';
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m) - 1]} ${parseInt(day)}`;
  };
  const [sy] = event.startDate.split('-');
  const [ey] = event.endDate.split('-');
  const sameYear = sy === ey;
  return `${fmt(event.startDate)} – ${fmt(event.endDate)}${sameYear ? ` ${ey}` : ''}`;
}

export function getEventLink(event: CollabEvent): { href: string; isInternal: boolean } {
  if (event.articleSlug) {
    return { href: `/articles/${event.articleSlug}`, isInternal: true };
  }
  return { href: event.source, isInternal: false };
}

// ─── JSON-LD ───────────────────────────────────────────────────────────────────
export function getCalendarItemListSchema(events: CollabEvent[], baseUrl: string): object {
  const items = events.map((e, i) => {
    const link = getEventLink(e);
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: e.title,
      url: link.isInternal ? `${baseUrl}${link.href}` : link.href,
      description: e.description,
    };
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Japan Anime Collaboration Cafe Calendar 2026',
    description: 'The only English-language real-time tracker of anime collaboration cafes in Japan.',
    numberOfItems: items.length,
    itemListElement: items,
  };
}

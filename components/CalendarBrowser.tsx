'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { CollabEvent, EventBadge, EventGenre } from '@/lib/events';

type SortKey = 'date' | 'ending' | 'popularity';
type CityFilter = 'all' | 'Tokyo' | 'Osaka' | 'other';
type GenreFilter = 'all' | EventGenre;

const GENRE_TABS: { key: GenreFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'shonen', label: 'Shonen' },
  { key: 'shojo', label: 'Shojo' },
  { key: 'seinen', label: 'Seinen' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'vtuber', label: 'VTuber' },
  { key: 'mixed', label: 'Mixed' },
];

const CITY_TABS: { key: CityFilter; label: string }[] = [
  { key: 'all', label: 'All Cities' },
  { key: 'Tokyo', label: 'Tokyo' },
  { key: 'Osaka', label: 'Osaka' },
  { key: 'other', label: 'Other' },
];

const BADGE_STYLE: Record<EventBadge, { label: string; bg: string; color: string }> = {
  hot: { label: 'Hot', bg: '#fee2e2', color: '#b91c1c' },
  new: { label: 'New', bg: '#dcfce7', color: '#166534' },
  'ending-soon': { label: 'Ending Soon', bg: '#ffedd5', color: '#9a3412' },
  niche: { label: 'Niche', bg: '#ede9fe', color: '#5b21b6' },
  limited: { label: 'Limited', bg: '#fef3c7', color: '#854d0e' },
};

function isPermanent(e: CollabEvent) {
  return e.endDate === '2099-12-31';
}

function formatRange(e: CollabEvent): string {
  if (isPermanent(e)) return 'Permanent';
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}`;
  };
  const [sy] = e.startDate.split('-');
  const [ey] = e.endDate.split('-');
  return `${fmt(e.startDate)} – ${fmt(e.endDate)}${sy === ey ? ` ${ey}` : ''}`;
}

function deriveBadge(e: CollabEvent, now: Date): EventBadge | undefined {
  if (e.badge) return e.badge;
  if (isPermanent(e)) return undefined;
  const days = (new Date(e.endDate).getTime() - now.getTime()) / 86_400_000;
  if (days > 0 && days <= 14) return 'ending-soon';
  const sinceStart = (now.getTime() - new Date(e.startDate).getTime()) / 86_400_000;
  if (sinceStart < 14 && sinceStart >= 0) return 'new';
  return undefined;
}

export default function CalendarBrowser({ events }: { events: CollabEvent[] }) {
  const [genre, setGenre] = useState<GenreFilter>('all');
  const [city, setCity] = useState<CityFilter>('all');
  const [sort, setSort] = useState<SortKey>('date');
  const [query, setQuery] = useState('');

  const now = useMemo(() => new Date(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = events.filter((e) => {
      if (genre !== 'all' && e.genre !== genre) return false;
      if (city === 'Tokyo' && e.city !== 'Tokyo') return false;
      if (city === 'Osaka' && e.city !== 'Osaka') return false;
      if (city === 'other' && (e.city === 'Tokyo' || e.city === 'Osaka')) return false;
      if (q && !`${e.title} ${e.ip} ${e.venue}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'ending') {
      list = [...list].sort((a, b) => a.endDate.localeCompare(b.endDate));
    } else if (sort === 'popularity') {
      const score = (e: CollabEvent) => (e.badge === 'hot' ? 0 : e.badge === 'new' ? 1 : e.badge === 'limited' ? 2 : e.badge === 'niche' ? 3 : 4);
      list = [...list].sort((a, b) => score(a) - score(b) || a.startDate.localeCompare(b.startDate));
    } else {
      list = [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
    return list;
  }, [events, genre, city, sort, query]);

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          aria-label="Search events by franchise or venue"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by franchise, venue, or title…"
          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: '#fff', border: '1px solid #e7e5e4', color: '#14213d' }}
        />
      </div>

      {/* Genre tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {GENRE_TABS.map((t) => {
          const active = genre === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setGenre(t.key)}
              className="text-xs font-semibold rounded-full px-3 py-1.5 transition-colors"
              style={{
                background: active ? '#14213d' : '#fff',
                color: active ? '#fff' : '#44403c',
                border: '1px solid',
                borderColor: active ? '#14213d' : '#e7e5e4',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* City + Sort row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {CITY_TABS.map((t) => {
            const active = city === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setCity(t.key)}
                className="text-xs font-semibold rounded-full px-3 py-1.5 transition-colors"
                style={{
                  background: active ? '#1e3a5f' : '#fff',
                  color: active ? '#fff' : '#44403c',
                  border: '1px solid',
                  borderColor: active ? '#1e3a5f' : '#e7e5e4',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <label className="ml-auto text-xs font-semibold text-stone-600 flex items-center gap-2">
          Sort:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-xs px-2 py-1.5 rounded-md outline-none"
            style={{ background: '#fff', border: '1px solid #e7e5e4', color: '#14213d' }}
          >
            <option value="date">Date</option>
            <option value="ending">Ending Soon</option>
            <option value="popularity">Popularity</option>
          </select>
        </label>
      </div>

      <p className="text-xs text-stone-500 mb-3">
        Showing {filtered.length} of {events.length} events
      </p>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((e) => {
          const badge = deriveBadge(e, now);
          const href = e.articleSlug
            ? `/articles/${e.articleSlug}`
            : (e.officialUrl || e.source);
          const internal = !!e.articleSlug;
          const linkProps = internal
            ? {}
            : { target: '_blank', rel: 'noopener noreferrer nofollow' as const };
          const Wrapper = internal ? Link : 'a';
          return (
            <Wrapper
              key={e.id}
              href={href}
              {...linkProps}
              className="block rounded-xl transition-shadow hover:shadow-md"
              style={{ background: '#fff', border: '1px solid #e7e5e4', textDecoration: 'none' }}
            >
              <div className="flex flex-col sm:flex-row">
                <div
                  className="sm:w-40 sm:flex-shrink-0 flex items-center justify-center"
                  style={{
                    height: 100,
                    background: 'linear-gradient(135deg, #1e3a5f, #14213d)',
                    color: '#fff',
                    fontFamily: 'var(--font-display), Georgia, serif',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    padding: '12px',
                    textAlign: 'center',
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}
                >
                  {e.ip}
                </div>
                <div className="flex-1 p-4 relative">
                  {badge && (
                    <span
                      className="absolute top-3 right-3 text-[0.65rem] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider"
                      style={{ background: BADGE_STYLE[badge].bg, color: BADGE_STYLE[badge].color }}
                    >
                      {BADGE_STYLE[badge].label}
                    </span>
                  )}
                  <p className="text-[0.95rem] font-bold mb-1 pr-16" style={{ color: '#14213d', lineHeight: 1.3 }}>
                    {e.title}
                  </p>
                  <p className="text-xs text-stone-500 mb-1">
                    {e.venue} · {e.city}
                  </p>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#ea580c' }}>
                    {formatRange(e)}
                  </p>
                  <p className="text-xs text-stone-700 line-clamp-2" style={{ lineHeight: 1.5 }}>
                    {e.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold" style={{ color: '#f97316' }}>
                    View details →
                  </p>
                </div>
              </div>
            </Wrapper>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-stone-500 py-8 text-center">
            No events match the current filters.
          </p>
        )}
      </div>
    </div>
  );
}

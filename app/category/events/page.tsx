import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar as CalendarIcon, MapPin, Sparkles } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { getUpcomingAndOngoing, formatEventDateRange, getEventLink } from '@/lib/events';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anime Events & Pop-ups in Japan — Japan Pop Now',
  description:
    'Time-limited anime exhibitions, pop-up shops, seasonal events, and limited-run collaborations across Japan. Preview the five ending-soonest, or open the full live calendar.',
  alternates: { canonical: 'https://www.japan-pop-now.com/category/events' },
  robots: { index: true, follow: true },
};

export default function EventsHubPage() {
  const { ongoing, openingSoon, permanent } = getUpcomingAndOngoing();

  // Preview: up to 5 events, priority by status then earliest end date.
  const preview = [
    ...ongoing.slice(0, 3),
    ...openingSoon.slice(0, 2),
    ...permanent.slice(0, 1),
  ].slice(0, 5);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Events & Pop-ups', href: '/category/events' },
  ];

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1
          className="font-display text-brand-navy"
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}
        >
          Anime Events & Pop-ups in Japan
        </h1>

        <div className="max-w-[65ch] text-neutral-700" style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
          <p style={{ marginBottom: '1rem' }}>
            Time-limited is where most of the best anime moments live in Japan. Pop-up shops selling
            merch you cannot buy online, art exhibitions that tour for three weeks and never return,
            convenience-store collaborations you have to catch in a specific seven-day window — the
            country runs on a calendar of events that rewards travelers who plan around them and
            disappoints travelers who show up late. This hub collects our coverage of those windows
            and keeps the schedule honest for English-speaking visitors.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>What counts as an event here.</strong> Anything with a hard end date — collab
            cafes (we track those separately under Collab Cafes), exhibitions at galleries and
            department stores, pop-up shops at Parco / Marui / Shibuya109 / Omotesando, AnimeJapan
            and Comiket convention tie-ins, seasonal Halloween and Christmas takeovers, capsule-hotel
            fandom rooms, and the creative one-off partnerships (Lawson, FamilyMart, 7-Eleven) that
            reshape a convenience store for two weeks. If it runs forever, it belongs in a guide,
            not here.
          </p>
          <p style={{ marginBottom: 0 }}>
            The preview below is the short list we would book first this week. For the full live
            schedule — 100+ active and upcoming events, filtered by city, IP, and status — head to
            the events calendar.
          </p>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 bg-accent-600 text-white
                       font-semibold px-5 py-3 rounded-xl
                       hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <CalendarIcon size={18} aria-hidden />
            Open the full events calendar
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      {preview.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2
            className="font-display text-brand-navy"
            style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}
          >
            This week&apos;s short list
          </h2>

          <ul className="space-y-3">
            {preview.map((event) => {
              const { href, isInternal } = getEventLink(event);
              const dateRange = formatEventDateRange(event);
              return (
                <li key={event.id}>
                  <Link
                    href={href}
                    target={isInternal ? undefined : '_blank'}
                    rel={isInternal ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-4 py-4 px-5 min-h-[72px]
                               rounded-2xl border border-neutral-200 bg-white
                               transition-colors hover:border-accent-400 hover:bg-neutral-50"
                  >
                    <div
                      aria-hidden
                      className="w-2 h-full self-stretch rounded-full shrink-0"
                      style={{
                        background:
                          event.endDate === '2099-12-31'
                            ? '#0ea5e9'
                            : '#f97316',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                          {event.ip}
                        </span>
                        <span className="text-xs text-neutral-400" aria-hidden>·</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <MapPin size={12} aria-hidden />
                          {event.city}
                        </span>
                      </div>
                      <div className="font-semibold text-neutral-900 text-sm leading-snug">
                        {event.title}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">{dateRange}</div>
                    </div>
                    <ArrowRight size={18} className="text-neutral-400 shrink-0" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: '1.25rem' }}>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1.5 text-accent-600 font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              See every active event on the live calendar
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '2rem' }}>
          <h2
            className="font-display text-brand-navy"
            style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}
          >
            Related hubs
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/category/cafes"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
            >
              <Sparkles size={14} className="text-accent-600" aria-hidden />
              Collab Cafes
            </Link>
            <Link
              href="/category/destinations"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
            >
              <MapPin size={14} className="text-accent-600" aria-hidden />
              Destinations
            </Link>
            <Link
              href="/category/experiences"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
            >
              <Sparkles size={14} className="text-accent-600" aria-hidden />
              Experiences
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

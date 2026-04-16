import Link from 'next/link';
import { getAllEvents, type CollabEvent } from '@/lib/events';

// Time-dependent computation lives outside the component body to satisfy
// react-hooks/purity. Date.now() runs at SSR/ISR time.
function computeEndingSoon(): { ending: CollabEvent[]; nowMs: number } {
  const now = Date.now();
  const ending = getAllEvents()
    .filter(
      (e) =>
        e.endDate !== '2099-12-31' &&
        new Date(e.startDate).getTime() <= now &&
        new Date(e.endDate).getTime() > now,
    )
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, 3);
  return { ending, nowMs: now };
}

function daysUntil(iso: string, nowMs: number): number {
  return Math.ceil((new Date(iso).getTime() - nowMs) / 86_400_000);
}

export default function CountdownStrip() {
  const { ending, nowMs } = computeEndingSoon();

  if (ending.length === 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Ending soon
        </span>
        {ending.map((e) => {
          const d = daysUntil(e.endDate, nowMs);
          const href = e.articleSlug
            ? `/articles/${e.articleSlug}`
            : e.officialUrl || e.source;
          const internal = !!e.articleSlug;
          const linkProps = internal
            ? {}
            : ({ target: '_blank', rel: 'noopener noreferrer nofollow' } as const);
          return (
            <Link
              key={e.id}
              href={href}
              {...linkProps}
              className="rounded-full px-4 py-1 bg-white border border-amber-300 font-medium text-slate-800 hover:border-orange-500 hover:text-orange-700 transition"
            >
              {e.ip}&nbsp;·{' '}
              <span className="text-orange-600 font-semibold">{d}d left</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

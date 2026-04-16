import Link from 'next/link';
import Image from 'next/image';
import { getAllEvents } from '@/lib/events';
import popularData from '@/data/popular.json';

const DAY = 86_400_000;
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const IP_GRADIENTS: Record<string, string> = {
  Chiikawa: 'bg-gradient-to-br from-[#FFE4A3] to-[#FFB800]',
  'Detective Conan': 'bg-gradient-to-br from-[#1E3A8A] to-[#EF4444]',
  'Jujutsu Kaisen': 'bg-gradient-to-br from-[#1F2937] to-[#7C3AED]',
  'My Hero Academia': 'bg-gradient-to-br from-[#10B981] to-[#F59E0B]',
  'One Piece': 'bg-gradient-to-br from-[#EF4444] to-[#FBBF24]',
  Hololive: 'bg-gradient-to-br from-[#F472B6] to-[#60A5FA]',
  Sanrio: 'bg-gradient-to-br from-[#FDA4AF] to-[#FECACA]',
  Rilakkuma: 'bg-gradient-to-br from-[#D97706] to-[#FBBF24]',
  'Yu-Gi-Oh!': 'bg-gradient-to-br from-[#7C2D12] to-[#FCD34D]',
  'Super Mario': 'bg-gradient-to-br from-[#DC2626] to-[#FCD34D]',
  'Demon Slayer': 'bg-gradient-to-br from-[#064E3B] to-[#000000]',
};
const DEFAULT_GRADIENT = 'bg-gradient-to-br from-[#6B7280] to-[#1F2937]';

function gradientForIp(ip: string): string {
  if (IP_GRADIENTS[ip]) return IP_GRADIENTS[ip];
  for (const key of Object.keys(IP_GRADIENTS)) {
    if (ip.startsWith(key)) return IP_GRADIENTS[key];
  }
  return DEFAULT_GRADIENT;
}

// 12 priority IPs for the cloud — link to existing canonical pages,
// fallback to /calendar where no article exists yet.
const IP_LINKS: { ip: string; href: string; pill: string }[] = [
  { ip: 'Chiikawa', href: '/articles/chiikawa-bakery-harajuku-guide-2026', pill: 'bg-amber-400 text-amber-950' },
  { ip: 'Detective Conan', href: '/articles/detective-conan-cafe-2026-japan-guide', pill: 'bg-blue-700 text-white' },
  { ip: 'Jujutsu Kaisen', href: '/articles/jujutsu-kaisen-cafes-japan-2026-guide', pill: 'bg-violet-700 text-white' },
  { ip: 'My Hero Academia', href: '/articles/my-hero-academia-cafe-tokyo-2026', pill: 'bg-emerald-600 text-white' },
  { ip: 'One Piece', href: '/articles/one-piece-tokyo-guide-2026', pill: 'bg-red-600 text-white' },
  { ip: 'Hololive', href: '/calendar', pill: 'bg-pink-500 text-white' },
  { ip: 'Sanrio', href: '/calendar', pill: 'bg-pink-300 text-pink-950' },
  { ip: 'Rilakkuma', href: '/calendar', pill: 'bg-amber-700 text-white' },
  { ip: 'Yu-Gi-Oh!', href: '/calendar', pill: 'bg-amber-900 text-amber-100' },
  { ip: 'Super Mario', href: '/articles/universal-cool-japan-2026-guide', pill: 'bg-red-500 text-white' },
  { ip: 'Demon Slayer', href: '/articles/demon-slayer-pilgrimage-tokyo', pill: 'bg-emerald-900 text-white' },
  { ip: 'Spy × Family', href: '/articles/spy-family-tokyo-fan-day-2026', pill: 'bg-slate-700 text-white' },
];

function fmtRange(startDate: string, endDate: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m, 10) - 1]} ${parseInt(day, 10)}`;
  };
  return `${fmt(startDate)}–${fmt(endDate)}`;
}

export default function BentoGrid() {
  const now = Date.now();
  const all = getAllEvents();

  const activeNow = all
    .filter((e) => {
      const s = new Date(e.startDate).getTime();
      const en = new Date(e.endDate).getTime();
      return s <= now && en > now;
    })
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, 6);

  const thisWeek = all
    .filter((e) => {
      const s = new Date(e.startDate).getTime();
      return s >= now && s <= now + 7 * DAY;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  const totalActive = all.filter((e) => {
    const s = new Date(e.startDate).getTime();
    const en = new Date(e.endDate).getTime();
    return s <= now && en > now;
  }).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ── Tile 1: Active Now (large 2x2) ─────────────────── */}
        <div className="md:col-span-2 md:row-span-2 bg-orange-50 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
          <div className="flex items-baseline justify-between mb-4">
            <h2
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Active Now
            </h2>
            <span className="text-xs uppercase tracking-wider text-orange-700 font-bold">
              {activeNow.length} cafes
            </span>
          </div>
          <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeNow.map((e) => {
              const href = e.articleSlug
                ? `/articles/${e.articleSlug}`
                : e.officialUrl || e.source;
              const internal = !!e.articleSlug;
              const linkProps = internal
                ? {}
                : ({ target: '_blank', rel: 'noopener noreferrer nofollow' } as const);
              return (
                <li key={e.id}>
                  <Link
                    href={href}
                    {...linkProps}
                    className="flex gap-3 rounded-xl bg-white border border-orange-100 p-3 hover:border-orange-400 hover:shadow transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-[0.65rem] font-bold text-center px-1 leading-tight shrink-0 ${gradientForIp(e.ip)}`}
                    >
                      {e.ip.length > 14 ? e.ip.split(' ')[0] : e.ip}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                        {e.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {e.venue.split(' ').slice(0, 4).join(' ')}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
            {activeNow.length === 0 && (
              <li className="text-sm text-slate-500">No active events right now.</li>
            )}
          </ul>
          <Link
            href="/calendar?filter=active"
            className="mt-4 text-sm font-semibold text-orange-700 hover:text-orange-900 self-end"
          >
            See all {totalActive}+ active →
          </Link>
        </div>

        {/* ── Tile 2: This Week ──────────────────────────────── */}
        <div className="bg-teal-50 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
          <h2
            className="text-2xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            This Week
          </h2>
          <ul className="flex-1 flex flex-col gap-2">
            {thisWeek.map((e) => {
              const dow = WEEKDAY[new Date(e.startDate).getUTCDay()];
              const href = e.articleSlug
                ? `/articles/${e.articleSlug}`
                : e.officialUrl || e.source;
              const internal = !!e.articleSlug;
              const linkProps = internal
                ? {}
                : ({ target: '_blank', rel: 'noopener noreferrer nofollow' } as const);
              return (
                <li key={e.id}>
                  <Link
                    href={href}
                    {...linkProps}
                    className="flex gap-3 items-start rounded-lg bg-white border border-teal-100 p-2 hover:border-teal-400 hover:shadow-sm transition"
                  >
                    <span className="rounded-md bg-teal-600 text-white text-[0.6rem] font-bold px-2 py-1 uppercase tracking-wider shrink-0">
                      {dow}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                        {e.ip}
                      </p>
                      <p className="text-[0.7rem] text-slate-500 truncate">
                        {fmtRange(e.startDate, e.endDate)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
            {thisWeek.length === 0 && (
              <li className="text-sm text-slate-500">No new openings this week.</li>
            )}
          </ul>
          <Link
            href="/calendar"
            className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View full calendar →
          </Link>
        </div>

        {/* ── Tile 3: Popular This Month ─────────────────────── */}
        <div className="bg-amber-50 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
          <h2
            className="text-xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            Popular This Month
          </h2>
          <ul className="flex-1 flex flex-col gap-3">
            {popularData.articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="flex gap-3 rounded-lg bg-white border border-amber-100 p-2 hover:border-amber-400 hover:shadow-sm transition"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-amber-100">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 line-clamp-3 leading-tight">
                      {a.title}
                    </p>
                    <span className="inline-block mt-1 text-[0.65rem] font-semibold rounded-full bg-amber-200 text-amber-900 px-2 py-0.5">
                      {a.views} views
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Tile 4: By IP Cloud (full-width bottom row) ────── */}
        <div className="md:col-span-3 bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Browse by IP
            </h2>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              {IP_LINKS.length} franchises
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {IP_LINKS.map(({ ip, href, pill }) => (
              <Link
                key={ip}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform ${pill}`}
              >
                {ip}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

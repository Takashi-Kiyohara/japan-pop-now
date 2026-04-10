import fs from 'fs';
import path from 'path';

/**
 * Canonical data layer for collab cafe pSEO pages.
 *
 * Source of truth: content/cafes/cafes.json (array of Cafe records).
 * Never delete an ended cafe — flip `status` to "ended" so the page remains
 * searchable and archived.
 *
 * See the jpn-collab-cafe-db skill for the full schema contract, validation
 * rules, and the "minimum required before shipping" list. This module does
 * not enforce verification — the skill + PR review does — but the types here
 * make the shape impossible to get wrong in code.
 */

const CAFES_FILE = path.join(process.cwd(), 'content/cafes/cafes.json');

export type CafeStatus = 'active' | 'upcoming' | 'ended' | 'cancelled';

export type ReservationType =
  | 'walk_in'
  | 'required'
  | 'optional'
  | 'lottery'
  | 'first_come';

export interface CafeVenue {
  city: string;
  district: string;
  name: string;
  address: string;
  station: string;
  map_url?: string;
  dates: {
    start: string; // ISO YYYY-MM-DD
    end: string;   // ISO YYYY-MM-DD
  };
  hours: string;
  reservation: ReservationType;
  reservation_method: string | null;
  reservation_url: string | null;
  price_range_jpy: {
    min: number;
    max: number;
  };
  english_menu: boolean | null;
  english_staff: boolean | null;
}

export interface Cafe {
  slug: string;
  status: CafeStatus;
  ip: string;
  ip_slug: string;
  brand: string;
  brand_slug: string;
  title_en: string;
  title_ja: string;
  description_en: string;
  hero_image: string;
  venues: CafeVenue[];
  reservation_summary: string;
  cover_charge_jpy: number | null;
  merch_bonus: string | null;
  menu_highlights: string[];
  source_urls: string[];
  last_verified: string; // ISO YYYY-MM-DD
  verified_by: string;
}

// Module-level cache.
let cachedCafes: Cafe[] | null = null;

function loadRawCafes(): Cafe[] {
  if (cachedCafes) return cachedCafes;
  if (!fs.existsSync(CAFES_FILE)) {
    cachedCafes = [];
    return cachedCafes;
  }
  const raw = fs.readFileSync(CAFES_FILE, 'utf-8');
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    cachedCafes = [];
    return cachedCafes;
  }
  // Filter out any records missing a slug — defensive, in case the JSON is
  // being edited by hand and a skeleton was left in place.
  const cafes = (parsed as Partial<Cafe>[]).filter(
    (c): c is Cafe => typeof c?.slug === 'string' && c.slug.length > 0 && !c.slug.startsWith('_')
  );
  cachedCafes = cafes;
  return cafes;
}

export function getAllCafes(): Cafe[] {
  return loadRawCafes();
}

export function getCafeBySlug(slug: string): Cafe | null {
  return getAllCafes().find((c) => c.slug === slug) ?? null;
}

export function getAllCafeSlugs(): string[] {
  return getAllCafes().map((c) => c.slug);
}

/** Cafes currently running, sorted by earliest end date (most urgent first). */
export function getActiveCafes(): Cafe[] {
  return getAllCafes()
    .filter((c) => c.status === 'active')
    .sort((a, b) => {
      const aEnd = earliestEnd(a);
      const bEnd = earliestEnd(b);
      return aEnd.localeCompare(bEnd);
    });
}

/** Cafes opening soon, sorted by earliest start date. */
export function getUpcomingCafes(): Cafe[] {
  return getAllCafes()
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => {
      const aStart = earliestStart(a);
      const bStart = earliestStart(b);
      return aStart.localeCompare(bStart);
    });
}

/** Cafes opening within N days from today, status active OR upcoming. */
export function getCafesOpeningWithinDays(days: number): Cafe[] {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + days);
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  const todayIso = today.toISOString().slice(0, 10);
  return getAllCafes()
    .filter((c) => c.status === 'upcoming')
    .filter((c) => {
      const start = earliestStart(c);
      return start >= todayIso && start <= cutoffIso;
    })
    .sort((a, b) => earliestStart(a).localeCompare(earliestStart(b)));
}

/** Ended cafes, sorted by most-recent-first for archive display. */
export function getEndedCafes(): Cafe[] {
  return getAllCafes()
    .filter((c) => c.status === 'ended')
    .sort((a, b) => latestEnd(b).localeCompare(latestEnd(a)));
}

/**
 * Related cafes for a given cafe: prefer same IP (active first, then ended),
 * then same brand, then any from the same primary city. Returns up to `limit`.
 */
export function getRelatedCafes(cafe: Cafe, limit = 3): Cafe[] {
  const all = getAllCafes().filter((c) => c.slug !== cafe.slug);
  const sameIp = all.filter((c) => c.ip_slug === cafe.ip_slug);
  const sameBrand = all.filter(
    (c) => c.ip_slug !== cafe.ip_slug && c.brand_slug === cafe.brand_slug
  );
  const sameCity = all.filter(
    (c) =>
      c.ip_slug !== cafe.ip_slug &&
      c.brand_slug !== cafe.brand_slug &&
      c.venues[0]?.city === cafe.venues[0]?.city
  );
  const rank = (c: Cafe) => (c.status === 'active' ? 0 : c.status === 'upcoming' ? 1 : 2);
  const ordered = [
    ...sameIp.sort((a, b) => rank(a) - rank(b)),
    ...sameBrand.sort((a, b) => rank(a) - rank(b)),
    ...sameCity.sort((a, b) => rank(a) - rank(b)),
  ];
  const seen = new Set<string>();
  const out: Cafe[] = [];
  for (const c of ordered) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}

/** All unique IPs present in cafes data, sorted alphabetically. */
export function getAllCafeIps(): { ip: string; ip_slug: string; count: number }[] {
  const counts = new Map<string, { ip: string; ip_slug: string; count: number }>();
  for (const c of getAllCafes()) {
    const key = c.ip_slug;
    const prev = counts.get(key);
    counts.set(key, {
      ip: c.ip,
      ip_slug: c.ip_slug,
      count: (prev?.count ?? 0) + 1,
    });
  }
  return Array.from(counts.values()).sort((a, b) => a.ip.localeCompare(b.ip));
}

/**
 * Cafes to include in sitemap.xml. Ended cafes are intentionally excluded —
 * they remain crawlable via internal links, and their pages return normally,
 * but we do not advertise them in the sitemap to keep freshness signal high.
 */
export function getCafesForSitemap(): Cafe[] {
  return getAllCafes().filter((c) => c.status === 'active' || c.status === 'upcoming');
}

// ---- internal helpers ----

function earliestStart(c: Cafe): string {
  if (c.venues.length === 0) return '9999-12-31';
  return c.venues.map((v) => v.dates.start).sort()[0];
}

function earliestEnd(c: Cafe): string {
  if (c.venues.length === 0) return '9999-12-31';
  return c.venues.map((v) => v.dates.end).sort()[0];
}

function latestEnd(c: Cafe): string {
  if (c.venues.length === 0) return '0000-01-01';
  return c.venues
    .map((v) => v.dates.end)
    .sort()
    .slice(-1)[0];
}

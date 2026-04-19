/**
 * Editor's Picks — curated articles the Japan Pop Now team actually visited,
 * with first-hand pull quotes and the date of the visit.
 *
 * SSoT for:
 *  - Homepage Editor's Picks section
 *  - Contributor Spotlight (filtered by photosBy)
 *  - /experiences hub "Visited" badge
 *
 * Guardrails:
 *  - Every slug MUST exist under content/articles/*.md(x). Build fails if not.
 *  - visitedDate is ISO YYYY-MM-DD, required for the "Visited {date}" badge.
 *  - photosBy: 'Takapon' | 'Moe'. Used for the Contributor Spotlight filter.
 *  - quote is a single-sentence pull quote lifted from the visit report.
 *  - Keep the list at 6-10 entries; older picks should rotate off rather
 *    than accumulate. Update when a new first-hand visit ships.
 */

export type PickContributor = 'Takapon' | 'Moe';

export interface EditorPick {
  slug: string;
  visitedDate: string;
  quote: string;
  photosBy: PickContributor;
  /** Optional shortline shown under the pull quote, 1 sentence max. */
  context?: string;
}

export const EDITORS_PICKS: EditorPick[] = [
  {
    slug: 'one-piece-tokyo-guide-2026',
    visitedDate: '2026-04-08',
    quote: 'The rooftop Mugiwara photo spot is gone. The replacement at Odaiba is better.',
    photosBy: 'Takapon',
    context: 'First visit since the 2025 relocation. The new queue flow works.',
  },
  {
    slug: 'chiikawa-bakery-harajuku-guide-2026',
    visitedDate: '2026-04-12',
    quote: 'We queued twice. The 07:40 arrival got us in. The 10:00 arrival did not.',
    photosBy: 'Moe',
    context: 'Photography notes and pass-through timing for the Tokyu Plaza location.',
  },
  {
    slug: 'blue-lock-tokyo-skytree-cafe-2026',
    visitedDate: '2026-04-15',
    quote: 'Ninety minutes of it felt like a theme park.',
    photosBy: 'Takapon',
    context: 'Season 2 takeover peak weekend. Reservation held 9 days out.',
  },
  {
    slug: 'akihabara-arcade-rhythm-games-guide-2026',
    visitedDate: '2026-04-17',
    quote: 'Three days of testing, four thousand yen in coins, and one honest machine ranking.',
    photosBy: 'Takapon',
    context: 'The rhythm game first-timer guide, with POV shots from each major cabinet.',
  },
  {
    slug: 'demon-slayer-rerun-cafe-ufotable-2026',
    visitedDate: '2026-04-18',
    quote: 'Advance-lottery only. Walk-in was never a realistic option this round.',
    photosBy: 'Takapon',
    context: 'ufotable Tokyo confirmed seating flow and the character-pair drink order.',
  },
  {
    slug: 'jujutsu-kaisen-cafes-japan-2026-guide',
    visitedDate: '2026-04-11',
    quote: 'The nine-venue Sweets Paradise model is the anti-FOMO collab.',
    photosBy: 'Moe',
    context: 'JJK 5th-anniversary buffet format covered across three cities.',
  },
  {
    slug: 'golden-week-2026-anime-events-complete-guide',
    visitedDate: '2026-04-20',
    quote: 'Fifteen events in seven days. Book the first four from home, walk into the rest.',
    photosBy: 'Takapon',
    context: 'The GW 2026 plan, verified against every operator on the day of publishing.',
  },
];

/** Get the N most recent picks, newest first. */
export function getRecentPicks(limit = 3): EditorPick[] {
  return [...EDITORS_PICKS]
    .sort((a, b) => b.visitedDate.localeCompare(a.visitedDate))
    .slice(0, limit);
}

/** Filter picks by contributor for the Contributor Spotlight section. */
export function getPicksByContributor(contributor: PickContributor): EditorPick[] {
  return EDITORS_PICKS.filter((p) => p.photosBy === contributor)
    .sort((a, b) => b.visitedDate.localeCompare(a.visitedDate));
}

/** Check if an article slug has an editor's pick record (for badge rendering). */
export function getPickForSlug(slug: string): EditorPick | null {
  return EDITORS_PICKS.find((p) => p.slug === slug) ?? null;
}

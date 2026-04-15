/**
 * Category → affiliate product mapping for in-article CTAs.
 * Centralizes the choice of program/headline/URL so ArticleBody.tsx and any
 * future inline mentions stay in sync.
 */

export type AffiliateProgram = 'klook' | 'booking' | 'amazon' | 'getyourguide';

export interface AffiliateProduct {
  program: AffiliateProgram;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  /** Display price for end-of-article variant. */
  priceFrom?: string;
  /** Short inline copy: e.g. "Book Akihabara walking tour on Klook from ¥9,750". */
  inlineCopy?: string;
}

const KLOOK_AFF_ID = process.env.NEXT_PUBLIC_KLOOK_AFF_ID || '117469';
const BOOKING_AFF_ID = process.env.NEXT_PUBLIC_BOOKING_AFF_ID || '';
const GYG_AFF_ID = process.env.NEXT_PUBLIC_GETYOURGUIDE_AFF_ID || '';

const klook = (path: string) =>
  `https://www.klook.com/en-US${path}${path.includes('?') ? '&' : '?'}aff_id=${KLOOK_AFF_ID}`;

export function getAffiliateProductForCategory(category: string): AffiliateProduct | null {
  switch (category) {
    case 'collab-cafes':
      return {
        program: 'klook',
        icon: '🎫',
        title: 'Skip the Booking Hassle',
        description:
          'Book anime collab cafe experiences and skip-the-line tickets through Klook — English support, free cancellation on most bookings.',
        buttonText: 'Browse Anime Experiences',
        href: klook('/search/?query=anime+collab+cafe+experience+tokyo'),
        priceFrom: 'from ¥3,800',
        inlineCopy: 'Book anime cafe experiences on Klook from ¥3,800',
      };
    case 'anime-pilgrimage':
      return {
        program: 'klook',
        icon: '🚅',
        title: 'Get There by Rail',
        description:
          'The Japan Rail Pass covers most pilgrimage routes. Compare 7, 14, and 21-day options — prices recently dropped.',
        buttonText: 'Compare JR Pass Prices',
        href: klook('/activity/1523-japan-rail-pass-jr-pass'),
        priceFrom: 'from ¥50,000 / 7 days',
        inlineCopy: 'Compare JR Pass options on Klook from ¥50,000',
      };
    case 'area-guides':
      return {
        program: 'booking',
        icon: '🏨',
        title: 'Stay Near the Action',
        description:
          'Find hotels in the best anime districts — from ¥3,000/night capsule hotels to themed rooms. Free cancellation on most bookings.',
        buttonText: 'Search Hotels',
        href: `https://www.booking.com/searchresults.html?ss=Ikebukuro%2C+Tokyo&aid=${BOOKING_AFF_ID}`,
        priceFrom: 'from ¥3,000 / night',
        inlineCopy: 'Search anime-district hotels on Booking.com from ¥3,000/night',
      };
    case 'travel-tips':
      return {
        program: 'klook',
        icon: '📱',
        title: 'Stay Connected in Japan',
        description:
          'Get an eSIM before you land — instant activation, no physical SIM swap needed. Data plans from ¥1,000 for 7 days.',
        buttonText: 'Compare eSIM Plans',
        href: klook('/activity/109393-japan-esim-high-speed-internet-qr-code-voucher'),
        priceFrom: 'from ¥1,000 / 7 days',
        inlineCopy: 'Compare Japan eSIM plans on Klook from ¥1,000',
      };
    case 'events':
      return {
        program: 'klook',
        icon: '🎟️',
        title: 'Book Tickets Early',
        description:
          'Anime events sell out fast — Klook offers English-language ticket purchases for major venues with mobile entry.',
        buttonText: 'Browse Event Tickets',
        href: klook('/search/?query=anime+event+japan'),
        priceFrom: 'from ¥2,500',
        inlineCopy: 'Book anime event tickets on Klook from ¥2,500',
      };
    default:
      return null;
  }
}

// Suppress lint for currently-unused affiliate IDs reserved for future variants.
void GYG_AFF_ID;

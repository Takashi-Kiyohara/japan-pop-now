import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Affiliate disclosure for Japan Pop Now — how we earn commissions through affiliate partnerships.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/affiliate-disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure | Japan Pop Now',
    description: 'Affiliate disclosure for Japan Pop Now — how we earn commissions through affiliate partnerships.',
    url: 'https://www.japan-pop-now.com/affiliate-disclosure',
    type: 'website',
  },
};

export default function AffiliateDisclosure() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ background: '#fafaf9' }}>
      <h1
        className="mb-6"
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#14213d',
        }}
      >
        Affiliate Disclosure
      </h1>
      <div className="prose">
        <p>
          <strong>Last updated: April 27, 2026.</strong> Japan Pop Now is a participant in
          several affiliate programs, including the Amazon Associates Program, the Klook
          Affiliate Program, the Agoda Partner Program, Booking.com Affiliate Partner
          Program, the GetYourGuide Partner Program, the Viator Affiliate Network, and the
          Awin network (which includes a number of Japan travel, retail, and lifestyle
          advertisers). We are also working toward Google AdSense participation; that
          relationship, when active, will be governed by AdSense&apos;s own policies in
          addition to the rules we describe here.
        </p>
        <p>
          When you click an affiliate link on this site and complete a qualifying purchase
          or booking, the publication may earn a small commission. This commission is paid by
          the merchant or platform — it does not increase the price you pay, and it does not
          change the products or experiences available to you. Commissions help fund the
          editor's research, occasional field-check travel, fact-checking, and hosting costs
          that keep Japan Pop Now free for readers worldwide.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#14213d', marginTop: '24px', marginBottom: '8px' }}>
          How we choose what to recommend
        </h2>
        <p>
          Editorial integrity is non-negotiable. We only recommend products, hotels,
          activities, and services that we have either personally used, verified against
          official operator sources, or believe will genuinely help anime fans and pop
          culture travelers in Japan. We do not accept payment in exchange for positive
          coverage, and our editorial team reserves the right to mention competing
          products, decline to feature a sponsor, or update guidance when conditions
          change. If a recommendation no longer holds up — for example, a collab cafe
          ends, a tour operator&apos;s rating drops, or a hotel&apos;s service quality
          falls — we update or remove the affiliate link, even if it costs us revenue.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#14213d', marginTop: '24px', marginBottom: '8px' }}>
          How affiliate links are marked
        </h2>
        <p>
          Affiliate links on this site are clearly marked. We add a short notice at the top
          of every article that contains affiliate links, we use the
          <code> rel=&quot;sponsored nofollow noopener&quot;</code> attribute on outbound
          affiliate URLs, and we open them in a new tab. This is consistent with the U.S.
          Federal Trade Commission&apos;s endorsement guidelines, the UK Advertising
          Standards Authority CAP code, and Japan&apos;s Consumer Affairs Agency
          (消費者庁) stealth-marketing rules that took effect in October 2023.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#14213d', marginTop: '24px', marginBottom: '8px' }}>
          Questions or concerns
        </h2>
        <p>
          If you have any questions about our affiliate relationships, want to report a
          broken or outdated link, or believe a piece of content is missing a disclosure,
          please <Link href="/contact" style={{ color: '#f97316', textDecoration: 'underline' }}>contact us</Link>
          {' '}— we read every message and update guidance promptly.
        </p>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Affiliate disclosure for Japan Pop Now — how we earn commissions through affiliate partnerships.',
  alternates: {
    canonical: 'https://japan-pop-now.com/affiliate-disclosure',
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
          Japan Pop Now is a participant in several affiliate programs, including
          the Amazon Associates Program, Klook Affiliate Program, the Awin
          network (which includes a number of Japan travel and retail advertisers),
          and the GetYourGuide Partner Program.
        </p>
        <p>
          This means we may earn a commission when you click on links to these
          services and make a purchase or booking. This comes at no additional
          cost to you and helps support the creation of free content on this site.
        </p>
        <p>
          We only recommend products and services that we genuinely believe will
          be helpful to anime fans and Japan travelers. Our editorial content is
          not influenced by our affiliate partnerships.
        </p>
        <p>
          Affiliate links on this site are marked with a small badge or noted
          in the surrounding text. If you have any questions about our affiliate
          relationships, please contact us.
        </p>
      </div>
    </div>
  );
}

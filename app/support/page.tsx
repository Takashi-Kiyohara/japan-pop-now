import { Metadata } from 'next';
import { Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Support Japan Pop Now — Buy Us a Coffee' },
  description:
    'Japan Pop Now is independently run. If our guides saved you time planning your Japan trip, chip in to help keep the site free and ad-light.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/support',
  },
  openGraph: {
    title: 'Support Japan Pop Now — Buy Us a Coffee',
    description:
      'Japan Pop Now is independently run. If our guides saved you time planning your Japan trip, chip in to help keep the site free and ad-light.',
    url: 'https://www.japan-pop-now.com/support',
    type: 'website',
  },
};

const SUPPORT_URL =
  process.env.NEXT_PUBLIC_SUPPORT_URL || 'https://www.buymeacoffee.com/japanpopnow';

export default function SupportPage() {
  return (
    <div style={{ background: '#fafaf9' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
          padding: '80px 0 60px',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: '#fb923c' }}
          >
            Support the Site
          </p>
          <h1
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Buy Us a Coffee
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            If a Japan Pop Now guide helped you book a cafe, find a pilgrimage
            spot, or plan a day trip, you can drop a tip to keep this site
            free, ad-light, and independent.
          </p>
        </div>
      </section>

      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)',
        }}
      />

      {/* Main card */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-xl p-6 md:p-10"
          style={{ background: '#fff', border: '1px solid #e7e5e4' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#fff7ed',
                color: '#f97316',
              }}
              aria-hidden
            >
              <Coffee size={24} strokeWidth={1.8} />
            </span>
            <h2
              style={{
                fontFamily:
                  'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#14213d',
              }}
            >
              Why support Japan Pop Now?
            </h2>
          </div>
          <div
            style={{ color: '#44403c', lineHeight: 1.8, fontSize: '0.95rem' }}
          >
            <p className="mb-4">
              Japan Pop Now is run by one person (hi, Takashi Kiyohara) with a small
              on-the-ground team in Tokyo. Every cafe we cover, we visit.
              Every reservation flow we explain, we booked ourselves.
              Translation, research, fact-checking, and field photography all
              happen on our own time.
            </p>
            <p className="mb-4">
              We keep the site free, ad-light, and fully English so
              international anime fans can plan a trip to Japan without
              hitting a Japanese-only paywall. A small tip goes directly back
              into server costs, travel to field-check new collab cafes, and
              keeping our articles factually current.
            </p>
            <p>
              If we saved you an afternoon of Google Translate and guesswork,
              this is a friendly way to say thanks.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#f97316', flex: 1 }}
            >
              <Coffee size={18} strokeWidth={2} />
              Buy Us a Coffee
            </a>
            <a
              href="mailto:snsganbaro@gmail.com?subject=Japan Pop Now — partnership"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: '#fff',
                color: '#14213d',
                border: '1px solid #14213d',
                flex: 1,
              }}
            >
              Sponsor or partner
            </a>
          </div>

          <p
            className="mt-6"
            style={{
              fontSize: '0.8rem',
              color: '#a8a29e',
              lineHeight: 1.6,
            }}
          >
            Tips are entirely optional and do not influence our editorial
            coverage. Japan Pop Now accepts no sponsored content inside
            article bodies. Support is processed by a third-party platform
            (Buy Me a Coffee); we do not receive your card details.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { AUTHOR } from '@/lib/author';

export const metadata: Metadata = {
  title: { absolute: 'Corrections — Japan Pop Now' },
  description:
    'How to report a factual error on Japan Pop Now, and the public log of published corrections.',
  alternates: { canonical: 'https://www.japan-pop-now.com/corrections' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Corrections — Japan Pop Now',
    description: 'Report a factual error, and see the log of published corrections.',
    url: 'https://www.japan-pop-now.com/corrections',
    type: 'website',
  },
};

interface CorrectionEntry {
  date: string;
  article: string;
  change: string;
  source: string;
}

// Corrections are appended here as they are published. Empty until the first
// logged correction.
const CORRECTIONS: CorrectionEntry[] = [];

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#14213d',
  marginBottom: '14px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: '2px solid #e7e5e4',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#14213d',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderBottom: '1px solid #f5f5f4',
  verticalAlign: 'top',
};

export default function CorrectionsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Corrections', href: '/corrections' },
  ];

  return (
    <div style={{ background: '#fafaf9' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <section
        style={{
          background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
          padding: '56px 0 44px',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: '#fb923c' }}
          >
            Corrections
          </p>
          <h1
            className="text-white"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Report an error
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginTop: '14px',
            }}
          >
            Japan Pop Now corrects confirmed factual errors quickly and logs them in public.
          </p>
        </div>
      </section>

      <div
        style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="rounded-xl p-6 md:p-10"
          style={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            lineHeight: 1.7,
            color: '#44403c',
          }}
        >
          <h2 style={headingStyle}>How to report a correction</h2>
          <p style={{ marginBottom: '28px' }}>
            If you spot a price that has moved, an event date that has changed, a venue that has
            closed, or any other factual error, email{' '}
            <a
              href={`mailto:${AUTHOR.email}`}
              style={{ color: '#0d9488', textDecoration: 'underline' }}
            >
              {AUTHOR.email}
            </a>{' '}
            with the article URL and, where possible, the operator source that shows the correct
            information. That last detail lets the correction be verified and published faster.
          </p>

          <h2 style={headingStyle}>How corrections are handled</h2>
          <p style={{ marginBottom: '28px' }}>
            Confirmed factual errors are corrected within two business days. A material correction —
            one that affects a booking or travel decision, such as a price, a date, or an address —
            is noted at the top of the affected article and added to the log below. Cosmetic fixes
            (typos, minor grammar) are made silently and are not logged.
          </p>

          <h2 style={headingStyle}>Correction log</h2>
          {CORRECTIONS.length === 0 ? (
            <p style={{ color: '#78716c' }}>No corrections have been logged yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Article</th>
                  <th style={thStyle}>Correction</th>
                  <th style={thStyle}>Source</th>
                </tr>
              </thead>
              <tbody>
                {CORRECTIONS.map((c, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{c.date}</td>
                    <td style={tdStyle}>{c.article}</td>
                    <td style={tdStyle}>{c.change}</td>
                    <td style={tdStyle}>{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>
    </div>
  );
}

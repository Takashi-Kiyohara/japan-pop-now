import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: { absolute: 'Editorial Policy — Japan Pop Now' },
  description:
    'How Japan Pop Now visits venues, sources images, and uses AI — the verification and transparency standards behind every article.',
  alternates: { canonical: 'https://www.japan-pop-now.com/editorial-policy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Editorial Policy — Japan Pop Now',
    description: 'Site-visit cadence, image sourcing, and AI-use policy for Japan Pop Now.',
    url: 'https://www.japan-pop-now.com/editorial-policy',
    type: 'website',
  },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'How we visit',
    body: [
      'Japan Pop Now splits its reporting between in-person visits and remote review. Tokyo-area collab cafes, area guides, and pilgrimage spots are typically walked before publication when the schedule allows, and venue-access detail — which station exit, how the queue forms, where the merchandise counter sits — reflects on-site observation in those cases. Articles for venues that have not yet been visited carry an explicit "based on operator press materials" note in the opening so readers can calibrate before they travel.',
      'Remote review covers Osaka, Kyoto, and out-of-region venues, plus events whose press materials land faster than the visit schedule. For those, the article draws on operator press kits, official venue pages, Japanese trade press, and visitor-report aggregation — and operator-only claims are cited in-line rather than presented as on-site observation. Reservation walkthroughs reflect an actual end-to-end run of the booking flow, and are re-run whenever an operator changes the process. Time-sensitive facts — prices, hours, addresses, event end dates — are re-verified against the operator on a monthly content sweep.',
    ],
  },
  {
    heading: 'Image sources',
    body: [
      'Every image on the site falls into one of three buckets, each shown with explicit credit and license beside the image. First, original photography, credited "Photo: Japan Pop Now" — venue photos, merchandise displays, and street-context shots taken on visits. Second, openly licensed images, primarily from Wikimedia Commons, credited to the original photographer with the applicable license (CC BY, CC BY-SA, CC0, or public domain) and a link to the source file; attribution is never stripped. Third, operator-supplied press-kit assets — key visuals, food photography, character art — used under the operator’s standard editorial-use grant and credited "Press kit: [operator]".',
      'Japan Pop Now does not generate AI images, and does not present generated content as photography. It does not use Unsplash or generic stock photography for anime and cafe articles, because the editorial signal of a real venue photograph is far stronger than a stock image from somewhere else. Where no licensed photo of an interior exists, a credited exterior shot is used instead and the caption says so explicitly, with the date the venue context was captured.',
    ],
  },
  {
    heading: 'AI policy',
    body: [
      'Japan Pop Now is transparent about where AI tools are used. AI assists with research aggregation — pulling operator announcements and Japanese trade-press coverage into one place — and with the site’s own code and tooling. It does not replace editorial judgment: every article is fact-checked and edited by a human against its cited sources before publication, and the site does not publish unreviewed AI-generated text as editorial.',
      'The site uses zero AI-generated images. All imagery is real photography, or openly licensed and press material, sourced and credited per the image policy above — a generated image is never passed off as a venue photograph. Where a tool assists a verification step, the underlying fact is still confirmed against the operator’s own official source. The principle is straightforward: AI can speed up the gathering and the plumbing, but accuracy, sourcing, and the final editorial call remain a human responsibility.',
    ],
  },
];

export default function EditorialPolicyPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Editorial Policy', href: '/editorial-policy' },
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
            Editorial Policy
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
            How Japan Pop Now is reported
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginTop: '14px',
            }}
          >
            The verification, sourcing, and transparency standards behind every article.
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
          {SECTIONS.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '14px',
                }}
              >
                {section.heading}
              </h2>
              {section.body.map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          <p style={{ fontSize: '0.9rem', color: '#78716c' }}>
            Spotted a factual error? See the{' '}
            <Link href="/corrections" style={{ color: '#0d9488', textDecoration: 'underline' }}>
              corrections page
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}

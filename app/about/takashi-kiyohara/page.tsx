import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AUTHOR } from '@/lib/author';
import { getAllArticles } from '@/lib/articles';
import { getAuthorSchema, getBreadcrumbSchema } from '@/lib/structured-data';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: { absolute: 'About Takashi Kiyohara — Founder & Editor | Japan Pop Now' },
  description:
    'Takashi Kiyohara is the founder and editor of Japan Pop Now — covering anime collab cafes, pilgrimage spots, and pop-culture travel in Japan for international visitors.',
  alternates: { canonical: AUTHOR.url },
  openGraph: {
    title: 'About Takashi Kiyohara — Founder & Editor',
    description:
      'The founder and editor behind Japan Pop Now — how the site is sourced, verified, and reported.',
    url: AUTHOR.url,
    type: 'website',
    images: [
      { url: `https://www.japan-pop-now.com${AUTHOR.avatar}`, alt: AUTHOR.avatarAlt },
    ],
  },
};

const HOW_I_REPORT: string[] = [
  'Every operator-specific claim — a price, a reservation deadline, an event end date, a station exit — is checked against the operator’s own official site before publication, and re-checked on each monthly content sweep. Where two operator sources disagree, the article says so and states which source it follows.',
  'Tokyo-area cafes, area guides, and pilgrimage spots are walked in person before publication when the timing allows; venues covered from operator press materials instead carry an explicit "based on operator press materials" note in the lede. The site does not invent personal experience — articles are written in advisory voice, not as first-person travel claims.',
  'Reservation walkthroughs — Lawson Loppi, BOX cafe LivePocket, Klook checkout — reflect an actual end-to-end run of the booking flow, and are re-run whenever an operator changes the process.',
];

export default function TakashiKiyoharaPage() {
  const recentArticles = getAllArticles().slice(0, 5);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: AUTHOR.name, href: '/about/takashi-kiyohara' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getAuthorSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: 'Home', url: 'https://www.japan-pop-now.com' },
              { name: 'About', url: 'https://www.japan-pop-now.com/about' },
              { name: AUTHOR.name, url: AUTHOR.url },
            ])
          ),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section
          style={{
            background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
            padding: '48px 0 56px',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-7">
            <Image
              src={AUTHOR.avatar}
              alt={AUTHOR.avatarAlt}
              width={132}
              height={132}
              priority
              className="rounded-full object-cover flex-shrink-0"
              style={{ border: '3px solid rgba(255,255,255,0.85)' }}
            />
            <div className="text-center sm:text-left">
              <p
                className="text-sm font-bold tracking-widest uppercase mb-2"
                style={{ color: '#fb923c' }}
              >
                Founder &amp; Editor
              </p>
              <h1
                className="text-white mb-3"
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: 'clamp(1.9rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {AUTHOR.name}
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}
              >
                {AUTHOR.locationLine}
              </p>
              <a
                href={AUTHOR.socials.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: '#f97316', color: '#fff' }}
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>

        <div
          style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }}
        />

        {/* Body */}
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
            <Section heading="Who writes Japan Pop Now">
              <p style={{ marginBottom: '12px' }}>{AUTHOR.bio}</p>
              <p>
                {AUTHOR.name} writes, photographs, fact-checks, and edits the site. Japan Pop Now
                exists to get accurate, English-language information about Japan&apos;s anime scene —
                limited-cafe dates, Japanese-only reservation rules, which venues accept an overseas
                card — to international visitors while it is still useful to them.
              </p>
            </Section>

            <Section heading="How I report">
              {HOW_I_REPORT.map((para, i) => (
                <p key={i} style={{ marginBottom: i < HOW_I_REPORT.length - 1 ? '12px' : 0 }}>
                  {para}
                </p>
              ))}
            </Section>

            <Section heading="Topics I cover">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AUTHOR.expertise.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 12px',
                      borderRadius: '99px',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: '14px', fontSize: '0.95rem', color: '#57534e' }}>
                Day to day that means anime collaboration cafes, seichi-junrei pilgrimage routes,
                theme-park collabs, and the practical logistics of pop-culture travel — across Tokyo,
                Osaka, and Kyoto.
              </p>
            </Section>

            <Section heading="Editorial standards" last>
              <p>
                Japan Pop Now follows a published{' '}
                <Link
                  href="/editorial-policy"
                  style={{ color: '#0d9488', textDecoration: 'underline' }}
                >
                  editorial policy
                </Link>{' '}
                covering site visits, image sourcing, and AI use, and keeps a public{' '}
                <Link
                  href="/corrections"
                  style={{ color: '#0d9488', textDecoration: 'underline' }}
                >
                  corrections log
                </Link>{' '}
                for any factual error a reader flags.
              </p>
            </Section>
          </div>
        </article>

        {/* Recent articles */}
        {recentArticles.length > 0 && (
          <section style={{ background: '#fff', borderTop: '1px solid #e7e5e4' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '24px',
                }}
              >
                Recent articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} size="sm" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Connect */}
        <section style={{ background: '#14213d', padding: '52px 0', textAlign: 'center' }}>
          <div className="max-w-2xl mx-auto px-4">
            <h2
              className="text-white mb-3"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
              }}
            >
              Connect
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px', lineHeight: 1.7 }}>
              Tips, corrections, and partnership inquiries are all welcome.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href={AUTHOR.socials.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                style={{ color: '#fb923c', fontWeight: 600, fontSize: '0.9rem' }}
              >
                LinkedIn
              </a>
              <a
                href={AUTHOR.socials.threads}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fb923c', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Threads
              </a>
              <a
                href={AUTHOR.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fb923c', fontWeight: 600, fontSize: '0.9rem' }}
              >
                X
              </a>
              <a
                href={`mailto:${AUTHOR.email}`}
                style={{ color: '#fb923c', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Email
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Section({
  heading,
  children,
  last,
}: {
  heading: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 0 : '28px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#14213d',
          marginBottom: '12px',
        }}
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

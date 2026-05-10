import { Metadata } from 'next';
import { AUTHOR } from '@/lib/author';

export const metadata: Metadata = {
  title: { absolute: 'Terms of Service — Japan Pop Now' },
  description:
    'Terms governing use of japan-pop-now.com — content licensing, affiliate disclosures, user conduct, and limitations of liability.',
  alternates: { canonical: 'https://www.japan-pop-now.com/terms' },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. Acceptance of Terms',
    body: [
      `These Terms of Service ("Terms") govern your use of japan-pop-now.com (the "Site"), operated by ${AUTHOR.name} ("we", "us"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please discontinue use.`,
      `These Terms apply to all visitors, readers, and contributors. Use of the Site constitutes acceptance of these Terms in their then-current form. We may revise the Terms from time to time; the "Last updated" date below indicates when this version took effect.`,
      `Last updated: 2026-05-10. We will post material changes to this page; continued use after a change constitutes acceptance of the revised Terms.`,
    ],
  },
  {
    heading: '2. Editorial scope and content nature',
    body: [
      `The Site provides English-language editorial coverage of Japan's anime, collab cafe, pilgrimage, and pop-culture travel scene. Articles aggregate publicly available information from operator press releases, official venue pages, Japanese trade media, and openly licensed image archives such as Wikimedia Commons.`,
      `Information about prices, hours, addresses, reservation rules, and event dates is sourced from operator pages at the time of publication. Operators frequently change these details with little notice. The Site verifies high-impact facts (price, reservation deadlines, event end dates) before publication, but cannot guarantee accuracy at the moment you read an article. You are responsible for confirming critical details against the operator's official site before traveling, booking, or making a purchase decision.`,
      `Articles include hedging language such as "as of [month] 2026" or "per the operator's announcement" where time-sensitive facts apply. Treat any operator-specific claim as a snapshot of the press deck on the publication date, not an ongoing guarantee.`,
    ],
  },
  {
    heading: '3. Intellectual property',
    body: [
      `Original written content on the Site (article text, page layouts, code, comparison tables, route plans, original analysis) is © ${AUTHOR.name} unless otherwise noted. You may share short excerpts (up to roughly two paragraphs or 200 words) for non-commercial commentary, review, or news reporting under fair use principles, with attribution and a link back to the source article.`,
      `Wholesale republication, scraping, or training of large-language-model systems on Site content without prior written consent is not permitted. If you operate an automated crawler that ignores our robots.txt, we may take technical and legal steps to block it.`,
      `Images on the Site fall into three categories: (a) original photography credited "Japan Pop Now" or "Photo: ${AUTHOR.name}", (b) Wikimedia Commons or other openly licensed images credited to the original photographer with the applicable license (CC BY 2.0 / CC BY-SA 3.0 / CC BY-SA 4.0 / CC0 / public domain), and (c) operator-supplied press kit assets used under the operator's standard editorial-use grant. Images carry their own license terms; do not redistribute Site images without checking the original credit and license shown beside each image.`,
      `Third-party trademarks, character names, and IP references (anime titles, character names, venue brand names) are the property of their respective owners. The Site uses these references for descriptive editorial purposes consistent with nominative fair use.`,
    ],
  },
  {
    heading: '4. Affiliate links and partner programs',
    body: [
      `Some links on the Site point to commercial partners — primarily Klook (activities and transit passes), Agoda and Booking.com (hotels), GetYourGuide and Viator (tours and experiences), and Amazon (merchandise). When you click an affiliate link and complete a qualifying purchase, the Site may earn a commission at no extra cost to you.`,
      `Affiliate links are marked with rel="sponsored" and appear within editorial recommendations chosen on merit, not on commission rate. We do not run paid product placements disguised as editorial. The full affiliate disclosure is at /affiliate-disclosure.`,
      `We are independent of every operator we cover. No operator pays for editorial placement, and no operator receives review copy approval before publication. If an operator-product relationship influenced an article (e.g. a complimentary tour seat), the article will say so explicitly in the body text or a disclosure block at the top.`,
    ],
  },
  {
    heading: '5. User conduct',
    body: [
      `When using comment features (Giscus / GitHub Discussions), the contact form, or any other interactive surface, you agree not to: (a) post content that is unlawful, harassing, defamatory, or infringes third-party rights, (b) submit deliberately false or misleading information about events, venues, or pricing, (c) attempt to access systems or data outside the public Site surface, (d) use automated tools to scrape, mirror, or republish Site content beyond fair-use excerpts.`,
      `We reserve the right to remove user contributions that violate these standards, and to block accounts or IP addresses that engage in abuse. We do not pre-moderate every comment; we act on reports and on our own observations.`,
    ],
  },
  {
    heading: '6. Privacy and analytics',
    body: [
      `The Site uses Google Analytics 4 with anonymized IP addresses for aggregate traffic measurement. We do not sell user data. Cookies are governed by the consent banner on first visit; declining sets a cookie that disables analytics for your browser.`,
      `Detailed privacy practices, including the cookie list, the categories of data we collect, and how you can request deletion, are at /privacy.`,
    ],
  },
  {
    heading: '7. Disclaimers and limitation of liability',
    body: [
      `The Site is provided "as is" without warranties of any kind, express or implied. We make no warranty that information is current, accurate, or fit for a particular purpose. Travel, dining, and event participation involve risk; you assume responsibility for those risks.`,
      `To the maximum extent permitted by law, ${AUTHOR.name} shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Site, your reliance on Site content, or your interaction with any operator or third-party service mentioned on the Site.`,
      `Some jurisdictions do not allow exclusion of certain warranties or limitation of liability for incidental or consequential damages, so the above may not fully apply to you.`,
    ],
  },
  {
    heading: '8. DMCA / copyright takedown',
    body: [
      `If you believe content on the Site infringes your copyright, please follow the takedown procedure at /dmca. We respond to good-faith DMCA notices and counter-notices in accordance with applicable law.`,
    ],
  },
  {
    heading: '9. Changes to these Terms',
    body: [
      `We may update these Terms when site features, partner programs, or applicable law change. We will update the "Last updated" date at the top of section 1 and, for material changes, post a brief note on the homepage or in our Threads feed. Your continued use of the Site after a change constitutes acceptance.`,
    ],
  },
  {
    heading: '10. Governing law and contact',
    body: [
      `These Terms are governed by the laws of Japan, without regard to conflict-of-laws principles. Any dispute that cannot be resolved through good-faith communication will be brought before the courts of Tokyo District, Japan.`,
      `For questions about these Terms, please contact ${AUTHOR.name} via the contact page at /contact.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: '#fafaf9', minHeight: '100vh' }}>
      <section
        style={{
          background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
          padding: '64px 0 40px',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: '#fb923c' }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '12px', fontSize: '0.95rem' }}>
            Editorial scope, content licensing, affiliate disclosures, and the rules for using japan-pop-now.com.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-xl p-6 md:p-10" style={{ background: '#fff', border: '1px solid #e7e5e4', lineHeight: 1.7, color: '#44403c' }}>
          {SECTIONS.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '12px',
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
        </div>
      </article>
    </div>
  );
}

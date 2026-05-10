import { Metadata } from 'next';
import { AUTHOR } from '@/lib/author';

export const metadata: Metadata = {
  title: { absolute: 'DMCA Copyright Policy — Japan Pop Now' },
  description:
    'How to submit a DMCA copyright takedown notice or counter-notice for content on japan-pop-now.com.',
  alternates: { canonical: 'https://www.japan-pop-now.com/dmca' },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Our copyright commitment',
    body: [
      `Japan Pop Now respects the intellectual-property rights of creators. We aggregate publicly available information about Japan's pop-culture scene and use openly licensed images (Wikimedia Commons CC and CC0, operator press-kit assets, original Japan Pop Now photography). If you believe content on japan-pop-now.com infringes a copyright you own or are authorized to enforce, this page sets out how to submit a takedown notice and how we will respond.`,
    ],
  },
  {
    heading: 'How to submit a DMCA takedown notice',
    body: [
      `Send a written notice to the contact address below that includes ALL of the following:`,
      `1. A physical or electronic signature of the copyright owner or someone authorized to act on the owner's behalf.`,
      `2. Identification of the copyrighted work claimed to be infringed (title, author, registration number if applicable, and a link to an authoritative copy where possible).`,
      `3. Identification of the material on japan-pop-now.com that is claimed to be infringing, with enough specificity that we can locate it — typically the full URL of the page, plus the section, image filename, or quoted text in question.`,
      `4. Your full legal name, postal address, telephone number, and email address.`,
      `5. A statement, made under penalty of perjury, that you have a good-faith belief the disputed use is not authorized by the copyright owner, its agent, or the law.`,
      `6. A statement that the information in the notice is accurate, and that you are the owner or authorized to act on the owner's behalf.`,
    ],
  },
  {
    heading: 'How to submit',
    body: [
      `Email the notice to ${AUTHOR.name} via takashi03157@gmail.com with the subject line "DMCA Takedown Notice — japan-pop-now.com".`,
      `Submitting the notice in writing via this address is sufficient; you do not need to mail a paper copy. We acknowledge receipt within 3 business days.`,
    ],
  },
  {
    heading: 'How we respond',
    body: [
      `On receipt of a valid notice, we will (a) acknowledge receipt within 3 business days, (b) review the disputed content against the notice, and (c) take down or restrict access to the material expeditiously if the claim appears valid on its face.`,
      `We will notify the user or contributor whose material was removed (where contact information is on file) so they may submit a counter-notice if they believe the takedown was in error or based on misidentification.`,
      `We do not adjudicate ownership disputes between competing claimants. Where ownership is contested, we restore content only on receipt of a valid counter-notice and the absence of a court order to the contrary.`,
    ],
  },
  {
    heading: 'How to submit a counter-notice',
    body: [
      `If your content was removed in response to a DMCA notice and you believe the removal was wrongful (for example, the use is fair use, the use is licensed, or the notice misidentified the material), you may submit a counter-notice that includes:`,
      `1. Your physical or electronic signature.`,
      `2. Identification of the material that was removed and the location at which it appeared before removal (the URL where the material was located).`,
      `3. A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification.`,
      `4. Your full legal name, postal address, telephone number, and email address.`,
      `5. A statement that you consent to the jurisdiction of the courts in the district where you reside (or, if you reside outside the United States, the district where japan-pop-now.com is hosted), and that you will accept service of process from the person who provided the original takedown notice or their agent.`,
      `Counter-notices may be sent to the same address as takedown notices, with the subject line "DMCA Counter-Notice — japan-pop-now.com".`,
    ],
  },
  {
    heading: 'Repeat infringer policy',
    body: [
      `In appropriate circumstances and at our discretion, we will terminate the access of users or contributors who are repeat infringers. We may also limit access to japan-pop-now.com or remove material posted by users or contributors who infringe copyright, regardless of whether there is repeat infringement.`,
    ],
  },
  {
    heading: 'False claims',
    body: [
      `Knowingly making a material misrepresentation in a DMCA notice or counter-notice may make you liable for damages, including costs and attorneys' fees, to the affected party under 17 U.S.C. §512(f) and similar provisions of applicable law in other jurisdictions. Please consult a lawyer if you are uncertain whether the use you wish to challenge actually infringes your copyright.`,
    ],
  },
];

export default function DmcaPage() {
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
            DMCA Copyright Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '12px', fontSize: '0.95rem' }}>
            How to submit a copyright takedown notice or counter-notice, and how Japan Pop Now responds.
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

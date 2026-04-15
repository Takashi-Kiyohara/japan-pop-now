import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Japan Pop Now — how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fafaf9' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
          padding: '60px 0 40px',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-white"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '12px' }}>
            Last updated: April 8, 2026
          </p>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-xl p-6 md:p-10"
          style={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            color: '#44403c',
            lineHeight: 1.8,
            fontSize: '0.95rem',
          }}
        >
          <Section title="1. Who We Are">
            <p>
              Japan Pop Now (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website japan-pop-now.com. We are an English-language media site covering anime collab cafes, pilgrimage spots, area guides, and travel tips for international visitors to Japan.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="mb-3">We collect minimal information to improve our site and services:</p>
            <p className="mb-2">
              <strong>Analytics Data:</strong> When you consent to cookies, we use Google Analytics 4 (GA4) to collect anonymized browsing data including pages visited, time on site, approximate location (country/city level), device type, and referral source. No personally identifiable information is collected through analytics.
            </p>
            <p className="mb-2">
              <strong>Newsletter Subscription:</strong> If you subscribe to our newsletter, we collect your email address through our partner Beehiiv. Your email is used solely to send you our newsletter and is never sold or shared with third parties.
            </p>
            <p>
              <strong>Comments:</strong> If you leave a comment via our Giscus integration, your GitHub username and comment content are stored on GitHub. We do not separately store this data.
            </p>
          </Section>

          <Section title="3. Cookies">
            <p className="mb-3">We use the following types of cookies:</p>
            <p className="mb-2">
              <strong>Essential Cookies:</strong> Cookie consent preference (jpn_cookie_consent). These are necessary for the site to function and cannot be disabled.
            </p>
            <p className="mb-2">
              <strong>Analytics Cookies:</strong> Google Analytics cookies (_ga, _ga_*). These are only set after you click &quot;Accept&quot; on our cookie consent banner. If you decline, no analytics cookies are set and no tracking occurs.
            </p>
            <p>
              <strong>Advertising Cookies:</strong> Google AdSense may set cookies for ad personalization. You can opt out of personalized ads through Google&apos;s Ad Settings.
            </p>
          </Section>

          <Section title="4. Third-Party Services">
            <p className="mb-3">We use the following third-party services:</p>
            <p className="mb-2"><strong>Google Analytics 4</strong> — website analytics (only with consent)</p>
            <p className="mb-2"><strong>Google AdSense</strong> — advertising</p>
            <p className="mb-2"><strong>Beehiiv</strong> — newsletter management</p>
            <p className="mb-2"><strong>Vercel</strong> — website hosting</p>
            <p className="mb-2"><strong>Giscus (GitHub)</strong> — article comments</p>
            <p>
              <strong>Affiliate Partners</strong> (Klook, Awin network, GetYourGuide, Amazon Associates) — when you click affiliate links, these partners may set their own cookies. Please refer to their respective privacy policies.
            </p>
          </Section>

          <Section title="5. Affiliate Links">
            <p>
              Some links on Japan Pop Now are affiliate links. When you make a purchase through these links, we may earn a small commission at no additional cost to you. This helps support the site and allows us to continue creating free content. See our{' '}
              <a href="/affiliate-disclosure" style={{ color: '#f97316', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                Affiliate Disclosure
              </a>{' '}
              for more details.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p className="mb-3">You have the right to:</p>
            <p className="mb-2">Decline analytics cookies via our cookie consent banner</p>
            <p className="mb-2">Unsubscribe from our newsletter at any time via the link in each email</p>
            <p className="mb-2">Request deletion of any personal data we hold about you</p>
            <p>
              For any data-related requests, please contact us at{' '}
              <a href="mailto:snsganbaro@gmail.com" style={{ color: '#f97316', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                snsganbaro@gmail.com
              </a>
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              Analytics data is retained according to Google Analytics&apos; default retention settings (14 months). Newsletter email addresses are retained until you unsubscribe. Cookie consent preferences are stored for 1 year.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our site is not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page indicates the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:snsganbaro@gmail.com" style={{ color: '#f97316', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                snsganbaro@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#14213d',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

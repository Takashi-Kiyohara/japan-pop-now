import { Metadata } from 'next';
import Link from 'next/link';
import { AUTHOR } from '@/lib/author';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Japan Pop Now — what we collect, GDPR + CCPA rights, cookie list, retention, data subject request procedures, and contact for privacy inquiries.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Japan Pop Now',
    description:
      'Privacy Policy for Japan Pop Now — GDPR + CCPA rights, cookie list, data subject procedures.',
    url: 'https://www.japan-pop-now.com/privacy',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const COOKIES: { name: string; provider: string; purpose: string; duration: string }[] = [
  { name: 'jpn_cookie_consent', provider: 'japan-pop-now.com', purpose: 'Stores your accept/decline choice for the consent banner', duration: '1 year' },
  { name: '_ga', provider: 'Google Analytics', purpose: 'Distinguishes unique users (anonymized IP)', duration: '2 years' },
  { name: '_ga_<container-id>', provider: 'Google Analytics', purpose: 'Persists session state for the GA4 measurement ID', duration: '2 years' },
  { name: '_gid', provider: 'Google Analytics', purpose: 'Distinguishes users for 24-hour rolling sessions (legacy)', duration: '24 hours' },
  { name: '_vercel_analytics', provider: 'Vercel', purpose: 'Anonymous page-view counter for the hosting platform', duration: 'Session' },
  { name: '__Secure-3PSI / __Secure-3PAPISID', provider: 'Google AdSense', purpose: 'Set only when AdSense is enabled (currently disabled pending approval)', duration: '13 months' },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fafaf9' }}>
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
            Last updated: 2026-05-10
          </p>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="rounded-xl p-6 md:p-10"
          style={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            color: '#44403c',
            lineHeight: 1.75,
            fontSize: '0.95rem',
          }}
        >

          <Section title="1. Introduction">
            <p>
              Japan Pop Now (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the website japan-pop-now.com.
              We are an independent, English-language editorial site covering anime collab cafes, pilgrimage spots,
              area guides, and pop-culture travel for international visitors to Japan. The site is operated by {AUTHOR.name},
              a Tokyo-based editor working under the byline used across the site.
            </p>
            <p>
              This Privacy Policy describes what personal data we collect when you visit the site, how we use it,
              the legal basis for processing under EU GDPR and similar privacy regimes, your rights as a data
              subject, and how to exercise those rights. The policy covers japan-pop-now.com and any subdomains
              we operate. It does not cover third-party sites linked from articles (Klook, operator pages, etc.) —
              those have their own privacy practices.
            </p>
            <p>
              We update this policy when site features, partner programs, or applicable law change. The
              &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Material
              changes are also announced on the homepage or via our Threads feed for at least 14 days. Continued
              use of the site after a material change constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="2. What data we collect">
            <p><strong>Site visit data (analytics):</strong> When you accept cookies, we use Google Analytics 4 (GA4) to collect anonymized browsing data — pages visited, time on site, approximate location at country/city level, device type, browser type, screen size, referral source, and click-through events on internal links. We use Google&apos;s IP-anonymization feature so your full IP address is never stored on our side or transmitted to GA in raw form.</p>
            <p><strong>Cookies:</strong> The detailed cookie inventory is in section 5 below. The consent banner at the bottom of the page on first visit controls whether analytics and advertising cookies are set.</p>
            <p><strong>Newsletter subscription:</strong> If you subscribe to our weekly digest, we collect your email address through our partner Beehiiv. The address is used solely to send you the newsletter and confirmation emails (double-opt-in), and is never sold or shared with third parties beyond Beehiiv&apos;s role as an email-delivery processor.</p>
            <p><strong>Comments (Giscus / GitHub Discussions):</strong> If you leave a comment via the Giscus widget, your GitHub username, avatar URL, and comment text are stored on GitHub under our public discussions repository. Comments are public. We do not separately store comment data; deletion is handled by GitHub&apos;s own tools.</p>
            <p><strong>Contact form / direct email:</strong> When you reach us via the contact form or by emailing snsganbaro@gmail.com, the message contents are received in our standard email inbox. We retain those messages for as long as needed to respond and for any follow-up that might reasonably arise (typically 12 months unless the thread becomes part of a longer relationship).</p>
            <p>We do not collect: financial data, government identifiers, biometric data, health data, or sensitive special categories under GDPR Article 9. We do not run any user-account system on the site.</p>
          </Section>

          <Section title="3. Legal basis for processing (GDPR Article 6)">
            <p>
              Where you are an EU/EEA visitor and GDPR applies, we rely on the following legal bases under Article 6 of the General Data Protection Regulation:
            </p>
            <p><strong>Consent (Article 6(1)(a)):</strong> Analytics cookies and any future advertising cookies are loaded only after you actively click &quot;Accept&quot; on the consent banner. Newsletter subscription is also consent-based — you must enter your email and confirm via the double-opt-in confirmation email before any newsletter content is sent.</p>
            <p><strong>Legitimate interest (Article 6(1)(f)):</strong> We rely on legitimate interest for: (a) basic site security and abuse prevention (server logs, rate-limiting), (b) measuring aggregate site performance via privacy-respecting tools that do not require consent (Vercel Analytics counts page views without setting tracking cookies), and (c) responding to inbound contact-form messages. Our legitimate-interest assessment weighs these processing activities against your reasonable expectations as a visitor to a public editorial website.</p>
            <p><strong>Performance of a contract (Article 6(1)(b)):</strong> When you subscribe to our newsletter, processing your email to deliver the newsletter is necessary to perform the implicit subscription contract.</p>
            <p>You can withdraw consent at any time via the cookie banner (set to decline) or by unsubscribing from the newsletter (one-click link in every email). Withdrawing consent does not affect the lawfulness of processing performed before withdrawal.</p>
          </Section>

          <Section title="4. Cookies — full inventory">
            <p>
              The table below lists every cookie that japan-pop-now.com or its embedded third-party services may set on your browser. Cookies marked &quot;only with consent&quot; do not load until you click &quot;Accept&quot; on the consent banner.
            </p>
            <div style={{ overflowX: 'auto', marginTop: '12px', marginBottom: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f5f5f4' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e7e5e4' }}>Name</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e7e5e4' }}>Provider</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e7e5e4' }}>Purpose</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e7e5e4' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name}>
                      <td style={{ padding: '8px', border: '1px solid #e7e5e4', fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.name}</td>
                      <td style={{ padding: '8px', border: '1px solid #e7e5e4' }}>{c.provider}</td>
                      <td style={{ padding: '8px', border: '1px solid #e7e5e4' }}>{c.purpose}</td>
                      <td style={{ padding: '8px', border: '1px solid #e7e5e4' }}>{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              The consent banner only sets the essential <code>jpn_cookie_consent</code> cookie until you make a choice. Declining the banner does not set any analytics or advertising cookie. Your declined-state preference is stored so the banner does not re-prompt every visit.
            </p>
          </Section>

          <Section title="5. Data subject rights (GDPR + UK GDPR)">
            <p>If you are in the EU/EEA or the UK, you have the following rights under GDPR:</p>
            <p><strong>Right of access (Article 15):</strong> Request a copy of the personal data we hold about you. For most visitors this will be limited to your newsletter email (if subscribed) and any contact-form correspondence.</p>
            <p><strong>Right to rectification (Article 16):</strong> Ask us to correct inaccurate or incomplete data we hold about you.</p>
            <p><strong>Right to erasure / &quot;right to be forgotten&quot; (Article 17):</strong> Ask us to delete your personal data. We will action requests within 30 days unless we have a legal basis to retain (e.g., active dispute, legal hold).</p>
            <p><strong>Right to restrict processing (Article 18):</strong> Ask us to suspend processing while a question about accuracy or lawful basis is being resolved.</p>
            <p><strong>Right to data portability (Article 20):</strong> Receive your data in a structured, commonly used, machine-readable format (CSV or JSON), or have it transferred to another controller where technically feasible.</p>
            <p><strong>Right to object (Article 21):</strong> Object to processing based on legitimate interest or for direct marketing purposes (the latter is unconditional — we will stop immediately).</p>
            <p><strong>Right to lodge a complaint (Article 77):</strong> If you believe our processing infringes GDPR, you may lodge a complaint with your local supervisory authority. We would appreciate a chance to address the issue first via the contact below, but the right to complain is independent of any prior contact with us.</p>
            <p>To exercise any right above, email snsganbaro@gmail.com with subject prefix &quot;GDPR Request — &quot;. We aim to respond within 30 days as required by Article 12(3).</p>
          </Section>

          <Section title="6. CCPA / California Privacy Rights">
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) give you specific rights:
            </p>
            <p>
              <strong>Right to know:</strong> what personal information we collect, the source, the business purpose, and any third-party recipients.
              <strong> Right to delete:</strong> request deletion of personal information we have collected.
              <strong> Right to opt out of sale or sharing:</strong> California residents can opt out of any sale or sharing of personal information. We do not sell personal information in the conventional sense, but cookie-based ad-tech can constitute &quot;sharing&quot; under CPRA. The cookie consent banner&apos;s Decline option is your opt-out. There is no separate &quot;Do Not Sell or Share My Personal Information&quot; link required because we do not engage in cross-context behavioral advertising at this time.
              <strong> Right to non-discrimination:</strong> we will not deny service, charge a different price, or provide a different quality of service because you exercised a CCPA right.
            </p>
            <p>To exercise CCPA rights, email snsganbaro@gmail.com with subject prefix &quot;CCPA Request — &quot;. You may use an authorized agent; we will request reasonable proof of authority before acting on agent requests.</p>
          </Section>

          <Section title="7. Cross-border data transfer">
            <p>
              The site is hosted on Vercel infrastructure (United States). Google Analytics 4 processes data on Google&apos;s US servers. Beehiiv (newsletter) operates from the United States. As a result, personal data collected from EU/EEA / UK visitors is transferred to the United States.
            </p>
            <p>
              We rely on the EU-US Data Privacy Framework (where applicable to the relevant processor) and on Standard Contractual Clauses (SCCs) approved by the European Commission for transfers to processors that have not self-certified under the framework. Vercel and Google both publish DPA / SCC documentation; copies are available on request.
            </p>
            <p>
              For UK visitors, the equivalent UK International Data Transfer Agreement (IDTA) or Addendum to SCCs governs the same transfer relationships.
            </p>
          </Section>

          <Section title="8. Data retention">
            <p>
              <strong>Analytics data:</strong> retained according to GA4 default retention (14 months). After 14 months, GA4 aggregates and discards the user-level event records.
              <strong> Newsletter email addresses:</strong> retained until you unsubscribe. Unsubscribe is one-click via every email; we remove the address from the active list within 24 hours and from backups within 90 days.
              <strong> Contact-form correspondence:</strong> retained 12 months unless an active relationship exists.
              <strong> Cookie consent preferences:</strong> stored for 1 year on your browser.
              <strong> Comments (Giscus):</strong> stored on GitHub indefinitely under the public comments repository; you can delete your own comments via your GitHub account.
            </p>
          </Section>

          <Section title="9. Cookie banner mechanism">
            <p>
              The consent banner appears at the bottom of the page on every first visit. The banner DOM is rendered server-side so it is visible in the initial HTML before any JavaScript executes. Your selection (Accept or Decline) is stored in the <code>jpn_cookie_consent</code> cookie for one year; subsequent visits do not re-prompt unless you clear the cookie. Declining sets the GA opt-out flag (<code>ga-disable-G-XXXXXXXXXX</code>) on the window object, preventing GA4 from initializing on this device.
            </p>
            <p>
              Withdrawing consent later: clear the <code>jpn_cookie_consent</code> cookie via your browser&apos;s Site Settings, then reload to see the banner again and choose Decline.
            </p>
          </Section>

          <Section title="10. Third-party services">
            <p>The site embeds the following third-party services:</p>
            <p><strong>Google Analytics 4</strong> — anonymized website analytics, only after consent. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>Google Privacy Policy</a>.</p>
            <p><strong>Google AdSense</strong> — currently DISABLED pending approval. Will only load when both <code>NEXT_PUBLIC_ADSENSE_ENABLED=true</code> AND a publisher ID env var are set in our hosting config. When enabled, AdSense may set ad-personalization cookies; your consent banner choice controls whether they load.</p>
            <p><strong>Beehiiv</strong> — newsletter management. <a href="https://www.beehiiv.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>Beehiiv Privacy Policy</a>.</p>
            <p><strong>Vercel</strong> — website hosting + Vercel Analytics (page-view counter, no tracking cookies). <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>Vercel Privacy Policy</a>.</p>
            <p><strong>Giscus / GitHub Discussions</strong> — article comments. Stored on GitHub. <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>GitHub Privacy Statement</a>.</p>
            <p><strong>Affiliate partners</strong> (Klook, Agoda, Booking.com, GetYourGuide, Viator, Amazon Associates) — when you click an affiliate link, the partner site sets its own cookies and processes your visit per their own policy. We earn a commission on qualifying purchases; see <Link href="/affiliate-disclosure" style={{ color: '#f97316' }}>Affiliate Disclosure</Link>.</p>
          </Section>

          <Section title="11. Newsletter terms">
            <p>
              The newsletter is a weekly digest of new articles, calendar updates, and curated event roundups. We use double-opt-in: subscribing the form sends a confirmation email; you must click the confirmation link before any newsletter content is sent. Unsubscribe is one-click via the link in every email; on click, you are removed from the active list within 24 hours.
            </p>
            <p>
              We do not share your email address with third parties beyond Beehiiv (the email-delivery processor) and we do not run third-party ads inside the newsletter. The newsletter occasionally references our affiliate partners with the same disclosure standard as the website articles.
            </p>
          </Section>

          <Section title="12. Comments policy">
            <p>
              Comments on japan-pop-now.com are powered by Giscus and stored on GitHub Discussions. To comment, you need a GitHub account; logging in via Giscus uses GitHub&apos;s OAuth flow. We do not see your GitHub password or session token.
            </p>
            <p>
              Comments are public. We do not pre-moderate every comment but reserve the right to hide comments that are spam, unlawful, harassing, defamatory, or off-topic. To delete your own comment, use the GitHub Discussions interface.
            </p>
          </Section>

          <Section title="13. Children (COPPA)">
            <p>
              The site targets adults aged 13 and over. We do not knowingly collect personal information from children under 13, and we do not run targeted advertising or marketing aimed at children. If you are a parent or guardian and believe your child under 13 has submitted personal information through the site, please email snsganbaro@gmail.com and we will delete the information promptly.
            </p>
          </Section>

          <Section title="14. Affiliate disclosure">
            <p>
              The site participates in affiliate programs as listed in section 10. The full affiliate disclosure with details on partner identification and commission structure is at <Link href="/affiliate-disclosure" style={{ color: '#f97316' }}>/affiliate-disclosure</Link>.
            </p>
          </Section>

          <Section title="15. Contact for privacy questions">
            <p>
              For any privacy-related question, request, or complaint, please email{' '}
              <a href="mailto:snsganbaro@gmail.com" style={{ color: '#f97316', textDecoration: 'underline' }}>
                snsganbaro@gmail.com
              </a>{' '}
              with subject prefix &quot;Privacy — &quot;. We acknowledge inquiries within 5 business days and substantive responses within 30 days as required by GDPR Article 12(3).
            </p>
            <p>
              The primary point of contact is {AUTHOR.name}, the operator of the site. We do not have a separately appointed Data Protection Officer (DPO) — the volume of personal data we process does not require one under GDPR Article 37 — but {AUTHOR.name} acts as the informal data-protection point of contact and handles all DSR requests directly.
            </p>
          </Section>

          <Section title="16. Changes to this policy">
            <p>
              We may update this Privacy Policy when site features, partner programs, or applicable law change. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Material changes are announced on the homepage and our Threads feed for at least 14 days before taking effect. Non-material changes (typos, formatting) ship silently. Continued use of the site after a material change constitutes acceptance of the updated policy.
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

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Japan Pop Now team — tips, corrections, partnership inquiries, and more.',
  alternates: {
    canonical: 'https://japan-pop-now.com/contact',
  },
};

export default function ContactPage() {
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
          <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
            Contact
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
            Get in Touch
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Have a tip, correction, or want to work with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

      {/* Content */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-xl p-6 md:p-8"
          style={{ background: '#fff', border: '1px solid #e7e5e4' }}
        >
          <div className="space-y-8">
            {/* General */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '8px',
                }}
              >
                General Inquiries
              </h2>
              <p style={{ color: '#57534e', lineHeight: 1.7, marginBottom: '12px' }}>
                For tips about new collab cafes, corrections to existing articles, or general feedback:
              </p>
              <a
                href="mailto:snsganbaro@gmail.com"
                style={{ color: '#f97316', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                snsganbaro@gmail.com
              </a>
            </div>

            {/* Partnerships */}
            <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '24px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '8px',
                }}
              >
                Business & Partnerships
              </h2>
              <p style={{ color: '#57534e', lineHeight: 1.7, marginBottom: '12px' }}>
                For sponsored content, advertising, or partnership opportunities, please include &quot;Partnership&quot; in your subject line:
              </p>
              <a
                href="mailto:snsganbaro@gmail.com?subject=Partnership Inquiry"
                style={{ color: '#f97316', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                snsganbaro@gmail.com
              </a>
            </div>

            {/* Response time */}
            <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '24px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#14213d',
                  marginBottom: '8px',
                }}
              >
                Social Media
              </h2>
              <p style={{ color: '#57534e', lineHeight: 1.7, marginBottom: '12px' }}>
                Follow us for the latest anime event updates and pop culture news:
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/pop_now_jp/' },
                  { label: 'TikTok', href: 'https://www.tiktok.com/@pop_now_jp' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#14213d',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p style={{ color: '#a8a29e', fontSize: '0.85rem', textAlign: 'center', marginTop: '24px' }}>
          We typically respond within 48 hours.
        </p>
      </section>
    </div>
  );
}

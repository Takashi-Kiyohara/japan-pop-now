'use client';

export type AffiliateVariant = 'inline' | 'mid' | 'end';

interface AffiliateCTAProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  program: string;
  icon?: string;
  category?: string;
  /**
   * inline = single-line bold link with subtle highlight, blends with text
   * mid    = compact recommendation card (default; matches legacy layout)
   * end    = full-width product-style box with price + social proof
   */
  variant?: AffiliateVariant;
  /** Optional price string shown in mid/end variants. */
  priceFrom?: string;
  /** Optional inline copy override; defaults to title + price. */
  inlineCopy?: string;
}

function buildAffiliateUrl(baseUrl: string, category: string = 'general'): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', 'japanpopnow');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', category);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function trackClick(program: string, title: string, url: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'affiliate_cta_click', {
      affiliate_program: program,
      cta_title: title,
      affiliate_url: url,
    });
  }
}

export default function AffiliateCTA({
  title,
  description,
  buttonText,
  href,
  program,
  icon = '🎫',
  category = 'general',
  variant = 'mid',
  priceFrom,
  inlineCopy,
}: AffiliateCTAProps) {
  if (!href || !href.trim()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`AffiliateCTA: Missing affiliate URL for program "${program}"`);
    }
    return null;
  }

  const affiliateUrl = buildAffiliateUrl(href, category);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    offers: {
      '@type': 'Offer',
      url: affiliateUrl,
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
    },
  };

  // ── Inline variant: bold link with highlight, lives inside paragraphs ──────
  if (variant === 'inline') {
    return (
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => trackClick(program, title, affiliateUrl)}
        style={{
          background: '#fff7ed',
          color: '#9a3412',
          fontWeight: 700,
          padding: '1px 6px',
          borderRadius: '4px',
          textDecoration: 'none',
          borderBottom: '1px solid #fb923c',
          whiteSpace: 'nowrap',
        }}
      >
        {inlineCopy || `${title}${priceFrom ? ` ${priceFrom}` : ''}`} →
      </a>
    );
  }

  // ── End-of-article variant: full-width product card ────────────────────────
  if (variant === 'end') {
    const month = new Date().toLocaleString('en-US', { month: 'long' });
    const year = new Date().getFullYear();
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div
          className="my-10 rounded-xl overflow-hidden"
          style={{ border: '1px solid #d6d3d1', background: '#fff' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1e3a5f, #14213d)',
              color: '#fff',
              padding: '36px 24px',
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '1.4rem',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.25,
            }}
          >
            {icon} {title}
          </div>
          <div className="p-6">
            <p style={{ fontSize: '0.95rem', color: '#44403c', lineHeight: 1.6, marginBottom: '12px' }}>
              {description}
            </p>
            <div className="flex items-baseline gap-3 mb-4">
              {priceFrom && (
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14213d' }}>
                  {priceFrom}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: '#a8a29e' }}>
                Prices verified {month} {year}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4" style={{ color: '#f59e0b', fontSize: '0.95rem' }}>
              ★★★★★
              <span style={{ color: '#78716c', fontSize: '0.8rem' }}>Popular with anime fans</span>
            </div>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => trackClick(program, title, affiliateUrl)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: '#f97316' }}
            >
              {buttonText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
          <div
            className="px-6 py-2 text-xs"
            style={{ background: '#fafaf9', color: '#a8a29e', borderTop: '1px solid #f5f5f4' }}
          >
            Affiliate link — we earn a small commission at no extra cost to you.
          </div>
        </div>
      </>
    );
  }

  // ── Mid-article variant (default): compact recommendation card ─────────────
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div
        className="my-8 rounded-xl overflow-hidden"
        style={{ border: '1px solid #e7e5e4', borderLeft: '4px solid #f97316', background: '#fff' }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <h4
                className="font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.1rem',
                  color: '#14213d',
                }}
              >
                {title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#78716c', lineHeight: 1.6, marginBottom: '12px' }}>
                {description}
              </p>
              {priceFrom && (
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#14213d', marginBottom: '10px' }}>
                  {priceFrom}
                </p>
              )}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => trackClick(program, title, affiliateUrl)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: '#f97316' }}
              >
                {buttonText}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div
          className="px-6 py-2 text-xs"
          style={{ background: '#fafaf9', color: '#a8a29e', borderTop: '1px solid #f5f5f4' }}
        >
          This is an affiliate link. We may earn a commission at no extra cost to you.
        </div>
      </div>
    </>
  );
}

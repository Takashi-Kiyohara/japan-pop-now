'use client';

import type { ReactNode } from 'react';

type AffiliateProgram =
  | 'klook'
  | 'booking'
  | 'amazon'
  | 'getyourguide'
  | 'agoda'
  | 'jrpass'
  | 'awin'
  | 'other';

interface AffiliateCTAProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  program: AffiliateProgram;
  /**
   * Optional icon. Accepts any ReactNode — typically a Lucide icon component
   * (e.g. <Coffee size={28} strokeWidth={1.8} />). Emoji string icons are
   * supported for legacy callers but new code should use Lucide for visual
   * consistency and to honour the site's no-emoji style rule.
   */
  icon?: ReactNode;
  category?: string;
}

/**
 * Add UTM parameters to affiliate URL
 * @param baseUrl - The affiliate URL
 * @param category - Content category for campaign tracking
 * @returns URL with UTM parameters
 */
function buildAffiliateUrl(baseUrl: string, category: string = 'general'): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', 'japanpopnow');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', category);
  return url.toString();
}

export default function AffiliateCTA({
  title,
  description,
  buttonText,
  href,
  program,
  icon,
  category = 'general',
}: AffiliateCTAProps) {
  // Validate href is not empty
  if (!href || !href.trim()) {
    console.warn(`AffiliateCTA: Missing affiliate URL for program "${program}"`);
    return null;
  }

  const affiliateUrl = buildAffiliateUrl(href, category);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: description,
    url: affiliateUrl,
    provider: {
      '@type': 'Organization',
      name: program,
    },
  };

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const gtag = (window as unknown as {
      gtag?: (event: string, action: string, payload: Record<string, string>) => void;
    }).gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', 'affiliate_cta_click', {
      affiliate_program: program,
      cta_title: title,
      affiliate_url: affiliateUrl,
    });
  };

  return (
    <>
      {/* JSON-LD Product schema for affiliate CTA */}
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
            {icon ? (
              <span
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#fff7ed',
                  color: '#f97316',
                }}
                aria-hidden
              >
                {icon}
              </span>
            ) : null}
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
              <a
                href={affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={handleClick}
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

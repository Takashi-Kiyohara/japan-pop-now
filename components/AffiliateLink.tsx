'use client';

type AffiliateProgram = 'klook' | 'booking' | 'amazon' | 'getyourguide' | 'agoda' | 'jrpass' | 'awin' | 'beehiiv' | 'other';

interface AffiliateLinkProps {
  href: string;
  program: AffiliateProgram;
  children: React.ReactNode;
  className?: string;
  showBadge?: boolean;
  category?: string;
}

const programLabels: Record<AffiliateProgram, string> = {
  klook: 'Klook',
  booking: 'Booking.com',
  amazon: 'Amazon',
  getyourguide: 'GetYourGuide',
  agoda: 'Agoda',
  jrpass: 'JR Pass',
  awin: 'Awin',
  beehiiv: 'Newsletter',
  other: '',
};

/**
 * Add UTM parameters to affiliate URL
 * @param baseUrl - The affiliate URL
 * @param category - Content category for campaign tracking
 * @returns URL with UTM parameters
 */
function buildAffiliateUrl(baseUrl: string, category: string = 'general'): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', 'japan-pop-now');
    url.searchParams.set('utm_medium', 'article');
    url.searchParams.set('utm_campaign', category);
    return url.toString();
  } catch {
    // If URL is invalid, return as-is
    console.warn(`Invalid affiliate URL: ${baseUrl}`);
    return baseUrl;
  }
}

export default function AffiliateLink({
  href,
  program,
  children,
  className = '',
  showBadge = false,
  category = 'general',
}: AffiliateLinkProps) {
  // Validate href is not empty
  if (!href || !href.trim()) {
    console.warn(`AffiliateLink: Missing affiliate URL for program "${program}"`);
    return <>{children}</>;
  }

  const affiliateUrl = buildAffiliateUrl(href, category);

  const handleClick = () => {
    // GA4 event tracking for affiliate clicks
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'affiliate_click', {
        affiliate_program: program,
        affiliate_url: affiliateUrl,
      });
    }
  };

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-80 ${className}`}
      style={{ color: '#ea580c', borderBottom: '1px dashed rgba(234, 88, 12, 0.4)' }}
    >
      {children}
      {showBadge && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full ml-1"
          style={{ background: '#fff7ed', color: '#ea580c', fontSize: '0.65rem', fontWeight: 600 }}
        >
          {programLabels[program] || 'Partner'}
        </span>
      )}
    </a>
  );
}

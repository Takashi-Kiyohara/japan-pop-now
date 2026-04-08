'use client';

type AffiliateProgram = 'klook' | 'booking' | 'amazon' | 'getyourguide' | 'jrpass' | 'other';

interface AffiliateLinkProps {
  href: string;
  program: AffiliateProgram;
  children: React.ReactNode;
  className?: string;
  showBadge?: boolean;
}

const programLabels: Record<AffiliateProgram, string> = {
  klook: 'Klook',
  booking: 'Booking.com',
  amazon: 'Amazon',
  getyourguide: 'GetYourGuide',
  jrpass: 'JR Pass',
  other: '',
};

export default function AffiliateLink({
  href,
  program,
  children,
  className = '',
  showBadge = false,
}: AffiliateLinkProps) {
  const handleClick = () => {
    // GA4 event tracking for affiliate clicks
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        affiliate_program: program,
        affiliate_url: href,
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
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

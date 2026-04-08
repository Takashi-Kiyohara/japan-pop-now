'use client';

interface AffiliateCTAProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  program: string;
  icon?: string;
}

export default function AffiliateCTA({
  title,
  description,
  buttonText,
  href,
  program,
  icon = '🎫',
}: AffiliateCTAProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_cta_click', {
        affiliate_program: program,
        cta_title: title,
      });
    }
  };

  return (
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
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
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
  );
}

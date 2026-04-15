'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = document.cookie.includes('jpn_cookie_consent=true');
    if (!consent) {
      // Show after 1s delay so it doesn't block initial paint
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    // Set cookie for 1 year
    document.cookie = 'jpn_cookie_consent=true; max-age=31536000; path=/; SameSite=Lax; Secure';
    setVisible(false);
  };

  const decline = () => {
    document.cookie = 'jpn_cookie_consent=false; max-age=31536000; path=/; SameSite=Lax; Secure';
    // Disable GA if user declines
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)['ga-disable-' + process.env.NEXT_PUBLIC_GA_ID] = true;
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#14213d',
        borderTop: '2px solid #f97316',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.8)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <p style={{ maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
        We use cookies for analytics and to improve your experience. By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
        <a href="/privacy" style={{ color: '#fb923c', textDecoration: 'underline' }}>
          Privacy Policy
        </a>
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={accept}
          style={{
            background: '#f97316',
            color: '#fff',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

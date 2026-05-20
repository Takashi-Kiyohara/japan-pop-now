'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * SSR-rendered cookie consent banner.
 *
 * The banner DOM is in the initial server-rendered HTML so AdSense reviewers
 * (and Googlebot) see the consent UI without waiting for client JS. Post-hydration
 * the JS reads the cookie and either keeps the banner visible (default) or hides
 * it (if the user already accepted/declined). Default is "visible" so anyone
 * without prior consent gets the banner.
 *
 * Hydration safety: server renders `data-state="initial"` and visible CSS;
 * client effect updates to `accepted`/`declined`/`pending` to suppress hydration
 * mismatch warnings while still hiding the DOM when consent exists.
 */
export default function CookieConsent() {
  const [state, setState] = useState<'initial' | 'pending' | 'accepted' | 'declined'>('initial');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const consent = document.cookie.includes('jpn_cookie_consent=true');
    const declined = document.cookie.includes('jpn_cookie_consent=false');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: read DOM-side cookie post-hydration to either hide the SSR-rendered banner (already-consented users) or leave it visible (pending users). The setState IS the synchronization between the cookie store and React state.
    if (consent) setState('accepted');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see above
    else if (declined) setState('declined');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see above
    else setState('pending');
  }, []);

  const accept = () => {
    document.cookie = 'jpn_cookie_consent=true; max-age=31536000; path=/; SameSite=Lax; Secure';
    setState('accepted');
  };

  const decline = () => {
    document.cookie = 'jpn_cookie_consent=false; max-age=31536000; path=/; SameSite=Lax; Secure';
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)['ga-disable-' + process.env.NEXT_PUBLIC_GA_ID] = true;
    }
    setState('declined');
  };

  const hidden = state === 'accepted' || state === 'declined';

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      data-consent-state={state}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#14213d',
        borderTop: '2px solid #f97316',
        padding: '16px 20px',
        display: hidden ? 'none' : 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.85)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <p style={{ maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
        We use cookies for analytics and advertising personalization. By clicking
        &quot;Accept&quot;, you consent to our use of cookies.{' '}
        <Link href="/privacy" style={{ color: '#fb923c', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={accept}
          aria-label="Accept cookies"
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
          aria-label="Decline cookies"
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
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

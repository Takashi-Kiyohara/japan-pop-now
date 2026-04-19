'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check consent on mount and listen for changes
    const checkConsent = () => {
      const consent = getCookieValue('jpn_cookie_consent');
      setConsentGiven(consent === 'true');
    };

    checkConsent();

    // Re-check when cookie might change (CookieConsent sets it)
    const interval = setInterval(checkConsent, 1000);
    // Stop polling after 30s (user has likely decided by then)
    const timeout = setTimeout(() => clearInterval(interval), 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Only render in production AND if consent given
  if (!measurementId || process.env.NODE_ENV !== 'production' || !consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
          });
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
    </>
  );
}

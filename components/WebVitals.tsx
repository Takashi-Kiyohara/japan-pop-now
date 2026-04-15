'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export default function WebVitals() {
  useEffect(() => {
    const sendVital = (vital: any) => {
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify(vital);
        navigator.sendBeacon('/api/vitals', data);
      } else {
        fetch('/api/vitals', {
          method: 'POST',
          body: JSON.stringify(vital),
          keepalive: true,
        }).catch(() => {});
      }
    };

    getCLS(sendVital);
    getFID(sendVital);
    getFCP(sendVital);
    getLCP(sendVital);
    getTTFB(sendVital);
  }, []);

  return null;
}
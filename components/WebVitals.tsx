'use client';

import { useEffect } from 'react';

function sendVital(name: string, value: number) {
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    navigator.sendBeacon(
      '/api/vitals',
      JSON.stringify({ name, value, timestamp: Date.now() })
    );
  }
}

export default function WebVitals() {
  useEffect(() => {
    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as any;
        if (last) sendVital('LCP', last.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) { /* unsupported */ }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as any;
          sendVital('FID', e.processingStart - e.startTime);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) { /* unsupported */ }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as any;
          if (!e.hadRecentInput) clsValue += e.value;
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      // Report CLS on page hide
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') sendVital('CLS', clsValue);
        });
      }
    } catch (e) { /* unsupported */ }

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            sendVital('FCP', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) { /* unsupported */ }

    // TTFB - Time to First Byte
    try {
      const nav = performance.getEntriesByType('navigation');
      if (nav.length > 0) {
        const n = nav[0] as PerformanceNavigationTiming;
        sendVital('TTFB', n.responseStart - n.requestStart);
      }
    } catch (e) { /* unsupported */ }
  }, []);

  return null;
}
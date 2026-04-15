'use client';

import { useEffect } from 'react';

interface VitalData {
  name: string;
  value: number;
  timestamp: number;
}

function sendVital(name: string, value: number) {
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const data: VitalData = { name, value, timestamp: Date.now() };
    navigator.sendBeacon('/api/vitals', JSON.stringify(data));
  }
}

export default function WebVitals() {
  useEffect(() => {
    // LCP
    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) sendVital('LCP', last.startTime);
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) { /* unsupported browser */ }

    // FID
    try {
      const fidObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          sendVital('FID', (entry as PerformanceEventTiming).processingStart - entry.startTime);
        }
      });
      fidObs.observe({ type: 'first-input', buffered: true });
    } catch (_) { /* unsupported browser */ }

    // CLS
    try {
      let clsValue = 0;
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') sendVital('CLS', clsValue);
        });
      }
    } catch (_) { /* unsupported browser */ }

    // FCP
    try {
      const fcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            sendVital('FCP', entry.startTime);
          }
        }
      });
      fcpObs.observe({ type: 'paint', buffered: true });
    } catch (_) { /* unsupported browser */ }

    // TTFB
    try {
      const nav = performance.getEntriesByType('navigation');
      if (nav.length > 0) {
        const n = nav[0] as PerformanceNavigationTiming;
        sendVital('TTFB', n.responseStart - n.requestStart);
      }
    } catch (_) { /* unsupported browser */ }
  }, []);

  return null;
}
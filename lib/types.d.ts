// Global type augmentations for browser globals injected by third-party scripts
// (Google Analytics gtag, Google AdSense, GA opt-out flag).
//
// Keeping these in a single .d.ts file lets every client component reference
// `window.gtag`, `window.adsbygoogle`, etc. without `any` casts.

export {};

declare global {
  interface Window {
    /**
     * Google Analytics 4 — injected by GA tag manager / next/script.
     * Optional because the tag may be blocked by an extension or not loaded yet.
     */
    gtag?: (
      command: 'event' | 'config' | 'set' | 'consent' | 'js',
      action: string,
      params?: Record<string, unknown>
    ) => void;

    /** GA4 dataLayer — injected by GTM. */
    dataLayer?: unknown[];

    /**
     * Google AdSense queue — injected by adsbygoogle.js.
     * Acts as both an array and a "push to load" object.
     */
    adsbygoogle?: { push: (params: Record<string, unknown>) => void };
  }
}

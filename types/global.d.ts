/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global type declarations for third-party scripts (GA4, AdSense)
 * This avoids `as any` casts throughout the codebase.
 */

interface Window {
  gtag?: (...args: any[]) => void;
  adsbygoogle?: { push: (arg: Record<string, unknown>) => void };
}

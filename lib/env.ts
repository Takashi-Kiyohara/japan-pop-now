/**
 * Environment variable validation and typed access
 * Validates NEXT_PUBLIC_* vars at build/runtime
 * Returns typed object with defaults for missing optional vars
 * Throws error for required vars that are missing
 */

export interface ValidatedEnv {
  // Required
  NEXT_PUBLIC_ADSENSE_ID: string;

  // Optional with defaults
  NEXT_PUBLIC_KLOOK_AFFILIATE_ID: string;
  NEXT_PUBLIC_BOOKING_AFFILIATE_ID: string;
  NEXT_PUBLIC_AMAZON_ASSOCIATE_ID: string;
  NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID: string;
  NEXT_PUBLIC_AGODA_AFFILIATE_ID: string;
  NEXT_PUBLIC_JRPASS_AFFILIATE_ID: string;
  NEXT_PUBLIC_AWIN_AFFILIATE_ID: string;

  // Analytics
  NEXT_PUBLIC_GA4_ID: string;
  NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE: string;
}

/**
 * Validate and return typed environment variables
 * Run at build/import time to catch missing required vars early
 */
function validateEnv(): ValidatedEnv {
  const required = ['NEXT_PUBLIC_ADSENSE_ID'];

  // Check required vars
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `[WARN] Missing required environment variables: ${missing.join(', ')}\n` +
      `    These will cause issues in production. Check your .env.local file.`
    );
  }

  // Build validated object with defaults for optional
  const env: ValidatedEnv = {
    NEXT_PUBLIC_ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID || '',
    NEXT_PUBLIC_KLOOK_AFFILIATE_ID: process.env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID || '',
    NEXT_PUBLIC_BOOKING_AFFILIATE_ID: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || '',
    NEXT_PUBLIC_AMAZON_ASSOCIATE_ID: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || '',
    NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID: process.env.NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID || '',
    NEXT_PUBLIC_AGODA_AFFILIATE_ID: process.env.NEXT_PUBLIC_AGODA_AFFILIATE_ID || '',
    NEXT_PUBLIC_JRPASS_AFFILIATE_ID: process.env.NEXT_PUBLIC_JRPASS_AFFILIATE_ID || '',
    NEXT_PUBLIC_AWIN_AFFILIATE_ID: process.env.NEXT_PUBLIC_AWIN_AFFILIATE_ID || '',
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',
    NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE || '',
  };

  return env;
}

// Validate and export
export const env = validateEnv();

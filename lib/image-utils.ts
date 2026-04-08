/**
 * Default blur data URL for article images while loading
 * This is a tiny 10x6 neutral gradient that matches the site's cream background
 */
export const DEFAULT_BLUR_DATA_URL =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect fill="#e7e5e4" width="1200" height="630"/><rect fill="#d6d3d1" width="600" height="630" x="300" opacity="0.3"/></svg>'
  ).toString('base64');

/**
 * Get blur placeholder for article hero images
 * Uses a neutral warm-gray gradient that doesn't flash on load
 */
export function getBlurPlaceholder(): string {
  return DEFAULT_BLUR_DATA_URL;
}

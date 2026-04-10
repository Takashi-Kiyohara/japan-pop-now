/**
 * Next.js instrumentation hook — runs once when the server starts.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Importing `lib/env` here forces the validated env object to be built at
 * server boot, surfacing missing required vars (NEXT_PUBLIC_ADSENSE_ID at
 * minimum) in the production logs instead of at the first request.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@/lib/env');
  }
}

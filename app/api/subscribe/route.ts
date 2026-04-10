import { NextRequest, NextResponse } from 'next/server';

// ─── In-memory rate limiter (per-IP, 5 req / 60s) ────────────
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  bucket.count++;
  return bucket.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of ipBuckets) {
    if (now > bucket.resetAt) ipBuckets.delete(ip);
  }
}, 5 * 60_000);

// RFC 5322 simplified email regex
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    // Validate email format
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // ─── Beehiiv Integration ───────────────────────────────
    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;

    if (beehiivApiKey && beehiivPubId) {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${beehiivApiKey}`,
          },
          body: JSON.stringify({
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: 'website',
            utm_medium: 'organic',
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error('Beehiiv error:', err);
        return NextResponse.json({ error: 'Subscribe failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // ─── Fallback: Log to console (no API key configured) ──
    console.log(`[Newsletter] New subscriber: ${email}`);
    return NextResponse.json({ success: true });
  } catch {
    console.error('Subscribe error');
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

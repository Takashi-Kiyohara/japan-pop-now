import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
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
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Timing-safe string comparison to prevent timing attacks on secret tokens.
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to avoid leaking length info via timing
    timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest) {
  try {
    // Verify secret token (timing-safe)
    const token = request.headers.get('x-revalidate-token') || '';
    const secret = process.env.REVALIDATE_SECRET || '';

    if (!secret || !token || !safeCompare(token, secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paths = [], tags = [] } = body;

    if (!Array.isArray(paths) && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Request must include "paths" or "tags" array' },
        { status: 400 }
      );
    }

    const revalidated: string[] = [];
    const errorCount = { paths: 0, tags: 0 };

    // Revalidate paths
    if (Array.isArray(paths)) {
      for (const path of paths.slice(0, 50)) { // cap at 50 to prevent abuse
        try {
          if (typeof path === 'string' && path.startsWith('/')) {
            revalidatePath(path);
            revalidated.push(`path: ${path}`);
          }
        } catch (err) {
          errorCount.paths++;
          console.error(`[ISR] Failed to revalidate path: ${path}`, err);
        }
      }
    }

    // Revalidate tags
    if (Array.isArray(tags)) {
      for (const tag of tags.slice(0, 50)) {
        try {
          if (typeof tag === 'string') {
            revalidateTag(tag, 'max');
            revalidated.push(`tag: ${tag}`);
          }
        } catch (err) {
          errorCount.tags++;
          console.error(`[ISR] Failed to revalidate tag: ${tag}`, err);
        }
      }
    }

    // Log revalidation activity (server-side only)
    console.log('[ISR Revalidate]', {
      timestamp: new Date().toISOString(),
      revalidated: revalidated.length,
    });

    return NextResponse.json({
      success: true,
      revalidated: revalidated.length,
      message: `Revalidated ${revalidated.length} item(s)`,
    });
  } catch {
    console.error('[ISR Revalidate Error]');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

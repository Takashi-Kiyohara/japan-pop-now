import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const token = request.headers.get('x-revalidate-token');
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret || token !== secret) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
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
    const errors: string[] = [];

    // Revalidate paths
    if (Array.isArray(paths)) {
      for (const path of paths) {
        try {
          revalidatePath(path);
          revalidated.push(`path: ${path}`);
        } catch (err) {
          errors.push(`path: ${path} - ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    }

    // Revalidate tags (Next.js 16: revalidateTag requires profile as 2nd arg)
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        try {
          revalidateTag(tag, 'max');
          revalidated.push(`tag: ${tag}`);
        } catch (err) {
          errors.push(`tag: ${tag} - ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    }

    // Log revalidation activity
    console.log('[ISR Revalidate]', {
      timestamp: new Date().toISOString(),
      pathsCount: (paths || []).length,
      tagsCount: (tags || []).length,
      revalidated,
      errors,
    });

    return NextResponse.json({
      success: true,
      revalidated,
      errors: errors.length > 0 ? errors : undefined,
      message: `Revalidated ${revalidated.length} path(s)/tag(s)`,
    });
  } catch (error) {
    console.error('[ISR Revalidate Error]', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

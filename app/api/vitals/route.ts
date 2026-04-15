import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const vital = await request.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', vital);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing vital:', error);
    return NextResponse.json({ error: 'Failed to process vital' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { resetDBAsync } from '@/lib/db-redis';

export async function POST() {
  try {
    const data = await resetDBAsync();
    return NextResponse.json({ success: true, message: 'Database reset successful', data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}

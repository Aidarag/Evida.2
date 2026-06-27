import { NextResponse } from 'next/server';
import { resetDB } from '@/lib/db';

export async function POST() {
  try {
    const data = resetDB();
    return NextResponse.json({ success: true, message: 'Database reset successful', data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}

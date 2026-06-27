import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, feedback } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
    }

    const db = readDB();
    const index = db.promotions.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    db.promotions[index].status = status;
    db.promotions[index].feedback = feedback || '';

    writeDB(db);

    return NextResponse.json(db.promotions[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to review promotion' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { Promotion } from '@/lib/types';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.promotions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read promotions data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, organizer, contactInfo } = body;

    if (!title || !description || !category || !organizer || !contactInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = readDB();

    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title,
      description,
      category,
      status: 'pending', // Starts as pending for admin review
      date: new Date().toISOString().split('T')[0],
      organizer,
      contactInfo,
    };

    db.promotions.unshift(newPromo);
    writeDB(db);

    return NextResponse.json(newPromo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';
import { Promotion } from '@/lib/types';

export async function GET() {
  try {
    const db = await readDBAsync();
    return NextResponse.json(db.promotions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read promotions data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      organizer, 
      contactInfo, 
      contactMethod,
      flyerImage, 
      image, 
      isFree, 
      price, 
      preferredContactMethod, 
      contactValue, 
      socialLink 
    } = body;

    const resolvedValue = (contactValue || contactInfo || '').trim();

    if (!title || !description || !category || !organizer || !resolvedValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resolvedMethod = (contactMethod || preferredContactMethod || 'phone') as 'phone' | 'instagram' | 'snapchat';

    const db = await readDBAsync();

    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title,
      description,
      category,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      organizer,
      contactInfo: resolvedValue,
      contactMethod: resolvedMethod,
      contactValue: resolvedValue,
      preferredContactMethod: resolvedMethod,
      socialLink,
      flyerImage: flyerImage || image || undefined,
      image: flyerImage || image || undefined,
      isFree: isFree !== undefined ? isFree : true,
      price: price || (isFree === false ? 'Paid' : 'Free'),
    };

    db.promotions.unshift(newPromo);
    await writeDBAsync(db);

    return NextResponse.json(newPromo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}

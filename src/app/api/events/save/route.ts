import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, name } = body;

    if (!eventId || !name) {
      return NextResponse.json({ error: 'Missing eventId or name' }, { status: 400 });
    }

    const db = await readDBAsync();
    const userObj = db.users.find(u => u.name === name || u.username === name);
    const userNames = userObj ? [userObj.name, userObj.username].filter(Boolean) : [name];
    const isPromo = eventId.startsWith('promo-');

    if (isPromo) {
      const promoIndex = db.promotions.findIndex((p) => p.id === eventId);
      if (promoIndex === -1) {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      }

      const promo = db.promotions[promoIndex];
      if (!promo.savedBy) {
        promo.savedBy = [];
      }

      const isSaved = promo.savedBy.some(n => userNames.includes(n));
      if (isSaved) {
        promo.savedBy = promo.savedBy.filter(n => !userNames.includes(n));
      } else {
        promo.savedBy.push(name);
      }

      db.promotions[promoIndex] = promo;
      await writeDBAsync(db);

      return NextResponse.json({ saved: !isSaved, promotion: promo });
    } else {
      const eventIndex = db.events.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      const event = db.events[eventIndex];
      if (!event.savedBy) {
        event.savedBy = [];
      }

      const isSaved = event.savedBy.some(n => userNames.includes(n));
      if (isSaved) {
        event.savedBy = event.savedBy.filter(n => !userNames.includes(n));
      } else {
        event.savedBy.push(name);
      }

      db.events[eventIndex] = event;
      await writeDBAsync(db);

      return NextResponse.json({ saved: !isSaved, event });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, name } = body;

    if (!eventId || !name) {
      return NextResponse.json({ error: 'Missing eventId or name' }, { status: 400 });
    }

    const db = readDB();
    const eventIndex = db.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = db.events[eventIndex];
    if (!event.savedBy) {
      event.savedBy = [];
    }

    const idx = event.savedBy.indexOf(name);
    if (idx > -1) {
      event.savedBy.splice(idx, 1); // Unsave
    } else {
      event.savedBy.push(name); // Save
    }

    db.events[eventIndex] = event;
    writeDB(db);

    return NextResponse.json({ saved: idx === -1, event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, action } = body; // action is 'rsvp' or 'interested'

    if (!name || !action) {
      return NextResponse.json({ error: 'Missing name or action' }, { status: 400 });
    }

    const db = readDB();
    const eventIndex = db.events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = db.events[eventIndex];

    if (action === 'rsvp') {
      const idx = event.attendees.indexOf(name);
      if (idx > -1) {
        event.attendees.splice(idx, 1); // remove RSVP
      } else {
        event.attendees.push(name); // add RSVP
        // If RSVPing, automatically remove from interested list to keep clean
        const intIdx = event.interested.indexOf(name);
        if (intIdx > -1) {
          event.interested.splice(intIdx, 1);
        }
      }
    } else if (action === 'interested') {
      const idx = event.interested.indexOf(name);
      if (idx > -1) {
        event.interested.splice(idx, 1); // remove interest
      } else {
        event.interested.push(name); // add interest
        // If expressing interest, make sure they are not RSVP'd
        const rsvpIdx = event.attendees.indexOf(name);
        if (rsvpIdx > -1) {
          event.attendees.splice(rsvpIdx, 1);
        }
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    db.events[eventIndex] = event;
    writeDB(db);

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process RSVP' }, { status: 500 });
  }
}

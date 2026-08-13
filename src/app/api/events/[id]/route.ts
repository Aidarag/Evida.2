import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';

// GET a single event
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDBAsync();
    const event = db.events.find((e) => e.id === id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to read event' }, { status: 500 });
  }
}

// PATCH — update an existing event (organizer-only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { organizerName, ...fields } = body;

    const db = await readDBAsync();
    const eventIndex = db.events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = db.events[eventIndex];

    if (organizerName && event.organizer !== organizerName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allowed = ['title', 'description', 'date', 'time', 'endTime', 'location', 'category', 'capacity', 'coverImage', 'free', 'isFeatured', 'featured'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates[key] = fields[key];
      }
    }

    db.events[eventIndex] = { ...event, ...updates };
    await writeDBAsync(db);

    return NextResponse.json(db.events[eventIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE — remove an event (organizer-only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { organizerName } = body;

    const db = await readDBAsync();
    const eventIndex = db.events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = db.events[eventIndex];

    if (organizerName && event.organizer !== organizerName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    db.events.splice(eventIndex, 1);
    await writeDBAsync(db);

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { Notification } from '@/lib/types';

// Helper to map organizer name to username for dynamic notification delivery
function getUsernameByOrganizerName(name: string): string {
  const mapping: Record<string, string> = {
    'Michael Chen': 'michael_c',
    'Sarah Jenkins': 'sarah_j',
    'Alex Rivera': 'alex_r'
  };
  return mapping[name] || 'michael_c'; // fallback to michael_c
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, feedback, featured } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
    }

    const db = readDB();
    const eventIndex = db.events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = db.events[eventIndex];
    event.status = status;
    event.feedback = feedback || '';
    if (featured !== undefined) {
      event.featured = !!featured;
    }

    db.events[eventIndex] = event;

    // Create review notification for the organizer
    const username = getUsernameByOrganizerName(event.organizer);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: status === 'approved' ? 'Event Approved' : 'Event Rejected',
      message: status === 'approved' 
        ? `Your event "${event.title}" has been approved by Dean Dean.`
        : `Your event "${event.title}" was rejected: "${feedback || 'No comments left.'}"`,
      type: status === 'approved' ? 'approve' : 'reject',
      timestamp: 'Just now',
      read: false,
      username
    };
    db.notifications.unshift(newNotif);

    writeDB(db);

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process event review' }, { status: 500 });
  }
}

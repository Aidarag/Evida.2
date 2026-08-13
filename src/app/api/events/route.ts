import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';
import { Event, Notification } from '@/lib/types';

// Helper to get random custom gradient for HYPERACTIVE visuals
function getRandomGradient() {
  const gradients = [
    'from-orange-500 via-red-500 to-violet-600',
    'from-blue-600 to-indigo-900',
    'from-teal-400 to-emerald-600',
    'from-rose-500 via-pink-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-indigo-600 to-violet-800'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

export async function GET() {
  try {
    const db = await readDBAsync();
    return NextResponse.json(db.events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read events data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      ownershipType,
      date,
      time,
      endTime,
      location,
      locationType,
      organizer,
      organizationId,
      organizationName,
      estimatedAttendance,
      fundingRequested,
      transportationNeeded,
      coverImage,
      free,
      capacity,
      visibility,
      status: bodyStatus,
      isFeatured,
      creatorUsername
    } = body;

    if (!title || !description || !date || !time || !location || !organizer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let complexityType: 'quick' | 'standard' | 'complex' = 'standard';
    const isFunding = !!fundingRequested;
    const isTransport = !!transportationNeeded;
    const attendance = Number(estimatedAttendance) || 0;

    if (!isFunding && !isTransport && attendance <= 15) {
      complexityType = 'quick';
    } else if (isFunding || isTransport || attendance >= 150) {
      complexityType = 'complex';
    } else {
      complexityType = 'standard';
    }

    const db = await readDBAsync();

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title,
      description,
      category: category || 'Social',
      ownershipType,
      complexityType,
      status: (bodyStatus === 'approved' || bodyStatus === 'rejected') ? bodyStatus : 'pending',
      date,
      time,
      endTime: endTime || undefined,
      location,
      locationType: locationType || 'indoor',
      attendees: [],
      interested: [],
      savedBy: [],
      organizer,
      organizationId,
      organizationName,
      featured: !!isFeatured,
      isFeatured: !!isFeatured,
      views: 0,
      estimatedAttendance: attendance,
      fundingRequested: isFunding,
      transportationNeeded: isTransport,
      coverImage: coverImage || getRandomGradient(),
      free: free === undefined ? true : !!free,
      capacity: capacity ? Number(capacity) : undefined,
      visibility: visibility || 'public'
    };

    db.events.unshift(newEvent);

    if (creatorUsername) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Event Submitted',
        message: `Your event "${title}" was submitted and is pending review in the ${complexityType} queue.`,
        type: 'update',
        timestamp: 'Just now',
        read: false,
        username: creatorUsername
      };
      db.notifications.unshift(newNotif);
    }

    await writeDBAsync(db);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

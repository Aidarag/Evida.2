import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
    }

    const db = await readDBAsync();
    const list = db.notifications.filter((n) => n.username === username);
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, id } = body;

    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    const db = await readDBAsync();

    if (action === 'mark-all-read') {
      db.notifications = db.notifications.map((n) => {
        if (n.username === username) n.read = true;
        return n;
      });
    } else if (action === 'mark-read' && id) {
      db.notifications = db.notifications.map((n) => {
        if (n.id === id) n.read = true;
        return n;
      });
    } else if (action === 'clear' && id) {
      db.notifications = db.notifications.filter((n) => n.id !== id);
    }

    await writeDBAsync(db);
    const list = db.notifications.filter((n) => n.username === username);
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

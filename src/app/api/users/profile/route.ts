import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    const db = await readDBAsync();
    const user = db.users.find((u) => u.username === username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve user profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, major, graduationYear, school, avatar, banner, bio, interests, socials, classification, privacy } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required to update profile' }, { status: 400 });
    }

    const db = await readDBAsync();
    const idx = db.users.findIndex((u) => u.username === username);
    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = db.users[idx];

    if (name !== undefined) user.name = name.trim() || user.name;
    if (major !== undefined) user.major = major.trim();
    if (graduationYear !== undefined) user.graduationYear = graduationYear.trim();
    if (school !== undefined) user.school = school.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();
    if (banner !== undefined) user.banner = banner.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (interests !== undefined) user.interests = interests;
    if (socials !== undefined) user.socials = socials;
    if (classification !== undefined) user.classification = classification.trim();
    if (privacy !== undefined) user.privacy = privacy;

    if (user.graduationYear) {
      user.gradYear = user.graduationYear;
    }

    await writeDBAsync(db);

    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

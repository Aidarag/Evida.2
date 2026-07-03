import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      role,
      major,
      gradYear,
      school,
      avatar,
      phone,
      consentGiven,
      department,
    } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, role' },
        { status: 400 }
      );
    }

    // Validate consent
    if (!consentGiven) {
      return NextResponse.json(
        { error: 'You must accept the Data & Privacy terms before creating an account.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const db = readDB();

    // Check if email already exists
    const existing = db.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Generate username from email
    const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
    const username = `${emailPrefix}_${Date.now().toString(36)}`;

    // Build user object
    const newUser: User = {
      username,
      name,
      email: email.toLowerCase(),
      password, // In production: hash this. For demo: stored as plain text.
      role: role === 'admin' ? 'admin' : 'student',
      organizations: [],
      major: role === 'admin' ? (department || 'Administration') : (major || 'Undeclared'),
      gradYear: role === 'admin' ? 'N/A' : (gradYear || '2028'),
      graduationYear: role === 'admin' ? 'N/A' : (gradYear || '2028'),
      school: school || 'State University',
      avatar: avatar || name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      phone: phone || undefined,
      consentGiven: true,
      consentDate: new Date().toISOString(),
    };

    // Persist
    db.users.push(newUser);
    writeDB(db);

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error during signup.' },
      { status: 500 }
    );
  }
}

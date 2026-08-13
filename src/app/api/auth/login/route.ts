import { NextResponse } from 'next/server';
import { readDBAsync } from '@/lib/db-redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const db = await readDBAsync();
    const user = db.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 401 });
    }

    if (role) {
      const allowedRoles = role === 'school' ? ['admin'] : ['student', 'student_leader'];
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: `This account is not registered as a ${role}. Please choose the correct access level.` },
          { status: 403 }
        );
      }
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login.' }, { status: 500 });
  }
}

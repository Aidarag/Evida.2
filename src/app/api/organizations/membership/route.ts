import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';
import { MembershipRequest } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const db = await readDBAsync();
    let requests = db.membershipRequests || [];

    if (username) {
      requests = requests.filter((r) => r.username === username);
    }

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read membership requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, orgId, orgName, username, studentName, status } = body;

    const db = await readDBAsync();
    if (!db.membershipRequests) db.membershipRequests = [];

    if (action === 'apply') {
      if (!orgId || !orgName || !username || !studentName) {
        return NextResponse.json({ error: 'Missing required application fields' }, { status: 400 });
      }

      const exists = db.membershipRequests.some(
        (r) => r.orgId === orgId && r.username === username && r.status === 'pending'
      );
      if (exists) {
        return NextResponse.json({ error: 'A pending request already exists for this organization' }, { status: 400 });
      }

      const newRequest: MembershipRequest = {
        id: `req-${Date.now()}`,
        orgId,
        orgName,
        username,
        studentName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      db.membershipRequests.push(newRequest);
      await writeDBAsync(db);
      return NextResponse.json(newRequest, { status: 201 });
    }

    if (action === 'cancel') {
      const idx = db.membershipRequests.findIndex((r) => r.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      const req = db.membershipRequests[idx];
      if (req.username !== username) return NextResponse.json({ error: 'Unauthorized to cancel this request' }, { status: 403 });
      db.membershipRequests.splice(idx, 1);
      await writeDBAsync(db);
      return NextResponse.json({ success: true });
    }

    if (action === 'review') {
      if (!id || !status || (status !== 'approved' && status !== 'rejected')) {
        return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
      }

      const idx = db.membershipRequests.findIndex((r) => r.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

      const req = db.membershipRequests[idx];
      req.status = status;

      if (status === 'approved') {
        const orgIdx = db.organizations.findIndex((o) => o.id === req.orgId);
        if (orgIdx !== -1) {
          const org = db.organizations[orgIdx];
          if (!org.members.includes(req.studentName)) org.members.push(req.studentName);
        }

        const userIdx = db.users.findIndex((u) => u.username === req.username);
        if (userIdx !== -1) {
          const user = db.users[userIdx];
          if (!user.organizations.includes(req.orgId)) user.organizations.push(req.orgId);
        }
      }

      await writeDBAsync(db);
      return NextResponse.json(req);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to manage membership request' }, { status: 500 });
  }
}

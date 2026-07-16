import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { Organization } from '@/lib/types';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.organizations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read organizations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, name, description, logoColor, member } = body;

    const db = readDB();

    if (action === 'toggle-verify') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      db.organizations[idx].verified = !db.organizations[idx].verified;
      writeDB(db);
      return NextResponse.json(db.organizations[idx]);
    }

    if (action === 'join') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      const org = db.organizations[idx];
      const mIdx = org.members.indexOf(member);
      if (mIdx > -1) {
        org.members.splice(mIdx, 1); // Leave org
        if (org.memberRoles && org.memberRoles[member]) {
          delete org.memberRoles[member];
        }
      } else {
        org.members.push(member); // Join org
      }
      writeDB(db);
      return NextResponse.json(org);
    }

    if (action === 'update-role') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      const org = db.organizations[idx];
      if (!org.memberRoles) org.memberRoles = {};
      org.memberRoles[member] = body.role;
      writeDB(db);
      return NextResponse.json(org);
    }

    if (action === 'remove-member') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      const org = db.organizations[idx];
      const mIdx = org.members.indexOf(member);
      if (mIdx > -1) {
        org.members.splice(mIdx, 1);
      }
      if (org.memberRoles && org.memberRoles[member]) {
        delete org.memberRoles[member];
      }
      // Also remove organization from user's record
      const uIdx = db.users.findIndex(u => u.name === member || u.username === member);
      if (uIdx > -1) {
        db.users[uIdx].organizations = db.users[uIdx].organizations.filter(oId => oId !== id);
      }
      writeDB(db);
      return NextResponse.json(org);
    }

    // Create a new organization
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      description,
      verified: false, // All newly created student groups start as unverified
      members: member ? [member] : [],
      logoColor: logoColor || 'indigo'
    };

    db.organizations.push(newOrg);

    // Link new organization to the creator's user record in db
    if (member) {
      const userIdx = db.users.findIndex(u => u.name === member || u.username === member);
      if (userIdx > -1) {
        if (!db.users[userIdx].organizations) {
          db.users[userIdx].organizations = [];
        }
        if (!db.users[userIdx].organizations.includes(newOrg.id)) {
          db.users[userIdx].organizations.push(newOrg.id);
        }
      }
    }

    writeDB(db);

    return NextResponse.json(newOrg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to manage organization' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readDBAsync, writeDBAsync } from '@/lib/db-redis';
import { Organization } from '@/lib/types';

export async function GET() {
  try {
    const db = await readDBAsync();
    return NextResponse.json(db.organizations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read organizations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, name, description, logoColor, member } = body;

    const db = await readDBAsync();

    if (action === 'toggle-verify') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      const isVerified = !db.organizations[idx].verified;
      db.organizations[idx].verified = isVerified;
      db.organizations[idx].verificationStatus = isVerified ? 'verified' : 'unverified';
      await writeDBAsync(db);
      return NextResponse.json(db.organizations[idx]);
    }

    if (action === 'request-verification') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      db.organizations[idx].verificationStatus = 'pending';
      await writeDBAsync(db);
      return NextResponse.json(db.organizations[idx]);
    }

    if (action === 'update-profile') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      const org = db.organizations[idx];
      if (body.name) org.name = body.name;
      if (body.description) org.description = body.description;
      if (body.aboutUs) org.aboutUs = body.aboutUs;
      if (body.category) org.category = body.category;
      if (body.rosterType) org.rosterType = body.rosterType;
      if (body.teamRoster) org.teamRoster = body.teamRoster;
      await writeDBAsync(db);
      return NextResponse.json(org);
    }

    if (action === 'join') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      const org = db.organizations[idx];
      const mIdx = org.members.indexOf(member);
      if (mIdx > -1) {
        org.members.splice(mIdx, 1);
        if (org.memberRoles && org.memberRoles[member]) delete org.memberRoles[member];
      } else {
        org.members.push(member);
      }
      await writeDBAsync(db);
      return NextResponse.json(org);
    }

    if (action === 'update-role') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      const org = db.organizations[idx];
      if (!org.memberRoles) org.memberRoles = {};
      org.memberRoles[member] = body.role;
      await writeDBAsync(db);
      return NextResponse.json(org);
    }

    if (action === 'remove-member') {
      const idx = db.organizations.findIndex((o) => o.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      const org = db.organizations[idx];
      const mIdx = org.members.indexOf(member);
      if (mIdx > -1) org.members.splice(mIdx, 1);
      if (org.memberRoles && org.memberRoles[member]) delete org.memberRoles[member];
      const uIdx = db.users.findIndex(u => u.name === member || u.username === member);
      if (uIdx > -1) db.users[uIdx].organizations = db.users[uIdx].organizations.filter(oId => oId !== id);
      await writeDBAsync(db);
      return NextResponse.json(org);
    }

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      description,
      verified: false,
      members: member ? [member] : [],
      logoColor: logoColor || 'indigo'
    };

    db.organizations.push(newOrg);

    if (member) {
      const userIdx = db.users.findIndex(u => u.name === member || u.username === member);
      if (userIdx > -1) {
        if (!db.users[userIdx].organizations) db.users[userIdx].organizations = [];
        if (!db.users[userIdx].organizations.includes(newOrg.id)) {
          db.users[userIdx].organizations.push(newOrg.id);
        }
      }
    }

    await writeDBAsync(db);
    return NextResponse.json(newOrg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to manage organization' }, { status: 500 });
  }
}

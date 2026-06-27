import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    const events = db.events;

    const totalEvents = events.length;
    const approvedEvents = events.filter((e) => e.status === 'approved');
    const pendingEvents = events.filter((e) => e.status === 'pending');
    const rejectedEvents = events.filter((e) => e.status === 'rejected');

    // Total RSVPs across approved events
    const totalRSVPs = approvedEvents.reduce((acc, curr) => acc + curr.attendees.length, 0);
    const totalInterested = approvedEvents.reduce((acc, curr) => acc + curr.interested.length, 0);

    // Distribution by complexity
    const complexityDistribution = {
      quick: events.filter((e) => e.complexityType === 'quick').length,
      standard: events.filter((e) => e.complexityType === 'standard').length,
      complex: events.filter((e) => e.complexityType === 'complex').length,
    };

    // Distribution by ownership
    const ownershipDistribution = {
      student: events.filter((e) => e.ownershipType === 'student').length,
      organization: events.filter((e) => e.ownershipType === 'organization').length,
      school: events.filter((e) => e.ownershipType === 'school').length,
    };

    // Top organizations by event count
    const orgCounts: Record<string, { name: string; count: number }> = {};
    events.forEach((e) => {
      if (e.ownershipType === 'organization' && e.organizationName) {
        const name = e.organizationName;
        if (!orgCounts[name]) {
          orgCounts[name] = { name, count: 0 };
        }
        orgCounts[name].count++;
      }
    });
    const topOrganizations = Object.values(orgCounts).sort((a, b) => b.count - a.count);

    // Simulated monthly attendance data for an interactive chart
    // Computing some values or just returning high fidelity data
    const monthlyParticipation = [
      { month: 'Feb', rsvps: 180, events: 5 },
      { month: 'Mar', rsvps: 290, events: 8 },
      { month: 'Apr', rsvps: 450, events: 12 },
      { month: 'May', rsvps: 620, events: 15 },
      { month: 'Jun', rsvps: 840, events: 19 },
    ];

    return NextResponse.json({
      totalEvents,
      approvedCount: approvedEvents.length,
      pendingCount: pendingEvents.length,
      rejectedCount: rejectedEvents.length,
      totalRSVPs,
      totalInterested,
      complexityDistribution,
      ownershipDistribution,
      topOrganizations,
      monthlyParticipation,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}

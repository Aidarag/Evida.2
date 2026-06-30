'use client';

import React from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import { ClipboardList, Star, Building2, BarChart3, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SchoolDashboardPage() {
  const { currentUser } = useUser();
  const { events, organizations } = useEvents();
  const router = useRouter();

  if (!currentUser || currentUser.role !== 'admin') return null;

  // Key Metrics
  const pendingEvents = events.filter(e => e.status === 'pending');
  const quickQueue = pendingEvents.filter(e => e.complexityType === 'quick');
  const standardQueue = pendingEvents.filter(e => e.complexityType === 'standard');
  const complexQueue = pendingEvents.filter(e => e.complexityType === 'complex');

  const totalApproved = events.filter(e => e.status === 'approved').length;
  const unverifiedOrgs = organizations.filter(o => !o.verified).length;

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#203627] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Administrator Overview
          </h1>
          <p className="text-[#4F5666]">System status and pending actions for Evida Admin.</p>
        </div>
      </div>

      {/* Primary Action Needs (Queues) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#E8FF40]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#E8FF40]/10 flex items-center justify-center text-[#203627]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#E8FF40]/10 text-[#203627] px-3 py-1 text-[10px] font-bold uppercase">High Priority</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#203627]">{complexQueue.length}</div>
            <p className="text-sm font-medium text-[#4F5666]">Complex events pending review</p>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#9DC4D5]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#9DC4D5]/10 flex items-center justify-center text-[#9DC4D5]">
              <Clock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#9DC4D5]/10 text-[#9DC4D5] px-3 py-1 text-[10px] font-bold uppercase">Standard</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#203627]">{standardQueue.length}</div>
            <p className="text-sm font-medium text-[#4F5666]">Standard events pending review</p>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#22C55E]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 text-[10px] font-bold uppercase">Fast Track</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#203627]">{quickQueue.length}</div>
            <p className="text-sm font-medium text-[#4F5666]">Quick events pending review</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#203627]" style={{ fontFamily: 'var(--font-display)' }}>System Modules</h2>
          <div className="grid grid-cols-2 gap-4">
             <Link href="/school/review">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#9DC4D5]/40 transition-colors">
                <ClipboardList className="h-6 w-6 text-[#9DC4D5]" />
                <span className="text-sm font-bold text-[#203627]">Review Queue</span>
              </Card>
            </Link>
            <Link href="/school/featured">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#E8FF40]/40 transition-colors">
                <Star className="h-6 w-6 text-[#E8FF40]" />
                <span className="text-sm font-bold text-[#203627]">Featured Events</span>
              </Card>
            </Link>
            <Link href="/school/organizations">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#9DC4D5]/40 transition-colors relative">
                {unverifiedOrgs > 0 && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#E8FF40]"></span>
                )}
                <Building2 className="h-6 w-6 text-[#9DC4D5]" />
                <span className="text-sm font-bold text-[#203627]">Organizations</span>
              </Card>
            </Link>
            <Link href="/school/analytics">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#9DC4D5]/40 transition-colors">
                <BarChart3 className="h-6 w-6 text-[#9DC4D5]" />
                <span className="text-sm font-bold text-[#203627]">Analytics</span>
              </Card>
            </Link>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#203627]" style={{ fontFamily: 'var(--font-display)' }}>Global Statistics</h2>
          <Card className="p-6 divide-y divide-black/[0.06]">
            <div className="py-4 flex justify-between items-center first:pt-0">
              <span className="text-[#4F5666]">Total Approved Events</span>
              <span className="font-bold text-[#203627]">{totalApproved}</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#4F5666]">Registered Organizations</span>
              <span className="font-bold text-[#203627]">{organizations.length}</span>
            </div>
            <div className="py-4 flex justify-between items-center border-b-0 pb-0">
              <span className="text-[#4F5666]">Total Student RSVPs</span>
              <span className="font-bold text-[#203627]">
                {events.reduce((acc, ev) => acc + ev.attendees.length, 0)}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

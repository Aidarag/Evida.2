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

  if (!currentUser) return null;

  // Key Metrics
  const pendingEventsCount = events.filter(e => e.status === 'pending').length;
  const verifiedOrgsCount = organizations.filter(o => o.verified).length;
  const unverifiedOrgsCount = organizations.filter(o => !o.verified).length;

  const totalApproved = events.filter(e => e.status === 'approved').length;

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Administrator Overview
          </h1>
          <p className="text-[#5A554E]">System status and pending actions for Evida Admin.</p>
        </div>
      </div>

      {/* Account Verification & Review Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/school/organizations" className="block">
          <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-emerald-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                Certified ✓
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#2A2621]">{verifiedOrgsCount}</div>
              <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Certified Organizations</p>
            </div>
          </Card>
        </Link>

        <Link href="/school/organizations" className="block">
          <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-amber-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                <XCircle className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                Non-Certified ✕
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#2A2621]">{unverifiedOrgsCount}</div>
              <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Non-Certified Organizations</p>
            </div>
          </Card>
        </Link>

        <Link href="/school/review" className="block">
          <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#FD5C05] hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-full bg-[#FD5C05]/10 flex items-center justify-center text-[#FD5C05]">
                <Clock className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[#FD5C05]/10 text-[#FD5C05] px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                Pending Review
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#2A2621]">{pendingEventsCount}</div>
              <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Events Pending Campus Review</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>System Modules</h2>
          <div className="grid grid-cols-3 gap-4">
             <Link href="/school/review">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#FD5C05]/40 transition-colors">
                <ClipboardList className="h-6 w-6 text-[#2A2621]/70" />
                <span className="text-sm font-bold text-[#2A2621]">Review Queue</span>
              </Card>
            </Link>
            <Link href="/school/organizations">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#FD5C05]/40 transition-colors relative">
                {unverifiedOrgsCount > 0 && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#FD5C05]"></span>
                )}
                <Building2 className="h-6 w-6 text-[#2A2621]/70" />
                <span className="text-sm font-bold text-[#2A2621]">Organizations</span>
              </Card>
            </Link>
            <Link href="/school/analytics">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#FD5C05]/40 transition-colors">
                <BarChart3 className="h-6 w-6 text-[#2A2621]/70" />
                <span className="text-sm font-bold text-[#2A2621]">Analytics</span>
              </Card>
            </Link>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>Global Statistics</h2>
          <Card className="p-6 divide-y divide-black/[0.06]">
            <div className="py-4 flex justify-between items-center first:pt-0">
              <span className="text-[#5A554E]">Total Approved Events</span>
              <span className="font-bold text-[#2A2621]">{totalApproved}</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#5A554E]">Registered Organizations</span>
              <span className="font-bold text-[#2A2621]">{organizations.length}</span>
            </div>
            <div className="py-4 flex justify-between items-center border-b-0 pb-0">
              <span className="text-[#5A554E]">Total Student RSVPs</span>
              <span className="font-bold text-[#2A2621]">
                {events.reduce((acc, ev) => acc + ev.attendees.length, 0)}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

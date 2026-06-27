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
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-[#B8BBC8]">System status and pending actions for Evida Admin.</p>
        </div>
      </div>

      {/* Primary Action Needs (Queues) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#EE3D5A]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#EE3D5A]/10 flex items-center justify-center text-[#EE3D5A]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#EE3D5A]/10 text-[#EE3D5A] px-3 py-1 text-[10px] font-bold uppercase">High Priority</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{complexQueue.length}</div>
            <p className="text-sm font-medium text-[#B8BBC8]">Complex events pending review</p>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#80B0EC]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#80B0EC]/10 flex items-center justify-center text-[#80B0EC]">
              <Clock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#80B0EC]/10 text-[#80B0EC] px-3 py-1 text-[10px] font-bold uppercase">Standard</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{standardQueue.length}</div>
            <p className="text-sm font-medium text-[#B8BBC8]">Standard events pending review</p>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-[#DAFB71]">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#DAFB71]/10 flex items-center justify-center text-[#DAFB71]">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#DAFB71]/10 text-[#DAFB71] px-3 py-1 text-[10px] font-bold uppercase">Fast Track</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{quickQueue.length}</div>
            <p className="text-sm font-medium text-[#B8BBC8]">Quick events pending review</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">System Modules</h2>
          <div className="grid grid-cols-2 gap-4">
             <Link href="/school/review">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#80B0EC]/50 transition-colors">
                <ClipboardList className="h-6 w-6 text-[#80B0EC]" />
                <span className="text-sm font-bold text-white">Review Queue</span>
              </Card>
            </Link>
            <Link href="/school/featured">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#DAFB71]/50 transition-colors">
                <Star className="h-6 w-6 text-[#DAFB71]" />
                <span className="text-sm font-bold text-white">Featured Events</span>
              </Card>
            </Link>
            <Link href="/school/organizations">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-white/50 transition-colors relative">
                {unverifiedOrgs > 0 && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#EE3D5A]"></span>
                )}
                <Building2 className="h-6 w-6 text-white" />
                <span className="text-sm font-bold text-white">Organizations</span>
              </Card>
            </Link>
            <Link href="/school/analytics">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 h-32 hover:border-[#80B0EC]/50 transition-colors">
                <BarChart3 className="h-6 w-6 text-[#80B0EC]" />
                <span className="text-sm font-bold text-white">Analytics</span>
              </Card>
            </Link>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Global Statistics</h2>
          <Card className="p-6 divide-y divide-white/[0.06]">
            <div className="py-4 flex justify-between items-center first:pt-0">
              <span className="text-[#B8BBC8]">Total Approved Events</span>
              <span className="font-bold text-white">{totalApproved}</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#B8BBC8]">Registered Organizations</span>
              <span className="font-bold text-white">{organizations.length}</span>
            </div>
            <div className="py-4 flex justify-between items-center border-b-0 pb-0">
              <span className="text-[#B8BBC8]">Total Student RSVPs</span>
              <span className="font-bold text-white">
                {events.reduce((acc, ev) => acc + ev.attendees.length, 0)}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

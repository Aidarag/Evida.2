'use client';

import React from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { 
  ClipboardList, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  ArrowUpRight, 
  TrendingUp, 
  Users,
  Eye,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import SchoolAnalyticsSection from '@/components/admin/SchoolAnalyticsSection';

export default function SchoolDashboardPage() {
  const { currentUser } = useUser();
  const { events, organizations } = useEvents();

  if (!currentUser) return null;

  // Key Moderation & Registry Metrics
  const pendingEventsCount = events.filter(e => e.status === 'pending').length;
  const verifiedOrgsCount = organizations.filter(o => o.verified).length;
  const unverifiedOrgsCount = organizations.filter(o => !o.verified).length;

  const totalApproved = events.filter(e => e.status === 'approved').length;
  const totalRSVPs = events.reduce((acc, ev) => acc + (ev.attendees?.length || 0), 0);
  const totalViews = events.reduce((acc, ev) => acc + (ev.views || 0), 0);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-black/[0.04]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FD5C05] text-[#2A2621]">
              School Administrator Portal
            </span>
            <span className="text-xs text-[#5A554E] font-medium">• Fall Semester 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Administrator Overview
          </h1>
          <p className="text-[#5A554E] text-sm max-w-2xl leading-relaxed">
            Campus moderation, student organization certifications, and real-time student engagement analytics.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/school/review"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 bg-white hover:bg-black/[0.02] text-xs font-bold text-[#2A2621] shadow-2xs transition-all cursor-pointer"
          >
            <Clock className="h-4 w-4 text-[#FD5C05]" />
            <span>Pending Review ({pendingEventsCount})</span>
          </Link>
          <Link
            href="/school/analytics"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FD5C05] hover:bg-[#CC3D00] text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all cursor-pointer"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Campus Analytics</span>
          </Link>
        </div>
      </div>

      {/* Account Verification & Review Metrics */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-widest text-[#5A554E]">
          Urgent Administrative Actions & Registry Status
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/school/organizations/approvals?tab=approved" className="block no-underline">
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

          <Link href="/school/organizations/approvals?tab=refused" className="block no-underline">
            <Card className="p-6 flex flex-col justify-between h-40 border-l-4 border-l-rose-500 hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-rose-500/10 text-rose-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                  Refused / Non-Certified ✕
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
      </div>

      {/* Prominent Campus Analytics Section */}
      <SchoolAnalyticsSection 
        events={events} 
        organizations={organizations} 
        showDeepDiveLink={true} 
      />

      {/* System Modules & Overview Summary */}
      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-black/[0.04]">
        {/* Quick Links / System Modules */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
            System Modules
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/school/review" className="block">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-2.5 h-36 hover:border-[#FD5C05]/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-[#FD5C05]/10 flex items-center justify-center text-[#FD5C05]">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2621] block">Review Queue</span>
                  <span className="text-[10px] text-[#5A554E] font-medium">{pendingEventsCount} pending</span>
                </div>
              </Card>
            </Link>

            <Link href="/school/organizations" className="block">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-2.5 h-36 hover:border-[#FD5C05]/40 transition-colors relative">
                {unverifiedOrgsCount > 0 && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#FD5C05] animate-ping"></span>
                )}
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2621] block">Organizations</span>
                  <span className="text-[10px] text-[#5A554E] font-medium">{organizations.length} registered</span>
                </div>
              </Card>
            </Link>

            <Link href="/school/analytics" className="block">
              <Card className="p-5 flex flex-col items-center justify-center text-center gap-2.5 h-36 border-[#FD5C05]/20 hover:border-[#FD5C05] hover:shadow-sm transition-all bg-gradient-to-b from-white to-[#FD5C05]/5">
                <div className="h-10 w-10 rounded-xl bg-[#FD5C05] flex items-center justify-center text-white shadow-xs">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#2A2621] block">Full Analytics</span>
                  <span className="text-[10px] text-[#FD5C05] font-extrabold uppercase tracking-wider flex items-center justify-center gap-0.5">
                    View reports <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Global Statistics Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
            Campus Telemetry Summary
          </h2>
          <Card className="p-6 divide-y divide-black/[0.06] bg-white">
            <div className="py-3 flex justify-between items-center first:pt-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-[#5A554E] font-semibold">Total Approved Events</span>
              </div>
              <span className="font-extrabold text-[#2A2621] text-sm">{totalApproved}</span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-xs text-[#5A554E] font-semibold">Active Registered Organizations</span>
              </div>
              <span className="font-extrabold text-[#2A2621] text-sm">{organizations.length}</span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FD5C05]" />
                <span className="text-xs text-[#5A554E] font-semibold">Total Student RSVPs</span>
              </div>
              <span className="font-extrabold text-[#2A2621] text-sm">{totalRSVPs}</span>
            </div>

            <div className="py-3 flex justify-between items-center border-b-0 pb-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="text-xs text-[#5A554E] font-semibold">Total Event Page Impressions</span>
              </div>
              <span className="font-extrabold text-[#2A2621] text-sm">{totalViews.toLocaleString()}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

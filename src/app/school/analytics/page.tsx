'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import SchoolAnalyticsSection from '@/components/admin/SchoolAnalyticsSection';
import { 
  ArrowLeft, 
  BarChart3, 
  DollarSign, 
  Bus, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AnalyticsPage() {
  const { events, organizations } = useEvents();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<'all' | 'funding' | 'transport'>('all');

  if (!currentUser) return null;

  // Filter funding or transit events
  const fundingEvents = events.filter(e => e.fundingRequested);
  const transitEvents = events.filter(e => e.transportationNeeded);

  const displayedSpecialEvents = activeTab === 'funding' 
    ? fundingEvents 
    : activeTab === 'transport' 
    ? transitEvents 
    : events.filter(e => e.fundingRequested || e.transportationNeeded);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto font-sans">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-4 pb-2 border-b border-black/[0.04]">
        <Link
          href="/school/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A554E] hover:text-[#FD5C05] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Administrator Overview</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FD5C05] text-[#2A2621]">
                Campus Intelligence & Reporting
              </span>
              <span className="text-xs text-[#5A554E] font-medium">• Academic Year 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Campus Engagement Analytics
            </h1>
            <p className="text-[#5A554E] text-sm max-w-2xl leading-relaxed">
              Comprehensive analytics, student participation telemetry, category distributions, and campus resource requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/school/review"
              className="px-4 py-2 rounded-full border border-black/10 bg-white hover:bg-black/[0.02] text-xs font-bold text-[#2A2621] transition-all"
            >
              Review Submissions
            </Link>
            <Link
              href="/school/organizations"
              className="px-4 py-2 rounded-full bg-[#FD5C05] hover:bg-[#CC3D00] text-xs font-black uppercase tracking-wider text-white transition-all shadow-sm"
            >
              Certified Groups
            </Link>
          </div>
        </div>
      </div>

      {/* Main Interactive Analytics Section */}
      <SchoolAnalyticsSection 
        events={events} 
        organizations={organizations} 
        showDeepDiveLink={false} 
      />

      {/* Campus Resource Demands & Special Approvals Audit */}
      <div className="space-y-6 pt-4 border-t border-black/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#FD5C05]" />
              <h2 className="text-xl font-bold text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
                Campus Resource Demands & Special Authorizations
              </h2>
            </div>
            <p className="text-xs text-[#5A554E]">
              Student Government Association (SGA) funding allocations and University transportation shuttle requests.
            </p>
          </div>

          {/* Subfilter tabs */}
          <div className="inline-flex rounded-xl bg-black/[0.04] p-1 border border-black/[0.04] text-xs font-bold text-[#5A554E]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              All Requests ({fundingEvents.length + transitEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('funding')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'funding' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              SGA Funding ({fundingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'transport' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              Campus Bus ({transitEvents.length})
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-black/[0.06]">
              <thead className="bg-black/[0.02] text-[#5A554E] font-black uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event & Host</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Location</th>
                  <th className="py-3 px-4">Estimated Turnout</th>
                  <th className="py-3 px-4">Requested Resource</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] font-medium text-[#2A2621]">
                {displayedSpecialEvents.length > 0 ? (
                  displayedSpecialEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2A2621]">{evt.title}</div>
                        <div className="text-[11px] text-[#5A554E]">{evt.organizationName || evt.organizer}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/[0.05] text-[#2A2621]">
                          {evt.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5A554E]">
                        <div>{evt.date} at {evt.time}</div>
                        <div className="text-[10px] text-[#2A2621] font-semibold">{evt.location}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2A2621]">
                        ~{evt.estimatedAttendance || 50} attendees
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {evt.fundingRequested && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/10 text-amber-700 border border-amber-500/20">
                              <DollarSign className="h-2.5 w-2.5" /> SGA Grant
                            </span>
                          )}
                          {evt.transportationNeeded && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-sky-500/10 text-sky-700 border border-sky-500/20">
                              <Bus className="h-2.5 w-2.5" /> Campus Bus
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          evt.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-700'
                            : evt.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-700'
                            : 'bg-rose-500/10 text-rose-700'
                        }`}>
                          {evt.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {evt.status === 'pending' && <Clock className="h-3 w-3" />}
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#5A554E] italic">
                      No matching resource requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

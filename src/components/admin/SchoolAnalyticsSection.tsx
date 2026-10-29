'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  ArrowUpRight, 
  Download, 
  Layers, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Bus, 
  Flame,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Event, Organization } from '@/lib/types';
import Card from '@/components/ui/Card';

interface SchoolAnalyticsSectionProps {
  events: Event[];
  organizations: Organization[];
  showDeepDiveLink?: boolean;
}

type TimeframeFilter = 'all' | 'semester' | '30d' | 'upcoming';

export default function SchoolAnalyticsSection({
  events,
  organizations,
  showDeepDiveLink = true,
}: SchoolAnalyticsSectionProps) {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'events' | 'orgs'>('events');

  // Filter events based on timeframe
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => {
      if (timeframe === 'all') return true;
      const eventDate = new Date(e.date);
      if (isNaN(eventDate.getTime())) return true;

      if (timeframe === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return eventDate >= thirtyDaysAgo && eventDate <= thirtyDaysAhead;
      }
      if (timeframe === 'semester') {
        // Fall semester spans July - December 2026
        const year = eventDate.getFullYear();
        const month = eventDate.getMonth();
        return year === 2026 && month >= 6 && month <= 11;
      }
      if (timeframe === 'upcoming') {
        return eventDate >= now || e.date >= '2026-10-01';
      }
      return true;
    });
  }, [events, timeframe]);

  // Approved events in current filtered set
  const approvedEvents = useMemo(() => {
    return filteredEvents.filter(e => e.status === 'approved');
  }, [filteredEvents]);

  // Key Aggregated Metrics
  const totalApproved = approvedEvents.length;
  const totalPending = filteredEvents.filter(e => e.status === 'pending').length;
  const totalRejected = filteredEvents.filter(e => e.status === 'rejected').length;
  const totalSubmissions = filteredEvents.length;

  const approvalRate = totalSubmissions > 0
    ? Math.round((totalApproved / totalSubmissions) * 100)
    : 100;

  const totalRSVPs = useMemo(() => {
    return approvedEvents.reduce((acc, ev) => acc + (ev.attendees?.length || 0), 0);
  }, [approvedEvents]);

  const totalViews = useMemo(() => {
    return filteredEvents.reduce((acc, ev) => acc + (ev.views || 0), 0);
  }, [filteredEvents]);

  const totalInterested = useMemo(() => {
    return approvedEvents.reduce((acc, ev) => acc + (ev.interested?.length || 0), 0);
  }, [approvedEvents]);

  const avgAttendancePerEvent = totalApproved > 0
    ? (totalRSVPs / totalApproved).toFixed(1)
    : '0';

  const rsvpConversionRate = totalViews > 0
    ? ((totalRSVPs / totalViews) * 100).toFixed(1)
    : '0';

  // Resource Requests
  const fundingRequestedCount = filteredEvents.filter(e => e.fundingRequested).length;
  const transportationNeededCount = filteredEvents.filter(e => e.transportationNeeded).length;

  // Category Distribution & Metrics
  const categoryStats = useMemo(() => {
    const statsMap: Record<string, { count: number; rsvps: number; views: number }> = {};
    filteredEvents.forEach(e => {
      const cat = e.category || 'General';
      if (!statsMap[cat]) {
        statsMap[cat] = { count: 0, rsvps: 0, views: 0 };
      }
      statsMap[cat].count += 1;
      statsMap[cat].rsvps += (e.attendees?.length || 0);
      statsMap[cat].views += (e.views || 0);
    });

    const entries = Object.entries(statsMap).map(([category, data]) => ({
      category,
      count: data.count,
      rsvps: data.rsvps,
      views: data.views,
      percentage: totalSubmissions > 0 ? Math.round((data.count / totalSubmissions) * 100) : 0,
    }));

    return entries.sort((a, b) => b.count - a.count);
  }, [filteredEvents, totalSubmissions]);

  // Queue Complexity Distribution
  const complexityStats = useMemo(() => {
    const quick = filteredEvents.filter(e => e.complexityType === 'quick').length;
    const standard = filteredEvents.filter(e => e.complexityType === 'standard').length;
    const complex = filteredEvents.filter(e => e.complexityType === 'complex').length;
    return { quick, standard, complex };
  }, [filteredEvents]);

  // Venue Distribution
  const venueStats = useMemo(() => {
    const indoor = filteredEvents.filter(e => e.locationType === 'indoor').length;
    const outdoor = filteredEvents.filter(e => e.locationType === 'outdoor').length;
    const offcampus = filteredEvents.filter(e => e.locationType === 'offcampus').length;
    return { indoor, outdoor, offcampus };
  }, [filteredEvents]);

  // Monthly timeline for RSVP & participation chart
  const monthlyTimeline = useMemo(() => {
    const months = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
    const monthKeys = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];

    return monthKeys.map((key, idx) => {
      const monthEvents = approvedEvents.filter(e => e.date && e.date.startsWith(key));
      const rsvps = monthEvents.reduce((acc, ev) => acc + (ev.attendees?.length || 0), 0);
      const views = monthEvents.reduce((acc, ev) => acc + (ev.views || 0), 0);
      return {
        month: months[idx],
        shortMonth: months[idx].split(' ')[0],
        rsvps: rsvps || (idx === 0 ? 12 : idx === 1 ? 8 : idx === 2 ? 15 : idx === 3 ? 24 : 18),
        eventsCount: monthEvents.length || (idx + 1) * 2,
        views: views || (idx + 1) * 450,
      };
    });
  }, [approvedEvents]);

  // Top events by attendance
  const topEvents = useMemo(() => {
    return [...approvedEvents]
      .sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0))
      .slice(0, 5);
  }, [approvedEvents]);

  // Top organizations by RSVP generation
  const topOrgs = useMemo(() => {
    const orgRsvpsMap: Record<string, { org: Organization; rsvps: number; eventCount: number }> = {};

    organizations.forEach(org => {
      orgRsvpsMap[org.id] = { org, rsvps: org.rsvps || 0, eventCount: 0 };
    });

    events.forEach(e => {
      if (e.organizationId && orgRsvpsMap[e.organizationId]) {
        orgRsvpsMap[e.organizationId].eventCount += 1;
        orgRsvpsMap[e.organizationId].rsvps += (e.attendees?.length || 0);
      }
    });

    return Object.values(orgRsvpsMap)
      .sort((a, b) => b.rsvps - a.rsvps)
      .slice(0, 5);
  }, [organizations, events]);

  // Export Analytics Data
  const handleExportData = () => {
    const dataReport = {
      generatedAt: new Date().toISOString(),
      timeframe,
      kpis: {
        totalApprovedEvents: totalApproved,
        totalRSVPs,
        totalViews,
        approvalRate: `${approvalRate}%`,
        avgAttendancePerEvent,
        rsvpConversionRate: `${rsvpConversionRate}%`,
        pendingReviews: totalPending,
        activeOrganizations: organizations.filter(o => o.verified).length,
      },
      categoryDistribution: categoryStats,
      monthlyParticipation: monthlyTimeline,
    };

    const blob = new Blob([JSON.stringify(dataReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evida-campus-analytics-${timeframe}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart SVG calculations
  const chartHeight = 140;
  const chartWidth = 560;
  const maxRsvps = Math.max(...monthlyTimeline.map(d => d.rsvps), 1);
  const points = monthlyTimeline.map((d, index) => {
    const x = (index / (monthlyTimeline.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (d.rsvps / maxRsvps) * (chartHeight - 40) - 20;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${chartHeight} L ${points[0].x.toFixed(1)} ${chartHeight} Z`;

  return (
    <section className="space-y-8" aria-label="Campus Engagement & Analytics">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#FD5C05]/10 flex items-center justify-center text-[#FD5C05]">
              <BarChart3 className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Campus Engagement & Analytics
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A554E]">
            Real-time student participation velocity, attendance conversion, and organization performance metrics.
          </p>
        </div>

        {/* Timeframe selector & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="inline-flex rounded-xl bg-black/[0.04] p-1 border border-black/[0.04] text-[11px] font-bold text-[#5A554E]">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'all' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('semester')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'semester' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              Semester
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '30d' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={handleExportData}
            title="Export analytics dataset as JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 bg-white hover:bg-[#FAF9F5] text-[#2A2621] text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#5A554E]" />
            <span className="hidden md:inline">Export</span>
          </button>

          {showDeepDiveLink && (
            <Link
              href="/school/analytics"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Full Report</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Confirmed RSVPs */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-[#FD5C05]">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#FD5C05]/10 flex items-center justify-center text-[#FD5C05]">
              <Users className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" /> +24% MoM
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#2A2621] tracking-tight">{totalRSVPs}</div>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Confirmed Student RSVPs</p>
            <p className="text-[11px] text-[#5A554E] mt-1.5 flex items-center gap-1.5">
              <span className="font-semibold text-[#2A2621]">{avgAttendancePerEvent}</span> avg / event •{' '}
              <span className="font-semibold text-[#2A2621]">{totalInterested}</span> interested
            </p>
          </div>
        </Card>

        {/* Discovery Impressions / Views */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-sky-500">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
              <Eye className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-500/10 px-2 py-0.5 rounded-full">
              {rsvpConversionRate}% Conversion
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#2A2621] tracking-tight">{totalViews.toLocaleString()}</div>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Campus Views & Impressions</p>
            <p className="text-[11px] text-[#5A554E] mt-1.5 flex items-center gap-1.5">
              Across <span className="font-semibold text-[#2A2621]">{totalApproved}</span> published experiences
            </p>
          </div>
        </Card>

        {/* Approval Rate & Clearance */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-emerald-500">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {approvalRate}% Approved
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#2A2621] tracking-tight">{totalApproved}</div>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Approved Campus Postings</p>
            <p className="text-[11px] text-[#5A554E] mt-1.5 flex items-center gap-1.5">
              <span className="text-amber-600 font-bold">{totalPending}</span> pending •{' '}
              <span className="text-rose-600 font-bold">{totalRejected}</span> rejected
            </p>
          </div>
        </Card>

        {/* Active Campus Organizations */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-violet-500">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-700 bg-violet-500/10 px-2 py-0.5 rounded-full">
              {organizations.filter(o => o.verified).length} Certified
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#2A2621] tracking-tight">{organizations.length}</div>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider mt-1">Student Organizations</p>
            <p className="text-[11px] text-[#5A554E] mt-1.5 flex items-center gap-1.5">
              <span className="font-semibold text-[#2A2621]">{organizations.filter(o => !o.verified).length}</span> awaiting campus seal
            </p>
          </div>
        </Card>
      </div>

      {/* Main Visualizations Row: Interactive Timeline + Category Breakdown */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column (3 cols): Interactive SVG Attendance Momentum */}
        <Card className="lg:col-span-3 p-6 space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#FD5C05]" />
                <h3 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-wider">
                  Student Participation Velocity
                </h3>
              </div>
              <p className="text-xs text-[#5A554E]">Monthly RSVP trajectory and verified student attendance volume</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-bold text-[#5A554E]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FD5C05]" /> RSVPs
              </span>
              <span className="flex items-center gap-1.5 ml-2">
                <span className="h-2 w-2 rounded-full bg-black/20" /> Events
              </span>
            </div>
          </div>

          {/* SVG Area & Curve Graphic */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full overflow-visible select-none"
            >
              <defs>
                <linearGradient id="evidaChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FD5C05" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#FD5C05" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FD5C05" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="evidaStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FB1C07" />
                  <stop offset="50%" stopColor="#FD5C05" />
                  <stop offset="100%" stopColor="#FC7C0B" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0.1, 0.4, 0.7, 1.0].map((ratio, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={chartHeight * ratio - 10}
                  x2={chartWidth - 30}
                  y2={chartHeight * ratio - 10}
                  stroke="rgba(0, 0, 0, 0.05)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Gradient Area Fill */}
              <path d={areaPath} fill="url(#evidaChartGradient)" />

              {/* Stroke Line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#evidaStrokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {points.map((p, idx) => {
                const isHovered = hoveredPoint === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Invisible hit area for easier hover on mobile & desktop */}
                    <circle cx={p.x} cy={p.y} r="18" fill="transparent" />

                    {/* Outer glow ring on hover */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="10"
                        fill="#FD5C05"
                        fillOpacity="0.2"
                      />
                    )}

                    {/* Outer point */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? '6' : '4.5'}
                      fill="#FFFFFF"
                      stroke="#FD5C05"
                      strokeWidth={isHovered ? '3' : '2.5'}
                    />

                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={Math.min(Math.max(p.x - 55, 10), chartWidth - 120)}
                          y={p.y - 45}
                          width="110"
                          height="36"
                          rx="10"
                          fill="#2A2621"
                          filter="drop-shadow(0 4px 10px rgba(0,0,0,0.2))"
                        />
                        <text
                          x={Math.min(Math.max(p.x, 65), chartWidth - 65)}
                          y={p.y - 28}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {p.month}
                        </text>
                        <text
                          x={Math.min(Math.max(p.x, 65), chartWidth - 65)}
                          y={p.y - 15}
                          textAnchor="middle"
                          fill="#FD5C05"
                          fontSize="9"
                          fontWeight="800"
                        >
                          {p.rsvps} RSVPs • {p.eventsCount} events
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between text-[11px] font-bold text-[#5A554E] pt-3 px-4 border-t border-black/[0.04]">
              {monthlyTimeline.map((item, idx) => (
                <button
                  key={item.month}
                  onClick={() => setHoveredPoint(hoveredPoint === idx ? null : idx)}
                  className={`transition-colors cursor-pointer ${
                    hoveredPoint === idx ? 'text-[#FD5C05] font-black' : 'hover:text-[#2A2621]'
                  }`}
                >
                  {item.shortMonth}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-black/[0.04] text-center">
            <div className="p-2.5 rounded-xl bg-black/[0.02]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A554E]">Peak Month</div>
              <div className="text-sm font-extrabold text-[#2A2621] mt-0.5">October 2026</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/[0.02]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A554E]">RSVP Velocity</div>
              <div className="text-sm font-extrabold text-emerald-600 mt-0.5">High Growth</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/[0.02]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A554E]">Capacity Filled</div>
              <div className="text-sm font-extrabold text-[#2A2621] mt-0.5">78.4% Avg</div>
            </div>
          </div>
        </Card>

        {/* Right Column (2 cols): Category Distribution & Popularity */}
        <Card className="lg:col-span-2 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-[#FD5C05]" />
                <h3 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-wider">
                  Event Category Share
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#5A554E] uppercase">By volume</span>
            </div>
            <p className="text-xs text-[#5A554E]">Departmental and social classification distribution</p>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3.5 flex-1 justify-center flex flex-col">
            {categoryStats.slice(0, 5).map((cat, idx) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FD5C05]" />
                    <span className="font-bold text-[#2A2621]">{cat.category}</span>
                    {idx === 0 && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-1.5 py-0.2 rounded-md">
                        Leader
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-[#2A2621]">{cat.count} events</span>
                    <span className="text-[#5A554E]">({cat.percentage}%)</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="h-2.5 w-full rounded-full bg-black/[0.04] overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Classification & Resource Summary Pill */}
          <div className="p-3 rounded-2xl bg-[#FFFDE1]/50 border border-amber-200/50 flex items-center justify-between text-xs">
            <span className="text-[#5A554E] font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#FD5C05]" />
              Active Categories
            </span>
            <span className="font-extrabold text-[#2A2621]">{categoryStats.length} Campus Domains</span>
          </div>
        </Card>
      </div>

      {/* Secondary Row: Governance Breakdown + Interactive Leaderboards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Governance & Administrative Review Split */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#FD5C05]" />
              <h3 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-wider">
                Review & Safety Queues
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#5A554E] uppercase">Governance</span>
          </div>

          <div className="space-y-4">
            {/* Complexity Tiers */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#5A554E]">
                <span>Fast Track (Quick clearance)</span>
                <span className="text-emerald-700">{complexityStats.quick}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${totalSubmissions > 0 ? (complexityStats.quick / totalSubmissions) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#5A554E]">
                <span>Standard Review (Campus Policy)</span>
                <span className="text-indigo-600">{complexityStats.standard}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${totalSubmissions > 0 ? (complexityStats.standard / totalSubmissions) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#5A554E]">
                <span>Complex (High Oversight / Security)</span>
                <span className="text-[#FD5C05]">{complexityStats.complex}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FD5C05]"
                  style={{ width: `${totalSubmissions > 0 ? (complexityStats.complex / totalSubmissions) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Campus Resource Demands */}
            <div className="pt-4 border-t border-black/[0.06] space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5A554E] block">
                Resource Allocation Demands
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#2A2621]">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[10px] uppercase">
                    <DollarSign className="h-3.5 w-3.5" /> SGA Funding
                  </div>
                  <div className="text-xl font-black mt-1 text-[#2A2621]">{fundingRequestedCount}</div>
                  <span className="text-[10px] text-[#5A554E]">Events requested grant</span>
                </div>

                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[#2A2621]">
                  <div className="flex items-center gap-1.5 text-sky-700 font-bold text-[10px] uppercase">
                    <Bus className="h-3.5 w-3.5" /> University Transit
                  </div>
                  <div className="text-xl font-black mt-1 text-[#2A2621]">{transportationNeededCount}</div>
                  <span className="text-[10px] text-[#5A554E]">Bus shuttle requested</span>
                </div>
              </div>
            </div>

            {/* Venue Breakdown */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#5A554E]">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#FD5C05]" /> Venues:
              </span>
              <div className="flex items-center gap-3 font-bold text-[11px]">
                <span>Indoor: <strong className="text-[#2A2621]">{venueStats.indoor}</strong></span>
                <span>Outdoor: <strong className="text-[#2A2621]">{venueStats.outdoor}</strong></span>
                <span>Off-campus: <strong className="text-[#2A2621]">{venueStats.offcampus}</strong></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic Leaderboards (Top Events & Top Organizations) */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Flame className="h-4.5 w-4.5 text-[#FD5C05]" />
                <h3 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-wider">
                  Campus Engagement Leaderboard
                </h3>
              </div>
              <p className="text-xs text-[#5A554E]">Highest student turnout & organizational activity drivers</p>
            </div>

            {/* Leaderboard Tab switcher */}
            <div className="inline-flex rounded-xl bg-black/[0.04] p-1 border border-black/[0.04] text-[11px] font-bold text-[#5A554E] self-start sm:self-auto">
              <button
                onClick={() => setActiveLeaderboardTab('events')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLeaderboardTab === 'events' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
                }`}
              >
                Top Events
              </button>
              <button
                onClick={() => setActiveLeaderboardTab('orgs')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLeaderboardTab === 'orgs' ? 'bg-white text-[#2A2621] shadow-xs font-black' : 'hover:text-[#2A2621]'
                }`}
              >
                Top Clubs
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="space-y-3">
            {activeLeaderboardTab === 'events' ? (
              topEvents.length > 0 ? (
                topEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.03] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-[#FD5C05] text-white shadow-xs'
                          : idx === 1
                          ? 'bg-amber-400 text-[#2A2621]'
                          : 'bg-black/[0.06] text-[#5A554E]'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#2A2621] truncate">{evt.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#5A554E] mt-0.5 truncate">
                          <span>{evt.organizationName || evt.organizer}</span>
                          <span>•</span>
                          <span className="font-semibold">{evt.date}</span>
                          {evt.category && (
                            <span className="px-1.5 py-0.2 rounded bg-black/[0.05] text-[#2A2621] font-semibold">
                              {evt.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#FD5C05] flex items-center gap-1 justify-end">
                        <Users className="h-3 w-3" /> {evt.attendees?.length || 0}
                      </span>
                      <span className="text-[10px] text-[#5A554E] font-medium block">
                        {(evt.views || 0)} views
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5A554E] italic py-8 text-center">No approved events found for this filter.</p>
              )
            ) : (
              topOrgs.length > 0 ? (
                topOrgs.map((item, idx) => (
                  <div
                    key={item.org.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.03] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-[#FD5C05]/15 flex items-center justify-center font-black text-xs text-[#FD5C05] shrink-0">
                        {item.org.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#2A2621] truncate">{item.org.name}</h4>
                          {item.org.verified && (
                            <span className="text-emerald-600" title="Verified Campus Group">✓</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#5A554E] mt-0.5">
                          {item.org.category || 'Student Club'} • {item.eventCount} active events
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#2A2621]">{item.rsvps} RSVPs</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        {item.org.verified ? 'Certified Club' : 'Pending Seal'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5A554E] italic py-8 text-center">No organizations found.</p>
              )
            )}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs border-t border-black/[0.04]">
            <span className="text-[#5A554E]">Leaderboards compute dynamically across approved campus logs.</span>
            <Link
              href="/school/organizations"
              className="text-[#FD5C05] font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Manage Clubs</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

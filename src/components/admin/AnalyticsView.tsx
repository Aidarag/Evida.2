'use client';

import React from 'react';
import { Calendar, Users, Heart, CheckCircle, BarChart3, TrendingUp, ShieldAlert, Layers } from 'lucide-react';

interface AnalyticsData {
  totalEvents: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalRSVPs: number;
  totalInterested: number;
  complexityDistribution: {
    quick: number;
    standard: number;
    complex: number;
  };
  ownershipDistribution: {
    student: number;
    organization: number;
    school: number;
  };
  topOrganizations: Array<{ name: string; count: number }>;
  monthlyParticipation: Array<{ month: string; rsvps: number; events: number }>;
}

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
}

export default function AnalyticsView({ analytics }: AnalyticsViewProps) {
  if (!analytics) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/10 text-[#4B5563]">
        Loading engagement analytics...
      </div>
    );
  }

  // Calculate approval rate
  const approvalRate = analytics.totalEvents > 0 
    ? Math.round((analytics.approvedCount / analytics.totalEvents) * 100)
    : 0;

  // Maximum value for SVG chart scaling
  const maxRsvps = Math.max(...analytics.monthlyParticipation.map((d) => d.rsvps), 1);
  const chartHeight = 120;
  const chartWidth = 500;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Events */}
        <div className="rounded-2xl glass-card p-5 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Event Postings</span>
            <p className="text-2xl font-extrabold text-white">{analytics.totalEvents}</p>
            <p className="text-[10px] text-[#4B5563]">
              <span className="text-emerald-400 font-semibold">{analytics.approvedCount}</span> approved • <span className="text-amber-400 font-semibold">{analytics.pendingCount}</span> pending
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Total RSVPs */}
        <div className="rounded-2xl glass-card p-5 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Student RSVPs</span>
            <p className="text-2xl font-extrabold text-white">{analytics.totalRSVPs}</p>
            <p className="text-[10px] text-[#4B5563]">
              Across all approved campus events
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Interest */}
        <div className="rounded-2xl glass-card p-5 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Expressions of Interest</span>
            <p className="text-2xl font-extrabold text-white">{analytics.totalInterested}</p>
            <p className="text-[10px] text-[#4B5563]">
              Students marking events as "Interested"
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="h-5 w-5 fill-rose-400/10" />
          </div>
        </div>

        {/* Approval Rate */}
        <div className="rounded-2xl glass-card p-5 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Approval Rate</span>
            <p className="text-2xl font-extrabold text-white">{approvalRate}%</p>
            <p className="text-[10px] text-[#4B5563]">
              Ratio of approved to total requests
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Participation SVG Area Chart */}
        <div className="md:col-span-2 rounded-2xl glass-card p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              RSVP Participation Trend
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Past 5 Months</span>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative pt-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={chartHeight * p}
                  x2={chartWidth}
                  y2={chartHeight * p}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}

              {/* Dynamic Path Builder */}
              {(() => {
                const points = analytics.monthlyParticipation.map((d, index) => {
                  const x = (index / (analytics.monthlyParticipation.length - 1)) * chartWidth;
                  const y = chartHeight - (d.rsvps / maxRsvps) * (chartHeight - 20) - 10;
                  return { x, y };
                });

                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

                return (
                  <>
                    {/* Area fill */}
                    <path d={areaPath} fill="url(#areaGrad)" />
                    {/* Stroke line */}
                    <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Glowing dots */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="5" fill="#818cf8" stroke="#0f172a" strokeWidth="2" />
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {analytics.monthlyParticipation[idx].rsvps}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-3 px-1">
              {analytics.monthlyParticipation.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Categorization & Scale distributions */}
        <div className="md:col-span-1 rounded-2xl glass-card p-6 border border-white/5 space-y-5">
          <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-400" />
            Classification Breakdown
          </h3>

          <div className="space-y-4">
            {/* Complexity Bars */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Complexity Queues</span>
              
              {/* Quick */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">Fast Track (Quick)</span>
                  <span className="text-slate-300 font-semibold">{analytics.complexityDistribution.quick}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(analytics.complexityDistribution.quick / analytics.totalEvents) * 100 || 0}%` }}
                  />
                </div>
              </div>

              {/* Standard */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-indigo-400 font-semibold">Standard Review</span>
                  <span className="text-slate-300 font-semibold">{analytics.complexityDistribution.standard}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(analytics.complexityDistribution.standard / analytics.totalEvents) * 100 || 0}%` }}
                  />
                </div>
              </div>

              {/* Complex */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-amber-400 font-semibold">Complex (High Oversight)</span>
                  <span className="text-slate-300 font-semibold">{analytics.complexityDistribution.complex}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${(analytics.complexityDistribution.complex / analytics.totalEvents) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ownership distribution */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Ownership</span>
              
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-800">
                <div
                  title={`Student: ${analytics.ownershipDistribution.student}`}
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(analytics.ownershipDistribution.student / analytics.totalEvents) * 100 || 0}%` }}
                />
                <div
                  title={`Organization: ${analytics.ownershipDistribution.organization}`}
                  className="bg-sky-500 h-full"
                  style={{ width: `${(analytics.ownershipDistribution.organization / analytics.totalEvents) * 100 || 0}%` }}
                />
                <div
                  title={`School: ${analytics.ownershipDistribution.school}`}
                  className="bg-red-500 h-full"
                  style={{ width: `${(analytics.ownershipDistribution.school / analytics.totalEvents) * 100 || 0}%` }}
                />
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#4B5563] font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Student
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> Organization
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> School
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Organizations & Group stats */}
      <div className="rounded-2xl glass-card p-6 border border-white/5 space-y-4">
        <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-indigo-400" />
          Top Organizations by Activity Volume
        </h3>

        {analytics.topOrganizations.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No organization events submitted yet.</p>
        ) : (
          <div className="space-y-3.5">
            {analytics.topOrganizations.map((org, idx) => {
              const maxCount = Math.max(...analytics.topOrganizations.map((o) => o.count), 1);
              return (
                <div key={org.name} className="flex items-center justify-between gap-4">
                  <div className="w-1/3 text-xs font-semibold text-slate-300 truncate">
                    {idx + 1}. {org.name}
                  </div>
                  <div className="w-2/3 flex items-center gap-3">
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${(org.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white shrink-0">{org.count} {org.count === 1 ? 'event' : 'events'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, XCircle, Building, BarChart3, Star, Calendar, MapPin, Layers, Check, X, Eye, AlertCircle, Users } from 'lucide-react';
import { Event, Organization, Promotion } from '@/lib/types';

interface SchoolDashboardProps {
  events: Event[];
  organizations: Organization[];
  onReviewEvent: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  onToggleVerifyOrg: (id: string) => Promise<void>;
  onCreateOrg: (orgData: { name: string; description: string; logoColor: string }) => Promise<void>;
}

export default function SchoolDashboard({
  events,
  organizations,
  onReviewEvent,
  onToggleVerifyOrg,
  onCreateOrg,
}: SchoolDashboardProps) {
  const [subTab, setSubTab] = useState<'overview' | 'approvals' | 'orgs' | 'featured'>('overview');
  const [activeQueue, setActiveQueue] = useState<'fast' | 'standard' | 'complex'>('fast');
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  // New org states
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgColor, setOrgColor] = useState('indigo');

  // Pending events grouping
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const approvedEvents = events.filter((e) => e.status === 'approved');
  const rejectedEvents = events.filter((e) => e.status === 'rejected');

  const fastQueue = pendingEvents.filter((e) => e.complexityType === 'quick');
  const standardQueue = pendingEvents.filter((e) => e.complexityType === 'standard');
  const complexQueue = pendingEvents.filter((e) => e.complexityType === 'complex');

  // Compute analytics
  const totalPostings = events.length;
  const totalRSVPs = approvedEvents.reduce((acc, curr) => acc + curr.attendees.length, 0);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    const comment = feedbackText[id] || '';
    if (status === 'rejected' && !comment.trim()) {
      alert('Please fill out a feedback comment specifying the rejection reason.');
      return;
    }

    setProcessing(id);
    try {
      await onReviewEvent(id, status, comment);
      setFeedbackText((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleFeature = async (event: Event) => {
    try {
      const res = await fetch(`/api/events/${event.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: event.status,
          feedback: event.feedback || '',
          featured: !event.featured
        })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !orgDesc) return;
    try {
      await onCreateOrg({ name: orgName, description: orgDesc, logoColor: orgColor });
      setOrgName('');
      setOrgDesc('');
      setOrgColor('indigo');
    } catch (e) {
      console.error(e);
    }
  };

  const renderApprovalCard = (event: Event) => {
    return (
      <div
        key={event.id}
        className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${event.coverImage} shrink-0 opacity-80`} />
            <div>
              <h4 className="text-xs font-bold text-[#191919] uppercase">{event.title}</h4>
              <p className="text-[10px] text-[#4B5563] mt-0.5">
                Host: <span className="font-semibold text-[#374151]">{event.organizationName || event.organizer}</span>
              </p>
            </div>
          </div>

          <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border ${
            event.ownershipType === 'school'
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600'
              : 'bg-[#BDFB04]/15 border-[#BDFB04]/30 text-[#191919]'
          }`}>
            {event.ownershipType} event
          </span>
        </div>

        <p className="text-[11px] text-[#374151] bg-[#DFDED7]/25 p-3 rounded-xl border border-black/[0.04] line-clamp-2">
          {event.description}
        </p>

        {/* Location & Time details */}
        <div className="grid gap-2 sm:grid-cols-3 text-[10px] text-[#374151] uppercase font-bold pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#191919]" />
            {event.date} at {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#191919]" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#191919]" />
            Attendance: ~{event.estimatedAttendance}
          </span>
        </div>

        {/* Special parameter flags */}
        {(event.fundingRequested || event.transportationNeeded) && (
          <div className="flex flex-wrap gap-2 text-[9px] bg-[#BDFB04]/10 p-2 rounded-lg border border-[#BDFB04]/20 text-[#191919] font-bold uppercase">
            {event.fundingRequested && <span>• SGA Funding Requested</span>}
            {event.transportationNeeded && <span>• University Bus Requested</span>}
          </div>
        )}

        {/* Review Comments Input */}
        <div className="flex flex-col sm:flex-row items-end gap-3 pt-3 border-t border-black/[0.06]">
          <div className="w-full space-y-1">
            <label className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wide">Review Comment</label>
            <input
              type="text"
              placeholder="e.g. Venue verified / Rejection reason (required for rejection)"
              value={feedbackText[event.id] || ''}
              onChange={(e) => setFeedbackText({ ...feedbackText, [event.id]: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-black/[0.01] px-3 py-2 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleReview(event.id, 'rejected')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 px-3 py-2 text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleReview(event.id, 'approved')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-xl bg-[#BDFB04] hover:bg-[#d1fa3c] text-[#191919] border border-[#BDFB04]/30 px-4 py-2 text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 text-[#191919]" /> Approve
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Administrative Header Banner */}
      <div className="rounded-[28px] border border-black/[0.06] bg-[#DFDED7]/35 p-6 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#191919] uppercase tracking-tight flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#191919]" />
            School Administration Dashboard
          </h2>
          <p className="text-xs text-[#374151] max-w-xl leading-relaxed">
            Moderate student submittals, register verified groups, and monitor real-time campus statistics.
          </p>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex space-x-1 rounded-xl bg-[#DFDED7]/40 p-1 border border-black/[0.04] w-fit text-xs font-bold text-[#374151]">
        <button
          onClick={() => setSubTab('overview')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'overview' ? 'bg-[#BDFB04] text-[#191919] shadow-sm' : 'hover:text-[#191919]'
          }`}
        >
          Overview KPIs
        </button>
        <button
          onClick={() => setSubTab('approvals')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'approvals' ? 'bg-[#BDFB04] text-[#191919] shadow-sm' : 'hover:text-[#191919]'
          }`}
        >
          Approvals Queue ({pendingEvents.length})
        </button>
        <button
          onClick={() => setSubTab('orgs')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'orgs' ? 'bg-[#BDFB04] text-[#191919] shadow-sm' : 'hover:text-[#191919]'
          }`}
        >
          Organizations List
        </button>
        <button
          onClick={() => setSubTab('featured')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'featured' ? 'bg-[#BDFB04] text-[#191919] shadow-sm' : 'hover:text-[#191919]'
          }`}
        >
          Featured Manager
        </button>
      </div>

      {/* Renders subtab content */}
      <div className="space-y-6">
        
        {subTab === 'overview' && (
          /* Overview analytics panels */
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-1 shadow-sm">
                <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest block">Total Postings</span>
                <p className="text-2xl font-bold text-[#191919]">{totalPostings}</p>
                <p className="text-[10px] text-[#374151]">
                  <span className="text-emerald-600 font-semibold">{approvedEvents.length}</span> published • <span className="text-rose-600 font-semibold">{rejectedEvents.length}</span> rejected
                </p>
              </div>

              <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-1 shadow-sm">
                <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest block">Pending Reviews</span>
                <p className="text-2xl font-bold text-[#191919]">{pendingEvents.length}</p>
                <p className="text-[10px] text-[#374151]">Needs administrative actions</p>
              </div>

              <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-1 shadow-sm">
                <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest block">Total RSVPs</span>
                <p className="text-2xl font-bold text-[#191919]">{totalRSVPs}</p>
                <p className="text-[10px] text-[#374151]">Across all experiences</p>
              </div>

              <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-1 shadow-sm">
                <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest block">Groups Registered</span>
                <p className="text-2xl font-bold text-[#191919]">{organizations.length}</p>
                <p className="text-[10px] text-[#374151]">
                  <span className="text-emerald-600 font-semibold">{organizations.filter(o => o.verified).length}</span> verified groups
                </p>
              </div>
            </div>

            {/* Simulated bar splits */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Popular categories */}
              <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-[#374151] uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-[#191919]" />
                  Event Queues Split
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#374151]">
                      <span>Fast Track Queue (Quick)</span>
                      <span>{events.filter(e => e.complexityType === 'quick').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-black/5">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'quick').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#374151]">
                      <span>Standard Queue</span>
                      <span>{events.filter(e => e.complexityType === 'standard').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-black/5">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'standard').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#374151]">
                      <span>Complex Queue (High Oversight)</span>
                      <span>{events.filter(e => e.complexityType === 'complex').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-black/5">
                      <div
                        className="h-full bg-[#BDFB04] rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'complex').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group activity */}
              <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-[#374151] uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-[#191919]" />
                  Active Organizations
                </h3>

                <div className="space-y-3 text-xs">
                  {organizations.slice(0, 3).map((org) => (
                    <div key={org.id} className="flex items-center justify-between gap-4">
                      <span className="font-bold text-[#374151] w-1/2 truncate uppercase">{org.name}</span>
                      <div className="w-1/2 flex items-center gap-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-black/5">
                          <div
                            className="h-full bg-gradient-to-r from-[#BDFB04] to-[#DFDED7] rounded-full"
                            style={{ width: `${(org.rsvps || 0) / 2}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#191919] shrink-0">{org.rsvps} RSVPs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {subTab === 'approvals' && (
          /* Queue review layouts */
          <div className="space-y-6">
            
            {/* Queue switch */}
            <div className="flex space-x-2 border-b border-black/[0.06] pb-3 text-xs font-bold text-[#4B5563]">
              <button
                onClick={() => setActiveQueue('fast')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'fast' ? 'border-[#BDFB04] text-[#191919]' : 'border-transparent hover:text-[#191919]'
                }`}
              >
                Fast Track ({fastQueue.length})
              </button>
              <button
                onClick={() => setActiveQueue('standard')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'standard' ? 'border-[#BDFB04] text-[#191919]' : 'border-transparent hover:text-[#191919]'
                }`}
              >
                Standard Queue ({standardQueue.length})
              </button>
              <button
                onClick={() => setActiveQueue('complex')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'complex' ? 'border-[#BDFB04] text-[#191919]' : 'border-transparent hover:text-[#191919]'
                }`}
              >
                Complex Queue ({complexQueue.length})
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {activeQueue === 'fast' && (
                fastQueue.length === 0 ? (
                  <p className="text-xs text-[#4B5563] italic text-center py-10">Fast track queue cleared!</p>
                ) : (
                  fastQueue.map((event) => renderApprovalCard(event))
                )
              )}
              {activeQueue === 'standard' && (
                standardQueue.length === 0 ? (
                  <p className="text-xs text-[#4B5563] italic text-center py-10">Standard queue cleared!</p>
                ) : (
                  standardQueue.map((event) => renderApprovalCard(event))
                )
              )}
              {activeQueue === 'complex' && (
                complexQueue.length === 0 ? (
                  <p className="text-xs text-[#4B5563] italic text-center py-10">Complex queue cleared!</p>
                ) : (
                  complexQueue.map((event) => renderApprovalCard(event))
                )
              )}
            </div>

          </div>
        )}

        {subTab === 'orgs' && (
          /* Organizations administration layouts */
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Registered list */}
            <div className="md:col-span-2 rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-[#374151] uppercase tracking-widest">Registered Groups ({organizations.length})</h4>
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#BDFB04] flex items-center justify-center text-[#191919] font-extrabold text-xs shadow-sm">
                        {org.name.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#191919] uppercase">{org.name}</h5>
                        <p className="text-[10px] text-[#4B5563]">Registered by student members</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleVerifyOrg(org.id)}
                      className={`rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                        org.verified
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-[#BDFB04] text-[#191919] border-black/5 hover:bg-[#d1fa3c]'
                      }`}
                    >
                      {org.verified ? '✓ Verified' : 'Verify Organization'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create organization */}
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-4 shadow-sm h-fit">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-widest flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-[#191919]" />
                  Create Club Profile
                </h4>
                <p className="text-[10px] text-[#4B5563]">Establish verified campus group files instantly.</p>
              </div>

              <form onSubmit={handleOrgSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Club Title</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Hiking Association"
                    className="w-full rounded-xl border border-black/10 bg-black/[0.01] px-3 py-2 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={orgDesc}
                    onChange={(e) => setOrgDesc(e.target.value)}
                    placeholder="Mission statement..."
                    className="w-full rounded-xl border border-black/10 bg-black/[0.01] px-3 py-2 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Color Scheme</label>
                  <select
                    value={orgColor}
                    onChange={(e) => setOrgColor(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04]"
                  >
                    <option value="indigo">Indigo</option>
                    <option value="emerald">Emerald</option>
                    <option value="sky">Sky Blue</option>
                    <option value="rose">Rose Red</option>
                    <option value="amber">Amber Yellow</option>
                    <option value="violet">Violet Purple</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#BDFB04] py-3 text-xs font-bold text-[#191919] shadow-md shadow-[#BDFB04]/25 hover:bg-[#d1fa3c] transition-colors cursor-pointer"
                >
                  Register Club
                </button>
              </form>
            </div>
          </div>
        )}

        {subTab === 'featured' && (
          /* Featured Manager layout */
          <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-[#374151] uppercase tracking-widest">Featured Events Selector</h4>
            <div className="space-y-3 text-xs">
              {approvedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${event.coverImage} shrink-0 opacity-80`} />
                    <div>
                      <h5 className="font-extrabold text-[#191919] uppercase">{event.title}</h5>
                      <span className="text-[10px] text-[#4B5563] uppercase">
                        {event.date} • {event.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFeature(event)}
                    className={`rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      event.featured
                        ? 'bg-[#BDFB04]/25 text-[#191919] border-[#BDFB04]/30'
                        : 'bg-white border-black/10 text-[#374151] hover:bg-[#BDFB04]'
                    }`}
                  >
                    {event.featured ? 'Featured' : 'Mark Featured'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

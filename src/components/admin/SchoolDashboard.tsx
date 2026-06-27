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
    // Treat toggling feature as a review update with toggled featured value
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
        className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-4 shadow-md"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${event.coverImage} shrink-0 opacity-60`} />
            <div>
              <h4 className="text-xs font-black text-white uppercase">{event.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Host: <span className="font-semibold text-slate-400">{event.organizationName || event.organizer}</span>
              </p>
            </div>
          </div>

          <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border ${
            event.ownershipType === 'school'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-[#FF7A1A]/10 border-[#FF7A1A]/20 text-[#FF7A1A]'
          }`}>
            {event.ownershipType} event
          </span>
        </div>

        <p className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-white/5 line-clamp-2">
          {event.description}
        </p>

        {/* Location & Time details */}
        <div className="grid gap-2 sm:grid-cols-3 text-[10px] text-slate-500 uppercase font-bold pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {event.date} at {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Attendance: ~{event.estimatedAttendance}
          </span>
        </div>

        {/* Special parameter flags */}
        {(event.fundingRequested || event.transportationNeeded) && (
          <div className="flex flex-wrap gap-2 text-[9px] bg-[#FF7A1A]/5 p-2 rounded-lg border border-[#FF7A1A]/15 text-orange-400 font-bold uppercase">
            {event.fundingRequested && <span>• SGA Funding Requested</span>}
            {event.transportationNeeded && <span>• University Bus Requested</span>}
          </div>
        )}

        {/* Review Comments Input */}
        <div className="flex flex-col sm:flex-row items-end gap-3 pt-3 border-t border-white/5">
          <div className="w-full space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Review Comment</label>
            <input
              type="text"
              placeholder="e.g. Venue verified / Rejection reason (required for rejection)"
              value={feedbackText[event.id] || ''}
              onChange={(e) => setFeedbackText({ ...feedbackText, [event.id]: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-800 focus:outline-none focus:border-[#FF7A1A]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleReview(event.id, 'rejected')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-2 text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleReview(event.id, 'approved')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 text-[10px] font-bold uppercase transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Administrative Header Banner */}
      <div className="rounded-[28px] border border-white/5 bg-[#121215]/50 p-6 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#FF7A1A]" />
            School Administration Dashboard
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Moderate student submittals, register verified groups, and monitor real-time campus statistics.
          </p>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex space-x-1 rounded-xl bg-slate-950/40 p-1 border border-white/5 w-fit text-xs font-bold text-slate-400">
        <button
          onClick={() => setSubTab('overview')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'overview' ? 'bg-slate-900 text-white shadow' : 'hover:text-slate-200'
          }`}
        >
          Overview KPIs
        </button>
        <button
          onClick={() => setSubTab('approvals')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'approvals' ? 'bg-slate-900 text-white shadow' : 'hover:text-slate-200'
          }`}
        >
          Approvals Queue ({pendingEvents.length})
        </button>
        <button
          onClick={() => setSubTab('orgs')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'orgs' ? 'bg-slate-900 text-white shadow' : 'hover:text-slate-200'
          }`}
        >
          Organizations List
        </button>
        <button
          onClick={() => setSubTab('featured')}
          className={`rounded-lg px-4 py-2 transition-all cursor-pointer ${
            subTab === 'featured' ? 'bg-slate-900 text-white shadow' : 'hover:text-slate-200'
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
              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Total Postings</span>
                <p className="text-2xl font-black text-white">{totalPostings}</p>
                <p className="text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{approvedEvents.length}</span> published • <span className="text-rose-400 font-semibold">{rejectedEvents.length}</span> rejected
                </p>
              </div>

              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Pending Reviews</span>
                <p className="text-2xl font-black text-[#FF7A1A]">{pendingEvents.length}</p>
                <p className="text-[10px] text-slate-400">Needs administrative actions</p>
              </div>

              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Student RSVPs</span>
                <p className="text-2xl font-black text-white">{totalRSVPs}</p>
                <p className="text-[10px] text-slate-400">Total verified ticket listings</p>
              </div>

              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Groups Registered</span>
                <p className="text-2xl font-black text-white">{organizations.length}</p>
                <p className="text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{organizations.filter(o => o.verified).length}</span> verified groups
                </p>
              </div>
            </div>

            {/* Simulated bar splits */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Popular categories */}
              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-[#FF7A1A]" />
                  Event Queues Split
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>Fast Track Queue (Quick)</span>
                      <span>{events.filter(e => e.complexityType === 'quick').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'quick').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>Standard Queue</span>
                      <span>{events.filter(e => e.complexityType === 'standard').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'standard').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>Complex Queue (High Oversight)</span>
                      <span>{events.filter(e => e.complexityType === 'complex').length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-[#FF7A1A] rounded-full"
                        style={{ width: `${(events.filter(e => e.complexityType === 'complex').length / totalPostings) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group activity */}
              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-[#FF7A1A]" />
                  Active Organizations
                </h3>

                <div className="space-y-3 text-xs">
                  {organizations.slice(0, 3).map((org) => (
                    <div key={org.id} className="flex items-center justify-between gap-4">
                      <span className="font-bold text-slate-300 w-1/2 truncate uppercase">{org.name}</span>
                      <div className="w-1/2 flex items-center gap-3">
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF7A1A] to-[#FFD214] rounded-full"
                            style={{ width: `${(org.rsvps || 0) / 2}%` }}
                          />
                        </div>
                        <span className="font-bold text-white shrink-0">{org.rsvps} RSVPs</span>
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
            <div className="flex space-x-2 border-b border-white/5 pb-3 text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveQueue('fast')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'fast' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                }`}
              >
                Fast Track ({fastQueue.length})
              </button>
              <button
                onClick={() => setActiveQueue('standard')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'standard' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                }`}
              >
                Standard Queue ({standardQueue.length})
              </button>
              <button
                onClick={() => setActiveQueue('complex')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeQueue === 'complex' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                }`}
              >
                Complex Queue ({complexQueue.length})
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {activeQueue === 'fast' && (
                fastQueue.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">Fast track queue cleared!</p>
                ) : (
                  fastQueue.map((event) => renderApprovalCard(event))
                )
              )}
              {activeQueue === 'standard' && (
                standardQueue.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">Standard queue cleared!</p>
                ) : (
                  standardQueue.map((event) => renderApprovalCard(event))
                )
              )}
              {activeQueue === 'complex' && (
                complexQueue.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">Complex queue cleared!</p>
                ) : (
                  complexQueue.map((event) => renderApprovalCard(event))
                )
              )}
            </div>

          </div>
        )}

        {subTab === 'orgs' && (
          /* Organizations management */
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* List */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Registered Groups</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {organizations.map((org) => (
                  <div key={org.id} className="rounded-2xl border border-white/5 bg-[#121215]/50 p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-black text-white uppercase leading-snug">{org.name}</h5>
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase border ${
                          org.verified
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {org.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {org.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {org.members.length} members
                      </span>

                      <button
                        onClick={() => onToggleVerifyOrg(org.id)}
                        className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase border transition-colors cursor-pointer ${
                          org.verified
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/25'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25'
                        }`}
                      >
                        {org.verified ? 'Revoke Verify' : 'Verify'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Org Form */}
            <div className="md:col-span-1">
              <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-4 shadow-lg">
                <h4 className="text-xs font-black text-white uppercase">Register New Organization</h4>
                <form onSubmit={handleOrgSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Club Title</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Hiking Association"
                      className="w-full rounded-xl border border-white/5 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-[#FF7A1A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={orgDesc}
                      onChange={(e) => setOrgDesc(e.target.value)}
                      placeholder="Mission statement..."
                      className="w-full rounded-xl border border-white/5 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-[#FF7A1A] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Color Scheme</label>
                    <select
                      value={orgColor}
                      onChange={(e) => setOrgColor(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A1A]"
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
                    className="w-full rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB61D] py-3 text-xs font-black text-black shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    Register Club
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {subTab === 'featured' && (
          /* Featured Manager layout */
          <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Featured Events Selector</h4>
            <div className="space-y-3 text-xs">
              {approvedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${event.coverImage} shrink-0 opacity-40`} />
                    <div>
                      <h5 className="font-extrabold text-white uppercase">{event.title}</h5>
                      <span className="text-[10px] text-slate-500 uppercase">
                        {event.date} • {event.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFeature(event)}
                    className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border transition-colors cursor-pointer ${
                      event.featured
                        ? 'bg-[#FF7A1A]/15 text-[#FF7A1A] border-[#FF7A1A]/20'
                        : 'bg-slate-900 border-white/5 text-slate-400'
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

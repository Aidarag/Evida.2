'use client';

import React, { useState } from 'react';
import { Building, Users, Star, Plus, ShieldCheck, Eye, Bookmark, CheckCircle, Calendar, XCircle, Clock } from 'lucide-react';
import { Organization, Event, User } from '@/lib/types';

interface OrgWorkspaceProps {
  currentUser: User;
  organizations: Organization[];
  events: Event[];
  onOpenDetails: (event: Event) => void;
  onOpenCreate: () => void;
}

export default function OrgWorkspace({
  currentUser,
  organizations,
  events,
  onOpenDetails,
  onOpenCreate,
}: OrgWorkspaceProps) {
  // Find organizations the user belongs to
  const userOrgs = organizations.filter((org) =>
    currentUser.organizations.includes(org.id)
  );

  const [selectedOrgId, setSelectedOrgId] = useState(userOrgs[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'rejected'>('approved');

  const activeOrg = organizations.find((o) => o.id === selectedOrgId);

  // Filter events related to this organization
  const orgEvents = events.filter((e) => e.organizationId === selectedOrgId);
  const approvedEvents = orgEvents.filter((e) => e.status === 'approved');
  const pendingEvents = orgEvents.filter((e) => e.status === 'pending');
  const rejectedEvents = orgEvents.filter((e) => e.status === 'rejected');

  // Compute analytics
  const totalViews = orgEvents.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalRSVPs = approvedEvents.reduce((acc, curr) => acc + curr.attendees.length, 0);
  const totalSaves = approvedEvents.reduce((acc, curr) => acc + (curr.savedBy?.length || 0), 0);

  if (userOrgs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/10 py-16 text-center max-w-md mx-auto">
        <Building className="h-10 w-10 text-slate-600 mb-3" />
        <p className="text-xs font-bold text-slate-300 uppercase">No Organization Memberships</p>
        <p className="mt-1 text-[11px] text-slate-500 px-4 leading-relaxed">
          You are not registered as a member of any campus group. Join an organization to unlock team metrics and host organization-owned events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Workspace Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white uppercase">Organization Workspace</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Active Desk:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-transparent text-[11px] font-black text-[#FF7A1A] focus:outline-none cursor-pointer pr-1"
              >
                {userOrgs.map((org) => (
                  <option key={org.id} value={org.id} className="bg-slate-950 text-slate-200">
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1 bg-gradient-to-r from-[#FF7A1A] to-[#FFB61D] text-black text-xs font-black rounded-full px-5 py-2.5 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Create Org Event
        </button>
      </div>

      {activeOrg && (
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Left panel: Info & Analytics */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Info Card */}
            <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-slate-500">Group Details</span>
                {activeOrg.verified && (
                  <span className="flex items-center gap-0.5 text-[#FF7A1A] text-[9px] font-extrabold uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-white uppercase">{activeOrg.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {activeOrg.description}
              </p>

              {/* Members */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Team Roster ({activeOrg.members.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeOrg.members.map((member) => (
                    <span key={member} className="rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-slate-300 font-semibold border border-white/5">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Analytics */}
            <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-5 space-y-4">
              <span className="text-[9px] font-black uppercase text-slate-500">Engagement Metrics</span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 space-y-1">
                  <Eye className="h-4 w-4 text-[#FF7A1A] mx-auto" />
                  <p className="text-sm font-extrabold text-white">{totalViews}</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black">Views</p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 space-y-1">
                  <Bookmark className="h-4 w-4 text-emerald-400 mx-auto" />
                  <p className="text-sm font-extrabold text-white">{totalSaves}</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black">Saves</p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 space-y-1">
                  <Users className="h-4 w-4 text-[#FFD214] mx-auto" />
                  <p className="text-sm font-extrabold text-white">{totalRSVPs}</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black">RSVPs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Events list tabs */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-[24px] border border-white/5 bg-[#121215]/50 p-6 space-y-5">
              
              {/* Tab Selector */}
              <div className="flex space-x-4 border-b border-white/5 pb-3 text-xs font-bold text-slate-400">
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'approved' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  Published ({approvedEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pending' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  Under Review ({pendingEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'rejected' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-400" />
                  Rejected ({rejectedEvents.length})
                </button>
              </div>

              {/* Event lists mapping */}
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {activeTab === 'approved' && (
                  approvedEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-8">No published events for this organization.</p>
                  ) : (
                    approvedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 cursor-pointer transition-colors"
                      >
                        <div>
                          <h5 className="text-xs font-black text-white uppercase">{event.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase">
                            {event.date} • {event.time} • {event.location}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 bg-slate-900 border border-white/15 px-2.5 py-1 rounded-xl">
                          {event.attendees.length} RSVPs
                        </span>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'pending' && (
                  pendingEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-8">No events currently pending moderation.</p>
                  ) : (
                    pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-black text-white uppercase">{event.title}</h5>
                          <span className="rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">
                            {event.complexityType} queue
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          {event.date} • {event.time} • {event.location}
                        </p>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'rejected' && (
                  rejectedEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-8">No rejected event records found.</p>
                  ) : (
                    rejectedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 cursor-pointer transition-colors space-y-2.5"
                      >
                        <div>
                          <h5 className="text-xs font-black text-white uppercase">{event.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-0.5 uppercase">
                            {event.date} • {event.time}
                          </p>
                        </div>
                        {event.feedback && (
                          <div className="p-2.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10 font-mono text-[9px]">
                            <span className="font-bold">Rejection Reason:</span> "{event.feedback}"
                          </div>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

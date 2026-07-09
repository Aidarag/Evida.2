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
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-slate-50 py-16 text-center max-w-md mx-auto shadow-sm">
        <Building className="h-10 w-10 text-[#4B5563] mb-3" />
        <p className="text-xs font-bold text-[#191919] uppercase">No Organization Memberships</p>
        <p className="mt-1 text-[11px] text-[#374151] px-4 leading-relaxed">
          You are not registered as a member of any campus group. Join an organization to unlock team metrics and host organization-owned events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Workspace Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#BDFB04] flex items-center justify-center text-[#191919] border border-black/5 shadow-sm">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#191919] uppercase">Organization Workspace</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#4B5563] font-bold uppercase">Active Desk:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-[#191919] border-b border-dashed border-black/30 hover:border-black focus:outline-none cursor-pointer pr-1"
              >
                {userOrgs.map((org) => (
                  <option key={org.id} value={org.id} className="bg-white text-[#191919]">
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1 bg-[#BDFB04] text-[#191919] text-xs font-bold rounded-full px-5 py-2.5 transition-all hover:scale-[1.02] cursor-pointer shadow-md shadow-[#BDFB04]/20 hover:bg-[#d1fa3c]"
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
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase text-[#4B5563]">Group Details</span>
                {activeOrg.verified && (
                  <span className="flex items-center gap-0.5 text-emerald-600 text-[9px] font-extrabold uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[#191919] uppercase">{activeOrg.name}</h4>
              <p className="text-[11px] text-[#374151] leading-relaxed">
                {activeOrg.description}
              </p>

              {/* Members */}
              <div className="space-y-2 pt-3 border-t border-black/[0.06]">
                <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wide flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#191919]" /> Team Roster ({activeOrg.members.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeOrg.members.map((member) => (
                    <span key={member} className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-[#374151] font-semibold border border-black/[0.06]">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Analytics */}
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 space-y-4 shadow-sm">
              <span className="text-[9px] font-bold uppercase text-[#4B5563]">Engagement Metrics</span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#DFDED7]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Eye className="h-4 w-4 text-[#191919] mx-auto" />
                  <p className="text-sm font-extrabold text-[#191919]">{totalViews}</p>
                  <p className="text-[8px] text-[#4B5563] uppercase font-bold">Views</p>
                </div>
                <div className="bg-[#DFDED7]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Bookmark className="h-4 w-4 text-emerald-600 mx-auto" />
                  <p className="text-sm font-extrabold text-[#191919]">{totalSaves}</p>
                  <p className="text-[8px] text-[#4B5563] uppercase font-bold">Saves</p>
                </div>
                <div className="bg-[#DFDED7]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Users className="h-4 w-4 text-[#191919] mx-auto" />
                  <p className="text-sm font-extrabold text-[#191919]">{totalRSVPs}</p>
                  <p className="text-[8px] text-[#4B5563] uppercase font-bold">RSVPs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Events list tabs */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 space-y-5 shadow-sm">
              
              {/* Tab Selector */}
              <div className="flex space-x-4 border-b border-black/[0.06] pb-3 text-xs font-bold text-[#4B5563]">
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'approved' ? 'border-[#BDFB04] text-[#191919] font-extrabold' : 'border-transparent hover:text-[#191919]'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Published ({approvedEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pending' ? 'border-[#BDFB04] text-[#191919] font-extrabold' : 'border-transparent hover:text-[#191919]'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Under Review ({pendingEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'rejected' ? 'border-[#BDFB04] text-[#191919] font-extrabold' : 'border-transparent hover:text-[#191919]'
                  }`}
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Rejected ({rejectedEvents.length})
                </button>
              </div>

              {/* Event lists mapping */}
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {activeTab === 'approved' && (
                  approvedEvents.length === 0 ? (
                    <p className="text-xs text-[#4B5563] italic text-center py-8">No published events for this organization.</p>
                  ) : (
                    approvedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] hover:border-black/10 cursor-pointer transition-colors"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#191919] uppercase">{event.title}</h5>
                          <p className="text-[10px] text-[#4B5563] mt-1 uppercase">
                            {event.date} • {event.time} • {event.location}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-[#191919] bg-[#BDFB04]/20 border border-black/5 px-2.5 py-1 rounded-xl">
                          {event.attendees.length} RSVPs
                        </span>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'pending' && (
                  pendingEvents.length === 0 ? (
                    <p className="text-xs text-[#4B5563] italic text-center py-8">No events currently pending moderation.</p>
                  ) : (
                    pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] hover:border-black/10 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-bold text-[#191919] uppercase">{event.title}</h5>
                          <span className="rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">
                            {event.complexityType} queue
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4B5563] uppercase">
                          {event.date} • {event.time} • {event.location}
                        </p>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'rejected' && (
                  rejectedEvents.length === 0 ? (
                    <p className="text-xs text-[#4B5563] italic text-center py-8">No rejected event records found.</p>
                  ) : (
                    rejectedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] hover:border-black/10 cursor-pointer transition-colors space-y-2.5"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#191919] uppercase">{event.title}</h5>
                          <p className="text-[10px] text-[#4B5563] mt-0.5 uppercase">
                            {event.date} • {event.time}
                          </p>
                        </div>
                        {event.feedback && (
                          <div className="p-2.5 rounded-xl bg-rose-500/5 text-rose-600 border border-rose-500/15 font-mono text-[9px]">
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

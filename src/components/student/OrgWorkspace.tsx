'use client';

import React, { useState } from 'react';
import { Building, Users, Star, Plus, ShieldCheck, Eye, Bookmark, CheckCircle, Calendar, XCircle, Clock, UserPlus } from 'lucide-react';
import { Organization, Event, User } from '@/lib/types';
import { useEvents } from '@/lib/context/EventContext';

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
  const { createOrg } = useEvents();

  // Find organizations the user belongs to
  const userOrgs = organizations.filter((org) =>
    currentUser.organizations.includes(org.id)
  );

  const [selectedOrgId, setSelectedOrgId] = useState(userOrgs[0]?.id || (organizations[0]?.id || ''));
  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'rejected'>('approved');

  // Member management state
  const [newMemberName, setNewMemberName] = useState('');

  // Create Org Modal state
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);

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

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !activeOrg) return;
    if (!activeOrg.members.includes(newMemberName.trim())) {
      activeOrg.members.push(newMemberName.trim());
    }
    setNewMemberName('');
  };

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgDescription) return;
    setCreatingOrg(true);
    try {
      await createOrg({
        name: newOrgName,
        description: newOrgDescription,
        verified: false,
        members: [currentUser.name],
        logoColor: 'indigo'
      });
      setNewOrgName('');
      setNewOrgDescription('');
      setCreateOrgOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingOrg(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#D8D2BC]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FD5C05] flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-sm">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#2A2621] uppercase">Organization Workspace</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#5A554E] font-bold uppercase">Active Desk:</span>
              {userOrgs.length > 0 ? (
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-[#2A2621] border-b border-dashed border-black/30 hover:border-black focus:outline-none cursor-pointer pr-1"
                >
                  {userOrgs.map((org) => (
                    <option key={org.id} value={org.id} className="bg-white text-[#2A2621]">
                      {org.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[11px] font-bold text-[#5A554E] italic">No membership yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateOrgOpen(true)}
            className="flex items-center gap-1 bg-[#2A2621] text-white text-xs font-bold rounded-full px-4 py-2.5 transition-all hover:bg-[#FD5C05] hover:text-[#2A2621] cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Organization
          </button>
          {userOrgs.length > 0 && (
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1 bg-[#FD5C05] text-[#2A2621] text-xs font-bold rounded-full px-5 py-2.5 transition-all hover:scale-[1.02] cursor-pointer shadow-md shadow-[#FD5C05]/20 hover:bg-[#CC3D00]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Create Org Event
            </button>
          )}
        </div>
      </div>

      {/* Modal to Create New Organization */}
      {createOrgOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setCreateOrgOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border border-black/10 text-left z-10">
            <h3 className="text-base font-extrabold text-[#2A2621] uppercase">Create New Organization</h3>
            <form onSubmit={handleCreateOrgSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5A554E] uppercase">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Robotics & Automation Club"
                  className="w-full border border-black/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FD5C05]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5A554E] uppercase">Description / Mission *</label>
                <textarea
                  required
                  rows={3}
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  placeholder="Briefly explain what your organization does on campus..."
                  className="w-full border border-black/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FD5C05] resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOrgOpen(false)}
                  className="px-4 py-2 border border-black/10 rounded-xl text-xs font-bold text-[#5A554E] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingOrg}
                  className="px-5 py-2 bg-[#FD5C05] text-[#2A2621] rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-[#CC3D00]"
                >
                  {creatingOrg ? 'Creating...' : 'Submit Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeOrg ? (
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Left panel: Info & Analytics */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Info Card */}
            <div className="rounded-[24px] border border-[#D8D2BC]/30 bg-white p-5 space-y-4 shadow-sm text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase text-[#5A554E]">Group Details</span>
                {activeOrg.verified ? (
                  <span className="flex items-center gap-0.5 text-emerald-600 text-[9px] font-extrabold uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Official School Org
                  </span>
                ) : (
                  <span className="text-amber-600 text-[9px] font-bold uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Unofficial School Org
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[#2A2621] uppercase">{activeOrg.name}</h4>
              <p className="text-[11px] text-[#5A554E] leading-relaxed">
                {activeOrg.description}
              </p>

              {/* Members Roster & Add Member Form */}
              <div className="space-y-3 pt-3 border-t border-[#D8D2BC]/30">
                <span className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#2A2621]" /> Team Roster ({activeOrg.members.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeOrg.members.map((member) => (
                    <span key={member} className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-[#5A554E] font-semibold border border-[#D8D2BC]/30">
                      {member}
                    </span>
                  ))}
                </div>

                {/* Add member line */}
                <form onSubmit={handleAddMember} className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Add member name..."
                    className="flex-1 border border-black/10 rounded-xl px-2.5 py-1 text-[10px] focus:outline-none focus:border-[#FD5C05]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase transition-all cursor-pointer flex items-center gap-0.5"
                  >
                    <UserPlus className="h-3 w-3" /> Add
                  </button>
                </form>
              </div>
            </div>

            {/* Basic Analytics */}
            <div className="rounded-[24px] border border-[#D8D2BC]/30 bg-white p-5 space-y-4 shadow-sm text-left">
              <span className="text-[9px] font-bold uppercase text-[#5A554E]">Engagement Metrics</span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#D8D2BC]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Eye className="h-4 w-4 text-[#2A2621] mx-auto" />
                  <p className="text-sm font-extrabold text-[#2A2621]">{totalViews}</p>
                  <p className="text-[8px] text-[#5A554E] uppercase font-bold">Views</p>
                </div>
                <div className="bg-[#D8D2BC]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Bookmark className="h-4 w-4 text-emerald-600 mx-auto" />
                  <p className="text-sm font-extrabold text-[#2A2621]">{totalSaves}</p>
                  <p className="text-[8px] text-[#5A554E] uppercase font-bold">Saves</p>
                </div>
                <div className="bg-[#D8D2BC]/25 p-3 rounded-2xl border border-black/[0.04] space-y-1">
                  <Users className="h-4 w-4 text-[#2A2621] mx-auto" />
                  <p className="text-sm font-extrabold text-[#2A2621]">{totalRSVPs}</p>
                  <p className="text-[8px] text-[#5A554E] uppercase font-bold">RSVPs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Events list tabs */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-[24px] border border-[#D8D2BC]/30 bg-white p-6 space-y-5 shadow-sm text-left">
              
              {/* Tab Selector */}
              <div className="flex space-x-4 border-b border-[#D8D2BC]/30 pb-3 text-xs font-bold text-[#5A554E]">
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'approved' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Published ({approvedEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pending' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Under Review ({pendingEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'rejected' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
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
                    <p className="text-xs text-[#5A554E] italic text-center py-8">No published events for this organization.</p>
                  ) : (
                    approvedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] hover:border-black/10 cursor-pointer transition-colors"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#2A2621] uppercase">{event.title}</h5>
                          <p className="text-[10px] text-[#5A554E] mt-0.5">{event.date} • {event.location}</p>
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                          {event.attendees.length} Attendees
                        </span>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'pending' && (
                  pendingEvents.length === 0 ? (
                    <p className="text-xs text-[#5A554E] italic text-center py-8">No events currently awaiting review.</p>
                  ) : (
                    pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/50 cursor-pointer"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#2A2621] uppercase">{event.title}</h5>
                          <p className="text-[10px] text-[#5A554E] mt-0.5">{event.date} • {event.complexityType} track</p>
                        </div>
                        <span className="text-[9px] font-extrabold text-amber-700 uppercase">
                          In Queue
                        </span>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'rejected' && (
                  rejectedEvents.length === 0 ? (
                    <p className="text-xs text-[#5A554E] italic text-center py-8">No rejected events.</p>
                  ) : (
                    rejectedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/50 cursor-pointer"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#2A2621] uppercase">{event.title}</h5>
                          <p className="text-[10px] text-rose-600 mt-0.5">{event.feedback || 'Did not meet requirements'}</p>
                        </div>
                        <span className="text-[9px] font-extrabold text-rose-700 uppercase">
                          Needs Revision
                        </span>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-slate-50 py-16 text-center max-w-md mx-auto shadow-sm">
          <Building className="h-10 w-10 text-[#5A554E] mb-3" />
          <p className="text-xs font-bold text-[#2A2621] uppercase">No Organization Selected</p>
          <p className="mt-1 text-[11px] text-[#5A554E] px-4 leading-relaxed">
            Click "New Organization" above to register your club or campus group on Evida!
          </p>
        </div>
      )}
    </div>
  );
}

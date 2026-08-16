'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { Event, Organization } from '@/lib/types';
import Card from '@/components/ui/Card';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { ClipboardList, Check, X, Calendar, MapPin, Users, AlertTriangle, ShieldCheck, HelpCircle, Ban, Send, Sparkles, Clock, Building, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getTailwindBgColor(color: string) {
  const mapping: Record<string, string> = {
    indigo: '#6366f1',
    sky: '#0ea5e9',
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    teal: '#14b8a6',
    orange: '#FD5C05',
  };
  return mapping[color] || '#FD5C05';
}

export default function ReviewQueuePage() {
  const { events, organizations, reviewEvent, toggleVerifyOrg, suspendOrg, requestInfoOrg, deleteOrg } = useEvents();
  const { currentUser } = useUser();
  const [activeQueue, setActiveQueue] = useState<'all' | 'quick' | 'standard' | 'complex'>('all');
  const [orgRequestInfoModal, setOrgRequestInfoModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [orgNote, setOrgNote] = useState('');

  if (!currentUser) return null;

  const pendingEvents = events.filter((e) => e.status === 'pending');
  
  const displayEvents = activeQueue === 'all' 
    ? pendingEvents 
    : pendingEvents.filter((e) => e.complexityType === activeQueue);

  const pendingOrgs = organizations.filter((o) => !o.verified || o.verificationStatus === 'pending');

  const handleReview = (id: string, status: 'approved' | 'rejected') => {
    reviewEvent(id, status, status === 'rejected' ? 'Does not meet campus guidelines.' : undefined);
  };

  const handleOrgRequestInfo = () => {
    if (!selectedOrgId) return;
    requestInfoOrg(selectedOrgId, orgNote);
    setOrgRequestInfoModal(false);
    setOrgNote('');
  };

  const getComplexityBadge = (type: string) => {
    if (type === 'quick') return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Quick Review</span>;
    if (type === 'standard') return <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Standard Review</span>;
    return <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Complex Review</span>;
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-10 max-w-6xl mx-auto font-sans text-[#2A2621] text-left">
      
      {/* ── Page Header ── */}
      <div className="space-y-4 bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="bg-[#FD5C05]/10 text-[#FD5C05] text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#FD5C05]/20 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> School Administration
          </span>
          <span className="text-xs font-extrabold text-[#5A554E] uppercase tracking-wider">
            {pendingEvents.length} Events • {pendingOrgs.length} Orgs Pending
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#5A554E] font-medium leading-relaxed mt-1">
            Review and approve pending student experiences, event submissions, and organization verification requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap pt-2">
          {[
            { id: 'all' as const, label: `All (${pendingEvents.length})` },
            { id: 'quick' as const, label: 'Quick' },
            { id: 'standard' as const, label: 'Standard' },
            { id: 'complex' as const, label: 'Complex' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveQueue(pill.id)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none ${
                activeQueue === pill.id
                  ? 'bg-[#FD5C05] text-white shadow-md shadow-[#FD5C05]/20'
                  : 'bg-[#F8F6F0] text-[#5A554E] hover:bg-black/[0.06] hover:text-[#2A2621]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pending Event Submissions Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Event Submissions ({displayEvents.length})
          </h2>
        </div>

        <AnimatePresence mode="popLayout">
          {displayEvents.length > 0 ? (
            <div className="space-y-4">
              {displayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <Card className="p-6 rounded-[28px] border border-black/[0.06] bg-white shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    {/* Event Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getComplexityBadge(event.complexityType)}
                        <span className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest bg-[#F8F6F0] px-2.5 py-0.5 rounded-full border border-black/[0.04]">
                          {event.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-[#2A2621] uppercase tracking-tight leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs text-[#5A554E] leading-relaxed line-clamp-2 mt-1 font-medium">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5A554E] pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#2A2621]" />
                          {event.date} at {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-[#2A2621]" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-[#2A2621] font-bold">
                          <Users className="h-4 w-4 text-[#FD5C05]" />
                          Hosted by: {event.organizationName || event.organizer}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-40 shrink-0 border-t md:border-t-0 md:border-l border-black/[0.06] pt-4 md:pt-0 md:pl-6">
                      <button
                        onClick={() => handleReview(event.id, 'approved')}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none flex items-center justify-center gap-1.5"
                      >
                        <Check className="h-4 w-4 stroke-[3]" /> Approve
                      </button>
                      <button
                        onClick={() => handleReview(event.id, 'rejected')}
                        className="flex-1 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="h-4 w-4 stroke-[3]" /> Reject
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-[#FD5C05]/10 text-[#FD5C05] flex items-center justify-center">
                <ClipboardList className="h-7 w-7" />
              </div>
              <h3 className="text-base font-extrabold text-[#2A2621] uppercase tracking-tight">Queue is Empty</h3>
              <p className="text-xs text-[#5A554E] max-w-sm font-medium">There are no pending student events requiring school review at this time.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pending Organizations Section ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Pending Organizations
            </h2>
            <p className="text-xs text-[#5A554E] font-medium mt-0.5">
              Campus groups requesting official verification or registration.
            </p>
          </div>
        </div>

        {organizations.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {organizations.map((org) => {
              const bgHex = getTailwindBgColor(org.logoColor || 'indigo');
              return (
                <Card key={org.id} className="p-6 rounded-[28px] border border-black/[0.06] bg-white shadow-sm flex flex-col justify-between space-y-5 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-14 w-14 rounded-2xl text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0"
                        style={{ backgroundColor: bgHex }}
                      >
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight leading-snug">
                            {org.name}
                          </h3>
                          {org.verified && <VerifiedBadge className="h-4 w-4" />}
                        </div>
                        <p className="text-xs text-[#5A554E] line-clamp-2 font-medium">
                          {org.description || org.aboutUs || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-[#5A554E] uppercase border-t border-black/[0.04] pt-3">
                    <span>{org.members.length} members</span>
                    <span>•</span>
                    <span>Category: {org.category || 'Social'}</span>
                    <span>•</span>
                    <span className={org.verified ? 'text-emerald-600 font-extrabold' : 'text-amber-700 font-extrabold'}>
                      {org.verified ? 'Verified ✓' : 'Unverified'}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${org.name}"?`)) {
                          deleteOrg(org.id);
                        }
                      }}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 shadow-sm"
                      title="Delete Organization"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                    <button
                      onClick={() => suspendOrg(org.id)}
                      className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border border-red-200 cursor-pointer flex items-center gap-1"
                    >
                      <Ban className="h-3.5 w-3.5" /> Suspend
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrgId(org.id);
                        setOrgRequestInfoModal(true);
                      }}
                      className="px-3.5 py-2 bg-[#F8F6F0] hover:bg-black/[0.06] text-[#2A2621] rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border border-black/[0.06] cursor-pointer flex items-center gap-1"
                    >
                      <HelpCircle className="h-3.5 w-3.5" /> Request Info
                    </button>
                    <button
                      onClick={() => toggleVerifyOrg(org.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                        org.verified
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-[#FD5C05] hover:bg-[#CC3D00] text-white shadow-md shadow-[#FD5C05]/20'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {org.verified ? 'Revoke Verification' : 'Verify Organization'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[28px] border border-black/[0.06] p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <Building className="h-10 w-10 text-[#5A554E]" />
            <h3 className="text-base font-extrabold text-[#2A2621] uppercase tracking-tight">No Pending Organizations</h3>
            <p className="text-xs text-[#5A554E] max-w-sm font-medium">All campus organizations are verified.</p>
          </div>
        )}
      </div>

      {/* ── Request Info Modal ── */}
      {orgRequestInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-[28px] p-7 shadow-2xl border border-black/[0.08] text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#FD5C05]" /> Request Information
              </h3>
              <button
                onClick={() => setOrgRequestInfoModal(false)}
                className="h-8 w-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#5A554E] cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5A554E] font-medium leading-relaxed">
              Send an official inquiry or requested documentation notice to the organization officers.
            </p>

            <textarea
              rows={4}
              className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-2xl p-3.5 text-xs text-[#2A2621] font-medium focus:outline-none focus:border-[#FD5C05] focus:bg-white resize-none"
              placeholder="Enter details of required documents, officer clarification, or campus compliance info..."
              value={orgNote}
              onChange={(e) => setOrgNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOrgRequestInfoModal(false)}
                className="px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-[#5A554E] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleOrgRequestInfo}
                className="px-5 py-2.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-[#FD5C05]/20 flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

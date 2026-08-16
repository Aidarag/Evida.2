'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Building2, Search, CheckCircle2, XCircle, ShieldCheck, HelpCircle, Ban, Send, Users, Sparkles, Building, Trash2 } from 'lucide-react';

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

export default function OrganizationsPage() {
  const { organizations, toggleVerifyOrg, suspendOrg, requestInfoOrg, deleteOrg } = useEvents();
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [requestInfoModal, setRequestInfoModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [note, setNote] = useState('');

  if (!currentUser) return null;

  const filteredOrgs = organizations.filter(org => {
    // 1. Search Query
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.description && org.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (org.category && org.category.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Verification Status (Certified vs Non-Certified)
    if (statusFilter === 'verified' && !org.verified) return false;
    if (statusFilter === 'unverified' && org.verified) return false;

    // 3. Category / Type Filter
    if (categoryFilter !== 'all') {
      const cat = (org.category || '').toLowerCase();
      const name = org.name.toLowerCase();
      const target = categoryFilter.toLowerCase();
      const matchesCat = cat.includes(target) || name.includes(target);
      if (!matchesCat) return false;
    }

    return true;
  });

  const handleRequestInfo = () => {
    if (!selectedOrgId) return;
    requestInfoOrg(selectedOrgId, note);
    setRequestInfoModal(false);
    setNote('');
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 max-w-6xl mx-auto font-sans text-[#2A2621] text-left">
      
      {/* Header */}
      <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between md:items-end">
        <div className="space-y-2">
          <span className="bg-[#FD5C05]/10 text-[#FD5C05] text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#FD5C05]/20 flex items-center gap-1.5 w-fit">
            <Building2 className="h-3.5 w-3.5" /> Campus Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Organizations Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5A554E] font-medium leading-relaxed">
            Manage, verify, and monitor student organizations registered at Livingstone College.
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A554E]" />
            <input
              type="text"
              placeholder="Search organizations or categories..."
              className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Organization Filters Bar (Certified/Non-certified + Org Types) ── */}
      <div className="bg-white rounded-[24px] border border-black/[0.06] p-4 sm:p-5 shadow-sm space-y-3.5">
        {/* Row 1: Verification Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase text-[#5A554E] tracking-wider shrink-0 mr-1">Status:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#2A2621] text-white shadow-xs'
                : 'bg-[#F8F6F0] text-[#5A554E] hover:bg-black/[0.06]'
            }`}
          >
            All Statuses ({organizations.length})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" /> Certified / Verified ({organizations.filter(o => o.verified).length})
          </button>
          <button
            onClick={() => setStatusFilter('unverified')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'unverified'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-500/10 text-amber-800 hover:bg-amber-500/20'
            }`}
          >
            <XCircle className="h-3 w-3" /> Non-Certified / Unverified ({organizations.filter(o => !o.verified).length})
          </button>
        </div>

        {/* Row 2: Organization Type Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 border-t border-black/[0.04] pt-2.5">
          <span className="text-[10px] font-black uppercase text-[#5A554E] tracking-wider shrink-0 mr-1">Type:</span>
          {['all', 'academic', 'cultural', 'student government', 'social', 'sports', 'career', 'service'].map((cat) => {
            const isActive = categoryFilter === cat;
            const label = cat === 'all' ? 'All Types' : cat.toUpperCase();
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-[9.5px] font-black uppercase tracking-wider shrink-0 transition-all border-none cursor-pointer ${
                  isActive
                    ? 'bg-[#FD5C05] text-white shadow-xs'
                    : 'bg-[#F8F6F0] text-[#5A554E] hover:bg-black/[0.06]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Organizations Grid */}
      {filteredOrgs.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredOrgs.map((org) => {
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
                      setRequestInfoModal(true);
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
          <h3 className="text-base font-extrabold text-[#2A2621] uppercase tracking-tight">No Organizations Found</h3>
          <p className="text-xs text-[#5A554E] max-w-sm font-medium">Try searching for a different name or category.</p>
        </div>
      )}

      {/* Request Info Modal */}
      {requestInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-[28px] p-7 shadow-2xl border border-black/[0.08] text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#FD5C05]" /> Request Information
              </h3>
              <button
                onClick={() => setRequestInfoModal(false)}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRequestInfoModal(false)}
                className="px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-[#5A554E] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInfo}
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

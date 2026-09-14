'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  HelpCircle,
  Trash2,
  Sparkles,
  Send,
  Filter,
  FolderOpen
} from 'lucide-react';

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
    cream: '#D8D2BC',
  };
  return mapping[color] || '#FD5C05';
}

const PRESET_REFUSAL_REASONS = [
  'Missing required faculty advisor signature and charter.',
  'Incomplete constitution bylaws or safety protocols.',
  'Inactive student leadership / insufficient active roster.',
  'Duplicate student group with overlapping mission.',
  'Non-compliant with campus student activity guidelines.'
];

function ApprovalsContent() {
  const { organizations, approveOrg, refuseOrg, deleteOrg, requestInfoOrg } = useEvents();
  const { currentUser } = useUser();
  const searchParams = useSearchParams();

  if (!currentUser) return null;

  // Tab from URL query (?tab=approved | ?tab=refused | ?tab=pending | ?tab=all)
  const initialTab = searchParams.get('tab') as 'approved' | 'refused' | 'pending' | 'all' | null;

  const [activeTab, setActiveTab] = useState<'approved' | 'refused' | 'pending' | 'all'>(
    initialTab && ['approved', 'refused', 'pending', 'all'].includes(initialTab) ? initialTab : 'approved'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Refusal Modal State
  const [refuseModalOpen, setRefuseModalOpen] = useState(false);
  const [targetOrgId, setTargetOrgId] = useState<string | null>(null);
  const [refusalReasonInput, setRefusalReasonInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Request Info Modal State
  const [requestInfoModal, setRequestInfoModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [infoNote, setInfoNote] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Organizations categorization
  const approvedOrgs = useMemo(() => {
    return organizations.filter(o => o.verified || o.verificationStatus === 'verified');
  }, [organizations]);

  const refusedOrgs = useMemo(() => {
    return organizations.filter(o => o.verificationStatus === 'refused' || (!o.verified && o.verificationStatus !== 'pending' && o.verificationStatus !== 'unverified' && o.verificationStatus !== undefined));
  }, [organizations]);

  const pendingOrgs = useMemo(() => {
    return organizations.filter(o => !o.verified && o.verificationStatus !== 'refused' && (o.verificationStatus === 'pending' || o.verificationStatus === 'unverified' || !o.verificationStatus));
  }, [organizations]);

  // Filtered list based on active tab, search, and category
  const displayedOrgs = useMemo(() => {
    let list = organizations;
    if (activeTab === 'approved') {
      list = approvedOrgs;
    } else if (activeTab === 'refused') {
      list = refusedOrgs;
    } else if (activeTab === 'pending') {
      list = pendingOrgs;
    }

    return list.filter(org => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        (org.description && org.description.toLowerCase().includes(q)) ||
        (org.category && org.category.toLowerCase().includes(q)) ||
        (org.refusalReason && org.refusalReason.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Category Filter
      if (categoryFilter !== 'all') {
        const cat = (org.category || '').toLowerCase();
        const name = org.name.toLowerCase();
        const target = categoryFilter.toLowerCase();
        if (!cat.includes(target) && !name.includes(target)) return false;
      }

      return true;
    });
  }, [organizations, activeTab, approvedOrgs, refusedOrgs, pendingOrgs, searchQuery, categoryFilter]);

  // Fast 1-click Approve
  const handleFastApprove = async (orgId: string, orgName: string) => {
    setActionLoading(true);
    try {
      await approveOrg(orgId);
      showToast(`✓ "${orgName}" is now officially approved and certified!`);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Refuse Modal
  const openRefuseModal = (orgId: string, currentReason?: string) => {
    setTargetOrgId(orgId);
    setRefusalReasonInput(currentReason || PRESET_REFUSAL_REASONS[0]);
    setRefuseModalOpen(true);
  };

  // Confirm Refuse
  const handleConfirmRefuse = async () => {
    if (!targetOrgId) return;
    const targetOrg = organizations.find(o => o.id === targetOrgId);
    setActionLoading(true);
    try {
      await refuseOrg(targetOrgId, refusalReasonInput.trim() || 'Institutional registration requirements not met.');
      setRefuseModalOpen(false);
      setTargetOrgId(null);
      setRefusalReasonInput('');
      showToast(`✕ "${targetOrg?.name || 'Organization'}" status set to Refused.`);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Info
  const handleRequestInfoSubmit = async () => {
    if (!selectedOrgId) return;
    try {
      await requestInfoOrg(selectedOrgId, infoNote);
      setRequestInfoModal(false);
      setSelectedOrgId('');
      setInfoNote('');
      showToast('Official information request transmitted to organization leadership.');
    } catch (e) {
      console.error(e);
    }
  };

  const totalReviewed = approvedOrgs.length + refusedOrgs.length;
  const approvalRate = totalReviewed > 0 ? Math.round((approvedOrgs.length / totalReviewed) * 100) : 100;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 max-w-6xl mx-auto font-sans text-[#2A2621] text-left relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2A2621] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-fade-in text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[#FD5C05]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Sub-navigation bar */}
      <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Breadcrumb / Category switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
          <div className="flex items-center gap-2">
            <Link
              href="/school/organizations"
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-[#5A554E] hover:text-[#2A2621] hover:bg-black/[0.04] transition-all flex items-center gap-1.5 no-underline"
            >
              <FolderOpen className="h-3.5 w-3.5" /> Campus Directory
            </Link>
            <span className="text-[#D8D2BC]">/</span>
            <span className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] border border-[#FD5C05]/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Approved & Refused Status
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#5A554E]">
            <span>Compliance Rate:</span>
            <span className="text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px] font-black">
              {approvalRate}% Certified
            </span>
          </div>
        </div>

        {/* Title and Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between md:items-end">
          <div className="space-y-2 max-w-xl">
            <span className="bg-emerald-500/10 text-emerald-700 text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 w-fit">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Administrative Decision Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Approved & Refused Organizations
            </h1>
            <p className="text-xs sm:text-sm text-[#5A554E] font-medium leading-relaxed">
              Fast and simple view of student organizations that have been officially certified or refused at Livingstone College.
            </p>
          </div>

          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A554E]" />
              <input
                type="text"
                placeholder="Search name, category, or refusal reason..."
                className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5A554E] hover:text-[#2A2621] border-none bg-transparent cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Approved Count Card */}
        <button
          onClick={() => setActiveTab('approved')}
          className={`p-5 rounded-[24px] border text-left transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-white border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
              : 'bg-white border-black/[0.06] hover:border-emerald-500/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider border border-emerald-500/20">
              Certified ✓
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#2A2621]">{approvedOrgs.length}</div>
            <p className="text-[11px] font-bold text-[#5A554E] uppercase tracking-wider mt-0.5">Approved Groups</p>
          </div>
        </button>

        {/* Refused Count Card */}
        <button
          onClick={() => setActiveTab('refused')}
          className={`p-5 rounded-[24px] border text-left transition-all cursor-pointer ${
            activeTab === 'refused'
              ? 'bg-white border-rose-500 shadow-md shadow-rose-500/10 ring-2 ring-rose-500/20'
              : 'bg-white border-black/[0.06] hover:border-rose-500/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-rose-500/10 text-rose-700 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider border border-rose-500/20">
              Refused ✕
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#2A2621]">{refusedOrgs.length}</div>
            <p className="text-[11px] font-bold text-[#5A554E] uppercase tracking-wider mt-0.5">Refused Groups</p>
          </div>
        </button>

        {/* Pending Review Count Card */}
        <button
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-[24px] border text-left transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-white border-amber-500 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20'
              : 'bg-white border-black/[0.06] hover:border-amber-500/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-amber-500/10 text-amber-800 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider border border-amber-500/20">
              Pending ⏳
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#2A2621]">{pendingOrgs.length}</div>
            <p className="text-[11px] font-bold text-[#5A554E] uppercase tracking-wider mt-0.5">Awaiting Review</p>
          </div>
        </button>

        {/* All Organizations Card */}
        <button
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-[24px] border text-left transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white border-[#2A2621] shadow-md ring-2 ring-black/10'
              : 'bg-white border-black/[0.06] hover:border-black/20 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center text-[#2A2621]">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-black/5 text-[#2A2621] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider">
              Total Roster
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#2A2621]">{organizations.length}</div>
            <p className="text-[11px] font-bold text-[#5A554E] uppercase tracking-wider mt-0.5">All Organizations</p>
          </div>
        </button>

      </div>

      {/* Main Filter & Navigation Tabs Bar */}
      <div className="bg-white rounded-[24px] border border-black/[0.06] p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Fast Status Segmented Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approved Organizations ({approvedOrgs.length})
            </button>

            <button
              onClick={() => setActiveTab('refused')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                activeTab === 'refused'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-rose-500/10 text-rose-800 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Refused Organizations ({refusedOrgs.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-500/10 text-amber-800 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Pending ({pendingOrgs.length})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#2A2621] text-white border-[#2A2621] shadow-sm'
                  : 'bg-[#F8F6F0] text-[#5A554E] border-black/[0.06] hover:bg-black/[0.06]'
              }`}
            >
              All ({organizations.length})
            </button>
          </div>

          <div className="text-xs font-bold text-[#5A554E]">
            Showing <span className="text-[#2A2621] font-black">{displayedOrgs.length}</span> {activeTab} organization{displayedOrgs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 border-t border-black/[0.04] pt-3">
          <span className="text-[10px] font-black uppercase text-[#5A554E] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {['all', 'academic', 'cultural', 'student government', 'career', 'social', 'sports', 'service'].map((cat) => {
            const isActive = categoryFilter === cat;
            const label = cat === 'all' ? 'All Categories' : cat.toUpperCase();
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

      {/* Organizations List */}
      {displayedOrgs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {displayedOrgs.map((org) => {
            const bgHex = getTailwindBgColor(org.logoColor || 'indigo');
            const isApproved = org.verified || org.verificationStatus === 'verified';
            const isRefused = org.verificationStatus === 'refused';
            const isPending = !isApproved && !isRefused;

            return (
              <Card
                key={org.id}
                className={`p-6 rounded-[28px] bg-white shadow-sm flex flex-col justify-between space-y-5 text-left border transition-all ${
                  isApproved
                    ? 'border-emerald-500/25 hover:border-emerald-500/50'
                    : isRefused
                    ? 'border-rose-500/25 hover:border-rose-500/50'
                    : 'border-amber-500/25 hover:border-amber-500/50'
                }`}
              >
                {/* Header Row */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="h-13 w-13 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0 overflow-hidden"
                        style={{ backgroundColor: bgHex }}
                      >
                        {org.logoUrl ? (
                          <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                          org.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight leading-snug">
                            {org.name}
                          </h3>
                          {isApproved && <VerifiedBadge className="h-4 w-4" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#5A554E] uppercase">
                          <span>{org.category || 'General'}</span>
                          <span>•</span>
                          <span>{org.members?.length || 0} members</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isApproved && (
                        <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Approved
                        </span>
                      )}
                      {isRefused && (
                        <span className="bg-rose-500/10 text-rose-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1 shrink-0">
                          <XCircle className="h-3 w-3 text-rose-600" /> Refused
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-500/10 text-amber-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#5A554E] line-clamp-2 font-medium leading-relaxed">
                    {org.description || org.aboutUs || 'No description provided.'}
                  </p>
                </div>

                {/* Status-specific Callout Details */}
                <div className="space-y-2">
                  {isRefused && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/[0.07] border border-rose-500/20 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" /> Refusal Reason:
                        </span>
                        {org.refusedAt && (
                          <span className="text-[9.5px] text-rose-700 font-bold">
                            {new Date(org.refusedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-rose-900 font-semibold leading-relaxed">
                        {org.refusalReason || 'Does not meet campus registration guidelines.'}
                      </p>
                    </div>
                  )}

                  {isApproved && (
                    <div className="p-3 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-900 font-bold">
                      <span className="flex items-center gap-1.5 text-[10.5px]">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" /> Official Campus Badge Active
                      </span>
                      {org.verifiedAt && (
                        <span className="text-[9.5px] text-emerald-700 font-medium">
                          Approved {new Date(org.verifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  )}

                  {isPending && (
                    <div className="p-3 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex items-center justify-between text-xs text-amber-900 font-bold">
                      <span className="flex items-center gap-1.5 text-[10.5px]">
                        <Clock className="h-4 w-4 text-amber-600" /> Application submitted & awaiting certification
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct 1-Click Action Buttons */}
                <div className="pt-2 border-t border-black/[0.04] flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Left: Administrative tools */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedOrgId(org.id);
                        setRequestInfoModal(true);
                      }}
                      className="px-3 py-1.5 bg-[#F8F6F0] hover:bg-black/[0.06] text-[#2A2621] rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-black/[0.06] cursor-pointer flex items-center gap-1"
                      title="Request Documentation or Officer Clarification"
                    >
                      <HelpCircle className="h-3 w-3" /> Inquire
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete "${org.name}"?`)) {
                          deleteOrg(org.id);
                          showToast(`Deleted organization "${org.name}".`);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-black/[0.03] hover:bg-red-50 text-red-600 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-1"
                      title="Delete Club Record"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Right: Fast 1-Click Status Toggles */}
                  <div className="flex items-center gap-2">
                    {/* If Refused: Show fast 1-click Approve or edit reason */}
                    {isRefused && (
                      <>
                        <button
                          onClick={() => openRefuseModal(org.id, org.refusalReason)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-rose-200 cursor-pointer"
                        >
                          Edit Reason
                        </button>
                        <button
                          onClick={() => handleFastApprove(org.id, org.name)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve Organization
                        </button>
                      </>
                    )}

                    {/* If Approved: Show fast 1-click Refuse/Revoke */}
                    {isApproved && (
                      <button
                        onClick={() => openRefuseModal(org.id)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-rose-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Refuse / Revoke
                      </button>
                    )}

                    {/* If Pending: Show both 1-click Approve and Refuse */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => openRefuseModal(org.id)}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-rose-200 cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Refuse
                        </button>
                        <button
                          onClick={() => handleFastApprove(org.id, org.name)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-[#F8F6F0] flex items-center justify-center text-[#5A554E]">
            {activeTab === 'approved' ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            ) : activeTab === 'refused' ? (
              <XCircle className="h-8 w-8 text-rose-600" />
            ) : (
              <Building2 className="h-8 w-8 text-[#5A554E]" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight">
              {activeTab === 'approved'
                ? 'No Approved Organizations Found'
                : activeTab === 'refused'
                ? 'No Refused Organizations'
                : 'No Organizations Found'}
            </h3>
            <p className="text-xs text-[#5A554E] max-w-md font-medium leading-relaxed">
              {activeTab === 'refused'
                ? 'Great news! There are currently no student organizations marked as refused.'
                : 'No organizations match your current search query or category filters.'}
            </p>
          </div>
          {(searchQuery || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 bg-[#F8F6F0] hover:bg-black/[0.06] text-[#2A2621] rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-black/[0.08] cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* ── Modal: Refuse Organization (Fast Preset Chips & Custom Note) ── */}
      {refuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-[28px] p-7 shadow-2xl border border-black/[0.08] text-left space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <XCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#2A2621] uppercase tracking-tight">
                    Refuse / Revoke Certification
                  </h3>
                  <p className="text-[11px] text-[#5A554E] font-medium">Specify the reason for refusing this organization.</p>
                </div>
              </div>
              <button
                onClick={() => setRefuseModalOpen(false)}
                className="h-8 w-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#5A554E] cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            {/* Quick 1-Click Preset Reason Chips */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#5A554E]">
                Quick Reason Presets (Click to apply):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_REFUSAL_REASONS.map((preset, idx) => {
                  const isSelected = refusalReasonInput === preset;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRefusalReasonInput(preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-rose-500/[0.07] text-rose-800 border-rose-500/20 hover:bg-rose-500/15'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Reason Textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#5A554E]">
                Official Refusal Explanation:
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-2xl p-3.5 text-xs text-[#2A2621] font-medium focus:outline-none focus:border-rose-500 focus:bg-white resize-none"
                placeholder="Enter or customize the refusal reason..."
                value={refusalReasonInput}
                onChange={(e) => setRefusalReasonInput(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRefuseModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-[#5A554E] hover:bg-slate-50 cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefuse}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-rose-600/25 flex items-center gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                Confirm Refusal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Request Info ── */}
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
              Send an inquiry or documentation checklist notice to the organization officers.
            </p>

            <textarea
              rows={4}
              className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-2xl p-3.5 text-xs text-[#2A2621] font-medium focus:outline-none focus:border-[#FD5C05] focus:bg-white resize-none"
              placeholder="Enter details of required documents, officer clarification, or campus compliance info..."
              value={infoNote}
              onChange={(e) => setInfoNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRequestInfoModal(false)}
                className="px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-[#5A554E] hover:bg-slate-50 cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInfoSubmit}
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

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#5A554E] font-bold text-xs">Loading Organization Approvals...</div>}>
      <ApprovalsContent />
    </Suspense>
  );
}

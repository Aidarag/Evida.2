'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { Building, Users, Calendar, MapPin, ShieldCheck, ArrowLeft, Globe, Mail, Info, Award, Check, X, UserPlus, UserCheck, Clock, Megaphone, Send, ShieldAlert, Sparkles, Plus, Settings, Edit3, Trash2 } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import EventCard from '@/components/student/EventCard';
import Link from 'next/link';

const ORG_BANNERS = [
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
  '/pexels-rdne-7648057.jpg',
  '/pexels-tima-miroshnichenko-5439368.jpg',
];

const LOGO_COLORS = [
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'sky', hex: '#0ea5e9', label: 'Sky' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'teal', hex: '#14b8a6', label: 'Teal' },
  { id: 'orange', hex: '#FD5C05', label: 'Orange' },
];

export default function OrganizationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { events, organizations, saveToggle, deleteOrg } = useEvents();
  const { currentUser, activeProfile } = useUser();

  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'news' | 'about' | 'manage'>('home');
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  
  // Announcement posting state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [isPostingAnn, setIsPostingAnn] = useState(false);

  const handleDeleteOrganization = async () => {
    if (!org) return;
    if (!confirm(`Are you sure you want to permanently delete "${org.name}"? This action cannot be undone.`)) {
      return;
    }
    const success = await deleteOrg(org.id);
    if (success) {
      router.push('/student/dashboard');
    }
  };

  // Find organization
  const org = organizations.find((o) => o.id === id);

  // Profile Edit states
  const [editName, setEditName] = useState(org?.name || '');
  const [editDesc, setEditDesc] = useState(org?.description || '');
  const [editAbout, setEditAbout] = useState(org?.aboutUs || '');
  const [editCategory, setEditCategory] = useState(org?.category || 'Social');
  const [editColor, setEditColor] = useState(org?.logoColor || 'indigo');
  const [editWebsite, setEditWebsite] = useState(org?.website || '');
  const [editEmail, setEditEmail] = useState(org?.email || '');
  const [editJoinSetting, setEditJoinSetting] = useState<'direct' | 'request'>(org?.joinSetting || 'request');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (org) {
      setEditName(org.name || '');
      setEditDesc(org.description || '');
      setEditAbout(org.aboutUs || org.description || '');
      setEditCategory(org.category || 'Social');
      setEditColor(org.logoColor || 'indigo');
      setEditWebsite(org.website || '');
      setEditEmail(org.email || '');
      setEditJoinSetting(org.joinSetting || 'request');
    }
  }, [org]);

  const fetchMembershipRequests = async () => {
    try {
      const res = await fetch('/api/organizations/membership');
      if (res.ok) {
        const data = await res.json();
        setMembershipRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  if (!org) {
    return (
      <div className="min-h-screen bg-[#D8D2BC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <Building className="h-16 w-16 text-[#5A554E] mb-4" />
        <h2 className="text-xl font-extrabold text-[#2A2621] uppercase tracking-tight">Organization Not Found</h2>
        <p className="text-xs text-[#5A554E] mt-2 max-w-sm">The organization page you are looking for does not exist or may have been deleted.</p>
        <button 
          onClick={() => router.push('/student/dashboard')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#FD5C05] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md shadow-[#FD5C05]/25 hover:bg-[#CC3D00] border-none cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const isMember = currentUser && (
    org.members.includes(currentUser.name) ||
    (currentUser.username ? org.members.includes(currentUser.username) : false)
  );

  const pendingReq = currentUser && membershipRequests.find(
    (r) => r.orgId === id && (r.username === currentUser.username || r.username === currentUser.name) && r.status === 'pending'
  );

  const isAdminOrLeader = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.role === 'student_leader' ||
    org.members[0] === currentUser.name ||
    org.members[0] === currentUser.username ||
    org.creatorUsername === currentUser.username ||
    org.creatorUsername === currentUser.name ||
    org.memberRoles?.[currentUser.name] === 'President' ||
    org.memberRoles?.[currentUser.username || ''] === 'President' ||
    org.memberRoles?.[currentUser.name] === 'Admin' ||
    org.memberRoles?.[currentUser.username || ''] === 'Admin' ||
    org.memberRoles?.[currentUser.name] === 'Vice President' ||
    (activeProfile?.type === 'organization' && activeProfile?.orgId === org.id)
  );

  // Filter events created by members of this organization or under this org ID
  const orgEvents = events.filter((e) => e.status === 'approved' && (e.organizationId === id || e.organizationName === org.name));

  const bannerIdx = org.name.charCodeAt(0) % ORG_BANNERS.length;
  const bannerPhoto = org.coverImage || ORG_BANNERS[bannerIdx];

  const handleJoinOrg = async () => {
    if (!currentUser) return;
    setIsJoining(true);
    try {
      if (org.joinSetting === 'direct') {
        const directRes = await fetch('/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join',
            id: org.id,
            member: currentUser.name
          })
        });
        if (directRes.ok) {
          window.location.reload();
        }
      } else {
        const res = await fetch('/api/organizations/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'apply',
            orgId: org.id,
            orgName: org.name,
            username: currentUser.username || currentUser.name,
            studentName: currentUser.name
          })
        });
        if (res.ok) {
          await fetchMembershipRequests();
        } else {
          // Direct join fallback
          const directRes = await fetch('/api/organizations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'join',
              id: org.id,
              member: currentUser.name
            })
          });
          if (directRes.ok) {
            window.location.reload();
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/organizations/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          id: requestId,
          username: currentUser.username || currentUser.name
        })
      });
      if (res.ok) {
        fetchMembershipRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestVerification = async () => {
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-verification',
          id: org.id
        })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRole = async (member: string, role: string) => {
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-role',
          id: org.id,
          member,
          role
        })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMember = async (member: string) => {
    if (org.members.length <= 1) {
      alert('Cannot remove the only member from this organization.');
      return;
    }
    if (!confirm(`Are you sure you want to remove ${member} from this organization?`)) {
      return;
    }
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove-member',
          id: org.id,
          member
        })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/organizations/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          id: requestId,
          status
        })
      });
      if (res.ok) {
        fetchMembershipRequests();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setIsPostingAnn(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post-announcement',
          id: org.id,
          title: annTitle.trim(),
          content: annContent.trim(),
          author: currentUser?.name || 'Organization Admin'
        })
      });
      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-announcement',
          id: org.id,
          announcementId
        })
      });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-profile',
          id: org.id,
          name: editName.trim(),
          description: editDesc.trim(),
          aboutUs: editAbout.trim(),
          category: editCategory,
          logoColor: editColor,
          website: editWebsite.trim(),
          email: editEmail.trim(),
          joinSetting: editJoinSetting
        })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2A2621] pb-16 font-sans">
      
      {/* ── Top Header Navigation ── */}
      <div className="sticky top-0 z-30 h-14 w-full border-b border-[#D8D2BC]/30 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-slate-50 flex items-center justify-center text-[#2A2621] shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-extrabold text-[#5A554E] uppercase tracking-widest">
            Campus Directory
          </span>
        </div>

        {/* Header CTA Button */}
        {currentUser && (
          <div className="flex items-center gap-2">
            {isAdminOrLeader && (
              <button
                onClick={() => setActiveTab('manage')}
                className="px-4 py-1.5 bg-[#2A2621] hover:bg-[#FD5C05] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="h-3.5 w-3.5" /> Dashboard & Settings
              </button>
            )}

            {isMember ? (
              <button
                onClick={() => handleRemoveMember(currentUser.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full shadow-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                title="Click to leave organization"
              >
                <UserCheck className="h-3.5 w-3.5" /> Member (Joined)
              </button>
            ) : pendingReq ? (
              <button
                onClick={() => handleCancelRequest(pendingReq.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 border border-amber-200 text-amber-800 hover:bg-amber-200 text-xs font-black uppercase tracking-wider rounded-full shadow-xs cursor-pointer transition-all"
                title="Click to cancel pending request"
              >
                <Clock className="h-3.5 w-3.5 animate-pulse" /> Pending Approval (Cancel)
              </button>
            ) : (
              <button
                onClick={handleJoinOrg}
                disabled={isJoining}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md shadow-[#FD5C05]/20 cursor-pointer transition-all disabled:opacity-50 border-none"
              >
                <UserPlus className="h-3.5 w-3.5" /> {isJoining ? 'Joining...' : 'Rejoindre l\'organisation'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* ── Banner & Logo Header Profile Card ── */}
        <div className="bg-white rounded-[28px] border border-[#D8D2BC]/30 overflow-hidden shadow-sm flex flex-col relative">
          
          {/* Banner cover */}
          <div 
            className="h-36 md:h-52 w-full bg-slate-900 relative"
            style={{ backgroundImage: `url(${bannerPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Org details wrapper */}
          <div className="px-6 md:px-8 pb-6 relative flex flex-col md:flex-row gap-6 md:items-end justify-between">
            
            <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
              {/* Logo Avatar */}
              <div 
                className="h-20 w-20 md:h-28 md:w-28 rounded-2xl text-white font-extrabold text-3xl md:text-4xl flex items-center justify-center border-4 border-white shadow-md shrink-0 -mt-10 md:-mt-14 z-10"
                style={{ backgroundColor: org.logoColor || '#FD5C05' }}
              >
                {org.logoUrl ? (
                  <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  org.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Title & Stats */}
              <div className="space-y-2 pt-2 md:pt-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-[#2A2621] uppercase tracking-tight flex items-center gap-1.5 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {org.name}
                    {org.verified && <VerifiedBadge className="h-5 w-5" />}
                  </h2>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed max-w-xl">
                  {org.description || 'Welcome to our official campus organization page. Join our organization to stay updated with upcoming student experiences.'}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-[#5A554E] pt-1 uppercase">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-[#2A2621]" />
                    {org.members.length} members
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#2A2621]" />
                    {orgEvents.length} events hosted
                  </span>
                  {org.verified && (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified Organization
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Button (Rejoindre l'organisation) */}
            <div className="pt-2 md:pt-0 shrink-0">
              {isMember ? (
                <button 
                  onClick={() => handleRemoveMember(currentUser!.name)}
                  className="px-5 py-2 rounded-full border border-emerald-600/30 bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <UserCheck className="h-4 w-4" /> Member (Joined)
                </button>
              ) : pendingReq ? (
                <button
                  onClick={() => handleCancelRequest(pendingReq.id)}
                  className="px-5 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-800 font-black text-xs uppercase tracking-wider hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Clock className="h-4 w-4 text-amber-600 animate-pulse" /> Pending Approval
                </button>
              ) : (
                <button
                  onClick={handleJoinOrg}
                  disabled={isJoining}
                  className="px-6 py-2.5 rounded-full bg-[#FD5C05] hover:bg-[#CC3D00] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#FD5C05]/20 disabled:opacity-50 border-none"
                >
                  <UserPlus className="h-4 w-4" /> {isJoining ? 'Submitting...' : 'Rejoindre l\'organisation'}
                </button>
              )}
            </div>

          </div>

          {/* Tab Selector */}
          <div className="flex px-6 border-t border-[#D8D2BC]/30 text-xs font-bold text-[#5A554E] bg-slate-50/50 overflow-x-auto">
            {[
              { id: 'home' as const, label: 'Home' },
              { id: 'events' as const, label: `Events (${orgEvents.length})` },
              { id: 'news' as const, label: `News (${org.announcements?.length || 0})` },
              { id: 'about' as const, label: 'About & Contact' },
              isAdminOrLeader ? { id: 'manage' as const, label: 'Dashboard & Manage' } : null,
            ].filter((t): t is { id: 'home' | 'events' | 'news' | 'about' | 'manage'; label: string } => !!t).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-[#FD5C05] text-[#2A2621] font-extrabold bg-white' 
                    : 'border-transparent hover:text-[#2A2621]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── Tab Content Views ── */}
        <div className="space-y-6">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Left Panel: Basic Details & Roster */}
              <div className="md:col-span-2 space-y-6">
                
                {/* About Us */}
                <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">About Us</h3>
                    {org.category && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#FD5C05] bg-[#FD5C05]/10 px-2.5 py-0.5 rounded-full border border-[#FD5C05]/20">
                        {org.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A554E] leading-relaxed whitespace-pre-wrap">
                    {org.aboutUs || org.description || 'No description provided by this campus organization.'}
                  </p>
                  
                  <div className="pt-4 border-t border-black/[0.04] grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2 text-[#5A554E]">
                      <Globe className="h-4 w-4 text-[#2A2621]" />
                      <span>{org.website || `${org.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.evida.app`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5A554E]">
                      <Mail className="h-4 w-4 text-[#2A2621]" />
                      <span>{org.email || `contact@${org.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`}</span>
                    </div>
                  </div>
                </div>

                {/* Team / Members Roster */}
                <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold tracking-widest text-[#5A554E] uppercase">
                      Members Roster ({org.members.length})
                    </h3>
                    {!isMember && (
                      <button
                        onClick={handleJoinOrg}
                        className="text-[10px] font-extrabold uppercase text-[#FD5C05] hover:underline cursor-pointer bg-transparent border-none"
                      >
                        + Rejoindre l'organisation
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {org.members.map((member, idx) => (
                      <div key={member} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                        <div className="h-7 w-7 rounded-lg bg-[#FD5C05]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[10px] font-extrabold text-[#2A2621]">
                          {member.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2A2621] uppercase">{member}</p>
                          <p className="text-[9px] text-[#5A554E] font-semibold tracking-wider">
                            {org.memberRoles?.[member] || (idx === 0 ? 'President' : idx === 1 ? 'Vice President' : 'Member')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Panel: Upcoming Event Highlights & Join CTA */}
              <div className="md:col-span-1 space-y-6 text-left">
                <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Next Experience</h3>
                  {orgEvents.length > 0 ? (
                    <div 
                      onClick={() => router.push(`/events/${orgEvents[0].id}`)}
                      className="group block space-y-3 cursor-pointer"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#D8D2BC]/40">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${orgEvents[0].coverImage} opacity-30 group-hover:scale-105 transition-transform duration-500`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide block">
                          {orgEvents[0].date}
                        </span>
                        <h4 className="text-sm font-bold text-[#2A2621] group-hover:underline uppercase mt-1 leading-snug line-clamp-1">
                          {orgEvents[0].title}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-[#5A554E] italic">
                      No upcoming experiences listed.
                    </div>
                  )}
                </div>

                {/* Join CTA Box */}
                {!isMember && (
                  <div className="bg-[#2A2621] text-white rounded-[24px] p-6 space-y-3 text-left shadow-md">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#FD5C05]">Campus Community</span>
                    <h4 className="font-extrabold text-sm uppercase tracking-tight">Become a Member of {org.name}</h4>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      Connect with student officers, get exclusive access to announcements, and organize campus experiences together.
                    </p>
                    <button
                      onClick={handleJoinOrg}
                      disabled={isJoining}
                      className="w-full py-2.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#FD5C05]/20 flex items-center justify-center gap-2 border-none"
                    >
                      <UserPlus className="h-4 w-4" /> {isJoining ? 'Joining...' : 'Rejoindre l\'organisation'}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Experiences Hosted by {org.name}</h3>
                {isAdminOrLeader && (
                  <button
                    onClick={() => router.push('/student/create')}
                    className="px-4 py-2 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border-none shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Host New Event
                  </button>
                )}
              </div>

              {orgEvents.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-12 text-center shadow-sm">
                  <Calendar className="h-10 w-10 text-[#5A554E] mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#2A2621] uppercase">No events discovered</p>
                  <p className="text-[11px] text-[#5A554E] mt-1">Check back later for updates on upcoming group hosts.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {orgEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => router.push(`/events/${event.id}`)}
                      isSaved={currentUser ? (event.savedBy?.includes(currentUser.name) || (currentUser.username ? event.savedBy?.includes(currentUser.username) : false)) : false}
                      onSave={(e) => {
                        e.stopPropagation();
                        saveToggle(event.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NEWS & ANNOUNCEMENTS TAB */}
          {activeTab === 'news' && (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Official Announcements</h3>
              </div>

              {/* Publisher for Admin/Leaders */}
              {isAdminOrLeader && (
                <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#FD5C05] flex items-center gap-1.5">
                    <Megaphone className="h-4 w-4" /> Post New Announcement
                  </h4>
                  <form onSubmit={handlePostAnnouncement} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Announcement Title"
                      value={annTitle}
                      onChange={e => setAnnTitle(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                    />
                    <textarea
                      required
                      rows={3}
                      placeholder="Write announcement details for your members and campus followers..."
                      value={annContent}
                      onChange={e => setAnnContent(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPostingAnn}
                        className="px-5 py-2 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" /> {isPostingAnn ? 'Publishing...' : 'Publish Announcement'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Announcements */}
              <div className="space-y-4">
                {org.announcements && org.announcements.length > 0 ? (
                  org.announcements.map((ann) => (
                    <div key={ann.id} className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-3 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-7 w-7 rounded-lg text-white flex items-center justify-center text-xs font-black"
                            style={{ backgroundColor: org.logoColor || '#FD5C05' }}
                          >
                            {org.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-xs text-[#2A2621] uppercase">{org.name}</span>
                          {org.verified && <VerifiedBadge className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#5A554E] font-semibold">{ann.date}</span>
                          {isAdminOrLeader && (
                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id)}
                              className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer"
                              title="Delete Announcement"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-[#2A2621]">{ann.title}</h4>
                      <p className="text-xs text-[#5A554E] leading-relaxed whitespace-pre-wrap">
                        {ann.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-8 text-center text-xs text-[#5A554E]">
                    No announcements published yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-[28px] border border-[#D8D2BC]/30 p-6 space-y-6 shadow-sm text-left">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Organization Profile & Contact Information</h3>
                <p className="text-xs text-[#5A554E] leading-relaxed">
                  {org.aboutUs || org.description || 'Welcome to our official campus organization profile directory.'}
                </p>
              </div>

              <div className="grid gap-4 border-t border-[#D8D2BC]/30 pt-6 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Official Organization Name</p>
                  <p className="font-extrabold text-[#2A2621] uppercase">{org.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Category</p>
                  <p className="font-extrabold text-[#FD5C05] uppercase">{org.category || 'Social'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Contact Website</p>
                  <p className="font-extrabold text-[#2A2621]">{org.website || `${org.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.evida.app`}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Contact Email</p>
                  <p className="font-extrabold text-[#2A2621]">{org.email || `contact@${org.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Verification Badge</p>
                  <p className="font-extrabold text-emerald-600 uppercase flex items-center gap-1">
                    {org.verified ? 'Verified Campus Group' : 'Campus Registered'}
                    {org.verified && <VerifiedBadge className="h-4.5 w-4.5" />}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Membership Policy</p>
                  <p className="font-extrabold text-[#2A2621] uppercase">
                    {org.joinSetting === 'direct' ? 'Direct Join (Open)' : 'Requires Admin Approval'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE TAB (Org Leaders & Admins) */}
          {activeTab === 'manage' && isAdminOrLeader && (
            <div className="space-y-6 text-left">
              
              {/* Organization Profile Settings Form */}
              <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-[#2A2621]">
                  <Edit3 className="h-5 w-5 text-[#FD5C05]" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Edit Organization Profile</h3>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Organization Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Category</label>
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Sports">Sports</option>
                        <option value="Social">Social</option>
                        <option value="Professional">Professional</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Community Service">Community Service</option>
                        <option value="Arts">Arts</option>
                        <option value="Technology">Technology</option>
                        <option value="Religious">Religious</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Short Tagline / Description</label>
                    <input
                      type="text"
                      required
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">About Us (Full Overview)</label>
                    <textarea
                      rows={3}
                      value={editAbout}
                      onChange={e => setEditAbout(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] resize-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Contact Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Website URL</label>
                      <input
                        type="text"
                        value={editWebsite}
                        onChange={e => setEditWebsite(e.target.value)}
                        className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Membership Access Setting</label>
                    <select
                      value={editJoinSetting}
                      onChange={e => setEditJoinSetting(e.target.value as 'direct' | 'request')}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                    >
                      <option value="request">Requires Admin Approval (Students submit a join request)</option>
                      <option value="direct">Direct Join (Students can join immediately)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">Theme Color</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {LOGO_COLORS.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setEditColor(c.id)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                            editColor === c.id ? 'border-[#2A2621] scale-110' : 'border-transparent opacity-80'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        >
                          {editColor === c.id && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-black/[0.04]">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-[#FD5C05]/20"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Organization Verification Request */}
              {!org.verified && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[24px] p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <ShieldAlert className="h-5 w-5" />
                    <h3 className="text-xs font-black uppercase tracking-wider">Campus Verification</h3>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    Official verification badges are awarded to student organizations registered with Livingstone College. Request verification to display the official badge on your profile and events.
                  </p>
                  {org.verificationStatus === 'pending' ? (
                    <span className="inline-block text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-200/60 px-4 py-2 rounded-xl">
                      Verification Request Pending School Review
                    </span>
                  ) : (
                    <button
                      onClick={handleRequestVerification}
                      className="px-5 py-2.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-[#FD5C05]/20 flex items-center gap-2 border-none"
                    >
                      <ShieldCheck className="h-4 w-4" /> Request Verification Badge
                    </button>
                  )}
                </div>
              )}

              {/* Pending Membership Applications */}
              <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Pending Membership Applications</h3>
                {membershipRequests.filter(r => r.orgId === org.id && r.status === 'pending').length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {membershipRequests.filter(r => r.orgId === org.id && r.status === 'pending').map((req) => (
                      <div key={req.id} className="bg-slate-50 rounded-2xl p-4 border border-black/[0.04] flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-[#2A2621] uppercase tracking-widest block">Application</span>
                          <h4 className="text-xs font-extrabold text-[#2A2621] uppercase tracking-tight mt-1">{req.studentName}</h4>
                          <p className="text-[9px] text-[#5A554E]">Wants to join this organization</p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleReviewRequest(req.id, 'approved')}
                            className="flex-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm border-none"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewRequest(req.id, 'rejected')}
                            className="flex-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm border-none"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#5A554E] italic">
                    No pending membership applications.
                  </div>
                )}
              </div>

              {/* Member Roster & Role Manager */}
              <div className="bg-white rounded-[24px] border border-[#D8D2BC]/30 p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-extrabold tracking-widest text-[#2A2621] uppercase">Manage Members & Officer Roles</h3>
                <div className="space-y-3">
                  {org.members.map((member) => {
                    const currentRole = org.memberRoles?.[member] || (org.members[0] === member ? 'President' : 'Member');
                    return (
                      <div key={member} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04]">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#FD5C05]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[10px] font-extrabold text-[#2A2621]">
                            {member.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2A2621] uppercase">{member}</p>
                            <p className="text-[9px] text-[#5A554E]">Current Role: {currentRole}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={currentRole}
                            onChange={(e) => handleUpdateRole(member, e.target.value)}
                            className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#2A2621] focus:outline-none"
                          >
                            <option value="President">President</option>
                            <option value="Vice President">Vice President</option>
                            <option value="Officer">Officer</option>
                            <option value="Admin">Admin</option>
                            <option value="Member">Member</option>
                          </select>
                          
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors cursor-pointer border-none"
                            title="Remove Member"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Danger Zone: Delete Organization */}
              <div className="bg-red-500/5 rounded-[24px] border border-red-500/20 p-6 space-y-4 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-red-600 uppercase flex items-center gap-1.5">
                      <Trash2 className="h-4 w-4" /> Danger Zone
                    </h3>
                    <p className="text-xs text-[#5A554E] font-medium mt-1">
                      Permanently delete this organization, member records, announcements, and remove it from Evida.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteOrganization}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20 flex items-center gap-1.5 border-none shrink-0"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Organization
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

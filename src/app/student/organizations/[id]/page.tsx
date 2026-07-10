'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { Building, Users, Calendar, MapPin, ShieldCheck, ArrowLeft, Globe, Mail, Info, Award, Heart, Check, X } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import EventCard from '@/components/student/EventCard';
import Link from 'next/link';

const ORG_BANNERS = [
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
  '/pexels-rdne-7648057.jpg',
  '/pexels-tima-miroshnichenko-5439368.jpg',
];

export default function OrganizationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { events, organizations, saveToggle } = useEvents();
  const { currentUser } = useUser();

  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'about' | 'manage'>('home');
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);

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

  // Find organization
  const org = organizations.find((o) => o.id === id);

  const handleUpdateRole = async (member: string, role: string) => {
    if (!org) return;
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
    if (!org) return;
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

  if (!org) {
    return (
      <div className="min-h-screen bg-[#DFDED7] flex flex-col items-center justify-center p-6 text-center">
        <Building className="h-16 w-16 text-[#4B5563] mb-4" />
        <h2 className="text-xl font-extrabold text-[#191919] uppercase tracking-tight">Organization Not Found</h2>
        <p className="text-xs text-[#374151] mt-2 max-w-sm">The organization page you are looking for does not exist or may have been deleted.</p>
        <button 
          onClick={() => router.push('/student/dashboard')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#BDFB04] text-[#191919] font-bold text-xs uppercase tracking-wider rounded-full shadow-md shadow-[#BDFB04]/25 hover:bg-[#d1fa3c]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  // Filter events created by members of this organization or under this org ID
  const orgEvents = events.filter((e) => e.status === 'approved' && (e.organizationId === id || e.organizationName === org.name));

  const isAdminOrLeader = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.role === 'student_leader' ||
    org.members[0] === currentUser.name ||
    org.memberRoles?.[currentUser.name] === 'President' ||
    org.memberRoles?.[currentUser.name] === 'Admin' ||
    org.memberRoles?.[currentUser.name] === 'Vice President'
  );

  const bannerIdx = org.name.charCodeAt(0) % ORG_BANNERS.length;
  const bannerPhoto = ORG_BANNERS[bannerIdx];

  return (
    <div className="min-h-screen bg-[#DFDED7] text-[#191919] pb-16 font-sans">
      
      {/* ── Top Header Navigation ── */}
      <div className="sticky top-0 z-30 h-16 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-white border border-black/10 hover:bg-slate-50 flex items-center justify-center text-[#191919] shadow-sm transition-all"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="truncate">
          <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest block">CAMPUS DIRECTORY</span>
          <h1 className="text-sm font-extrabold text-[#191919] uppercase tracking-tight truncate flex items-center">
            {org.name}
            {org.verified && <VerifiedBadge className="h-3.5 w-3.5" />}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* ── Banner & Logo Header (LinkedIn-style Profile Card) ── */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] overflow-hidden shadow-sm flex flex-col relative">
          
          {/* Banner cover */}
          <div 
            className="h-36 md:h-52 w-full bg-slate-900 relative"
            style={{ backgroundImage: `url(${bannerPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Org details wrapper */}
          <div className="px-6 md:px-8 pb-6 relative flex flex-col md:flex-row gap-6 md:items-end">
            
            {/* Logo Avatar (overlapping banner) */}
            <div className="h-20 w-20 md:h-28 md:w-28 rounded-2xl bg-[#BDFB04] text-[#191919] font-extrabold text-3xl md:text-4xl flex items-center justify-center border-4 border-white shadow-md shrink-0 -mt-10 md:-mt-14 z-10">
              {org.name.charAt(0).toUpperCase()}
            </div>

            {/* Title & Stats */}
            <div className="flex-1 space-y-2 pt-2 md:pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-[#191919] uppercase tracking-tight flex items-center leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {org.name}
                  {org.verified && <VerifiedBadge className="h-5 w-5" />}
                </h2>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed max-w-xl">
                {org.description || 'Welcome to our official campus organization page. Follow us to stay updated with our upcoming student experiences.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-[#4B5563] pt-1 uppercase">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#191919]" />
                  {org.members.length} members
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#191919]" />
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

          {/* Tab Selector */}
          <div className="flex px-6 border-t border-black/[0.06] text-xs font-bold text-[#4B5563] bg-slate-50/50">
            {[
              { id: 'home' as const, label: 'Home' },
              { id: 'events' as const, label: `Events (${orgEvents.length})` },
              { id: 'about' as const, label: 'About' },
              isAdminOrLeader ? { id: 'manage' as const, label: 'Manage' } : null,
            ].filter((t): t is { id: 'home' | 'events' | 'about' | 'manage'; label: string } => !!t).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-[#BDFB04] text-[#191919] font-extrabold bg-white' 
                    : 'border-transparent hover:text-[#191919]'
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
              
              {/* Left Panel: Basic Details */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Highlights / About */}
                <div className="bg-white rounded-[24px] border border-black/[0.06] p-6 space-y-4 shadow-sm text-left">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">About Us</h3>
                  <p className="text-xs text-[#374151] leading-relaxed">
                    {org.description || 'No description provided by this campus organization.'}
                  </p>
                  
                  <div className="pt-4 border-t border-black/[0.04] grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2 text-[#374151]">
                      <Globe className="h-4 w-4 text-[#191919]" />
                      <span>{org.name.toLowerCase().replace(/\s+/g, '')}.university.edu</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#374151]">
                      <Mail className="h-4 w-4 text-[#191919]" />
                      <span>contact@{org.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>

                {/* Team Roster */}
                <div className="bg-white rounded-[24px] border border-black/[0.06] p-6 space-y-4 shadow-sm text-left">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#4B5563] uppercase">
                    // Team Roster ({org.members.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {org.members.map((member, idx) => (
                      <div key={member} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                        <div className="h-7 w-7 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[10px] font-extrabold text-[#191919]">
                          {member.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#191919] uppercase">{member}</p>
                          <p className="text-[9px] text-[#4B5563] font-semibold tracking-wider">
                            {idx === 0 ? 'President' : idx === 1 ? 'Vice President' : 'Team Member'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Panel: Upcoming Event Highlights list */}
              <div className="md:col-span-1 space-y-6 text-left">
                <div className="bg-white rounded-[24px] border border-black/[0.06] p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">Next Highlight</h3>
                  {orgEvents.length > 0 ? (
                    <div 
                      onClick={() => router.push(`/events/${orgEvents[0].id}`)}
                      className="group block space-y-3 cursor-pointer"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-black/5">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${orgEvents[0].coverImage} opacity-30 group-hover:scale-105 transition-transform duration-500`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wide block">
                          {orgEvents[0].date}
                        </span>
                        <h4 className="text-sm font-bold text-[#191919] group-hover:underline uppercase mt-1 leading-snug line-clamp-1">
                          {orgEvents[0].title}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-[#4B5563] italic">
                      No upcoming experiences listed.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-left">
              <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">Experiences Hosted by Members</h3>
              {orgEvents.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-black/[0.06] p-12 text-center shadow-sm">
                  <Calendar className="h-10 w-10 text-[#4B5563] mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#191919] uppercase">No events discovered</p>
                  <p className="text-[11px] text-[#374151] mt-1">Check back later for updates on upcoming group hosts.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {orgEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => router.push(`/events/${event.id}`)}
                      isSaved={event.savedBy?.includes(currentUser?.name || '')}
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

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 space-y-6 shadow-sm text-left">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">Organization Profile Overview</h3>
                <p className="text-xs text-[#374151] leading-relaxed leading-relaxed">
                  Welcome to the LinkedIn-inspired profile directory page for the {org.name}. Here, you can search and access comprehensive listings of all active campus events and checkouts created by our verified team leaders and member roster.
                </p>
              </div>

              <div className="grid gap-4 border-t border-black/[0.06] pt-6 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wide">Official Name</p>
                  <p className="font-extrabold text-[#191919] uppercase">{org.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wide">Verification Badge</p>
                  <p className="font-extrabold text-emerald-600 uppercase flex items-center">
                    {org.verified ? 'Verified Member checkmark' : 'Campus Registered'}
                    {org.verified && <VerifiedBadge className="h-4.5 w-4.5" />}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE TAB */}
          {activeTab === 'manage' && isAdminOrLeader && (
            <div className="space-y-6 text-left">
              
              {/* Member Roster & Role Manager */}
              <div className="bg-white rounded-[24px] border border-black/[0.06] p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">Manage Member Roles</h3>
                <div className="space-y-3">
                  {org.members.map((member) => {
                    const currentRole = org.memberRoles?.[member] || (org.members[0] === member ? 'President' : 'Member');
                    return (
                      <div key={member} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04]">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[10px] font-extrabold text-[#191919]">
                            {member.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#191919] uppercase">{member}</p>
                            <p className="text-[9px] text-[#4B5563]">Current Role: {currentRole}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={currentRole}
                            onChange={(e) => handleUpdateRole(member, e.target.value)}
                            className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#191919] focus:outline-none"
                          >
                            <option value="President">President</option>
                            <option value="Vice President">Vice President</option>
                            <option value="Admin">Admin</option>
                            <option value="Member">Member</option>
                          </select>
                          
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
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

              {/* Pending Membership Requests */}
              <div className="bg-white rounded-[24px] border border-black/[0.06] p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-extrabold tracking-widest text-[#191919] uppercase">Pending Membership Applications</h3>
                {membershipRequests.filter(r => r.orgId === org.id && r.status === 'pending').length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {membershipRequests.filter(r => r.orgId === org.id && r.status === 'pending').map((req) => (
                      <div key={req.id} className="bg-slate-50 rounded-2xl p-4 border border-black/[0.04] flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-[#191919] uppercase tracking-widest block">Application</span>
                          <h4 className="text-xs font-extrabold text-[#191919] uppercase tracking-tight mt-1">{req.studentName}</h4>
                          <p className="text-[9px] text-[#4B5563]">Wants to join this organization</p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleReviewRequest(req.id, 'approved')}
                            className="flex-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewRequest(req.id, 'rejected')}
                            className="flex-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#4B5563] italic">
                    No pending membership applications.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

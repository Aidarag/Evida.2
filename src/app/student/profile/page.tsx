'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import Card from '@/components/ui/Card';
import { LogOut, Settings, Award, Users, Shield, CalendarCheck, Calendar, ChevronRight, Bell, Edit3, BookOpen, Star, Check, X, ChevronDown, Image as ImageIcon, UserCheck, Trash2, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MembershipRequest } from '@/lib/types';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

const PROFILE_BANNERS = [
  '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg',
  '/pexels-yaroslav-shuraev-8513385.jpg',
  '/pexels-amine-1285347-9371719.jpg',
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
];

const PRESET_AVATARS = ['🎓', '💻', '🔬', '⚽️', '🎨', '🎵', '🌟', '📣', '🔥', '🦊', '🚀', '🧠', '💼'];

export default function StudentProfilePage() {
  const { currentUser, setCurrentUser, logout } = useUser();
  const { events, organizations } = useEvents();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgFilterVerified, setOrgFilterVerified] = useState<boolean | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newEvents: true,
    rsvpReminders: true,
    orgUpdates: false,
    promotions: false,
  });

  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [newOrgSelection, setNewOrgSelection] = useState('');

  // Fetch membership requests on mount
  const fetchMembershipRequests = async () => {
    try {
      const res = await fetch('/api/organizations/membership');
      if (res.ok) {
        const data = await res.json();
        setMembershipRequests(data);
      }
    } catch (e) {
      console.error('Failed to load membership requests:', e);
    }
  };

  // Sync profile details on mount
  const syncProfile = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/profile?username=${currentUser.username}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (e) {
      console.error('Failed to sync profile:', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      syncProfile();
      fetchMembershipRequests();
    }
  }, []);

  if (!currentUser) return null;

  const totalRsvps = events.filter(e => e.attendees.includes(currentUser.name)).length;
  const totalCreated = events.filter(e => e.organizer === currentUser.name).length;
  const totalSaved = events.filter(e => e.savedBy?.includes(currentUser.name)).length;
  const myOrgs = organizations.filter(org => currentUser.organizations.includes(org.id));
  const rsvpEvents = events.filter(e => e.status === 'approved' && e.attendees.includes(currentUser.name));
  const now = new Date();
  const upcomingEvents = rsvpEvents.filter(e => new Date(e.date) >= now);
  const pastEvents = rsvpEvents.filter(e => new Date(e.date) < now);

  const bannerIdx = currentUser.username.charCodeAt(0) % PROFILE_BANNERS.length;
  const bannerPhoto = currentUser.banner || PROFILE_BANNERS[bannerIdx];

  const handleLogout = () => logout();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.2 * 1024 * 1024) {
        alert('File is too large! Please choose an image smaller than 1.2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'avatar') {
          setEditAvatar(base64String);
        } else {
          setEditBanner(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openEdit = () => {
    setEditName(currentUser.name);
    setEditMajor(currentUser.major || '');
    setEditYear(String(currentUser.graduationYear || ''));
    setEditSchool(currentUser.school || '');
    setEditAvatar(currentUser.avatar || '');
    setEditBanner(currentUser.banner || PROFILE_BANNERS[bannerIdx]);
    setEditBio(currentUser.bio || '');
    setEditInterests((currentUser.interests || []).join(', '));
    setEditLinkedin(currentUser.socials?.linkedin || '');
    setEditGithub(currentUser.socials?.github || '');
    setEditInstagram(currentUser.socials?.instagram || '');
    setEditOpen(true);
    setNotifOpen(false);
  };

  const saveEdit = async () => {
    const interestsArray = editInterests
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          name: editName.trim() || currentUser.name,
          major: editMajor.trim(),
          graduationYear: editYear.trim(),
          school: editSchool.trim(),
          avatar: editAvatar.trim(),
          banner: editBanner.trim(),
          bio: editBio.trim(),
          interests: interestsArray,
          socials: {
            linkedin: editLinkedin.trim(),
            github: editGithub.trim(),
            instagram: editInstagram.trim()
          }
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save profile changes:', e);
    }
    setEditOpen(false);
  };

  const handleApplyJoin = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    try {
      const res = await fetch('/api/organizations/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          orgId: org.id,
          orgName: org.name,
          username: currentUser.username,
          studentName: currentUser.name
        })
      });

      if (res.ok) {
        setNewOrgSelection('');
        fetchMembershipRequests();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit application');
      }
    } catch (e) {
      console.error('Failed to submit membership application:', e);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/organizations/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          id: requestId,
          username: currentUser.username
        })
      });

      if (res.ok) {
        fetchMembershipRequests();
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
        syncProfile();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Custom fields fallbacks
  const bio = currentUser.bio || "Computer Science student at the School of Engineering. Passionate about building campus communities, design, and interactive software experiences.";
  const interests = currentUser.interests || ["Campus Life", "Software Development", "Music Production", "Outdoor Activities"];
  const socials = currentUser.socials || { linkedin: "https://linkedin.com", github: "https://github.com", instagram: "https://instagram.com" };
  const achievements = currentUser.achievements || ["Verified Leader", "Event Pro", "Social Catalyst"];

  return (
    <div className="max-w-4xl mx-auto pb-40">

      {/* ── Banner ── */}
      <div
        className="h-40 md:h-56 w-full"
        style={{ backgroundImage: `url(${bannerPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* ── Profile Header Card ── */}
      <div className="bg-[#DFDED7] px-5 md:px-10 pt-0 pb-6">
        {/* Avatar row — sits half over the banner */}
        <div className="-mt-16 mb-6 flex items-end justify-between">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-[#BDFB04] flex items-center justify-center shadow-lg border-4 border-[#DFDED7] shrink-0 overflow-hidden">
            {currentUser.avatar && (currentUser.avatar.startsWith('data:') || currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/')) ? (
              <img src={currentUser.avatar} className="h-full w-full object-cover" alt={currentUser.name} />
            ) : (
              <span className="text-2xl md:text-3xl font-extrabold text-[#191919]">{currentUser.avatar || '🎓'}</span>
            )}
          </div>
          {savedFeedback && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#BDFB04]/20 border border-[#BDFB04]/40 text-[10px] font-bold text-[#3a5200] uppercase tracking-wider">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </div>

        {/* Name & username */}
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-extrabold text-[#191919] uppercase tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {currentUser.name}
          </h1>
          <p className="text-sm text-[#374151]">@{currentUser.username}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3.5 mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#374151]">
            <Award className="h-3 w-3 text-[#BDFB04]" />
            {currentUser.major || 'Undeclared'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#374151]">
            <Calendar className="h-3 w-3 text-[#BDFB04]" />
            Class of {currentUser.graduationYear}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#374151]">
            <Shield className="h-3 w-3 text-[#BDFB04]" />
            {currentUser.school}
          </span>
        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-6 border-t border-black/[0.05] text-left space-y-2">
          <div className="text-[10px] font-black text-[#191919] uppercase tracking-widest">Biography</div>
          <p className="text-xs text-[#374151] leading-relaxed max-w-2xl">{bio}</p>
          
          {/* Social links */}
          <div className="flex gap-4 pt-2">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#4B5563] hover:text-[#3B5C00] transition-colors flex items-center gap-1">
                LinkedIn ↗
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#4B5563] hover:text-[#3B5C00] transition-colors flex items-center gap-1">
                GitHub ↗
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#4B5563] hover:text-[#3B5C00] transition-colors flex items-center gap-1">
                Instagram ↗
              </a>
            )}
          </div>
        </div>

        {/* Interests and Achievements Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-black/[0.05] text-left">
          {/* Interests */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-[#191919] uppercase tracking-widest">Areas of Interest</div>
            <div className="flex flex-wrap gap-2">
              {interests.map(item => (
                <span key={item} className="px-2.5 py-1 rounded-lg bg-black/[0.03] border border-black/[0.06] text-[10px] text-[#374151] font-bold uppercase">
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-[#191919] uppercase tracking-widest">Achievements & Badges</div>
            <div className="flex flex-wrap gap-2">
              {achievements.map(badge => (
                <span key={badge} className="px-2.5 py-1 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/30 text-[10px] text-[#3B5C00] font-black uppercase tracking-wider flex items-center gap-1">
                  ★ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-5 md:px-10 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Attended', value: totalRsvps, Icon: CalendarCheck, color: '#BDFB04', bg: '#BDFB0418', route: '/student/my-events' },
            { label: 'Hosted', value: totalCreated, Icon: Star, color: '#191919', bg: '#19191910', route: '/student/my-events' },
            { label: 'Saved', value: totalSaved, Icon: BookOpen, color: '#374151', bg: '#37415112', route: '/student/saved' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              onClick={() => router.push(stat.route)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-black/[0.04] transition-all hover:border-[#BDFB04]/30 cursor-pointer select-none"
            >
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-extrabold text-[#191919]">{stat.value}</div>
              <div className="text-[9px] font-bold text-[#374151] uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Organizations & Account Actions ── */}
      <div className="px-5 md:px-10 grid md:grid-cols-2 gap-5">

        {/* My Organizations */}
        <div className="space-y-3">
          <div className="text-[11px] font-black text-[#4B5563] flex items-center gap-2 uppercase tracking-widest">
            <Users className="h-3.5 w-3.5 text-[#BDFB04]" /> My Organizations
          </div>
          {myOrgs.length > 0 ? (
            <div className="space-y-2">
              {myOrgs.map((org) => {
                const userRole = org.memberRoles?.[currentUser.name] || 
                                 org.memberRoles?.[currentUser.username] || 
                                 (org.members[0] === currentUser.name ? 'President' : 'Member');
                return (
                  <div 
                    key={org.id} 
                    onClick={() => router.push(`/student/organizations/${org.id}`)}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between border border-black/[0.04] shadow-sm hover:border-[#BDFB04]/40 hover:scale-[1.01] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div 
                        className="h-11 w-11 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: org.logoColor || '#191919' }}
                      >
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#191919] text-sm uppercase tracking-tight group-hover:text-[#3B5C00] transition-colors truncate">
                          {org.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded-md bg-black/[0.04] text-[#4B5563] text-[8px] font-bold uppercase tracking-wider">
                            {userRole}
                          </span>
                          <span className="text-[9px] text-[#4B5563] font-semibold">
                            {org.members.length} members
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#4B5563] group-hover:text-[#191919] pl-2 transition-colors">Manage →</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-black/[0.04]">
              <Users className="h-8 w-8 text-[#374151]/30 mx-auto mb-2" />
              <p className="text-xs text-[#374151]">Not a member of any organizations yet.</p>
            </div>
          )}

          {/* Join Campus Organizations */}
          {(() => {
            const joinableOrgs = organizations.filter(
              org => !currentUser.organizations.includes(org.id) &&
              !membershipRequests.some(r => r.orgId === org.id && r.username === currentUser.username && r.status === 'pending')
            );
            
            const filteredJoinable = joinableOrgs.filter(org => {
              const matchesSearch = org.name.toLowerCase().includes(orgSearchQuery.toLowerCase());
              const matchesVerified = orgFilterVerified === null || org.verified === orgFilterVerified;
              return matchesSearch && matchesVerified;
            });
            
            if (joinableOrgs.length === 0) return null;
            
            return (
              <div className="bg-white rounded-2xl p-5 border border-black/[0.04] shadow-sm space-y-4 mt-3 text-left">
                <div className="text-[10px] font-black text-[#191919] uppercase tracking-wider">Apply for Membership</div>
                
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Search campus organizations..."
                    value={orgSearchQuery}
                    onChange={e => setOrgSearchQuery(e.target.value)}
                    className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                  />
                  
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setOrgFilterVerified(null)}
                      className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all ${
                        orgFilterVerified === null 
                          ? 'bg-[#BDFB04] border-[#BDFB04] text-[#191919]' 
                          : 'bg-white border-black/10 text-[#4B5563] hover:bg-slate-50'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrgFilterVerified(true)}
                      className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all ${
                        orgFilterVerified === true 
                          ? 'bg-[#BDFB04] border-[#BDFB04] text-[#191919]' 
                          : 'bg-white border-black/10 text-[#4B5563] hover:bg-slate-50'
                      }`}
                    >
                      Verified
                    </button>
                  </div>
                </div>
                
                {/* List Grid */}
                {filteredJoinable.length > 0 ? (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {filteredJoinable.map(org => (
                      <div key={org.id} className="bg-slate-50 border border-black/[0.04] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0"
                            style={{ backgroundColor: org.logoColor || '#191919' }}
                          >
                            {org.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#191919] uppercase tracking-tight truncate flex items-center">
                              {org.name}
                              {org.verified && <VerifiedBadge className="h-3.5 w-3.5 ml-1" />}
                            </h4>
                            <p className="text-[9px] text-[#4B5563]">{org.members.length} members • Campus Group</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleApplyJoin(org.id)}
                          className="bg-[#BDFB04] text-[#191919] hover:bg-[#c5ff0a] px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all shadow-sm shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#4B5563] italic text-center py-2">No joinable campus groups match your query.</p>
                )}
              </div>
            );
          })()}

          {/* Pending Applications (For Students only) */}
          {(() => {
            const pendingUserRequests = membershipRequests.filter(
              r => r.username === currentUser.username && r.status === 'pending'
            );
            if (pendingUserRequests.length === 0) return null;
            return (
              <div className="space-y-2 mt-4">
                <h3 className="text-[9px] font-bold text-[#191919] uppercase tracking-wider block pl-1">Pending Applications</h3>
                {pendingUserRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-amber-500/20 bg-amber-500/[0.02] shadow-sm">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-[#191919] text-xs uppercase tracking-tight truncate">{req.orgName}</p>
                      <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-0.5 animate-pulse">Pending Approval</p>
                    </div>
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="h-8 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <div className="text-[11px] font-black text-[#4B5563] flex items-center gap-2 uppercase tracking-widest">
            <Settings className="h-3.5 w-3.5 text-[#374151]" /> Account Actions
          </div>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-black/[0.05] border border-black/[0.04] shadow-sm">

            {/* Edit Profile */}
            <button
              onClick={openEdit}
              className="w-full p-4 flex items-center gap-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-[#BDFB04]/15 flex items-center justify-center shrink-0">
                <Edit3 className="h-4 w-4 text-[#3a5200]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[#191919] uppercase tracking-tight">Edit Profile</p>
                <p className="text-[10px] text-[#374151]">Customize details, banner &amp; avatar</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#374151]/40 group-hover:text-[#191919]/50 transition-colors shrink-0" />
            </button>

            {/* Edit Profile Inline Panel */}
            <AnimatePresence>
              {editOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-[#f7f7f5] space-y-4">
                    {[
                      { label: 'Full Name', value: editName, set: setEditName, type: 'text' },
                      { label: 'School Division', value: editSchool, set: setEditSchool, type: 'text' },
                      { label: 'Major', value: editMajor, set: setEditMajor, type: 'text' },
                      { label: 'Graduation Year', value: editYear, set: setEditYear, type: 'text' },
                      { label: 'Biography', value: editBio, set: setEditBio, type: 'text' },
                      { label: 'Interests (comma-separated)', value: editInterests, set: setEditInterests, type: 'text' },
                      { label: 'LinkedIn URL', value: editLinkedin, set: setEditLinkedin, type: 'text' },
                      { label: 'GitHub URL', value: editGithub, set: setEditGithub, type: 'text' },
                      { label: 'Instagram URL', value: editInstagram, set: setEditInstagram, type: 'text' },
                    ].map(field => (
                      <div key={field.label} className="space-y-1">
                        <label className="text-[9px] font-bold text-[#374151] uppercase tracking-widest">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={e => field.set(e.target.value)}
                          className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                        />
                      </div>
                    ))}

                    {/* Avatar Customizer */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-[#374151] uppercase tracking-widest block">Choose Avatar Emoji</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-white p-2 rounded-xl border border-black/[0.08]">
                        {PRESET_AVATARS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setEditAvatar(emoji)}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm transition-all border ${
                              editAvatar === emoji
                                ? 'bg-[#BDFB04] border-[#BDFB04] text-[#191919] scale-110 shadow-sm'
                                : 'bg-black/[0.02] border-black/[0.05] hover:bg-black/[0.05] text-[#191919]'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Custom Initials/Emoji</label>
                          <input
                            type="text"
                            maxLength={3}
                            value={editAvatar.startsWith('data:') ? '' : editAvatar}
                            onChange={e => setEditAvatar(e.target.value)}
                            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                            placeholder="e.g. MC"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Or Upload Photo</label>
                          <label className="relative flex items-center justify-center border border-dashed border-black/20 hover:border-black/40 rounded-xl px-3 py-2 text-xs text-[#374151] hover:text-[#191919] transition-all cursor-pointer bg-white h-9">
                            <span className="truncate text-[10px] font-semibold">{editAvatar.startsWith('data:') ? '✓ Photo selected' : 'Upload file'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileChange(e, 'avatar')}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Banner Customizer */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-[#374151] uppercase tracking-widest block">Select Banner Preset</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PROFILE_BANNERS.map((banner, index) => (
                          <button
                            key={banner}
                            type="button"
                            onClick={() => setEditBanner(banner)}
                            className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all ${
                              editBanner === banner
                                ? 'border-[#BDFB04] scale-105 shadow-md'
                                : 'border-transparent opacity-85 hover:opacity-100'
                            }`}
                          >
                            <img src={banner} className="h-full w-full object-cover" alt={`Preset ${index + 1}`} />
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Paste Custom Image URL</label>
                          <input
                            type="text"
                            value={editBanner.startsWith('data:') ? '' : editBanner}
                            onChange={e => setEditBanner(e.target.value)}
                            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                            placeholder="https://example.com/banner.jpg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Or Upload Photo</label>
                          <label className="relative flex items-center justify-center border border-dashed border-black/20 hover:border-black/40 rounded-xl px-3 py-2 text-xs text-[#374151] hover:text-[#191919] transition-all cursor-pointer bg-white h-9">
                            <span className="truncate text-[10px] font-semibold">{editBanner.startsWith('data:') ? '✓ Photo selected' : 'Upload file'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileChange(e, 'banner')}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Form Controls */}
                    <div className="flex gap-2 pt-2 border-t border-black/[0.05]">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-[#BDFB04] text-[#191919] text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl hover:bg-[#BDFB04]/90 transition-colors"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => setEditOpen(false)}
                        className="h-10 w-10 rounded-xl bg-black/[0.05] flex items-center justify-center text-[#374151] hover:text-[#191919] transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification Settings */}
            <button
              onClick={() => { setNotifOpen(!notifOpen); setEditOpen(false); }}
              className="w-full p-4 flex items-center gap-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4 text-[#191919]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[#191919] uppercase tracking-tight">Notifications</p>
                <p className="text-[10px] text-[#374151]">Manage your alerts</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#374151]/40 transition-transform duration-200 shrink-0 ${notifOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-[#f7f7f5] space-y-4">
                    {[
                      { key: 'newEvents' as const, label: 'New Events Near You', desc: 'Get notified when new events are posted' },
                      { key: 'rsvpReminders' as const, label: 'RSVP Reminders', desc: '24hr reminders for events you saved' },
                      { key: 'orgUpdates' as const, label: 'Organization Updates', desc: 'Updates from your organizations' },
                      { key: 'promotions' as const, label: 'Promotions & Deals', desc: 'Campus deals and sponsored posts' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#191919] uppercase tracking-tight">{item.label}</p>
                          <p className="text-[10px] text-[#374151] font-normal">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotif(item.key)}
                          className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ${notifSettings[item.key] ? 'bg-[#BDFB04]' : 'bg-black/[0.12]'}`}
                        >
                          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifSettings[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center gap-3 hover:bg-red-500/[0.03] active:bg-red-500/[0.06] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-red-500 uppercase tracking-tight">Sign Out</p>
                <p className="text-[10px] text-red-400/70">You will be returned to login</p>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400/30 group-hover:text-red-400 transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Advisor Review Section (visible to advisors only) */}
      {currentUser.role === 'admin' && (
        <div className="px-5 md:px-10 mt-8 space-y-3">
          <div className="text-[11px] font-black text-[#4B5563] flex items-center gap-2 uppercase tracking-widest">
            <UserCheck className="h-4 w-4 text-[#BDFB04]" /> Pending Membership Applications Review
          </div>
          {membershipRequests.filter(r => r.status === 'pending').length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {membershipRequests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#191919] uppercase tracking-widest block">Join Request</span>
                    <h4 className="text-sm font-extrabold text-[#191919] uppercase tracking-tight mt-1">{req.studentName}</h4>
                    <p className="text-xs text-[#374151] mt-0.5">Wants to join: <strong className="text-[#191919]">{req.orgName}</strong></p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleReviewRequest(req.id, 'approved')}
                      className="flex-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="h-4.5 w-4.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReviewRequest(req.id, 'rejected')}
                      className="flex-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <X className="h-4.5 w-4.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-black/[0.04] shadow-sm">
              <UserCheck className="h-10 w-10 text-emerald-500/20 mx-auto mb-2" />
              <p className="text-xs text-[#374151]">No pending student membership requests.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Event Schedules ── */}
      <div className="px-5 md:px-10 mt-8 space-y-6 text-left">
        {/* Upcoming events */}
        <div className="space-y-3">
          <div className="text-[11px] font-black text-[#191919] uppercase tracking-widest">My Upcoming Experiences</div>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm hover:border-[#BDFB04]/40 transition-all cursor-pointer flex gap-3 items-center"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex flex-col items-center justify-center shrink-0">
                    <Calendar className="h-4.5 w-4.5 text-[#3B5C00]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#191919] uppercase tracking-tight truncate leading-snug">{event.title}</h4>
                    <p className="text-[9px] text-[#4B5563] mt-0.5">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#4B5563] italic py-4 bg-white rounded-2xl border border-black/[0.04] text-center">No upcoming RSVPs.</p>
          )}
        </div>

        {/* Recently Attended */}
        <div className="space-y-3">
          <div className="text-[11px] font-black text-[#191919] uppercase tracking-widest">Recently Attended</div>
          {pastEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {pastEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm hover:border-[#BDFB04]/40 transition-all cursor-pointer flex gap-3 items-center opacity-85 hover:opacity-100"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-100 border border-black/5 flex flex-col items-center justify-center shrink-0">
                    <Check className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#191919] uppercase tracking-tight truncate leading-snug">{event.title}</h4>
                    <p className="text-[9px] text-[#4B5563] mt-0.5">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#4B5563] italic py-4 bg-white rounded-2xl border border-black/[0.04] text-center">No recently attended events.</p>
          )}
        </div>
      </div>
    </div>
  );
}

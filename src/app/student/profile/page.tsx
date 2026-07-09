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

  const bannerIdx = currentUser.username.charCodeAt(0) % PROFILE_BANNERS.length;
  const bannerPhoto = currentUser.banner || PROFILE_BANNERS[bannerIdx];

  const handleLogout = () => logout();

  const openEdit = () => {
    setEditName(currentUser.name);
    setEditMajor(currentUser.major || '');
    setEditYear(String(currentUser.graduationYear || ''));
    setEditSchool(currentUser.school || '');
    setEditAvatar(currentUser.avatar || '');
    setEditBanner(currentUser.banner || PROFILE_BANNERS[bannerIdx]);
    setEditOpen(true);
    setNotifOpen(false);
  };

  const saveEdit = async () => {
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
          banner: editBanner.trim()
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

  const handleApplyJoin = async () => {
    if (!newOrgSelection) return;
    const org = organizations.find(o => o.id === newOrgSelection);
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
      console.error(e);
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

  return (
    <div className="max-w-4xl mx-auto pb-8">

      {/* ── Banner ── */}
      <div
        className="h-32 md:h-44 w-full"
        style={{ backgroundImage: `url(${bannerPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* ── Profile Header Card ── */}
      <div className="bg-[#DFDED7] px-5 md:px-10 pt-0 pb-5">
        {/* Avatar row — sits half over the banner */}
        <div className="-mt-12 mb-4 flex items-end justify-between">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-[#BDFB04] flex items-center justify-center shadow-lg border-4 border-[#DFDED7] shrink-0">
            <span className="text-2xl md:text-3xl font-extrabold text-[#191919]">{currentUser.avatar}</span>
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
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* ── Stats Row ── */}
      <div className="px-5 md:px-10 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Attended', value: totalRsvps, Icon: CalendarCheck, color: '#BDFB04', bg: '#BDFB0418' },
            { label: 'Hosted', value: totalCreated, Icon: Star, color: '#191919', bg: '#19191910' },
            { label: 'Saved', value: totalSaved, Icon: BookOpen, color: '#374151', bg: '#37415112' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-black/[0.04]">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-extrabold text-[#191919]">{stat.value}</div>
              <div className="text-[9px] font-bold text-[#374151] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Organizations & Account Actions ── */}
      <div className="px-5 md:px-10 grid md:grid-cols-2 gap-5">

        {/* My Organizations */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-widest">
            <Users className="h-3.5 w-3.5 text-[#BDFB04]" /> My Organizations
          </h2>
          {myOrgs.length > 0 ? (
            <div className="space-y-2">
              {myOrgs.map(org => (
                <div key={org.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-black/[0.04] shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#BDFB04]/15 border border-[#BDFB04]/20 flex items-center justify-center shrink-0">
                    <span className="font-extrabold text-[#3a5200] text-base">{org.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#191919] text-sm uppercase tracking-tight truncate">{org.name}</p>
                    <p className="text-[10px] text-[#374151]">{org.verified ? '✓ Verified organization' : 'Student group'}</p>
                  </div>
                </div>
              ))}
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
            if (joinableOrgs.length === 0) return null;
            return (
              <div className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm space-y-3 mt-3">
                <h3 className="text-[9px] font-extrabold text-[#374151] uppercase tracking-wider">// Apply for Membership</h3>
                <div className="flex gap-2">
                  <select
                    value={newOrgSelection}
                    onChange={(e) => setNewOrgSelection(e.target.value)}
                    className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none"
                  >
                    <option value="">Select an organization...</option>
                    {joinableOrgs.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleApplyJoin}
                    disabled={!newOrgSelection}
                    className="bg-[#BDFB04] text-[#191919] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c5ff0a] transition-all px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
                  >
                    Apply <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
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
                <h3 className="text-[9px] font-extrabold text-[#374151] uppercase tracking-wider block pl-1">// Pending Applications</h3>
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
          <h2 className="text-xs font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-widest">
            <Settings className="h-3.5 w-3.5 text-[#374151]" /> Account Actions
          </h2>
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
                      <div className="space-y-1 pt-1">
                        <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Or Custom Initials/Emoji</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={editAvatar}
                          onChange={e => setEditAvatar(e.target.value)}
                          className="w-24 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                          placeholder="e.g. MC"
                        />
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
                      <div className="space-y-1 pt-1">
                        <label className="text-[8px] font-bold text-[#374151] uppercase tracking-wider block pl-0.5">Or Paste Custom Image URL</label>
                        <input
                          type="text"
                          value={editBanner}
                          onChange={e => setEditBanner(e.target.value)}
                          className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] transition-colors"
                          placeholder="https://example.com/banner.jpg"
                        />
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
          <h2 className="text-xs font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-widest">
            <UserCheck className="h-4 w-4 text-[#BDFB04]" /> Pending Membership Applications Review
          </h2>
          {membershipRequests.filter(r => r.status === 'pending').length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {membershipRequests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#374151] uppercase tracking-widest block">// JOIN REQUEST</span>
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
    </div>
  );
}

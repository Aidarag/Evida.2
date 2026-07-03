'use client';

import React, { useState } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import Card from '@/components/ui/Card';
import { LogOut, Settings, Award, Users, Shield, CalendarCheck, Calendar, ChevronRight, Bell, Edit3, BookOpen, Star, Check, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const PROFILE_BANNERS = [
  '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg',
  '/pexels-yaroslav-shuraev-8513385.jpg',
  '/pexels-amine-1285347-9371719.jpg',
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
];

export default function StudentProfilePage() {
  const { currentUser, setCurrentUser, logout } = useUser();
  const { events, organizations } = useEvents();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editYear, setEditYear] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newEvents: true,
    rsvpReminders: true,
    orgUpdates: false,
    promotions: false,
  });

  if (!currentUser) return null;

  const totalRsvps = events.filter(e => e.attendees.includes(currentUser.name)).length;
  const totalCreated = events.filter(e => e.organizer === currentUser.name).length;
  const totalSaved = events.filter(e => e.savedBy?.includes(currentUser.name)).length;
  const myOrgs = organizations.filter(org => currentUser.organizations.includes(org.id));

  const bannerIdx = currentUser.username.charCodeAt(0) % PROFILE_BANNERS.length;
  const bannerPhoto = PROFILE_BANNERS[bannerIdx];

  const handleLogout = () => logout();

  const openEdit = () => {
    setEditName(currentUser.name);
    setEditMajor(currentUser.major || '');
    setEditYear(String(currentUser.graduationYear || ''));
    setEditOpen(true);
    setNotifOpen(false);
  };

  const saveEdit = () => {
    setCurrentUser({
      ...currentUser,
      name: editName.trim() || currentUser.name,
      major: editMajor.trim() || currentUser.major,
      graduationYear: editYear.trim() || currentUser.graduationYear,
    });
    setEditOpen(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
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
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-[#92D000] flex items-center justify-center shadow-lg border-4 border-[#DFDED7] shrink-0">
            <span className="text-2xl md:text-3xl font-extrabold text-[#191919]">{currentUser.avatar}</span>
          </div>
          {savedFeedback && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#92D000]/20 border border-[#92D000]/40 text-[10px] font-bold text-[#3a5200] uppercase tracking-wider">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </div>

        {/* Name & username */}
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-extrabold text-[#191919] uppercase tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {currentUser.name}
          </h1>
          <p className="text-sm text-[#4F5666]">@{currentUser.username}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#4F5666]">
            <Award className="h-3 w-3 text-[#92D000]" />
            {currentUser.major || 'Undeclared'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#4F5666]">
            <Calendar className="h-3 w-3 text-[#92D000]" />
            Class of {currentUser.graduationYear}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-[10px] font-semibold text-[#4F5666]">
            <Shield className="h-3 w-3 text-[#92D000]" />
            {currentUser.school}
          </span>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-5 md:px-10 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Attended', value: totalRsvps, Icon: CalendarCheck, color: '#92D000', bg: '#92D00018' },
            { label: 'Hosted', value: totalCreated, Icon: Star, color: '#191919', bg: '#19191910' },
            { label: 'Saved', value: totalSaved, Icon: BookOpen, color: '#4F5666', bg: '#4F566612' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-black/[0.04]">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-extrabold text-[#191919]">{stat.value}</div>
              <div className="text-[9px] font-bold text-[#4F5666] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Organizations & Account Actions ── */}
      <div className="px-5 md:px-10 grid md:grid-cols-2 gap-5">

        {/* My Organizations */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-widest">
            <Users className="h-3.5 w-3.5 text-[#92D000]" /> My Organizations
          </h2>
          {myOrgs.length > 0 ? (
            <div className="space-y-2">
              {myOrgs.map(org => (
                <div key={org.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-black/[0.04] shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#92D000]/15 border border-[#92D000]/20 flex items-center justify-center shrink-0">
                    <span className="font-extrabold text-[#3a5200] text-base">{org.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#191919] text-sm uppercase tracking-tight truncate">{org.name}</p>
                    <p className="text-[10px] text-[#4F5666]">{org.verified ? '✓ Verified organization' : 'Student group'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-black/[0.04]">
              <Users className="h-8 w-8 text-[#4F5666]/30 mx-auto mb-2" />
              <p className="text-xs text-[#4F5666]">Not a member of any organizations yet.</p>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-widest">
            <Settings className="h-3.5 w-3.5 text-[#4F5666]" /> Account Actions
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-black/[0.05] border border-black/[0.04] shadow-sm">

            {/* Edit Profile */}
            <button
              onClick={openEdit}
              className="w-full p-4 flex items-center gap-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-[#92D000]/15 flex items-center justify-center shrink-0">
                <Edit3 className="h-4 w-4 text-[#3a5200]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[#191919] uppercase tracking-tight">Edit Profile</p>
                <p className="text-[10px] text-[#4F5666]">Update your name, major &amp; year</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#4F5666]/40 group-hover:text-[#191919]/50 transition-colors shrink-0" />
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
                  <div className="p-4 bg-[#f7f7f5] space-y-3">
                    {[
                      { label: 'Full Name', value: editName, set: setEditName, type: 'text' },
                      { label: 'Major', value: editMajor, set: setEditMajor, type: 'text' },
                      { label: 'Graduation Year', value: editYear, set: setEditYear, type: 'text' },
                    ].map(field => (
                      <div key={field.label} className="space-y-1">
                        <label className="text-[9px] font-bold text-[#4F5666] uppercase tracking-widest">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={e => field.set(e.target.value)}
                          className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm text-[#191919] focus:outline-none focus:border-[#92D000] transition-colors"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-[#92D000] text-[#191919] text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl hover:bg-[#92D000]/90 transition-colors"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => setEditOpen(false)}
                        className="h-10 w-10 rounded-xl bg-black/[0.05] flex items-center justify-center text-[#4F5666] hover:text-[#191919] transition-colors"
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
                <p className="text-[10px] text-[#4F5666]">Manage your alerts</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#4F5666]/40 transition-transform duration-200 shrink-0 ${notifOpen ? 'rotate-180' : ''}`} />
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
                          <p className="text-[10px] text-[#4F5666] font-normal">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotif(item.key)}
                          className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ${notifSettings[item.key] ? 'bg-[#92D000]' : 'bg-black/[0.12]'}`}
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
    </div>
  );
}

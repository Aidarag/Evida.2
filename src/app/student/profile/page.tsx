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
  const { currentUser, setCurrentUser } = useUser();
  const { events, organizations } = useEvents();
  const router = useRouter();

  // Edit profile state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editYear, setEditYear] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Notification settings state
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

  const handleLogout = () => router.push('/login');

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
    <div className="max-w-4xl mx-auto space-y-6 pb-8">

      {/* Profile Hero Banner */}
      <div className="relative">
        <div
          className="h-36 md:h-48 w-full overflow-hidden"
          style={{ backgroundImage: `url(${bannerPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start gap-5 -mt-14 md:-mt-16 relative z-10">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-[#92D000] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-4 border-[#DFDED7] shrink-0">
              <span className="text-3xl md:text-4xl font-extrabold text-[#191919]">{currentUser.avatar}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 pt-2 md:pt-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#191919] leading-tight">{currentUser.name}</h1>
                  {savedFeedback && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#92D000]/15 border border-[#92D000]/30 text-[10px] font-bold text-[#3a5200]">
                      <Check className="h-3 w-3" /> Saved
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#4F5666]">@{currentUser.username}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] border border-black/[0.07] text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">
                    <Award className="h-3 w-3" />{currentUser.major}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] border border-black/[0.07] text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />Class of {currentUser.graduationYear}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#92D000]/15 border border-[#92D000]/30 text-[10px] font-bold text-[#3a5200] uppercase tracking-wider">
                    <Shield className="h-3 w-3" />{currentUser.school}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 md:px-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Attended', value: totalRsvps, Icon: CalendarCheck, color: '#92D000', bg: '#92D00018' },
            { label: 'Hosted', value: totalCreated, Icon: Star, color: '#191919', bg: '#19191918' },
            { label: 'Saved', value: totalSaved, Icon: BookOpen, color: '#4F5666', bg: '#4F566618' },
          ].map(stat => (
            <Card key={stat.label} className="p-4 text-center flex flex-col items-center gap-1.5" hover={false} glass>
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="text-xl font-extrabold text-[#191919]">{stat.value}</div>
              <div className="text-[9px] font-bold text-[#4F5666] uppercase tracking-wider">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Organizations & Account Actions */}
      <div className="px-6 md:px-10 grid md:grid-cols-2 gap-6">

        {/* My Organizations */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-wider">
            <Users className="h-4 w-4 text-[#92D000]" /> My Organizations
          </h2>
          {myOrgs.length > 0 ? (
            <div className="space-y-2">
              {myOrgs.map(org => (
                <Card key={org.id} className="p-4 flex items-center gap-3" glass>
                  <div className="h-10 w-10 rounded-xl bg-[#92D000]/20 border border-[#92D000]/30 flex items-center justify-center shrink-0">
                    <span className="font-extrabold text-[#3a5200] text-base">{org.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#191919] text-sm truncate">{org.name}</h3>
                    <p className="text-[10px] text-[#4F5666] font-medium">{org.verified ? '✓ Verified Organization' : 'Student Group'}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center" glass hover={false}>
              <Users className="h-8 w-8 text-[#4F5666]/40 mx-auto mb-2" />
              <p className="text-xs text-[#4F5666]">Not a member of any organizations yet.</p>
            </Card>
          )}
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#191919] flex items-center gap-2 uppercase tracking-wider">
            <Settings className="h-4 w-4 text-[#4F5666]" /> Account Actions
          </h2>
          <Card className="overflow-hidden divide-y divide-black/[0.05]" glass hover={false}>

            {/* Edit Profile */}
            <button
              onClick={openEdit}
              className="w-full p-4 flex items-center gap-3 hover:bg-black/[0.03] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-black/[0.06] flex items-center justify-center shrink-0">
                <Edit3 className="h-4 w-4 text-[#191919]" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-[#191919] block">Edit Profile</span>
                <span className="text-[10px] text-[#4F5666]">Update your name, major &amp; year</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#4F5666]/40 group-hover:text-[#191919]/50 transition-colors" />
            </button>

            {/* Edit Profile Inline Panel */}
            <AnimatePresence>
              {editOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-black/[0.02] border-b border-black/[0.05] space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Full Name</label>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#191919] focus:outline-none focus:border-[#92D000] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Major</label>
                      <input
                        value={editMajor}
                        onChange={e => setEditMajor(e.target.value)}
                        className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#191919] focus:outline-none focus:border-[#92D000] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Graduation Year</label>
                      <input
                        type="number"
                        value={editYear}
                        onChange={e => setEditYear(e.target.value)}
                        className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#191919] focus:outline-none focus:border-[#92D000] transition-colors"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-[#92D000] text-[#191919] text-xs font-bold uppercase tracking-wider py-2 rounded-xl hover:bg-[#92D000]/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditOpen(false)}
                        className="h-9 w-9 rounded-xl bg-black/[0.05] flex items-center justify-center text-[#4F5666] hover:text-[#191919] transition-colors"
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
              className="w-full p-4 flex items-center gap-3 hover:bg-black/[0.03] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-black/[0.06] flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4 text-[#191919]" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-[#191919] block">Notification Settings</span>
                <span className="text-[10px] text-[#4F5666]">Manage your alerts</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#4F5666]/40 transition-transform duration-200 ${notifOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Notification Settings Inline Panel */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-black/[0.02] space-y-3">
                    {[
                      { key: 'newEvents' as const, label: 'New Events Near You', desc: 'Get notified when new events are posted' },
                      { key: 'rsvpReminders' as const, label: 'RSVP Reminders', desc: '24hr reminders for events you saved' },
                      { key: 'orgUpdates' as const, label: 'Organization Updates', desc: 'Updates from your organizations' },
                      { key: 'promotions' as const, label: 'Promotions & Deals', desc: 'Campus deals and sponsored posts' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#191919]">{item.label}</p>
                          <p className="text-[10px] text-[#4F5666]">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotif(item.key)}
                          className={`relative h-5.5 w-10 rounded-full transition-colors duration-200 shrink-0 ${notifSettings[item.key] ? 'bg-[#92D000]' : 'bg-black/[0.12]'}`}
                        >
                          <div className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform duration-200 ${notifSettings[item.key] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
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
              className="w-full p-4 flex items-center gap-3 hover:bg-red-500/[0.04] transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-red-500 block">Sign Out</span>
                <span className="text-[10px] text-red-400/70">You will be returned to login</span>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400/40 group-hover:text-red-400 transition-colors" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

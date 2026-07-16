'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Settings, 
  Award, 
  Users, 
  Shield, 
  CalendarCheck, 
  Calendar, 
  ChevronRight, 
  Bell, 
  Edit3, 
  BookOpen, 
  Star, 
  Check, 
  X, 
  ChevronDown, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  FileText, 
  Sparkles, 
  Mail,
  UserCheck 
} from 'lucide-react';
import Button from '@/components/ui/Button';
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
  const { events, organizations, saveToggle, rsvpToggle } = useEvents();
  const router = useRouter();

  // State variables for profile editor
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editClassification, setEditClassification] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'going' | 'saved' | 'hosted' | 'orgs'>('going');





  // Calendar Date State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026

  // Promotions State
  const [promotions, setPromotions] = useState<any[]>([]);

  // Membership requests state for advisor reviews
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);

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

  // Fetch promotions & sync requests on mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          setPromotions(data);
        }
      } catch (e) {}
    };
    fetchPromotions();
    
    if (currentUser) {
      syncProfile();
      fetchMembershipRequests();
    }
  }, []);

  // Filter events and promotions by association safely
  const attendedEvents = currentUser ? events.filter(e => e.status === 'approved' && e.attendees.includes(currentUser.name)) : [];
  const savedEvents = currentUser ? events.filter(e => e.status === 'approved' && e.savedBy?.includes(currentUser.name)) : [];

  // Hosted (created)
  const hostedEvents = currentUser ? events.filter(e => e.status === 'approved' && e.organizer === currentUser.name) : [];
  const hostedPromos = currentUser ? promotions.filter(p => p.contactInfo?.toLowerCase().includes(currentUser.username.toLowerCase()) || p.contactInfo?.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())) : [];
  const hostedCount = hostedEvents.length + hostedPromos.length;

  // Organizations
  const myOrgs = currentUser ? organizations.filter(org => currentUser.organizations.includes(org.id)) : [];

  // Calendar Calculation
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday start
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const getEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    return allEvents.filter(e => e.date === dateString);
  };

  const handleMonthNav = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCalendarDate(newDate);
  };

  const handleLogout = () => logout();

  const openEdit = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditMajor(currentUser.major || '');
    setEditYear(String(currentUser.graduationYear || ''));
    setEditSchool(currentUser.school || '');
    setEditAvatar(currentUser.avatar || '');
    setEditBio(currentUser.bio || '');
    setEditInterests((currentUser.interests || []).join(', '));
    setEditLinkedin(currentUser.socials?.linkedin || '');
    setEditGithub(currentUser.socials?.github || '');
    setEditInstagram(currentUser.socials?.instagram || '');
    setEditClassification(currentUser.classification || 'Senior');
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!currentUser) return;
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
          bio: editBio.trim(),
          classification: editClassification.trim(),
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
      console.error(e);
    }
    setEditOpen(false);
  };

  const handleDownloadCalendar = (evt: any) => {
    const cleanTitle = evt.title.replace(/[^a-zA-Z0-9 ]/g, "");
    const cleanDesc = (evt.description || 'Campus Event').replace(/[^a-zA-Z0-9 ]/g, "");
    const cleanLoc = (evt.location || 'Campus').replace(/[^a-zA-Z0-9 ]/g, "");
    const dateStr = (evt.date || '2026-10-03').replace(/-/g, '');
    const startTime = `${dateStr}T190000`;
    const endTime = `${dateStr}T210000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Evida//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${evt.id || 'mock'}@evida.app`,
      `DTSTAMP:${startTime}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLoc}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock Calendar Events for visual timeline render
  const MOCK_CALENDAR_EVENTS = [
    { id: 'mock-1', title: 'Graduation Cap Painting Workshop', date: '2026-10-03', time: '2:00 PM', location: 'Fine Arts Studio', coverImage: '/pexels-cottonbro-5989925.jpg', attendees: ['Michael'], description: 'Come paint your graduation cap with us! We supply all paint, glitter, and brushes.' },
    { id: 'mock-2', title: 'Fall Acoustic Sessions', date: '2026-10-12', time: '6:30 PM', location: 'Campus Amphitheater', coverImage: '/pexels-amine-1285347-9371719.jpg', attendees: [], description: 'Enjoy live acoustic performances by talented student singer-songwriters.' },
    { id: 'mock-3', title: 'Canvas & Mocktails Art Event', date: '2026-10-20', time: '4:00 PM', location: 'Student Union', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg', attendees: ['Michael'], description: 'Unwind with custom mocktails while painting on canvas with our art mentors.' },
    { id: 'mock-4', title: 'STEM Code Hackathon Kickoff', date: '2026-10-26', time: '9:00 AM', location: 'Tech Hall', coverImage: '/pexels-caleboquendo-34598092.jpg', attendees: [], description: 'Form teams, code awesome projects, and win prizes in this 24-hour hackathon.' },
    { id: 'mock-5', title: 'Club Leadership Mixer', date: '2026-10-05', time: '5:00 PM', location: 'Student Center', coverImage: '/pexels-rdne-7648057.jpg', attendees: [], description: 'Meet leaders of all registered campus clubs and organizations to collaborate.' },
    { id: 'mock-6', title: 'Varsity Soccer Tournament', date: '2026-10-15', time: '3:00 PM', location: 'Athletic Field', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg', attendees: ['Michael'], description: 'Cheer for our varsity soccer team in the seasonal opener tournament!' },
    { id: 'mock-7', title: 'Health & Wellness Seminar', date: '2026-10-22', time: '11:00 AM', location: 'Campus Gym', coverImage: '/pexels-ron-lach-8576102.jpg', attendees: [], description: 'Learn about nutritional planning, physical health, and mindfulness practices.' },
    { id: 'mock-8', title: 'Resume Review & Interview Prep', date: '2026-10-08', time: '1:00 PM', location: 'Career Center', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg', attendees: [], description: 'Get one-on-one expert feedback on your resume and practice mock interview panels.' },
    { id: 'mock-9', title: 'Developer Tools Workshop', date: '2026-10-18', time: '6:00 PM', location: 'Computer Lab 3', coverImage: '/pexels-amine-1285347-9371719.jpg', attendees: [], description: 'Get hands-on experience with command line git, docker, and remote servers.' },
    { id: 'mock-10', title: 'Classic Film Screening Night', date: '2026-10-29', time: '8:00 PM', location: 'Campus Theatre', coverImage: '/pexels-cottonbro-5989925.jpg', attendees: [], description: 'Join us for a cozy screening of classic cinema works. Free popcorn included.' }
  ];

  const allEvents = [...events, ...MOCK_CALENDAR_EVENTS];

  // Selected Day State
  const [selectedDayEvents, setSelectedDayEvents] = useState<Array<any>>([
    MOCK_CALENDAR_EVENTS[0]
  ]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('October 3, 2026');

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#D8D2BC] text-[#2A2621] font-sans pb-32">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* ── User Profile Card Section (TikTok Center Inspired) ── */}
        <div className="bg-white border border-black/[0.04] rounded-[28px] p-8 shadow-sm flex flex-col items-center text-center space-y-6">
          {/* Centered Avatar */}
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#FD5C05] flex items-center justify-center shadow-lg overflow-hidden border-4 border-[#D8D2BC]/40 shrink-0">
            {currentUser.avatar && (currentUser.avatar.startsWith('data:') || currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/')) ? (
              <img src={currentUser.avatar} className="h-full w-full object-cover" alt={currentUser.name} />
            ) : (
              <span className="text-4xl font-extrabold text-[#2A2621]">{currentUser.avatar || '🎓'}</span>
            )}
          </div>

          {/* Centered Name & Username & Edit Button */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              {currentUser.name}
            </h2>
            <p className="text-xs text-[#5A554E] font-extrabold tracking-wider uppercase">@{currentUser.username}</p>
            
            <div className="pt-2 flex justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] border-none font-bold text-xs px-6 py-1.5"
                onClick={openEdit}
              >
                Edit Profile
              </Button>
              {savedFeedback && (
                <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          </div>

          {/* Three academic info columns (Replacing Following, Followers, Likes) */}
          <div className="w-full max-w-lg grid grid-cols-3 divide-x divide-black/[0.08] text-center pt-2">
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Major</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5 truncate" title={currentUser.major || 'Computer Science'}>
                {currentUser.major || 'Computer Science'}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Classification</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5 capitalize">
                {currentUser.classification || 'Senior'}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Graduation</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5">
                {currentUser.graduationYear ? `May ${currentUser.graduationYear}` : 'May 2026'}
              </p>
            </div>
          </div>

          {/* User Bio Plain Text */}
          <div className="w-full max-w-xl text-sm text-[#5A554E] leading-relaxed font-medium px-4">
            {currentUser.bio || "Computer Science student at the School of Engineering. Passionate about building campus communities, design, and interactive software experiences."}
          </div>

          {/* Add College / Connected College Action */}
          <div className="pt-2">
            {currentUser.school ? (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-black/[0.04] rounded-2xl px-4 py-2 shadow-sm">
                <span className="h-6 w-6 rounded-lg bg-[#FD5C05] text-white flex items-center justify-center text-[10px] font-black tracking-tighter select-none shadow-sm">
                  {currentUser.school.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-extrabold uppercase text-[#2A2621] tracking-wider">
                  {currentUser.school}
                </span>
              </div>
            ) : (
              <button
                onClick={openEdit}
                className="bg-black/[0.03] hover:bg-black/[0.07] border border-black/[0.06] text-[#2A2621] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
              >
                + Add College
              </button>
            )}
          </div>
        </div>

        {/* ── Edit Profile Modal / Inline Panel ── */}
        <AnimatePresence>
          {editOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-black/[0.04] rounded-[28px] p-6 shadow-sm space-y-4"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2A2621] text-left">Edit Profile Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-[#5A554E] uppercase">Full Name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-[#5A554E] uppercase">Major / Concentration</label>
                  <input
                    value={editMajor}
                    onChange={e => setEditMajor(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-[#5A554E] uppercase">School / Institution</label>
                  <input
                    value={editSchool}
                    onChange={e => setEditSchool(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="font-extrabold text-[#5A554E] uppercase">Graduation Year</label>
                  <input
                    value={editYear}
                    onChange={e => setEditYear(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                  />
                </div>
                <div className="space-y-1 text-left sm:col-span-2">
                  <label className="font-extrabold text-[#5A554E] uppercase">Classification</label>
                  <select
                    value={editClassification}
                    onChange={e => setEditClassification(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1 text-left">
                  <label className="font-extrabold text-[#5A554E] uppercase">Biography</label>
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-[#2A2621] focus:outline-none focus:border-[#FD5C05] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 border border-black/10 hover:bg-slate-50 text-[#2A2621] text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-bold"
                  onClick={saveEdit}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Segmented Profile Tabs ── */}
        <div className="border-b border-black/[0.08] flex justify-center w-full pt-4">
          <div className="flex gap-6 sm:gap-12 md:gap-16">
            {[
              { id: 'going' as const, label: 'Going', count: attendedEvents.length, Icon: CalendarCheck },
              { id: 'saved' as const, label: 'Saved', count: savedEvents.length, Icon: BookOpen },
              { id: 'hosted' as const, label: 'Hosted', count: hostedCount, Icon: Star },
              { id: 'orgs' as const, label: 'Organizations', count: myOrgs.length, Icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-4 relative cursor-pointer group text-center flex flex-col items-center focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  <tab.Icon className={`h-4 w-4 transition-colors ${activeTab === tab.id ? 'text-[#FD5C05]' : 'text-[#2A2621]/40 group-hover:text-[#2A2621]'}`} />
                  <span className={`text-base font-black tracking-tight transition-colors ${activeTab === tab.id ? 'text-[#FD5C05]' : 'text-[#2A2621]/40 group-hover:text-[#2A2621]'}`}>
                    {tab.count}
                  </span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-1 transition-colors ${activeTab === tab.id ? 'text-[#2A2621]' : 'text-[#5A554E]/40 group-hover:text-[#5A554E]'}`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD5C05]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Dynamic Tab Panel Contents ── */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* TAB 1: GOING (Calendar + RSVP Timeline Grid) */}
              {activeTab === 'going' && (
                <div className="space-y-8">
                  {/* Campus Calendar month grid card */}
                  <div className="bg-white border border-black/[0.04] rounded-[28px] p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-black/[0.04] pb-4">
                      <div className="text-left">
                        <span className="text-[#FD5C05] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
                          <Calendar className="h-3.5 w-3.5" /> RSVP Timeline
                        </span>
                        <h3 className="font-extrabold text-[#2A2621] text-lg uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                          Campus Calendar ({calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                        </h3>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleMonthNav('prev')}
                          className="h-8 w-8 border border-black/[0.06] hover:bg-slate-50 text-black rounded-full flex items-center justify-center cursor-pointer transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMonthNav('next')}
                          className="h-8 w-8 border border-black/[0.06] hover:bg-slate-50 text-black rounded-full flex items-center justify-center cursor-pointer transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Calendar Month Grid */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] tracking-wider text-[#5A554E] uppercase">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                          {calendarDays.map((cell, idx) => {
                            const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.date) : [];
                            const isGoing = currentUser ? dayEvents.some(e => e.attendees?.includes(currentUser.name)) : false;

                            return (
                              <div 
                                key={idx}
                                onClick={() => {
                                  if (dayEvents.length > 0) {
                                    setSelectedDayEvents(dayEvents);
                                    setSelectedDateLabel(cell.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
                                  }
                                }}
                                className={`
                                  relative aspect-square border rounded-xl p-1 cursor-pointer flex flex-col justify-between transition-all duration-200 overflow-hidden
                                  ${cell.isCurrentMonth 
                                    ? 'bg-white border-black/[0.04] hover:bg-black/[0.01] hover:border-[#FD5C05]/30'
                                    : 'bg-black/[0.01] border-transparent text-[#5A554E] opacity-35'
                                  }
                                `}
                              >
                                {cell.isCurrentMonth && dayEvents.length > 0 && (
                                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 rounded-xl overflow-hidden z-0 bg-[#D8D2BC]/10">
                                    {dayEvents.slice(0, 4).map((e, index) => {
                                      const bgClass = e.coverImage.includes('from-') ? e.coverImage : '';
                                      const bgStyle = !bgClass ? { backgroundImage: `url(${e.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                                      return (
                                        <div 
                                          key={index} 
                                          className={`w-full h-full opacity-85 mix-blend-multiply bg-[#FD5C05]/10 ${bgClass}`} 
                                          style={bgStyle} 
                                        />
                                      );
                                    })}
                                  </div>
                                )}

                                <span className={`relative z-10 text-[9px] font-black px-1.5 py-0.5 rounded leading-none w-fit ${
                                  cell.isCurrentMonth && dayEvents.length > 0 
                                    ? 'text-white bg-black/60 backdrop-blur-[1px]' 
                                    : 'text-[#2A2621]'
                                }`}>
                                  {cell.day}
                                </span>

                                {cell.isCurrentMonth && isGoing && (
                                  <div className="absolute top-1 right-1 z-20 bg-white border border-[#FD5C05]/20 shadow-sm h-4 w-4 rounded-full flex items-center justify-center">
                                    <MapPin className="h-2.5 w-2.5 text-[#FD5C05] fill-[#FD5C05]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Day Inspector Panel */}
                      <div className="lg:col-span-1 border border-black/[0.04] rounded-2xl p-4 bg-slate-50/50 space-y-4">
                        <div className="border-b border-black/[0.04] pb-2 text-left">
                          <span className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Date Selection
                          </span>
                          <h4 className="font-extrabold text-[#2A2621] text-xs uppercase tracking-wider mt-0.5">
                            {selectedDateLabel}
                          </h4>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-left">
                          {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((evt, idx) => {
                              const isUserGoing = currentUser ? evt.attendees?.includes(currentUser.name) : false;
                              return (
                                <div 
                                  key={idx}
                                  className="bg-white border border-black/[0.04] rounded-xl p-3.5 shadow-sm space-y-2.5 text-left"
                                >
                                  <div className="flex items-start justify-between gap-1.5">
                                    <h5 className="font-bold text-xs text-[#2A2621] uppercase tracking-wide leading-tight">
                                      {evt.title}
                                    </h5>
                                    {isUserGoing && (
                                      <span className="text-[7px] font-black uppercase bg-[#FD5C05] text-white px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                                        Going
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-[10px] text-[#5A554E] font-medium space-y-0.5">
                                    <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {evt.time || 'All Day'}</p>
                                    <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {evt.location || 'Campus'}</p>
                                  </div>

                                  <div className="pt-2 border-t border-black/[0.04] flex items-center gap-1.5">
                                    <button
                                      className="flex-1 bg-[#2A2621] hover:bg-[#FD5C05] hover:text-[#2A2621] text-white py-1 px-2 text-[8px] font-bold uppercase rounded-lg cursor-pointer flex items-center justify-center gap-1 border-none transition-all"
                                      onClick={() => handleDownloadCalendar(evt)}
                                    >
                                      <Calendar className="h-3 w-3" /> ICS Sync
                                    </button>
                                    <Link
                                      href={`/events/${evt.id}`}
                                      className="flex-1 py-1 px-2 text-center bg-black/[0.03] hover:bg-black/[0.08] text-[#2A2621] rounded-lg text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                      View
                                    </Link>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-[10px] text-[#5A554E] italic py-8 text-center bg-white rounded-xl border border-black/[0.03]">
                              No RSVP'd activities on this day.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List of Attended Events */}
                  <div className="space-y-4 text-left">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">All Attended Events ({attendedEvents.length})</h3>
                    {attendedEvents.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {attendedEvents.map(evt => (
                          <div 
                            key={evt.id}
                            onClick={() => router.push(`/events/${evt.id}`)}
                            className="bg-white border border-black/[0.04] rounded-2xl overflow-hidden hover:border-[#FD5C05]/40 hover:scale-[1.01] transition-all cursor-pointer shadow-sm flex flex-col h-full group"
                          >
                            <div className="h-32 w-full bg-[#FD5C05]/10 shrink-0 relative">
                              {evt.coverImage.includes('from-') ? (
                                <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                              ) : (
                                <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                              )}
                              <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                                {evt.category}
                              </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <p className="font-bold text-xs text-[#2A2621] uppercase tracking-wide line-clamp-2">{evt.title}</p>
                                <p className="text-[9px] text-[#5A554E] font-medium mt-1">{evt.date} • {evt.time}</p>
                              </div>
                              <p className="text-[10px] text-[#5A554E] font-bold uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#FD5C05]" /> {evt.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                        <CalendarCheck className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                        <p className="text-xs text-[#5A554E]">You haven't RSVP'd to any events yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SAVED */}
              {activeTab === 'saved' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">Bookmarked Events ({savedEvents.length})</h3>
                  {savedEvents.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {savedEvents.map(evt => (
                        <div 
                          key={evt.id}
                          onClick={() => router.push(`/events/${evt.id}`)}
                          className="bg-white border border-black/[0.04] rounded-2xl overflow-hidden hover:border-[#FD5C05]/40 hover:scale-[1.01] transition-all cursor-pointer shadow-sm flex flex-col h-full group"
                        >
                          <div className="h-32 w-full bg-[#FD5C05]/10 shrink-0 relative">
                            {evt.coverImage.includes('from-') ? (
                              <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                            ) : (
                              <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                            )}
                            <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                              {evt.category}
                            </span>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <p className="font-bold text-xs text-[#2A2621] uppercase tracking-wide line-clamp-2">{evt.title}</p>
                              <p className="text-[9px] text-[#5A554E] font-medium mt-1">{evt.date} • {evt.time}</p>
                            </div>
                            <p className="text-[10px] text-[#5A554E] font-bold uppercase tracking-wider flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#FD5C05]" /> {evt.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                      <BookOpen className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                      <p className="text-xs text-[#5A554E]">No bookmarked events found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HOSTED */}
              {activeTab === 'hosted' && (
                <div className="space-y-8 text-left">
                  {/* Hosted Events */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">Events Hosted By You ({hostedEvents.length})</h3>
                    {hostedEvents.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {hostedEvents.map(evt => (
                          <div 
                            key={evt.id}
                            onClick={() => router.push(`/events/${evt.id}`)}
                            className="bg-white border border-black/[0.04] rounded-2xl overflow-hidden hover:border-[#FD5C05]/40 hover:scale-[1.01] transition-all cursor-pointer shadow-sm flex flex-col h-full group"
                          >
                            <div className="h-32 w-full bg-[#FD5C05]/10 shrink-0 relative">
                              {evt.coverImage.includes('from-') ? (
                                <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                              ) : (
                                <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                              )}
                              <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                                {evt.category}
                              </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <p className="font-bold text-xs text-[#2A2621] uppercase tracking-wide line-clamp-2">{evt.title}</p>
                                <p className="text-[9px] text-[#5A554E] font-medium mt-1">{evt.date} • {evt.time}</p>
                              </div>
                              <p className="text-[10px] text-[#5A554E] font-bold uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#FD5C05]" /> {evt.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                        <Star className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                        <p className="text-xs text-[#5A554E]">You haven't hosted any events yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Published Promotions */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">Promotions Published ({hostedPromos.length})</h3>
                    {hostedPromos.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {hostedPromos.map(promo => (
                          <div 
                            key={promo.id}
                            className="bg-white border border-black/[0.04] rounded-2xl p-4 shadow-sm space-y-2 relative text-left"
                          >
                            <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                              {promo.category}
                            </span>
                            <h4 className="font-bold text-sm text-[#2A2621] uppercase tracking-wide truncate w-[80%]">{promo.title}</h4>
                            <p className="text-xs text-[#5A554E] leading-relaxed line-clamp-2 font-medium">{promo.description}</p>
                            <div className="pt-2 border-t border-black/[0.04] text-[9px] text-[#5A554E] font-semibold flex justify-between">
                              <span>By {promo.organizer}</span>
                              <span>{promo.contactInfo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                        <Sparkles className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                        <p className="text-xs text-[#5A554E]">You haven't published any promotions yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MY ORGANIZATIONS */}
              {activeTab === 'orgs' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">My Campus Groups ({myOrgs.length})</h3>
                  {myOrgs.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {myOrgs.map(org => {
                        const userRole = org.memberRoles?.[currentUser.name] || 
                                         org.memberRoles?.[currentUser.username] || 
                                         (org.members[0] === currentUser.name ? 'President' : 'Member');
                        return (
                          <div 
                            key={org.id} 
                            onClick={() => router.push(`/student/organizations/${org.id}`)}
                            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-black/[0.04] shadow-sm hover:border-[#FD5C05]/40 hover:scale-[1.01] transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div 
                                className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                style={{ backgroundColor: org.logoColor || '#2A2621' }}
                              >
                                {org.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="font-bold text-[#2A2621] text-xs uppercase tracking-tight group-hover:text-[#FD5C05] transition-colors truncate">
                                  {org.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="px-1.5 py-0.5 rounded bg-black/[0.04] text-[#5A554E] text-[8px] font-bold uppercase tracking-wider">
                                    {userRole}
                                  </span>
                                  <span className="text-[9px] text-[#5A554E] font-semibold">
                                    {org.members.length} members
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase text-[#5A554E] group-hover:text-[#2A2621] transition-colors shrink-0">Manage →</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                      <Users className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                      <p className="text-xs text-[#5A554E]">Not associated with any groups.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Advisor Review Section (Visible to advisors only) ── */}
        {currentUser.role === 'admin' && (
          <div className="border-t border-black/[0.06] pt-8 mt-8 space-y-4 text-left">
            <div className="text-[11px] font-black text-[#5A554E] flex items-center gap-2 uppercase tracking-widest">
              <UserCheck className="h-4 w-4 text-[#FD5C05]" /> Pending Membership Applications Review
            </div>
            {membershipRequests.filter(r => r.status === 'pending').length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {membershipRequests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-black text-[#2A2621] uppercase tracking-widest block text-left">Join Request</span>
                      <h4 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-tight mt-1 text-left">{req.studentName}</h4>
                      <p className="text-xs text-[#5A554E] mt-0.5 text-left">Wants to join: <strong className="text-[#2A2621]">{req.orgName}</strong></p>
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
                <p className="text-xs text-[#5A554E]">No pending student membership requests.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '@/components/student/EventCard';
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
  UserCheck,
  Heart,
  Bookmark,
  Plus,
  Building2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import EvidaLogo from '@/components/ui/EvidaLogo';

const PROFILE_BANNERS = [
  '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg',
  '/pexels-yaroslav-shuraev-8513385.jpg',
  '/pexels-amine-1285347-9371719.jpg',
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
];

const PRESET_AVATARS = ['🎓', '💻', '🔬', '⚽️', '🎨', '🎵', '🌟', '📣', '🔥', '🦊', '🚀', '🧠', '💼'];

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

function StudentProfilePageContent() {
  const { currentUser, setCurrentUser, logout, activeProfile } = useUser();
  const { events, organizations, saveToggle, rsvpToggle, deleteEvent } = useEvents();
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get('username');

  const [profileUser, setProfileUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isOwner = !usernameParam || (currentUser && usernameParam === currentUser.username);

  // If in Organization profile mode, redirect /student/profile to the active organization's profile page
  useEffect(() => {
    if (isOwner && activeProfile?.type === 'organization' && activeProfile.orgId) {
      router.replace(`/student/organizations/${activeProfile.orgId}`);
    }
  }, [isOwner, activeProfile, router]);

  const allEvents = events; // Only real events from context — no mock data

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
  const [toast, setToast] = useState<{ message: string; undoId: string } | null>(null);

  const handleUnlike = (eventId: string) => {
    saveToggle(eventId);
    setToast({
      message: 'Removed from Saved',
      undoId: eventId
    });
  };

  const handleUndo = () => {
    if (toast?.undoId) {
      saveToggle(toast.undoId);
      setToast(null);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'saved') {
        setActiveTab('saved');
      } else if (tab === 'going' || tab === 'rsvp') {
        setActiveTab('going');
      } else if (tab === 'hosted') {
        setActiveTab('hosted');
      } else if (tab === 'orgs') {
        setActiveTab('orgs');
      }
    }
  }, []);

  // Calendar Date State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026

  // Promotions State
  const [promotions, setPromotions] = useState<any[]>([]);

  // Membership requests state for advisor reviews & user pending requests
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [userMembershipRequests, setUserMembershipRequests] = useState<any[]>([]);

  // Fetch all membership requests (for advisor review)
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

  // Fetch membership requests specifically submitted by profileUser
  const fetchUserMembershipRequests = async (username?: string) => {
    const targetUsername = username || profileUser?.username || currentUser?.username;
    if (!targetUsername) return;
    try {
      const res = await fetch(`/api/organizations/membership?username=${targetUsername}`);
      if (res.ok) {
        const data = await res.json();
        setUserMembershipRequests(data);
      }
    } catch (e) {
      console.error('Failed to load user membership requests:', e);
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
          username: currentUser?.username
        })
      });

      if (res.ok) {
        fetchUserMembershipRequests();
        setToast({ message: 'Join request cancelled', undoId: '' });
      }
    } catch (e) {
      console.error('Failed to cancel membership request:', e);
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
        if (isOwner) {
          setProfileUser(data);
        }
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
        fetchUserMembershipRequests();
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
    
    if (currentUser && isOwner) {
      fetchMembershipRequests();
    }
  }, [currentUser?.username, isOwner]);

  // Fetch user specific membership requests when profileUser is ready
  useEffect(() => {
    if (profileUser?.username) {
      fetchUserMembershipRequests(profileUser.username);
    }
  }, [profileUser?.username]);

  // Keep profileUser in sync with currentUser when user updates their own profile details
  useEffect(() => {
    if (isOwner && currentUser) {
      setProfileUser(currentUser);
    }
  }, [currentUser, isOwner]);

  // Load viewed user profile
  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      if (isOwner) {
        if (currentUser) {
          setProfileUser(currentUser);
          try {
            const res = await fetch(`/api/users/profile?username=${currentUser.username}`);
            if (res.ok) {
              const data = await res.json();
              setCurrentUser(data);
              setProfileUser(data);
            }
          } catch (e) {
            console.error('Failed to sync profile:', e);
          }
        }
      } else if (usernameParam) {
        try {
          const res = await fetch(`/api/users/profile?username=${usernameParam}`);
          if (res.ok) {
            const data = await res.json();
            setProfileUser(data);
          } else {
            setProfileUser(null);
          }
        } catch (e) {
          console.error('Failed to load profile:', e);
          setProfileUser(null);
        }
      }
      setLoadingProfile(false);
    };

    if (currentUser || usernameParam) {
      loadProfile();
    }
  }, [currentUser?.username, usernameParam, isOwner]);

  const attendedEvents = profileUser 
    ? events.filter(e => e.status === 'approved' && (
        e.attendees.includes(profileUser.name) || 
        (profileUser.username ? e.attendees.includes(profileUser.username) : false)
      )) 
    : [];
  const savedEvents = profileUser 
    ? events.filter(e => e.status === 'approved' && (
        e.savedBy?.includes(profileUser.name) || 
        (profileUser.username ? e.savedBy?.includes(profileUser.username) : false)
      )) 
    : [];

  // Hosted (created)
  const hostedEvents = profileUser ? events.filter(e => e.status === 'approved' && e.organizer === profileUser.name) : [];
  const hostedPromos = profileUser ? promotions.filter(p => p.contactInfo?.toLowerCase().includes(profileUser.username.toLowerCase()) || p.contactInfo?.toLowerCase().includes(profileUser.name.split(' ')[0].toLowerCase())) : [];
  const hostedCount = hostedEvents.length + hostedPromos.length;

  // Organizations
  const myOrgs = profileUser ? organizations.filter(org => (profileUser.organizations || []).includes(org.id)) : [];

  // Categorized Organizations
  const createdOrgs = useMemo(() => {
    if (!profileUser) return [];
    return myOrgs.filter(org => {
      const isCreator = org.creatorUsername && (
        org.creatorUsername.toLowerCase() === profileUser.username?.toLowerCase() ||
        org.creatorUsername.toLowerCase() === profileUser.name?.toLowerCase()
      );
      const role = org.memberRoles?.[profileUser.name] || org.memberRoles?.[profileUser.username];
      const isPresident = role === 'President' || role === 'Founder' || role === 'Creator';
      return isCreator || isPresident;
    });
  }, [myOrgs, profileUser]);

  const joinedOrgs = useMemo(() => {
    return myOrgs.filter(org => !createdOrgs.some(c => c.id === org.id));
  }, [myOrgs, createdOrgs]);

  const pendingRequests = useMemo(() => {
    return userMembershipRequests.filter(req => req.status === 'pending');
  }, [userMembershipRequests]);

  // Dynamic Visible Tabs Calculation based on Privacy & Activity
  const privacySettings = useMemo(() => {
    return {
      going: profileUser?.privacy?.going || 'public',
      saved: profileUser?.privacy?.saved || 'private',
      hosted: profileUser?.privacy?.hosted || 'public',
      organizations: profileUser?.privacy?.organizations || 'private',
    };
  }, [profileUser?.privacy]);

  const visibleTabs = useMemo(() => {
    if (!profileUser) return [];
    const tabs = [];
    
    // Attended
    if (isOwner || privacySettings.going === 'public') {
      tabs.push({ id: 'going' as const, label: 'Attended' });
    }
    // Saved
    if (isOwner || privacySettings.saved === 'public') {
      tabs.push({ id: 'saved' as const, label: 'Saved' });
    }
    // Hosted (only if hostedCount > 0)
    if (hostedCount > 0) {
      if (isOwner || privacySettings.hosted === 'public') {
        tabs.push({ id: 'hosted' as const, label: 'Hosted' });
      }
    }
    // Organizations (if has orgs or pending requests or is owner)
    if (myOrgs.length > 0 || pendingRequests.length > 0 || isOwner) {
      if (isOwner || privacySettings.organizations === 'public') {
        tabs.push({ id: 'orgs' as const, label: 'Organizations' });
      }
    }
    
    return tabs;
  }, [profileUser, isOwner, privacySettings.going, privacySettings.saved, privacySettings.hosted, privacySettings.organizations, hostedCount, myOrgs.length, pendingRequests.length]);

  // Adjust active tab if it's no longer visible
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

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
    return allEvents.filter(e => e.date === dateString && profileUser && (
      e.attendees?.includes(profileUser.name) ||
      e.attendees?.includes(profileUser.username) ||
      (profileUser.name.startsWith('Michael') && e.attendees?.includes('Michael'))
    ));
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
    if (!currentUser || !isOwner) return;
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
    if (!currentUser || !isOwner) return;
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
    if (currentUser && !evt.attendees?.includes(currentUser.name)) {
      rsvpToggle(evt.id, 'rsvp');
    }
  };

  // Selected Day State
  const [selectedDayEvents, setSelectedDayEvents] = useState<Array<any>>([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('Select a day');

  useEffect(() => {
    const userGoingEvents = allEvents.filter(e => profileUser && (
      e.attendees?.includes(profileUser.name) ||
      e.attendees?.includes(profileUser.username) ||
      (profileUser.name.startsWith('Michael') && e.attendees?.includes('Michael'))
    ));
    if (userGoingEvents.length > 0) {
      const firstEvt = userGoingEvents[0];
      const dateParts = firstEvt.date.split('-');
      const evtDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      const sameDayEvents = userGoingEvents.filter(e => e.date === firstEvt.date);
      setSelectedDayEvents(sameDayEvents);
      setSelectedDateLabel(evtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    } else {
      setSelectedDayEvents([]);
      setSelectedDateLabel('Select a day');
    }
  }, [profileUser, events]);

  if (!currentUser) return null;

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#D8D2BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD5C05]"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#D8D2BC] flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold text-[#2A2621] uppercase">User Profile Not Found</h2>
        <p className="text-xs text-[#5A554E] mt-1">The profile you are trying to view does not exist.</p>
        <Link href="/student/dashboard" className="mt-4 text-xs font-bold text-[#FD5C05] hover:underline uppercase">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#2A2621] font-sans pb-32">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* ── User Profile Card Section (TikTok Center Inspired) ── */}
        <div className="bg-white border border-black/[0.04] rounded-[28px] p-8 shadow-sm flex flex-col items-center text-center space-y-6">
          {/* Centered Avatar */}
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#FD5C05] flex items-center justify-center shadow-lg overflow-hidden border-4 border-[#D8D2BC]/40 shrink-0">
            {profileUser.avatar && (profileUser.avatar.startsWith('data:') || profileUser.avatar.startsWith('http') || profileUser.avatar.startsWith('/')) ? (
              <img src={profileUser.avatar} className="h-full w-full object-cover" alt={profileUser.name} />
            ) : (
              <span className="text-4xl font-extrabold text-[#2A2621]">{profileUser.avatar || '🎓'}</span>
            )}
          </div>

          {/* Centered Name & Username & Edit Button */}
          <div className="space-y-2">
            <h2 className="font-black tracking-tight text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              {profileUser.name}
            </h2>
            <p className="text-xs text-[#5A554E] font-extrabold tracking-wider uppercase">@{profileUser.username}</p>
            
            {isOwner && (
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
            )}
          </div>

          {/* Three academic info columns (Replacing Following, Followers, Likes) */}
          <div className="w-full max-w-lg grid grid-cols-3 divide-x divide-black/[0.08] text-center pt-2">
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Major</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5 truncate" title={profileUser.major || 'Computer Science'}>
                {profileUser.major || 'Computer Science'}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Classification</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5 capitalize">
                {profileUser.classification || 'Senior'}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest">Graduation</p>
              <p className="text-xs font-bold text-[#2A2621] mt-1.5">
                {profileUser.graduationYear ? `May ${profileUser.graduationYear}` : 'May 2026'}
              </p>
            </div>
          </div>

          {/* User Bio Plain Text */}
          <div className="w-full max-w-xl text-sm text-[#5A554E] leading-relaxed font-medium px-4">
            {profileUser.bio || "Computer Science student at Livingstone College. Passionate about building campus communities, design, and interactive software experiences."}
          </div>

          {/* Add College / Connected College Action */}
          <div className="pt-2">
            {profileUser.school ? (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-black/[0.04] rounded-2xl px-4 py-2 shadow-sm">
                <span className="h-6 w-6 rounded-lg bg-[#08080C] border border-white/[0.08] flex items-center justify-center select-none shadow-sm shrink-0 p-1">
                  <EvidaLogo size={14} showText={false} />
                </span>
                <span className="text-xs font-extrabold uppercase text-[#2A2621] tracking-wider">
                  {profileUser.school}
                </span>
              </div>
            ) : (
              isOwner && (
                <button
                  onClick={openEdit}
                  className="bg-black/[0.03] hover:bg-black/[0.07] border border-black/[0.06] text-[#2A2621] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                >
                  + Add College
                </button>
              )
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
                {/* Avatar Picker Section */}
                <div className="sm:col-span-2 space-y-2 text-left border-b border-black/[0.04] pb-4">
                  <label className="font-extrabold text-[#5A554E] uppercase block mb-1">Profile Picture</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Preview circle */}
                    <div className="h-20 w-20 rounded-full bg-[#FD5C05] flex items-center justify-center shadow-md overflow-hidden border-2 border-black/[0.08] shrink-0 relative group">
                      {editAvatar && (editAvatar.startsWith('data:') || editAvatar.startsWith('http') || editAvatar.startsWith('/')) ? (
                        <img src={editAvatar} className="h-full w-full object-cover" alt="Preview" />
                      ) : (
                        <span className="text-3xl font-extrabold text-[#2A2621]">{editAvatar || '🎓'}</span>
                      )}
                    </div>
                    
                    {/* Inputs */}
                    <div className="space-y-3 flex-1 w-full">
                      {/* Presets List */}
                      <div>
                        <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wider mb-1.5">Choose Preset Emoji</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_AVATARS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setEditAvatar(emoji)}
                              className={`h-8 w-8 rounded-xl bg-black/[0.03] hover:bg-black/[0.08] border flex items-center justify-center text-lg transition-all cursor-pointer ${editAvatar === emoji ? 'border-[#FD5C05] bg-[#FD5C05]/10 scale-105' : 'border-black/[0.06]'}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* URL / File Input */}
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wider mb-1">Or Paste Image URL</p>
                          <input
                            type="text"
                            placeholder="https://example.com/avatar.jpg"
                            value={editAvatar.startsWith('data:') || editAvatar.includes('http') || editAvatar.startsWith('/') ? editAvatar : ''}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-1.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wider mb-1">Or Upload Image</p>
                          <label className="flex items-center justify-center px-4 py-1.5 border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.08] rounded-xl cursor-pointer transition-all text-xs font-bold uppercase tracking-wider text-[#2A2621] h-[34px]">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      setEditAvatar(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-4 relative cursor-pointer group text-center focus:outline-none"
              >
                <span className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-[#FD5C05]' : 'text-[#5A554E]/60 group-hover:text-[#2A2621]'}`}>
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
              {/* TAB 1: GOING (Event Cards Grid) */}
              {activeTab === 'going' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">
                    {isOwner ? "Attended Events" : `${profileUser.name}'s Attended Events`} ({attendedEvents.length})
                  </h3>
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
                            <span className="absolute top-2 left-2 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                              {evt.category}
                            </span>

                            {currentUser && (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  saveToggle(evt.id);
                                }}
                                className="absolute top-1.5 right-1.5 z-20 cursor-pointer focus:outline-none p-1 group"
                                title={evt.savedBy?.includes(currentUser.name) ? "Unsave Event" : "Save Event"}
                              >
                                <Bookmark 
                                  className={`h-4.5 w-4.5 transition-all duration-150 ease-in-out ${
                                    evt.savedBy?.includes(currentUser.name) 
                                      ? 'fill-[#FD5C05] text-[#FD5C05]' 
                                      : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                                  }`} 
                                />
                              </button>
                            )}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div onClick={() => router.push(`/events/${evt.id}`)}>
                              <p className="font-bold text-xs text-[#2A2621] uppercase tracking-wide line-clamp-2">{evt.title}</p>
                              <p className="text-[9px] text-[#5A554E] font-medium mt-1">{evt.date} • {evt.time}</p>
                            </div>
                            <p className="text-[10px] text-[#5A554E] font-bold uppercase tracking-wider flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#FD5C05]" /> {evt.location}
                            </p>
                            {isOwner && (
                              (new Date(evt.date + 'T23:59:59') < new Date()) ? (
                                <span className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200 text-center block">
                                  Attended ✓
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    rsvpToggle(evt.id, 'rsvp');
                                    setToast({ message: 'RSVP cancelled', undoId: evt.id });
                                  }}
                                  className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl border border-red-200 transition-all cursor-pointer"
                                >
                                  Cancel RSVP
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                      <CalendarCheck className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                      <p className="text-xs text-[#5A554E]">
                        {isOwner ? "You haven't RSVP'd to any events yet." : `${profileUser.name} hasn't RSVP'd to any events yet.`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SAVED */}
              {activeTab === 'saved' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">
                    {isOwner ? "Saved Events" : `${profileUser.name}'s Saved Events`} ({savedEvents.length})
                  </h3>
                  {savedEvents.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <AnimatePresence mode="popLayout">
                        {savedEvents.map(evt => (
                          <motion.div
                            key={evt.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                          >
                            <EventCard 
                              event={evt}
                              onClick={() => router.push(`/events/${evt.id}`)}
                              isSaved={true}
                              onSave={(e) => {
                                e.stopPropagation();
                                handleUnlike(evt.id);
                              }}
                            />
                            {isOwner && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleUnlike(evt.id);
                                }}
                                className="w-full py-2 text-[9.5px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/70 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <X className="h-3.5 w-3.5 text-rose-600" />
                                Remove from Saved
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                      <Bookmark className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                      <p className="text-xs text-[#5A554E]">
                        {isOwner ? "No saved events found." : "No public saved events found."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HOSTED */}
              {activeTab === 'hosted' && (
                <div className="space-y-8 text-left">
                  {/* Hosted Events */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">
                      {isOwner ? "Events Hosted By You" : `Events Hosted By ${profileUser.name}`} ({hostedEvents.length})
                    </h3>
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
                              {isOwner && (
                                <div className="flex gap-2 pt-1">
                                  {evt.status === 'pending' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); router.push(`/student/create?editId=${evt.id}`); }}
                                      className="flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider bg-black/[0.04] hover:bg-[#FD5C05]/10 hover:text-[#FD5C05] text-[#2A2621] rounded-xl border border-transparent transition-all cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      await deleteEvent(evt.id);
                                      setToast({ message: 'Event deleted', undoId: '' });
                                    }}
                                    className="flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl border border-red-200 transition-all cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 border border-black/[0.04] text-center">
                        <Star className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                        <p className="text-xs text-[#5A554E]">
                          {isOwner ? "You haven't hosted any events yet." : `${profileUser.name} hasn't hosted any events yet.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Published Promotions */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">
                      {isOwner ? "Promotions Published By You" : `Promotions Published By ${profileUser.name}`} ({hostedPromos.length})
                    </h3>
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
                        <p className="text-xs text-[#5A554E]">
                          {isOwner ? "You haven't published any promotions yet." : `${profileUser.name} hasn't published any promotions yet.`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MY ORGANIZATIONS */}
              {activeTab === 'orgs' && (
                <div className="space-y-8 text-left">
                  
                  {/* Section 1: Created Organizations */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621] flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#FD5C05]" />
                        {isOwner ? "Organizations Created By You" : `Organizations Created By ${profileUser.name}`} ({createdOrgs.length})
                      </h3>
                      {isOwner && (
                        <button
                          onClick={() => router.push('/student/organizations/create')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FD5C05]/10 hover:bg-[#FD5C05]/20 text-[#FD5C05] text-[10px] font-extrabold uppercase rounded-xl transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Create Group
                        </button>
                      )}
                    </div>

                    {createdOrgs.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {createdOrgs.map(org => {
                          const userRole = org.memberRoles?.[profileUser.name] || 
                                           org.memberRoles?.[profileUser.username] || 'President';
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
                                    <span className="px-1.5 py-0.5 rounded bg-[#FD5C05]/10 text-[#FD5C05] text-[8px] font-extrabold uppercase tracking-wider border border-[#FD5C05]/20">
                                      {userRole}
                                    </span>
                                    <span className="text-[9px] text-[#5A554E] font-semibold">
                                      {org.members.length} members
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isOwner && <span className="text-[9px] font-black uppercase text-[#5A554E] group-hover:text-[#2A2621] transition-colors shrink-0">Manage →</span>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-6 border border-black/[0.04] text-center">
                        <p className="text-xs text-[#5A554E]">
                          {isOwner ? "You haven't created any organizations yet." : `${profileUser.name} hasn't created any organizations.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Joined Organizations */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621] flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#FD5C05]" />
                      {isOwner ? "Joined Organizations" : `Organizations ${profileUser.name} Joined`} ({joinedOrgs.length})
                    </h3>

                    {joinedOrgs.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {joinedOrgs.map(org => {
                          const userRole = org.memberRoles?.[profileUser.name] || 
                                           org.memberRoles?.[profileUser.username] || 'Member';
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
                              <span className="text-[9px] font-black uppercase text-[#5A554E] group-hover:text-[#2A2621] transition-colors shrink-0">View →</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-6 border border-black/[0.04] text-center">
                        <p className="text-xs text-[#5A554E]">
                          {isOwner ? "You haven't joined any other organizations yet." : `${profileUser.name} hasn't joined any other organizations.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Pending Membership Requests */}
                  {isOwner && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621] flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#FD5C05]" />
                        Pending Join Requests ({pendingRequests.length})
                      </h3>

                      {pendingRequests.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {pendingRequests.map(req => (
                            <div 
                              key={req.id} 
                              className="bg-white rounded-2xl p-4 flex items-center justify-between border border-amber-200/60 bg-amber-50/20 shadow-sm"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 border border-amber-300/40">
                                  <Clock className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 text-left">
                                  <p className="font-bold text-[#2A2621] text-xs uppercase tracking-tight truncate">
                                    {req.orgName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[8px] font-extrabold uppercase tracking-wider border border-amber-200">
                                      Pending Approval
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleCancelRequest(req.id)}
                                className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200/70 transition-all cursor-pointer shrink-0 ml-2"
                              >
                                Cancel
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl p-6 border border-black/[0.04] text-center">
                          <p className="text-xs text-[#5A554E]">No pending join requests.</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Advisor Review Section (Visible to advisors only) ── */}
        {isOwner && currentUser.role === 'admin' && (
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

      {/* Undo Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex items-center justify-between gap-6 px-5 py-3.5 rounded-2xl bg-[#2A2621] text-white shadow-2xl text-xs font-semibold w-80 font-sans"
          >
            <span>{toast.message}</span>
            <button
              onClick={handleUndo}
              className="text-[#FD5C05] font-black uppercase tracking-wider hover:underline cursor-pointer border-none bg-transparent"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#D8D2BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD5C05]"></div>
      </div>
    }>
      <StudentProfilePageContent />
    </Suspense>
  );
}

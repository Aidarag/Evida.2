'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Compass,
  Trophy,
  Wine,
  Cpu,
  Bookmark,
  X,
  Search,
  Briefcase,
  GraduationCap,
  Users,
  Utensils,
  Sparkles,
  Mail,
  Shield,
  Camera,
  Tag,
  Home,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import EventCard from '@/components/student/EventCard';
import { Event, Promotion } from '@/lib/types';
import EvidaLogo from '@/components/ui/EvidaLogo';

const EvidaLogoIcon = ({ className = 'h-3 w-3' }: { className?: string }) => {
  return (
    <span className={`${className} flex items-center justify-center shrink-0`}>
      <EvidaLogo size={12} showText={false} />
    </span>
  );
};

export default function StudentDashboardPage() {
  const { currentUser, activeProfile, setActiveProfile } = useUser();
  const { events, promotions, organizations, notifications, saveToggle, rsvpToggle } = useEvents();
  const router = useRouter();

  const [activeFeed, setActiveFeed] = useState<'official' | 'student'>('official');
  const [orgDashboardTab, setOrgDashboardTab] = useState<'org-events' | 'campus-feed'>('org-events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // ── Onboarding Preview States & Effects ──
  const [isPreview, setIsPreview] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isPreviewMode = urlParams.get('preview') === 'true' || sessionStorage.getItem('evida_preview') === 'true';
      setIsPreview(isPreviewMode);
      if (isPreviewMode) {
        const saved = sessionStorage.getItem('evida_onboarding_step');
        const initialStep = saved ? parseInt(saved, 10) : 0;
        setOnboardingStep(initialStep);
        if (initialStep >= 1) {
          setHasScrolled(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isPreview) return;
    
    const handleReset = () => {
      setOnboardingStep(0);
      setHasScrolled(false);
      setScrollLocked(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_onboarding_step', '0');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    window.addEventListener('evida_reset_onboarding', handleReset);
    return () => {
      window.removeEventListener('evida_reset_onboarding', handleReset);
    };
  }, [isPreview]);

  useEffect(() => {
    if (!isPreview || onboardingStep !== 0) return;

    const handleScroll = () => {
      const card = document.getElementById('event-card-evt-career-night');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      
      if (window.scrollY > 20) {
        setHasScrolled(true);
      }

      if (rect.top <= window.innerHeight * 0.65) {
        setOnboardingStep(1);
        sessionStorage.setItem('evida_onboarding_step', '1');
        window.parent.postMessage({ type: 'EVIDA_TOUR_STEP_UPDATE', step: 1 }, '*');
        setScrollLocked(true);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPreview, onboardingStep]);

  useEffect(() => {
    if (isPreview && scrollLocked) {
      document.body.style.overflow = 'hidden';
      const preventDefault = (e: any) => e.preventDefault();
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isPreview, scrollLocked]);



  const FALLBACK_PHOTOS = [
    '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg',
    '/pexels-yaroslav-shuraev-8513385.jpg',
    '/pexels-amine-1285347-9371719.jpg',
    '/pexels-cottonbro-5989925.jpg',
    '/pexels-gu-ko-2150570603-31827067.jpg',
    '/pexels-caleboquendo-34598092.jpg',
    '/pexels-rdne-7648057.jpg',
    '/pexels-tima-miroshnichenko-5439368.jpg',
    '/pexels-marwen-larafa-2159807713-37714941.jpg',
    '/pexels-ron-lach-8576102.jpg',
  ];

  const getEventImg = (coverImage: string | undefined, seed: string) => {
    if (!coverImage || coverImage.includes('from-') || coverImage.includes('to-') || coverImage.includes('via-')) {
      const idx = (seed?.charCodeAt(0) || 0) % FALLBACK_PHOTOS.length;
      return FALLBACK_PHOTOS[idx];
    }
    return coverImage;
  };

  const approvedEvents = events.filter(e => e.status === 'approved');
  const unreadNotifs = notifications.filter(n => !n.read);
  
  // Base list of rsvp and saved events for stats cards
  const rsvpEventsList = approvedEvents.filter(e => currentUser ? e.attendees.includes(currentUser.name) && (e.ownershipType === 'school' || e.ownershipType === 'organization') : false);
  const savedEventsList = approvedEvents.filter(e => currentUser ? (e.savedBy?.includes(currentUser.name) || (currentUser.username ? e.savedBy?.includes(currentUser.username) : false)) && (e.ownershipType === 'school' || e.ownershipType === 'organization') : false);
  const isOrgMode = activeProfile.type === 'organization';
  const activeOrg = isOrgMode ? organizations.find(o => o.id === activeProfile.orgId) : null;
  const activeOrgName = isOrgMode ? (activeOrg ? activeOrg.name : activeProfile.name) : '';
  const myOrgEvents = isOrgMode ? events.filter(e => e.organizationId === activeProfile.orgId || e.organizationName === activeOrgName) : [];

  const matchesCategory = useCallback((item: Event | Promotion) => {
    if (selectedCategory === 'All') return true;
    const cat = item.category?.toLowerCase() || '';
    const title = item.title.toLowerCase();
    const sel = selectedCategory.toLowerCase();
    const isPromo = !('ownershipType' in item);

    if (isOrgMode) {
      if (sel === 'academic') return cat.includes('academ') || title.includes('stem') || title.includes('expo') || title.includes('study') || title.includes('calculus');
      if (sel === 'social') return cat.includes('social') || cat.includes('party') || title.includes('social') || title.includes('welcome') || title.includes('rally');
      if (sel === 'sports') return cat.includes('sport') || cat.includes('athlet') || title.includes('opener') || title.includes('game');
      if (sel === 'career') return cat.includes('career') || cat.includes('job') || title.includes('fair') || title.includes('career');
      if (sel === 'culture') return cat.includes('culture') || cat.includes('art') || title.includes('show') || title.includes('yard');
      if (sel === 'workshops') return cat.includes('workshop') || title.includes('workshop');
      if (sel === 'parties') return cat.includes('party') || title.includes('rave');
      return cat.includes(sel) || title.includes(sel);
    }

    if (activeFeed === 'official') {
      if (sel === 'livingstone college') {
        return !isPromo && item.ownershipType === 'school';
      }
      if (sel === 'clubs & organizations') {
        return !isPromo && item.ownershipType === 'organization';
      }
      if (sel === 'athletics') {
        return cat.includes('sport') || cat.includes('athlet') || cat.includes('gym');
      }
      if (sel === 'student government') {
        return cat.includes('gov') || cat.includes('senate') || title.includes('senate') || title.includes('government');
      }
      if (sel === 'career center') {
        return cat.includes('career') || cat.includes('job') || cat.includes('fair') || title.includes('career');
      }
      if (sel === 'workshops') {
        return cat.includes('workshop') || cat.includes('class') || cat.includes('learn');
      }
      if (sel === 'official conferences') {
        return cat.includes('conference') || cat.includes('summit') || cat.includes('academic') || title.includes('conference');
      }
      return true;
    } else {
      // Student Feed (For You Page Categories)
      if (sel === 'food') {
        return cat.includes('food') || cat.includes('bake') || cat.includes('bbq') || title.includes('food') || title.includes('cookout') || title.includes('cookie') || title.includes('bake') || title.includes('dining');
      }
      if (sel === 'hair/braiding services') {
        return cat.includes('beauty') || cat.includes('hair') || title.includes('hair') || title.includes('braid') || title.includes('style');
      }
      if (sel === 'sales') {
        return cat.includes('sale') || cat.includes('market') || cat.includes('clothing') || title.includes('sale') || title.includes('cloth') || title.includes('shirt') || title.includes('shop');
      }
      if (sel === 'tutoring') {
        return cat.includes('tutor') || cat.includes('teach') || cat.includes('class') || cat.includes('academic') || title.includes('tutor') || title.includes('study');
      }
      if (sel === 'community events') {
        return cat.includes('community') || cat.includes('initiative') || cat.includes('volunteer') || title.includes('community') || title.includes('charity');
      }
      if (sel === 'parties') {
        return cat.includes('party') || cat.includes('social') || title.includes('party') || title.includes('rave');
      }
      return true;
    }
  }, [activeFeed, isOrgMode, selectedCategory]);

  const feedItems = useMemo(() => {
    if (activeFeed === 'official') {
      return events.filter(e => 
        e.status === 'approved' && 
        (e.ownershipType === 'school' || e.ownershipType === 'organization')
      );
    } else {
      // Combined student events and promotions
      const studentEvents = events.filter(e => 
        e.status === 'approved' && 
        e.ownershipType === 'student'
      );
      return [...studentEvents, ...promotions];
    }
  }, [events, promotions, activeFeed]);

  // ── Unified Search Matching ──
  const normalizeWord = useCallback((w: string) => {
    w = w.toLowerCase();
    if (w.startsWith('photograph')) return 'photo';
    if (w.startsWith('photo')) return 'photo';
    if (w.startsWith('tutor')) return 'tutor';
    if (w.startsWith('grad')) return 'grad';
    if (w.startsWith('academic')) return 'academ';
    if (w.startsWith('workshop')) return 'workshop';
    return w;
  }, []);

  const matchQuery = useCallback((textFields: (string | undefined)[], query: string) => {
    if (!query) return true;
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean).map(normalizeWord);
    if (queryTerms.length === 0) return true;
    
    const normalizedText = textFields
      .map(f => (f || '').toLowerCase().split(/\s+/).filter(Boolean).map(normalizeWord).join(' '))
      .join(' ');

    return queryTerms.every(term => normalizedText.includes(term));
  }, [normalizeWord]);

  const filteredItems = useMemo(() => {
    return feedItems.filter(item => {
      const matchesSearch = matchQuery([
        item.title,
        item.description,
        'location' in item ? item.location : '',
        item.organizer,
        item.category
      ], searchQuery);

      return matchesSearch && matchesCategory(item);
    });
  }, [feedItems, searchQuery, matchQuery, matchesCategory]);

  const filteredOrgEvents = useMemo(() => {
    if (!isOrgMode) return [];
    return myOrgEvents.filter(e => {
      const matchesSearch = matchQuery([e.title, e.description, e.location, e.category], searchQuery);
      if (!matchesSearch) return false;
      return matchesCategory(e);
    });
  }, [isOrgMode, myOrgEvents, searchQuery, matchQuery, matchesCategory]);

  const sortedFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // 1. Featured pins at top
      const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
      const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;

      // 2. Default sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredItems]);

  const matchedOrgs = useMemo(() => {
    return searchQuery.trim() !== ''
      ? organizations.filter(org => matchQuery([org.name, org.description], searchQuery))
      : [];
  }, [organizations, searchQuery, matchQuery]);

  const officialCategories = [
    { name: 'All', icon: Compass },
    { name: 'Livingstone College', icon: EvidaLogoIcon },
    { name: 'Clubs & Organizations', icon: Users },
    { name: 'Athletics', icon: Trophy },
    { name: 'Student Government', icon: Shield },
    { name: 'Career Center', icon: Briefcase },
    { name: 'Workshops', icon: Cpu },
    { name: 'Official Conferences', icon: Calendar },
  ];

  const studentCategories = [
    { name: 'All', icon: Compass },
    { name: 'Food', icon: Utensils },
    { name: 'Hair/braiding services', icon: Sparkles },
    { name: 'Sales', icon: Tag },
    { name: 'Tutoring', icon: GraduationCap },
    { name: 'Community events', icon: Users },
    { name: 'Parties', icon: Wine },
  ];

  const orgCategories = [
    { name: 'All', icon: Compass },
    { name: 'Academic', icon: GraduationCap },
    { name: 'Social', icon: Users },
    { name: 'Sports', icon: Trophy },
    { name: 'Career', icon: Briefcase },
    { name: 'Culture', icon: Sparkles },
    { name: 'Workshops', icon: Cpu },
    { name: 'Parties', icon: Wine },
  ];

  const currentCategories = isOrgMode
    ? orgCategories
    : (activeFeed === 'official' ? officialCategories : studentCategories);

  // ── Actions ──
  const handleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  // Generate a fake organizer initial from the event organizer name
  const getOrgInitial = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-28 md:pb-12 space-y-4">

      {/* ── Organization Mode Banner Header ── */}
      {isOrgMode && (
        <div className="bg-white rounded-3xl border border-[#FD5C05]/20 p-5 md:p-6 shadow-sm text-left space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-12 w-12 rounded-2xl bg-[#FD5C05] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                {activeOrgName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FD5C05]/10 text-[#FD5C05] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#FD5C05]/20 shrink-0">
                    Active Organization Profile
                  </span>
                  {activeOrg?.verified && <VerifiedBadge className="h-4 w-4 shrink-0" />}
                </div>
                <h1 className="text-xl md:text-2xl font-black text-[#2A2621] uppercase tracking-tight mt-1 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {activeOrgName}
                </h1>
                <p className="text-xs text-[#5A554E] font-medium">Managed as officer by {currentUser.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => router.push('/student/create')}
                className="px-4 py-2 bg-[#FD5C05] hover:bg-[#CC3D00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 border-none cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Event
              </button>
              {activeOrg && (
                <button
                  onClick={() => router.push(`/student/organizations/${activeOrg.id}`)}
                  className="px-4 py-2 bg-[#2A2621] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 border-none cursor-pointer"
                >
                  <Home className="h-3.5 w-3.5" /> Org Page
                </button>
              )}
              <button
                onClick={() => setActiveProfile({ type: 'student' })}
                className="px-3 py-2 bg-black/[0.04] hover:bg-black/10 text-[#2A2621] text-xs font-bold uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer"
                title="Switch back to Student Personal Profile"
              >
                Switch to Personal
              </button>
            </div>
          </div>

          {/* Org Workspace Tabs Toggle */}
          <div className="flex items-center gap-2 border-t border-black/[0.05] pt-3 text-xs font-bold">
            <button
              onClick={() => setOrgDashboardTab('org-events')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                orgDashboardTab === 'org-events'
                  ? 'bg-[#FD5C05]/10 text-[#FD5C05] font-black'
                  : 'text-[#5A554E] hover:bg-black/[0.04]'
              }`}
            >
              {activeOrgName} Events ({myOrgEvents.length})
            </button>
            <button
              onClick={() => setOrgDashboardTab('campus-feed')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                orgDashboardTab === 'campus-feed'
                  ? 'bg-[#FD5C05]/10 text-[#FD5C05] font-black'
                  : 'text-[#5A554E] hover:bg-black/[0.04]'
              }`}
            >
              Campus Feed Preview
            </button>
          </div>
        </div>
      )}

      {/* ── Student Personal Welcome Header ── */}
      {!isOrgMode && (
        <div className="border-b border-black/[0.04] pb-4 space-y-3.5 text-left">
          <div>
            <h1 className="font-black text-2xl md:text-3xl text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Yo {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-[#5A554E] font-semibold mt-1">
              What's happening on campus today?
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A554E] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events, organizations, or services…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-black/[0.06] text-xs text-[#2A2621] placeholder-[#5A554E]/60 focus:outline-none focus:border-[#FD5C05]/40 shadow-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-black/[0.06] flex items-center justify-center hover:bg-black/10 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-[#5A554E]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Segmented Feed Toggle & Filter Controls ── */}
      <div className="bg-white/40 border border-black/[0.03] rounded-2xl p-3 space-y-2.5 shadow-sm">
        <div className="relative w-full rounded-full border border-black/[0.05] bg-black/[0.03] p-1 flex shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveFeed('official');
              setSelectedCategory('All');
            }}
            className="relative flex-1 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center justify-center"
          >
            {activeFeed === 'official' && (
              <motion.div
                layoutId="activeFeedBg"
                className="absolute inset-0 bg-[#FD5C05] rounded-full z-0 border border-[#FD5C05]/30 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-300 ${activeFeed === 'official' ? 'text-white font-black' : 'text-[#5A554E]'}`}>
              Livingstone College
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFeed('student');
              setSelectedCategory('All');
            }}
            className="relative flex-1 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center justify-center"
          >
            {activeFeed === 'student' && (
              <motion.div
                layoutId="activeFeedBg"
                className="absolute inset-0 bg-[#FD5C05] rounded-full z-0 border border-[#FD5C05]/30 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-300 ${activeFeed === 'student' ? 'text-white font-black' : 'text-[#5A554E]'}`}>
              For You
            </span>
          </button>
        </div>

        {/* Categories pill row + Clear Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {currentCategories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center justify-center shrink-0 px-4 py-2 rounded-full text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${isActive
                  ? 'bg-[#FD5C05] text-white font-black shadow-sm'
                  : 'bg-white border border-black/[0.06] text-[#5A554E] hover:bg-white hover:text-[#2A2621]'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-black/[0.06] text-[#5A554E] hover:bg-black/10 cursor-pointer"
            >
              <X className="h-2.5 w-2.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Main Dashboard Layout ── */}
      <div className="max-w-5xl mx-auto space-y-5">
          <div className="text-left space-y-1">
            <h2 className="font-black tracking-tight text-[#2A2621] flex items-center gap-1.5 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              {isOrgMode && orgDashboardTab === 'org-events'
                ? `${activeOrgName} Experiences`
                : (activeFeed === 'official' ? 'Livingstone College' : 'For You')
              }
            </h2>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider">
              {isOrgMode && orgDashboardTab === 'org-events'
                ? `Experiences created and hosted by ${activeOrgName}.`
                : (activeFeed === 'official' 
                  ? 'Official school and organization events.' 
                  : 'Student-created promotions and community activities.')
              }
            </p>
            <span className="text-[10px] font-extrabold text-[#5A554E] block pt-1">
              Showing {(isOrgMode && orgDashboardTab === 'org-events' ? filteredOrgEvents : sortedFilteredItems).length} events
            </span>
          </div>

          {(isOrgMode && orgDashboardTab === 'org-events' ? filteredOrgEvents : sortedFilteredItems).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(isOrgMode && orgDashboardTab === 'org-events' ? filteredOrgEvents : sortedFilteredItems).map((item) => {
                const isPromo = !('ownershipType' in item);
                const event = isPromo ? null : (item as any);
                const promo = isPromo ? (item as any) : null;

                const isLiked = !isPromo && event ? likedEvents.has(event.id) : false;
                const isSaved = currentUser ? (item.savedBy?.includes(currentUser.name) || (currentUser.username ? item.savedBy?.includes(currentUser.username) : false)) : false;

                const day = item.date.split('-')[2] || '10';
                const month = item.date.split('-')[1] || '10';
                const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[parseInt(month)] || 'Oct';

                const coverImgUrl = isPromo ? (promo?.image || '') : (event?.coverImage || '');

                const cardId = item.id === 'evt-career-night' ? 'event-card-evt-career-night' : `event-card-${item.id}`;
                return (
                  <EventCard
                    key={item.id}
                    event={item}
                    onClick={() => {
                      if (isPromo && promo) {
                        window.location.href = `mailto:${promo.contactInfo}?subject=Inquiry regarding: ${promo.title}`;
                      } else if (event) {
                        router.push(`/events/${event.id}`);
                      }
                    }}
                    className="w-full sm:w-full"
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full text-center py-20 bg-white rounded-3xl border border-black/[0.04] text-sm text-[#5A554E] font-light shadow-sm">
              {activeFeed === 'official' 
                ? 'No official school or organization events discovered matching filters.' 
                : 'No student activities or services discovered matching filters.'
              }
            </div>
          )}
      </div>

      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2A2621] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xl"
          >
            Link copied! 🔗
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Fallback icon
function GraduationCapIcon({ className }: { className?: string }) {
  return <span className={`font-bold ${className}`}>[Grad]</span>;
}

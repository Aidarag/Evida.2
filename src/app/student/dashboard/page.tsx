'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Home
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Event, Promotion } from '@/lib/types';

export default function StudentDashboardPage() {
  const { currentUser } = useUser();
  const { events, organizations, notifications, saveToggle, rsvpToggle } = useEvents();
  const router = useRouter();

  const [activeFeed, setActiveFeed] = useState<'official' | 'student'>('official');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          // Only show approved promotions
          setPromotions(data.filter((p: Promotion) => p.status === 'approved') || []);
        }
      } catch (e) {
        console.error('Failed to fetch promotions', e);
      }
    };
    fetchPromotions();
  }, []);

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

  if (!currentUser) return null;

  const approvedEvents = events.filter(e => e.status === 'approved');
  const unreadNotifs = notifications.filter(n => !n.read);
  
  // Base list of rsvp and saved events for stats cards
  const rsvpEventsList = approvedEvents.filter(e => e.attendees.includes(currentUser.name) && (e.ownershipType === 'school' || e.ownershipType === 'organization'));
  const savedEventsList = approvedEvents.filter(e => e.savedBy?.includes(currentUser.name) && (e.ownershipType === 'school' || e.ownershipType === 'organization'));

  // Determine matchesCategory
  const matchesCategory = (item: Event | Promotion) => {
    if (selectedCategory === 'All') return true;
    const cat = item.category?.toLowerCase() || '';
    const title = item.title.toLowerCase();
    const sel = selectedCategory.toLowerCase();
    const isPromo = !('ownershipType' in item);

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
      // Student Feed
      if (sel === 'parties') {
        return cat.includes('party') || cat.includes('social') || title.includes('party');
      }
      if (sel === 'room gatherings') {
        return cat.includes('gather') || cat.includes('meet') || title.includes('room') || title.includes('gathering');
      }
      if (sel === 'bbqs') {
        return cat.includes('food') || cat.includes('bbq') || title.includes('bbq') || title.includes('cookout');
      }
      if (sel === 'game nights') {
        return cat.includes('game') || cat.includes('play') || title.includes('game') || title.includes('trivia');
      }
      if (sel === 'tutoring sessions') {
        return cat.includes('tutor') || cat.includes('teach') || cat.includes('class') || title.includes('tutor');
      }
      if (sel === 'photography services') {
        return cat.includes('photo') || cat.includes('camera') || title.includes('photo') || title.includes('shoot');
      }
      if (sel === 'food sales') {
        return cat.includes('food') || cat.includes('bake') || cat.includes('sale') || title.includes('food') || title.includes('cookie');
      }
      if (sel === 'hair/braiding services') {
        return cat.includes('beauty') || cat.includes('hair') || title.includes('hair') || title.includes('braid') || title.includes('style');
      }
      if (sel === 'clothing sales') {
        return cat.includes('clothing') || cat.includes('sale') || cat.includes('market') || title.includes('cloth') || title.includes('shirt');
      }
      if (sel === 'personal meetups') {
        return cat.includes('meet') || cat.includes('hang') || title.includes('meetup');
      }
      if (sel === 'small community events') {
        return cat.includes('community') || cat.includes('initiative') || title.includes('community');
      }
      return true;
    }
  };

  const feedItems: (Event | Promotion)[] = (() => {
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
  })();

  const filteredItems = feedItems.filter(item => {
    // Basic search/filter match
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ('location' in item ? item.location : '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.organizer || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && matchesCategory(item);
  });

  const sortedFilteredItems = [...filteredItems].sort((a, b) => {
    // 1. Featured pins at top
    const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
    const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
    if (aFeat !== bFeat) return bFeat - aFeat;

    // 2. Default sort by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const matchedOrgs = searchQuery.trim() !== ''
    ? organizations.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const officialCategories = [
    { name: 'All', icon: Compass },
    { name: 'Livingstone College', icon: GraduationCap },
    { name: 'Clubs & Organizations', icon: Users },
    { name: 'Athletics', icon: Trophy },
    { name: 'Student Government', icon: Shield },
    { name: 'Career Center', icon: Briefcase },
    { name: 'Workshops', icon: Cpu },
    { name: 'Official Conferences', icon: Calendar },
  ];

  const studentCategories = [
    { name: 'All', icon: Compass },
    { name: 'Parties', icon: Wine },
    { name: 'Room Gatherings', icon: Home },
    { name: 'BBQs', icon: Utensils },
    { name: 'Game Nights', icon: Sparkles },
    { name: 'Tutoring Sessions', icon: Briefcase },
    { name: 'Photography Services', icon: Camera },
    { name: 'Food Sales', icon: Utensils },
    { name: 'Hair/Braiding Services', icon: Sparkles },
    { name: 'Clothing Sales', icon: Tag },
    { name: 'Personal Meetups', icon: Users },
    { name: 'Small Community Events', icon: Trophy },
  ];

  const currentCategories = activeFeed === 'official' ? officialCategories : studentCategories;

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-28 md:pb-12 space-y-4">

      {/* ── Header & Search ── */}
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
            <span className={`relative z-10 transition-colors duration-300 ${activeFeed === 'official' ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>
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
            <span className={`relative z-10 transition-colors duration-300 ${activeFeed === 'student' ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>
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
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${isActive
                  ? 'bg-[#FD5C05] text-[#2A2621] shadow-sm'
                  : 'bg-white border border-black/[0.04] text-[#5A554E] hover:bg-white hover:text-[#2A2621]'
                  }`}
              >
                <cat.icon className="h-3 w-3" />
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
            <h2 className="font-black tracking-tight text-[#2A2621] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-display)' }}>
              {activeFeed === 'official' ? 'Livingstone College' : 'For You'}
            </h2>
            <p className="text-xs font-bold text-[#5A554E] uppercase tracking-wider">
              {activeFeed === 'official' 
                ? 'Official school and organization events.' 
                : 'Student-created promotions and community activities.'
              }
            </p>
            <span className="text-[10px] font-extrabold text-[#5A554E] block pt-1">
              Showing {sortedFilteredItems.length} {activeFeed === 'official' ? 'events' : 'postings'}
            </span>
          </div>

          {sortedFilteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedFilteredItems.map((item) => {
                const isPromo = !('ownershipType' in item);
                const event = isPromo ? null : (item as any);
                const promo = isPromo ? (item as any) : null;

                const isLiked = !isPromo && event ? likedEvents.has(event.id) : false;
                const isSaved = !isPromo && event && event.savedBy ? event.savedBy.includes(currentUser.name) : false;

                const day = item.date.split('-')[2] || '10';
                const month = item.date.split('-')[1] || '10';
                const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[parseInt(month)] || 'Oct';

                const coverImgUrl = isPromo ? (promo?.image || '') : (event?.coverImage || '');

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-black/[0.04] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Event/Promo Image Banner */}
                    <div
                       className="relative h-36 w-full bg-[#2A2621] overflow-hidden cursor-pointer"
                      onClick={() => {
                        if (isPromo && promo) {
                          window.location.href = `mailto:${promo.contactInfo}?subject=Inquiry regarding: ${promo.title}`;
                        } else if (event) {
                          router.push(`/events/${event.id}`);
                        }
                      }}
                    >
                      <img
                        src={getEventImg(coverImgUrl, item.id)}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Left Badge: Category */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="rounded-full bg-white/90 border border-[#D8D2BC]/40 px-2.5 py-1 text-[8px] font-extrabold uppercase text-[#2A2621] shadow-sm">
                          {isPromo ? 'PROMOTION' : (event?.category || '')}
                        </span>
                      </div>

                      {/* Right Badge: Cost */}
                      <div className="absolute top-4 right-12 z-10">
                        <span className="rounded-full bg-[#FD5C05] text-[#2A2621] px-2.5 py-1 text-[8px] font-extrabold uppercase shadow-sm">
                          {isPromo ? 'STUDENT SERVICE' : (event?.free ? 'FREE' : 'TICKETED')}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          saveToggle(item.id);
                        }}
                        className="absolute top-3.5 right-3.5 z-20 cursor-pointer focus:outline-none p-1 group"
                        title={isSaved ? "Unsave Event" : "Save Event"}
                      >
                        <Bookmark 
                          className={`h-5 w-5 transition-all duration-150 ease-in-out ${
                            isSaved 
                              ? 'fill-[#FD5C05] text-[#FD5C05]' 
                              : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                          }`} 
                        />
                      </button>

                      {/* Bottom Overlay: Title preview */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider block drop-shadow-sm">
                          {isPromo ? item.organizer : (event?.organizationName || event?.organizer || '')}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                      <div className="space-y-2">
                        {/* Host details & verified green checkmark */}
                        <div className="flex items-center gap-1.5">
                          <p
                            onClick={() => !isPromo && event?.organizationId && router.push(`/student/organizations/${event.organizationId}`)}
                            className={`text-[10px] font-extrabold text-[#5A554E] uppercase tracking-wider flex items-center leading-none ${(!isPromo && event?.organizationId) ? 'cursor-pointer hover:underline' : ''}`}
                          >
                            {isPromo ? item.organizer : (event?.organizationName || event?.organizer || '')}
                            {!isPromo && event?.organizationId && organizations.find(o => o.id === event.organizationId)?.verified && (
                              <VerifiedBadge className="h-3.5 w-3.5 ml-1" />
                            )}
                          </p>
                        </div>

                        {/* Event Title */}
                        <h3
                          onClick={() => {
                            if (isPromo && promo) {
                              window.location.href = `mailto:${promo.contactInfo}?subject=Inquiry regarding: ${promo.title}`;
                            } else if (event) {
                              router.push(`/events/${event.id}`);
                            }
                          }}
                          className="text-base font-bold text-[#2A2621] tracking-tight leading-snug line-clamp-1 hover:text-[#FD5C05] transition-colors cursor-pointer uppercase"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#5A554E] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Event/Promo Details: Date & Time, Location/Contact */}
                      <div className="space-y-2 pt-3 border-t border-black/[0.04]">
                        <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#2A2621]/80 uppercase">
                          <Calendar className="h-3.5 w-3.5 text-[#2A2621]" />
                          <span>{monthName} {day} {!isPromo && event && `• ${event.time}`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#5A554E] uppercase truncate">
                          {isPromo && promo ? (
                            <>
                              <Mail className="h-3.5 w-3.5 text-[#5A554E]" />
                              <span className="truncate">{promo.contactInfo}</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3.5 w-3.5 text-[#5A554E]" />
                              <span className="truncate">{event?.location || ''}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Attendees Avatars Preview */}
                      {!isPromo && event && event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex -space-x-1.5">
                            {event.attendees.slice(0, 3).map((name: string, i: number) => (
                              <div
                                key={i}
                                className="h-5 w-5 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[7px] font-black text-gray-700"
                              >
                                {name.substring(0, 2).toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#5A554E] font-semibold">
                            {event.attendees.length} attending
                          </span>
                        </div>
                      )}

                      {/* Footer Actions (Direct Interaction) */}
                      <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between gap-2.5">
                        {isPromo && promo ? (
                          <a
                            href={`mailto:${promo.contactInfo}?subject=Inquiry regarding: ${promo.title}`}
                            className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#2A2621] text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center animate-fade-in"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email Organizer
                          </a>
                        ) : (
                          event && (
                            <Link
                              href={`/events/${event.id}`}
                              className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#2A2621] text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                            >
                              View Event
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
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

'use client';

import React, { useState, useRef } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Bell, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Clock, 
  Compass,
  Trophy,
  Music,
  Wine,
  Cpu,
  MessageCircle,
  Send,
  CheckCircle2,
  Bookmark,
  X,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

export default function StudentDashboardPage() {
  const { currentUser } = useUser();
  const { events, organizations, notifications, saveToggle, rsvpToggle } = useEvents();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [commentOpen, setCommentOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<string, { user: string; text: string; time: string }[]>>({});
  const [shareToast, setShareToast] = useState(false);
  const [iminToast, setIminToast] = useState<string | null>(null);

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

  const approvedEvents = events.filter(e => e.status === 'approved' && (e.ownershipType === 'school' || e.ownershipType === 'organization'));
  const unreadNotifs = notifications.filter(n => !n.read);
  const rsvpEventsList = approvedEvents.filter(e => e.attendees.includes(currentUser.name));
  const savedEventsList = approvedEvents.filter(e => e.savedBy?.includes(currentUser.name));

  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            event.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedFilteredEvents = [...filteredEvents].sort((a, b) => {
    // 1. Featured pins at top
    const aFeat = a.featured || a.isFeatured || false;
    const bFeat = b.featured || b.isFeatured || false;
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;

    // 2. School-scoped priority
    if (a.ownershipType === 'school' && b.ownershipType !== 'school') return -1;
    if (a.ownershipType !== 'school' && b.ownershipType === 'school') return 1;

    // 3. Organization-scoped priority
    if (a.ownershipType === 'organization' && b.ownershipType === 'student') return -1;
    if (a.ownershipType === 'student' && b.ownershipType === 'organization') return 1;

    // 4. Default sort by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const matchedOrgs = searchQuery.trim() !== '' 
    ? organizations.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const categories = [
    { name: 'All', icon: Compass },
    { name: 'Sports', icon: Trophy },
    { name: 'Music', icon: Music },
    { name: 'Parties', icon: Wine },
    { name: 'Workshops', icon: Cpu },
    { name: 'Clubs', icon: GraduationCapIcon },
  ];

  // ── Actions ──
  const handleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handleImIn = async (eventId: string) => {
    await rsvpToggle(eventId, 'rsvp');
    setIminToast(eventId);
    setTimeout(() => setIminToast(null), 2200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Check this event on Evida!', url: window.location.href }).catch(() => {});
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleComment = (eventId: string) => {
    if (!commentText.trim()) return;
    setComments(prev => ({
      ...prev,
      [eventId]: [
        ...(prev[eventId] || []),
        { user: currentUser.name.split(' ')[0], text: commentText.trim(), time: 'now' }
      ]
    }));
    setCommentText('');
  };

  // Generate a fake organizer initial from the event organizer name
  const getOrgInitial = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-12 space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/[0.04] pb-5">
        <div>
          <h1 className="text-3xl font-black text-[#191919] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            My campus life
          </h1>
          <p className="text-xs text-[#374151] font-semibold tracking-wide uppercase mt-1">
            Hello, {currentUser.name.split(' ')[0]} • Official School & Organization Events
          </p>
        </div>

        {/* Top Header Actions (Notifications, Saved, Stats) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stats Badges */}
          <div className="bg-white/80 border border-black/[0.04] rounded-2xl px-4 py-2 flex flex-col min-w-[90px] shadow-sm">
            <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">My RSVPs</span>
            <span className="text-xs font-black text-[#191919] mt-0.5">{rsvpEventsList.length} Going</span>
          </div>
          <div className="bg-white/80 border border-black/[0.04] rounded-2xl px-4 py-2 flex flex-col min-w-[90px] shadow-sm">
            <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">My Saved</span>
            <span className="text-xs font-black text-[#191919] mt-0.5">{savedEventsList.length} Saved</span>
          </div>

          <Link href="/student/saved" className="h-10 w-10 rounded-xl bg-white border border-black/[0.04] flex items-center justify-center text-[#374151] hover:text-[#191919] transition-colors shadow-sm">
            <Bookmark className="h-4.5 w-4.5" />
          </Link>
          <Link href="/student/my-events" className="h-10 w-10 rounded-xl bg-white border border-black/[0.04] flex items-center justify-center text-[#374151] hover:text-[#191919] transition-colors shadow-sm relative">
            <Bell className="h-4.5 w-4.5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[#BDFB04] border-2 border-white" />
            )}
          </Link>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white/40 border border-black/[0.03] rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4B5563]" />
            <input 
              type="text" 
              placeholder="Search title, venue, host or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/[0.06] text-[#191919] placeholder-[#4B5563] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#BDFB04] transition-all shadow-inner"
            />
          </div>
          <Link href="/student/events" className="h-10 w-10 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-[#374151] hover:text-[#BDFB04] transition-colors shrink-0 shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories pill row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#BDFB04] text-[#191919] shadow-sm' 
                    : 'bg-white border border-black/[0.04] text-[#374151] hover:bg-white hover:text-[#191919]'
                }`}
              >
                <cat.icon className="h-3 w-3" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Dashboard Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Events Feed Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black tracking-widest text-[#4B5563] uppercase">// Upcoming Experiences</h2>
            <span className="text-[10px] font-bold text-[#374151]">Showing {sortedFilteredEvents.length} events</span>
          </div>

          {sortedFilteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedFilteredEvents.map((event) => {
                const isLiked = likedEvents.has(event.id);
                const isSaved = event.savedBy?.includes(currentUser.name);
                const isAttending = event.attendees.includes(currentUser.name);
                const eventComments = comments[event.id] || [];
                const isCommentOpen = commentOpen === event.id;

                const day = event.date.split('-')[2] || '10';
                const month = event.date.split('-')[1] || '10';
                const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[parseInt(month)] || 'Oct';

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-black/[0.04] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Event Image Banner */}
                    <div 
                      className="relative h-44 w-full bg-[#191919] overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      <img 
                        src={getEventImg(event.coverImage, event.id)} 
                        alt={event.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Left Badge: Category */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="rounded-full bg-white/90 border border-black/5 px-2.5 py-1 text-[8px] font-extrabold uppercase text-[#191919] shadow-sm">
                          {event.category}
                        </span>
                      </div>

                      {/* Right Badge: Cost */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="rounded-full bg-[#BDFB04] text-[#191919] px-2.5 py-1 text-[8px] font-extrabold uppercase shadow-sm">
                          {event.free ? 'FREE' : 'TICKETED'}
                        </span>
                      </div>

                      {/* Bottom Overlay: Title preview */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider block drop-shadow-sm">
                          {event.organizationName || event.organizer}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                      <div className="space-y-2">
                        {/* Host details & verified green checkmark */}
                        <div className="flex items-center gap-1.5">
                          <p 
                            onClick={() => event.organizationId && router.push(`/student/organizations/${event.organizationId}`)}
                            className={`text-[10px] font-extrabold text-[#374151] uppercase tracking-wider flex items-center leading-none ${event.organizationId ? 'cursor-pointer hover:underline' : ''}`}
                          >
                            {event.organizationName || event.organizer}
                            {event.organizationId && organizations.find(o => o.id === event.organizationId)?.verified && (
                              <VerifiedBadge className="h-3.5 w-3.5 ml-1" />
                            )}
                          </p>
                        </div>

                        {/* Event Title */}
                        <h3 
                          onClick={() => router.push(`/events/${event.id}`)}
                          className="text-base font-bold text-[#191919] tracking-tight leading-snug line-clamp-1 hover:text-[#BDFB04] transition-colors cursor-pointer uppercase"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#374151] leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Event Details: Date & Time, Location */}
                      <div className="space-y-2 pt-3 border-t border-black/[0.04]">
                        <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#191919]/80 uppercase">
                          <Calendar className="h-3.5 w-3.5 text-[#191919]" />
                          <span>{monthName} {day} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#4B5563] uppercase truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#4B5563]" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* Attendees Avatars Preview */}
                      {event.attendees.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex -space-x-1.5">
                            {event.attendees.slice(0, 3).map((name, i) => (
                              <div 
                                key={i} 
                                className="h-5 w-5 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[7px] font-black text-gray-700"
                              >
                                {name.substring(0, 2).toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#4B5563] font-semibold">
                            {event.attendees.length} attending
                          </span>
                        </div>
                      )}

                      {/* Comments count indicator toggle */}
                      {eventComments.length > 0 && (
                        <button
                          onClick={() => setCommentOpen(isCommentOpen ? null : event.id)}
                          className="text-[10px] font-bold text-[#4B5563] hover:text-[#191919] text-left underline flex items-center gap-1 cursor-pointer"
                        >
                          Show comments ({eventComments.length})
                        </button>
                      )}

                      {/* Comments panel (expanded inline) */}
                      <AnimatePresence>
                        {isCommentOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-black/[0.04] pt-2 space-y-2"
                          >
                            <div className="space-y-1.5 max-h-24 overflow-y-auto">
                              {eventComments.map((c, i) => (
                                <div key={i} className="text-[10px] leading-tight">
                                  <span className="font-extrabold text-[#191919]">{c.user}:</span>{' '}
                                  <span className="text-[#374151]">{c.text}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Footer Actions (Direct Interaction) */}
                      <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between gap-2.5">
                        {/* "I'm in" RSVP button */}
                        <button
                          onClick={() => handleImIn(event.id)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAttending
                              ? 'bg-[#BDFB04]/20 border border-[#BDFB04]/30 text-[#191919] shadow-sm'
                              : 'bg-[#191919] text-white hover:bg-[#2a2a2a]'
                          }`}
                        >
                          {isAttending ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                              I'm In
                            </>
                          ) : (
                            <>
                              I'm In
                            </>
                          )}
                        </button>

                        {/* Save (Heart) button */}
                        <button
                          onClick={() => saveToggle(event.id)}
                          className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-white border-[#BDFB04] text-rose-500 shadow-sm'
                              : 'bg-white border-black/10 text-[#4B5563] hover:text-rose-500'
                          }`}
                          title={isSaved ? "Saved" : "Save Event"}
                        >
                          <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                        </button>

                        {/* Write Comment Icon trigger */}
                        <button
                          onClick={() => setCommentOpen(isCommentOpen ? null : event.id)}
                          className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isCommentOpen ? 'bg-black/5 border-black/20 text-[#191919]' : 'bg-white border-black/10 text-[#374151] hover:text-[#191919]'
                          }`}
                          title="Add comment"
                        >
                          <MessageCircle className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {/* Inline comment entry */}
                      {isCommentOpen && (
                        <div className="flex gap-2 pt-2 border-t border-black/[0.04]">
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(event.id)}
                            placeholder="Add comment..."
                            className="flex-1 bg-black/[0.03] border border-black/[0.04] rounded-xl px-3 py-1.5 text-[11px] text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04]"
                          />
                          <button 
                            onClick={() => handleComment(event.id)}
                            disabled={!commentText.trim()}
                            className="bg-[#BDFB04] text-[#191919] hover:bg-[#d1fa3c] px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider disabled:opacity-30 transition-opacity cursor-pointer"
                          >
                            Post
                          </button>
                        </div>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="w-full text-center py-20 bg-white rounded-3xl border border-black/[0.04] text-sm text-[#4B5563] font-light shadow-sm">
              No official school or organization events discovered matching filters.
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Matched Organizations Widget */}
          {matchedOrgs.length > 0 && (
            <div className="bg-white border border-black/[0.04] rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#4B5563] uppercase">// MATCHED GROUPS</h3>
              <div className="space-y-2">
                {matchedOrgs.map((org) => (
                  <div 
                    key={org.id} 
                    onClick={() => router.push(`/student/organizations/${org.id}`)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-2xl flex items-center justify-between border border-black/[0.03] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[#191919] font-black text-xs shrink-0 shadow-sm">
                        {org.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#191919] uppercase tracking-tight flex items-center group-hover:text-[#BDFB04] transition-colors truncate">
                          {org.name}
                          {org.verified && <VerifiedBadge className="h-3.5 w-3.5 ml-1 shrink-0" />}
                        </h4>
                        <p className="text-[9px] text-[#4B5563]">{org.members.length} members</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#4B5563] shrink-0">→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Schedule Widget */}
          <div className="bg-white border border-black/[0.04] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-widest text-[#4B5563] uppercase">// My Schedule</h3>
              <span className="text-[9px] font-extrabold text-[#BDFB04] bg-[#BDFB04]/10 px-2 py-0.5 rounded-full">
                {rsvpEventsList.length} going
              </span>
            </div>

            {rsvpEventsList.length > 0 ? (
              <div className="space-y-3">
                {rsvpEventsList.map((event) => {
                  const day = event.date.split('-')[2] || '10';
                  const month = event.date.split('-')[1] || '10';
                  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const monthName = monthNames[parseInt(month)] || 'Oct';

                  return (
                    <div 
                      key={`schedule-${event.id}`}
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="group flex gap-3 items-center p-2.5 rounded-2xl border border-black/[0.03] hover:border-black/10 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-left"
                    >
                      {/* Date Badge */}
                      <div className="h-11 w-11 rounded-xl bg-white border border-black/[0.04] shadow-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-extrabold uppercase text-[#4B5563] leading-none">{monthName}</span>
                        <span className="text-sm font-black text-[#191919] mt-0.5 leading-none">{day}</span>
                      </div>
                      
                      {/* Event Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#191919] truncate uppercase group-hover:text-[#BDFB04] transition-colors leading-snug">
                          {event.title}
                        </h4>
                        <p className="text-[9px] text-[#4B5563] mt-0.5 truncate uppercase">
                          {event.time} • {event.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-[#4B5563] italic text-center py-4 bg-slate-50/50 rounded-2xl">
                You haven't RSVP'd to any events yet.
              </p>
            )}
          </div>

          {/* Campus Groups Widget */}
          <div className="bg-white border border-black/[0.04] rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black tracking-widest text-[#4B5563] uppercase">// Verified campus groups</h3>
            <div className="space-y-2.5">
              {organizations.slice(0, 5).map((org) => (
                <div 
                  key={org.id}
                  onClick={() => router.push(`/student/organizations/${org.id}`)}
                  className="group flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: org.logoColor || '#191919' }}
                    >
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#191919] flex items-center gap-1 group-hover:text-[#BDFB04] transition-colors truncate">
                        {org.name}
                        {org.verified && <VerifiedBadge className="h-3.5 w-3.5 shrink-0" />}
                      </p>
                      <p className="text-[9px] text-[#4B5563]">{org.members.length} members</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4B5563] group-hover:text-[#191919] shrink-0 font-bold">→</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Share/Success Toast ── */}
      <AnimatePresence>
        {iminToast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#22C55E] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xl"
          >
            You're RSVP'd! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#191919] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xl"
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
  return <span className={`font-bold ${className}`}>🎓</span>;
}

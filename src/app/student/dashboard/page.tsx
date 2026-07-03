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

export default function StudentDashboardPage() {
  const { currentUser } = useUser();
  const { events, notifications, saveToggle, rsvpToggle } = useEvents();
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

  const approvedEvents = events.filter(e => e.status === 'approved');
  const unreadNotifs = notifications.filter(n => !n.read);

  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            event.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
    <div className="max-w-lg mx-auto pb-28 md:pb-12">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-[#DFDED7]/95 backdrop-blur-xl px-4 pt-4 pb-3 border-b border-black/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-full bg-[#92D000] text-[#191919] flex items-center justify-center font-bold border-2 border-white shadow-md text-xs cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => router.push('/student/profile')}
            >
              {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-sm font-black text-[#191919] tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Yo {currentUser.name.split(' ')[0]}!
              </h1>
              <span className="text-[9px] font-extrabold text-[#4F5666] uppercase tracking-wider">
                {currentUser.school}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/student/saved" className="h-10 w-10 rounded-full bg-white border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#191919] transition-colors shadow-sm">
              <Bookmark className="h-4 w-4" />
            </Link>
            <Link href="/student/my-events" className="h-10 w-10 rounded-full bg-white border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#191919] transition-colors shadow-sm relative">
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#92D000] border-2 border-white" />
              )}
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7B8290]" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/70 border border-black/[0.04] text-[#191919] placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 text-[11px] focus:outline-none focus:border-[#92D000] transition-all"
            />
          </div>
          <Link href="/student/events" className="h-10 w-10 rounded-full bg-white/70 border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#92D000] transition-colors shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Categories pill row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3 -mx-4 px-4 pb-0.5">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-[#92D000] text-[#191919] shadow-sm' 
                    : 'bg-white/60 border border-black/[0.04] text-[#4F5666] hover:bg-white hover:text-[#191919]'
                }`}
              >
                <cat.icon className="h-3 w-3" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="space-y-5 px-3 pt-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[24px] overflow-hidden border border-black/[0.04] shadow-sm"
              >
                {/* ── Post Header (like IG) ── */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#92D000]/15 border border-[#92D000]/20 flex items-center justify-center">
                      <span className="text-[9px] font-extrabold text-[#3a5200]">{getOrgInitial(event.organizer)}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#191919] leading-tight">{event.organizationName || event.organizer}</p>
                      <p className="text-[9px] text-[#7B8290] font-medium flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-[#92D000] bg-[#92D000]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {monthName} {day}
                    </span>
                  </div>
                </div>

                {/* ── Image (Reels-style tall card) ── */}
                <div 
                  className="relative w-full aspect-[4/5] bg-[#191919] overflow-hidden cursor-pointer group"
                  onClick={() => router.push(`/events/${event.id}`)}
                  onDoubleClick={() => handleLike(event.id)}
                >
                  <img 
                    src={getEventImg(event.coverImage, event.id)} 
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />

                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                  {/* ── Right side action buttons (Instagram Reels style) ── */}
                  <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center gap-4">
                    
                    {/* Like */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(event.id); }}
                      className="flex flex-col items-center gap-0.5 group/btn"
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        isLiked 
                          ? 'bg-red-500 text-white scale-110' 
                          : 'bg-black/30 backdrop-blur-md text-white hover:bg-white/20'
                      }`}>
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-white' : ''}`} />
                      </div>
                      <span className="text-[8px] font-bold text-white/90">{event.interested.length + (isLiked ? 1 : 0)}</span>
                    </button>

                    {/* Comment */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCommentOpen(isCommentOpen ? null : event.id); }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        isCommentOpen 
                          ? 'bg-white text-[#191919]' 
                          : 'bg-black/30 backdrop-blur-md text-white hover:bg-white/20'
                      }`}>
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="text-[8px] font-bold text-white/90">{eventComments.length}</span>
                    </button>

                    {/* Share */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(); }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-white/20 flex items-center justify-center transition-all">
                        <Send className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-[8px] font-bold text-white/90">Share</span>
                    </button>

                    {/* Save/Bookmark */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); saveToggle(event.id); }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        isSaved 
                          ? 'bg-[#92D000] text-[#191919]' 
                          : 'bg-black/30 backdrop-blur-md text-white hover:bg-white/20'
                      }`}>
                        <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#191919]' : ''}`} />
                      </div>
                    </button>
                  </div>

                  {/* Bottom-left event info overlay */}
                  <div className="absolute left-4 bottom-4 right-16 z-20 space-y-1.5">
                    <h3 className="text-white font-extrabold text-base md:text-lg uppercase tracking-wide leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-[10px] font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {event.time}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/70 text-[10px] font-semibold">
                        {event.attendees.length} going
                      </span>
                    </div>
                  </div>

                  {/* Double-tap heart animation overlay */}
                  <AnimatePresence>
                    {iminToast === event.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                      >
                        <div className="bg-[#92D000] rounded-2xl px-6 py-3 shadow-2xl">
                          <span className="text-[#191919] font-extrabold text-lg uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>You're in! 🎉</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── "I'm in" Action Bar ── */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleImIn(event.id)}
                    className={`flex-1 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isAttending
                        ? 'bg-[#92D000] text-[#191919] shadow-md shadow-[#92D000]/20'
                        : 'bg-[#191919] text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {isAttending ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        I'm in!
                      </>
                    ) : (
                      <>
                        I'm in
                      </>
                    )}
                  </button>
                </div>

                {/* ── Attendees preview ── */}
                {event.attendees.length > 0 && (
                  <div className="px-4 pb-2 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {event.attendees.slice(0, 4).map((name, i) => (
                        <div 
                          key={i} 
                          className="h-5 w-5 rounded-full border-2 border-white flex items-center justify-center text-[6px] font-extrabold"
                          style={{ 
                            background: i % 2 === 0 ? '#92D000' : '#191919',
                            color: i % 2 === 0 ? '#191919' : '#fff'
                          }}
                        >
                          {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#4F5666]">
                      <span className="font-bold text-[#191919]">{event.attendees[0]?.split(' ')[0]}</span>
                      {event.attendees.length > 1 && (
                        <> and <span className="font-bold text-[#191919]">{event.attendees.length - 1} others</span></>
                      )} are going
                    </p>
                  </div>
                )}

                {/* ── Comments Section (toggleable) ── */}
                <AnimatePresence>
                  {isCommentOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-black/[0.04]"
                    >
                      <div className="px-4 py-3 space-y-3">
                        {/* Existing comments */}
                        {eventComments.length > 0 ? (
                          <div className="space-y-2 max-h-36 overflow-y-auto">
                            {eventComments.map((c, i) => (
                              <div key={i} className="flex gap-2">
                                <div className="h-5 w-5 rounded-full bg-[#191919] text-white flex items-center justify-center text-[6px] font-bold shrink-0 mt-0.5">
                                  {c.user.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[11px]">
                                    <span className="font-bold text-[#191919]">{c.user}</span>{' '}
                                    <span className="text-[#4F5666]">{c.text}</span>
                                  </p>
                                  <span className="text-[8px] text-[#7B8290]">{c.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-[#7B8290] text-center py-2">No comments yet. Be the first!</p>
                        )}

                        {/* Comment input */}
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#92D000] text-[#191919] flex items-center justify-center text-[7px] font-bold shrink-0">
                            {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
                          </div>
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(event.id)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-black/[0.03] border border-black/[0.04] rounded-full px-3 py-1.5 text-[11px] text-[#191919] placeholder-[#7B8290] focus:outline-none focus:border-[#92D000] transition-colors"
                          />
                          <button 
                            onClick={() => handleComment(event.id)}
                            disabled={!commentText.trim()}
                            className="text-[#92D000] font-bold text-[10px] uppercase tracking-wider disabled:opacity-30 transition-opacity"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Description peek ── */}
                <div className="px-4 pb-4">
                  <p className="text-[11px] text-[#4F5666] leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="w-full text-center py-20 text-sm text-[#7B8290] font-light">
            No events found matching your search.
          </div>
        )}
      </div>

      {/* ── Share Toast ── */}
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

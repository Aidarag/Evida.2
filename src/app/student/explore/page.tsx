'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  TrendingUp,
  X,
  ChevronRight,
  Calendar,
  Sparkles,
  Briefcase,
  MessageCircle,
  Plus,
  Heart,
  Clock,
  Send,
  ArrowLeft,
  Check,
  Tag,
  GraduationCap
} from 'lucide-react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { Event, Promotion, Opportunity, CampusBuzzPost } from '@/lib/types';
import { initialOpportunities, initialCampusBuzz } from '@/lib/exploreData';
import PromoContactModal from '@/components/student/PromoContactModal';
import { InstagramIcon, SnapchatIcon } from '@/components/ui/SocialIcons';

type ActiveSectionFilter = 'all' | 'events' | 'promotions' | 'opportunities' | 'buzz';

export default function StudentExplorePage() {
  const router = useRouter();
  const { events, promotions } = useEvents();
  const { currentUser } = useUser();

  // ── Search & Section Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<ActiveSectionFilter | null>(null);

  // ── Selected Item Modals ──
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [selectedBuzz, setSelectedBuzz] = useState<CampusBuzzPost | null>(null);

  // ── Create Post FAB Modal ──
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newBuzzContent, setNewBuzzContent] = useState('');
  const [newBuzzTag, setNewBuzzTag] = useState<'DM Me' | 'Question' | 'Shoutout' | 'Housing' | 'Study Pod' | 'Lost & Found'>('DM Me');
  const [newBuzzContactMethod, setNewBuzzContactMethod] = useState<'instagram' | 'snapchat' | 'phone'>('instagram');
  const [newBuzzContactValue, setNewBuzzContactValue] = useState('');

  // ── Local Dynamic Opportunities & Buzz ──
  const [opportunitiesList, setOpportunitiesList] = useState<Opportunity[]>(initialOpportunities);
  const [buzzList, setBuzzList] = useState<CampusBuzzPost[]>(initialCampusBuzz);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ── Approved Events & Promotions ──
  const approvedEvents = useMemo(() => {
    return events.filter(e => e.status === 'approved');
  }, [events]);

  const approvedPromotions = useMemo(() => {
    return promotions.filter(p => p.status === 'approved');
  }, [promotions]);

  // ── Search Filter Logic ──
  const query = searchQuery.trim().toLowerCase();

  const filteredEvents = useMemo(() => {
    return approvedEvents.filter(e => {
      if (!query) return true;
      return (
        e.title.toLowerCase().includes(query) ||
        (e.description || '').toLowerCase().includes(query) ||
        (e.category || '').toLowerCase().includes(query) ||
        (e.location || '').toLowerCase().includes(query) ||
        (e.organizationName || e.organizer || '').toLowerCase().includes(query)
      );
    });
  }, [approvedEvents, query]);

  const filteredPromotions = useMemo(() => {
    return approvedPromotions.filter(p => {
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query) ||
        (p.organizer || '').toLowerCase().includes(query) ||
        (p.price || '').toLowerCase().includes(query)
      );
    });
  }, [approvedPromotions, query]);

  const filteredOpportunities = useMemo(() => {
    return opportunitiesList.filter(o => {
      if (!query) return true;
      return (
        o.title.toLowerCase().includes(query) ||
        o.department.toLowerCase().includes(query) ||
        o.type.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query) ||
        o.location.toLowerCase().includes(query)
      );
    });
  }, [opportunitiesList, query]);

  const filteredBuzz = useMemo(() => {
    return buzzList.filter(b => {
      if (!query) return true;
      return (
        b.content.toLowerCase().includes(query) ||
        b.authorName.toLowerCase().includes(query) ||
        b.campus.toLowerCase().includes(query) ||
        b.tag.toLowerCase().includes(query)
      );
    });
  }, [buzzList, query]);

  // Handle Like on Buzz
  const handleLikeBuzz = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuzzList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
          };
        }
        return item;
      })
    );
  };

  // Submit New Buzz Post
  const handleCreateBuzz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuzzContent.trim()) return;

    const newPost: CampusBuzzPost = {
      id: `buzz-${Date.now()}`,
      authorName: currentUser?.name || 'Livingstone Student',
      authorHandle: currentUser?.username ? `@${currentUser.username}` : '@evida_student',
      authorInitial: (currentUser?.name || 'LS').substring(0, 2).toUpperCase(),
      campus: 'Livingstone • Just now',
      tag: newBuzzTag,
      content: newBuzzContent.trim(),
      timestamp: 'Just now',
      likes: 1,
      replies: 0,
      isLiked: true,
      contactMethod: newBuzzContactMethod,
      contactValue: newBuzzContactValue.trim() || undefined
    };

    setBuzzList([newPost, ...buzzList]);
    setNewBuzzContent('');
    setNewBuzzContactValue('');
    setIsPostModalOpen(false);
    showToast('Campus Buzz posted to feed! 💬');
  };

  // Trending Pill tags
  const trendingTags = [
    { label: 'All', query: '' },
    { label: 'Homecoming', query: 'homecoming' },
    { label: 'Hair & Braids', query: 'braid' },
    { label: 'Food & Treats', query: 'cookie' },
    { label: 'Tutoring', query: 'tutor' },
    { label: 'Jobs & Research', query: 'research' },
    { label: 'Campus Buzz', query: 'dm me' },
    { label: 'Parties', query: 'dj' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2A2621] selection:bg-[#FD5C05] selection:text-white pb-28 md:pb-16 font-sans">
      
      {/* ── TOP HEADER & SEARCH BAR (Sticky, Crisp White Pill) ── */}
      <div className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-xl border-b border-black/[0.05] px-4 pt-3 pb-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          
          {/* Search Input Container */}
          <div className="relative flex items-center w-full">
            <div className="absolute left-4.5 flex items-center gap-2 pointer-events-none text-[#5A554E]/60">
              <Search className="h-4.5 w-4.5 text-[#FD5C05]" />
              <TrendingUp className="h-3.5 w-3.5 text-[#5A554E]/40" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, promotions, opportunities, campus buzz..."
              className="w-full h-12 pl-13 pr-11 bg-white border border-black/[0.08] hover:border-black/[0.15] focus:border-[#FD5C05] focus:bg-white rounded-full text-sm text-[#2A2621] placeholder-[#5A554E]/50 font-medium transition-all shadow-xs focus:outline-hidden"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1.5 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Trending Tags Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {trendingTags.map((t) => {
              const isActive = (t.query === '' && searchQuery === '') || (t.query !== '' && searchQuery.toLowerCase() === t.query.toLowerCase());
              return (
                <button
                  key={t.label}
                  onClick={() => setSearchQuery(t.query)}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FD5C05] text-white shadow-xs'
                      : 'bg-white text-[#5A554E] hover:text-[#2A2621] hover:bg-black/[0.02] border border-black/[0.06] shadow-xs'
                  }`}
                >
                  #{t.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-6xl mx-auto px-4 pt-5 space-y-9">

        {/* Header Breadcrumb / View More Bar */}
        {expandedSection && (
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
            <button
              onClick={() => setExpandedSection(null)}
              className="flex items-center gap-2 text-xs font-bold text-[#FD5C05] hover:underline cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Full Explore
            </button>
            <span className="text-xs uppercase tracking-widest text-[#5A554E] font-black">
              Showing All {expandedSection}
            </span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            SECTION 1: EVENTS (📅 EVENT)
        ══════════════════════════════════════════════════════════ */}
        {(!expandedSection || expandedSection === 'events') && (
          <section className="space-y-3">
            {/* Section Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD5C05]/10 text-[#FD5C05] border border-[#FD5C05]/20 text-xs font-black tracking-wider uppercase shadow-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  EVENT
                </span>
                <span className="text-[11px] font-bold text-[#5A554E]">
                  ({filteredEvents.length})
                </span>
              </div>

              <button
                onClick={() => setExpandedSection(expandedSection === 'events' ? null : 'events')}
                className="text-xs font-bold text-[#5A554E] hover:text-[#FD5C05] transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {expandedSection === 'events' ? 'Show Less' : 'View more'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Horizontal Carousel (or Grid if Expanded) */}
            {filteredEvents.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl bg-white border border-black/[0.06] text-center text-xs text-[#5A554E] shadow-xs">
                No events found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className={
                expandedSection === 'events'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1'
                  : 'flex gap-3.5 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar'
              }>
                {filteredEvents.map((evt) => {
                  const cover = evt.coverImage || '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg';
                  const dateObj = new Date(evt.date + 'T00:00:00');
                  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  const day = dateObj.getDate();
                  const time = evt.time || '18:00';

                  return (
                    <motion.div
                      key={evt.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedEvent(evt)}
                      className={`shrink-0 ${expandedSection === 'events' ? 'w-full' : 'w-[260px] sm:w-[285px]'} snap-start bg-white border border-black/[0.06] hover:border-[#FD5C05]/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group`}
                    >
                      {/* Card Header: Avatar + Org Name + Category Badge + Location */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FD5C05] to-[#FC7C0B] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
                              {evt.organizationName ? evt.organizationName.substring(0, 2).toUpperCase() : 'EV'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#2A2621] truncate group-hover:text-[#FD5C05] transition-colors">
                                {evt.organizationName || evt.organizer}
                              </h4>
                              <p className="text-[10px] text-[#5A554E] truncate">
                                {evt.location || 'Salisbury, NC'}
                              </p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/[0.04] text-[#2A2621] border border-black/[0.06] shrink-0">
                            {evt.free ? 'FREE' : `$${evt.price || 'TKT'}`}
                          </span>
                        </div>

                        {/* Title Caption */}
                        <p className="text-xs font-extrabold text-[#2A2621] line-clamp-1 group-hover:text-[#FD5C05] transition-colors">
                          {evt.title}
                        </p>
                      </div>

                      {/* Media Thumbnail */}
                      <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={cover}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        
                        {/* Time & Date Badge on Image */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-semibold">
                          <span className="flex items-center gap-1.5 drop-shadow-md">
                            <Clock className="h-3 w-3 text-[#FD5C05]" />
                            {month} {day} • {time}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {evt.category || 'CAMPUS'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            SECTION 2: STUDENT PROMOTIONS (🛍️ PROMOTIONS)
        ══════════════════════════════════════════════════════════ */}
        {(!expandedSection || expandedSection === 'promotions') && (
          <section className="space-y-3">
            {/* Section Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-black tracking-wider uppercase shadow-xs">
                  <Tag className="h-3.5 w-3.5" />
                  STUDENT PROMOTIONS
                </span>
                <span className="text-[11px] font-bold text-[#5A554E]">
                  ({filteredPromotions.length})
                </span>
              </div>

              <button
                onClick={() => setExpandedSection(expandedSection === 'promotions' ? null : 'promotions')}
                className="text-xs font-bold text-[#5A554E] hover:text-amber-700 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {expandedSection === 'promotions' ? 'Show Less' : 'View more'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Horizontal Carousel (or Grid if Expanded) */}
            {filteredPromotions.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl bg-white border border-black/[0.06] text-center text-xs text-[#5A554E] shadow-xs">
                No student services found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className={
                expandedSection === 'promotions'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1'
                  : 'flex gap-3.5 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar'
              }>
                {filteredPromotions.map((promo) => {
                  const flyer = promo.flyerImage || promo.image || '/pexels-markus-winkler-1430818-12199407.jpg';
                  const initials = (promo.organizer || 'ST').substring(0, 2).toUpperCase();

                  return (
                    <motion.div
                      key={promo.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedPromo(promo)}
                      className={`shrink-0 ${expandedSection === 'promotions' ? 'w-full' : 'w-[260px] sm:w-[285px]'} snap-start bg-white border border-black/[0.06] hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group`}
                    >
                      {/* Card Header: Avatar + Organizer + Category + Price */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#2A2621] truncate group-hover:text-amber-700 transition-colors">
                                {promo.organizer}
                              </h4>
                              <p className="text-[10px] text-[#5A554E] truncate">
                                {promo.contactMethod ? `@${promo.contactMethod}` : 'Livingstone Campus'}
                              </p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-800 border border-amber-500/25 shrink-0">
                            {promo.isFree ? 'FREE' : (promo.price || 'PAID')}
                          </span>
                        </div>

                        {/* Title / Service Caption */}
                        <p className="text-xs font-extrabold text-[#2A2621] line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {promo.title}
                        </p>
                      </div>

                      {/* Service Photo / Flyer Preview */}
                      <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={flyer}
                          alt={promo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        
                        {/* Category & Contact pill on image */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-semibold">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/50 text-amber-300 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {promo.category}
                          </span>
                          <span className="text-[10px] text-white/90 font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            Contact &gt;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            SECTION 3: OPPORTUNITIES (💼 OPPORTUNITIES)
        ══════════════════════════════════════════════════════════ */}
        {(!expandedSection || expandedSection === 'opportunities') && (
          <section className="space-y-3">
            {/* Section Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-black tracking-wider uppercase shadow-xs">
                  <Briefcase className="h-3.5 w-3.5" />
                  OPPORTUNITIES
                </span>
                <span className="text-[11px] font-bold text-[#5A554E]">
                  ({filteredOpportunities.length})
                </span>
              </div>

              <button
                onClick={() => setExpandedSection(expandedSection === 'opportunities' ? null : 'opportunities')}
                className="text-xs font-bold text-[#5A554E] hover:text-emerald-700 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {expandedSection === 'opportunities' ? 'Show Less' : 'View more'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Horizontal Carousel (or Grid if Expanded) */}
            {filteredOpportunities.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl bg-white border border-black/[0.06] text-center text-xs text-[#5A554E] shadow-xs">
                No opportunities found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className={
                expandedSection === 'opportunities'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1'
                  : 'flex gap-3.5 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar'
              }>
                {filteredOpportunities.map((opp) => {
                  const banner = opp.image || '/campus_life_hero.png';
                  return (
                    <motion.div
                      key={opp.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedOpp(opp)}
                      className={`shrink-0 ${expandedSection === 'opportunities' ? 'w-full' : 'w-[260px] sm:w-[285px]'} snap-start bg-white border border-black/[0.06] hover:border-emerald-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group`}
                    >
                      {/* Card Header: Department + Type Tag + Compensation */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
                              <GraduationCap className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#2A2621] truncate group-hover:text-emerald-700 transition-colors">
                                {opp.department}
                              </h4>
                              <p className="text-[10px] text-[#5A554E] truncate">
                                Deadline: {opp.deadline}
                              </p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shrink-0">
                            {opp.type}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-extrabold text-[#2A2621] line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {opp.title}
                        </p>
                      </div>

                      {/* Thumbnail Image */}
                      <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={banner}
                          alt={opp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Compensation tag */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-semibold">
                          <span className="text-[10px] font-extrabold text-emerald-300 bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-emerald-500/30">
                            {opp.compensation}
                          </span>
                          <span className="text-[10px] text-white/90 font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            Apply &gt;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            SECTION 4: CAMPUS BUZZ (💬 CAMPUS BUZZ / DM ME)
        ══════════════════════════════════════════════════════════ */}
        {(!expandedSection || expandedSection === 'buzz') && (
          <section className="space-y-3">
            {/* Section Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 border border-sky-500/20 text-xs font-black tracking-wider uppercase shadow-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  CAMPUS BUZZ
                </span>
                <span className="text-[11px] font-bold text-[#5A554E]">
                  ({filteredBuzz.length})
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="h-3 w-3 stroke-[3]" />
                  <span>Post Buzz</span>
                </button>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'buzz' ? null : 'buzz')}
                  className="text-xs font-bold text-[#5A554E] hover:text-sky-700 transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  {expandedSection === 'buzz' ? 'Show Less' : 'View more'}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel (or Grid if Expanded) */}
            {filteredBuzz.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl bg-white border border-black/[0.06] text-center text-xs text-[#5A554E] shadow-xs">
                No campus buzz found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className={
                expandedSection === 'buzz'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1'
                  : 'flex gap-3.5 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar'
              }>
                {filteredBuzz.map((buzz) => {
                  return (
                    <motion.div
                      key={buzz.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedBuzz(buzz)}
                      className={`shrink-0 ${expandedSection === 'buzz' ? 'w-full' : 'w-[260px] sm:w-[285px]'} snap-start bg-white border border-black/[0.06] hover:border-sky-500/40 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group`}
                    >
                      {/* Top: Author Avatar + Name + Campus Tag + DM Me Pill */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
                              {buzz.authorInitial || 'LS'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#2A2621] truncate group-hover:text-sky-700 transition-colors">
                                {buzz.authorName}
                              </h4>
                              <p className="text-[10px] text-[#5A554E] truncate">
                                {buzz.campus}
                              </p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-800 border border-sky-500/20 shrink-0">
                            {buzz.tag}
                          </span>
                        </div>

                        {/* Bold Social Text Snippet (Just like the reference screenshot!) */}
                        <p className="text-sm font-extrabold text-[#2A2621] leading-snug line-clamp-3 mb-3">
                          &ldquo;{buzz.content}&rdquo;
                        </p>
                      </div>

                      {/* Optional Photo or Attachment */}
                      {buzz.image && (
                        <div className="h-28 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                          <img
                            src={buzz.image}
                            alt="Buzz Attachment"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Bottom Reactions & DM Button */}
                      <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-xs text-[#5A554E]">
                        <button
                          onClick={(e) => handleLikeBuzz(buzz.id, e)}
                          className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                            buzz.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${buzz.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{buzz.likes}</span>
                        </button>

                        <div className="flex items-center gap-1.5 font-bold hover:text-[#2A2621] transition-colors">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{buzz.replies} replies</span>
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          DM Me
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </div>



      {/* ══════════════════════════════════════════════════════════
          MODAL: CREATE POST / BUZZ (Light / Clean Theme)
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#5A554E] hover:text-[#2A2621] rounded-full bg-black/[0.04] hover:bg-black/[0.08] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-[#FD5C05]/10 text-[#FD5C05]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#2A2621]">Share with Campus</h3>
                  <p className="text-xs text-[#5A554E]">Post a quick buzz, question, or inquiry</p>
                </div>
              </div>

              {/* Quick Navigation to Full Creation if needed */}
              <div className="grid grid-cols-2 gap-2 mb-4 pb-3 border-b border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => router.push('/student/create')}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F5] hover:bg-black/[0.04] text-xs font-bold text-[#2A2621] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-black/[0.05]"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#FD5C05]" />
                  Create Event &gt;
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/student/create')}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F5] hover:bg-black/[0.04] text-xs font-bold text-[#2A2621] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-black/[0.05]"
                >
                  <Tag className="h-3.5 w-3.5 text-amber-600" />
                  List Service &gt;
                </button>
              </div>

              <form onSubmit={handleCreateBuzz} className="space-y-4">
                {/* Tag Selection */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#5A554E] mb-1.5 block">
                    Category Tag
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['DM Me', 'Question', 'Shoutout', 'Study Pod', 'Lost & Found'] as const).map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewBuzzTag(tag)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                          newBuzzTag === tag
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-[#FAF9F5] text-[#5A554E] hover:bg-black/[0.05] border border-black/[0.05]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#5A554E] mb-1.5 block">
                    What&rsquo;s happening?
                  </label>
                  <textarea
                    required
                    value={newBuzzContent}
                    onChange={(e) => setNewBuzzContent(e.target.value)}
                    placeholder="e.g. WHO DOES WIG INSTALLS 🥺 plz dm me, need an appointment for Friday..."
                    rows={3}
                    className="w-full p-3 bg-[#FAF9F5] border border-black/[0.08] rounded-2xl text-sm text-[#2A2621] placeholder-[#5A554E]/40 focus:border-sky-500 focus:outline-hidden transition-all"
                  />
                </div>

                {/* Contact Handle */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#5A554E] mb-1.5 block">
                    Contact Method for &ldquo;DM Me&rdquo;
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newBuzzContactMethod}
                      onChange={(e) => setNewBuzzContactMethod(e.target.value as any)}
                      className="px-3 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-xl text-xs text-[#2A2621] focus:outline-hidden"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="snapchat">Snapchat</option>
                      <option value="phone">Phone</option>
                    </select>

                    <input
                      type="text"
                      value={newBuzzContactValue}
                      onChange={(e) => setNewBuzzContactValue(e.target.value)}
                      placeholder="@handle or phone number"
                      className="flex-1 px-3 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-xl text-xs text-[#2A2621] placeholder-[#5A554E]/40 focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                >
                  Publish Buzz Post
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          MODAL: OPPORTUNITY DETAILS (Light / Clean Theme)
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-4 right-4 p-2 text-[#5A554E] hover:text-[#2A2621] rounded-full bg-black/[0.04] hover:bg-black/[0.08] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                  {selectedOpp.type}
                </span>
                <span className="text-xs text-[#5A554E]">
                  Deadline: {selectedOpp.deadline}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-[#2A2621] mb-1">
                {selectedOpp.title}
              </h2>
              <p className="text-xs font-semibold text-emerald-700 mb-4">
                {selectedOpp.department} • {selectedOpp.compensation}
              </p>

              {selectedOpp.image && (
                <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={selectedOpp.image}
                    alt={selectedOpp.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4 text-xs text-[#2A2621]">
                <div>
                  <h4 className="font-bold text-[#2A2621] mb-1 uppercase tracking-wider text-[11px]">
                    Role Overview
                  </h4>
                  <p className="leading-relaxed text-[#5A554E]">
                    {selectedOpp.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#2A2621] mb-1 uppercase tracking-wider text-[11px]">
                    Requirements
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedOpp.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#5A554E]">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                <div className="text-[11px] text-[#5A554E]">
                  Location: {selectedOpp.location}
                </div>
                <a
                  href={`mailto:${selectedOpp.contactEmail || 'admissions@livingstone.edu'}?subject=Application Inquiry: ${selectedOpp.title}`}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Apply via Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          MODAL: CAMPUS BUZZ DETAILS & REPLY (Light / Clean Theme)
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedBuzz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedBuzz(null)}
                className="absolute top-4 right-4 p-2 text-[#5A554E] hover:text-[#2A2621] rounded-full bg-black/[0.04] hover:bg-black/[0.08] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-xs">
                  {selectedBuzz.authorInitial || 'LS'}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#2A2621]">{selectedBuzz.authorName}</h3>
                  <p className="text-xs text-[#5A554E]">{selectedBuzz.authorHandle} • {selectedBuzz.campus}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-black/[0.06] mb-4">
                <p className="text-base font-extrabold text-[#2A2621] leading-relaxed">
                  &ldquo;{selectedBuzz.content}&rdquo;
                </p>
              </div>

              {selectedBuzz.contactValue && (
                <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#5A554E] block font-semibold">Direct Contact:</span>
                    <span className="font-extrabold text-sky-700">{selectedBuzz.contactValue}</span>
                  </div>
                  {selectedBuzz.contactMethod === 'instagram' ? (
                    <a
                      href={`https://instagram.com/${selectedBuzz.contactValue.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#E1306C] text-white text-xs font-bold shadow-xs"
                    >
                      Open Instagram
                    </a>
                  ) : selectedBuzz.contactMethod === 'snapchat' ? (
                    <a
                      href={`https://snapchat.com/add/${selectedBuzz.contactValue.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FFFC00] text-black text-xs font-bold shadow-xs"
                    >
                      Open Snapchat
                    </a>
                  ) : (
                    <a
                      href={`tel:${selectedBuzz.contactValue.replace(/\D/g, '')}`}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs"
                    >
                      Call / SMS
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  showToast(`DM request sent to ${selectedBuzz.authorName}! 🚀`);
                  setSelectedBuzz(null);
                }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                Send Direct Message
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          EXISTING MODAL: PROMOTION CONTACT MODAL
      ══════════════════════════════════════════════════════════ */}
      <PromoContactModal
        promo={selectedPromo}
        isOpen={!!selectedPromo}
        onClose={() => setSelectedPromo(null)}
      />

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#FD5C05] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

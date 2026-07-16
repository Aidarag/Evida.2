'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Compass, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Tag, 
  Calendar, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Building,
  Briefcase,
  Trophy,
  Music,
  Utensils,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Organization, Promotion } from '@/lib/types';

export default function ExplorePage() {
  const { events, organizations } = useEvents();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search result tab state: 'all' | 'events' | 'orgs' | 'promos'
  const [searchTab, setSearchTab] = useState<'all' | 'events' | 'orgs' | 'promos'>('all');

  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data.filter((p: Promotion) => p.status === 'approved') || []))
      .catch(() => {});
  }, []);

  const approvedEvents = useMemo(() => events.filter(e => e.status === 'approved'), [events]);

  // ── Unified Search Matching ──
  const searchResults = useMemo(() => {
    if (!searchQuery) return { events: [], orgs: [], promos: [] };
    
    const query = searchQuery.toLowerCase();
    
    const matchedEvents = approvedEvents.filter(e => 
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
    );

    const matchedOrgs = organizations.filter(org => 
      org.name.toLowerCase().includes(query) ||
      org.description.toLowerCase().includes(query)
    );

    const matchedPromos = promotions.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.organizer.toLowerCase().includes(query)
    );

    return { events: matchedEvents, orgs: matchedOrgs, promos: matchedPromos };
  }, [searchQuery, approvedEvents, organizations, promotions]);

  // Check if search has any results
  const hasSearchResults = searchQuery.trim().length > 0;

  // ── Curated Lists for Section Display (Empty Search View) ──
  const trendingEvents = useMemo(() => {
    return [...approvedEvents]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [approvedEvents]);

  const officialEvents = useMemo(() => {
    return approvedEvents.filter(e => e.ownershipType === 'school').slice(0, 6);
  }, [approvedEvents]);

  const studentEvents = useMemo(() => {
    return approvedEvents.filter(e => e.ownershipType === 'student' || e.ownershipType === 'organization').slice(0, 6);
  }, [approvedEvents]);

  const careerEvents = useMemo(() => {
    const careerEvts = approvedEvents.filter(e => e.category?.toLowerCase() === 'career' || e.category?.toLowerCase() === 'academic');
    const careerPromos = promotions.filter(p => p.category === 'jobs');
    return { events: careerEvts.slice(0, 4), promos: careerPromos.slice(0, 4) };
  }, [approvedEvents, promotions]);

  const sportsEvents = useMemo(() => {
    const sportsEvts = approvedEvents.filter(e => e.category?.toLowerCase() === 'sports');
    const sportsPromos = promotions.filter(p => p.category === 'sports');
    return { events: sportsEvts.slice(0, 4), promos: sportsPromos.slice(0, 4) };
  }, [approvedEvents, promotions]);

  const entertainmentEvents = useMemo(() => {
    const entEvts = approvedEvents.filter(e => 
      e.category?.toLowerCase() === 'social' || 
      e.category?.toLowerCase() === 'creative' || 
      e.category?.toLowerCase() === 'greek'
    );
    const entPromos = promotions.filter(p => p.category === 'creative');
    return { events: entEvts.slice(0, 4), promos: entPromos.slice(0, 4) };
  }, [approvedEvents, promotions]);

  const foodDeals = useMemo(() => {
    return promotions.filter(p => p.category === 'food' || p.category === 'marketplace' || p.category === 'housing').slice(0, 6);
  }, [promotions]);

  const academicsWorkshops = useMemo(() => {
    const acadEvts = approvedEvents.filter(e => e.category?.toLowerCase() === 'academic');
    const acadPromos = promotions.filter(p => (p.category as string) === 'tutoring' || p.category === 'academic');
    return { events: acadEvts.slice(0, 4), promos: acadPromos.slice(0, 4) };
  }, [approvedEvents, promotions]);

  const studentBusinesses = useMemo(() => {
    return promotions.filter(p => p.category === 'beauty' || p.category === 'marketplace' || p.category === 'creative' || p.category === 'other').slice(0, 6);
  }, [promotions]);

  // Render a standard section header
  const renderSectionHeader = (title: string, sectionKey: string) => (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-black uppercase tracking-tight text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <Link
        href={`/student/explore/category?section=${encodeURIComponent(sectionKey)}`}
        className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#5A554E] hover:text-[#FD5C05] transition-colors"
      >
        View All <ChevronRight className="h-3 w-3 stroke-[3]" />
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-8 text-[#2A2621] text-left">
      
      {/* ── Title Area ── */}
      <div className="border-b border-black/[0.04] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Compass className="h-8 w-8 text-[#FD5C05]" />
            Discovery Hub
          </h1>
          <p className="text-xs font-semibold text-[#5A554E] uppercase tracking-wider mt-1">
            Browse and naturally discover everything happening on campus.
          </p>
        </div>
      </div>

      {/* ── Prominent Search Bar ── */}
      <div className="relative w-full shadow-sm rounded-2xl overflow-hidden bg-white border border-black/[0.06] focus-within:border-[#FD5C05] transition-all">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#5A554E]" />
        </span>
        <input
          type="text"
          placeholder="Search events, organizations, promotions, tutoring, student businesses..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent py-4.5 pl-12 pr-4 text-xs sm:text-sm text-[#2A2621] placeholder-[#5A554E]/60 focus:outline-none"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5A554E] hover:text-[#FD5C05] text-xs font-bold uppercase tracking-wider"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Dynamic Layout Transition ── */}
      <AnimatePresence mode="wait">
        {!hasSearchResults ? (
          <motion.div
            key="discovery-hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* 1. Trending Events */}
            <div className="space-y-3.5">
              {renderSectionHeader('🔥 Trending Events', 'Trending Events')}
              {trendingEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {trendingEvents.map(evt => (
                    <Link
                      key={evt.id}
                      href={`/events/${evt.id}`}
                      className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                    >
                      <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                        {evt.coverImage.includes('from-') ? (
                          <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                        ) : (
                          <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                        )}
                        <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[#FD5C05] text-[8px] font-black uppercase tracking-widest block">
                            {evt.ownershipType === 'school' ? 'Official Event' : 'Student Event'}
                          </span>
                          <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                            {evt.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                          <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                          <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No trending events available right now.</p>
              )}
            </div>

            {/* 2. Official Events */}
            <div className="space-y-3.5">
              {renderSectionHeader('🏫 Official Events', 'Official Events')}
              {officialEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {officialEvents.map(evt => (
                    <Link
                      key={evt.id}
                      href={`/events/${evt.id}`}
                      className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                    >
                      <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                        {evt.coverImage.includes('from-') ? (
                          <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                        ) : (
                          <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                        )}
                        <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[#FD5C05] text-[8px] font-black uppercase tracking-widest block">Official Event</span>
                          <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                            {evt.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                          <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                          <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No official school events scheduled.</p>
              )}
            </div>

            {/* 3. Student Events */}
            <div className="space-y-3.5">
              {renderSectionHeader('👥 Student-led Activities', 'Student Events')}
              {studentEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {studentEvents.map(evt => (
                    <Link
                      key={evt.id}
                      href={`/events/${evt.id}`}
                      className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                    >
                      <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                        {evt.coverImage.includes('from-') ? (
                          <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                        ) : (
                          <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                        )}
                        <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[#FD5C05] text-[8px] font-black uppercase tracking-widest block">Student Event</span>
                          <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                            {evt.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                          <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                          <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No student events scheduled right now.</p>
              )}
            </div>

            {/* 4. Campus Organizations */}
            <div className="space-y-3.5">
              {renderSectionHeader('🛡️ Campus Organizations', 'Organizations')}
              {organizations.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {organizations.map(org => (
                    <div
                      key={org.id}
                      onClick={() => router.push(`/student/organizations/${org.id}`)}
                      className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between h-40"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="h-11 w-11 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 transition-transform group-hover:scale-105"
                          style={{ backgroundColor: org.logoColor || '#2A2621' }}
                        >
                          {org.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 truncate">
                            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#2A2621] group-hover:text-[#FD5C05] transition-colors truncate">
                              {org.name}
                            </h3>
                            {org.verified && <span className="text-[10px]" title="Verified">🛡️</span>}
                          </div>
                          <p className="text-[10px] text-[#5A554E] line-clamp-2 leading-normal font-semibold mt-0.5">
                            {org.description}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-bold uppercase tracking-wider">
                        <span>{org.members?.length || 0} members</span>
                        <span className="text-[#FD5C05] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">View Profile <ArrowRight className="h-2.5 w-2.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No organizations found.</p>
              )}
            </div>

            {/* 5. Career & Networking */}
            <div className="space-y-3.5">
              {renderSectionHeader('💼 Career & Networking', 'Career & Networking')}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                {careerEvents.events.map(evt => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                  >
                    <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                      {evt.coverImage.includes('from-') ? (
                        <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                      ) : (
                        <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                      )}
                      <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/20 text-[#FD5C05] border border-[#FD5C05]/20 px-2 py-0.5 rounded">
                        Event
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                          {evt.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {careerEvents.promos.map(promo => (
                  <div
                    key={promo.id}
                    className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                  >
                    <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                      Job
                    </span>
                    <div className="space-y-1">
                      <span className="text-[#FD5C05] text-[8px] font-black uppercase tracking-widest block">Opportunity</span>
                      <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                        {promo.title}
                      </h3>
                      <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                        {promo.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                      <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                      <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                    </div>
                  </div>
                ))}
                {careerEvents.events.length === 0 && careerEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No career opportunities listed.</p>
                )}
              </div>
            </div>

            {/* 6. Sports & Athletics */}
            <div className="space-y-3.5">
              {renderSectionHeader('🏆 Sports & Athletics', 'Sports')}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                {sportsEvents.events.map(evt => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                  >
                    <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                      {evt.coverImage.includes('from-') ? (
                        <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                      ) : (
                        <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                      )}
                      <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                        Event
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                          {evt.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {sportsEvents.promos.map(promo => (
                  <div
                    key={promo.id}
                    className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                  >
                    <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                      Sports
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                        {promo.title}
                      </h3>
                      <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                        {promo.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                      <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                      <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                    </div>
                  </div>
                ))}
                {sportsEvents.events.length === 0 && sportsEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No sports listings scheduled.</p>
                )}
              </div>
            </div>

            {/* 7. Music & Entertainment */}
            <div className="space-y-3.5">
              {renderSectionHeader('🎵 Music & Entertainment', 'Music & Entertainment')}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                {entertainmentEvents.events.map(evt => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                  >
                    <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                      {evt.coverImage.includes('from-') ? (
                        <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                      ) : (
                        <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                      )}
                      <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                        Event
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                          {evt.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {entertainmentEvents.promos.map(promo => (
                  <div
                    key={promo.id}
                    className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                  >
                    <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                      Promo
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                        {promo.title}
                      </h3>
                      <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                        {promo.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                      <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                      <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                    </div>
                  </div>
                ))}
                {entertainmentEvents.events.length === 0 && entertainmentEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No entertainment events listed.</p>
                )}
              </div>
            </div>

            {/* 8. Food & Deals */}
            <div className="space-y-3.5">
              {renderSectionHeader('🍕 Food & Campus Deals', 'Food & Deals')}
              {foodDeals.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {foodDeals.map(promo => (
                    <div
                      key={promo.id}
                      className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                    >
                      <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                        {promo.category}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                          {promo.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                          {promo.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                        <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No active food sales or campus deals found.</p>
              )}
            </div>

            {/* 9. Academic & Workshops */}
            <div className="space-y-3.5">
              {renderSectionHeader('📖 Academic & Workshops', 'Academic & Workshops')}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                {academicsWorkshops.events.map(evt => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="w-72 sm:w-80 shrink-0 bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group"
                  >
                    <div className="h-40 w-full bg-[#FD5C05]/10 shrink-0 relative">
                      {evt.coverImage.includes('from-') ? (
                        <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                      ) : (
                        <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                      )}
                      <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                        Event
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
                          {evt.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="flex items-center gap-1 truncate max-w-[50%]"><Users className="h-3 w-3" /> {evt.organizer}</span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {evt.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {academicsWorkshops.promos.map(promo => (
                  <div
                    key={promo.id}
                    className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                  >
                    <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                      {promo.category}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                        {promo.title}
                      </h3>
                      <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                        {promo.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                      <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                      <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                    </div>
                  </div>
                ))}
                {academicsWorkshops.events.length === 0 && academicsWorkshops.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No workshops scheduled.</p>
                )}
              </div>
            </div>

            {/* 10. Student Businesses & Services */}
            <div className="space-y-3.5">
              {renderSectionHeader('🔥 Student Businesses & Services', 'Student Businesses & Services')}
              {studentBusinesses.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
                  {studentBusinesses.map(promo => (
                    <div
                      key={promo.id}
                      className="w-72 shrink-0 bg-white border border-black/[0.04] rounded-3xl p-4 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-40 relative group"
                    >
                      <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                        {promo.category}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[#FD5C05] text-[8px] font-black uppercase tracking-widest block">Entrepreneur</span>
                        <h3 className="font-extrabold text-xs uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1">
                          {promo.title}
                        </h3>
                        <p className="text-[11px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
                          {promo.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
                        <span className="truncate max-w-[50%]">By {promo.organizer}</span>
                        <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-2 py-0.5 rounded text-[8px] font-bold">{promo.contactInfo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No student businesses listed yet.</p>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── Search Results Layout ── */
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Search segment pill tags */}
            <div className="flex bg-white/70 border border-black/[0.04] rounded-2xl p-1 shadow-sm max-w-lg">
              {[
                { id: 'all' as const, label: 'All Results' },
                { id: 'events' as const, label: `Events (${searchResults.events.length})` },
                { id: 'orgs' as const, label: `Organizations (${searchResults.orgs.length})` },
                { id: 'promos' as const, label: `Promos & Services (${searchResults.promos.length})` },
              ].map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setSearchTab(segment.id)}
                  className={`flex-1 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    searchTab === segment.id
                      ? 'bg-[#2A2621] text-white shadow-sm'
                      : 'text-[#5A554E] hover:text-[#2A2621]'
                  }`}
                >
                  {segment.label}
                </button>
              ))}
            </div>

            {/* Results Grid display */}
            <div className="space-y-8">
              {/* Event results */}
              {(searchTab === 'all' || searchTab === 'events') && (
                searchResults.events.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-[#2A2621] tracking-wider pl-1">Events</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {searchResults.events.map(evt => (
                        <Link
                          key={evt.id}
                          href={`/events/${evt.id}`}
                          className="bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col h-full relative group"
                        >
                          <div className="h-44 w-full bg-[#FD5C05]/10 shrink-0 relative">
                            {evt.coverImage.includes('from-') ? (
                              <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
                            ) : (
                              <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
                            )}
                            <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-2 py-0.5 rounded">
                              {evt.category}
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 text-[#FD5C05] text-[9px] font-black uppercase tracking-widest">
                                {evt.ownershipType === 'school' ? '🏫 Official Event' : '👥 Student Event'}
                              </div>
                              <h3 className="font-extrabold text-sm text-[#2A2621] uppercase tracking-wide leading-tight line-clamp-2 group-hover:text-[#FD5C05] transition-colors">
                                {evt.title}
                              </h3>
                              <p className="text-xs text-[#5A554E] leading-relaxed line-clamp-3 font-medium">
                                {evt.description}
                              </p>
                            </div>
                            <div className="space-y-2 pt-3 border-t border-black/[0.04] text-[10px] text-[#5A554E] font-semibold">
                              <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {evt.date} • {evt.time}</p>
                              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#FD5C05]" /> {evt.location}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : searchTab === 'events' && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching events found.</p>
                  </div>
                )
              )}

              {/* Organization results */}
              {(searchTab === 'all' || searchTab === 'orgs') && (
                searchResults.orgs.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-[#2A2621] tracking-wider pl-1">Organizations</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {searchResults.orgs.map(org => (
                        <div
                          key={org.id}
                          onClick={() => router.push(`/student/organizations/${org.id}`)}
                          className="bg-white rounded-3xl p-5 flex items-center justify-between border border-black/[0.04] shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className="h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white text-md shrink-0 shadow-sm transition-transform group-hover:scale-105"
                              style={{ backgroundColor: org.logoColor || '#2A2621' }}
                            >
                              {org.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-[#2A2621] text-sm uppercase tracking-tight group-hover:text-[#FD5C05] transition-colors truncate">
                                  {org.name}
                                </p>
                                {org.verified && <span className="text-[10px]" title="Verified Organization">🛡️</span>}
                              </div>
                              <p className="text-xs text-[#5A554E] line-clamp-1 font-semibold mt-0.5">{org.description}</p>
                              <p className="text-[9px] text-[#5A554E] font-bold uppercase tracking-wider mt-1">{org.members.length} members</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase text-[#5A554E] group-hover:text-[#2A2621] transition-colors pl-2 shrink-0">View →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchTab === 'orgs' && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching organizations found.</p>
                  </div>
                )
              )}

              {/* Promotions/Businesses results */}
              {(searchTab === 'all' || searchTab === 'promos') && (
                searchResults.promos.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-[#2A2621] tracking-wider pl-1">Promotions & Services</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {searchResults.promos.map(promo => (
                        <div
                          key={promo.id}
                          className="bg-white border border-black/[0.04] rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#FD5C05]/30 transition-all relative text-left"
                        >
                          <span className="absolute top-5 right-5 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                            {promo.category}
                          </span>
                          
                          <div className="space-y-2">
                            <h4 className="font-bold text-sm text-[#2A2621] uppercase tracking-wide truncate w-[80%]">{promo.title}</h4>
                            <p className="text-xs text-[#5A554E] leading-relaxed font-semibold">{promo.description}</p>
                          </div>

                          <div className="pt-3 border-t border-black/[0.04] text-[9px] text-[#5A554E] font-semibold flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span>Owner: {promo.organizer}</span>
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[#2A2621]">{promo.contactInfo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchTab === 'promos' && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching promos or student businesses found.</p>
                  </div>
                )
              )}

              {/* No results at all for "All" */}
              {searchTab === 'all' && 
               searchResults.events.length === 0 && 
               searchResults.orgs.length === 0 && 
               searchResults.promos.length === 0 && (
                <div className="bg-white rounded-3xl p-16 border border-black/[0.04] text-center max-w-lg mx-auto">
                  <Compass className="h-12 w-12 text-[#FD5C05]/20 mx-auto mb-3" />
                  <h3 className="font-bold text-sm text-[#2A2621] uppercase">No results found</h3>
                  <p className="text-xs text-[#5A554E] mt-1">Try check spelling or searching for another keyword.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

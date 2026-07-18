'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
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
  ArrowRight,
  Shield,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Organization, Promotion } from '@/lib/types';

export default function ExplorePage() {
  const { events, organizations, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const trendingSearches = useMemo(() => [
    'homecoming',
    'hackathon',
    'career fair',
    'football',
    'tutoring',
    'photography',
    'food sales',
    'greek life'
  ], []);
  
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
  const renderSectionHeader = (title: string, sectionKey: string, icon: React.ReactNode, isOrange: boolean = false) => (
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-2">
        <span 
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm border ${
            isOrange 
              ? 'bg-[#FD5C05] text-[#FAFAF9] border-[#FD5C05]' 
              : 'bg-[#2A2621] text-[#FAFAF9] border-[#2A2621]'
          }`}
        >
          <div className="[&>svg]:h-3 [&>svg]:w-3 shrink-0">
            {icon}
          </div>
          {title}
        </span>
      </div>
      <Link
        href={`/student/explore/category?section=${encodeURIComponent(sectionKey)}`}
        className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-[#5A554E]/75 hover:text-[#FD5C05] transition-colors"
      >
        View More <ChevronRight className="h-2.5 w-2.5 stroke-[2.5]" />
      </Link>
    </div>
  );

  const renderEventCard = (evt: Event, isGridItem: boolean = false) => {
    const isSaved = currentUser ? evt.savedBy?.includes(currentUser.name) : false;
    return (
      <Link
        key={evt.id}
        href={`/events/${evt.id}`}
        className={`${isGridItem ? 'w-full' : 'w-52 sm:w-60 shrink-0'} bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col relative group cursor-pointer`}
      >
        <div className="h-28 w-full bg-[#FD5C05]/10 shrink-0 relative">
          {evt.coverImage.includes('from-') ? (
            <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage}`} />
          ) : (
            <img src={evt.coverImage} className="w-full h-full object-cover" alt="" />
          )}
          
          {/* Cost/Category Badges inside cover */}
          <span className="absolute top-2 left-2 text-[7px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-1.5 py-0.5 rounded">
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
              title={isSaved ? "Unsave Event" : "Save Event"}
            >
              <Bookmark 
                className={`h-4.5 w-4.5 transition-all duration-150 ease-in-out ${
                  isSaved 
                    ? 'fill-[#FD5C05] text-[#FD5C05]' 
                    : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`} 
              />
            </button>
          )}
        </div>
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-0.5">
          <span className="text-[#FD5C05] text-[7px] font-black uppercase tracking-widest block">
            {evt.ownershipType === 'school' ? 'Official Event' : 'Student Event'}
          </span>
          <h3 className="font-extrabold text-[11px] uppercase tracking-wide text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-tight line-clamp-1">
            {evt.title}
          </h3>
          <p className="text-[10px] text-[#5A554E] leading-relaxed line-clamp-2 font-medium">
            {evt.description}
          </p>
        </div>
        <div className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[8px] text-[#5A554E] font-semibold">
          <span className="flex items-center gap-0.5 truncate max-w-[50%]"><Users className="h-2.5 w-2.5" /> {evt.organizer}</span>
          <span className="flex items-center gap-0.5 shrink-0"><Calendar className="h-2.5 w-2.5" /> {evt.date}</span>
        </div>
      </div>
    </Link>
  );
};

  // Helper to render organization cards
  const renderOrganizationCard = (org: Organization, isGridItem: boolean = false) => (
    <div
      key={org.id}
      onClick={() => router.push(`/student/organizations/${org.id}`)}
      className={`${isGridItem ? 'w-full' : 'w-52 sm:w-60 shrink-0'} bg-white border border-black/[0.04] rounded-3xl p-3 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between h-32`}
    >
      <div className="flex items-start gap-2">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 transition-transform group-hover:scale-105"
          style={{ backgroundColor: org.logoColor || '#2A2621' }}
        >
          {org.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 truncate">
            <h3 className="font-extrabold text-[11px] uppercase tracking-tight text-[#2A2621] group-hover:text-[#FD5C05] transition-colors truncate">
              {org.name}
            </h3>
            {org.verified && <span title="Verified Organization"><CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500/10 shrink-0" /></span>}
          </div>
          <p className="text-[9px] text-[#5A554E] line-clamp-2 leading-normal font-semibold mt-0.5">
            {org.description}
          </p>
        </div>
      </div>
      <div className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[8px] text-[#5A554E] font-bold uppercase tracking-wider">
        <span>{org.members?.length || 0} members</span>
        <span className="text-[#FD5C05] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">View Profile <ArrowRight className="h-2 w-2" /></span>
      </div>
    </div>
  );

  // Helper to render promotion cards
  const renderPromotionCard = (promo: Promotion, forceCategoryText?: string, isGridItem: boolean = false) => (
    <div
      key={promo.id}
      className={`${isGridItem ? 'w-full' : 'w-52 sm:w-60 shrink-0'} bg-white border border-black/[0.04] rounded-3xl p-3 shadow-sm hover:border-[#FD5C05]/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-32 relative group`}
    >
      <span className="absolute top-3 right-3 text-[7px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-[2px] text-white px-1.5 py-0.5 rounded">
        {forceCategoryText || promo.category}
      </span>
      <div className="space-y-0.5">
        <span className="text-[#FD5C05] text-[7px] font-black uppercase tracking-widest block">Opportunity</span>
        <h3 className="font-extrabold text-[11px] uppercase tracking-wide text-[#2A2621] leading-tight line-clamp-1 w-[80%]">
          {promo.title}
        </h3>
        <p className="text-[10px] text-[#5A554E] leading-normal line-clamp-2 font-semibold">
          {promo.description}
        </p>
      </div>
      <div className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[8px] text-[#5A554E] font-semibold">
        <span className="truncate max-w-[50%]">By {promo.organizer}</span>
        <span className="bg-[#EAE4CF]/40 text-[#2A2621] px-1.5 py-0.5 rounded text-[7px] font-bold">{promo.contactInfo}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-28 md:pb-12 space-y-6 text-[#2A2621] text-left">
      
      {/* ── Prominent Search Bar ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative shadow-sm rounded-2xl overflow-hidden bg-white border border-black/[0.06] focus-within:border-[#FD5C05] transition-all">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-[#5A554E]" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search events, organizations, promotions, services..."
            value={searchQuery}
            onFocus={() => setIsSearchActive(true)}
            onChange={e => setIsSearchActive(true) || setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-3.5 pl-11 pr-10 text-xs sm:text-sm text-[#2A2621] placeholder-[#5A554E]/60 focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5A554E] hover:text-[#FD5C05] text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        {isSearchActive && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchActive(false);
              searchInputRef.current?.blur();
            }}
            className="text-xs font-black uppercase tracking-wider text-[#5A554E] hover:text-[#FD5C05] transition-colors cursor-pointer shrink-0"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ── Dynamic Layout Transition ── */}
      <AnimatePresence mode="wait">
        {!isSearchActive ? (
          <motion.div
            key="discovery-feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Simple page title */}
            <div className="pt-1">
              <h1 className="text-xs font-black uppercase tracking-widest text-[#5A554E] pl-1">
                Explore Events
              </h1>
            </div>

            {/* 1. Trending Events */}
            <div className="space-y-2">
              {renderSectionHeader('Trending Events', 'Trending Events', <TrendingUp className="h-5 w-5" />, true)}
              {trendingEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {trendingEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No trending events available right now.</p>
              )}
            </div>

            {/* 2. Official Events */}
            <div className="space-y-2">
              {renderSectionHeader('Official Events', 'Official Events', <Building className="h-5 w-5" />, false)}
              {officialEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {officialEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No official school events scheduled.</p>
              )}
            </div>

            {/* 3. Student Events */}
            <div className="space-y-2">
              {renderSectionHeader('Student-led Activities', 'Student Events', <Users className="h-5 w-5" />, false)}
              {studentEvents.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {studentEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No student events scheduled right now.</p>
              )}
            </div>

            {/* 4. Campus Organizations */}
            <div className="space-y-2">
              {renderSectionHeader('Campus Organizations', 'Organizations', <Shield className="h-5 w-5" />, false)}
              {organizations.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {organizations.map(org => renderOrganizationCard(org))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No organizations found.</p>
              )}
            </div>

            {/* 5. Career & Networking */}
            <div className="space-y-2">
              {renderSectionHeader('Career & Networking', 'Career & Networking', <Briefcase className="h-5 w-5" />, false)}
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                {careerEvents.events.map(evt => renderEventCard(evt))}
                {careerEvents.promos.map(promo => renderPromotionCard(promo, 'Job'))}
                {careerEvents.events.length === 0 && careerEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No career opportunities listed.</p>
                )}
              </div>
            </div>

            {/* 6. Sports & Athletics */}
            <div className="space-y-2">
              {renderSectionHeader('Sports & Athletics', 'Sports', <Trophy className="h-5 w-5" />, false)}
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                {sportsEvents.events.map(evt => renderEventCard(evt))}
                {sportsEvents.promos.map(promo => renderPromotionCard(promo))}
                {sportsEvents.events.length === 0 && sportsEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No sports listings scheduled.</p>
                )}
              </div>
            </div>

            {/* 7. Music & Entertainment */}
            <div className="space-y-2">
              {renderSectionHeader('Music & Entertainment', 'Music & Entertainment', <Music className="h-5 w-5" />, false)}
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                {entertainmentEvents.events.map(evt => renderEventCard(evt))}
                {entertainmentEvents.promos.map(promo => renderPromotionCard(promo))}
                {entertainmentEvents.events.length === 0 && entertainmentEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No entertainment events listed.</p>
                )}
              </div>
            </div>

            {/* 8. Food & Deals */}
            <div className="space-y-2">
              {renderSectionHeader('Food & Campus Deals', 'Food & Deals', <Utensils className="h-5 w-5" />, true)}
              {foodDeals.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {foodDeals.map(promo => renderPromotionCard(promo))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No active food sales or campus deals found.</p>
              )}
            </div>

            {/* 9. Academic & Workshops */}
            <div className="space-y-2">
              {renderSectionHeader('Academic & Workshops', 'Academic & Workshops', <BookOpen className="h-5 w-5" />, false)}
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                {academicsWorkshops.events.map(evt => renderEventCard(evt))}
                {academicsWorkshops.promos.map(promo => renderPromotionCard(promo))}
                {academicsWorkshops.events.length === 0 && academicsWorkshops.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-2">No workshops scheduled.</p>
                )}
              </div>
            </div>

            {/* 10. Student Businesses & Services */}
            <div className="space-y-2">
              {renderSectionHeader('Student Businesses & Services', 'Student Businesses & Services', <Sparkles className="h-5 w-5" />, true)}
              {studentBusinesses.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth">
                  {studentBusinesses.map(promo => renderPromotionCard(promo, 'Entrepreneur'))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-2">No student businesses listed yet.</p>
              )}
            </div>
          </motion.div>
        ) : !searchQuery.trim() ? (
          /* ── Dedicated Trending Searches View ── */
          <motion.div
            key="trending-searches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 pt-1 text-left"
          >
            <h3 className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest pl-1">
              Trending Searches
            </h3>
            <div className="flex flex-col bg-white border border-black/[0.04] rounded-2xl overflow-hidden shadow-sm">
              {trendingSearches.map((term, index) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3.5 text-left transition-colors cursor-pointer group hover:bg-[#FD5C05]/5 ${
                    index !== trendingSearches.length - 1 ? 'border-b border-black/[0.03]' : ''
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5 text-[#FD5C05]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A2621] group-hover:text-[#FD5C05] transition-colors">
                    {term}
                  </span>
                </button>
              ))}
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
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
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
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Events</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {searchResults.events.map(evt => renderEventCard(evt, true))}
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
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Organizations</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {searchResults.orgs.map(org => renderOrganizationCard(org, true))}
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
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Promotions & Services</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {searchResults.promos.map(promo => renderPromotionCard(promo, undefined, true))}
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
                  <p className="text-xs text-[#5A554E] mt-1">Try checking spelling or searching for another keyword.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


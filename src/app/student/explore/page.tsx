'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DefaultEvidaFlyer from '@/components/ui/DefaultEvidaFlyer';
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
  const { events, promotions: allPromotions, organizations, saveToggle } = useEvents();
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

  const promotions = useMemo(() => allPromotions.filter((p: Promotion) => p.status === 'approved'), [allPromotions]);

  const approvedEvents = useMemo(() => events.filter(e => e.status === 'approved'), [events]);

  // ── Unified Search Matching ──
  const normalizeWord = (w: string) => {
    w = w.toLowerCase();
    if (w.startsWith('photograph')) return 'photo';
    if (w.startsWith('photo')) return 'photo';
    if (w.startsWith('tutor')) return 'tutor';
    if (w.startsWith('grad')) return 'grad';
    if (w.startsWith('academic')) return 'academ';
    if (w.startsWith('workshop')) return 'workshop';
    return w;
  };

  const matchQuery = (textFields: (string | undefined)[], query: string) => {
    if (!query) return true;
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean).map(normalizeWord);
    if (queryTerms.length === 0) return true;
    
    const normalizedText = textFields
      .map(f => (f || '').toLowerCase().split(/\s+/).filter(Boolean).map(normalizeWord).join(' '))
      .join(' ');

    return queryTerms.every(term => normalizedText.includes(term));
  };

  const searchResults = useMemo(() => {
    if (!searchQuery) return { events: [], orgs: [], promos: [] };
    
    const matchedEvents = approvedEvents.filter(e => 
      matchQuery([e.title, e.description, e.location, e.category], searchQuery)
    );

    const matchedOrgs = organizations.filter(org => 
      matchQuery([org.name, org.description], searchQuery)
    );

    const matchedPromos = promotions.filter(p => 
      matchQuery([p.title, p.description, p.category, p.organizer], searchQuery)
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

  const favoritedEvents = useMemo(() => {
    if (!currentUser) return [];
    return approvedEvents.filter(e =>
      e.savedBy?.includes(currentUser.name) ||
      (currentUser.username ? e.savedBy?.includes(currentUser.username) : false)
    );
  }, [approvedEvents, currentUser]);

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
    const acadEvts = approvedEvents.filter(e => 
      e.category?.toLowerCase() === 'academic' || 
      e.category?.toLowerCase() === 'workshops' || 
      e.category?.toLowerCase() === 'academic & workshops'
    );
    const acadPromos = promotions.filter(p => 
      (p.category as string) === 'tutoring' || 
      p.category === 'academic'
    );
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
    const isSaved = currentUser ? (evt.savedBy?.includes(currentUser.name) || (currentUser.username ? evt.savedBy?.includes(currentUser.username) : false)) : false;
    
    // Date formatting matching home page (Jul 26)
    const dateObj = new Date(evt.date + 'T00:00:00');
    const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = dateObj.getDate();
    const formattedDate = `${monthStr} ${dayNum}`;

    return (
      <motion.div
        key={evt.id}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${isGridItem ? 'w-full' : 'w-56 sm:w-64 shrink-0'} flex flex-col min-h-[270px] h-full`}
      >
        <Link
          href={`/events/${evt.id}`}
          className="w-full h-full bg-white border border-black/[0.06] hover:border-[#FD5C05] rounded-2xl overflow-hidden shadow-xs hover:shadow-[0_10px_24px_rgba(253,92,5,0.12)] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
        >
          <div className="aspect-[16/10] w-full bg-[#FD5C05]/10 shrink-0 relative overflow-hidden">
            {evt.coverImage.includes('from-') ? (
              <div className={`w-full h-full bg-gradient-to-br ${evt.coverImage} group-hover:scale-105 transition-transform duration-500`} />
            ) : (
              <img src={evt.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
            )}
            
            {/* Category Badge top left */}
            <span className="absolute top-2.5 left-2.5 text-[8px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10">
              {evt.category}
            </span>

            {/* Price Badge & Bookmark top right */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
              <span className="text-[7.5px] font-black uppercase tracking-wider bg-[#FD5C05] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                {evt.free ? 'FREE' : `$${evt.price || 'TICKETED'}`}
              </span>
              {currentUser && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    saveToggle(evt.id);
                  }}
                  className="cursor-pointer focus:outline-none p-0.5 group/btn"
                  title={isSaved ? "Unsave Event" : "Save Event"}
                >
                  <Bookmark 
                    className={`h-4 w-4 transition-all duration-150 ease-in-out ${
                      isSaved 
                        ? 'fill-[#FD5C05] text-[#FD5C05]' 
                        : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                    }`} 
                  />
                </button>
              )}
            </div>
          </div>
          <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#FD5C05] block">
                {formattedDate} • {evt.time || '7:00 PM'}
              </span>
              {/* Bulletproof title area: text-xs leading-snug fits 2 lines comfortably in min-h-[2.4rem] */}
              <div className="min-h-[2.4rem] flex items-start overflow-hidden pt-0.5">
                <h3 className="font-bold text-xs text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-snug line-clamp-2 text-left">
                  {evt.title}
                </h3>
              </div>
            </div>
            <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
              <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                <Users className="h-3.5 w-3.5 shrink-0 text-[#5A554E]" /> 
                <span className="truncate">{evt.organizationName || evt.organizer}</span>
              </span>
              <span className="flex items-center gap-0.5 shrink-0 font-black text-white bg-[#FD5C05] px-2 py-0.5 rounded-full text-[8.5px] uppercase shadow-xs">
                {evt.free ? 'FREE' : 'TICKETED'}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Helper to render organization cards
  const renderOrganizationCard = (org: Organization, isGridItem: boolean = false) => (
    <motion.div
      key={org.id}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`${isGridItem ? 'w-full' : 'w-56 sm:w-64 shrink-0'} flex flex-col min-h-[210px] h-full`}
    >
      <div
        onClick={() => router.push(`/student/organizations/${org.id}`)}
        className="w-full h-full bg-white border border-black/[0.06] hover:border-[#FD5C05] rounded-2xl p-4 shadow-xs hover:shadow-[0_10px_24px_rgba(253,92,5,0.12)] transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-2"
      >
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: org.logoColor || '#2A2621' }}
            >
              {org.name.substring(0, 2).toUpperCase()}
            </div>
            {org.verified && (
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#FD5C05] bg-[#FD5C05]/10 px-2 py-0.5 rounded-full border border-[#FD5C05]/20">
                <CheckCircle2 className="h-3 w-3 text-[#FD5C05]" /> Verified
              </span>
            )}
          </div>
          <div>
            <div className="min-h-[2.4rem] flex items-start overflow-hidden pt-0.5">
              <h3 className="font-bold text-xs text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-snug line-clamp-2 text-left">
                {org.name}
              </h3>
            </div>
            <p className="text-[10.5px] text-[#5A554E] line-clamp-2 leading-relaxed font-medium mt-1 text-left">
              {org.description}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-bold uppercase tracking-wider">
          <span>{org.members?.length || 0} members</span>
          <span className="text-[#FD5C05] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-black">
            View Profile <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );

  const getPromoImage = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('academic') || cat.includes('tutor') || cat.includes('calculus')) {
      return '/pexels-gu-ko-2150570603-31827067.jpg';
    }
    if (cat.includes('creative') || cat.includes('photo') || cat.includes('art')) {
      return '/pexels-yaroslav-shuraev-8513385.jpg';
    }
    if (cat.includes('food') || cat.includes('deal') || cat.includes('coffee')) {
      return '/pexels-cottonbro-5989925.jpg';
    }
    return '/pexels-rdne-7648057.jpg';
  };

  // Helper to render promotion cards
  const renderPromotionCard = (promo: Promotion, forceCategoryText?: string, isGridItem: boolean = false) => {
    const isSaved = currentUser ? (promo.savedBy?.includes(currentUser.name) || (currentUser.username ? promo.savedBy?.includes(currentUser.username) : false)) : false;
    const hasCustomFlyer = Boolean(promo.flyerImage || promo.image);

    return (
      <motion.div
        key={promo.id}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${isGridItem ? 'w-full' : 'w-56 sm:w-64 shrink-0'} flex flex-col min-h-[260px] h-full`}
      >
        <div
          onClick={() => {
            window.location.href = `mailto:${promo.contactInfo}?subject=Inquiry regarding: ${promo.title}`;
          }}
          className="w-full h-full bg-white border border-black/[0.06] hover:border-[#FD5C05] rounded-2xl overflow-hidden shadow-xs hover:shadow-[0_10px_24px_rgba(253,92,5,0.12)] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
        >
          <div className="aspect-[16/10] w-full bg-[#1E1B18] shrink-0 relative overflow-hidden">
            {hasCustomFlyer ? (
              <>
                <img src={promo.flyerImage || promo.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={promo.title} />
                <span className="absolute top-2.5 left-2.5 text-[8px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10">
                  {forceCategoryText || promo.category}
                </span>
              </>
            ) : (
              <DefaultEvidaFlyer category={forceCategoryText || promo.category} title={promo.title} />
            )}

            {promo.isFree !== undefined && (
              <span className={`absolute bottom-2.5 right-2.5 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${
                promo.isFree 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-[#FD5C05] text-white border-[#FD5C05]'
              }`}>
                {promo.isFree ? 'Gratuit' : (promo.price || 'Payant')}
              </span>
            )}

            {currentUser && (
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveToggle(promo.id);
                }}
                className="absolute top-2.5 right-2.5 z-20 cursor-pointer focus:outline-none p-0.5 group/btn"
                title={isSaved ? "Unsave Promotion" : "Save Promotion"}
              >
                <Bookmark 
                  className={`h-4 w-4 transition-all duration-150 ease-in-out ${
                    isSaved 
                      ? 'fill-[#FD5C05] text-[#FD5C05]' 
                      : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`} 
                />
              </button>
            )}
          </div>
          <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
            <div className="space-y-1 text-left">
              <span className="text-[#FD5C05] text-[9px] font-black uppercase tracking-wider block">
                Student Promo
              </span>
              <div className="min-h-[2.4rem] flex items-start overflow-hidden pt-0.5">
                <h3 className="font-bold text-xs text-[#2A2621] group-hover:text-[#FD5C05] transition-colors leading-snug line-clamp-2 text-left">
                  {promo.title}
                </h3>
              </div>
            </div>
            <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-[#5A554E] font-semibold">
              <span className="flex items-center gap-1 truncate max-w-[55%]">
                <Users className="h-3.5 w-3.5 shrink-0 text-[#5A554E]" /> 
                <span className="truncate">{promo.organizer}</span>
              </span>
              <span className="flex items-center gap-0.5 shrink-0 bg-[#EAE4CF]/60 text-[#2A2621] px-2 py-0.5 rounded-full text-[8.5px] font-extrabold truncate max-w-[45%]">
                {promo.contactInfo}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-20 md:pb-8 space-y-4 text-[#2A2621] text-left">
      
      {/* ── Prominent Search Bar ── */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 relative shadow-xs rounded-2xl overflow-hidden bg-white border border-black/[0.06] focus-within:border-[#FD5C05] transition-all">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#5A554E]" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search events, organizations, promotions, services..."
            value={searchQuery}
            onFocus={() => setIsSearchActive(true)}
            onChange={e => {
              setIsSearchActive(true);
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-transparent py-2.5 pl-10 pr-10 text-xs sm:text-sm text-[#2A2621] placeholder-[#5A554E]/60 focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5A554E] hover:text-[#FD5C05] text-[10px] font-bold uppercase tracking-wider cursor-pointer"
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
            className="space-y-5"
          >
            {/* Simple page title */}
            <div className="pt-0.5">
              <h1 className="text-[11px] font-black uppercase tracking-widest text-[#5A554E] pl-0.5">
                Explore Campus Events
              </h1>
            </div>

            {/* 1. Trending Events */}
            <div className="space-y-1.5">
              {renderSectionHeader('Trending Events', 'Trending Events', <TrendingUp className="h-4 w-4" />, true)}
              {trendingEvents.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {trendingEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No trending events available right now.</p>
              )}
            </div>

            {/* 2. Official Events */}
            <div className="space-y-1.5">
              {renderSectionHeader('Official Events', 'Official Events', <Building className="h-4 w-4" />, false)}
              {officialEvents.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {officialEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No official school events scheduled.</p>
              )}
            </div>

            {/* 3. Student Events */}
            <div className="space-y-1.5">
              {renderSectionHeader('Student-led Activities', 'Student Events', <Users className="h-4 w-4" />, false)}
              {studentEvents.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {studentEvents.map(evt => renderEventCard(evt))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No student events scheduled right now.</p>
              )}
            </div>

            {/* 4. Campus Organizations */}
            <div className="space-y-1.5">
              {renderSectionHeader('Campus Organizations', 'Organizations', <Shield className="h-4 w-4" />, false)}
              {organizations.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {organizations.map(org => renderOrganizationCard(org))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No organizations found.</p>
              )}
            </div>

            {/* 5. Career & Networking */}
            <div className="space-y-1.5">
              {renderSectionHeader('Career & Networking', 'Career & Networking', <Briefcase className="h-4 w-4" />, false)}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                {careerEvents.events.map(evt => renderEventCard(evt))}
                {careerEvents.promos.map(promo => renderPromotionCard(promo, 'Job'))}
                {careerEvents.events.length === 0 && careerEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-1">No career opportunities listed.</p>
                )}
              </div>
            </div>

            {/* 6. Sports & Athletics */}
            <div className="space-y-1.5">
              {renderSectionHeader('Sports & Athletics', 'Sports', <Trophy className="h-4 w-4" />, false)}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                {sportsEvents.events.map(evt => renderEventCard(evt))}
                {sportsEvents.promos.map(promo => renderPromotionCard(promo))}
                {sportsEvents.events.length === 0 && sportsEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-1">No sports listings scheduled.</p>
                )}
              </div>
            </div>

            {/* 7. Music & Entertainment */}
            <div className="space-y-1.5">
              {renderSectionHeader('Music & Entertainment', 'Music & Entertainment', <Music className="h-4 w-4" />, false)}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                {entertainmentEvents.events.map(evt => renderEventCard(evt))}
                {entertainmentEvents.promos.map(promo => renderPromotionCard(promo))}
                {entertainmentEvents.events.length === 0 && entertainmentEvents.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-1">No entertainment events listed.</p>
                )}
              </div>
            </div>

            {/* 8. Food & Deals */}
            <div className="space-y-1.5">
              {renderSectionHeader('Food & Campus Deals', 'Food & Deals', <Utensils className="h-4 w-4" />, true)}
              {foodDeals.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {foodDeals.map(promo => renderPromotionCard(promo))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No active food sales or campus deals found.</p>
              )}
            </div>

            {/* 9. Academic & Workshops */}
            <div className="space-y-1.5">
              {renderSectionHeader('Academic & Workshops', 'Academic & Workshops', <BookOpen className="h-4 w-4" />, false)}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                {academicsWorkshops.events.map(evt => renderEventCard(evt))}
                {academicsWorkshops.promos.map(promo => renderPromotionCard(promo))}
                {academicsWorkshops.events.length === 0 && academicsWorkshops.promos.length === 0 && (
                  <p className="text-xs text-[#5A554E] italic pl-1">No workshops scheduled.</p>
                )}
              </div>
            </div>

            {/* 10. Student Businesses & Services */}
            <div className="space-y-1.5">
              {renderSectionHeader('Student Businesses & Services', 'Student Businesses & Services', <Sparkles className="h-4 w-4" />, true)}
              {studentBusinesses.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none scroll-smooth">
                  {studentBusinesses.map(promo => renderPromotionCard(promo, 'Entrepreneur'))}
                </div>
              ) : (
                <p className="text-xs text-[#5A554E] italic pl-1">No student businesses listed yet.</p>
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
            className="space-y-3 pt-0.5 text-left"
          >
            <h3 className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest pl-1">
              Trending Searches
            </h3>
            <div className="flex flex-col bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-xs">
              {trendingSearches.map((term, index) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 text-left transition-colors cursor-pointer group hover:bg-[#FD5C05]/5 ${
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
          /* ── Search Results Layout (Responsive 5-column grid) ── */
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Search segment pill tags */}
            <div className="flex bg-white/80 border border-black/[0.06] rounded-2xl p-1 shadow-xs max-w-lg">
              {[
                { id: 'all' as const, label: 'All' },
                { id: 'events' as const, label: `Events (${searchResults.events.length})` },
                { id: 'orgs' as const, label: `Orgs (${searchResults.orgs.length})` },
                { id: 'promos' as const, label: `Promos (${searchResults.promos.length})` },
              ].map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setSearchTab(segment.id)}
                  className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    searchTab === segment.id
                      ? 'bg-[#2A2621] text-white shadow-xs'
                      : 'text-[#5A554E] hover:text-[#2A2621]'
                  }`}
                >
                  {segment.label}
                </button>
              ))}
            </div>

            {/* Results Grid display */}
            <div className="space-y-6">
              {/* Event results */}
              {(searchTab === 'all' || searchTab === 'events') && (
                searchResults.events.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Events</h3>
                    <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {searchResults.events.map(evt => renderEventCard(evt, true))}
                    </div>
                  </div>
                ) : searchTab === 'events' && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching events found.</p>
                  </div>
                )
              )}

              {/* Organization results */}
              {(searchTab === 'all' || searchTab === 'orgs') && (
                searchResults.orgs.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Organizations</h3>
                    <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {searchResults.orgs.map(org => renderOrganizationCard(org, true))}
                    </div>
                  </div>
                ) : searchTab === 'orgs' && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching organizations found.</p>
                  </div>
                )
              )}

              {/* Promotions/Businesses results */}
              {(searchTab === 'all' || searchTab === 'promos') && (
                searchResults.promos.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-[#2A2621] tracking-wider pl-1">Promotions & Services</h3>
                    <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {searchResults.promos.map(promo => renderPromotionCard(promo, undefined, true))}
                    </div>
                  </div>
                ) : searchTab === 'promos' && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-black/[0.04]">
                    <p className="text-xs text-[#5A554E]">No matching promos or student businesses found.</p>
                  </div>
                )
              )}

              {/* No results at all for "All" */}
              {searchTab === 'all' && 
               searchResults.events.length === 0 && 
               searchResults.orgs.length === 0 && 
               searchResults.promos.length === 0 && (
                <div className="bg-white rounded-2xl p-12 border border-black/[0.04] text-center max-w-md mx-auto">
                  <Compass className="h-10 w-10 text-[#FD5C05]/20 mx-auto mb-2" />
                  <h3 className="font-bold text-xs text-[#2A2621] uppercase">No results found</h3>
                  <p className="text-[11px] text-[#5A554E] mt-0.5">Try checking spelling or searching for another keyword.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


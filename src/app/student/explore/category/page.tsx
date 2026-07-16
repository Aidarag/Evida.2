'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEvents } from '@/lib/context/EventContext';
import Link from 'next/link';
import { 
  ChevronLeft, 
  SlidersHorizontal, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowUpDown, 
  Tag, 
  Shield, 
  Compass,
  Users
} from 'lucide-react';
import { Event, Organization, Promotion } from '@/lib/types';
import Button from '@/components/ui/Button';

function CategoryDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { events, organizations } = useEvents();

  const section = searchParams.get('section') || 'Trending Events';

  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [locationFilter, setLocationFilter] = useState<'all' | 'indoor' | 'outdoor' | 'offcampus'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [verifyFilter, setVerifyFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [promoCategoryFilter, setPromoCategoryFilter] = useState<string>('all');
  
  // Sort
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'name'>('views');

  // Sub-tab for mixed categories: 'events' | 'promotions'
  const [activeTab, setActiveTab] = useState<'events' | 'promotions'>('events');

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data.filter((p: Promotion) => p.status === 'approved') || []))
      .catch(() => {});
  }, []);

  const approvedEvents = useMemo(() => events.filter(e => e.status === 'approved'), [events]);

  // Determine section types & descriptions
  const sectionMeta = useMemo(() => {
    switch (section) {
      case 'Trending Events':
        return {
          title: 'Trending Events',
          description: 'The most viewed and highly anticipated activities happening around campus.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: false,
        };
      case 'Official Events':
        return {
          title: 'Official Events',
          description: 'University-sanctioned events, campus operations, and official assemblies.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: false,
        };
      case 'Student Events':
        return {
          title: 'Student Events',
          description: 'Club socials, tailgates, parties, and student-run initiatives.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: false,
        };
      case 'Organizations':
        return {
          title: 'Campus Organizations',
          description: 'Browse official student clubs, greek chapters, and academic societies.',
          hasEvents: false,
          hasOrgs: true,
          hasPromos: false,
        };
      case 'Career & Networking':
        return {
          title: 'Career & Networking',
          description: 'Find internship mixers, resume workshops, career fairs, and job postings.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: true,
        };
      case 'Sports':
        return {
          title: 'Sports & Athletics',
          description: 'Support the Blue Bears, play intramural tournaments, or find fitness groups.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: true,
        };
      case 'Music & Entertainment':
        return {
          title: 'Music & Entertainment',
          description: 'Live acoustic sessions, parties, fashion shows, and art exhibits.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: true,
        };
      case 'Food & Deals':
        return {
          title: 'Food & Deals',
          description: 'Student-run bake sales, local restaurant discounts, housing, and campus deals.',
          hasEvents: false,
          hasOrgs: false,
          hasPromos: true,
        };
      case 'Academic & Workshops':
        return {
          title: 'Academic & Workshops',
          description: 'Study sessions, peer tutoring, hackathons, and guest lectures.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: true,
        };
      case 'Student Businesses & Services':
        return {
          title: 'Student Businesses & Services',
          description: 'Support student entrepreneurs offering hair styling, photography, custom apparel, and more.',
          hasEvents: false,
          hasOrgs: false,
          hasPromos: true,
        };
      default:
        return {
          title: 'Explore',
          description: 'Discover events and opportunities at Livingstone.',
          hasEvents: true,
          hasOrgs: false,
          hasPromos: false,
        };
    }
  }, [section]);

  // Set default tab based on what contents are in section
  useEffect(() => {
    if (sectionMeta.hasEvents) {
      setActiveTab('events');
    } else if (sectionMeta.hasPromos) {
      setActiveTab('promotions');
    }
  }, [sectionMeta]);

  // 1. Gather Section Events
  const rawEvents = useMemo(() => {
    if (!sectionMeta.hasEvents) return [];
    
    switch (section) {
      case 'Trending Events':
        return [...approvedEvents].sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'Official Events':
        return approvedEvents.filter(e => e.ownershipType === 'school');
      case 'Student Events':
        return approvedEvents.filter(e => e.ownershipType === 'student' || e.ownershipType === 'organization');
      case 'Career & Networking':
        return approvedEvents.filter(e => e.category?.toLowerCase() === 'career' || e.category?.toLowerCase() === 'academic');
      case 'Sports':
        return approvedEvents.filter(e => e.category?.toLowerCase() === 'sports');
      case 'Music & Entertainment':
        return approvedEvents.filter(e => 
          e.category?.toLowerCase() === 'social' || 
          e.category?.toLowerCase() === 'creative' || 
          e.category?.toLowerCase() === 'greek'
        );
      case 'Academic & Workshops':
        return approvedEvents.filter(e => e.category?.toLowerCase() === 'academic');
      default:
        return approvedEvents;
    }
  }, [section, approvedEvents, sectionMeta]);

  // 2. Gather Section Organizations
  const rawOrgs = useMemo(() => {
    if (!sectionMeta.hasOrgs) return [];
    return organizations;
  }, [organizations, sectionMeta]);

  // 3. Gather Section Promotions/Services
  const rawPromos = useMemo(() => {
    if (!sectionMeta.hasPromos) return [];

    switch (section) {
      case 'Career & Networking':
        return promotions.filter(p => p.category === 'jobs');
      case 'Sports':
        return promotions.filter(p => p.category === 'sports');
      case 'Music & Entertainment':
        return promotions.filter(p => p.category === 'creative');
      case 'Food & Deals':
        return promotions.filter(p => p.category === 'food' || p.category === 'marketplace' || p.category === 'housing');
      case 'Academic & Workshops':
        return promotions.filter(p => (p.category as string) === 'tutoring' || p.category === 'academic');
      case 'Student Businesses & Services':
        return promotions.filter(p => p.category === 'beauty' || p.category === 'marketplace' || p.category === 'creative' || p.category === 'other');
      default:
        return promotions;
    }
  }, [section, promotions, sectionMeta]);

  // Apply filters & search to events
  const filteredEvents = useMemo(() => {
    return rawEvents.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' ? true : e.locationType === locationFilter;
      const matchesPrice = priceFilter === 'all' 
        ? true 
        : priceFilter === 'free' 
          ? e.free 
          : !e.free;

      return matchesSearch && matchesLocation && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [rawEvents, searchQuery, locationFilter, priceFilter, sortBy]);

  // Apply filters & search to organizations
  const filteredOrgs = useMemo(() => {
    return rawOrgs.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            org.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVerify = verifyFilter === 'all'
        ? true
        : verifyFilter === 'verified'
          ? org.verified
          : !org.verified;

      return matchesSearch && matchesVerify;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.views || 0) - (a.views || 0); // fallback views sort
    });
  }, [rawOrgs, searchQuery, verifyFilter, sortBy]);

  // Apply filters & search to promotions
  const filteredPromos = useMemo(() => {
    return rawPromos.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = promoCategoryFilter === 'all' ? true : p.category === promoCategoryFilter;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });
  }, [rawPromos, searchQuery, promoCategoryFilter, sortBy]);

  // Get distinct categories of promotions in this section for filter list
  const promoCategories = useMemo(() => {
    const categories = rawPromos.map(p => p.category);
    return ['all', ...Array.from(new Set(categories))];
  }, [rawPromos]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-12 space-y-6 text-[#2A2621] text-left">
      
      {/* ── Breadcrumb and Header ── */}
      <div className="space-y-4 border-b border-black/[0.04] pb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5A554E] hover:text-[#FD5C05] transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Explore
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {sectionMeta.title}
          </h1>
          <p className="text-sm font-semibold text-[#5A554E] mt-1.5 leading-relaxed">
            {sectionMeta.description}
          </p>
        </div>
      </div>

      {/* ── Sub tabs for mixed categories ── */}
      {sectionMeta.hasEvents && sectionMeta.hasPromos && (
        <div className="flex bg-white/70 border border-black/[0.04] rounded-2xl p-1 shadow-sm max-w-sm">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#2A2621] text-white shadow-sm'
                : 'text-[#5A554E] hover:text-[#2A2621]'
            }`}
          >
            Events ({filteredEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'promotions'
                ? 'bg-[#2A2621] text-white shadow-sm'
                : 'text-[#5A554E] hover:text-[#2A2621]'
            }`}
          >
            Deals & Services ({filteredPromos.length})
          </button>
        </div>
      )}

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white border border-black/[0.04] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Sub-search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-[#5A554E]" />
            </span>
            <input
              type="text"
              placeholder={`Search within ${sectionMeta.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#EAE4CF]/20 border border-black/[0.06] rounded-xl py-3 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E]/50 focus:outline-none focus:border-[#FD5C05] transition-all"
            />
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A554E] flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#FD5C05]" /> Sort By
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white border border-black/[0.06] rounded-xl py-2 px-3 text-xs font-bold text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
            >
              <option value="views">Popularity</option>
              <option value="name">Alphabetical</option>
              {activeTab === 'events' && <option value="date">Date</option>}
            </select>
          </div>
        </div>

        {/* Dynamic Filters depending on Tab/Section */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A554E] flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#FD5C05]" /> Filters
          </span>

          {/* EVENT FILTERS */}
          {sectionMeta.hasEvents && (!sectionMeta.hasPromos || activeTab === 'events') && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#5A554E] uppercase">Location:</span>
                <select
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value as any)}
                  className="bg-white border border-black/[0.06] rounded-lg py-1.5 px-2 text-[10px] font-bold"
                >
                  <option value="all">All Locations</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="offcampus">Off-Campus</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#5A554E] uppercase">Cost:</span>
                <select
                  value={priceFilter}
                  onChange={e => setPriceFilter(e.target.value as any)}
                  className="bg-white border border-black/[0.06] rounded-lg py-1.5 px-2 text-[10px] font-bold"
                >
                  <option value="all">All pricing</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </>
          )}

          {/* ORGANIZATIONS FILTERS */}
          {sectionMeta.hasOrgs && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-[#5A554E] uppercase">Status:</span>
              <select
                value={verifyFilter}
                onChange={e => setVerifyFilter(e.target.value as any)}
                className="bg-white border border-black/[0.06] rounded-lg py-1.5 px-2 text-[10px] font-bold"
              >
                <option value="all">All Orgs</option>
                <option value="verified">Verified Only 🛡️</option>
                <option value="unverified">General</option>
              </select>
            </div>
          )}

          {/* PROMOTIONS FILTERS */}
          {sectionMeta.hasPromos && (!sectionMeta.hasEvents || activeTab === 'promotions') && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-[#5A554E] uppercase">Type:</span>
              <select
                value={promoCategoryFilter}
                onChange={e => setPromoCategoryFilter(e.target.value)}
                className="bg-white border border-black/[0.06] rounded-lg py-1.5 px-2 text-[10px] font-bold"
              >
                {promoCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Services' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid Content Display ── */}
      <div className="pt-2">
        {/* RENDER EVENTS GRID */}
        {sectionMeta.hasEvents && (!sectionMeta.hasPromos || activeTab === 'events') && (
          filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  className="bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:border-[#FD5C05]/30 transition-all flex flex-col h-full relative group"
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
                      <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#5A554E]" /> {evt.date} • {evt.time}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#FD5C05]" /> {evt.location}</p>
                    </div>

                    <Link
                      href={`/events/${evt.id}`}
                      className="w-full text-center py-2.5 bg-[#2A2621] hover:bg-[#FD5C05] text-white hover:text-[#2A2621] rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-black/[0.04] text-center max-w-lg mx-auto">
              <Compass className="h-12 w-12 text-[#FD5C05]/20 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-[#2A2621] uppercase">No events found</h3>
              <p className="text-xs text-[#5A554E] mt-1">Try relaxing your search terms or choosing a different category filter.</p>
            </div>
          )
        )}

        {/* RENDER ORGANIZATIONS GRID */}
        {sectionMeta.hasOrgs && (
          filteredOrgs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredOrgs.map(org => (
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
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-black/[0.04] text-center max-w-lg mx-auto">
              <Users className="h-12 w-12 text-[#FD5C05]/20 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-[#2A2621] uppercase">No organizations found</h3>
              <p className="text-xs text-[#5A554E] mt-1">Try changing your search terms or filters.</p>
            </div>
          )
        )}

        {/* RENDER PROMOTIONS/DEALS GRID */}
        {sectionMeta.hasPromos && (!sectionMeta.hasEvents || activeTab === 'promotions') && (
          filteredPromos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPromos.map(promo => (
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
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-black/[0.04] text-center max-w-lg mx-auto">
              <Tag className="h-12 w-12 text-[#FD5C05]/20 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-[#2A2621] uppercase">No promotions found</h3>
              <p className="text-xs text-[#5A554E] mt-1">Check back later for new student businesses, deals, or services.</p>
            </div>
          )
        )}
      </div>

    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-center min-h-[50vh] text-left">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD5C05]" />
      </div>
    }>
      <CategoryDetailContent />
    </Suspense>
  );
}

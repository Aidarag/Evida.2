'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Compass, MapPin, Clock, Users, Star, Tag, Calendar } from 'lucide-react';
import { Event, Organization } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Livingstone College',
  'For You',
  'Clubs',
  'Greek Life',
  'Athletics',
  'Workshops',
  'Parties',
  'Tutoring',
  'Services'
];

export default function ExplorePage() {
  const { events, organizations } = useEvents();
  const router = useRouter();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSegment, setActiveSegment] = useState<'events' | 'orgs' | 'promos'>('events');

  // Promotions state
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(() => {});
  }, []);

  const approvedEvents = events.filter(e => e.status === 'approved');

  // ── Event Filters ──
  const filteredEvents = approvedEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Livingstone College') return matchesSearch && e.ownershipType === 'school';
    if (activeCategory === 'For You') return matchesSearch && e.ownershipType === 'student';
    
    // Category mapping
    return matchesSearch && e.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  // ── Organizations Filters ──
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          org.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Livingstone College') return matchesSearch && org.verified;
    if (activeCategory === 'For You') return matchesSearch && !org.verified;
    
    return matchesSearch;
  });

  // ── Promotions Filters ──
  const filteredPromos = promotions.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && p.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-[#2A2621] text-left">
      
      {/* ── Title Area ── */}
      <div className="border-b border-black/[0.04] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <Compass className="h-8 w-8 text-[#FD5C05]" />
          Explore Campus
        </h1>
        <p className="text-xs font-semibold text-[#5A554E] uppercase tracking-wider mt-1">
          Search and discover events, groups, and services at Livingstone College.
        </p>
      </div>

      {/* ── Search Input Block ── */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#5A554E]" />
        </span>
        <input
          type="text"
          placeholder="Search events, organizations, campus food sales, tutoring, tailgates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-black/[0.06] rounded-2xl py-4 pl-12 pr-4 text-sm text-[#2A2621] placeholder-[#5A554E]/50 focus:outline-none focus:border-[#FD5C05] shadow-sm transition-all"
        />
      </div>

      {/* ── Horizontal Scrollable Category Badges ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border shrink-0 transition-all cursor-pointer ${
              activeCategory === category
                ? 'bg-[#FD5C05] border-[#FD5C05] text-[#2A2621]'
                : 'bg-white border-black/[0.05] text-[#5A554E] hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ── Explore Segment Selector ── */}
      <div className="flex bg-white/70 border border-black/[0.04] rounded-2xl p-1 shadow-sm max-w-md">
        {[
          { id: 'events' as const, label: 'Events', count: filteredEvents.length },
          { id: 'orgs' as const, label: 'Organizations', count: filteredOrgs.length },
          { id: 'promos' as const, label: 'Promotions', count: filteredPromos.length },
        ].map(segment => (
          <button
            key={segment.id}
            onClick={() => setActiveSegment(segment.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSegment === segment.id
                ? 'bg-[#2A2621] text-white shadow-sm'
                : 'text-[#5A554E] hover:text-[#2A2621]'
            }`}
          >
            {segment.label} ({segment.count})
          </button>
        ))}
      </div>

      {/* ── Dynamic Content Grid ── */}
      <div className="pt-4">
        {/* TAB 1: EVENTS */}
        {activeSegment === 'events' && (
          filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  className="bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-sm hover:scale-[1.01] hover:border-[#FD5C05]/30 transition-all flex flex-col h-full relative"
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
                      <h3 className="font-extrabold text-sm text-[#2A2621] uppercase tracking-wide leading-tight line-clamp-2">
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
              <p className="text-xs text-[#5A554E] mt-1">Try relaxing your search terms or choosing a different category.</p>
            </div>
          )
        )}

        {/* TAB 2: ORGANIZATIONS */}
        {activeSegment === 'orgs' && (
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
              <p className="text-xs text-[#5A554E] mt-1">Try searching for other student groups or greek clubs.</p>
            </div>
          )
        )}

        {/* TAB 3: PROMOTIONS */}
        {activeSegment === 'promos' && (
          filteredPromos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredPromos.map(promo => (
                <div
                  key={promo.id}
                  className="bg-white border border-black/[0.04] rounded-3xl p-5 shadow-sm space-y-3 relative text-left"
                >
                  <span className="absolute top-5 right-5 text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-0.5 rounded">
                    {promo.category}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#2A2621] uppercase tracking-wide truncate w-[80%]">{promo.title}</h4>
                    <p className="text-xs text-[#5A554E] leading-relaxed font-semibold">{promo.description}</p>
                  </div>
                  <div className="pt-3 border-t border-black/[0.04] text-[9px] text-[#5A554E] font-semibold flex justify-between items-center">
                    <span>By {promo.organizer}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-[#2A2621]">{promo.contactInfo}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-black/[0.04] text-center max-w-lg mx-auto">
              <Tag className="h-12 w-12 text-[#FD5C05]/20 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-[#2A2621] uppercase">No promotions found</h3>
              <p className="text-xs text-[#5A554E] mt-1">Check back later for student food sales, tutoring, or photo services.</p>
            </div>
          )
        )}
      </div>

    </div>
  );
}

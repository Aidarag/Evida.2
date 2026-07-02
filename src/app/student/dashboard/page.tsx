'use client';

import React, { useState } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Bell, 
  ArrowRight, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Clock, 
  Plus,
  Compass,
  Trophy,
  Music,
  Wine,
  Cpu,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function StudentDashboardPage() {
  const { currentUser } = useUser();
  const { events, notifications, saveToggle } = useEvents();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Returns a safe URL for use in <img src>. Gradient class strings are not valid URLs.
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

  // Filter events
  const approvedEvents = events.filter(e => e.status === 'approved');
  const myRsvps = approvedEvents.filter(e => e.attendees.includes(currentUser.name));
  const unreadNotifs = notifications.filter(n => !n.read);

  // Search filtering
  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            event.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Split into featured and upcoming
  const featuredEvents = filteredEvents.slice(0, 3);
  const upcomingEvents = filteredEvents.slice(3, 8);

  const categories = [
    { name: 'All', icon: Compass, color: '#92D000', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop' },
    { name: 'Sports', icon: Trophy, color: '#22C55E', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&h=80&fit=crop' },
    { name: 'Music', icon: Music, color: '#92D000', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop' },
    { name: 'Parties', icon: Wine, color: '#92D000', img: 'https://images.unsplash.com/photo-1496337589254-7e19d01eae44?w=80&h=80&fit=crop' },
    { name: 'Workshops', icon: Cpu, color: '#92D000', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&h=80&fit=crop' },
    { name: 'Clubs', icon: GraduationCap, color: '#FFB800', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&h=80&fit=crop' }
  ];

  // Fallback icon helper
  function GraduationCap({ className }: { className?: string }) {
    return <span className={`font-bold ${className}`}>🎓</span>;
  }

  // Handle Join/RSVP click
  const handleRsvpClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto pb-28 md:pb-12">
      
      {/* 1. Header (Avatar + School Location Selector & Circular Actions) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-[#92D000] text-[#191919] flex items-center justify-center font-bold border-2 border-white shadow-md text-sm cursor-pointer hover:scale-102 transition-transform" onClick={() => router.push('/student/profile')}>
            {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-black text-[#191919] tracking-tight leading-none mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
              Yo {currentUser.name.split(' ')[0]}!
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#4F5666] uppercase tracking-wider">
              {currentUser.school}
            </span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Link href="/student/saved" className="h-11 w-11 rounded-full bg-white border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#191919] hover:bg-black/[0.02] transition-colors shadow-sm">
            <Heart className="h-4 w-4" />
          </Link>
          <Link href="/student/my-events" className="h-11 w-11 rounded-full bg-white border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#191919] hover:bg-black/[0.02] transition-colors shadow-sm relative">
            <Bell className="h-4 w-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#191919] border-2 border-white" />
            )}
          </Link>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7B8290]" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/[0.025] border border-black/[0.04] text-[#191919] placeholder-gray-400 rounded-full pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all"
          />
        </div>
        <Link href="/student/events" className="h-11 w-11 rounded-full bg-black/[0.025] border border-black/[0.04] flex items-center justify-center text-[#4F5666] hover:text-[#92D000] transition-colors shrink-0 cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
        </Link>
      </div>

      <div 
        className="relative rounded-[28px] overflow-hidden bg-[#191919] h-44 flex flex-col justify-end p-6 border border-black/[0.04] shadow-[var(--shadow-premium-md)] group cursor-pointer"
        onClick={() => router.push('/student/events')}
      >
        <div className="absolute inset-0 bg-[url('/pexels-hanna-elesha-abraham-1587801282-27498756.jpg')] bg-cover bg-center opacity-65 group-hover:scale-102 transition-transform duration-700 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
        
        <div className="relative z-10 space-y-2 text-left">
          <span className="bg-[#92D000]/90 backdrop-blur-sm text-[8px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-[0.2em] w-fit block mb-1">
            Featured Event
          </span>
          <h2 className="text-white font-extrabold text-lg sm:text-xl uppercase tracking-wide leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Upcoming Campus Live concert
          </h2>
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> October 15, 2026 • 8:00 PM
          </p>
        </div>
      </div>

      {/* 4. Categories horizontal row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Categories for you
          </h3>
          <Link href="/student/events" className="text-[11px] font-bold uppercase tracking-widest text-[#92D000] hover:text-[#d8ee2e] transition-colors">
            See all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-4 px-4">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center gap-2 shrink-0 snap-start cursor-pointer focus:outline-none"
              >
                {/* Clean icon container like mockup */}
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-[#92D000] text-[#191919] shadow-lg shadow-[#92D000]/20 border border-[#92D000]' 
                    : 'bg-black/[0.03] border border-black/[0.04] text-[#4F5666] hover:bg-black/5 hover:text-[#191919]'
                }`}>
                  <cat.icon className="h-4.5 w-4.5 stroke-[2.5]" />
                </div>
                <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#92D000]' : 'text-[#4F5666]'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Featured Events horizontal slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Featured Events
          </h3>
          <Link href="/student/events" className="text-[11px] font-bold uppercase tracking-widest text-[#92D000] hover:text-[#d8ee2e] transition-colors">
            See all
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-4 px-4">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => {
              const day = event.date.split('-')[2] || '10';
              const isSaved = event.savedBy?.includes(currentUser.name);
              
              return (
                <div 
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="relative w-56 h-72 shrink-0 snap-start rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  {/* Event Cover Image */}
                  <img 
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    src={getEventImg(event.coverImage, event.id)}
                    alt={event.title} 
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 z-20 flex justify-between items-center">
                    <span className="bg-black/35 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase px-2.5 py-1 rounded-full text-white tracking-widest">
                      {day} Oct
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveToggle(event.id);
                      }}
                      className={`h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all border ${
                        isSaved 
                          ? 'bg-[#92D000] border-[#92D000] text-[#191919]' 
                          : 'bg-black/30 border-white/10 text-white hover:bg-white hover:text-[#92D000]'
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Bottom Content Overlay */}
                  <div className="absolute bottom-4 inset-x-4 z-20 space-y-2 text-left">
                    {/* Avatars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        {[
                          { i: 'MC', bg: '#92D000', c: '#191919' },
                          { i: 'SJ', bg: '#191919', c: '#fff' },
                        ].map(av => (
                          <div key={av.i} className="h-4 w-4 rounded-full border border-white flex items-center justify-center text-[5px] font-extrabold" style={{ background: av.bg, color: av.c }}>{av.i}</div>
                        ))}
                      </div>
                      <span className="text-[7.5px] font-bold text-white/80 uppercase tracking-widest">
                        {event.attendees.length} Joined
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold text-[12px] text-white uppercase tracking-wide leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {event.title}
                    </h4>

                    {/* Meta info & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[8px] text-white/60 font-semibold tracking-wide truncate max-w-[100px]">
                        {event.location}
                      </span>
                      <button 
                        onClick={(e) => handleRsvpClick(event.id, e)}
                        className="bg-white hover:bg-white/90 text-black text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors shadow-sm cursor-pointer"
                      >
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-10 text-xs sm:text-sm text-[#7B8290] font-light">
              No events found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* 6. Upcoming Events list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Upcoming Events
          </h3>
          <Link href="/student/events" className="text-[11px] font-bold uppercase tracking-widest text-[#92D000] hover:text-[#d8ee2e] transition-colors">
            See all
          </Link>
        </div>

        <div className="space-y-3.5">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => {
              const day = event.date.split('-')[2] || '12';
              const isSaved = event.savedBy?.includes(currentUser.name);

              return (
                <div 
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-white border border-black/[0.04] hover:border-black/10 rounded-[22px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-center cursor-pointer relative"
                >
                  {/* Left Side: Thumbnail with heart indicator */}
                  <div className="relative h-18 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img className="h-full w-full object-cover" src={getEventImg(event.coverImage, event.id)} alt={event.title} />
                    
                    {/* Tiny heart save badge */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveToggle(event.id);
                      }}
                      className="absolute top-1 left-1 h-5.5 w-5.5 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#92D000] transition-all"
                    >
                      <Heart className={`h-3 w-3 ${isSaved ? 'fill-white text-white' : ''}`} />
                    </button>
                  </div>

                  {/* Right Side: Event Details */}
                  <div className="flex-1 flex justify-between items-end gap-3 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#92D000] uppercase tracking-wider block">
                        October {day}, 2026
                      </span>
                      <h4 className="font-extrabold text-[13px] text-[#191919] uppercase tracking-wide leading-tight line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>
                        {event.title}
                      </h4>
                      <p className="text-[10px] text-[#4F5666] font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 text-gray-400" /> {event.location}
                      </p>
                    </div>

                    {/* Join button */}
                    <button 
                      onClick={(e) => handleRsvpClick(event.id, e)}
                      className="bg-[#92D000] hover:bg-[#92D000]/90 text-[#191919] text-[8px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors shadow-md shadow-orange-500/10 cursor-pointer shrink-0"
                    >
                      Join Now
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-6 text-xs text-[#7B8290] font-light">
              Explore more upcoming events on campus.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Fallback image secure parser helper
function ptToHttp(url: string) {
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}

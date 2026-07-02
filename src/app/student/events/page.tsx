'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/student/EventCard';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Search, Compass, Shield, Users, GraduationCap, Megaphone, Calendar, MapPin, Mail, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Promotion } from '@/lib/types';

type OwnershipFilter = 'school' | 'organization' | 'student' | 'promotion';

export default function StudentEventsFeed() {
  const { events, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState<OwnershipFilter>('school');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [feedMode, setFeedMode] = useState<'grid' | 'tiktok'>('tiktok');
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const ownershipFilters: { id: OwnershipFilter; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'school', label: 'Official School Events', icon: Shield, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { id: 'organization', label: 'Organization Events', icon: Users, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    { id: 'student', label: 'Student Events', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'promotion', label: 'Promotions', icon: Megaphone, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  const categories = ['All', 'Academic', 'Career', 'Sports', 'Social', 'Culture', 'Arts', 'Volunteer', 'Networking'];

  // Prioritize Featured Event
  const getFeaturedEvent = () => {
    const approvedEvents = events.filter(e => e.status === 'approved');
    
    // 1. Official School Featured
    const schoolFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'school');
    if (schoolFeatured) return schoolFeatured;
    
    // 2. Organization Featured
    const orgFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'organization');
    if (orgFeatured) return orgFeatured;
    
    // 3. Student Featured
    const studentFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'student');
    if (studentFeatured) return studentFeatured;

    // Fallback to first available approved event based on ownership priority
    const schoolFallback = approvedEvents.find(e => e.ownershipType === 'school');
    if (schoolFallback) return schoolFallback;

    const orgFallback = approvedEvents.find(e => e.ownershipType === 'organization');
    if (orgFallback) return orgFallback;

    const studentFallback = approvedEvents.find(e => e.ownershipType === 'student');
    if (studentFallback) return studentFallback;

    return null;
  };

  const featuredEvent = getFeaturedEvent();

  // Category matching helper
  const matchesCategory = (item: Event | Promotion) => {
    if (selectedCategory === 'All') return true;

    const itemCat = item.category?.toLowerCase() || '';
    const selCat = selectedCategory.toLowerCase();

    // Map promotions to main categories
    if (!('ownershipType' in item)) {
      if (selCat === 'academic' && itemCat === 'tutoring') return true;
      if (selCat === 'arts' && itemCat === 'photography') return true;
      if (selCat === 'social' && (itemCat === 'food' || itemCat === 'initiative')) return true;
      if (selCat === 'volunteer' && itemCat === 'initiative') return true;
      if (selCat === 'career' && itemCat === 'tutoring') return true;
      return false;
    }

    // Direct event category match or sub-matches
    if (itemCat === selCat) return true;
    if (selCat === 'academic' && itemCat.includes('acad')) return true;
    if (selCat === 'career' && (itemCat.includes('career') || itemCat.includes('work'))) return true;
    if (selCat === 'social' && (itemCat.includes('social') || itemCat.includes('party') || itemCat.includes('homecoming') || itemCat.includes('greek'))) return true;
    if (selCat === 'culture' && itemCat.includes('cult')) return true;
    if (selCat === 'arts' && itemCat.includes('art')) return true;

    return false;
  };

  // Filtered items based on active selections
  const filteredItems: (Event | Promotion)[] = (() => {
    if (selectedOwnership === 'promotion') {
      return promotions.filter((promo) => {
        const matchesSearch = 
          promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch && matchesCategory(promo);
      });
    } else {
      return events.filter((e) => {
        if (e.status !== 'approved') return false;
        if (e.ownershipType !== selectedOwnership) return false;

        const matchesSearch = 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch && matchesCategory(e);
      });
    }
  })();

  const handleCardClick = (item: Event | Promotion) => {
    if ('ownershipType' in item) {
      router.push(`/events/${item.id}`);
    } else {
      setSelectedPromo(item as Promotion);
    }
  };

  const handleWebFeedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollTop / target.clientHeight);
    if (index >= 0 && index < filteredItems.length && index !== activeFeedIndex) {
      setActiveFeedIndex(index);
    }
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto ${feedMode === 'tiktok' && isMobile ? 'p-0 overflow-hidden' : 'p-6 md:p-10'}`}>
      {/* Search & Filter Header */}
      {!(feedMode === 'tiktok' && isMobile) && (
        <div className="space-y-4 py-4 -mx-6 px-6 md:mx-0 md:px-0 border-b border-black/[0.04]">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                Explore
              </h1>
              <p className="text-sm text-[#4F5666] mt-1">Discover what's happening around campus</p>
            </div>
            
            {/* View Mode Toggle - Immediately below the short description */}
            <div className="flex bg-black/[0.04] p-1 rounded-full border border-black/[0.04] shrink-0 w-fit">
              <button
                type="button"
                onClick={() => setFeedMode('tiktok')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  feedMode === 'tiktok' 
                    ? 'bg-[#191919] text-white shadow-sm' 
                    : 'text-[#4F5666] hover:text-[#191919]'
                }`}
              >
                Feed
              </button>
              <button
                type="button"
                onClick={() => setFeedMode('grid')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  feedMode === 'grid' 
                    ? 'bg-[#191919] text-white shadow-sm' 
                    : 'text-[#4F5666] hover:text-[#191919]'
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Conditional Filters: Only visible in Grid Mode */}
          {feedMode === 'grid' && (
            <div className="space-y-4 pt-2">
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search events, organizers, or keywords..."
                    className="pl-12 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 1: Organizer Filters */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// Organizer</span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                  {ownershipFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = selectedOwnership === filter.id;
                    return (
                      <motion.button
                        key={filter.id}
                        onClick={() => {
                          setSelectedOwnership(filter.id);
                          setSelectedCategory('All');
                        }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative shrink-0 flex items-center justify-center gap-2 px-4 py-2 h-9.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer select-none transition-all duration-200 ${
                          isActive
                            ? 'border-[#92D000] text-[#191919] shadow-md shadow-[#92D000]/10'
                            : 'border-black/[0.06] bg-black/[0.01] text-[#4F5666] hover:border-black/15'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeOrganizerBg"
                            className="absolute inset-0 bg-[#92D000] rounded-full z-0"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-[#191919]' : 'text-[#4F5666]'}`} />
                          <span className="relative z-10">{filter.label}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Category Filters */}
              <div className="space-y-3 pt-1">
                <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// Category</span>
                <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        whileHover={{ y: -1.5, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative shrink-0 px-5.5 py-2.5 h-9.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none transition-colors duration-200 ${
                          isActive
                            ? 'text-[#191919]'
                            : 'bg-black/[0.02] border border-black/[0.06] text-[#4F5666] hover:bg-black/[0.04] hover:text-[#191919]'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryBg"
                            className="absolute inset-0 bg-[#92D000] rounded-full z-0"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{cat}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Featured Hero (Only show in Grid mode if no search/filter applied and featured exists) */}
      {feedMode === 'grid' && featuredEvent && searchQuery === '' && selectedCategory === 'All' && selectedOwnership === 'school' && (
        <div 
          onClick={() => router.push(`/events/${featuredEvent.id}`)}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer group border border-black/[0.04] shadow-md"
        >
          <div className={`absolute inset-0 bg-gradient-to-tr ${featuredEvent.coverImage} opacity-45 group-hover:opacity-55 transition-opacity duration-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
          
          <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col items-start gap-3">
            <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Featured Official Event
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight line-clamp-3" style={{ fontFamily: 'var(--font-display)' }}>
              {featuredEvent.title}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-white" />
                {new Date(featuredEvent.date).toLocaleDateString()}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-white" />
                {featuredEvent.location}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid or TikTok Feed */}
      {feedMode === 'tiktok' ? (
        filteredItems.length > 0 ? (
          isMobile ? (
            /* MOBILE SCREEN-FILLING TIKTOK SWIPE FEED */
            <div className="fixed inset-0 z-40 bg-[#151515] flex flex-col justify-between w-screen h-screen overflow-hidden font-sans">
              
              {/* Floating Header Mode Toggle for Mobile TikTok Feed */}
              <div className="absolute top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
                <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shrink-0 shadow-lg pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => setFeedMode('tiktok')}
                    className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer bg-white text-[#191919] shadow"
                  >
                    Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedMode('grid')}
                    className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-white/80 hover:text-white"
                  >
                    Grid
                  </button>
                </div>
              </div>

              {/* Mobile Swipe Container */}
              <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center">
                {filteredItems.map((item) => {
                  const isSaved = 'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false;
                  const cover = 'ownershipType' in item ? item.coverImage : '/pexels-markus-winkler-1430818-12199407.jpg';
                  
                  const isGradient = cover ? cover.includes('from-') : false;
                  const bgClass = isGradient ? cover : '';
                  const bgStyle = (!isGradient && cover) ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                  
                  return (
                    <div 
                      key={`mobile-feed-${item.id}`}
                      className="snap-start shrink-0 h-screen w-full relative overflow-hidden flex flex-col justify-between p-6 pb-24 text-white bg-[#191919]"
                    >
                      <div 
                        className={`absolute inset-0 opacity-55 z-0 bg-cover bg-center ${bgClass}`}
                        style={bgStyle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55 z-10" />

                      {/* Top Segment spacing */}
                      <div className="relative z-20 flex justify-between items-center pt-20">
                        <span className="px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#92D000] text-[#191919] rounded-full border border-[#92D000]/20 shadow-sm">
                          {'ownershipType' in item ? item.category : 'Promotion'}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#92D000]/80">
                          {'ownershipType' in item ? item.ownershipType : 'Services'}
                        </span>
                      </div>

                      {/* Bottom segment and Right-side Action Column */}
                      <div className="relative z-20 flex items-end gap-4 mt-auto pb-4">
                        {/* Left: Info Details */}
                        <div className="flex-1 space-y-3.5 text-left">
                          <div className="space-y-2">
                            <div className="text-[#92D000] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {item.date} {('time' in item) && `• ${(item as any).time}`}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                              {item.title}
                            </h2>
                            <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                            <MapPin className="h-4 w-4 text-[#92D000]" />
                            <span className="truncate">{('location' in item) ? (item as any).location : (item as any).organizer}</span>
                          </div>

                          <div>
                            <Button 
                              variant="neon" 
                              size="sm" 
                              fullWidth
                              onClick={() => handleCardClick(item)}
                              className="h-10 shadow-lg shadow-[#92D000]/20 font-extrabold tracking-widest uppercase text-[10px]"
                            >
                              {'ownershipType' in item ? 'RSVP & Info' : 'Contact / Info'}
                            </Button>
                          </div>
                        </div>

                        {/* Right: Vertical TikTok Interaction Bar */}
                        <div className="flex flex-col gap-4 items-center pb-2">
                          {/* Heart Save Button */}
                          {'ownershipType' in item && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                saveToggle(item.id);
                              }}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                                <Heart className={`h-5 w-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                              </div>
                              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-300">{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                          )}

                          {/* Contact/Share Button (Mail) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if ('ownershipType' in item) {
                                window.location.href = `mailto:?subject=Check out this event: ${item.title}&body=Link: ${window.location.origin}/events/${item.id}`;
                              } else {
                                window.location.href = `mailto:${(item as any).contactInfo}?subject=Inquiry about: ${item.title}`;
                              }
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                              <Mail className="h-5 w-5" />
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-300">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TABLET / LAPTOP TIKTOK WEB SPLIT PLAYER VIEW */
            <div className="relative max-w-4xl mx-auto w-full h-[calc(100vh-16rem)] rounded-[32px] overflow-hidden border border-black/10 bg-[#191919] shadow-[var(--shadow-premium-xl)] flex flex-row">
              {/* Left Column: Visual Snap Player */}
              <div className="relative w-[380px] h-full shrink-0 overflow-hidden bg-black border-r border-white/5">
                <div 
                  onScroll={handleWebFeedScroll}
                  className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
                >
                  {filteredItems.map((item) => {
                    const cover = 'ownershipType' in item ? item.coverImage : '/pexels-markus-winkler-1430818-12199407.jpg';
                    const isGradient = cover ? cover.includes('from-') : false;
                    const bgClass = isGradient ? cover : '';
                    const bgStyle = (!isGradient && cover) ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                    
                    return (
                      <div 
                        key={`web-feed-left-${item.id}`} 
                        className="h-full w-full snap-start shrink-0 relative overflow-hidden flex flex-col justify-between p-8 text-white"
                      >
                        <div 
                          className={`absolute inset-0 opacity-45 z-0 bg-cover bg-center ${bgClass}`}
                          style={bgStyle}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10" />
                        
                        {/* Tags */}
                        <div className="relative z-20 flex justify-between items-center">
                          <span className="px-3.5 py-1.5 text-[8.5px] font-extrabold uppercase tracking-wider bg-[#92D000] text-[#191919] rounded-full border border-[#92D000]/20 shadow-sm">
                            {'ownershipType' in item ? item.category : 'Promotion'}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/80">
                            {'ownershipType' in item ? item.ownershipType : 'Services'}
                          </span>
                        </div>

                        {/* Title overlay */}
                        <div className="relative z-20 mt-auto text-left space-y-1.5">
                          <span className="text-[9px] text-[#92D000] font-black uppercase tracking-widest">// Swipe to scroll</span>
                          <h3 className="text-xl font-extrabold uppercase tracking-tight text-white line-clamp-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Synced Info Panel */}
              {(() => {
                const activeItem = filteredItems[activeFeedIndex];
                if (!activeItem) return null;
                const isSaved = 'ownershipType' in activeItem ? activeItem.savedBy?.includes(currentUser?.name || '') : false;

                return (
                  <div className="flex-1 h-full bg-[#18181b] p-8 flex flex-col justify-between text-white text-left">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#92D000] uppercase tracking-[0.2em] block">// Event Details</span>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                          {activeItem.title}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {/* Meta info boxes */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl space-y-1">
                            <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Date & Time</span>
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#92D000]" /> {activeItem.date} {('time' in activeItem) && `• ${(activeItem as any).time}`}
                            </span>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl space-y-1">
                            <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Location</span>
                            <span className="font-bold text-white flex items-center gap-1.5 truncate">
                              <MapPin className="h-3.5 w-3.5 text-[#92D000]" /> {('location' in activeItem) ? (activeItem as any).location : (activeItem as any).organizer}
                            </span>
                          </div>
                        </div>

                        {/* Description text */}
                        <div className="space-y-2">
                          <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Description</span>
                          <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-5 whitespace-pre-wrap">
                            {activeItem.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions and buttons */}
                    <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                      {'ownershipType' in activeItem && (
                        <button 
                          onClick={() => saveToggle(activeItem.id)}
                          className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-103 transition-all text-white shadow-md cursor-pointer"
                        >
                          <Heart className={`h-5 w-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          if ('ownershipType' in activeItem) {
                            window.location.href = `mailto:?subject=Check out this event: ${activeItem.title}&body=Link: ${window.location.origin}/events/${activeItem.id}`;
                          } else {
                            window.location.href = `mailto:${(activeItem as any).contactInfo}?subject=Inquiry about: ${activeItem.title}`;
                          }
                        }}
                        className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-103 transition-all text-white shadow-md cursor-pointer"
                      >
                        <Mail className="h-5 w-5" />
                      </button>

                      <Button 
                        variant="neon" 
                        size="lg" 
                        onClick={() => handleCardClick(activeItem)}
                        className="flex-1 h-12 shadow-lg shadow-[#92D000]/15 uppercase tracking-widest font-extrabold text-xs"
                      >
                        {'ownershipType' in activeItem ? 'RSVP & Info' : 'Contact Organizer'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      ) : (
        /* Original Grid view */
        filteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={item}
                    onClick={() => handleCardClick(item)}
                    isSaved={'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false}
                    onSave={'ownershipType' in item ? (e) => {
                      e.stopPropagation();
                      saveToggle(item.id);
                    } : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      )}

      {/* Custom Promotion Details Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPromo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-black/[0.06] rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
            >
              {/* Header Decorative Image Cover */}
              <div className="h-40 bg-gradient-to-tr from-purple-900 via-slate-900 to-violet-950 relative flex items-end p-6">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setSelectedPromo(null)}
                    className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Promotion Card
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {selectedPromo.title}
                  </h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {/* Category & Date */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#4F5666]">
                    <span className="bg-black/5 px-2.5 py-1 rounded-full text-[#191919] capitalize">
                      Category: {selectedPromo.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#92D000]" />
                      Posted: {new Date(selectedPromo.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">About this Promotion</h3>
                    <p className="text-sm text-[#4F5666] leading-relaxed whitespace-pre-wrap">
                      {selectedPromo.description}
                    </p>
                  </div>

                  {/* Organizer Contact Info */}
                  <div className="bg-black/5 border border-black/[0.04] p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organizer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#191919]">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-bold">{selectedPromo.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#4F5666]">
                        <Mail className="h-3.5 w-3.5 text-[#92D000] shrink-0" />
                        <span className="break-all">{selectedPromo.contactInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedPromo(null)}
                  >
                    Close
                  </Button>
                  <a 
                    href={`mailto:${selectedPromo.contactInfo}?subject=Inquiry about: ${selectedPromo.title}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#92D000] hover:bg-[#92D000]/90 text-[#191919] rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/10"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Organizer
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen TikTok overlay modal removed - TikTok mobile/web layouts are now rendered directly inline. */}
    </div>
  );
}

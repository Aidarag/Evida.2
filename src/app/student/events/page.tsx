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
import { Search, Compass, Shield, Users, GraduationCap, Megaphone, Calendar, MapPin, Mail, X } from 'lucide-react';
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

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Search & Filter Header */}
      <div className="space-y-6 sticky top-[120px] md:top-16 z-30 bg-[#08080B]/90 backdrop-blur-xl py-4 -mx-6 px-6 md:mx-0 md:px-0 border-b border-white/[0.04]">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore</h1>
            <p className="text-sm text-[#B8BBC8] mt-1">Discover what's happening around campus</p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B8BBC8]/50" />
              <Input
                placeholder="Search events, organizers, or keywords..."
                className="pl-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Row 1: Organizer Filters (Primary) */}
        <div className="space-y-3">
          <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] block pl-1">// Organizer</span>
          <div className="flex flex-wrap gap-3">
            {ownershipFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedOwnership === filter.id;
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => {
                    setSelectedOwnership(filter.id);
                    setSelectedCategory('All'); // Reset category filter on ownership change
                  }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`relative flex items-center justify-center gap-2.5 px-6 py-3 h-12 rounded-full text-xs font-extrabold uppercase tracking-widest border-2 cursor-pointer select-none transition-colors duration-200 ${
                    isActive
                      ? 'border-white text-[#08080B] shadow-[0_6px_25px_rgba(255,255,255,0.08)]'
                      : 'border-white/[0.08] bg-white/[0.01] text-[#B8BBC8] hover:border-white/20'
                  }`}
                >
                  {/* Sliding Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeOrganizerBg"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#08080B]' : 'text-[#B8BBC8]'}`} />
                    {filter.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Category Filters (Secondary) */}
        <div className="space-y-3 pt-1">
          <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] block pl-1">// Category</span>
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
                      ? 'text-[#08080B]'
                      : 'bg-white/[0.02] border border-white/[0.06] text-[#B8BBC8] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {/* Sliding Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[var(--color-evida-lime)] rounded-full z-0"
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

      {/* Featured Hero (Only show if no search/filter applied and featured exists) */}
      {featuredEvent && searchQuery === '' && selectedCategory === 'All' && selectedOwnership === 'school' && (
        <div 
          onClick={() => router.push(`/events/${featuredEvent.id}`)}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer group border border-white/[0.06] shadow-2xl"
        >
          <div className={`absolute inset-0 bg-gradient-to-tr ${featuredEvent.coverImage} opacity-45 group-hover:opacity-55 transition-opacity duration-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/50 to-transparent z-10" />
          
          <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col items-start gap-3">
            <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Featured Official Event
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {featuredEvent.title}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-[#B8BBC8]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(featuredEvent.date).toLocaleDateString()}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {featuredEvent.location}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredItems.length > 0 ? (
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
          icon={<Compass className="h-8 w-8 text-[#B8BBC8]" />}
          title="No events found"
          description="Try adjusting your search or category filters to discover campus activities."
        />
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
              className="bg-[#0D0D11] border border-white/[0.08] rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
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
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#B8BBC8]">
                    <span className="bg-white/5 px-2.5 py-1 rounded-full text-white capitalize">
                      Category: {selectedPromo.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[var(--color-evida-lime)]" />
                      Posted: {new Date(selectedPromo.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">About this Promotion</h3>
                    <p className="text-sm text-[#B8BBC8] leading-relaxed whitespace-pre-wrap">
                      {selectedPromo.description}
                    </p>
                  </div>

                  {/* Organizer Contact Info */}
                  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organizer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-bold">{selectedPromo.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#B8BBC8]">
                        <Mail className="h-3.5 w-3.5 text-purple-400 shrink-0" />
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
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
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
    </div>
  );
}

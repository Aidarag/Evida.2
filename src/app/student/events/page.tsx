'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/student/EventCard';
import Input from '@/components/ui/Input';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentEventsFeed() {
  const { events, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Social', 'Academic', 'Career', 'Sports', 'Culture', 'Greek Life', 'Club Events', 'Official School Events'];

  const exploreEvents = events.filter((e) => {
    if (e.status !== 'approved') return false;
    
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory || 
      (selectedCategory === 'Official School Events' && e.ownershipType === 'school') ||
      (selectedCategory === 'Club Events' && e.ownershipType === 'organization');

    return matchesSearch && matchesCategory;
  });

  const featuredEvent = events.find((e) => e.isFeatured && e.status === 'approved') || exploreEvents[0];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Search & Filter Header */}
      <div className="space-y-6 sticky top-[120px] md:top-16 z-30 bg-[#08080B]/90 backdrop-blur-xl py-4 -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Explore</h1>
            <p className="text-sm text-[#B8BBC8] mt-1">Discover what's happening around campus</p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B8BBC8]/50" />
              <Input
                placeholder="Search events, clubs, or locations..."
                className="pl-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Scrollable Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className="shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Featured Hero (Only show if no search/filter applied and featured exists) */}
      {featuredEvent && searchQuery === '' && selectedCategory === 'All' && (
        <div 
          onClick={() => router.push(`/events/${featuredEvent.id}`)}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer group border border-white/[0.06]"
        >
          <div className={`absolute inset-0 bg-gradient-to-tr ${featuredEvent.coverImage} opacity-40 group-hover:opacity-50 transition-opacity duration-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/40 to-transparent z-10" />
          
          <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col items-start gap-3">
            <span className="rounded-full bg-[#DAFB71] text-[#08080B] px-3 py-1 text-[10px] font-black uppercase tracking-wider">
              Featured Experience
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {featuredEvent.title}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-[#B8BBC8]">
              <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span>{featuredEvent.location}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {exploreEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {exploreEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard
                  event={event}
                  onClick={() => router.push(`/events/${event.id}`)}
                  isSaved={event.savedBy?.includes(currentUser?.name || '')}
                  onSave={(e) => {
                    e.stopPropagation();
                    saveToggle(event.id);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={<Compass className="h-8 w-8 text-[#B8BBC8]" />}
          title="No events found"
          description="Try adjusting your search or category filter to find what you're looking for."
        />
      )}
    </div>
  );
}

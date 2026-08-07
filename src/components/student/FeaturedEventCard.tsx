'use client';

import React from 'react';
import { Event } from '@/lib/types';
import { Calendar, Bookmark, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { downloadEventICS } from '@/lib/calendar';

interface FeaturedEventCardProps {
  event: Event;
  onClick: () => void;
}

export default function FeaturedEventCard({ event, onClick }: FeaturedEventCardProps) {
  const { saveToggle } = useEvents();
  const { currentUser } = useUser();

  const isSaved = currentUser 
    ? (event.savedBy?.includes(currentUser.name) || (currentUser.username ? event.savedBy?.includes(currentUser.username) : false)) 
    : false;

  // Parse the date to match the uppercase invite format (e.g. SUN, OCT 11)
  const dateObj = new Date(event.date);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const formattedDate = `${weekday}, ${month} ${day}`;

  const isGradient = event.coverImage ? event.coverImage.includes('from-') : false;
  const bgClass = isGradient ? event.coverImage : (event.coverImage ? '' : 'bg-[#D8D2BC]');
  const bgStyle = (!isGradient && event.coverImage) 
    ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  // Dynamic mock attendee count based on event title length
  const goingCount = 42 + (event.title.length * 3);

  const getCategoryStyles = (cat?: string) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('sport') || c.includes('athlet') || c.includes('trophy')) {
      return 'bg-[#FD5C05]/10 text-[#FD5C05] border-[#FD5C05]/15';
    }
    if (c.includes('music') || c.includes('concert') || c.includes('party') || c.includes('show') || c.includes('art') || c.includes('greek')) {
      return 'bg-[#D8D2BC]/30 text-[#2A2621] border-black/10';
    }
    if (c.includes('career') || c.includes('fair') || c.includes('workshop') || c.includes('hackathon') || c.includes('workshop') || c.includes('academic')) {
      return 'bg-[#FD5C05]/10 text-[#FD5C05] border-[#FD5C05]/15';
    }
    return 'bg-[#FD5C05]/10 text-[#FD5C05] border-[#FD5C05]/15';
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group flex flex-col bg-white rounded-[24px] overflow-hidden border border-black/[0.04] shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300 h-full justify-between relative"
    >
      {/* 1. Banner Image */}
      <div 
        onClick={onClick}
        className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 cursor-pointer"
      >
        <div 
          className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${bgClass}`}
          style={bgStyle}
        />
        
        {/* Category Badge top left */}
        <div className="absolute top-4 left-4 z-10 flex">
          <span className={`px-3.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full border shadow-sm backdrop-blur-sm ${getCategoryStyles(event.category)}`}>
            {event.category === 'Art' ? 'Exhibition' : event.category}
          </span>
        </div>
      </div>

      {/* 2. Interactive Save (Bookmark) Button - Floating top right */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          saveToggle(event.id);
        }}
        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-white/85 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#5A554E] hover:text-[#FD5C05] hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
        title={isSaved ? "Unsave Event" : "Save Event"}
      >
        <Bookmark 
          className={`h-4 w-4 transition-colors ${
            isSaved ? 'fill-[#FD5C05] text-[#FD5C05]' : 'text-[#5A554E]'
          }`} 
        />
      </button>

      {/* 3. Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 text-left">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          {/* Date & Time Invite Style (Orange, Uppercase) */}
          <div className="text-[#FD5C05] text-[10px] font-bold uppercase tracking-widest">
            {formattedDate} • {event.time}
          </div>

          {/* Event Title */}
          <h3 className="text-[#2A2621] font-bold text-lg line-clamp-2 leading-tight tracking-tight hover:text-[#FD5C05] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {event.title}
          </h3>
          
          {/* Location Row */}
          <div className="flex items-center gap-1.5 text-[#5A554E] text-xs font-semibold">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5A554E]" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-[#5A554E] text-xs leading-relaxed font-light line-clamp-2 pt-1">
            {event.description || `Join us for the ${event.title}, happening at ${event.location}.`}
          </p>
        </div>

        {/* 4. Invite Action Footer (Avatars + Compact Add to Calendar Button) */}
        <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between gap-2">
          {/* Attendee Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" 
                alt="Attendee" 
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                alt="Attendee" 
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" 
                alt="Attendee" 
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
              />
            </div>
            <span className="text-[#5A554E] text-[10px] font-bold whitespace-nowrap">
              +{goingCount} going
            </span>
          </div>

          {/* Compact Add to Calendar Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              try {
                downloadEventICS(event);
              } catch (error) {
                console.error('Error adding event to calendar:', error);
              }
            }}
            className="inline-flex items-center gap-1.5 bg-white border border-black/10 hover:border-transparent hover:bg-[#FD5C05] hover:text-[#2A2621] text-[#2A2621] font-bold text-[10px] uppercase tracking-wider py-1.5 px-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Calendar className="h-3.5 w-3.5" />
            Add to Calendar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

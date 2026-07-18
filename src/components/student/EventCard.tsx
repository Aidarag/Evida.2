'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Bookmark } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/context/EventContext';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface EventCardProps {
  event: Event | Promotion;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export default function EventCard({ event, onClick, onSave, isSaved = false }: EventCardProps) {
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  // Check if it's a promotion
  const isPromo = !('ownershipType' in event);

  // Set up cover image
  const coverImage = isPromo 
    ? '/pexels-markus-winkler-1430818-12199407.jpg' 
    : event.coverImage;

  const isGradient = coverImage ? coverImage.includes('from-') : false;
  const bgClass = isGradient ? coverImage : (coverImage ? '' : 'bg-[#D8D2BC]');
  const bgStyle = (!isGradient && coverImage) ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  // Parse the date to match the uppercase invite format (e.g. SUN, OCT 11)
  const dateObj = new Date(event.date);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const formattedDate = `${weekday}, ${month} ${day}`;

  const timeStr = !isPromo && (event as Event).time ? (event as Event).time : '7:00 PM';

  // Dynamic mock attendee count based on event title length
  const goingCount = 32 + (event.title.length * 2);

  const getCategoryStyles = (cat?: string) => {
    if (isPromo) return 'bg-[#FD5C05]/15 text-[#2A2621] border-[#FD5C05]/25';
    const c = cat?.toLowerCase() || '';
    if (c.includes('sport') || c.includes('athlet') || c.includes('trophy')) {
      return 'bg-[#FD5C05]/15 text-[#2A2621] border-[#FD5C05]/25';
    }
    if (c.includes('music') || c.includes('concert') || c.includes('party') || c.includes('show') || c.includes('art') || c.includes('greek')) {
      return 'bg-[#D8D2BC]/30 text-[#2A2621] border-black/10';
    }
    if (c.includes('career') || c.includes('fair') || c.includes('workshop') || c.includes('hackathon') || c.includes('academic')) {
      return 'bg-[#FD5C05]/15 text-[#2A2621] border-[#FD5C05]/25';
    }
    return 'bg-[#FD5C05]/15 text-[#2A2621] border-[#FD5C05]/25';
  };

  const { organizations } = useEvents();
  const isOrgVerified = !isPromo && (event as Event).organizationId
    ? organizations.find(o => o.id === (event as Event).organizationId)?.verified
    : false;

  const activeSaved = onSave ? isSaved : isSavedLocal;

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group flex flex-col bg-white rounded-[24px] overflow-hidden border border-black/[0.04] shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300 h-full justify-between relative"
    >
      {/* 1. Image Container */}
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
          <span className={`px-3.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full border shadow-sm backdrop-blur-sm ${getCategoryStyles(isPromo ? 'Promotion' : event.category)}`}>
            {isPromo ? 'Promotion' : event.category}
          </span>
        </div>
      </div>

      {/* 2. Interactive Save (Bookmark) Button - Floating top right */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onSave) {
            onSave(e);
          } else {
            setIsSavedLocal(!isSavedLocal);
          }
        }}
        className="absolute top-4 right-4 z-20 cursor-pointer focus:outline-none p-1 group"
        title={activeSaved ? "Unsave Event" : "Save Event"}
      >
        <Bookmark 
          className={`h-5 w-5 transition-all duration-150 ease-in-out ${
            activeSaved 
              ? 'fill-[#FD5C05] text-[#FD5C05]' 
              : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
          }`} 
        />
      </button>

      {/* 3. Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 text-left">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          {/* Date & Time Invite Style (Dark Green, Uppercase) */}
          <div className="text-[#2A2621]/85 text-[10px] font-bold uppercase tracking-widest">
            {formattedDate} • {timeStr}
          </div>

          {/* Organization Name with rosette badge */}
          {!isPromo && (event as Event).organizationName && (
            <div className="flex items-center gap-1 text-[10px] text-[#5A554E] font-bold uppercase tracking-wider">
              <span>{(event as Event).organizationName}</span>
              {isOrgVerified && <VerifiedBadge className="h-3.5 w-3.5" />}
            </div>
          )}

          {/* Event Title */}
          <h3 className="text-[#2A2621] font-bold text-lg line-clamp-2 leading-tight tracking-tight hover:text-[#2A2621]/80 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {event.title}
          </h3>
          
          {/* Location Row */}
          <div className="flex items-center gap-1.5 text-[#5A554E] text-xs font-semibold">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5A554E]" />
            <span className="truncate">{isPromo ? (event as Promotion).organizer : (event as Event).location}</span>
          </div>

          {/* Description */}
          <p className="text-[#5A554E] text-xs leading-relaxed font-light line-clamp-2 pt-1">
            {event.description || `Join us for the ${event.title}, happening soon.`}
          </p>
        </div>

        {/* 4. Invite Action Footer (Avatars + Compact Add to Calendar Button) */}
        <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between gap-2">
          {/* Attendee Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                { initials: 'MC', bg: '#FD5C05', color: '#2A2621' },
                { initials: 'SJ', bg: '#2A2621', color: '#fff' },
                { initials: 'AR', bg: '#5A554E', color: '#fff' },
              ].map((av) => (
                <div
                  key={av.initials}
                  className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-extrabold shrink-0"
                  style={{ background: av.bg, color: av.color }}
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <span className="text-[#5A554E] text-[10px] font-bold whitespace-nowrap">
              +{goingCount} going
            </span>
          </div>

          {/* Compact Add to Calendar Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
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

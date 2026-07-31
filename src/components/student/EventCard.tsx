'use client';

import React from 'react';
import { MapPin, Calendar, Bookmark } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface EventCardProps {
  event: Event | Promotion;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  onRsvp?: (e: React.MouseEvent) => void;
  isAttending?: boolean;
}

export default function EventCard({ event, onClick, onSave, isSaved, onRsvp, isAttending = false }: EventCardProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const { saveToggle, organizations } = useEvents();
  const { currentUser } = useUser();

  // Compute effective saved state if not explicitly passed
  const effectiveIsSaved = isSaved !== undefined 
    ? isSaved 
    : (currentUser ? (event.savedBy?.includes(currentUser.name) || (currentUser.username ? event.savedBy?.includes(currentUser.username) : false)) : false);

  // Check if it's a promotion
  const isPromo = !('ownershipType' in event);

  // Set up cover image
  const coverImage = isPromo
    ? '/pexels-markus-winkler-1430818-12199407.jpg'
    : event.coverImage;

  const isGradient = coverImage ? coverImage.includes('from-') : false;
  const bgClass = isGradient ? coverImage : (coverImage ? '' : 'bg-[#D8D2BC]');
  const bgStyle = (!isGradient && coverImage) ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  // Parse the date
  const dateObj = new Date(event.date + 'T00:00:00');
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const formattedDate = `${weekday}, ${month} ${day}`;

  const timeStr = !isPromo && (event as Event).time ? (event as Event).time : '7:00 PM';

  // Real attendee count
  const goingCount = !isPromo ? ((event as Event).attendees?.length ?? 0) : 0;

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

  const isOrgVerified = !isPromo && (event as Event).organizationId
    ? organizations.find(o => o.id === (event as Event).organizationId)?.verified
    : false;

  // ICS download helper
  const handleDownloadICS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPromo) { onClick(); return; }
    const evt = event as Event;
    const cleanTitle = evt.title.replace(/[^\w\s-]/gi, '');
    const cleanDesc = (evt.description || '').replace(/[^\w\s-]/gi, '');
    const cleanLoc = (evt.location || 'Campus').replace(/[^\w\s-]/gi, '');
    const dateStr = (evt.date || '').replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Evida//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${evt.id}@evida.app`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLoc}`,
      `DTSTART:${dateStr}T190000`,
      `DTEND:${dateStr}T210000`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <span className={`px-3.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full border shadow-sm backdrop-blur-sm ${getCategoryStyles(isPromo ? 'Promotion' : (event as Event).category)}`}>
            {isPromo ? 'Promotion' : (event as Event).category}
          </span>
        </div>
      </div>

      {/* 2. Interactive Save (Bookmark) Button - Floating top right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSaveLoading(true);
          if (onSave) {
            onSave(e);
          } else {
            saveToggle(event.id);
          }
          setTimeout(() => setSaveLoading(false), 300);
        }}
        className="absolute top-4 right-4 z-20 cursor-pointer focus:outline-none p-1 group"
        disabled={saveLoading}
        title={effectiveIsSaved ? 'Unsave Event' : 'Save Event'}
      >
        <Bookmark
          className={`h-5 w-5 transition-all duration-150 ease-in-out ${
            effectiveIsSaved
              ? 'fill-[#FD5C05] text-[#FD5C05]'
              : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
          }`} 
          aria-pressed={effectiveIsSaved}
          aria-label={effectiveIsSaved ? 'Unsave Event' : 'Save Event'}
        />
      </button>

      {/* 3. Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 text-left">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          {/* Date & Time */}
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

        {/* 4. Footer */}
        <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between gap-2">
          {/* Attendee count */}
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
              {goingCount > 0 ? `+${goingCount} going` : 'Be the first'}
            </span>
          </div>

          {/* Action button — RSVP if onRsvp provided, else ICS download */}
          {onRsvp ? (
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRsvp) {
                    setRsvpLoading(true);
                    onRsvp(e);
                    setTimeout(() => setRsvpLoading(false), 300);
                  }
                }}
                className={`inline-flex items-center gap-1.5 border font-bold text-[10px] uppercase tracking-wider py-1.5 px-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap ${
                  isAttending
                    ? 'bg-[#FD5C05] text-[#2A2621] border-[#FD5C05]'
                    : 'bg-white border-black/10 hover:border-transparent hover:bg-[#FD5C05] hover:text-[#2A2621] text-[#2A2621]'
                }`}
                aria-pressed={isAttending}
                aria-label={isAttending ? 'Cancel RSVP' : 'RSVP'}
                disabled={rsvpLoading}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {isAttending ? 'Going ✓' : rsvpLoading ? 'Processing…' : 'RSVP'}
              </button>
          ) : (
            <button
              onClick={handleDownloadICS}
              className="inline-flex items-center gap-1.5 bg-white border border-black/10 hover:border-transparent hover:bg-[#FD5C05] hover:text-[#2A2621] text-[#2A2621] font-bold text-[10px] uppercase tracking-wider py-1.5 px-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Calendar className="h-3.5 w-3.5" />
              Add to Calendar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

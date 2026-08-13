'use client';

import React from 'react';
import { MapPin, Calendar, Bookmark, Check, CheckCircle, Mail, X } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { downloadEventICS } from '@/lib/calendar';

interface EventCardProps {
  event: Event | Promotion;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  onRsvp?: (e: React.MouseEvent) => void;
  isAttending?: boolean;
}

// 1. Presentational Component wrapped with React.memo
const EventCardInner = React.memo(function EventCardInner({
  event,
  onClick,
  onSave,
  isSaved,
  onRsvp,
  isAttending = false,
  effectiveIsSaved,
  effectiveIsAttending,
  isOrgVerified,
  saveToggle,
  rsvpToggle,
}: EventCardProps & {
  effectiveIsSaved: boolean;
  effectiveIsAttending: boolean;
  isOrgVerified: boolean;
  saveToggle: (id: string) => void;
  rsvpToggle: (id: string, action: 'rsvp' | 'interested') => void;
}) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

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
  // Parse the date
  const dateObj = new Date(event.date + 'T00:00:00');
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const day = dateObj.getDate();
  const formattedDate = `${month} ${day}`;

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

  // ICS download helper
  const handleDownloadICS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPromo) { onClick(); return; }
    try {
      downloadEventICS(event as Event);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
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
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className={`px-3 py-1 text-[9px] font-extrabold tracking-wider uppercase rounded-full border shadow-sm backdrop-blur-sm ${getCategoryStyles(isPromo ? 'Promotion' : (event as Event).category)}`}>
            {isPromo ? 'Promotion' : (event as Event).category}
          </span>
        </div>

        {/* Pricing Badge & Bookmark top right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {!isPromo && (
            <span className="px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-[#FD5C05] text-white rounded-full shadow-sm">
              {(event as Event).free ? 'FREE' : `$${(event as Event).price || 'TICKETED'}`}
            </span>
          )}
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
            className="cursor-pointer focus:outline-none p-1 group"
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
        </div>
      </div>

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
          <h3 className="text-[#2A2621] font-bold text-base sm:text-lg line-clamp-2 leading-snug tracking-tight hover:text-[#FD5C05] transition-colors block">
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

          {/* Action buttons - RSVP going and calendar download */}
          {!isPromo ? (
            <div className="flex gap-1.5">
              {effectiveIsAttending ? (
                <>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (onRsvp) {
                        onRsvp(e);
                      } else {
                        await rsvpToggle(event.id, 'rsvp');
                      }
                    }}
                    className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
                    title="Added to Calendar"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>Added</span>
                  </button>
                  {(new Date(event.date + 'T23:59:59') < new Date()) ? (
                    <span 
                      className="inline-flex items-center gap-1 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-full shadow-sm whitespace-nowrap cursor-default"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <Check className="h-3 w-3 shrink-0 text-white" />
                      <span>Attended</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setRsvpLoading(true);
                        if (onRsvp) {
                          onRsvp(e);
                        } else {
                          await rsvpToggle(event.id, 'rsvp');
                        }
                        setRsvpLoading(false);
                      }}
                      className="inline-flex items-center gap-1 bg-[#FD5C05] hover:bg-red-600 border border-[#FD5C05] hover:border-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1.5 px-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap group/going"
                      title="Click to Cancel RSVP"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <Check className="h-3 w-3 shrink-0 group-hover/going:hidden text-white" />
                      <X className="h-3 w-3 shrink-0 hidden group-hover/going:block text-white" />
                      <span className="group-hover/going:hidden">Going</span>
                      <span className="hidden group-hover/going:inline">Cancel</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setRsvpLoading(true);
                    if (onRsvp) {
                      onRsvp(e);
                    } else {
                      await rsvpToggle(event.id, 'rsvp');
                    }
                    setRsvpLoading(false);
                  }}
                  className="inline-flex items-center gap-1 bg-white border border-black/10 hover:border-transparent hover:bg-[#FD5C05] hover:text-white text-[#2A2621] font-bold text-[9px] uppercase tracking-wider py-1.5 px-4 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
                  disabled={rsvpLoading}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{rsvpLoading ? '...' : 'RSVP'}</span>
                </button>
              )}
            </div>
          ) : (
            <a
              href={`mailto:${(event as Promotion).contactInfo}?subject=Inquiry regarding: ${event.title}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 bg-white border border-black/10 hover:border-transparent hover:bg-[#FD5C05] hover:text-[#2A2621] text-[#2A2621] font-bold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>Email Organizer</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// 2. Outer wrapper subscribing to contexts
export default function EventCard(props: EventCardProps) {
  const { event, isSaved, isAttending } = props;
  const { saveToggle, rsvpToggle, events, organizations } = useEvents();
  const { currentUser } = useUser();

  // Compute effective states from up-to-date context
  const dbEvent = events.find(e => e.id === event.id);

  const effectiveIsSaved = dbEvent && currentUser
    ? (dbEvent.savedBy?.includes(currentUser.name) || (currentUser.username ? dbEvent.savedBy?.includes(currentUser.username) : false))
    : (isSaved !== undefined ? isSaved : false);

  const effectiveIsAttending = dbEvent && currentUser
    ? (dbEvent.attendees?.includes(currentUser.name) || (currentUser.username ? dbEvent.attendees?.includes(currentUser.username) : false))
    : (isAttending !== undefined ? isAttending : false);

  // Check if it's a promotion
  const isPromo = !('ownershipType' in event);

  const isOrgVerified = !isPromo && (event as Event).organizationId
    ? organizations.find(o => o.id === (event as Event).organizationId)?.verified || false
    : false;

  return (
    <EventCardInner
      {...props}
      effectiveIsSaved={!!effectiveIsSaved}
      effectiveIsAttending={!!effectiveIsAttending}
      isOrgVerified={!!isOrgVerified}
      saveToggle={saveToggle}
      rsvpToggle={rsvpToggle}
    />
  );
}

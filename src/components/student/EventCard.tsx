'use client';

import React, { useState } from 'react';
import { Bookmark, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';
import { motion } from 'framer-motion';
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
  className?: string;
}

// 1. Presentational Component implementing CSS Grid Card Architecture (170px image, 150px content, 50px footer = 370px total)
const EventCardInner = React.memo(function EventCardInner({
  event,
  onClick,
  onSave,
  isSaved,
  effectiveIsSaved,
  isOrgVerified,
  saveToggle,
  className = '',
}: EventCardProps & {
  effectiveIsSaved: boolean;
  effectiveIsAttending: boolean;
  isOrgVerified: boolean;
  saveToggle: (id: string) => void;
  rsvpToggle: (id: string, action: 'rsvp' | 'interested') => void;
}) {
  const [saveLoading, setSaveLoading] = useState(false);

  const isPromo = !('ownershipType' in event);

  // Cover image with fallback
  const coverImage = isPromo
    ? '/pexels-markus-winkler-1430818-12199407.jpg'
    : (event.coverImage || '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg');

  const isGradient = coverImage ? coverImage.includes('from-') : false;
  const bgClass = isGradient ? coverImage : '';
  const bgStyle = (!isGradient && coverImage)
    ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  // Date & Time (OCT 9 • 18:00)
  const dateObj = new Date(event.date + 'T00:00:00');
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const rawDateStr = `${month} ${day}`;
  const timeStr = !isPromo && (event as Event).time ? (event as Event).time : '18:00';
  const fullDateTime = `${rawDateStr} • ${timeStr}`.substring(0, 22);

  // Category Badge (Max 16 characters)
  const rawCategory = isPromo ? 'Promotion' : ((event as Event).category || 'Social');
  const categoryText = rawCategory.toUpperCase().substring(0, 16);

  // Price Badge (Max 8 characters)
  const priceText = !isPromo
    ? ((event as Event).free ? 'FREE' : `$${(event as Event).price || 'TICKETED'}`).substring(0, 8)
    : 'PROMO';

  // Organization Name (Max 30 characters)
  const orgNameRaw = !isPromo
    ? ((event as Event).organizationName || (event as Event).organizer || 'Campus Org')
    : (event as Promotion).organizer;
  const orgName = orgNameRaw ? orgNameRaw.substring(0, 30) : '';

  // Title text & Description text
  const titleText = event.title;
  const descriptionText = (event.description || '').substring(0, 90);
  const locationText = !isPromo ? ((event as Event).location || 'Campus Center') : 'Campus Wide';

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`event-card group bg-white rounded-[16px] overflow-hidden border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-300 w-full sm:w-[300px] shrink-0 h-[385px] min-h-[385px] max-h-[385px] grid grid-rows-[165px_170px_50px] relative select-none cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 1. IMAGE WRAPPER (Row 1: 165px) */}
      <div className="event-card__image-wrapper relative w-full h-[165px] overflow-hidden bg-gray-100">
        <div
          className={`event-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${bgClass}`}
          style={bgStyle}
        />

        {/* Category Badge top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-white rounded-full border border-white/10 shadow-xs max-w-[120px] truncate block">
            {categoryText}
          </span>
        </div>

        {/* Price Badge & Bookmark top right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-[#FD5C05] text-white rounded-full shadow-xs shrink-0 max-w-[65px] truncate">
            {priceText}
          </span>
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
            className="cursor-pointer focus:outline-none p-0.5 group/save shrink-0"
            disabled={saveLoading}
            title={effectiveIsSaved ? 'Unsave Event' : 'Save Event'}
          >
            <Bookmark
              className={`h-4 w-4 transition-all duration-150 ease-in-out ${
                effectiveIsSaved
                  ? 'fill-[#FD5C05] text-[#FD5C05]'
                  : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. CONTENT WRAPPER (Row 2: 170px - Date, Title, Description & Location metadata) */}
      <div className="event-card__content p-4 overflow-hidden flex flex-col justify-between text-left min-h-0">
        <div className="space-y-1.5 min-h-0">
          {/* Date / Time */}
          <div className="event-card__date text-[10.5px] leading-tight font-bold text-[#FD5C05] uppercase tracking-wider truncate block">
            {fullDateTime}
          </div>

          {/* Title (2 lines max, clean 20px leading, no clipping) */}
          <h3
            className="event-card__title text-[#2A2621] font-bold text-[16px] leading-[20px] tracking-tight group-hover:text-[#FD5C05] transition-colors line-clamp-2 block w-full text-left"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              fontFamily: 'var(--font-display)',
            }}
          >
            {titleText}
          </h3>

          {/* Light Description (2 lines max, clean 15px leading) */}
          <p
            className="text-[10.5px] leading-[15px] font-semibold text-[#5A554E]/80 line-clamp-2 block w-full text-left"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {descriptionText || 'Join us for this upcoming campus activity and experience.'}
          </p>
        </div>

        {/* Location & Metadata Bar */}
        <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-[#5A554E] pt-2 border-t border-black/[0.04] mt-1 shrink-0">
          <span className="flex items-center gap-1 bg-[#F8F6F0] px-2 py-0.5 rounded-md border border-black/[0.04] truncate max-w-[160px]">
            <MapPin className="h-3 w-3 text-[#FD5C05] shrink-0" />
            <span className="truncate">{locationText}</span>
          </span>
          {!isPromo && (event as Event).attendees && (event as Event).attendees.length > 0 && (
            <span className="flex items-center gap-1 bg-[#F8F6F0] px-2 py-0.5 rounded-md border border-black/[0.04] shrink-0">
              <Users className="h-3 w-3 text-[#5A554E] shrink-0" />
              <span>{(event as Event).attendees.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. FOOTER (Row 3: 50px - Independent Grid row with View Event CTA) */}
      <div className="event-card__footer h-[50px] px-[18px] flex items-center justify-between border-t border-black/[0.06] min-w-0">
        {/* Organization Name */}
        <div className="event-card__organization flex-1 min-w-0 text-[11px] leading-[14px] font-bold text-[#5A554E] whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1 pr-2">
          <span className="truncate">{orgName}</span>
          {isOrgVerified && <VerifiedBadge className="h-3.5 w-3.5 shrink-0 text-[#FD5C05]" />}
        </div>

        {/* View Event Action CTA Button Link (Replaces duplicate FREE badge!) */}
        <div className="event-card__action shrink-0 flex items-center gap-1 text-[10.5px] font-black uppercase tracking-wider text-[#FD5C05] group-hover:text-[#CC3D00] transition-colors">
          <span>View Event</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.article>
  );
});

// 2. Outer wrapper subscribing to contexts
export default function EventCard(props: EventCardProps) {
  const { event, isSaved, isAttending } = props;
  const { saveToggle, rsvpToggle, events, organizations } = useEvents();
  const { currentUser } = useUser();

  const dbEvent = events.find(e => e.id === event.id);

  const effectiveIsSaved = dbEvent && currentUser
    ? (dbEvent.savedBy?.includes(currentUser.name) || (currentUser.username ? dbEvent.savedBy?.includes(currentUser.username) : false))
    : (isSaved !== undefined ? isSaved : false);

  const effectiveIsAttending = dbEvent && currentUser
    ? (dbEvent.attendees?.includes(currentUser.name) || (currentUser.username ? dbEvent.attendees?.includes(currentUser.username) : false))
    : (isAttending !== undefined ? isAttending : false);

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

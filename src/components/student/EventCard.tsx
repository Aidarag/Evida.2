'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
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

// 1. Presentational Component implementing CSS Grid Card Architecture (184px image, 106px content, 50px footer = 340px total)
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

  // Title text
  const titleText = event.title;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`event-card group bg-white rounded-[16px] overflow-hidden border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-300 w-full sm:w-[300px] shrink-0 h-[340px] grid grid-rows-[184px_106px_50px] relative select-none cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 1. IMAGE WRAPPER (Row 1: 184px) */}
      <div className="event-card__image-wrapper relative w-full h-[184px] overflow-hidden bg-gray-100">
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
          <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-[#FD5C05] text-white rounded-full shadow-xs shrink-0 max-w-[65px] truncate">
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

      {/* 2. CONTENT WRAPPER (Row 2: 106px - Date + Title ONLY) */}
      <div className="event-card__content p-[14px_20px_8px] overflow-hidden flex flex-col justify-start text-left min-h-0">
        {/* Date / Time */}
        <div className="event-card__date h-[16px] text-[12px] leading-[16px] font-bold text-[#FD5C05] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis block">
          {fullDateTime}
        </div>

        {/* Title (26px, line-height 28px, 2 lines = 56px reserved height) */}
        <h3
          className="event-card__title text-[#2A2621] font-bold text-[24px] leading-[28px] tracking-tight group-hover:text-[#FD5C05] transition-colors mt-[5px] h-[56px] max-h-[56px] block w-full text-left"
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
      </div>

      {/* 3. FOOTER (Row 3: 50px - Completely independent Grid row) */}
      <div className="event-card__footer h-[50px] px-[20px] flex items-center gap-2 border-t border-black/[0.06] min-w-0">
        {/* Organization Name */}
        <div className="event-card__organization flex-1 min-w-0 text-[11px] leading-[14px] font-bold text-[#5A554E] whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
          <span className="truncate">{orgName}</span>
          {isOrgVerified && <VerifiedBadge className="h-3.5 w-3.5 shrink-0 text-[#FD5C05]" />}
        </div>

        {/* Price / Action Badge */}
        <div className="event-card__price shrink-0">
          {!isPromo ? (
            <span className="px-2.5 py-1 bg-[#FD5C05] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-xs">
              {(event as Event).free ? 'FREE' : `$${(event as Event).price || 'JOIN'}`}
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#2A2621] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-xs">
              PROMO
            </span>
          )}
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

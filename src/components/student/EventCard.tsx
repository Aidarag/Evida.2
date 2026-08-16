'use client';

import React, { useState } from 'react';
import { MapPin, Bookmark, Check, CheckCircle, Mail, X } from 'lucide-react';
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

// 1. Standardized Presentational EventCard Component
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

  // Date & Time (Max 22 characters)
  const dateObj = new Date(event.date + 'T00:00:00');
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const rawDateStr = `${month} ${day}`;
  const timeStr = !isPromo && (event as Event).time ? (event as Event).time : '7:00 PM';
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`group flex flex-col bg-white rounded-[16px] overflow-hidden border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-300 w-full sm:w-[276px] shrink-0 h-[310px] min-h-[310px] max-h-[310px] justify-between relative select-none cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 1. IMAGE CONTAINER (Width: 100%, Height: 170px, object-fit: cover, flex-shrink: 0) */}
      <div className="relative w-full h-[170px] shrink-0 overflow-hidden bg-gray-100">
        <div
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${bgClass}`}
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

      {/* 2. CONTENT BODY (Padding: 12px 16px 10px, flex: 1, min-height: 0) */}
      <div className="p-[12px_16px_10px] flex flex-col flex-1 min-h-0 justify-between text-left">
        <div className="space-y-1">
          {/* Date & Time (11px, font-weight: 700, single line) */}
          <div className="text-[#FD5C05] text-[11px] font-bold uppercase tracking-wider truncate block leading-none h-[14px]">
            {fullDateTime}
          </div>

          {/* Title (18px, font-weight: 700, line-height: 1.15, reserved height 52px for 2 full lines without clipping) */}
          <div className="h-[52px] min-h-[52px] max-h-[52px] flex items-start overflow-hidden pt-0.5">
            <h3
              className="text-[#2A2621] font-bold text-[17px] sm:text-[18px] leading-[1.15] tracking-tight group-hover:text-[#FD5C05] transition-colors block w-full text-left"
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
        </div>

        {/* 3. FOOTER (margin-top: auto, aligned at exact same spot across all cards) */}
        <div className="mt-auto pt-2 border-t border-black/[0.04] flex items-center justify-between gap-2 min-w-0">
          {/* Organization Name (11px, font-weight: 700, single line) */}
          <div className="flex items-center gap-1 text-[11px] text-[#5A554E] font-bold truncate min-w-0 flex-1">
            <span className="truncate">{orgName}</span>
            {isOrgVerified && <VerifiedBadge className="h-3.5 w-3.5 shrink-0 text-[#FD5C05]" />}
          </div>

          {/* Action / Cost Badge in Footer */}
          <div className="shrink-0">
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
      </div>
    </motion.div>
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

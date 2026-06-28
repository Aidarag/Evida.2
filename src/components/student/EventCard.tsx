'use client';

import React from 'react';
import { MapPin, Users, Heart, Star, Compass, Megaphone } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';

interface EventCardProps {
  event: Event | Promotion;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export default function EventCard({ event, onClick, onSave, isSaved = false }: EventCardProps) {
  // Check if it's a promotion
  const isPromo = !('ownershipType' in event);

  // Set up cover image
  const coverImage = isPromo 
    ? 'bg-gradient-to-tr from-purple-900/60 via-slate-900 to-violet-950/40' 
    : event.coverImage;

  const isGradient = coverImage ? coverImage.includes('from-') : false;
  const bgClass = isGradient ? coverImage : (coverImage ? '' : 'bg-gray-100');
  const bgStyle = (!isGradient && coverImage) ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  // Ownership Badge details
  let badgeLabel = 'Student';
  let badgeColors = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';

  if (isPromo) {
    badgeLabel = 'Promotion';
    badgeColors = 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
  } else {
    if (event.ownershipType === 'school') {
      badgeLabel = 'Official School';
      badgeColors = 'bg-red-500/10 text-red-600 border border-red-500/20';
    } else if (event.ownershipType === 'organization') {
      badgeLabel = 'Organization';
      badgeColors = 'bg-sky-500/10 text-sky-600 border border-sky-500/20';
    }
  }

  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer flex flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100"
    >
      {/* Image Container */}
      <div className="p-2">
        <div 
          className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden ${bgClass}`}
          style={bgStyle}
        >
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5" />
          
          {/* Top Left Badge: Date (and Time if event) */}
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <div className="bg-white px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-sm flex items-center gap-1">
              {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
            </div>
            {!isPromo && (event as Event).time && (
              <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-sm flex items-center gap-1">
                {(event as Event).time}
              </div>
            )}
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {!isPromo && (event as Event).isFeatured && (
              <div className="bg-[#4C1D95] px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm">
                Featured
              </div>
            )}
            {onSave && !isPromo && (
              <button
                onClick={onSave}
                className="h-7 w-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#4C1D95] text-[#4C1D95]' : 'text-gray-400'}`} />
              </button>
            )}
            {isPromo && (
              <div className="h-7 w-7 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white">
                <Megaphone className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Below Image */}
      <div className="px-4 pb-5 pt-2 flex flex-col flex-1 gap-1">
        {/* Ownership Badge */}
        <div className="mb-1">
          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors}`}>
            {badgeLabel}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#4C1D95] transition-colors">
          {event.title}
        </h3>
        
        <p className="text-[13px] text-gray-500 line-clamp-2">
          {isPromo 
            ? `${event.category} • Posted by ${(event as Promotion).organizer}`
            : `${event.category} • ${(event as Event).location}`
          }
        </p>
      </div>
    </div>
  );
}

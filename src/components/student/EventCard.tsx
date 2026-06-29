'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';

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
    ? 'bg-gradient-to-tr from-purple-900/60 via-slate-900 to-violet-950/40' 
    : event.coverImage;

  const isGradient = coverImage ? coverImage.includes('from-') : false;
  const bgClass = isGradient ? coverImage : (coverImage ? '' : 'bg-gray-100');
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

  return (
    <div 
      className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-500 h-full justify-between relative"
    >
      {/* 1. Image Container */}
      <div 
        onClick={onClick}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <div 
          className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${bgClass}`}
          style={bgStyle}
        />
        
        {/* Category Badge top left */}
        <div className="absolute top-4 left-4 z-10 flex">
          <span className="bg-[#2563EB] px-3.5 py-1 text-[10px] font-bold text-white tracking-widest uppercase rounded-full shadow-sm">
            {isPromo ? 'Promotion' : event.category}
          </span>
        </div>
      </div>

      {/* 2. Interactive Save (Heart) Button - Floating top right */}
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
        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
      >
        <Heart 
          className={`h-4.5 w-4.5 transition-colors ${
            (onSave ? isSaved : isSavedLocal) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
          }`} 
        />
      </button>

      {/* 3. Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 text-left">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          {/* Date & Time Invite Style (Blue, Uppercase) */}
          <div className="text-[#2563EB] text-[11px] font-extrabold uppercase tracking-wider">
            {formattedDate} • {timeStr}
          </div>

          {/* Event Title */}
          <h3 className="text-slate-900 font-extrabold text-lg md:text-xl line-clamp-2 leading-tight tracking-tight hover:text-[#2563EB] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {event.title}
          </h3>
          
          {/* Location Row */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{isPromo ? (event as Promotion).organizer : (event as Event).location}</span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed font-light line-clamp-2 pt-1">
            {event.description || `Join us for the ${event.title}, happening soon.`}
          </p>
        </div>

        {/* 4. Invite Action Footer (Avatars + Compact Add to Calendar Button) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
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
            <span className="text-slate-400 text-[10px] font-medium whitespace-nowrap">
              +{goingCount} going
            </span>
          </div>

          {/* Compact Add to Calendar Button */}
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider py-1.5 px-3.5 rounded-full hover:bg-slate-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Calendar className="h-3.5 w-3.5 text-slate-800" />
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

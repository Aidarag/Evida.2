'use client';

import React, { useState } from 'react';
import { Event } from '@/lib/types';
import { Calendar, Heart, MapPin } from 'lucide-react';

interface FeaturedEventCardProps {
  event: Event;
  onClick: () => void;
}

export default function FeaturedEventCard({ event, onClick }: FeaturedEventCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Parse the date to match a clean invite format (e.g. Monday, Oct 12)
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const isGradient = event.coverImage ? event.coverImage.includes('from-') : false;
  const bgClass = isGradient ? event.coverImage : (event.coverImage ? '' : 'bg-gray-100');
  const bgStyle = (!isGradient && event.coverImage) 
    ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  return (
    <div 
      className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-500 h-full justify-between relative"
    >
      {/* 1. Banner Image */}
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
            {event.category === 'Art' ? 'Exhibition' : event.category}
          </span>
        </div>
      </div>

      {/* 2. Interactive Save (Heart) Button - Floating top right */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsSaved(!isSaved);
        }}
        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
      >
        <Heart 
          className={`h-4.5 w-4.5 transition-colors ${
            isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
          }`} 
        />
      </button>

      {/* 3. Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 text-left">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          {/* Date & Time Invite Style */}
          <div className="text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            {formattedDate} • {event.time}
          </div>

          {/* Event Title */}
          <h3 className="text-slate-900 font-extrabold text-xl line-clamp-2 leading-tight tracking-tight hover:text-[#2563EB] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {event.title}
          </h3>
          
          {/* Location Row */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed font-light line-clamp-2 pt-1">
            {event.description || `Join us for the ${event.title}, happening at ${event.location}.`}
          </p>
        </div>

        {/* 4. Invite Action Footer */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onClick}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/10 cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Calendar className="h-4 w-4" />
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

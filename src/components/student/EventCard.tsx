'use client';

import React from 'react';
import { MapPin, Users, Heart, Star, Compass } from 'lucide-react';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export default function EventCard({ event, onClick, onSave, isSaved = false }: EventCardProps) {
  const isGradient = event.coverImage.includes('from-');
  const bgClass = isGradient ? event.coverImage : '';
  const bgStyle = !isGradient ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer flex flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100"
    >
      {/* Image Container with rounded corners inside the card */}
      <div className="p-2">
        <div 
          className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden ${bgClass}`}
          style={bgStyle}
        >
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5" />
          
          {/* Top Left Badge: Date */}
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <div className="bg-white px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-sm flex items-center gap-1">
              {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
            </div>
            <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-sm flex items-center gap-1">
              {event.time}
            </div>
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {event.isFeatured && (
              <div className="bg-[#4C1D95] px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm">
                Featured
              </div>
            )}
            {onSave && (
              <button
                onClick={onSave}
                className="h-7 w-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#4C1D95] text-[#4C1D95]' : 'text-gray-400'}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Below Image */}
      <div className="px-4 pb-5 pt-2 flex flex-col flex-1 gap-1">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#4C1D95] transition-colors">
          {event.title}
        </h3>
        <p className="text-[13px] text-gray-500 line-clamp-2">
          {event.category} • {event.location}
        </p>
      </div>
    </div>
  );
}

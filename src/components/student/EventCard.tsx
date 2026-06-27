'use client';

import React from 'react';
import { MapPin, Users, Heart, Star, Compass } from 'lucide-react';
import { Event } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export default function EventCard({ event, onClick, onSave, isSaved = false }: EventCardProps) {
  // Parse cover gradient logic or URL
  const isGradient = event.coverImage.includes('from-');
  const bgClass = isGradient ? event.coverImage : '';
  const bgStyle = !isGradient ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover' } : {};

  return (
    <Card onClick={onClick} className="group overflow-hidden flex flex-col h-full bg-[#111118]">
      {/* Image / Gradient Header */}
      <div 
        className={`relative aspect-[4/3] w-full overflow-hidden ${bgClass}`}
        style={bgStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/20 to-transparent z-10 opacity-80" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <Badge variant={event.ownershipType === 'school' ? 'accent' : 'info'} className="bg-black/50 backdrop-blur-md">
            {event.category}
          </Badge>
          
          {onSave && (
            <button
              onClick={onSave}
              className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors z-30 cursor-pointer"
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-[#EE3D5A] text-[#EE3D5A]' : 'text-white'}`} />
            </button>
          )}
        </div>

        {/* Date block bottom left of image */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 text-center">
            <div className="text-[10px] font-bold text-[#80B0EC] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
            <div className="text-xl font-black text-white leading-none">{new Date(event.date).getDate()}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4 z-20">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-[#80B0EC] transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-[#B8BBC8] mt-1 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-auto space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#B8BBC8]">
            <MapPin className="h-3.5 w-3.5 text-[#80B0EC]" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#B8BBC8]">
            <Users className="h-3.5 w-3.5 text-[#DAFB71]" />
            <span>{event.attendees.length} attending</span>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] mt-2">
            <div className="h-5 w-5 rounded-full bg-[#333] flex items-center justify-center overflow-hidden shrink-0">
              <Compass className="h-3 w-3 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
              By {event.organizationName || event.organizer}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

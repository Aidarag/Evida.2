'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Bookmark, Star, CheckCircle, Info, Shield, HelpCircle, Share2 } from 'lucide-react';
import { Event, User } from '@/lib/types';
import { useEvents } from '@/lib/context/EventContext';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface EventDetailsProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRSVP: (eventId: string, action: 'rsvp' | 'interested') => Promise<void>;
  onSaveToggle: (eventId: string) => Promise<void>;
}

export default function EventDetails({
  event,
  isOpen,
  onClose,
  currentUser,
  onRSVP,
  onSaveToggle,
}: EventDetailsProps) {
  const [sharing, setSharing] = useState(false);
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const { organizations } = useEvents();

  if (!isOpen || !event) return null;

  const isRsvped = event.attendees.includes(currentUser.name);
  const isSaved = event.savedBy?.includes(currentUser.name) || false;

  const isOrgVerified = event.organizationId
    ? organizations.find((o) => o.id === event.organizationId)?.verified
    : false;

  const handleShareClick = () => {
    setSharing(true);
    setTimeout(() => setSharing(false), 2000);
  };

  const handleCalendarClick = () => {
    setAddingToCalendar(true);
    setTimeout(() => {
      setAddingToCalendar(false);
      alert('Event added to school Google Calendar!');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2A2621]/60 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal invitation */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#D8D2BC]/30 bg-white text-[#2A2621] shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Full-bleed poster cover */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {/* Cover gradient */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-30`} />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
          
          {/* Cover bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-20 h-10 w-10 rounded-full bg-white/90 hover:bg-white border border-black/10 flex items-center justify-center text-[#2A2621] transition-colors cursor-pointer shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title/Host overlay */}
          <div className="absolute inset-x-6 bottom-6 z-20 space-y-1">
            <span className="rounded-full bg-[#FD5C05] text-[#2A2621] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 w-fit border border-[#FD5C05]/30 shadow-sm">
              {event.free ? 'FREE ACCESS' : 'TICKETED'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A2621] tracking-tight leading-none mt-2 line-clamp-3 bg-white/95 px-3 py-1.5 rounded-2xl w-fit shadow-sm border border-[#D8D2BC]/40">
              {event.title}
            </h2>
            {event.organizationName && (
              <p className="text-xs font-bold text-[#5A554E] mt-1.5 uppercase bg-white/90 px-3 py-1 rounded-xl w-fit shadow-sm border border-[#D8D2BC]/40 flex items-center">
                Hosted by {event.organizationName}
                {isOrgVerified && <VerifiedBadge className="h-3.5 w-3.5 ml-1" />}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Top details cards */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="flex items-start gap-3 rounded-2xl bg-[#D8D2BC]/25 p-4 border border-black/[0.04]">
              <Calendar className="h-4.5 w-4.5 text-[#2A2621] shrink-0" />
              <div>
                <p className="font-bold text-[#5A554E] uppercase tracking-wider">Date & Time</p>
                <p className="mt-1 font-bold text-[#2A2621] uppercase">{event.date}</p>
                <p className="text-[10px] text-[#5A554E] mt-0.5">{event.time} {event.endTime ? `to ${event.endTime}` : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#D8D2BC]/25 p-4 border border-black/[0.04]">
              <MapPin className="h-4.5 w-4.5 text-[#2A2621] shrink-0" />
              <div>
                <p className="font-bold text-[#5A554E] uppercase tracking-wider">Location Venue</p>
                <p className="mt-1 font-bold text-[#2A2621] uppercase">{event.location}</p>
                <p className="text-[10px] text-[#5A554E] mt-0.5 capitalize">{event.locationType} Space</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">About the experience</h4>
            <p className="text-xs text-[#5A554E] leading-relaxed bg-[#D8D2BC]/10 p-4 rounded-2xl border border-black/[0.04]">
              {event.description}
            </p>
          </div>

          {/* Smart classification insight for student clarity */}
          <div className="rounded-2xl border-l-4 border-[#FD5C05] bg-[#FD5C05]/10 p-4 flex gap-3 text-xs leading-relaxed border border-transparent shadow-sm">
            <Info className="h-5 w-5 text-[#2A2621] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2A2621] uppercase">Review classification: {event.complexityType} queue</p>
              <p className="text-[10px] text-[#5A554E] mt-0.5">
                {event.complexityType === 'quick' 
                  ? 'Quick event details. Auto-routed to fast approval queue for prompt publishing.' 
                  : event.complexityType === 'complex'
                  ? 'High resources/large attendance event. Undergone detailed administration checks.'
                  : 'Standard event reviews. Standard logistics and room scheduling clearances.'}
              </p>
            </div>
          </div>

          {/* Metadata: attendees summary */}
          <div className="flex items-center justify-between border-t border-[#D8D2BC]/30 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#5A554E] font-semibold">
                <Users className="h-4 w-4 text-[#2A2621]" />
                <strong className="text-[#2A2621]">{event.attendees.length}</strong> attending
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCalendarClick}
                disabled={addingToCalendar}
                className="rounded-lg bg-[#D8D2BC]/50 hover:bg-black/[0.04] border border-[#D8D2BC]/40 text-[#2A2621] font-bold px-3 py-1.5 text-[10px] uppercase transition-all cursor-pointer shadow-sm"
              >
                {addingToCalendar ? 'Syncing...' : 'Add to Calendar'}
              </button>

              <button
                onClick={handleShareClick}
                className="rounded-lg bg-[#D8D2BC]/50 hover:bg-black/[0.04] border border-[#D8D2BC]/40 text-[#2A2621] font-bold px-3 py-1.5 text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Share2 className="h-3 w-3 text-[#2A2621]" />
                {sharing ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* Bottom Action Tickets Trigger */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#D8D2BC]/30">
            <button
              onClick={() => onSaveToggle(event.id)}
              className="p-3 text-[#5A554E] hover:text-[#FD5C05] transition-all duration-150 cursor-pointer focus:outline-none shrink-0"
              title={isSaved ? "Unsave Event" : "Save Event"}
            >
              <Bookmark 
                className={`h-6 w-6 transition-all duration-150 ease-in-out ${
                  isSaved ? 'fill-[#FD5C05] text-[#FD5C05]' : 'text-[#5A554E]'
                }`} 
              />
            </button>

            <button
              onClick={() => onRSVP(event.id, 'rsvp')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer shadow-lg ${
                isRsvped
                  ? 'bg-emerald-600 text-white shadow-emerald-500/10'
                  : 'bg-[#FD5C05] text-[#2A2621] shadow-[#FD5C05]/25 hover:bg-[#CC3D00]'
              }`}
            >
              <CheckCircle className="h-4.5 w-4.5" />
              {isRsvped ? 'CANCEL RSVP' : 'GET TICKET / RSVP GOING'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

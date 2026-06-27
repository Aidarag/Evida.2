'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Heart, Star, CheckCircle, Info, Shield, HelpCircle, Share2 } from 'lucide-react';
import { Event, User } from '@/lib/types';

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

  if (!isOpen || !event) return null;

  const isRsvped = event.attendees.includes(currentUser.name);
  const isSaved = event.savedBy?.includes(currentUser.name) || false;

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
      <div className="absolute inset-0 bg-[#050507]/90 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal invitation */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#121215] text-slate-100 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Full-bleed poster cover */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {/* Cover gradient */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-40`} />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
          
          {/* Cover bottom dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-20 h-10 w-10 rounded-full bg-black/60 hover:bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title/Host overlay */}
          <div className="absolute inset-x-6 bottom-6 z-20 space-y-1">
            <span className="rounded-full bg-[#FF7A1A] text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 w-fit">
              {event.free ? 'FREE ACCESS' : 'TICKETED'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-none mt-2">
              {event.title}
            </h2>
            {event.organizationName && (
              <p className="text-xs font-bold text-slate-300 mt-1 uppercase">
                Hosted by {event.organizationName}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Top details cards */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-950/40 p-4 border border-white/5">
              <Calendar className="h-4.5 w-4.5 text-[#FF7A1A] shrink-0" />
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider">Date & Time</p>
                <p className="mt-1 font-black text-slate-200 uppercase">{event.date}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{event.time} {event.endTime ? `to ${event.endTime}` : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-slate-950/40 p-4 border border-white/5">
              <MapPin className="h-4.5 w-4.5 text-[#FF7A1A] shrink-0" />
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider">Location Venue</p>
                <p className="mt-1 font-black text-slate-200 uppercase">{event.location}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{event.locationType} Space</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">About the experience</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-4 rounded-2xl border border-white/5">
              {event.description}
            </p>
          </div>

          {/* Smart classification insight for student clarity */}
          <div className="rounded-2xl border border-[#FF7A1A]/20 bg-[#FF7A1A]/5 p-4 flex gap-3 text-xs leading-relaxed">
            <Info className="h-5 w-5 text-[#FF7A1A] shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-slate-200 uppercase">Review classification: {event.complexityType} queue</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {event.complexityType === 'quick' 
                  ? 'Quick event details. Auto-routed to fast approval queue for prompt publishing.' 
                  : event.complexityType === 'complex'
                  ? 'High resources/large attendance event. Undergone detailed administration checks.'
                  : 'Standard event reviews. Standard logistics and room scheduling clearances.'}
              </p>
            </div>
          </div>

          {/* Metadata: attendees summary */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400 font-semibold">
                <Users className="h-4 w-4 text-[#FF7A1A]" />
                <strong className="text-white">{event.attendees.length}</strong> attending
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCalendarClick}
                disabled={addingToCalendar}
                className="rounded-lg bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 font-bold px-3 py-1.5 text-[10px] uppercase transition-all cursor-pointer"
              >
                {addingToCalendar ? 'Syncing...' : 'Add to Calendar'}
              </button>

              <button
                onClick={handleShareClick}
                className="rounded-lg bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 font-bold px-3 py-1.5 text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1"
              >
                <Share2 className="h-3 w-3" />
                {sharing ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* Bottom Action Tickets Trigger */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => onSaveToggle(event.id)}
              className={`flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-xs font-black transition-all hover:scale-[1.01] cursor-pointer ${
                isSaved
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  : 'bg-slate-950 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
              Bookmark
            </button>

            <button
              onClick={() => onRSVP(event.id, 'rsvp')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-black transition-all hover:scale-[1.01] cursor-pointer shadow-lg ${
                isRsvped
                  ? 'bg-emerald-600 text-white shadow-emerald-500/10'
                  : 'bg-gradient-to-r from-[#FF7A1A] to-[#FFB61D] text-black shadow-orange-500/15'
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

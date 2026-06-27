'use client';

import React, { useState } from 'react';
import { Bookmark, CheckCircle, PlusCircle, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Event } from '@/lib/types';

interface SavedEventsProps {
  savedEventsList: Event[];
  rsvpEventsList: Event[];
  createdEventsList: Event[];
  onOpenDetails: (event: Event) => void;
  onSaveToggle: (id: string) => void;
}

export default function SavedEvents({
  savedEventsList,
  rsvpEventsList,
  createdEventsList,
  onOpenDetails,
  onSaveToggle,
}: SavedEventsProps) {
  const [subTab, setSubTab] = useState<'saved' | 'rsvp' | 'created'>('saved');

  const getActiveList = () => {
    if (subTab === 'saved') return savedEventsList;
    if (subTab === 'rsvp') return rsvpEventsList;
    return createdEventsList;
  };

  const activeList = getActiveList();

  const getEmptyStateCopy = () => {
    if (subTab === 'saved') {
      return {
        title: 'No Saved Events',
        message: 'Tap the heart icon on event cards to keep track of experiences you want to follow.'
      };
    }
    if (subTab === 'rsvp') {
      return {
        title: 'No Active RSVPs',
        message: 'You haven\'t secured ticket entry for any events yet. Check the explore tab to join.'
      };
    }
    return {
      title: 'No Hosted Events',
      message: 'Create study sessions or organize major festivals using the event creation forms.'
    };
  };

  const copy = getEmptyStateCopy();

  return (
    <div className="space-y-6">
      
      {/* Sub-tab picker */}
      <div className="flex space-x-2 border-b border-white/5 pb-4 text-xs font-bold text-slate-400">
        <button
          onClick={() => setSubTab('saved')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'saved' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5 text-[#FF7A1A]" />
          Bookmarks ({savedEventsList.length})
        </button>

        <button
          onClick={() => setSubTab('rsvp')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'rsvp' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          My RSVPs ({rsvpEventsList.length})
        </button>

        <button
          onClick={() => setSubTab('created')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'created' ? 'border-[#FF7A1A] text-white' : 'border-transparent hover:text-slate-200'
          }`}
        >
          <PlusCircle className="h-3.5 w-3.5 text-indigo-400" />
          My Submittals ({createdEventsList.length})
        </button>
      </div>

      {/* Grid List */}
      {activeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/10 py-16 text-center max-w-sm mx-auto">
          <Sparkles className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-xs font-bold text-slate-300 uppercase">{copy.title}</p>
          <p className="mt-1 text-[11px] text-slate-500 px-4 leading-relaxed">
            {copy.message}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeList.map((event) => (
            <div
              key={event.id}
              onClick={() => onOpenDetails(event)}
              className="group rounded-[24px] overflow-hidden border border-white/5 bg-[#121215]/30 hover:border-[#FF7A1A]/30 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-30 group-hover:scale-105 transition-transform duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121215] to-transparent z-10" />

                {/* Submittal Status Badges for created events */}
                {subTab === 'created' && (
                  <span className={`absolute left-4 top-4 z-20 rounded-full px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border ${
                    event.status === 'approved'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : event.status === 'pending'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {event.status}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[9px] font-bold text-[#FF7A1A] uppercase tracking-wide block">
                    {event.organizationName || event.organizer}
                  </span>
                  <h4 className="text-sm font-black text-white leading-snug group-hover:text-[#FF7A1A] transition-colors mt-1 line-clamp-1 uppercase">
                    {event.title}
                  </h4>
                </div>

                <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500 pt-3 border-t border-white/5 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#FF7A1A]" />
                    {event.date} • {event.time}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-[#FF7A1A]" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

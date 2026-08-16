'use client';

import React, { useState } from 'react';
import { Bookmark, CheckCircle, PlusCircle, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Event } from '@/lib/types';
import EventCard from './EventCard';

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
      <div className="flex space-x-2 border-b border-[#D8D2BC]/30 pb-4 text-xs font-bold text-[#5A554E]">
        <button
          onClick={() => setSubTab('saved')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'saved' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5 text-[#2A2621]" />
          Bookmarks ({savedEventsList.length})
        </button>

        <button
          onClick={() => setSubTab('rsvp')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'rsvp' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          Attended ({rsvpEventsList.length})
        </button>

        <button
          onClick={() => setSubTab('created')}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'created' ? 'border-[#FD5C05] text-[#2A2621] font-extrabold' : 'border-transparent hover:text-[#2A2621]'
          }`}
        >
          <PlusCircle className="h-3.5 w-3.5 text-indigo-600" />
          My Submittals ({createdEventsList.length})
        </button>
      </div>

      {/* Grid List */}
      {activeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-slate-50 py-16 text-center max-w-sm mx-auto shadow-sm">
          <Sparkles className="h-10 w-10 text-[#5A554E] mb-3" />
          <p className="text-xs font-bold text-[#2A2621] uppercase">{copy.title}</p>
          <p className="mt-1 text-[11px] text-[#5A554E] px-4 leading-relaxed">
            {copy.message}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeList.map((event) => (
            <div key={event.id} className="h-full">
              <EventCard
                event={event}
                onClick={() => onOpenDetails(event)}
                onSave={() => onSaveToggle(event.id)}
                isSaved={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

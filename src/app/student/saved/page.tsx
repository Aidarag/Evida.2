'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/student/EventCard';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import { Bookmark, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'saved' | 'rsvp';

export default function SavedEventsPage() {
  const { events, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [toast, setToast] = useState<{ message: string; undoId: string } | null>(null);

  const handleUnlike = (eventId: string) => {
    saveToggle(eventId);
    setToast({
      message: 'Removed from Saved',
      undoId: eventId
    });
  };

  const handleUndo = () => {
    if (toast?.undoId) {
      saveToggle(toast.undoId);
      setToast(null);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!currentUser) return null;

  const savedEvents = events.filter(e => e.savedBy?.includes(currentUser.name));
  const rsvpEvents = events.filter(e => e.attendees?.includes(currentUser.name));

  const displayEvents = activeTab === 'saved' ? savedEvents : rsvpEvents;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto relative min-h-[70vh]">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2A2621] tracking-tight">Your Events</h1>
          <p className="text-sm text-[#5A554E] mt-1">Keep track of everything you&apos;re interested in.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Chip 
            label={`Saved (${savedEvents.length})`} 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')} 
          />
          <Chip 
            label={`Attending (${rsvpEvents.length})`} 
            active={activeTab === 'rsvp'} 
            onClick={() => setActiveTab('rsvp')} 
          />
        </div>
      </div>

      {/* Grid */}
      {displayEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard
                  event={event}
                  onClick={() => router.push(`/events/${event.id}`)}
                  isSaved={event.savedBy?.includes(currentUser.name)}
                  onSave={(e) => {
                    e.stopPropagation();
                    if (activeTab === 'saved') {
                      handleUnlike(event.id);
                    } else {
                      saveToggle(event.id);
                    }
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'saved' ? <Bookmark className="h-8 w-8 text-[#B8BBC8]" /> : <CalendarCheck className="h-8 w-8 text-[#B8BBC8]" />}
          title={activeTab === 'saved' ? "No saved events" : "No RSVPs yet"}
          description={activeTab === 'saved' ? "Tap the bookmark icon on any event to save it for later." : "When you RSVP to an event, it will appear here."}
        />
      )}

      {/* Undo Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex items-center justify-between gap-6 px-5 py-3.5 rounded-2xl bg-[#2A2621] text-white shadow-2xl text-xs font-semibold w-80 font-sans"
          >
            <span>{toast.message}</span>
            <button
              onClick={handleUndo}
              className="text-[#FD5C05] font-black uppercase tracking-wider hover:underline cursor-pointer border-none bg-transparent"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

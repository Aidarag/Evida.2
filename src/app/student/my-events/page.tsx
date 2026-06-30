'use client';

import React from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/student/EventCard';
import EmptyState from '@/components/ui/EmptyState';
import { Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function MyEventsPage() {
  const { events, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  if (!currentUser) return null;

  const myEvents = events.filter(e => e.organizer === currentUser.name);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#203627] tracking-tight">Hosted by You</h1>
          <p className="text-sm text-[#4F5666] mt-1">Events and promotions you've created.</p>
        </div>
        <Link href="/student/create">
          <Button variant="neon" icon={<Plus className="h-4 w-4" />}>
            Create New
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {myEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {myEvents.map((event) => (
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
                    saveToggle(event.id);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={<Star className="h-8 w-8 text-[#B8BBC8]" />}
          title="No hosted events"
          description="You haven't hosted any events yet. Create one to get started!"
          action={
            <Link href="/student/create">
              <Button>Create</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}

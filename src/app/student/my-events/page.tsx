'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/ui/EmptyState';
import { Star, Plus, Pencil, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Event } from '@/lib/types';

const FALLBACK_PHOTOS = [
  '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg',
  '/pexels-yaroslav-shuraev-8513385.jpg',
  '/pexels-amine-1285347-9371719.jpg',
  '/pexels-cottonbro-5989925.jpg',
  '/pexels-gu-ko-2150570603-31827067.jpg',
];

function getEventImg(coverImage: string | undefined, seed: string) {
  if (!coverImage || coverImage.includes('from-') || coverImage.includes('to-')) {
    const idx = (seed?.charCodeAt(0) || 0) % FALLBACK_PHOTOS.length;
    return FALLBACK_PHOTOS[idx];
  }
  return coverImage;
}

function StatusBadge({ status }: { status: Event['status'] }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
      <Clock className="h-3 w-3" /> Pending Review
    </span>
  );
}

export default function MyEventsPage() {
  const { events, deleteEvent } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!currentUser) return null;

  const myEvents = events.filter(e => e.organizer === currentUser.name);

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    await deleteEvent(id);
    setToast({ message: 'Event deleted.' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto relative min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2A2621] tracking-tight">Hosted by You</h1>
          <p className="text-sm text-[#5A554E] mt-1">Events and students services you&apos;ve created.</p>
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
            {myEvents.map((event) => {
              const imgSrc = getEventImg(event.coverImage, event.id);
              const isGradient = event.coverImage?.includes('from-');
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[24px] border border-black/[0.04] shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div
                    className="relative h-36 w-full cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    {isGradient ? (
                      <div className={`w-full h-full bg-gradient-to-br ${event.coverImage}`} />
                    ) : (
                      <img src={imgSrc} className="w-full h-full object-cover" alt={event.title} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={event.status} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <h3
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="font-bold text-sm text-[#2A2621] uppercase tracking-tight line-clamp-2 cursor-pointer hover:text-[#FD5C05] transition-colors"
                      >
                        {event.title}
                      </h3>
                      <p className="text-[10px] text-[#5A554E] font-medium">
                        {event.date} · {event.location}
                      </p>
                      <p className="text-[10px] text-[#5A554E]">
                        {event.attendees.length} attending
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-black/[0.04]">
                      {event.status === 'pending' && (
                        <button
                          onClick={() => router.push(`/student/create?editId=${event.id}`)}
                          className="flex-1 flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 bg-black/[0.04] hover:bg-[#FD5C05]/10 hover:text-[#FD5C05] rounded-xl transition-all cursor-pointer border-none text-[#2A2621]"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDeleteId(event.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all cursor-pointer border-none"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-[#2A2621] text-lg">Delete Event?</h3>
                <p className="text-xs text-[#5A554E] mt-1">This action cannot be undone. All RSVPs and data will be lost.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 border border-black/10 rounded-xl text-xs font-bold text-[#2A2621] hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2A2621] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Heart, ArrowLeft, Share2, Compass, X, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { events, saveToggle, rsvpToggle } = useEvents();
  const { currentUser } = useUser();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const event = events.find(e => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080B] text-white">
        Event not found.
      </div>
    );
  }

  const isSaved = currentUser ? event.savedBy?.includes(currentUser.name) : false;
  const isAttending = currentUser ? event.attendees?.includes(currentUser.name) : false;
  
  const bgClass = event.coverImage.includes('from-') ? event.coverImage : '';
  const bgStyle = !bgClass ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover' } : {};

  const handleAddToCalendar = () => {
    const cleanTitle = event.title.replace(/[^a-zA-Z0-9 ]/g, "");
    const cleanDesc = event.description.replace(/[^a-zA-Z0-9 ]/g, "");
    const cleanLoc = event.location.replace(/[^a-zA-Z0-9 ]/g, "");
    const dateStr = event.date.replace(/-/g, '');
    const startTime = `${dateStr}T190000`;
    const endTime = `${dateStr}T210000`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Evida//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@evida.app`,
      `DTSTAMP:${startTime}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLoc}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelRSVP = async () => {
    await rsvpToggle(event.id, 'interested');
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-[#08080B] text-white">
      {/* Hero Header */}
      <div className={`relative w-full h-[50vh] min-h-[400px] ${bgClass}`} style={bgStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/60 to-transparent z-10" />
        
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center max-w-5xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[#FFFDE1]/20 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex gap-3">
            <button className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[#FFFDE1]/20 transition-colors cursor-pointer">
              <Share2 className="h-4 w-4 text-white" />
            </button>
            {currentUser && (
              <button 
                onClick={() => saveToggle(event.id)}
                className="cursor-pointer focus:outline-none p-2 group transition-all duration-150"
                title={isSaved ? "Unsave Event" : "Save Event"}
              >
                <Bookmark 
                  className={`h-6 w-6 transition-all duration-150 ease-in-out ${
                    isSaved 
                      ? 'fill-[#FD5C05] text-[#FD5C05]' 
                      : 'text-white hover:text-[#FD5C05]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`} 
                />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 z-20 max-w-5xl mx-auto">
          <Badge variant="accent" className="mb-4 bg-[#D8D2BC]/300 backdrop-blur-md">{event.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 line-clamp-3">
            {event.title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#111118] border border-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
              <Compass className="h-5 w-5 text-[#80B0EC]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Hosted by {event.organizationName || event.organizer}</p>
              <p className="text-xs text-[#B8BBC8]">{event.ownershipType === 'school' ? 'Official University Event' : 'Student Organization'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12 relative z-20">
        <div className="md:col-span-2 space-y-12">
          {/* About */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">About Event</h2>
            <p className="text-[#B8BBC8] leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </section>
        </div>

        {/* Sidebar Info Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-[32px] bg-[#111118] border border-white/[0.06] p-6 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#80B0EC]/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-[#80B0EC]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                  <p className="text-sm text-[#B8BBC8]">{event.time} {event.endTime ? `- ${event.endTime}` : ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#eb5e28]/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#eb5e28]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{event.location}</h3>
                  <p className="text-sm text-[#B8BBC8] capitalize">{event.locationType}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EE3D5A]/10 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-[#EE3D5A]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{event.attendees.length} Attending</h3>
                  <p className="text-sm text-[#B8BBC8]">Free Entry</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] space-y-4">
              {currentUser ? (
                isAttending ? (
                  <div className="space-y-4 text-center p-5 bg-[#161622] border border-white/10 rounded-[24px] shadow-2xl relative animate-scale-in">
                    <div className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                      :-) You're In!
                    </div>
                    <p className="text-xs text-[#B8BBC8] leading-relaxed">
                      You have successfully RSVP'd to this event. We have saved your spot!
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-bold"
                        onClick={handleAddToCalendar}
                      >
                        Add to Calendar
                      </Button>
                      <button
                        onClick={handleCancelRSVP}
                        className="flex-1 py-2 px-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#B8BBC8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    onClick={async () => {
                      await rsvpToggle(event.id, 'rsvp');
                      setShowConfirmation(true);
                    }}
                  >
                    I'm Going
                  </Button>
                )
              ) : (
                <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/login')}>
                  Sign in to RSVP
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111118] border border-white/[0.08] w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative text-center space-y-6"
            >
              {/* Close Button X */}
              <button
                onClick={() => setShowConfirmation(false)}
                className="absolute top-4 right-4 text-[#B8BBC8] hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Big Success Icon / Graphics */}
              <div className="mx-auto h-16 w-16 rounded-full bg-[#FD5C05]/15 flex items-center justify-center text-[#FD5C05] text-3xl">
                🎉
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  You're going! 🎉
                </h3>
                <p className="text-xs text-[#B8BBC8] leading-relaxed">
                  Your RSVP has been confirmed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleAddToCalendar}
                  icon={<Calendar className="h-4 w-4" />}
                  className="bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-bold uppercase tracking-wider text-xs py-3 rounded-xl cursor-pointer"
                >
                  Add to Calendar
                </Button>

                <button
                  onClick={handleCancelRSVP}
                  className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-[#B8BBC8] hover:text-red-400 hover:underline transition-all cursor-pointer border-none bg-transparent"
                >
                  Cancel RSVP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

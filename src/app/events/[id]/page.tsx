'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Share2, Compass, X, Bookmark, Sparkles, XCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { downloadEventICS } from '@/lib/calendar';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { events, organizations, saveToggle, rsvpToggle } = useEvents();
  const { currentUser } = useUser();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const [isPreview, setIsPreview] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [sharing, setSharing] = useState(false);

  const event = events.find(e => e.id === params.id);
  const org = event && organizations ? organizations.find(o => o.id === event.organizationId) : undefined;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isPreviewMode = urlParams.get('preview') === 'true' || sessionStorage.getItem('evida_preview') === 'true';
      setIsPreview(isPreviewMode);
      if (isPreviewMode) {
        sessionStorage.setItem('evida_onboarding_step', '2');
        window.parent.postMessage({ type: 'EVIDA_TOUR_STEP_UPDATE', step: 2 }, '*');
      }
    }
  }, []);

  useEffect(() => {
    if (!isPreview || !event) return;

    const handleTriggerRSVP = async () => {
      const isAttending = currentUser ? event.attendees?.includes(currentUser.name) : false;
      if (!isAttending) {
        await rsvpToggle(event.id, 'rsvp');
      }
      setShowConfirmation(true);
      sessionStorage.setItem('evida_onboarding_step', '3');
      window.parent.postMessage({ type: 'EVIDA_TOUR_STEP_UPDATE', step: 3 }, '*');
    };

    window.addEventListener('evida_trigger_rsvp', handleTriggerRSVP);
    return () => window.removeEventListener('evida_trigger_rsvp', handleTriggerRSVP);
  }, [isPreview, event, currentUser, rsvpToggle]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080B] text-white">
        Event not found.
      </div>
    );
  }

  const isSaved = currentUser 
    ? (event.savedBy?.includes(currentUser.name) || (currentUser.username ? event.savedBy?.includes(currentUser.username) : false)) 
    : false;
  const isAttending = currentUser ? event.attendees?.includes(currentUser.name) : false;
  
  const bgClass = event.coverImage.includes('from-') ? event.coverImage : '';
  const bgStyle = !bgClass ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover' } : {};

  const handleShareClick = async () => {
    if (!event) return;
    const shareData = {
      title: event.title,
      text: event.description || '',
      url: typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : '',
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setSharing(true);
        setTimeout(() => setSharing(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleAddToCalendar = () => {
    try {
      downloadEventICS(event);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
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
            <button 
              onClick={handleShareClick}
              className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[#FFFDE1]/20 transition-colors cursor-pointer"
              title="Share Event"
            >
              <Share2 className="h-4 w-4 text-white" />
            </button>
            {currentUser && (
              <button 
                onClick={async () => {
                  await saveToggle(event.id);
                  if (!isSaved) {
                    setSaveToast(true);
                    setTimeout(() => setSaveToast(false), 4000);
                  }
                }}
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
              {event.organizationId ? (
                <Link href={`/student/organizations/${event.organizationId}`}>
                  <p className="text-sm font-bold text-white hover:text-[#FD5C05] hover:underline cursor-pointer transition-colors">
                    Hosted by {event.organizationName || event.organizer}
                  </p>
                </Link>
              ) : (
                <p className="text-sm font-bold text-white">Hosted by {event.organizationName || event.organizer}</p>
              )}
              <p className="text-xs text-[#B8BBC8]">
                {event.ownershipType === 'school' 
                  ? 'Official University Event' 
                  : event.ownershipType === 'organization' 
                  ? 'Official School Organisation' 
                  : 'unofficial school organisation'
                }
              </p>
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
          <div className="sticky top-24 rounded-[32px] bg-[#111118] border border-white/[0.06] p-6 space-y-6 shadow-2xl" data-tour="rsvp-section">
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
                  <div className="relative w-full">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      fullWidth
                      className="bg-red-600 hover:bg-red-700 text-white border-none font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      onClick={handleCancelRSVP}
                    >
                      <XCircle className="h-4 w-4 shrink-0 text-white" />
                      <span>Cancel RSVP</span>
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      fullWidth
                      className={
                        isPreview 
                          ? 'bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-bold ring-2 ring-[#FD5C05] shadow-[0_0_20px_rgba(253,92,5,0.5)] animate-pulse flex items-center justify-center gap-1.5' 
                          : ''
                      }
                      onClick={async () => {
                        await rsvpToggle(event.id, 'rsvp');
                        setShowConfirmation(true);
                        if (isPreview) {
                          sessionStorage.setItem('evida_onboarding_step', '3');
                          window.parent.postMessage({ type: 'EVIDA_TOUR_STEP_UPDATE', step: 3 }, '*');
                        }
                      }}
                    >
                      <span>I'm Going</span>
                      {isPreview && <span className="inline-block animate-bounce text-xs ml-1 text-[#FD5C05] font-black font-mono">{"(->)"}</span>}
                    </Button>
                  </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            {isPreview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111118] border border-white/[0.08] w-[240px] rounded-[24px] p-5 shadow-2xl relative text-center space-y-4 select-none"
              >
                {/* Success Icon */}
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                {/* Title & Body */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <span>You’re in!</span>
                  </h3>
                  <p className="text-[10px] text-[#B8BBC8] leading-relaxed">
                    Establish crucial connections for summer internships!
                  </p>
                </div>

                {/* Onboarding buttons */}
                <div className="space-y-2 pt-2">
                  <motion.button
                    onClick={() => setAddedToCalendar(true)}
                    className={`w-full py-2.5 rounded-xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 transition-all duration-300 border-none cursor-pointer ${
                      addedToCalendar
                        ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : isPreview
                        ? 'bg-[#FD5C05] text-white ring-2 ring-[#FD5C05] shadow-[0_0_16px_rgba(253,92,5,0.5)] animate-pulse'
                        : 'bg-[#FD5C05] text-white hover:bg-[#CC3D00] shadow-[0_0_12px_rgba(253,92,5,0.3)]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCalendar ? (
                        <motion.span
                          key="saved"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          Saved to Calendar ✓
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <span>📅 Add to Calendar</span>
                          {isPreview && <span className="inline-block animate-bounce text-xs ml-1 text-[#FD5C05] font-black font-mono">{"(->)"}</span>}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setAddedToCalendar(false);
                      window.parent.postMessage({ type: 'EVIDA_TOUR_COMPLETE' }, '*');
                      sessionStorage.setItem('evida_onboarding_step', '0');
                      window.dispatchEvent(new CustomEvent('evida_reset_onboarding'));
                      router.push('/student/dashboard?preview=true');
                    }}
                    className="w-full text-center py-2 rounded-xl text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Continue Exploring
                  </button>
                </div>
              </motion.div>
            ) : (
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
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                    <span>You’re in!</span>
                  </h3>
                  <p className="text-xs text-[#B8BBC8] leading-relaxed">
                    Your RSVP has been successfully confirmed. We have saved your spot!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAddToCalendar}
                    icon={<Calendar className="h-4 w-4 shrink-0" />}
                    className="bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-bold uppercase tracking-wider text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Add to Calendar
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-[#2A2621] text-white shadow-2xl text-xs font-semibold w-80 font-sans border border-white/10"
          >
            <span>Saved to your events!</span>
            <button
              onClick={() => router.push('/student/profile?tab=saved')}
              className="text-[#FD5C05] font-black uppercase tracking-wider hover:underline cursor-pointer border-none bg-transparent"
            >
              Go to Saved →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Notification Toast */}
      <AnimatePresence>
        {sharing && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#2A2621] text-white shadow-2xl text-xs font-semibold w-80 font-sans border border-white/10"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

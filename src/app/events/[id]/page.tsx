'use client';

import React from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Heart, ArrowLeft, Share2, Compass } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { events, saveToggle, rsvpToggle } = useEvents();
  const { currentUser } = useUser();

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

  return (
    <div className="min-h-screen bg-[#08080B] text-white">
      {/* Hero Header */}
      <div className={`relative w-full h-[50vh] min-h-[400px] ${bgClass}`} style={bgStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/60 to-transparent z-10" />
        
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center max-w-5xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex gap-3">
            <button className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
              <Share2 className="h-4 w-4 text-white" />
            </button>
            {currentUser && (
              <button 
                onClick={() => saveToggle(event.id)}
                className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-[#EE3D5A] text-[#EE3D5A]' : 'text-white'}`} />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 z-20 max-w-5xl mx-auto">
          <Badge variant="accent" className="mb-4 bg-black/50 backdrop-blur-md">{event.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
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
                <div className="h-12 w-12 rounded-2xl bg-[#38BDF8]/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#38BDF8]" />
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

            <div className="pt-6 border-t border-white/[0.06]">
              {currentUser ? (
                <Button 
                  variant={isAttending ? 'secondary' : 'primary'} 
                  size="lg" 
                  fullWidth
                  onClick={() => rsvpToggle(event.id, isAttending ? 'interested' : 'rsvp')}
                >
                  {isAttending ? "You're Going!" : "RSVP Now"}
                </Button>
              ) : (
                <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/login')}>
                  Sign in to RSVP
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

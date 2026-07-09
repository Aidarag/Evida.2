'use client';

import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, Heart, Star, CheckCircle, Clock, AlertCircle, Sparkles, PlusCircle } from 'lucide-react';
import { Event, Promotion, User } from '@/lib/types';

interface EventFeedProps {
  events: Event[];
  promotions: Promotion[];
  currentUser: User;
  onOpenDetails: (event: Event) => void;
  onOpenCreateEvent: () => void;
  onOpenCreatePromo: () => void;
}

export default function EventFeed({
  events,
  promotions,
  currentUser,
  onOpenDetails,
  onOpenCreateEvent,
  onOpenCreatePromo,
}: EventFeedProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'promos' | 'my-rsvps'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'student' | 'organization' | 'school'>('all');
  const [complexityFilter, setComplexityFilter] = useState<'all' | 'quick' | 'standard' | 'complex'>('all');

  // Filter logic
  const filteredEvents = events.filter((e) => {
    // Basic search match
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Ownership match
    const matchesOwnership = ownershipFilter === 'all' || e.ownershipType === ownershipFilter;

    // Complexity match
    const matchesComplexity = complexityFilter === 'all' || e.complexityType === complexityFilter;

    // Tab filter
    if (activeTab === 'events') {
      // General feed shows approved events, OR pending/rejected events only if the current user is the organizer
      const isOwner = e.organizer === currentUser.name;
      return matchesSearch && matchesOwnership && matchesComplexity && (e.status === 'approved' || isOwner);
    } else if (activeTab === 'my-rsvps') {
      // My RSVPs shows events where the user is in attendees list
      const isRsvp = e.attendees.includes(currentUser.name) || e.interested.includes(currentUser.name);
      return matchesSearch && matchesOwnership && matchesComplexity && isRsvp && e.status === 'approved';
    }
    
    return false;
  });

  const filteredPromos = promotions.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isOwner = p.organizer === currentUser.name;
    // Show approved promotions, or pending/rejected if the current user is the owner
    return matchesSearch && (p.status === 'approved' || isOwner);
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-violet-950/40 p-6 sm:p-8 border border-white/5 shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, <span className="text-[var(--color-evida-lime)]">{currentUser.name}</span>!
            </h1>
            <p className="mt-2 text-sm text-[#4B5563] max-w-xl">
              Discover verified campus activities, RSVP to events, or share your tutoring/photography services with the campus community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-indigo-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Create Event
            </button>
            <button
              onClick={onOpenCreatePromo}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
              Create Promotion
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs and Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('events')}
            className={`border-b-2 px-1 pb-4 text-sm font-bold transition-all ${
              activeTab === 'events'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-[#4B5563] hover:text-slate-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab('my-rsvps')}
            className={`border-b-2 px-1 pb-4 text-sm font-bold transition-all ${
              activeTab === 'my-rsvps'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-[#4B5563] hover:text-slate-200'
            }`}
          >
            My RSVPs & Interested
          </button>
          <button
            onClick={() => setActiveTab('promos')}
            className={`border-b-2 px-1 pb-4 text-sm font-bold transition-all ${
              activeTab === 'promos'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-[#4B5563] hover:text-slate-200'
            }`}
          >
            Promotions & Ads
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search title, details, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid Filters (only show for Events/RSVPs) */}
      {activeTab !== 'promos' && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/30 p-3 rounded-xl border border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium mr-1">Ownership:</span>
            {['all', 'student', 'organization', 'school'].map((type) => (
              <button
                key={type}
                onClick={() => setOwnershipFilter(type as any)}
                className={`rounded-lg px-2.5 py-1 font-semibold capitalize border transition-all ${
                  ownershipFilter === type
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-[#4B5563] border-transparent hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'All' : `${type}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium mr-1">Complexity:</span>
            {['all', 'quick', 'standard', 'complex'].map((comp) => (
              <button
                key={comp}
                onClick={() => setComplexityFilter(comp as any)}
                className={`rounded-lg px-2.5 py-1 font-semibold capitalize border transition-all ${
                  complexityFilter === comp
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-[#4B5563] border-transparent hover:text-slate-200'
                }`}
              >
                {comp === 'all' ? 'All' : `${comp}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {activeTab !== 'promos' ? (
        filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-16 text-center">
            <Calendar className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">No events found</p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Try adjusting your search queries or category filters.
            </p>
          </div>
        ) : (
          <div className="-mx-4 flex space-x-4 overflow-x-auto pb-4 snap-x scroll-smooth md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isRsvped = event.attendees.includes(currentUser.name);
              const isInterested = event.interested.includes(currentUser.name);
              
              return (
                <div
                  key={event.id}
                  onClick={() => onOpenDetails(event)}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-2xl glass-card p-5 cursor-pointer snap-center min-w-[280px] ${
                    event.featured ? 'border-violet-500/40 ring-1 ring-violet-500/20' : ''
                  }`}
                >
                  {/* Top Header Card */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Ownership Badge */}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        event.ownershipType === 'school'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : event.ownershipType === 'organization'
                          ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {event.ownershipType}
                      </span>

                      {/* Moderation Status (If pending/rejected and current user is owner) */}
                      {event.status !== 'approved' && (
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                          event.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}>
                          {event.status === 'pending' ? <Clock className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {event.status}
                        </span>
                      )}

                      {/* Featured Indicator */}
                      {event.featured && (
                        <span className="flex items-center gap-0.5 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-400 border border-violet-500/25">
                          <Star className="h-2.5 w-2.5 fill-violet-400" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    {event.ownershipType === 'organization' && event.organizationName && (
                      <p className="mt-1 text-[11px] font-medium text-indigo-400">
                        By {event.organizationName}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-[#4B5563] line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Metadata and Stats */}
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                    <div className="flex flex-col gap-1.5 text-[11px] text-[#4B5563]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[#4B5563]" title="RSVPs">
                          <Users className="h-3.5 w-3.5 text-indigo-400" />
                          <strong className="text-slate-200 font-semibold">{event.attendees.length}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-[#4B5563]" title="Interested">
                          <Heart className="h-3.5 w-3.5 text-rose-400" />
                          <strong className="text-slate-200 font-semibold">{event.interested.length}</strong>
                        </span>
                      </div>
                      
                      {/* Active RSVP state badge */}
                      {isRsvped && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/25">
                          <CheckCircle className="h-3 w-3" /> Going
                        </span>
                      )}
                      {!isRsvped && isInterested && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/25">
                          <Heart className="h-3 w-3 fill-rose-400/20" /> Interested
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Promotions Feed View */
        filteredPromos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-16 text-center">
            <Sparkles className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">No student promotions listed yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Be the first to list a tutoring service, bake sale, or photography gig!
            </p>
          </div>
        ) : (
          <div className="-mx-4 flex space-x-4 overflow-x-auto pb-4 snap-x scroll-smooth md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromos.map((promo) => (
              <div
                key={promo.id}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl glass-card p-5 border border-white/5 snap-center min-w-[280px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold capitalize text-violet-400 border border-violet-500/20">
                      {promo.category}
                    </span>

                    {promo.status !== 'approved' && (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                        promo.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        <Clock className="h-3 w-3" />
                        {promo.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-white">
                    {promo.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#4B5563]">
                    {promo.description}
                  </p>
                </div>

                {/* Organizer details */}
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1.5 text-[11px] text-[#4B5563]">
                  <div>
                    <span className="font-semibold text-slate-300">Posted by:</span> {promo.organizer}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Contact:</span> <a href={`mailto:${promo.contactInfo}`} className="text-indigo-400 hover:underline">{promo.contactInfo}</a>
                  </div>
                  {promo.feedback && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-500/5 text-rose-400 border border-rose-500/10">
                      <span className="font-bold">Moderator feedback:</span> "{promo.feedback}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

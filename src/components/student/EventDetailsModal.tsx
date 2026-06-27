'use client';

import React from 'react';
import { X, Calendar, MapPin, Users, Heart, Star, CheckCircle, HelpCircle, Shield, AlertTriangle, Clock } from 'lucide-react';
import { Event, User } from '@/lib/types';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRSVP: (eventId: string, action: 'rsvp' | 'interested') => Promise<void>;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  currentUser,
  onRSVP,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const isRsvped = event.attendees.includes(currentUser.name);
  const isInterested = event.interested.includes(currentUser.name);

  // Explanation for categorization
  const getCategorizationExplanation = () => {
    if (event.complexityType === 'quick') {
      return 'Quick Event: Auto-classified because expected attendance is ≤ 15 and it does not require additional campus resources (no funding or transportation). Fast-tracked for approval.';
    } else if (event.complexityType === 'complex') {
      return 'Complex Event: Classified for comprehensive review because it requests campus funding, requires group transportation, or anticipates a large gathering (≥ 150 attendees).';
    } else {
      return 'Standard Event: Regular campus activity requiring standard staff review for scheduling and location validation.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-all">
        {/* Header decoration */}
        <div className={`h-1.5 w-full ${
          event.featured 
            ? 'bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500' 
            : 'bg-indigo-600'
        }`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              event.ownershipType === 'school'
                ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                : event.ownershipType === 'organization'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            }`}>
              {event.ownershipType}-Owned
            </span>

            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              event.complexityType === 'quick'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : event.complexityType === 'complex'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {event.complexityType} Track
            </span>

            {event.featured && (
              <span className="flex items-center gap-0.5 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold text-violet-400 border border-violet-500/25">
                <Star className="h-3 w-3 fill-violet-400" />
                Featured Official Event
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {event.title}
            </h2>
            {event.organizationName && (
              <p className="mt-1.5 text-sm font-semibold text-indigo-400">
                Organized by the {event.organizationName}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Created by <span className="font-semibold text-slate-400">{event.organizer}</span>
            </p>
          </div>

          {/* Event description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About the Event</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-white/5">
              {event.description}
            </p>
          </div>

          {/* Time & Place card */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-slate-900/50 p-3 border border-white/5">
              <Calendar className="mt-0.5 h-4.5 w-4.5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date & Time</p>
                <p className="mt-0.5 text-sm font-bold text-slate-200">{event.date}</p>
                <p className="text-xs text-slate-400">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-900/50 p-3 border border-white/5">
              <MapPin className="mt-0.5 h-4.5 w-4.5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
                <p className="mt-0.5 text-sm font-bold text-slate-200">{event.location}</p>
                <p className="text-xs text-slate-400 capitalize">{event.locationType} Event</p>
              </div>
            </div>
          </div>

          {/* Smart Categorization Box */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
              <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Smart Classification Insight</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {getCategorizationExplanation()}
            </p>
            {(event.fundingRequested || event.transportationNeeded) && (
              <div className="flex flex-wrap gap-2 pt-1.5 border-t border-indigo-500/10 text-[10px] text-amber-400">
                {event.fundingRequested && (
                  <span className="flex items-center gap-0.5 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20">
                    <Shield className="h-3 w-3" /> Requests Funding
                  </span>
                )}
                {event.transportationNeeded && (
                  <span className="flex items-center gap-0.5 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20">
                    <AlertTriangle className="h-3 w-3" /> Requests Transportation
                  </span>
                )}
              </div>
            )}
          </div>

          {/* RSVP Attendees / Interested Lists */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Going List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                Going ({event.attendees.length})
              </h4>
              <div className="h-28 overflow-y-auto rounded-xl border border-white/5 bg-slate-900/20 p-2.5 text-xs space-y-1.5">
                {event.attendees.length === 0 ? (
                  <p className="text-slate-500 italic pl-1">No RSVPs yet</p>
                ) : (
                  event.attendees.map((name) => (
                    <div key={name} className="flex items-center gap-1.5 py-0.5 px-1.5 rounded bg-white/5 text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interested List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400/25" />
                Interested ({event.interested.length})
              </h4>
              <div className="h-28 overflow-y-auto rounded-xl border border-white/5 bg-slate-900/20 p-2.5 text-xs space-y-1.5">
                {event.interested.length === 0 ? (
                  <p className="text-slate-500 italic pl-1">No interested students</p>
                ) : (
                  event.interested.map((name) => (
                    <div key={name} className="flex items-center gap-1.5 py-0.5 px-1.5 rounded bg-white/5 text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      {name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (only show if approved) */}
          {event.status === 'approved' ? (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => onRSVP(event.id, 'interested')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer ${
                  isInterested
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300'
                }`}
              >
                <Heart className={`h-4 w-4 ${isInterested ? 'fill-rose-400 text-rose-400' : ''}`} />
                Interested
              </button>
              <button
                onClick={() => onRSVP(event.id, 'rsvp')}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer ${
                  isRsvped
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {isRsvped ? 'Going (Cancel)' : 'RSVP Going'}
              </button>
            </div>
          ) : (
            /* Moderation pending/rejection alerts */
            <div className="pt-4 border-t border-white/5">
              {event.status === 'pending' ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-xs text-amber-300/90 leading-relaxed">
                  <Clock className="h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold">Pending Review:</span> This event is waiting for moderator review by Student Affairs. It is currently hidden from the public feed.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-4 text-xs text-rose-300/90 space-y-1.5">
                  <div className="flex items-center gap-2 leading-relaxed">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-bold">Rejected by Admin:</span> This event was rejected.
                    </div>
                  </div>
                  {event.feedback && (
                    <div className="mt-1 p-2 rounded bg-slate-900/60 border border-white/5 font-mono text-[11px] text-slate-400">
                      Reason: "{event.feedback}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { User, Event, Promotion, Organization } from '@/lib/types';
import { Award, CheckCircle, Calendar, Sparkles, Building, Bookmark, Clock, UserCheck } from 'lucide-react';

interface StudentProfileViewProps {
  currentUser: User;
  events: Event[];
  promotions: Promotion[];
  organizations: Organization[];
  onOpenDetails: (event: Event) => void;
}

export default function StudentProfileView({
  currentUser,
  events,
  promotions,
  organizations,
  onOpenDetails,
}: StudentProfileViewProps) {
  // Compute user statistics
  const userCreatedEvents = events.filter((e) => e.organizer === currentUser.name);
  const userCreatedPromos = promotions.filter((p) => p.organizer === currentUser.name);
  const userRsvps = events.filter((e) => e.attendees.includes(currentUser.name));
  
  // Find organizations the user belongs to
  const userOrgs = organizations.filter((o) => currentUser.organizations.includes(o.id));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Col 1: Bio Card & Stats */}
      <div className="md:col-span-1 space-y-6">
        {/* Profile Details Card */}
        <div className="rounded-2xl glass-card p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl"></div>
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-3xl font-extrabold text-white shadow-xl shadow-indigo-500/15">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">{currentUser.name}</h3>
            
            <span className="mt-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              {currentUser.role === 'student_leader' ? 'Student Leader' : 'Student'}
            </span>

            <div className="mt-6 w-full pt-5 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-white">{userRsvps.length}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">RSVPs</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{userCreatedEvents.length}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Events</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{userCreatedPromos.length}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Promos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Memberships */}
        <div className="rounded-2xl glass-card p-5 border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="h-4 w-4 text-indigo-400" />
            Verified Organizations ({userOrgs.length})
          </h4>
          <div className="space-y-3">
            {userOrgs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Not currently a verified member of any organization.</p>
            ) : (
              userOrgs.map((org) => (
                <div key={org.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3 border border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">{org.name}</h5>
                    <p className="text-[10px] text-[#4B5563] mt-0.5 line-clamp-1">{org.description}</p>
                  </div>
                  {org.verified && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Verified Campus Group">
                      <UserCheck className="h-3 w-3" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Col 2 & 3: Created Events, Promos, & Schedules */}
      <div className="md:col-span-2 space-y-6">
        {/* My Created Events Queue */}
        <div className="rounded-2xl glass-card p-6 border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-400" />
            Events Created & Managed
          </h4>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {userCreatedEvents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                You haven't created any events yet.
              </div>
            ) : (
              userCreatedEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => onOpenDetails(event)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-900/50 hover:border-white/10 cursor-pointer transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                        event.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : event.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {event.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{event.date} at {event.time}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white mt-1.5">{event.title}</h5>
                    <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-1">{event.location}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#4B5563] shrink-0">
                    <span className="bg-slate-800/80 px-2 py-1 rounded-lg border border-white/5">
                      <span className="font-semibold text-slate-200">{event.attendees.length}</span> Going
                    </span>
                    <span className="bg-slate-800/80 px-2 py-1 rounded-lg border border-white/5">
                      <span className="font-semibold text-slate-200">{event.interested.length}</span> Interested
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Created Promotions Queue */}
        <div className="rounded-2xl glass-card p-6 border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Promotions & Peer Services Posted
          </h4>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {userCreatedPromos.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                You haven't posted any promotions yet.
              </div>
            ) : (
              userCreatedPromos.map((promo) => (
                <div 
                  key={promo.id}
                  className="p-3.5 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-900/50 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[9px] font-extrabold capitalize text-violet-300">
                        {promo.category}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                        promo.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : promo.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {promo.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{promo.date}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-white mt-1.5">{promo.title}</h5>
                  <p className="text-[11px] text-[#4B5563] mt-1">{promo.description}</p>
                  
                  {promo.feedback && (
                    <div className="mt-2.5 p-2 rounded bg-slate-950/60 border border-white/5 text-[10px] text-[#4B5563] font-mono">
                      <strong className="text-rose-400 font-bold">Feedback:</strong> "{promo.feedback}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

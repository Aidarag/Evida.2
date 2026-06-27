'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, AlertCircle, FileText, Calendar, MapPin, DollarSign, Truck, Sparkles } from 'lucide-react';
import { Event, Promotion } from '@/lib/types';

interface ReviewQueueProps {
  events: Event[];
  promotions: Promotion[];
  onReviewEvent: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  onReviewPromo: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
}

export default function ReviewQueue({
  events,
  promotions,
  onReviewEvent,
  onReviewPromo,
}: ReviewQueueProps) {
  const [activeQueue, setActiveQueue] = useState<'fast' | 'standard' | 'complex' | 'promotions'>('fast');
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  // Group pending items
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const pendingPromos = promotions.filter((p) => p.status === 'pending');

  const fastTrackQueue = pendingEvents.filter((e) => e.complexityType === 'quick');
  const standardQueue = pendingEvents.filter((e) => e.complexityType === 'standard');
  const complexQueue = pendingEvents.filter((e) => e.complexityType === 'complex');

  const handleReviewAction = async (
    id: string,
    type: 'event' | 'promo',
    status: 'approved' | 'rejected'
  ) => {
    const actionFeedback = feedback[id] || '';
    if (status === 'rejected' && !actionFeedback.trim()) {
      alert('Please provide feedback/rejection reason before rejecting.');
      return;
    }

    setProcessing(id);
    try {
      if (type === 'event') {
        await onReviewEvent(id, status, actionFeedback);
      } else {
        await onReviewPromo(id, status, actionFeedback);
      }
      // Clear feedback for this item
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  const renderEventCard = (event: Event) => {
    return (
      <div
        key={event.id}
        className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 space-y-4 shadow-lg hover:border-white/10 transition-all"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white leading-snug">{event.title}</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Submitted by <span className="font-semibold text-slate-400">{event.organizer}</span>
              {event.organizationName ? ` on behalf of ${event.organizationName}` : ''}
            </p>
          </div>
          
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
            event.ownershipType === 'school'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : event.ownershipType === 'organization'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {event.ownershipType} Event
          </span>
        </div>

        <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5 line-clamp-3">
          {event.description}
        </p>

        {/* Date, Time, Location & Stats */}
        <div className="grid gap-3 sm:grid-cols-3 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Attendance: ~{event.estimatedAttendance}</span>
          </div>
        </div>

        {/* Resource Indicators */}
        {(event.fundingRequested || event.transportationNeeded) && (
          <div className="flex flex-wrap gap-2 text-[10px] bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
            {event.fundingRequested && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <DollarSign className="h-3.5 w-3.5" /> Requests Campus Funding
              </span>
            )}
            {event.transportationNeeded && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Truck className="h-3.5 w-3.5" /> Requires Group Transportation
              </span>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-end gap-3 pt-3 border-t border-white/5">
          <div className="w-full space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reviewer Feedback / Comments</label>
            <input
              type="text"
              placeholder="e.g. Approved. Room reserved / Rejection reason (required for rejection)"
              value={feedback[event.id] || ''}
              onChange={(e) => setFeedback({ ...feedback, [event.id]: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleReviewAction(event.id, 'event', 'rejected')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleReviewAction(event.id, 'event', 'approved')}
              disabled={processing !== null}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getQueueCount = (queue: typeof activeQueue) => {
    if (queue === 'fast') return fastTrackQueue.length;
    if (queue === 'standard') return standardQueue.length;
    if (queue === 'complex') return complexQueue.length;
    if (queue === 'promotions') return pendingPromos.length;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Moderation Heading Banner */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 sm:p-6 relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          Event Moderation Queues
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-xl leading-relaxed">
          Administer upcoming activities. Evida routes simple requests to the Fast Track queue, while routing high resource requests to the Complex queue to organize your administrative workflows.
        </p>
      </div>

      {/* Queue tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-800 pb-5">
        {[
          { id: 'fast', label: 'Fast Track Queue', color: 'border-emerald-500/40 text-emerald-400' },
          { id: 'standard', label: 'Standard Queue', color: 'border-indigo-500/40 text-indigo-400' },
          { id: 'complex', label: 'Complex Queue', color: 'border-amber-500/40 text-amber-400' },
          { id: 'promotions', label: 'Promotions Ads', color: 'border-violet-500/40 text-violet-400' },
        ].map((tab) => {
          const count = getQueueCount(tab.id as any);
          const isActive = activeQueue === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveQueue(tab.id as any)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all hover:scale-[1.01] cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-700 shadow-sm'
                  : 'bg-transparent text-slate-400 border-white/5 hover:text-slate-200 hover:bg-slate-900/10'
              }`}
            >
              <div>
                <p className="text-xs font-bold leading-tight">{tab.label}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {tab.id === 'fast'
                    ? 'Expected ≤ 15'
                    : tab.id === 'complex'
                    ? 'High Resource / Scale'
                    : tab.id === 'standard'
                    ? 'Regular Scale'
                    : 'Classified Ads'}
                </p>
              </div>
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                count > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-white/5 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue items lists */}
      <div className="space-y-4">
        {activeQueue === 'fast' && (
          fastTrackQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-12 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500/80 mb-2" />
              <p className="text-xs font-semibold text-slate-300">Fast Track Queue cleared!</p>
              <p className="text-[10px] text-slate-500 mt-0.5">No quick requests are pending.</p>
            </div>
          ) : (
            fastTrackQueue.map((e) => renderEventCard(e))
          )
        )}

        {activeQueue === 'standard' && (
          standardQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-12 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500/80 mb-2" />
              <p className="text-xs font-semibold text-slate-300">Standard Queue cleared!</p>
              <p className="text-[10px] text-slate-500 mt-0.5">No standard events are pending review.</p>
            </div>
          ) : (
            standardQueue.map((e) => renderEventCard(e))
          )
        )}

        {activeQueue === 'complex' && (
          complexQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-12 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500/80 mb-2" />
              <p className="text-xs font-semibold text-slate-300">Complex Queue cleared!</p>
              <p className="text-[10px] text-slate-500 mt-0.5">No complex events require high oversight reviews.</p>
            </div>
          ) : (
            complexQueue.map((e) => renderEventCard(e))
          )
        )}

        {activeQueue === 'promotions' && (
          pendingPromos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/10 py-12 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500/80 mb-2" />
              <p className="text-xs font-semibold text-slate-300">Promotions Queue cleared!</p>
              <p className="text-[10px] text-slate-500 mt-0.5">All student advertisements have been reviewed.</p>
            </div>
          ) : (
            pendingPromos.map((promo) => (
              <div
                key={promo.id}
                className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 space-y-4 shadow-lg hover:border-white/10 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{promo.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Submitted by <span className="font-semibold text-slate-400">{promo.organizer}</span> (Contact: {promo.contactInfo})
                    </p>
                  </div>
                  
                  <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[9px] font-extrabold capitalize text-violet-400">
                    {promo.category} Ad
                  </span>
                </div>

                <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5 line-clamp-3">
                  {promo.description}
                </p>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row items-end gap-3 pt-3 border-t border-white/5">
                  <div className="w-full space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Comments for Student</label>
                    <input
                      type="text"
                      placeholder="Comment (required for rejection)"
                      value={feedback[promo.id] || ''}
                      onChange={(e) => setFeedback({ ...feedback, [promo.id]: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReviewAction(promo.id, 'promo', 'rejected')}
                      disabled={processing !== null}
                      className="flex items-center gap-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleReviewAction(promo.id, 'promo', 'approved')}
                      disabled={processing !== null}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

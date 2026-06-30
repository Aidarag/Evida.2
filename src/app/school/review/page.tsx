'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { Event } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList, Check, X, Calendar, MapPin, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewQueuePage() {
  const { events, reviewEvent } = useEvents();
  const [activeQueue, setActiveQueue] = useState<'all' | 'quick' | 'standard' | 'complex'>('all');

  const pendingEvents = events.filter(e => e.status === 'pending');
  
  const displayEvents = activeQueue === 'all' 
    ? pendingEvents 
    : pendingEvents.filter(e => e.complexityType === activeQueue);

  const handleReview = (id: string, status: 'approved' | 'rejected') => {
    reviewEvent(id, status, status === 'rejected' ? 'Does not meet campus guidelines.' : undefined);
  };

  const getComplexityColor = (type: string) => {
    if (type === 'quick') return 'bg-[#eb5e28]/10 text-[#203627] border-[#eb5e28]/20';
    if (type === 'standard') return 'bg-[#80B0EC]/10 text-[#9DC4D5] border-[#80B0EC]/20';
    return 'bg-[#EE3D5A]/10 text-[#203627] border-[#EE3D5A]/20';
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#203627] tracking-tight">Review Queue</h1>
          <p className="text-sm text-[#4F5666] mt-1">Review and approve pending student activities.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Chip label={`All (${pendingEvents.length})`} active={activeQueue === 'all'} onClick={() => setActiveQueue('all')} />
          <Chip label={`Quick`} active={activeQueue === 'quick'} onClick={() => setActiveQueue('quick')} />
          <Chip label={`Standard`} active={activeQueue === 'standard'} onClick={() => setActiveQueue('standard')} />
          <Chip label={`Complex`} active={activeQueue === 'complex'} onClick={() => setActiveQueue('complex')} />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayEvents.length > 0 ? displayEvents.map(event => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-6 flex flex-col md:flex-row gap-6">
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#203627]">{event.title}</h3>
                      <p className="text-sm text-[#4F5666] mt-1 line-clamp-2">{event.description}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getComplexityColor(event.complexityType)}`}>
                      {event.complexityType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-[#4F5666]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#9DC4D5]" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#9DC4D5]" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 col-span-2 border-t border-black/[0.06] pt-3 mt-1">
                      <Users className="h-4 w-4 text-[#203627]" />
                      Hosted by: <span className="text-[#203627]">{event.organizationName || event.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-3 md:w-32 md:border-l md:border-black/[0.06] md:pl-6">
                  <Button 
                    variant="neon" 
                    size="sm" 
                    fullWidth 
                    icon={<Check className="h-4 w-4" />}
                    onClick={() => handleReview(event.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    fullWidth 
                    className="hover:bg-[#EE3D5A]/10 hover:text-[#203627] hover:border-[#EE3D5A]/30"
                    icon={<X className="h-4 w-4" />}
                    onClick={() => handleReview(event.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            </motion.div>
          )) : (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8 text-[#4F5666]" />}
              title="Queue is empty"
              description="There are no pending events requiring review at this time."
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

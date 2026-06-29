'use client';

import React from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Star, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedEventsPage() {
  const { events } = useEvents();
  const { currentUser } = useUser();

  if (!currentUser || currentUser.role !== 'admin') return null;

  const featuredEvents = events.filter(e => e.isFeatured || e.featured);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Featured Events</h1>
        <p className="text-sm text-[#B8BBC8]">Events currently highlighted on the student dashboard.</p>
      </div>

      {featuredEvents.length > 0 ? (
        <div className="space-y-4">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div 
                className={`w-full md:w-48 h-32 rounded-xl bg-gradient-to-tr ${event.coverImage} shrink-0 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white drop-shadow-md" fill="white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-[#B8BBC8] line-clamp-1">{event.description}</p>
                  </div>
                  <Badge variant="accent">Featured</Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium text-[#B8BBC8]">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#80B0EC]" /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-[#38BDF8]" /> {event.category}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Star className="h-8 w-8 text-[#B8BBC8]" />}
          title="No featured events"
          description="There are currently no events featured on the platform."
        />
      )}
    </div>
  );
}

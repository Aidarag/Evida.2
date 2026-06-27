'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { DesktopNav } from '@/components/Navbar';
import EventCard from '@/components/student/EventCard';
import { useEvents } from '@/lib/context/EventContext';

export default function LandingPage() {
  const { events } = useEvents();
  
  // We mock a few extra events to fill a grid similar to the screenshot
  const displayEvents = [
    ...events.filter(e => e.status === 'approved'),
    ...events.filter(e => e.status === 'approved'), // duplicated for grid fill
  ].slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <DesktopNav variant="public" />

      {/* Massive Rounded Hero Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        <div className="relative w-full rounded-[40px] overflow-hidden bg-gradient-to-tr from-[#310A70] via-[#5F12D2] to-[#B81F94] aspect-[16/9] md:aspect-[21/9]">
          {/* Background Image (Abstract / DJ as in screenshot) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-2xl mb-4">
              The Citywide<br />Music Festival
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-sm leading-relaxed">
              The Citywide Music Festival is a celebration of art and culture that brings together musicians, and art enthusiasts from across the region.
            </p>
          </div>

          {/* Floating Search Bar aligned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 flex justify-center z-20">
            <div className="w-full max-w-5xl bg-white rounded-2xl flex flex-col md:flex-row items-center p-2 md:p-3 shadow-lg">
              
              {/* Search Input */}
              <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <input 
                  type="text" 
                  placeholder="Search by name or type" 
                  className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Filters */}
              <div className="flex w-full md:w-auto items-center divide-x divide-gray-100 mt-2 md:mt-0">
                <div className="px-6 py-2 flex flex-col cursor-pointer">
                  <span className="text-xs font-bold text-[#4C1D95]">Date</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">Select <ChevronDown className="h-3 w-3" /></div>
                </div>
                
                <div className="px-6 py-2 flex flex-col cursor-pointer">
                  <span className="text-xs font-bold text-[#4C1D95]">location</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">Select <ChevronDown className="h-3 w-3" /></div>
                </div>
                
                <div className="px-6 py-2 flex flex-col cursor-pointer">
                  <span className="text-xs font-bold text-[#4C1D95]">Type event</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">Select <ChevronDown className="h-3 w-3" /></div>
                </div>

                {/* Search Button */}
                <div className="pl-4 pr-2 py-2">
                  <button className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#4C1D95] hover:bg-[#EDE9FE] transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Events Section */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New events</h2>
          <button className="flex items-center gap-1 text-sm font-medium text-[#4C1D95] hover:text-[#6D28D9]">
            Tickets <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {displayEvents.map((event, i) => (
            <EventCard 
              key={`${event.id}-${i}`}
              event={event}
              onClick={() => {}}
            />
          ))}
        </div>
      </section>
      
    </div>
  );
}

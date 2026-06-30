'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Music, 
  Palette, 
  Sparkles, 
  Users, 
  Trophy, 
  Heart, 
  Briefcase, 
  Code, 
  Film,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';
import { useEvents } from '@/lib/context/EventContext';
import Card from '@/components/ui/Card';

export default function CalendarPage() {
  const { events } = useEvents();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // Default to October 2026

  // State for inspecting a specific day's events
  const [selectedDayEvents, setSelectedDayEvents] = useState<Array<any>>([
    { title: 'Graduation Cap Painting Workshop', time: '2:00 PM', location: 'Fine Arts Studio', type: 'mock' }
  ]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('October 3, 2026');

  // Dynamic Calendar Calculation
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday start
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const getEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    return events.filter(e => e.date === dateString && e.status === 'approved');
  };

  const getHighlightStyle = (day: number) => {
    if (day === 3 || day === 12 || day === 20 || day === 26) {
      const IconComp = day === 3 ? GraduationCap : day === 12 ? Music : day === 20 ? Palette : Sparkles;
      return {
        bgColor: 'bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/15',
        borderColor: 'border-[#FF5A1F]/35',
        textColor: 'text-[#FF5A1F]',
        icon: <IconComp className="h-4 w-4 text-[#FF5A1F] stroke-[2]" />,
      };
    }
    if (day === 5 || day === 15 || day === 22) {
      const IconComp = day === 5 ? Users : day === 15 ? Trophy : Heart;
      return {
        bgColor: 'bg-black/5 hover:bg-black/8',
        borderColor: 'border-black/20',
        textColor: 'text-[#121212]',
        icon: <IconComp className="h-4 w-4 text-[#121212] stroke-[2]" />,
      };
    }
    if (day === 8 || day === 18 || day === 29) {
      const IconComp = day === 8 ? Briefcase : day === 18 ? Code : Film;
      return {
        bgColor: 'bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/15',
        borderColor: 'border-[#FF5A1F]/35',
        textColor: 'text-[#FF5A1F]',
        icon: <IconComp className="h-4 w-4 text-[#FF5A1F] stroke-[2]" />,
      };
    }
    return null;
  };

  const handleMonthNav = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCalendarDate(newDate);
  };

  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const mockEvents: Record<number, Array<any>> = {
      3: [{ title: 'Graduation Cap Painting Workshop', time: '2:00 PM', location: 'Fine Arts Studio' }],
      12: [{ title: 'Fall Acoustic Sessions', time: '6:30 PM', location: 'Campus Amphitheater' }],
      20: [{ title: 'Canvas & Mocktails Art Event', time: '4:00 PM', location: 'Student Union' }],
      26: [{ title: 'STEM Code Hackathon Kickoff', time: '9:00 AM', location: 'Tech Hall' }],
      5: [{ title: 'Club Leadership Mixer', time: '5:00 PM', location: 'Student Center' }],
      15: [{ title: 'Varsity Soccer Tournament', time: '3:00 PM', location: 'Athletic Field' }],
      22: [{ title: 'Health & Wellness Seminar', time: '11:00 AM', location: 'Campus Gym' }],
      8: [{ title: 'Resume Review & Interview Prep', time: '1:00 PM', location: 'Career Center' }],
      18: [{ title: 'Developer Tools Workshop', time: '6:00 PM', location: 'Computer Lab 3' }],
      29: [{ title: 'Classic Film Screening Night', time: '8:00 PM', location: 'Campus Theatre' }]
    };

    const dayNum = date.getDate();
    const isCurrentMonth = date.getMonth() === month;
    const items = [...dayEvents];
    if (isCurrentMonth && mockEvents[dayNum]) {
      items.push(...mockEvents[dayNum]);
    }
    
    setSelectedDayEvents(items);
    setSelectedDateLabel(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#121212] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Hero Header */}
      <section className="relative w-full bg-[#121212] pt-36 pb-20 overflow-hidden text-center flex flex-col items-center">
        {/* Ambient Brand Glowing Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5A1F]/8 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            TIMELINE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            Tactile <span className="text-[#FF5A1F]">Calendar</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Click on any day to inspect campus activities. Keep track of orientation, games, tailgates, and career fairs.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <main className="flex-1 py-10 max-w-6xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-black/[0.04] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-premium-md)]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#121212] font-bold text-xl uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => handleMonthNav('prev')}
                className="h-10 w-10 border border-black/5 hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 text-black hover:text-[#FF5A1F] rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleMonthNav('next')}
                className="h-10 w-10 border border-black/5 hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 text-black hover:text-[#FF5A1F] rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Week Days Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4 text-center font-bold text-[9px] sm:text-[10px] tracking-widest text-[#4F5666] uppercase">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {calendarDays.map((cell, idx) => {
              const highlight = cell.isCurrentMonth ? getHighlightStyle(cell.day) : null;
              return (
                <div 
                  key={idx}
                  onClick={() => handleDayClick(cell.date)}
                  className={`
                    relative aspect-square border rounded-xl sm:rounded-2xl p-1 sm:p-2.5 cursor-pointer flex flex-col justify-between transition-all duration-300
                    ${cell.isCurrentMonth 
                      ? highlight 
                        ? `${highlight.bgColor} ${highlight.borderColor}`
                        : 'bg-white border-black/[0.04] hover:bg-black/[0.01] hover:border-black/15'
                      : 'bg-black/[0.01] border-transparent text-[#7B8290] opacity-40'
                    }
                  `}
                >
                  <span className={`text-xs font-bold ${highlight ? highlight.textColor : 'text-[#121212]'}`}>
                    {cell.day}
                  </span>
                  
                  {cell.isCurrentMonth && highlight && (
                    <div className="self-end mt-1">
                      {highlight.icon}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Day Details & Inspector */}
        <div className="lg:col-span-4 bg-white border border-black/[0.04] rounded-[24px] p-6 shadow-[var(--shadow-premium-md)] space-y-6">
          <div className="border-b border-black/[0.04] pb-4">
            <span className="text-[#FF5A1F] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <CalendarDays className="h-3.5 w-3.5" /> Events on
            </span>
            <h3 className="font-extrabold text-[#121212] text-lg uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedDateLabel}
            </h3>
          </div>

          <div className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.03] space-y-2 hover:border-[#FF5A1F]/20 hover:bg-[#FF5A1F]/3 transition-all duration-300"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-[#121212] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                    {evt.title}
                  </h4>
                  <div className="flex flex-col gap-1 text-[11px] text-[#4F5666] font-medium">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {evt.time || 'All Day'}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {evt.location || 'Campus'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs sm:text-sm text-[#7B8290] font-light">
                No events scheduled for this day. Click another date on the calendar grid to inspect.
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="relative w-full bg-[#121212] pt-24 pb-12 border-t border-white/5">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20 flex flex-col items-center">
          {/* Logo / Title */}
          <div className="mb-16 flex justify-center w-full">
             <EvidaLogo size={44} lightMode={false} text="Join Evida" />
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 text-white/50 mb-16">
          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4 text-left font-sans">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Contact</h4>
            <div className="space-y-1 text-xs font-semibold">
              <p className="text-white font-bold text-base mb-2 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>EVIDA</p>
              <p>Campus Event & Engagement Platform</p>
              <p className="pt-2 hover:text-[#FF5A1F] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Discover Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Discover</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="/about" className="hover:text-white transition-colors">About Evida</Link></li>
              <li><Link href="/student/events" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Platform</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="/student/events" className="hover:text-white transition-colors">Explore Events</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Event</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Promotion</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/school/dashboard" className="hover:text-white transition-colors">School Dashboard</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Stay Social</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Newsletter</h4>
            <p className="text-white/40 text-xs leading-relaxed font-light">
              Stay updated on the latest campus events and club promotions.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#121212] transition-all duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[#FF5A1F] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

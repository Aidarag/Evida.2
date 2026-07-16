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
  MapPin,
  Calendar
} from 'lucide-react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Button from '@/components/ui/Button';

export default function StudentCalendarPage() {
  const { events } = useEvents();
  const { currentUser } = useUser();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // Default to October 2026

  const MOCK_CALENDAR_EVENTS = [
    { id: 'mock-1', title: 'Graduation Cap Painting Workshop', date: '2026-10-03', time: '2:00 PM', location: 'Fine Arts Studio', coverImage: '/pexels-cottonbro-5989925.jpg', attendees: ['Michael'], description: 'Come paint your graduation cap with us! We supply all paint, glitter, and brushes.' },
    { id: 'mock-2', title: 'Fall Acoustic Sessions', date: '2026-10-12', time: '6:30 PM', location: 'Campus Amphitheater', coverImage: '/pexels-amine-1285347-9371719.jpg', attendees: [], description: 'Enjoy live acoustic performances by talented student singer-songwriters.' },
    { id: 'mock-3', title: 'Canvas & Mocktails Art Event', date: '2026-10-20', time: '4:00 PM', location: 'Student Union', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg', attendees: ['Michael'], description: 'Unwind with custom mocktails while painting on canvas with our art mentors.' },
    { id: 'mock-4', title: 'STEM Code Hackathon Kickoff', date: '2026-10-26', time: '9:00 AM', location: 'Tech Hall', coverImage: '/pexels-caleboquendo-34598092.jpg', attendees: [], description: 'Form teams, code awesome projects, and win prizes in this 24-hour hackathon.' },
    { id: 'mock-5', title: 'Club Leadership Mixer', date: '2026-10-05', time: '5:00 PM', location: 'Student Center', coverImage: '/pexels-rdne-7648057.jpg', attendees: [], description: 'Meet leaders of all registered campus clubs and organizations to collaborate.' },
    { id: 'mock-6', title: 'Varsity Soccer Tournament', date: '2026-10-15', time: '3:00 PM', location: 'Athletic Field', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg', attendees: ['Michael'], description: 'Cheer for our varsity soccer team in the seasonal opener tournament!' },
    { id: 'mock-7', title: 'Health & Wellness Seminar', date: '2026-10-22', time: '11:00 AM', location: 'Campus Gym', coverImage: '/pexels-ron-lach-8576102.jpg', attendees: [], description: 'Learn about nutritional planning, physical health, and mindfulness practices.' },
    { id: 'mock-8', title: 'Resume Review & Interview Prep', date: '2026-10-08', time: '1:00 PM', location: 'Career Center', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg', attendees: [], description: 'Get one-on-one expert feedback on your resume and practice mock interview panels.' },
    { id: 'mock-9', title: 'Developer Tools Workshop', date: '2026-10-18', time: '6:00 PM', location: 'Computer Lab 3', coverImage: '/pexels-amine-1285347-9371719.jpg', attendees: [], description: 'Get hands-on experience with command line git, docker, and remote servers.' },
    { id: 'mock-10', title: 'Classic Film Screening Night', date: '2026-10-29', time: '8:00 PM', location: 'Campus Theatre', coverImage: '/pexels-cottonbro-5989925.jpg', attendees: [], description: 'Join us for a cozy screening of classic cinema works. Free popcorn included.' }
  ];

  // Filter events (real and mock) to only those the user is going to
  const userGoingEvents = React.useMemo(() => {
    if (!currentUser) return [];
    const combined = [...events, ...MOCK_CALENDAR_EVENTS];
    return combined.filter(e => 
      e.attendees?.some(name => 
        name === currentUser.name || 
        currentUser.name.startsWith(name) || 
        name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
      )
    );
  }, [events, currentUser]);

  const [selectedDate, setSelectedDate] = useState<Date>(
    userGoingEvents[0]
      ? new Date(userGoingEvents[0].date + 'T00:00:00')
      : new Date()
  );

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
    return userGoingEvents.filter(e => e.date === dateString);
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
    setSelectedDate(date);
  };

  const selectedDayEvents = getEventsForDate(selectedDate);
  const selectedDateLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownloadCalendar = (evt: any) => {
    const cleanTitle = evt.title.replace(/[^\w\s-]/gi, '');
    const cleanDescription = evt.description ? evt.description.replace(/[^\w\s-]/gi, '') : '';
    const cleanLocation = evt.location ? evt.location.replace(/[^\w\s-]/gi, '') : 'Campus';
    
    // Create basic ICS content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Evida//Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDescription}`,
      `LOCATION:${cleanLocation}`,
      `DTSTART:${evt.date.replace(/-/g, '')}T090000`,
      `DTEND:${evt.date.replace(/-/g, '')}T100000`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllGoing = () => {
    if (userGoingEvents.length === 0) return;
    
    const icsHeader = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Evida//Calendar//EN'
    ];
    
    const icsEvents = userGoingEvents.map(evt => {
      const cleanTitle = evt.title.replace(/[^\w\s-]/gi, '');
      const cleanDescription = evt.description ? evt.description.replace(/[^\w\s-]/gi, '') : '';
      const cleanLocation = evt.location ? evt.location.replace(/[^\w\s-]/gi, '') : 'Campus';
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${cleanTitle}`,
        `DESCRIPTION:${cleanDescription}`,
        `LOCATION:${cleanLocation}`,
        `DTSTART:${evt.date.replace(/-/g, '')}T090000`,
        `DTEND:${evt.date.replace(/-/g, '')}T100000`,
        'END:VEVENT'
      ].join('\r\n');
    });
    
    const icsContent = [...icsHeader, ...icsEvents, 'END:VCALENDAR'].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Evida_My_Calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-12 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/[0.04] pb-5">
        <div>
          <h1 className="text-3xl font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Campus Calendar
          </h1>
          <p className="text-sm text-[#5A554E] font-semibold mt-2.5 leading-relaxed">
            View the events you are attending. Export all of them to your calendar at once.
          </p>
        </div>
        {userGoingEvents.length > 0 && (
          <Button 
            variant="primary"
            onClick={handleExportAllGoing}
            className="self-start md:self-center bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer border-none"
          >
            <Calendar className="h-4 w-4" />
            Export My Calendar (.ics)
          </Button>
        )}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-black/[0.04] rounded-[24px] p-4 sm:p-6 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#2A2621] font-bold text-xl uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => handleMonthNav('prev')}
                className="h-10 w-10 border border-[#D8D2BC]/40 hover:border-[#FD5C05]/30 hover:bg-[#FD5C05]/5 text-black hover:text-[#FD5C05] rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleMonthNav('next')}
                className="h-10 w-10 border border-[#D8D2BC]/40 hover:border-[#FD5C05]/30 hover:bg-[#FD5C05]/5 text-black hover:text-[#FD5C05] rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Week Days Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4 text-center font-bold text-[9px] sm:text-[10px] tracking-widest text-[#5A554E] uppercase">
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
              const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.date) : [];
              const hasEvents = dayEvents.length > 0;

              return (
                <div 
                  key={idx}
                  onClick={() => handleDayClick(cell.date)}
                  className={`
                    relative aspect-square border rounded-xl sm:rounded-2xl p-1.5 sm:p-2 cursor-pointer flex flex-col justify-between transition-all duration-300 overflow-hidden
                    ${cell.isCurrentMonth 
                      ? hasEvents
                        ? 'bg-[#FD5C05]/10 border-[#FD5C05]/30 hover:bg-[#FD5C05]/15'
                        : 'bg-white border-black/[0.04] hover:bg-black/[0.01] hover:border-black/15 shadow-sm'
                      : 'bg-black/[0.01] border-transparent text-[#5A554E] opacity-40'
                    }
                  `}
                >
                  <span className="relative z-10 text-[10px] font-black px-1.5 py-0.5 rounded-md leading-none w-fit text-[#2A2621]">
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && hasEvents && (
                    <div className="flex flex-col items-center pb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] shadow-[0_0_8px_rgba(253,92,5,0.5)] animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Day Details & Inspector */}
        <div className="lg:col-span-4 bg-white border border-black/[0.04] rounded-[24px] p-6 shadow-sm space-y-6">
          <div className="border-b border-black/[0.04] pb-4">
            <span className="text-[#FD5C05] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <CalendarDays className="h-3.5 w-3.5" /> Events on
            </span>
            <h3 className="font-extrabold text-[#2A2621] text-lg uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedDateLabel}
            </h3>
          </div>

          <div className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((evt, idx) => {
                const isUserGoing = currentUser ? evt.attendees?.includes(currentUser.name) : false;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.03] space-y-3 hover:border-[#FD5C05]/20 hover:bg-[#FD5C05]/3 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#2A2621] uppercase tracking-wide leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        {evt.title}
                      </h4>
                      {isUserGoing && (
                        <span className="text-[8px] font-black uppercase bg-[#FD5C05] text-white px-2 py-0.5 rounded-full tracking-wider shrink-0 flex items-center gap-0.5 animate-pulse">
                          <MapPin className="h-2 w-2 fill-white text-white" />
                          Going
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 text-[11px] text-[#5A554E] font-medium">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {evt.time || 'All Day'}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {evt.location || 'Campus'}</span>
                    </div>

                    <div className="pt-2.5 border-t border-black/[0.04] flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] border-none font-bold text-[9px] py-1.5 cursor-pointer"
                        onClick={() => handleDownloadCalendar(evt)}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1 inline-block align-text-bottom" />
                        Add to Calendar
                      </Button>
                      <Link
                        href={`/events/${evt.id}`}
                        className="flex-1 py-1.5 px-2.5 text-center bg-black/[0.03] hover:bg-black/[0.08] text-[#2A2621] rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs sm:text-sm text-[#5A554E] font-light">
                No events scheduled for this day. Click another date on the calendar grid to inspect.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

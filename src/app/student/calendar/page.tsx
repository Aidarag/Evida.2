'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
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
import { downloadEventICS } from '@/lib/calendar';

export default function StudentCalendarPage() {
  const { events } = useEvents();
  const { currentUser } = useUser();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // Default to October 2026

  // Filter events to only those the user is attending (real data only)
  const userGoingEvents = React.useMemo(() => {
    if (!currentUser) return [];
    return events.filter(e =>
      e.status === 'approved' &&
      e.attendees?.includes(currentUser.name)
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

  const handleDownloadCalendar = (evt: typeof userGoingEvents[0]) => {
    try {
      downloadEventICS(evt);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-12 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/[0.04] pb-5">
        <div>
          <h1 className="font-black text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Campus Calendar
          </h1>
          <p className="text-sm text-[#5A554E] font-semibold mt-2.5 leading-relaxed">
            View the events you are attending.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-black/[0.04] rounded-[24px] p-4 sm:p-6 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#2A2621] font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
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
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.date) : [];
              const hasEvents = dayEvents.length > 0;

              const today = new Date();
              const isToday =
                cell.date.getFullYear() === today.getFullYear() &&
                cell.date.getMonth() === today.getMonth() &&
                cell.date.getDate() === today.getDate();

              const isSelected =
                cell.date.getFullYear() === selectedDate.getFullYear() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getDate() === selectedDate.getDate();

              // Color per category
              const getCatColor = (cat?: string) => {
                const c = (cat || '').toLowerCase();
                if (c.includes('sport') || c.includes('athlet')) return '#22c55e'; // green
                if (c.includes('music') || c.includes('art') || c.includes('greek')) return '#a855f7'; // purple
                if (c.includes('career') || c.includes('workshop') || c.includes('academic')) return '#3b82f6'; // blue
                if (c.includes('social') || c.includes('party')) return '#ec4899'; // pink
                return '#FD5C05'; // orange default
              };

              const primaryColor = hasEvents ? getCatColor(dayEvents[0].category) : null;

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(cell.date)}
                  className={`
                    relative aspect-square rounded-xl sm:rounded-2xl p-1.5 sm:p-2 cursor-pointer flex flex-col justify-between transition-all duration-200 overflow-hidden select-none
                    ${!cell.isCurrentMonth
                      ? 'opacity-25 pointer-events-none'
                      : isSelected
                        ? 'ring-2 ring-[#2A2621] ring-offset-1 shadow-md'
                        : hasEvents
                          ? 'shadow-sm hover:scale-[1.04]'
                          : 'hover:bg-black/[0.03] hover:border hover:border-black/10'
                    }
                  `}
                  style={
                    isSelected
                      ? { background: '#2A2621' }
                      : hasEvents
                        ? { background: `${primaryColor ?? '#FD5C05'}18`, border: `1px solid ${primaryColor ?? '#FD5C05'}40` }
                        : { background: '#fff', border: '1px solid rgba(0,0,0,0.04)' }
                  }
                >
                  {/* Today ring */}
                  {isToday && !isSelected && (
                    <span className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-[#FD5C05] ring-offset-1 pointer-events-none" />
                  )}

                  {/* Day number */}
                  <div className="flex items-start justify-between w-full">
                    <span
                      className={`text-[11px] sm:text-xs font-black leading-none px-1 rounded-md ${
                        isSelected
                          ? 'text-white'
                          : hasEvents
                            ? 'text-[#2A2621]'
                            : isToday
                              ? 'text-[#FD5C05]'
                              : 'text-[#5A554E]'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {/* Event count badge */}
                    {hasEvents && dayEvents.length > 1 && (
                      <span
                        className="text-[7px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-sm"
                        style={{
                          background: isSelected ? 'rgba(255,255,255,0.2)' : (primaryColor ?? '#FD5C05'),
                          color: '#fff',
                        }}
                      >
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Category color dots */}
                  {hasEvents && (
                    <div className="flex items-center gap-0.5 flex-wrap mt-auto">
                      {dayEvents.slice(0, 4).map((ev, eIdx) => (
                        <span
                          key={eIdx}
                          className="h-1.5 w-1.5 rounded-full flex-shrink-0 shadow-sm"
                          style={{ background: getCatColor(ev.category) }}
                          title={ev.category}
                        />
                      ))}
                    </div>
                  )}

                  {/* Event title (sm+) */}
                  {hasEvents && !isSelected && (
                    <span
                      className="text-[7px] sm:text-[8px] font-bold truncate leading-tight hidden sm:block mt-0.5"
                      style={{ color: primaryColor ?? '#FD5C05' }}
                    >
                      {dayEvents[0].title}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Day Details & Inspector */}
        <div className="lg:col-span-4 bg-white border border-black/[0.04] rounded-[24px] p-6 shadow-sm space-y-6">
          <div className="border-b border-black/[0.04] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[#FD5C05] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <CalendarDays className="h-3.5 w-3.5" /> Events on
              </span>
              <h3 className="font-extrabold text-[#2A2621] text-lg uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {selectedDateLabel}
              </h3>
            </div>
            {selectedDayEvents.length > 0 && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] border border-[#FD5C05]/20 px-2.5 py-1 rounded-full">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            )}
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
                      <span className="flex-1 py-1.5 px-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[9px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" /> In Calendar ✓
                      </span>
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

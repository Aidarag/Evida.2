'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Bookmark,
  Building
} from 'lucide-react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Button from '@/components/ui/Button';
import { downloadEventICS } from '@/lib/calendar';

export default function StudentCalendarPage() {
  const { events } = useEvents();
  const { currentUser, activeProfile } = useUser();

  const [calendarFilter, setCalendarFilter] = useState<'org' | 'rsvp' | 'all'>(
    activeProfile.type === 'organization' ? 'org' : 'rsvp'
  );

  // Filter events hosted by active organization
  const orgEvents = React.useMemo(() => {
    if (activeProfile.type !== 'organization') return [];
    return events.filter(e =>
      e.organizationId === activeProfile.orgId ||
      (e.organizationName && e.organizationName.toLowerCase() === activeProfile.name.toLowerCase())
    );
  }, [events, activeProfile]);

  // Filter events user is attending
  const userGoingEvents = React.useMemo(() => {
    if (!currentUser) return [];
    const name = currentUser.name;
    const username = currentUser.username;
    return events.filter(e =>
      e.status === 'approved' &&
      (
        (name && e.attendees?.includes(name)) ||
        (username && e.attendees?.includes(username))
      )
    );
  }, [events, currentUser]);

  const displayedCalendarEvents = React.useMemo(() => {
    if (calendarFilter === 'org' && activeProfile.type === 'organization') {
      return orgEvents;
    }
    if (calendarFilter === 'all') {
      return events.filter(e => e.status === 'approved');
    }
    return userGoingEvents;
  }, [calendarFilter, activeProfile, orgEvents, events, userGoingEvents]);

  // Determine initial calendar month based on user's events
  const [calendarDate, setCalendarDate] = useState<Date>(() => {
    if (userGoingEvents.length > 0) {
      const firstEvtDate = new Date(userGoingEvents[0].date + 'T00:00:00');
      if (!isNaN(firstEvtDate.getTime())) return firstEvtDate;
    }
    return new Date(2026, 9, 1); // Default to Oct 2026 if no events
  });

  // Sync calendar date when user's events change if calendarDate is not set
  useEffect(() => {
    if (userGoingEvents.length > 0) {
      const firstEvtDate = new Date(userGoingEvents[0].date + 'T00:00:00');
      if (!isNaN(firstEvtDate.getTime())) {
        setCalendarDate(prev => {
          // If prev month has no events, switch to event month
          const prevY = prev.getFullYear();
          const prevM = String(prev.getMonth() + 1).padStart(2, '0');
          const hasInPrev = userGoingEvents.some(e => e.date.startsWith(`${prevY}-${prevM}`));
          return hasInPrev ? prev : firstEvtDate;
        });
      }
    }
  }, [userGoingEvents]);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (userGoingEvents.length > 0) {
      const firstDate = new Date(userGoingEvents[0].date + 'T00:00:00');
      if (!isNaN(firstDate.getTime())) return firstDate;
    }
    return new Date();
  });

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
    return displayedCalendarEvents.filter(e => e.date === dateString);
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

  // Color helper per category
  const getCatColor = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('sport') || c.includes('athlet')) return '#22c55e'; // green
    if (c.includes('music') || c.includes('art') || c.includes('greek') || c.includes('concert')) return '#a855f7'; // purple
    if (c.includes('career') || c.includes('workshop') || c.includes('academic')) return '#3b82f6'; // blue
    if (c.includes('social') || c.includes('party')) return '#ec4899'; // pink
    return '#FD5C05'; // orange default
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-12 space-y-6">
      {/* ── Header & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/[0.04] pb-5 text-left">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-[#2A2621] tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Campus Calendar
            </h1>
            {activeProfile.type === 'organization' && (
              <span className="bg-[#FD5C05]/10 text-[#FD5C05] border border-[#FD5C05]/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                Active Org: {activeProfile.name}
              </span>
            )}
          </div>
          <p className="text-xs text-[#5A554E] font-semibold mt-1 leading-relaxed">
            {activeProfile.type === 'organization'
              ? `Viewing schedule and experiences for ${activeProfile.name}.`
              : "Events you have RSVP'd to are automatically marked on your calendar below."
            }
          </p>

          {/* Filter Pills Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {activeProfile.type === 'organization' && (
              <button
                onClick={() => setCalendarFilter('org')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  calendarFilter === 'org'
                    ? 'bg-[#FD5C05] text-white border-[#FD5C05] shadow-xs'
                    : 'bg-white text-[#5A554E] border-black/[0.06] hover:bg-slate-50'
                }`}
              >
                {activeProfile.name} Schedule ({orgEvents.length})
              </button>
            )}
            <button
              onClick={() => setCalendarFilter('rsvp')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                calendarFilter === 'rsvp'
                  ? 'bg-[#FD5C05] text-white border-[#FD5C05] shadow-xs'
                  : 'bg-white text-[#5A554E] border-black/[0.06] hover:bg-slate-50'
              }`}
            >
              My RSVPs ({userGoingEvents.length})
            </button>
            <button
              onClick={() => setCalendarFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                calendarFilter === 'all'
                  ? 'bg-[#FD5C05] text-white border-[#FD5C05] shadow-xs'
                  : 'bg-white text-[#5A554E] border-black/[0.06] hover:bg-slate-50'
              }`}
            >
              All Campus Events
            </button>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#5A554E] bg-white border border-black/[0.04] rounded-2xl px-4 py-2.5 shadow-sm">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#FD5C05]" /> Campus</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Sports</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" /> Culture & Music</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" /> Academic & Career</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]" /> Social & Parties</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-black/[0.04] rounded-[24px] p-4 sm:p-6 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#2A2621] font-extrabold text-xl sm:text-2xl tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => handleMonthNav('prev')}
                className="h-10 w-10 border border-[#D8D2BC]/40 hover:border-[#FD5C05]/30 hover:bg-[#FD5C05]/5 text-black hover:text-[#FD5C05] rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleMonthNav('next')}
                className="h-10 w-10 border border-[#D8D2BC]/40 hover:border-[#FD5C05]/30 hover:bg-[#FD5C05]/5 text-black hover:text-[#FD5C05] rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Week Days Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3 text-center font-bold text-[9px] sm:text-[10px] tracking-widest text-[#5A554E] uppercase">
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
                        ? 'ring-2 ring-[#FD5C05] ring-offset-2 shadow-lg'
                        : hasEvents
                          ? 'shadow-md hover:scale-[1.04]'
                          : 'hover:bg-black/[0.03] hover:border hover:border-black/10'
                    }
                  `}
                  style={
                    isSelected
                      ? { background: '#2A2621', color: '#fff' }
                      : hasEvents
                        ? {
                            background: `linear-gradient(135deg, ${primaryColor ?? '#FD5C05'}22 0%, ${primaryColor ?? '#FD5C05'}10 100%)`,
                            border: `2px solid ${primaryColor ?? '#FD5C05'}`
                          }
                        : { background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }
                  }
                >
                  {/* Today ring */}
                  {isToday && !isSelected && (
                    <span className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-[#FD5C05] ring-offset-1 pointer-events-none" />
                  )}

                  {/* Day number & Event Badge Header */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-black leading-none px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'text-white bg-white/20'
                          : hasEvents
                            ? 'text-white shadow-sm'
                            : isToday
                              ? 'text-[#FD5C05] bg-[#FD5C05]/10'
                              : 'text-[#2A2621]'
                      }`}
                      style={hasEvents && !isSelected ? { background: primaryColor ?? '#FD5C05' } : undefined}
                    >
                      {cell.day}
                    </span>

                    {/* Multiple events count badge */}
                    {hasEvents && dayEvents.length > 1 && (
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-sm"
                        style={{
                          background: isSelected ? '#FD5C05' : '#2A2621',
                          color: '#fff',
                        }}
                      >
                        +{dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Title Badge Pill (Visual Highlight) */}
                  {hasEvents && (
                    <div className="mt-auto space-y-1">
                      {/* Mobile Colored Dot Indicator */}
                      <div className="flex items-center gap-1 sm:hidden">
                        {dayEvents.slice(0, 3).map((ev, eIdx) => (
                          <span
                            key={eIdx}
                            className="h-2 w-2 rounded-full flex-shrink-0 shadow-sm"
                            style={{ background: isSelected ? '#FD5C05' : getCatColor(ev.category) }}
                          />
                        ))}
                      </div>

                      {/* Desktop Event Title Pill */}
                      <div className="hidden sm:block">
                        {dayEvents.slice(0, 2).map((ev, eIdx) => (
                          <div
                            key={eIdx}
                            className="text-[8px] font-extrabold truncate leading-tight px-1.5 py-0.5 rounded-md shadow-xs mb-0.5"
                            style={{
                              background: isSelected ? 'rgba(255,255,255,0.15)' : `${getCatColor(ev.category)}`,
                              color: '#fff',
                            }}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
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
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FD5C05] text-white px-3 py-1 rounded-full shadow-sm">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((evt, idx) => {
                const catColor = getCatColor(evt.category);
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-black/[0.02] border-2 space-y-3 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                    style={{ borderColor: `${catColor}50` }}
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 w-1.5"
                      style={{ background: catColor }}
                    />
                    <div className="flex items-start justify-between gap-2 pl-2">
                      <div>
                        <span 
                          className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white inline-block mb-1.5"
                          style={{ background: catColor }}
                        >
                          {evt.category || 'Event'}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#2A2621] uppercase tracking-wide leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                          {evt.title}
                        </h4>
                      </div>
                      <span className="text-[8px] font-black uppercase bg-[#FD5C05] text-white px-2 py-0.5 rounded-full tracking-wider shrink-0 flex items-center gap-0.5 shadow-xs">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Attending
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-[11px] text-[#5A554E] font-medium pl-2">
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#FD5C05]" /> {evt.time || 'All Day'}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#FD5C05]" /> {evt.location || 'Campus'}</span>
                    </div>

                    <div className="pt-2.5 border-t border-black/[0.04] flex items-center gap-2 pl-2">
                      <span className="flex-1 py-2 px-3 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-xs">
                        <CheckCircle2 className="h-3 w-3" /> RSVP Confirmed
                      </span>
                      <Link
                        href={`/events/${evt.id}`}
                        className="py-2 px-3.5 text-center bg-[#2A2621] hover:bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-xs"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs sm:text-sm text-[#5A554E] font-medium bg-black/[0.01] border border-dashed border-black/10 rounded-2xl p-6">
                <Calendar className="h-8 w-8 text-[#5A554E]/40 mx-auto mb-2" />
                No attending events scheduled for this day.
                <p className="text-[11px] text-[#5A554E]/70 mt-1">
                  RSVP &quot;I&apos;m Going&quot; to campus events to automatically highlight them here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

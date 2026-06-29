'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Compass, Megaphone, Shield, MousePointer2, UserCheck, CalendarDays, LineChart, ArrowRight, Briefcase, Sparkles, Music, Trophy, GraduationCap, Users } from 'lucide-react';
import { DesktopNav } from '@/components/Navbar';
import EventCard from '@/components/student/EventCard';
import FeaturedEventCard from '@/components/student/FeaturedEventCard';
import AboutEvidaSection from '@/components/student/AboutEvidaSection';
import OurVisionSection from '@/components/student/OurVisionSection';
import { useEvents } from '@/lib/context/EventContext';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function LandingPage() {
  const router = useRouter();
  const { events } = useEvents();

  const faqData = {
    students: [
      {
        question: "Can I create my own event?",
        answer: "Yes. Students can submit events through Evida. Depending on your school’s policies, some events may require approval before they are published."
      },
      {
        question: "Do I need to join a club or organization to use Evida?",
        answer: "No. Every student can discover, save, and RSVP to events. You don’t need to belong to an organization to enjoy campus life."
      },
      {
        question: "Will I miss events if I don’t check Evida every day?",
        answer: "No. Save events you’re interested in and receive reminders so you never miss important dates."
      }
    ],
    schools: [
      {
        question: "How does Evida help our campus?",
        answer: "Evida centralizes campus events into one platform, making it easier to communicate with students, increase participation, and manage campus activities."
      },
      {
        question: "Can schools review events before they are published?",
        answer: "Yes. Schools have an administrative dashboard where they can review, approve, reject, or feature events according to campus policies."
      },
      {
        question: "Does Evida provide insights about student engagement?",
        answer: "Yes. Schools can access analytics such as event participation, attendance trends, and engagement metrics to better understand campus life."
      }
    ]
  };

  const [faqTab, setFaqTab] = React.useState<'students' | 'schools'>('students');
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  
  const approvedEvents = events.filter(e => e.status === 'approved');

  const [selectedCategory, setSelectedCategory] = React.useState('Sports');
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date(2026, 9, 1)); // October 2026

  const mockEventsByCategory: Record<string, Array<any>> = {
    'Sports': [
      { id: 'mock-sports-1', title: 'Blue Bears Basketball Game', category: 'Sports', date: 'Oct 12, 2026', time: '7:00 PM', location: 'Campus Arena', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg' },
      { id: 'mock-sports-2', title: 'Varsity Tennis Match', category: 'Sports', date: 'Oct 18, 2026', time: '3:00 PM', location: 'Tennis Courts', coverImage: '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg' },
      { id: 'mock-sports-3', title: 'Intramural Soccer Finals', category: 'Sports', date: 'Oct 24, 2026', time: '5:00 PM', location: 'Athletic Field', coverImage: '/pexels-yaroslav-shuraev-8513385.jpg' },
    ],
    'Homecoming': [
      { id: 'mock-home-1', title: 'Homecoming Football Game', category: 'Homecoming', date: 'Oct 15, 2026', time: '2:00 PM', location: 'Memorial Stadium', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg' },
      { id: 'mock-home-2', title: 'Homecoming Concert & Dance', category: 'Homecoming', date: 'Oct 16, 2026', time: '8:00 PM', location: 'Main Plaza', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
      { id: 'mock-home-3', title: 'Alumni Tailgate Party', category: 'Homecoming', date: 'Oct 15, 2026', time: '11:00 AM', location: 'West Lot', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg' },
    ],
    'Career Fair': [
      { id: 'mock-career-1', title: 'Annual Fall Career Fair', category: 'Career Fair', date: 'Oct 20, 2026', time: '10:00 AM', location: 'Student Union Ballroom', coverImage: '/pexels-edward-jenner-4031319.jpg' },
      { id: 'mock-career-2', title: 'Tech Resume Review', category: 'Career Fair', date: 'Oct 21, 2026', time: '2:00 PM', location: 'Science Hall 101', coverImage: '/pexels-markus-winkler-1430818-12199407.jpg' },
      { id: 'mock-career-3', title: 'Mock Interview Blitz', category: 'Career Fair', date: 'Oct 22, 2026', time: '1:00 PM', location: 'Career Center', coverImage: '/pexels-cottonbro-5989925.jpg' },
    ],
    'Workshops': [
      { id: 'mock-work-1', title: 'STEM Club Code & Coffee', category: 'Workshops', date: 'Oct 10, 2026', time: '9:00 AM', location: 'Engineering Lab B', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg' },
      { id: 'mock-work-2', title: 'Creative Writing Workshop', category: 'Workshops', date: 'Oct 14, 2026', time: '4:00 PM', location: 'Library Room 302', coverImage: '/pexels-cottonbro-5989925.jpg' },
      { id: 'mock-work-3', title: 'UI/UX Design Masterclass', category: 'Workshops', date: 'Oct 19, 2026', time: '6:00 PM', location: 'Design Studio', coverImage: '/pexels-markus-winkler-1430818-12199407.jpg' },
    ],
    'Orientation': [
      { id: 'mock-ori-1', title: 'Freshman Welcome Rally', category: 'Orientation', date: 'Oct 1, 2026', time: '9:00 AM', location: 'Quad', coverImage: '/pexels-ron-lach-8576102.jpg' },
      { id: 'mock-ori-2', title: 'Campus Scavenger Hunt', category: 'Orientation', date: 'Oct 2, 2026', time: '2:00 PM', location: 'Student Center', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg' },
      { id: 'mock-ori-3', title: 'President\'s Ice Cream Social', category: 'Orientation', date: 'Oct 3, 2026', time: '4:00 PM', location: 'President\'s Lawn', coverImage: '/pexels-yaroslav-shuraev-8513385.jpg' },
    ],
    'Concerts': [
      { id: 'mock-concert-1', title: 'Acoustic Sunset Session', category: 'Concerts', date: 'Oct 9, 2026', time: '6:00 PM', location: 'Amphitheater', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-concert-2', title: 'Battle of the Bands', category: 'Concerts', date: 'Oct 23, 2026', time: '8:00 PM', location: 'Campus Theatre', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
      { id: 'mock-concert-3', title: 'Jazz Ensemble Fall Show', category: 'Concerts', date: 'Oct 30, 2026', time: '7:30 PM', location: 'Music Hall', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
    ],
    'Parties': [
      { id: 'mock-party-1', title: 'Welcome Back Neon Rave', category: 'Parties', date: 'Oct 5, 2026', time: '9:00 PM', location: 'Student Plaza', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-party-2', title: 'Halloween Costume Ball', category: 'Parties', date: 'Oct 31, 2026', time: '8:00 PM', location: 'Gymnasium', coverImage: '/pexels-ron-lach-8576102.jpg' },
    ],
    'Clubs': [
      { id: 'mock-club-1', title: 'Astronomy Club Stargazing', category: 'Clubs', date: 'Oct 12, 2026', time: '9:00 PM', location: 'Observatory Hill', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-club-2', title: 'Chess Club Open Tournament', category: 'Clubs', date: 'Oct 17, 2026', time: '1:00 PM', location: 'Student Union', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg' },
    ],
    'Academic Events': [
      { id: 'mock-acad-1', title: 'Distinguished Lecture Series', category: 'Academic Events', date: 'Oct 8, 2026', time: '4:00 PM', location: 'Auditorium A', coverImage: '/pexels-edward-jenner-4031319.jpg' },
      { id: 'mock-acad-2', title: 'Undergraduate Research Symposium', category: 'Academic Events', date: 'Oct 22, 2026', time: '10:00 AM', location: 'Science Center Lobby', coverImage: '/pexels-edward-jenner-4031319.jpg' },
    ],
  };

  const getEventsForCategory = (catName: string) => {
    const normalized = catName.toLowerCase();
    if (normalized.includes('sport') || normalized.includes('athlet')) {
      return mockEventsByCategory['Sports'];
    }
    if (normalized.includes('homecoming')) {
      return mockEventsByCategory['Homecoming'];
    }
    if (normalized.includes('career') || normalized.includes('network') || normalized.includes('develop')) {
      return mockEventsByCategory['Career Fair'];
    }
    if (normalized.includes('workshop') || normalized.includes('hackathon')) {
      return mockEventsByCategory['Workshops'];
    }
    if (normalized.includes('orientation') || normalized.includes('campus') || normalized.includes('volunteer')) {
      return mockEventsByCategory['Orientation'];
    }
    if (normalized.includes('concert') || normalized.includes('cultural')) {
      return mockEventsByCategory['Concerts'];
    }
    if (normalized.includes('party') || normalized.includes('greek')) {
      return mockEventsByCategory['Parties'];
    }
    if (normalized.includes('club') || normalized.includes('student org')) {
      return mockEventsByCategory['Clubs'];
    }
    return mockEventsByCategory['Academic Events'] || [];
  };

  const filteredEvents = approvedEvents.filter(
    (event) => event.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const categoryEvents = [...filteredEvents, ...getEventsForCategory(selectedCategory)].slice(0, 3);

  const marqueeCategories = [
    "Sports", "Homecoming", "Career Fairs", "Workshops", "Orientation", 
    "Concerts", "Cultural Events", "Student Organizations", "Networking", 
    "Volunteering", "Greek Life", "Athletics", "Hackathons", 
    "Career Development", "Campus Life"
  ];

  // Dynamic Calendar Calculation
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  
  // Get days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get first day of the month (0: Sunday, 1: Monday, ..., 6: Saturday)
  const firstDayOfMonth = new Date(year, month, 1);
  // Map so that Monday is 0, Tuesday is 1, ..., Sunday is 6
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  
  // Get days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  // Create calendar grid array
  const calendarDays = [];
  
  // 1. Add previous month's offset days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  
  // 2. Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  
  // 3. Add next month's offset days to complete the grid (up to multiple of 7, e.g., 35 or 42)
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  // We want to highlight exactly 10 different dates in the active month
  const highlightedDays = [3, 5, 8, 12, 15, 18, 20, 22, 26, 29];

  // Helper to get highlight style based on the day index (Santiago Orange, Gold Black, Landmark)
  const getHighlightStyle = (day: number) => {
    // 10 days: 4 orange, 3 black, 3 gray
    if ([3, 12, 20, 26].includes(day)) {
      return {
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
        bulletColor: 'bg-[#eb5e28]',
      };
    }
    if ([5, 15, 22].includes(day)) {
      return {
        bgColor: 'bg-[#2c2324]/10',
        borderColor: 'border-[#2c2324]',
        textColor: 'text-[#2c2324]',
        bulletColor: 'bg-[#2c2324]',
      };
    }
    // [8, 18, 29]
    return {
      bgColor: 'bg-[#766754]/10',
      borderColor: 'border-[#766754]',
      textColor: 'text-[#766754]',
      bulletColor: 'bg-[#766754]',
    };
  };

  // Get events on a specific date (using the context events)
  const getEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    return events.filter(e => e.date === dateString && e.status === 'approved');
  };

  // Map category to icon and color
  const getCategoryIconAndColor = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('music') || catLower.includes('concert') || catLower.includes('show') || catLower.includes('art') || catLower.includes('theater')) {
      return {
        icon: <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
      };
    }
    if (catLower.includes('sport') || catLower.includes('game') || catLower.includes('match') || catLower.includes('trophy')) {
      return {
        icon: <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
      };
    }
    if (catLower.includes('career') || catLower.includes('job') || catLower.includes('fair') || catLower.includes('workshop') || catLower.includes('seminar')) {
      return {
        icon: <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
      };
    }
    if (catLower.includes('social') || catLower.includes('club') || catLower.includes('meet') || catLower.includes('association')) {
      return {
        icon: <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
      };
    }
    if (catLower.includes('grad') || catLower.includes('commence') || catLower.includes('ceremony')) {
      return {
        icon: <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
        bgColor: 'bg-[#eb5e28]/10',
        borderColor: 'border-[#eb5e28]',
        textColor: 'text-[#eb5e28]',
      };
    }
    return {
      icon: <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb5e28]" />,
      bgColor: 'bg-[#eb5e28]/10',
      borderColor: 'border-[#eb5e28]',
      textColor: 'text-[#eb5e28]',
    };
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Full-Screen Cinematic Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#0F0F13]">
        {/* Background Image (Vibrant Real Color) */}
        <div 
          className="absolute inset-0 w-full h-full bg-[url('/pexels-yaroslav-shuraev-8513385.jpg')] bg-cover bg-center opacity-35 contrast-100"
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F13]/80 via-transparent to-[#0F0F13] z-0" />

        {/* Hero Content (Centered) */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto -mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-wide mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            Discover Evida, the digital home of campus life and community connection
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/student/events" className="bg-[var(--color-evida-blue)] text-[#111827] font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors flex items-center gap-2 rounded-sm shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="bg-transparent border-2 border-[var(--color-evida-blue)] text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-[var(--color-evida-blue)] hover:text-[#111827] transition-colors flex items-center gap-2 rounded-sm">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scrolling Category Marquee (Bottom of Hero) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#2c2324]/90 backdrop-blur-sm py-5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-[#efece3] font-bold text-lg tracking-[0.2em] uppercase opacity-90 items-center">
              <span>ORIENTATION</span>
              <EvidaLogo size={22} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={22} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={22} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={22} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={22} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={22} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={22} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={22} showText={false} />
              
              {/* Duplicate for infinite effect */}
              <span>ORIENTATION</span>
              <EvidaLogo size={22} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={22} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={22} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={22} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={22} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={22} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={22} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={22} showText={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 1. About Evida Section */}
      <AboutEvidaSection />

      {/* 2. Our Mission (Vision) Section */}
      <OurVisionSection />

      {/* 3. How it Works */}
      <section className="w-full py-24 bg-white font-sans overflow-hidden" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="text-[#eb5e28] font-bold uppercase text-xs tracking-[0.2em]">
              Process
            </span>
            <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              How It Works
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
              Evida simplifies campus engagement in four simple steps. Here is how you can get started.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {[
              {
                number: "01",
                title: "Discover",
                icon: Search,
                description: "Find exactly what you're looking for. Filter by category, date, or organization to discover the best of campus life."
              },
              {
                number: "02",
                title: "Create",
                icon: MousePointer2,
                description: "Host your own event, workshop, or promotion. Customize the details and publish instantly for your club or community."
              },
              {
                number: "03",
                title: "Attend",
                icon: UserCheck,
                description: "RSVP to events, save them to your profile, and receive notifications. Show up and connect with your fellow students."
              },
              {
                number: "04",
                title: "Engage",
                icon: LineChart,
                description: "Track attendance, collect feedback, and analyze engagement. Administrators and student leaders get real-time analytics."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200/60 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Top Row: Number & Icon */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-extrabold text-2xl text-[#eb5e28]" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.number}
                    </span>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200/60 text-[#eb5e28] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Bottom Area: Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Explore by Category Section */}
      <section id="explore-categories" className="relative w-full bg-slate-50 py-24 border-t border-slate-100 mt-20">
        {/* Torn Paper Edges - Top Transition Only */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-slate-50 edge-top z-10" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 z-20 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[#eb5e28] font-bold uppercase text-xs tracking-[0.2em]">
              Discovery
            </span>
            <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Explore by Category
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
              Click on a category to filter campus events instantly. Discover what interests you the most.
            </p>
          </div>

          {/* Category Selector (Pills) */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {Object.keys(mockEventsByCategory).map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                    isActive
                      ? 'bg-[#eb5e28] text-white border-transparent shadow-lg shadow-blue-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-400 shadow-sm'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {categoryEvents.map((event) => (
              <div 
                key={event.id}
                className="transform transition-all duration-500 animate-fade-in"
              >
                <FeaturedEventCard 
                  event={event}
                  onClick={() => router.push(`/events/${event.id}`)}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5.5 Infinite Category Marquee */}
      <section className="relative w-full bg-white py-12 border-t border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee flex gap-2 text-white">
            {[...marqueeCategories, ...marqueeCategories, ...marqueeCategories].map((cat, idx) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={`${cat}-${idx}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-6 py-3 mx-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer hover:scale-105 ${
                    isActive
                      ? 'bg-[#eb5e28] text-white border-transparent shadow-lg shadow-blue-500/10'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-400 shadow-sm'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Calendar Section (Light Theme) */}
      <section id="calendar" className="relative w-full bg-white py-24 border-t border-slate-100">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20">
          {/* Campus Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            
            {/* Left side: What's Happening Next */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[#eb5e28] font-bold uppercase text-xs tracking-[0.2em]">
                What's Happening Next
              </span>
              <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Your Campus <span className="text-[#eb5e28]">Calendar</span> At A Glance
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Never miss a beat. Discover upcoming campus events, connect with student organizations, and make the most of your college experience.
              </p>
              <div className="pt-2">
                <Link href="/student/events" className="inline-flex bg-[#eb5e28] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-blue-700 transition-colors items-center gap-2 rounded-full shadow-lg shadow-blue-500/10">
                  Explore Events <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right side: Custom Illustrated Calendar */}
            <div className="lg:col-span-7 w-full">
              <div className="relative bg-slate-50 border border-slate-200/60 rounded-[32px] p-6 md:p-8 shadow-xl overflow-visible group/calendar transition-all duration-500 hover:border-slate-300/80 hover:shadow-2xl">
                
                {/* Binder rings at the top */}
                <div className="absolute top-0 left-0 right-0 h-4 flex justify-around px-12 -translate-y-1/2 z-30">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full border border-black/10 shadow-sm relative">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/30 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6 pt-2 border-b border-slate-200/60 pb-4">
                  <div className="text-left">
                    <span className="text-[#eb5e28] font-bold uppercase text-[10px] tracking-[0.2em]">CAMPUS LIFE</span>
                    <h4 className="text-slate-900 font-bold text-lg md:text-xl tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                      {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const prev = new Date(calendarDate);
                        prev.setMonth(prev.getMonth() - 1);
                        setCalendarDate(prev);
                      }}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors text-xs font-bold cursor-pointer"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => {
                        const next = new Date(calendarDate);
                        next.setMonth(next.getMonth() + 1);
                        setCalendarDate(next);
                      }}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors text-xs font-bold cursor-pointer"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {calendarDays.map((cell, idx) => {
                    const isHighlighted = cell.isCurrentMonth && highlightedDays.includes(cell.day);
                    const dayEvents = getEventsForDate(cell.date);
                    const hasEvents = dayEvents.length > 0;
                    
                    if (!cell.isCurrentMonth) {
                      return (
                        <div 
                          key={`offset-${idx}`}
                          className="aspect-square bg-slate-200/20 border border-slate-200/30 rounded-lg opacity-30 flex items-center justify-center text-[10px] text-slate-300"
                        >
                          {cell.day}
                        </div>
                      );
                    }
                    
                    if (isHighlighted) {
                      const style = getHighlightStyle(cell.day);
                      const eventTitle = hasEvents ? dayEvents[0].title : `Campus Event ${cell.day}`;
                      const eventId = hasEvents ? dayEvents[0].id : 'mock';
                      
                      return (
                        <div 
                          key={`day-${cell.day}`}
                          onClick={() => {
                            if (hasEvents) {
                              router.push(`/events/${eventId}`);
                            } else {
                              router.push(`/student/events?date=${cell.date.toISOString().split('T')[0]}`);
                            }
                          }}
                          className={`relative aspect-square ${style.bgColor} rounded-xl border ${style.borderColor} flex flex-col items-center justify-center text-[10px] sm:text-xs ${style.textColor} font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300`}
                        >
                          <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-bold">
                            {cell.day}
                          </span>
                          
                          {/* Dot indicator */}
                          <div className={`h-1.5 w-1.5 rounded-full ${style.bulletColor} mt-2 animate-pulse`} />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2c2324] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                            {eventTitle}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={`day-${cell.day}`}
                        className="aspect-square bg-white rounded-xl border border-slate-200/60 flex items-center justify-center text-[10px] sm:text-xs text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="relative w-full bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Title and overlapping circles */}
          <div className="lg:col-span-4 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-slate-900 font-extrabold text-5xl md:text-6xl uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              FAQ
            </h2>
            
            {/* Overlapping Brand Circles (from the screenshot design) */}
            <div className="relative w-28 h-16 flex items-center justify-center lg:justify-start">
              <div className="w-12 h-12 rounded-full border-4 border-[#eb5e28] opacity-80" />
              <div className="w-12 h-12 rounded-full border-4 border-[#eb5e28] opacity-80 -ml-4" />
            </div>
          </div>

          {/* Right Column: Tab Selector and Accordion List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tab Selector */}
            <div className="flex space-x-2 bg-slate-200/60 p-1 rounded-full border border-slate-300/20 w-fit">
              <button
                onClick={() => {
                  setFaqTab('students');
                  setExpandedFaq(null);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  faqTab === 'students'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                For Students
              </button>
              <button
                onClick={() => {
                  setFaqTab('schools');
                  setExpandedFaq(null);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  faqTab === 'schools'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                For Schools
              </button>
            </div>

            {/* Accordion Cards */}
            <div className="space-y-4">
              {faqData[faqTab].map((item, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-300 shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-slate-900 font-bold text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.question}
                      </span>
                      <span className="text-slate-500 text-xl font-medium shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    
                    {/* Expandable Answer */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[200px] border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      <p className="px-6 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 7. Closing Statement Section */}
      <section className="relative w-full bg-[#0B0B0E] pt-32 pb-48 overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
        {/* Soft Ambient Radial Glows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-t from-[var(--color-evida-blue)]/5 via-[var(--color-evida-lime)]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center z-20 space-y-8">
          <h2 className="text-white font-extrabold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            College Ends.<br />
            <span className="text-[var(--color-evida-lime)]">
              Memories Don’t.
            </span>
          </h2>
          
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Every event you attend, every connection you make, and every memory you create begins with a single place. Welcome to your campus life, reimagined.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-[var(--color-evida-lime)] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[var(--color-evida-lime)]/20 cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Giant Immersive EVIDA Wordmark in Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none z-10 leading-none">
          <div className="w-full text-center text-[18vw] font-extrabold tracking-tighter uppercase opacity-10 text-[var(--color-evida-lime)] translate-y-[20%]">
            EVIDA
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full bg-[#0F0F13] pt-24 pb-12">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20 flex flex-col items-center">
          
          {/* Logo / Title */}
          <div className="mb-12 flex justify-center w-full">
             <EvidaLogo size={44} lightMode={false} text="Join Evida" />
          </div>


        </div>

        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-12 text-white/70 mb-12">
          
          {/* Contact Column */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Contact</h4>
            <div className="space-y-1 text-sm font-medium">
              <p className="text-white font-bold text-lg mb-2 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>EVIDA</p>
              <p>Campus Event & Engagement Platform</p>
              <p className="pt-2 hover:text-[var(--color-evida-coral)] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Discover Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Discover</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="#about-evida" className="hover:text-white transition-colors">About Evida</Link></li>
              <li><Link href="#our-mission" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="#explore-categories" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Platform</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/student/events" className="hover:text-white transition-colors">Explore Events</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Event</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Promotion</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/school/dashboard" className="hover:text-white transition-colors">School Dashboard</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Stay Social</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[var(--color-evida-lime)] font-bold text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

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

export default function LandingPage() {
  const router = useRouter();
  const { events } = useEvents();
  const [activeStep, setActiveStep] = React.useState(0);

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

  const mockEventsByCategory: Record<string, Array<any>> = {
    'Sports': [
      { id: 'mock-sports-1', title: 'Blue Bears Basketball Game', category: 'Sports', date: 'Oct 12, 2026', time: '7:00 PM', location: 'Campus Arena', coverImage: '/pexels-nick-rush-2508183-11211233.jpg' },
      { id: 'mock-sports-2', title: 'Varsity Tennis Match', category: 'Sports', date: 'Oct 18, 2026', time: '3:00 PM', location: 'Tennis Courts', coverImage: '/pexels-gasparzaldo-13464806.jpg' },
      { id: 'mock-sports-3', title: 'Intramural Soccer Finals', category: 'Sports', date: 'Oct 24, 2026', time: '5:00 PM', location: 'Athletic Field', coverImage: '/pexels-maorattias-5191958.jpg' },
    ],
    'Homecoming': [
      { id: 'mock-home-1', title: 'Homecoming Football Game', category: 'Homecoming', date: 'Oct 15, 2026', time: '2:00 PM', location: 'Memorial Stadium', coverImage: '/pexels-maorattias-5191958.jpg' },
      { id: 'mock-home-2', title: 'Homecoming Concert & Dance', category: 'Homecoming', date: 'Oct 16, 2026', time: '8:00 PM', location: 'Main Plaza', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-home-3', title: 'Alumni Tailgate Party', category: 'Homecoming', date: 'Oct 15, 2026', time: '11:00 AM', location: 'West Lot', coverImage: '/pexels-maorattias-5191958.jpg' },
    ],
    'Career Fair': [
      { id: 'mock-career-1', title: 'Annual Fall Career Fair', category: 'Career Fair', date: 'Oct 20, 2026', time: '10:00 AM', location: 'Student Union Ballroom', coverImage: '/pexels-rdne-7648057.jpg' },
      { id: 'mock-career-2', title: 'Tech Resume Review', category: 'Career Fair', date: 'Oct 21, 2026', time: '2:00 PM', location: 'Science Hall 101', coverImage: '/pexels-rdne-7648057.jpg' },
      { id: 'mock-career-3', title: 'Mock Interview Blitz', category: 'Career Fair', date: 'Oct 22, 2026', time: '1:00 PM', location: 'Career Center', coverImage: '/pexels-rdne-7648057.jpg' },
    ],
    'Workshops': [
      { id: 'mock-work-1', title: 'STEM Club Code & Coffee', category: 'Workshops', date: 'Oct 10, 2026', time: '9:00 AM', location: 'Engineering Lab B', coverImage: '/pexels-rdne-7648057.jpg' },
      { id: 'mock-work-2', title: 'Creative Writing Workshop', category: 'Workshops', date: 'Oct 14, 2026', time: '4:00 PM', location: 'Library Room 302', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-work-3', title: 'UI/UX Design Masterclass', category: 'Workshops', date: 'Oct 19, 2026', time: '6:00 PM', location: 'Design Studio', coverImage: '/pexels-rdne-7648057.jpg' },
    ],
    'Orientation': [
      { id: 'mock-ori-1', title: 'Freshman Welcome Rally', category: 'Orientation', date: 'Oct 1, 2026', time: '9:00 AM', location: 'Quad', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-ori-2', title: 'Campus Scavenger Hunt', category: 'Orientation', date: 'Oct 2, 2026', time: '2:00 PM', location: 'Student Center', coverImage: '/pexels-maorattias-5191958.jpg' },
      { id: 'mock-ori-3', title: 'President\'s Ice Cream Social', category: 'Orientation', date: 'Oct 3, 2026', time: '4:00 PM', location: 'President\'s Lawn', coverImage: '/pexels-amar-20025867.jpg' },
    ],
    'Concerts': [
      { id: 'mock-concert-1', title: 'Acoustic Sunset Session', category: 'Concerts', date: 'Oct 9, 2026', time: '6:00 PM', location: 'Amphitheater', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-concert-2', title: 'Battle of the Bands', category: 'Concerts', date: 'Oct 23, 2026', time: '8:00 PM', location: 'Campus Theatre', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-concert-3', title: 'Jazz Ensemble Fall Show', category: 'Concerts', date: 'Oct 30, 2026', time: '7:30 PM', location: 'Music Hall', coverImage: '/pexels-amar-20025867.jpg' },
    ],
    'Parties': [
      { id: 'mock-party-1', title: 'Welcome Back Neon Rave', category: 'Parties', date: 'Oct 5, 2026', time: '9:00 PM', location: 'Student Plaza', coverImage: '/pexels-amar-20025867.jpg' },
      { id: 'mock-party-2', title: 'Halloween Costume Ball', category: 'Parties', date: 'Oct 31, 2026', time: '8:00 PM', location: 'Gymnasium', coverImage: '/pexels-maorattias-5191958.jpg' },
    ],
    'Clubs': [
      { id: 'mock-club-1', title: 'Astronomy Club Stargazing', category: 'Clubs', date: 'Oct 12, 2026', time: '9:00 PM', location: 'Observatory Hill', coverImage: '/pexels-maorattias-5191958.jpg' },
      { id: 'mock-club-2', title: 'Chess Club Open Tournament', category: 'Clubs', date: 'Oct 17, 2026', time: '1:00 PM', location: 'Student Union', coverImage: '/pexels-rdne-7648057.jpg' },
    ],
    'Academic Events': [
      { id: 'mock-acad-1', title: 'Distinguished Lecture Series', category: 'Academic Events', date: 'Oct 8, 2026', time: '4:00 PM', location: 'Auditorium A', coverImage: '/pexels-rdne-7648057.jpg' },
      { id: 'mock-acad-2', title: 'Undergraduate Research Symposium', category: 'Academic Events', date: 'Oct 22, 2026', time: '10:00 AM', location: 'Science Center Lobby', coverImage: '/pexels-rdne-7648057.jpg' },
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

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Full-Screen Cinematic Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#0F0F13]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center opacity-50 grayscale contrast-125"
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
          <div className="relative w-full overflow-hidden bg-[#0F0F13]/90 backdrop-blur-sm py-5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-[var(--color-evida-coral)] font-bold text-xl tracking-[0.2em] uppercase opacity-90">
              <span>ORIENTATION</span>
              <span>HOMECOMING</span>
              <span>CAREER FAIR</span>
              <span>SPORTS</span>
              <span>WORKSHOPS</span>
              <span>STUDENT LIFE</span>
              <span>ORGANIZATIONS</span>
              <span>CULTURAL EVENTS</span>
              {/* Duplicate for infinite effect */}
              <span>ORIENTATION</span>
              <span>HOMECOMING</span>
              <span>CAREER FAIR</span>
              <span>SPORTS</span>
              <span>WORKSHOPS</span>
              <span>STUDENT LIFE</span>
              <span>ORGANIZATIONS</span>
              <span>CULTURAL EVENTS</span>
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
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-heading-2 text-gray-900">How It Works</h2>
            <p className="text-subtitle text-gray-500 max-w-2xl mx-auto">
              Evida simplifies campus engagement in four simple steps. Hover or click to explore the journey.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xl mx-auto mb-12">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--color-evida-blue)] via-[var(--color-evida-coral)] to-[var(--color-evida-lime)] transition-all duration-500 ease-out"
              style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
            />
          </div>

          {/* Cards Container */}
          {/* Desktop Layout (Horizontal Accordion) */}
          <div className="hidden lg:flex flex-row gap-6 w-full min-h-[380px] items-stretch text-left">
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
              const isActive = activeStep === index;
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => setActiveStep(index)}
                  className={`relative rounded-[32px] p-8 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none border-2 ${
                    isActive
                      ? 'flex-[2.5] bg-[#0F0F13] border-transparent text-white shadow-2xl scale-[1.01]'
                      : 'flex-[1] bg-gray-50/50 border-gray-100 hover:bg-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {/* Top Row: Number & Icon */}
                  <div className="flex justify-between items-start">
                    <span className={`font-bold text-3xl transition-colors duration-500 ${
                      isActive ? 'text-[var(--color-evida-lime)]' : 'text-gray-300'
                    }`} style={{ fontFamily: 'var(--font-display)' }}>
                      {step.number}
                    </span>
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${
                      isActive ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                  </div>

                  {/* Bottom Area: Title & Description */}
                  <div className="space-y-4">
                    <h3 className={`font-bold text-2xl uppercase tracking-wide transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    
                    <div className={`transition-all duration-500 overflow-hidden ${
                      isActive ? 'max-h-[150px] opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>
                      <p className="text-white/70 text-sm leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile/Tablet Layout (Vertical Accordion) */}
          <div className="lg:hidden flex flex-col gap-4 text-left">
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
              const isActive = activeStep === index;
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`rounded-2xl p-5 border-2 transition-all duration-500 ease-out cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#0F0F13] border-transparent text-white shadow-lg'
                      : 'bg-gray-50/50 border-gray-100 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className={`font-bold text-xl ${
                        isActive ? 'text-[var(--color-evida-lime)]' : 'text-gray-300'
                      }`} style={{ fontFamily: 'var(--font-display)' }}>
                        {step.number}
                      </span>
                      <h3 className={`font-bold text-lg uppercase tracking-wide ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'var(--font-display)' }}>
                        {step.title}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-xl ${
                      isActive ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${
                    isActive ? 'max-h-[120px] opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
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
      <section id="explore-categories" className="relative w-full bg-[#0F0F13] py-24 mt-20">
        {/* Torn Paper Edges - Top Transition Only */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-[#0F0F13] edge-top z-10" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 z-20 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[var(--color-evida-lime)] font-bold uppercase text-xs tracking-[0.2em]">
              Discovery
            </span>
            <h2 className="text-white font-extrabold text-3xl md:text-5xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Explore by Category
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
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
                      ? 'bg-[var(--color-evida-lime)] text-[#111827] border-transparent shadow-lg shadow-[var(--color-evida-lime)]/10'
                      : 'bg-[#16161A] text-white/70 border-white/5 hover:text-white hover:border-white/20'
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
      <section className="relative w-full bg-[#0F0F13] py-12 border-t border-b border-white/5 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0F0F13] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0F0F13] to-transparent z-10 pointer-events-none" />
        
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
                      ? 'bg-[var(--color-evida-lime)] text-[#111827] border-transparent shadow-lg shadow-[var(--color-evida-lime)]/10'
                      : 'bg-[#16161A] text-white/70 border-white/5 hover:text-white hover:border-white/20'
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

      {/* 6. Calendar Section (Standalone Dark Theme) */}
      <section id="calendar" className="relative w-full bg-[#0F0F13] py-24 border-t border-white/5">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20">
          {/* Campus Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            
            {/* Left side: What's Happening Next */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[var(--color-evida-lime)] font-bold uppercase text-xs tracking-[0.2em]">
                What's Happening Next
              </span>
              <h2 className="text-white font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Your Campus <br />
                <span className="text-[var(--color-evida-lime)]">Calendar</span> <br />
                At A Glance
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Never miss a beat. Discover upcoming campus events, connect with student organizations, and make the most of your college experience.
              </p>
              <div className="pt-2">
                <Link href="/student/events" className="inline-flex bg-[var(--color-evida-lime)] text-[#111827] font-bold uppercase tracking-widest text-[10px] px-5 py-3 hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors items-center gap-2 rounded-sm shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
                  Explore Events <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right side: Custom Illustrated Calendar */}
            <div className="lg:col-span-7 w-full">
              <div className="relative bg-[#16161A] border-2 border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-visible group/calendar transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(128,176,236,0.15)]">
                
                {/* Binder rings at the top */}
                <div className="absolute top-0 left-0 right-0 h-4 flex justify-around px-12 -translate-y-1/2 z-30">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full border border-black/40 shadow-md relative">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/30 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6 pt-2 border-b border-white/5 pb-4">
                  <div className="text-left">
                    <span className="text-[var(--color-evida-lime)] font-bold uppercase text-[10px] tracking-[0.2em]">CAMPUS LIFE</span>
                    <h4 className="text-white font-bold text-lg md:text-xl tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>October 2026</h4>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors text-xs font-bold">
                      &larr;
                    </button>
                    <button className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors text-xs font-bold">
                      &rarr;
                    </button>
                  </div>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[9px] font-bold text-white/40 uppercase tracking-widest">
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
                  {/* Empty days offsets */}
                  <div className="aspect-square bg-white/[0.02] rounded-lg border border-white/5 opacity-30 flex items-center justify-center text-[10px] text-white/20">28</div>
                  <div className="aspect-square bg-white/[0.02] rounded-lg border border-white/5 opacity-30 flex items-center justify-center text-[10px] text-white/20">29</div>
                  
                  {/* Active Days */}
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">1</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">2</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">3</div>
                  
                  {/* Day 4: Music (Concert) */}
                  <div className="relative aspect-square bg-[var(--color-evida-coral)]/20 rounded-xl border-2 border-[var(--color-evida-coral)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-coral)] font-bold">4</span>
                    <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-coral)] animate-pulse" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      Welcome Concert
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">5</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">6</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">7</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">8</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">9</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">10</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">11</div>
                  
                  {/* Day 12: Sports (Game Day) */}
                  <div className="relative aspect-square bg-[var(--color-evida-blue)]/20 rounded-xl border-2 border-[var(--color-evida-blue)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-blue)] font-bold">12</span>
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-blue)]" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      Championship Game
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">13</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">14</div>

                  {/* Day 15: Career Fair */}
                  <div className="relative aspect-square bg-[var(--color-evida-lime)]/20 rounded-xl border-2 border-[var(--color-evida-lime)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-lime)] font-bold">15</span>
                    <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-lime)]" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      Annual Career Fair
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">16</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">17</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">18</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">19</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">20</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">21</div>

                  {/* Day 22: Party */}
                  <div className="relative aspect-square bg-[var(--color-evida-coral)]/20 rounded-xl border-2 border-[var(--color-evida-coral)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-coral)] font-bold">22</span>
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-coral)]" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      Homecoming Bash
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">23</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">24</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">25</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">26</div>

                  {/* Day 27: Club */}
                  <div className="relative aspect-square bg-[var(--color-evida-blue)]/20 rounded-xl border-2 border-[var(--color-evida-blue)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-blue)] font-bold">27</span>
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-blue)]" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      STEM Club Workshop
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">28</div>
                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">29</div>

                  {/* Day 30: Graduation */}
                  <div className="relative aspect-square bg-[var(--color-evida-lime)]/20 rounded-xl border-2 border-[var(--color-evida-lime)] flex flex-col items-center justify-center text-[10px] sm:text-xs text-white font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300">
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-lime)] font-bold">30</span>
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--color-evida-lime)]" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F0F13] border border-white/10 text-[9px] text-white uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-xl z-50">
                      Commencement
                    </div>
                  </div>

                  <div className="aspect-square bg-[#1E1E24] rounded-xl border border-white/5 flex items-center justify-center text-[10px] sm:text-xs text-white/60 font-bold hover:border-white/20 transition-colors">31</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="relative w-full bg-[#0F0F13] py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Title and overlapping circles */}
          <div className="lg:col-span-4 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-white font-extrabold text-5xl md:text-6xl uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              FAQ
            </h2>
            
            {/* Overlapping Brand Circles (from the screenshot design) */}
            <div className="relative w-28 h-16 flex items-center justify-center lg:justify-start">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--color-evida-coral)] opacity-80" />
              <div className="w-12 h-12 rounded-full border-4 border-[var(--color-evida-blue)] opacity-80 -ml-4" />
            </div>
          </div>

          {/* Right Column: Tab Selector and Accordion List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tab Selector */}
            <div className="flex space-x-2 bg-[#16161A] p-1 rounded-full border border-white/5 w-fit">
              <button
                onClick={() => {
                  setFaqTab('students');
                  setExpandedFaq(null);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  faqTab === 'students'
                    ? 'bg-[var(--color-evida-lime)] text-[#111827]'
                    : 'text-white/60 hover:text-white'
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
                    ? 'bg-[var(--color-evida-lime)] text-[#111827]'
                    : 'text-white/60 hover:text-white'
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
                    className="bg-[#16161A] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.question}
                      </span>
                      <span className="text-white/60 text-xl font-medium shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    
                    {/* Expandable Answer */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[200px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      <p className="px-6 py-5 text-white/70 text-xs sm:text-sm leading-relaxed font-light">
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
             <span className="text-4xl font-bold tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-display)' }}>
               Evida.
             </span>
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

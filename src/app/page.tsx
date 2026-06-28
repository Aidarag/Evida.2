'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Compass, Megaphone, Shield, MousePointer2, UserCheck, CalendarDays, LineChart, ArrowRight, Briefcase, Sparkles, Music, Trophy, GraduationCap, Users } from 'lucide-react';
import { DesktopNav } from '@/components/Navbar';
import EventCard from '@/components/student/EventCard';
import FeaturedEventCard from '@/components/student/FeaturedEventCard';
import AboutEvidaSection from '@/components/student/AboutEvidaSection';
import OurVisionSection from '@/components/student/OurVisionSection';
import { useEvents } from '@/lib/context/EventContext';

export default function LandingPage() {
  const { events } = useEvents();
  const [activeStep, setActiveStep] = React.useState(0);
  
  // Map the specific featured events and their uploaded images
  const featuredEventsData = [
    { title: "Fall Welcome Orientation", image: "/pexels-amar-20025867.jpg" },
    { title: "Homecoming Football Game", image: "/pexels-maorattias-5191958.jpg" },
    { title: "Annual Career Fair", image: "/pexels-rdne-7648057.jpg" },
    { title: "Blue Bears Basketball Game", image: "/pexels-nick-rush-2508183-11211233.jpg" },
    { title: "STEM Club Workshop", image: "/pexels-rdne-7648057.jpg" },
    { title: "Varsity Tennis Match", image: "/pexels-gasparzaldo-13464806.jpg" }
  ];

  const approvedEvents = events.filter(e => e.status === 'approved');
  
  const displayEvents = featuredEventsData.map((data, i) => {
    // Pick a base event to copy details from
    const baseEvent = approvedEvents[i % approvedEvents.length] || {};
    return {
      ...baseEvent,
      id: `featured-${i}`,
      title: data.title,
      coverImage: data.image,
    };
  });

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
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-wide mb-8" style={{ fontFamily: 'var(--font-lufga)' }}>
            Discover Evida, the digital home of campus life and community connection
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/student/events" className="bg-[var(--color-evida-blue)] text-[#111827] font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors flex items-center gap-2 rounded-sm shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how-it-works" className="bg-transparent border-2 border-[var(--color-evida-blue)] text-[var(--color-evida-blue)] font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-[var(--color-evida-blue)] hover:text-[#111827] transition-colors flex items-center gap-2 rounded-sm">
              How Evida Works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scrolling Category Marquee (Bottom of Hero) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#0F0F13]/90 backdrop-blur-sm py-5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-[var(--color-evida-coral)] font-black text-xl tracking-[0.2em] uppercase opacity-90">
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

      {/* About Evida Section */}
      <AboutEvidaSection />

      {/* Our Vision Section */}
      <OurVisionSection />

      {/* Why Evida Section */}
      <section className="w-full bg-gray-50 py-24 mt-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-heading-2 text-gray-900">Why Evida?</h2>
            <p className="text-subtitle text-gray-600 leading-relaxed">
              Students miss events because information is scattered across emails, flyers, and group chats. Schools struggle to track engagement. Evida centralizes campus life into one unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Discover Events</h3>
              <p className="text-subtitle text-gray-500">Find exactly what you're looking for. Filter by category, date, or organization.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Megaphone className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Create & Promote</h3>
              <p className="text-subtitle text-gray-500">Launch events or promotions for your club and track RSVPs instantly.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Built for Schools</h3>
              <p className="text-subtitle text-gray-500">Administrators can review events, feature content, and monitor engagement analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
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
                    <span className={`font-black text-3xl transition-colors duration-500 ${
                      isActive ? 'text-[var(--color-evida-lime)]' : 'text-gray-300'
                    }`} style={{ fontFamily: 'var(--font-lufga)' }}>
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
                    <h3 className={`font-black text-2xl uppercase tracking-wide transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'var(--font-lufga)' }}>
                      {step.title}
                    </h3>
                    
                    <div className={`transition-all duration-500 overflow-hidden ${
                      isActive ? 'max-h-[150px] opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>
                      <p className="text-white/70 text-sm leading-relaxed font-medium">
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
                      <span className={`font-black text-xl ${
                        isActive ? 'text-[var(--color-evida-lime)]' : 'text-gray-300'
                      }`} style={{ fontFamily: 'var(--font-lufga)' }}>
                        {step.number}
                      </span>
                      <h3 className={`font-black text-lg uppercase tracking-wide ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'var(--font-lufga)' }}>
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
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* Featured Events Section (Grungy Dark Theme) */}
      <section className="relative w-full bg-[#0F0F13] py-24 mt-20 mb-12">
        {/* Torn Paper Edges */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-[#0F0F13] edge-top z-10" />
        <div className="absolute bottom-[-10px] left-0 w-full h-10 bg-white edge-bottom z-10" />
        <div className="absolute bottom-0 left-0 w-full h-10 bg-[#0F0F13]" /> {/* Block behind bottom edge */}

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-20">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
              <h2 className="text-heading-2 text-white mb-2">College end, memories don't</h2>
              <p className="text-subtitle text-white/70">Discover the biggest events happening this week on your campus.</p>
            </div>
            <Link href="/student/events" className="flex items-center gap-2 text-[12px] font-bold text-white hover:text-[var(--color-evida-lime)] transition-colors uppercase tracking-widest self-start md:self-center mt-2 md:mt-0">
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm mb-12">
            <input 
              type="text" 
              placeholder="Search events" 
              className="w-full bg-[#1A1A1E] border border-white/10 text-white placeholder-gray-500 text-sm px-4 py-3 rounded-none focus:outline-none focus:border-[var(--color-evida-lime)] transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, i) => (
              <FeaturedEventCard 
                key={`${event.id}-${i}`}
                event={event}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div className="relative mt-20 w-full overflow-hidden border-y border-white/5 bg-[#141417] py-4 flex items-center z-20">
          <div className="animate-marquee flex gap-12 text-[var(--color-evida-lime)] font-black text-xl tracking-[0.2em] uppercase opacity-80">
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
      </section>
      
      {/* Grungy Footer / Lower Landing Section */}
      <footer className="relative w-full bg-[#0F0F13] pt-24 pb-12 mt-20">
        {/* Torn Paper Top Edge */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-[#0F0F13] edge-top z-10" />
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20 flex flex-col items-center">
          
          {/* Logo / Title above cards */}
          <div className="mb-12 flex justify-center w-full">
             <span className="text-4xl font-black tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
               Evida.
             </span>
          </div>

          {/* Campus Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full mb-16 mt-8">
            
            {/* Left side: What's Happening Next */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[var(--color-evida-lime)] font-black uppercase text-xs tracking-[0.2em]">
                What's Happening Next
              </span>
              <h2 className="text-white font-black text-3xl md:text-5xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-lufga)' }}>
                Your Campus <br />
                <span className="bg-gradient-to-r from-[var(--color-evida-blue)] to-[var(--color-evida-coral)] bg-clip-text text-transparent">Calendar</span> <br />
                At A Glance
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Never miss a beat. Discover upcoming campus events, connect with student organizations, and make the most of your college experience.
              </p>
              <div className="pt-2">
                <Link href="/student/events" className="inline-flex bg-[var(--color-evida-lime)] text-[#111827] font-black uppercase tracking-widest text-[10px] px-5 py-3 hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors items-center gap-2 rounded-sm shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
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
                    <span className="text-[var(--color-evida-lime)] font-black uppercase text-[10px] tracking-[0.2em]">CAMPUS LIFE</span>
                    <h4 className="text-white font-black text-lg md:text-xl tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-lufga)' }}>October 2026</h4>
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
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[9px] font-black text-white/40 uppercase tracking-widest">
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-coral)] font-black">4</span>
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-blue)] font-black">12</span>
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-lime)] font-black">15</span>
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-coral)] font-black">22</span>
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-blue)] font-black">27</span>
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
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-[var(--color-evida-lime)] font-black">30</span>
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

          {/* Horizontal Scrolling Categories */}
          <div className="w-full mb-16 pt-8 border-t border-white/5 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">EXPLORE BY CATEGORY</span>
              <span className="text-white/20 text-[9px] font-bold tracking-wider">SWIPE &middot; DISCOVER</span>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-6 pt-2 no-scrollbar scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12">
              {[
                { name: 'Sports', color: 'var(--color-evida-blue)' },
                { name: 'Homecoming', color: 'var(--color-evida-coral)' },
                { name: 'Career Fair', color: 'var(--color-evida-lime)' },
                { name: 'Workshops', color: 'var(--color-evida-blue)' },
                { name: 'Orientation', color: 'var(--color-evida-coral)' },
                { name: 'Concerts', color: 'var(--color-evida-lime)' },
                { name: 'Student Organizations', color: 'var(--color-evida-blue)' },
                { name: 'Arts & Culture', color: 'var(--color-evida-coral)' },
                { name: 'Guest Lectures', color: 'var(--color-evida-lime)' },
                { name: 'Tech Hackathons', color: 'var(--color-evida-blue)' },
                { name: 'Alumni Networking', color: 'var(--color-evida-coral)' },
                { name: 'Wellness & Fitness', color: 'var(--color-evida-lime)' },
              ].map((cat, i) => (
                <Link 
                  key={i} 
                  href={`/student/events?category=${encodeURIComponent(cat.name)}`}
                  className="flex-shrink-0 border-2 border-white/10 hover:border-white/30 text-white px-6 py-3 rounded-full font-black uppercase text-[11px] tracking-wider transition-all duration-300 hover:scale-102 flex items-center gap-3 group/cat cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full transition-transform duration-300 group-hover/cat:scale-150" style={{ backgroundColor: cat.color }} />
                  <span className="group-hover/cat:text-[var(--color-evida-lime)] transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-12 text-white/70 mb-12">
          
          {/* Left Column */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Contact</h4>
            <div className="space-y-1 text-sm font-medium">
              <p className="text-white font-black text-lg mb-2 tracking-wide" style={{ fontFamily: 'var(--font-lufga)' }}>EVIDA</p>
              <p>Campus Event & Engagement Platform</p>
              <p className="pt-2 hover:text-[var(--color-evida-coral)] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Middle Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Discover</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="#why-evida" className="hover:text-white transition-colors">Why Evida</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#featured-events" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="#for-students" className="hover:text-white transition-colors">For Students</Link></li>
              <li><Link href="#for-schools" className="hover:text-white transition-colors">For Schools</Link></li>
            </ul>
          </div>

          {/* Right Column */}
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

          {/* Social */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Stay Social</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[var(--color-evida-lime)] font-black text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-lufga)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MousePointer2, UserCheck, LineChart, ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import FeaturedEventCard from '@/components/student/FeaturedEventCard';
import AboutEvidaSection from '@/components/student/AboutEvidaSection';
import { useEvents } from '@/lib/context/EventContext';
import EvidaLogo from '@/components/ui/EvidaLogo';
import AppShowcase from '@/components/student/AppShowcase';

export default function LandingPage() {
  const router = useRouter();
  const { events } = useEvents();

  // Scroll-based parallax and zoom transforms for the hero background image
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 160]);
  const opacityBg = useTransform(scrollY, [0, 600], [0.45, 0.05]);
  const scaleBg = useTransform(scrollY, [0, 600], [1, 1.06]);

  const approvedEvents = events.filter(e => e.status === 'approved');
  const [selectedCategory, setSelectedCategory] = React.useState('Sports');

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

  const headlineLines = ["Discover Evida,", "the digital home", "of campus life"];

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-[#203627] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Full-Screen Immersive Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#203627] pt-28 pb-24">
        
        {/* Animated Background Image */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
          className="absolute inset-0 w-full h-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center pointer-events-none"
        />
        
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#203627]/75 via-[#203627]/50 to-[#203627] z-0" />

        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#E8FF40]/8 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          
          {/* Accent Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/95 backdrop-blur-md">
              THE DIGITAL HOME OF CAMPUS LIFE
            </span>
          </motion.div>

          {/* Headline Word Reveal */}
          <h1 
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 select-none uppercase max-w-5xl mx-auto"
          >
            {headlineLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block whitespace-nowrap ${idx === 2 ? "text-[#E8FF40]" : "text-white"}`}
                >
                  {line}
                </motion.span>
              </React.Fragment>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-white/70 max-w-xl mx-auto mb-8 font-light leading-relaxed"
          >
            Evida is a premium engagement experience. Students discover events, track RSVPs, and build communities, while universities manage activities with real-time analytics.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/login" 
              className="bg-[#E8FF40] text-[#203627] font-bold uppercase tracking-widest text-[11px] px-8 py-4 hover:bg-[#d8ee2e] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 rounded-full shadow-[0_4px_18px_rgba(32,54,39,0.15)]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>



        {/* Scrolling Category Marquee (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#203627]/90 backdrop-blur-md py-4.5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-white font-bold text-sm tracking-[0.2em] uppercase opacity-80 items-center">
              <span>ORIENTATION</span>
              <EvidaLogo size={18} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={18} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={18} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={18} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={18} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={18} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={18} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={18} showText={false} />
              
              {/* Duplicate for infinite effect */}
              <span>ORIENTATION</span>
              <EvidaLogo size={18} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={18} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={18} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={18} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={18} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={18} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={18} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={18} showText={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 1. About Evida Section */}
      <AboutEvidaSection />

      {/* 2. Interactive App Showcase Section */}
      <AppShowcase />

      {/* 3. Explore by Category Section */}
      <section id="explore-categories" className="relative w-full bg-[#EFEFEF] py-24 border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 z-20 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[#E8FF40] font-bold uppercase text-xs tracking-[0.2em]">
              Discovery
            </span>
            <h2 className="text-[#203627] font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              Explore<br />by Category
            </h2>
            <p className="text-[#4F5666] text-sm md:text-base max-w-2xl mx-auto font-light">
              Click on a category to filter campus events instantly. Discover what interests you the most.
            </p>
          </div>

          {/* Category Selector (Pills with sliding background animation) */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {Object.keys(mockEventsByCategory).map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-[#203627]' : 'text-[#4F5666] hover:text-[#203627]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[#E8FF40] rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {categoryEvents.map((event) => (
              <div 
                key={event.id}
                className="transform transition-all duration-500"
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

      {/* 4. Closing Statement Section (Deep Dark Immersive Theme) */}
      <section className="relative w-full bg-[#203627] pt-32 pb-48 overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
        
        {/* Soft Ambient Radial Glows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[320px] bg-gradient-to-t from-[#E8FF40]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center z-20 space-y-8">
          <h2 className="text-white font-extrabold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            College Ends.<br />
            <span className="text-[#E8FF40]">
              Memories Don’t.
            </span>
          </h2>
          
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Every event you attend, every connection you make, and every memory you create begins with a single place. Welcome to your campus life, reimagined.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#203627] hover:bg-[#E8FF40] hover:text-[#203627] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[#E8FF40]/10 cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Giant Immersive EVIDA Wordmark in Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none z-10 leading-none">
          <div className="w-full text-center text-[18vw] font-extrabold tracking-tighter uppercase opacity-[0.03] text-[#E8FF40] translate-y-[20%]">
            EVIDA
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full bg-[#203627] pt-24 pb-12 border-t border-white/5">
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
              <p className="pt-2 hover:text-[#E8FF40] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Discover Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Discover</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="#about-evida" className="hover:text-white transition-colors">About Evida</Link></li>
              <li><Link href="#explore-categories" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
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
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#E8FF40] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-[#E8FF40] text-[#203627] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#203627] transition-all duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[#E8FF40] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

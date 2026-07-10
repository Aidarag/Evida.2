'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Shield, 
  Users, 
  Trophy,
  ChevronDown,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  MapPin,
  Clock,
  Check,
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  GraduationCap,
  Mail,
  Plus,
  Compass
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';

interface LandingPageProps {
  featuredEvents: Event[];
  onExplore: () => void;
  onCreateEvent: () => void;
  onLogin: () => void;
}

export default function LandingPage({
  featuredEvents,
  onExplore,
  onCreateEvent,
  onLogin,
}: LandingPageProps) {
  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Smartphone Showcase States
  const [phoneActive, setPhoneActive] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'explore' | 'details'>('feed');
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  const feedScrollRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);

  const handlePhoneClick = () => {
    if (!phoneActive) {
      setPhoneActive(true);
      setCurrentView('feed');
      setScrollProgress(0);
      setRsvpConfirmed(false);
      setTimeout(() => {
        if (feedScrollRef.current) feedScrollRef.current.scrollTop = 0;
        if (detailsScrollRef.current) detailsScrollRef.current.scrollTop = 0;
      }, 50);
    }
  };

  const handleCardTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('details');
    setScrollProgress(0);
    setTimeout(() => {
      if (detailsScrollRef.current) detailsScrollRef.current.scrollTop = 0;
    }, 50);
  };

  const handleBackTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('feed');
    setScrollProgress(0);
    setTimeout(() => {
      if (feedScrollRef.current) feedScrollRef.current.scrollTop = 0;
    }, 50);
  };

  const handleRsvpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rsvpConfirmed) return;
    setRsvpConfirmed(true);
    setTimeout(() => {
      setPhoneActive(false);
      setRsvpConfirmed(false);
      setCurrentView('feed');
      setScrollProgress(0);
    }, 1500);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
  };

  const activeStep = currentView === 'feed'
    ? (scrollProgress < 30 ? 0 : (scrollProgress < 75 ? 1 : 2))
    : currentView === 'explore'
      ? 1
      : (scrollProgress < 50 ? 3 : 4);

  // References for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scale and Lift animations for the smartphone shell
  const phoneScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.9, 1.05, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.4, 0.8], [60, -10, 0]);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Evida?",
      answer: "Evida is a premium, unified digital home for student life. It aggregates campus events, student organizations, promotions, and opportunities into a high-end, responsive feed."
    },
    {
      question: "How do I get started?",
      answer: "Click any 'Get Started' button to go to our access selection screen, select whether you are a Student or a School Administrator, and immediately explore the platforms and dashboards."
    },
    {
      question: "Can universities use Evida for administration?",
      answer: "Yes. Evida includes a school dashboard featuring advanced real-time attendance analytics, organization roster management, and smart approval workflows for student events."
    },
    {
      question: "What makes Evida different from other portals?",
      answer: "Unlike complex and fragmented administrative systems, Evida combines beautiful streetwear aesthetics, micro-interactions, fast loading, and modular design. We prioritize UX design and engagement above all."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#191919] flex flex-col justify-between overflow-x-hidden font-sans scroll-smooth">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EvidaLogo size={36} lightMode={true} text="EVIDA" />
          </div>

          {/* Centered navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#why-evida" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              Why Evida
            </a>
            <a href="#about" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              About
            </a>
            <a href="#how-it-works" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              How It Works
            </a>
            <a href="#features" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              Features
            </a>
            <a href="#faq" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              FAQ
            </a>
          </nav>

          {/* Right side CTAs (Sign In / Sign Up) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLogin}
              className="rounded-full bg-[#BDFB04] text-[#191919] text-[9px] sm:text-[10px] font-black px-3.5 sm:px-5 py-2 sm:py-2.5 hover:bg-[#d1fa3c] transition-all hover:scale-[1.02] border border-black/5 cursor-pointer shadow-sm uppercase tracking-wider flex items-center justify-center"
            >
              Sign In
            </button>
            <Link
              href="/signup"
              className="rounded-full bg-[#BDFB04] text-[#191919] text-[9px] sm:text-[10px] font-black px-3.5 sm:px-5 py-2 sm:py-2.5 hover:bg-[#d1fa3c] transition-all hover:scale-[1.02] border border-black/5 cursor-pointer shadow-sm uppercase tracking-wider flex items-center justify-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Wenspire Visual Style */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden border border-black/5 shadow-2xl min-h-[520px] md:min-h-[600px] flex flex-col justify-between p-8 md:p-16 text-white"
        >
          {/* Background image & overlays */}
          <div className="absolute inset-0 bg-[url('/pexels-amine-1285347-9371719.jpg')] bg-cover bg-center z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

          {/* Top Row: Floating Badge */}
          <div className="relative z-20 flex items-center justify-start">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#BDFB04] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] animate-pulse" />
              Now in Private Beta
            </span>
          </div>

          {/* Middle Row: Content */}
          <div className="relative z-20 space-y-6 max-w-2xl text-left my-auto pt-10 pb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.95] text-white">
              Everything Happening <br className="hidden sm:inline" /> on Campus. <br />
              <span className="text-[#BDFB04]">All in One Place.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-medium">
              Evida is the platform that brings together campus events, student organizations, promotions, and opportunities into one modern experience for students and schools. Discover what's happening, connect with groups, and never miss out on campus life.
            </p>
            <div>
              <button
                onClick={onLogin}
                className="flex items-center gap-2 rounded-full bg-[#BDFB04] hover:bg-[#d1fa3c] px-7 py-4 text-xs font-black text-[#191919] shadow-lg shadow-[#BDFB04]/20 hover:scale-[1.03] transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 text-[#191919]" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Additional info / badge */}
          <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Campus Events • Organizations • Promotions
              </span>
            </div>

            {/* Platform Access Badge */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 w-fit">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border border-neutral-900 bg-[#BDFB04] text-neutral-900 flex items-center justify-center text-[8px] font-black">JD</div>
                <div className="h-6 w-6 rounded-full border border-neutral-900 bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">AM</div>
                <div className="h-6 w-6 rounded-full border border-neutral-900 bg-purple-500 text-white flex items-center justify-center text-[8px] font-black">SK</div>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                Explore Dashboards ●
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Evida Smartphone Experience */}
      <section ref={sectionRef} className="py-24 bg-[#DFDED7]/25 border-y border-black/[0.06] overflow-hidden flex flex-col items-center">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4 mb-12">
          <span className="rounded-full bg-[#191919] text-[#BDFB04] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
            Take a tour
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            Experience Evida
          </h2>
          <p className="text-xs text-[#4B5563] font-semibold max-w-md mx-auto leading-relaxed">
            Click the phone below to unlock scroll controls and browse a live tour of the app interface.
          </p>
        </div>

        {/* Smartphone Container */}
        <div className="relative w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center gap-12 px-6">
          
          {/* Left Side: Demo Progress Indicators (Visible in interactive mode) */}
          <div className="hidden md:flex flex-col gap-4 text-left min-w-[160px]">
            <div className="space-y-1.5">
              <span className="block text-[8px] font-black uppercase tracking-wider text-[#4B5563]">Tour Progress</span>
              <div className="h-1 bg-black/10 rounded-full w-28 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#191919]"
                  animate={{ width: `${(activeStep + 1) * 20}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 0 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>1</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 0 ? 'text-[#191919]' : 'text-gray-400'}`}>Dashboard</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 1 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>2</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 1 ? 'text-[#191919]' : 'text-gray-400'}`}>Discover</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 2 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>3</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 2 ? 'text-[#191919]' : 'text-gray-400'}`}>Experiences</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 3 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>4</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 3 ? 'text-[#191919]' : 'text-gray-400'}`}>Details</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 4 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>5</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 4 ? 'text-[#191919]' : 'text-gray-400'}`}>RSVP</span>
              </div>
            </div>
          </div>

          {/* Center: Smartphone Shell */}
          <motion.div
            style={{ scale: phoneScale, y: phoneY }}
            onClick={handlePhoneClick}
            className={`relative max-w-[310px] w-full aspect-[9/19.5] rounded-[44px] border-[10px] border-neutral-950 shadow-2xl bg-neutral-900 z-20 cursor-pointer overflow-hidden select-none ${
              phoneActive ? 'ring-4 ring-[#BDFB04]/30' : 'hover:scale-[1.02] transition-transform duration-300'
            }`}
          >
            {/* Gloss reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 z-40 pointer-events-none" />

            {/* Dynamic Island / Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-center shadow-inner">
              <div className="h-1.5 w-1.5 bg-neutral-900 rounded-full ml-auto mr-3 border border-neutral-800" />
            </div>

            {/* Internal Phone Status Bar */}
            <div className="absolute top-1.5 inset-x-6 z-50 flex items-center justify-between text-[8px] text-white font-bold select-none px-2 pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="h-2 w-2" />
                <Wifi className="h-2 w-2" />
                <Battery className="h-2 w-3" />
              </div>
            </div>

            {/* Internal Phone Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />

            {/* Locked screen guide overlay */}
            {!phoneActive && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                <div className="h-12 w-12 rounded-full bg-white border border-black/[0.06] flex items-center justify-center shadow-lg animate-bounce">
                  <EvidaLogo size={22} showText={false} lightMode={true} />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#BDFB04]">Take a tour</span>
                  <span className="block text-[11px] font-bold text-gray-200">Tap to unlock screen</span>
                </div>
              </div>
            )}

            {/* User Journey Screens (Native Scrollable Containers like Posh) */}
            <div className="w-full h-full relative z-10 overflow-hidden bg-[#121212] touch-none">
              
              {/* Bottom Tab Navigation */}
              <div className="absolute bottom-0 inset-x-0 bg-[#121212]/95 backdrop-blur-md border-t border-white/5 py-1.5 px-6 flex justify-between items-center z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentView('feed'); }}
                  className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${currentView === 'feed' ? 'text-[#BDFB04]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Compass className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Feed</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentView('explore'); }}
                  className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${currentView === 'explore' ? 'text-[#BDFB04]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Search className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Explore</span>
                </button>
                <div className="h-8 w-8 rounded-full bg-[#BDFB04] text-[#191919] flex items-center justify-center -translate-y-2 border-4 border-[#121212] shadow-lg">
                  <Plus className="h-4 w-4 stroke-[3]" />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="flex flex-col items-center gap-0.5 text-gray-600 cursor-not-allowed"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Calendar</span>
                </button>
              </div>

              {currentView === 'feed' && (
                <div 
                  ref={feedScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none relative scroll-smooth pt-8 pb-14 text-white"
                >
                  {/* Mini Feed Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#121212] z-20">
                    <span className="text-[9px] font-black tracking-widest text-[#BDFB04]">EVIDA</span>
                    <div className="flex gap-2">
                      <span className="text-[7px] font-black uppercase text-[#BDFB04] border-b border-[#BDFB04] pb-0.5">For You</span>
                      <span className="text-[7px] font-bold uppercase text-gray-500">Campus</span>
                    </div>
                  </div>

                  {/* Staggered Feed Cards */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.12 }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-3 space-y-4"
                  >
                    {/* Card 1: Rave */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      className="relative h-44 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-end p-4 group"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('/pexels-amine-1285347-9371719.jpg')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      {/* Sidebar buttons mockup */}
                      <div className="absolute right-3 bottom-14 flex flex-col gap-2 z-20 items-center">
                        <div className="h-6 w-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-rose-500 shadow"><Heart className="h-3 w-3 fill-rose-500" /></div>
                        <div className="h-6 w-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white shadow"><MessageCircle className="h-3 w-3" /></div>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="bg-[#BDFB04] text-[#191919] font-black px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Verified Org</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Welcome Back Neon Rave</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Campus Board • Oct 5 • Student Plaza</p>
                      </div>
                    </motion.div>

                    {/* Card 2: Career Fair (Action Card) */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      onClick={handleCardTap}
                      className="relative h-44 rounded-2xl overflow-hidden border-2 border-[#BDFB04] flex flex-col justify-end p-4 group cursor-pointer shadow-[0_0_12px_rgba(189,251,4,0.15)]"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 animate-pulse-slow" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      {/* Pulse circle indicators */}
                      <div className="absolute top-3 right-3 bg-[#BDFB04] text-[#191919] text-[6px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow animate-bounce z-20">
                        Tap to Explore
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="bg-[#BDFB04] text-[#191919] font-black px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Featured</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Career Fair Networking Night</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Business Club • Oct 12 • Student Center</p>
                      </div>
                    </motion.div>

                    {/* Card 3: Autumn Fest */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      className="relative h-44 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-end p-4 group"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('/pexels-yaroslav-shuraev-8513385.jpg')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      <div className="relative z-10 space-y-1">
                        <span className="bg-neutral-800 text-gray-400 font-bold px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Greek Life</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Autumn Concert & Social</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Greek Council • Oct 18 • Fraternity Quad</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {currentView === 'explore' && (
                <div 
                  ref={feedScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none pt-8 pb-14 text-white bg-[#121212]"
                >
                  {/* Search Bar Block */}
                  <div className="px-3 pt-2 bg-[#121212] space-y-3 pb-3 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                      <input 
                        type="text" 
                        disabled 
                        placeholder="Search events, clubs..." 
                        className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1 pl-8 text-[8px] text-white"
                      />
                    </div>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
                      <span className="shrink-0 px-2.5 py-0.5 bg-[#BDFB04] text-[#191919] text-[6px] font-black rounded-full uppercase">All</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[6px] font-bold rounded-full uppercase">Parties</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[6px] font-bold rounded-full uppercase">Sports</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[6px] font-bold rounded-full uppercase">Academic</span>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="p-3">
                    <span className="block text-[7px] font-black text-gray-500 uppercase tracking-widest mb-2">Popular Events</span>
                    
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08 }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 gap-2"
                    >
                      {/* Grid Item 1: Career Center (Target) */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
                        }}
                        onClick={handleCardTap}
                        className="bg-neutral-900/60 border border-[#BDFB04]/30 rounded-xl p-1.5 space-y-1.5 cursor-pointer hover:border-[#BDFB04] transition-all"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Career Networking</h5>
                          <p className="text-[5.5px] text-gray-500 truncate leading-none">Business Club</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 2 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-yaroslav-shuraev-8513385.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Autumn Social</h5>
                          <p className="text-[5.5px] text-gray-500 truncate leading-none">Greek Council</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 3 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-amine-1285347-9371719.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Welcome Rave</h5>
                          <p className="text-[5.5px] text-gray-500 truncate leading-none">Campus Board</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 4 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Greek Tailgate</h5>
                          <p className="text-[5.5px] text-gray-500 truncate leading-none">Greek Council</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}

              {currentView === 'details' && (
                <div 
                  ref={detailsScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none pt-8 pb-14 text-white bg-[#121212]"
                >
                  {/* Hero Cover Header */}
                  <div className="relative h-36 w-full bg-cover bg-center" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
                    <button 
                      onClick={handleBackTap}
                      className="absolute top-2.5 left-2.5 h-6 w-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Staggered Content Details */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-3.5 space-y-4 text-left"
                  >
                    {/* Header Group */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.97 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } }
                      }}
                      className="space-y-1.5"
                    >
                      <span className="bg-[#BDFB04] text-[#191919] font-black px-1.5 py-0.5 rounded text-[5px] uppercase tracking-wider w-fit block">Verified Host</span>
                      <h4 className="text-[12px] font-black uppercase tracking-tight leading-tight text-white">Career Fair Networking Night</h4>
                      <p className="text-[5.5px] text-gray-400">HOSTED BY BUSINESS CLUB & CAREER CENTER</p>
                    </motion.div>

                    {/* Metadata Lists */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="space-y-2 border-y border-white/5 py-2.5 text-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#BDFB04]" />
                        <span className="text-[6.5px] font-bold">WEDNESDAY, OCT 12 • 2:00 PM - 5:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#BDFB04]" />
                        <span className="text-[6.5px] font-bold">STUDENT CENTER MAIN HALL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5 text-[#BDFB04]" />
                        <span className="text-[6.5px] font-bold">FREE TICKET REQUIRED</span>
                      </div>
                    </motion.div>

                    {/* Description Paragraph */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="space-y-1"
                    >
                      <span className="block text-[7px] font-black text-gray-500 uppercase tracking-widest">About Event</span>
                      <p className="text-[7.5px] text-gray-300 leading-relaxed font-light">
                        Connect with over 50 recruiters from leading tech, finance, and creative industries. Prepare your resume and dress professionally. First 100 check-ins receive a free portfolio binder.
                      </p>
                    </motion.div>

                    {/* RSVP Action Hotspot wrapper */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        show: { opacity: 1, scale: 1, transition: { delay: 0.2 } }
                      }}
                      className="pt-2"
                    >
                      <button
                        onClick={handleRsvpClick}
                        className={`w-full py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                          rsvpConfirmed 
                            ? 'bg-[#BDFB04] text-[#191919] animate-bounce shadow-[0_0_12px_rgba(189,251,4,0.35)]' 
                            : 'bg-white text-[#191919] hover:bg-[#BDFB04] hover:text-[#191919] border border-black/5 hover:shadow-[0_0_12px_rgba(189,251,4,0.25)]'
                        }`}
                      >
                        {rsvpConfirmed ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#191919] stroke-[3]" />
                            <span>Going!</span>
                          </>
                        ) : (
                          <span>RSVP NOW</span>
                        )}
                      </button>
                    </motion.div>

                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>

          {/* Right Side: Tooltip & Swiping instructions */}
          <div className="relative flex flex-col gap-3 text-center md:text-left max-w-[200px]">
            <AnimatePresence mode="wait">
              {!phoneActive ? (
                <motion.div
                  key="inactive-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-black text-[#BDFB04] border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 pointer-events-none"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Click the phone to explore Evida
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="active-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#191919] text-white border border-white/10 px-4 py-3 rounded-2xl shadow-xl space-y-2 pointer-events-none"
                >
                  <span className="block text-[8px] font-black uppercase tracking-widest text-[#BDFB04] animate-pulse">
                    Take a tour
                  </span>
                  <p className="text-[9px] text-gray-300 leading-snug">
                    Scroll naturally inside the phone screens or tap the interactive hotspots to complete the tour.
                  </p>
                  <span className="block text-[8px] text-gray-500 font-bold uppercase pt-1">
                    {activeStep === 4 ? 'Confirm RSVP to exit →' : 'Scroll down to continue'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick exit fallback button */}
            {phoneActive && (
              <button 
                onClick={() => setPhoneActive(false)}
                className="mt-3 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider rounded-xl border border-white/10 text-white transition-all backdrop-blur-md cursor-pointer text-center"
              >
                Exit Preview
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Problem Statistics Section */}
      <section id="why-evida" className="bg-white border-b border-black/[0.06] py-20 md:py-28 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Why Evida</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#191919] leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
              ONE CAMPUS. ONE PLATFORM. EVERY OPPORTUNITY.
            </h2>
            <p className="text-xs text-[#4B5563] font-medium leading-relaxed max-w-lg mx-auto">
              Campus life is scattered across emails, group chats, flyers, and social media. Evida brings events, organizations, promotions, and your campus calendar together in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 text-left max-w-5xl mx-auto border-y border-black/[0.06]">
            
            {/* Card 1 */}
            <div className="p-5 sm:p-8 border-r border-b lg:border-b-0 border-black/[0.06] flex flex-col space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                89%
              </span>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Miss important opportunities
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Students have missed important campus events, deadlines, and opportunities because information is scattered across multiple communication channels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-black/[0.06] flex flex-col space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                36%
              </span>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Never participate
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                More than one-third of students don’t participate in a single extracurricular or co-curricular activity during the academic year.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 sm:p-8 border-r border-black/[0.06] flex flex-col space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                31%
              </span>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Don’t know what’s happening
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Many students say they miss campus activities simply because they never hear about them or discover them too late.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 sm:p-8 flex flex-col space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                26%
              </span>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Check campus email daily
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Only about one in four students regularly check their university email, making email alone an unreliable way to keep students informed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#DFDED7]/35 border-y border-black/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Built for Everyone</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#191919]" style={{ fontFamily: 'var(--font-display)' }}>
              One platform. Two ways to connect.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Students Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">For Students</span>
                <h3 className="text-lg font-extrabold text-[#191919] uppercase tracking-tight leading-tight">
                  Discover events, join groups, and promote your initiatives.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#374151] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Discover campus events and stay in the loop.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Join organizations and meet new people.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    RSVP to campus activities in one tap.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Create your own independent student events.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Promote local businesses, tutoring services, photography, food sales, and other student initiatives.
                  </li>
                </ul>
              </div>
            </div>

            {/* School & Org Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-gu-ko-2150570603-31827067.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">For Schools & Organizations</span>
                <h3 className="text-lg font-extrabold text-[#191919] uppercase tracking-tight leading-tight">
                  Publish events, coordinate groups, and monitor engagement.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#374151] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Publish official events and share group announcements.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Manage organization members and assign specific moderation roles.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Approve group membership requests seamlessly.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                    Increase student engagement across all departments.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#DFDED7]/35 border-t border-black/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#191919]" style={{ fontFamily: 'var(--font-display)' }}>
              Four steps. One outcome: being connected.
            </h2>
            <p className="text-xs text-[#4B5563]">We simplify communication and activities for everyone on campus.</p>
          </div>

          <div className="grid grid-cols-2 border border-black/[0.06] rounded-[32px] overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-b border-black/[0.06]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 block">Step 01</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Mail className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#191919] leading-snug">
                Sign up with your school email
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4B5563] leading-relaxed font-medium">
                Students verify their identity using their official university email to ensure a secure, trusted environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-b border-black/[0.06]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 block">Step 02</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Search className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#191919] leading-snug">
                Discover campus life
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4B5563] leading-relaxed font-medium">
                Browse events, student organizations, promotions, and opportunities personalized specifically to your campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-black/[0.06]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 block">Step 03</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Users className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#191919] leading-snug">
                Connect with peers
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4B5563] leading-relaxed font-medium">
                Join organizations, RSVP to events, interact with your campus community, and discover new experiences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 block">Step 04</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Plus className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#191919] leading-snug">
                Create new content
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4B5563] leading-relaxed font-medium">
                Allow every verified student to create events, promotions, and activities. Organization members simply receive additional management permissions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="bg-[#DFDED7]/35 border-t border-black/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Core Features</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#191919]" style={{ fontFamily: 'var(--font-display)' }}>
              Everything you need for Campus life
            </h2>
            <p className="text-xs text-[#4B5563]">A modular, streetwear-inspired hub connecting your entire university community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-black/[0.06] rounded-[32px] overflow-hidden bg-white shadow-sm">
            
            {/* Card 1 */}
            <div className="p-8 space-y-4 text-left border-b md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 01</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Compass className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Personalized Discovery
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Find what matters to you.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Your feed adapts to your interests, organizations, and campus activity so you never miss opportunities that fit you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 space-y-4 text-left border-b md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 02</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Campus Events
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Discover everything happening on campus.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Browse school events, organization activities, workshops, sports, cultural events, and more in one place.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 space-y-4 text-left border-b border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 03</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Users className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Student Organizations
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Join communities that match your interests.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Explore organizations, view their events, discover members, and become part of campus life.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 space-y-4 text-left border-b md:border-b-0 md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 04</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Clock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Campus Calendar
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Keep your semester organized.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                See upcoming events in one unified calendar and easily keep track of your schedule.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 space-y-4 text-left border-b md:border-b-0 md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 05</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Plus className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Event Creation
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Create events in minutes.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Whether you’re a student, organization, or school administrator, you can create and share events with the entire campus.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 space-y-4 text-left">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Feature 06</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                  Promotions
                </h3>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Promote what you do.
                </h4>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Share tutoring services, photography, food sales, small businesses, student services, campus initiatives, and other opportunities with the campus community.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#DFDED7]/35 border-t border-black/[0.06] py-20">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Questions</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#191919] uppercase">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-xs md:text-sm font-extrabold text-[#191919] uppercase tracking-wide">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#BDFB04] text-[#191919]' : 'bg-black/5 text-[#374151]'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs text-[#4B5563] leading-relaxed font-medium border-t border-black/[0.03] text-left">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section id="waitlist" className="mx-auto max-w-7xl px-4 md:px-6 py-16 w-full relative z-10">
        <div className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden border border-black/5 shadow-2xl min-h-[400px] flex flex-col justify-center items-center p-8 md:p-16 text-white text-center">
          {/* Background image & overlays */}
          <div className="absolute inset-0 bg-[url('/pexels-gasparzaldo-13464806.jpg')] bg-cover bg-center z-0" />
          <div className="absolute inset-0 bg-black/75 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 z-10" />

          {/* Content */}
          <div className="relative z-20 space-y-6 max-w-xl">
            <span className="inline-block rounded-full bg-[#BDFB04]/10 border border-[#BDFB04]/20 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#BDFB04]">
              ● Limited Access Spots
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">
              Ready to Experience <br />
              <span className="text-[#BDFB04]">Campus Differently?</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
              Join the Evida waitlist and be among the first students to discover a simpler way to explore events, organizations, promotions, and opportunities across campus.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={onLogin}
                className="flex items-center gap-2 rounded-full bg-[#BDFB04] hover:bg-[#d1fa3c] px-8 py-4 text-xs font-black text-[#191919] shadow-lg shadow-[#BDFB04]/20 hover:scale-[1.03] transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="h-4 w-4 text-[#191919]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#DFDED7]/15 border-t border-black/[0.06] py-16 md:py-24 text-[#191919] relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          
          {/* Top row: Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-left">
            
            {/* Left Description Column */}
            <div className="md:col-span-5 space-y-4">
              <EvidaLogo size={36} lightMode={true} text="EVIDA" />
              <p className="text-xs text-[#4B5563] leading-relaxed max-w-xs font-medium">
                Bringing students, organizations, and schools together through one connected campus experience.
              </p>
              
              {/* Connect icons */}
              <div className="flex items-center gap-3.5 pt-2">
                <a href="mailto:info@myevida.app" className="text-gray-400 hover:text-[#191919] transition-colors" title="Email Us">
                  <Mail className="h-4.5 w-4.5" />
                </a>
                <a href="https://instagram.com/myevida" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#191919] transition-colors" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Product</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4B5563] font-semibold">
                <li>
                  <button onClick={onLogin} className="hover:text-[#191919] transition-colors cursor-pointer text-left">Explore</button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-[#191919] transition-colors cursor-pointer text-left">Events</button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-[#191919] transition-colors cursor-pointer text-left">Organizations</button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-[#191919] transition-colors cursor-pointer text-left">Calendar</button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-[#191919] transition-colors cursor-pointer text-left">Create</button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Company</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4B5563] font-semibold">
                <li>
                  <a href="#about" className="hover:text-[#191919] transition-colors">About</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#191919] transition-colors">Features</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#191919] transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="mailto:info@myevida.app" className="hover:text-[#191919] transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-3 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Legal</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4B5563] font-semibold">
                <li>
                  <a href="#" className="hover:text-[#191919] transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#191919] transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-black/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium text-center md:text-left">
            <span>© 2026 Evida. Built for campus life.</span>
            <span>
              Questions? Contact us at{' '}
              <a href="mailto:info@myevida.app" className="text-[#4B5563] hover:text-[#191919] font-bold transition-colors">
                info@myevida.app
              </a>{' '}
              or follow us on{' '}
              <a href="https://instagram.com/myevida" target="_blank" rel="noopener noreferrer" className="text-[#4B5563] hover:text-[#191919] font-bold transition-colors">
                Instagram
              </a>
              .
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}

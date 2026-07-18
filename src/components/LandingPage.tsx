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
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  GraduationCap,
  Mail,
  Plus,
  Compass,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';
import { useEvents } from '@/lib/context/EventContext';

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
  const { events } = useEvents();
  const firstEvent = events.filter(e => e.status === 'approved')[0];
  const firstEventId = firstEvent?.id || 'event-1';

  // Navigation hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const handleSeeHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // ── Guided Tour State ──────────────────────────────────────────────
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tourStep, setTourStep] = useState(0);        // 0..3
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentPath, setCurrentPath] = useState('/student/dashboard');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const TOUR_STEPS = [
    {
      label: 'Home Feed',
      emoji: '🏠',
      description: 'Your campus life starts here. Browse upcoming events from Livingstone College and your student community.',
      hint: 'Scroll inside the phone to explore the feed.',
    },
    {
      label: 'Select Event',
      emoji: '🔍',
      description: 'Discover events tailored to your interests. Tap any card to open full event details.',
      hint: 'Tap an event card to continue.',
    },
    {
      label: 'Event Details',
      emoji: '📋',
      description: 'Everything about the event — date, location, organizer, and who\'s attending.',
      hint: 'Scroll down to see the RSVP option.',
    },
    {
      label: "You're Going!",
      emoji: '🎉',
      description: 'One tap to RSVP. Your spot is confirmed instantly and saved to your profile.',
      hint: 'Tour complete — you\'re in!',
    },
  ];

  // Listen for route messages from the iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const { type, pathname } = event.data;
      if (type === 'EVIDA_PREVIEW_ROUTE') {
        setCurrentPath(pathname);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Send EVIDA_TOUR_GOTO command to iframe when step changes
  const sendTourStep = (step: number) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'EVIDA_TOUR_GOTO', step }, '*');
    }
  };

  const goNext = () => {
    const next = Math.min(tourStep + 1, TOUR_STEPS.length - 1);
    setCompletedSteps(prev => new Set(prev).add(tourStep));
    setTourStep(next);
    sendTourStep(next);
  };

  const goBack = () => {
    const prev = Math.max(tourStep - 1, 0);
    setTourStep(prev);
    sendTourStep(prev);
  };

  const handlePhoneClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      sendTourStep(0);
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Evida?",
      answer: "Evida is a premium, unified digital home for student life. It aggregates campus events, student organizations, promotions, and opportunities into a high-end, responsive feed."
    },
    {
      question: "How do I join the waitlist?",
      answer: "Click any 'Join Waitlist' button to reserve your spot. We are currently in private beta and will notify you as soon as access opens for your campus."
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
    <div className="min-h-screen bg-[#EAE4CF] text-[#2A2621] flex flex-col justify-between overflow-x-hidden font-sans scroll-smooth">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#D8D2BC] bg-[#EAE4CF]/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 relative">
          <div className="flex items-center gap-2 shrink-0">
            <EvidaLogo size={32} lightMode={true} text="EVIDA" />
          </div>

          {/* Centered navigation links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#why-evida" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              Why Evida
            </a>
            <a href="#about" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              About
            </a>
            <a href="#how-it-works" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              How It Works
            </a>
            <a href="#features" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              Core Features
            </a>
            <a href="#faq" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              FAQ
            </a>
          </nav>

          {/* Right side circular hamburger menu button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#D8D2BC] flex items-center justify-center bg-[#EAE4CF] hover:bg-white shadow-sm transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-4.5 w-4.5 text-[#2A2621] transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-4.5 w-4.5 text-[#2A2621] transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Responsive Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Backdrop (closes menu when clicked) */}
                <div 
                  className="fixed inset-0 z-30 bg-transparent"
                  onClick={() => setMenuOpen(false)}
                />
                
                {/* Responsive Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-4 sm:right-6 md:right-8 top-16 z-40 w-72 rounded-[24px] border border-[#D8D2BC] bg-white/95 backdrop-blur-md p-6 shadow-xl flex flex-col gap-4 text-left"
                >
                  {/* Links */}
                  <div className="flex flex-col gap-3.5 border-b border-[#D8D2BC]/40 pb-4">
                    <a
                      href="#why-evida"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      Why Evida
                    </a>
                    <a
                      href="#about"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      About
                    </a>
                    <a
                      href="#how-it-works"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      How It Works
                    </a>
                    <a
                      href="#features"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      Core Features
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      FAQ
                    </a>
                  </div>

                  {/* Actions (Join Waitlist Button) */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onLogin();
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-105 hover:-translate-y-0.5 text-white text-xs font-black py-3.5 transition-all duration-300 border border-white/10 cursor-pointer shadow-md shadow-[#FB1C07]/20 uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <span>Join Waitlist</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section - Wenspire Visual Style */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-20 sm:pt-24 pb-12 w-full relative">
        {/* Soft floating blurred gradient blobs for premium lighting */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-br from-[#FB1C07] to-[#FC7C0B] opacity-[0.12] blur-[100px] md:blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-br from-[#FD4002] to-[#FC7C0B] opacity-[0.08] blur-[90px] md:blur-[130px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[24px] md:rounded-[48px] overflow-hidden border border-[#D8D2BC]/40 shadow-2xl min-h-[480px] md:min-h-[600px] flex flex-col justify-center p-6 sm:p-8 md:p-16 text-white z-10"
        >
          {/* Background image & overlays */}
          <div className="absolute inset-0 bg-cover bg-center z-0 filter blur-[12px] scale-[1.05]" style={{ backgroundImage: "url('/evida-hero-bg-orange.png')" }} />
          <div className="absolute inset-0 bg-[#2A2621]/25 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A2621]/90 via-[#2A2621]/15 to-[#2A2621]/45 z-10" />

          {/* Top Row: Floating Badge */}
          <div className="absolute top-6 sm:top-8 left-6 sm:left-8 md:top-16 md:left-16 z-20 flex items-center justify-start">
            <span className="flex items-center gap-2 rounded-full bg-black/35 border border-white/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#FD5C05] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FB1C07] animate-pulse" />
              Now in private beta
            </span>
          </div>

          {/* Middle Row: Content */}
          <div className="relative z-20 space-y-5 max-w-2xl text-left pt-12 pb-4 sm:pt-8 sm:pb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] sm:leading-[0.95] text-white">
              Everything Happening <br />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent inline-block">on Campus.</span>
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-300 max-w-lg leading-relaxed font-medium">
              Evida brings campus events, student organizations, promotions, and opportunities into one place. Discover what’s happening, connect with your community, and never miss campus life.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
              <button
                onClick={onLogin}
                className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(251,28,7,0.25)] hover:shadow-[0_6px_20px_rgba(251,28,7,0.35)] px-6 py-4 text-xs font-black text-white transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={handleSeeHowItWorksClick}
                className="w-full rounded-full border border-[#FD5C05] bg-[#EAE4CF] hover:bg-[#FD5C05] hover:text-white px-6 py-4 text-xs font-black text-[#FD5C05] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
              >
                See How It Works
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Interactive Evida Product Demo ─────────────────────────────── */}
      <section id="experience" className="relative bg-[#1A1714] border-y border-white/[0.06] py-16 md:py-24 overflow-hidden">

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FD5C05]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="rounded-full bg-[#FD5C05]/15 text-[#FD5C05] border border-[#FD5C05]/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block mb-4">
              Interactive Demo
            </span>
            <h2 className="font-black tracking-tighter text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Experience Evida
            </h2>
            <p className="text-sm text-white/50 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              {hasInteracted
                ? 'Use Back & Next to navigate through the tour, or scroll freely inside the phone.'
                : 'Click inside the phone to begin the guided tour.'}
            </p>
          </div>

          {/* Main Layout: Progress | Phone | Context */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

            {/* ── Left: Tour Progress ───────────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-1 min-w-[200px]">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-4">Tour Progress</p>
              {TOUR_STEPS.map((step, idx) => {
                const isActive    = tourStep === idx;
                const isCompleted = completedSteps.has(idx) && !isActive;
                const isUpcoming  = !isActive && !isCompleted;
                return (
                  <div key={idx} className="flex items-start gap-3 group">
                    {/* Connector line above (except first) */}
                    <div className="flex flex-col items-center">
                      {idx > 0 && (
                        <div className={`w-px h-4 mb-1 transition-colors duration-500 ${isCompleted || isActive ? 'bg-[#FD5C05]/60' : 'bg-white/10'}`} />
                      )}
                      <div className={`
                        h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all duration-300 border
                        ${isActive    ? 'bg-[#FD5C05] border-[#FD5C05] text-[#2A2621] scale-110 shadow-[0_0_12px_rgba(253,92,5,0.5)]' : ''}
                        ${isCompleted ? 'bg-[#FD5C05]/20 border-[#FD5C05]/50 text-[#FD5C05]' : ''}
                        ${isUpcoming  ? 'bg-white/5 border-white/10 text-white/30' : ''}
                      `}>
                        {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                    </div>
                    <div className="pt-0.5 pb-4">
                      <p className={`text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : isCompleted ? 'text-[#FD5C05]/70' : 'text-white/25'}`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-[10px] text-white/40 mt-0.5 leading-relaxed max-w-[160px]"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Center: Smartphone Shell ──────────────────────────────── */}
            <div className="flex flex-col items-center gap-5">

              {/* Phone Device */}
              <div
                onClick={handlePhoneClick}
                className="relative cursor-pointer"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
              >
                {/* Apple-style Onboarding Overlay */}
                <AnimatePresence>
                  {!hasInteracted && (
                    <motion.div
                      key="onboarding"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      className="absolute inset-0 rounded-[40px] z-[60] flex flex-col items-center justify-center text-center p-6 overflow-hidden"
                      style={{ background: 'rgba(10,8,5,0.75)', backdropFilter: 'blur(8px)' }}
                    >
                      {/* Animated finger emoji */}
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl mb-4 select-none"
                      >
                        👆
                      </motion.div>
                      {/* Pulsing glow ring behind emoji */}
                      <motion.div
                        animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-[#FD5C05]/30"
                        style={{ zIndex: -1 }}
                      />
                      <p className="text-white font-black text-[11px] uppercase tracking-[0.12em] leading-relaxed max-w-[160px]">
                        Click inside the phone to begin.
                      </p>
                      <p className="text-white/40 text-[9px] font-semibold mt-2 leading-relaxed max-w-[150px]">
                        Scroll inside the phone to continue the guided tour.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phone Shell */}
                <div className="relative w-[290px] h-[620px] rounded-[44px] border-[10px] border-[#0A0805] bg-[#D8D2BC] overflow-hidden select-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">

                  {/* Gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent z-40 pointer-events-none rounded-[34px]" />

                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[88px] h-[26px] bg-[#0A0805] rounded-full z-50 pointer-events-none shadow-inner" />

                  {/* Status Bar */}
                  <div className={`absolute top-2.5 inset-x-5 z-50 flex items-center justify-between text-[8px] font-bold select-none pointer-events-none transition-colors duration-500 ${currentPath.startsWith('/events/') ? 'text-white/80' : 'text-[#2A2621]/70'}`}>
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Signal className="h-2 w-2" />
                      <Wifi className="h-2 w-2" />
                      <Battery className="h-2 w-3" />
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] rounded-full z-50 pointer-events-none transition-colors duration-500 ${currentPath.startsWith('/events/') ? 'bg-white/30' : 'bg-[#2A2621]/20'}`} />

                  {/* Live Iframe — the real Evida app */}
                  <iframe
                    ref={iframeRef}
                    src="/student/dashboard?preview=true"
                    className="absolute inset-0 w-full h-full border-none bg-[#D8D2BC]"
                    style={{ borderRadius: '34px' }}
                    title="Evida App Demo"
                  />
                </div>
              </div>

              {/* ── Back / Next Controls ───────────────────────────────── */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goBack}
                  disabled={tourStep === 0 || !hasInteracted}
                  className="h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Step dots */}
                <div className="flex items-center gap-2">
                  {TOUR_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-all duration-300 ${
                        tourStep === idx
                          ? 'w-5 h-2 bg-[#FD5C05]'
                          : completedSteps.has(idx)
                          ? 'w-2 h-2 bg-[#FD5C05]/40'
                          : 'w-2 h-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={tourStep === TOUR_STEPS.length - 1 || !hasInteracted}
                  className="h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next step"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile step label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={tourStep}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden text-[10px] font-black uppercase tracking-wider text-white/40 text-center"
                >
                  {tourStep + 1} / {TOUR_STEPS.length} — {TOUR_STEPS[tourStep].label}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* ── Right: Contextual Step Info ───────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-3 max-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tourStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 space-y-3"
                >
                  <span className="text-3xl block">{TOUR_STEPS[tourStep].emoji}</span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#FD5C05] mb-1">
                      Step {tourStep + 1} of {TOUR_STEPS.length}
                    </p>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {TOUR_STEPS[tourStep].label}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {TOUR_STEPS[tourStep].description}
                  </p>
                  <div className="pt-1 border-t border-white/[0.06]">
                    <p className="text-[9px] font-bold text-[#FD5C05]/70 uppercase tracking-wider">
                      {TOUR_STEPS[tourStep].hint}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA after last step */}
              {tourStep === TOUR_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/signup"
                    className="block w-full text-center bg-[#FD5C05] hover:bg-[#e84e00] text-[#2A2621] font-black text-[10px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(253,92,5,0.3)] hover:shadow-[0_0_30px_rgba(253,92,5,0.5)]"
                  >
                    Join Waitlist →
                  </Link>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Problem Statistics Section */}
      <section id="why-evida" className="bg-white border-b border-[#D8D2BC]/30 py-20 md:py-28 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Why Evida</span>
            <h2 className="font-black tracking-tighter text-[#2A2621] leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
              One Campus. One Platform. Every Opportunity.
            </h2>
            <p className="text-xs text-[#5A554E] font-medium leading-relaxed max-w-lg mx-auto">
              Campus life is scattered across emails, group chats, flyers, and social media. Evida brings events, organizations, promotions, and your campus calendar together in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 text-left max-w-5xl mx-auto border-y border-[#D8D2BC]/30">
            
            {/* Card 1 */}
            <div className="p-4 sm:p-8 border-r border-b lg:border-b-0 border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                89%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Miss important opportunities
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Students have missed important campus events, deadlines, and opportunities because information is scattered across multiple channels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                36%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Never participate
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                More than one-third of students don't participate in a single extracurricular or co-curricular activity during the academic year.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-8 border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                31%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Don't know what's happening
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Many students say they miss campus activities simply because they never hear about them or discover them too late.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-8 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                26%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Check campus email daily
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Only about one in four students regularly check their university email — making email alone unreliable.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#D8D2BC]/35 border-y border-[#D8D2BC]/30 py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Built for Everyone</span>
            <h2 className="font-black tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              One Platform. Two Ways to Connect.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Students Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Students</span>
                <h3 className="text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight">
                  Discover events, join groups, and promote your initiatives.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#5A554E] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Discover campus events and stay in the loop.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Join organizations and meet new people.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    RSVP to campus activities in one tap.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Create your own independent student events.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Promote local businesses, tutoring services, photography, food sales, and other student initiatives.
                  </li>
                </ul>
              </div>
            </div>

            {/* School & Org Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-gu-ko-2150570603-31827067.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Schools & Organizations</span>
                <h3 className="text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight">
                  Publish events, coordinate groups, and monitor engagement.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#5A554E] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Publish official events and share group announcements.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Manage organization members and assign specific moderation roles.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Approve group membership requests seamlessly.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Increase student engagement across all departments.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#D8D2BC]/35 border-t border-[#D8D2BC]/30 py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">How It Works</span>
            <h2 className="font-black tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              Four Steps. One Outcome: Being Connected.
            </h2>
            <p className="text-xs text-[#5A554E]">We simplify communication and activities for everyone on campus.</p>
          </div>

          <div className="grid grid-cols-2 border border-[#D8D2BC]/30 rounded-[32px] overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-b border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 01</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Mail className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Sign up with your school email
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Students verify their identity using their official university email to ensure a secure, trusted environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-b border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 02</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Search className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Discover campus life
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Browse events, student organizations, promotions, and opportunities personalized specifically to your campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 03</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Users className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Connect with peers
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Join organizations, RSVP to events, interact with your campus community, and discover new experiences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 04</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Plus className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Create new content
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
              Allow every verified student to create events, promotions, and activities. Organization members simply receive additional management permissions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Core Features</span>
            <h2 className="font-black tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need for Campus Life
            </h2>
            <p className="text-xs text-[#5A554E]">A modular, streetwear-inspired hub connecting your entire university community.</p>
          </div>

          <div className="grid grid-cols-1 min-[450px]:grid-cols-2 border border-[#D8D2BC] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm">
            
            {/* Card 1: Campus Events */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b min-[450px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 01</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Campus Events
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Discover everything happening on campus.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Discover everything happening on campus in one place. Browse school events, organization activities, workshops, sports, cultural events, and more.
                </p>
              </div>
            </div>

            {/* Card 2: Student Organizations */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 02</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Student Organizations
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Explore clubs, teams, and student communities.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Explore clubs, teams, and student communities. Join groups that match your interests, view their events, and discover members.
                </p>
              </div>
            </div>

            {/* Card 3: Event Creation */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b min-[450px]:border-b-0 min-[450px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 03</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Event Creation
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Create events in minutes.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Create and manage campus events with an easy publishing flow. Share events and activities with the entire campus, whether you're a student or school administrator.
                </p>
              </div>
            </div>

            {/* Card 4: Promotions */}
            <div className="group p-5 sm:p-8 space-y-4 text-left flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 04</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Promotions
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Promote what you do.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Advertise tutoring, photography, small businesses, food sales, student services, and campus initiatives. Share services and opportunities with the campus community.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-20">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Questions</span>
            <h2 className="font-extrabold tracking-tight text-[#2A2621]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-[24px] border border-[#D8D2BC] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-xs md:text-sm font-extrabold text-[#2A2621] uppercase tracking-wide">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-gradient-to-r from-[#FB1C07] to-[#FC7C0B] text-white' : 'bg-[#D8D2BC]/30 text-[#2A2621]'
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
                        <div className="px-6 pb-6 pt-1 text-xs text-[#5A554E] leading-relaxed font-medium border-t border-[#D8D2BC] text-left">
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
      <section id="get-started" className="mx-auto max-w-7xl px-4 md:px-6 py-16 w-full relative z-10">
        <div 
          className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden border border-[#FD5C05]/20 shadow-2xl p-8 sm:p-12 md:p-16 text-white text-center flex flex-col justify-center items-center min-h-[420px]"
          style={{ background: 'radial-gradient(circle at 15% 15%, rgba(251, 28, 7, 0.16) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(252, 124, 11, 0.12) 0%, transparent 60%), linear-gradient(135deg, #2A2621 0%, #171512 100%)' }}
        >
          {/* Content */}
          <div className="relative z-20 space-y-6 max-w-xl w-full">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#FC7C0B]">
              Ready to Join
            </span>
            <h2 className="font-extrabold tracking-tight md:tracking-tighter leading-[1.05] md:leading-[0.95] text-white">
              Ready to Experience <br />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent inline-block">Campus Differently?</span>
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 leading-relaxed font-medium max-w-md mx-auto">
              Sign up or sign in to discover a simpler way to explore events, organizations, promotions, and opportunities across campus.
            </p>
            
            <div className="pt-4 flex flex-col gap-3.5 w-full max-w-xs mx-auto">
              <button
                onClick={onLogin}
                className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-110 hover:-translate-y-0.5 py-4 text-xs md:text-sm font-black text-white shadow-lg shadow-[#FB1C07]/25 hover:shadow-[0_6px_20px_rgba(251,28,7,0.35)] transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2621] border-t border-white/5 py-16 md:py-20 text-white relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          {/* Top row: Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-left">
            
            {/* Left Description Column */}
            <div className="md:col-span-6 space-y-4">
              <EvidaLogo size={36} lightMode={false} text="EVIDA" />
              <p className="text-xs text-[#5A554E] leading-relaxed max-w-xs font-semibold">
                Bringing students, organizations, and schools together through one connected campus experience.
              </p>
              
              {/* Connect icons */}
              <div className="flex items-center gap-3.5 pt-2">
                <a href="mailto:info@myevida.app" className="text-[#5A554E] hover:text-[#FD5C05] transition-colors" title="Email Us">
                  <Mail className="h-4.5 w-4.5" />
                </a>
                <a href="https://instagram.com/myevida" target="_blank" rel="noopener noreferrer" className="text-[#5A554E] hover:text-[#FD5C05] transition-colors" title="Instagram">
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
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Product</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#experience" className="hover:text-[#FD5C05] transition-colors">Experience Evida</a>
                </li>
                <li>
                  <a href="#why-evida" className="hover:text-[#FD5C05] transition-colors">Why Evida</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#FD5C05] transition-colors">Core Features</a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#FD5C05] transition-colors">How it Works</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#get-started" className="hover:text-[#FD5C05] transition-colors">Join Waitlist</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Company</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">About</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">Vision</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Legal</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5A554E] font-medium text-center md:text-left">
            <span>© 2026 Evida. Built for campus life.</span>
          </div>

        </div>
      </footer>
    </div>
  );
}

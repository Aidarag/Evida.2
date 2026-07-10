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
  const [activeScreen, setActiveScreen] = useState(0);
  const [feedRsvp, setFeedRsvp] = useState(false);
  const [detailRsvp, setDetailRsvp] = useState(false);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  const handlePhoneClick = () => {
    if (!phoneActive) {
      setPhoneActive(true);
      setActiveScreen(0);
      setRsvpConfirmed(false);
    }
  };

  const handleRsvpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rsvpConfirmed) return;
    setRsvpConfirmed(true);
    setTimeout(() => {
      setPhoneActive(false);
      setRsvpConfirmed(false);
      setActiveScreen(0);
    }, 1500);
  };

  const handleScreenTap = () => {
    if (activeScreen < 4) {
      setActiveScreen(prev => prev + 1);
    }
  };

  // References for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scale and Lift animations for the smartphone shell
  const phoneScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.9, 1.05, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.4, 0.8], [60, -10, 0]);

  // Lock page scrolling when smartphone interactive mode is active
  useEffect(() => {
    if (phoneActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phoneActive]);

  // Handle scroll hijacking inside active smartphone demo
  useEffect(() => {
    if (!phoneActive) return;

    let isTransitioning = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // prevent landing page scrolling

      if (isTransitioning) return;

      if (e.deltaY > 30) {
        // Scroll down inside demo
        if (activeScreen < 4) {
          isTransitioning = true;
          setActiveScreen(prev => prev + 1);
          setTimeout(() => { isTransitioning = false; }, 600);
        } else {
          // Reached end screen, release scroll control
          setPhoneActive(false);
        }
      } else if (e.deltaY < -30) {
        // Scroll up inside demo
        if (activeScreen > 0) {
          isTransitioning = true;
          setActiveScreen(prev => prev - 1);
          setTimeout(() => { isTransitioning = false; }, 600);
        } else {
          // Reached top screen, release scroll control
          setPhoneActive(false);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [phoneActive, activeScreen]);

  // Handle mobile swipe hijacking inside active smartphone demo
  useEffect(() => {
    if (!phoneActive) return;

    let touchStartY = 0;
    let isTransitioning = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // prevent landing page swipe scrolling

      if (isTransitioning) return;

      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY; // positive means swipe up (scroll down)

      if (diffY > 55) {
        // Scroll down
        if (activeScreen < 4) {
          isTransitioning = true;
          setActiveScreen(prev => prev + 1);
          setTimeout(() => { isTransitioning = false; }, 600);
        } else {
          setPhoneActive(false);
        }
      } else if (diffY < -55) {
        // Scroll up
        if (activeScreen > 0) {
          isTransitioning = true;
          setActiveScreen(prev => prev - 1);
          setTimeout(() => { isTransitioning = false; }, 600);
        } else {
          setPhoneActive(false);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [phoneActive, activeScreen]);

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

          {/* Right side single CTA */}
          <div className="flex items-center">
            <button
              onClick={onLogin}
              className="rounded-full bg-[#BDFB04] text-[#191919] text-[10px] font-black px-5 py-2.5 hover:bg-[#d1fa3c] transition-all hover:scale-[1.02] border border-black/5 cursor-pointer shadow-sm uppercase tracking-wider"
            >
              Get Started
            </button>
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
                  animate={{ width: `${(activeScreen + 1) * 20}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeScreen === 0 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>1</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeScreen === 0 ? 'text-[#191919]' : 'text-gray-400'}`}>Dashboard</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeScreen === 1 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>2</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeScreen === 1 ? 'text-[#191919]' : 'text-gray-400'}`}>Discover</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeScreen === 2 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>3</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeScreen === 2 ? 'text-[#191919]' : 'text-gray-400'}`}>Experiences</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeScreen === 3 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>4</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeScreen === 3 ? 'text-[#191919]' : 'text-gray-400'}`}>Details</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeScreen === 4 
                    ? 'bg-[#191919] border-[#191919] text-[#BDFB04] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-gray-400'
                }`}>5</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeScreen === 4 ? 'text-[#191919]' : 'text-gray-400'}`}>RSVP</span>
              </div>
            </div>
          </div>

          {/* Center: Smartphone Shell */}
          <motion.div
            style={{ scale: phoneScale, y: phoneY }}
            onClick={handlePhoneClick}
            className={`relative max-w-[310px] w-full aspect-[9/19.5] rounded-[44px] border-[10px] border-neutral-950 shadow-2xl bg-neutral-900 z-20 cursor-pointer overflow-hidden touch-none select-none ${
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
                <div className="h-12 w-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shadow-lg animate-bounce">
                  <EvidaLogo size={22} showText={false} lightMode={false} />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#BDFB04]">Take a tour</span>
                  <span className="block text-[11px] font-bold text-gray-200">Tap to unlock screen</span>
                </div>
              </div>
            )}

            {/* User Journey Screens */}
            <div className="w-full h-full relative z-10 overflow-hidden bg-[#ECECE5] touch-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative select-none"
                  onClick={handleScreenTap}
                >
                  <img
                    src={`/tour-${activeScreen + 1}.png`}
                    alt={`Tour Screen ${activeScreen + 1}`}
                    className="w-full h-full object-fill select-none pointer-events-none"
                  />

                  {/* Hotspots & interactive elements on top of the images */}
                  {activeScreen === 1 && (
                    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[85%] h-[20%] cursor-pointer z-30 group">
                      {/* Pulsing card indicator */}
                      <div className="absolute inset-0 border-2 border-[#BDFB04] rounded-2xl animate-pulse" />
                      <div className="absolute bottom-2 right-2 bg-[#BDFB04] text-[#191919] text-[6px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                        Tap Card
                      </div>
                    </div>
                  )}

                  {activeScreen === 4 && (
                    <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[85%] h-[12%] cursor-pointer z-30 group" onClick={handleRsvpClick}>
                      {/* Pulsing RSVP indicator */}
                      {rsvpConfirmed ? (
                        <div className="absolute inset-0 bg-[#BDFB04] rounded-xl flex items-center justify-center gap-1.5 text-[#191919] font-black uppercase tracking-widest text-[9px] shadow-lg border border-white/20 animate-bounce">
                          <Check className="h-3.5 w-3.5 text-[#191919] stroke-[3]" />
                          <span>Going!</span>
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 border-2 border-[#BDFB04] rounded-xl animate-pulse" />
                          <div className="absolute inset-0 bg-transparent flex items-center justify-center text-[#BDFB04] text-[7px] font-black uppercase tracking-widest pointer-events-none">
                            Tap to RSVP
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
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
                    Use your mouse scroll wheel or swipe up/down on your phone to navigate pages.
                  </p>
                  <span className="block text-[8px] text-gray-500 font-bold uppercase pt-1">
                    {activeScreen === 2 ? 'Scroll down to exit →' : 'Scroll down to continue'}
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

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-left">
            
            {/* Card 1 */}
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                89%
              </span>
              <div className="h-1 w-8 bg-[#BDFB04] rounded-full my-2" />
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Miss important opportunities
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Students have missed important campus events, deadlines, and opportunities because information is scattered across multiple communication channels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                36%
              </span>
              <div className="h-1 w-8 bg-[#BDFB04] rounded-full my-2" />
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Never participate
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                More than one-third of students don’t participate in a single extracurricular or co-curricular activity during the academic year.
              </p>
            </div>

            {/* Card 3 */}
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                31%
              </span>
              <div className="h-1 w-8 bg-[#BDFB04] rounded-full my-2" />
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Don’t know what’s happening
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Many students say they miss campus activities simply because they never hear about them or discover them too late.
              </p>
            </div>

            {/* Card 4 */}
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black text-[#191919] tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                26%
              </span>
              <div className="h-1 w-8 bg-[#BDFB04] rounded-full my-2" />
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

          <div className="grid grid-cols-1 md:grid-cols-4 border border-black/[0.06] rounded-[32px] overflow-hidden bg-white shadow-sm">
            
            {/* Step 1 */}
            <div className="p-8 space-y-4 text-left border-b md:border-b-0 md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Step 01</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Mail className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Sign up with your school email
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Students verify their identity using their official university email to ensure a secure, trusted environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 space-y-4 text-left border-b md:border-b-0 md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Step 02</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Search className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Discover campus life
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Browse events, student organizations, promotions, and opportunities personalized specifically to your campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 space-y-4 text-left border-b md:border-b-0 md:border-r border-black/[0.06]">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Step 03</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Connect with peers
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                Join organizations, RSVP to events, interact with your campus community, and discover new experiences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-8 space-y-4 text-left">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">Step 04</span>
              <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-[#191919] border border-black/5 shadow-inner">
                <Plus className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#191919] leading-snug">
                Create new content
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
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

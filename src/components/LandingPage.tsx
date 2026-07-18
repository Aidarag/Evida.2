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
  Compass,
  Menu,
  X
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  // Smartphone Showcase States
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // 3D scale and rotateX perspective animations for the smartphone shell
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.0, 1.03]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 1, 0]);
  const progressPercent = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Virtual tap cursor transform mappings (tapping at progress 0.42 to 0.50)
  const cursorOpacity = useTransform(scrollYProgress, [0.42, 0.44, 0.48, 0.50], [0, 1, 1, 0]);
  const cursorScale = useTransform(scrollYProgress, [0.42, 0.45, 0.46, 0.48], [1, 1, 0.8, 1]);
  const cursorY = useTransform(scrollYProgress, [0.42, 0.45], [80, 0]);

  // Synchronize landing-page scroll progress with the preview iframe
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'EVIDA_PREVIEW_SCROLL_TO',
          progress: latest
        }, '*');
      }
    });
  }, [scrollYProgress]);

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

                  {/* Actions (Get Started Button) */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onLogin();
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-105 hover:-translate-y-0.5 text-white text-xs font-black py-3.5 transition-all duration-300 border border-white/10 cursor-pointer shadow-md shadow-[#FB1C07]/20 uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <span>Get started</span>
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
                <span>Get started</span>
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

      {/* Interactive Evida Smartphone Experience */}
      <section 
        id="experience" 
        ref={sectionRef} 
        className="relative h-[250vh] bg-[#A2C2BE]/10 border-y border-[#D8D2BC]"
      >
        {/* Sticky wrapper for pinning the screen */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-3 mb-6 pt-4 shrink-0">
            <span className="rounded-full bg-[#2A2621] text-[#FD5C05] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
              Take a tour
            </span>
            <h2 className="font-black tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Experience Evida
            </h2>
            <p className="text-xs text-[#5A554E] font-semibold max-w-md mx-auto leading-relaxed">
              Scroll down to watch a live guided tour of the Evida app experience.
            </p>
          </div>

          {/* Smartphone Container */}
          <div className="relative w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 sm:px-6 pb-6">
            
            {/* Left Side: Demo Progress Indicators (Visible in interactive mode) */}
            <div className="hidden md:flex flex-col gap-4 text-left min-w-[160px]">
              <div className="space-y-1.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-[#5A554E]">Tour Progress</span>
                <div className="h-1 bg-black/10 rounded-full w-28 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#2A2621]"
                    style={{ width: progressPercent }}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 transition-all duration-300">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    activeStep === 0 
                      ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                      : 'bg-white border-black/10 text-[#5A554E]'
                  }`}>1</div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 0 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Home Feed</span>
                </div>

                <div className="flex items-center gap-3 transition-all duration-300">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    activeStep === 1 
                      ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                      : 'bg-white border-black/10 text-[#5A554E]'
                  }`}>2</div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 1 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Select Event</span>
                </div>

                <div className="flex items-center gap-3 transition-all duration-300">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    activeStep === 2 
                      ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                      : 'bg-white border-black/10 text-[#5A554E]'
                  }`}>3</div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 2 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Event Details</span>
                </div>

                <div className="flex items-center gap-3 transition-all duration-300">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    activeStep === 3 
                      ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                      : 'bg-white border-black/10 text-[#5A554E]'
                  }`}>4</div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 3 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Read Info</span>
                </div>

                <div className="flex items-center gap-3 transition-all duration-300">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    activeStep === 4 
                      ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                      : 'bg-white border-black/10 text-[#5A554E]'
                  }`}>5</div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 4 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Finish Tour</span>
                </div>
              </div>
            </div>

            {/* Center: Smartphone Shell with 3D Perspective */}
            <div style={{ perspective: 1000, transformStyle: 'preserve-3d' }}>
              <motion.div
                style={{ 
                  scale: phoneScale, 
                  rotateX: phoneRotateX,
                  transformStyle: 'preserve-3d'
                }}
                className="relative max-w-[310px] w-full aspect-[9/19.5] rounded-[44px] border-[10px] border-neutral-950 shadow-2xl bg-[#D8D2BC] z-20 overflow-hidden select-none"
              >
                {/* Pointer events are completely disabled to make it read-only */}
                <div className="absolute inset-0 z-30 pointer-events-none" />

                {/* Gloss reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 z-40 pointer-events-none" />

                {/* Dynamic Island / Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-center shadow-inner pointer-events-none">
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

                {/* Virtual Tap Cursor Indicator */}
                <motion.div
                  style={{
                    opacity: cursorOpacity,
                    scale: cursorScale,
                    y: cursorY,
                    position: 'absolute',
                    top: '38%',
                    left: '50%',
                    x: '-50%',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(253, 92, 5, 0.4)',
                    border: '2px solid #FD5C05',
                    boxShadow: '0 0 10px rgba(253, 92, 5, 0.5)',
                    zIndex: 50,
                    pointerEvents: 'none'
                  }}
                />

                {/* The Live Mobile Preview Iframe */}
                <iframe
                  ref={iframeRef}
                  src="/student/dashboard?preview=true"
                  className="w-full h-full border-none select-none bg-[#D8D2BC] pointer-events-none"
                  style={{
                    overflowX: 'hidden'
                  }}
                />
              </motion.div>
            </div>

            {/* Right Side: Tooltip & Swiping instructions */}
            <div className="relative flex flex-col gap-3 text-center md:text-left max-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key="active-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#2A2621] text-white border border-white/10 px-4 py-3 rounded-2xl shadow-xl space-y-2 pointer-events-none"
                >
                  <span className="block text-[8px] font-black uppercase tracking-widest text-[#FD5C05] animate-pulse">
                    Guided Tour
                  </span>
                  <p className="text-[9px] text-gray-300 leading-snug">
                    {activeStep === 0 && "Scroll down the student home feed to find an event."}
                    {activeStep === 1 && "Tap any event card in the feed to open details."}
                    {activeStep === 2 && "Read through the event information."}
                    {activeStep === 3 && "Scroll down to see the event organizer, location, and RSVP status."}
                    {activeStep === 4 && "Scroll down once more to finish the tour and resume scrolling the landing page!"}
                  </p>
                  <span className="block text-[8px] text-[#FD5C05] font-bold uppercase pt-1">
                    {activeStep === 4 ? 'Scroll down to exit →' : 'Scroll to explore'}
                  </span>
                </motion.div>
              </AnimatePresence>
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
                <span>Get started</span>
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
                  <a href="#get-started" className="hover:text-[#FD5C05] transition-colors">Get Started</a>
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

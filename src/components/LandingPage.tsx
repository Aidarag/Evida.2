'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Shield, 
  Users, 
  Trophy,
  Mail,
  User as UserIcon,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
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
  // Waitlist State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Check if already joined on load
  useEffect(() => {
    const joined = localStorage.getItem('evida_waitlist_joined');
    if (joined) {
      try {
        const parsed = JSON.parse(joined);
        setName(parsed.name);
        setEmail(parsed.email);
        setRole(parsed.role);
        setIsSubmitted(true);
        const hash = parsed.email.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        setQueueNumber((hash % 300) + 1240);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      const waitlistData = { name, email, role, date: new Date().toISOString() };
      localStorage.setItem('evida_waitlist_joined', JSON.stringify(waitlistData));
      
      const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const mockNum = (hash % 300) + 1240;
      
      setQueueNumber(mockNum);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handleScrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Focus name input if element is present
      const nameInput = document.getElementById('waitlist-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 800);
      }
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Evida?",
      answer: "Evida is a premium, unified digital home for student life. It aggregates campus events, student organizations, promotions, and opportunities into a high-end, responsive feed."
    },
    {
      question: "How does the waitlist early access work?",
      answer: "We are currently accepting waitlist registrations for our select campus rollouts. By joining, you secure an early spot in the queue. Invitations will be dispatched in batches based on registration numbers and school launch phases."
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
            <a href="#about" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              About
            </a>
            <a href="#vision" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              Vision
            </a>
            <a href="#how-it-works" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              How It Works
            </a>
            <a href="#featured" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              Featured Events
            </a>
            <a href="#faq" className="text-[10px] font-black text-[#4B5563] hover:text-[#191919] uppercase tracking-widest transition-all">
              FAQ
            </a>
          </nav>

          {/* Right side single CTA */}
          <div className="flex items-center">
            <button
              onClick={handleScrollToWaitlist}
              className="rounded-full bg-[#BDFB04] text-[#191919] text-[10px] font-black px-5 py-2.5 hover:bg-[#d1fa3c] transition-all hover:scale-[1.02] border border-black/5 cursor-pointer shadow-sm uppercase tracking-wider"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col md:flex-row items-center gap-12 z-10 w-full">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#BDFB04]/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-[#DFDED7]/30 blur-[80px] pointer-events-none"></div>

        {/* Text */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="rounded-full bg-[#BDFB04]/15 border border-[#BDFB04]/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#191919] inline-block">
              Campus Events • Organizations • Promotions
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-[#191919] leading-[0.95]"
          >
            Everything Happening on Campus. <br />
            <span className="bg-[#BDFB04] text-[#191919] px-4 py-1.5 rounded-2xl inline-block mt-2 shadow-sm border border-[#BDFB04]/40">
              All in One Place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[#374151] max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
          >
            Evida is the platform that brings together campus events, student organizations, promotions, and opportunities into one modern experience for students and schools. Discover what's happening, connect with groups, and never miss out on campus life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
          >
            <button
              onClick={handleScrollToWaitlist}
              className="flex items-center gap-2 rounded-full bg-[#BDFB04] hover:bg-[#d1fa3c] px-6 py-3.5 text-xs font-extrabold text-[#191919] shadow-lg shadow-[#BDFB04]/25 hover:scale-[1.03] transition-all cursor-pointer uppercase tracking-wider"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4 text-[#191919]" />
            </button>
          </motion.div>
        </div>

        {/* Cinematic Card Preview - Displays generated campus life image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[380px] aspect-[3/4] rounded-[32px] overflow-hidden border border-black/[0.08] shadow-xl float-glowing"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#BDFB04]/25 via-transparent to-transparent z-10" />
            {/* Background generated image */}
            <div className="absolute inset-0 bg-[url('/campus_life_hero.png')] bg-cover bg-center" />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent z-10" />

            {/* Poster contents */}
            <div className="absolute inset-x-6 bottom-6 z-20 space-y-3">
              <span className="rounded-full bg-[#BDFB04] px-2.5 py-0.5 text-[9px] font-black text-[#191919] uppercase tracking-wider shadow-sm">
                Built for Students & Schools
              </span>
              <h3 className="text-xl font-extrabold text-[#191919] leading-tight">
                Connect. Discover. Lead.
              </h3>
              <div className="flex items-center justify-between text-xs text-[#374151] font-semibold">
                <span>FALL 2026 RELEASE</span>
                <span className="font-extrabold text-[#191919] bg-[#BDFB04] px-2.5 py-0.5 rounded shadow-sm text-[9px]">JOIN WAITLIST</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#DFDED7]/35 border-y border-black/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">About Evida</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#191919] uppercase">The Digital Center of Campus Life</h2>
            <p className="text-xs text-[#374151] leading-relaxed">
              We replace fragmented group chats, physical flyers, and archaic university portals with a single premium interface designed for high-density student hubs.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Students */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white p-8 space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#BDFB04]/10 blur-3xl"></div>
              <h3 className="text-lg font-extrabold text-[#191919] tracking-tight uppercase flex items-center gap-2">
                <Users className="h-5 w-5 text-[#191919]" /> For Students & Leaders
              </h3>
              <ul className="space-y-3.5 text-xs text-[#374151] font-medium text-left">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Explore upcoming mixers, career nights, and club showcases.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Submit events representing verified campus student organizations.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Advertise peer tutoring, photowalks, or marketplace items.
                </li>
              </ul>
            </div>

            {/* School */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white p-8 space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#BDFB04]/10 blur-3xl"></div>
              <h3 className="text-lg font-extrabold text-[#191919] tracking-tight uppercase flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#191919]" /> For Universities
              </h3>
              <ul className="space-y-3.5 text-xs text-[#374151] font-medium text-left">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Maintain administrative oversight and student safety guards.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Manage and approve events with clean reviewer queues and feedback.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDFB04] mt-1.5 shrink-0 border border-black/10" />
                  Monitor campus engagement trends and attendance records.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="mx-auto max-w-7xl px-6 py-20 space-y-12">
        <div className="text-center space-y-3 max-w-lg mx-auto">
          <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Our Vision</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#191919] uppercase">Empowering Campus Communities</h2>
        </div>

        <div className="bg-[#191919] text-white rounded-[32px] p-8 md:p-12 relative overflow-hidden border border-black/5 shadow-lg text-left">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 rounded-full bg-[#BDFB04]/5 blur-[120px] pointer-events-none"></div>
          <div className="max-w-2xl space-y-6">
            <p className="text-lg md:text-2xl font-black uppercase text-[#BDFB04] leading-snug tracking-wide">
              Fostering connection, visibility, and frictionless student activities.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              We believe campus life should be vibrant and accessible. Scrambled group chats, lost flyers, and outdated university software divide student organizations and isolate students. Evida rebuilds campus interaction from the ground up, delivering a premium engagement framework that unites activities, services, and administration.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[#BDFB04]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#BDFB04]">Designed for early access</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#DFDED7]/35 border-t border-black/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">How it works</span>
            <h2 className="text-3xl font-extrabold text-[#191919] uppercase">Campus Engagement Simplified</h2>
            <p className="text-xs text-[#374151]">We bridge the gap between student groups and university staff.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-[24px] bg-white border border-black/[0.04] p-6 space-y-4 shadow-sm text-left">
              <div className="h-10 w-10 rounded-xl bg-[#BDFB04]/20 flex items-center justify-center text-[#191919] border border-[#BDFB04]/30">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#191919] uppercase">1. Discover & RSVP</h3>
              <p className="text-xs text-[#374151] leading-relaxed">
                Explore a unified campus event board. RSVP, save events, or add them directly to your personal calendar in one click.
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-black/[0.04] p-6 space-y-4 shadow-sm text-left">
              <div className="h-10 w-10 rounded-xl bg-[#BDFB04]/20 flex items-center justify-center text-[#191919] border border-[#BDFB04]/30">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#191919] uppercase">2. Build Communities</h3>
              <p className="text-xs text-[#374151] leading-relaxed">
                Create events representing yourself or student organizations you belong to. Host fundraisers, athletic games, or showcases.
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-black/[0.04] p-6 space-y-4 shadow-sm text-left">
              <div className="h-10 w-10 rounded-xl bg-[#BDFB04]/20 flex items-center justify-center text-[#191919] border border-[#BDFB04]/30">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#191919] uppercase">3. Smart Review Queue</h3>
              <p className="text-xs text-[#374151] leading-relaxed">
                Evida analyzes event resources in real-time, routing basic requests to fast approval queues to minimize administrative workload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="featured" className="py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black tracking-widest text-[#4B5563] uppercase">Experiences</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#191919] uppercase">Trending Experiences</h2>
            <p className="text-xs text-[#374151]">Get a sneak peek of upcoming campus gatherings and initiatives.</p>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={handleScrollToWaitlist}
                  className="group relative rounded-[24px] aspect-[4/3] overflow-hidden border border-black/[0.06] bg-white cursor-pointer transition-all hover:border-[#BDFB04] shadow-sm hover:shadow-md"
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10" />
                  
                  <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col justify-end text-left">
                    <span className="text-[10px] font-bold text-[#191919] bg-[#BDFB04]/30 px-2 py-0.5 rounded-md w-fit uppercase tracking-wide">
                      {event.organizationName || 'CAMPUS HUB'}
                    </span>
                    <h4 className="text-sm font-bold text-[#191919] mt-1.5 leading-snug">
                      {event.title}
                    </h4>
                    <div className="flex justify-between items-center text-[10px] text-[#374151] mt-2 font-semibold">
                      <span>{event.date}</span>
                      <span className="capitalize">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative rounded-[24px] aspect-[4/3] overflow-hidden border border-black/[0.06] bg-white cursor-pointer transition-all hover:border-[#BDFB04] shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                <div className="absolute inset-x-5 bottom-5 z-20 text-left">
                  <span className="text-[9px] font-black text-[#191919] bg-[#BDFB04] px-2 py-0.5 rounded uppercase tracking-wider">ACM CHAPTER</span>
                  <h4 className="text-sm font-black text-[#191919] mt-1 uppercase">Tech Hackathon 2026</h4>
                  <div className="flex justify-between text-[10px] text-[#4B5563] mt-1.5 font-bold">
                    <span>OCTOBER 15</span>
                    <span>ENGINEERING HALL</span>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-[24px] aspect-[4/3] overflow-hidden border border-black/[0.06] bg-white cursor-pointer transition-all hover:border-[#BDFB04] shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                <div className="absolute inset-x-5 bottom-5 z-20 text-left">
                  <span className="text-[9px] font-black text-[#191919] bg-[#BDFB04] px-2 py-0.5 rounded uppercase tracking-wider">STUDENT UNION</span>
                  <h4 className="text-sm font-black text-[#191919] mt-1 uppercase">Autumn Music Festival</h4>
                  <div className="flex justify-between text-[10px] text-[#4B5563] mt-1.5 font-bold">
                    <span>OCTOBER 24</span>
                    <span>CAMPUS QUAD</span>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-[24px] aspect-[4/3] overflow-hidden border border-black/[0.06] bg-white cursor-pointer transition-all hover:border-[#BDFB04] shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f30312245d5?w=600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                <div className="absolute inset-x-5 bottom-5 z-20 text-left">
                  <span className="text-[9px] font-black text-[#191919] bg-[#BDFB04] px-2 py-0.5 rounded uppercase tracking-wider">CREATIVE COLLECTIVE</span>
                  <h4 className="text-sm font-black text-[#191919] mt-1 uppercase">Art Showcase & Gallery</h4>
                  <div className="flex justify-between text-[10px] text-[#4B5563] mt-1.5 font-bold">
                    <span>NOVEMBER 12</span>
                    <span>STUDENT CENTER</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Waitlist Form Section */}
      <section id="waitlist" className="py-24 bg-[#191919] text-white relative border-t border-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#191919] to-[#191919] z-0" />
        
        <div className="relative z-10 max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="rounded-full bg-[#BDFB04]/10 border border-[#BDFB04]/30 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#BDFB04] inline-block">
              Limited Beta Slots
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Join the Waitlist
            </h2>
            <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
              Sign up today to lock in your priority queue number and campus launch updates.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="waitlist-form"
                onSubmit={handleWaitlistSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl text-left space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      id="waitlist-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 pl-11 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04]/25 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="jane.doe@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 pl-11 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04]/25 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Your Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-3.5 rounded-2xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center ${
                        role === 'student'
                          ? 'bg-[#BDFB04] border-[#BDFB04] text-[#191919]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-3.5 rounded-2xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center ${
                        role === 'admin'
                          ? 'bg-[#BDFB04] border-[#BDFB04] text-[#191919]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Administrator
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#BDFB04] hover:bg-[#d1fa3c] disabled:bg-[#BDFB04]/50 py-4 text-xs font-black text-[#191919] uppercase tracking-wider shadow-lg shadow-[#BDFB04]/20 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Join the Waitlist</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="waitlist-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-950/40 backdrop-blur-md border border-[#BDFB04]/25 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6"
              >
                <div className="h-16 w-16 bg-[#BDFB04]/10 rounded-full flex items-center justify-center border border-[#BDFB04]/30 mx-auto text-[#BDFB04]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#BDFB04]">You are on the list!</h3>
                  <p className="text-xs text-gray-300 font-medium max-w-sm mx-auto leading-relaxed">
                    Thank you for joining, <span className="text-[#BDFB04] font-bold">{name}</span>. We've registered your email (<span className="text-white font-semibold">{email}</span>).
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl max-w-xs mx-auto">
                  <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">Your Queue Position</span>
                  <span className="text-3xl font-black text-[#BDFB04] font-mono mt-1 block">#{queueNumber}</span>
                </div>

                <p className="text-[10px] text-gray-500 font-medium">
                  We'll contact you at your email address as soon as early access builds are live for your role.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="pt-2 text-[10px] text-gray-500 font-medium">
            Already have private beta login credentials?{' '}
            <button onClick={onLogin} className="text-[#BDFB04] font-black underline hover:text-[#d1fa3c] cursor-pointer">
              Sign In here
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-10 bg-[#191919] text-center space-y-3">
        <p className="text-xs font-bold text-white uppercase tracking-wider">EVIDA CAMPUS PLATFORM</p>
        <p className="text-[10px] text-[#4B5563]">© 2026 Evida Inc. Premium Campus Experience.</p>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import { ArrowRight, Sparkles, Calendar, Shield, Users, Trophy } from 'lucide-react';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';

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
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#FFD214] shadow-lg shadow-orange-500/20">
              <Sparkles className="h-5 w-5 text-black font-extrabold" />
            </div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
              EVIDA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLogin}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onExplore}
              className="rounded-full bg-white text-black text-xs font-bold px-4 py-2 hover:bg-slate-200 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Explore Feed
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col md:flex-row items-center gap-12 z-10">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FF7A1A]/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-[#FFD214]/5 blur-[80px] pointer-events-none"></div>

        {/* Text */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="rounded-full bg-[#FF7A1A]/10 border border-[#FF7A1A]/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF7A1A]">
              THE DIGITAL HOME OF CAMPUS LIFE
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]"
          >
            Your campus, <br />
            <span className="bg-gradient-to-r from-[#FF7A1A] to-[#FFD214] bg-clip-text text-transparent">
              all in one place.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            Evida is a premium engagement experience. Students discover events, track RSVPs, and promote initiatives, while universities manage campus activities and monitor real-time attendance analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
          >
            <button
              onClick={onExplore}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB61D] px-6 py-3.5 text-xs font-black text-black shadow-lg shadow-orange-500/20 hover:scale-[1.03] transition-all cursor-pointer"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 rounded-full border border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-slate-900 px-6 py-3.5 text-xs font-black text-white hover:scale-[1.03] transition-all cursor-pointer"
            >
              Create Event
            </button>
          </motion.div>
        </div>

        {/* Cinematic Card Preview */}
        <div className="md:w-1/2 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[380px] aspect-[3/4] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl float-glowing"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/40 via-transparent to-purple-800/25 z-10" />
            {/* Background representation of image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center" />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent z-10" />

            {/* Poster contents */}
            <div className="absolute inset-x-6 bottom-6 z-20 space-y-3">
              <span className="rounded-full bg-[#FF7A1A] px-2.5 py-0.5 text-[9px] font-black text-black uppercase tracking-wider">
                FEATURED EXPERIENCE
              </span>
              <h3 className="text-xl font-black text-white leading-tight">
                Homecoming Kickoff Rally 2026
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>OCTOBER 9 • plaza</span>
                <span className="font-bold text-[#FF7A1A]">FREE TICKET</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Preview list */}
      <section className="bg-slate-950/40 border-y border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">TRENDING EXPERIENCES</h2>
            <p className="text-xs text-slate-500">Live feed of the most anticipated campus gatherings</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                onClick={onExplore}
                className="group relative rounded-[24px] aspect-[4/3] overflow-hidden border border-white/5 bg-slate-900/40 cursor-pointer transition-all hover:border-[#FF7A1A]/30"
              >
                {/* Poster cover representation */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-30 group-hover:opacity-40 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                
                <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-[#FF7A1A] uppercase tracking-wide">
                    {event.organizationName || 'OFFICIAL SCHOOL EVENT'}
                  </span>
                  <h4 className="text-sm font-black text-white mt-1 leading-snug">
                    {event.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-semibold">
                    <span>{event.date}</span>
                    <span className="capitalize">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20 space-y-16">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-white uppercase">CAMPUS ENGAGEMENT SIMPLIFIED</h2>
          <p className="text-xs text-slate-400">We bridge the gap between student groups and university staff.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[24px] bg-[#121215]/50 border border-white/5 p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#FF7A1A]">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">1. Discover & RSVP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore a unified campus event board. RSVP, save events, or add them directly to your personal calendar in one click.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#121215]/50 border border-white/5 p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-[#FFD214]">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">2. Build Communities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create events representing yourself or student organizations you belong to. Host fundraisers, athletic games, or showcases.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#121215]/50 border border-white/5 p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">3. Smart Review Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evida analyzes event resources in real-time, routing basic requests to fast approval queues to minimize administrative workload.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Split Grid */}
      <section className="bg-slate-950/40 border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-2">
          {/* Students */}
          <div className="rounded-[28px] border border-white/5 bg-[#121215]/50 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#FF7A1A]/5 blur-3xl"></div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FF7A1A]" /> For Students & Leaders
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A1A] mt-1.5 shrink-0" />
                Explore upcoming mixers, career nights, and Greek showcases.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A1A] mt-1.5 shrink-0" />
                Submit activities representing verified student clubs.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A1A] mt-1.5 shrink-0" />
                Advertise local services (e.g. tutoring, portraits) to peers.
              </li>
            </ul>
          </div>

          {/* School */}
          <div className="rounded-[28px] border border-white/5 bg-[#121215]/50 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#FFD214]/5 blur-3xl"></div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FFD214]" /> For Universities
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD214] mt-1.5 shrink-0" />
                Establish full oversight of student gatherings.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD214] mt-1.5 shrink-0" />
                Approve, reject, or request changes with custom reviewer feedback.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD214] mt-1.5 shrink-0" />
                Monitor student attendance metrics and active organization rosters.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-slate-950 text-center space-y-3">
        <p className="text-xs font-bold text-white uppercase tracking-wider">EVIDA CAMPUS PLATFORM</p>
        <p className="text-[10px] text-slate-500">© 2026 Evida Inc. Premium Campus Experience.</p>
      </footer>
    </div>
  );
}

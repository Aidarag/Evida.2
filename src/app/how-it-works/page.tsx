'use client';

import React from 'react';
import Link from 'next/link';
import { Search, MousePointer2, UserCheck, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#121212] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Hero Header */}
      <section className="relative w-full bg-[#121212] pt-36 pb-20 overflow-hidden text-center flex flex-col items-center">
        {/* Ambient Brand Glowing Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5A1F]/8 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            THE PLATFORM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            How It <span className="text-[#FF5A1F]">Works</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Evida streamlines campus event discovery, creation, attendance tracking, and organization engagement in four simple steps.
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <main className="flex-1 py-24 bg-[#FFFDF8]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center space-y-16">
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {[
              {
                number: "01",
                title: "Discover",
                icon: Search,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "Find exactly what you're looking for. Filter by category, date, or organization to discover the best of campus life."
              },
              {
                number: "02",
                title: "Create",
                icon: MousePointer2,
                color: "#121212",
                lightBg: "bg-black/5",
                description: "Host your own event, workshop, or promotion. Customize the details and publish instantly for your club or community."
              },
              {
                number: "03",
                title: "Attend",
                icon: UserCheck,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "RSVP to events, save them to your profile, and receive reminders. Show up and connect with your fellow students."
              },
              {
                number: "04",
                title: "Engage",
                icon: LineChart,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "Track attendance, collect feedback, and analyze engagement. Administrators and student leaders get real-time analytics."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="bg-white border border-black/[0.04] rounded-[24px] p-8 flex flex-col justify-between shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300"
                >
                  {/* Top Row: Number & Icon */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-extrabold text-2xl" style={{ fontFamily: 'var(--font-display)', color: step.color }}>
                      {step.number}
                    </span>
                    <div className={`p-3.5 rounded-2xl border border-transparent ${step.lightBg}`} style={{ color: step.color }}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Bottom Area: Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-[#121212] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-[#4F5666] text-xs sm:text-sm leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      {/* Footer Section */}
      <footer className="relative w-full bg-[#121212] pt-24 pb-12 border-t border-white/5">
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
              <p className="pt-2 hover:text-[#FF5A1F] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Discover Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Discover</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="/about" className="hover:text-white transition-colors">About Evida</Link></li>
              <li><Link href="/student/events" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
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
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#121212] transition-all duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[#FF5A1F] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { DesktopNav } from '@/components/Navbar';
import OurVisionSection from '@/components/student/OurVisionSection';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function OurMissionPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#121212] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Hero Header */}
      <section className="relative w-full bg-[#121212] pt-36 pb-20 overflow-hidden text-center flex flex-col items-center">
        {/* Ambient Brand Glowing Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5A1F]/8 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            OUR PURPOSE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            Our <span className="text-[#FF5A1F]">Mission</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Connecting students, clubs, and universities in one seamless ecosystem to build the future of campus engagement.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <main className="flex-1">
        <OurVisionSection />
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

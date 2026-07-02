'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function LandingPage() {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Scroll-based parallax and zoom transforms for the hero background image
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 160]);
  const opacityBg = useTransform(scrollY, [0, 600], [0.45, 0.05]);
  const scaleBg = useTransform(scrollY, [0, 600], [1, 1.06]);

  const headlineLines = ["Discover Evida", "the digital home", "of campus life"];

  return (
    <div className="min-h-screen bg-[#DFDED7] text-[#191919] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Responsive Immersive Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-3.5rem)] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#191919] pt-20 pb-24 md:pt-28 md:pb-24">
        
        {/* Animated Background Image */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
          className="absolute inset-0 w-full h-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center pointer-events-none"
        />
        
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#191919]/90 via-[#191919]/75 to-[#191919] z-0" />

        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#92D000]/8 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Hero Content: Single Centered Grid Container */}
        <div className="relative z-10 w-full max-w-md md:max-w-4xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6 md:space-y-8">
          
          {/* Accent Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-white/95 backdrop-blur-md">
              THE DIGITAL HOME OF CAMPUS LIFE
            </span>
          </motion.div>

          {/* Headline Fluid Word Reveal (Fully responsive & optimized for all devices) */}
          <h1 
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-[clamp(1.2rem,5.8vw,4.5rem)] font-extrabold text-white leading-[1.15] md:leading-[1.1] tracking-tight select-none uppercase w-full max-w-sm sm:max-w-xl md:max-w-5xl mx-auto"
          >
            {headlineLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block whitespace-normal sm:whitespace-nowrap ${idx === 2 ? "text-[#92D000]" : "text-white"}`}
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
            className="text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-xl mx-auto font-light leading-relaxed"
          >
            Evida is a premium engagement experience. Students discover events, track RSVPs, and build communities, while universities manage activities with real-time analytics.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/login" 
              className="bg-[#92D000] text-[#191919] font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-8 py-3.5 sm:py-4 hover:bg-[#92D000]/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-full shadow-[0_4px_18px_rgba(32,54,39,0.15)] w-fit mx-auto"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>



        {/* Scrolling Category Marquee (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#191919]/90 backdrop-blur-md py-4.5 flex items-center border-t border-white/5 shadow-2xl">
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

      {/* Footer Section */}
      <footer className="relative w-full bg-[#191919] pt-24 pb-12 border-t border-white/5">
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
              <p className="pt-2 hover:text-[#92D000] transition-colors cursor-pointer">Email: hello@evida.app</p>
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
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Newsletter</h4>
            <p className="text-white/40 text-xs leading-relaxed font-light">
              Stay updated on the latest campus events and club promotions.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (emailInput) setSubscribed(true); }} className="flex flex-col sm:flex-row gap-2 pt-2">
              {subscribed ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#92D000]/15 border border-[#92D000]/30 text-[#92D000] text-xs font-bold">
                  ✓ Subscribed! Welcome aboard.
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#92D000] transition-colors"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-[#92D000] text-[#191919] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#191919] transition-all duration-300 whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[#92D000] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}

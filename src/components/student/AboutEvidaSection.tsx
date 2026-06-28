'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap, Music, CalendarDays, Users, Trophy } from 'lucide-react';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function AboutEvidaSection() {
  return (
    <section id="about-evida" className="relative w-full bg-white py-24 overflow-hidden border-y border-slate-100 font-sans">
      {/* Background Texture / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 relative">
          {/* Top Left Text */}
          <div className="mb-8 md:mb-0">
            <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-widest leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              About <br /> <span className="text-[#2563EB]">Evida</span>
            </h2>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
            <div className="flex items-center justify-center">
              <EvidaLogo size={40} showText={true} lightMode={true} />
            </div>
            {/* Campus Icons row */}
            <div className="flex items-center gap-6 md:gap-12 mt-8 text-slate-400">
              <GraduationCap className="h-6 w-6 hover:text-[#2563EB] transition-colors cursor-pointer" />
              <Music className="h-6 w-6 hover:text-[#2563EB] transition-colors cursor-pointer" />
              <Trophy className="h-6 w-6 hover:text-[#2563EB] transition-colors cursor-pointer" />
              <CalendarDays className="h-6 w-6 hover:text-[#2563EB] transition-colors cursor-pointer" />
              <Users className="h-6 w-6 hover:text-[#2563EB] transition-colors cursor-pointer" />
            </div>
          </div>
          
          {/* Top Right Decorative (optional) */}
          <div className="hidden md:block">
            <div className="text-slate-300 font-bold text-xl tracking-widest">EST. 2024</div>
          </div>
        </div>

        {/* Central Purple-ish / Brand Block */}
        <div className="relative w-full max-w-6xl mx-auto mt-24">
          
          {/* The main block background */}
          <div className="bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-[40px] p-8 md:p-16 text-center relative z-20 backdrop-blur-sm max-w-2xl lg:max-w-3xl mx-auto">
            
            <p className="text-[#2563EB] text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-6">
              Who We Are
            </p>

            <h3 className="text-slate-900 font-extrabold text-2xl md:text-4xl lg:text-5xl uppercase leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              The Digital Home of Campus Life.
            </h3>
            
            <p className="text-slate-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Evida brings every campus event, organization, and opportunity into one place, helping students discover experiences, build connections, and create unforgettable college memories.
            </p>

          </div>

          {/* Polaroid photos */}
          <div className="mt-12 lg:mt-0 grid grid-cols-2 md:grid-cols-4 lg:block gap-6 justify-items-center relative z-30">
            
            {/* Top Left Photo */}
            <div className="lg:absolute lg:-top-12 lg:-left-6 xl:-left-16 z-30 lg:rotate-[-4deg] hover:lg:rotate-[-1deg] transition-transform duration-300">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg w-36 sm:w-44 md:w-48 lg:w-40 xl:w-48 border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-ron-lach-8576102.jpg" alt="Campus Concert" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="absolute bottom-2.5 left-0 w-full text-center text-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider handwritten-font">Welcome Week</p>
              </div>
            </div>

            {/* Top Right Photo */}
            <div className="lg:absolute lg:-top-6 lg:-right-6 xl:-right-16 z-30 lg:rotate-[3deg] hover:lg:rotate-[0deg] transition-transform duration-300">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg w-32 sm:w-40 md:w-44 lg:w-36 xl:w-44 border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-marwen-larafa-2159807713-37714941.jpg" alt="Basketball Game" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="absolute bottom-2.5 left-0 w-full text-center text-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider handwritten-font">Game Day</p>
              </div>
            </div>

            {/* Bottom Left Photo */}
            <div className="hidden md:block lg:absolute lg:bottom-4 lg:-left-4 xl:-left-8 z-30 lg:rotate-[2deg] hover:lg:rotate-[-1deg] transition-transform duration-300">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg w-32 sm:w-40 md:w-44 lg:w-36 xl:w-44 border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-franco-monsalvo-252430633-37980178.jpg" alt="Party" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="absolute bottom-2.5 left-0 w-full text-center text-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider handwritten-font">Homecoming</p>
              </div>
            </div>

            {/* Bottom Right Photo */}
            <div className="hidden md:block lg:absolute lg:-bottom-12 lg:-right-6 xl:-right-12 z-30 lg:rotate-[-3deg] hover:lg:rotate-[1deg] transition-transform duration-300">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg w-36 sm:w-44 md:w-48 lg:w-40 xl:w-48 border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-tima-miroshnichenko-5439368.jpg" alt="Career Fair" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="absolute bottom-2.5 left-0 w-full text-center text-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider handwritten-font">Career Fair</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

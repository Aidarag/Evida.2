'use client';

import React from 'react';
import Image from 'next/image';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function AboutEvidaSection() {
  return (
    <section id="about-evida" className="relative w-full bg-white py-24 overflow-hidden border-y border-slate-100 font-sans">
      {/* Background Texture / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 border-b border-slate-100 pb-8">
          {/* Top Left Text */}
          <div className="mb-4 sm:mb-0">
            <h2 className="text-slate-900 font-extrabold text-3xl md:text-4xl uppercase tracking-wider leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              About <span className="text-[#2563EB]">Evida</span>
            </h2>
          </div>

          {/* Right Logo */}
          <div className="flex items-center">
            <EvidaLogo size={36} showText={true} lightMode={true} />
          </div>
        </div>

        {/* Central Purple-ish / Brand Block */}
        <div className="relative w-full max-w-5xl mx-auto space-y-16">
          
          {/* The main block background */}
          <div className="bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-[40px] p-8 md:p-16 text-center relative z-20 backdrop-blur-sm">
            
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

          {/* Polaroid photos - positioned below the text block in a clean grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center relative z-30 pt-4">
            
            {/* Photo 1 */}
            <div className="rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 w-full max-w-[220px]">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-ron-lach-8576102.jpg" alt="Campus Concert" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="text-center text-slate-800 font-bold text-xs uppercase tracking-wider handwritten-font mt-3">Welcome Week</p>
              </div>
            </div>

            {/* Photo 2 */}
            <div className="rotate-[1.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 w-full max-w-[220px]">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-marwen-larafa-2159807713-37714941.jpg" alt="Basketball Game" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="text-center text-slate-800 font-bold text-xs uppercase tracking-wider handwritten-font mt-3">Game Day</p>
              </div>
            </div>

            {/* Photo 3 */}
            <div className="rotate-[-1.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 w-full max-w-[220px]">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-franco-monsalvo-252430633-37980178.jpg" alt="Party" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="text-center text-slate-800 font-bold text-xs uppercase tracking-wider handwritten-font mt-3">Homecoming</p>
              </div>
            </div>

            {/* Photo 4 */}
            <div className="rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 w-full max-w-[220px]">
              <div className="bg-white p-2.5 pb-8 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src="/pexels-tima-miroshnichenko-5439368.jpg" alt="Career Fair" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="text-center text-slate-800 font-bold text-xs uppercase tracking-wider handwritten-font mt-3">Career Fair</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

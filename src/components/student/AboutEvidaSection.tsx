'use client';

import React from 'react';
import Image from 'next/image';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function AboutEvidaSection() {
  return (
    <section id="about-evida" className="relative w-full bg-[#FFFDE1] py-24 overflow-hidden border-b border-[#766754]/10 font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 1. Header Row (Rekolet inspired) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[#766754] text-xs font-bold tracking-[0.25em] uppercase block mb-3">ABOUT US</span>
            <h2 className="text-[#2c2324] font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              CAMPUS LIFE<br />BUILDERS
            </h2>
          </div>
          <div className="flex items-center">
            <EvidaLogo size={36} showText={true} lightMode={true} />
          </div>
        </div>

        {/* 2. Wide Landscape Image Banner */}
        <div className="relative w-full aspect-[16/7] md:aspect-[24/9] rounded-[32px] overflow-hidden shadow-sm mb-16 border border-[#766754]/10">
          <Image 
            src="/pexels-hanna-elesha-abraham-1587801282-27498756.jpg" 
            alt="Campus Life Builders" 
            fill 
            className="object-cover" 
            priority
          />
        </div>

        {/* 3. Editorial Two-Column Text Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-start text-left">
          <div className="md:col-span-3">
            <span className="text-[#766754] text-xs font-bold tracking-[0.25em] uppercase block pt-2">
              OUR MISSION
            </span>
          </div>
          <div className="md:col-span-9">
            <p className="text-[#2c2324] font-extrabold text-xl md:text-3xl lg:text-4xl leading-tight tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Every campus tells a story, and at Evida®, we make sure it's unforgettable. <span className="text-[#766754] font-normal lowercase normal-case">From concept to connection, we bring student life to life with design, coordination, and shaping experiences that resonate with everyone.</span>
            </p>
          </div>
        </div>

        {/* 4. Three Vertical Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 (Santiago Orange) */}
          <div className="bg-[#eb5e28] rounded-[32px] p-8 md:p-10 flex flex-col justify-between aspect-[4/5] text-left shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div>
              <span className="text-[#FFFDE1]/70 text-[10px] font-bold tracking-[0.2em] uppercase">ENGAGEMENT</span>
              <h4 className="text-[#FFFDE1] font-bold text-lg md:text-xl uppercase mt-4 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                Active Campus Community
              </h4>
            </div>
            <div>
              <div className="text-[#FFFDE1] font-extrabold text-5xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                94%
              </div>
              <p className="text-[#FFFDE1]/80 text-xs mt-4 font-light leading-relaxed">
                Students reporting a more connected and active campus experience since using Evida.
              </p>
            </div>
          </div>

          {/* Card 2 (Cold Foam with Landmark Border) */}
          <div className="bg-[#FFFDE1] border border-[#766754]/35 rounded-[32px] p-8 md:p-10 flex flex-col justify-between aspect-[4/5] text-left shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div>
              <span className="text-[#766754] text-[10px] font-bold tracking-[0.2em] uppercase">EFFICIENCY</span>
              <h4 className="text-[#2c2324] font-bold text-lg md:text-xl uppercase mt-4 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                Streamlined Planning
              </h4>
            </div>
            <div>
              <div className="text-[#2c2324] font-extrabold text-5xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                3.5x
              </div>
              <p className="text-[#766754] text-xs mt-4 font-light leading-relaxed">
                Faster event coordination and approval times for student clubs and administrators.
              </p>
            </div>
          </div>

          {/* Card 3 (Gold Black) */}
          <div className="bg-[#2c2324] rounded-[32px] p-8 md:p-10 flex flex-col justify-between aspect-[4/5] text-left shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div>
              <span className="text-[#FFFDE1]/75 text-[10px] font-bold tracking-[0.2em] uppercase">INCLUSION</span>
              <h4 className="text-[#FFFDE1] font-bold text-lg md:text-xl uppercase mt-4 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                Diverse Campus Life
              </h4>
            </div>
            <div>
              <div className="text-[#FFFDE1] font-extrabold text-5xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                100%
              </div>
              <p className="text-[#FFFDE1]/80 text-xs mt-4 font-light leading-relaxed">
                All events, sports, organizations, and career opportunities aggregated in one centralized digital hub.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

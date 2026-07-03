'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function AboutEvidaSection() {
  return (
    <section id="about-evida" className="relative w-full bg-[#DFDED7] py-24 overflow-hidden border-b border-black/[0.04] font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 1. Header Row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[#7B8290] text-xs font-bold tracking-[0.25em] uppercase block mb-3">ABOUT US</span>
            <h2 className="text-[#191919] font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              CAMPUS LIFE<br />BUILDERS
            </h2>
          </div>
          <div className="flex items-center">
            <EvidaLogo size={36} showText={true} lightMode={true} />
          </div>
        </div>

        {/* 2. Wide Landscape Image Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[16/7] md:aspect-[24/9] rounded-[24px] overflow-hidden shadow-[var(--shadow-premium-md)] mb-16 border border-black/5"
        >
          <Image 
            src="/pexels-hanna-elesha-abraham-1587801282-27498756.jpg" 
            alt="Campus Life Builders" 
            fill 
            className="object-cover hover:scale-102 transition-transform duration-700" 
            priority
          />
        </motion.div>

        {/* 3. Editorial Two-Column Text Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-start text-left">
          <div className="md:col-span-3">
            <span className="text-[#7B8290] text-xs font-bold tracking-[0.25em] uppercase block pt-2">
              OUR STORY
            </span>
          </div>
          <div className="md:col-span-9">
            <p className="text-[#191919] font-extrabold text-xl md:text-3xl lg:text-4xl leading-tight tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Evida was founded to give every campus a vibrant digital hub where students connect, discover events, and build community. <span className="text-[#4F5666] font-normal lowercase normal-case">Our platform turns ideas into experiences, making campus life lively, inclusive, and unforgettable.</span>
            </p>
          </div>
        </div>
      </div>
        {/* Smartphone Mockup Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-12 w-[280px] h-[560px] rounded-3xl border-4 border-black bg-white overflow-hidden shadow-lg"
        >
          <iframe
            src="/explore"
            className="w-full h-full"
            style={{ animation: 'scroll 10s linear infinite alternate' }}
          ></iframe>
        </motion.div>
      </section>

      {/* Inline CSS for iframe scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-30%); }
        }
      `}</style>
  );
}

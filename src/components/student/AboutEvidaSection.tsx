'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function AboutEvidaSection() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /* Interactive 3D tilt on mouse move — Posh-inspired */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 }); // max ±8°
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="about-evida" className="relative w-full bg-[#DFDED7] py-24 overflow-hidden border-b border-black/[0.04] font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* 1. Header Row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[#4B5563] text-xs font-bold tracking-[0.25em] uppercase block mb-3">ABOUT US</span>
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

        {/* 3. "Why Evida Exists?" — Two-Column Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-start text-left">
          <div className="md:col-span-3">
            <span className="text-[#4B5563] text-xs font-bold tracking-[0.25em] uppercase block pt-2">
              WHY EVIDA EXISTS?
            </span>
          </div>
          <div className="md:col-span-9">
            <p className="text-[#191919] font-extrabold text-xl md:text-3xl lg:text-4xl leading-tight tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Evida is the digital home of campus life.{' '}
              <span className="text-[#374151] font-normal lowercase normal-case">
                Discover events, organizations, and opportunities in one place. Built for students and institutions, Evida makes it easier to explore, connect, and create unforgettable experiences.
              </span>
            </p>
          </div>
        </div>

        {/* 4. Interactive Smartphone Mockup — Posh-inspired */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Caption above phone */}
          <p className="text-[#4B5563] text-xs font-bold tracking-[0.25em] uppercase mb-8 text-center">
            SEE THE EXPERIENCE
          </p>

          {/* Phone wrapper with interactive tilt */}
          <div
            ref={phoneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
            style={{
              perspective: '1200px',
            }}
          >
            <div
              className="phone-device relative mx-auto"
              style={{
                width: '300px',
                height: '620px',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Phone frame */}
              <div
                className="absolute inset-0 rounded-[44px] pointer-events-none z-20"
                style={{
                  boxShadow: `
                    0 0 0 2px #1a1a1a,
                    0 0 0 5px #0d0d0d,
                    0 0 0 7px #1a1a1a,
                    0 20px 60px rgba(0,0,0,0.35),
                    0 8px 24px rgba(0,0,0,0.2)
                  `,
                  background: 'linear-gradient(145deg, #2a2a2a 0%, #111 100%)',
                }}
              />

              {/* Notch / Dynamic Island */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30 w-[90px] h-[28px] bg-black rounded-full" />

              {/* Screen — iframe showing real Explore page */}
              <div className="absolute inset-[7px] rounded-[38px] overflow-hidden z-10 bg-white">
                <iframe
                  src="/student/events"
                  title="Evida Explore Page"
                  className="w-full h-full border-0 pointer-events-none"
                  style={{
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                  }}
                  scrolling="no"
                />
              </div>

              {/* Glass reflection overlay */}
              <div
                className="absolute inset-[7px] rounded-[38px] z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)',
                }}
              />
            </div>
          </div>

          {/* Tagline below phone */}
          <p className="mt-10 text-[#191919] text-sm md:text-base font-medium text-center max-w-md">
            See what&apos;s happening on campus and who&apos;s going — all in one scroll.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

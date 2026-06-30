'use client';

import React from 'react';
import { 
  GraduationCap, 
  Shield, 
  Compass, 
  Users, 
  Globe, 
  Trophy 
} from 'lucide-react';
import { motion } from 'framer-motion';

type VisionKey = 'Students' | 'Schools' | 'Discovery' | 'Connection' | 'Community' | 'Memories';

interface VisionContent {
  tagline: string;
  description: string;
  color: string;      // Brand color hex
  lightBg: string;    // Brand color light bg
  borderHover: string;// Border color on hover
}

const visionData: Record<VisionKey, VisionContent> = {
  Students: {
    tagline: "Your campus, all in one place",
    description: "Evida gives every student a simple way to discover what’s happening on campus, stay informed, and never miss opportunities that matter.",
    color: "#E8FF40",
    lightBg: "bg-[#E8FF40]/8",
    borderHover: "group-hover:border-[#E8FF40]/20"
  },
  Schools: {
    tagline: "A smarter way to engage your campus",
    description: "Evida helps schools centralize events, improve communication, and better connect with students through one trusted platform.",
    color: "#203627",
    lightBg: "bg-black/5",
    borderHover: "group-hover:border-black/10"
  },
  Discovery: {
    tagline: "Find experiences, not just events",
    description: "From career fairs to game nights, Evida makes it easy to explore opportunities based on your interests and campus life.",
    color: "#E8FF40",
    lightBg: "bg-[#E8FF40]/8",
    borderHover: "group-hover:border-[#E8FF40]/20"
  },
  Connection: {
    tagline: "Meaningful connections start here",
    description: "Every event is a chance to meet new people, join organizations, and build relationships that last beyond college.",
    color: "#203627",
    lightBg: "bg-black/5",
    borderHover: "group-hover:border-black/10"
  },
  Community: {
    tagline: "One campus. One community",
    description: "Evida brings students, organizations, and schools together in one connected ecosystem where everyone belongs.",
    color: "#E8FF40",
    lightBg: "bg-[#E8FF40]/8",
    borderHover: "group-hover:border-[#E8FF40]/20"
  },
  Memories: {
    tagline: "College ends. Memories don’t",
    description: "The best moments deserve to be remembered. Evida helps preserve the experiences, friendships, and milestones of your journey.",
    color: "#E8FF40",
    lightBg: "bg-[#E8FF40]/8",
    borderHover: "group-hover:border-[#E8FF40]/20"
  }
};

const visionKeys: VisionKey[] = ['Students', 'Schools', 'Discovery', 'Connection', 'Community', 'Memories'];

const pillarIcons: Record<VisionKey, React.ComponentType<any>> = {
  Students: GraduationCap,
  Schools: Shield,
  Discovery: Compass,
  Connection: Users,
  Community: Globe,
  Memories: Trophy
};

export default function OurVisionSection() {
  return (
    <section id="our-mission" className="w-full bg-[#EFEFEF] py-24 border-y border-black/[0.04] font-sans relative overflow-hidden">
      {/* Subtle Background Radial Glows */}
      <div className="absolute -left-[10%] top-1/4 w-[45%] h-[55%] bg-[#E8FF40]/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-[10%] bottom-1/4 w-[45%] h-[55%] bg-black/[0.01] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[#E8FF40] font-bold uppercase text-xs tracking-[0.2em]">
            Why Choose Evida?
          </span>
          <h2 className="text-[#203627] font-extrabold text-3xl md:text-5xl uppercase tracking-tight max-w-5xl mx-auto leading-[1.08]" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="block sm:whitespace-nowrap">More Than a Platform,</span>
            <span className="block sm:whitespace-nowrap">The Future of Campus Life</span>
            <span className="block sm:whitespace-nowrap text-[#E8FF40]">Is Here</span>
          </h2>
        </div>

        {/* 3x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visionKeys.map((item) => {
            const Icon = pillarIcons[item];
            const data = visionData[item];
            
            return (
              <motion.div
                key={item}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`group bg-white border border-black/[0.04] rounded-[24px] p-8 flex flex-col items-center text-center space-y-4 shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300 ${data.borderHover}`}
              >
                {/* Icon Wrapper */}
                <div className={`p-4 ${data.lightBg} rounded-2xl border border-transparent transition-colors duration-300`} style={{ color: data.color }}>
                  <Icon className="h-7 w-7 stroke-[1.5]" />
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h3 className="text-[#203627] font-extrabold text-lg md:text-xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                    {item}
                  </h3>
                  <p className="font-bold text-[10px] uppercase tracking-wider text-[#203627]">
                    {data.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[#4F5666] text-xs sm:text-sm leading-relaxed font-light pt-1">
                  {data.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

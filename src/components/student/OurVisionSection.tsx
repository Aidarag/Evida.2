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

type VisionKey = 'Students' | 'Schools' | 'Discovery' | 'Connection' | 'Community' | 'Memories';

interface VisionContent {
  tagline: string;
  description: string;
}

const visionData: Record<VisionKey, VisionContent> = {
  Students: {
    tagline: "Your campus, all in one place",
    description: "Evida gives every student a simple way to discover what’s happening on campus, stay informed, and never miss opportunities that matter."
  },
  Schools: {
    tagline: "A smarter way to engage your campus",
    description: "Evida helps schools centralize events, improve communication, and better connect with students through one trusted platform."
  },
  Discovery: {
    tagline: "Find experiences, not just events",
    description: "From career fairs to game nights, Evida makes it easy to explore opportunities based on your interests and campus life."
  },
  Connection: {
    tagline: "Meaningful connections start here",
    description: "Every event is a chance to meet new people, join organizations, and build relationships that last beyond college."
  },
  Community: {
    tagline: "One campus. One community",
    description: "Evida brings students, organizations, and schools together in one connected ecosystem where everyone belongs."
  },
  Memories: {
    tagline: "College ends. Memories don’t",
    description: "The best moments deserve to be remembered. Evida helps preserve the experiences, friendships, and milestones of your journey."
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
    <section id="our-mission" className="w-full bg-slate-50 py-24 border-y border-slate-100 font-sans relative overflow-hidden">
      {/* Subtle Background Radial Glow (like in the screenshot) */}
      <div className="absolute -left-[10%] top-1/4 w-[40%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-[10%] bottom-1/4 w-[40%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[#2563EB] font-bold uppercase text-xs tracking-[0.2em]">
            Why Choose Evida?
          </span>
          <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-tight max-w-4xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-[#2563EB]">More Than</span> a Platform, The Future of <br className="hidden md:inline" />
            Campus Life <span className="text-[#2563EB]">is Here</span>
          </h2>
        </div>

        {/* 3x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visionKeys.map((item) => {
            const Icon = pillarIcons[item];
            
            return (
              <div
                key={item}
                className="bg-white border border-slate-100 rounded-[32px] p-8 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                {/* Icon */}
                <div className="text-[#2563EB] p-3.5 bg-blue-50/50 rounded-2xl border border-blue-50">
                  <Icon className="h-8 w-8 stroke-[1.5]" />
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h3 className="text-slate-900 font-extrabold text-lg md:text-xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                    {item}
                  </h3>
                  <p className="text-[#2563EB] font-bold text-[11px] uppercase tracking-wider">
                    {visionData[item].tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed font-light pt-2">
                  {visionData[item].description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

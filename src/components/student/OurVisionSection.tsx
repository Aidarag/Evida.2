'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
import { 
  GraduationCap, 
  Shield, 
  Compass, 
  Users, 
  Globe, 
  Trophy, 
  ArrowRight,
  ArrowUpRight 
} from 'lucide-react';

type VisionKey = 'Students' | 'Schools' | 'Discovery' | 'Connection' | 'Community' | 'Memories';

interface VisionContent {
  tagline: string;
  description: string;
}

const visionData: Record<VisionKey, VisionContent> = {
  Students: {
    tagline: "Your campus, all in one place.",
    description: "Evida gives every student a simple way to discover what’s happening on campus, stay informed, and never miss opportunities that matter."
  },
  Schools: {
    tagline: "A smarter way to engage your campus.",
    description: "Evida helps schools centralize events, improve communication, and better connect with students through one trusted platform."
  },
  Discovery: {
    tagline: "Find experiences, not just events.",
    description: "From career fairs to game nights, Evida makes it easy to explore opportunities based on your interests and campus life."
  },
  Connection: {
    tagline: "Meaningful connections start with shared experiences.",
    description: "Every event is a chance to meet new people, join organizations, and build relationships that last beyond college."
  },
  Community: {
    tagline: "One campus. One community.",
    description: "Evida brings students, organizations, and schools together in one connected ecosystem where everyone belongs."
  },
  Memories: {
    tagline: "College ends. Memories don’t.",
    description: "The best moments deserve to be remembered. Evida helps preserve the experiences, friendships, and milestones that define your college journey."
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
const pillarColors: Record<VisionKey, { text: string; border: string; bg: string; hoverBg: string }> = {
  Students: {
    text: 'text-[#2563EB]',
    border: 'border-[#2563EB]/30',
    bg: 'bg-[#2563EB]/5',
    hoverBg: 'hover:bg-[#2563EB]'
  },
  Schools: {
    text: 'text-slate-900',
    border: 'border-slate-300',
    bg: 'bg-slate-50',
    hoverBg: 'hover:bg-slate-900'
  },
  Discovery: {
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-600'
  },
  Connection: {
    text: 'text-[#2563EB]',
    border: 'border-[#2563EB]/30',
    bg: 'bg-[#2563EB]/5',
    hoverBg: 'hover:bg-[#2563EB]'
  },
  Community: {
    text: 'text-slate-900',
    border: 'border-slate-300',
    bg: 'bg-slate-50',
    hoverBg: 'hover:bg-slate-900'
  },
  Memories: {
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-600'
  }
};

const getLinkUrl = (item: VisionKey) => {
  switch (item) {
    case 'Students':
    case 'Schools':
      return '/login';
    case 'Discovery':
      return '/#explore-categories';
    case 'Connection':
      return '/#calendar';
    case 'Community':
      return '/student/dashboard';
    case 'Memories':
      return '/#faq';
  }
};

export default function OurVisionSection() {
  const [activeItem, setActiveItem] = useState<VisionKey>('Students');
  const [exitingItem, setExitingItem] = useState<VisionKey | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');

  const handleMenuHover = (item: VisionKey) => {
    if (item === activeItem || exitingItem) return;
    setExitingItem(activeItem);
    setExitDirection(visionKeys.indexOf(item) > visionKeys.indexOf(activeItem) ? 'left' : 'right');
    setActiveItem(item);
    setTimeout(() => {
      setExitingItem(null);
    }, 400);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (exitingItem) return;
    setExitingItem(activeItem);
    setExitDirection(direction);
    
    const currentIndex = visionKeys.indexOf(activeItem);
    const nextIndex = direction === 'right'
      ? (currentIndex + 1) % visionKeys.length
      : (currentIndex - 1 + visionKeys.length) % visionKeys.length;
      
    setActiveItem(visionKeys[nextIndex]);
    
    setTimeout(() => {
      setExitingItem(null);
    }, 400);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const getDepth = (item: VisionKey) => {
    if (item === exitingItem) return -1;
    const activeIndex = visionKeys.indexOf(activeItem);
    const itemIndex = visionKeys.indexOf(item);
    return (itemIndex - activeIndex + visionKeys.length) % visionKeys.length;
  };

  const sortedKeys = [...visionKeys].sort((a, b) => {
    const depthA = getDepth(a);
    const depthB = getDepth(b);
    return depthB - depthA; // deeper cards rendered first (in background)
  });

  return (
    <section id="our-mission" className="w-full bg-white py-20 md:py-24 border-y border-gray-100 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-gray-900 font-extrabold text-3xl md:text-4xl tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            OUR VISION
          </h2>
          <div className="w-12 h-1 bg-[#2563EB] mx-auto" />
        </div>

        {/* Mobile/Tablet Menu (Horizontal Tabs) - Top positioned for better UX */}
        <div className="lg:hidden w-full mb-8">
          <div className="flex overflow-x-auto gap-5 pb-3 no-scrollbar border-b border-gray-200 scroll-smooth -mx-6 px-6">
            {visionKeys.map((item) => {
              const isActive = activeItem === item;
              return (
                <button
                  key={item}
                  onClick={() => handleMenuHover(item)}
                  className={`flex-shrink-0 pb-2 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-black border-black' 
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Card Stack and Paragraphs */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Card Stack Area */}
            <div className="flex flex-col items-center justify-center h-[360px] sm:h-[410px] relative">
              {/* Tape Decorator at the top of the stack */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-7 bg-yellow-200/20 border border-yellow-300/10 backdrop-blur-[1px] rotate-[-2deg] shadow-sm z-30 pointer-events-none" />

              <div className="relative w-[295px] h-[355px] sm:w-[320px] sm:h-[380px] select-none">
                {sortedKeys.map((item) => {
                  const isExiting = item === exitingItem;
                  const depth = getDepth(item);
                  const Icon = pillarIcons[item];
                  const colors = pillarColors[item];
                  const linkUrl = getLinkUrl(item);
                  const isTop = depth === 0 && !isExiting;

                  return (
                    <motion.div
                      key={item}
                      className="absolute inset-0 bg-white border-2 border-slate-900 p-5 sm:p-6 flex flex-col justify-between shadow-[6px_6px_0px_rgba(15,23,42,1)] rounded-2xl cursor-grab active:cursor-grabbing"
                      style={{
                        backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
                        backgroundSize: '16px 16px',
                        transformOrigin: 'bottom center',
                      }}
                      drag={isTop ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        if (isTop) {
                          handleSwipe('right');
                        }
                      }}
                      whileHover={isTop ? { scale: 1.02, y: -4, rotate: 0.5 } : {}}
                      animate={
                        isExiting
                          ? {
                              x: exitDirection === 'right' ? 360 : -360,
                              y: 15,
                              rotate: exitDirection === 'right' ? 20 : -20,
                              opacity: 0,
                              scale: 0.95,
                              zIndex: 25,
                            }
                          : {
                              x: depth * 8,
                              y: depth * 8,
                              rotate: depth === 0 ? 0 : (visionKeys.indexOf(item) % 2 === 0 ? 2.5 : -2.5) * depth,
                              scale: 1 - depth * 0.04,
                              opacity: depth > 2 ? 0 : 1 - depth * 0.15,
                              zIndex: 20 - depth,
                            }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {/* Top Row: Badge & Icon */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 border border-slate-900 rounded-full ${colors.bg} ${colors.text}`}>
                          Pillar 0{visionKeys.indexOf(item) + 1}
                        </span>
                        <div className={`p-2 border border-slate-900 rounded-xl ${colors.bg} ${colors.text}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Middle: Title, Tagline & Description */}
                      <div className="my-auto text-left space-y-2.5">
                        <h3 
                          className={`text-black font-extrabold tracking-[-0.06em] leading-none uppercase ${
                            item === 'Connection'
                              ? 'text-[18px] xs:text-[20px] sm:text-2xl md:text-[26px]'
                              : item === 'Community'
                              ? 'text-[19px] xs:text-[21px] sm:text-[23px] md:text-[28px]'
                              : item === 'Discovery'
                              ? 'text-[20px] xs:text-[22px] sm:text-[24px] md:text-[29px]'
                              : 'text-[24px] sm:text-[28px] md:text-3xl'
                          }`}
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {item}
                        </h3>
                        <p className="text-gray-900 text-xs sm:text-sm font-extrabold leading-tight tracking-tight">
                          {visionData[item].tagline}
                        </p>
                        <p className="text-gray-600 text-[10.5px] sm:text-xs font-medium leading-relaxed">
                          {visionData[item].description}
                        </p>
                      </div>

                      {/* Bottom Row: Barcode & Link */}
                      <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100">
                        {/* Barcode SVG - hidden on mobile/tablet to make space for Next button */}
                        <svg className="h-6 w-20 text-gray-300 hidden md:block" viewBox="0 0 100 20" fill="currentColor">
                          <rect x="0" width="3" height="20" />
                          <rect x="5" width="1" height="20" />
                          <rect x="8" width="2" height="20" />
                          <rect x="12" width="4" height="20" />
                          <rect x="18" width="1" height="20" />
                          <rect x="21" width="3" height="20" />
                          <rect x="26" width="2" height="20" />
                          <rect x="30" width="1" height="20" />
                          <rect x="33" width="4" height="20" />
                          <rect x="39" width="2" height="20" />
                          <rect x="43" width="1" height="20" />
                          <rect x="46" width="3" height="20" />
                          <rect x="51" width="2" height="20" />
                          <rect x="55" width="4" height="20" />
                          <rect x="61" width="1" height="20" />
                          <rect x="64" width="2" height="20" />
                          <rect x="68" width="3" height="20" />
                          <rect x="73" width="1" height="20" />
                          <rect x="76" width="4" height="20" />
                          <rect x="82" width="2" height="20" />
                          <rect x="86" width="1" height="20" />
                          <rect x="89" width="3" height="20" />
                        </svg>

                        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                          {isTop && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwipe('right');
                              }}
                              className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-transparent transition-colors rounded-full shadow-sm cursor-pointer shrink-0"
                            >
                              Next <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                          
                          <Link 
                            href={linkUrl}
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 border border-transparent bg-[#2563EB] text-white hover:bg-blue-700 transition-colors rounded-full shadow-sm cursor-pointer shrink-0 ${!isTop ? 'ml-auto' : ''}`}
                          >
                            Open <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Interactive Hint */}
              <div className="text-center mt-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest pointer-events-none">
                Click Card to Shuffle • Drag to Swipe
              </div>
            </div>

            {/* Paragraphs under the Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mt-8 md:mt-12 text-left border-t border-gray-100 pt-8 items-start">
              {/* Left Column: Tagline */}
              <div className="md:col-span-5 space-y-3">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">// Core Promise</span>
                <motion.h4 
                  key={`${activeItem}-tagline`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-black font-extrabold text-xl sm:text-2xl uppercase tracking-tight leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {visionData[activeItem].tagline}
                </motion.h4>
              </div>

              {/* Right Column: Description */}
              <div className="md:col-span-7 space-y-3">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">// Actionable Vision</span>
                <motion.p 
                  key={`${activeItem}-description`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-gray-600 text-sm sm:text-base leading-relaxed font-light min-h-[60px]"
                >
                  {visionData[activeItem].description}
                </motion.p>
              </div>
            </div>

            {/* Premium Interactive CTA Buttons */}
            <div className="mt-8 flex justify-start min-h-[50px]">
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activeItem === 'Students' && (
                  <Link href="/login" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    Get Started as Student <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {activeItem === 'Schools' && (
                  <Link href="/login" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    Partner with Evida <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {activeItem === 'Discovery' && (
                  <Link href="/#explore-categories" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    Explore Event Discovery <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {activeItem === 'Connection' && (
                  <Link href="/#calendar" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    View Campus Calendar <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {activeItem === 'Community' && (
                  <Link href="/student/dashboard" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    Join Student Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {activeItem === 'Memories' && (
                  <Link href="/#faq" className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 hover:bg-[#2563EB] transition-colors rounded-full shadow-lg hover:shadow-blue-500/10">
                    Read FAQ & Guidelines <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </motion.div>
            </div>

          </div>

          {/* Right Column: Desktop Menu (Hidden on mobile/tablet) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col text-left">
            <div className="border-t border-gray-900 w-full mb-4 opacity-10" />
            <ul className="flex flex-col w-full">
              {visionKeys.map((item) => {
                const isActive = activeItem === item;
                const colors = pillarColors[item];
                return (
                  <li key={item} className="w-full relative group">
                    <button
                      onClick={() => handleMenuHover(item)}
                      onMouseEnter={() => handleMenuHover(item)}
                      className={`w-full py-4 text-left font-bold uppercase text-xl md:text-2xl transition-all duration-300 flex justify-between items-center tracking-wider cursor-pointer ${
                        isActive ? 'text-black' : 'text-gray-300 hover:text-gray-600'
                      }`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <span>{item}</span>
                      {isActive && (
                        <motion.span 
                          layoutId="activePillarIndicator"
                          className={`w-2.5 h-2.5 rounded-full inline-block ${colors.text.replace('text-', 'bg-')}`}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </button>
                    <div className={`h-[1px] w-full transition-colors duration-300 ${
                      isActive ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}

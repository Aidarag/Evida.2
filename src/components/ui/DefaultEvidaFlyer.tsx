'use client';

import React from 'react';
import { Sparkles, Tag } from 'lucide-react';

interface DefaultEvidaFlyerProps {
  category: string;
  title: string;
  className?: string;
}

export default function DefaultEvidaFlyer({ category, title, className = '' }: DefaultEvidaFlyerProps) {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-[#1E1B18] via-[#2A2621] to-[#11100F] relative overflow-hidden flex flex-col justify-between p-3.5 select-none border-b border-white/10 ${className}`}>
      {/* Background glowing shapes */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FD5C05]/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
      
      {/* Evida Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] font-black text-5xl text-white tracking-[0.25em] pointer-events-none select-none">
        EVIDA
      </div>

      {/* Top Header Badge */}
      <div className="flex items-center justify-between z-10">
        <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-[#FD5C05] bg-[#FD5C05]/15 px-2 py-0.5 rounded-full border border-[#FD5C05]/30 backdrop-blur-md">
          <Sparkles className="h-2.5 w-2.5" /> Evida Verified
        </span>
        <span className="text-[7.5px] font-mono font-bold text-white/40 uppercase tracking-widest">
          #OFFICIAL
        </span>
      </div>

      {/* Center Title & Category */}
      <div className="z-10 my-auto text-left space-y-1 py-1">
        <span className="text-[8.5px] font-black uppercase tracking-wider text-[#FD5C05] flex items-center gap-1">
          <Tag className="h-2.5 w-2.5 text-[#FD5C05]" /> {category}
        </span>
        <p className="font-extrabold text-xs sm:text-sm text-white leading-snug line-clamp-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </p>
      </div>

      {/* Bottom Brand Bar */}
      <div className="z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[7.5px] font-bold text-white/40">
        <span className="uppercase tracking-widest">Campus Promo</span>
        <span className="font-mono text-[#FD5C05] font-black tracking-wider">EVIDA.APP</span>
      </div>
    </div>
  );
}

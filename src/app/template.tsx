'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import EvidaLogo from '@/components/ui/EvidaLogo';

const LOADING_STEPS = [
  'Initializing Campus Portal...',
  'Syncing Student Experiences...',
  'Connecting Organizations...',
  'Preparing Your Dashboard...'
];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'true') {
        setShowSplash(false);
        return;
      }

      const initialSplashDone = sessionStorage.getItem('evida_initial_splash_done');
      const forceRedirectSplash = sessionStorage.getItem('evida_force_redirect_splash');

      if (!initialSplashDone) {
        setShowSplash(true);
        sessionStorage.setItem('evida_initial_splash_done', 'true');
      } else if (forceRedirectSplash === 'true') {
        setShowSplash(true);
        sessionStorage.removeItem('evida_force_redirect_splash');
      } else {
        setShowSplash(false);
      }
    }
  }, [pathname]);

  // Handle simulated progress animation for preloader
  useEffect(() => {
    if (!showSplash) return;
    setProgress(0);

    const duration = 500; // Simulated load duration in ms
    const intervalTime = 16;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowSplash(false);
          }, 180);
          return 100;
        }
        return Math.min(100, p + increment);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [showSplash]);

  const stepIndex = Math.min(
    LOADING_STEPS.length - 1,
    Math.floor((progress / 100) * LOADING_STEPS.length)
  );

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#FAF9F5]">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-[#FAF9F5] select-none overflow-hidden"
          >
            {/* Ambient Background Radial Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FD5C05]/[0.06] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FB1C07]/[0.04] rounded-full blur-[80px] pointer-events-none" />

            {/* Concentric Animated Pulse Rings */}
            <motion.div
              animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-72 h-72 border border-[#FD5C05]/20 rounded-full pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 border border-[#2A2621]/10 rounded-full pointer-events-none"
            />

            {/* Center Assembly */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* Logo Card Container with Soft Glass Shadow */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 sm:p-8 rounded-[32px] bg-white/90 backdrop-blur-xl border border-black/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.04)] flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <EvidaLogo size={52} lightMode={false} />
                </motion.div>
              </motion.div>

              {/* Progress & Status Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center gap-4 text-center max-w-xs"
              >
                {/* Dual-Track Progress Bar */}
                <div className="w-56 sm:w-64 h-2 bg-[#2A2621]/[0.08] rounded-full p-0.5 relative overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] rounded-full transition-all duration-100 ease-out shadow-xs"
                    style={{ width: `${Math.round(progress)}%` }}
                  />
                </div>

                {/* Status Indicator Pill */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-black/[0.06] shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD5C05] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FD5C05]"></span>
                  </span>
                  <span className="text-[11px] font-bold text-[#2A2621] font-sans tracking-tight">
                    {LOADING_STEPS[stepIndex]}
                  </span>
                  <span className="text-[10px] font-black text-[#FD5C05] font-mono ml-1">
                    {Math.round(progress)}%
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Footer Attribution */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.25 }}
              className="absolute bottom-8 text-[10.5px] font-extrabold uppercase tracking-widest text-[#5A554E] flex items-center gap-2"
            >
              <span>Livingstone College</span>
              <span>•</span>
              <span>Campus Experience Platform</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8, scale: 0.998 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 28,
              mass: 0.8,
            }}
            className="w-full min-h-screen flex flex-col"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

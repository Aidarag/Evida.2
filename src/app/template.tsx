'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

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

  // Handle simulated progress animation for the preloader
  useEffect(() => {
    if (!showSplash) return;
    setProgress(0);

    const duration = 800; // Simulated load duration in ms
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowSplash(false);
          }, 150); // Small pause at 100% for visual weight
          return 100;
        }
        return Math.min(100, p + increment);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [showSplash]);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#D8D2BC]">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-[#D8D2BC]"
          >
            {/* Ambient Brand Glowing Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FD5C05]/4 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center gap-6 z-10">
              {/* Custom SVG Logo Assembly */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 220 48"
                width={220}
                height={54}
                className="select-none"
              >
                <g id="evida-logo-mark">
                  <path
                    d="M 6 42 L 6 22 L 24 6 L 24 15 L 15 24 L 15 42 Z"
                    fill="#FD5C05"
                  />
                  <path
                    d="M 42 42 L 42 22 L 24 6 L 24 15 L 33 24 L 33 42 Z"
                    fill="#FD5C05"
                  />
                  <path
                    d="M 24 10 L 36 22 L 24 34 L 12 22 Z M 24 16 L 30 22 L 24 28 L 18 22 Z"
                    fill="#2A2621"
                  />
                </g>
                <text
                  x="56"
                  y="33"
                  fill="#FD5C05"
                  fontFamily="var(--font-display), Inter, sans-serif"
                  fontWeight="900"
                  fontSize="28"
                  letterSpacing="0.02em"
                >
                  Evida
                </text>
              </svg>

              {/* Progress Loading Bar */}
              <div className="flex flex-col items-center gap-3.5 mt-2">
                <div className="w-48 h-[3px] bg-[#2A2621]/15 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-[#FD5C05] transition-all duration-75 ease-out rounded-full" 
                    style={{ width: `${Math.round(progress)}%` }} 
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5A554E] min-w-[32px] text-center font-sans">
                  Loading {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 26,
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

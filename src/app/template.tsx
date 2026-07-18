'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(false);

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
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 1800);
        return () => clearTimeout(timer);
      } else if (forceRedirectSplash === 'true') {
        setShowSplash(true);
        sessionStorage.removeItem('evida_force_redirect_splash');
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 1800);
        return () => clearTimeout(timer);
      } else {
        setShowSplash(false);
      }
    }
  }, [pathname]);

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

            <div className="flex flex-col items-center gap-4 z-10">
              {/* Custom SVG Logo Assembly */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 220 48"
                width={260}
                height={64}
                className="select-none"
              >
                <g id="evida-logo-mark">
                  {/* Left Ribbon: slides from the left and snaps into place */}
                  <motion.path
                    d="M 6 42 L 6 22 L 24 6 L 24 15 L 15 24 L 15 42 Z"
                    fill="#FD5C05"
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.95 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 140, 
                      damping: 12, 
                      delay: 0.1 
                    }}
                  />
                  
                  {/* Right Ribbon: slides from the right and snaps into place */}
                  <motion.path
                    d="M 42 42 L 42 22 L 24 6 L 24 15 L 33 24 L 33 42 Z"
                    fill="#FD5C05"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.95 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 140, 
                      damping: 12, 
                      delay: 0.3 
                    }}
                  />
                  
                  {/* Center Diamond: scales and pops in after ribbons meet */}
                  <motion.path
                    d="M 24 10 L 36 22 L 24 34 L 12 22 Z M 24 16 L 30 22 L 24 28 L 18 22 Z"
                    fill="#2A2621"
                    initial={{ scale: 0, opacity: 0, originX: 0.5, originY: 0.5 }}
                    animate={{ scale: 1, opacity: 0.95 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 180, 
                      damping: 10, 
                      delay: 0.5 
                    }}
                  />
                </g>
                
                {/* Evida Text: starts in Orange font, drops/bounces in from the top/y-axis */}
                <motion.text
                  x="56"
                  y="33"
                  fill="#FD5C05"
                  fontFamily="var(--font-display), Inter, sans-serif"
                  fontWeight="900"
                  fontSize="28"
                  letterSpacing="0.02em"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 33, opacity: 1 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 280, 
                    damping: 10, // low damping for organic bouncing effect
                    delay: 0.65 
                  }}
                >
                  Evida
                </motion.text>
              </svg>

              {/* High-speed circular spinner at bottom to support loading feel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.0 }}
                className="mt-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-4 h-4 border-2 border-[#FD5C05]/20 border-t-[#FD5C05] rounded-full"
                />
              </motion.div>
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

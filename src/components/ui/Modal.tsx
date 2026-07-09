'use client';

import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

export default function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-sm:p-0 max-sm:items-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-[#DFDED7] border border-black/5
              rounded-[24px] max-sm:rounded-t-[28px] max-sm:rounded-b-none
              shadow-[var(--shadow-premium-xl)]
              overflow-y-auto max-h-[85vh] max-sm:max-h-[92vh]
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04]">
                <h2 className="text-lg font-bold text-[#191919] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-[#374151]" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className={title ? '' : 'pt-0'}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

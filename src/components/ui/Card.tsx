'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className = '', onClick, hover = true, glass = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-[28px]
        ${glass
          ? 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]'
          : 'bg-[#171722] border border-white/[0.06]'
        }
        shadow-[0_8px_20px_rgba(0,0,0,0.45)]
        transition-shadow duration-300
        ${hover ? 'hover:shadow-[0_12px_30px_rgba(0,0,0,0.65)] hover:border-[#80B0EC]/20 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

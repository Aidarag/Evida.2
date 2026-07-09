'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neon' | 'accent' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#BDFB04] text-[#191919] font-bold shadow-[0_4px_14px_rgba(25, 25, 25, 0.1)] hover:bg-[#BDFB04]/90 border border-transparent',
  secondary:
    'bg-[#191919] text-white font-bold shadow-[0_4px_14px_rgba(25, 25, 25, 0.08)] hover:bg-[#2a2a2a] border border-transparent',
  accent:
    'bg-[#BDFB04] text-[#191919] font-bold shadow-[0_4px_14px_rgba(25, 25, 25, 0.1)] hover:bg-[#BDFB04]/90 border border-transparent',
  neon:
    'bg-[#BDFB04] text-[#191919] font-bold shadow-[0_4px_14px_rgba(25, 25, 25, 0.1)] hover:bg-[#BDFB04]/90 border border-transparent',
  ghost:
    'bg-transparent border border-[#191919]/20 hover:border-[#191919]/20 text-[#374151] hover:text-[#191919] hover:bg-[#191919]/[0.02] backdrop-blur-md',
  danger:
    'bg-red-600 text-white font-bold hover:bg-red-700 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-[11px] uppercase tracking-wider gap-1.5 min-h-[36px] max-md:min-h-11 max-md:text-[12px]',
  md: 'px-6 py-2.5 text-xs uppercase tracking-wider gap-2 min-h-[42px] max-md:min-h-11',
  lg: 'px-8 py-3.5 text-sm uppercase tracking-wider gap-2.5 min-h-[50px] max-md:min-h-12',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, fullWidth, className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center rounded-full cursor-pointer
          transition-all duration-200
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BDFB04]
          disabled:opacity-50 disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...(props as any)}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

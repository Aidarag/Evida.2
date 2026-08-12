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
    'bg-[#FD5C05] text-white font-extrabold shadow-[0_4px_14px_rgba(253,92,5,0.35)] hover:bg-[#CC3D00] border border-transparent',
  secondary:
    'bg-[#2A2621] text-white font-extrabold shadow-[0_4px_14px_rgba(42,38,33,0.15)] hover:bg-[#1a1816] border border-transparent',
  accent:
    'bg-[#FD5C05] text-white font-extrabold shadow-[0_4px_14px_rgba(253,92,5,0.35)] hover:bg-[#CC3D00] border border-transparent',
  neon:
    'bg-[#FD5C05] text-white font-extrabold shadow-[0_4px_14px_rgba(253,92,5,0.35)] hover:bg-[#CC3D00] border border-transparent',
  ghost:
    'bg-transparent border border-[#2A2621]/20 text-[#2A2621] hover:text-[#FD5C05] hover:bg-[#2A2621]/[0.04] backdrop-blur-md font-extrabold',
  danger:
    'bg-red-600 text-white font-extrabold hover:bg-red-700 border border-transparent shadow-sm',
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
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD5C05]
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

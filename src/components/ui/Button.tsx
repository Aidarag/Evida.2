'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neon' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#80B0EC] to-[#DAFB71] text-[#08080B] font-semibold shadow-[0_4px_16px_rgba(128,176,236,0.25)]',
  secondary:
    'bg-gradient-to-r from-[#EE3D5A] to-[#80B0EC] text-white font-semibold shadow-[0_4px_16px_rgba(238,61,90,0.2)]',
  neon:
    'bg-[#DAFB71] text-[#08080B] font-semibold shadow-[0_4px_16px_rgba(218,251,113,0.3)]',
  ghost:
    'bg-transparent border border-white/15 text-white backdrop-blur-md',
  danger:
    'bg-[#EE3D5A] text-white font-semibold',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, fullWidth, className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center rounded-full cursor-pointer
          transition-shadow duration-200
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80B0EC]
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

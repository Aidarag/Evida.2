'use client';

import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'info' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: 'bg-[#EE3D5A]/15 text-[#EE3D5A] border-[#EE3D5A]/20',
  approved: 'bg-[#DAFB71]/15 text-[#DAFB71] border-[#DAFB71]/20',
  rejected: 'bg-white/10 text-[#B8BBC8] border-white/10',
  info: 'bg-[#80B0EC]/15 text-[#80B0EC] border-[#80B0EC]/20',
  accent: 'bg-[#DAFB71]/15 text-[#DAFB71] border-[#DAFB71]/20',
};

export default function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-[11px] font-semibold uppercase tracking-wider
        border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

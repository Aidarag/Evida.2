'use client';

import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, active = false, onClick, className = '' }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full px-4 py-1.5
        text-xs font-medium transition-all duration-200 cursor-pointer
        ${active
          ? 'bg-[#80B0EC]/20 text-[#80B0EC] border border-[#80B0EC]/30'
          : 'bg-white/[0.06] text-[#B8BBC8] border border-transparent hover:bg-white/[0.1] hover:text-white'
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}

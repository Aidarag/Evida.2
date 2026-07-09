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
          ? 'bg-[#191919] text-white border border-transparent font-bold shadow-sm'
          : 'bg-black/[0.04] text-[#374151] border border-transparent hover:bg-black/[0.08] hover:text-[#191919]'
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}

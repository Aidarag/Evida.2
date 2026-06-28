'use client';

import React from 'react';

interface EvidaLogoProps {
  className?: string;
  size?: number; // Height of the logo in pixels (default: 40)
  showText?: boolean; // Whether to show the "Evida" text (default: true)
  lightMode?: boolean; // If true, text is dark (#111827) instead of white (default: false)
}

export default function EvidaLogo({
  className = '',
  size = 40,
  showText = true,
  lightMode = false,
}: EvidaLogoProps) {
  // Scale factor based on the default height of 48px
  const scale = size / 48;
  const width = showText ? 200 * scale : 48 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showText ? `0 0 200 48` : `0 0 48 48`}
      width={width}
      height={size}
      className={`select-none ${className}`}
    >
      <g id="evida-logo-mark">
        {/* Left Ribbon (Lime) */}
        <path
          d="M 6 42 L 6 22 L 24 6 L 24 15 L 15 24 L 15 42 Z"
          fill="#DAFB71"
          opacity="0.85"
        />
        
        {/* Right Ribbon (Blue) */}
        <path
          d="M 42 42 L 42 22 L 24 6 L 24 15 L 33 24 L 33 42 Z"
          fill="#80B0EC"
          opacity="0.85"
        />
        
        {/* Center Ribbon (Coral) */}
        <path
          d="M 24 10 L 36 22 L 24 34 L 12 22 Z M 24 16 L 30 22 L 24 28 L 18 22 Z"
          fill="#EE3D5A"
          opacity="0.9"
        />
      </g>
      
      {showText && (
        <text
          x="56"
          y="33"
          fill={lightMode ? '#111827' : '#FFFFFF'}
          fontFamily="var(--font-display), Syne, sans-serif"
          fontWeight="800"
          fontSize="26"
          letterSpacing="0.03em"
        >
          Evida
        </text>
      )}
    </svg>
  );
}

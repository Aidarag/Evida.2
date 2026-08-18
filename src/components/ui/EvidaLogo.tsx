'use client';

import React from 'react';

interface EvidaLogoProps {
  className?: string;
  size?: number; // Symbol height in pixels (default: 32)
  showText?: boolean; // Whether to show the "Evida" text (default: true)
  lightMode?: boolean; // If true, text is dark (#2A2621) instead of brand orange (#FD5C05) (default: false)
  text?: string; // Custom text to display next to the logo (default: "Evida")
}

export default function EvidaLogo({
  className = '',
  size = 32,
  showText = true,
  lightMode = false,
  text = 'Evida',
}: EvidaLogoProps) {
  const reactId = React.useId();
  const gradId = `evida-grad-${reactId.replace(/:/g, '')}`;

  // Proportions derived from standard specification (Symbol: 90px, Text: 60px, Gap: 20px, Optical Offset: 2.5px)
  const symbolSize = size;
  const fontSize = Math.max(16, Math.round((size * 60) / 90));
  const gap = Math.max(6, Math.round((size * 20) / 90));
  const textOffsetY = Math.max(1, Math.round((size * 2.5) / 90 * 10) / 10);
  
  // Letter spacing: -1.5px for 60px text, -0.5px for 22px text
  const letterSpacing = text === 'Evida' ? `-${(fontSize * 1.5 / 60).toFixed(1)}px` : '-0.02em';

  // Dark text color matches exact dark brown/black of the diamond symbol (#2A2621)
  const textColor = lightMode ? '#2A2621' : '#FD5C05';

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {/* ── Symbol Icon (House Ribbon + Dark Diamond) ── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width={symbolSize}
        height={symbolSize}
        className="shrink-0 overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB1C07" />
            <stop offset="35%" stopColor="#FD4002" />
            <stop offset="70%" stopColor="#FD5C05" />
            <stop offset="100%" stopColor="#FC7C0B" />
          </linearGradient>
        </defs>
        
        <g id="evida-symbol-mark">
          {/* Left Ribbon (Tangelo Gradient) */}
          <path
            d="M 6 42 L 6 22 L 24 6 L 24 15 L 15 24 L 15 42 Z"
            fill={`url(#${gradId})`}
          />
          
          {/* Right Ribbon (Tangelo Gradient) */}
          <path
            d="M 42 42 L 42 22 L 24 6 L 24 15 L 33 24 L 33 42 Z"
            fill={`url(#${gradId})`}
          />
          
          {/* Center Diamond (Brand Dark #2A2621 - matching dark text color exactly) */}
          <path
            d="M 24 10 L 36 22 L 24 34 L 12 22 Z M 24 16 L 30 22 L 24 28 L 18 22 Z"
            fill="#2A2621"
          />
        </g>
      </svg>

      {/* ── Brand Typography ── */}
      {showText && (
        <span
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: letterSpacing,
            color: textColor,
            fontFamily: 'var(--font-display), Syne, sans-serif',
            transform: `translateY(${textOffsetY}px)`,
          }}
          className="tracking-tight whitespace-nowrap"
        >
          {text}
        </span>
      )}
    </div>
  );
}

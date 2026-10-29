import React from 'react';

export function InstagramIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function SnapchatIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 2.5c-4.14 0-6.6 3.04-6.6 6.32 0 1.17.41 2.58 1.08 3.59.19.29.23.45.12.64-.15.23-.64.47-1.33.64-.39.1-.6.32-.6.63 0 .39.44.7.98.83.66.16 1.3.1 1.59.39.23.23.04.89-.31 1.83-.38 1.01-.51 1.72.15 2.15.66.42 2.02.09 3.23-.48.56-.26 1.08-.35 1.64-.35.54 0 1.08.09 1.62.35 1.21.57 2.57.9 3.23.48.66-.43.53-1.14.15-2.15-.35-.94-.54-1.6-.31-1.83.29-.29.93-.23 1.59-.39.54-.13.98-.44.98-.83 0-.31-.21-.53-.6-.63-.69-.17-1.18-.41-1.33-.64-.11-.19-.07-.35.12-.64.67-1.01 1.08-2.42 1.08-3.59 0-3.28-2.46-6.32-6.6-6.32z" />
    </svg>
  );
}

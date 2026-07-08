import React from 'react';

interface VerifiedBadgeProps {
  className?: string;
}

export default function VerifiedBadge({ className = "h-3.5 w-3.5" }: VerifiedBadgeProps) {
  return (
    <svg 
      className={`${className} text-[#22C55E] fill-current inline-block shrink-0 align-middle ml-1`} 
      viewBox="0 0 24 24"
      aria-label="Verified organization"
    >
      <title>Verified organization</title>
      <path d="M12 2l2.4 2.4 3.3-.3 1.1 3.2 3.1 1.4-.5 3.3 1.7 2.8-2.3 2.4-.7 3.3-3.3.1-2.1 2.6-2.7-1.1-2.7 1.1-2.1-2.6-3.3-.1-.7-3.3-2.3-2.4 1.7-2.8-.5-3.3 3.1-1.4 1.1-3.2 3.3.3L12 2zm-2 13.5l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" />
    </svg>
  );
}

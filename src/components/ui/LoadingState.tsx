'use client';

import React from 'react';
import EvidaLogo from './EvidaLogo';

interface LoadingStateProps {
  count?: number;
  type?: 'card' | 'list' | 'page';
}

function SkeletonCard() {
  return (
    <div className="rounded-[28px] bg-white border border-black/[0.06] overflow-hidden shadow-xs animate-pulse p-4 space-y-4">
      <div className="h-44 bg-[#F8F6F0] rounded-2xl" />
      <div className="space-y-3 px-1">
        <div className="h-3 w-24 bg-[#FD5C05]/15 rounded-full" />
        <div className="h-5 w-3/4 bg-black/[0.08] rounded-lg" />
        <div className="h-3.5 w-1/2 bg-black/[0.04] rounded-full" />
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-xs animate-pulse flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-[#F8F6F0] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-black/[0.08] rounded-lg" />
        <div className="h-3 w-2/3 bg-black/[0.04] rounded-full" />
      </div>
    </div>
  );
}

export default function LoadingState({ count = 6, type = 'card' }: LoadingStateProps) {
  if (type === 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative flex items-center justify-center p-6 rounded-3xl bg-white border border-black/[0.06] shadow-sm">
          <div className="absolute inset-0 rounded-3xl border-2 border-[#FD5C05]/30 border-t-[#FD5C05] animate-spin" />
          <EvidaLogo size={36} lightMode={false} />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-[#5A554E]">Loading Content...</p>
      </div>
    );
  }

  return (
    <div className={type === 'card' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
      {Array.from({ length: count }).map((_, i) => (
        type === 'card' ? <SkeletonCard key={i} /> : <SkeletonList key={i} />
      ))}
    </div>
  );
}

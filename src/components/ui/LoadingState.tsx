'use client';

import React from 'react';

interface LoadingStateProps {
  count?: number;
  type?: 'card' | 'list' | 'page';
}

function SkeletonCard() {
  return (
    <div className="rounded-[28px] bg-[#171722] border border-white/[0.06] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-white/[0.06] rounded-full" />
        <div className="h-4 w-3/4 bg-white/[0.06] rounded-full" />
        <div className="h-3 w-1/2 bg-white/[0.04] rounded-full" />
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="rounded-2xl bg-[#171722] border border-white/[0.06] p-4 animate-pulse flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-white/[0.04]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-white/[0.06] rounded-full" />
        <div className="h-3 w-2/3 bg-white/[0.04] rounded-full" />
      </div>
    </div>
  );
}

export default function LoadingState({ count = 6, type = 'card' }: LoadingStateProps) {
  if (type === 'page') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-[#80B0EC] border-t-transparent animate-spin" />
          <p className="text-xs text-[#B8BBC8] font-medium tracking-wider uppercase">Loading...</p>
        </div>
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

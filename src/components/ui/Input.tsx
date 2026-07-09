'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full rounded-xl bg-white border border-black/10
          px-4 py-3 text-sm text-[#191919] placeholder-[#4B5563]
          transition-all duration-200
          focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04]/20
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

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
        <label className="block text-xs font-medium text-[#B8BBC8]">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full rounded-xl bg-white/[0.04] border border-white/[0.08]
          px-4 py-3 text-sm text-white placeholder-[#B8BBC8]/50
          transition-all duration-200
          focus:outline-none focus:border-[#80B0EC]/50 focus:ring-1 focus:ring-[#80B0EC]/30
          ${error ? 'border-[#EE3D5A]/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[#EE3D5A]">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, Shield, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '@/lib/types';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: (role: 'student' | 'student_leader' | 'admin') => void;
}

export default function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [method, setMethod] = useState<'options' | 'email' | 'verification'>('options');
  const [email, setEmail] = useState('');
  const [roleSelection, setRoleSelection] = useState<'student' | 'student_leader' | 'admin'>('student');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMethod('verification');
  };

  const handleVerificationComplete = () => {
    onSuccess(roleSelection);
  };

  return (
    <div className="min-h-screen bg-[#DFDED7] text-[#191919] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#BDFB04]/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/50 blur-[120px] pointer-events-none"></div>

      {/* Container */}
      <div className="w-full max-w-[420px] rounded-[32px] border border-black/[0.04] bg-white p-8 space-y-6 relative z-10 shadow-2xl">
        
        {/* Back navigation */}
        {method !== 'options' && (
          <button
            onClick={() => setMethod(method === 'verification' ? 'email' : 'options')}
            className="flex items-center gap-1 text-[11px] font-bold text-[#374151] hover:text-[#191919] transition-colors uppercase cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#BDFB04] shadow-md shadow-[#BDFB04]/25">
            <Sparkles className="h-6 w-6 text-[#191919]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#191919] mt-4">JOIN CAMPUS EVIDA</h2>
          <p className="text-[11px] text-[#374151]">Access exclusive student experiences and coordinate organizations</p>
        </div>

        {method === 'options' && (
          <div className="space-y-4 pt-2">
            
            {/* Persona picker for test ease */}
            <div className="space-y-1 bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04]">
              <label className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider block">Demo Role Trigger Selection</label>
              <select
                value={roleSelection}
                onChange={(e) => setRoleSelection(e.target.value as any)}
                className="w-full bg-transparent text-xs font-semibold text-[#191919] focus:outline-none cursor-pointer pr-1"
              >
                <option value="student" className="bg-white">Michael Chen (Student)</option>
                <option value="student_leader" className="bg-white">Sarah Jenkins (Student Leader)</option>
                <option value="admin" className="bg-white">Dean Dean (Campus Admin)</option>
              </select>
            </div>

            {/* Google sign-in */}
            <button
              onClick={handleVerificationComplete}
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#DFDED7] hover:bg-black/5 py-3.5 text-xs font-bold text-[#191919] transition-all hover:scale-[1.01] cursor-pointer"
            >
              Continue with Google
            </button>

            {/* Email login option */}
            <button
              onClick={() => setMethod('email')}
              className="w-full flex items-center justify-center gap-2.5 rounded-full border border-black/10 hover:border-black/20 bg-white py-3.5 text-xs font-bold text-[#191919] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Mail className="h-4 w-4 text-[#191919]" />
              Use School Email
            </button>

            <button
              onClick={onBack}
              className="w-full text-center text-[10px] font-bold text-[#4B5563] hover:text-[#191919] transition-colors uppercase pt-2 cursor-pointer"
            >
              Cancel & Back to Home
            </button>
          </div>
        )}

        {method === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">University Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@university.edu"
                className="w-full rounded-xl border border-black/10 bg-black/[0.01] py-2.5 px-3 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#BDFB04] py-3.5 text-xs font-bold text-[#191919] transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-[#BDFB04]/30 hover:bg-[#d1fa3c]"
            >
              Send Verification Code
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {method === 'verification' && (
          <div className="space-y-6 text-center pt-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/25">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#191919]">VERIFICATION MAIL SENT</h4>
              <p className="text-[11px] text-[#374151] leading-relaxed px-4">
                We sent a temporary verification link to <strong>{email}</strong>. Check your inbox and click the activation link.
              </p>
            </div>

            <div className="bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04] space-y-1 text-left">
              <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider block text-center">Simulation Helper</span>
              <button
                onClick={handleVerificationComplete}
                className="w-full rounded-xl bg-[#BDFB04] text-[#191919] text-xs font-bold py-2 hover:bg-[#d1fa3c] transition-colors cursor-pointer"
              >
                Confirm Verification (Demo Bypass)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

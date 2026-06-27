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
    <div className="min-h-screen bg-[#050507] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FF7A1A]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>

      {/* Container */}
      <div className="w-full max-w-[420px] rounded-[32px] border border-white/5 bg-[#121215]/80 backdrop-blur-xl p-8 space-y-6 relative z-10 shadow-2xl">
        
        {/* Back navigation */}
        {method !== 'options' && (
          <button
            onClick={() => setMethod(method === 'verification' ? 'email' : 'options')}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition-colors uppercase cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF7A1A] to-[#FFD214] shadow-md shadow-orange-500/10">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white mt-4">JOIN CAMPUS EVIDA</h2>
          <p className="text-[11px] text-slate-500">Access exclusive student experiences and coordinate organizations</p>
        </div>

        {method === 'options' && (
          <div className="space-y-4 pt-2">
            
            {/* Persona picker for test ease */}
            <div className="space-y-1 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Demo Role Trigger Selection</label>
              <select
                value={roleSelection}
                onChange={(e) => setRoleSelection(e.target.value as any)}
                className="w-full bg-transparent text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer pr-1"
              >
                <option value="student" className="bg-slate-950">Michael Chen (Student)</option>
                <option value="student_leader" className="bg-slate-950">Sarah Jenkins (Student Leader)</option>
                <option value="admin" className="bg-slate-950">Dean Dean (Campus Admin)</option>
              </select>
            </div>

            {/* Google sign-in */}
            <button
              onClick={handleVerificationComplete}
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-white hover:bg-slate-200 py-3.5 text-xs font-black text-black transition-all hover:scale-[1.01] cursor-pointer"
            >
              Continue with Google
            </button>

            {/* Email login option */}
            <button
              onClick={() => setMethod('email')}
              className="w-full flex items-center justify-center gap-2.5 rounded-full border border-white/10 hover:border-white/20 bg-slate-900/40 hover:bg-slate-900 py-3.5 text-xs font-black text-slate-200 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Mail className="h-4 w-4 text-[#FF7A1A]" />
              Use School Email
            </button>

            <button
              onClick={onBack}
              className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase pt-2 cursor-pointer"
            >
              Cancel & Back to Home
            </button>
          </div>
        )}

        {method === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">University Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@university.edu"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-[#FF7A1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB61D] py-3.5 text-xs font-black text-black transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-orange-500/10"
            >
              Send Verification Code
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {method === 'verification' && (
          <div className="space-y-6 text-center pt-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300">VERIFICATION MAIL SENT</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed px-4">
                We sent a temporary verification link to <strong>{email}</strong>. Check your inbox and click the activation link.
              </p>
            </div>

            <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 space-y-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block text-center">Simulation Helper</span>
              <button
                onClick={handleVerificationComplete}
                className="w-full rounded-xl bg-[#FF7A1A] text-black text-xs font-bold py-2 hover:bg-orange-600 transition-colors cursor-pointer"
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

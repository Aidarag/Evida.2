'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, Shield, Mail, KeyRound, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';

type LoginStep = 'role-selection' | 'auth-options' | 'verify-email' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const { simulatedUsers, setCurrentUser } = useUser();

  const [step, setStep] = useState<LoginStep>('role-selection');
  const [role, setRole] = useState<'student' | 'school'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Transitions configurations
  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0
    })
  };

  const [dir, setDir] = useState(1);

  const navigateTo = (nextStep: LoginStep, direction: 'forward' | 'backward' = 'forward') => {
    setError('');
    setDir(direction === 'forward' ? 1 : -1);
    setStep(nextStep);
  };

  const handleRoleSelect = (selectedRole: 'student' | 'school') => {
    setRole(selectedRole);
    navigateTo('auth-options', 'forward');
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      if (role === 'student') {
        // Authenticate as a default student
        const mockStudent = simulatedUsers.find(u => u.role === 'student' || u.role === 'student_leader') || {
          username: 'alex_r',
          name: 'Alex Rivera',
          email: 'alex.rivera@university.edu',
          role: 'student_leader' as const,
          organizations: ['org-sg'],
          major: 'Political Science',
          gradYear: '2026',
          graduationYear: '2026',
          school: 'School of Public Affairs',
          avatar: 'AR',
        };
        setCurrentUser(mockStudent);
      } else {
        // Authenticate as default school admin
        const mockAdmin = simulatedUsers.find(u => u.role === 'admin') || {
          username: 'admin_dean',
          name: 'Dean Williams',
          email: 'dean.williams@university.edu',
          role: 'admin' as const,
          organizations: [],
          major: 'Higher Ed Admin',
          gradYear: 'N/A',
          graduationYear: 'N/A',
          school: 'Student Affairs',
          avatar: 'DW',
        };
        setCurrentUser(mockAdmin);
      }
      setIsLoading(false);
      navigateTo('success');
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }
      
      setTimeout(() => {
        if (role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/school/dashboard');
        }
      }, 1500);
    }, 1000);
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: role === 'school' ? 'school' : 'student' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setError(data.error || 'Invalid email or password.');
        return;
      }

      setCurrentUser(data);
      setIsLoading(false);
      navigateTo('success');
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }
      
      setTimeout(() => {
        if (role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/school/dashboard');
        }
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotStatus('sending');
    setTimeout(() => {
      setForgotStatus('sent');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center p-6 max-sm:p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#92D000]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#92D000]/4 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#92D000]/3 blur-[140px] pointer-events-none" />

      {/* Back to Home Button */}
      {step === 'role-selection' && !isForgotPassword && (
        <Link href="/" className="absolute top-8 left-8 text-[#4F5666] hover:text-[#191919] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      )}

      <div className="w-full max-w-md">
        <Card glass className="p-8 max-sm:p-5 max-sm:rounded-[28px] space-y-6 overflow-hidden relative" hover={false}>
          
          {/* Back Navigation within Flow */}
          {(step !== 'role-selection' || isForgotPassword) && step !== 'success' && (
            <button
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                  setForgotStatus('idle');
                  setForgotEmail('');
                } else if (step === 'auth-options') {
                  navigateTo('role-selection', 'backward');
                } else if (step === 'verify-email') {
                  navigateTo('auth-options', 'backward');
                }
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#4F5666] hover:text-[#191919] transition-colors uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={isForgotPassword ? 'forgot' : step}
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* FORGOT PASSWORD SCREEN */}
              {isForgotPassword ? (
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex justify-center mb-1">
                      <EvidaLogo size={36} showText={false} />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                        Reset Password
                      </h1>
                      <p className="text-xs text-[#4F5666] mt-1.5">
                        We'll send a password recovery link to your inbox.
                      </p>
                    </div>
                  </div>

                  {forgotStatus === 'sent' ? (
                    <div className="space-y-4 pt-2">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-xl p-4 text-xs font-semibold flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-950 font-bold uppercase tracking-wider text-[10px]">Reset Link Dispatched</p>
                          <p className="text-slate-600 font-normal mt-1">If an account matches <strong>{forgotEmail}</strong>, you will receive password reset instructions shortly.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsForgotPassword(false);
                          setForgotStatus('idle');
                          setForgotEmail('');
                        }}
                        className="w-full rounded-xl bg-[#191919] text-white hover:bg-black py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          School Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="e.g. name@university.edu"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-3 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={forgotStatus === 'sending'}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#92D000] hover:bg-[#92D000]/90 active:bg-[#191919] py-3.5 text-xs font-bold text-[#191919] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                      >
                        {forgotStatus === 'sending' ? 'Sending Recovery Link...' : 'Send Recovery Link'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <>
                  {/* HEADER */}
                  {step !== 'success' && (
                    <div className="text-center space-y-3">
                      <div className="mx-auto flex justify-center mb-1">
                        <EvidaLogo size={36} showText={false} />
                      </div>
                      <div>
                        <h1 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          {step === 'role-selection' ? 'Sign In to Evida' : role === 'student' ? 'Student Sign In' : 'School Administration'}
                        </h1>
                        <p className="text-xs text-[#4F5666] mt-1.5">
                          {step === 'role-selection' 
                            ? 'Connect to your campus community' 
                            : role === 'student'
                            ? 'Authenticate as an active campus student'
                            : 'Secure institutional administration panel'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: ROLE SELECTION */}
                  {step === 'role-selection' && (
                    <div className="space-y-4 pt-2">
                      <p className="text-xs font-bold text-center text-[#4F5666] uppercase tracking-wider mb-2">
                        Choose your access level
                      </p>

                      <div className="grid grid-cols-1 gap-3">
                        {/* Student Option */}
                        <button
                          onClick={() => handleRoleSelect('student')}
                          className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#92D000] transition-all duration-300 cursor-pointer text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#92D000]/10 text-[#92D000] flex items-center justify-center group-hover:scale-105 transition-transform">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#191919] uppercase tracking-wide">Student</p>
                              <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Join events, coordinate clubs, and verify tickets.</p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#92D000] group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* School Option */}
                        <button
                          onClick={() => handleRoleSelect('school')}
                          className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#191919]/30 transition-all duration-300 cursor-pointer text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#191919]/10 text-[#191919] flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Shield className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#191919] uppercase tracking-wide">School / Administration</p>
                              <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Review event request queues, view analytics, and verify hosts.</p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-black/[0.06] text-center">
                        <p className="text-xs text-[#4F5666]">
                          Don't have an account?{' '}
                          <Link href="/signup" className="text-[#191919] font-bold underline decoration-2 decoration-[#92D000] hover:text-[#191919]/80 transition-all">
                            Sign up here
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: AUTHENTICATION OPTIONS */}
                  {step === 'auth-options' && (
                    <div className="space-y-5 pt-1">
                      {/* Continue with Google */}
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-black/[0.08] hover:bg-black/[0.02] py-3 text-xs font-bold text-[#191919] transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 bg-white"
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </button>

                      {/* Divider */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-px bg-black/[0.08] w-full" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Or use email</span>
                        <div className="h-px bg-black/[0.08] w-full" />
                      </div>

                      {/* Email/Password Sign-In Form */}
                      <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                        <div className="space-y-3.5">
                          {/* Email input */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                              {role === 'student' ? 'School Email Address' : 'Administration Email'}
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="h-4 w-4" />
                              </div>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === 'student' ? "e.g. alex.rivera@university.edu" : "e.g. dean.williams@university.edu"}
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium"
                              />
                            </div>
                          </div>

                          {/* Password input */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                className="text-[10px] font-bold text-[#92D000] hover:text-[#191919] transition-colors uppercase tracking-widest cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="h-4 w-4" />
                              </div>
                              <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium"
                              />
                            </div>
                          </div>
                        </div>

                        {error && (
                          <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#92D000] hover:bg-[#92D000]/90 active:bg-[#191919] py-3.5 text-xs font-bold text-[#191919] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                      </form>

                      {/* Simulation Helper */}
                      <div className="bg-black/[0.02] border border-black/[0.06] p-4 rounded-[20px] shadow-sm text-left space-y-2">
                        <span className="text-[9px] font-extrabold text-[#92D000] uppercase tracking-wider block">
                          Demo Credentials Helper
                        </span>
                        <p className="text-[11px] text-[#4F5666] leading-relaxed">
                          For test logins, you can use these preset school emails (any password):
                        </p>
                        <div className="text-[10px] font-mono space-y-1 font-bold text-[#191919]">
                          {role === 'student' ? (
                            <>
                              <button 
                                onClick={() => { setEmail('michael.chen@university.edu'); setPassword('demo123'); }} 
                                className="block hover:underline text-left"
                              >
                                👤 michael.chen@university.edu (Student)
                              </button>
                              <button 
                                onClick={() => { setEmail('alex.rivera@university.edu'); setPassword('demo123'); }} 
                                className="block hover:underline text-left"
                              >
                                👤 alex.rivera@university.edu (Student Leader)
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => { setEmail('dean.williams@university.edu'); setPassword('demo123'); }} 
                              className="block hover:underline text-left"
                            >
                              💼 dean.williams@university.edu (Admin)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUCCESS / REDIRECT */}
                  {step === 'success' && (
                    <div className="text-center py-8 space-y-5">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border-2 border-emerald-500/25"
                      >
                        <CheckCircle2 className="h-8 w-8" />
                      </motion.div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Welcome Back
                        </h2>
                        <p className="text-xs text-[#4F5666]">
                          Navigating to your {role === 'student' ? 'Student' : 'Administrator'} dashboard...
                        </p>
                      </div>

                      <div className="flex justify-center pt-2">
                        <div className="w-6 h-6 border-2 border-[#92D000] border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, Shield, Mail, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';

type LoginStep = 'role-selection' | 'student-email' | 'student-verify' | 'admin-login' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const { simulatedUsers, setCurrentUser } = useUser();

  const [step, setStep] = useState<LoginStep>('role-selection');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Transitions configurations
  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0
    })
  };

  const [dir, setDir] = useState(1);

  const navigateTo = (nextStep: LoginStep, direction: 'forward' | 'backward' = 'forward') => {
    setError('');
    setDir(direction === 'forward' ? 1 : -1);
    setStep(nextStep);
  };

  const handleRoleSelect = (selectedRole: 'student' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      navigateTo('student-email');
    } else {
      navigateTo('admin-login');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      // Generate a random 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setIsLoading(false);
      navigateTo('student-verify');
    }, 800);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Verification successful (we also accept the generated code, or any code for demo ease)
      // Check if email matches one of our simulated users
      const matchedUser = simulatedUsers.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase() && u.role !== 'admin'
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
      } else {
        // Create a new custom student user
        const newStudent = {
          username: email.split('@')[0],
          name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          email: email,
          role: 'student' as const,
          organizations: [],
          major: 'General Studies',
          gradYear: '2028',
          graduationYear: '2028',
          school: 'School of Science',
          avatar: email.split('@')[0].substring(0, 2).toUpperCase(),
        };
        setCurrentUser(newStudent);
      }

      setIsLoading(false);
      navigateTo('success');
      
      setTimeout(() => {
        router.push('/student/events');
      }, 1500);
    }, 1000);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Check if matches admin
      const matchedAdmin = simulatedUsers.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase() && u.role === 'admin'
      );

      if (matchedAdmin) {
        setCurrentUser(matchedAdmin);
      } else {
        // Create a new custom admin user
        const newAdmin = {
          username: email.split('@')[0],
          name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          email: email,
          role: 'admin' as const,
          organizations: [],
          major: 'Administration',
          gradYear: 'N/A',
          graduationYear: 'N/A',
          school: 'Administration Board',
          avatar: 'AD',
        };
        setCurrentUser(newAdmin);
      }

      setIsLoading(false);
      navigateTo('success');
      
      setTimeout(() => {
        router.push('/school/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#08080B] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#80B0EC]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#EE3D5A]/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#38BDF8]/5 blur-[140px] pointer-events-none" />

      {/* Back to Home Button */}
      {step === 'role-selection' && (
        <Link href="/" className="absolute top-8 left-8 text-[#B8BBC8] hover:text-white flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      )}

      <div className="w-full max-w-md">
        <Card glass className="p-8 space-y-6 overflow-hidden relative" hover={false}>
          
          {/* Back Navigation within Flow */}
          {step !== 'role-selection' && step !== 'success' && (
            <button
              onClick={() => {
                if (step === 'student-email' || step === 'admin-login') {
                  navigateTo('role-selection', 'backward');
                } else if (step === 'student-verify') {
                  navigateTo('student-email', 'backward');
                }
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#B8BBC8] hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* HEADER */}
              {step !== 'success' && (
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-evida-blue)] to-[var(--color-evida-lime)] shadow-[0_4px_15px_rgba(218,251,113,0.15)]">
                    <Sparkles className="h-5.5 w-5.5 text-[#08080B]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      {step === 'role-selection' ? 'Sign In to Evida' : role === 'student' ? 'Student Portal' : 'Administration Portal'}
                    </h1>
                    <p className="text-xs text-[#B8BBC8] mt-1.5">
                      {step === 'role-selection' 
                        ? 'Connect to your campus community' 
                        : step === 'student-email'
                        ? 'Enter your school email address to authenticate'
                        : step === 'student-verify'
                        ? 'Verification code sent to your inbox'
                        : 'Secure administrator access'}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 1: ROLE SELECTION */}
              {step === 'role-selection' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs font-bold text-center text-[#B8BBC8] uppercase tracking-wider mb-2">
                    How would you like to continue?
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Student Option */}
                    <button
                      onClick={() => handleRoleSelect('student')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] hover:border-[var(--color-evida-blue)] transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 text-[var(--color-evida-blue)] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-wide">Student</p>
                          <p className="text-xs text-[#B8BBC8] mt-0.5 max-w-[220px]">Discover events, join clubs, and connect with peers.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#B8BBC8] group-hover:text-[var(--color-evida-blue)] group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Admin Option */}
                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] hover:border-[var(--color-evida-coral)] transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-coral)]/10 text-[var(--color-evida-coral)] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-wide">School / Administration</p>
                          <p className="text-xs text-[#B8BBC8] mt-0.5 max-w-[220px]">Manage campus events, review queues, and view analytics.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#B8BBC8] group-hover:text-[var(--color-evida-coral)] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] text-center">
                    <p className="text-xs text-[#B8BBC8]">
                      Don't have an account?{' '}
                      <Link href="/signup" className="text-[var(--color-evida-lime)] font-bold hover:underline transition-all">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: STUDENT EMAIL */}
              {step === 'student-email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-widest block">
                      Official School Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. yourname@university.edu"
                        className="w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-evida-blue)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-[var(--color-evida-coral)] font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-evida-blue)] hover:bg-[var(--color-evida-blue)]/90 py-3.5 text-xs font-bold text-[#08080B] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}

              {/* STEP 3: STUDENT VERIFICATION */}
              {step === 'student-verify' && (
                <form onSubmit={handleVerifySubmit} className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-widest block">
                      Enter 6-Digit Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-xs text-white text-center tracking-[0.4em] font-mono focus:outline-none focus:border-[var(--color-evida-blue)] transition-all font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-[#B8BBC8] leading-relaxed">
                      We sent a code to <strong className="text-white">{email}</strong>. Enter it above to access Evida.
                    </p>
                  </div>

                  {error && <p className="text-xs text-[var(--color-evida-coral)] font-semibold">{error}</p>}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-evida-lime)] hover:bg-[var(--color-evida-lime)]/90 py-3.5 text-xs font-bold text-[#08080B] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>

                    {/* Simulation Helper */}
                    <div className="bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-xl space-y-2 text-left">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block text-center">Simulation Helper</span>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#B8BBC8]">Simulated Code:</span>
                        <code className="text-[var(--color-evida-lime)] font-mono font-bold text-xs">{generatedCode}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationCode(generatedCode)}
                        className="w-full text-[10px] font-bold text-white bg-white/10 hover:bg-white/15 py-1.5 rounded-md transition-colors uppercase cursor-pointer"
                      >
                        Auto-fill Code
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 4: ADMIN LOGIN */}
              {step === 'admin-login' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4 pt-2">
                  <div className="space-y-3">
                    {/* Admin Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-widest block">
                        Administration Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="dean.williams@university.edu"
                          className="w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-evida-coral)] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-widest block">
                        Access Code / Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-evida-coral)] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs text-[var(--color-evida-coral)] font-semibold">{error}</p>}

                  <div className="space-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-evida-coral)] hover:bg-[var(--color-evida-coral)]/90 py-3.5 text-xs font-bold text-white uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
                    </button>

                    {/* Simulation Helper */}
                    <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl text-[11px] space-y-1">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block text-center mb-1">Simulation Helper</span>
                      <p className="text-[#B8BBC8]">Use the official admin email:</p>
                      <code className="text-[var(--color-evida-blue)] block font-mono font-bold select-all text-center">dean.williams@university.edu</code>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('dean.williams@university.edu');
                          setPassword('admin123');
                        }}
                        className="w-full text-[10px] font-bold text-white bg-white/10 hover:bg-white/15 py-1 rounded-md transition-colors uppercase mt-1 cursor-pointer"
                      >
                        Pre-fill Admin Credentials
                      </button>
                    </div>
                  </div>
                </form>
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
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      Authenticated Successfully
                    </h2>
                    <p className="text-xs text-[#B8BBC8]">
                      Preparing your custom {role === 'student' ? 'Student' : 'Administrator'} dashboard...
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="w-6 h-6 border-2 border-[var(--color-evida-lime)] border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

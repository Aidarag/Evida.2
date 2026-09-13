'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, Shield, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';
import LoginSplash from '@/components/LoginSplash';

export default function LoginPage() {
  const router = useRouter();
  const { simulatedUsers, setCurrentUser } = useUser();

  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<'role-selection' | 'success'>('role-selection');
  const [role, setRole] = useState<'student' | 'school'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const [dir, setDir] = useState(1);

  const slideVariants = {
    initial: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -30 : 30, opacity: 0 }),
  };

  const handleRoleSelect = (selectedRole: 'student' | 'school') => {
    setRole(selectedRole);
    setIsLoading(true);

    // Immediately authenticate as the matching mock user
    setTimeout(() => {
      if (selectedRole === 'student') {
        const mockStudent = simulatedUsers.find(u => u.role === 'student' || u.role === 'student_leader') || simulatedUsers[0];
        setCurrentUser(mockStudent);
      } else {
        const mockAdmin = simulatedUsers.find(u => u.role === 'admin') || simulatedUsers[simulatedUsers.length - 1];
        setCurrentUser(mockAdmin);
      }

      setIsLoading(false);
      setDir(1);
      setStep('success');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }

      setTimeout(() => {
        router.push(selectedRole === 'student' ? '/student/dashboard' : '/school/dashboard');
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center p-6 max-sm:p-4 relative overflow-hidden font-sans">
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 z-50 overflow-hidden"
          >
            <LoginSplash onStart={() => setShowSplash(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="login-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md z-10 flex flex-col items-center relative animate-fade-in"
          >
            {/* Back to Get Started Screen */}
            {step === 'role-selection' && (
              <button
                type="button"
                onClick={() => setShowSplash(true)}
                className="absolute top-[-44px] left-2 text-[#5A554E] hover:text-[#2A2621] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}

            <Card glass className="p-8 max-sm:p-5 max-sm:rounded-[28px] space-y-6 overflow-hidden relative w-full" hover={false}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  {/* ROLE SELECTION */}
                  {step === 'role-selection' && (
                    <>
                      {/* Header */}
                      <div className="text-center space-y-3">
                        <div className="mx-auto flex justify-center mb-1">
                          <EvidaLogo size={36} showText={false} />
                        </div>
                        <div>
                          <h1 className="text-xl font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                            Enter Evida
                          </h1>
                          <p className="text-xs text-[#5A554E] mt-1.5">
                            Choose your access level to continue
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Student Option */}
                          <button
                            onClick={() => handleRoleSelect('student')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#FD5C05] transition-all duration-300 cursor-pointer text-left group disabled:opacity-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-[#FD5C05]/10 text-[#FD5C05] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <GraduationCap className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#2A2621] uppercase tracking-wide">Student</p>
                                <p className="text-xs text-[#5A554E] mt-0.5 max-w-[220px]">Join events, coordinate clubs, and verify tickets.</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-[#5A554E] group-hover:text-[#FD5C05] group-hover:translate-x-1 transition-all" />
                          </button>

                          {/* School Option */}
                          <button
                            onClick={() => handleRoleSelect('school')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#2A2621]/30 transition-all duration-300 cursor-pointer text-left group disabled:opacity-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-[#2A2621]/10 text-[#2A2621] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Shield className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#2A2621] uppercase tracking-wide">School / Administration</p>
                                <p className="text-xs text-[#5A554E] mt-0.5 max-w-[220px]">Review event requests, manage organizations, and verify hosts.</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-[#5A554E] group-hover:text-[#2A2621] group-hover:translate-x-1 transition-all" />
                          </button>
                        </div>

                        {isLoading && (
                          <div className="flex justify-center pt-2">
                            <div className="w-5 h-5 border-2 border-[#FD5C05] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#D8D2BC]/30 text-center">
                          <p className="text-xs text-[#5A554E]">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-[#2A2621] font-bold underline decoration-2 decoration-[#FD5C05] hover:text-[#2A2621]/80 transition-all">
                              Sign up here
                            </Link>
                          </p>
                        </div>
                      </div>
                    </>
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
                        <h2 className="text-xl font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Welcome to Evida
                        </h2>
                        <p className="text-xs text-[#5A554E]">
                          Navigating to your {role === 'student' ? 'Student' : 'Administrator'} dashboard...
                        </p>
                      </div>

                      <div className="flex justify-center pt-2">
                        <div className="w-6 h-6 border-2 border-[#FD5C05] border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background Glowing Blobs (only when splash is gone) */}
      {!showSplash && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FD5C05]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FD5C05]/4 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FD5C05]/3 blur-[140px] pointer-events-none" />
        </>
      )}
    </div>
  );
}

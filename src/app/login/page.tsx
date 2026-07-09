'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, Shield, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function LoginPage() {
  const router = useRouter();
  const { simulatedUsers, setCurrentUser } = useUser();

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
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#BDFB04]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#BDFB04]/4 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#BDFB04]/3 blur-[140px] pointer-events-none" />

      {/* Back to Home Button */}
      {step === 'role-selection' && (
        <Link href="/" className="absolute top-8 left-8 text-[#374151] hover:text-[#191919] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      )}

      <div className="w-full max-w-md">
        <Card glass className="p-8 max-sm:p-5 max-sm:rounded-[28px] space-y-6 overflow-hidden relative" hover={false}>
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
                      <h1 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                        Enter Evida
                      </h1>
                      <p className="text-xs text-[#374151] mt-1.5">
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
                        className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#BDFB04] transition-all duration-300 cursor-pointer text-left group disabled:opacity-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-[#BDFB04]/10 text-[#BDFB04] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#191919] uppercase tracking-wide">Student</p>
                            <p className="text-xs text-[#374151] mt-0.5 max-w-[220px]">Join events, coordinate clubs, and verify tickets.</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-[#374151] group-hover:text-[#BDFB04] group-hover:translate-x-1 transition-all" />
                      </button>

                      {/* School Option */}
                      <button
                        onClick={() => handleRoleSelect('school')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#191919]/30 transition-all duration-300 cursor-pointer text-left group disabled:opacity-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-[#191919]/10 text-[#191919] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Shield className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#191919] uppercase tracking-wide">School / Administration</p>
                            <p className="text-xs text-[#374151] mt-0.5 max-w-[220px]">Review event request queues, view analytics, and verify hosts.</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-[#374151] group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {isLoading && (
                      <div className="flex justify-center pt-2">
                        <div className="w-5 h-5 border-2 border-[#BDFB04] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    <div className="pt-4 border-t border-black/[0.06] text-center">
                      <p className="text-xs text-[#374151]">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-[#191919] font-bold underline decoration-2 decoration-[#BDFB04] hover:text-[#191919]/80 transition-all">
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
                    <h2 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      Welcome to Evida
                    </h2>
                    <p className="text-xs text-[#374151]">
                      Navigating to your {role === 'student' ? 'Student' : 'Administrator'} dashboard...
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="w-6 h-6 border-2 border-[#BDFB04] border-t-transparent rounded-full animate-spin" />
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

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, Shield, Mail, KeyRound, CheckCircle2, User, BookOpen, Calendar, Building, Lock, Upload, Camera, AlertCircle, ShieldCheck, Phone } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';

type SignupStep = 'role-selection' | 'auth-options' | 'verify-email' | 'data-privacy' | 'profile-onboarding' | 'school-onboarding' | 'success';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();

  const [step, setStep] = useState<SignupStep>('role-selection');
  const [role, setRole] = useState<'student' | 'school'>('student');
  
  // Auth Options Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student Profile Onboarding State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('2028');
  const [phone, setPhone] = useState('');
  
  // Avatar Selection State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#92D000');
  const [avatarType, setAvatarType] = useState<'initials' | 'upload'>('initials');

  // School Onboarding State
  const [department, setDepartment] = useState('');
  const [customSchoolName, setCustomSchoolName] = useState('');

  // Privacy Consent State
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentAge, setConsentAge] = useState(false);

  // Verification State
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Transitions
  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 })
  };

  const [dir, setDir] = useState(1);

  const navigateTo = (nextStep: SignupStep, direction: 'forward' | 'backward' = 'forward') => {
    setError('');
    setDir(direction === 'forward' ? 1 : -1);
    setStep(nextStep);
  };

  const handleRoleSelect = (selectedRole: 'student' | 'school') => {
    setRole(selectedRole);
    navigateTo('auth-options', 'forward');
  };

  // Auto-detect school name from email
  const detectSchool = (emailStr: string): string => {
    if (!emailStr) return 'State University';
    const domain = emailStr.split('@')[1]?.toLowerCase();
    if (!domain) return 'State University';
    if (domain.includes('stateuni') || domain.includes('university')) return 'State University';
    const part = domain.split('.')[0];
    return part ? part.charAt(0).toUpperCase() + part.slice(1) + ' University' : 'State University';
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      setEmail('google.student@university.edu');
      // Google flow skips verification, goes to consent
      navigateTo('data-privacy', 'forward');
    }, 1000);
  };

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (role === 'student') {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        navigateTo('verify-email', 'forward');
      } else {
        setCustomSchoolName(detectSchool(email));
        // Schools also need to verify email first
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        navigateTo('verify-email', 'forward');
      }
    }, 800);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // After verification → Data & Privacy consent
      navigateTo('data-privacy', 'forward');
    }, 800);
  };

  const handleConsentSubmit = () => {
    if (!consentTerms || !consentData || !consentAge) {
      setError('You must accept all terms before proceeding.');
      return;
    }
    setError('');
    if (role === 'student') {
      navigateTo('profile-onboarding', 'forward');
    } else {
      if (!customSchoolName) setCustomSchoolName(detectSchool(email));
      navigateTo('school-onboarding', 'forward');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setAvatarType('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !major) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const detectedSchoolName = detectSchool(email);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          role: 'student',
          major,
          gradYear,
          school: detectedSchoolName,
          avatar: avatarType === 'upload' ? (uploadedImage || initials) : initials,
          phone: phone || undefined,
          consentGiven: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success — set user in context
      setCurrentUser({
        ...data,
        graduationYear: gradYear,
      });
      setIsLoading(false);
      navigateTo('success', 'forward');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }

      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSchoolOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !customSchoolName) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${department} Admin`,
          role: 'admin',
          department,
          school: customSchoolName,
          consentGiven: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setCurrentUser(data);
      setIsLoading(false);
      navigateTo('success', 'forward');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }

      setTimeout(() => {
        router.push('/school/dashboard');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  // Initials helper
  const getInitials = () => {
    const f = firstName.trim().charAt(0) || '';
    const l = lastName.trim().charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  };

  // Progress indicator
  const stepOrder: SignupStep[] = role === 'student'
    ? ['role-selection', 'auth-options', 'verify-email', 'data-privacy', 'profile-onboarding', 'success']
    : ['role-selection', 'auth-options', 'verify-email', 'data-privacy', 'school-onboarding', 'success'];
  const currentStepIdx = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length;

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center p-6 max-sm:p-4 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#92D000]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#92D000]/4 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#92D000]/3 blur-[140px] pointer-events-none" />

      {/* Back to Home */}
      {step === 'role-selection' && (
        <Link href="/" className="absolute top-8 left-8 text-[#4F5666] hover:text-[#191919] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      )}

      <div className="w-full max-w-md">
        <Card glass className="p-8 max-sm:p-5 max-sm:rounded-[28px] space-y-6 overflow-hidden relative" hover={false}>
          
          {/* Progress Bar */}
          {step !== 'role-selection' && step !== 'success' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    if (step === 'auth-options') navigateTo('role-selection', 'backward');
                    else if (step === 'verify-email') navigateTo('auth-options', 'backward');
                    else if (step === 'data-privacy') navigateTo(generatedCode ? 'verify-email' : 'auth-options', 'backward');
                    else if (step === 'profile-onboarding') navigateTo('data-privacy', 'backward');
                    else if (step === 'school-onboarding') navigateTo('data-privacy', 'backward');
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-[#4F5666] hover:text-[#191919] transition-colors uppercase tracking-widest cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <span className="text-[9px] font-bold text-[#7B8290] uppercase tracking-widest">
                  Step {currentStepIdx} of {totalSteps - 1}
                </span>
              </div>
              <div className="w-full h-1 bg-black/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#92D000] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIdx / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

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
              {/* HEADER */}
              {step !== 'success' && (
                <div className="text-center space-y-3">
                  <div className="mx-auto flex justify-center mb-1">
                    <EvidaLogo size={36} showText={false} />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      {step === 'role-selection' ? 'Join Evida' 
                        : step === 'data-privacy' ? 'Data & Privacy' 
                        : role === 'student' ? 'Student Registration' 
                        : 'School Registration'}
                    </h1>
                    <p className="text-xs text-[#4F5666] mt-1.5">
                      {step === 'role-selection' 
                        ? 'Create your official campus account' 
                        : step === 'auth-options'
                        ? 'Select authentication method'
                        : step === 'verify-email'
                        ? 'Confirm your official school email'
                        : step === 'data-privacy'
                        ? 'Review and accept our data policies'
                        : step === 'profile-onboarding'
                        ? 'Set up your student profile details'
                        : 'Set up your administration account'}
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ STEP 1: ROLE SELECTION ═══ */}
              {step === 'role-selection' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs font-bold text-center text-[#4F5666] uppercase tracking-wider mb-2">
                    Register as a Student or Institution
                  </p>

                  <div className="grid grid-cols-1 gap-3">
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
                          <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Register with school email to join events and verify tickets.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#92D000] group-hover:translate-x-1 transition-all" />
                    </button>

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
                          <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Establish department portals and coordinate calendar systems.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-black/[0.06] text-center">
                    <p className="text-xs text-[#4F5666]">
                      Already have an account?{' '}
                      <Link href="/login" className="text-[#191919] font-bold underline decoration-2 decoration-[#92D000] hover:text-[#191919]/80 transition-all">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2: AUTH OPTIONS ═══ */}
              {step === 'auth-options' && (
                <div className="space-y-5 pt-1">
                  <button
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-black/[0.08] hover:bg-black/[0.02] py-3 text-xs font-bold text-[#191919] transition-all hover:scale-[1.01] cursor-pointer bg-white disabled:opacity-50"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    {isLoading ? 'Connecting...' : 'Continue with Google'}
                  </button>

                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px bg-black/[0.08] w-full" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Or use email</span>
                    <div className="h-px bg-black/[0.08] w-full" />
                  </div>

                  <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                    <div className="space-y-3">
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          {role === 'student' ? 'Official School Email' : 'Institutional Email Address'}
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
                            placeholder={role === 'student' ? "e.g. yourname@stateuni.edu" : "e.g. admin@stateuni.edu"}
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
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
                      {isLoading ? 'Processing...' : 'Continue'}
                    </button>
                  </form>
                </div>
              )}

              {/* ═══ STEP 3: EMAIL VERIFICATION ═══ */}
              {step === 'verify-email' && (
                <form onSubmit={handleVerifySubmit} className="space-y-5 pt-1">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Mail className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-[#191919] uppercase tracking-wider">
                      Verify School Email
                    </p>
                    <p className="text-[11px] text-[#4F5666] leading-relaxed">
                      We sent a verification code to <strong className="text-[#191919]">{email}</strong>. Enter the 6-digit code below.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-3 pl-11 pr-4 text-xs text-[#191919] text-center tracking-[0.4em] font-mono focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-bold"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#92D000] hover:bg-[#92D000]/90 active:bg-[#191919] py-3.5 text-xs font-bold text-[#191919] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    {/* Simulation Helper */}
                    <div className="bg-black/[0.02] border border-black/[0.06] p-3.5 rounded-xl space-y-2 text-left">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block text-center">Simulation Helper</span>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#4F5666]">Simulated Code:</span>
                        <code className="text-[#191919] font-mono font-bold text-xs">{generatedCode}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationCode(generatedCode)}
                        className="w-full text-[10px] font-bold text-[#191919] bg-black/5 hover:bg-black/10 py-1.5 rounded-md transition-colors uppercase cursor-pointer"
                      >
                        Auto-fill Code
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ═══ STEP 4: DATA & PRIVACY CONSENT ═══ */}
              {step === 'data-privacy' && (
                <div className="space-y-5 pt-1">
                  <div className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-[#92D000]/10 flex items-center justify-center text-[#92D000] border border-[#92D000]/20">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] text-[#4F5666] leading-relaxed max-w-xs mx-auto">
                      Before creating your account, please review how Evida handles your data and agree to our terms.
                    </p>
                  </div>

                  {/* Policy Summary Card */}
                  <div className="bg-black/[0.02] border border-black/[0.06] rounded-2xl p-4 space-y-3 text-left max-h-44 overflow-y-auto">
                    <h3 className="text-[10px] font-extrabold text-[#191919] uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-[#92D000]" /> What data we collect
                    </h3>
                    <ul className="text-[10px] text-[#4F5666] space-y-1.5 leading-relaxed list-disc pl-4">
                      <li><strong className="text-[#191919]">Account info:</strong> name, email, school, major, graduation year, profile photo</li>
                      <li><strong className="text-[#191919]">Activity data:</strong> events attended, RSVPs, saved events, organizations joined</li>
                      <li><strong className="text-[#191919]">Usage analytics:</strong> page views and interaction patterns to improve the platform</li>
                      <li><strong className="text-[#191919]">Device info:</strong> browser type and device for security and optimization</li>
                    </ul>

                    <h3 className="text-[10px] font-extrabold text-[#191919] uppercase tracking-widest flex items-center gap-1.5 pt-2">
                      <ShieldCheck className="h-3 w-3 text-[#92D000]" /> How we use your data
                    </h3>
                    <ul className="text-[10px] text-[#4F5666] space-y-1.5 leading-relaxed list-disc pl-4">
                      <li>To personalize your event feed and recommendations</li>
                      <li>To enable RSVP, event creation, and social features</li>
                      <li>To provide analytics to your school's administration (aggregated, anonymized)</li>
                      <li>We <strong className="text-[#191919]">never</strong> sell your data to third parties</li>
                    </ul>

                    <h3 className="text-[10px] font-extrabold text-[#191919] uppercase tracking-widest flex items-center gap-1.5 pt-2">
                      <ShieldCheck className="h-3 w-3 text-[#92D000]" /> Your rights
                    </h3>
                    <ul className="text-[10px] text-[#4F5666] space-y-1.5 leading-relaxed list-disc pl-4">
                      <li>You can request data export or account deletion at any time</li>
                      <li>You can revoke consent and deactivate your account</li>
                      <li>Data is stored securely and encrypted in transit</li>
                    </ul>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentTerms}
                        onChange={(e) => setConsentTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-2 border-black/[0.15] text-[#92D000] focus:ring-[#92D000] cursor-pointer accent-[#92D000]"
                      />
                      <span className="text-[11px] text-[#4F5666] leading-relaxed group-hover:text-[#191919] transition-colors">
                        I agree to Evida's <strong className="text-[#191919] underline decoration-[#92D000]">Terms of Service</strong> and <strong className="text-[#191919] underline decoration-[#92D000]">Privacy Policy</strong>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentData}
                        onChange={(e) => setConsentData(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-2 border-black/[0.15] text-[#92D000] focus:ring-[#92D000] cursor-pointer accent-[#92D000]"
                      />
                      <span className="text-[11px] text-[#4F5666] leading-relaxed group-hover:text-[#191919] transition-colors">
                        I consent to the collection and use of my data as described above
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentAge}
                        onChange={(e) => setConsentAge(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-2 border-black/[0.15] text-[#92D000] focus:ring-[#92D000] cursor-pointer accent-[#92D000]"
                      />
                      <span className="text-[11px] text-[#4F5666] leading-relaxed group-hover:text-[#191919] transition-colors">
                        I am at least <strong className="text-[#191919]">18 years old</strong> or have parental/guardian consent
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleConsentSubmit}
                    disabled={!consentTerms || !consentData || !consentAge}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#92D000] hover:bg-[#92D000]/90 active:bg-[#191919] py-3.5 text-xs font-bold text-[#191919] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    I Agree — Continue
                  </button>
                </div>
              )}

              {/* ═══ STEP 5A: STUDENT PROFILE ONBOARDING ═══ */}
              {step === 'profile-onboarding' && (
                <form onSubmit={handleStudentProfileSubmit} className="space-y-4 pt-1">
                  {/* Avatar Picker */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[9px] font-extrabold text-[#4F5666] uppercase tracking-wider block">
                      Profile Picture
                    </span>
                    <div className="relative">
                      {avatarType === 'upload' && uploadedImage ? (
                        <div className="h-16 w-16 rounded-full border-2 border-black/10 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${uploadedImage})` }} />
                      ) : (
                        <div 
                          className="h-16 w-16 rounded-full border-2 border-black/5 text-white flex items-center justify-center font-extrabold text-lg shadow-sm transition-colors duration-300"
                          style={{ backgroundColor: selectedColor }}
                        >
                          {getInitials()}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#191919] text-white flex items-center justify-center hover:scale-105 transition-transform border border-white cursor-pointer shadow"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <div className="flex gap-2.5 items-center justify-center">
                      {['#92D000', '#FF7A1A', '#9C27B0', '#2196F3', '#FF5722'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setSelectedColor(c); setAvatarType('initials'); }}
                          className={`h-5 w-5 rounded-full border border-black/10 transition-all hover:scale-110 cursor-pointer ${selectedColor === c && avatarType === 'initials' ? 'ring-2 ring-[#191919] ring-offset-2 scale-105' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">First Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="h-3.5 w-3.5" /></div>
                          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Alex"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">Last Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="h-3.5 w-3.5" /></div>
                          <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Rivera"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
                        </div>
                      </div>
                    </div>

                    {/* Major & Grad Year */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">Major</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><BookOpen className="h-4 w-4" /></div>
                          <input type="text" required value={major} onChange={(e) => setMajor(e.target.value)} placeholder="e.g. Computer Science"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">Grad Year</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Calendar className="h-4 w-4" /></div>
                          <select value={gradYear} onChange={(e) => setGradYear(e.target.value)}
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium cursor-pointer">
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Phone (optional) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Phone Number <span className="text-[#7B8290] font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Phone className="h-4 w-4" /></div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. (555) 123-4567"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
                      </div>
                    </div>

                    {/* Auto-detected School */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Campus Network (Auto-Detected)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Building className="h-4 w-4" /></div>
                        <input type="text" readOnly value={detectSchool(email)}
                          className="w-full rounded-xl border border-black/[0.06] bg-black/[0.02] py-2.5 pl-11 pr-4 text-xs text-[#4F5666] font-bold" />
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
                    {isLoading ? 'Creating Your Account...' : 'Join Evida'}
                  </button>
                </form>
              )}

              {/* ═══ STEP 5B: SCHOOL ONBOARDING ═══ */}
              {step === 'school-onboarding' && (
                <form onSubmit={handleSchoolOnboardingSubmit} className="space-y-4 pt-1">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">Administration Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><User className="h-4 w-4" /></div>
                        <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Student Affairs Board"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">Institution Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Building className="h-4 w-4" /></div>
                        <input type="text" required value={customSchoolName} onChange={(e) => setCustomSchoolName(e.target.value)} placeholder="e.g. State University"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#191919] placeholder-gray-400 focus:outline-none focus:border-[#92D000] focus:ring-1 focus:ring-[#92D000] transition-all font-medium" />
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
                    {isLoading ? 'Saving Institution Profile...' : 'Complete Administration Setup'}
                  </button>
                </form>
              )}

              {/* ═══ SUCCESS SCREEN ═══ */}
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
                      Account Activated
                    </h2>
                    <p className="text-xs text-[#4F5666]">
                      Welcome to Evida! Initializing your custom {role === 'student' ? 'Student' : 'Administration'} workspace...
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="w-6 h-6 border-2 border-[#92D000] border-t-transparent rounded-full animate-spin" />
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, Shield, Mail, KeyRound, CheckCircle2, User, BookOpen, Calendar, Building, Lock } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';

type SignupStep = 'role-selection' | 'student-details' | 'admin-details' | 'verify' | 'success';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();

  const [step, setStep] = useState<SignupStep>('role-selection');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  
  // Student Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('2028');

  // Admin Form State
  const [schoolName, setSchoolName] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  // Verification State
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

  const navigateTo = (nextStep: SignupStep, direction: 'forward' | 'backward' = 'forward') => {
    setError('');
    setDir(direction === 'forward' ? 1 : -1);
    setStep(nextStep);
  };

  const handleRoleSelect = (selectedRole: 'student' | 'admin') => {
    setRole(selectedRole);
    setIsLoading(true);

    setTimeout(() => {
      if (selectedRole === 'student') {
        const mockStudent = {
          username: 'alex.rivera',
          name: 'Alex Rivera',
          email: 'alex.rivera@stateuni.edu',
          role: 'student' as const,
          organizations: [],
          major: 'Computer Science',
          gradYear: '2028',
          graduationYear: '2028',
          school: 'State University',
          avatar: 'AR',
        };
        setCurrentUser(mockStudent);
      } else {
        const mockAdmin = {
          username: 'dean.williams',
          name: 'Dean Williams',
          email: 'dean.williams@university.edu',
          role: 'admin' as const,
          organizations: [],
          major: 'Administration',
          gradYear: 'N/A',
          graduationYear: 'N/A',
          school: 'Administration Board',
          avatar: 'DW',
        };
        setCurrentUser(mockAdmin);
      }
      setIsLoading(false);
      navigateTo('success');
      
      setTimeout(() => {
        if (selectedRole === 'student') {
          router.push('/student/events');
        } else {
          router.push('/school/dashboard');
        }
      }, 1500);
    }, 1000);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'student') {
      if (!email || !name || !major) {
        setError('Please fill in all fields.');
        return;
      }
    } else {
      if (!schoolName || !email || !department || !password) {
        setError('Please fill in all fields.');
        return;
      }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setIsLoading(false);
      navigateTo('verify');
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
      // Create user session based on role
      if (role === 'student') {
        const newStudent = {
          username: email.split('@')[0] + '_custom',
          name: name,
          email: email,
          role: 'student' as const,
          organizations: [],
          major: major,
          gradYear: gradYear,
          graduationYear: gradYear,
          school: 'School of Arts & Sciences',
          avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST',
        };
        setCurrentUser(newStudent);
      } else {
        const newAdmin = {
          username: email.split('@')[0] + '_admin',
          name: department + ' Admin (' + schoolName + ')',
          email: email,
          role: 'admin' as const,
          organizations: [],
          major: 'School Administration',
          gradYear: 'N/A',
          graduationYear: 'N/A',
          school: schoolName,
          avatar: schoolName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD',
        };
        setCurrentUser(newAdmin);
      }

      setIsLoading(false);
      navigateTo('success');
      
      setTimeout(() => {
        if (role === 'student') {
          router.push('/student/events');
        } else {
          router.push('/school/dashboard');
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FF5A1F]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8257FF]/4 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FF5A1F]/3 blur-[140px] pointer-events-none" />

      {/* Back to Home Button */}
      {step === 'role-selection' && (
        <Link href="/" className="absolute top-8 left-8 text-[#4F5666] hover:text-[#121212] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      )}

      <div className="w-full max-w-md">
        <Card glass className="p-8 space-y-6 overflow-hidden relative" hover={false}>
          
          {/* Back Navigation within Flow */}
          {step !== 'role-selection' && step !== 'success' && (
            <button
              onClick={() => {
                if (step === 'student-details' || step === 'admin-details') {
                  navigateTo('role-selection', 'backward');
                } else if (step === 'verify') {
                  navigateTo(role === 'student' ? 'student-details' : 'admin-details', 'backward');
                }
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#4F5666] hover:text-[#121212] transition-colors uppercase tracking-widest cursor-pointer"
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
                  <div className="mx-auto flex justify-center mb-1">
                    <EvidaLogo size={36} showText={false} />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-[#121212] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      {step === 'role-selection' ? 'Create Evida Account' : role === 'student' ? 'Student Registration' : 'Partner Institution'}
                    </h1>
                    <p className="text-xs text-[#4F5666] mt-1.5">
                      {step === 'role-selection' 
                        ? 'Join your official campus network' 
                        : step === 'student-details'
                        ? 'Create your personalized student profile'
                        : step === 'admin-details'
                        ? 'Register your university administration portal'
                        : 'Confirm your email address'}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 1: ROLE SELECTION */}
              {step === 'role-selection' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs font-bold text-center text-[#4F5666] uppercase tracking-wider mb-2">
                    How would you like to continue?
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Student Option */}
                    <button
                      onClick={() => handleRoleSelect('student')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#121212] uppercase tracking-wide">Student Registration</p>
                          <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Register with your official school email and build your profile.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#FF5A1F] group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Admin Option */}
                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#121212]/30 transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#121212]/10 text-[#121212] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#121212] uppercase tracking-wide">School / Administration</p>
                          <p className="text-xs text-[#4F5666] mt-0.5 max-w-[220px]">Establish Evida integration for your campus and departments.</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#4F5666] group-hover:text-[#121212] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-black/[0.06] text-center">
                    <p className="text-xs text-[#4F5666]">
                      Already have an account?{' '}
                      <Link href="/login" className="text-[#FF5A1F] font-bold hover:underline transition-all">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2A: STUDENT DETAILS */}
              {step === 'student-details' && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4 pt-2">
                  <div className="space-y-3">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* School Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Official School Email
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
                          placeholder="e.g. alex.morgan@university.edu"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Major & Grad Year */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          Major
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            placeholder="e.g. Economics"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                          Grad Year
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <select
                            value={gradYear}
                            onChange={(e) => setGradYear(e.target.value)}
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium cursor-pointer"
                          >
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs text-[#FF5A1F] font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04b12] py-3.5 text-xs font-bold text-white uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 shadow-[0_4px_14px_rgba(255,90,31,0.25)]"
                  >
                    {isLoading ? 'Creating Profile...' : 'Register Profile'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}

              {/* STEP 2B: ADMIN DETAILS */}
              {step === 'admin-details' && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4 pt-2">
                  <div className="space-y-3">
                    {/* School Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        School / Institution Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Building className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. Gotham University"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Admin Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Official Administration Email
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
                          placeholder="e.g. admin@gotham.edu"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Department / Office */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Department / Office
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Student Involvement Office"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                        Choose Access Password
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
                          placeholder="••••••••"
                          className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs text-[#FF5A1F] font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04b12] py-3.5 text-xs font-bold text-white uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 shadow-[0_4px_14px_rgba(255,90,31,0.25)]"
                  >
                    {isLoading ? 'Registering...' : 'Register Institution'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}

              {/* STEP 3: VERIFICATION */}
              {step === 'verify' && (
                <form onSubmit={handleVerifySubmit} className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#4F5666] uppercase tracking-widest block">
                      Enter 6-Digit Code
                    </label>
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
                        className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-3 pl-11 pr-4 text-xs text-[#121212] text-center tracking-[0.4em] font-mono focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-[#4F5666] leading-relaxed">
                      We sent a code to <strong className="text-[#121212]">{email}</strong>. Enter it above to activate your Evida account.
                    </p>
                  </div>

                  {error && <p className="text-xs text-[#FF5A1F] font-semibold">{error}</p>}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04b12] py-3.5 text-xs font-bold text-white uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 shadow-[0_4px_14px_rgba(255,90,31,0.25)]"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Complete Signup'}
                    </button>

                    {/* Simulation Helper */}
                    <div className="bg-black/[0.02] border border-black/[0.06] p-3.5 rounded-xl space-y-2 text-left">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block text-center">Simulation Helper</span>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#4F5666]">Simulated Code:</span>
                        <code className="text-[#FF5A1F] font-mono font-bold text-xs">{generatedCode}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationCode(generatedCode)}
                        className="w-full text-[10px] font-bold text-[#121212] bg-black/5 hover:bg-black/10 py-1.5 rounded-md transition-colors uppercase cursor-pointer"
                      >
                        Auto-fill Code
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
                    <h2 className="text-xl font-extrabold text-[#121212] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                      Account Registered!
                    </h2>
                    <p className="text-xs text-[#4F5666]">
                      Creating your new {role === 'student' ? 'Student' : 'Institution'} account...
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="w-6 h-6 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
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

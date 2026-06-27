'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { simulatedUsers, setCurrentUser } = useUser();

  const handleLogin = (username: string) => {
    const user = simulatedUsers.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        router.push('/school/dashboard');
      } else {
        router.push('/student/events');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#08080B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#80B0EC]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#DAFB71]/10 blur-[100px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-[#B8BBC8] hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card glass className="p-8 space-y-8" hover={false}>
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#80B0EC] to-[#DAFB71] shadow-[0_4px_20px_rgba(128,176,236,0.3)]">
              <Sparkles className="h-6 w-6 text-[#08080B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Welcome back</h1>
              <p className="text-sm text-[#B8BBC8] mt-1">Select a demo persona to continue</p>
            </div>
          </div>

          <div className="space-y-3">
            {simulatedUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => handleLogin(user.username)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#80B0EC]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center font-bold text-white group-hover:from-[#80B0EC] group-hover:to-[#DAFB71] group-hover:text-[#08080B] transition-colors">
                    {user.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-[#B8BBC8] capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-white/[0.06] text-center">
             <p className="text-xs text-[#B8BBC8]">
               Don't have an account? <span className="text-[#80B0EC] opacity-50 cursor-not-allowed">Sign up (Demo disabled)</span>
             </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

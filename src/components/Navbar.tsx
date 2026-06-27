'use client';

import React from 'react';
import { Shield, Sparkles, User as UserIcon, LogOut, RefreshCw } from 'lucide-react';
import { User } from '@/lib/types';

interface NavbarProps {
  currentTab: 'student' | 'school';
  setCurrentTab: (tab: 'student' | 'school') => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  simulatedUsers: User[];
  onResetDatabase: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  simulatedUsers,
  onResetDatabase,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-indigo-200 via-white to-violet-200 bg-clip-text text-xl font-bold tracking-wide text-transparent">
                Evida
              </span>
              <span className="ml-1.5 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                Campus Portal
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 rounded-xl bg-slate-900 p-1 border border-white/5">
            <button
              onClick={() => setCurrentTab('student')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                currentTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              Student Hub
            </button>
            <button
              onClick={() => setCurrentTab('school')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                currentTab === 'school'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              School Dashboard
            </button>
          </nav>

          {/* Persona Switcher & Database Reset */}
          <div className="flex items-center gap-3">
            {/* DB Reset button */}
            <button
              onClick={onResetDatabase}
              title="Reset Demo Database"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Simulated User Selector */}
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/40 p-1.5">
              <span className="hidden text-[10px] font-medium text-slate-500 md:inline pl-1.5 uppercase tracking-wider">
                Simulate:
              </span>
              <select
                value={currentUser.username}
                onChange={(e) => {
                  const selected = simulatedUsers.find((u) => u.username === e.target.value);
                  if (selected) setCurrentUser(selected);
                }}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {simulatedUsers.map((user) => (
                  <option
                    key={user.username}
                    value={user.username}
                    className="bg-slate-950 text-slate-200"
                  >
                    {user.name} ({user.role === 'admin' ? 'Admin' : user.role === 'student_leader' ? 'Leader' : 'Student'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

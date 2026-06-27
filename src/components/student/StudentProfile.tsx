'use client';

import React from 'react';
import { User, Organization } from '@/lib/types';
import { Building, Sparkles, UserCheck, Shield } from 'lucide-react';

interface StudentProfileProps {
  currentUser: User;
  organizations: Organization[];
  totalRsvps: number;
  totalCreated: number;
  totalSaved: number;
}

export default function StudentProfile({
  currentUser,
  organizations,
  totalRsvps,
  totalCreated,
  totalSaved,
}: StudentProfileProps) {
  // Find organizations user belongs to
  const userOrgs = organizations.filter((org) =>
    currentUser.organizations.includes(org.id)
  );

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
      
      {/* Profile Card */}
      <div className="md:col-span-1 rounded-[28px] border border-white/5 bg-[#121215]/50 p-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-[#FF7A1A]/5 blur-xl"></div>
        
        {/* Avatar */}
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#FF7A1A] to-[#FFD214] text-black font-black text-3xl flex items-center justify-center shadow-lg shadow-orange-500/10">
          {currentUser.avatar}
        </div>

        <h3 className="text-base font-black text-white mt-4 uppercase">{currentUser.name}</h3>
        <span className="rounded-full bg-[#FF7A1A]/10 border border-[#FF7A1A]/20 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#FF7A1A] mt-1.5">
          {currentUser.role === 'student_leader' ? 'Student Leader' : 'Student Member'}
        </span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full pt-6 mt-6 border-t border-white/5 text-center">
          <div>
            <p className="text-sm font-black text-white">{totalRsvps}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">RSVPs</p>
          </div>
          <div>
            <p className="text-sm font-black text-white">{totalCreated}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Posts</p>
          </div>
          <div>
            <p className="text-sm font-black text-white">{totalSaved}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Saves</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Bio Data info */}
        <div className="rounded-[28px] border border-white/5 bg-[#121215]/50 p-6 space-y-4">
          <span className="text-[9px] font-black uppercase text-slate-500">Education Details</span>
          
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">University School</p>
              <p className="font-extrabold text-slate-200 mt-1 uppercase">{currentUser.school || 'General Science Division'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Major / Academic Study</p>
              <p className="font-extrabold text-slate-200 mt-1 uppercase">{currentUser.major}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Class Graduation Year</p>
              <p className="font-extrabold text-slate-200 mt-1">{currentUser.gradYear}</p>
            </div>
          </div>
        </div>

        {/* Organization memberships */}
        <div className="rounded-[28px] border border-white/5 bg-[#121215]/50 p-6 space-y-4">
          <span className="text-[9px] font-black uppercase text-slate-500">Verified Group Memberships</span>

          <div className="space-y-2.5">
            {userOrgs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Not registered as a member of any campus group.</p>
            ) : (
              userOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#FF7A1A]" />
                    <span className="text-xs font-black text-slate-200 uppercase">{org.name}</span>
                  </div>
                  {org.verified && (
                    <span className="flex items-center gap-0.5 text-emerald-400 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                      <UserCheck className="h-3 w-3" /> Verified Member
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

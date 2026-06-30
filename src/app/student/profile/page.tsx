'use client';

import React from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import Card from '@/components/ui/Card';
import { User, LogOut, Settings, Award, Users, Shield, CalendarCheck, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentProfilePage() {
  const { currentUser, setCurrentUser, simulatedUsers } = useUser();
  const { events, organizations } = useEvents();
  const router = useRouter();

  if (!currentUser) return null;

  const totalRsvps = events.filter(e => e.attendees.includes(currentUser.name)).length;
  const totalCreated = events.filter(e => e.organizer === currentUser.name).length;
  const totalSaved = events.filter(e => e.savedBy?.includes(currentUser.name)).length;
  const myOrgs = organizations.filter(org => currentUser.organizations.includes(org.id));

  const handleLogout = () => {
    // For demo purposes, we just switch back to a default state or redirect to login
    router.push('/login');
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <Card className="p-6 max-sm:p-5 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8" hover={false}>
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-[#E8FF40] flex items-center justify-center shadow-[0_8px_30px_rgba(32,54,39,0.1)] shrink-0">
          <span className="text-4xl md:text-5xl font-extrabold text-[#203627]">{currentUser.avatar}</span>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#203627]">{currentUser.name}</h1>
            <p className="text-[#203627]/85 font-extrabold text-sm">@{currentUser.username}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-xs font-bold text-[#4F5666]">
              <Award className="h-3.5 w-3.5" />
              {currentUser.major}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-xs font-bold text-[#4F5666]">
              <Calendar className="h-3.5 w-3.5" />
              Class of {currentUser.graduationYear}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-xs font-bold text-[#4F5666]">
              <Shield className="h-3.5 w-3.5" />
              {currentUser.school}
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-6 pt-4 border-t border-black/[0.06]">
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-[#203627]">{totalRsvps}</div>
              <div className="text-[9px] md:text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Events Attended</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-[#203627]">{totalCreated}</div>
              <div className="text-[9px] md:text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Events Hosted</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-[#203627]">{totalSaved}</div>
              <div className="text-[9px] md:text-[10px] font-bold text-[#4F5666] uppercase tracking-wider">Events Saved</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Organizations & Settings Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#203627] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#9DC4D5]" /> My Organizations
          </h2>
          {myOrgs.length > 0 ? (
            <div className="space-y-3">
              {myOrgs.map(org => (
                <Card key={org.id} className="p-5 flex items-center gap-4" glass>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center from-${org.logoColor}-500 to-${org.logoColor}-700`}>
                    <span className="font-bold text-[#203627] text-lg">{org.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#203627]">{org.name}</h3>
                    <p className="text-xs text-[#4F5666]">{org.verified ? 'Verified Organization' : 'Student Group'}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center" glass hover={false}>
              <p className="text-xs text-[#4F5666]">You are not a member of any organizations yet.</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
           <h2 className="text-lg font-bold text-[#203627] flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-500" /> Account Actions
          </h2>
          <Card className="divide-y divide-black/[0.06]" glass hover={false}>
            <button className="w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors cursor-not-allowed group">
              <span className="text-sm font-medium text-white group-hover:text-[#9DC4D5] transition-colors">Edit Profile (Demo)</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors cursor-not-allowed group">
              <span className="text-sm font-medium text-white group-hover:text-[#9DC4D5] transition-colors">Notification Settings (Demo)</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors cursor-pointer group"
            >
              <span className="text-sm font-medium text-red-500 flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
      <Card className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8" hover={false}>
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#80B0EC] to-[#DAFB71] flex items-center justify-center shadow-[0_8px_30px_rgba(128,176,236,0.3)] shrink-0">
          <span className="text-5xl font-black text-[#08080B]">{currentUser.avatar}</span>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-black text-white">{currentUser.name}</h1>
            <p className="text-[#80B0EC] font-bold">@{currentUser.username}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-medium text-[#B8BBC8]">
              <Award className="h-3.5 w-3.5" />
              {currentUser.major}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-medium text-[#B8BBC8]">
              <Calendar className="h-3.5 w-3.5" />
              Class of {currentUser.graduationYear}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-medium text-[#B8BBC8]">
              <Shield className="h-3.5 w-3.5" />
              {currentUser.school}
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-6 pt-4 border-t border-white/[0.06]">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black text-white">{totalRsvps}</div>
              <div className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-wider">Events Attended</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-black text-white">{totalCreated}</div>
              <div className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-wider">Events Hosted</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-black text-white">{totalSaved}</div>
              <div className="text-[10px] font-bold text-[#B8BBC8] uppercase tracking-wider">Events Saved</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Organizations & Settings Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[#80B0EC]" /> My Organizations
          </h2>
          {myOrgs.length > 0 ? (
            <div className="space-y-3">
              {myOrgs.map(org => (
                <Card key={org.id} className="p-5 flex items-center gap-4" glass>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center from-${org.logoColor}-500 to-${org.logoColor}-700`}>
                    <span className="font-bold text-white text-lg">{org.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{org.name}</h3>
                    <p className="text-xs text-[#B8BBC8]">{org.verified ? 'Verified Organization' : 'Student Group'}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center" glass hover={false}>
              <p className="text-sm text-[#B8BBC8]">You are not a member of any organizations yet.</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#EE3D5A]" /> Account Actions
          </h2>
          <Card className="divide-y divide-white/[0.06]" glass hover={false}>
            <button className="w-full p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-not-allowed group">
              <span className="text-sm font-medium text-white group-hover:text-[#80B0EC] transition-colors">Edit Profile (Demo)</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-not-allowed group">
              <span className="text-sm font-medium text-white group-hover:text-[#80B0EC] transition-colors">Notification Settings (Demo)</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
            >
              <span className="text-sm font-medium text-[#EE3D5A] flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

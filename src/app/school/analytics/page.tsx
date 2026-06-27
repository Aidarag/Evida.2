'use client';

import React from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import { BarChart3, TrendingUp, Users, CalendarDays, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { events, organizations } = useEvents();
  const { currentUser } = useUser();

  if (!currentUser || currentUser.role !== 'admin') return null;

  const totalApproved = events.filter(e => e.status === 'approved').length;
  const totalRsvps = events.reduce((acc, ev) => acc + ev.attendees.length, 0);
  const totalViews = events.reduce((acc, ev) => acc + (ev.views || 0), 0);
  
  // Calculate category distribution
  const categories = events.reduce((acc, ev) => {
    acc[ev.category] = (acc[ev.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Engagement Analytics</h1>
        <p className="text-sm text-[#B8BBC8]">Campus-wide metrics and event performance data.</p>
      </div>

      {/* Top Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#80B0EC]/10 flex items-center justify-center text-[#80B0EC]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#B8BBC8] uppercase tracking-wider">Total Events</span>
          </div>
          <div className="text-3xl font-black text-white">{totalApproved}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#DAFB71]/10 flex items-center justify-center text-[#DAFB71]">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#B8BBC8] uppercase tracking-wider">Total RSVPs</span>
          </div>
          <div className="text-3xl font-black text-white">{totalRsvps}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#EE3D5A]/10 flex items-center justify-center text-[#EE3D5A]">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#B8BBC8] uppercase tracking-wider">Total Views</span>
          </div>
          <div className="text-3xl font-black text-white">{totalViews}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#B8BBC8] uppercase tracking-wider">Active Orgs</span>
          </div>
          <div className="text-3xl font-black text-white">{organizations.filter(o => o.verified).length}</div>
        </Card>
      </div>

      {/* Charts area */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#80B0EC]" /> Events by Category
          </h2>
          <div className="space-y-4">
            {sortedCategories.map(([category, count]) => {
              const percentage = Math.round((count / events.length) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white">{category}</span>
                    <span className="text-[#B8BBC8]">{count} events ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/[0.04] rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#80B0EC] to-[#DAFB71] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[#DAFB71]" /> Top Organizations (RSVPs)
          </h2>
          <div className="space-y-4">
            {organizations
              .sort((a, b) => (b.rsvps || 0) - (a.rsvps || 0))
              .slice(0, 5)
              .map((org, index) => (
                <div key={org.id} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-[#B8BBC8]">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{org.name}</p>
                  </div>
                  <span className="text-sm font-bold text-[#DAFB71]">{org.rsvps} RSVPs</span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

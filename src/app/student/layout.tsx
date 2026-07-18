'use client';

import React, { useState } from 'react';
import { DesktopNav, DesktopSidebar, TabletDrawerSidebar, MobileBottomNav, ProfileSwitcher, NotificationBell } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed' | 'hidden'>('expanded');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#D8D2BC] text-gray-900 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full py-2.5 px-4 border-b border-black/[0.04] bg-[#D8D2BC]/95 backdrop-blur-xl flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-[#2A2621] flex items-center gap-2">
          <EvidaLogo size={30} showText={true} />
        </span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link 
            href="/student/settings" 
            className="h-8 w-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#2A2621] hover:bg-slate-50 transition-all shadow-sm shrink-0"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
          <ProfileSwitcher />
        </div>
      </div>

      {/* Laptop collapsible sidebar */}
      <DesktopSidebar 
        variant="student" 
        state={sidebarState} 
        onChangeState={setSidebarState} 
      />

      {/* Tablet drawer sidebar */}
      <TabletDrawerSidebar 
        variant="student" 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav 
          variant="student" 
          isSidebarHidden={sidebarState === 'hidden'} 
          onShowSidebar={() => setSidebarState('expanded')} 
          onOpenDrawer={() => setIsDrawerOpen(true)} 
        />
        
        <main className="flex-1 pb-32 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="student" />
    </div>
  );
}

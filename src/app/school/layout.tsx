'use client';

import React, { useState } from 'react';
import { DesktopNav, DesktopSidebar, TabletDrawerSidebar, MobileBottomNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed' | 'hidden'>('expanded');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#D8D2BC] text-[#2A2621] flex flex-col lg:flex-row">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-black/[0.04] bg-[#D8D2BC]/90 backdrop-blur-xl flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-[#2A2621] flex items-center gap-2">
          <EvidaLogo size={22} showText={true} lightMode={true} />
          <span className="text-[10px] bg-[#FD5C05] text-[#2A2621] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
        </span>
      </div>

      {/* Laptop collapsible sidebar */}
      <DesktopSidebar 
        variant="school" 
        state={sidebarState} 
        onChangeState={setSidebarState} 
      />

      {/* Tablet drawer sidebar */}
      <TabletDrawerSidebar 
        variant="school" 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav 
          variant="school" 
          isSidebarHidden={sidebarState === 'hidden'} 
          onShowSidebar={() => setSidebarState('expanded')} 
          onOpenDrawer={() => setIsDrawerOpen(true)} 
        />
        
        <main className="flex-1 pb-32 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="school" />
    </div>
  );
}

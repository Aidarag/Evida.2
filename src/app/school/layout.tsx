import React from 'react';
import { DesktopNav, DesktopSidebar, MobileBottomNav } from '@/components/Navbar';

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-gray-200 bg-white/90 backdrop-blur-xl flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-[#4C1D95] flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#EE3D5A]/20 flex items-center justify-center">
            <span className="text-[#EE3D5A] font-black text-xs">E</span>
          </div>
          Evida Admin
        </span>
      </div>

      <DesktopSidebar variant="school" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav variant="school" />
        
        <main className="flex-1 pb-24 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="school" />
    </div>
  );
}

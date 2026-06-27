import React from 'react';
import { DesktopNav, DesktopSidebar, MobileBottomNav } from '@/components/Navbar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col md:flex-row">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-white/[0.06] bg-[#08080B]/80 backdrop-blur-xl flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#80B0EC] to-[#DAFB71] flex items-center justify-center">
            <span className="text-[#08080B] font-black text-xs">E</span>
          </div>
          Evida
        </span>
      </div>

      <DesktopSidebar variant="student" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav variant="student" />
        
        <main className="flex-1 pb-24 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="student" />
    </div>
  );
}

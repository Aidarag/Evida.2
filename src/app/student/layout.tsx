import React from 'react';
import { DesktopNav, DesktopSidebar, MobileBottomNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#DFDED7] text-gray-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full py-4 px-6 border-b border-black/[0.04] bg-[#DFDED7]/95 backdrop-blur-xl flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-[#191919] flex items-center gap-2">
          <EvidaLogo size={28} showText={true} />
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

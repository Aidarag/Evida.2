'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, Bookmark, User, Settings, BarChart3, Shield, Star, ClipboardList, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────
// Desktop Top Bar (minimal)
// ─────────────────────────────────────────────────
export function DesktopNav({ variant = 'student' }: { variant?: 'student' | 'school' | 'public' }) {
  const pathname = usePathname();

  return (
    <header className="hidden md:flex sticky top-0 z-40 w-full h-16 border-b border-white/[0.06] bg-[#08080B]/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#80B0EC] to-[#DAFB71] flex items-center justify-center shadow-[0_2px_12px_rgba(128,176,236,0.3)] group-hover:shadow-[0_4px_20px_rgba(128,176,236,0.4)] transition-shadow">
            <span className="text-[#08080B] font-black text-sm">E</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Evida</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {variant === 'public' && (
            <>
              <Link href="/login" className="text-sm text-[#B8BBC8] hover:text-white transition-colors px-3 py-1.5 cursor-pointer">
                Sign In
              </Link>
              <Link
                href="/student/events"
                className="btn-primary text-sm"
              >
                Explore Events
              </Link>
            </>
          )}
          {variant === 'student' && (
            <>
              <Link
                href="/student/create"
                className="btn-neon text-xs"
              >
                <Plus className="h-4 w-4" /> Create
              </Link>
              <Link href="/student/profile" className="h-9 w-9 rounded-full bg-gradient-to-br from-[#80B0EC] to-[#DAFB71] flex items-center justify-center text-[#08080B] text-xs font-bold cursor-pointer">
                MC
              </Link>
            </>
          )}
          {variant === 'school' && (
            <>
              <Link href="/student/events" className="text-xs text-[#B8BBC8] hover:text-white transition-colors cursor-pointer">
                Student Portal
              </Link>
              <div className="h-9 w-9 rounded-full bg-[#EE3D5A]/20 flex items-center justify-center text-[#EE3D5A] text-xs font-bold">
                A
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────
// Mobile Bottom Navigation (floating capsule)
// ─────────────────────────────────────────────────
export function MobileBottomNav({ variant = 'student' }: { variant?: 'student' | 'school' }) {
  const pathname = usePathname();

  const studentTabs = [
    { href: '/student/dashboard', icon: Home, label: 'Home' },
    { href: '/student/events', icon: Compass, label: 'Explore' },
    { href: '/student/create', icon: Plus, label: 'Create', isFab: true },
    { href: '/student/saved', icon: Bookmark, label: 'Saved' },
    { href: '/student/profile', icon: User, label: 'Profile' },
  ];

  const schoolTabs = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review' },
    { href: '/school/featured', icon: Star, label: 'Featured' },
    { href: '/school/organizations', icon: Building2, label: 'Orgs' },
    { href: '/school/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const tabs = variant === 'school' ? schoolTabs : studentTabs;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center justify-around rounded-full bg-[#111118]/80 backdrop-blur-2xl border border-white/[0.08] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {tabs.map((tab: any) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <Link key={tab.href} href={tab.href} className="-mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="h-14 w-14 rounded-full bg-[#DAFB71] flex items-center justify-center shadow-[0_4px_20px_rgba(218,251,113,0.4)] cursor-pointer"
                >
                  <Plus className="h-6 w-6 text-[#08080B] stroke-[2.5]" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-colors cursor-pointer ${
                isActive ? 'text-[#80B0EC]' : 'text-[#B8BBC8]/60 hover:text-[#B8BBC8]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Desktop Sidebar Navigation (for student/school layouts)
// ─────────────────────────────────────────────────
export function DesktopSidebar({ variant = 'student' }: { variant?: 'student' | 'school' }) {
  const pathname = usePathname();

  const studentLinks = [
    { href: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/student/events', icon: Compass, label: 'Explore Events' },
    { href: '/student/create', icon: Plus, label: 'Create' },
    { href: '/student/saved', icon: Bookmark, label: 'Saved Events' },
    { href: '/student/my-events', icon: Star, label: 'My Events' },
    { href: '/student/profile', icon: User, label: 'Profile' },
  ];

  const schoolLinks = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review Queue' },
    { href: '/school/featured', icon: Star, label: 'Featured Events' },
    { href: '/school/organizations', icon: Building2, label: 'Organizations' },
    { href: '/school/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = variant === 'school' ? schoolLinks : studentLinks;

  return (
    <aside className="hidden md:flex w-64 bg-[#0D0D12]/60 backdrop-blur-xl border-r border-white/[0.06] flex-col justify-between p-6 sticky top-16 h-[calc(100vh-64px)] shrink-0">
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                ${isActive
                  ? 'bg-[#80B0EC]/10 text-[#80B0EC] border border-[#80B0EC]/20'
                  : 'text-[#B8BBC8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="space-y-3">
        <div className="border-t border-white/[0.06] pt-4">
          {variant === 'student' ? (
            <Link href="/school/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#B8BBC8] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Shield className="h-4 w-4" />
              School Dashboard
            </Link>
          ) : (
            <Link href="/student/events" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#B8BBC8] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Compass className="h-4 w-4" />
              Student Portal
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

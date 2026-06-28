'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, Bookmark, User, Settings, BarChart3, Shield, Star, ClipboardList, Building2, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────
// Desktop Top Bar (Light mode)
// ─────────────────────────────────────────────────
export function DesktopNav({ variant = 'student' }: { variant?: 'student' | 'school' | 'public' }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const publicLinks = [
    { label: 'About Evida', href: '#about-evida' },
    { label: 'Our Mission', href: '#our-mission' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Featured Events', href: '#explore-categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Calendar', href: '#calendar' },
  ];

  return (
    <>
      <header className={`flex w-full items-center transition-all duration-300 ${
        variant === 'public' 
          ? 'absolute top-0 z-50 h-20 md:h-24 border-none bg-transparent' 
          : 'sticky top-0 z-40 h-16 border-b border-gray-100 bg-white/90 backdrop-blur-xl shadow-sm'
      } ${variant !== 'public' ? 'hidden md:flex' : ''}`}>
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-8 flex items-center justify-between">
          {/* Left side: Logo & Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {variant === 'public' ? (
                <span className="text-3xl font-extrabold tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                  Evida.
                </span>
              ) : (
                <>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-evida-coral)] to-[var(--color-evida-blue)] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                    Evida.
                  </span>
                </>
              )}
            </Link>
            
            {/* Public links */}
            {variant === 'public' && (
              <nav className="hidden lg:flex items-center gap-8 ml-8">
                {publicLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="text-[11px] font-bold text-white/80 hover:text-[var(--color-evida-lime)] uppercase tracking-widest transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {variant === 'public' && (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/login" className="text-xs font-bold text-white hover:text-[var(--color-evida-lime)] uppercase tracking-widest transition-colors flex items-center gap-2">
                    Login
                  </Link>
                  <Link href="/login" className="ml-4 bg-[var(--color-evida-lime)] text-[#111827] px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-sm shadow-[3px_3px_0px_rgba(255,255,255,0.2)]">
                    Get Started
                  </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden text-white hover:text-[var(--color-evida-lime)] p-2 focus:outline-none transition-colors z-55 cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            )}
            {variant === 'student' && (
              <>
                <Link href="/student/create" className="px-4 py-1.5 rounded-full bg-[#4C1D95] text-white text-xs font-medium hover:bg-[#6D28D9] transition-colors">
                  Create Event
                </Link>
                <Link href="/student/profile" className="h-9 w-9 rounded-full bg-[#F5F3FF] border border-[#4C1D95]/20 flex items-center justify-center text-[#4C1D95] text-xs font-bold cursor-pointer">
                  MC
                </Link>
              </>
            )}
            {variant === 'school' && (
              <>
                <Link href="/student/events" className="text-xs font-medium text-[#4C1D95] hover:text-[#6D28D9] transition-colors cursor-pointer">
                  Student Portal
                </Link>
                <div className="h-9 w-9 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 text-xs font-bold">
                  A
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (Public only) */}
      {variant === 'public' && mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0F0F13] z-40 lg:hidden flex flex-col pt-28 px-8 transition-all duration-300 animate-fade-in">
          <nav className="flex flex-col gap-6 text-left">
            {publicLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white hover:text-[var(--color-evida-lime)] uppercase tracking-wider transition-colors py-2 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 mt-12">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 text-sm font-bold text-white border border-white/10 uppercase tracking-widest hover:border-white/30 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 text-sm font-bold bg-[var(--color-evida-lime)] text-[#111827] uppercase tracking-widest hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────
// Mobile Bottom Navigation
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
        className="flex items-center justify-around rounded-full bg-white/90 backdrop-blur-2xl border border-gray-200 px-2 py-2 shadow-lg"
      >
        {tabs.map((tab: any) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <Link key={tab.href} href={tab.href} className="-mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="h-14 w-14 rounded-full bg-[#4C1D95] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <Plus className="h-6 w-6 text-white stroke-[2.5]" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-colors cursor-pointer ${
                isActive ? 'text-[#4C1D95]' : 'text-gray-400 hover:text-[#4C1D95]'
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
// Desktop Sidebar Navigation
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
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between p-6 sticky top-16 h-[calc(100vh-64px)] shrink-0">
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
                  ? 'bg-[#F5F3FF] text-[#4C1D95] border border-[#4C1D95]/10'
                  : 'text-gray-600 hover:text-[#4C1D95] hover:bg-gray-50 border border-transparent'
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        <div className="border-t border-gray-100 pt-4">
          {variant === 'student' ? (
            <Link href="/school/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-gray-500 hover:text-[#4C1D95] hover:bg-gray-50 transition-colors cursor-pointer">
              <Shield className="h-4 w-4" />
              School Dashboard
            </Link>
          ) : (
            <Link href="/student/events" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-gray-500 hover:text-[#4C1D95] hover:bg-gray-50 transition-colors cursor-pointer">
              <Compass className="h-4 w-4" />
              Student Portal
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

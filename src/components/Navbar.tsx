'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, Bookmark, User, Settings, BarChart3, Shield, Star, ClipboardList, Building2, Menu, X, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

import EvidaLogo from '@/components/ui/EvidaLogo';

// ─────────────────────────────────────────────────
// Desktop Top Bar (Light mode)
// ─────────────────────────────────────────────────
export function DesktopNav({ variant = 'student' }: { variant?: 'student' | 'school' | 'public' }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (variant !== 'public') return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const publicLinks = [
    { label: 'About Evida', href: '/about' },
    { label: 'Our Mission', href: '/our-mission' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      <header className={`flex items-center transition-all duration-500 ${
        variant === 'public' 
          ? `fixed top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-50 h-13 md:h-18 mx-auto max-w-7xl rounded-full ${
              scrolled 
                ? 'bg-white/90 backdrop-blur-xl border border-black/[0.05] shadow-[var(--shadow-premium-md)]' 
                : 'bg-white/70 backdrop-blur-md border border-black/[0.03] shadow-[var(--shadow-premium-sm)]'
            }` 
          : 'sticky top-0 z-40 h-16 border-b border-black/[0.04] bg-white/90 backdrop-blur-xl shadow-sm'
      } ${variant !== 'public' ? 'hidden md:flex' : ''}`}>
        <div className="w-full px-5 md:px-8 flex items-center justify-between">
          {/* Left side: Logo & Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <EvidaLogo size={28} lightMode={true} />
            </Link>
            
            {/* Public links */}
            {variant === 'public' && (
              <nav className="hidden lg:flex items-center gap-8 ml-4">
                {publicLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="text-[11px] font-bold uppercase tracking-widest text-[#5A554E] hover:text-[#2A2621] transition-colors duration-300"
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
                  <Link 
                    href="/signup" 
                    className="px-6 py-2.5 font-bold uppercase tracking-widest text-[11px] rounded-full bg-[#FD5C05] text-[#2A2621] shadow-[0_4px_12px_rgba(189,251,4,0.15)] hover:bg-[#CC3D00] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                  <Link
  href="/login"
  className="px-5 py-2 rounded-full border border-[#FD5C05] text-[#2A2621] text-[11px] font-bold uppercase tracking-widest hover:bg-[#FD5C05] hover:text-[#2A2621] transition-colors duration-300"
>
  Sign In
</Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 focus:outline-none text-[#2A2621] hover:text-[#2A2621] transition-colors z-55 cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            )}
            {/* Student Logged In */}
            {variant === 'student' && (
              <>
                <Link href="/student/create" className="px-5 py-2 rounded-full bg-[#FD5C05] text-[#2A2621] text-[11px] font-bold uppercase tracking-wider hover:bg-[#CC3D00] transition-colors shadow-[0_4px_12px_rgba(189,251,4,0.15)]">
                  Create
                </Link>
                <Link href="/student/profile" className="h-9 w-9 rounded-full bg-[#FD5C05]/20 border border-[#FD5C05]/30 flex items-center justify-center text-[#2A2621] text-xs font-bold cursor-pointer">
                  MC
                </Link>
              </>
            )}
            {/* School Logged In */}
            {variant === 'school' && (
              <>
                <Link href="/student/dashboard" className="text-xs font-bold text-[#2A2621] hover:text-[#2A2621] hover:bg-[#FD5C05]/25 px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-colors cursor-pointer">
                  Student Portal
                </Link>
                <Link href="/school/dashboard" className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 border border-black/10 flex items-center justify-center text-[#2A2621] text-xs font-bold hover:bg-black/10 transition-colors">
                  A
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (Public only) */}
      {variant === 'public' && mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden flex flex-col pt-28 px-8 transition-all duration-300 animate-fade-in">
          <nav className="flex flex-col gap-6 text-left">
            {publicLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-[#2A2621] hover:text-[#2A2621] hover:bg-[#FD5C05]/10 rounded-xl px-2 uppercase tracking-wider transition-colors py-2 border-b border-black/[0.04]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 mt-12">
            <Link
  href="/login"
  onClick={() => setMobileMenuOpen(false)}
  className="w-full text-center py-3.5 text-xs font-bold border border-[#FD5C05] text-[#2A2621] rounded-full uppercase tracking-widest hover:bg-[#FD5C05] hover:text-[#2A2621] transition-all"
>
  Sign In
</Link>
            <Link 
              href="/signup" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 text-xs font-bold bg-[#FD5C05] text-[#2A2621] rounded-full uppercase tracking-widest hover:bg-[#CC3D00] shadow-[0_4px_12px_rgba(189,251,4,0.15)] transition-all"
            >
              Sign Up
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
    { href: '/student/explore', icon: Compass, label: 'Explore' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#D8D2BC]/30 pb-5 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center justify-around px-2"
      >
        {tabs.map((tab: any) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
                isActive 
                  ? 'text-[#FD5C05] font-black' 
                  : 'text-[#5A554E] hover:text-[#2A2621]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
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
    { href: '/student/dashboard', icon: Home, label: 'Home' },
    { href: '/student/explore', icon: Compass, label: 'Explore' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/student/profile', icon: User, label: 'Profile' },
    { href: '/student/create', icon: Plus, label: 'Create Event' },
  ];

  const schoolLinks = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review Queue' },
    { href: '/school/featured', icon: Star, label: 'Featured Events' },
    { href: '/school/organizations', icon: Building2, label: 'Organizations' },
    { href: '/school/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = variant === 'school' ? schoolLinks : studentLinks;
  const activeColorClass = 'bg-[#FD5C05] text-[#2A2621] border-[#FD5C05]/30 font-extrabold shadow-sm';
  const hoverColorClass = 'hover:text-[#2A2621] hover:bg-[#FD5C05]/10';

  return (
    <aside className="hidden md:flex w-64 bg-[#D8D2BC] border-r border-black/[0.04] flex-col justify-between p-6 sticky top-16 h-[calc(100vh-64px)] shrink-0">
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border
                ${isActive
                  ? `${activeColorClass}`
                  : `text-[#5A554E] ${hoverColorClass} border-transparent`
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
        <div className="border-t border-black/[0.04] pt-4">
          {variant === 'student' ? (
            <Link href="/school/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer">
              <Shield className="h-4 w-4" />
              School Dashboard
            </Link>
          ) : (
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer">
              <Home className="h-4 w-4" />
              Student Portal
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

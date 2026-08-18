'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, User, Settings, BarChart3, Shield, Star, ClipboardList, Building2, Menu, X, Calendar, ChevronDown, ChevronLeft, ChevronRight, Bell, Bookmark, Megaphone, Users, Sparkles, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { useRouter } from 'next/navigation';
import EvidaLogo from '@/components/ui/EvidaLogo';

// ─────────────────────────────────────────────────
// Desktop Top Bar (Light mode)
// ─────────────────────────────────────────────────
export function DesktopNav({ 
  variant = 'student',
  isSidebarHidden = false,
  onShowSidebar,
  onOpenDrawer
}: { 
  variant?: 'student' | 'school' | 'public';
  isSidebarHidden?: boolean;
  onShowSidebar?: () => void;
  onOpenDrawer?: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (variant !== 'public') return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
          : 'sticky top-0 z-40 h-16 border-b border-black/[0.05] bg-[#FAF9F5]/90 backdrop-blur-xl shadow-xs'
      } ${variant !== 'public' ? 'hidden md:flex' : ''}`}>
        <div className="w-full px-5 md:px-8 flex items-center justify-between">
          {/* Left side: Logo & Links */}
          <div className="flex items-center gap-4 lg:gap-10">
            {/* Sidebar toggle buttons */}
            {variant !== 'public' && (
              <div className="flex items-center gap-2">
                {/* iPad drawer trigger: visible only on md:max-lg */}
                <button
                  onClick={onOpenDrawer}
                  className="md:max-lg:flex hidden p-2 rounded-xl text-[#5A554E] hover:bg-black/5 hover:text-[#FD5C05] transition-all cursor-pointer border border-black/[0.04] bg-white/70"
                  title="Open Menu"
                >
                  <Menu className="h-4.5 w-4.5" />
                </button>

                {/* Laptop sidebar trigger: visible on lg and up only when sidebar is hidden */}
                {isSidebarHidden && (
                  <button
                    onClick={onShowSidebar}
                    className="lg:flex hidden p-2 rounded-xl text-[#5A554E] hover:bg-black/5 hover:text-[#FD5C05] transition-all cursor-pointer border border-black/[0.04] bg-white/70"
                    title="Expand Sidebar"
                  >
                    <Menu className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <EvidaLogo size={32} lightMode={true} />
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
                    className="px-6 py-2.5 font-black uppercase tracking-widest text-[11px] rounded-full bg-[#FD5C05] text-white shadow-[0_4px_14px_rgba(253,92,5,0.35)] hover:bg-[#CC3D00] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-full border border-[#FD5C05] text-[#2A2621] text-[11px] font-bold uppercase tracking-widest hover:bg-[#FD5C05] hover:text-white transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 focus:outline-none text-[#2A2621] hover:text-[#FD5C05] transition-colors z-55 cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            )}
            {/* Student Logged In */}
            {variant === 'student' && (
              <div className="flex items-center gap-3">
                <Link href="/student/create" className="px-5 py-2 rounded-full bg-[#FD5C05] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#CC3D00] transition-all shadow-[0_4px_14px_rgba(253,92,5,0.35)] hover:scale-[1.02] active:scale-[0.98]">
                  Create
                </Link>
                <NotificationBell />
                <Link 
                  href="/student/settings" 
                  className="h-9 w-9 rounded-full bg-[#EAE4CF]/40 border border-[#2A2621]/10 hover:bg-[#EAE4CF]/60 hover:border-[#FD5C05]/30 transition-all flex items-center justify-center text-[#2A2621] cursor-pointer shadow-sm shrink-0"
                  title="Settings"
                >
                  <Settings className="h-4.5 w-4.5" />
                </Link>
                <ProfileSwitcher />
              </div>
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
export const MobileBottomNav = React.memo(function MobileBottomNav({ variant = 'student' }: { variant?: 'student' | 'school' }) {
  const pathname = usePathname();
  const { activeProfile } = useUser();
  const [isPreview, setIsPreview] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'true' || window.self !== window.top || document.body.classList.contains('preview-mode')) {
        setIsPreview(true);
      }
    }
  }, []);

  const profileHref = activeProfile?.type === 'organization' && activeProfile.orgId
    ? `/student/organizations/${activeProfile.orgId}`
    : '/student/profile';

  const studentTabs = [
    { href: '/student/dashboard', icon: Home, label: 'Home' },
    { href: '/student/explore', icon: Compass, label: 'Explore', disabledInPreview: true },
    { href: '/student/create', icon: Plus, label: 'Create', isSpecial: true, disabledInPreview: true },
    { href: '/student/calendar', icon: Calendar, label: 'Calendar', disabledInPreview: true },
    { href: profileHref, icon: User, label: activeProfile?.type === 'organization' ? 'Org Profile' : 'Profile', disabledInPreview: true },
  ];

  const schoolTabs = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review' },
    { href: '/school/featured', icon: Star, label: 'Featured' },
    { href: '/school/organizations', icon: Building2, label: 'Orgs' },
  ];

  const tabs = variant === 'school' ? schoolTabs : studentTabs;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-xl border-t border-black/[0.05] pb-3 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="grid grid-cols-5 items-center w-full px-1"
      >
        {tabs.map((tab: any) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;
          const isDisabled = isPreview && tab.disabledInPreview;

          if (tab.isSpecial) {
            return (
              <div key={tab.href} className="col-span-1 flex flex-col items-center justify-center">
                {isDisabled ? (
                  <div
                    className="relative -top-2.5 flex flex-col items-center justify-center cursor-not-allowed opacity-40 font-sans select-none"
                    onClick={(e) => e.preventDefault()}
                    title="Disabled during demo"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-400 text-white flex items-center justify-center shadow-sm">
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-[#5A554E] mt-1">{tab.label}</span>
                  </div>
                ) : (
                  <Link
                    href={tab.href}
                    className="relative -top-2.5 flex flex-col items-center justify-center cursor-pointer group font-sans"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#FD5C05] hover:bg-[#CC3D00] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 duration-200">
                      <Icon className="h-5 w-5 stroke-[3]" />
                    </div>
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-[#5A554E] group-hover:text-[#2A2621] mt-1">{tab.label}</span>
                  </Link>
                )}
              </div>
            );
          }

          if (isDisabled) {
            return (
              <div
                key={tab.href}
                onClick={(e) => e.preventDefault()}
                className="col-span-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1 text-gray-400 opacity-40 cursor-not-allowed select-none"
                title="Disabled during demo"
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-center">{tab.label}</span>
              </div>
            );
          }

          const targetHref = isPreview && tab.href === '/student/dashboard' ? '/student/dashboard?preview=true' : tab.href;

          return (
            <Link
              key={tab.href}
              href={targetHref}
              className={`col-span-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1 transition-colors cursor-pointer ${
                isActive 
                  ? 'text-[#FD5C05] font-black' 
                  : 'text-[#5A554E] hover:text-[#2A2621]'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-center">{tab.label}</span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
});

// ─────────────────────────────────────────────────
// Desktop Sidebar Navigation
// ─────────────────────────────────────────────────
export function DesktopSidebar({ 
  variant = 'student',
  state = 'expanded',
  onChangeState
}: { 
  variant?: 'student' | 'school';
  state?: 'expanded' | 'collapsed' | 'hidden';
  onChangeState?: (state: 'expanded' | 'collapsed' | 'hidden') => void;
}) {
  const pathname = usePathname();
  const { logout, activeProfile } = useUser();

  const profileHref = activeProfile?.type === 'organization' && activeProfile.orgId
    ? `/student/organizations/${activeProfile.orgId}`
    : '/student/profile';

  const studentLinks = [
    { href: '/student/dashboard', icon: Home, label: 'Home' },
    { href: '/student/explore', icon: Compass, label: 'Explore' },
    { href: '/student/calendar', icon: Calendar, label: 'Calendar' },
    { href: profileHref, icon: User, label: activeProfile?.type === 'organization' ? 'Org Profile' : 'Profile' },
    { href: '/student/create', icon: Plus, label: 'Create Event' },
  ];

  const schoolLinks = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review Queue' },
    { href: '/school/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/school/organizations', icon: Building2, label: 'Organizations' },
  ];

  const links = variant === 'school' ? schoolLinks : studentLinks;

  if (state === 'hidden') return null;

  return (
    <aside className={`
      hidden lg:flex flex-col justify-between p-5 bg-[#FAF9F5] border-r border-black/[0.05] shadow-xs sticky top-16 h-[calc(100vh-64px)] shrink-0 transition-all duration-300 relative z-30
      ${state === 'expanded' ? 'w-64' : 'w-20 px-3'}
    `}>
      <div className="space-y-4">
        {/* Sidebar Controls */}
        {onChangeState && (
          <div className={`flex items-center pb-3.5 mb-2 border-b border-[#D8D2BC]/60 ${
            state === 'collapsed' ? 'flex-col gap-3 justify-center' : 'justify-between'
          }`}>
            {state === 'expanded' && (
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5A554E]">
                Navigation Menu
              </span>
            )}
            <div className="flex items-center gap-1.5">
              {/* Collapse/Expand Toggle */}
              <button
                onClick={() => onChangeState(state === 'expanded' ? 'collapsed' : 'expanded')}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#5A554E] hover:text-[#FD5C05] transition-all cursor-pointer"
                title={state === 'expanded' ? 'Collapse Sidebar' : 'Expand Sidebar'}
              >
                {state === 'expanded' ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {/* Hide Sidebar Button */}
              <button
                onClick={() => onChangeState('hidden')}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#5A554E] hover:text-[#FD5C05] transition-all cursor-pointer"
                title="Hide Sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isProfile = link.href === '/student/profile';
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                title={state === 'collapsed' ? link.label : undefined}
                className={`
                  relative flex items-center rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border select-none group
                  ${state === 'collapsed' ? 'justify-center p-2.5 w-10 h-10 mx-auto' : 'gap-3 px-3.5 py-2.5'}
                  ${isActive
                    ? isProfile
                      ? 'bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] text-white font-black shadow-md shadow-[#FD5C05]/30 border-transparent ring-2 ring-[#FD5C05]/40 scale-[1.02]'
                      : 'bg-[#2A2621] text-white font-black shadow-sm border-[#2A2621] ring-1 ring-black/10'
                    : 'text-[#5A554E] hover:text-[#2A2621] hover:bg-[#FD5C05]/15 border-transparent hover:translate-x-1'
                  }
                `}
              >
                {/* Active left indicator pill */}
                {isActive && !isProfile && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FD5C05] rounded-r-full shadow-[0_0_8px_rgba(253,92,5,0.8)]" />
                )}
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${isActive && isProfile ? 'text-white' : ''}`} />
                {state !== 'collapsed' && (
                  <span className="truncate">{link.label}</span>
                )}
                {state !== 'collapsed' && isActive && isProfile && (
                  <span className="ml-auto text-[8px] font-black uppercase tracking-wider bg-white text-[#FD5C05] px-1.5 py-0.5 rounded-full shadow-xs">
                    ACTIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="border-t border-black/[0.04] pt-4 space-y-1">
          {variant === 'student' ? (
            <Link 
              href="/school/dashboard" 
              title={state === 'collapsed' ? "School Dashboard" : undefined}
              className={`flex items-center rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer ${
                state === 'collapsed' ? 'justify-center p-2.5 w-10 h-10 mx-auto' : 'gap-3 px-4 py-2.5'
              }`}
            >
              <Shield className="h-4 w-4 shrink-0" />
              {state !== 'collapsed' && <span>School Dashboard</span>}
            </Link>
          ) : (
            <Link 
              href="/student/dashboard" 
              title={state === 'collapsed' ? "Student Portal" : undefined}
              className={`flex items-center rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer ${
                state === 'collapsed' ? 'justify-center p-2.5 w-10 h-10 mx-auto' : 'gap-3 px-4 py-2.5'
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              {state !== 'collapsed' && <span>Student Portal</span>}
            </Link>
          )}

          <button 
            onClick={logout}
            title={state === 'collapsed' ? "Sign Out" : undefined}
            className={`w-full flex items-center rounded-xl text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer border-none bg-transparent ${
              state === 'collapsed' ? 'justify-center p-2.5 w-10 h-10 mx-auto' : 'gap-3 px-4 py-2.5'
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-500" />
            {state !== 'collapsed' && <span className="font-extrabold">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────
// Tablet Drawer Sidebar (Slide-over Drawer for md:max-lg viewports)
// ─────────────────────────────────────────────────
export function TabletDrawerSidebar({ 
  variant = 'student', 
  isOpen, 
  onClose 
}: { 
  variant?: 'student' | 'school'; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const pathname = usePathname();
  const { logout, activeProfile } = useUser();

  const profileHref = activeProfile?.type === 'organization' && activeProfile.orgId
    ? `/student/organizations/${activeProfile.orgId}`
    : '/student/profile';

  const studentLinks = [
    { href: '/student/dashboard', icon: Home, label: 'Home' },
    { href: '/student/explore', icon: Compass, label: 'Explore' },
    { href: '/student/calendar', icon: Calendar, label: 'Calendar' },
    { href: profileHref, icon: User, label: activeProfile?.type === 'organization' ? 'Org Profile' : 'Profile' },
    { href: '/student/create', icon: Plus, label: 'Create Event' },
  ];

  const schoolLinks = [
    { href: '/school/dashboard', icon: Home, label: 'Overview' },
    { href: '/school/review', icon: ClipboardList, label: 'Review Queue' },
    { href: '/school/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/school/organizations', icon: Building2, label: 'Organizations' },
  ];

  const links = variant === 'school' ? schoolLinks : studentLinks;
  const activeColorClass = 'bg-[#FD5C05] text-[#2A2621] border-[#FD5C05]/30 font-extrabold shadow-sm';
  const hoverColorClass = 'hover:text-[#2A2621] hover:bg-[#FD5C05]/10';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
          />
          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 z-55 w-64 bg-[#FAF9F5] border-r border-black/[0.04] flex flex-col justify-between p-6 shadow-2xl lg:hidden text-left"
          >
            <div className="space-y-4">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                <span className="text-xs font-black uppercase tracking-widest text-[#2A2621]">
                  Menu
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#5A554E] hover:text-[#FD5C05] transition-all cursor-pointer"
                  title="Close Menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <nav className="space-y-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
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
            </div>

            <div className="space-y-3">
              <div className="border-t border-black/[0.04] pt-4 space-y-1">
                {variant === 'student' ? (
                  <Link 
                    href="/school/dashboard" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer"
                  >
                    <Shield className="h-4 w-4" />
                    School Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/student/dashboard" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer"
                  >
                    <Home className="h-4 w-4" />
                    Student Portal
                  </Link>
                )}
                <button 
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function getTailwindBgColor(color: string) {
  const mapping: Record<string, string> = {
    indigo: '#6366f1',
    sky: '#0ea5e9',
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    teal: '#14b8a6'
  };
  return mapping[color] || '#FD5C05';
}

export function ProfileSwitcher() {
  const router = useRouter();
  const { currentUser, activeProfile, setActiveProfile, logout } = useUser();
  const { organizations } = useEvents();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Filter organizations the user is member of/officer of
  const myOrgs = organizations.filter(org => {
    if (!currentUser) return false;
    const isIdMatch = (currentUser.organizations || []).includes(org.id);
    const isMemberName = org.members?.some(m => m?.toLowerCase() === currentUser.name?.toLowerCase());
    const isMemberUsername = Boolean(currentUser.username && org.members?.some(m => m?.toLowerCase() === currentUser.username?.toLowerCase()));
    const isCreator = Boolean(
      org.creatorUsername && (
        org.creatorUsername.toLowerCase() === currentUser.username?.toLowerCase() ||
        org.creatorUsername.toLowerCase() === currentUser.name?.toLowerCase()
      )
    );
    const hasRole = Boolean(
      (currentUser.name && org.memberRoles?.[currentUser.name]) ||
      (currentUser.username && org.memberRoles?.[currentUser.username])
    );
    return isIdMatch || isMemberName || isMemberUsername || isCreator || hasRole;
  });

  const handleSwitchToStudent = () => {
    setActiveProfile({ type: 'student' });
    setDropdownOpen(false);
    router.push('/student/dashboard');
    router.refresh();
  };

  const handleSwitchToOrg = (orgId: string, name: string) => {
    setActiveProfile({ type: 'organization', orgId, name });
    setDropdownOpen(false);
    router.push(`/student/organizations/${orgId}`);
    router.refresh();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 px-3 rounded-full bg-[#EAE4CF]/40 border border-[#2A2621]/10 hover:bg-[#EAE4CF]/60 hover:border-[#FD5C05]/30 transition-all cursor-pointer shadow-sm text-left"
      >
        {activeProfile.type === 'student' ? (
          <>
            <div className="h-7 w-7 rounded-full bg-[#FD5C05]/20 border border-[#FD5C05]/30 flex items-center justify-center text-[#2A2621] text-xs font-black select-none shrink-0">
              {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0 pr-1 select-none text-left">
              <p className="text-[9.5px] font-bold text-[#2A2621] leading-none whitespace-nowrap truncate max-w-[110px]">{currentUser.name}</p>
              <p className="text-[8px] text-[#5A554E] font-medium leading-none uppercase tracking-wider mt-0.5">Student Profile</p>
            </div>
          </>
        ) : (
          <>
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm"
              style={{
                backgroundColor:
                  activeProfile.orgId &&
                  organizations.find(o => o.id === activeProfile.orgId)?.logoColor
                    ? getTailwindBgColor(organizations.find(o => o.id === activeProfile.orgId)?.logoColor || 'indigo')
                    : '#FD5C05'
              }}
            >
              {activeProfile.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0 pr-1 select-none text-left">
              <p className="text-[9.5px] font-bold text-[#2A2621] leading-none whitespace-nowrap truncate max-w-[110px]">{activeProfile.name}</p>
              <p className="text-[8px] text-[#FD5C05] font-black leading-none uppercase tracking-widest flex items-center gap-0.5 mt-0.5">
                Active Org Profile
              </p>
            </div>
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-[#5A554E]" />
      </button>

      {/* Switcher Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white border border-black/[0.06] shadow-lg z-50 overflow-hidden divide-y divide-black/[0.04] text-left"
          >
            {/* Header info */}
            <div className="p-3 bg-[#EAE4CF]/20">
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#5A554E]">Current Identity</p>
              <p className="text-xs font-black text-[#2A2621] mt-0.5 truncate">
                {activeProfile.type === 'student' ? currentUser.name : activeProfile.name}
              </p>
            </div>

            {/* List options */}
            <div className="p-1.5 space-y-1">
              <button
                onClick={handleSwitchToStudent}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer text-xs ${
                  activeProfile.type === 'student'
                    ? 'bg-[#FD5C05]/10 text-[#FD5C05] font-extrabold'
                    : 'text-[#2A2621] hover:bg-[#EAE4CF]/20 font-semibold'
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-[#FD5C05]/20 flex items-center justify-center text-[#2A2621] text-[10px] font-bold">
                  {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[8px] text-[#5A554E] leading-none uppercase">Student</p>
                </div>
                {activeProfile.type === 'student' && <span className="text-xs">✓</span>}
              </button>

              {myOrgs.map(org => {
                const isActive = activeProfile.type === 'organization' && activeProfile.orgId === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchToOrg(org.id, org.name)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-[#FD5C05]/10 text-[#FD5C05] font-extrabold'
                        : 'text-[#2A2621] hover:bg-[#EAE4CF]/20 font-semibold'
                    }`}
                  >
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0"
                      style={{ backgroundColor: getTailwindBgColor(org.logoColor) }}
                    >
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate leading-tight">{org.name}</p>
                      <p className="text-[8px] text-[#5A554E] leading-none uppercase">Organization</p>
                    </div>
                    {isActive && <span className="text-xs">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Always visible Create Organization & Sign Out Actions */}
            <div className="p-1.5 space-y-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push('/student/organizations/create');
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FD5C05]/10 text-[#FD5C05] font-extrabold text-xs cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4 text-[#FD5C05] stroke-[3]" />
                <span className="truncate">Create New Organization</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-extrabold text-xs cursor-pointer transition-all border-none bg-transparent"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span className="truncate">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NotificationBell() {
  const { notifications, markNotificationRead, clearNotification } = useEvents();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      const unreadList = notifications.filter(n => !n.read);
      await Promise.all(unreadList.map(notif => markNotificationRead(notif.id)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm relative shrink-0 ${
          dropdownOpen 
            ? 'bg-[#FD5C05]/10 border-[#FD5C05]/30 text-[#FD5C05]' 
            : 'bg-[#EAE4CF]/40 border-[#2A2621]/10 text-[#2A2621] hover:bg-[#EAE4CF]/60 hover:border-[#FD5C05]/30'
        }`}
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed sm:absolute top-16 sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2.5 sm:w-80 rounded-2xl bg-white border border-black/[0.08] shadow-2xl z-50 overflow-hidden divide-y divide-black/[0.04] text-left font-sans"
          >
            {/* Header */}
            <div className="p-3 bg-[#EAE4CF]/20 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A554E] flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#FD5C05]" /> Notifications ({unreadCount} unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[9px] font-black uppercase text-[#FD5C05] hover:text-[#CC3D00] transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-black/[0.03] p-1.5 space-y-1">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl transition-all relative flex flex-col gap-1 text-xs ${
                      notif.read ? 'opacity-65 hover:bg-black/[0.01]' : 'bg-[#FD5C05]/5 font-semibold hover:bg-[#FD5C05]/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-extrabold text-[#2A2621] uppercase text-[9px] tracking-wider">
                        {notif.title}
                      </p>
                      <button
                        onClick={() => clearNotification(notif.id)}
                        className="text-[#5A554E] hover:text-[#2A2621] text-[9px] font-bold"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-[#2A2621] leading-relaxed font-semibold">{notif.message}</p>
                    <div className="flex justify-between items-center mt-1 text-[8px] text-[#5A554E] font-medium">
                      <span>{notif.timestamp}</span>
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[#FD5C05] font-black uppercase"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#5A554E] font-medium">
                  No new notifications.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

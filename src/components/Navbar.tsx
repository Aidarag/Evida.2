'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, Bookmark, User, Settings, BarChart3, Shield, Star, ClipboardList, Building2, Menu, X, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';

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
                <ProfileSwitcher />
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
    { href: '/student/calendar', icon: Calendar, label: 'Calendar' },
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
    { href: '/student/calendar', icon: Calendar, label: 'Calendar' },
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
  const { currentUser, activeProfile, setActiveProfile } = useUser();
  const { organizations, createOrg } = useEvents();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // Form states for creating org
  const [orgName, setOrgName] = React.useState('');
  const [orgDesc, setOrgDesc] = React.useState('');
  const [orgColor, setOrgColor] = React.useState('indigo');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
  const myOrgs = organizations.filter(org => currentUser.organizations?.includes(org.id));

  const handleSwitchToStudent = () => {
    setActiveProfile({ type: 'student' });
    setDropdownOpen(false);
  };

  const handleSwitchToOrg = (orgId: string, name: string) => {
    setActiveProfile({ type: 'organization', orgId, name });
    setDropdownOpen(false);
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !orgDesc.trim()) return;
    setIsSubmitting(true);
    try {
      const newOrg = await createOrg({
        name: orgName.trim(),
        description: orgDesc.trim(),
        logoColor: orgColor
      });
      if (newOrg) {
        // Automatically switch active profile to the new organization!
        setActiveProfile({
          type: 'organization',
          orgId: newOrg.id,
          name: newOrg.name
        });
        setCreateModalOpen(false);
        setOrgName('');
        setOrgDesc('');
        setOrgColor('indigo');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="hidden sm:block min-w-0 pr-1 select-none">
              <p className="text-[10px] font-bold text-[#2A2621] leading-tight truncate">{currentUser.name}</p>
              <p className="text-[8px] text-[#5A554E] font-medium leading-none uppercase tracking-wider">Student Profile</p>
            </div>
          </>
        ) : (
          <>
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-black select-none shrink-0 shadow-sm"
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
            <div className="hidden sm:block min-w-0 pr-1 select-none">
              <p className="text-[10px] font-bold text-[#2A2621] leading-tight truncate">{activeProfile.name}</p>
              <p className="text-[8px] text-[#FD5C05] font-black leading-none uppercase tracking-widest flex items-center gap-0.5">
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

            {/* Action options */}
            <div className="p-1.5 space-y-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setCreateModalOpen(true);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#EAE4CF]/20 text-[#2A2621] font-bold text-xs cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4 text-[#FD5C05] stroke-[3]" />
                <span className="truncate">Create Organization</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Organization Modal Overlay */}
      {createModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#D8D2BC] border border-[#2A2621]/10 w-full max-w-md rounded-3xl p-6 shadow-xl space-y-5"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#2A2621] uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Create Org Profile
              </h3>
              <p className="text-xs text-[#5A554E] font-medium leading-relaxed">
                Establish a new organization identity to manage events, announcements, and officers.
              </p>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Bears Coding Club"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full bg-white border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your organization's mission, goals, and target audience..."
                  value={orgDesc}
                  onChange={e => setOrgDesc(e.target.value)}
                  className="w-full bg-white border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] resize-none"
                />
              </div>

              {/* Color selection */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">
                  Branding Color Accent
                </label>
                <div className="flex gap-2.5">
                  {['indigo', 'sky', 'emerald', 'violet', 'amber', 'rose', 'teal'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setOrgColor(color)}
                      className={`h-6 w-6 rounded-full cursor-pointer transition-all border-2 ${
                        orgColor === color 
                          ? 'border-[#2A2621] scale-110 shadow-sm' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: getTailwindBgColor(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.04] flex gap-3.5 justify-end">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#5A554E] hover:text-[#2A2621]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-55"
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

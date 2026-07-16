'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Bell, 
  Shield, 
  Lock, 
  Building, 
  Users, 
  Moon, 
  Globe, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Mail, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Info, 
  Check, 
  LogOut,
  Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface SettingsItem {
  id: string;
  label: string;
  value?: string;
  Icon: React.ComponentType<any>;
  bgColor: string;
  onClick: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function StudentSettingsPage() {
  const { currentUser, logout } = useUser();
  const router = useRouter();

  // Overlay modaldialog state triggers
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notifConfig, setNotifConfig] = useState({
    push: true,
    email: true,
    reminders: true
  });
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('light');

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', value: 'MC', Icon: User, bgColor: '#FD5C05', onClick: () => router.push('/student/profile') },
        { id: 'notifications', label: 'Notifications', value: 'On', Icon: Bell, bgColor: '#3b82f6', onClick: () => setActiveModal('notifications') },
        { id: 'privacy', label: 'Privacy & Security', value: 'Private', Icon: Lock, bgColor: '#10b981', onClick: () => setActiveModal('privacy') },
        { id: 'college', label: 'Linked College', value: currentUser.school || 'Livingstone College', Icon: Building, bgColor: '#8b5cf6', onClick: () => setActiveModal('college') },
        { id: 'orgs', label: 'Connected Organizations', value: `${currentUser.organizations?.length || 0} Joined`, Icon: Users, bgColor: '#ec4899', onClick: () => setActiveModal('orgs') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'appearance', label: 'Appearance', value: appearance.toUpperCase(), Icon: Moon, bgColor: '#6b7280', onClick: () => setActiveModal('appearance') },
        { id: 'language', label: 'Language', value: 'English (US)', Icon: Globe, bgColor: '#14b8a6', onClick: () => setActiveModal('language') },
        { id: 'calendar', label: 'Calendar Integration', value: 'iCal Enabled', Icon: Calendar, bgColor: '#f59e0b', onClick: () => setActiveModal('calendar') },
        { id: 'reminders', label: 'Reminder Preferences', value: '24h Prior', Icon: Clock, bgColor: '#a855f7', onClick: () => setActiveModal('reminders') },
      ]
    },
    {
      title: 'Help & Support',
      items: [
        { id: 'help', label: 'Help Center', Icon: HelpCircle, bgColor: '#06b6d4', onClick: () => setActiveModal('help') },
        { id: 'contact', label: 'Contact Support', Icon: Mail, bgColor: '#3b82f6', onClick: () => setActiveModal('contact') },
        { id: 'report', label: 'Report a Problem', Icon: AlertTriangle, bgColor: '#ef4444', onClick: () => setActiveModal('report') },
        { id: 'feedback', label: 'Send Feedback', Icon: MessageSquare, bgColor: '#10b981', onClick: () => setActiveModal('feedback') },
      ]
    },
    {
      title: 'Legal',
      items: [
        { id: 'terms', label: 'Terms of Service', Icon: FileText, bgColor: '#6b7280', onClick: () => setActiveModal('terms') },
        { id: 'policy', label: 'Privacy Policy', Icon: Lock, bgColor: '#374151', onClick: () => setActiveModal('policy') },
        { id: 'accessibility', label: 'Accessibility', Icon: Info, bgColor: '#4b5563', onClick: () => setActiveModal('accessibility') },
      ]
    },
    {
      title: 'About',
      items: [
        { id: 'version', label: 'App Version', value: 'v2.4.0 (Stable)', Icon: Info, bgColor: '#9ca3af', onClick: () => {} },
        { id: 'new', label: 'What’s New', Icon: Sparkles, bgColor: '#FD5C05', onClick: () => setActiveModal('new') },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F0] text-[#2A2621] font-sans pb-32">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        
        {/* ── Native Grouped Settings Header ── */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
          <button 
            onClick={() => router.push('/student/profile')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#5A554E] hover:text-[#2A2621] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <h1 className="text-sm font-black uppercase tracking-widest text-[#2A2621]">
            Settings
          </h1>
          
          <div className="w-12" /> {/* spacer balance */}
        </div>

        {/* ── Grouped Sections ── */}
        <div className="space-y-6">
          {sections.map(sec => (
            <div key={sec.title} className="space-y-1.5 text-left">
              <h3 className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest pl-4">
                {sec.title}
              </h3>
              
              <div className="bg-white border border-black/[0.03] rounded-2xl overflow-hidden shadow-sm divide-y divide-black/[0.04]">
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/70 active:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs shrink-0 shadow-sm"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <item.Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-[#2A2621] uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#5A554E]/60 text-[10px] font-bold">
                      {item.value && <span className="truncate max-w-[120px]">{item.value}</span>}
                      <ChevronRight className="h-4 w-4 text-[#5A554E]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Independent Native Sign Out ── */}
        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl py-4 text-center text-xs font-black uppercase tracking-wider text-red-600 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
            Sign Out
          </button>
        </div>

      </div>

      {/* ── Sub-Modals overlay for preferences / help configs ── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-black/10 shadow-xl max-w-sm w-full p-6 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2A2621]">{activeModal} Configuration</h4>
                <button onClick={() => setActiveModal(null)} className="text-red-500 text-xs font-bold hover:underline cursor-pointer">Close</button>
              </div>

              {activeModal === 'notifications' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Push Alerts</p>
                      <p className="text-[10px] text-[#5A554E]">Recieve updates on your device</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.push}
                      onChange={e => setNotifConfig(p => ({ ...p, push: e.target.checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Email Digest</p>
                      <p className="text-[10px] text-[#5A554E]">Weekly digests of saved events</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.email}
                      onChange={e => setNotifConfig(p => ({ ...p, email: e.target.checked }))}
                    />
                  </div>
                </div>
              )}

              {activeModal === 'appearance' && (
                <div className="grid grid-cols-3 gap-2">
                  {['light', 'dark', 'system'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setAppearance(mode as any)}
                      className={`py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                        appearance === mode ? 'bg-[#FD5C05] text-[#2A2621] border-[#FD5C05]' : 'bg-slate-50 border-black/5 hover:bg-slate-100 text-[#5A554E]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}

              {activeModal === 'college' && (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold uppercase text-[9px] text-[#5A554E]">Connected Campus</p>
                  <p className="font-extrabold text-[#2A2621]">{currentUser.school || 'Livingstone College'}</p>
                  <p className="text-[10px] text-[#5A554E]">Your account is verified under this institution's official email domain directory.</p>
                </div>
              )}

              {activeModal === 'orgs' && (
                <div className="space-y-2 text-xs">
                  <p className="font-bold uppercase text-[9px] text-[#5A554E]">Your Roles</p>
                  {currentUser.organizations?.length > 0 ? (
                    currentUser.organizations.map((orgId, idx) => (
                      <div key={orgId} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="font-bold uppercase text-[9px]">{orgId}</span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#5A554E] italic">Not registered under any campus organizations.</p>
                  )}
                </div>
              )}

              {['privacy', 'language', 'calendar', 'reminders', 'help', 'contact', 'report', 'feedback', 'terms', 'policy', 'accessibility', 'new'].includes(activeModal) && (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold uppercase text-[9px] text-[#5A554E]">System Details</p>
                  <p className="text-[10px] text-[#5A554E] leading-relaxed">
                    This section connects directly to Livingstone College campus directory resources. Support and legal terms are governed by Evida's university partnership guidelines.
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="w-full bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] border-none font-bold"
                onClick={() => setActiveModal(null)}
              >
                Done
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

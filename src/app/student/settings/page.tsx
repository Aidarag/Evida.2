'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Bell, 
  Lock, 
  Building, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  LogOut,
  Shield,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

import { useEvents } from '@/lib/context/EventContext';

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
  const { currentUser, setCurrentUser, logout, setActiveProfile } = useUser();
  const { organizations, refetch, createOrg } = useEvents();
  const router = useRouter();

  // Overlay modal state triggers
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notifConfig, setNotifConfig] = useState({
    push: true,
    email: true,
    reminders: true
  });

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [newOrgCategory, setNewOrgCategory] = useState('Academic');
  const [isSubmittingOrg, setIsSubmittingOrg] = useState(false);
  const [requestingVerifyId, setRequestingVerifyId] = useState<string | null>(null);

  if (!currentUser) return null;

  const userOrgs = organizations.filter(
    (o) => currentUser.organizations?.includes(o.id) || o.members?.includes(currentUser.name)
  );

  const getOrgStatusSummary = () => {
    if (userOrgs.length === 0) return 'No Orgs';
    const hasVerified = userOrgs.some((o) => o.verified || o.verificationStatus === 'verified');
    if (hasVerified) return 'Verified ✓';
    const hasPending = userOrgs.some((o) => o.verificationStatus === 'pending');
    if (hasPending) return 'Pending Review';
    return 'Unverified';
  };

  const handleRequestVerification = async (orgId: string) => {
    setRequestingVerifyId(orgId);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-verification', id: orgId }),
      });
      if (res.ok) {
        await refetch();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequestingVerifyId(null);
    }
  };

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgDesc) return;
    setIsSubmittingOrg(true);
    try {
      const created = await createOrg({
        name: newOrgName,
        description: newOrgDesc,
        category: newOrgCategory,
        member: currentUser.name,
      }) as any;
      
      setNewOrgName('');
      setNewOrgDesc('');
      setActiveModal(null);
      
      if (created && created.id) {
        setActiveProfile({
          type: 'organization',
          orgId: created.id,
          name: created.name
        });
        router.push(`/organization/${created.id}/dashboard`);
      }
    } catch (err) {
      console.error('Failed to create organization', err);
    } finally {
      setIsSubmittingOrg(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const updatePrivacy = async (key: 'going' | 'saved' | 'hosted' | 'organizations', value: 'public' | 'private') => {
    const updatedPrivacy = {
      ...(currentUser.privacy || {}),
      [key]: value
    };

    const updatedUser = {
      ...currentUser,
      privacy: updatedPrivacy
    };

    setCurrentUser(updatedUser);

    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          privacy: updatedPrivacy
        })
      });
    } catch (e) {
      console.error('Failed to save privacy settings:', e);
    }
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', value: currentUser.avatar || 'MC', Icon: User, bgColor: '#FD5C05', onClick: () => router.push('/student/profile') },
        { id: 'create-org', label: 'Create Organization', Icon: Building, bgColor: '#FD5C05', onClick: () => setActiveModal('create-org') },
        { id: 'org-verification', label: 'Organization Verification', value: getOrgStatusSummary(), Icon: Shield, bgColor: '#FD5C05', onClick: () => setActiveModal('org-verification') },
        { id: 'notifications', label: 'Notifications', value: 'On', Icon: Bell, bgColor: '#FD5C05', onClick: () => setActiveModal('notifications') },
        { id: 'privacy', label: 'Privacy & Security', value: 'Private', Icon: Lock, bgColor: '#FD5C05', onClick: () => setActiveModal('privacy') },
        { id: 'college', label: 'Linked College', value: currentUser.school || 'Livingstone College', Icon: Building, bgColor: '#FD5C05', onClick: () => setActiveModal('college') },
      ]
    },
    {
      title: 'Support & Feedback',
      items: [
        { id: 'report', label: 'Report a Problem', Icon: AlertTriangle, bgColor: '#FD5C05', onClick: () => setActiveModal('report') },
        { id: 'feedback', label: 'Send Feedback', Icon: MessageSquare, bgColor: '#FD5C05', onClick: () => setActiveModal('feedback') },
      ]
    },
    {
      title: 'Legal',
      items: [
        { id: 'terms', label: 'Terms of Service', Icon: FileText, bgColor: '#FD5C05', onClick: () => setActiveModal('terms') },
        { id: 'policy', label: 'Privacy Policy', Icon: Lock, bgColor: '#FD5C05', onClick: () => setActiveModal('policy') },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#2A2621] font-sans pb-32">
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        
        {/* ── Native Grouped Preferences Header ── */}
        <div className="flex items-center gap-3 text-left">
          <button 
            onClick={() => router.push('/student/dashboard')}
            className="h-10 w-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#2A2621] hover:bg-[#FD5C05] hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-extrabold text-[#2A2621] tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Preferences
          </h1>
        </div>

        {/* ── Grouped Sections ── */}
        <div className="space-y-6">
          {sections.map(sec => (
            <div key={sec.title} className="space-y-2 text-left">
              <h3 className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest pl-4">
                {sec.title}
              </h3>
              
              <div className="bg-white border-2 border-black/[0.04] rounded-[28px] overflow-hidden shadow-sm divide-y divide-black/[0.04]">
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center justify-between px-5 py-4 hover:bg-[#FD5C05]/5 active:bg-[#FD5C05]/10 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <item.Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold text-[#2A2621] uppercase tracking-wide group-hover:text-[#FD5C05] transition-colors">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#5A554E]/60 text-[10px] font-black uppercase tracking-wider">
                      {item.value && <span className="truncate max-w-[120px]">{item.value}</span>}
                      <ChevronRight className="h-4 w-4 text-[#5A554E]/40 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Independent Native Sign Out ── */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full bg-white hover:bg-red-500 hover:text-white rounded-[24px] py-4 text-center text-xs font-black uppercase tracking-wider text-red-600 border-2 border-black/[0.04] hover:border-transparent transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
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
              className="bg-white rounded-[32px] border-2 border-black/[0.04] shadow-2xl max-w-sm w-full p-8 text-left space-y-6 relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
                  {activeModal}
                </h4>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="h-6 w-6 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {activeModal === 'notifications' && (
                <div className="space-y-4 text-xs font-semibold text-[#5A554E]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-sm text-[#2A2621]">Push Alerts</p>
                      <p className="text-[10px] text-[#5A554E] mt-0.5">Receive updates on your device</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.push}
                      onChange={e => setNotifConfig(p => ({ ...p, push: e.target.checked }))}
                      className="h-4 w-4 text-[#FD5C05] border-black/10 rounded focus:ring-[#FD5C05]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-sm text-[#2A2621]">Email Digest</p>
                      <p className="text-[10px] text-[#5A554E] mt-0.5">Weekly digests of saved events</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.email}
                      onChange={e => setNotifConfig(p => ({ ...p, email: e.target.checked }))}
                      className="h-4 w-4 text-[#FD5C05] border-black/10 rounded focus:ring-[#FD5C05]"
                    />
                  </div>
                </div>
              )}

              {activeModal === 'create-org' && (
                <form onSubmit={handleCreateOrgSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1 text-left">
                    <p className="font-extrabold text-sm text-[#2A2621]">Create Student Organization</p>
                    <p className="text-[10px] text-[#5A554E]">Register a verified organization profile at Livingstone College.</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Organization Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Blue Bears Tech Club" 
                      value={newOrgName} 
                      onChange={e => setNewOrgName(e.target.value)}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Category</label>
                    <select 
                      value={newOrgCategory} 
                      onChange={e => setNewOrgCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05]"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Social">Social</option>
                      <option value="Professional">Professional</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Arts">Arts</option>
                      <option value="Technology">Technology</option>
                      <option value="Religious">Religious</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Organization mission and campus activities..." 
                      value={newOrgDesc} 
                      onChange={e => setNewOrgDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] resize-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={isSubmittingOrg}
                    className="w-full bg-[#FD5C05] text-white hover:bg-[#CC3D00] border-none font-black uppercase tracking-wider py-3 rounded-full shadow-md shadow-[#FD5C05]/20"
                  >
                    {isSubmittingOrg ? 'Creating...' : 'Register Organization'}
                  </Button>
                </form>
              )}

              {activeModal === 'org-verification' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1 text-left">
                    <p className="font-extrabold text-sm text-[#2A2621]">Official Verification Checkmark</p>
                    <p className="text-[10px] text-[#5A554E] leading-relaxed">
                      Organizations approved by Livingstone College receive an Official Evida Verification Badge (orange checkmark). Requests are sent to the campus admin queue.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {userOrgs.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-black/10 text-center text-[#5A554E]">
                        <p className="font-bold text-xs">No Organization Found</p>
                        <p className="text-[10px] mt-1">Create or join an organization first to request official verification.</p>
                      </div>
                    ) : (
                      userOrgs.map((org) => {
                        const isVerified = org.verified || org.verificationStatus === 'verified';
                        const isPending = org.verificationStatus === 'pending';

                        return (
                          <div key={org.id} className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.06] flex items-center justify-between gap-3">
                            <div className="text-left">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-xs text-[#2A2621] uppercase">{org.name}</span>
                                {isVerified && <VerifiedBadge className="h-3.5 w-3.5" />}
                              </div>
                              <span className="text-[9px] text-[#5A554E] font-semibold uppercase">{org.category || 'Student Group'}</span>
                            </div>

                            <div className="shrink-0">
                              {isVerified ? (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] border border-[#FD5C05]/20 flex items-center gap-1">
                                  <span>Verified</span>
                                  <VerifiedBadge className="h-3 w-3" />
                                </span>
                              ) : isPending ? (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Pending Review
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRequestVerification(org.id)}
                                  disabled={requestingVerifyId === org.id}
                                  className="px-3 py-1.5 bg-[#FD5C05] hover:bg-[#CC3D00] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
                                >
                                  {requestingVerifyId === org.id ? 'Submitting...' : 'Request Checkmark'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeModal === 'college' && (
                <div className="space-y-2 text-xs">
                  <p className="font-black uppercase text-[10px] text-[#5A554E] tracking-widest">Connected Campus</p>
                  <p className="font-black text-base text-[#FD5C05]" style={{ fontFamily: 'var(--font-display)' }}>
                    {currentUser.school || 'Livingstone College'}
                  </p>
                  <p className="text-[11px] text-[#5A554E] font-medium leading-relaxed">
                    Your account is verified under this institution's official email domain directory.
                  </p>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-4 text-xs">
                  <div className="pb-1 text-left">
                    <p className="font-black text-[10px] uppercase text-[#5A554E] tracking-wider">Profile Visibility Settings</p>
                    <p className="text-[10px] text-[#5A554E] mt-0.5 leading-relaxed">Control which tabs and contents are visible to other campus members visiting your profile.</p>
                  </div>
                  
                  {([
                    { key: 'going', label: 'Going Tab', desc: 'Lists events you plan to attend' },
                    { key: 'saved', label: 'Saved Tab', desc: 'Lists events you have saved for later' },
                    { key: 'hosted', label: 'Hosted Tab', desc: 'Lists events and promotions you host' },
                    { key: 'organizations', label: 'Organizations Tab', desc: 'Lists organizations you manage or belong to' }
                  ] as const).map(setting => {
                    const currentVal = currentUser.privacy?.[setting.key] || (setting.key === 'saved' || setting.key === 'organizations' ? 'private' : 'public');
                    return (
                      <div key={setting.key} className="flex justify-between items-center bg-slate-50/50 p-3.5 rounded-2xl border border-black/[0.04]">
                        <div className="text-left max-w-[60%]">
                          <p className="font-extrabold text-xs text-[#2A2621]">{setting.label}</p>
                          <p className="text-[9px] text-[#5A554E] font-medium mt-0.5 leading-tight">{setting.desc}</p>
                        </div>
                        <div className="flex bg-black/[0.04] p-0.5 rounded-lg border border-black/[0.02]">
                          {(['public', 'private'] as const).map(val => (
                            <button
                              key={val}
                              onClick={() => updatePrivacy(setting.key, val)}
                              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                currentVal === val 
                                  ? 'bg-[#FD5C05] text-white shadow-sm' 
                                  : 'text-[#5A554E] hover:text-[#2A2621]'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {['report', 'feedback', 'terms', 'policy'].includes(activeModal) && (
                <div className="space-y-2 text-xs text-[#5A554E] leading-relaxed font-semibold">
                  <p className="font-black uppercase text-[10px] text-[#2A2621] tracking-widest">
                    {activeModal === 'report' && 'Report a Problem'}
                    {activeModal === 'feedback' && 'Send Feedback'}
                    {activeModal === 'terms' && 'Terms of Service'}
                    {activeModal === 'policy' && 'Privacy Policy'}
                  </p>
                  {activeModal === 'report' && (
                    <p>To report a problem, please email support@evida.app with details and screenshots of the issue.</p>
                  )}
                  {activeModal === 'feedback' && (
                    <p>We value your feedback! Send your suggestions or ideas to hello@evida.app.</p>
                  )}
                  {activeModal === 'terms' && (
                    <p>By using Evida, you agree to our campus terms of service and standard user conduct guidelines.</p>
                  )}
                  {activeModal === 'policy' && (
                    <p>Your privacy is protected. We do not sell or share student directory data with external entities.</p>
                  )}
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="w-full bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-white border-none font-black uppercase tracking-wider py-3.5 rounded-full"
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

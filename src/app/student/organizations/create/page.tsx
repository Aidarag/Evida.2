'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { ArrowLeft, Building2, Calendar, Megaphone, Users, Sparkles, Check, Globe, Mail, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const LOGO_COLORS = [
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'sky', hex: '#0ea5e9', label: 'Sky' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'teal', hex: '#14b8a6', label: 'Teal' },
  { id: 'orange', hex: '#FD5C05', label: 'Orange' },
];

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { createOrg } = useEvents();
  const { currentUser, setActiveProfile } = useUser();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [orgName, setOrgName] = useState('');
  const [orgCategory, setOrgCategory] = useState('Social');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgAbout, setOrgAbout] = useState('');
  const [orgColor, setOrgColor] = useState('indigo');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [joinSetting, setJoinSetting] = useState<'direct' | 'request'>('request');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !orgDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const cleanSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newOrg = (await createOrg({
        name: orgName.trim(),
        description: orgDesc.trim(),
        aboutUs: orgAbout.trim() || orgDesc.trim(),
        category: orgCategory,
        logoColor: orgColor,
        email: orgEmail.trim() || `contact@${cleanSlug || 'org'}.org`,
        website: orgWebsite.trim() || `https://${cleanSlug || 'org'}.evida.app`,
        joinSetting
      })) as any;

      if (newOrg) {
        // Automatically switch active profile to the new organization
        setActiveProfile({
          type: 'organization',
          orgId: newOrg.id,
          name: newOrg.name
        });

        // Navigate to the newly created organization page
        router.push(`/student/organizations/${newOrg.id}`);
      } else {
        alert('Failed to create organization. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred while creating organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedHex = LOGO_COLORS.find(c => c.id === orgColor)?.hex || '#FD5C05';

  return (
    <div className="min-h-screen bg-[#D8D2BC] text-[#2A2621] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/student/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-black/[0.06] rounded-xl text-xs font-bold text-[#2A2621] hover:bg-[#FD5C05] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          
          <span className="text-[10px] font-black text-[#5A554E] uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full border border-black/[0.04]">
            Step {step} of 3
          </span>
        </div>

        {/* Title Header Card */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-sm space-y-2 text-left">
          <span className="bg-[#FD5C05]/10 text-[#FD5C05] text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#FD5C05]/20 inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Campus Organizations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2A2621] tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Create Your Organization
          </h1>
          <p className="text-xs text-[#5A554E] font-semibold leading-relaxed">
            Give your club, student organization, campus department, or initiative an official home at Livingstone College on Evida.
          </p>
        </div>

        {/* Form Container */}
        <Card className="p-6 sm:p-8 rounded-[28px] border-2 border-black/[0.04] bg-white text-[#2A2621] shadow-sm text-left">
          
          {/* Stepper Bar */}
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-6 mb-6 gap-2">
            {[
              { num: 1, label: 'General Info' },
              { num: 2, label: 'Branding & Contact' },
              { num: 3, label: 'Review & Create' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num === 2 && !orgName.trim()) return;
                  if (s.num === 3 && (!orgName.trim() || !orgDesc.trim())) return;
                  setStep(s.num);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer text-xs font-bold ${
                  step === s.num
                    ? 'bg-[#FD5C05] text-white shadow-xs'
                    : step > s.num
                    ? 'bg-[#FD5C05]/10 text-[#FD5C05]'
                    : 'bg-black/[0.03] text-[#5A554E]'
                }`}
              >
                <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline uppercase text-[10px] tracking-wider truncate">{s.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: General Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blue Bears Coding Club"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    Category *
                  </label>
                  <select
                    required
                    value={orgCategory}
                    onChange={e => setOrgCategory(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all cursor-pointer shadow-xs"
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

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    Short Tagline / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official student club for software, design, and tech innovation."
                    value={orgDesc}
                    onChange={e => setOrgDesc(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    About Us (Full Overview)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your organization's mission, activities, meeting schedules, and target audience..."
                    value={orgAbout}
                    onChange={e => setOrgAbout(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all resize-none shadow-xs"
                  />
                </div>

                <div className="pt-4 border-t border-black/[0.04] flex justify-end">
                  <button
                    type="button"
                    disabled={!orgName.trim() || !orgDesc.trim()}
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-full bg-[#2A2621] hover:bg-[#FD5C05] text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer border-none flex items-center gap-2 shadow-sm"
                  >
                    Continue to Branding <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Branding & Contact */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    Choose Theme Logo Color
                  </label>
                  <div className="flex flex-wrap gap-3 p-3 bg-[#F8F6F0] rounded-xl border border-black/[0.06]">
                    {LOGO_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setOrgColor(c.id)}
                        className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                          orgColor === c.id ? 'border-[#2A2621] scale-110 shadow-sm' : 'border-transparent opacity-80'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      >
                        {orgColor === c.id && <Check className="h-4 w-4 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder={`contact@${orgName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'club'}.org`}
                      value={orgEmail}
                      onChange={e => setOrgEmail(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                      Website URL
                    </label>
                    <input
                      type="text"
                      placeholder={`https://${orgName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'club'}.evida.app`}
                      value={orgWebsite}
                      onChange={e => setOrgWebsite(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                    Membership Access Policy
                  </label>
                  <select
                    value={joinSetting}
                    onChange={e => setJoinSetting(e.target.value as 'direct' | 'request')}
                    className="w-full bg-[#F8F6F0] border border-black/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:bg-white transition-all cursor-pointer shadow-xs"
                  >
                    <option value="request">Requires Admin Approval (Students submit a join request)</option>
                    <option value="direct">Direct Join (Students can join immediately)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-black/[0.04] flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full border border-black/10 hover:bg-slate-50 text-[#2A2621] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-full bg-[#2A2621] hover:bg-[#FD5C05] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-2 shadow-sm"
                  >
                    Review & Create <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                
                {/* Live Card Preview */}
                <div className="p-5 bg-gradient-to-b from-[#FDFBF7] to-white border border-[#FD5C05]/20 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-2xl text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: selectedHex }}
                    >
                      {orgName ? orgName.charAt(0).toUpperCase() : 'O'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#2A2621] uppercase tracking-tight">{orgName || 'Organization Name'}</h3>
                      <span className="text-[9px] text-[#FD5C05] font-black uppercase tracking-widest bg-[#FD5C05]/10 px-2.5 py-0.5 rounded-full border border-[#FD5C05]/20">
                        {orgCategory}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                    {orgDesc || 'Your short tagline will appear here.'}
                  </p>

                  <div className="pt-3 border-t border-black/[0.04] grid gap-2 sm:grid-cols-2 text-[10px] font-semibold text-[#5A554E]">
                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#2A2621]" /> {orgEmail || 'Email configured'}</div>
                    <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[#2A2621]" /> {orgWebsite || 'Website configured'}</div>
                  </div>
                </div>

                {/* Verification info banner */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase tracking-wide">Livingstone College Verification</p>
                    <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                      Once created, your organization will be listed in the campus directory. You can request an Official Verification Badge from the school administration.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.04] flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full border border-black/10 hover:bg-slate-50 text-[#2A2621] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FD5C05] to-[#FC7C0B] hover:opacity-95 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#FD5C05]/25 cursor-pointer border-none disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" /> {isSubmitting ? 'Creating Organization...' : 'Create Organization'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </Card>

      </div>
    </div>
  );
}

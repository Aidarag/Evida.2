'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { User } from '@/lib/types';

interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmit: (promoData: any) => Promise<void>;
}

export default function CreatePromoModal({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}: CreatePromoModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'academic' | 'jobs' | 'creative' | 'food' | 'beauty' | 'marketplace' | 'housing' | 'sports' | 'projects' | 'other'>('food');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'instagram' | 'email' | 'phone' | 'link'>('instagram');
  const [contactValue, setContactValue] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !contactValue) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        contactInfo: contactValue,
        preferredContactMethod,
        contactValue,
        socialLink: socialLink.trim() || undefined,
        organizer: currentUser.name
      };

      await onSubmit(payload);
      onClose();
      // Reset fields
      setTitle('');
      setCategory('food');
      setPreferredContactMethod('instagram');
      setContactValue('');
      setSocialLink('');
      setDescription('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-all">
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-indigo-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#5A554E] hover:bg-[#FFFDE1]/5 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Post Campus Promotion
            </h2>
            <p className="mt-1 text-xs text-[#5A554E]">
              Advertise your peer tutoring, food/BBQ sales, hair/beauty services, or photography business.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">Promo Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus BBQ & Food Sale"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="food">Food & BBQ Sales</option>
                <option value="beauty">Hair & Beauty Services</option>
                <option value="marketplace">Student Business / Marketplace</option>
                <option value="academic">Peer Tutoring & Academic</option>
                <option value="creative">Photography & Creative</option>
                <option value="jobs">Jobs & Projects</option>
                <option value="housing">Housing & Sublets</option>
                <option value="sports">Sports & Fitness</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">Preferred Contact Method *</label>
              <select
                value={preferredContactMethod}
                onChange={(e) => setPreferredContactMethod(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="instagram">Instagram Handle</option>
                <option value="email">Email Address</option>
                <option value="phone">Phone / WhatsApp</option>
                <option value="link">Website / Booking Link</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">
                {preferredContactMethod === 'instagram' ? 'Instagram Handle *' : preferredContactMethod === 'email' ? 'Email Address *' : preferredContactMethod === 'phone' ? 'Phone Number *' : 'Website URL *'}
              </label>
              <input
                type="text"
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={preferredContactMethod === 'instagram' ? '@yourname' : preferredContactMethod === 'email' ? 'name@school.edu' : preferredContactMethod === 'phone' ? '(555) 000-0000' : 'https://yourshop.com'}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Social Hyperlink */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">Social Media Link (Optional Hyperlink)</label>
            <input
              type="text"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="e.g. instagram.com/yourhandle or website link"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5A554E] uppercase tracking-wide">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about menu, rates, availability, experience, or ordering instructions."
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-[11px] text-[#5A554E] leading-relaxed">
            Note: Promotions are moderated separately from events. All advertisements are screened for campus guidelines before appearing on the public feed.
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 py-2.5 px-4 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-2.5 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Post Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

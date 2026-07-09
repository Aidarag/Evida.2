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
  const [category, setCategory] = useState<'tutoring' | 'photography' | 'food' | 'initiative' | 'other'>('tutoring');
  const [contactInfo, setContactInfo] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !contactInfo) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        contactInfo,
        organizer: currentUser.name
      };

      await onSubmit(payload);
      onClose();
      // Reset fields
      setTitle('');
      setCategory('tutoring');
      setContactInfo('');
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
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#4B5563] hover:bg-[#FFFDE1]/5 hover:text-white transition-colors cursor-pointer"
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
            <p className="mt-1 text-xs text-[#4B5563]">
              Advertise your peer tutoring, photography business, food sales, or other student initiatives.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">Promo Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Physics 2 Peer Tutoring"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="tutoring">Tutoring Services</option>
                <option value="photography">Photography Gigs</option>
                <option value="food">Food & Bake Sales</option>
                <option value="initiative">Student Initiatives</option>
                <option value="other">Other Promotions</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">Contact Details *</label>
            <input
              type="text"
              required
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. email@school.edu, phone number, or IG handle"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about rates, availability, experience, or ordering details."
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-[11px] text-[#4B5563] leading-relaxed">
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

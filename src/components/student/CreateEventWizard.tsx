'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, HelpCircle, FileText, CheckSquare, Sparkles, Building, Info } from 'lucide-react';
import { User, Organization } from '@/lib/types';

interface CreateEventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  organizations: Organization[];
  onSubmit: (eventData: any) => Promise<void>;
}

export default function CreateEventWizard({
  isOpen,
  onClose,
  currentUser,
  organizations,
  onSubmit,
}: CreateEventWizardProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ownershipType, setOwnershipType] = useState<'student' | 'organization'>('student');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState<'indoor' | 'outdoor' | 'offcampus'>('indoor');
  const [estimatedAttendance, setEstimatedAttendance] = useState<number>(10);
  const [fundingRequested, setFundingRequested] = useState(false);
  const [transportationNeeded, setTransportationNeeded] = useState(false);
  
  // New HYPERACTIVE properties
  const [coverGradient, setCoverGradient] = useState('from-orange-500 via-red-500 to-violet-600');
  const [isFree, setIsFree] = useState(true);
  const [capacity, setCapacity] = useState<string>('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [category, setCategory] = useState('Social');

  const [submitting, setSubmitting] = useState(false);
  const [statusScreen, setStatusScreen] = useState<'form' | 'success'>('form');

  // Filter organizations user belongs to
  const userOrgs = organizations.filter((org) => 
    currentUser.organizations.includes(org.id)
  );

  useEffect(() => {
    if (ownershipType === 'organization' && userOrgs.length > 0 && !selectedOrgId) {
      setSelectedOrgId(userOrgs[0].id);
    }
  }, [ownershipType, userOrgs, selectedOrgId]);

  if (!isOpen) return null;

  const gradients = [
    { label: 'Sunset Glow', value: 'from-orange-500 via-red-500 to-violet-600' },
    { label: 'Ocean Depth', value: 'from-blue-600 to-indigo-900' },
    { label: 'Forest Mint', value: 'from-teal-400 to-emerald-600' },
    { label: 'Stepping Neon', value: 'from-rose-500 via-pink-500 to-orange-500' },
    { label: 'Ice Blue', value: 'from-blue-500 to-cyan-500' },
    { label: 'Cyber Purple', value: 'from-indigo-600 to-violet-800' }
  ];

  // Dynamic categorization preview helper
  const getCategorization = () => {
    const isFunding = fundingRequested;
    const isTransport = transportationNeeded;
    const attendance = Number(estimatedAttendance) || 0;

    if (!isFunding && !isTransport && attendance <= 15) {
      return {
        type: 'quick',
        name: 'Quick Event (Fast Track Queue)',
        color: 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5',
        bullets: [
          'Under 15 students expected.',
          'No additional funding requested.',
          'No group transportation needed.',
          'Result: Rapid verification (usually immediate).'
        ]
      };
    } else if (isFunding || isTransport || attendance >= 150) {
      return {
        type: 'complex',
        name: 'Complex Event (High Oversight Queue)',
        color: 'text-red-600 border-red-500/25 bg-red-500/5',
        bullets: [
          attendance >= 150 ? `Large gathering (${attendance} expected).` : null,
          isFunding ? 'Requests student group budgets/funding.' : null,
          isTransport ? 'Requires booking university vans/busses.' : null,
          'Result: Detailed scheduling review required.'
        ].filter(Boolean) as string[]
      };
    } else {
      return {
        type: 'standard',
        name: 'Standard Event (Normal Queue)',
        color: 'text-[#191919] border-black/10 bg-black/[0.02]',
        bullets: [
          `Moderate scale (${attendance} expected).`,
          'Standard campus room scheduling clearance.',
          'Result: Reviewed in standard queue order.'
        ]
      };
    }
  };

  const preview = getCategorization();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const matchedOrg = userOrgs.find((org) => org.id === selectedOrgId);
      
      const payload = {
        title,
        description,
        category,
        ownershipType,
        organizationId: ownershipType === 'organization' ? selectedOrgId : undefined,
        organizationName: ownershipType === 'organization' ? matchedOrg?.name : undefined,
        date,
        time,
        endTime: endTime || undefined,
        location,
        locationType,
        estimatedAttendance: Number(estimatedAttendance),
        fundingRequested,
        transportationNeeded,
        coverImage: coverGradient,
        free: isFree,
        capacity: capacity ? Number(capacity) : undefined,
        visibility,
        organizer: currentUser.name,
        creatorUsername: currentUser.username // for notification delivery
      };

      await onSubmit(payload);
      setStatusScreen('success');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#191919]/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] max-sm:rounded-t-[28px] max-sm:rounded-b-none border border-black/5 bg-[#DFDED7] text-[#191919] shadow-[var(--shadow-premium-xl)] transition-all">
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#BDFB04] to-[#9DC4D5]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-xl p-2 text-[#374151] hover:bg-black/5 hover:text-[#191919] transition-colors cursor-pointer z-30"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {statusScreen === 'form' ? (
          <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div>
              <span className="rounded-full bg-[#BDFB04]/15 border border-[#BDFB04]/25 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#191919]">
                SUBMIT EXPERIENCE
              </span>
              <h2 className="text-xl font-extrabold text-[#191919] uppercase tracking-tight mt-1.5 flex items-center gap-2">
                Create Campus Event
              </h2>
            </div>

            {/* Myself vs Org */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Host Persona</label>
                <select
                  value={ownershipType}
                  onChange={(e) => setOwnershipType(e.target.value as any)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                >
                  <option value="student">Me (Individual Student Event)</option>
                  {userOrgs.length > 0 && (
                    <option value="organization">My Student Organization</option>
                  )}
                </select>
              </div>

              {ownershipType === 'organization' && userOrgs.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Select Hosting Group</label>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                  >
                    {userOrgs.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Greek Yard Show"
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                >
                  <option value="Social">Social</option>
                  <option value="Academic">Academic</option>
                  <option value="Career">Career</option>
                  <option value="Sports">Sports</option>
                  <option value="Culture">Culture</option>
                  <option value="Greek Life">Greek Life</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of step performance lineups, entry requirements..."
                className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium resize-none"
              />
            </div>

            {/* Date & times */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Start Time *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>
            </div>

            {/* Location & Cover Gradient */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Alumni Amphitheater"
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Location LocationType</label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as any)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                >
                  <option value="indoor">Indoor Venue</option>
                  <option value="outdoor">Outdoor Field/Plaza</option>
                  <option value="offcampus">Off-Campus Site</option>
                </select>
              </div>
            </div>

            {/* Poster cover selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Choose Event Cover Style (Behance Neon Gradients)</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {gradients.map((grad) => (
                  <button
                    key={grad.value}
                    type="button"
                    onClick={() => setCoverGradient(grad.value)}
                    className={`h-11 rounded-xl bg-gradient-to-tr ${grad.value} border-2 transition-all hover:scale-105 cursor-pointer flex items-center justify-center`}
                    title={grad.label}
                    style={{ borderColor: coverGradient === grad.value ? '#191919' : 'transparent' }}
                  >
                    {coverGradient === grad.value && (
                      <span className="text-[8px] font-bold text-[#191919] bg-[#BDFB04] rounded px-1.5 py-0.5 font-extrabold">OK</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket details: price & capacity */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Admission Price</label>
                <select
                  value={isFree ? 'free' : 'paid'}
                  onChange={(e) => setIsFree(e.target.value === 'free')}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                >
                  <option value="free">Free Access</option>
                  <option value="paid">Paid Ticket</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Capacity (Optional)</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                >
                  <option value="public">Public (All Campus)</option>
                  <option value="private">Private (Invite-Only)</option>
                </select>
              </div>
            </div>

            {/* Smart parameters */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-black/[0.06]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#374151] uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-500" />
                  Estimated Attendance
                </label>
                <input
                  type="number"
                  min={1}
                  value={estimatedAttendance}
                  onChange={(e) => setEstimatedAttendance(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-3 px-3.5 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] focus:ring-1 focus:ring-[#BDFB04] transition-all font-medium"
                />
              </div>

              <div className="space-y-2.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-bold text-[#191919] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fundingRequested}
                    onChange={(e) => setFundingRequested(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-black/[0.06] bg-white border-black/[0.08] text-[#191919] focus:ring-0 cursor-pointer"
                  />
                  Request SGA Campus Funding
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#191919] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transportationNeeded}
                    onChange={(e) => setTransportationNeeded(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-black/[0.06] bg-white border-black/[0.08] text-[#191919] focus:ring-0 cursor-pointer"
                  />
                  Requires University Bus
                </label>
              </div>
            </div>

            {/* Smart Classification Widget */}
            <div className={`rounded-2xl border p-4 transition-all duration-300 ${preview.color}`}>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-[#191919]" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Smart Classification Insight</h5>
              </div>
              <p className="text-[11px] font-bold text-[#191919] mt-1.5">{preview.name}</p>
              <ul className="mt-2 pl-4 list-disc text-[10px] space-y-1 text-[#374151] font-medium">
                {preview.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/[0.08] bg-white hover:bg-black/[0.02] py-3 px-6 text-xs font-bold text-[#374151] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#BDFB04] text-[#191919] shadow-[0_4px_14px_rgba(32,54,39,0.1)] hover:bg-[#BDFB04]/90 transition-all hover:scale-[1.01] px-6 py-3.5 text-xs font-bold cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </form>
        ) : (
          /* Submission success state placeholder */
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25">
              <Sparkles className="h-8 w-8 text-[#191919]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-white">Event Submitted For Review</h3>
              <p className="text-xs text-[#374151] leading-relaxed max-w-sm mx-auto">
                Your campus experience has been uploaded successfully! School administration will examine the scheduling details in the moderation queues.
              </p>
            </div>

            <div className="border border-black/[0.06] bg-black/[0.02] p-4 rounded-2xl flex items-center justify-between text-left max-w-sm mx-auto text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#374151] uppercase font-semibold">Live Moderation Status</span>
                <span className="font-extrabold text-[#191919] mt-0.5">Submitted → Under Review</span>
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                pending
              </span>
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex justify-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setStatusScreen('form');
                }}
                className="rounded-full bg-[#BDFB04] text-[#191919] px-6 py-3 text-xs font-bold hover:bg-[#BDFB04]/90 transition-colors cursor-pointer"
              >
                Return to Explore
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

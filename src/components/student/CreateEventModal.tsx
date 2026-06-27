'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, HelpCircle, FileText, CheckSquare, Sparkles, Building } from 'lucide-react';
import { User, Organization } from '@/lib/types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  organizations: Organization[];
  onSubmit: (eventData: any) => Promise<void>;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  currentUser,
  organizations,
  onSubmit,
}: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ownershipType, setOwnershipType] = useState<'student' | 'organization'>('student');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState<'indoor' | 'outdoor' | 'offcampus'>('indoor');
  const [estimatedAttendance, setEstimatedAttendance] = useState<number>(10);
  const [fundingRequested, setFundingRequested] = useState(false);
  const [transportationNeeded, setTransportationNeeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter organizations the current user belongs to
  const userOrgs = organizations.filter((org) => 
    currentUser.organizations.includes(org.id)
  );

  // Set default org when switching to organization ownership
  useEffect(() => {
    if (ownershipType === 'organization' && userOrgs.length > 0 && !selectedOrgId) {
      setSelectedOrgId(userOrgs[0].id);
    }
  }, [ownershipType, userOrgs, selectedOrgId]);

  if (!isOpen) return null;

  // Real-time categorization calculation
  const getCategorization = () => {
    const isFunding = fundingRequested;
    const isTransport = transportationNeeded;
    const attendance = Number(estimatedAttendance) || 0;

    if (!isFunding && !isTransport && attendance <= 15) {
      return {
        type: 'quick',
        name: 'Quick Event (Fast Track Queue)',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
        bullets: [
          'Estimated attendance is 15 or fewer students.',
          'No additional campus funding or budgets requested.',
          'No off-campus group transportation needed.',
          'Result: Rapid approval (usually within 24 hours).'
        ]
      };
    } else if (isFunding || isTransport || attendance >= 150) {
      return {
        type: 'complex',
        name: 'Complex Event (High Oversight Queue)',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
        bullets: [
          attendance >= 150 ? `Large scale event (expected attendance: ${attendance}).` : null,
          isFunding ? 'Financial resources / funding requested.' : null,
          isTransport ? 'Transportation / logistics needed.' : null,
          'Result: Multi-tier review, scheduling verification needed.'
        ].filter(Boolean) as string[]
      };
    } else {
      return {
        type: 'standard',
        name: 'Standard Event (Normal Queue)',
        color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
        bullets: [
          `Moderate attendance: ${attendance} students.`,
          'Standard campus room scheduling approval.',
          'Result: Normal moderation review (usually 2-3 business days).'
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
        ownershipType,
        organizationId: ownershipType === 'organization' ? selectedOrgId : undefined,
        organizationName: ownershipType === 'organization' ? matchedOrg?.name : undefined,
        date,
        time,
        location,
        locationType,
        estimatedAttendance: Number(estimatedAttendance),
        fundingRequested,
        transportationNeeded,
        organizer: currentUser.name
      };

      await onSubmit(payload);
      onClose();
      // Reset form fields
      setTitle('');
      setDescription('');
      setOwnershipType('student');
      setSelectedOrgId('');
      setDate('');
      setTime('');
      setLocation('');
      setLocationType('indoor');
      setEstimatedAttendance(10);
      setFundingRequested(false);
      setTransportationNeeded(false);
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
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-all">
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Create Campus Activity
            </h2>
            <p className="mt-1.5 text-xs text-slate-400">
              Submit your event. Our platform categorizes your event in real-time to speed up administration.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. STEM Club Hackathon"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Ownership */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Who is organizing? *</label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="student">Me (Individual Student Event)</option>
                {userOrgs.length > 0 && (
                  <option value="organization">My Student Organization</option>
                )}
              </select>
            </div>
          </div>

          {/* Org details if Organization is selected */}
          {ownershipType === 'organization' && userOrgs.length > 0 && (
            <div className="space-y-1.5 rounded-xl border border-dashed border-white/10 bg-slate-900/20 p-3.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-indigo-400" />
                Select Organization *
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 py-1.5 px-3 text-xs text-white focus:outline-none"
              >
                {userOrgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.verified ? '✓ (Verified)' : '(Unverified)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description & Details *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will attendees do? What are the key takeaways? List any prerequisites."
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" /> Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Library Room 4"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Location Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="indoor">Indoor (Room, Hall)</option>
                <option value="outdoor">Outdoor (Quad, Field)</option>
                <option value="offcampus">Off-Campus</option>
              </select>
            </div>
          </div>

          {/* Smart Categorization Parameters */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
            {/* Estimated Attendance */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-500" /> Expected Attendance
              </label>
              <input
                type="number"
                min={1}
                value={estimatedAttendance}
                onChange={(e) => setEstimatedAttendance(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Resources checkboxes */}
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fundingRequested}
                  onChange={(e) => setFundingRequested(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Request Campus Funding
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportationNeeded}
                  onChange={(e) => setTransportationNeeded(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Request School Transportation
              </label>
            </div>
          </div>

          {/* Real-time smart review categorization indicator */}
          <div className={`rounded-xl border p-4 transition-colors duration-300 ${preview.color}`}>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Real-Time Review Classification: {preview.name}
              </h4>
            </div>
            <ul className="mt-2 pl-5 list-disc text-[11px] space-y-1 text-slate-400">
              {preview.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
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
              {submitting ? 'Submitting...' : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

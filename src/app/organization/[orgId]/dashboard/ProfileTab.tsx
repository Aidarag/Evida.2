"use client";

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Building, Shield, Save, PlusCircle, Users, Calendar } from 'lucide-react';
import { Organization } from '@/lib/types';
import CreateEventModal from '@/components/student/CreateEventModal';
import { useUser } from '@/lib/context/UserContext';

export default function ProfileTab({ orgId }: { orgId: string }) {
  const { organizations, events, refetch } = useEvents();
  const { currentUser } = useUser();

  const org = organizations.find((o) => o.id === orgId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [category, setCategory] = useState('Academic');
  const [rosterType, setRosterType] = useState<'members' | 'team'>('members');
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingVerify, setIsRequestingVerify] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    if (org) {
      setName(org.name || '');
      setDescription(org.description || '');
      setAboutUs(org.aboutUs || org.description || '');
      setCategory(org.category || 'Academic');
      setRosterType(org.rosterType || (org.category === 'Sports' || org.category === 'Athletics' ? 'team' : 'members'));
    }
  }, [org]);

  if (!org) {
    return (
      <div className="p-8 text-center text-[#5A554E]">
        <Building className="h-12 w-12 mx-auto mb-3 text-[#5A554E]" />
        <p className="font-bold text-sm text-[#2A2621]">Organization Profile Not Found</p>
      </div>
    );
  }

  const orgEvents = events.filter((e) => e.organizationId === orgId || e.organizationName === org.name);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-profile',
          id: org.id,
          name,
          description,
          aboutUs,
          category,
          rosterType,
        }),
      });

      if (res.ok) {
        await refetch();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update organization profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    setIsRequestingVerify(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-verification',
          id: org.id,
        }),
      });

      if (res.ok) {
        await refetch();
      }
    } catch (err) {
      console.error('Failed to request verification', err);
    } finally {
      setIsRequestingVerify(false);
    }
  };

  return (
    <div className="space-y-8 text-left font-sans max-w-4xl">
      {/* Profile Header & Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 border border-black/[0.06] rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#FD5C05] text-white text-2xl font-black flex items-center justify-center shadow-md">
            {org.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#2A2621] uppercase tracking-tight flex items-center gap-1.5" style={{ fontFamily: 'var(--font-display)' }}>
              {org.name}
              {org.verified && <VerifiedBadge className="h-5 w-5" />}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#5A554E] font-semibold">{org.category || 'Student Group'}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-[#5A554E] font-semibold">{org.members.length} {org.rosterType === 'team' ? 'Roster Members' : 'Members'}</span>
            </div>
          </div>
        </div>

        {/* Verification Status Action */}
        <div className="shrink-0">
          {org.verified || org.verificationStatus === 'verified' ? (
            <div className="flex items-center gap-1.5 bg-[#FD5C05]/10 border border-[#FD5C05]/20 text-[#FD5C05] px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
              <VerifiedBadge className="h-4 w-4" />
              <span>Official Checkmark Granted</span>
            </div>
          ) : org.verificationStatus === 'pending' ? (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Review</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestVerification}
              disabled={isRequestingVerify}
              className="flex items-center gap-2 bg-[#FD5C05] hover:bg-[#CC3D00] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#FD5C05]/20 cursor-pointer border-none"
            >
              <Shield className="h-4 w-4" />
              <span>{isRequestingVerify ? 'Submitting...' : 'Request Official Checkmark'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Organization Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6 bg-white p-6 rounded-2xl border border-black/[0.06]">
        <div className="flex justify-between items-center pb-4 border-b border-black/[0.04]">
          <h3 className="text-sm font-extrabold text-[#2A2621] uppercase tracking-wider">
            Edit Profile Information
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Changes Saved Successfully ✓
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Org Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#5A554E] uppercase tracking-wider">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05]"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#5A554E] uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05]"
            >
              <option value="Academic">Academic</option>
              <option value="Sports">Sports & Athletics</option>
              <option value="Social">Social</option>
              <option value="Professional">Professional</option>
              <option value="Cultural">Cultural</option>
              <option value="Community Service">Community Service</option>
              <option value="Arts">Arts & Media</option>
              <option value="Technology">Technology</option>
              <option value="Religious">Religious</option>
            </select>
          </div>
        </div>

        {/* Roster Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#5A554E] uppercase tracking-wider">
            Roster Display Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2A2621]">
              <input
                type="radio"
                name="rosterType"
                value="members"
                checked={rosterType === 'members'}
                onChange={() => setRosterType('members')}
                className="text-[#FD5C05] focus:ring-[#FD5C05]"
              />
              <span>Members Roster (Social / Academic / Clubs)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2A2621]">
              <input
                type="radio"
                name="rosterType"
                value="team"
                checked={rosterType === 'team'}
                onChange={() => setRosterType('team')}
                className="text-[#FD5C05] focus:ring-[#FD5C05]"
              />
              <span>Team Roster (Sports / Athletics / Competitions)</span>
            </label>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#5A554E] uppercase tracking-wider">
            Short Tagline / Summary
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief 1-line overview of your organization..."
            className="w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05]"
          />
        </div>

        {/* About Us Detailed */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#5A554E] uppercase tracking-wider">
            About Us (Detailed Mission & Overview)
          </label>
          <textarea
            rows={5}
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            placeholder="Write a comprehensive description about your organization, meeting schedules, goals, and membership requirements..."
            className="w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-[#2A2621] font-semibold focus:outline-none focus:border-[#FD5C05] resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FD5C05] hover:bg-[#CC3D00] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#FD5C05]/20 cursor-pointer border-none"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Events Hosted & Roster Previews */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Roster Preview */}
        <div className="bg-white p-6 rounded-2xl border border-black/[0.06] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#2A2621] uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-[#FD5C05]" />
              {rosterType === 'team' ? 'Team Roster' : 'Members Roster'} ({org.members.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {org.members.map((member, idx) => (
              <div key={member} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#FD5C05] text-white font-black text-[10px] flex items-center justify-center">
                    {member.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A2621] uppercase">{member}</p>
                    <p className="text-[9px] text-[#5A554E] font-semibold">
                      {org.memberRoles?.[member] || (idx === 0 ? (rosterType === 'team' ? 'Captain' : 'President') : idx === 1 ? 'Vice President' : 'Member')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Hosted Preview */}
        <div className="bg-white p-6 rounded-2xl border border-black/[0.06] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#2A2621] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FD5C05]" />
              Events Hosted ({orgEvents.length})
            </h3>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="flex items-center gap-1 text-[10px] font-black uppercase text-[#FD5C05] hover:underline cursor-pointer border-none bg-transparent"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {orgEvents.length === 0 ? (
              <p className="text-xs text-[#5A554E] italic py-6 text-center">No events hosted yet. Click "Create Event" to publish your first campus event!</p>
            ) : (
              orgEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-50 border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#2A2621] uppercase">{evt.title}</h4>
                    <p className="text-[10px] text-[#5A554E] font-semibold">{evt.date} • {evt.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {evt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <CreateEventModal
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
          currentUser={currentUser!}
          organizations={organizations}
          onSubmit={async (payload) => {
            await fetch('/api/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payload, organizationId: orgId, organizationName: org.name }),
            });
            await refetch();
            setShowCreateEvent(false);
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ArrowRight, ArrowLeft, Check, Users, User, Shield, Sparkles, Image as ImageIcon, Info, Megaphone, Ticket, CircleDollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

type CreateType = 'event' | 'promotion' | null;
type CreatorEntity = 'student' | 'organization' | 'school' | null;
type EventSubtype = 'quick' | 'standard' | null;

function CreateListingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, activeProfile } = useUser();
  const { events, organizations, createEvent, updateEvent } = useEvents();

  const [step, setStep] = useState(1);
  const [createType, setCreateType] = useState<CreateType>(null);
  const [creatorEntity, setCreatorEntity] = useState<CreatorEntity>(null);
  const [eventSubtype, setEventSubtype] = useState<EventSubtype>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promoFileInputRef = useRef<HTMLInputElement>(null);



  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    capacity: '',
    selectedOrgId: '',
    departmentName: '',
    isFeatured: false,
    coverImageDataUrl: '',
    free: true,
    price: '',
  });

  const [promoForm, setPromoForm] = useState({
    title: '',
    description: '',
    category: 'academic',
    organizerName: '',
    contactInfo: '',
    flyerImageDataUrl: '',
    isFree: true,
    price: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initialize creator identity based on active profile switcher selection
  useEffect(() => {
    if (activeProfile.type === 'student') {
      setCreatorEntity('student');
    } else if (activeProfile.type === 'organization') {
      setCreatorEntity('organization');
      setEventForm(prev => ({ ...prev, selectedOrgId: activeProfile.orgId }));
    }
  }, [activeProfile]);

  // Pre-fill form from editId query param (draft editing)
  useEffect(() => {
    const editId = searchParams.get('editId');
    if (!editId) return;
    const evt = events.find(e => e.id === editId);
    if (!evt) return;
    setDraftId(editId);
    setCreateType('event');
    setCreatorEntity(evt.ownershipType || 'student');
    setEventSubtype(evt.complexityType === 'quick' ? 'quick' : 'standard');
    setEventForm(prev => ({
      ...prev,
      title: evt.title,
      description: evt.description,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      category: evt.category || 'Social',
      capacity: evt.capacity ? String(evt.capacity) : '',
      selectedOrgId: evt.organizationId || '',
      departmentName: evt.ownershipType === 'school' ? evt.organizer : '',
      isFeatured: evt.featured || false,
      free: evt.free !== false,
      price: evt.price ? String(evt.price) : '',
    }));
    setStep(4);
  }, [events, searchParams]);

  if (!currentUser) return null;

  // Filter organizations the user is member of
  const myOrgs = organizations.filter(org => currentUser.organizations?.includes(org.id));
  const isAdmin = currentUser.role === 'admin';

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    // Determine previous step logic
    if (step === 1) {
      router.push('/student/dashboard');
    } else if (step === 4) {
      if (createType === 'promotion') {
        setStep(1);
      } else if (activeProfile.type === 'student') {
        setStep(3); // Go back to subtype selection
      } else {
        setStep(1); // Go back to step 1 for org events
      }
    } else if (step === 3) {
      setStep(1);
    } else {
      setStep(s => - 1);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isOrg = creatorEntity === 'organization';
    const isSchool = creatorEntity === 'school';
    const org = isOrg ? organizations.find(o => o.id === eventForm.selectedOrgId) : null;

    const payload = {
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      category: isSchool ? eventForm.category : eventForm.category,
      capacity: eventForm.capacity ? parseInt(eventForm.capacity) : undefined,
      ownershipType: creatorEntity,
      organizationId: isOrg ? org?.id : undefined,
      organizationName: isOrg ? org?.name : undefined,
      organizer: isSchool ? (eventForm.departmentName || 'School Administration') : currentUser!.name,
      status: (isSchool || (creatorEntity === 'student' && eventSubtype === 'quick')) ? 'approved' : 'pending',
      usesSchoolFacilities: eventSubtype === 'standard',
      coverImage: eventForm.coverImageDataUrl || (isSchool
        ? 'from-red-500 via-pink-500 to-orange-500'
        : (isOrg ? 'from-blue-600 to-indigo-900' : 'from-teal-400 to-emerald-600')),
      isFeatured: isSchool ? eventForm.isFeatured : false,
      creatorUsername: currentUser!.username,
      organizerName: currentUser!.name,
      free: eventForm.free,
      price: !eventForm.free && eventForm.price ? parseFloat(eventForm.price) : undefined,
    };

    let success: boolean;
    if (draftId) {
      success = await updateEvent(draftId, payload);
    } else {
      success = await createEvent(payload);
    }
    setIsSubmitting(false);

    if (success) {
      showToast(
        draftId ? 'Event updated successfully!' :
        isSchool
          ? 'School event published successfully!'
          : (creatorEntity === 'student' && eventSubtype === 'quick')
            ? 'Event shared successfully!'
            : (creatorEntity === 'student' && eventSubtype === 'standard')
              ? 'Event submitted for school review!'
              : 'Event submitted successfully! Waiting for moderation.'
      );
      setTimeout(() => router.push('/student/my-events'), 1500);
    } else {
      showToast('Failed to create event. Please try again.', 'error');
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promoForm.title,
          description: promoForm.description,
          category: promoForm.category,
          organizer: activeProfile.type === 'organization' ? activeProfile.name : (promoForm.organizerName || currentUser!.name),
          contactInfo: promoForm.contactInfo,
          flyerImage: promoForm.flyerImageDataUrl || undefined,
          isFree: promoForm.isFree,
          price: promoForm.isFree ? 'Free' : (promoForm.price || 'Paid'),
        }),
      });

      setIsSubmitting(false);

      if (res.ok) {
        showToast('Promotion submitted! It will appear after review.');
        setTimeout(() => router.push('/student/my-events'), 1500);
      } else {
        const data = await res.json();
        showToast(`Failed to create promotion: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch {
      setIsSubmitting(false);
      showToast('Failed to submit promotion. Please try again.', 'error');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: What would you like to create? */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header back button & title */}
            <div className="flex flex-col gap-4 text-left max-w-xl mx-auto">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 w-fit px-4 py-2 bg-white/80 border border-black/[0.06] rounded-xl text-xs font-bold text-[#2A2621] hover:bg-[#FD5C05] hover:text-white hover:border-transparent transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-[#2A2621] tracking-tight leading-tight uppercase font-sans">
                  What would you like to create?
                </h1>
                <p className="text-xs font-semibold text-[#5A554E] leading-relaxed">
                  Events are activities people attend. Promotions help students discover your services, business, or initiative.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              {/* Event card */}
              <Card 
                onClick={() => { 
                  setCreateType('event'); 
                  if (activeProfile.type === 'organization') {
                    setStep(4);
                  } else if (isAdmin) {
                    setStep(2);
                  } else {
                    setStep(3);
                  }
                }}
                className="p-8 flex flex-col items-center text-center gap-5 hover:border-[#FD5C05] hover:scale-[1.02] active:scale-[0.99] cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-[28px] bg-white border border-black/[0.05]"
              >
                {/* Custom Badge Indicator (No Emojis) */}
                <div className="absolute top-4 left-4 bg-[#2A2621] text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5 select-none">
                  <Calendar className="h-3 w-3 text-[#FD5C05]" /> People attend
                </div>

                <div className="h-16 w-16 rounded-2xl bg-[#FD5C05]/10 text-[#FD5C05] flex items-center justify-center group-hover:scale-105 transition-transform mt-6">
                  <Calendar className="h-8 w-8" />
                </div>
                <div className="w-full text-center space-y-4">
                  <h3 className="text-xl font-black text-[#2A2621] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>Event</h3>
                  <p className="text-xs text-[#5A554E] leading-relaxed font-semibold">
                    Create an event students can attend.
                  </p>
                  <ul className="text-xs text-left max-w-[170px] mx-auto space-y-2 text-[#5A554E] font-semibold border-t border-black/[0.06] pt-4 w-full">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Club meeting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Workshop / Panel
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Social Gathering
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Sports Game / Play
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Career / Job Fair
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Promote card */}
              <Card 
                onClick={() => { setCreateType('promotion'); setStep(4); }} // Go straight to Promo Form
                className="p-8 flex flex-col items-center text-center gap-5 hover:border-[#FD5C05] hover:scale-[1.02] active:scale-[0.99] cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-[28px] bg-white border border-black/[0.05]"
              >
                {/* Custom Badge Indicator (No Emojis) */}
                <div className="absolute top-4 left-4 bg-[#2A2621] text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5 select-none">
                  <Megaphone className="h-3 w-3 text-[#FD5C05]" /> People discover
                </div>

                <div className="h-16 w-16 rounded-2xl bg-[#FD5C05]/10 text-[#FD5C05] flex items-center justify-center group-hover:scale-105 transition-transform mt-6">
                  <Tag className="h-8 w-8" />
                </div>
                <div className="w-full text-center space-y-4">
                  <h3 className="text-xl font-black text-[#2A2621] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>Promote</h3>
                  <p className="text-xs text-[#5A554E] leading-relaxed font-semibold">
                    Share a service, business, or initiative with the campus community.
                  </p>
                  <ul className="text-xs text-left max-w-[170px] mx-auto space-y-2 text-[#5A554E] font-semibold border-t border-black/[0.06] pt-4 w-full">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Food & Bbqs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Hair & Braiding
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Marketplace Sales
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Tutoring Services
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05]" /> Community Events
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* Drafts Section */}
            {(() => {
              const draftEvents = events.filter(e => e.status === 'pending' && e.organizer === currentUser.name);
              if (draftEvents.length === 0) return null;
              return (
                <div className="space-y-4 pt-8 border-t border-black/[0.04] text-left">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#2A2621]">Your unpublished drafts & pending reviews</h3>
                    <p className="text-xs text-[#5A554E] font-medium">Select a draft below to resume editing its details before posting.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {draftEvents.map(evt => (
                      <div 
                        key={evt.id}
                        onClick={() => {
                          setCreateType('event');
                          setCreatorEntity(evt.ownershipType);
                          setEventForm({
                            title: evt.title,
                            description: evt.description,
                            date: evt.date,
                            time: evt.time,
                            location: evt.location,
                            category: evt.category || 'Social',
                            capacity: evt.capacity ? String(evt.capacity) : '',
                            selectedOrgId: evt.organizationId || '',
                            departmentName: evt.ownershipType === 'school' ? evt.organizer : '',
                            isFeatured: evt.featured || false,
                            coverImageDataUrl: evt.coverImage || '',
                            free: evt.free !== false,
                            price: evt.price ? String(evt.price) : '',
                          });
                          // Move directly to the edit details step
                          setStep(4);
                        }}
                        className="bg-white p-4 border border-black/[0.04] rounded-2xl hover:border-[#FD5C05]/40 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-between shadow-sm group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#2A2621] uppercase truncate group-hover:text-[#FD5C05] transition-colors">{evt.title}</p>
                          <p className="text-[9px] text-[#5A554E] mt-0.5">{evt.date || 'No date set'} • {evt.location || 'No location'}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-[#FD5C05]/10 text-[#FD5C05] px-2.5 py-1 rounded-lg shrink-0">Resume</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* STEP 2: Who is organizing this event? */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-2xl mx-auto w-full"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Who is organizing this event?
              </h1>
              <p className="text-sm text-[#5A554E]">Choose who owns and hosts this event on campus.</p>
            </div>

            <div className="space-y-4">
              {/* Option 1: Me */}
              <button
                onClick={() => { setCreatorEntity('student'); handleNext(); }}
                className="w-full text-left p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#2A2621]/30 transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 text-[var(--color-evida-blue)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#2A2621] uppercase tracking-wider">My Events</h3>
                  <p className="text-xs text-[#5A554E] mt-0.5">Create personal student events — share instantly or request school facilities.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#5A554E] ml-auto group-hover:text-[#2A2621] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 2: My Organization */}
              <button
                onClick={() => { 
                  setCreatorEntity('organization'); 
                  // Pre-select first organization if available
                  if (myOrgs.length > 0) {
                    setEventForm(prev => ({ ...prev, selectedOrgId: myOrgs[0].id }));
                  }
                  setStep(4); // Go straight to form
                }}
                className="w-full text-left p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#2A2621]/30 transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-lime)]/10 text-[var(--color-evida-lime)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#2A2621] uppercase tracking-wider">My Organization</h3>
                  <p className="text-xs text-[#5A554E] mt-0.5">Organization-Owned Event. For verified clubs, teams, and Greek life.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#5A554E] ml-auto group-hover:text-[#2A2621] group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <div className="flex justify-start">
              <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Event Subtype (For Student-Owned Events) */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-2xl mx-auto w-full"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-[#2A2621] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Select Event Type
              </h1>
              <p className="text-sm text-[#5A554E]">Choose the format that best fits your student activity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Without Facilities — Share Immediately */}
              <Card 
                onClick={() => { setEventSubtype('quick'); handleNext(); }}
                className="p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--color-evida-lime)]/50 cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-lime)]/10 text-[var(--color-evida-lime)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2621] uppercase tracking-wide">Without School Facilities</h3>
                  <p className="text-xs text-[#5A554E] mt-2 leading-relaxed">
                    Not using any school spaces or resources. Your event will be shared with the campus community immediately.
                  </p>
                  <span className="inline-block mt-3 text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-3 py-0.5">Instant Share</span>
                </div>
              </Card>

              {/* With Facilities — Needs School Review */}
              <Card 
                onClick={() => { setEventSubtype('standard'); handleNext(); }}
                className="p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--color-evida-blue)]/50 cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 text-[var(--color-evida-blue)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2621] uppercase tracking-wide">Using School Facilities</h3>
                  <p className="text-xs text-[#5A554E] mt-2 leading-relaxed">
                    Requesting campus rooms, fields, or school resources. Your event will be submitted for school review before publishing.
                  </p>
                  <span className="inline-block mt-3 text-[9px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-3 py-0.5">Requires Review</span>
                </div>
              </Card>
            </div>

            <div className="flex justify-start">
              <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Render Forms */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="mb-6 flex items-center gap-4">
              <button 
                onClick={handleBack} 
                className="h-10 w-10 rounded-full bg-white/85 border border-black/[0.06] flex items-center justify-center text-[#2A2621] hover:bg-[#FD5C05] hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-left">
                  {createType === 'promotion' 
                    ? 'Promotion Campaign' 
                    : `${creatorEntity === 'student' ? 'My Event' : 'Organization Event'} — ${eventSubtype === 'quick' ? 'No Facilities' : 'Using School Facilities'}`}
                </span>
                <h1 className="font-extrabold text-[#2A2621] tracking-wide text-left" style={{ fontFamily: 'var(--font-display)' }}>
                  {createType === 'promotion' ? 'Create Promotion' : 'Event Details'}
                </h1>
              </div>
            </div>

            <Card className="p-8 max-sm:p-5 max-sm:rounded-[28px] border-2 border-black/[0.04] bg-white text-[#2A2621]">
              {createType === 'event' ? (
                // ─────────────────────────────────────────────
                // EVENT FORM
                // ─────────────────────────────────────────────
                <form onSubmit={handleEventSubmit} className="space-y-6">
                  
                  {/* Organization Selector (Visible only for Organization events) */}
                  {creatorEntity === 'organization' && (
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">Publishing as Organization</label>
                      {activeProfile.type === 'organization' ? (
                        <div className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-[#2A2621] font-bold shadow-sm">
                          {activeProfile.name} (Active Profile)
                        </div>
                      ) : myOrgs.length > 0 ? (
                        <select 
                          className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-[#2A2621] transition-all duration-200 focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05]/20 font-semibold cursor-pointer shadow-sm"
                          value={eventForm.selectedOrgId}
                          onChange={e => setEventForm({...eventForm, selectedOrgId: e.target.value})}
                          required
                        >
                          {myOrgs.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-2">
                          <Info className="h-4 w-4 shrink-0" />
                          You are not verified to manage any organizations. Please register one first.
                        </div>
                      )}
                    </div>
                  )}

                  {/* School Department Name (Visible only for School events) */}
                  {creatorEntity === 'school' && (
                    <Input 
                      label="Department / Administrative Office Name" 
                      placeholder="e.g. Student Involvement Board"
                      value={eventForm.departmentName}
                      onChange={e => setEventForm({...eventForm, departmentName: e.target.value})}
                      required
                    />
                  )}

                  <div className="space-y-4">
                    <Input 
                      label="Event Title" 
                      placeholder={
                        eventSubtype === 'quick' 
                          ? 'e.g. Econ 101 Midterm Study Group' 
                          : 'e.g. Annual Spring Music Festival'
                      }
                      value={eventForm.title}
                      onChange={e => setEventForm({...eventForm, title: e.target.value})}
                      required
                    />
                    
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">Description</label>
                      <textarea 
                        className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-[#2A2621] placeholder-[#5A554E]/60 transition-all duration-200 focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05]/20 min-h-[120px] resize-none font-semibold leading-relaxed shadow-sm"
                        placeholder="What should campus know about this event?"
                        value={eventForm.description}
                        onChange={e => setEventForm({...eventForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                      <Input 
                        label="Date" 
                        type="date"
                        value={eventForm.date}
                        onChange={e => setEventForm({...eventForm, date: e.target.value})}
                        required
                      />
                      <Input 
                        label="Time" 
                        type="time"
                        value={eventForm.time}
                        onChange={e => setEventForm({...eventForm, time: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className={`grid ${eventSubtype === 'quick' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 text-left`}>
                      <Input 
                        label="Location" 
                        placeholder="e.g. Science Library Room 304"
                        value={eventForm.location}
                        onChange={e => setEventForm({...eventForm, location: e.target.value})}
                        required
                      />

                      {/* Hide Category/Capacity on Quick Student events (Simplified form) */}
                      {eventSubtype !== 'quick' && (
                        <div className="space-y-1.5 text-left">
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">Category</label>
                          <select 
                            className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-[#2A2621] transition-all duration-200 focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05]/20 font-semibold cursor-pointer shadow-sm"
                            value={eventForm.category}
                            onChange={e => setEventForm({...eventForm, category: e.target.value})}
                          >
                            <option value="Social">Social</option>
                            <option value="Academic">Academic</option>
                            <option value="Career">Career</option>
                            <option value="Sports">Sports</option>
                            <option value="Culture">Culture</option>
                            <option value="Arts">Arts</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Networking">Networking</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {eventSubtype !== 'quick' && (
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <Input 
                          label="Max Capacity (Optional)" 
                          type="number"
                          placeholder="e.g. 150"
                          value={eventForm.capacity}
                          onChange={e => setEventForm({...eventForm, capacity: e.target.value})}
                        />
                        
                        {/* School admin can set Featured status */}
                        {creatorEntity === 'school' && (
                          <div className="space-y-1.5 flex flex-col justify-center">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E] mb-1.5">Featured Event</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={eventForm.isFeatured}
                                onChange={e => setEventForm({...eventForm, isFeatured: e.target.checked})}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FD5C05]"></div>
                              <span className="ml-3 text-xs font-semibold text-[#2A2621]">Feature on Landing Page</span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing section (Visible for all events, including quick events) */}
                    <div className="space-y-3 pt-2 text-left">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">Event Pricing</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setEventForm(prev => ({ ...prev, free: true, price: '' }))}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            eventForm.free 
                              ? 'bg-[#FD5C05]/10 border-[#FD5C05] text-[#2A2621] font-bold shadow-sm' 
                              : 'bg-white border-black/10 text-[#5A554E] hover:border-black/25'
                          }`}
                        >
                          <Ticket className="h-5 w-5 text-[#FD5C05]" />
                          <span className="text-xs uppercase tracking-wider font-extrabold">Free Event</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventForm(prev => ({ ...prev, free: false }))}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            !eventForm.free 
                              ? 'bg-[#FD5C05]/10 border-[#FD5C05] text-[#2A2621] font-bold shadow-sm' 
                              : 'bg-white border-black/10 text-[#5A554E] hover:border-black/25'
                          }`}
                        >
                          <CircleDollarSign className="h-5 w-5 text-[#FD5C05]" />
                          <span className="text-xs uppercase tracking-wider font-extrabold">Paid Event</span>
                        </button>
                      </div>

                      <AnimatePresence>
                        {!eventForm.free && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pt-1"
                          >
                            <Input 
                              label="Ticket Price ($)" 
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="e.g. 5.00"
                              value={eventForm.price}
                              onChange={e => setEventForm({...eventForm, price: e.target.value})}
                              required={!eventForm.free}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cover Image Upload (Always Visible) */}
                    <div className="space-y-1.5 pt-2 text-left">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554E]">Cover Image / Flyer</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setEventForm(prev => ({ ...prev, coverImageDataUrl: ev.target?.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <div
                        className="w-full rounded-2xl border-2 border-dashed border-black/10 bg-slate-50/50 p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#FD5C05]/5 hover:border-[#FD5C05]/40 transition-all duration-300 cursor-pointer shadow-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {eventForm.coverImageDataUrl ? (
                          <img src={eventForm.coverImageDataUrl} className="h-28 w-full object-cover rounded-xl animate-fade-in" alt="preview" />
                        ) : (
                          <>
                            <ImageIcon className="h-6 w-6 text-[#5A554E]/60" />
                            <div className="text-center">
                              <p className="text-xs font-bold text-[#2A2621]">Click to upload flyer image</p>
                              <p className="text-[10px] text-[#5A554E]">PNG or JPG up to 5MB (Default gradient applied otherwise)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D8D2BC]/30 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || (creatorEntity === 'organization' && myOrgs.length === 0)} 
                      variant="neon" 
                      icon={<Check className="h-4 w-4" />}
                    >
                      {isSubmitting ? 'Publishing...' : creatorEntity === 'school' ? 'Publish Event' : (creatorEntity === 'student' && eventSubtype === 'quick') ? 'Share Now' : 'Submit for Review'}
                    </Button>
                  </div>
                </form>
              ) : (
                // ─────────────────────────────────────────────
                // PROMOTION FORM (Separate Workflow)
                // ─────────────────────────────────────────────
                <form onSubmit={handlePromoSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input 
                      label="Promotion Title" 
                      placeholder="e.g. Professional Portrait Mini Sessions"
                      value={promoForm.title}
                      onChange={e => setPromoForm({...promoForm, title: e.target.value})}
                      required
                    />

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Service Description</label>
                      <textarea 
                        className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] min-h-[120px] resize-none font-medium leading-relaxed"
                        placeholder="Explain your service, rates, timings, or initiative details..."
                        value={promoForm.description}
                        onChange={e => setPromoForm({...promoForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Promotion Category</label>
                        <select 
                          className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] font-medium cursor-pointer"
                          value={promoForm.category}
                          onChange={e => setPromoForm({...promoForm, category: e.target.value})}
                        >
                          <option value="food">Food</option>
                          <option value="hair/braiding services">Hair/braiding services</option>
                          <option value="sales">Sales</option>
                          <option value="tutoring">Tutoring</option>
                          <option value="community events">Community events</option>
                          <option value="parties">Parties</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {activeProfile.type === 'organization' ? (
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">Organizer Name / Brand Name</label>
                          <div className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#2A2621] font-bold h-[42px] flex items-center">
                            {activeProfile.name}
                          </div>
                        </div>
                      ) : (
                        <Input 
                          label="Organizer Name / Brand Name" 
                          placeholder="e.g. Alex Morgan Photography"
                          value={promoForm.organizerName}
                          onChange={e => setPromoForm({...promoForm, organizerName: e.target.value})}
                          required
                        />
                      )}
                    </div>

                    <Input 
                      label="Contact Details (Email / Social Media link)" 
                      placeholder="e.g. alex.morgan@gmail.com or @alex_portraits"
                      value={promoForm.contactInfo}
                      onChange={e => setPromoForm({...promoForm, contactInfo: e.target.value})}
                      required
                    />

                    {/* Flyer Upload Section */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest flex items-center justify-between">
                        <span>Flyer / Promo Banner (Optional)</span>
                        {promoForm.flyerImageDataUrl && (
                          <button
                            type="button"
                            onClick={() => setPromoForm(prev => ({ ...prev, flyerImageDataUrl: '' }))}
                            className="text-red-500 hover:underline text-[9px] font-bold lowercase cursor-pointer"
                          >
                            Remove flyer
                          </button>
                        )}
                      </label>
                      <input
                        ref={promoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setPromoForm(prev => ({ ...prev, flyerImageDataUrl: ev.target?.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <div
                        className="w-full rounded-2xl border-2 border-dashed border-black/10 bg-slate-50/50 p-5 flex flex-col items-center justify-center gap-2 hover:bg-[#FD5C05]/5 hover:border-[#FD5C05]/40 transition-all duration-300 cursor-pointer shadow-sm"
                        onClick={() => promoFileInputRef.current?.click()}
                      >
                        {promoForm.flyerImageDataUrl ? (
                          <img src={promoForm.flyerImageDataUrl} className="h-36 w-full object-cover rounded-xl animate-fade-in" alt="promo flyer preview" />
                        ) : (
                          <>
                            <ImageIcon className="h-6 w-6 text-[#5A554E]/60" />
                            <div className="text-center">
                              <p className="text-xs font-bold text-[#2A2621]">Click or drag to upload flyer image</p>
                              <p className="text-[10px] text-[#5A554E]">PNG, JPG up to 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Pricing Option Section (Free vs Paid option) */}
                    <div className="space-y-2.5 p-4 rounded-2xl border border-black/[0.06] bg-[#FCFAF2] text-left">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-widest">
                          Service Pricing {!promoForm.flyerImageDataUrl && <span className="text-[#FD5C05] font-black">(Choose Gratuit or Payant)</span>}
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPromoForm(prev => ({ ...prev, isFree: true, price: '' }))}
                          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                            promoForm.isFree 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                              : 'bg-white text-[#2A2621] border-black/10 hover:border-black/20'
                          }`}
                        >
                          <span>Gratuit / Free</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPromoForm(prev => ({ ...prev, isFree: false }))}
                          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                            !promoForm.isFree 
                              ? 'bg-[#FD5C05] text-white border-[#FD5C05] shadow-sm' 
                              : 'bg-white text-[#2A2621] border-black/10 hover:border-black/20'
                          }`}
                        >
                          <span>Payant / Paid</span>
                        </button>
                      </div>

                      {!promoForm.isFree && (
                        <div className="pt-2 animate-fade-in space-y-1">
                          <label className="block text-[10px] font-bold text-[#5A554E] uppercase tracking-wider">
                            Price / Rate Details
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. $15/hr, $10 mini session, fixed rate..."
                            value={promoForm.price}
                            onChange={e => setPromoForm(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full rounded-xl bg-white border border-black/10 px-4 py-2.5 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D8D2BC]/30 flex justify-end">
                    <Button type="submit" disabled={isSubmitting} variant="neon" icon={<Check className="h-4 w-4" />}>
                      {isSubmitting ? 'Submitting...' : 'Submit Promotion'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl ${
              toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-[#2A2621] text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD5C05]"></div>
      </div>
    }>
      <CreateListingPageContent />
    </Suspense>
  );
}

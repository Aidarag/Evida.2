'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ArrowRight, ArrowLeft, Check, Users, User, Shield, Sparkles, Megaphone, Image as ImageIcon, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

type CreateType = 'event' | 'promotion' | null;
type CreatorEntity = 'student' | 'organization' | 'school' | null;
type EventSubtype = 'quick' | 'standard' | null;

export default function CreateListingPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { organizations, createEvent } = useEvents();

  const [step, setStep] = useState(1);
  const [createType, setCreateType] = useState<CreateType>(null);
  const [creatorEntity, setCreatorEntity] = useState<CreatorEntity>(null);
  const [eventSubtype, setEventSubtype] = useState<EventSubtype>(null);
  
  // Form States
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
  });

  const [promoForm, setPromoForm] = useState({
    title: '',
    description: '',
    category: 'tutoring',
    organizerName: '',
    contactInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  // Filter organizations the user is member of
  const myOrgs = organizations.filter(org => currentUser.organizations.includes(org.id));
  const isAdmin = currentUser.role === 'admin';

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    // Determine previous step logic
    if (step === 4) {
      if (createType === 'promotion') {
        setStep(1);
      } else if (creatorEntity === 'student') {
        setStep(3); // Go back to subtype selection
      } else {
        setStep(2); // Go back to organizer selection
      }
    } else {
      setStep(s => s - 1);
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
      category: isSchool ? eventForm.category : (eventSubtype === 'quick' ? 'Academic' : eventForm.category),
      capacity: eventForm.capacity ? parseInt(eventForm.capacity) : undefined,
      ownershipType: creatorEntity, // 'student' | 'organization' | 'school'
      organizationId: isOrg ? org?.id : undefined,
      organizationName: isOrg ? org?.name : undefined,
      organizer: isSchool ? (eventForm.departmentName || 'School Administration') : currentUser.name,
      status: isSchool ? 'approved' : 'pending',
      complexityType: eventSubtype === 'quick' ? 'quick' : 'standard',
      coverImage: isSchool 
        ? 'from-red-500 via-pink-500 to-orange-500' // School admin gradient
        : (isOrg ? 'from-blue-600 to-indigo-900' : 'from-teal-400 to-emerald-600'),
      isFeatured: isSchool ? eventForm.isFeatured : false,
      creatorUsername: currentUser.username,
    };

    const success = await createEvent(payload);
    setIsSubmitting(false);

    if (success) {
      alert(isSchool ? 'School event published successfully!' : 'Event submitted successfully! Waiting for moderation.');
      router.push('/student/my-events');
    } else {
      alert('Failed to create event. Please try again.');
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
          organizer: promoForm.organizerName || currentUser.name,
          contactInfo: promoForm.contactInfo,
        }),
      });

      setIsSubmitting(false);

      if (res.ok) {
        alert('Promotion submitted for moderation! Since promotions are not events, they are reviewed under our student service guidelines.');
        router.push('/student/my-events');
      } else {
        const data = await res.json();
        alert(`Failed to create promotion: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to submit promotion. Please try again.');
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
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight animate-fade-in" style={{ fontFamily: 'var(--font-display)' }}>
                What would you like to create?
              </h1>
              <p className="text-xs font-semibold text-[#374151] leading-relaxed">
                Events are activities people attend. Promotions help students discover your services, business, or initiative.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                onClick={() => { setCreateType('event'); handleNext(); }}
                className="p-8 flex flex-col items-center text-center gap-5 hover:border-[#BDFB04]/50 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-[28px] bg-white border border-black/[0.04]"
              >
                {/* Custom Badge Indicator */}
                <div className="absolute top-4 left-4 bg-[#191919] text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1 select-none">
                  <span>🗓️</span> People attend
                </div>

                <div className="h-16 w-16 rounded-2xl bg-[#BDFB04]/10 text-[#BDFB04] flex items-center justify-center group-hover:scale-105 transition-transform mt-6">
                  <Calendar className="h-8 w-8" />
                </div>
                <div className="w-full text-center space-y-4">
                  <h3 className="text-xl font-black text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>Event</h3>
                  <p className="text-xs text-[#374151] leading-relaxed font-semibold">
                    Create an event students can attend.
                  </p>
                  <ul className="text-xs text-left max-w-[160px] mx-auto space-y-2 text-[#374151] font-medium border-t border-black/[0.04] pt-4">
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Club meeting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Workshop
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Party
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Sports game
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Career fair
                    </li>
                  </ul>
                </div>
              </Card>

              <Card 
                onClick={() => { setCreateType('promotion'); setStep(4); }} // Go straight to Promo Form
                className="p-8 flex flex-col items-center text-center gap-5 hover:border-[#BDFB04]/50 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-[28px] bg-white border border-black/[0.04]"
              >
                {/* Custom Badge Indicator */}
                <div className="absolute top-4 left-4 bg-[#191919] text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1 select-none">
                  <span>📢</span> People discover
                </div>

                <div className="h-16 w-16 rounded-2xl bg-[#BDFB04]/10 text-[#BDFB04] flex items-center justify-center group-hover:scale-105 transition-transform mt-6">
                  <Tag className="h-8 w-8" />
                </div>
                <div className="w-full text-center space-y-4">
                  <h3 className="text-xl font-black text-[#191919] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>Promote</h3>
                  <p className="text-xs text-[#374151] leading-relaxed font-semibold">
                    Share a service, business, or initiative with the campus community.
                  </p>
                  <ul className="text-xs text-left max-w-[160px] mx-auto space-y-2 text-[#374151] font-medium border-t border-black/[0.04] pt-4">
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Tutoring
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Student business
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Food sale
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Photography
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#BDFB04] text-sm">•</span> Student initiative
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
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
              <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Who is organizing this event?
              </h1>
              <p className="text-sm text-[#374151]">Choose who owns and hosts this event on campus.</p>
            </div>

            <div className="space-y-4">
              {/* Option 1: Me */}
              <button
                onClick={() => { setCreatorEntity('student'); handleNext(); }}
                className="w-full text-left p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#191919]/30 transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 text-[var(--color-evida-blue)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#191919] uppercase tracking-wider">Me</h3>
                  <p className="text-xs text-[#374151] mt-0.5">Student-Owned Event. Independent activities, study groups, and meetups.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#374151] ml-auto group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
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
                className="w-full text-left p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#191919]/30 transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-lime)]/10 text-[var(--color-evida-lime)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#191919] uppercase tracking-wider">My Organization</h3>
                  <p className="text-xs text-[#374151] mt-0.5">Organization-Owned Event. For verified clubs, teams, and Greek life.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#374151] ml-auto group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 3: School (Visible only to administrators) */}
              {isAdmin && (
                <button
                  onClick={() => { setCreatorEntity('school'); setStep(4); }} // Go straight to form
                  className="w-full text-left p-5 rounded-2xl border-2 border-black/[0.06] bg-white hover:bg-black/[0.01] hover:border-[#191919]/30 transition-all flex items-center gap-4 group cursor-pointer animate-pulse"
                >
                  <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-coral)]/10 text-[var(--color-evida-coral)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
                      School <span className="bg-[var(--color-evida-coral)]/20 text-[var(--color-evida-coral)] text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Admin Only</span>
                    </h3>
                    <p className="text-xs text-[#374151] mt-0.5">School-Owned Event. Official administrative postings and university initiatives.</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#374151] ml-auto group-hover:text-[#191919] group-hover:translate-x-1 transition-all" />
                </button>
              )}
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
              <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Select Event Type
              </h1>
              <p className="text-sm text-[#374151]">Choose the format that best fits your student activity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Event */}
              <Card 
                onClick={() => { setEventSubtype('quick'); handleNext(); }}
                className="p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--color-evida-lime)]/50 cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-lime)]/10 text-[var(--color-evida-lime)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Quick Event</h3>
                  <p className="text-xs text-[#374151] mt-2 leading-relaxed">
                    Minimal 5-field form for small student activities like study groups, tutoring, or small meetings. Fast-tracked approval.
                  </p>
                </div>
              </Card>

              {/* Standard Event */}
              <Card 
                onClick={() => { setEventSubtype('standard'); handleNext(); }}
                className="p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--color-evida-blue)]/50 cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 text-[var(--color-evida-blue)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Standard Event</h3>
                  <p className="text-xs text-[#374151] mt-2 leading-relaxed">
                    Full form for larger student gatherings, public meetups, or cultural events. Normal moderation process.
                  </p>
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
              <button onClick={handleBack} className="h-10 w-10 rounded-full bg-[#FFFDE1]/[0.06] flex items-center justify-center text-[#374151] hover:text-white hover:bg-[#FFFDE1]/[0.1] transition-colors cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                  {createType === 'promotion' 
                    ? 'Promotion Campaign' 
                    : `${creatorEntity}-owned ${eventSubtype === 'quick' ? 'quick' : 'standard'} event`}
                </span>
                <h1 className="text-2xl font-extrabold text-[#191919] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                  {createType === 'promotion' ? 'Create Promotion' : 'Event Details'}
                </h1>
              </div>
            </div>

            <Card className="p-8 max-sm:p-5 max-sm:rounded-[28px] border-2 border-black/[0.04] bg-white text-[#191919]">
              {createType === 'event' ? (
                // ─────────────────────────────────────────────
                // EVENT FORM
                // ─────────────────────────────────────────────
                <form onSubmit={handleEventSubmit} className="space-y-6">
                  
                  {/* Organization Selector (Visible only for Organization events) */}
                  {creatorEntity === 'organization' && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Select Club / Organization</label>
                      {myOrgs.length > 0 ? (
                        <select 
                          className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] font-medium cursor-pointer"
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
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Description</label>
                      <textarea 
                        className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] min-h-[120px] resize-none font-medium leading-relaxed"
                        placeholder="What should campus know about this event?"
                        value={eventForm.description}
                        onChange={e => setEventForm({...eventForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    
                    <div className={`grid ${eventSubtype === 'quick' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                      <Input 
                        label="Location" 
                        placeholder="e.g. Science Library Room 304"
                        value={eventForm.location}
                        onChange={e => setEventForm({...eventForm, location: e.target.value})}
                        required
                      />

                      {/* Hide Category/Capacity on Quick Student events (Simplified form) */}
                      {eventSubtype !== 'quick' && (
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Category</label>
                          <select 
                            className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] font-medium cursor-pointer"
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
                      <div className="grid grid-cols-2 gap-4">
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
                            <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest mb-1.5">Featured Event</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={eventForm.isFeatured}
                                onChange={e => setEventForm({...eventForm, isFeatured: e.target.checked})}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BDFB04]"></div>
                              <span className="ml-3 text-xs font-semibold text-[#191919]">Feature on Landing Page</span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Visual Image Uploader Mock (Hidden for Quick Student Events) */}
                    {eventSubtype !== 'quick' && (
                      <div className="space-y-1.5 pt-2">
                        <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Cover Image / Flyer</label>
                        <div className="w-full rounded-2xl border-2 border-dashed border-black/[0.08] bg-black/[0.01] p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/[0.03] transition-colors cursor-pointer">
                          <ImageIcon className="h-6 w-6 text-[#374151]/60" />
                          <div className="text-center">
                            <p className="text-xs font-bold text-[#191919]">Click to upload flyer image</p>
                            <p className="text-[10px] text-[#374151]">PNG or JPG up to 5MB (Default gradient applied otherwise)</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-black/[0.06] flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || (creatorEntity === 'organization' && myOrgs.length === 0)} 
                      variant="neon" 
                      icon={<Check className="h-4 w-4" />}
                    >
                      {isSubmitting ? 'Publishing...' : creatorEntity === 'school' ? 'Publish Event' : 'Submit for Review'}
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
                      <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Service Description</label>
                      <textarea 
                        className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#191919] placeholder-[#4B5563] focus:outline-none focus:border-[#BDFB04] min-h-[120px] resize-none font-medium leading-relaxed"
                        placeholder="Explain your service, rates, timings, or initiative details..."
                        value={promoForm.description}
                        onChange={e => setPromoForm({...promoForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-widest">Promotion Category</label>
                        <select 
                          className="w-full rounded-xl bg-white border-2 border-black/[0.08] px-4 py-3 text-xs text-[#191919] focus:outline-none focus:border-[#BDFB04] font-medium cursor-pointer"
                          value={promoForm.category}
                          onChange={e => setPromoForm({...promoForm, category: e.target.value})}
                        >
                          <option value="tutoring">Tutoring & Academic Services</option>
                          <option value="photography">Photography & Design</option>
                          <option value="food">Food Sales & Catering</option>
                          <option value="initiative">Student Initiatives & Projects</option>
                          <option value="other">Other Student Service</option>
                        </select>
                      </div>

                      <Input 
                        label="Organizer Name / Brand Name" 
                        placeholder="e.g. Alex Morgan Photography"
                        value={promoForm.organizerName}
                        onChange={e => setPromoForm({...promoForm, organizerName: e.target.value})}
                        required
                      />
                    </div>

                    <Input 
                      label="Contact Details (Email / Social Media link)" 
                      placeholder="e.g. alex.morgan@gmail.com or @alex_portraits"
                      value={promoForm.contactInfo}
                      onChange={e => setPromoForm({...promoForm, contactInfo: e.target.value})}
                      required
                    />
                  </div>

                  <div className="pt-6 border-t border-black/[0.06] flex justify-end">
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
    </div>
  );
}

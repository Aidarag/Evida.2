'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ArrowRight, ArrowLeft, Check, Users, User, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

type CreateType = 'event' | 'promotion' | null;
type CreatorEntity = 'me' | string | null; // username or orgId

export default function CreateEventPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { organizations, createEvent } = useEvents();

  const [step, setStep] = useState(1);
  const [createType, setCreateType] = useState<CreateType>(null);
  const [creatorEntity, setCreatorEntity] = useState<CreatorEntity>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    capacity: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const myOrgs = organizations.filter(org => currentUser.organizations.includes(org.id));

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isOrg = creatorEntity !== 'me';
    const org = isOrg ? organizations.find(o => o.id === creatorEntity) : null;

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      ownershipType: isOrg ? 'organization' : 'student',
      organizationId: isOrg ? org?.id : undefined,
      organizationName: isOrg ? org?.name : undefined,
      organizer: currentUser.name,
      status: 'pending',
      complexityType: isOrg ? 'standard' : 'quick',
      coverImage: 'from-[#80B0EC] to-[#DAFB71]', // Default gradient for now
    };

    const success = await createEvent(payload);
    setIsSubmitting(false);

    if (success) {
      alert('Created successfully! Waiting for school review.');
      router.push('/student/my-events');
    } else {
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* STEP 1: Type Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white">What are you creating?</h1>
              <p className="text-[#B8BBC8]">Choose the type of listing you want to add to Evida.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                onClick={() => { setCreateType('event'); handleNext(); }}
                className="p-8 flex flex-col items-center text-center gap-4 hover:border-[#80B0EC]/50"
              >
                <div className="h-16 w-16 rounded-full bg-[#80B0EC]/10 flex items-center justify-center text-[#80B0EC]">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Event</h3>
                  <p className="text-sm text-[#B8BBC8] mt-2">Host a gathering, meeting, or activity with a specific time and place.</p>
                </div>
              </Card>

              <Card 
                onClick={() => { setCreateType('promotion'); handleNext(); }}
                className="p-8 flex flex-col items-center text-center gap-4 hover:border-[#DAFB71]/50"
              >
                <div className="h-16 w-16 rounded-full bg-[#DAFB71]/10 flex items-center justify-center text-[#DAFB71]">
                  <Tag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Promotion</h3>
                  <p className="text-sm text-[#B8BBC8] mt-2">Advertise a service, initiative, or opportunity without a strict schedule.</p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Creator Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 max-w-2xl mx-auto w-full"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white">Who is hosting this?</h1>
              <p className="text-[#B8BBC8]">You can create this as yourself or on behalf of an organization.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setCreatorEntity('me'); handleNext(); }}
                className="w-full text-left p-6 rounded-2xl border border-white/[0.06] bg-[#171722] hover:bg-white/[0.04] hover:border-[#80B0EC]/30 transition-all flex items-center gap-4 group"
              >
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:bg-[#80B0EC] group-hover:text-[#08080B] transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Myself</h3>
                  <p className="text-sm text-[#B8BBC8]">Create an independent student-led {createType}.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#B8BBC8] ml-auto group-hover:text-white transition-colors" />
              </button>

              {myOrgs.length > 0 && (
                <div className="pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-[#B8BBC8] uppercase tracking-wider pl-2">My Organizations</h4>
                  {myOrgs.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { setCreatorEntity(org.id); handleNext(); }}
                      className="w-full text-left p-6 rounded-2xl border border-white/[0.06] bg-[#171722] hover:bg-white/[0.04] hover:border-[#DAFB71]/30 transition-all flex items-center gap-4 group"
                    >
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:bg-[#DAFB71] group-hover:text-[#08080B] transition-colors">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{org.name}</h3>
                        <p className="text-sm text-[#B8BBC8]">Official organization event.</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#B8BBC8] ml-auto group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-start">
              <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Details Form */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="mb-8 flex items-center gap-4">
              <button onClick={handleBack} className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center text-[#B8BBC8] hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white capitalize">{createType} Details</h1>
                <p className="text-sm text-[#B8BBC8]">Fill in the information below.</p>
              </div>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input 
                    label="Title" 
                    placeholder={`e.g. End of Year ${createType === 'event' ? 'Gala' : 'Portrait Minis'}`}
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#B8BBC8]">Description</label>
                    <textarea 
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#B8BBC8]/50 focus:outline-none focus:border-[#80B0EC]/50 focus:ring-1 focus:ring-[#80B0EC]/30 min-h-[120px] resize-none"
                      placeholder="What should people know?"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  {createType === 'event' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Date" 
                          type="date"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          required
                        />
                        <Input 
                          label="Time" 
                          type="time"
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Location" 
                          placeholder="e.g. Student Union"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          required
                        />
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-[#B8BBC8]">Category</label>
                          <select 
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#80B0EC]/50"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                          >
                            <option value="Social">Social</option>
                            <option value="Academic">Academic</option>
                            <option value="Career">Career</option>
                            <option value="Sports">Sports</option>
                            <option value="Culture">Culture</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Visual Image Uploader Mock */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-medium text-[#B8BBC8]">Cover Image / Flyer</label>
                    <div className="w-full rounded-2xl border-2 border-dashed border-white/[0.1] bg-white/[0.02] p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <ImageIcon className="h-8 w-8 text-[#B8BBC8]" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">Click to upload image</p>
                        <p className="text-xs text-[#B8BBC8]">PNG, JPG, or GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex justify-end">
                  <Button type="submit" disabled={isSubmitting} variant="neon" icon={<Check className="h-4 w-4" />}>
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Shield, 
  Users, 
  Search, 
  ArrowRight, 
  Calendar, 
  Megaphone, 
  BookOpen, 
  Camera, 
  Heart, 
  ShoppingBag,
  Bell,
  CheckCircle,
  Brain,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';

type TabKey = 'ownership' | 'creation' | 'approval';
type OwnershipCategory = 'student' | 'organization' | 'school';

export default function AppShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('ownership');
  const [ownershipCat, setOwnershipCat] = useState<OwnershipCategory>('student');

  const tabs = [
    {
      id: 'ownership' as TabKey,
      label: 'Ownership Types',
      title: 'Event Ownership Types',
      subtitle: 'Every event belongs to one of three categories:',
      points: [
        {
          name: 'Student-Owned Event',
          desc: 'Created by an individual student.',
          examples: ['Study group', 'Networking meetup', 'Cultural gathering'],
          color: '#E8FF40',
          icon: GraduationCap
        },
        {
          name: 'Organization-Owned Event',
          desc: 'Created by verified members of clubs.',
          examples: ['Tennis Team Event', 'STEM Club Workshop', 'Student Gov Meeting'],
          color: '#203627',
          icon: Users
        },
        {
          name: 'School-Owned Event',
          desc: 'Created by official school accounts.',
          examples: ['Orientation', 'Homecoming', 'Career Fair'],
          color: '#E8FF40',
          icon: Shield
        }
      ]
    },
    {
      id: 'creation' as TabKey,
      label: 'Creation System',
      title: 'Event Creation System',
      subtitle: 'The Create button is central to Evida. Students can easily list:',
      points: [
        {
          name: 'Event',
          desc: 'An activity with Date, Time, Location, and Attendees.',
          examples: ['Club meeting', 'Workshop', 'Cultural event'],
          color: '#E8FF40',
          icon: Calendar
        },
        {
          name: 'Promotion',
          desc: 'Something a student wants to advertise (moderated separately).',
          examples: ['Tutoring services', 'Photography business', 'Food sales', 'Student initiatives'],
          color: '#203627',
          icon: Megaphone
        }
      ]
    },
    {
      id: 'approval' as TabKey,
      label: 'Smart Approval',
      title: 'Smart Event Approval',
      subtitle: 'Evida does not replace school processes, it simplifies them.',
      points: [
        {
          name: 'Auto-Categorization',
          desc: 'The platform automatically analyzes request parameters and routes them to the correct admin review queues.',
          examples: ['Fast Track (Instant)', 'Standard Review', 'Complex Case Audit'],
          color: '#E8FF40',
          icon: Brain
        },
        {
          name: 'Dynamic Checkpoints',
          desc: 'Flags potential conflicts, location double-bookings, and policy violations before submitting.',
          examples: ['Automated scheduling guard', 'Safety & policy advisor'],
          color: '#203627',
          icon: Layers
        }
      ]
    }
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  // Mock events inside the iPhone simulator (Ownership Tab)
  const simulatorEvents: Record<OwnershipCategory, any> = {
    student: {
      title: 'Midterm Study Group',
      org: 'Alex Rivera (CS Major)',
      date: 'Oct 12, 2026 • 2:00 PM',
      loc: 'Library Study Room 3A',
      joined: '8 Joined',
      price: 'Free',
      bgImg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop'
      ]
    },
    organization: {
      title: 'STEM Club Hackathon',
      org: 'STEM Club Verified',
      date: 'Oct 18, 2026 • 10:00 AM',
      loc: 'Engineering Lab Hall B',
      joined: '45 Joined',
      price: 'Free',
      bgImg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=500&fit=crop',
      avatars: [
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
      ]
    },
    school: {
      title: 'Homecoming Concert',
      org: 'Official School Account',
      date: 'Oct 24, 2026 • 7:00 PM',
      loc: 'Campus Main Plaza',
      joined: '350+ Joined',
      price: '$15',
      bgImg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop',
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&h=50&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop'
      ]
    }
  };

  const activeEvent = simulatorEvents[ownershipCat];

  return (
    <section className="w-full py-24 bg-[#EFEFEF] border-t border-black/[0.04] font-sans overflow-hidden" id="app-showcase">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Copy & Tab controls */}
        <div className="w-full lg:w-1/2 space-y-10">
          
          <div className="space-y-4">
            <span className="text-[#E8FF40] font-bold uppercase text-xs tracking-[0.2em]">
              Product Tour
            </span>
            
            {/* Tab Pill Selector */}
            <div className="flex gap-2 p-1.5 bg-black/[0.03] rounded-full w-max border border-black/[0.02]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#203627] shadow-sm'
                      : 'text-[#4F5666] hover:text-[#203627]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h2 className="text-[#203627] font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              {currentTab.title}
            </h2>
            <p className="text-[#4F5666] text-sm md:text-base font-light">
              {currentTab.subtitle}
            </p>
          </div>

          {/* Bullet Points */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentTab.points.map((pt, idx) => {
                  const IconComp = pt.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div 
                        className="p-3 rounded-2xl shrink-0 transition-colors"
                        style={{ backgroundColor: `${pt.color}12`, color: pt.color }}
                      >
                        <IconComp className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-[#203627] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                          {pt.name}
                        </h4>
                        <p className="text-[#4F5666] text-xs sm:text-sm font-light leading-relaxed">
                          {pt.desc}
                        </p>
                        
                        {/* Examples pill list */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pt.examples.map((ex, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-semibold text-gray-500 bg-black/[0.03] border border-black/[0.04] px-2.5 py-0.5 rounded-full"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Right Side: Interactive iPhone Mockup */}
        <div className="w-full lg:w-1/2 flex justify-center relative max-sm:-mx-4">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E8FF40]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* iPhone body - responsive size */}
          <div className="relative w-[280px] h-[570px] min-w-[280px] sm:w-[300px] sm:h-[610px] rounded-[42px] sm:rounded-[50px] border-[8px] sm:border-[9px] border-[#27272A] bg-[#203627] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col select-none ring-1 ring-white/10">
            
            {/* Dynamic Island Notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3 text-[9px] text-white/40 font-bold tracking-tight">
              <span>10:41</span>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>80%</span>
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="flex-1 pt-12 pb-6 px-4 flex flex-col relative z-20 text-white font-sans h-full">
              
              <AnimatePresence mode="wait">
                
                {/* 1. Ownership Tab Screen */}
                {activeTab === 'ownership' && (
                  <motion.div
                    key="ownership-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col h-full justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <EvidaLogo size={20} showText={true} lightMode={false} />
                      </div>
                      <div className="flex gap-1.5">
                        <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center border border-white/5 text-white cursor-pointer">
                          <Bell className="h-3.5 w-3.5" />
                        </div>
                        <img 
                          className="h-7 w-7 rounded-full object-cover border border-white/10" 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" 
                          alt="Avatar" 
                        />
                      </div>
                    </div>

                    {/* Headline & Search capsule */}
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <h3 className="text-xl font-bold uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                        Choose<br />Today's Event
                      </h3>
                      {/* White Capsule Search button from screenshot */}
                      <div className="h-10 w-9 bg-white rounded-full flex items-center justify-center text-black shrink-0 shadow-lg shadow-white/5 cursor-pointer">
                        <Search className="h-4 w-4 stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Ownership Sub-Categories horizontal list */}
                    <div className="flex gap-2 overflow-x-auto pb-3 text-[9px] font-bold uppercase tracking-wider scrollbar-none">
                      {(['student', 'organization', 'school'] as OwnershipCategory[]).map((cat) => {
                        const isActive = ownershipCat === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setOwnershipCat(cat)}
                            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                              isActive
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-white/50 border-white/5 hover:text-white'
                            }`}
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Carousel Card (Event image & details) */}
                    <div className="flex-1 relative rounded-[24px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-4 h-60">
                      {/* Background event image */}
                      <motion.div
                        key={ownershipCat}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ backgroundImage: `url('${activeEvent.bgImg}')` }}
                        className="absolute inset-0 bg-cover bg-center"
                      />
                      
                      {/* Dark overlay gradients */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90" />

                      {/* Floating Price Tag */}
                      <span className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase px-3 py-1 rounded-full text-white tracking-widest">
                        {activeEvent.price}
                      </span>

                      {/* Content */}
                      <div className="relative z-10 space-y-2">
                        {/* Stacked Avatars */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5">
                            {activeEvent.avatars.map((av: string, i: number) => (
                              <img key={i} className="h-4.5 w-4.5 rounded-full border border-black object-cover" src={av} alt="user" />
                            ))}
                          </div>
                          <span className="text-[8px] font-bold text-white/80 uppercase tracking-widest">{activeEvent.joined}</span>
                        </div>

                        {/* Title */}
                        <h4 className="font-extrabold text-[15px] uppercase tracking-wide leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                          {activeEvent.title}
                        </h4>

                        {/* Date & Location */}
                        <div className="text-[9px] text-white/60 space-y-0.5 leading-none">
                          <p>{activeEvent.date}</p>
                          <p className="opacity-75">{activeEvent.loc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Bottom Tab Bar matching screenshot */}
                    <div className="mt-4 bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-full py-2 px-3 flex items-center justify-between shadow-2xl z-30">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E8FF40]"></span>
                      </div>
                      <Users className="h-4 w-4 text-white/40 cursor-pointer" />
                      {/* Big White Circular Add Button */}
                      <div 
                        onClick={() => setActiveTab('creation')}
                        className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black cursor-pointer shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-transform"
                      >
                        <span className="text-xl font-bold leading-none">+</span>
                      </div>
                      <Calendar className="h-4 w-4 text-white/40 cursor-pointer" />
                      <Shield className="h-4 w-4 text-white/40 cursor-pointer" />
                    </div>
                  </motion.div>
                )}

                {/* 2. Creation Tab Screen */}
                {activeTab === 'creation' && (
                  <motion.div
                    key="creation-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between h-full"
                  >
                    {/* Header */}
                    <div>
                      <span className="text-[#E8FF40] text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">
                        Evida Wizard
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        Choose Categories
                      </h3>
                    </div>

                    {/* Creation Type Grid matching screenshot */}
                    <div className="grid grid-cols-2 gap-2.5 my-4">
                      {[
                        { label: 'Event', icon: Calendar, active: true },
                        { label: 'Promotion', icon: Megaphone, active: false },
                        { label: 'Tutoring', icon: BookOpen, active: false },
                        { label: 'Student Org', icon: Users, active: false },
                        { label: 'Creative Biz', icon: Camera, active: false },
                        { label: 'Donation', icon: Heart, active: false }
                      ].map((cell, idx) => {
                        const Icon = cell.icon;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setActiveTab('approval')}
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 h-20 transition-all cursor-pointer ${
                              cell.active 
                                ? 'bg-white/15 border-[#E8FF40] shadow-[0_4px_12px_rgba(255,90,31,0.1)]' 
                                : 'bg-white/[0.04] border-white/5 hover:border-white/15'
                            }`}
                          >
                            <Icon className={`h-4.5 w-4.5 ${cell.active ? 'text-[#E8FF40]' : 'text-white/60'}`} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{cell.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Get Started Button */}
                    <button
                      onClick={() => setActiveTab('approval')}
                      className="w-full py-3 bg-white text-[#203627] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-white/5 hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer text-center"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Get Started
                    </button>
                  </motion.div>
                )}

                {/* 3. Approval Tab Screen */}
                {activeTab === 'approval' && (
                  <motion.div
                    key="approval-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between h-full py-4"
                  >
                    <div>
                      <span className="text-[#E8FF40] text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">
                        Smart Engine
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        Request Routing
                      </h3>
                    </div>

                    {/* Progress approval flow */}
                    <div className="space-y-4 my-6">
                      {[
                        { title: '1. Event Submitted', desc: 'Study Session cs101', status: 'done' },
                        { title: '2. Smart Review', desc: 'Conflict checked. Safe parameters.', status: 'pulse' },
                        { title: '3. Fast Track Approved', desc: 'Instantly published to feed.', status: 'pending' }
                      ].map((step, idx) => (
                        <div 
                          key={idx}
                          className={`p-3.5 rounded-2xl border text-left flex gap-3 items-center ${
                            step.status === 'done'
                              ? 'bg-white/10 border-white/10'
                              : step.status === 'pulse'
                              ? 'bg-[#E8FF40]/10 border-[#E8FF40]/30 animate-pulse'
                              : 'bg-white/[0.02] border-white/5 opacity-55'
                          }`}
                        >
                          {step.status === 'done' ? (
                            <CheckCircle className="h-5 w-5 text-white shrink-0" />
                          ) : step.status === 'pulse' ? (
                            <Brain className="h-5 w-5 text-[#E8FF40] shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-white/20 shrink-0" />
                          )}
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-wide">{step.title}</h4>
                            <p className="text-[9px] text-white/50">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setActiveTab('ownership');
                        setOwnershipCat('student');
                      }}
                      className="w-full py-3 bg-[#E8FF40] hover:bg-[#d8ee2e] text-[#203627] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/10 hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer text-center"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Reset Simulator
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </div>

          {/* Mobile floating tip icon */}
          <div className="absolute -bottom-6 flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8FF40] animate-ping"></span>
            Click elements inside phone to interact
          </div>

        </div>

      </div>
    </section>
  );
}

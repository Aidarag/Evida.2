'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calendar, Shield, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { useEvents } from '@/lib/context/EventContext';

export default function LandingPage() {
  const { events } = useEvents();
  const featuredEvents = events.filter(e => e.status === 'approved').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08080B] text-slate-100 flex flex-col overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col md:flex-row items-center gap-12 z-10 w-full">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#80B0EC]/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#DAFB71]/10 blur-[150px] pointer-events-none"></div>

        {/* Text Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-[#B8BBC8] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DAFB71] animate-pulse"></span>
              The Digital Home of Campus Life
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]"
          >
            Your campus, <br />
            <span className="bg-gradient-to-r from-[#80B0EC] to-[#DAFB71] bg-clip-text text-transparent">
              all in one place.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-[#B8BBC8] max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
          >
            Discover, create, attend, and remember campus experiences. Evida centralizes campus life by helping students discover events and helping schools manage engagement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
          >
            <Link href="/student/events">
              <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Explore Events
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Card Preview */}
        <div className="md:w-1/2 w-full flex justify-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative w-full max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#80B0EC]/30 via-transparent to-[#DAFB71]/20 z-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-transparent z-10" />

            <div className="absolute inset-x-6 bottom-8 z-20 space-y-3">
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                Featured
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Homecoming Kickoff Rally 2026
              </h3>
              <div className="flex items-center justify-between text-sm font-medium text-[#B8BBC8]">
                <span>OCTOBER 9 • Plaza</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-[#111118] border-y border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Why Evida?</h2>
            <p className="text-[#B8BBC8] text-lg leading-relaxed">
              Students miss events because information is scattered across emails, flyers, and group chats. Schools struggle to track engagement. Evida fixes both.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-[32px] border border-white/[0.06] bg-[#08080B]/50 p-10 space-y-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#80B0EC]/10 blur-[80px]"></div>
              <div className="h-14 w-14 rounded-2xl bg-[#80B0EC]/15 flex items-center justify-center text-[#80B0EC]">
                <Users className="h-7 w-7" />
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold text-white">For Students</h3>
                <ul className="space-y-4 text-[#B8BBC8]">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#80B0EC]" /> Discover campus events
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#80B0EC]" /> Create events or promotions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#80B0EC]" /> Stay connected to campus life
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/[0.06] bg-[#08080B]/50 p-10 space-y-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#EE3D5A]/10 blur-[80px]"></div>
              <div className="h-14 w-14 rounded-2xl bg-[#EE3D5A]/15 flex items-center justify-center text-[#EE3D5A]">
                <Shield className="h-7 w-7" />
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold text-white">For Schools</h3>
                <ul className="space-y-4 text-[#B8BBC8]">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#EE3D5A]" /> Review and approve events
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#EE3D5A]" /> Feature official events
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#EE3D5A]" /> View engagement analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-5xl px-6 py-32 text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#DAFB71]/10 blur-[120px] rounded-full -z-10" />
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
          Bring your campus life <br /> into one platform.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              School Admin Access
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-12 bg-[#08080B] text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-[#80B0EC] to-[#DAFB71] flex items-center justify-center">
            <span className="text-[#08080B] font-black text-[10px]">E</span>
          </div>
          <span className="text-sm font-bold text-white">Evida</span>
        </div>
        <p className="text-xs text-[#B8BBC8]">© 2026 Evida Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

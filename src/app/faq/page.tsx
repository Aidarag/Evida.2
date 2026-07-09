'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { DesktopNav } from '@/components/Navbar';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Evida?",
    answer: "Evida is a unified digital home for student life on campus. It brings event discovery, service promotions, club coordination, and administrative verification into a unified, streetwear-themed digital experience."
  },
  {
    question: "How does smart event approval work?",
    answer: "Student-owned events are categorized dynamically by our smart routing engine. Small gatherings (like study groups under 15 attendees) are fast-tracked for immediate scheduling, while larger events requesting student government funding or university buses are routed to the administrative moderation queue."
  },
  {
    question: "What is the difference between an Event and a Promotion?",
    answer: "Events are active student listings with a specific date, time, and campus location (such as yard shows, matches, or workshops). Promotions are advertisements for student-led services or initiatives (such as tutoring, freelance photography, food sales, or club recruitment) and are moderated under service guidelines."
  },
  {
    question: "Who can host official school-owned events?",
    answer: "Only verified school accounts, departments, and administrative boards can publish school-owned events. Verified student organizations can host organization events, while individual students can host student events."
  },
  {
    question: "How can my student group get verified?",
    answer: "Campus groups can submit a verification request through their student profile. Once verified by campus administration, your group receives a verification badge, unlocking advanced hosting capabilities and the ability to request funding."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#DFDED7] text-[#191919] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-28 md:py-36 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#191919] text-[#BDFB04] text-[10px] font-extrabold uppercase tracking-widest">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-[#191919]" style={{ fontFamily: 'var(--font-display)' }}>
            Got Questions?<br />We got answers.
          </h1>
          <p className="text-sm text-[#374151] max-w-lg mx-auto font-light leading-relaxed">
            Everything you need to know about Evida event scheduling, promotions, and verification guidelines.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                >
                  <span className="text-sm font-extrabold text-[#191919] uppercase tracking-wide">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#BDFB04] text-[#191919]' : 'bg-black/5 text-[#374151]'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs text-[#374151] leading-relaxed font-light border-t border-black/[0.03]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Accent */}
        <div className="pt-8 text-center">
          <p className="text-[10px] font-bold text-[#374151] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#BDFB04]" />
            Still confused? Contact hello@evida.app
          </p>
        </div>
      </main>
    </div>
  );
}

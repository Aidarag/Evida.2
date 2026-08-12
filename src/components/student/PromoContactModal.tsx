'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MessageCircle, Globe, AtSign } from 'lucide-react';
import { Promotion } from '@/lib/types';

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

interface PromoContactModalProps {
  promo: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = {
  type: 'email' | 'phone' | 'instagram' | 'link' | 'text';
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

/** Detect contact method type from a Promotion */
function parseContactMethods(promo: Promotion): ContactMethod[] {
  const methods: ContactMethod[] = [];
  
  // 1. Check preferred contact method from new options first
  if (promo.preferredContactMethod && promo.contactValue) {
    const method = promo.preferredContactMethod;
    const val = promo.contactValue.trim();

    if (method === 'instagram') {
      const handle = val.startsWith('@') ? val.slice(1) : val.replace(/.*instagram\.com\//i, '');
      methods.push({
        type: 'instagram',
        label: 'Instagram',
        value: val.startsWith('@') ? val : `@${handle}`,
        href: `https://instagram.com/${handle}`,
        icon: <InstagramIcon className="h-5 w-5" />,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      });
    } else if (method === 'email') {
      methods.push({
        type: 'email',
        label: 'Email',
        value: val,
        href: `mailto:${val}?subject=Inquiry regarding: ${encodeURIComponent(promo.title)}`,
        icon: <Mail className="h-5 w-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      });
    } else if (method === 'phone') {
      methods.push({
        type: 'phone',
        label: 'Call / SMS',
        value: val,
        href: `tel:${val.replace(/\D/g, '')}`,
        icon: <Phone className="h-5 w-5" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      });
    } else if (method === 'link') {
      const url = val.startsWith('http') ? val : `https://${val}`;
      methods.push({
        type: 'link',
        label: 'Website / Social Link',
        value: val,
        href: url,
        icon: <Globe className="h-5 w-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      });
    }
  }

  // Also include hyperlink if provided separately
  if (promo.socialLink && !methods.some(m => m.type === 'link')) {
    const url = promo.socialLink.startsWith('http') ? promo.socialLink : `https://${promo.socialLink}`;
    methods.push({
      type: 'link',
      label: 'Website / Link',
      value: promo.socialLink,
      href: url,
      icon: <Globe className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    });
  }

  // 2. Fallback parse from raw contactInfo if empty
  if (methods.length === 0 && promo.contactInfo) {
    const raw = promo.contactInfo.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[\d\s\-\+\(\)\.]{7,}$/;
    const igRe = /^@\w+$|instagram/i;

    if (emailRe.test(raw)) {
      methods.push({
        type: 'email',
        label: 'Email',
        value: raw,
        href: `mailto:${raw}?subject=Inquiry regarding: ${encodeURIComponent(promo.title)}`,
        icon: <Mail className="h-5 w-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      });
    } else if (igRe.test(raw)) {
      const handle = raw.startsWith('@') ? raw.slice(1) : raw.replace(/.*instagram\.com\//i, '');
      methods.push({
        type: 'instagram',
        label: 'Instagram',
        value: raw.startsWith('@') ? raw : `@${handle}`,
        href: `https://instagram.com/${handle}`,
        icon: <InstagramIcon className="h-5 w-5" />,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      });
    } else if (phoneRe.test(raw)) {
      methods.push({
        type: 'phone',
        label: 'Call / SMS',
        value: raw,
        href: `tel:${raw.replace(/\D/g, '')}`,
        icon: <Phone className="h-5 w-5" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      });
    } else {
      methods.push({
        type: 'text',
        label: 'Contact Info',
        value: raw,
        href: raw.startsWith('http') ? raw : '#',
        icon: raw.startsWith('http') ? <Globe className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />,
        color: 'text-[#FD5C05]',
        bgColor: 'bg-[#FD5C05]/5 hover:bg-[#FD5C05]/10 border-[#FD5C05]/20',
      });
    }
  }

  return methods;
}

const methodIconColors: Record<string, string> = {
  email: 'bg-blue-500',
  phone: 'bg-emerald-500',
  instagram: 'bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400',
  link: 'bg-purple-500',
  text: 'bg-[#FD5C05]',
};

export default function PromoContactModal({ promo, isOpen, onClose }: PromoContactModalProps) {
  if (!promo) return null;

  const methods = parseContactMethods(promo);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-white rounded-[28px] shadow-2xl overflow-hidden">
              {/* Header accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#FD5C05] via-orange-400 to-amber-400" />

              <div className="p-6 space-y-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FD5C05]">
                      Reach Out
                    </p>
                    <h2
                      className="text-base font-bold text-[#2A2621] leading-tight line-clamp-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {promo.title}
                    </h2>
                    <p className="text-[11px] text-[#5A554E] font-semibold">
                      By {promo.organizer}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 h-8 w-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#5A554E] hover:text-[#2A2621] transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* How would you like to connect? */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5A554E]">
                    How would you like to connect?
                  </p>

                  {methods.length === 0 ? (
                    <p className="text-xs text-[#5A554E] py-4 text-center">
                      No contact info provided.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {methods.map((m, idx) => (
                        <a
                          key={idx}
                          href={m.href}
                          target={m.type === 'instagram' || m.type === 'link' || m.href.startsWith('http') ? '_blank' : undefined}
                          rel={m.type === 'instagram' || m.type === 'link' || m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          onClick={m.href === '#' ? (e) => e.preventDefault() : undefined}
                          className={`flex items-center gap-3.5 w-full rounded-2xl border px-4 py-3.5 transition-all duration-200 cursor-pointer ${m.bgColor}`}
                        >
                          {/* Icon bubble */}
                          <span
                            className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${methodIconColors[m.type]}`}
                          >
                            {m.icon}
                          </span>

                          <div className="text-left min-w-0 flex-1">
                            <p className={`text-xs font-black uppercase tracking-wider ${m.color}`}>
                              {m.label}
                            </p>
                            <p className="text-[11px] text-[#5A554E] font-semibold truncate mt-0.5">
                              {m.value}
                            </p>
                          </div>

                          {/* Arrow */}
                          {m.href !== '#' && (
                            <span className={`text-xs font-black ${m.color} shrink-0`}>→</span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer note */}
                <p className="text-[10px] text-[#5A554E]/70 text-center leading-relaxed">
                  This is a student-run promotion. Evida is not responsible for external transactions.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

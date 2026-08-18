'use client';

import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, Heart, Star, Sparkles, Plus, Home, Compass, Bookmark, Shield, Bell, X, Check, Eye } from 'lucide-react';
import { Event, User, Notification, Organization } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';

interface StudentDashboardProps {
  events: Event[];
  currentUser: User;
  savedEventsList: Event[];
  rsvpEventsList: Event[];
  createdEventsList: Event[];
  organizations: Organization[];
  notifications: Notification[];
  activeTab: 'explore' | 'saved' | 'profile' | 'orgs' | 'search';
  setActiveTab: (tab: 'explore' | 'saved' | 'profile' | 'orgs' | 'search') => void;
  onOpenDetails: (event: Event) => void;
  onOpenCreate: () => void;
  onSaveToggle: (id: string) => void;
  onRSVPToggle: (id: string, action: 'rsvp' | 'interested') => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  onMarkNotificationRead: (id: string) => void;
  onClearNotification: (id: string) => void;
  renderSubView: () => React.ReactNode;
}

export default function StudentDashboard({
  events,
  currentUser,
  savedEventsList,
  rsvpEventsList,
  createdEventsList,
  organizations,
  notifications,
  activeTab,
  setActiveTab,
  onOpenDetails,
  onOpenCreate,
  onSaveToggle,
  onRSVPToggle,
  notificationsOpen,
  setNotificationsOpen,
  onMarkNotificationRead,
  onClearNotification,
  renderSubView,
}: StudentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list (Baskets)
  const categories = ['All', 'Food & BBQ Sales', 'Student Businesses', 'Academic & Workshops', 'Career & Jobs', 'Sports & Fitness', 'Creative & Arts', 'Social & Greek Life', 'Official School Events'];

  // Filter events for the Explore feed
  const exploreEvents = events.filter((e) => {
    if (e.status !== 'approved') return false; // Feed only shows approved public events
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const cat = (e.category || '').toLowerCase();
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Food & BBQ Sales' && (cat.includes('food') || cat.includes('bbq'))) ||
      (selectedCategory === 'Student Businesses' && (cat.includes('business') || cat.includes('market') || cat.includes('beauty'))) ||
      (selectedCategory === 'Academic & Workshops' && (cat.includes('academic') || cat.includes('tutor') || cat.includes('workshop'))) ||
      (selectedCategory === 'Career & Jobs' && (cat.includes('career') || cat.includes('job') || cat.includes('fair'))) ||
      (selectedCategory === 'Sports & Fitness' && (cat.includes('sport') || cat.includes('athlet') || cat.includes('fitness'))) ||
      (selectedCategory === 'Creative & Arts' && (cat.includes('creative') || cat.includes('art') || cat.includes('music') || cat.includes('photo'))) ||
      (selectedCategory === 'Social & Greek Life' && (cat.includes('social') || cat.includes('greek') || cat.includes('party'))) ||
      (selectedCategory === 'Official School Events' && e.ownershipType === 'school') ||
      e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredEvent = events.find((e) => e.featured && e.status === 'approved') || exploreEvents[0];
  const trendingEvents = exploreEvents.filter((e) => e.views >= 200);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Social': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Academic': return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
      case 'Career': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Sports': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#EAE4CF] text-[#2A2621] flex flex-col md:flex-row pb-20 md:pb-0 font-sans">
      
      {/* ==================== DESKTOP SIDEBAR NAV ==================== */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-[#D8D2BC]/30 flex-col justify-between p-6 sticky top-0 h-screen shrink-0 shadow-sm">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <EvidaLogo size={32} lightMode={true} />
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {[
              { id: 'explore', label: 'Explore', icon: Compass },
              { id: 'saved', label: 'Saved Events', icon: Bookmark },
              { id: 'orgs', label: 'Organizations', icon: Users },
              { id: 'profile', label: 'My Profile', icon: Home },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FD5C05] border-l-4 border-black/30 text-white shadow-sm'
                      : 'text-[#5A554E] hover:text-[#FD5C05] hover:bg-[#A2C2BE]/10'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="space-y-4 pt-6 border-t border-[#D8D2BC]/30">
          <button
            onClick={onOpenCreate}
            className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-[#FD5C05] hover:bg-[#CC3D00] py-3 text-xs font-bold text-white shadow-lg shadow-[#FD5C05]/20 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            CREATE EVENT
          </button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#A2C2BE]/20 border border-[#D8D2BC] flex items-center justify-center font-extrabold text-xs text-[#2A2621] shadow-sm">
              {currentUser.avatar}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#2A2621]">{currentUser.name}</p>
              <p className="text-[10px] text-[#5A554E]">{currentUser.major}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================== CONTENT BODY ==================== */}
      <div className="flex-1 min-w-0">
        
        {/* Top Header (Mobile & Desktop Header Toolbar) */}
        <header className="sticky top-0 z-30 h-16 w-full border-b border-[#D8D2BC]/30 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center md:hidden">
            <EvidaLogo size={28} lightMode={true} />
          </div>

          <div className="hidden md:block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A554E]">
              CAMPUS EXPERIENCE HUB
            </span>
          </div>

          {/* Top Header Actions (Notifications) */}
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative h-9 w-9 rounded-xl border border-black/10 bg-white flex items-center justify-center text-[#5A554E] hover:text-[#2A2621] cursor-pointer shadow-sm"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FD5C05] text-[9px] font-bold text-white flex items-center justify-center border border-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Notification Panel Popover */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="fixed sm:absolute top-16 sm:top-11 left-4 right-4 sm:left-auto sm:right-0 sm:w-80 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-2xl z-50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#D8D2BC]/30 pb-2">
                    <span className="text-xs font-bold uppercase text-[#2A2621]">Notifications</span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#5A554E] hover:text-[#2A2621] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-[#5A554E] italic text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-all text-left space-y-1 relative ${
                            n.read
                              ? 'bg-slate-50 border-black/[0.04] text-[#5A554E]'
                              : 'bg-[#FD5C05]/10 border-[#FD5C05]/30 text-[#2A2621]'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[10px] font-bold text-[#2A2621] uppercase">{n.title}</span>
                            <span className="text-[9px] text-[#5A554E] font-semibold">{n.timestamp}</span>
                          </div>
                          <p className="text-[10px] leading-relaxed">{n.message}</p>
                          <div className="flex justify-end gap-1.5 pt-1.5">
                            {!n.read && (
                              <button
                                onClick={() => onMarkNotificationRead(n.id)}
                                className="text-[9px] font-bold text-[#2A2621] hover:underline cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => onClearNotification(n.id)}
                              className="text-[9px] font-bold text-[#5A554E] hover:text-[#2A2621] hover:underline cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dynamic Inner Panel View Wrapper */}
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {activeTab === 'explore' ? (
            /* ==================== EXPLORE EVENTS FEED ==================== */
            <div className="space-y-8">
              
              {/* Featured Experience Hero Card (HYPERACTIVE Visual Style) */}
              {featuredEvent && (
                <div
                  onClick={() => onOpenDetails(featuredEvent)}
                  className="relative rounded-[32px] overflow-hidden border border-black/[0.08] cursor-pointer aspect-[16/9] sm:aspect-[21/9] w-full poster-card shadow-xl"
                >
                  {/* Poster Image */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${featuredEvent.coverImage} opacity-30`} />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />

                  {/* Badges/Details Overlay */}
                  <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <span className="rounded-full bg-[#FD5C05] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 shadow-sm border border-[#FD5C05]/30">
                        TODAY'S HIGHLIGHT
                      </span>
                      
                      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-[#D8D2BC] rounded-full px-3 py-1 text-[10px] font-bold text-[#2A2621] shadow-sm">
                        <Users className="h-3.5 w-3.5 text-[#2A2621]" />
                        <span>{featuredEvent.attendees.length} attending</span>
                      </div>
                    </div>

                    <div className="max-w-2xl space-y-2">
                      <span className="text-xs font-bold text-white bg-[#FD5C05] px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                        {featuredEvent.organizationName || 'OFFICIAL EVENT'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2621] tracking-tighter leading-none bg-white/95 px-3 py-1.5 rounded-2xl w-fit shadow-sm border border-[#D8D2BC]/40">
                        {featuredEvent.title}
                      </h2>
                      <p className="text-xs text-[#2A2621] font-medium bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl w-fit line-clamp-2 leading-relaxed shadow-sm border border-[#D8D2BC]/40">
                        {featuredEvent.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-extrabold text-[#2A2621] pt-2 uppercase">
                        <span className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-sm border border-[#D8D2BC]/40">
                          <Calendar className="h-3.5 w-3.5 text-[#2A2621]" />
                          {featuredEvent.date} • {featuredEvent.time}
                        </span>
                        <span className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-sm border border-[#D8D2BC]/40">
                          <MapPin className="h-3.5 w-3.5 text-[#2A2621]" />
                          {featuredEvent.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category selector chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-bold border shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FD5C05] border-[#FD5C05]/30 text-white shadow-sm font-extrabold'
                          : 'bg-white border-[#D8D2BC] text-[#5A554E] hover:text-[#2A2621] hover:border-black/10'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search input tool */}
              <div className="relative w-full max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-4 w-4 text-[#5A554E]" />
                </div>
                <input
                  type="text"
                  placeholder="Search title, venue, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-10 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] transition-colors shadow-sm"
                />
              </div>

              {/* Trending Events Horizontal Carousels */}
              {trendingEvents.length > 0 && selectedCategory === 'All' && !searchQuery && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold tracking-widest text-[#5A554E] uppercase">
                      TRENDING EVENTS
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none">
                    {trendingEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenDetails(event)}
                        className="w-[280px] shrink-0 rounded-[28px] overflow-hidden border border-[#D8D2BC] bg-white cursor-pointer poster-card aspect-[3/4] shadow-sm hover:border-[#FD5C05]"
                      >
                        {/* Poster Gradient image */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.coverImage} opacity-30`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />

                        {/* Badges */}
                        <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between">
                          <div className="flex justify-between items-center">
                            <span className="rounded-full bg-white/90 border border-[#D8D2BC]/40 px-2 py-0.5 text-[9px] font-bold text-[#2A2621] shadow-sm">
                              {event.time}
                            </span>
                            <span className="text-[10px] font-bold text-white bg-[#FD5C05] px-2 py-0.5 rounded shadow-sm">
                              {event.free ? 'FREE' : 'PAID'}
                            </span>
                          </div>

                          <div className="space-y-1 bg-white/85 backdrop-blur-sm p-3 rounded-2xl border border-[#D8D2BC]/40">
                            <span className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide">
                              {event.organizationName || 'OFFICIAL'}
                            </span>
                            <h4 className="text-sm font-bold text-[#2A2621] leading-snug line-clamp-2">
                              {event.title}
                            </h4>
                            <p className="text-[10px] text-[#5A554E] flex items-center gap-1 pt-1.5 truncate">
                              <MapPin className="h-3 w-3 text-[#2A2621]" />
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Grid feed */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold tracking-widest text-[#5A554E] uppercase">
                  {selectedCategory === 'All' ? 'UPCOMING EXPERIENCES' : `${selectedCategory.toUpperCase()} EVENTS`}
                </h3>

                {exploreEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-slate-50 py-16 text-center shadow-sm">
                    <Calendar className="h-10 w-10 text-[#5A554E] mb-3" />
                    <p className="text-xs font-bold text-[#2A2621] uppercase">No events discovered</p>
                    <p className="mt-1 text-[11px] text-[#5A554E] max-w-xs leading-relaxed">
                      Try updating your search query or selecting a different category.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exploreEvents.map((event) => {
                      const isSaved = currentUser ? (event.savedBy?.includes(currentUser.name) || (currentUser.username ? event.savedBy?.includes(currentUser.username) : false)) : false;
                      return (
                        <div
                          key={event.id}
                          className="group rounded-[24px] overflow-hidden border border-[#D8D2BC] bg-white hover:border-[#FD5C05] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                          onClick={() => onOpenDetails(event)}
                        >
                          {/* Image Box */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-tr ${event.coverImage} opacity-30 group-hover:scale-105 transition-transform duration-500`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10" />
                            
                            {/* Save Toggle overlay */}
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onSaveToggle(event.id);
                              }}
                              className="absolute right-4 top-4 z-20 h-8 w-8 rounded-full bg-white/80 hover:bg-white border border-[#D8D2BC] flex items-center justify-center text-[#2A2621] transition-colors cursor-pointer shadow-sm"
                              title={isSaved ? "Unsave Event" : "Save Event"}
                            >
                              <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#FD5C05] text-[#FD5C05]' : 'text-[#5A554E]'}`} />
                            </button>

                            {/* Host Badge */}
                            <div className="absolute left-4 bottom-4 z-20 flex flex-col gap-0.5">
                              <span className="rounded-full bg-[#FD5C05] px-2.5 py-0.5 text-[9px] font-black text-white uppercase shadow-sm">
                                {event.free ? 'FREE' : 'TICKETED'}
                              </span>
                            </div>
                          </div>

                          {/* Card Details */}
                          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                  event.ownershipType === 'school'
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                                    : event.ownershipType === 'organization'
                                    ? 'bg-[#A2C2BE]/20 border-[#A2C2BE]/30 text-[#1D3532]'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                }`}>
                                  {event.ownershipType}
                                </span>
                                {event.organizationName && (
                                  <span className="text-[10px] text-[#5A554E] font-semibold truncate max-w-[140px]">
                                    {event.organizationName}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base font-bold text-[#2A2621] leading-snug group-hover:text-[#2A2621] transition-colors line-clamp-1 uppercase">
                                {event.title}
                              </h4>
                              <p className="text-xs text-[#5A554E] line-clamp-2 leading-relaxed">
                                {event.description}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1.5 text-[10px] font-bold text-[#5A554E] pt-3 border-t border-[#D8D2BC]/30 uppercase">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-[#2A2621]" />
                                {event.date} • {event.time}
                              </span>
                              <span className="flex items-center gap-1.5 truncate">
                                <MapPin className="h-3.5 w-3.5 text-[#2A2621]" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ==================== SUB-VIEWS ROUTING ==================== */
            renderSubView()
          )}
        </div>
      </div>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D8D2BC] px-6 py-2 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'explore' ? 'text-[#FD5C05] font-extrabold' : 'text-[#5A554E]'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[9px] font-bold">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'saved' ? 'text-[#FD5C05] font-extrabold' : 'text-[#5A554E]'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-[9px] font-bold">Saved</span>
        </button>

        {/* Emphasized Center Create button */}
        <button
          onClick={onOpenCreate}
          className="flex h-12 w-12 -mt-6 items-center justify-center rounded-full bg-[#FD5C05] text-white shadow-lg shadow-[#FD5C05]/30 active:scale-95 transition-transform cursor-pointer border-4 border-white"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('orgs')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'orgs' ? 'text-[#FD5C05] font-extrabold' : 'text-[#5A554E]'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[9px] font-bold">Groups</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'profile' ? 'text-[#FD5C05] font-extrabold' : 'text-[#5A554E]'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}

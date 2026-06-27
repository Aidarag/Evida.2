'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import StudentDashboard from '@/components/student/StudentDashboard';
import CreateEventWizard from '@/components/student/CreateEventWizard';
import OrgWorkspace from '@/components/student/OrgWorkspace';
import SavedEvents from '@/components/student/SavedEvents';
import StudentProfile from '@/components/student/StudentProfile';
import EventDetails from '@/components/student/EventDetails';
import SchoolDashboard from '@/components/admin/SchoolDashboard';

import { Event, User, Notification, Organization } from '@/lib/types';
import { Sparkles, RefreshCw, Compass, ArrowRight, UserCheck, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // Routing State: 'landing' | 'auth' | 'student' | 'school'
  const [routeState, setRouteState] = useState<'landing' | 'auth' | 'student' | 'school'>('landing');
  const [studentTab, setStudentTab] = useState<'explore' | 'saved' | 'profile' | 'orgs' | 'search'>('explore');

  // Database Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [simulatedUsers, setSimulatedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals / Dropdowns States
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoControlOpen, setDemoControlOpen] = useState(true);

  const [loading, setLoading] = useState(true);

  // Fetch all databases
  const fetchData = async () => {
    try {
      const [eventsRes, orgsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/organizations')
      ]);

      const [eventsData, orgsData] = await Promise.all([
        eventsRes.json(),
        orgsRes.json()
      ]);

      setEvents(eventsData || []);
      setOrganizations(orgsData || []);

      // Setup simulated profiles
      const usersList: User[] = [
        { username: 'michael_c', name: 'Michael Chen', role: 'student', organizations: ['org-isa', 'org-cab', 'org-athletics'], major: 'Computer Science', gradYear: '2028', school: 'School of Engineering', avatar: 'MC' },
        { username: 'sarah_j', name: 'Sarah Jenkins', role: 'student_leader', organizations: ['org-stem', 'org-isa', 'org-athletics'], major: 'Mechanical Engineering', gradYear: '2027', school: 'School of Engineering', avatar: 'SJ' },
        { username: 'alex_r', name: 'Alex Rivera', role: 'student_leader', organizations: ['org-sg', 'org-stem', 'org-bsu'], major: 'Political Science', gradYear: '2026', school: 'School of Public Affairs', avatar: 'AR' },
        { username: 'admin_dean', name: 'Dean Dean', role: 'admin', organizations: [], major: 'Higher Ed Admin', gradYear: 'N/A', school: 'Student Affairs', avatar: 'DD' }
      ];
      setSimulatedUsers(usersList);

      let activeUser = currentUser;
      if (!activeUser) {
        activeUser = usersList[0];
        setCurrentUser(usersList[0]);
      } else {
        // Refresh active user object
        const refreshed = usersList.find(u => u.username === activeUser?.username);
        if (refreshed) {
          activeUser = refreshed;
          setCurrentUser(refreshed);
        }
      }

      // Fetch user notifications
      if (activeUser) {
        const notifRes = await fetch(`/api/notifications?username=${activeUser.username}`);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData || []);
        }
      }

    } catch (error) {
      console.error('Failed to load university resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Re-fetch notifications whenever active user changes
  useEffect(() => {
    if (currentUser) {
      fetch(`/api/notifications?username=${currentUser.username}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setNotifications(data || []))
        .catch(console.error);
    }
  }, [currentUser]);

  // Keep details modal synchronized with updates
  useEffect(() => {
    if (selectedEvent) {
      const updated = events.find(e => e.id === selectedEvent.id);
      if (updated) setSelectedEvent(updated);
    }
  }, [events, selectedEvent]);

  // Sync route safety checks: if user is not admin, kick them out of school dashboard
  useEffect(() => {
    if (routeState === 'school' && currentUser && currentUser.role !== 'admin') {
      setRouteState('student');
    }
  }, [currentUser, routeState]);

  // Reset database handler
  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset university records to default seeds?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Saved bookmark toggling
  const handleSaveToggle = async (eventId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: currentUser.name })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // RSVP toggling
  const handleRSVPToggle = async (eventId: string, action: 'rsvp' | 'interested') => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUser.name, action })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Event handler
  const handleCreateEvent = async (eventPayload: any) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Event Moderation
  const handleReviewEvent = async (id: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      const res = await fetch(`/api/events/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback })
      });
      if (res.ok) {
        await fetchData();
        alert(`Event moderation complete: Status updated to ${status}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Org Verification toggle
  const handleToggleVerifyOrg = async (id: string) => {
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-verify', id })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Org Registration
  const handleCreateOrg = async (orgData: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orgData,
          member: currentUser.name
        })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Notifications clear
  const handleMarkNotificationRead = async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-read', username: currentUser.username, id })
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotification = async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', username: currentUser.username, id })
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Student specific sublists
  const savedEventsList = events.filter(e => e.savedBy?.includes(currentUser?.name || ''));
  const rsvpEventsList = events.filter(e => e.attendees.includes(currentUser?.name || ''));
  const createdEventsList = events.filter(e => e.organizer === currentUser?.name);

  // Renders correct subview inside Student Dashboard
  const renderStudentSubView = () => {
    switch (studentTab) {
      case 'saved':
        return (
          <SavedEvents
            savedEventsList={savedEventsList}
            rsvpEventsList={rsvpEventsList}
            createdEventsList={createdEventsList}
            onOpenDetails={(event) => {
              setSelectedEvent(event);
              setIsDetailsOpen(true);
            }}
            onSaveToggle={handleSaveToggle}
          />
        );
      case 'orgs':
        return (
          <OrgWorkspace
            currentUser={currentUser!}
            organizations={organizations}
            events={events}
            onOpenDetails={(event) => {
              setSelectedEvent(event);
              setIsDetailsOpen(true);
            }}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        );
      case 'profile':
        return (
          <StudentProfile
            currentUser={currentUser!}
            organizations={organizations}
            totalRsvps={rsvpEventsList.length}
            totalCreated={createdEventsList.length}
            totalSaved={savedEventsList.length}
          />
        );
      default:
        return null;
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050507] text-[#FF7A1A]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#FF7A1A] border-t-transparent"></div>
          <p className="text-xs font-black tracking-widest uppercase text-slate-500 mt-2">Connecting to Evida...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col justify-between">
      
      {/* Dynamic Main Routing Section */}
      <div className="flex-1">
        {routeState === 'landing' && (
          <LandingPage
            featuredEvents={events}
            onExplore={() => setRouteState('student')}
            onCreateEvent={() => {
              setRouteState('auth');
            }}
            onLogin={() => setRouteState('auth')}
          />
        )}

        {routeState === 'auth' && (
          <AuthPage
            onBack={() => setRouteState('landing')}
            onSuccess={(role) => {
              // Find matching simulated user by role
              const matched = simulatedUsers.find(u => u.role === role);
              if (matched) setCurrentUser(matched);
              
              if (role === 'admin') {
                setRouteState('school');
              } else {
                setRouteState('student');
                setStudentTab('explore');
              }
            }}
          />
        )}

        {routeState === 'student' && (
          <StudentDashboard
            events={events}
            currentUser={currentUser}
            savedEventsList={savedEventsList}
            rsvpEventsList={rsvpEventsList}
            createdEventsList={createdEventsList}
            organizations={organizations}
            notifications={notifications}
            activeTab={studentTab}
            setActiveTab={setStudentTab}
            onOpenDetails={(event) => {
              setSelectedEvent(event);
              setIsDetailsOpen(true);
            }}
            onOpenCreate={() => setIsCreateOpen(true)}
            onSaveToggle={handleSaveToggle}
            onRSVPToggle={handleRSVPToggle}
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
            onMarkNotificationRead={handleMarkNotificationRead}
            onClearNotification={handleClearNotification}
            renderSubView={renderStudentSubView}
          />
        )}

        {routeState === 'school' && (
          /* Wrap school dashboard in standard visual frame */
          <div className="min-h-screen bg-[#050507] flex flex-col justify-between">
            <header className="sticky top-0 z-30 h-16 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#FFD214]">
                  <Sparkles className="h-4.5 w-4.5 text-black" />
                </div>
                <span className="text-base font-black text-white">EVIDA ADMIN</span>
              </div>
              
              <button
                onClick={() => setRouteState('student')}
                className="rounded-full border border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase text-slate-200 cursor-pointer"
              >
                Go to Student Portal
              </button>
            </header>

            <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1">
              <SchoolDashboard
                events={events}
                organizations={organizations}
                onReviewEvent={handleReviewEvent}
                onToggleVerifyOrg={handleToggleVerifyOrg}
                onCreateOrg={handleCreateOrg}
              />
            </main>
            
            <footer className="border-t border-white/5 py-4 text-center text-[10px] text-slate-600 bg-slate-950/20">
              © 2026 Evida Admin. Secure university connection.
            </footer>
          </div>
        )}
      </div>

      {/* ==================== DEMO FLOATING DRAWER WIDGET ==================== */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setDemoControlOpen(!demoControlOpen)}
          className="h-10 w-10 rounded-full bg-[#FF7A1A] hover:bg-orange-600 text-black flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer"
          title="Demo Controls"
        >
          <Sparkles className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {demoControlOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-12 right-0 w-72 rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7A1A]">Prototype Panel</span>
                <button
                  onClick={() => setDemoControlOpen(false)}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Persona Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Change Active Persona</label>
                <select
                  value={currentUser.username}
                  onChange={(e) => {
                    const selected = simulatedUsers.find(u => u.username === e.target.value);
                    if (selected) {
                      setCurrentUser(selected);
                      // Reset views depending on role
                      if (selected.role === 'admin') {
                        setRouteState('school');
                      } else {
                        setRouteState('student');
                        setStudentTab('explore');
                      }
                    }
                  }}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-1.5 px-3 text-xs text-slate-300 focus:outline-none"
                >
                  {simulatedUsers.map(u => (
                    <option key={u.username} value={u.username}>
                      {u.name} ({u.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Router Shortcuts */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Jump Dashboard Route</label>
                <div className="grid grid-cols-2 gap-1.5 text-[9px] font-black uppercase">
                  <button
                    onClick={() => setRouteState('landing')}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      routeState === 'landing' ? 'bg-[#FF7A1A] text-black border-[#FF7A1A]' : 'bg-transparent text-slate-400 border-white/5'
                    }`}
                  >
                    Landing
                  </button>
                  <button
                    onClick={() => setRouteState('auth')}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      routeState === 'auth' ? 'bg-[#FF7A1A] text-black border-[#FF7A1A]' : 'bg-transparent text-slate-400 border-white/5'
                    }`}
                  >
                    Auth Portal
                  </button>
                  <button
                    onClick={() => {
                      setRouteState('student');
                      setStudentTab('explore');
                    }}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      routeState === 'student' && studentTab === 'explore' ? 'bg-[#FF7A1A] text-black border-[#FF7A1A]' : 'bg-transparent text-slate-400 border-white/5'
                    }`}
                  >
                    Student Hub
                  </button>
                  <button
                    onClick={() => {
                      if (currentUser.role === 'admin') {
                        setRouteState('school');
                      } else {
                        // simulate admin for route click
                        const adminUser = simulatedUsers.find(u => u.role === 'admin');
                        if (adminUser) setCurrentUser(adminUser);
                        setRouteState('school');
                      }
                    }}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      routeState === 'school' ? 'bg-[#FF7A1A] text-black border-[#FF7A1A]' : 'bg-transparent text-slate-400 border-white/5'
                    }`}
                  >
                    School Admin
                  </button>
                </div>
              </div>

              {/* Reset Data */}
              <div className="flex gap-2 justify-between pt-2 border-t border-white/5">
                <button
                  onClick={handleResetDatabase}
                  className="flex-1 flex items-center justify-center gap-1 bg-slate-900 border border-white/5 hover:border-[#FF7A1A]/30 text-slate-300 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Reset Database
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal Overlay */}
      <EventDetails
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedEvent(null);
        }}
        currentUser={currentUser}
        onRSVP={handleRSVPToggle}
        onSaveToggle={handleSaveToggle}
      />

      {/* Create Event Wizard Modal */}
      <CreateEventWizard
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentUser={currentUser}
        organizations={organizations}
        onSubmit={handleCreateEvent}
      />

    </div>
  );
}

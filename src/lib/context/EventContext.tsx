'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Event, Organization, Notification } from '@/lib/types';
import { useUser } from './UserContext';
import { usePathname, useRouter } from 'next/navigation';

interface EventContextType {
  events: Event[];
  organizations: Organization[];
  notifications: Notification[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  // Mutations
  saveToggle: (eventId: string) => Promise<void>;
  rsvpToggle: (eventId: string, action: 'rsvp' | 'interested') => Promise<void>;
  createEvent: (payload: any) => Promise<boolean>;
  reviewEvent: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  toggleVerifyOrg: (id: string) => Promise<void>;
  createOrg: (orgData: any) => Promise<any>;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  resetDatabase: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUser } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle route change notifications inside the preview iframe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'true') {
        document.body.classList.add('preview-mode');
        window.parent.postMessage({ type: 'EVIDA_PREVIEW_ROUTE', pathname }, '*');
      }
    }
  }, [pathname]);

  // Handle scroll and route messages inside the preview iframe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') !== 'true') return;

      const handleMessage = (event: MessageEvent) => {
        const { type, progress } = event.data;
        if (type !== 'EVIDA_PREVIEW_SCROLL_TO') return;

        // 1. Auto-Navigate between feeds and details based on progress boundaries
        if (progress > 0.48 && pathname === '/student/dashboard') {
          const approved = events.filter(e => e.status === 'approved');
          const firstEvent = approved[0];
          if (firstEvent) {
            router.push(`/events/${firstEvent.id}?preview=true`);
          }
        } else if (progress < 0.42 && pathname.startsWith('/events/')) {
          router.push('/student/dashboard?preview=true');
        }

        // 2. Programmatically scroll to mapped position
        let localProgress = 0;
        if (pathname === '/student/dashboard') {
          // Home feed scrolling phase (0.0 to 0.45 mapped to 0.0 to 1.0)
          localProgress = Math.min(1, Math.max(0, progress / 0.45));
        } else if (pathname.startsWith('/events/')) {
          // Details page scrolling phase (0.55 to 0.90 mapped to 0.0 to 1.0)
          localProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.35));
        }

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = localProgress * (scrollHeight - clientHeight);

        window.scrollTo({
          top: scrollTop,
          behavior: 'auto'
        });

        // Report scroll progress to update tour steps
        window.parent.postMessage({
          type: 'EVIDA_PREVIEW_SCROLL',
          scrollTop,
          scrollHeight,
          clientHeight,
          isAtBottom: localProgress >= 0.99,
          progress: localProgress * 100
        }, '*');
      };

      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [pathname, events, router]);
  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, orgsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/organizations'),
      ]);
      const [eventsData, orgsData] = await Promise.all([eventsRes.json(), orgsRes.json()]);
      setEvents(eventsData || []);
      setOrganizations(orgsData || []);

      if (currentUser) {
        const notifRes = await fetch(`/api/notifications?username=${currentUser.username}`);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData || []);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveToggle = useCallback(async (eventId: string) => {
    if (!currentUser) return;

    // 1. Optimistic Update
    setEvents(prevEvents =>
      prevEvents.map(evt => {
        if (evt.id === eventId) {
          const savedBy = evt.savedBy || [];
          const idx = savedBy.indexOf(currentUser.name);
          const newSavedBy = idx > -1
            ? savedBy.filter(name => name !== currentUser.name)
            : [...savedBy, currentUser.name];
          return { ...evt, savedBy: newSavedBy };
        }
        return evt;
      })
    );

    try {
      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: currentUser.name }),
      });
      if (res.ok) {
        const data = await res.json();
        // Sync with official backend response event state
        setEvents(prevEvents =>
          prevEvents.map(evt => (evt.id === eventId ? data.event : evt))
        );
      } else {
        // Rollback
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      // Rollback
      await fetchData();
    }
  }, [currentUser, fetchData]);

  const rsvpToggle = useCallback(async (eventId: string, action: 'rsvp' | 'interested') => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUser.name, action }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, fetchData]);

  const createEvent = useCallback(async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [fetchData]);

  const reviewEvent = useCallback(async (id: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      const res = await fetch(`/api/events/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [fetchData]);

  const toggleVerifyOrg = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-verify', id }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [fetchData]);

  const createOrg = useCallback(async (orgData: any) => {
    if (!currentUser) return null;
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orgData, member: currentUser.name }),
      });
      if (res.ok) {
        const newOrg = await res.json();
        
        // Update currentUser's local organizations list in context
        const updatedUser = {
          ...currentUser,
          organizations: [...(currentUser.organizations || []), newOrg.id]
        };
        setCurrentUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('evida-user', JSON.stringify(updatedUser));
        }

        await fetchData();
        return newOrg;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [currentUser, setCurrentUser, fetchData]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-read', username: currentUser.username, id }),
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const clearNotification = useCallback(async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', username: currentUser.username, id }),
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const resetDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  return (
    <EventContext.Provider
      value={{
        events,
        organizations,
        notifications,
        isLoading,
        refetch: fetchData,
        saveToggle,
        rsvpToggle,
        createEvent,
        reviewEvent,
        toggleVerifyOrg,
        createOrg,
        markNotificationRead,
        clearNotification,
        resetDatabase,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within EventProvider');
  return context;
}

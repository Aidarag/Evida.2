'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Event, Organization, Notification } from '@/lib/types';
import { useUser } from './UserContext';

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
    try {
      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: currentUser.name }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
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

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  simulatedUsers: User[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    username: 'michael_c',
    name: 'Michael Chen',
    email: 'michael.chen@university.edu',
    role: 'student',
    organizations: ['org-isa', 'org-cab', 'org-athletics'],
    major: 'Computer Science',
    gradYear: '2028',
    graduationYear: '2028',
    school: 'School of Engineering',
    avatar: 'MC',
  },
  {
    username: 'sarah_j',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'student_leader',
    organizations: ['org-stem', 'org-isa', 'org-athletics'],
    major: 'Mechanical Engineering',
    gradYear: '2027',
    graduationYear: '2027',
    school: 'School of Engineering',
    avatar: 'SJ',
  },
  {
    username: 'alex_r',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'student_leader',
    organizations: ['org-sg', 'org-stem', 'org-bsu'],
    major: 'Political Science',
    gradYear: '2026',
    graduationYear: '2026',
    school: 'School of Public Affairs',
    avatar: 'AR',
  },
  {
    username: 'admin_dean',
    name: 'Dean Williams',
    email: 'dean.williams@university.edu',
    role: 'admin',
    organizations: [],
    major: 'Higher Ed Admin',
    gradYear: 'N/A',
    graduationYear: 'N/A',
    school: 'Student Affairs',
    avatar: 'DW',
  },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted user
    const stored = typeof window !== 'undefined' ? localStorage.getItem('evida-user') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username) {
          const matched = DEFAULT_USERS.find((u) => u.username === parsed.username);
          setCurrentUser(matched || parsed);
        }
      } catch {
        setCurrentUser(DEFAULT_USERS[0]);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = useCallback((user: User) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('evida-user', JSON.stringify(user));
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evida-user');
      sessionStorage.setItem('evida_force_redirect_splash', 'true');
      window.location.href = '/login';
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetUser,
        logout: handleLogout,
        simulatedUsers: DEFAULT_USERS,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

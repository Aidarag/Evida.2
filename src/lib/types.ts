// ─────────────────────────────────────────────────
// Evida Data Models
// ─────────────────────────────────────────────────

export interface User {
  username: string;
  name: string;
  email?: string;
  role: 'admin' | 'student_leader' | 'student';
  organizations: string[]; // Organization IDs
  major?: string;
  gradYear?: string;
  graduationYear?: string;
  school?: string;
  avatar?: string;
  password?: string;        // stored server-side only
  phone?: string;
  consentGiven?: boolean;
  consentDate?: string;     // ISO timestamp
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  members: string[]; // student names
  logoColor: string;
  schoolId?: string;
  views?: number;
  saves?: number;
  rsvps?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  ownershipType: 'student' | 'organization' | 'school';
  complexityType: 'quick' | 'standard' | 'complex';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationType: 'indoor' | 'outdoor' | 'offcampus';
  attendees: string[];
  interested: string[];
  savedBy: string[];
  organizer: string;
  organizationId?: string;
  organizationName?: string;
  feedback?: string;
  featured: boolean;
  isFeatured?: boolean;
  views: number;
  fundingRequested?: boolean;
  transportationNeeded?: boolean;
  estimatedAttendance: number;
  coverImage: string;
  flyerImage?: string;
  free: boolean;
  capacity?: number;
  visibility: 'public' | 'private';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'rsvp' | 'update' | 'cancel' | 'approve' | 'reject' | 'reminder';
  timestamp: string;
  read: boolean;
  username: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  category: 'tutoring' | 'photography' | 'food' | 'initiative' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  organizer: string;
  contactInfo: string;
  feedback?: string;
  image?: string;
  createdAt?: string;
}

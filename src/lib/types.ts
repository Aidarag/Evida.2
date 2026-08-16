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
  classification?: string;
  school?: string;
  avatar?: string;
  banner?: string;
  password?: string;        // stored server-side only
  phone?: string;
  consentGiven?: boolean;
  consentDate?: string;     // ISO timestamp
  bio?: string;
  interests?: string[];
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  achievements?: string[];
  privacy?: {
    going?: 'public' | 'private';
    saved?: 'public' | 'private';
    hosted?: 'public' | 'private';
    organizations?: 'public' | 'private';
  };
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  aboutUs?: string;
  category?: string;
  verified: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  rosterType?: 'members' | 'team';
  members: string[]; // student names
  teamRoster?: { name: string; role: string; avatar?: string }[];
  logoColor: string;
  schoolId?: string;
  views?: number;
  saves?: number;
  rsvps?: number;
  memberRoles?: Record<string, string>; // username -> role
  announcements?: { id: string; title: string; content: string; date: string; author: string }[];
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
  price?: number;
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
  category: 'academic' | 'jobs' | 'creative' | 'food' | 'beauty' | 'marketplace' | 'housing' | 'sports' | 'projects' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  organizer: string;
  contactInfo: string;
  preferredContactMethod?: 'instagram' | 'email' | 'phone' | 'link';
  contactValue?: string;
  socialLink?: string;
  feedback?: string;
  image?: string;
  flyerImage?: string;
  isFree?: boolean;
  price?: string;
  createdAt?: string;
  savedBy?: string[];
}

export interface MembershipRequest {
  id: string;
  orgId: string;
  orgName: string;
  username: string;
  studentName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

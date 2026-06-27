export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  ownershipType: 'student' | 'organization' | 'school';
  complexityType: 'quick' | 'standard' | 'complex';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  time: string; // Start time
  endTime?: string;
  location: string;
  locationType: 'indoor' | 'outdoor' | 'offcampus';
  attendees: string[]; // List of student names
  interested: string[]; // List of student names
  savedBy: string[]; // List of student names who saved it
  organizer: string; // Creator name
  organizationId?: string;
  organizationName?: string;
  feedback?: string; // Reason for approval/rejection
  featured: boolean;
  views: number;
  fundingRequested?: boolean;
  transportationNeeded?: boolean;
  estimatedAttendance: number;
  coverImage: string; // Tailwind gradient descriptor or URL
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
  username: string; // Recipient username
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
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  members: string[]; // student names
  logoColor: string; // Tailwind color name like indigo, emerald, rose, amber, violet, sky
  views?: number;
  saves?: number;
  rsvps?: number;
}

export interface User {
  username: string;
  name: string;
  role: 'admin' | 'student_leader' | 'student';
  organizations: string[]; // Organization IDs
  major?: string;
  gradYear?: string;
  school?: string;
  avatar?: string;
}

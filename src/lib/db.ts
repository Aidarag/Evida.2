import fs from 'fs';
import path from 'path';
import { Event, Promotion, Organization, User, Notification } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DBStructure {
  events: Event[];
  promotions: Promotion[];
  organizations: Organization[];
  users: User[];
  notifications: Notification[];
}

const initialOrganizations: Organization[] = [
  {
    id: 'org-sg',
    name: 'Student Government Association',
    description: 'Advocating for student voices, allocating funding for student events, and governing campus regulations.',
    verified: true,
    members: ['Alex Rivera', 'David Kim'],
    logoColor: 'indigo',
    views: 145,
    saves: 32,
    rsvps: 98
  },
  {
    id: 'org-isa',
    name: 'International Student Association',
    description: 'Fostering a global community and organizing cultural exchange events on campus.',
    verified: true,
    members: ['Michael Chen', 'Sarah Jenkins'],
    logoColor: 'sky',
    views: 89,
    saves: 12,
    rsvps: 45
  },
  {
    id: 'org-stem',
    name: 'STEM Club',
    description: 'A coalition of science, math, and engineering students hosting build workshops and guest tech lectures.',
    verified: true,
    members: ['Sarah Jenkins', 'Alex Rivera'],
    logoColor: 'emerald',
    views: 242,
    saves: 78,
    rsvps: 180
  },
  {
    id: 'org-cab',
    name: 'Campus Activities Board',
    description: 'Planning homecoming, concerts, campus traditions, and Friday night events.',
    verified: true,
    members: ['Michael Chen', 'David Kim'],
    logoColor: 'violet',
    views: 452,
    saves: 110,
    rsvps: 340
  },
  {
    id: 'org-athletics',
    name: 'Blue Bears Athletics',
    description: 'Supporting varsity sports, competitive athletics, and student fitness.',
    verified: true,
    members: ['Michael Chen'],
    logoColor: 'amber',
    views: 310,
    saves: 56,
    rsvps: 220
  },
  {
    id: 'org-bsu',
    name: 'Black Student Union',
    description: 'Empowering Black students, promoting academic excellence, and hosting cultural showcases.',
    verified: true,
    members: ['Alex Rivera'],
    logoColor: 'rose',
    views: 189,
    saves: 43,
    rsvps: 112
  },
  {
    id: 'org-cdc',
    name: 'Career Development Center',
    description: 'Providing resume workshops, career counseling, and hosting employer recruitment events.',
    verified: true,
    members: ['Sarah Jenkins'],
    logoColor: 'cream',
    views: 120,
    saves: 18,
    rsvps: 60
  }
];

const initialUsers: User[] = [
  {
    username: 'michael_c',
    name: 'Michael Chen',
    role: 'student',
    organizations: ['org-isa', 'org-cab', 'org-athletics'],
    major: 'Computer Science',
    gradYear: '2028',
    school: 'School of Engineering',
    avatar: 'MC'
  },
  {
    username: 'sarah_j',
    name: 'Sarah Jenkins',
    role: 'student_leader',
    organizations: ['org-stem', 'org-isa', 'org-athletics'],
    major: 'Mechanical Engineering',
    gradYear: '2027',
    school: 'School of Engineering',
    avatar: 'SJ'
  },
  {
    username: 'alex_r',
    name: 'Alex Rivera',
    role: 'student_leader',
    organizations: ['org-sg', 'org-stem', 'org-bsu'],
    major: 'Political Science',
    gradYear: '2026',
    school: 'School of Public Affairs',
    avatar: 'AR'
  },
  {
    username: 'admin_dean',
    name: 'Dean Dean',
    role: 'admin',
    organizations: [],
    major: 'Higher Ed Administration',
    gradYear: 'N/A',
    school: 'Student Affairs Division',
    avatar: 'DD'
  }
];

const initialEvents: Event[] = [
  {
    id: 'evt-hc-kickoff',
    title: 'Homecoming Kickoff Rally',
    description: 'Ignite school spirit and launch the homecoming season with full-force energy! Highlighting live student DJs, food trucks, pep rally drums, and official giveaways. Dress in our school colors!',
    category: 'Social',
    ownershipType: 'school',
    complexityType: 'complex',
    status: 'approved',
    date: '2026-10-09',
    time: '18:00',
    endTime: '21:00',
    location: 'Main University Plaza',
    locationType: 'outdoor',
    attendees: ['Michael Chen', 'Sarah Jenkins', 'Alex Rivera'],
    interested: [],
    savedBy: ['Michael Chen', 'Alex Rivera'],
    organizer: 'Campus Activities Board',
    organizationId: 'org-cab',
    organizationName: 'Campus Activities Board',
    featured: true,
    views: 890,
    estimatedAttendance: 600,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-orange-500 via-red-500 to-violet-600',
    free: true,
    capacity: 1000,
    visibility: 'public'
  },
  {
    id: 'evt-career-night',
    title: 'Career Fair Networking Night',
    description: 'Establish crucial connections for summer internships and entry-level positions. Interact with recruiters from top engineering, consulting, and creative agencies. Resume printouts required.',
    category: 'Career',
    ownershipType: 'school',
    complexityType: 'complex',
    status: 'approved',
    date: '2026-07-15',
    time: '17:00',
    endTime: '20:30',
    location: 'Grand Student Ballroom',
    locationType: 'indoor',
    attendees: ['Sarah Jenkins', 'Alex Rivera'],
    interested: ['Michael Chen'],
    savedBy: ['Sarah Jenkins'],
    organizer: 'Career Development Center',
    organizationId: 'org-cdc',
    organizationName: 'Career Development Center',
    featured: true,
    views: 450,
    estimatedAttendance: 350,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-blue-600 to-indigo-900',
    free: true,
    capacity: 400,
    visibility: 'public'
  },
  {
    id: 'evt-intl-mixer',
    title: 'International Student Mixer',
    description: 'Welcome and integrate international students into campus life. Enjoy speed-networking icebreakers, sample foods from different continents, and find your local support networks.',
    category: 'Social',
    ownershipType: 'organization',
    complexityType: 'standard',
    status: 'approved',
    date: '2026-07-08',
    time: '16:00',
    endTime: '18:00',
    location: 'Student Union Terrace',
    locationType: 'outdoor',
    attendees: ['Michael Chen', 'Sarah Jenkins'],
    interested: ['Alex Rivera'],
    savedBy: ['Michael Chen'],
    organizer: 'Michael Chen',
    organizationId: 'org-isa',
    organizationName: 'International Student Association',
    featured: false,
    views: 210,
    estimatedAttendance: 100,
    fundingRequested: true,
    transportationNeeded: false,
    coverImage: 'from-teal-400 to-emerald-600',
    free: true,
    capacity: 120,
    visibility: 'public'
  },
  {
    id: 'evt-basketball',
    title: 'Blue Bears Season Opener',
    description: 'Witness the Blue Bears battle their arch-rivals in the first match of the college basketball tournament. Free foam fingers for the first 100 students!',
    category: 'Sports',
    ownershipType: 'school',
    complexityType: 'standard',
    status: 'approved',
    date: '2026-07-12',
    time: '19:30',
    endTime: '22:00',
    location: 'Alumni Arena',
    locationType: 'indoor',
    attendees: ['Michael Chen'],
    interested: ['Sarah Jenkins', 'Alex Rivera'],
    savedBy: ['Michael Chen', 'Sarah Jenkins'],
    organizer: 'Blue Bears Athletics',
    organizationId: 'org-athletics',
    organizationName: 'Blue Bears Athletics',
    featured: false,
    views: 520,
    estimatedAttendance: 800,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-blue-500 to-cyan-500',
    free: true,
    capacity: 1200,
    visibility: 'public'
  },
  {
    id: 'evt-greek-show',
    title: 'Greek Yard Show',
    description: 'The step performance tradition returns! Watch campus fraternities and sororities showcase complex stepping, high-energy dancing, and chapter chants.',
    category: 'Culture',
    ownershipType: 'organization',
    complexityType: 'complex',
    status: 'approved',
    date: '2026-08-04',
    time: '18:00',
    endTime: '21:00',
    location: 'Amphitheater',
    locationType: 'outdoor',
    attendees: ['Alex Rivera', 'Michael Chen'],
    interested: ['Sarah Jenkins'],
    savedBy: ['Alex Rivera'],
    organizer: 'Alex Rivera',
    organizationId: 'org-sg',
    organizationName: 'Student Government Association',
    featured: false,
    views: 380,
    estimatedAttendance: 250,
    fundingRequested: true,
    transportationNeeded: false,
    coverImage: 'from-rose-500 via-pink-500 to-orange-500',
    free: true,
    capacity: 400,
    visibility: 'public'
  },
  {
    id: 'evt-stem-expo',
    title: 'STEM Innovation Expo',
    description: 'Explore research projects, hardware builds, and custom coding prototypes developed by students. Network with judges from tech companies and see live 3D printing.',
    category: 'Academic',
    ownershipType: 'organization',
    complexityType: 'standard',
    status: 'approved',
    date: '2026-07-22',
    time: '13:00',
    endTime: '17:00',
    location: 'Engineering Science Center',
    locationType: 'indoor',
    attendees: ['Sarah Jenkins', 'Alex Rivera'],
    interested: ['Michael Chen'],
    savedBy: ['Sarah Jenkins'],
    organizer: 'Sarah Jenkins',
    organizationId: 'org-stem',
    organizationName: 'STEM Club',
    featured: false,
    views: 180,
    estimatedAttendance: 80,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-emerald-400 to-cyan-600',
    free: true,
    capacity: 150,
    visibility: 'public'
  },
  {
    id: 'evt-sg-townhall',
    title: 'Student Government Town Hall',
    description: 'Speak directly with your student body representatives. Voice opinions on housing services, cafeteria hours, and allocations of student organization budgets.',
    category: 'Academic',
    ownershipType: 'organization',
    complexityType: 'quick',
    status: 'approved',
    date: '2026-07-06',
    time: '15:00',
    endTime: '16:00',
    location: 'Multipurpose Room B',
    locationType: 'indoor',
    attendees: ['Alex Rivera'],
    interested: ['Michael Chen', 'Sarah Jenkins'],
    savedBy: [],
    organizer: 'Alex Rivera',
    organizationId: 'org-sg',
    organizationName: 'Student Government Association',
    featured: false,
    views: 95,
    estimatedAttendance: 30,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-slate-700 to-slate-900',
    free: true,
    capacity: 50,
    visibility: 'public'
  },
  {
    id: 'evt-wellness-ws',
    title: 'Wellness & Mental Health Workshop',
    description: 'Decompress from classes with mindfulness exercises, meditation guides, and complimentary yoga. Take home wellness kits and healthy snacks.',
    category: 'Social',
    ownershipType: 'school',
    complexityType: 'quick',
    status: 'approved',
    date: '2026-07-09',
    time: '14:00',
    endTime: '15:30',
    location: 'Campus Gardens',
    locationType: 'outdoor',
    attendees: ['Sarah Jenkins', 'Michael Chen'],
    interested: [],
    savedBy: ['Sarah Jenkins'],
    organizer: 'Student Affairs',
    featured: false,
    views: 110,
    estimatedAttendance: 25,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-teal-400 to-indigo-600',
    free: true,
    capacity: 30,
    visibility: 'public'
  },
  {
    id: 'evt-cultural-night',
    title: 'BSA Cultural Gala Night',
    description: 'Celebrate legacy and heritage with music, performance poetry, history displays, and fashion. A signature annual celebration for student groups.',
    category: 'Culture',
    ownershipType: 'organization',
    complexityType: 'standard',
    status: 'pending',
    date: '2026-07-18',
    time: '19:00',
    endTime: '22:00',
    location: 'Student Union Ballroom',
    locationType: 'indoor',
    attendees: [],
    interested: ['Alex Rivera', 'Michael Chen'],
    savedBy: [],
    organizer: 'Alex Rivera',
    organizationId: 'org-bsu',
    organizationName: 'Black Student Union',
    featured: false,
    views: 45,
    estimatedAttendance: 120,
    fundingRequested: true,
    transportationNeeded: false,
    coverImage: 'from-red-600 via-rose-500 to-yellow-600',
    free: true,
    capacity: 200,
    visibility: 'public'
  },
  {
    id: 'evt-kickback',
    title: 'Friday Night Kickback',
    description: 'Wind down after midterms with board games, free pizza, game consoles, and casual conversations in a low-stakes environment.',
    category: 'Social',
    ownershipType: 'organization',
    complexityType: 'quick',
    status: 'pending',
    date: '2026-07-10',
    time: '20:00',
    endTime: '23:00',
    location: 'CAB Lounge',
    locationType: 'indoor',
    attendees: [],
    interested: ['Michael Chen'],
    savedBy: [],
    organizer: 'Michael Chen',
    organizationId: 'org-cab',
    organizationName: 'Campus Activities Board',
    featured: false,
    views: 32,
    estimatedAttendance: 15,
    fundingRequested: false,
    transportationNeeded: false,
    coverImage: 'from-indigo-600 to-violet-800',
    free: true,
    capacity: 25,
    visibility: 'public'
  }
];

const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'CS 101 & Calculus Tutor',
    description: 'Providing comprehensive 1-on-1 tutoring sessions to nail coding labs and derivative theorems. $15/hr, student discount package available.',
    category: 'tutoring',
    status: 'approved',
    date: '2026-06-25',
    organizer: 'Sarah Jenkins',
    contactInfo: 's.jenkins@university.edu'
  },
  {
    id: 'promo-2',
    title: 'Graduation & Event Photographer',
    description: 'Capture beautiful graduation frames and club social highlights. Professional lighting and 4K digital prints delivered in 3 days.',
    category: 'photography',
    status: 'approved',
    date: '2026-06-26',
    organizer: 'David Kim',
    contactInfo: 'david.k@university.edu'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'RSVP Confirmed',
    message: 'Your spot at the Homecoming Kickoff Rally is locked in! Doors open at 17:30.',
    type: 'rsvp',
    timestamp: '2 hours ago',
    read: false,
    username: 'michael_c'
  },
  {
    id: 'notif-2',
    title: 'Event Approved',
    message: 'Your event "STEM Innovation Expo" has been approved by Dean Dean and is now published.',
    type: 'approve',
    timestamp: '1 day ago',
    read: true,
    username: 'sarah_j'
  }
];

// Ensure DB initialization
function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const defaultData: DBStructure = {
      events: initialEvents,
      promotions: initialPromotions,
      organizations: initialOrganizations,
      users: initialUsers,
      notifications: initialNotifications
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export function readDB(): DBStructure {
  ensureDB();
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data) as DBStructure;
}

export function writeDB(data: DBStructure) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function resetDB() {
  const defaultData: DBStructure = {
    events: initialEvents,
    promotions: initialPromotions,
    organizations: initialOrganizations,
    users: initialUsers,
    notifications: initialNotifications
  };
  writeDB(defaultData);
  return defaultData;
}

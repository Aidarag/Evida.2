import { Opportunity, CampusBuzzPost } from './types';

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Campus Admissions Tour Ambassador & Student Host',
    department: 'Office of Admissions',
    organizationName: 'Livingstone Admissions',
    type: 'Campus Job',
    compensation: '$16.50/hr',
    deadline: 'Nov 15, 2026',
    location: 'Welcome Center, Salisbury NC',
    description: 'Lead visiting prospective families and high school groups on campus walking tours, assist at Open House showcases, and share your genuine Livingstone student experience.',
    requirements: [
      'Full-time student in good academic standing (2.8+ GPA)',
      'Outgoing personality with strong verbal communication',
      'Available 10-15 hrs/wk including select Saturday campus tours'
    ],
    image: '/campus_life_hero.png',
    contactEmail: 'admissions@livingstone.edu',
    postedAt: '2d ago',
    featured: true
  },
  {
    id: 'opp-2',
    title: 'Undergraduate STEM & AI Applied Research Fellowship',
    department: 'Department of Computer & Natural Sciences',
    type: 'Research',
    compensation: '$4,500 Stipend',
    deadline: 'Nov 20, 2026',
    location: 'Science & Innovation Complex, Lab 304',
    description: '12-week funded laboratory fellowship working directly with faculty on predictive campus analytics, applied machine learning, and clean energy prototypes.',
    requirements: [
      'Sophomore, Junior, or Senior standing in STEM or related field',
      'Prior coursework in Python, Data Structures, or Biology/Chemistry',
      'One faculty letter of recommendation'
    ],
    image: '/pexels-edward-jenner-4031319.jpg',
    contactEmail: 'stem-research@evida.edu',
    postedAt: '1d ago',
    featured: true
  },
  {
    id: 'opp-3',
    title: 'Student Government Association Senator (At-Large)',
    department: 'Student Government Association (SGA)',
    organizationName: 'Student Government Association',
    type: 'Leadership',
    compensation: '$1,200 Semester Leadership Grant',
    deadline: 'Nov 8, 2026',
    location: 'Student Union Senate Chambers',
    description: 'Represent student voices on university budget allocation, dining facility improvements, and campus safety policy committees. Attend weekly legislative senate hearings.',
    requirements: [
      'Active enrolled undergraduate',
      'Attend mandatory Tuesday 6pm legislative sessions',
      'Pass SGA basic constitution quiz'
    ],
    image: '/pexels-yaroslav-shuraev-8513385.jpg',
    contactEmail: 'sga-elections@livingstone.edu',
    postedAt: '3d ago'
  },
  {
    id: 'opp-4',
    title: 'Resident Assistant (RA) Selection 2026-2027',
    department: 'Office of Residence Life & Housing',
    type: 'Campus Job',
    compensation: 'Free Single Room + Full Meal Plan + $1,000 Stipend',
    deadline: 'Dec 1, 2026',
    location: 'Campus Residence Halls',
    description: 'Build inclusive hall community, facilitate monthly dorm floor events, mediate roommate conflicts, and maintain evening on-call duty rotations.',
    requirements: [
      'Minimum 2.75 cumulative GPA',
      'Must have completed at least two semesters of campus residency',
      'Strong conflict resolution and active listening skills'
    ],
    image: '/pexels-cottonbro-5989925.jpg',
    contactEmail: 'reslife@livingstone.edu',
    postedAt: '4d ago'
  },
  {
    id: 'opp-5',
    title: 'Peer Writing & Math Lab Specialist Tutor',
    department: 'Center for Academic Success',
    type: 'Campus Job',
    compensation: '$17.00/hr',
    deadline: 'Nov 12, 2026',
    location: 'Academic Center, 2nd Floor',
    description: 'Provide walk-in and appointment-based coaching on college composition, research citations, college algebra, and pre-calculus.',
    requirements: [
      'Grade of A- or better in ENG 101/102 or MAT 131',
      'Recommendation from departmental professor'
    ],
    image: '/pexels-tima-miroshnichenko-5439368.jpg',
    contactEmail: 'tutoring@evida.edu',
    postedAt: '5d ago'
  },
  {
    id: 'opp-6',
    title: 'Evida Campus Creator & Media Content Lead',
    department: 'Evida Student Advisory Board',
    type: 'Internship',
    compensation: '$800/mo + Media Equipment Kit',
    deadline: 'Nov 18, 2026',
    location: 'Campus Wide (Hybrid / Field)',
    description: 'Shoot high-energy vertical video recaps, interview students at tailgates and yard shows, and manage Evida campus social channels.',
    requirements: [
      'Proficient with CapCut, Premiere, or TikTok/Reels creation',
      'Active presence on campus and passionate about campus life'
    ],
    image: '/pexels-nick-rush-2508183-11211233.jpg',
    contactEmail: 'creators@evida.app',
    postedAt: 'Just now'
  }
];

export const initialCampusBuzz: CampusBuzzPost[] = [
  {
    id: 'buzz-1',
    authorName: 'Maya Lin',
    authorHandle: '@maya_clawz',
    authorInitial: 'ML',
    campus: 'Livingstone • 2h',
    tag: 'DM Me',
    content: 'WHO DOES WIG INSTALLS 🥺 plz dm me, need a clean frontal melt before Friday night!',
    likes: 48,
    replies: 19,
    contactMethod: 'instagram',
    contactValue: '@maya_clawz',
    timestamp: '2h ago'
  },
  {
    id: 'buzz-2',
    authorName: 'Marcus Vance',
    authorHandle: '@vance_cuts',
    authorInitial: 'MV',
    campus: 'Livingstone • 4h',
    tag: 'DM Me',
    content: 'Dorm fade slots open tonight from 8pm - 11pm in Honors Hall. Clean razor lineups & tapers. DM to lock in!',
    image: '/pexels-gu-ko-2150570603-31827067.jpg',
    likes: 92,
    replies: 34,
    contactMethod: 'instagram',
    contactValue: '@vance_cuts',
    timestamp: '4h ago'
  },
  {
    id: 'buzz-3',
    authorName: 'Tunde Adebayo',
    authorHandle: '@tunde_jollof',
    authorInitial: 'TA',
    campus: 'Livingstone • 6h',
    tag: 'Shoutout',
    content: 'The spicy suya chicken & plantain bowls at the Student Center today were 10/10 🔥 Catch us every weekend!',
    image: '/pexels-marwen-larafa-2159807713-37714941.jpg',
    likes: 125,
    replies: 28,
    contactMethod: 'snapchat',
    contactValue: 'tunde_jollof',
    timestamp: '6h ago'
  },
  {
    id: 'buzz-4',
    authorName: 'Chloe & Sam',
    authorHandle: '@dormdrops',
    authorInitial: 'CS',
    campus: 'Salisbury • 7h',
    tag: 'DM Me',
    content: 'Warm fudge brownies & chocolate chip cookie drops starting at 9pm sharp! Drop your dorm hall below or DM 🍪',
    image: '/pexels-markus-winkler-1430818-12199407.jpg',
    likes: 76,
    replies: 22,
    contactMethod: 'phone',
    contactValue: '(555) 892-4411',
    timestamp: '7h ago'
  },
  {
    id: 'buzz-5',
    authorName: 'Sarah Jenkins',
    authorHandle: '@sarah_j',
    authorInitial: 'SJ',
    campus: 'Livingstone • 1d',
    tag: 'Question',
    content: 'Does anyone know if the library 3rd floor quiet study cubicles are open 24/7 this midterm week?',
    likes: 31,
    replies: 14,
    timestamp: '1d ago'
  },
  {
    id: 'buzz-6',
    authorName: 'Leo Ramirez',
    authorHandle: '@leo_bikes',
    authorInitial: 'LR',
    campus: 'Salisbury • 1d',
    tag: 'Lost & Found',
    content: 'Found a blue lanyard with dorm keys and a Student ID near the Campus Green benches. Handed to Student Center front desk!',
    likes: 64,
    replies: 8,
    timestamp: '1d ago'
  },
  {
    id: 'buzz-7',
    authorName: 'DJ K-Flow',
    authorHandle: '@dj_kflow',
    authorInitial: 'KF',
    campus: 'Livingstone • 2d',
    tag: 'Campus Life',
    content: 'Tonight @ 10: Tailgate warmup synth set on the south quad! Bring your crew and BYOB 🎶',
    image: '/pexels-maorattias-5191958.jpg',
    likes: 180,
    replies: 42,
    contactMethod: 'snapchat',
    contactValue: 'dj_kflow',
    timestamp: '2d ago'
  },
  {
    id: 'buzz-8',
    authorName: 'Elena Rostova',
    authorHandle: '@elena_r',
    authorInitial: 'ER',
    campus: 'Livingstone • 2d',
    tag: 'Study Pod',
    content: 'Hosting a free mock behavioral interview & resume ATS roast session in Student Union 102 tomorrow at 4pm!',
    likes: 55,
    replies: 17,
    timestamp: '2d ago'
  }
];

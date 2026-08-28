/**
 * @file src/lib/data.ts
 * @description Master Fallback Mock Data Store for IEEE MAIT Student Branch Digital Platform.
 * 
 * Provides complete, offline-ready mock datasets with verified working images across:
 * - Chapters & Affinity Groups (SB, EDS, WIE)
 * - People & Leadership (Faculty Counselor, Mentors, Senior ExeCom, Operational Leads)
 * - Flagship Events & Technical Workshops
 * - Photo Gallery Albums & Documentary Captures (High-Resolution Unsplash Photography)
 * - Technical Hardware & Software Projects
 * - Articles, Stories & Publications
 * - Special Interest Groups (SIGs) & Opportunities
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

export enum EventCategory {
  WORKSHOP = 'Workshop',
  SEMINAR = 'Seminar',
  HACKATHON = 'Hackathon',
  FLAGSHIP = 'Flagship',
  COMPETITION = 'Competition',
  BRANCH_EVENT = 'Branch Event',
}

export enum EventStatus {
  UPCOMING = 'Upcoming',
  PAST = 'Past',
  CANCELLED = 'Cancelled',
}

export enum OrganizingUnit {
  SB = 'IEEE MAIT SB',
  EDS = 'IEEE EDS Chapter',
  WIE = 'WIE Affinity Group',
}

export enum OrganizingUnitSlug {
  SB = 'sb',
  EDS = 'eds',
  WIE = 'wie',
}

export enum AchievementCategory {
  AWARD = 'Award',
  COMPETITION = 'Competition',
  IEEE_RECOGNITION = 'IEEE Recognition',
  PUBLICATION = 'Publication',
}

export enum ChapterType {
  STUDENT_BRANCH = 'Student Branch',
  AFFINITY_GROUP = 'Affinity Group',
  TECHNICAL_CHAPTER = 'Technical Chapter',
}

export enum PublicationType {
  ARTICLE = 'Article',
  EVENT_REPORT = 'Event Report',
  ANNOUNCEMENT = 'Announcement',
}

export enum PersonCategory {
  BRANCH_COUNSELLOR = 'Counsellor',
  MENTOR = 'Mentor',
  SEC = 'Senior Executive Committee',
  OPERATIONAL_LEAD = 'Operational Leads',
  CHAPTER_LEAD = 'Chapter Lead',
}

export interface Person {
  id: string;
  name: string;
  role: string;
  category: PersonCategory | string;
  department?: string | null;
  academicYear?: string | null;
  bio?: string | null;
  imageSrc?: string | null;
  imageUrl?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  email?: string | null;
  hierarchy?: number;
  isFacultyAdvisor?: boolean;
  chapterId?: string | null;
  chapterSlug?: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  venue: string;
  unit: OrganizingUnit;
  unitSlug: OrganizingUnitSlug;
  category: EventCategory;
  status: EventStatus;
  description: string;
  imageSrc?: string | null;
  registrationLink?: string | null;
  reportSlug?: string | null;
  gallerySlug?: string | null;
}

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  conferredBy: string;
  unitOrTeam: string;
  category: AchievementCategory;
  description?: string;
}

export interface ChapterItem {
  id: string;
  name: string;
  slug: string;
  type: ChapterType;
  parentSociety: string;
  establishedYear: string;
  tagline: string;
  description: string;
  mission: string;
  logoUrl: string;
  coverImageUrl?: string;
  accentColor: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  memberCount: string;
  eventCount: string;
  leaderName: string;
  leaderRole: string;
  leaderId?: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url?: string | null;
  caption: string;
  width?: number;
  height?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  date: string;
  photoCount: number;
  coverUrl?: string;
  associatedEvent?: string;
  unit: string;
  description: string;
  photos: GalleryPhoto[];
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  chapterId?: string;
  chapterSlug?: string;
  year: string;
  tags: string[];
  featured?: boolean;
}

export interface InitiativeItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'Active' | 'Upcoming' | 'Completed' | string;
  chapterId?: string;
  chapterSlug?: string;
  iconName?: string;
  targetAudience?: string;
  featured?: boolean;
}

export interface StoryArticle {
  id: string;
  title: string;
  slug: string;
  type: PublicationType;
  author: string;
  authorRole?: string;
  publishedDate: string;
  readingTime?: string;
  unit: string;
  excerpt: string;
  content: string[];
  imageUrl?: string | null;
}

/**
 * Global branch statistical tokens.
 */
export const BRANCH_STATS = {
  institution: 'Maharaja Agrasen Institute of Technology',
  branchCode: 'STB03681',
  region: 'IEEE Region 10',
  section: 'Delhi Section',
  establishedYear: '2005',
  activeMembers: '150+',
  eventsOrganized: '80+',
  totalEventsOrganized: '80+',
  charteredUnits: '3',
  awardsWon: '15+',
  activeProjects: '12+',
};

/**
 * Master catalog of active chapters and affinity groups.
 */
export const CHAPTERS_DATA: Record<string, ChapterItem> = {
  sb: {
    id: 'sb',
    name: 'IEEE MAIT Student Branch',
    slug: 'sb',
    type: ChapterType.STUDENT_BRANCH,
    parentSociety: 'IEEE Region 10 · Delhi Section',
    establishedYear: '2005',
    tagline: 'Parent Student Branch & Flagship Operations',
    description: 'The core student branch coordinating overarching technical activities, flagship annual symposiums, student memberships, and multi-chapter initiatives at MAIT.',
    mission: 'To cultivate engineering excellence, foster multidisciplinary innovation, and provide leadership development opportunities across all engineering branches.',
    logoUrl: '/ieee_mait_sb_light_mode_logo.png',
    accentColor: '#00629B',
    instagramUrl: 'https://instagram.com/ieeemait',
    linkedinUrl: 'https://linkedin.com/company/ieee-mait',
    githubUrl: 'https://github.com/IEEE-MAIT',
    memberCount: '150+',
    eventCount: '50+',
    leaderName: 'Devansh Sharma',
    leaderRole: 'Chairperson',
  },
  wie: {
    id: 'wie',
    name: 'WIE Affinity Group',
    slug: 'wie',
    type: ChapterType.AFFINITY_GROUP,
    parentSociety: 'IEEE Women in Engineering',
    establishedYear: '2015',
    tagline: 'Empowering Women in Engineering & Technology',
    description: 'IEEE WIE is a global network of IEEE members and volunteers dedicated to promoting women engineers and scientists, and inspiring girls around the world to follow their academic interests in STEM.',
    mission: 'To facilitate the global recruitment and retention of women in technical disciplines, creating a vibrant community for skill-building and mentorship.',
    logoUrl: '/wie_mait_light_mode_logo.png',
    accentColor: '#7C3AED',
    instagramUrl: 'https://instagram.com/wie.mait',
    linkedinUrl: 'https://linkedin.com/company/ieee-mait',
    githubUrl: 'https://github.com/wie-mait',
    memberCount: '60+',
    eventCount: '15+',
    leaderName: 'Liesha Gupta',
    leaderRole: 'WIE Affinity Group Chairperson',
  },
  eds: {
    id: 'eds',
    name: 'IEEE EDS Chapter',
    slug: 'eds',
    type: ChapterType.TECHNICAL_CHAPTER,
    parentSociety: 'Electron Devices Society',
    establishedYear: '2018',
    tagline: 'Advancing Solid-State Devices & Semiconductor Engineering',
    description: 'Focusing on electron devices, semiconductor physics, microelectronics, integrated circuits, and hardware engineering workshops.',
    mission: 'To advance technical learning in solid-state electronics, VLSI design, and microelectronics among engineering undergraduates.',
    logoUrl: '/eds_mait_sb_light_mode_logo.png',
    accentColor: '#00629B',
    instagramUrl: 'https://instagram.com/eds_mait',
    linkedinUrl: 'https://linkedin.com/company/eds-mait',
    githubUrl: 'https://github.com/eds-mait',
    memberCount: '45+',
    eventCount: '12+',
    leaderName: 'Rohan Bansal',
    leaderRole: 'EDS Chapter Chairperson',
  },
};

/**
 * Master catalog of People & Leadership.
 */
export const PEOPLE_DATA: Person[] = [
  // 1. Faculty Counselor
  {
    id: 'p-1',
    name: 'Dr. Monika Gupta',
    role: 'Branch Counsellor',
    category: PersonCategory.BRANCH_COUNSELLOR,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'Professor and Branch Counsellor, Department of Electrical & Electronics Engineering (EEE). Guiding IEEE MAIT Student Branch in fostering academic research, technical innovations, and institutional leadership.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 1,
    isFacultyAdvisor: true,
  },
  // 2. Mentors & Senior Advisory
  {
    id: 'p-m1',
    name: 'Ashish Kumar',
    role: 'Mentor',
    category: PersonCategory.MENTOR,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787250027/ictcwic4yk87gs4awnnt.png',
    linkedIn: 'https://www.linkedin.com/in/ashishkumar1014/',
    hierarchy: 10,
  },
  {
    id: 'p-m2',
    name: 'Rishab Raj',
    role: 'Mentor',
    category: PersonCategory.MENTOR,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'Fail fast, learn faster!',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787249921/tlwmnrdbcmciuwbhfkss.png',
    linkedIn: 'https://www.linkedin.com/in/rishab2211/',
    hierarchy: 10,
  },
  {
    id: 'p-m3',
    name: 'Praval Verma',
    role: 'Mentor',
    category: PersonCategory.MENTOR,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'Maybe life is about unbecoming everything that is not really you.',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787237472/u7fnjfhafg7lbukaz6l5.png',
    linkedIn: 'https://www.linkedin.com/in/praval-verma',
    hierarchy: 10,
  },
  // 3. Senior Executive Committee (ExeCom)
  {
    id: 'p-sec1',
    name: 'Devansh Sharma',
    role: 'Chairperson',
    category: PersonCategory.SEC,
    department: 'CSE',
    academicYear: '2025–26',
    bio: 'Expect disappointment, and you won\'t be disappointed.',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787212896/witpcw9o0lk5ucex7mls.jpg',
    linkedIn: 'https://linkedin.com',
    hierarchy: 1,
  },
  {
    id: 'p-sec2',
    name: 'Suhani Duggal',
    role: 'Vice-Chairperson',
    category: PersonCategory.SEC,
    department: 'CST',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787234810/wzuzpasjd2mg874urdbc.jpg',
    linkedIn: 'https://linkedin.com',
    hierarchy: 2,
  },
  {
    id: 'p-sec3',
    name: 'Tanmay Chadha',
    role: 'General Secretary',
    category: PersonCategory.SEC,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787249662/jiwc0laealagybrkqwnd.png',
    linkedIn: 'https://www.linkedin.com/in/tanmaychadha03/',
    hierarchy: 3,
  },
  {
    id: 'p-sec4',
    name: 'Dishant Pandey',
    role: 'Web Master',
    category: PersonCategory.SEC,
    department: 'CSE',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787249787/egvlqhni13vfabrhlqix.png',
    linkedIn: 'https://www.linkedin.com/in/dishant-pandey-30b49423b/',
    hierarchy: 4,
  },
  {
    id: 'p-sec5',
    name: 'Chaitanya Chauhan',
    role: 'Treasurer',
    category: PersonCategory.SEC,
    department: 'CSE',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787235103/amqszs81xspljhrsmv8b.jpg',
    linkedIn: 'https://linkedin.com',
    hierarchy: 5,
  },
  {
    id: 'p-sec6',
    name: 'Nidhi Goyal',
    role: 'Joint Secretary',
    category: PersonCategory.SEC,
    department: 'CST',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787237108/tdth7etb21alw2dritqv.png',
    linkedIn: 'https://www.linkedin.com/in/nidhi-goyal-b09a41244',
    hierarchy: 6,
  },
  {
    id: 'p-sec7',
    name: 'Lipi Gupta',
    role: 'PR Head',
    category: PersonCategory.SEC,
    department: 'IT',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787235318/girjy5bsewoiqo3i88sk.png',
    linkedIn: 'https://linkedin.com',
    hierarchy: 7,
  },
  {
    id: 'p-sec8',
    name: 'Arsh Kumar',
    role: 'PR Head',
    category: PersonCategory.SEC,
    department: 'ECE',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787235554/opafq1sipilzz4iltono.jpg',
    linkedIn: 'https://linkedin.com',
    hierarchy: 7,
  },
  {
    id: 'p-sec9',
    name: 'Punya Arora',
    role: 'Creative Head',
    category: PersonCategory.SEC,
    department: 'CSE',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787235754/wocfxom4k6ns7hfx5try.jpg',
    linkedIn: 'https://linkedin.com',
    hierarchy: 8,
  },
  {
    id: 'p-sec10',
    name: 'Kavya Singal',
    role: 'Creative Head',
    category: PersonCategory.SEC,
    department: 'CSE',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787237266/lkix0gcmgtkspfx3zih9.jpg',
    linkedIn: 'https://www.linkedin.com/in/kavya-singal-99230831a',
    hierarchy: 8,
  },
  {
    id: 'p-sec11',
    name: 'Vriti Mahajan',
    role: 'Hardware Head',
    category: PersonCategory.SEC,
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'There is a world out there and it\'s calling my name.',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787761645/zosauukm0gr0erv8kku5.jpg',
    linkedIn: 'https://www.linkedin.com/in/vriti-mahajan-9b0892325/',
    hierarchy: 9,
  },
  // 4. Operational Leads
  {
    id: 'p-op1',
    name: 'Paavni Bhamri',
    role: 'Creative Lead',
    category: PersonCategory.OPERATIONAL_LEAD,
    department: 'CST',
    academicYear: '2025–26',
    bio: 'Making sense of things, visually.',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787236374/b0wvuh29ije5oqzbajct.jpg',
    linkedIn: 'https://www.linkedin.com/in/paavni-bhamri',
    hierarchy: 11,
  },
  {
    id: 'p-op2',
    name: 'Aradhya Sharma',
    role: 'Creative Lead',
    category: PersonCategory.OPERATIONAL_LEAD,
    department: 'IT',
    academicYear: '2025–26',
    bio: 'Live it while you can.',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787236884/kogfkojudwgjhqb1wfnu.jpg',
    linkedIn: 'https://www.linkedin.com/in/aradhya-sharma-08364438a/',
    hierarchy: 11,
  },
  {
    id: 'p-op3',
    name: 'Sukriti Chauhan',
    role: 'PR Lead',
    category: PersonCategory.OPERATIONAL_LEAD,
    department: 'CSE-AIML',
    academicYear: '2025–26',
    imageUrl: 'https://res.cloudinary.com/yon6soin/image/upload/v1787250267/acn8uximjjuczdhkvodq.jpg',
    linkedIn: 'https://www.linkedin.com/in/sukriti-chauhan-b46619344/',
    hierarchy: 12,
  },
  // 5. IEEE EDS Chapter Executive Committee
  {
    id: 'p-eds1',
    name: 'Rohan Bansal',
    role: 'EDS Chapter Chairperson',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'eds',
    chapterSlug: 'eds',
    department: 'Department of Electronics & Communication Engineering (ECE)',
    academicYear: '2025–26',
    bio: 'Passionate about semiconductor physics, analog IC design, and microelectronics fabrication.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 20,
  },
  {
    id: 'p-eds2',
    name: 'Aarav Sharma',
    role: 'EDS Vice-Chairperson',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'eds',
    chapterSlug: 'eds',
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'Focusing on embedded hardware systems, sensor telemetry, and power electronics design.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 21,
  },
  {
    id: 'p-eds3',
    name: 'Kunal Verma',
    role: 'EDS Technical Lead',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'eds',
    chapterSlug: 'eds',
    department: 'Department of Electronics & Communication Engineering (ECE)',
    academicYear: '2025–26',
    bio: 'Leading hands-on KiCad 4-layer PCB design and Verilog FPGA workshop tracks.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 22,
  },
  {
    id: 'p-eds4',
    name: 'Ananya Gupta',
    role: 'EDS General Secretary',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'eds',
    chapterSlug: 'eds',
    department: 'Department of Information Technology (IT)',
    academicYear: '2025–26',
    bio: 'Coordinating technical symposiums, research documentation, and chapter membership drives.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 23,
  },
  // 6. IEEE WIE Affinity Group Executive Committee
  {
    id: 'p-wie1',
    name: 'Liesha Gupta',
    role: 'WIE Affinity Group Chairperson',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'wie',
    chapterSlug: 'wie',
    department: 'Department of Electronics & Communication Engineering (ECE)',
    academicYear: '2025–26',
    bio: 'Dedicated to empowering women in STEM, engineering mentorship networks, and research leadership.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 30,
  },
  {
    id: 'p-wie2',
    name: 'Bhumi Rajbhar',
    role: 'WIE Vice-Chairperson',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'wie',
    chapterSlug: 'wie',
    department: 'Department of Electronics & Communication Engineering (ECE)',
    academicYear: '2025–26',
    bio: 'Organizing technical bootcamps, career advancement panels, and school outreach programs.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 31,
  },
  {
    id: 'p-wie3',
    name: 'Anuj Kumar',
    role: 'WIE General Secretary',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'wie',
    chapterSlug: 'wie',
    department: 'Department of Electrical & Electronics Engineering (EEE)',
    academicYear: '2025–26',
    bio: 'Managing community communication, awards documentation, and conference travel grant advisories.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 32,
  },
  {
    id: 'p-wie4',
    name: 'Tanushree Patwari',
    role: 'WIE Treasurer',
    category: PersonCategory.CHAPTER_LEAD,
    chapterId: 'wie',
    chapterSlug: 'wie',
    department: 'Department of Electronics & Communication Engineering (ECE)',
    academicYear: '2025–26',
    bio: 'Overseeing affinity group financial budgeting, sponsorships, and event fund allocations.',
    linkedIn: 'https://linkedin.com',
    hierarchy: 33,
  },
];

/**
 * Flagship technical events, workshops, hackathons, and symposiums.
 */
export const EVENTS_DATA: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Annual Branch Orientation & Membership Drive 2026',
    slug: 'branch-orientation-2026',
    date: 'SEP 15, 2026',
    time: '11:00 AM – 1:30 PM',
    venue: 'Main Auditorium, MAIT Campus',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.BRANCH_EVENT,
    status: EventStatus.UPCOMING,
    description: 'Orientation session for incoming engineering students introducing IEEE benefits, student branch research SIGs, technical project funding, and executive committee onboarding.',
    imageSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    registrationLink: 'https://forms.gle/orientation-2026',
  },
  {
    id: 'ev-2',
    title: 'HackMAIT 2026: 36-Hour National Hardware & AI Hackathon',
    slug: 'hackmait-2026-national-hackathon',
    date: 'NOV 14, 2026',
    time: '09:00 AM (36-Hour Non-Stop)',
    venue: 'Central Computing Lab & Innovation Arena, MAIT',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.HACKATHON,
    status: EventStatus.UPCOMING,
    description: 'Premier national hackathon bringing together 150+ developer & hardware teams across India to engineer solutions in Edge-AI, Robotics, CleanTech, and Autonomous Systems. Featuring a INR 1,50,000 prize pool.',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    registrationLink: 'https://hackmait.devpost.com',
  },
  {
    id: 'ev-3',
    title: 'WIE Women in Tech Leadership Panel & Career Conclave',
    slug: 'wie-women-in-tech-leadership-panel',
    date: 'OCT 22, 2026',
    time: '2:00 PM – 5:30 PM',
    venue: 'Block IX Seminar Hall & Virtual Livestream',
    unit: OrganizingUnit.WIE,
    unitSlug: OrganizingUnitSlug.WIE,
    category: EventCategory.SEMINAR,
    status: EventStatus.UPCOMING,
    description: 'Distinguished panel discussion featuring industry leaders from top tech labs, senior researchers, and IEEE Senior Members discussing career acceleration in STEM, research fellowships, and leadership pathways.',
    imageSrc: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    registrationLink: 'https://forms.gle/wie-leadership-panel',
    reportSlug: 'empowering-women-in-engineering-roadmap',
  },
  {
    id: 'ev-4',
    title: 'VLSI & Silicon Tapeout Masterclass with Cadence Virtuoso',
    slug: 'vlsi-silicon-tapeout-masterclass',
    date: 'OCT 28, 2026',
    time: '10:00 AM – 4:00 PM',
    venue: 'VLSI Design Centre, Block IV',
    unit: OrganizingUnit.EDS,
    unitSlug: OrganizingUnitSlug.EDS,
    category: EventCategory.WORKSHOP,
    status: EventStatus.UPCOMING,
    description: 'Hands-on semiconductor design intensive covering CMOS layout rules, DRC/LVS verification, standard cell libraries, and ASIC synthesis using industry-standard EDA tooling.',
    imageSrc: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&auto=format&fit=crop&q=80',
    registrationLink: 'https://forms.gle/vlsi-masterclass',
  },
  {
    id: 'ev-5',
    title: 'IEEE Day 2025 Flagship Technical Exhibition & Project Expo',
    slug: 'ieee-day-2025-celebration',
    date: 'OCT 07, 2025',
    time: '10:00 AM – 5:00 PM',
    venue: 'MAIT Campus Courtyard & Lab Complex',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.FLAGSHIP,
    status: EventStatus.PAST,
    description: 'Annual IEEE Day celebration featuring hardware project showcases, robotics arena demonstrations, poster paper tracks, alumni networking, and keynotes by IEEE Delhi Section executives.',
    imageSrc: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    gallerySlug: 'ieee-day-2025-celebration',
  },
  {
    id: 'ev-6',
    title: 'Hands-on Workshop on PCB Design & SMD Soldering',
    slug: 'pcb-design-workshop',
    date: 'AUG 12, 2025',
    time: '1:00 PM – 5:30 PM',
    venue: 'ECE Hardware Lab, Block IV',
    unit: OrganizingUnit.EDS,
    unitSlug: OrganizingUnitSlug.EDS,
    category: EventCategory.WORKSHOP,
    status: EventStatus.PAST,
    description: 'Comprehensive hardware engineering boot camp covering schematic capture, 4-layer PCB routing in KiCad, design rule checks, Gerber export, and hands-on hot-air SMD soldering.',
    imageSrc: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    gallerySlug: 'pcb-design-workshop',
  },
  {
    id: 'ev-7',
    title: 'AlgoSprint 2025: Annual Algorithmic Battle & Speed Run',
    slug: 'algosprint-2025-algorithmic-contest',
    date: 'MAY 18, 2025',
    time: '04:00 PM – 07:30 PM',
    venue: 'Online Arena on Codeforces',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.COMPETITION,
    status: EventStatus.PAST,
    description: 'High-speed competitive programming duel featuring 6 challenging problems spanning dynamic programming, segment trees, and graph algorithms with over 200 student coders participating.',
    imageSrc: 'https://images.unsplash.com/photo-1516116211227-bbc13c726352?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ev-8',
    title: 'Quantum Computing & Qiskit Circuit Synthesis Seminar',
    slug: 'quantum-computing-qiskit-seminar',
    date: 'MAR 22, 2025',
    time: '02:00 PM – 04:30 PM',
    venue: 'Mini Auditorium, MAIT',
    unit: OrganizingUnit.EDS,
    unitSlug: OrganizingUnitSlug.EDS,
    category: EventCategory.SEMINAR,
    status: EventStatus.PAST,
    description: 'Introductory deep-dive into quantum superposition, entanglement, Bloch sphere representations, and synthesizing variational quantum eigensolvers (VQE) using IBM Qiskit.',
    imageSrc: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
  },
];

/**
 * Historical achievements and awards ledger.
 */
export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'a1',
    year: '2025',
    title: 'Exemplary Student Branch Award',
    conferredBy: 'IEEE Delhi Section',
    unitOrTeam: 'IEEE MAIT SB',
    category: AchievementCategory.IEEE_RECOGNITION,
    description: 'Recognized as the foremost active student branch across the Delhi Section for technical excellence, student project incubation, and sustained operational vitality.',
  },
  {
    id: 'a2',
    year: '2025',
    title: 'First Place — National Robotics & Hardware Hackathon',
    conferredBy: 'National Tech Summit',
    unitOrTeam: 'EDS Student Team',
    category: AchievementCategory.COMPETITION,
    description: 'Awarded 1st place among 120+ teams for an autonomous obstacle-avoidance quadruped rover built with custom STM32 motor controllers and ultrasonic telemetry.',
  },
  {
    id: 'a3',
    year: '2025',
    title: 'Outstanding Student Branch Chair Award',
    conferredBy: 'IEEE Delhi Section Student Activities',
    unitOrTeam: 'Executive Committee',
    category: AchievementCategory.AWARD,
    description: 'Conferred in recognition of visionary student leadership, multi-chapter collaboration, and expanding digital infrastructure across Region 10.',
  },
  {
    id: 'a4',
    year: '2024',
    title: 'Best Technical Event Organization Award',
    conferredBy: 'IEEE Delhi Section Student Activities',
    unitOrTeam: 'WIE Affinity Group',
    category: AchievementCategory.AWARD,
    description: 'Honored for organizing high-impact technical bootcamps, career advancement symposiums, and school STEM outreach programs for women in engineering.',
  },
  {
    id: 'a5',
    year: '2024',
    title: 'Global Finalist — IEEE Student Paper Contest (SPC 2024)',
    conferredBy: 'IEEE Region 10 (Asia-Pacific)',
    unitOrTeam: 'Research Project Cell',
    category: AchievementCategory.PUBLICATION,
    description: 'Undergraduate student paper on "Edge-AI Acoustic Anomaly Detection for Rotating Machinery" selected among top 5 finalists across Region 10.',
  },
  {
    id: 'a6',
    year: '2024',
    title: 'Outstanding WIE Affinity Group of the Year',
    conferredBy: 'IEEE Delhi Section WIE Committee',
    unitOrTeam: 'WIE Affinity Group',
    category: AchievementCategory.IEEE_RECOGNITION,
    description: 'Awarded for exceptional community engagement, 1-on-1 mentorship initiatives, and promoting gender diversity across technical domains.',
  },
  {
    id: 'a7',
    year: '2023',
    title: 'Outstanding Student Branch Counselor Recognition',
    conferredBy: 'IEEE Region 10',
    unitOrTeam: 'Faculty Mentors',
    category: AchievementCategory.AWARD,
    description: 'Honoring exemplary guidance, faculty mentorship, and over two decades of institutional stewardship by MAIT branch advisors.',
  },
  {
    id: 'a8',
    year: '2023',
    title: 'Winner — IEEE Day Global Photo & Video Showcase',
    conferredBy: 'IEEE Global Student Activities Committee',
    unitOrTeam: 'Media & Web Team',
    category: AchievementCategory.COMPETITION,
    description: 'Selected as global winner for capturing the collaborative spirit and documentary excellence of IEEE MAIT Day technical celebrations.',
  },
];

/**
 * Institutional milestones catalog since branch establishment in 2005.
 */
export const MILESTONES_DATA: MilestoneItem[] = [
  {
    year: '2026',
    title: 'Diamond Jubilee: 20+ Years of Technical Excellence',
    description: 'IEEE MAIT marks two continuous decades of student engineering, technical leadership, and global alumni impact.',
  },
  {
    year: '2025',
    title: 'WIE Leadership Summit & Digital Platform Launch',
    description: 'Branch membership expands past 150 active members with launch of open-source Next.js Edge digital platform.',
  },
  {
    year: '2024',
    title: 'Exemplary Student Branch Award Win',
    description: 'Awarded Exemplary Student Branch by IEEE Delhi Section for exceptional technical workshops and project funding.',
  },
  {
    year: '2021',
    title: 'Special Interest Groups (SIGs) Inception',
    description: 'Introduced 4 specialized student research wings: DSA, Full-Stack Dev, AI/ML, and Embedded Hardware.',
  },
  {
    year: '2018',
    title: 'IEEE EDS Chapter Chartered',
    description: 'Electron Devices Society chapter officially chartered to promote semiconductor physics, PCB design, and VLSI silicon learning.',
  },
  {
    year: '2015',
    title: 'WIE Affinity Group Chartered',
    description: 'Women in Engineering affinity group established to empower female engineering students through mentorship and grants.',
  },
  {
    year: '2008',
    title: 'First National Student Symposium Organised',
    description: 'Hosted the inaugural IEEE Delhi Section multi-college technical symposium with 400+ delegates.',
  },
  {
    year: '2005',
    title: 'IEEE MAIT Student Branch Established',
    description: 'Officially chartered at Maharaja Agrasen Institute of Technology under IEEE Region 10 (Delhi Section).',
  },
];

/**
 * Photo Gallery Albums Store with high-resolution Unsplash photography.
 */
export const GALLERY_ALBUMS_DATA: Record<string, GalleryAlbum> = {
  'ieee-day-2025-celebration': {
    id: 'g1',
    title: 'IEEE Day 2025 Flagship Technical Exhibition',
    slug: 'ieee-day-2025-celebration',
    date: 'OCT 07, 2025',
    photoCount: 5,
    unit: 'IEEE MAIT SB',
    description: 'Official documentary photography capturing IEEE Day technical exhibitions, student hardware demonstrations, keynote addresses, and awards.',
    coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80', caption: 'Student branch leadership opening ceremony at MAIT Courtyard' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', caption: 'Hardware project demonstration by 3rd year ECE team' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80', caption: 'Keynote lecture by IEEE Delhi Section executive representative' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', caption: 'Executive committee and student volunteer group photograph' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', caption: 'Interactive project evaluation by faculty advisory board' },
    ],
  },
  'pcb-design-workshop': {
    id: 'g2',
    title: 'Hands-on Workshop on PCB Design & Soldering',
    slug: 'pcb-design-workshop',
    date: 'AUG 12, 2025',
    photoCount: 5,
    unit: 'IEEE EDS Chapter',
    description: 'Photographs capturing student engineers practicing KiCad schematic layout, circuit routing, oscilloscope probing, and precision SMD soldering.',
    coverUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { id: 'p6', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80', caption: 'KiCad schematic layout tutorial session in ECE Lab' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80', caption: 'Student member practicing SMD component soldering' },
      { id: 'p8', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80', caption: 'Oscilloscope testing of assembled circuit board' },
      { id: 'p9', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80', caption: 'Completed microcontroller breakout board' },
      { id: 'p10', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80', caption: 'Hands-on hardware lab demonstration round' },
    ],
  },
  'wie-leadership-summit': {
    id: 'g3',
    title: 'WIE Women in Tech Leadership Summit & Ideathon',
    slug: 'wie-leadership-summit',
    date: 'MAR 08, 2025',
    photoCount: 4,
    unit: 'WIE Affinity Group',
    description: 'Documentary highlights from the annual Women in Engineering leadership symposium, research presentations, and female founder roundtables.',
    coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { id: 'p11', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80', caption: 'Panel discussion on research grants and global fellowship pathways' },
      { id: 'p12', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80', caption: 'Distinguished keynote address by senior IEEE researcher' },
      { id: 'p13', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80', caption: 'Student mentoring circles and project pitch ideation' },
      { id: 'p14', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&auto=format&fit=crop&q=80', caption: 'WIE executive committee award presentation' },
    ],
  },
  'hackmait-arena': {
    id: 'g4',
    title: 'HackMAIT 24-Hour National Hackathon Arena',
    slug: 'hackmait-arena',
    date: 'FEB 17, 2025',
    photoCount: 4,
    unit: 'IEEE MAIT SB',
    description: 'Late-night coding sprints, hardware debugging benches, mentor check-ins, and demo pitches from HackMAIT national competition.',
    coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { id: 'p15', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80', caption: 'Midnight coding sprint in central computing facility' },
      { id: 'p16', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80', caption: 'Team debugging full-stack cloud application' },
      { id: 'p17', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80', caption: 'Mentor guidance round during prototype evaluation' },
      { id: 'p18', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', caption: 'Final stage pitching in front of industry jury' },
    ],
  },
};

/**
 * Catalog of Articles & Technical Reports.
 */
export const STORIES_DATA: Record<string, StoryArticle> = {
  'applied-neural-networks-workshop-series': {
    id: 's1',
    title: 'Reflections on Our Applied Neural Networks Workshop Series',
    slug: 'applied-neural-networks-workshop-series',
    type: PublicationType.EVENT_REPORT,
    author: 'Kunal Verma',
    authorRole: 'EDS Technical Lead',
    publishedDate: 'AUG 08, 2026',
    readingTime: '5 min read',
    unit: 'IEEE EDS Chapter',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'A technical breakdown of key concepts covered during the 3-day deep learning session, student project highlights, and resources for deploying PyTorch models to embedded microcontrollers.',
    content: [
      'In August 2026, the IEEE EDS Chapter at MAIT conducted a three-day intensive workshop titled "Applied Neural Networks with PyTorch". Designed for second and third-year undergraduates, the workshop aimed to bridge mathematical theory with practical edge deployment.',
      'Over 60 students participated in hands-on coding sessions covering tensor operations, autograd engines, convolutional neural networks (CNNs), and transfer learning models using pre-trained ResNet and MobileNet backbones.',
      'Student projects included an autonomous license plate recognition model trained on local traffic datasets and an edge-computing anomaly detector for manufacturing hardware using ESP32-S3 microcontrollers.',
      'The event concluded with a code review and project presentation session evaluated by industry researchers from tech labs in Delhi NCR.'
    ],
  },
  'empowering-women-in-engineering-roadmap': {
    id: 's2',
    title: 'Empowering Women in Engineering: WIE MAIT 2026 Roadmap',
    slug: 'empowering-women-in-engineering-roadmap',
    type: PublicationType.ARTICLE,
    author: 'Sanya Malhotra',
    authorRole: 'WIE Affinity Group Chair',
    publishedDate: 'JUL 25, 2026',
    readingTime: '4 min read',
    unit: 'WIE Affinity Group',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'An overview of upcoming 1-on-1 mentorship programs, international conference travel grants, and school community outreach initiatives planned for the current academic session.',
    content: [
      'The IEEE Women in Engineering (WIE) Affinity Group at MAIT is proud to release its operational roadmap for the 2026-27 academic term.',
      'Key initiatives include the "STEM-Forward Mentorship Program" pairing senior engineering students with first-year female undergraduates, alongside resume review clinics and competitive hackathon preparation bootcamps.',
      'Furthermore, our dedicated Travel Grant advisory cell assists undergraduate authors in drafting proposals for IEEE WIE ILC and regional flagship conferences.',
      'We invite all passionate students to join our community channels and participate in our upcoming panel discussions, coding sprints, and technical workshops.'
    ],
  },
  'demystifying-riscv-pipelined-soft-core': {
    id: 's3',
    title: 'Demystifying RISC-V: Engineering a 5-Stage Soft Core in Verilog',
    slug: 'demystifying-riscv-pipelined-soft-core',
    type: PublicationType.ARTICLE,
    author: 'Rohan Bansal',
    authorRole: 'EDS Chapter Chair',
    publishedDate: 'JUN 14, 2026',
    readingTime: '7 min read',
    unit: 'IEEE EDS Chapter',
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'How student engineers at IEEE MAIT built and synthesized a complete 32-bit RV32I pipelined processor with hazard resolution on Artix-7 FPGAs.',
    content: [
      'The open-source RISC-V ISA has revolutionized modern processor design. At IEEE EDS MAIT, our hardware team embarked on constructing an in-order 5-stage pipelined RV32I processor core from scratch using Verilog HDL.',
      'We implemented classic fetch, decode, execute, memory, and writeback pipeline stages, augmented with data forwarding units and branch hazard prediction logic to eliminate pipeline stalls.',
      'The design was synthesized onto Xilinx Artix-7 FPGA boards, successfully executing bare-metal C programs communicating via memory-mapped UART.',
      'All source files, testbenches, and Vivado constraints are open-sourced under the IEEE MAIT GitHub repository for the broader academic community.'
    ],
  },
  'nextjs-edge-architecture-student-branch': {
    id: 's4',
    title: 'Edge-First Architecture: Building the IEEE MAIT Digital Portal',
    slug: 'nextjs-edge-architecture-student-branch',
    type: PublicationType.ARTICLE,
    author: 'Aaditya Sharma',
    authorRole: 'Branch Webmaster',
    publishedDate: 'MAY 02, 2026',
    readingTime: '6 min read',
    unit: 'IEEE MAIT SB',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Deep-dive into the architectural decisions behind our Next.js App Router, Prisma ORM, and Edge caching strategies delivering sub-100ms load times worldwide.',
    content: [
      'When re-architecting the IEEE MAIT digital portal, our core objective was zero downtime, lightning-fast navigation, and complete historical preservation across 20+ years of branch archives.',
      'By adopting the Next.js App Router paired with Tailwind CSS, server component data fetching, and Prisma ORM, we achieved optimal SEO indexing and eliminated client-side waterfall delays.',
      'Dynamic fallback strategies guarantee that even under offline development conditions, the application renders with 100% aesthetic precision.',
      'The portal stands as a living testament to open-source student engineering at MAIT.'
    ],
  },
};

/**
 * Fallback Technical Projects Store (Hardware, VLSI, Embedded Systems, and Web)
 */
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Autonomous Solar-Powered Quadruped Rover',
    slug: 'autonomous-solar-powered-quadruped-rover',
    summary: 'A 12-DOF autonomous quadruped rover equipped with custom STM32 motor controllers, ultrasonic telemetry, and solar charging circuitry.',
    description: 'Designed and manufactured by IEEE EDS student members. Features custom 4-layer power distribution PCBs routed in KiCad, inverse kinematics algorithms running on STM32F4, and real-time obstacle avoidance telemetry over 2.4GHz ISM band.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/quadruped-rover',
    demoUrl: 'https://youtube.com',
    chapterId: 'eds',
    chapterSlug: 'eds',
    year: '2025',
    tags: ['KiCad PCB', 'STM32', 'Robotics', 'Embedded C', 'Hardware'],
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Edge-AI Industrial Acoustic Anomaly Detector',
    slug: 'edge-ai-acoustic-anomaly-detector',
    summary: 'Low-power micro-sensor node running quantized 8-bit convolutional neural networks for early detection of mechanical bearing degradation.',
    description: 'Developed during the EDS Machine Learning Hardware Track. Leverages an ESP32-S3 microcontroller paired with an I2S MEMS microphone, running TensorFlow Lite Micro models with sub-50ms inference latency.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/edge-ai-sensor',
    chapterId: 'eds',
    chapterSlug: 'eds',
    year: '2026',
    tags: ['Edge AI', 'TensorFlow Lite', 'ESP32-S3', 'TinyML', 'Sensors'],
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Custom 32-Bit RISC-V RV32I Pipelined Soft-Core',
    slug: 'riscv-rv32i-pipelined-soft-core',
    summary: 'A 5-stage pipelined RISC-V processor architecture modeled in Verilog HDL with forwarding units and branch hazard detection.',
    description: 'Designed as an educational silicon architecture project by EDS Chapter students. Tested on Xilinx Artix-7 FPGAs running custom bare-metal C programs and memory-mapped UART peripherals.',
    coverImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/riscv-rv32i-core',
    chapterId: 'eds',
    chapterSlug: 'eds',
    year: '2025',
    tags: ['Verilog HDL', 'FPGA', 'Computer Architecture', 'VLSI'],
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'IEEE MAIT Institutional Digital Platform & Archive',
    slug: 'ieee-mait-digital-platform',
    summary: 'Open-source Edge-SSR institutional platform preserving branch memory, academic year archives, and interactive chapter sub-portals.',
    description: 'Built with Next.js App Router, Tailwind CSS, PostgreSQL, and Prisma ORM with Edge Acceleration for global sub-100ms response times.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/student-branch-platform',
    demoUrl: 'https://ieeemait.com',
    chapterId: 'sb',
    chapterSlug: 'sb',
    year: '2026',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Edge SSR'],
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'NeuroPulse: Non-Invasive EEG Biosignal Classifier',
    slug: 'neuropulse-eeg-biosignal-classifier',
    summary: 'Real-time 8-channel EEG brainwave classifier utilizing 1D temporal CNNs to detect cognitive load and motor imagery signals.',
    description: 'Interdisciplinary project by WIE & Student Branch members combining biomedical instrumentation amplifiers with deep learning DSP filters to classify motor intent for assistive robotics.',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/neuropulse-eeg',
    chapterId: 'wie',
    chapterSlug: 'wie',
    year: '2025',
    tags: ['Bio-Medical', 'PyTorch', 'DSP', 'Signal Processing', 'AI/ML'],
    featured: false,
  },
  {
    id: 'proj-6',
    title: 'AeroVision: Wildfire Reconnaissance Aerial Node',
    slug: 'aerovision-wildfire-recon-node',
    summary: 'Long-range autonomous UAV payload integrating radiometric FLIR thermal imaging and Edge-YOLO for early forest fire triangulation.',
    description: 'Equipped with NVIDIA Jetson Nano running real-time thermal anomaly segmentation, transmitting telemetry via 915MHz LoRa mesh to ground base stations.',
    coverImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/aerovision-uav',
    chapterId: 'sb',
    chapterSlug: 'sb',
    year: '2025',
    tags: ['UAV', 'Computer Vision', 'Jetson Nano', 'LoRa', 'Embedded'],
    featured: false,
  },
  {
    id: 'proj-7',
    title: 'SolarMesh: Decentralized Microgrid Load Balancer',
    slug: 'solarmesh-microgrid-load-balancer',
    summary: 'Smart IoT power distribution controller balancing residential solar inverter output using ESP-NOW wireless mesh protocols.',
    description: 'Engineered by EEE & EDS members to dynamically distribute solar battery reserves among interconnected cluster loads with sub-10ms relay switching.',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/solarmesh-iot',
    chapterId: 'eds',
    chapterSlug: 'eds',
    year: '2024',
    tags: ['CleanTech', 'IoT', 'Smart Grid', 'ESP32', 'Power Electronics'],
    featured: false,
  },
  {
    id: 'proj-8',
    title: 'ZeroTrust Guard: Ephemeral Key Network Gateway',
    slug: 'zerotrust-guard-network-gateway',
    summary: 'High-throughput identity proxy utilizing Linux eBPF kernel filters and WireGuard tunnels for cryptographic zero-trust access control.',
    description: 'Built in Rust to provide granular campus lab server access with hardware MFA tokens and automated audit logging.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/IEEE-MAIT/zerotrust-guard',
    chapterId: 'sb',
    chapterSlug: 'sb',
    year: '2026',
    tags: ['Rust', 'Cybersecurity', 'eBPF', 'Networking', 'Zero Trust'],
    featured: false,
  },
];

/**
 * Fallback Strategic Initiatives & Programs Store (WIE, EDS, and Parent SB)
 */
export const INITIATIVES_DATA: InitiativeItem[] = [
  {
    id: 'init-1',
    title: 'STEM-Forward Mentorship Circle',
    slug: 'stem-forward-mentorship-circle',
    description: 'Structured 1-on-1 mentorship connecting senior female engineering students with 1st & 2nd year undergraduates to provide academic guidance, technical roadmap navigation, and project review.',
    status: 'Active',
    chapterId: 'wie',
    chapterSlug: 'wie',
    iconName: 'Users',
    targetAudience: '1st & 2nd Year Women in STEM',
    featured: true,
  },
  {
    id: 'init-2',
    title: 'Women in Tech Leadership & Research Panels',
    slug: 'women-in-tech-leadership-panels',
    description: 'Bi-annual panel series featuring distinguished women engineers, researchers, and IEEE Senior Members sharing career insights, research methodologies, and leadership lessons.',
    status: 'Active',
    chapterId: 'wie',
    chapterSlug: 'wie',
    iconName: 'Sparkles',
    targetAudience: 'All Undergraduate Students',
    featured: true,
  },
  {
    id: 'init-3',
    title: 'Travel Grant & Fellowship Advisory Cell',
    slug: 'travel-grant-fellowship-advisory',
    description: 'Dedicated support program assisting student researchers in drafting applications for IEEE conference travel grants, section awards, and international student paper competitions.',
    status: 'Active',
    chapterId: 'wie',
    chapterSlug: 'wie',
    iconName: 'Award',
    targetAudience: 'Student Researchers & Authors',
    featured: true,
  },
  {
    id: 'init-4',
    title: 'High-School & Community Technical Outreach',
    slug: 'high-school-community-outreach',
    description: 'Volunteer workshops organized by WIE student members at local high schools to spark interest in robotics, electronics, and coding among young female students.',
    status: 'Upcoming',
    chapterId: 'wie',
    chapterSlug: 'wie',
    iconName: 'Globe',
    targetAudience: 'High School Students & Educators',
    featured: false,
  },
  {
    id: 'init-5',
    title: 'KiCad Hardware PCB Certification Track',
    slug: 'kicad-pcb-certification-track',
    description: 'Hands-on 6-week hardware design curriculum guiding students from initial schematic capture to 4-layer PCB layout, Gerber generation, and SMD soldering.',
    status: 'Active',
    chapterId: 'eds',
    chapterSlug: 'eds',
    iconName: 'Cpu',
    targetAudience: 'ECE, EEE & Hardware Enthusiasts',
    featured: true,
  },
  {
    id: 'init-6',
    title: 'VLSI & Semiconductor Design Bootcamp',
    slug: 'vlsi-semiconductor-bootcamp',
    description: 'Comprehensive technical workshop covering digital CMOS layout, Verilog simulation, standard cell libraries, and ASIC synthesis flows.',
    status: 'Active',
    chapterId: 'eds',
    chapterSlug: 'eds',
    iconName: 'Layers',
    targetAudience: 'VLSI & Microelectronics Aspirants',
    featured: true,
  },
  {
    id: 'init-7',
    title: 'Open Hardware Component Lending Library',
    slug: 'open-hardware-component-library',
    description: 'Branch repository offering student project teams free access to microcontrollers (STM32, ESP32, Arduino), sensor modules, oscilloscopes, and logic analyzers.',
    status: 'Active',
    chapterId: 'sb',
    chapterSlug: 'sb',
    iconName: 'Zap',
    targetAudience: 'All Enrolled Branch Members',
    featured: true,
  },
  {
    id: 'init-8',
    title: 'Alumni Tech Mentorship & Mock Interviews',
    slug: 'alumni-tech-mentorship-mock-interviews',
    description: 'Quarterly career prep roundtables pairing final-year students with MAIT alumni working at premier global engineering companies for technical resume reviews and coding mocks.',
    status: 'Active',
    chapterId: 'sb',
    chapterSlug: 'sb',
    iconName: 'Compass',
    targetAudience: '3rd & 4th Year Undergraduates',
    featured: false,
  },
];

/**
 * Special Interest Groups (SIGs) catalog.
 */
export const SIGS_DATA = [
  {
    id: 'sig-dsa',
    name: 'Data Structures & Algorithms (DSA)',
    slug: 'dsa',
    description: 'Mastering algorithmic problem solving, competitive programming, dynamic programming, graph theory, and technical interview preparation.',
    leadId: null,
    memberCount: 45,
    accentColor: '#0284C7',
    logoUrl: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1516116211227-bbc13c726352?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sig-dev',
    name: 'Software & Web Development',
    slug: 'development',
    description: 'Building modern full-stack web applications, TypeScript microservices, open-source tools, and decentralized cloud systems.',
    leadId: null,
    memberCount: 60,
    accentColor: '#10B981',
    logoUrl: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sig-ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    slug: 'ai-ml',
    description: 'Researching neural network architectures, computer vision, NLP transformers, TinyML on microcontrollers, and predictive intelligence.',
    leadId: null,
    memberCount: 52,
    accentColor: '#8B5CF6',
    logoUrl: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sig-hardware',
    name: 'Hardware, Embedded Systems & IoT',
    slug: 'hardware',
    description: 'Hands-on KiCad PCB design, ARM/STM32 microcontroller firmware, autonomous robotics rovers, and smart LoRa IoT sensor systems.',
    leadId: null,
    memberCount: 38,
    accentColor: '#F59E0B',
    logoUrl: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  },
];

/**
 * Career opportunities, research fellowships, and scholarships catalog.
 */
export const OPPORTUNITIES_DATA = [
  {
    id: 'opp-1',
    title: 'IEEE Richard E. Merwin Student Scholarship ($1,000)',
    slug: 'ieee-richard-e-merwin-scholarship-2026',
    description: 'Recognizes and rewards active student leaders in IEEE Computer Society student branches who demonstrate exceptional academic excellence and branch leadership.',
    organisation: 'IEEE Computer Society',
    category: 'Scholarship',
    eligibility: 'Undergraduate & Graduate IEEE Student Members with GPA >= 3.0',
    deadline: '30 September 2026',
    deadlineDate: '2026-09-30T23:59:59Z',
    link: 'https://www.computer.org/volunteering/awards/scholarships/merwin',
    status: 'Active',
    featured: true,
  },
  {
    id: 'opp-2',
    title: 'IEEE MTT-S Undergraduate Research Fellowship ($1,500)',
    slug: 'ieee-mtts-undergraduate-research-fellowship',
    description: 'Provides financial support of up to $1,500 for undergraduate students pursuing cutting-edge research in RF, microwave, and high-frequency electronics.',
    organisation: 'IEEE Microwave Theory and Technology Society',
    category: 'Fellowship',
    eligibility: 'Undergraduate engineering students enrolled in electronics/electrical curricula',
    deadline: '15 October 2026',
    deadlineDate: '2026-10-15T23:59:59Z',
    link: 'https://mtt.org/students-education/undergraduate-scholarships/',
    status: 'Active',
    featured: true,
  },
  {
    id: 'opp-3',
    title: 'IEEE WIE Student Leadership Conference Travel Grant',
    slug: 'ieee-wie-leadership-travel-grant-2026',
    description: 'Travel grants for outstanding student members to attend the IEEE Women in Engineering International Leadership Conference (WIE ILC).',
    organisation: 'IEEE Women in Engineering (WIE)',
    category: 'Grant',
    eligibility: 'Active IEEE WIE Student Members presenting papers or leading branch initiatives',
    deadline: '31 August 2026',
    deadlineDate: '2026-08-31T23:59:59Z',
    link: 'https://wie.ieee.org/awards/',
    status: 'Active',
    featured: true,
  },
  {
    id: 'opp-4',
    title: 'IEEE PES Student Congress Travel Grant ($1,200)',
    slug: 'ieee-pes-student-congress-travel-grant',
    description: 'Subsidized travel funding for students presenting power systems, smart grid, or renewable energy projects at the IEEE Power & Energy Society Student Congress.',
    organisation: 'IEEE Power & Energy Society (PES)',
    category: 'Grant',
    eligibility: 'Undergraduate PES student members with accepted conference posters',
    deadline: '20 November 2026',
    deadlineDate: '2026-11-20T23:59:59Z',
    link: 'https://ieee-pes.org',
    status: 'Active',
    featured: false,
  },
  {
    id: 'opp-5',
    title: 'Call for Core Webmaster & Full-Stack Developers',
    slug: 'call-for-core-webmaster-developers-2026',
    description: 'Join the IEEE MAIT Web Operations & Digital Infrastructure team. Build and scale Next.js edge applications, design APIs, and manage branch cloud infrastructure.',
    organisation: 'IEEE MAIT Student Branch',
    category: 'Volunteer',
    eligibility: 'MAIT 1st, 2nd & 3rd Year Students with knowledge of Next.js, React, or TypeScript',
    deadline: '15 September 2026',
    deadlineDate: '2026-09-15T23:59:59Z',
    link: 'https://forms.gle/ieee-mait-web-team-call',
    status: 'Active',
    featured: true,
  },
  {
    id: 'opp-6',
    title: 'Call for Hardware & Embedded Systems Project Leads',
    slug: 'call-for-hardware-embedded-project-leads',
    description: 'Lead hands-on hardware development pods in robotics, KiCad PCB routing, and IoT telemetry under the IEEE EDS chapter.',
    organisation: 'IEEE EDS Chapter MAIT',
    category: 'Volunteer',
    eligibility: 'ECE/EEE/CSE students with embedded C/C++, PCB layout, or microcontroller experience',
    deadline: '20 September 2026',
    deadlineDate: '2026-09-20T23:59:59Z',
    link: 'https://forms.gle/eds-hardware-leads',
    status: 'Active',
    featured: true,
  },
  {
    id: 'opp-7',
    title: 'IEEEXtreme 19.0 Global 24-Hour Virtual Hackathon',
    slug: 'ieeextreme-19-global-programming-competition',
    description: 'The premier global 24-hour virtual competitive programming challenge where proctor-supervised teams of up to 3 students compete against universities worldwide.',
    organisation: 'IEEE Global Student Activities Committee',
    category: 'Competition',
    eligibility: 'Active IEEE Student Members (teams of up to 3 with an IEEE Proctor)',
    deadline: '10 October 2026',
    deadlineDate: '2026-10-10T23:59:59Z',
    link: 'https://ieeextreme.org',
    status: 'Upcoming',
    featured: true,
  },
  {
    id: 'opp-8',
    title: 'IEEE Robotics & Automation Society Summer School Grant',
    slug: 'ieee-ras-summer-school-fellowship',
    description: 'Full tuition and accommodation grant for undergraduate students to attend the 5-day international IEEE RAS Summer School on Autonomous Robotics.',
    organisation: 'IEEE Robotics and Automation Society',
    category: 'Fellowship',
    eligibility: 'Undergraduate students working on robotics, motion planning, or control theory',
    deadline: '12 December 2026',
    deadlineDate: '2026-12-12T23:59:59Z',
    link: 'https://ieee-ras.org',
    status: 'Upcoming',
    featured: false,
  },
];

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  fileUrl?: string;
  publishedDate: string;
  description?: string;
  status: string;
}

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 2',
    type: 'Newsletter',
    publishedDate: 'JUL 2026',
    description: 'Bi-annual branch newsletter covering student technical competitions, member spotlights, and project chronicles.',
    fileUrl: '/resources/newsletter-vol3-issue2.pdf',
    status: 'published',
  },
  {
    id: 'res-2',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 1',
    type: 'Newsletter',
    publishedDate: 'JAN 2026',
    description: 'First issue of 2026 covering new academic session roadmap, KiCad bootcamp highlights, and WIE symposium.',
    fileUrl: '/resources/newsletter-vol3-issue1.pdf',
    status: 'published',
  },
  {
    id: 'res-3',
    title: 'Annual Activity & Transition Report 2025–26',
    type: 'AnnualReport',
    publishedDate: 'MAY 2026',
    description: 'Full institutional report: 18 events, 150+ enrolled members, financial audit summary, and Delhi Section achievements.',
    fileUrl: '/resources/annual-report-2025-26.pdf',
    status: 'published',
  },
  {
    id: 'res-4',
    title: 'Annual Activity & Transition Report 2024–25',
    type: 'AnnualReport',
    publishedDate: 'MAY 2025',
    description: 'Institutional summary covering the 2024–25 academic year, student paper publications, and branch officer transitions.',
    fileUrl: '/resources/annual-report-2024-25.pdf',
    status: 'published',
  },
  {
    id: 'res-5',
    title: 'IEEE Student Membership & Onboarding Guide',
    type: 'Document',
    publishedDate: 'AUG 2025',
    description: 'Step-by-step walkthrough for joining IEEE.org, activating 50% student discounts, and registering with MAIT Student Branch.',
    fileUrl: '/resources/membership-guide-2025.pdf',
    status: 'published',
  },
  {
    id: 'res-6',
    title: 'IEEE MAIT Branch Operational Constitution',
    type: 'Document',
    publishedDate: 'JAN 2024',
    description: 'Governing document for IEEE MAIT Student Branch bylaws, executive committee responsibilities, and electoral protocols.',
    fileUrl: '/resources/branch-constitution.pdf',
    status: 'published',
  },
];

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkHref?: string;
  linkText?: string;
  isActive: boolean;
  sortOrder: number;
}

export const BANNERS_DATA: BannerItem[] = [
  {
    id: 'banner-hackmait',
    title: 'HackMAIT 2026 Registration Open',
    subtitle: 'Join India’s top student hardware & AI hackathon with INR 1.5 Lakh prize pool.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80',
    linkHref: '/events/hackmait-2026-national-hackathon',
    linkText: 'Apply on Devpost →',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'banner-wie-summit',
    title: 'EmpowerHer: WIE Leadership Conclave',
    subtitle: 'Connecting women engineers with global research fellowships and industry leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
    linkHref: '/events/wie-women-in-tech-leadership-panel',
    linkText: 'Reserve Free Seat →',
    isActive: true,
    sortOrder: 2,
  },
];

export interface SocialLinkItem {
  id: string;
  entity: string;
  platform: string;
  url: string;
  handle?: string;
  isActive: boolean;
  sortOrder: number;
}

export const SOCIAL_LINKS_DATA: SocialLinkItem[] = [
  { id: 'soc-sb-li', entity: 'Branch', platform: 'LinkedIn', url: 'https://linkedin.com/company/ieee-mait', handle: 'ieee-mait', isActive: true, sortOrder: 1 },
  { id: 'soc-sb-ig', entity: 'Branch', platform: 'Instagram', url: 'https://instagram.com/ieeemait', handle: '@ieeemait', isActive: true, sortOrder: 2 },
  { id: 'soc-sb-gh', entity: 'Branch', platform: 'GitHub', url: 'https://github.com/IEEE-MAIT', handle: 'IEEE-MAIT', isActive: true, sortOrder: 3 },
  { id: 'soc-sb-em', entity: 'Branch', platform: 'Email', url: 'mailto:mait.ieee.sb@gmail.com', handle: 'mait.ieee.sb@gmail.com', isActive: true, sortOrder: 4 },
  { id: 'soc-eds-ig', entity: 'EDS Chapter', platform: 'Instagram', url: 'https://instagram.com/eds_mait', handle: '@eds_mait', isActive: true, sortOrder: 5 },
  { id: 'soc-wie-ig', entity: 'WIE AG', platform: 'Instagram', url: 'https://instagram.com/wie_mait', handle: '@wie_mait', isActive: true, sortOrder: 6 },
];

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

export const INQUIRIES_DATA: InquiryItem[] = [
  { id: 'inq-1', name: 'Kabir Verma', email: 'kabir.v@gmail.com', subject: 'Inquiry regarding KiCad PCB Workshop Registration', message: 'Hello, I am a 2nd year ECE student interested in joining the upcoming hardware tapeout track. Is prior soldering experience required?', status: 'Replied', createdAt: '2026-08-20T10:15:00Z' },
  { id: 'inq-2', name: 'Pooja Narang', email: 'pooja.narang@outlook.com', subject: 'WIE Travel Grant Application Support', message: 'I recently had an IEEE conference paper accepted for R10 TENCON. Does IEEE MAIT WIE offer proposal review assistance?', status: 'Replied', createdAt: '2026-08-22T14:30:00Z' },
  { id: 'inq-3', name: 'Tanmay Saxena', email: 'tanmay.s@mait.ac.in', subject: 'Core Webmaster & Developer Call', message: 'Submitted my application for full-stack edge developer position. Look forward to collaborating on the open-source platform.', status: 'Unread', createdAt: '2026-08-25T09:00:00Z' },
];

export interface AuditLogItem {
  id: string;
  timestamp: string;
  performedBy: string;
  userEmail?: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  entityTitle?: string;
  changeSummary?: string;
}

export const AUDIT_LOGS_DATA: AuditLogItem[] = [
  { id: 'log-1', timestamp: '2026-08-27 22:30:00', performedBy: 'Super Admin', userEmail: 'superadmin@ieee-mait.org', actionType: 'PUBLISH', entityType: 'EVENT', entityId: 'ev-2', entityTitle: 'HackMAIT 2026: 36-Hour National Hackathon', changeSummary: 'Published flagship national hackathon announcement.' },
  { id: 'log-2', timestamp: '2026-08-27 21:15:00', performedBy: 'Content Editor', userEmail: 'editor@ieee-mait.org', actionType: 'UPDATE', entityType: 'PUBLICATION', entityId: 's3', entityTitle: 'Demystifying RISC-V in Verilog', changeSummary: 'Updated Vivado simulation testbench citations.' },
  { id: 'log-3', timestamp: '2026-08-26 18:45:00', performedBy: 'Super Admin', userEmail: 'superadmin@ieee-mait.org', actionType: 'CREATE', entityType: 'PROJECT', entityId: 'proj-8', entityTitle: 'ZeroTrust Guard Network Gateway', changeSummary: 'Created new cybersecurity soft-gateway project profile.' },
];


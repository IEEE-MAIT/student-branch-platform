/**
 * @file src/lib/data.ts
 * @description Central strongly-typed data store and strict Enum definitions for IEEE MAIT Student Branch.
 * 
 * STRICT TYPE DESIGN:
 * Employs explicit TypeScript Enums for all categorical fields (PersonCategory, EventCategory,
 * EventStatus, OrganizingUnit, AchievementCategory, ChapterType, PublicationType) to eliminate
 * string typos and ensure 100% type safety across frontend pages and Payload CMS schemas.
 *
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

/**
 * Role hierarchy categories for IEEE MAIT People & Leadership structure.
 */
export enum PersonCategory {
  BRANCH_COUNSELLOR = 'Branch Counsellor',
  STUDENT_MENTOR = 'Student Mentor of student branch',
  SEC = 'Senior Executive Committee',
  OPERATIONAL_LEAD = 'Operational Lead',
  EDS_EXECUTIVE = 'EDS Executive Committee member',
  WIE_EXECUTIVE = 'WIE AAG Executive Committee member',
}

/**
 * Event taxonomy categories.
 */
export enum EventCategory {
  WORKSHOP = 'Technical Workshop',
  PANEL = 'Panel Discussion',
  BRANCH_EVENT = 'Branch Event',
  FLAGSHIP = 'Flagship Event',
  COMPETITION = 'Competition',
}

/**
 * Event lifecycle status.
 */
export enum EventStatus {
  UPCOMING = 'upcoming',
  PAST = 'past',
  DRAFT = 'draft',
  CANCELLED = 'cancelled',
}

/**
 * Officially chartered organizational units.
 */
export enum OrganizingUnit {
  SB = 'IEEE MAIT SB',
  WIE = 'WIE Affinity Group',
  EDS = 'IEEE EDS Chapter',
}

/**
 * Unit URL slugs.
 */
export enum OrganizingUnitSlug {
  SB = 'sb',
  WIE = 'wie',
  EDS = 'eds',
}

/**
 * Achievement classification taxonomy.
 */
export enum AchievementCategory {
  IEEE_RECOGNITION = 'IEEE Recognition',
  COMPETITION = 'Competition',
  AWARD = 'Award',
  RESEARCH = 'Research',
}

/**
 * Organizational unit types.
 */
export enum ChapterType {
  AFFINITY_GROUP = 'Affinity Group',
  TECHNICAL_CHAPTER = 'Technical Chapter',
}

/**
 * Publication types for stories and articles.
 */
export enum PublicationType {
  ARTICLE = 'Article',
  EVENT_REPORT = 'Event Report',
  ANNOUNCEMENT = 'Announcement',
}

/**
 * Represents a member of the branch, faculty counselor, executive officer, or lead.
 */
export interface Person {
  id: string;
  name: string;
  role: string;
  category: PersonCategory;
  department: string;
  academicYear: string;
  imageSrc?: string;
  linkedIn?: string;
  bio?: string;
}

/**
 * Represents an upcoming or historical event organized by the branch or chapters.
 */
export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  venue: string;
  academicYear?: string;
  unit: OrganizingUnit;
  unitSlug: OrganizingUnitSlug;
  category: EventCategory;
  status: EventStatus;
  registrationLink?: string;
  description: string;
  imageSrc?: string;
  speakers?: Array<{ name: string; title: string; organization: string }>;
  schedule?: Array<{ time: string; activity: string }>;
}

/**
 * Represents an award, hackathon win, or institutional recognition earned by the branch.
 */
export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  conferredBy: string;
  unitOrTeam: string;
  category: AchievementCategory;
  description?: string;
}

/**
 * Represents an autonomous chapter or affinity group (e.g. WIE, EDS).
 */
export interface ChapterItem {
  id: string;
  name: string;
  slug: string;
  type: ChapterType;
  parentSociety: string;
  establishedYear: string;
  description: string;
  mission: string;
  memberCount: string;
  eventCount: string;
  leaderName: string;
  leaderRole: string;
}

/**
 * Represents a historical milestone entry in the institutional timeline.
 */
export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

/**
 * Represents an individual photograph entry within a gallery album.
 */
export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  width?: number;
  height?: number;
}

/**
 * Represents a photo album event gallery.
 */
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

/**
 * Represents a technical article, event post-mortem report, or student essay.
 */
export interface StoryArticle {
  id: string;
  title: string;
  slug: string;
  type: PublicationType;
  author: string;
  authorRole: string;
  publishedDate: string;
  readingTime: string;
  unit: string;
  excerpt: string;
  content: string[];
}

/**
 * Global institutional constants and statistics for IEEE MAIT Student Branch.
 */
export const BRANCH_STATS = {
  activeMembers: '150+',
  eventsOrganized: '50+',
  activeUnits: '2+',
  establishedYear: '2005',
  section: 'IEEE Delhi Section',
  region: 'Region 10 (Asia-Pacific)',
  institution: 'Maharaja Agrasen Institute of Technology',
  email: 'mait.ieee.sb@gmail.com',
} as const;

/**
 * Master catalog of active chapters and affinity groups.
 */
export const CHAPTERS_DATA: Record<string, ChapterItem> = {
  wie: {
    id: 'wie',
    name: 'WIE Affinity Group',
    slug: 'wie',
    type: ChapterType.AFFINITY_GROUP,
    parentSociety: 'IEEE Women in Engineering',
    establishedYear: '2015',
    description: 'IEEE WIE is a global network of IEEE members and volunteers dedicated to promoting women engineers and scientists, and inspiring girls around the world to follow their academic interests in STEM.',
    mission: 'To facilitate the global recruitment and retention of women in technical disciplines, creating a vibrant community for skill-building and mentorship.',
    memberCount: '60+',
    eventCount: '15+',
    leaderName: 'WIE Chair Name',
    leaderRole: 'WIE Student Chair',
  },
  eds: {
    id: 'eds',
    name: 'IEEE EDS Chapter',
    slug: 'eds',
    type: ChapterType.TECHNICAL_CHAPTER,
    parentSociety: 'Electron Devices Society',
    establishedYear: '2018',
    description: 'Focusing on electron devices, semiconductor physics, microelectronics, integrated circuits, and hardware engineering workshops.',
    mission: 'To advance technical learning in solid-state electronics, VLSI design, and microelectronics among engineering undergraduates.',
    memberCount: '45+',
    eventCount: '12+',
    leaderName: 'EDS Chair Name',
    leaderRole: 'EDS Student Chair',
  },
};

/**
 * Catalog of branch events and workshops.
 */
export const EVENTS_DATA: EventItem[] = [
  {
    id: '1',
    title: 'Workshop on Machine Learning Fundamentals & Applied Neural Networks',
    slug: 'workshop-machine-learning-fundamentals',
    date: 'AUG 20, 2026',
    time: '2:00 PM – 5:00 PM',
    venue: 'Seminar Hall, Block A',
    unit: OrganizingUnit.EDS,
    unitSlug: OrganizingUnitSlug.EDS,
    category: EventCategory.WORKSHOP,
    status: EventStatus.UPCOMING,
    description: 'Join us for an intensive hands-on session exploring deep learning architectures, practical model evaluation, and deployment strategies using Python and PyTorch.',
    speakers: [
      { name: 'Dr. Expert Speaker', title: 'Senior AI Researcher', organization: 'Tech Research Lab' },
    ],
    schedule: [
      { time: '2:00 PM', activity: 'Introduction to Neural Networks & Mathematics' },
      { time: '3:15 PM', activity: 'Hands-on Coding Session in PyTorch' },
      { time: '4:30 PM', activity: 'Q&A, Project Guidance & Certificates' },
    ],
  },
  {
    id: '2',
    title: 'WIE Women in Tech Leadership Panel 2026',
    slug: 'wie-women-in-tech-leadership-panel',
    date: 'SEP 05, 2026',
    time: '3:00 PM – 5:00 PM',
    venue: 'Auditorium, Block IX',
    unit: OrganizingUnit.WIE,
    unitSlug: OrganizingUnitSlug.WIE,
    category: EventCategory.PANEL,
    status: EventStatus.UPCOMING,
    description: 'An inspiring panel discussion featuring female engineering leaders, researchers, and alumni discussing career navigation, technical leadership, and mentorship.',
  },
  {
    id: '3',
    title: 'Annual Branch Orientation & Membership Drive',
    slug: 'branch-orientation-2026',
    date: 'SEP 15, 2026',
    time: '11:00 AM – 1:00 PM',
    venue: 'Main Auditorium',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.BRANCH_EVENT,
    status: EventStatus.UPCOMING,
    description: 'Orientation session for 1st & 2nd year students introducing IEEE benefits, student branch project teams, upcoming workshops, and executive committee onboarding.',
  },
  {
    id: '4',
    title: 'IEEE Day 2025 Flagship Technical Exhibition',
    slug: 'ieee-day-2025-celebration',
    date: 'OCT 07, 2025',
    venue: 'MAIT Campus Courtyard',
    unit: OrganizingUnit.SB,
    unitSlug: OrganizingUnitSlug.SB,
    category: EventCategory.FLAGSHIP,
    status: EventStatus.PAST,
    description: 'Annual IEEE Day celebration featuring hardware project showcases, technical poster competitions, alumni networking, and keynotes.',
  },
  {
    id: '5',
    title: 'Hands-on Workshop on PCB Design & Soldering',
    slug: 'pcb-design-workshop',
    date: 'AUG 12, 2025',
    venue: 'ECE Hardware Lab',
    unit: OrganizingUnit.EDS,
    unitSlug: OrganizingUnitSlug.EDS,
    category: EventCategory.WORKSHOP,
    status: EventStatus.PAST,
    description: 'Comprehensive hardware design session covering schematic capture, PCB layout in KiCad, component sourcing, and hands-on soldering practice.',
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
    description: 'Recognized for outstanding event organization, student retention, and institutional continuity across the Delhi Section.',
  },
  {
    id: 'a2',
    year: '2025',
    title: 'First Place — National Robotics & Hardware Hackathon',
    conferredBy: 'National Tech Summit',
    unitOrTeam: 'EDS Student Team',
    category: AchievementCategory.COMPETITION,
    description: 'Awarded 1st place among 120+ teams for autonomous obstacle-avoidance rover prototype built using custom embedded systems.',
  },
  {
    id: 'a3',
    year: '2024',
    title: 'Best Technical Event Organization Award',
    conferredBy: 'IEEE Delhi Section Student Activities',
    unitOrTeam: 'WIE Affinity Group',
    category: AchievementCategory.AWARD,
    description: 'Conferred for organizing impactful technical workshops and mentorship sessions for women in engineering.',
  },
  {
    id: 'a4',
    year: '2023',
    title: 'Outstanding Student Branch Counselor Recognition',
    conferredBy: 'IEEE Region 10',
    unitOrTeam: 'Faculty Mentors',
    category: AchievementCategory.AWARD,
    description: 'Honoring exemplary guidance and long-term commitment of MAIT faculty advisors.',
  },
];

/**
 * Institutional milestones catalog since branch establishment in 2005.
 */
export const MILESTONES_DATA: MilestoneItem[] = [
  {
    year: '2025',
    title: 'WIE Leadership Summit & 20th Anniversary Preparation',
    description: 'Branch membership expands past 150 active members with expanded hardware & AI workshop series.',
  },
  {
    year: '2024',
    title: 'Exemplary Student Branch Award Win',
    description: 'Awarded Exemplary Student Branch by IEEE Delhi Section.',
  },
  {
    year: '2018',
    title: 'IEEE EDS Chapter Chartered',
    description: 'Electron Devices Society chapter officially chartered to promote semiconductor and VLSI hardware learning.',
  },
  {
    year: '2015',
    title: 'WIE Affinity Group Chartered',
    description: 'Women in Engineering affinity group established to empower female engineering students.',
  },
  {
    year: '2005',
    title: 'IEEE MAIT Student Branch Established',
    description: 'Chartered at Maharaja Agrasen Institute of Technology under IEEE Delhi Section.',
  },
];

/**
 * Photo Gallery Albums Store.
 */
export const GALLERY_ALBUMS_DATA: Record<string, GalleryAlbum> = {
  'ieee-day-2025-celebration': {
    id: 'g1',
    title: 'IEEE Day 2025 Flagship Technical Exhibition',
    slug: 'ieee-day-2025-celebration',
    date: 'OCT 07, 2025',
    photoCount: 6,
    unit: 'IEEE MAIT SB',
    description: 'Official documentary photos from IEEE Day celebration, hardware project demonstrations, and student award ceremonies.',
    photos: [
      { id: 'p1', url: '/images/gallery/ieee-day-1.jpg', caption: 'Student branch leadership opening ceremony at MAIT Courtyard' },
      { id: 'p2', url: '/images/gallery/ieee-day-2.jpg', caption: 'Hardware project demonstration by 3rd year ECE team' },
      { id: 'p3', url: '/images/gallery/ieee-day-3.jpg', caption: 'Keynote lecture by IEEE Delhi Section executive representative' },
      { id: 'p4', url: '/images/gallery/ieee-day-4.jpg', caption: 'Technical poster evaluation and student Q&A' },
      { id: 'p5', url: '/images/gallery/ieee-day-5.jpg', caption: 'Award ceremony for best innovation showcase' },
      { id: 'p6', url: '/images/gallery/ieee-day-6.jpg', caption: 'Executive committee group photograph' },
    ],
  },
  'pcb-design-workshop': {
    id: 'g2',
    title: 'Hands-on Workshop on PCB Design & Soldering',
    slug: 'pcb-design-workshop',
    date: 'AUG 12, 2025',
    photoCount: 4,
    unit: 'IEEE EDS Chapter',
    description: 'Photographs capturing student members learning KiCad schematic layout, circuit printing, and soldering technique.',
    photos: [
      { id: 'p7', url: '/images/gallery/pcb-1.jpg', caption: 'KiCad schematic layout tutorial session in ECE Lab' },
      { id: 'p8', url: '/images/gallery/pcb-2.jpg', caption: 'Student member practicing SMD component soldering' },
      { id: 'p9', url: '/images/gallery/pcb-3.jpg', caption: 'Oscilloscope testing of assembled circuit board' },
      { id: 'p10', url: '/images/gallery/pcb-4.jpg', caption: 'Completed microcontroller breakout board' },
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
    author: 'EDS Technical Lead',
    authorRole: 'IEEE EDS Chapter Lead',
    publishedDate: 'AUG 08, 2026',
    readingTime: '5 min read',
    unit: 'IEEE EDS Chapter',
    excerpt: 'A technical summary of key concepts covered during the 3-day deep learning session, student project highlights, and resources for further learning.',
    content: [
      'In August 2026, the IEEE EDS Chapter at MAIT conducted a three-day intensive workshop titled "Applied Neural Networks with PyTorch". Designed for second and third-year undergraduates, the workshop aimed to bridge mathematical theory with practical deep learning deployment.',
      'Over 60 students participated in hands-on coding sessions covering tensor operations, autograd engines, convolutional neural networks (CNNs), and transfer learning models.',
      'Student projects included an autonomous license plate recognition model trained on local traffic datasets and an edge-computing anomaly detector for manufacturing hardware.',
      'The event concluded with a code review and project presentation session evaluated by industry researchers from tech labs in Delhi NCR.'
    ],
  },
  'empowering-women-in-engineering-roadmap': {
    id: 's2',
    title: 'Empowering Women in Engineering: WIE MAIT 2026 Roadmap',
    slug: 'empowering-women-in-engineering-roadmap',
    type: PublicationType.ARTICLE,
    author: 'WIE Student Chair',
    authorRole: 'WIE Affinity Group Chair',
    publishedDate: 'JUL 25, 2026',
    readingTime: '4 min read',
    unit: 'WIE Affinity Group',
    excerpt: 'An overview of upcoming mentorship programs, scholarship opportunities, and community outreach initiatives planned for the current academic year.',
    content: [
      'The IEEE Women in Engineering (WIE) Affinity Group at MAIT is proud to release its operational roadmap for the 2026-27 academic term.',
      'Key initiatives include the "STEM-Forward Mentorship Program" pairing senior engineering students with first-year female undergraduates, along with technical resume reviews and hackathon preparation bootcamps.',
      'We invite all interested students to join our community channels and participate in our upcoming panel discussions and technical workshops.'
    ],
  },
};

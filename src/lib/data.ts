/**
 * @file src/lib/data.ts
 * @description Central strongly-typed data store and data entity definitions for IEEE MAIT Student Branch.
 * 
 * DESIGN PRINCIPLE:
 * This data store acts as the baseline content for the open-source platform.
 * Data structures map 1-to-1 with Payload CMS collection schemas (Person, Event, Achievement,
 * OrganizationUnit, Milestone) to enable seamless CMS ingestion in Phase 3.
 *
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

/**
 * Represents a member of the branch, faculty counselor, executive officer, or lead.
 * Corresponds to the `Person` collection schema in Payload CMS.
 */
export interface Person {
  /** Unique identifier */
  id: string;
  /** Full name of the person */
  name: string;
  /** Organizational title or designation (e.g. 'Branch Counselor', 'Chairperson', 'Webmaster') */
  role: string;
  /** Role hierarchy category for visual scaling on the People page */
  category: 'mentor' | 'sec' | 'lead' | 'chapter';
  /** Academic branch/department (e.g. 'Department of ECE', '3rd Year, CSE') */
  department: string;
  /** Academic term year (e.g. '2025–26') */
  academicYear: string;
  /** Cloudinary or relative URL for portrait photo */
  imageSrc?: string;
  /** Professional LinkedIn profile link */
  linkedIn?: string;
  /** Short bio or summary */
  bio?: string;
}

/**
 * Represents an upcoming or historical event organized by the branch or chapters.
 * Corresponds to the `Event` collection schema in Payload CMS.
 */
export interface EventItem {
  /** Unique identifier */
  id: string;
  /** Event title */
  title: string;
  /** URL-friendly slug */
  slug: string;
  /** Formatted date string (e.g. 'AUG 20, 2026') */
  date: string;
  /** Time range (e.g. '2:00 PM – 5:00 PM') */
  time?: string;
  /** Physical campus location or online platform link */
  venue: string;
  /** Full name of the organizing unit */
  unit: 'IEEE MAIT SB' | 'WIE Affinity Group' | 'IEEE EDS Chapter';
  /** Short identifier matching chapter slug */
  unitSlug: 'sb' | 'wie' | 'eds';
  /** Category classification */
  category: 'Technical Workshop' | 'Panel Discussion' | 'Branch Event' | 'Flagship Event' | 'Competition';
  /** Lifecycle status of event */
  status: 'upcoming' | 'past';
  /** Rich text description or summary */
  description: string;
  /** Cover image or poster URL */
  imageSrc?: string;
  /** Guest speakers or workshop facilitators */
  speakers?: Array<{ name: string; title: string; organization: string }>;
  /** Timeline breakdown of event agenda */
  schedule?: Array<{ time: string; activity: string }>;
}

/**
 * Represents an award, hackathon win, or institutional recognition earned by the branch.
 * Corresponds to the `Achievement` collection schema in Payload CMS.
 */
export interface AchievementItem {
  /** Unique identifier */
  id: string;
  /** Year conferred */
  year: string;
  /** Official title of award or achievement */
  title: string;
  /** Awarding organization (e.g. 'IEEE Delhi Section', 'National Tech Summit') */
  conferredBy: string;
  /** Associated branch unit or student team */
  unitOrTeam: string;
  /** Category classification */
  category: 'IEEE Recognition' | 'Competition' | 'Award' | 'Research';
  /** Extended details or description */
  description?: string;
}

/**
 * Represents an autonomous chapter or affinity group (e.g. WIE, EDS).
 * Corresponds to the `OrganizationUnit` collection schema in Payload CMS.
 */
export interface ChapterItem {
  /** Unique identifier */
  id: string;
  /** Display name of unit */
  name: string;
  /** URL-friendly slug matching `/chapters/[slug]` */
  slug: string;
  /** Classification type */
  type: 'Affinity Group' | 'Technical Chapter';
  /** Global IEEE parent society */
  parentSociety: string;
  /** Year established at MAIT */
  establishedYear: string;
  /** Overview summary */
  description: string;
  /** Detailed mission statement */
  mission: string;
  /** Current member count */
  memberCount: string;
  /** Total events organized */
  eventCount: string;
  /** Current student lead name */
  leaderName: string;
  /** Current student lead role title */
  leaderRole: string;
}

/**
 * Represents a historical milestone entry in the institutional timeline.
 * Corresponds to the `Milestone` collection schema in Payload CMS.
 */
export interface MilestoneItem {
  /** Milestone year */
  year: string;
  /** Title of milestone */
  title: string;
  /** Detailed description */
  description: string;
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
};

/**
 * Master catalog of active chapters and affinity groups.
 */
export const CHAPTERS_DATA: Record<string, ChapterItem> = {
  wie: {
    id: 'wie',
    name: 'WIE Affinity Group',
    slug: 'wie',
    type: 'Affinity Group',
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
    type: 'Technical Chapter',
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
    unit: 'IEEE EDS Chapter',
    unitSlug: 'eds',
    category: 'Technical Workshop',
    status: 'upcoming',
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
    unit: 'WIE Affinity Group',
    unitSlug: 'wie',
    category: 'Panel Discussion',
    status: 'upcoming',
    description: 'An inspiring panel discussion featuring female engineering leaders, researchers, and alumni discussing career navigation, technical leadership, and mentorship.',
  },
  {
    id: '3',
    title: 'Annual Branch Orientation & Membership Drive',
    slug: 'branch-orientation-2026',
    date: 'SEP 15, 2026',
    time: '11:00 AM – 1:00 PM',
    venue: 'Main Auditorium',
    unit: 'IEEE MAIT SB',
    unitSlug: 'sb',
    category: 'Branch Event',
    status: 'upcoming',
    description: 'Orientation session for 1st & 2nd year students introducing IEEE benefits, student branch project teams, upcoming workshops, and executive committee onboarding.',
  },
  {
    id: '4',
    title: 'IEEE Day 2025 Flagship Technical Exhibition',
    slug: 'ieee-day-2025-celebration',
    date: 'OCT 07, 2025',
    venue: 'MAIT Campus Courtyard',
    unit: 'IEEE MAIT SB',
    unitSlug: 'sb',
    category: 'Flagship Event',
    status: 'past',
    description: 'Annual IEEE Day celebration featuring hardware project showcases, technical poster competitions, alumni networking, and keynotes.',
  },
  {
    id: '5',
    title: 'Hands-on Workshop on PCB Design & Soldering',
    slug: 'pcb-design-workshop',
    date: 'AUG 12, 2025',
    venue: 'ECE Hardware Lab',
    unit: 'IEEE EDS Chapter',
    unitSlug: 'eds',
    category: 'Technical Workshop',
    status: 'past',
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
    category: 'IEEE Recognition',
    description: 'Recognized for outstanding event organization, student retention, and institutional continuity across the Delhi Section.',
  },
  {
    id: 'a2',
    year: '2025',
    title: 'First Place — National Robotics & Hardware Hackathon',
    conferredBy: 'National Tech Summit',
    unitOrTeam: 'EDS Student Team',
    category: 'Competition',
    description: 'Awarded 1st place among 120+ teams for autonomous obstacle-avoidance rover prototype built using custom embedded systems.',
  },
  {
    id: 'a3',
    year: '2024',
    title: 'Best Technical Event Organization Award',
    conferredBy: 'IEEE Delhi Section Student Activities',
    unitOrTeam: 'WIE Affinity Group',
    category: 'Award',
    description: 'Conferred for organizing impactful technical workshops and mentorship sessions for women in engineering.',
  },
  {
    id: 'a4',
    year: '2023',
    title: 'Outstanding Student Branch Counselor Recognition',
    conferredBy: 'IEEE Region 10',
    unitOrTeam: 'Faculty Mentors',
    category: 'Award',
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

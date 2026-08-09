/**
 * @file src/payload.config.ts
 * @description Master Payload CMS 3.x configuration defining database schemas, PostgreSQL connection, and auth policies.
 * 
 * DESIGN PRINCIPLE:
 * Bundles code-first TypeScript collection definitions:
 * - People (Branch Counsellor, Student Mentors, SEC, Operational Leads, Chapter Executives)
 * - Events (Workshops, Seminars, Competitions)
 * - Achievements (Awards, Hackathon wins)
 * - OrganizationUnits (WIE Affinity Group, EDS Chapter)
 * - Stories (Articles, Post-mortems)
 * - Galleries (Photo Albums)
 * - SiteSettings Global (Announcement Banners & Stats)
 * 
 * DATABASE BINDING:
 * Connects to Neon Serverless PostgreSQL database via `process.env.DATABASE_URI`.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { PeopleCollection } from './payload/collections/People';
import { EventsCollection } from './payload/collections/Events';
import { AchievementsCollection } from './payload/collections/Achievements';
import { OrganizationUnitsCollection } from './payload/collections/OrganizationUnits';
import { StoriesCollection } from './payload/collections/Stories';
import { GalleriesCollection } from './payload/collections/Galleries';
import { SiteSettingsGlobal } from './payload/globals/SiteSettings';

export const payloadConfig = {
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- IEEE MAIT Admin',
    },
  },
  db: {
    connectionString: process.env.DATABASE_URI,
  },
  collections: [
    PeopleCollection,
    EventsCollection,
    AchievementsCollection,
    OrganizationUnitsCollection,
    StoriesCollection,
    GalleriesCollection,
  ],
  globals: [
    SiteSettingsGlobal,
  ],
  secret: process.env.PAYLOAD_SECRET || 'ieee-mait-secret-development-key-2026',
};

export default payloadConfig;

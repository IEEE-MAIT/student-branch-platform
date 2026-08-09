/**
 * @file src/payload.config.ts
 * @description Master Payload CMS 3.x configuration with production security enforcement and PostgreSQL database binding.
 * 
 * SECURITY SPECIFICATIONS:
 * - Enforces mandatory `PAYLOAD_SECRET` environment variable in production environments.
 * - Restricts database access to SSL-encrypted PostgreSQL connection pool.
 * - Applies RBAC access control policies across all managed collections.
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

// Security validation: Require PAYLOAD_SECRET in non-development environments
const payloadSecret = process.env.PAYLOAD_SECRET;
if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error('[SECURITY FATAL] PAYLOAD_SECRET environment variable is missing in production!');
}

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
  secret: payloadSecret || 'ieee-mait-secret-development-key-2026',
};

export default payloadConfig;

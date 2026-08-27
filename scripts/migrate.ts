// @ts-nocheck
/**
 * @file scripts/migrate.ts
 * @description Safe incremental schema migration runner for IEEE MAIT Neon PostgreSQL Database.
 * 
 * Applies all Phase 1 schema changes idempotently using ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load variables from .env and .dev.vars
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URI || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL ERROR: DIRECT_URL, DATABASE_URI or DATABASE_URL is not set in environment.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

export async function runMigration() {
  console.log('Connecting to Neon PostgreSQL database to apply migrations...');
  const client = await pool.connect();

  try {
    console.log('--- 1. RBAC Tables ---');
    // AdminRole
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_roles (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "permissions" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "isSystem" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "admin_roles_name_key" ON admin_roles("name");`);

    // AdminUser
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "roleId" TEXT,
        "customPermissions" JSONB,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "lastLoginAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdBy" TEXT,
        CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "admin_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES admin_roles("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON admin_users("email");`);

    // Legacy Officers table (backward compatibility)
    await client.query(`
      CREATE TABLE IF NOT EXISTS officers (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT,
        "category" TEXT,
        "createdAt" TEXT,
        "createdBy" TEXT,
        CONSTRAINT "officers_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "officers_email_key" ON officers("email");`);

    console.log('--- 2. Core Content & Relational Tables ---');
    // Roles (Organizational Positions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "hierarchy" INTEGER NOT NULL DEFAULT 1,
        "category" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "roles_title_key" ON roles("title");`);

    // Academic Years
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic_years (
        "id" TEXT NOT NULL,
        "label" TEXT NOT NULL,
        "startDate" TEXT,
        "endDate" TEXT,
        "isCurrent" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "academic_years_label_key" ON academic_years("label");`);

    // People
    await client.query(`
      CREATE TABLE IF NOT EXISTS people (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "department" TEXT,
        "academicYear" TEXT,
        "hierarchy" INTEGER NOT NULL DEFAULT 10,
        "category" TEXT,
        "imageUrl" TEXT,
        "email" TEXT,
        "linkedIn" TEXT,
        "github" TEXT,
        "bio" TEXT,
        "isFacultyAdvisor" BOOLEAN NOT NULL DEFAULT false,
        "facultyDepartment" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "people_pkey" PRIMARY KEY ("id")
      );
    `);
    // Alter existing people table safely
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "email" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "linkedIn" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "github" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "bio" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "isFacultyAdvisor" BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "facultyDepartment" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE people ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Chapters
    await client.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "parentSociety" TEXT,
        "establishedYear" TEXT,
        "description" TEXT,
        "mission" TEXT,
        "tagline" TEXT,
        "logoUrl" TEXT,
        "coverImageUrl" TEXT,
        "accentColor" TEXT,
        "instagramUrl" TEXT,
        "linkedinUrl" TEXT,
        "githubUrl" TEXT,
        "leaderName" TEXT,
        "leaderRole" TEXT,
        "leaderId" TEXT,
        "memberCount" INTEGER NOT NULL DEFAULT 0,
        "eventCount" INTEGER NOT NULL DEFAULT 0,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "chapters_slug_key" ON chapters("slug");`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "tagline" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "accentColor" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "githubUrl" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "leaderName" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "leaderRole" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "leaderId" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "memberCount" INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "eventCount" INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // SIGs
    await client.query(`
      CREATE TABLE IF NOT EXISTS sigs (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "leadId" TEXT,
        "memberCount" INTEGER NOT NULL DEFAULT 0,
        "accentColor" TEXT,
        "logoUrl" TEXT,
        "coverImageUrl" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "sigs_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "sigs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES people("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "sigs_slug_key" ON sigs("slug");`);

    // SIG Memberships
    await client.query(`
      CREATE TABLE IF NOT EXISTS sig_memberships (
        "id" TEXT NOT NULL,
        "sigId" TEXT NOT NULL,
        "personId" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'Member',
        "isCurrent" BOOLEAN NOT NULL DEFAULT true,
        "joinedAt" TIMESTAMP(3),
        CONSTRAINT "sig_memberships_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "sig_memberships_sigId_fkey" FOREIGN KEY ("sigId") REFERENCES sigs("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "sig_memberships_personId_fkey" FOREIGN KEY ("personId") REFERENCES people("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "sig_memberships_sigId_personId_key" ON sig_memberships("sigId", "personId");`);

    // Organization Memberships
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_memberships (
        "id" TEXT NOT NULL,
        "personId" TEXT NOT NULL,
        "roleId" TEXT NOT NULL,
        "academicYearId" TEXT NOT NULL,
        "chapterId" TEXT,
        "startDate" TEXT,
        "endDate" TEXT,
        "isCurrent" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "organization_memberships_personId_fkey" FOREIGN KEY ("personId") REFERENCES people("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "organization_memberships_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES roles("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "organization_memberships_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES academic_years("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "organization_memberships_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES chapters("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    // Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TEXT,
        "endDate" TEXT,
        "time" TEXT,
        "venue" TEXT,
        "unit" TEXT,
        "unitSlug" TEXT,
        "category" TEXT,
        "eventType" TEXT,
        "status" TEXT,
        "isLive" BOOLEAN NOT NULL DEFAULT false,
        "description" TEXT,
        "imageSrc" TEXT,
        "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "registrationLink" TEXT,
        "vtoolsLink" TEXT,
        "liveLink" TEXT,
        "virtualLink" TEXT,
        "galleryId" TEXT,
        "storyId" TEXT,
        "chapterId" TEXT,
        "academicYearId" TEXT,
        "sigId" TEXT,
        "workflowStatus" TEXT NOT NULL DEFAULT 'Published',
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "events_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_key" ON events("slug");`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "endDate" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "eventType" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "isLive" BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "vtoolsLink" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "liveLink" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "virtualLink" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "galleryId" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "storyId" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "chapterId" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "sigId" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "workflowStatus" TEXT DEFAULT 'Published';`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Event Resources
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_resources (
        "id" TEXT NOT NULL,
        "eventId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "fileUrl" TEXT,
        "isPublic" BOOLEAN NOT NULL DEFAULT true,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "event_resources_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "event_resources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES events("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Achievements
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        "id" TEXT NOT NULL,
        "year" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "conferredBy" TEXT,
        "unitOrTeam" TEXT,
        "category" TEXT,
        "achievementType" TEXT DEFAULT 'Branch',
        "description" TEXT,
        "imageSrc" TEXT,
        "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "chapterId" TEXT,
        "eventId" TEXT,
        "academicYearId" TEXT,
        "sigId" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "achievementType" TEXT DEFAULT 'Branch';`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "chapterId" TEXT;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "eventId" TEXT;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "sigId" TEXT;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Achievement Tags
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievement_tags (
        "id" TEXT NOT NULL,
        "achievementId" TEXT NOT NULL,
        "tag" TEXT NOT NULL,
        CONSTRAINT "achievement_tags_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "achievement_tags_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES achievements("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "achievement_tags_achievementId_tag_key" ON achievement_tags("achievementId", "tag");`);

    // Achievement People Join Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievement_people (
        "achievementId" TEXT NOT NULL,
        "personId" TEXT NOT NULL,
        CONSTRAINT "achievement_people_pkey" PRIMARY KEY ("achievementId", "personId"),
        CONSTRAINT "achievement_people_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES achievements("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "achievement_people_personId_fkey" FOREIGN KEY ("personId") REFERENCES people("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Stories / Publications
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "authorId" TEXT,
        "category" TEXT NOT NULL,
        "publicationType" TEXT,
        "excerpt" TEXT NOT NULL,
        "contentHtml" TEXT NOT NULL,
        "imageUrl" TEXT,
        "pdfUrl" TEXT,
        "externalLink" TEXT,
        "chapterId" TEXT,
        "workflowStatus" TEXT NOT NULL DEFAULT 'Published',
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "stories_slug_key" ON stories("slug");`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "authorId" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "publicationType" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "externalLink" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "chapterId" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "workflowStatus" TEXT DEFAULT 'Published';`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Galleries
    await client.query(`
      CREATE TABLE IF NOT EXISTS galleries (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "coverImage" TEXT NOT NULL,
        "imageCount" INTEGER NOT NULL DEFAULT 0,
        "description" TEXT,
        "chapterId" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "galleries_slug_key" ON galleries("slug");`);
    await client.query(`ALTER TABLE galleries ADD COLUMN IF NOT EXISTS "chapterId" TEXT;`);
    await client.query(`ALTER TABLE galleries ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE galleries ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE galleries ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE galleries ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Gallery Photos
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_photos (
        "id" TEXT NOT NULL,
        "galleryId" TEXT NOT NULL,
        "caption" TEXT NOT NULL,
        "url" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "gallery_photos_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES galleries("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.query(`ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Projects
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "description" TEXT,
        "githubUrl" TEXT,
        "demoUrl" TEXT,
        "coverImage" TEXT,
        "chapterId" TEXT,
        "sigId" TEXT,
        "year" TEXT NOT NULL,
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "status" TEXT NOT NULL DEFAULT 'Ongoing',
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "workflowStatus" TEXT NOT NULL DEFAULT 'Published',
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_key" ON projects("slug");`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "sigId" TEXT;`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'Ongoing';`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "workflowStatus" TEXT DEFAULT 'Published';`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Initiatives
    await client.query(`
      CREATE TABLE IF NOT EXISTS initiatives (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Active',
        "chapterId" TEXT,
        "iconName" TEXT,
        "targetAudience" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "initiatives_slug_key" ON initiatives("slug");`);
    await client.query(`ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Milestones
    await client.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        "id" TEXT NOT NULL,
        "year" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "category" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "sourceEventId" TEXT,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS "sourceEventId" TEXT;`);
    await client.query(`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Resources
    await client.query(`
      CREATE TABLE IF NOT EXISTS resources (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "fileUrl" TEXT,
        "publishedDate" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'published',
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;`);
    await client.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Opportunities
    await client.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "deadline" TEXT,
        "deadlineDate" TIMESTAMP(3),
        "organisation" TEXT,
        "eligibility" TEXT,
        "link" TEXT,
        "status" TEXT NOT NULL DEFAULT 'Active',
        "category" TEXT NOT NULL,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "opportunities_slug_key" ON opportunities("slug");`);

    // Banners
    await client.query(`
      CREATE TABLE IF NOT EXISTS banners (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "subtitle" TEXT,
        "imageUrl" TEXT NOT NULL,
        "linkHref" TEXT,
        "linkText" TEXT,
        "expiresAt" TIMESTAMP(3),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "deletedAt" TIMESTAMP(3),
        "deletedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
      );
    `);

    // Social Links
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        "id" TEXT NOT NULL,
        "entity" TEXT NOT NULL DEFAULT 'Branch',
        "platform" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "handle" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
      );
    `);

    // Content Workflows
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_workflows (
        "id" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Draft',
        "updatedBy" TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "comments" TEXT,
        CONSTRAINT "content_workflows_pkey" PRIMARY KEY ("id")
      );
    `);

    // Site Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        "id" TEXT NOT NULL,
        "announcementMessage" TEXT,
        "announcementLinkText" TEXT,
        "announcementLinkHref" TEXT,
        "announcementActive" BOOLEAN NOT NULL DEFAULT true,
        "donateUrl" TEXT,
        "recycleBinRetentionDays" INTEGER NOT NULL DEFAULT 30,
        CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "donateUrl" TEXT;`);
    await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "recycleBinRetentionDays" INTEGER DEFAULT 30;`);

    // Audit Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        "id" TEXT NOT NULL,
        "timestamp" TEXT NOT NULL,
        "performedBy" TEXT NOT NULL,
        "userEmail" TEXT,
        "actionType" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT,
        "entityTitle" TEXT,
        "changeSummary" TEXT,
        "details" JSONB,
        "ipAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "userEmail" TEXT;`);
    await client.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "entityId" TEXT;`);
    await client.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "details" JSONB;`);
    await client.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;`);
    await client.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`);

    // Inquiries (Contact Form Submissions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Unread',
        "createdAt" TEXT NOT NULL,
        CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ PostgreSQL Schema Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}

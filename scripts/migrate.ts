import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load variables from .dev.vars
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URI) {
  console.error('FATAL ERROR: DATABASE_URI is not set in .dev.vars');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URI });

async function migrate() {
  console.log('Connecting to Neon via HTTP/WebSocket to create tables...');
  const client = await pool.connect();

  try {
    console.log('Creating events table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TEXT,
        "time" TEXT,
        "venue" TEXT,
        "unit" TEXT,
        "unitSlug" TEXT,
        "category" TEXT,
        "status" TEXT,
        "description" TEXT,
        "imageSrc" TEXT,
        "registrationLink" TEXT,
        CONSTRAINT "events_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_key" ON events("slug");
    `);

    console.log('Creating achievements table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        "id" TEXT NOT NULL,
        "year" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "conferredBy" TEXT,
        "unitOrTeam" TEXT,
        "category" TEXT,
        "description" TEXT,
        CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('Creating site_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        "id" TEXT NOT NULL,
        "announcementMessage" TEXT,
        "announcementLinkText" TEXT,
        "announcementLinkHref" TEXT,
        "announcementActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('Creating officers table...');
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
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "officers_email_key" ON officers("email");
    `);

    console.log('Creating audit_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        "id" TEXT NOT NULL,
        "timestamp" TEXT NOT NULL,
        "performedBy" TEXT NOT NULL,
        "actionType" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityTitle" TEXT,
        "changeSummary" TEXT,
        CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('Creating chapters table...');
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
        "leaderName" TEXT,
        "leaderRole" TEXT,
        "memberCount" INTEGER NOT NULL DEFAULT 0,
        "eventCount" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "chapters_slug_key" ON chapters("slug");`);

    console.log('Creating stories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "contentHtml" TEXT NOT NULL,
        "imageUrl" TEXT,
        CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "stories_slug_key" ON stories("slug");`);

    console.log('Creating galleries table...');
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
        CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "galleries_slug_key" ON galleries("slug");`);

    console.log('Creating gallery_photos table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_photos (
        "id" TEXT NOT NULL,
        "galleryId" TEXT NOT NULL,
        "caption" TEXT NOT NULL,
        "url" TEXT,
        CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "gallery_photos_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES galleries("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log('Creating people table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS people (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "department" TEXT,
        "academicYear" TEXT,
        "hierarchy" TEXT NOT NULL,
        "category" TEXT,
        "imageUrl" TEXT,
        CONSTRAINT "people_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ Tables created successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
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
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

import { EVENTS_DATA, ACHIEVEMENTS_DATA } from '../src/lib/data';
import { OFFICERS_STORE } from '../src/lib/officers';

async function seed() {
  console.log('Connected to Neon Postgres via Prisma ORM.');

  try {
    // 1. SEED EVENTS
    console.log('Seeding Events...');
    for (const event of EVENTS_DATA) {
      await prisma.event.upsert({
        where: { slug: event.slug },
        update: {},
        create: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          date: event.date,
          time: event.time || null,
          venue: event.venue,
          unit: event.unit,
          unitSlug: event.unitSlug,
          category: event.category,
          status: event.status,
          description: event.description || '',
          imageSrc: event.imageSrc || null,
          registrationLink: event.registrationLink || null,
        }
      });
    }

    // 2. SEED ACHIEVEMENTS
    console.log('Seeding Achievements...');
    for (const ach of ACHIEVEMENTS_DATA) {
      await prisma.achievement.upsert({
        where: { id: ach.id },
        update: {},
        create: {
          id: ach.id,
          year: ach.year,
          title: ach.title,
          conferredBy: ach.conferredBy,
          unitOrTeam: ach.unitOrTeam,
          category: ach.category,
          description: ach.description || '',
        }
      });
    }

    // 3. SEED OFFICERS
    console.log('Seeding Officers...');
    for (const off of OFFICERS_STORE) {
      await prisma.officer.upsert({
        where: { email: off.email.toLowerCase() },
        update: {},
        create: {
          id: off.id,
          name: off.name,
          email: off.email.toLowerCase(),
          password: off.password,
          role: off.role,
          category: off.category,
          createdAt: off.createdAt,
          createdBy: off.createdBy,
        }
      });
    }

    // 4. INITIAL SITE SETTINGS
    console.log('Seeding Site Settings...');
    await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {},
      create: {
        id: 'global',
        announcementMessage: 'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
        announcementLinkText: 'Register Now →',
        announcementLinkHref: '/join',
        announcementActive: true,
      }
    });

    console.log('✅ Database successfully seeded with Prisma!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

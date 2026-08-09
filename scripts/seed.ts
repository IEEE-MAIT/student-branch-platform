import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { EVENTS_DATA, ACHIEVEMENTS_DATA, CHAPTERS_DATA, STORIES_DATA, GALLERY_ALBUMS_DATA } from '../src/lib/data';
import { OFFICERS_STORE } from '../src/lib/officers';

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

    console.log('Seeding Chapters...');
    const chaptersArray = Object.values(CHAPTERS_DATA);
    for (const chap of chaptersArray) {
      await prisma.chapter.upsert({
        where: { slug: chap.slug },
        update: {},
        create: {
          id: chap.id,
          name: chap.name,
          slug: chap.slug,
          type: chap.type,
          parentSociety: chap.parentSociety,
          establishedYear: chap.establishedYear,
          description: chap.description,
          mission: (chap as any).mission || null,
          leaderName: (chap as any).leaderName || null,
          leaderRole: (chap as any).leaderRole || null,
          memberCount: parseInt(String(chap.memberCount).replace(/\D/g, ''), 10) || 0,
          eventCount: parseInt(String(chap.eventCount).replace(/\D/g, ''), 10) || 0
        }
      });
    }

    console.log('Seeding Stories...');
    const storiesArray = Object.values(STORIES_DATA);
    for (const story of storiesArray) {
      await prisma.story.upsert({
        where: { slug: story.slug },
        update: {},
        create: {
          id: story.id,
          title: story.title,
          slug: story.slug,
          date: story.publishedDate,
          author: story.author,
          category: story.type,
          excerpt: story.excerpt,
          contentHtml: story.content.map((p: string) => `<p>${p}</p>`).join(''),
          imageUrl: null
        }
      });
    }

    console.log('Seeding Galleries & Photos...');
    const galleriesArray = Object.values(GALLERY_ALBUMS_DATA);
    for (const gal of galleriesArray) {
      await prisma.gallery.upsert({
        where: { slug: gal.slug },
        update: {},
        create: {
          id: gal.id,
          title: gal.title,
          slug: gal.slug,
          date: gal.date,
          category: gal.unit,
          coverImage: gal.coverUrl || (gal.photos && gal.photos.length > 0 ? gal.photos[0].url : ''),
          imageCount: gal.photoCount,
          description: gal.description
        }
      });
      // Seed photos for this gallery
      for (const photo of gal.photos) {
        await prisma.galleryPhoto.upsert({
          where: { id: photo.id },
          update: {},
          create: {
            id: photo.id,
            galleryId: gal.id,
            caption: photo.caption,
            url: photo.url || null
          }
        });
      }
    }

    console.log('Seeding People...');
    // The previous people data was completely hardcoded in the HTML! 
    // We will seed the basic structure here based on the HTML.
    const peopleSeed = [
      { id: '1', name: 'Dr. Faculty Counselor', role: 'Branch Counsellor', department: 'Department of Electronics & Communication Engineering', academicYear: '2025–26', hierarchy: 'mentor', category: 'Counsellor' },
      { id: '2', name: 'Chairperson Name', role: 'Chairperson', department: '3rd Year, CSE', academicYear: '2025–26', hierarchy: 'featured', category: 'SEC' },
      { id: '3', name: 'Webmaster Lead', role: 'Webmaster', department: '3rd Year, CSE', academicYear: '2025–26', hierarchy: 'compact', category: 'Web' }
    ];
    for (const person of peopleSeed) {
      await prisma.person.upsert({
        where: { id: person.id },
        update: {},
        create: person
      });
    }

    console.log('✅ Database successfully seeded with Prisma!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

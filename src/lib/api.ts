/**
 * @file src/lib/api.ts
 * @description Dynamic Data Fetching Engine for IEEE MAIT Student Branch platform.
 * 
 * Uses Prisma ORM during SSR for edge-compatible data fetching without HTTP latency.
 * Wraps DB calls with safe exception handling to ensure serverless pages degrade gracefully.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import {
  EVENTS_DATA,
  CHAPTERS_DATA,
  STORIES_DATA,
  GALLERY_ALBUMS_DATA,
} from './data';
import { prisma } from './db';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export async function getDynamicEventBySlug(slug: string) {
  if (typeof window !== 'undefined') return EVENTS_DATA.find((e) => e.slug === slug) || null;
  try {
    const dbEvent = await prisma.event.findUnique({ where: { slug } });
    if (dbEvent) {
      let speakers = dbEvent.imageSrc ? dbEvent.description : null; // safe check
      try {
        if (typeof dbEvent.description === 'string' && dbEvent.description.startsWith('[')) {
          // optional parsing
        }
      } catch (e) {}
      return dbEvent;
    }
  } catch (e) {
    console.warn(`Failed to fetch event ${slug} from DB`, e);
  }
  return EVENTS_DATA.find((e) => e.slug === slug) || null;
}

export async function getDynamicEvents(): Promise<any[]> {
  if (typeof window === 'undefined') {
    try {
      return await prisma.event.findMany({ orderBy: { date: 'desc' } });
    } catch (e) {
      console.warn('Failed to fetch events from DB', e);
      return [];
    }
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/events`, { next: { revalidate: 60 } });
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
}

export async function getDynamicAchievements(): Promise<any[]> {
  if (typeof window === 'undefined') {
    try {
      return await prisma.achievement.findMany({ orderBy: { year: 'desc' } });
    } catch (e) {
      console.warn('Failed to fetch achievements from DB', e);
      return [];
    }
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/achievements`, { next: { revalidate: 60 } });
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
}

export async function getDynamicChapterBySlug(slug: string) {
  if (typeof window !== 'undefined') return CHAPTERS_DATA[slug] || null;
  try {
    const dbChapter = await prisma.chapter.findUnique({ where: { slug } });
    if (dbChapter) return dbChapter;
  } catch (e) {
    console.warn(`Failed to fetch chapter ${slug} from DB`, e);
  }
  return CHAPTERS_DATA[slug] || null;
}

export async function getDynamicStoryBySlug(slug: string) {
  if (typeof window !== 'undefined') return STORIES_DATA[slug] || null;
  try {
    const dbStory = await prisma.story.findUnique({ where: { slug } });
    if (dbStory) return dbStory;
  } catch (e) {
    console.warn(`Failed to fetch story ${slug} from DB`, e);
  }
  return STORIES_DATA[slug] || null;
}

export async function getDynamicGalleryAlbumBySlug(slug: string) {
  if (typeof window !== 'undefined') return GALLERY_ALBUMS_DATA[slug] || null;
  try {
    const dbGallery = await prisma.gallery.findUnique({ 
      where: { slug },
      include: { photos: true } 
    });
    if (dbGallery) return dbGallery;
  } catch (e) {
    console.warn(`Failed to fetch gallery ${slug} from DB`, e);
  }
  return GALLERY_ALBUMS_DATA[slug] || null;
}

export async function getDynamicStories() {
  if (typeof window !== 'undefined') return Object.values(STORIES_DATA);
  try {
    const dbStories = await prisma.story.findMany({ orderBy: { date: 'desc' } });
    if (dbStories.length > 0) return dbStories;
  } catch (e) {
    console.warn('Failed to fetch stories from DB', e);
  }
  return Object.values(STORIES_DATA);
}

export async function getDynamicGalleries() {
  if (typeof window !== 'undefined') return Object.values(GALLERY_ALBUMS_DATA);
  try {
    const dbGalleries = await prisma.gallery.findMany({ orderBy: { date: 'desc' } });
    if (dbGalleries.length > 0) return dbGalleries;
  } catch (e) {
    console.warn('Failed to fetch galleries from DB', e);
  }
  return Object.values(GALLERY_ALBUMS_DATA);
}

export async function getDynamicChapters() {
  if (typeof window !== 'undefined') return Object.values(CHAPTERS_DATA);
  try {
    const dbChapters = await prisma.chapter.findMany();
    if (dbChapters.length > 0) return dbChapters;
  } catch (e) {
    console.warn('Failed to fetch chapters from DB', e);
  }
  return Object.values(CHAPTERS_DATA);
}

export async function getDynamicPeople() {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.person.findMany({ orderBy: { hierarchy: 'asc' } });
  } catch (e) {
    console.warn('Failed to fetch people from DB', e);
    return [];
  }
}

export async function getDynamicPeopleByAcademicYear(year: string) {
  if (typeof window !== 'undefined') return [];
  try {
    const normalizedYear = year.replace('–', '-');
    const all = await prisma.person.findMany({ orderBy: { hierarchy: 'asc' } });
    return all.filter((p: any) => {
      if (!p.academicYear) return true;
      const pYear = p.academicYear.replace('–', '-');
      return pYear === normalizedYear || p.academicYear === year;
    });
  } catch (e) {
    console.warn('Failed to fetch people by year from DB', e);
    return [];
  }
}

export async function getDynamicSiteSettings() {
  const defaultSettings = {
    announcementMessage: 'Membership Drive 2025–26 is officially open!',
    announcementLinkText: 'Register Now →',
    announcementLinkHref: '/join',
    announcementActive: true,
  };

  if (typeof window === 'undefined') {
    try {
      const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
      if (settings) return settings;
    } catch (e) {
      console.warn('Failed to fetch site_settings from DB', e);
    }
    return defaultSettings;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/site-settings`, { next: { revalidate: 30 } });
    if (res.ok) return await res.json();
  } catch (err) {}
  return defaultSettings;
}

export async function getDynamicMilestones() {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.milestone.findMany({ orderBy: { sortOrder: 'desc' } });
  } catch (e) {
    console.warn('Failed to fetch milestones from DB', e);
    return [];
  }
}

export async function getDynamicResources() {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.resource.findMany({
      where: { status: 'published' },
      orderBy: { publishedDate: 'desc' },
    });
  } catch (e) {
    console.warn('Failed to fetch resources from DB', e);
    return [];
  }
}

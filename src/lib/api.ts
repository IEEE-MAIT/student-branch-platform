/**
 * @file src/lib/api.ts
 * @description Dynamic Data Fetching Engine for IEEE MAIT Student Branch platform.
 * 
 * Uses Prisma ORM during SSR for edge-compatible data fetching without HTTP latency.
 * Employs React cache() to memoize and deduplicate database queries per-request.
 * Ensures soft-deleted records (where deletedAt != null) are strictly excluded from public views.
 * Wraps DB calls with safe exception handling to ensure serverless pages degrade gracefully.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { cache } from 'react';
import {
  EVENTS_DATA,
  CHAPTERS_DATA,
  STORIES_DATA,
  GALLERY_ALBUMS_DATA,
  ACHIEVEMENTS_DATA,
  PEOPLE_DATA,
  PROJECTS_DATA,
  INITIATIVES_DATA,
} from './data';
import { prisma } from './db';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export const getDynamicEventBySlug = cache(async (slug: string) => {
  if (typeof window !== 'undefined') return EVENTS_DATA.find((e) => e.slug === slug) || null;
  try {
    const dbEvent = await prisma.event.findFirst({
      where: { slug, deletedAt: null },
      include: {
        story: true,
        gallery: { include: { photos: { where: { deletedAt: null } } } },
        chapter: true,
        achievements: { where: { deletedAt: null } },
        resources: { where: { deletedAt: null, isPublic: true } },
      },
    });
    if (dbEvent) {
      return dbEvent;
    }
  } catch (e) {
    console.warn(`Failed to fetch event ${slug} from DB`, e);
  }
  return EVENTS_DATA.find((e) => e.slug === slug) || null;
});

export const getDynamicEvents = cache(async (): Promise<any[]> => {
  if (typeof window === 'undefined') {
    try {
      const dbEvents = await prisma.event.findMany({
        where: { deletedAt: null },
        orderBy: { date: 'desc' },
        include: {
          story: true,
          gallery: { include: { photos: { where: { deletedAt: null } } } },
          chapter: true,
          resources: { where: { deletedAt: null, isPublic: true } },
        },
      });
      if (dbEvents && dbEvents.length > 0) return dbEvents;
    } catch (e) {
      console.warn('Failed to fetch events from DB', e);
    }
    return EVENTS_DATA;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/events`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}
  return EVENTS_DATA;
});

export const getDynamicAchievements = cache(async (): Promise<any[]> => {
  if (typeof window === 'undefined') {
    try {
      const dbAchievements = await prisma.achievement.findMany({
        where: { deletedAt: null },
        orderBy: { year: 'desc' },
        include: {
          people: { include: { person: true } },
          tags: true,
          chapter: true,
          event: true,
        },
      });
      if (dbAchievements && dbAchievements.length > 0) return dbAchievements;
    } catch (e) {
      console.warn('Failed to fetch achievements from DB', e);
    }
    return ACHIEVEMENTS_DATA;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/achievements`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}
  return ACHIEVEMENTS_DATA;
});

export const getDynamicAchievementById = cache(async (id: string) => {
  if (typeof window !== 'undefined') {
    return ACHIEVEMENTS_DATA.find((a) => a.id === id) || null;
  }
  try {
    const dbAchievement = await prisma.achievement.findFirst({
      where: { id, deletedAt: null },
      include: {
        people: { include: { person: true } },
        tags: true,
        chapter: true,
        event: true,
      },
    });
    if (dbAchievement) return dbAchievement;
  } catch (e) {
    console.warn(`Failed to fetch achievement ${id} from DB`, e);
  }
  return ACHIEVEMENTS_DATA.find((a) => a.id === id) || null;
});

export const getDynamicChapterBySlug = cache(async (slug: string) => {
  if (typeof window !== 'undefined') return CHAPTERS_DATA[slug] || null;
  try {
    const dbChapter = await prisma.chapter.findFirst({
      where: { slug, deletedAt: null },
      include: {
        leader: true,
        events: { where: { deletedAt: null }, orderBy: { date: 'desc' } },
        achievements: { where: { deletedAt: null }, orderBy: { year: 'desc' } },
        stories: { where: { deletedAt: null }, orderBy: { date: 'desc' } },
        galleries: { where: { deletedAt: null }, orderBy: { date: 'desc' } },
        projects: { where: { deletedAt: null }, orderBy: { year: 'desc' } },
        initiatives: { where: { deletedAt: null } },
      },
    });
    if (dbChapter) return dbChapter;
  } catch (e) {
    console.warn(`Failed to fetch chapter ${slug} from DB`, e);
  }
  return CHAPTERS_DATA[slug] || null;
});

export const getDynamicChapterMemberships = cache(async (chapterId: string): Promise<any[]> => {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.organizationMembership.findMany({
      where: { chapterId, isCurrent: true },
      include: {
        person: true,
        role: true,
        academicYear: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.warn(`Failed to fetch memberships for chapter ${chapterId}`, e);
    return [];
  }
});

export const getDynamicStoryBySlug = cache(async (slug: string) => {
  if (typeof window !== 'undefined') return STORIES_DATA[slug] || null;
  try {
    const dbStory = await prisma.story.findFirst({
      where: { slug, deletedAt: null },
      include: { chapter: true, authorPerson: true },
    });
    if (dbStory) return dbStory;
  } catch (e) {
    console.warn(`Failed to fetch story ${slug} from DB`, e);
  }
  return STORIES_DATA[slug] || null;
});

export const getDynamicGalleryAlbumBySlug = cache(async (slug: string) => {
  if (typeof window !== 'undefined') return GALLERY_ALBUMS_DATA[slug] || null;
  try {
    const dbGallery = await prisma.gallery.findFirst({
      where: { slug, deletedAt: null },
      include: { photos: { where: { deletedAt: null } } },
    });
    if (dbGallery) return dbGallery;
  } catch (e) {
    console.warn(`Failed to fetch gallery ${slug} from DB`, e);
  }
  return GALLERY_ALBUMS_DATA[slug] || null;
});

export const getDynamicStories = cache(async () => {
  if (typeof window !== 'undefined') return Object.values(STORIES_DATA);
  try {
    const dbStories = await prisma.story.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { chapter: true },
    });
    if (dbStories.length > 0) return dbStories;
  } catch (e) {
    console.warn('Failed to fetch stories from DB', e);
  }
  return Object.values(STORIES_DATA);
});

export const getDynamicGalleries = cache(async () => {
  if (typeof window !== 'undefined') return Object.values(GALLERY_ALBUMS_DATA);
  try {
    const dbGalleries = await prisma.gallery.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { photos: { where: { deletedAt: null } } },
    });
    if (dbGalleries.length > 0) return dbGalleries;
  } catch (e) {
    console.warn('Failed to fetch galleries from DB', e);
  }
  return Object.values(GALLERY_ALBUMS_DATA);
});

export const getDynamicChapters = cache(async () => {
  if (typeof window !== 'undefined') return Object.values(CHAPTERS_DATA);
  try {
    const dbChapters = await prisma.chapter.findMany({
      where: { deletedAt: null },
      include: {
        leader: true,
        projects: { where: { deletedAt: null }, orderBy: { year: 'desc' } },
        initiatives: { where: { deletedAt: null } },
      },
    });
    if (dbChapters.length > 0) {
      const order = ['sb', 'eds', 'wie'];
      return dbChapters.sort((a: any, b: any) => {
        const idxA = order.indexOf(a.slug);
        const idxB = order.indexOf(b.slug);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
    }
  } catch (e) {
    console.warn('Failed to fetch chapters from DB', e);
  }
  return Object.values(CHAPTERS_DATA);
});

export const getDynamicPeople = cache(async () => {
  if (typeof window !== 'undefined') return PEOPLE_DATA;
  try {
    const activeYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
    const all = await prisma.person.findMany({
      where: { deletedAt: null },
      orderBy: { hierarchy: 'asc' },
      include: { memberships: { include: { academicYear: true } } },
    });
    const currentLabel = activeYear?.label || '2025-26';
    const normalizedCurrent = currentLabel.replace('–', '-');

    const filtered = all.filter((p: any) => {
      if (p.academicYear) {
        const pYear = p.academicYear.replace('–', '-');
        return pYear === normalizedCurrent || p.academicYear === currentLabel;
      }
      if (Array.isArray(p.memberships) && p.memberships.length > 0) {
        return p.memberships.some((m: any) => m.isCurrent || m.academicYear?.isCurrent || m.academicYear?.label === currentLabel);
      }
      return true;
    });
    if (filtered.length > 0) return filtered;
    if (all.length > 0) return all;
  } catch (e) {
    console.warn('Failed to fetch people from DB', e);
  }
  return PEOPLE_DATA;
});

export const getDynamicPeopleByAcademicYear = cache(async (year: string) => {
  if (typeof window !== 'undefined') return PEOPLE_DATA;
  try {
    const normalizedYear = year.replace('–', '-');
    const all = await prisma.person.findMany({
      where: { deletedAt: null },
      orderBy: { hierarchy: 'asc' },
      include: { memberships: { include: { academicYear: true } } },
    });
    const filtered = all.filter((p: any) => {
      if (p.academicYear) {
        const pYear = p.academicYear.replace('–', '-');
        if (pYear === normalizedYear || p.academicYear === year) return true;
      }
      if (Array.isArray(p.memberships) && p.memberships.length > 0) {
        return p.memberships.some((m: any) => {
          if (m.academicYear?.label) {
            const mYear = m.academicYear.label.replace('–', '-');
            return mYear === normalizedYear || m.academicYear.label === year;
          }
          return false;
        });
      }
      return false;
    });
    if (filtered.length > 0) return filtered;
  } catch (e) {
    console.warn('Failed to fetch people by year from DB', e);
  }
  return PEOPLE_DATA;
});

export const getDynamicSiteSettings = cache(async () => {
  const defaultSettings = {
    announcementMessage: 'Membership Drive 2025–26 is officially open!',
    announcementLinkText: 'Register Now →',
    announcementLinkHref: '/join',
    announcementActive: true,
    donateUrl: 'https://www.ieee.org/membership/join/index.html',
    recycleBinRetentionDays: 30,
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
});

export const getDynamicMilestones = cache(async () => {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.milestone.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'desc' },
    });
  } catch (e) {
    console.warn('Failed to fetch milestones from DB', e);
    return [];
  }
});

export const getDynamicResources = cache(async () => {
  if (typeof window !== 'undefined') return [];
  try {
    return await prisma.resource.findMany({
      where: { status: 'published', deletedAt: null },
      orderBy: { publishedDate: 'desc' },
    });
  } catch (e) {
    console.warn('Failed to fetch resources from DB', e);
    return [];
  }
});

export const getDynamicProjects = cache(async (chapterIdOrSlug?: string) => {
  if (typeof window !== 'undefined') {
    if (!chapterIdOrSlug) return PROJECTS_DATA;
    return PROJECTS_DATA.filter(
      (p) => p.chapterId === chapterIdOrSlug || p.chapterSlug === chapterIdOrSlug
    );
  }
  try {
    const whereClause: any = { deletedAt: null };
    if (chapterIdOrSlug) {
      whereClause.OR = [
        { chapterId: chapterIdOrSlug },
        { chapter: { slug: chapterIdOrSlug } },
      ];
    }
    const dbProjects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { year: 'desc' },
      include: { chapter: true, sig: true },
    });
    if (dbProjects && dbProjects.length > 0) return dbProjects;
  } catch (e) {
    console.warn('Failed to fetch projects from DB', e);
  }
  if (!chapterIdOrSlug) return PROJECTS_DATA;
  return PROJECTS_DATA.filter(
    (p) => p.chapterId === chapterIdOrSlug || p.chapterSlug === chapterIdOrSlug
  );
});

export const getDynamicProjectBySlug = cache(async (slug: string) => {
  if (typeof window !== 'undefined') return PROJECTS_DATA.find((p) => p.slug === slug) || null;
  try {
    const dbProject = await prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: { chapter: true, sig: true },
    });
    if (dbProject) return dbProject;
  } catch (e) {
    console.warn(`Failed to fetch project ${slug} from DB`, e);
  }
  return PROJECTS_DATA.find((p) => p.slug === slug) || null;
});

export const getDynamicInitiatives = cache(async (chapterIdOrSlug?: string) => {
  if (typeof window !== 'undefined') {
    if (!chapterIdOrSlug) return INITIATIVES_DATA;
    return INITIATIVES_DATA.filter(
      (i) => i.chapterId === chapterIdOrSlug || i.chapterSlug === chapterIdOrSlug
    );
  }
  try {
    const whereClause: any = { deletedAt: null };
    if (chapterIdOrSlug) {
      whereClause.OR = [
        { chapterId: chapterIdOrSlug },
        { chapter: { slug: chapterIdOrSlug } },
      ];
    }
    const dbInitiatives = await prisma.initiative.findMany({
      where: whereClause,
      include: { chapter: true },
    });
    if (dbInitiatives && dbInitiatives.length > 0) return dbInitiatives;
  } catch (e) {
    console.warn('Failed to fetch initiatives from DB', e);
  }
  if (!chapterIdOrSlug) return INITIATIVES_DATA;
  return INITIATIVES_DATA.filter(
    (i) => i.chapterId === chapterIdOrSlug || i.chapterSlug === chapterIdOrSlug
  );
});

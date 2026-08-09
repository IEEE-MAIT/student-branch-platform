/**
 * @file src/lib/api.ts
 * @description Dynamic Data Fetching Engine for IEEE MAIT Student Branch platform.
 * 
 * Uses Prisma ORM during SSR for edge-compatible data fetching without HTTP latency.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import {
  ChapterItem,
  StoryArticle,
  GalleryAlbum,
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
  if (typeof window !== 'undefined') return null;
  return await prisma.chapter.findUnique({ where: { slug } });
}

export async function getDynamicStoryBySlug(slug: string) {
  if (typeof window !== 'undefined') return null;
  return await prisma.story.findUnique({ where: { slug } });
}

export async function getDynamicGalleryAlbumBySlug(slug: string) {
  if (typeof window !== 'undefined') return null;
  return await prisma.gallery.findUnique({ 
    where: { slug },
    include: { photos: true } 
  });
}

export async function getDynamicStories() {
  if (typeof window !== 'undefined') return [];
  return await prisma.story.findMany({ orderBy: { date: 'desc' } });
}

export async function getDynamicGalleries() {
  if (typeof window !== 'undefined') return [];
  return await prisma.gallery.findMany({ orderBy: { date: 'desc' } });
}

export async function getDynamicChapters() {
  if (typeof window !== 'undefined') return [];
  return await prisma.chapter.findMany();
}

export async function getDynamicPeople() {
  if (typeof window !== 'undefined') return [];
  return await prisma.person.findMany({ orderBy: { hierarchy: 'asc' } });
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

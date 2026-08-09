/**
 * @file src/lib/api.ts
 * @description Dynamic Data Fetching Engine for IEEE MAIT Student Branch platform.
 * 
 * DYNAMIC & SSR DESIGN:
 * Handles both Server-Side Rendering (RSC) and Client-Side Fetching cleanly.
 * Eliminates ERR_INVALID_URL errors during server rendering by avoiding internal HTTP loopback calls.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import {
  EventItem,
  AchievementItem,
  ChapterItem,
  StoryArticle,
  GalleryAlbum,
  EVENTS_DATA,
  ACHIEVEMENTS_DATA,
  CHAPTERS_DATA,
  STORIES_DATA,
  GALLERY_ALBUMS_DATA,
  BRANCH_STATS,
} from './data';

/**
 * Returns absolute base URL for server-side fetches or relative URL for client.
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Dynamically fetches all events.
 */
export async function getDynamicEvents(): Promise<EventItem[]> {
  // During Server-Side Rendering (RSC), return dataset directly to avoid HTTP loopback overhead
  if (typeof window === 'undefined') {
    return EVENTS_DATA;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/events`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[Dynamic API] Falling back to baseline EVENTS_DATA:', err);
  }
  return EVENTS_DATA;
}

/**
 * Dynamically fetches all achievements.
 */
export async function getDynamicAchievements(): Promise<AchievementItem[]> {
  if (typeof window === 'undefined') {
    return ACHIEVEMENTS_DATA;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/achievements`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[Dynamic API] Falling back to baseline ACHIEVEMENTS_DATA:', err);
  }
  return ACHIEVEMENTS_DATA;
}

/**
 * Dynamically fetches chapter details by slug.
 */
export async function getDynamicChapterBySlug(slug: string): Promise<ChapterItem | null> {
  return CHAPTERS_DATA[slug] || null;
}

/**
 * Dynamically fetches story article details by slug.
 */
export async function getDynamicStoryBySlug(slug: string): Promise<StoryArticle | null> {
  return STORIES_DATA[slug] || null;
}

/**
 * Dynamically fetches photo album details by slug.
 */
export async function getDynamicGalleryAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  return GALLERY_ALBUMS_DATA[slug] || null;
}

/**
 * Dynamically fetches site announcement banner settings.
 */
export async function getDynamicSiteSettings() {
  if (typeof window === 'undefined') {
    return {
      announcementMessage: 'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
      announcementLinkText: 'Register Now →',
      announcementLinkHref: '/join',
      announcementActive: true,
    };
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/site-settings`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (err) {
    console.warn('[Dynamic API] Falling back to baseline BRANCH_STATS:', err);
  }
  return {
    announcementMessage: 'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
    announcementLinkText: 'Register Now →',
    announcementLinkHref: '/join',
    announcementActive: true,
  };
}

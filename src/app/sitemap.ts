import type { MetadataRoute } from 'next';
import {
  getDynamicEvents,
  getDynamicAchievements,
  getDynamicChapters,
  getDynamicPublications,
  getDynamicGalleries,
  getDynamicSIGs,
  getDynamicProjects,
} from '@/lib/api';

/**
 * @file src/app/sitemap.ts
 * @description Dynamic XML Sitemap generator for IEEE MAIT Student Branch platform.
 * 
 * Automatically indexes all static core pages as well as dynamically populated database
 * records (events, chapters, publications, SIGs, projects, photo galleries, achievements).
 * Sets search-engine change frequencies and priority rankings.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeemait.com';

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/ieee`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/impact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chapters`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sigs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/opportunities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/people`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/people/archive`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 2. Fetch Dynamic Database Entities
  try {
    const [
      events,
      chapters,
      publications,
      sigs,
      projects,
      galleries,
      achievements,
    ] = await Promise.all([
      getDynamicEvents().catch(() => []),
      getDynamicChapters().catch(() => []),
      getDynamicPublications().catch(() => []),
      getDynamicSIGs().catch(() => []),
      getDynamicProjects().catch(() => []),
      getDynamicGalleries().catch(() => []),
      getDynamicAchievements().catch(() => []),
    ]);

    const eventRoutes: MetadataRoute.Sitemap = events.map((e: any) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const chapterRoutes: MetadataRoute.Sitemap = chapters.map((c: any) => ({
      url: `${baseUrl}/chapters/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    const publicationRoutes: MetadataRoute.Sitemap = publications.map((p: any) => ({
      url: `${baseUrl}/publications/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    const sigRoutes: MetadataRoute.Sitemap = sigs.map((s: any) => ({
      url: `${baseUrl}/sigs/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p: any) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const galleryRoutes: MetadataRoute.Sitemap = galleries.map((g: any) => ({
      url: `${baseUrl}/gallery/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const achievementRoutes: MetadataRoute.Sitemap = achievements.map((a: any) => ({
      url: `${baseUrl}/achievements/${a.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const leadershipYears = ['2025-2026', '2024-2025', '2023-2024'];
    const archiveRoutes: MetadataRoute.Sitemap = leadershipYears.map((year) => ({
      url: `${baseUrl}/people/archive/${year}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...eventRoutes,
      ...chapterRoutes,
      ...publicationRoutes,
      ...sigRoutes,
      ...projectRoutes,
      ...galleryRoutes,
      ...achievementRoutes,
      ...archiveRoutes,
    ];
  } catch (error) {
    console.warn('Sitemap generation encountered database warning:', error);
    return staticRoutes;
  }
}

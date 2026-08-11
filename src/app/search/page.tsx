import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchClient } from './SearchClient';
import { 
  getDynamicEvents, 
  getDynamicAchievements, 
  getDynamicChapters, 
  getDynamicStories, 
  getDynamicPeople, 
  getDynamicGalleries, 
  getDynamicResources 
} from '@/lib/api';
import { prisma } from '@/lib/db';

/**
 * Site-Wide Omni-Search Platform (Server Component)
 * Fetches all searchable content from the database and passes it to the client for instant deferred filtering.
 */
export default async function SearchPage() {
  let events: any[] = [], achievements: any[] = [], chapters: any[] = [], stories: any[] = [], people: any[] = [], galleries: any[] = [], resources: any[] = [];

  try {
    const activeYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
    const currentLabel = activeYear?.label || '2025-26';
    const normalizedCurrent = currentLabel.replace('–', '-');

    [events, achievements, chapters, stories, people, galleries, resources] = await prisma.$transaction([
      prisma.event.findMany({ orderBy: { date: 'desc' } }),
      prisma.achievement.findMany({ orderBy: { year: 'desc' } }),
      prisma.chapter.findMany(),
      prisma.story.findMany({ orderBy: { date: 'desc' } }),
      prisma.person.findMany({
        orderBy: { hierarchy: 'asc' },
        include: { memberships: { include: { academicYear: true } } }
      }),
      prisma.gallery.findMany({ orderBy: { date: 'desc' } }),
      prisma.resource.findMany({
        where: { status: 'published' },
        orderBy: { publishedDate: 'desc' },
      })
    ]);

    people = people.filter((p: any) => {
      if (p.academicYear) {
        const pYear = p.academicYear.replace('–', '-');
        return pYear === normalizedCurrent || p.academicYear === currentLabel;
      }
      if (Array.isArray(p.memberships) && p.memberships.length > 0) {
        return p.memberships.some((m: any) => m.isCurrent || m.academicYear?.isCurrent || m.academicYear?.label === currentLabel);
      }
      return true;
    });
  } catch (err) {
    console.warn("SearchPage DB fetch error, falling back to wrappers:", err);
    [events, achievements, chapters, stories, people, galleries, resources] = await Promise.all([
      getDynamicEvents(),
      getDynamicAchievements(),
      getDynamicChapters(),
      getDynamicStories(),
      getDynamicPeople(),
      getDynamicGalleries(),
      getDynamicResources()
    ]);
  }

  return (
    <>
      <Navbar />
      <SearchClient 
        events={events}
        achievements={achievements}
        chapters={chapters}
        stories={stories}
        people={people}
        galleries={galleries}
        resources={resources}
      />
      <Footer />
    </>
  );
}

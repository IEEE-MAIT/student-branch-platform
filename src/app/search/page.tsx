import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchClient } from './SearchClient';
import { 
  getDynamicEvents, 
  getDynamicAchievements, 
  getDynamicChapters, 
  getDynamicPublications, 
  getDynamicPeople, 
  getDynamicGalleries, 
  getDynamicResources,
  getDynamicProjects,
  getDynamicInitiatives,
  getDynamicSIGs,
  getDynamicOpportunities,
} from '@/lib/api';

/**
 * Site-Wide Omni-Search Platform (Server Component)
 * Fetches all searchable content from the database and passes it to the client for instant deferred filtering.
 */
export default async function SearchPage() {
  const [events, achievements, chapters, stories, people, galleries, resources, projects, initiatives, sigs, opportunities] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    getDynamicChapters(),
    getDynamicPublications(),
    getDynamicPeople(),
    getDynamicGalleries(),
    getDynamicResources(),
    getDynamicProjects(),
    getDynamicInitiatives(),
    getDynamicSIGs(),
    getDynamicOpportunities(),
  ]);

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center font-mono text-xs text-warm-400">Loading search index...</div>}>
        <SearchClient 
          events={events}
          achievements={achievements}
          chapters={chapters}
          stories={stories}
          people={people}
          galleries={galleries}
          resources={resources}
          projects={projects}
          initiatives={initiatives}
          sigs={sigs}
          opportunities={opportunities}
        />
      </Suspense>
      <Footer />
    </>
  );
}

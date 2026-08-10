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

/**
 * Site-Wide Omni-Search Platform (Server Component)
 * Fetches all searchable content from the database and passes it to the client for instant deferred filtering.
 */
export default async function SearchPage() {
  const [events, achievements, chapters, stories, people, galleries, resources] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    getDynamicChapters(),
    getDynamicStories(),
    getDynamicPeople(),
    getDynamicGalleries(),
    getDynamicResources()
  ]);

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

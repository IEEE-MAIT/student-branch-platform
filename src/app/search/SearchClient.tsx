'use client';

import React, { useState, useDeferredValue, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ProjectCard } from '@/components/content/ProjectCard';
import { InitiativeCard } from '@/components/content/InitiativeCard';
import Link from '@/components/ui/AppLink';

export const STATIC_PAGES = [
  { title: 'Home', description: 'Main landing page of the IEEE MAIT Student Branch', url: '/' },
  { title: 'About IEEE MAIT', description: 'Learn about our history, mission, and impact', url: '/about' },
  { title: 'Join IEEE MAIT', description: "Become a member of the world's largest technical professional organization", url: '/join' },
  { title: 'Contact Us', description: 'Get in touch with the IEEE MAIT executive committee', url: '/contact' },
  { title: 'Events & Workshops', description: 'Browse upcoming and past technical workshops and hackathons', url: '/events' },
  { title: 'Achievements Ledger', description: 'Explore awards and recognitions earned by our branch', url: '/achievements' },
  { title: 'Communities & Chapters', description: 'Discover our specialized technical societies and affinity groups', url: '/chapters' },
  { title: 'Stories & Reports', description: 'Read articles, reports, and insights from our community', url: '/stories' },
  { title: 'Photo Gallery', description: 'View visual archives from our past events and initiatives', url: '/gallery' },
  { title: 'People & Leadership', description: 'Meet the executive committee, branch counselors, and active members', url: '/people' },
  { title: 'Leadership Archive', description: 'Historical leadership rosters organized by academic year', url: '/people/archive' },
  { title: 'Resources', description: 'Access branch newsletters, slide decks, and annual activity reports', url: '/resources' },
];

interface SearchClientProps {
  events: any[];
  achievements: any[];
  chapters: any[];
  stories: any[];
  people: any[];
  galleries: any[];
  resources: any[];
  projects?: any[];
  initiatives?: any[];
}

export const SearchClient: React.FC<SearchClientProps> = ({
  events: initialEvents,
  achievements: initialAchievements,
  chapters: initialChapters,
  stories: initialStories,
  people: initialPeople,
  galleries: initialGalleries,
  resources: initialResources,
  projects: initialProjects = [],
  initiatives: initialInitiatives = [],
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) {
      return {
        pages: [],
        events: [],
        achievements: [],
        chapters: [],
        stories: [],
        people: [],
        galleries: [],
        resources: [],
        projects: [],
        initiatives: [],
      };
    }
    const q = deferredQuery.toLowerCase();

    const pages = STATIC_PAGES.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
    const events = initialEvents.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.unit?.toLowerCase().includes(q)
    );
    const achievements = initialAchievements.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.conferredBy?.toLowerCase().includes(q) ||
        a.year?.includes(q) ||
        a.unitOrTeam?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q)
    );
    const chapters = initialChapters.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.tagline?.toLowerCase().includes(q)
    );
    const stories = initialStories.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.excerpt?.toLowerCase().includes(q) ||
        s.author?.toLowerCase().includes(q)
    );
    const people = initialPeople.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
    const galleries = initialGalleries.filter(
      (g) => g.title?.toLowerCase().includes(q) || g.category?.toLowerCase().includes(q)
    );
    const resources = initialResources.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
    const projects = initialProjects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
    const initiatives = initialInitiatives.filter(
      (i) =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.targetAudience?.toLowerCase().includes(q)
    );

    return {
      pages,
      events,
      achievements,
      chapters,
      stories,
      people,
      galleries,
      resources,
      projects,
      initiatives,
    };
  }, [
    deferredQuery,
    initialEvents,
    initialAchievements,
    initialChapters,
    initialStories,
    initialPeople,
    initialGalleries,
    initialResources,
    initialProjects,
    initialInitiatives,
  ]);

  const totalResults =
    searchResults.pages.length +
    searchResults.events.length +
    searchResults.achievements.length +
    searchResults.chapters.length +
    searchResults.stories.length +
    searchResults.people.length +
    searchResults.galleries.length +
    searchResults.resources.length +
    searchResults.projects.length +
    searchResults.initiatives.length;

  return (
    <main className="flex-1 py-16 sm:py-24 bg-white min-h-screen page-enter">
      <Container size="default">
        <SectionHeading
          category="Site-Wide Index"
          title="Omni-Search Platform"
          subtitle="Instant cross-platform search across technical events, chapter sub-portals, leadership records, hardware projects, and research publications."
        />

        <div className="max-w-3xl mb-10 relative z-10 group">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-warm-400 group-focus-within:text-ieee-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, hardware projects, awards, people, or resources..."
              className="w-full pl-12 pr-14 py-3.5 text-base border border-warm-300/80 bg-white rounded-[2px] focus:outline-hidden focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue font-sans shadow-xs transition-all text-ink placeholder:text-warm-400"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-warm-400 hover:text-ink hover:bg-warm-100 transition-colors"
                aria-label="Clear search query"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs font-mono text-warm-400">
              {query.trim() && (
                <span>
                  Found <strong className="text-ink">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &quot;<span className="text-ieee-blue font-semibold">{deferredQuery}</span>&quot;
                </span>
              )}
            </p>
            {!query && (
              <p className="text-xs font-mono text-warm-300 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 bg-warm-100 border border-warm-200 rounded font-sans text-[11px] mx-0.5">⌘K</kbd> / <kbd className="px-1.5 py-0.5 bg-warm-100 border border-warm-200 rounded font-sans text-[11px] mx-0.5">Ctrl+K</kbd> to jump here anytime.
              </p>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className={`transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          {deferredQuery.trim() ? (
            <div className="space-y-12">
              {totalResults === 0 && (
                <div className="p-12 text-center border border-warm-200 bg-warm-50/40 rounded-[2px] space-y-2">
                  <p className="font-serif text-xl text-ink font-normal">No results found</p>
                  <p className="text-xs text-warm-400 font-sans">
                    We could not find any records matching &quot;{deferredQuery}&quot;. Try searching with broader keywords.
                  </p>
                </div>
              )}

              {/* Projects & Hardware Builds */}
              {searchResults.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Technical Projects</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.projects.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {searchResults.projects.map((proj: any) => (
                      <ProjectCard
                        key={proj.id || proj.slug}
                        title={proj.title}
                        slug={proj.slug}
                        summary={proj.summary}
                        description={proj.description}
                        githubUrl={proj.githubUrl}
                        demoUrl={proj.demoUrl}
                        year={proj.year}
                        tags={proj.tags}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Initiatives */}
              {searchResults.initiatives.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Strategic Initiatives</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.initiatives.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {searchResults.initiatives.map((init: any) => (
                      <InitiativeCard
                        key={init.id || init.slug}
                        title={init.title}
                        slug={init.slug}
                        description={init.description}
                        status={init.status}
                        targetAudience={init.targetAudience}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Events Results */}
              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Events & Workshops</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.events.length}
                    </span>
                  </div>
                  <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                    {searchResults.events.map((event: any) => (
                      <EventPreview
                        key={event.id}
                        title={event.title}
                        slug={event.slug}
                        date={event.date}
                        venue={event.venue}
                        unit={event.unit}
                        category={event.category}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* People Results */}
              {searchResults.people.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">People & Leadership</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.people.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {searchResults.people.map((p: any) => (
                      <Link
                        key={p.id}
                        href="/people"
                        className="p-4 border border-warm-200 bg-white rounded-[2px] hover:border-ieee-blue/40 transition-colors block group"
                      >
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors font-normal">
                          {p.name}
                        </h4>
                        <p className="font-mono text-[11px] text-ieee-blue uppercase tracking-wider mt-0.5">
                          {p.role}
                        </p>
                        {p.department && (
                          <p className="text-xs text-warm-400 font-sans mt-1">
                            {p.department}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Results */}
              {searchResults.achievements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Achievements</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.achievements.length}
                    </span>
                  </div>
                  <div className="border-t border-warm-200 bg-white rounded-[2px]">
                    {searchResults.achievements.map((item: any) => (
                      <AchievementRow
                        key={item.id}
                        id={item.id}
                        year={item.year}
                        title={item.title}
                        conferredBy={item.conferredBy}
                        unitOrTeam={item.unitOrTeam}
                        category={item.category}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters Results */}
              {searchResults.chapters.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Communities & Chapters</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.chapters.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.chapters.map((ch: any) => (
                      <Link
                        key={ch.id || ch.slug}
                        href={`/chapters/${ch.slug}`}
                        className="group p-5 border border-warm-200 bg-white rounded-[2px] hover:border-ieee-blue/40 transition-all block"
                      >
                        <span className="font-mono text-[11px] font-semibold tracking-wider text-ieee-blue uppercase block mb-1">
                          {ch.type}
                        </span>
                        <h4 className="font-serif text-xl text-ink group-hover:text-ieee-blue transition-colors font-normal">
                          {ch.name}
                        </h4>
                        <p className="text-xs text-warm-400 line-clamp-2 mt-1 font-sans">
                          {ch.description || ch.tagline}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories Results */}
              {searchResults.stories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Stories & Reports</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.stories.length}
                    </span>
                  </div>
                  <div className="divide-y divide-warm-200 border border-warm-200 rounded-[2px] bg-white">
                    {searchResults.stories.map((story: any) => (
                      <Link
                        key={story.id || story.slug}
                        href={`/stories/${story.slug}`}
                        className="p-5 hover:bg-warm-50/50 transition-colors block group"
                      >
                        <span className="font-mono text-[11px] text-warm-400 block mb-1">
                          {story.date || story.publishedDate} · {story.type || story.category}
                        </span>
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors font-normal">
                          {story.title}
                        </h4>
                        {story.excerpt && (
                          <p className="text-xs text-warm-400 font-sans mt-1 line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources Results */}
              {searchResults.resources.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Resources & Documents</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.resources.length}
                    </span>
                  </div>
                  <div className="divide-y divide-warm-200 border border-warm-200 rounded-[2px] bg-white">
                    {searchResults.resources.map((r: any) => (
                      <div key={r.id} className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-mono text-[11px] text-ieee-blue uppercase block mb-0.5">
                            {r.type}
                          </span>
                          <h4 className="font-serif text-lg text-ink font-normal">{r.title}</h4>
                          {r.description && (
                            <p className="text-xs text-warm-400 font-sans mt-0.5">{r.description}</p>
                          )}
                        </div>
                        <Link
                          href="/resources"
                          className="font-mono text-xs text-ieee-blue hover:underline font-semibold shrink-0"
                        >
                          View Resource →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Static Pages */}
              {searchResults.pages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink font-normal">Site Sections</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px] text-xs font-bold font-mono">
                      {searchResults.pages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.pages.map((p: any) => (
                      <Link
                        key={p.url}
                        href={p.url}
                        className="group p-5 border border-warm-200 bg-white rounded-[2px] hover:border-ieee-blue/40 transition-all block"
                      >
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors font-normal">
                          {p.title}
                        </h4>
                        <p className="text-xs text-warm-400 font-sans mt-1">{p.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Default Search Discovery Grid when input is empty */
            <div className="space-y-8 pt-4">
              <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                Quick Category Discovery
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Events Archive', href: '/events', count: `${initialEvents.length} Recorded` },
                  { title: 'Technical Projects', href: '/chapters/eds', count: `${initialProjects.length} Hardware Builds` },
                  { title: 'Achievements Ledger', href: '/achievements', count: `${initialAchievements.length} Honors` },
                  { title: 'Leadership Rosters', href: '/people', count: `${initialPeople.length} Officers` },
                  { title: 'Communities & Chapters', href: '/chapters', count: `${initialChapters.length} Units` },
                  { title: 'Stories & Reports', href: '/stories', count: `${initialStories.length} Articles` },
                  { title: 'Photo Galleries', href: '/gallery', count: `${initialGalleries.length} Albums` },
                  { title: 'Digital Resources', href: '/resources', count: `${initialResources.length} Documents` },
                ].map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    className="p-5 border border-warm-200 bg-white rounded-[2px] hover:border-ieee-blue/40 hover:-translate-y-0.5 transition-all block group"
                  >
                    <h4 className="font-serif text-base text-ink group-hover:text-ieee-blue transition-colors font-normal">
                      {cat.title}
                    </h4>
                    <span className="font-mono text-[11px] text-warm-400 block mt-1">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

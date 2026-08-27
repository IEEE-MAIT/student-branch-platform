'use client';

import React, { useState, useDeferredValue, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ProjectCard } from '@/components/content/ProjectCard';
import { InitiativeCard } from '@/components/content/InitiativeCard';
import { Badge } from '@/components/ui/Badge';
import Link from '@/components/ui/AppLink';
import { FiSearch, FiX, FiArrowRight, FiExternalLink } from 'react-icons/fi';

export const STATIC_PAGES = [
  { title: 'Home', description: 'Main landing page of the IEEE MAIT Student Branch', url: '/' },
  { title: 'About IEEE MAIT', description: 'Learn about our history, mission, and impact', url: '/about' },
  { title: 'Join IEEE MAIT', description: "Become a member of the world's largest technical professional organization", url: '/join' },
  { title: 'Contact Us', description: 'Get in touch with the IEEE MAIT executive committee', url: '/contact' },
  { title: 'Events & Workshops', description: 'Browse upcoming and past technical workshops and hackathons', url: '/events' },
  { title: 'Achievements Ledger', description: 'Explore awards and recognitions earned by our branch', url: '/achievements' },
  { title: 'Communities & Chapters', description: 'Discover our specialized technical societies and affinity groups', url: '/chapters' },
  { title: 'Publications & Digest', description: 'Read technical articles, Tech Tuesday digests, and insights from our community', url: '/publications' },
  { title: 'Special Interest Groups (SIGs)', description: 'Explore technical wings in DSA, Web Dev, AI/ML, and Hardware', url: '/sigs' },
  { title: 'Technical Projects', description: 'Explore student-engineered robotics, Edge AI, and RISC-V builds', url: '/projects' },
  { title: 'Opportunities & Grants', description: 'Browse funded IEEE scholarships, research fellowships, and volunteer calls', url: '/opportunities' },
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
  sigs?: any[];
  opportunities?: any[];
}

const SEARCH_HISTORY_KEY = 'ieee_mait_search_history';

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
  sigs: initialSIGs = [],
  opportunities: initialOpportunities = [],
}) => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to search history when user performs a meaningful search
  useEffect(() => {
    if (deferredQuery.trim().length > 2) {
      const q = deferredQuery.trim();
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== q.toLowerCase());
        const updated = [q, ...filtered].slice(0, 6);
        try {
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  }, [deferredQuery]);

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const removeHistoryItem = (itemToRemove: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

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
        sigs: [],
        opportunities: [],
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
        s.author?.toLowerCase().includes(q) ||
        (Array.isArray(s.tags) && s.tags.some((t: string) => t.toLowerCase().includes(q)))
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
    const sigs = initialSIGs.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
    const opportunities = initialOpportunities.filter(
      (o) =>
        o.title?.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.organisation?.toLowerCase().includes(q) ||
        o.eligibility?.toLowerCase().includes(q) ||
        o.category?.toLowerCase().includes(q)
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
      sigs,
      opportunities,
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
    initialSIGs,
    initialOpportunities,
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
    searchResults.initiatives.length +
    searchResults.sigs.length +
    searchResults.opportunities.length;

  return (
    <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 min-h-screen page-enter transition-colors duration-200">
      <Container size="default">
        <SectionHeading
          category="Site-Wide Omni-Index"
          title="Global Search Engine"
          subtitle="Instant cross-platform search across technical events, chapter sub-portals, leadership records, hardware projects, SIG roadmaps, and research publications."
        />

        <div className="max-w-3xl mb-8 relative z-10 group">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-warm-400 group-focus-within:text-ieee-blue dark:group-focus-within:text-sky-400 transition-colors">
              <FiSearch className="w-5 h-5" />
            </div>

            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, hardware projects, SIGs, opportunities, people, or awards..."
              className="w-full pl-12 pr-14 py-3.5 text-base border border-warm-300/80 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl focus:outline-hidden focus:border-ieee-blue dark:focus:border-sky-500 focus:ring-1 focus:ring-ieee-blue font-sans shadow-xs transition-all text-ink dark:text-gray-100 placeholder:text-warm-400 dark:placeholder:text-gray-500"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-warm-400 hover:text-ink dark:hover:text-white hover:bg-warm-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Clear search query"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs font-mono text-warm-400 dark:text-gray-400">
              {query.trim() && (
                <span>
                  Found <strong className="text-ink dark:text-gray-100">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &quot;<span className="text-ieee-blue dark:text-sky-400 font-semibold">{deferredQuery}</span>&quot;
                </span>
              )}
            </p>
            {!query && (
              <p className="text-xs font-mono text-warm-400 dark:text-gray-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 bg-warm-100 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded font-sans text-[11px] mx-0.5">⌘K</kbd> / <kbd className="px-1.5 py-0.5 bg-warm-100 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded font-sans text-[11px] mx-0.5">Ctrl+K</kbd> to jump here anytime.
              </p>
            )}
          </div>

          {/* Search History Chips */}
          {!query && searchHistory.length > 0 && (
            <div className="mt-4 pt-3 border-t border-warm-100 dark:border-gray-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400 font-semibold">Recent:</span>
              {searchHistory.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-full text-warm-600 dark:text-gray-300 font-mono text-[11px] hover:border-ieee-blue/40"
                >
                  <button
                    type="button"
                    onClick={() => setQuery(item)}
                    className="hover:text-ieee-blue dark:hover:text-sky-400"
                  >
                    {item}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHistoryItem(item)}
                    className="text-warm-400 hover:text-ink dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={clearHistory}
                className="text-[11px] font-mono text-warm-400 hover:text-red-500 underline ml-auto"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className={`transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          {deferredQuery.trim() ? (
            <div className="space-y-12">
              {totalResults === 0 && (
                <div className="p-12 text-center border border-warm-200 dark:border-gray-800 bg-warm-50/40 dark:bg-gray-900/40 rounded-xl space-y-2">
                  <p className="font-serif text-xl text-ink dark:text-gray-100 font-normal">No results found</p>
                  <p className="text-xs text-warm-400 dark:text-gray-400 font-sans">
                    We could not find any records matching &quot;{deferredQuery}&quot;. Try searching with broader keywords or checking our quick discovery categories below.
                  </p>
                </div>
              )}

              {/* Special Interest Groups */}
              {searchResults.sigs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Special Interest Groups (SIGs)</h3>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.sigs.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.sigs.map((sig: any) => (
                      <Link
                        key={sig.id || sig.slug}
                        href={`/sigs/${sig.slug}`}
                        className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all block group shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-serif text-lg text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal">
                            {sig.name}
                          </h4>
                          <span className="text-xs font-mono text-ieee-blue dark:text-sky-400 flex items-center gap-1">
                            <span>Hub</span>
                            <FiArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-xs text-warm-500 dark:text-gray-400 line-clamp-2">
                          {sig.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {searchResults.opportunities.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Opportunities &amp; Grants</h3>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.opportunities.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.opportunities.map((opp: any) => (
                      <div
                        key={opp.id || opp.slug}
                        className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all space-y-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="ieee">{opp.category}</Badge>
                          {opp.organisation && (
                            <span className="text-xs font-mono text-warm-400 dark:text-gray-400">
                              {opp.organisation}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                          {opp.title}
                        </h4>
                        <p className="text-xs text-warm-500 dark:text-gray-400 line-clamp-2">
                          {opp.description}
                        </p>
                        {opp.link && (
                          <a
                            href={opp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-ieee-blue dark:text-sky-400 font-bold hover:underline"
                          >
                            <span>Apply Link</span>
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects & Hardware Builds */}
              {searchResults.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Technical Projects</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
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
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Strategic Initiatives</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
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
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Events & Workshops</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.events.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {searchResults.events.map((evt: any) => (
                      <EventPreview
                        key={evt.id || evt.slug}
                        slug={evt.slug}
                        title={evt.title}
                        date={evt.date}
                        venue={evt.venue}
                        category={evt.category}
                        unit={evt.unit}
                        status={evt.status}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Publications & Articles */}
              {searchResults.stories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Publications & Digest</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.stories.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.stories.map((story: any) => (
                      <Link
                        key={story.id || story.slug}
                        href={`/publications/${story.slug}`}
                        className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all block group shadow-xs"
                      >
                        <span className="font-mono text-[10px] text-ieee-blue dark:text-sky-400 font-bold uppercase tracking-wider block mb-1">
                          {story.type || 'Tech Digest'}
                        </span>
                        <h4 className="font-serif text-lg text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal">
                          {story.title}
                        </h4>
                        <p className="text-xs text-warm-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {story.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Results */}
              {searchResults.achievements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Achievements & Honors</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.achievements.length}
                    </span>
                  </div>
                  <div className="divide-y divide-warm-200 dark:divide-gray-800 border-t border-b border-warm-200 dark:border-gray-800">
                    {searchResults.achievements.map((ach: any) => (
                      <AchievementRow
                        key={ach.id}
                        id={ach.id}
                        title={ach.title}
                        year={ach.year}
                        conferredBy={ach.conferredBy}
                        unitOrTeam={ach.unitOrTeam}
                        category={ach.category}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* People & Leadership */}
              {searchResults.people.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">People & Officers</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.people.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {searchResults.people.map((person: any) => (
                      <div
                        key={person.id}
                        className="p-4 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl flex items-center gap-3 shadow-xs"
                      >
                        <div className="w-10 h-10 rounded-full bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center font-mono text-sm font-bold text-ieee-blue dark:text-sky-400 shrink-0">
                          {person.name?.[0] || 'I'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-sans font-semibold text-sm text-ink dark:text-gray-100 truncate">
                            {person.name}
                          </h4>
                          <p className="text-xs text-warm-400 dark:text-gray-400 truncate">
                            {person.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters & Units */}
              {searchResults.chapters.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Chapters & Societies</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.chapters.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {searchResults.chapters.map((ch: any) => (
                      <Link
                        key={ch.id || ch.slug}
                        href={`/chapters/${ch.slug}`}
                        className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all block group shadow-xs"
                      >
                        <h4 className="font-serif text-lg text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal">
                          {ch.name}
                        </h4>
                        <p className="text-xs text-warm-400 dark:text-gray-400 line-clamp-2 mt-1">
                          {ch.tagline || ch.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Static Pages */}
              {searchResults.pages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-2">
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Platform Sections</h3>
                    <span className="bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.pages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.pages.map((p) => (
                      <Link
                        key={p.url}
                        href={p.url}
                        className="p-4 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all block group shadow-xs"
                      >
                        <h4 className="font-serif text-base text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal">
                          {p.title}
                        </h4>
                        <p className="text-xs text-warm-400 dark:text-gray-400 font-sans mt-0.5">
                          {p.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 pt-6">
              <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                Quick Category Discovery
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Events Archive', href: '/events', count: `${initialEvents.length} Recorded` },
                  { title: 'Technical Projects', href: '/projects', count: `${initialProjects.length} Hardware Builds` },
                  { title: 'Special Interest Groups', href: '/sigs', count: `${initialSIGs.length} Active Wings` },
                  { title: 'Opportunities & Grants', href: '/opportunities', count: `${initialOpportunities.length} Grants & Calls` },
                  { title: 'Achievements Ledger', href: '/achievements', count: `${initialAchievements.length} Honors` },
                  { title: 'Leadership Rosters', href: '/people', count: `${initialPeople.length} Officers` },
                  { title: 'Communities & Chapters', href: '/chapters', count: `${initialChapters.length} Units` },
                  { title: 'Publications & Digest', href: '/publications', count: `${initialStories.length} Articles` },
                  { title: 'Photo Galleries', href: '/gallery', count: `${initialGalleries.length} Albums` },
                  { title: 'Digital Resources', href: '/resources', count: `${initialResources.length} Documents` },
                ].map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue/40 dark:hover:border-sky-500/40 hover:-translate-y-0.5 transition-all block group shadow-xs"
                  >
                    <h4 className="font-serif text-base text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal">
                      {cat.title}
                    </h4>
                    <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400 block mt-1">
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

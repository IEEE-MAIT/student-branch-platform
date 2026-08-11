'use client';

import React, { useState, useDeferredValue, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import Link from '@/components/ui/AppLink';

export const STATIC_PAGES = [
  { title: 'Home', description: 'Main landing page of the IEEE MAIT Student Branch', url: '/' },
  { title: 'About IEEE MAIT', description: 'Learn about our history, mission, and impact', url: '/about' },
  { title: 'Join IEEE MAIT', description: "Become a member of the world's largest technical professional organization", url: '/join' },
  { title: 'Contact Us', description: 'Get in touch with the IEEE MAIT executive committee', url: '/contact' },
  { title: 'Events', description: 'Browse upcoming and past technical workshops and hackathons', url: '/events' },
  { title: 'Achievements', description: 'Explore awards and recognitions earned by our branch', url: '/achievements' },
  { title: 'Chapters & AGs', description: 'Discover our specialized technical societies and affinity groups', url: '/chapters' },
  { title: 'Stories & Reports', description: 'Read articles, reports, and insights from our community', url: '/stories' },
  { title: 'Photo Gallery', description: 'View memories from our past events and initiatives', url: '/gallery' },
  { title: 'People & Leadership', description: 'Meet the executive committee and active members', url: '/people' },
  { title: 'Resources', description: 'Access branch documents, newsletters, and annual reports', url: '/resources' },
];

interface SearchClientProps {
  events: any[];
  achievements: any[];
  chapters: any[];
  stories: any[];
  people: any[];
  galleries: any[];
  resources: any[];
}

export const SearchClient: React.FC<SearchClientProps> = ({
  events: initialEvents,
  achievements: initialAchievements,
  chapters: initialChapters,
  stories: initialStories,
  people: initialPeople,
  galleries: initialGalleries,
  resources: initialResources
}) => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) return { pages: [], events: [], achievements: [], chapters: [], stories: [], people: [], galleries: [], resources: [] };
    const q = deferredQuery.toLowerCase();

    const pages = STATIC_PAGES.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const events = initialEvents.filter(e => e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q));
    const achievements = initialAchievements.filter(a => a.title?.toLowerCase().includes(q) || a.conferredBy?.toLowerCase().includes(q) || a.year?.includes(q));
    const chapters = initialChapters.filter(c => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    const stories = initialStories.filter(s => s.title?.toLowerCase().includes(q) || s.excerpt?.toLowerCase().includes(q));
    const people = initialPeople.filter(p => p.name?.toLowerCase().includes(q) || p.role?.toLowerCase().includes(q) || p.department?.toLowerCase().includes(q));
    const galleries = initialGalleries.filter(g => g.title?.toLowerCase().includes(q) || g.category?.toLowerCase().includes(q));
    const resources = initialResources.filter(r => r.title?.toLowerCase().includes(q) || r.type?.toLowerCase().includes(q));

    return { pages, events, achievements, chapters, stories, people, galleries, resources };
  }, [deferredQuery, initialEvents, initialAchievements, initialChapters, initialStories, initialPeople, initialGalleries, initialResources]);

  const totalResults =
    searchResults.pages.length +
    searchResults.events.length +
    searchResults.achievements.length +
    searchResults.chapters.length +
    searchResults.stories.length +
    searchResults.people.length +
    searchResults.galleries.length +
    searchResults.resources.length;

  return (
    <main className="flex-1 py-16 sm:py-24 bg-warm-50/50 min-h-screen">
      <Container size="default">
        <SectionHeading
          category="Search Platform"
          title="Omni-Search"
          subtitle="Search across everything: events, people, pages, resources, and more."
        />

        <div className="max-w-3xl mb-12 relative z-10 group">
          <div className="relative flex items-center">
            <div className="absolute left-5 text-warm-400 group-focus-within:text-ieee-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-14 pr-16 py-4 text-lg border border-warm-300/60 bg-white rounded-lg focus:outline-none focus:ring-4 focus:ring-ieee-blue/15 focus:border-ieee-blue font-sans shadow-sm transition-all text-ink placeholder:text-warm-300"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1.5 rounded-full text-warm-400 hover:text-ink hover:bg-warm-100 transition-colors focus:outline-none focus:ring-2 focus:ring-ieee-blue"
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
                  Found <span className="font-bold text-ink">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &quot;<span className="text-ieee-blue">{deferredQuery}</span>&quot;
                </span>
              )}
            </p>
            {!query && (
              <p className="text-xs font-mono text-warm-300 hidden sm:block">
                Pro tip: You can press <kbd className="px-1.5 py-0.5 bg-white border border-warm-200 rounded font-sans font-medium mx-0.5">⌘K</kbd> to jump here anytime.
              </p>
            )}
          </div>
        </div>

        <div className={`transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          {deferredQuery.trim() ? (
            <div className="space-y-12">
              
              {/* Pages Results */}
              {searchResults.pages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Pages</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.pages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.pages.map((p: any) => (
                      <Link 
                        key={p.url} 
                        href={p.url}
                        className="group p-5 border border-warm-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-ieee-blue/30 transition-all duration-300"
                      >
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors mb-1">{p.title}</h4>
                        <p className="text-xs text-warm-400">{p.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* People Results */}
              {searchResults.people.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">People</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.people.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchResults.people.map((p: any) => (
                      <div key={p.id} className="p-4 border border-warm-200 bg-white rounded-lg shadow-sm">
                        <h4 className="font-serif text-lg text-ink mb-1">{p.name}</h4>
                        <p className="font-mono text-[11px] text-ieee-blue uppercase tracking-wider">{p.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Results */}
              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Events</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.events.length}
                    </span>
                  </div>
                  <div className="border border-warm-200 bg-white rounded-lg overflow-hidden divide-y divide-warm-200 shadow-sm">
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

              {/* Achievements Results */}
              {searchResults.achievements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Achievements</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.achievements.length}
                    </span>
                  </div>
                  <div className="border-t border-warm-200 bg-white shadow-sm rounded-lg overflow-hidden">
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
                    <h3 className="font-serif text-2xl text-ink">Chapters & AGs</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.chapters.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.chapters.map((ch: any) => (
                      <Link 
                        key={ch.id} 
                        href={`/chapters/${ch.slug}`}
                        className="group p-5 border border-warm-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                      >
                        <span className="font-mono text-[11px] font-semibold tracking-wider text-ieee-blue uppercase block mb-1">{ch.type}</span>
                        <h4 className="font-serif text-xl text-ink group-hover:text-ieee-blue transition-colors mb-1">{ch.name}</h4>
                        <p className="text-xs text-warm-400 line-clamp-2">{ch.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories Results */}
              {searchResults.stories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Stories</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.stories.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.stories.map((s: any) => (
                      <Link 
                        key={s.id} 
                        href={`/stories/${s.slug}`}
                        className="group p-5 border border-warm-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1 font-mono text-[10px] uppercase tracking-wider">
                          <span className="text-ieee-blue">{s.unit}</span>
                          <span className="text-warm-300">•</span>
                          <span className="text-warm-400">{s.publishedDate || s.date}</span>
                        </div>
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors mb-1">{s.title}</h4>
                        <p className="text-xs text-warm-400 line-clamp-2">{s.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Galleries Results */}
              {searchResults.galleries.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Galleries</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.galleries.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchResults.galleries.map((g: any) => (
                      <Link 
                        key={g.id} 
                        href={`/gallery/${g.slug}`}
                        className="group p-4 border border-warm-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                      >
                        <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors mb-1">{g.title}</h4>
                        <p className="font-mono text-[10px] text-warm-400 uppercase tracking-wider">{g.category}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources Results */}
              {searchResults.resources.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
                    <h3 className="font-serif text-2xl text-ink">Resources</h3>
                    <span className="bg-ieee-subtle text-ieee-blue px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      {searchResults.resources.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.resources.map((r: any) => (
                      <a 
                        key={r.id} 
                        href={r.fileUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="group p-5 border border-warm-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-serif text-lg text-ink group-hover:text-ieee-blue transition-colors mb-1">{r.title}</h4>
                          <p className="font-mono text-[10px] text-warm-400 uppercase tracking-wider">{r.type} · {r.publishedDate}</p>
                        </div>
                        <svg className="w-5 h-5 text-warm-300 group-hover:text-ieee-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mb-6 text-warm-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-2">No matching records found</h3>
                  <p className="text-warm-400 font-sans max-w-md">
                    We couldn't find anything matching &quot;<span className="text-ink font-semibold">{deferredQuery}</span>&quot;. Try adjusting your search or explore our popular topics like <button onClick={()=>{setQuery('Workshop')}} className="text-ieee-blue hover:underline">Workshops</button>, <button onClick={()=>{setQuery('WIE')}} className="text-ieee-blue hover:underline">WIE</button>, or <button onClick={()=>{setQuery('2025')}} className="text-ieee-blue hover:underline">2025</button>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border-t border-warm-200 border-dashed mt-8">
              <div className="w-16 h-16 bg-ieee-subtle rounded-full flex items-center justify-center mb-6 text-ieee-blue opacity-80">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-2">Explore the Student Branch</h3>
              <p className="text-warm-400 font-sans max-w-md">
                Search across all our events, achievements, people, stories, galleries, resources, and static pages!
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

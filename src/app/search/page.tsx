'use client';

/**
 * @file src/app/search/page.tsx
 * @description Instant Site-Wide Search page filtering in real-time across events, achievements, leadership, chapters, and stories.
 * 
 * DESIGN SPECIFICATIONS:
 * - Reactive search input using React `useMemo` for optimal performance.
 * - Multi-entity query matching across events, achievements, organization units, and articles.
 * - Categorized result sections with total query match counters.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import { CHAPTERS_DATA, EVENTS_DATA, ACHIEVEMENTS_DATA, STORIES_DATA } from '@/lib/data';
import Link from 'next/link';

/**
 * Site-Wide Search Platform Page Component.
 */
export default function SearchPage() {
  const [query, setQuery] = useState('');

  /**
   * Evaluates query matches across all branch data entities in real time.
   */
  const searchResults = useMemo(() => {
    if (!query.trim()) return { events: [], achievements: [], chapters: [], stories: [] };
    const q = query.toLowerCase();

    const events = EVENTS_DATA.filter(
      e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
    );

    const achievements = ACHIEVEMENTS_DATA.filter(
      a => a.title.toLowerCase().includes(q) || a.conferredBy.toLowerCase().includes(q) || a.year.includes(q)
    );

    const chapters = Object.values(CHAPTERS_DATA).filter(
      c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    const stories = Object.values(STORIES_DATA).filter(
      s => s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q)
    );

    return { events, achievements, chapters, stories };
  }, [query]);

  const totalResults =
    searchResults.events.length +
    searchResults.achievements.length +
    searchResults.chapters.length +
    searchResults.stories.length;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Search Platform"
            title="Site-Wide Search"
            subtitle="Search across IEEE MAIT events, achievements, leadership, chapters, and stories."
          />

          {/* Search Input Control */}
          <div className="max-w-2xl mb-12">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search (e.g. 'Machine Learning', 'WIE', '2025', 'Award')..."
                className="w-full px-4 py-3 text-base border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue font-sans shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-warm-400 hover:text-ink"
                  aria-label="Clear Search Input"
                >
                  Clear ✕
                </button>
              )}
            </div>
            {query.trim() && (
              <p className="text-xs font-mono text-warm-400 mt-2">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
              </p>
            )}
          </div>

          {/* Categorized Search Results */}
          {query.trim() ? (
            <div className="space-y-12">
              {/* Events Results */}
              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink border-b border-warm-200 pb-2">
                    Events ({searchResults.events.length})
                  </h3>
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

              {/* Achievements Results */}
              {searchResults.achievements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink border-b border-warm-200 pb-2">
                    Achievements ({searchResults.achievements.length})
                  </h3>
                  <div className="border-t border-warm-200">
                    {searchResults.achievements.map((item: any) => (
                      <AchievementRow
                        key={item.id}
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
                  <h3 className="font-serif text-2xl text-ink border-b border-warm-200 pb-2">
                    Chapters ({searchResults.chapters.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.chapters.map((ch: any) => (
                      <div key={ch.id} className="p-4 border border-warm-200 bg-white rounded-[2px]">
                        <span className="font-mono text-xs text-ieee-blue uppercase block mb-1">{ch.type}</span>
                        <Link href={`/chapters/${ch.slug}`} className="font-serif text-xl text-ink hover:text-ieee-blue font-normal">
                          {ch.name}
                        </Link>
                        <p className="text-xs text-warm-400 mt-1 line-clamp-2">{ch.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories Results */}
              {searchResults.stories.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink border-b border-warm-200 pb-2">
                    Stories ({searchResults.stories.length})
                  </h3>
                  <div className="space-y-3">
                    {searchResults.stories.map((s: any) => (
                      <div key={s.id} className="p-4 border border-warm-200 bg-white rounded-[2px]">
                        <span className="font-mono text-xs text-ieee-blue uppercase block mb-1">{s.publishedDate} · {s.unit}</span>
                        <Link href={`/stories/${s.slug}`} className="font-serif text-xl text-ink hover:text-ieee-blue font-normal">
                          {s.title}
                        </Link>
                        <p className="text-xs text-warm-400 mt-1 line-clamp-2">{s.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="p-12 border border-warm-200 bg-warm-100/40 rounded-[2px] text-center text-warm-400 font-sans">
                  No matching records found for &quot;{query}&quot;. Try searching for &quot;WIE&quot;, &quot;Workshop&quot;, or &quot;2025&quot;.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 border border-warm-200 bg-warm-100/30 rounded-[2px] text-sm text-warm-400 font-sans">
              Enter a search term above to find events, achievements, chapters, or articles.
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}

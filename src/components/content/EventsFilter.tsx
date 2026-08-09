'use client';

import React, { useState, useMemo } from 'react';
import { EventPreview } from './EventPreview';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string | null;
  venue?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  category?: string | null;
  status?: string | null;
  description?: string | null;
}

export function EventsFilter({ initialEvents }: { initialEvents: EventItem[] }) {
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      const matchUnit = selectedUnit === 'ALL' || event.unitSlug === selectedUnit;
      const matchCategory = selectedCategory === 'ALL' || event.category === selectedCategory;
      return matchUnit && matchCategory;
    });
  }, [initialEvents, selectedUnit, selectedCategory]);

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.status === 'past');
  const featuredUpcoming = upcomingEvents[0];
  const remainingUpcoming = upcomingEvents.slice(1);

  return (
    <div>
      {/* Interactive Filter Bar */}
      <div className="bg-warm-100/60 border border-warm-200 p-4 rounded-[2px] mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        {/* Unit Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-warm-400 font-semibold uppercase tracking-wider">Unit:</span>
          {[
            { label: 'All Units', value: 'ALL' },
            { label: 'Branch (SB)', value: 'sb' },
            { label: 'WIE AG', value: 'wie' },
            { label: 'EDS Chapter', value: 'eds' },
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setSelectedUnit(item.value)}
              className={`px-3 py-1.5 rounded-[2px] transition-colors ${
                selectedUnit === item.value
                  ? 'bg-ieee-blue text-white font-bold'
                  : 'bg-white border border-warm-200 text-ink hover:border-ieee-blue'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-warm-400 font-semibold uppercase tracking-wider whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-warm-200 rounded-[2px] text-ink font-mono focus:outline-none focus:border-ieee-blue w-full sm:w-auto"
          >
            <option value="ALL">All Categories</option>
            <option value="Technical Workshop">Technical Workshop</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="Branch Event">Branch Event</option>
            <option value="Flagship Event">Flagship Event</option>
          </select>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-16 space-y-6">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
          Upcoming Events ({upcomingEvents.length})
        </h3>

        {featuredUpcoming && (
          <EventPreview
            isFeatured
            title={featuredUpcoming.title}
            slug={featuredUpcoming.slug}
            date={featuredUpcoming.date}
            time={featuredUpcoming.time || undefined}
            venue={featuredUpcoming.venue || undefined}
            unit={featuredUpcoming.unit || undefined}
            category={featuredUpcoming.category || undefined}
            description={featuredUpcoming.description || undefined}
          />
        )}

        {remainingUpcoming.length > 0 && (
          <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
            {remainingUpcoming.map(event => (
              <EventPreview
                key={event.id}
                title={event.title}
                slug={event.slug}
                date={event.date}
                venue={event.venue || undefined}
                unit={event.unit || undefined}
                category={event.category || undefined}
              />
            ))}
          </div>
        )}

        {upcomingEvents.length === 0 && (
          <div className="p-8 border border-warm-200 bg-warm-100/30 rounded-[2px] text-center text-warm-400 font-sans text-sm">
            No upcoming events match your selected filters. Try clearing the filter options above.
          </div>
        )}
      </div>

      {/* Past Events Section */}
      <div className="space-y-6">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-muted border-b border-warm-200 pb-2">
          Past Events Archive ({pastEvents.length})
        </h3>

        {pastEvents.length > 0 ? (
          <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
            {pastEvents.map(event => (
              <EventPreview
                key={event.id}
                title={event.title}
                slug={event.slug}
                date={event.date}
                venue={event.venue || undefined}
                unit={event.unit || undefined}
                category={event.category || undefined}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 border border-warm-200 bg-warm-100/30 rounded-[2px] text-center text-warm-400 font-sans text-sm">
            No past events match your selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

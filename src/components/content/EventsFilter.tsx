'use client';

/**
 * @file src/components/content/EventsFilter.tsx
 * @description State-of-the-art interactive filter and search engine for IEEE MAIT events with react-icons.
 * 
 * FEATURES:
 * - Status Tabs: All | Upcoming | Live / Ongoing | Flagships | Past Archive with react-icons.
 * - Unit Filter Pills: All Units | IEEE MAIT SB | EDS Chapter | WIE AG.
 * - Live keyword search with instant filtering across titles, venues, and topics.
 * - Category Dropdown selector.
 * - Dynamic event counts and responsive pagination.
 * - Fully responsive with light and dark mode tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import { EventPreview } from './EventPreview';
import { Pagination } from '../ui/Pagination';
import { FiSearch, FiX, FiRadio, FiStar, FiCalendar, FiClock } from 'react-icons/fi';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string | null;
  venue?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  category?: string | null;
  eventType?: string | null;
  status?: string | null;
  isLive?: boolean;
  vtoolsLink?: string | null;
  description?: string | null;
  imageSrc?: string | null;
}

export function EventsFilter({ initialEvents }: { initialEvents: EventItem[] }) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'FLAGSHIP' | 'PAST'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Compute tab counts
  const tabCounts = useMemo(() => {
    return {
      all: initialEvents.length,
      upcoming: initialEvents.filter((e) => e.status?.toLowerCase() === 'upcoming' && !e.isLive).length,
      ongoing: initialEvents.filter((e) => e.isLive || e.status?.toLowerCase() === 'ongoing').length,
      flagship: initialEvents.filter((e) => e.eventType?.toLowerCase() === 'flagship' || e.category?.toLowerCase().includes('flagship')).length,
      past: initialEvents.filter((e) => e.status?.toLowerCase() === 'past' && !e.isLive).length,
    };
  }, [initialEvents]);

  // Dynamic filter pipeline
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // 1. Tab Status Filter
      if (activeTab === 'UPCOMING' && (event.status?.toLowerCase() !== 'upcoming' || event.isLive)) return false;
      if (activeTab === 'ONGOING' && !event.isLive && event.status?.toLowerCase() !== 'ongoing') return false;
      if (activeTab === 'FLAGSHIP' && event.eventType?.toLowerCase() !== 'flagship' && !event.category?.toLowerCase().includes('flagship')) return false;
      if (activeTab === 'PAST' && (event.status?.toLowerCase() !== 'past' || event.isLive)) return false;

      // 2. Unit Filter
      if (selectedUnit !== 'ALL') {
        const u = (event.unitSlug || event.unit || '').toLowerCase();
        if (selectedUnit === 'sb' && u !== 'sb' && !u.includes('student branch') && u !== 'main') return false;
        if (selectedUnit === 'eds' && !u.includes('eds')) return false;
        if (selectedUnit === 'wie' && !u.includes('wie')) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'ALL') {
        if (event.category !== selectedCategory) return false;
      }

      // 4. Keyword Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesVenue = (event.venue || '').toLowerCase().includes(query);
        const matchesDesc = (event.description || '').toLowerCase().includes(query);
        const matchesUnit = (event.unit || '').toLowerCase().includes(query);

        if (!matchesTitle && !matchesVenue && !matchesDesc && !matchesUnit) {
          return false;
        }
      }

      return true;
    });
  }, [initialEvents, activeTab, selectedUnit, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const featuredEvent = activeTab === 'ALL' && paginatedEvents.length > 0 && currentPage === 1 ? paginatedEvents[0] : null;
  const listEvents = featuredEvent ? paginatedEvents.slice(1) : paginatedEvents;

  return (
    <div className="space-y-8">
      {/* 1. Status Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200 dark:border-gray-800">
        {[
          { id: 'ALL', label: 'All Events', count: tabCounts.all, icon: null },
          { id: 'UPCOMING', label: 'Upcoming', count: tabCounts.upcoming, icon: FiClock, iconColor: 'text-sky-500' },
          { id: 'ONGOING', label: 'Live Now', count: tabCounts.ongoing, isLive: true, icon: FiRadio, iconColor: 'text-red-500' },
          { id: 'FLAGSHIP', label: 'Flagships', count: tabCounts.flagship, icon: FiStar, iconColor: 'text-amber-500' },
          { id: 'PAST', label: 'Past Archive', count: tabCounts.past, icon: FiCalendar, iconColor: 'text-warm-500' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                  : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40 dark:hover:border-sky-500/40'
              }`}
            >
              {Icon && <Icon className={`w-3 h-3 ${activeTab === tab.id ? 'text-white' : tab.iconColor}`} />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-warm-200/60 dark:bg-gray-800 text-warm-500 dark:text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Filter & Search Bar */}
      <div className="bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200 dark:border-gray-800 p-4 sm:p-5 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-400 dark:text-gray-500">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by event title, venue, or keyword..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-xs text-ink dark:text-gray-100 placeholder-warm-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-400 hover:text-ink dark:hover:text-white text-xs cursor-pointer"
              aria-label="Clear Search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Unit Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-xs font-mono text-warm-400 dark:text-gray-400 mr-1 hidden sm:inline">Unit:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'SB', value: 'sb' },
            { label: 'WIE AG', value: 'wie' },
            { label: 'EDS Chapter', value: 'eds' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setSelectedUnit(item.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedUnit === item.value
                  ? 'bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 border border-ieee-blue/40 font-bold shadow-xs'
                  : 'bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-warm-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-warm-400 dark:text-gray-400 hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-xs text-ink dark:text-gray-100 font-sans focus:outline-none focus:ring-2 focus:ring-ieee-blue w-full sm:w-auto"
          >
            <option value="ALL">All Categories</option>
            <option value="Technical Workshop">Technical Workshop</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="Branch Event">Branch Event</option>
            <option value="Flagship Event">Flagship Event</option>
            <option value="Hands-on Bootcamp">Hands-on Bootcamp</option>
          </select>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      {(searchQuery || selectedUnit !== 'ALL' || selectedCategory !== 'ALL' || activeTab !== 'ALL') && (
        <div className="flex items-center justify-between text-xs text-warm-400 dark:text-gray-400 px-1">
          <span>
            Showing <strong className="text-ink dark:text-gray-200">{filteredEvents.length}</strong> matching events
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ALL');
              setSelectedUnit('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="text-ieee-blue dark:text-sky-400 hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>Reset all filters</span>
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Event Cards Section */}
      <div className="space-y-6">
        {featuredEvent && (
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 mb-3 flex items-center gap-2">
              <span>Featured Spotlight</span>
              <span className="w-12 h-[1px] bg-ieee-blue/40" />
            </div>
            <EventPreview
              isFeatured
              title={featuredEvent.title}
              slug={featuredEvent.slug}
              date={featuredEvent.date}
              time={featuredEvent.time}
              venue={featuredEvent.venue}
              unit={featuredEvent.unit}
              category={featuredEvent.category}
              eventType={featuredEvent.eventType}
              status={featuredEvent.status}
              isLive={featuredEvent.isLive}
              vtoolsLink={featuredEvent.vtoolsLink}
              description={featuredEvent.description}
              imageSrc={featuredEvent.imageSrc}
            />
          </div>
        )}

        {listEvents.length > 0 && (
          <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl divide-y divide-warm-200 dark:divide-gray-800 overflow-hidden shadow-xs">
            {listEvents.map((event) => (
              <EventPreview
                key={event.id}
                title={event.title}
                slug={event.slug}
                date={event.date}
                time={event.time}
                venue={event.venue}
                unit={event.unit}
                category={event.category}
                eventType={event.eventType}
                status={event.status}
                isLive={event.isLive}
                vtoolsLink={event.vtoolsLink}
                description={event.description}
              />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 mx-auto">
              <FiCalendar className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg text-ink dark:text-gray-200 font-normal">
              No matching events found
            </h4>
            <p className="text-xs text-warm-400 dark:text-gray-400 max-w-sm mx-auto">
              We couldn&apos;t find any events matching your selected filters or search terms. Try clearing the search query or switching tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setSelectedUnit('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-mono font-semibold transition-colors inline-block cursor-pointer shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

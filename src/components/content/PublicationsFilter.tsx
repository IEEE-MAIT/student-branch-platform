'use client';

/**
 * @file src/components/content/PublicationsFilter.tsx
 * @description Interactive filtering and search engine for IEEE MAIT Publications with react-icons.
 * 
 * FEATURES:
 * - Category Tabs: All | Tech Tuesday | Newsletters | Articles | Event Reports with react-icons.
 * - Unit Filter Pills: All Units | IEEE MAIT SB | EDS Chapter | WIE AG.
 * - Real-time keyword search across titles, authors, and excerpts.
 * - Featured article spotlight hero.
 * - Responsive 2-column publication cards grid.
 * - Dynamic pagination & counters.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiZap,
  FiBookOpen,
  FiFileText,
  FiFolder,
  FiStar,
  FiClock,
} from 'react-icons/fi';

export interface PublicationItem {
  id: string;
  title: string;
  slug: string;
  type?: string | null;
  category?: string | null;
  author?: string | null;
  authorRole?: string | null;
  date?: string | null;
  publishedDate?: string | null;
  readingTime?: string | null;
  unit?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  imageUrl?: string | null;
  imageSrc?: string | null;
  pdfUrl?: string | null;
  externalLink?: string | null;
  tags?: string[] | null;
}

interface PublicationsFilterProps {
  initialPublications: PublicationItem[];
}

const ITEMS_PER_PAGE = 6;

export function PublicationsFilter({ initialPublications }: PublicationsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered dataset
  const filteredPublications = useMemo(() => {
    return initialPublications.filter((item) => {
      // 1. Category Filter
      if (activeCategory !== 'ALL') {
        const itemCat = (item.type || item.category || '').toLowerCase();
        if (activeCategory === 'Tech Tuesday' && !itemCat.includes('tech') && !itemCat.includes('tuesday')) return false;
        if (activeCategory === 'Newsletter' && !itemCat.includes('newsletter')) return false;
        if (activeCategory === 'Article' && !itemCat.includes('article') && !itemCat.includes('guide')) return false;
        if (activeCategory === 'Report' && !itemCat.includes('report')) return false;
      }

      // 2. Unit Filter
      if (selectedUnit !== 'ALL') {
        const itemUnit = (item.unit || '').toLowerCase();
        if (selectedUnit === 'sb' && itemUnit !== 'sb' && !itemUnit.includes('student branch')) return false;
        if (selectedUnit === 'eds' && !itemUnit.includes('eds')) return false;
        if (selectedUnit === 'wie' && !itemUnit.includes('wie')) return false;
      }

      // 3. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAuthor = (item.author || '').toLowerCase().includes(q);
        const matchesExcerpt = (item.excerpt || '').toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesAuthor && !matchesExcerpt && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [initialPublications, activeCategory, selectedUnit, searchQuery]);

  // Tab counters
  const counts = useMemo(() => {
    return {
      all: initialPublications.length,
      techTuesday: initialPublications.filter((p) => (p.type || p.category || '').toLowerCase().includes('tech')).length,
      newsletters: initialPublications.filter((p) => (p.type || p.category || '').toLowerCase().includes('newsletter')).length,
      articles: initialPublications.filter((p) => (p.type || p.category || '').toLowerCase().includes('article')).length,
      reports: initialPublications.filter((p) => (p.type || p.category || '').toLowerCase().includes('report')).length,
    };
  }, [initialPublications]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPublications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPublications, currentPage]);

  const featuredItem = (activeCategory === 'ALL' || activeCategory === 'Tech Tuesday') && paginatedItems.length > 0 && currentPage === 1
    ? paginatedItems[0]
    : null;
  const listItems = featuredItem ? paginatedItems.slice(1) : paginatedItems;

  return (
    <div className="space-y-8">
      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200 dark:border-gray-800">
        {[
          { id: 'ALL', label: 'All Publications', count: counts.all, icon: null },
          { id: 'Tech Tuesday', label: 'Tech Tuesday', count: counts.techTuesday, icon: FiZap, iconColor: 'text-amber-500' },
          { id: 'Newsletter', label: 'Newsletters', count: counts.newsletters, icon: FiBookOpen, iconColor: 'text-sky-500' },
          { id: 'Article', label: 'Articles & Guides', count: counts.articles, icon: FiFileText, iconColor: 'text-emerald-500' },
          { id: 'Report', label: 'Event Reports', count: counts.reports, icon: FiFolder, iconColor: 'text-purple-500' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCategory(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                  : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40 dark:hover:border-sky-500/40'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${activeCategory === tab.id ? 'text-white' : tab.iconColor}`} />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeCategory === tab.id
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
            placeholder="Search by article title, author, topic, or keyword..."
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
          <span className="text-xs font-mono text-warm-400 dark:text-gray-400 mr-1 hidden sm:inline">Publisher:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Branch (SB)', value: 'sb' },
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
      </div>

      {/* Active Filter Summary Bar */}
      {(searchQuery || selectedUnit !== 'ALL' || activeCategory !== 'ALL') && (
        <div className="flex items-center justify-between text-xs text-warm-400 dark:text-gray-400 px-1">
          <span>
            Showing <strong className="text-ink dark:text-gray-200">{filteredPublications.length}</strong> matching publications
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('ALL');
              setSelectedUnit('ALL');
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

      {/* 3. Publications Grid */}
      <div className="space-y-6">
        {/* Spotlight Featured Article */}
        {featuredItem && (
          <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-stretch shadow-sm hover:shadow-md transition-all group">
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                    <FiStar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Featured Editorial Release</span>
                  </span>
                  {featuredItem.category && <Badge variant="ieee">{featuredItem.category}</Badge>}
                  {featuredItem.unit && <Badge variant="neutral">{featuredItem.unit}</Badge>}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal leading-tight group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                  <Link href={`/publications/${featuredItem.slug}`}>
                    {featuredItem.title}
                  </Link>
                </h3>

                {featuredItem.excerpt && (
                  <p className="text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed line-clamp-3">
                    {featuredItem.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-warm-400 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <span>{featuredItem.publishedDate || featuredItem.date}</span>
                  {featuredItem.readingTime && (
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
                      <span>{featuredItem.readingTime}</span>
                    </span>
                  )}
                </div>

                <Link
                  href={`/publications/${featuredItem.slug}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 uppercase tracking-wider transition-colors"
                >
                  <span>Read Full Article</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {(featuredItem.coverImage || featuredItem.imageUrl || featuredItem.imageSrc) && (
              <div className="relative w-full lg:w-96 h-56 lg:h-auto min-h-[220px] bg-warm-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={(featuredItem.coverImage || featuredItem.imageUrl || featuredItem.imageSrc) as string}
                  alt={featuredItem.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        )}

        {/* 2-Column List Grid */}
        {listItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listItems.map((pub) => (
              <div
                key={pub.id}
                className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all duration-300 group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <Badge variant="ieee">{pub.type || pub.category || 'Article'}</Badge>
                    {pub.unit && <Badge variant="neutral">{pub.unit}</Badge>}
                    <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400 ml-auto">
                      {pub.publishedDate || pub.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                    <Link href={`/publications/${pub.slug}`}>
                      {pub.title}
                    </Link>
                  </h3>

                  {pub.excerpt && (
                    <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed line-clamp-3">
                      {pub.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between text-xs font-mono text-warm-400 dark:text-gray-400">
                  <span className="line-clamp-1">{pub.author ? `By ${pub.author}` : 'IEEE MAIT Editorial'}</span>
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="text-ieee-blue dark:text-sky-400 font-bold hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px] shrink-0"
                  >
                    <span>Read</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPublications.length === 0 && (
          <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 mx-auto">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg text-ink dark:text-gray-200 font-normal">
              No matching publications found
            </h4>
            <p className="text-xs text-warm-400 dark:text-gray-400 max-w-sm mx-auto">
              We couldn&apos;t find any articles matching your selected category or query. Try clearing the search bar.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('ALL');
                setSelectedUnit('ALL');
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

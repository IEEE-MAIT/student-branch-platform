'use client';

/**
 * @file src/components/content/ProjectsFilter.tsx
 * @description Interactive filtering and search engine for IEEE MAIT Technical Projects.
 * 
 * FEATURES:
 * - Status Filter Tabs: All | Active Development | Completed | Featured
 * - Domain Selector Pills: All | Hardware & Embedded | AI / ML | Web & Cloud | VLSI
 * - Unit Filter Pills: All | SB | EDS Chapter | WIE AG
 * - Live Search across title, summary, and tech tags
 * - Interactive Project Cards with GitHub & Demo CTAs
 * - Responsive Pagination
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import Link from '@/components/ui/AppLink';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  coverImage?: string | null;
  chapterId?: string | null;
  chapterSlug?: string | null;
  sigId?: string | null;
  year: string;
  tags?: string[] | null;
  status: string; // Ongoing | Completed | Upcoming
  featured?: boolean;
  chapter?: { name: string; slug: string } | null;
  sig?: { name: string; slug: string } | null;
}

interface ProjectsFilterProps {
  initialProjects: ProjectItem[];
}

export function ProjectsFilter({ initialProjects }: ProjectsFilterProps) {
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  // Real-time filtering engine
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((item) => {
      // 1. Status Filter
      if (activeStatus !== 'ALL') {
        if (activeStatus === 'Featured' && !item.featured) return false;
        if (activeStatus === 'Ongoing' && item.status?.toLowerCase() !== 'ongoing') return false;
        if (activeStatus === 'Completed' && item.status?.toLowerCase() !== 'completed') return false;
      }

      // 2. Domain Filter
      if (selectedDomain !== 'ALL') {
        const itemTags = (item.tags || []).map((t) => t.toLowerCase());
        const itemTitle = item.title.toLowerCase();
        const itemSummary = item.summary.toLowerCase();

        if (selectedDomain === 'hardware') {
          const match = itemTags.some((t) => t.includes('pcb') || t.includes('hardware') || t.includes('stm32') || t.includes('embedded') || t.includes('robotics')) || itemTitle.includes('rover') || itemSummary.includes('hardware');
          if (!match) return false;
        } else if (selectedDomain === 'ai-ml') {
          const match = itemTags.some((t) => t.includes('ai') || t.includes('ml') || t.includes('tinyml') || t.includes('tensorflow') || t.includes('sensor')) || itemTitle.includes('ai') || itemSummary.includes('acoustic');
          if (!match) return false;
        } else if (selectedDomain === 'vlsi') {
          const match = itemTags.some((t) => t.includes('vlsi') || t.includes('verilog') || t.includes('fpga') || t.includes('risc-v') || t.includes('silicon')) || itemTitle.includes('risc-v');
          if (!match) return false;
        } else if (selectedDomain === 'web') {
          const match = itemTags.some((t) => t.includes('next.js') || t.includes('web') || t.includes('typescript') || t.includes('prisma')) || itemTitle.includes('platform');
          if (!match) return false;
        }
      }

      // 3. Unit Filter
      if (selectedUnit !== 'ALL') {
        const chapterSlug = (item.chapter?.slug || item.chapterSlug || item.chapterId || '').toLowerCase();
        if (selectedUnit === 'sb' && !chapterSlug.includes('sb') && !chapterSlug.includes('branch')) return false;
        if (selectedUnit === 'eds' && !chapterSlug.includes('eds')) return false;
        if (selectedUnit === 'wie' && !chapterSlug.includes('wie')) return false;
      }

      // 4. Keyword Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags) return false;
      }

      return true;
    });
  }, [initialProjects, activeStatus, selectedDomain, selectedUnit, searchQuery]);

  // Tab counters
  const counts = useMemo(() => {
    return {
      all: initialProjects.length,
      ongoing: initialProjects.filter((p) => (p.status || '').toLowerCase() === 'ongoing').length,
      completed: initialProjects.filter((p) => (p.status || '').toLowerCase() === 'completed').length,
      featured: initialProjects.filter((p) => p.featured).length,
    };
  }, [initialProjects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  return (
    <div className="space-y-8">
      {/* 1. Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200 dark:border-gray-800">
        {[
          { id: 'ALL', label: 'All Projects', count: counts.all },
          { id: 'Ongoing', label: '● In Active Development', count: counts.ongoing },
          { id: 'Completed', label: '✓ Completed & Published', count: counts.completed },
          ...(counts.featured > 0 ? [{ id: 'Featured', label: '⭐ Flagship Builds', count: counts.featured }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveStatus(tab.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeStatus === tab.id
                ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeStatus === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-warm-200/60 dark:bg-gray-800 text-warm-500 dark:text-gray-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Filter & Search Controls Bar */}
      <div className="bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200 dark:border-gray-800 p-4 sm:p-5 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-400 dark:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by project name, summary, tech tag, or microcontroller..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-xs text-ink dark:text-gray-100 placeholder-warm-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-400 hover:text-ink dark:hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Domain Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-xs font-mono text-warm-400 dark:text-gray-400 mr-1 hidden sm:inline">Domain:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Hardware & IoT', value: 'hardware' },
            { label: 'AI / TinyML', value: 'ai-ml' },
            { label: 'RISC-V / VLSI', value: 'vlsi' },
            { label: 'Web & Cloud', value: 'web' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setSelectedDomain(item.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedDomain === item.value
                  ? 'bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 border border-ieee-blue/40 font-bold shadow-xs'
                  : 'bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-warm-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Counter */}
      {(searchQuery || selectedDomain !== 'ALL' || activeStatus !== 'ALL' || selectedUnit !== 'ALL') && (
        <div className="flex items-center justify-between text-xs text-warm-400 dark:text-gray-400 px-1">
          <span>
            Showing <strong className="text-ink dark:text-gray-200">{filteredProjects.length}</strong> matching projects
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveStatus('ALL');
              setSelectedDomain('ALL');
              setSelectedUnit('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="text-ieee-blue dark:text-sky-400 hover:underline font-mono"
          >
            Reset all filters ✕
          </button>
        </div>
      )}

      {/* 3. Projects Grid */}
      {paginatedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedProjects.map((project) => (
            <div
              key={project.id}
              className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all duration-300 group shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="ieee">{project.year}</Badge>
                    {project.chapter && <Badge variant="neutral">{project.chapter.name}</Badge>}
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      project.status?.toLowerCase() === 'ongoing'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-warm-500 dark:text-gray-400'
                    }`}
                  >
                    ● {project.status}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  {project.summary}
                </p>

                {/* Tech Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-warm-500 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-500 hover:text-ink dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>GitHub ↗</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-500 hover:text-ink dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Demo ↗</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="text-ieee-blue dark:text-sky-400 font-bold hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
                >
                  <span>Case Study</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
          <span className="text-3xl">🛠️</span>
          <h4 className="font-serif text-lg text-ink dark:text-gray-200 font-normal">
            No matching technical projects found
          </h4>
          <p className="text-xs text-warm-400 dark:text-gray-400 max-w-sm mx-auto">
            We couldn&apos;t find any project matching your selected domain or search query. Try clearing the search bar or switching tabs.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveStatus('ALL');
              setSelectedDomain('ALL');
              setSelectedUnit('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="mt-2 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-ieee-blue text-white text-xs font-semibold shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}

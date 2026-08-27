'use client';

/**
 * @file src/components/content/ProjectsFilter.tsx
 * @description Interactive filtering and search engine for IEEE MAIT Technical Projects with react-icons.
 * 
 * FEATURES:
 * - Status Filter Tabs: All | Active Development | Completed | Featured with react-icons.
 * - Domain Selector Pills: All | Hardware & Embedded | AI / ML | Web & Cloud | VLSI.
 * - Unit Filter Pills: All | SB | EDS Chapter | WIE AG.
 * - Live Search across title, summary, and tech tags.
 * - Interactive Project Cards with GitHub & Demo CTAs.
 * - Responsive Pagination.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import Link from '@/components/ui/AppLink';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { FiSearch, FiX, FiCheck, FiStar, FiRadio, FiCpu, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';

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
  chapter?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProjectsFilterProps {
  initialProjects: ProjectItem[];
}

const ITEMS_PER_PAGE = 6;

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ initialProjects }) => {
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: initialProjects.length,
      ongoing: initialProjects.filter((p) => p.status?.toLowerCase() === 'ongoing').length,
      completed: initialProjects.filter((p) => p.status?.toLowerCase() === 'completed').length,
      featured: initialProjects.filter((p) => p.featured).length,
    };
  }, [initialProjects]);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Status Filter
      if (activeStatus === 'Ongoing' && project.status?.toLowerCase() !== 'ongoing') return false;
      if (activeStatus === 'Completed' && project.status?.toLowerCase() !== 'completed') return false;
      if (activeStatus === 'Featured' && !project.featured) return false;

      // 2. Unit Filter
      if (selectedUnit !== 'ALL') {
        const pSlug = (project.chapter?.slug || project.chapterSlug || '').toLowerCase();
        if (selectedUnit === 'sb' && pSlug !== 'sb' && pSlug !== '') return false;
        if (selectedUnit === 'eds' && !pSlug.includes('eds')) return false;
        if (selectedUnit === 'wie' && !pSlug.includes('wie')) return false;
      }

      // 3. Domain Filter
      if (selectedDomain !== 'ALL') {
        const textToSearch = [
          project.title,
          project.summary,
          ...(project.tags || []),
        ].join(' ').toLowerCase();

        if (selectedDomain === 'hardware' && !textToSearch.includes('hardware') && !textToSearch.includes('iot') && !textToSearch.includes('embedded') && !textToSearch.includes('stm32') && !textToSearch.includes('esp32')) return false;
        if (selectedDomain === 'ai-ml' && !textToSearch.includes('ai') && !textToSearch.includes('ml') && !textToSearch.includes('vision') && !textToSearch.includes('neural') && !textToSearch.includes('tinyml')) return false;
        if (selectedDomain === 'vlsi' && !textToSearch.includes('vlsi') && !textToSearch.includes('risc') && !textToSearch.includes('verilog') && !textToSearch.includes('fpga')) return false;
        if (selectedDomain === 'web' && !textToSearch.includes('web') && !textToSearch.includes('cloud') && !textToSearch.includes('fullstack') && !textToSearch.includes('next.js')) return false;
      }

      // 4. Keyword Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesSummary = project.summary.toLowerCase().includes(q);
        const matchesTags = (project.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesYear = project.year.toLowerCase().includes(q);

        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesYear) return false;
      }

      return true;
    });
  }, [initialProjects, activeStatus, selectedUnit, selectedDomain, searchQuery]);

  // Pagination slice
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
          { id: 'ALL', label: 'All Projects', count: counts.all, icon: null },
          { id: 'Ongoing', label: 'In Active Development', count: counts.ongoing, icon: FiRadio, iconColor: 'text-emerald-500' },
          { id: 'Completed', label: 'Completed & Published', count: counts.completed, icon: FiCheck, iconColor: 'text-sky-500' },
          ...(counts.featured > 0 ? [{ id: 'Featured', label: 'Flagship Builds', count: counts.featured, icon: FiStar, iconColor: 'text-amber-500' }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveStatus(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeStatus === tab.id
                  ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                  : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40'
              }`}
            >
              {Icon && <Icon className={`w-3 h-3 ${activeStatus === tab.id ? 'text-white' : tab.iconColor}`} />}
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
          );
        })}
      </div>

      {/* 2. Filter & Search Controls Bar */}
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
            placeholder="Search by project name, summary, tech tag, or microcontroller..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-xs text-ink dark:text-gray-100 placeholder-warm-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-400 hover:text-ink dark:hover:text-white text-xs cursor-pointer"
            >
              <FiX className="w-4 h-4" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
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
            className="text-ieee-blue dark:text-sky-400 hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>Reset all filters</span>
            <FiX className="w-3.5 h-3.5" />
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
                    className={`font-mono text-[11px] font-bold flex items-center gap-1 ${
                      project.status?.toLowerCase() === 'ongoing'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-warm-500 dark:text-gray-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{project.status}</span>
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
                      className="text-warm-500 hover:text-ink dark:hover:text-white flex items-center gap-1.5 transition-colors"
                      aria-label="View on GitHub"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <FiExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-500 hover:text-ink dark:hover:text-white flex items-center gap-1.5 transition-colors"
                      aria-label="View Live Demo"
                    >
                      <span>Demo</span>
                      <FiExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="text-ieee-blue dark:text-sky-400 font-bold hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
                >
                  <span>Case Study</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 mx-auto">
            <FiCpu className="w-6 h-6" />
          </div>
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
            className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-mono font-semibold transition-colors inline-block cursor-pointer shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}

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
};

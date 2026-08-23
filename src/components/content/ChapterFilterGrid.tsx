'use client';

import React, { useState } from 'react';
import { ChapterPanel, ChapterPanelProps } from './ChapterPanel';

interface ChapterFilterGridProps {
  chapters: ChapterPanelProps[];
}

type FilterCategory = 'ALL' | 'TECHNICAL' | 'AFFINITY';

export const ChapterFilterGrid: React.FC<ChapterFilterGridProps> = ({ chapters }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('ALL');

  const filteredChapters = chapters.filter((ch) => {
    if (selectedFilter === 'ALL') return true;
    const typeLower = (ch.type || '').toLowerCase();
    if (selectedFilter === 'TECHNICAL') {
      return typeLower.includes('technical') || typeLower.includes('chapter');
    }
    if (selectedFilter === 'AFFINITY') {
      return typeLower.includes('affinity') || typeLower.includes('group');
    }
    return true;
  });

  const technicalCount = chapters.filter((ch) => {
    const t = (ch.type || '').toLowerCase();
    return t.includes('technical') || t.includes('chapter');
  }).length;

  const affinityCount = chapters.filter((ch) => {
    const t = (ch.type || '').toLowerCase();
    return t.includes('affinity') || t.includes('group');
  }).length;

  return (
    <div className="space-y-8">
      {/* Filter Tabs Navigation */}
      <div
        role="tablist"
        aria-label="Filter chapters by classification"
        className="flex items-center gap-2 border-b border-warm-200 pb-px overflow-x-auto"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedFilter === 'ALL'}
          onClick={() => setSelectedFilter('ALL')}
          className={`font-mono text-xs uppercase tracking-wider py-2.5 px-4 border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
            selectedFilter === 'ALL'
              ? 'border-ieee-blue text-ieee-blue font-semibold bg-ieee-subtle/40'
              : 'border-transparent text-warm-400 hover:text-ink hover:border-warm-300'
          }`}
        >
          All Units ({chapters.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selectedFilter === 'TECHNICAL'}
          onClick={() => setSelectedFilter('TECHNICAL')}
          className={`font-mono text-xs uppercase tracking-wider py-2.5 px-4 border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
            selectedFilter === 'TECHNICAL'
              ? 'border-ieee-blue text-ieee-blue font-semibold bg-ieee-subtle/40'
              : 'border-transparent text-warm-400 hover:text-ink hover:border-warm-300'
          }`}
        >
          Technical Chapters ({technicalCount})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selectedFilter === 'AFFINITY'}
          onClick={() => setSelectedFilter('AFFINITY')}
          className={`font-mono text-xs uppercase tracking-wider py-2.5 px-4 border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
            selectedFilter === 'AFFINITY'
              ? 'border-purple-600 text-purple-700 font-semibold bg-purple-50/60'
              : 'border-transparent text-warm-400 hover:text-ink hover:border-warm-300'
          }`}
        >
          Affinity Groups ({affinityCount})
        </button>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredChapters.map((ch) => (
          <ChapterPanel
            key={ch.slug}
            name={ch.name}
            slug={ch.slug}
            type={ch.type}
            tagline={ch.tagline}
            description={ch.description}
            logoUrl={ch.logoUrl}
            accentColor={ch.accentColor}
            instagramUrl={ch.instagramUrl}
            linkedinUrl={ch.linkedinUrl}
            githubUrl={ch.githubUrl}
            parentSociety={ch.parentSociety}
            establishedYear={ch.establishedYear}
            memberCount={ch.memberCount}
            eventCount={ch.eventCount}
          />
        ))}

        {filteredChapters.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-warm-300 bg-warm-50 rounded-[2px]">
            <p className="font-serif text-lg text-ink mb-1">No units found in this category</p>
            <p className="text-xs font-mono text-warm-400">
              Try selecting &quot;All Units&quot; or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

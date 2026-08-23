'use client';

import React, { useState, useMemo } from 'react';
import { AchievementRow } from './AchievementRow';

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  conferredBy?: string | null;
  unitOrTeam?: string | null;
  category?: string | null;
  description?: string | null;
  imageSrc?: string | null;
  images?: string[];
  people?: Array<{ person?: { id: string; name: string; role?: string; imageUrl?: string } }>;
}

export function AchievementsFilter({ initialAchievements }: { initialAchievements: AchievementItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { label: 'All Achievements', value: 'ALL' },
    { label: 'Section & Global Recognitions', value: 'IEEE Recognition' },
    { label: 'Hackathons & Competitions', value: 'Competition' },
    { label: 'Research & Publications', value: 'Research' },
    { label: 'Individual Honors', value: 'Individual Honor' },
  ];

  const filteredAchievements = useMemo(() => {
    return initialAchievements.filter((item) => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory !== 'ALL') {
        const itemCat = (item.category || '').toLowerCase();
        const selected = selectedCategory.toLowerCase();

        if (selected === 'ieee recognition') {
          matchesCategory = itemCat.includes('ieee') || itemCat.includes('recognition') || itemCat.includes('section');
        } else if (selected === 'competition') {
          matchesCategory = itemCat.includes('competition') || itemCat.includes('hackathon');
        } else if (selected === 'research') {
          matchesCategory = itemCat.includes('research') || itemCat.includes('paper') || itemCat.includes('publication');
        } else if (selected === 'individual honor') {
          matchesCategory = itemCat.includes('individual') || itemCat.includes('honor') || itemCat.includes('award') || itemCat.includes('fellowship');
        } else {
          matchesCategory = itemCat === selected;
        }
      }

      // Search match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const conferredMatch = (item.conferredBy || '').toLowerCase().includes(query);
        const unitMatch = (item.unitOrTeam || '').toLowerCase().includes(query);
        const yearMatch = (item.year || '').toLowerCase().includes(query);
        const descMatch = (item.description || '').toLowerCase().includes(query);

        matchesSearch = titleMatch || conferredMatch || unitMatch || yearMatch || descMatch;
      }

      return matchesCategory && matchesSearch;
    });
  }, [initialAchievements, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Category Filter & Search Strip */}
      <div className="bg-warm-100/50 border border-warm-200 p-4 sm:p-5 rounded-[2px] mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-warm-400 font-semibold uppercase tracking-wider mr-1 text-[11px]">
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-ieee-blue text-white font-bold shadow-xs'
                    : 'bg-white border border-warm-200 text-ink hover:border-ieee-blue hover:text-ieee-blue'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search awards, years, recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-warm-200 px-3 py-1.5 pl-8 text-xs font-sans text-ink placeholder:text-warm-400 rounded-[2px] focus:outline-hidden focus:border-ieee-blue"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-warm-400 hover:text-ink text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="border-t border-warm-200 divide-y divide-warm-200">
        {filteredAchievements.map((item) => (
          <AchievementRow
            key={item.id}
            id={item.id}
            year={item.year}
            title={item.title}
            conferredBy={item.conferredBy || undefined}
            unitOrTeam={item.unitOrTeam || undefined}
            category={item.category || undefined}
            imageSrc={item.imageSrc || undefined}
            images={item.images || []}
          />
        ))}

        {filteredAchievements.length === 0 && (
          <div className="p-12 text-center font-sans text-sm text-warm-400 border-b border-warm-200 space-y-2">
            <p className="font-serif text-lg text-ink font-normal">No matching records found</p>
            <p className="text-xs text-warm-400 font-mono">
              Try adjusting your search query or selecting a different category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

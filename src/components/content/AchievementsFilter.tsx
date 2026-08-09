'use client';

import React, { useState, useMemo } from 'react';
import { AchievementRow } from './AchievementRow';

interface AchievementItem {
  id: string;
  year: string;
  title: string;
  conferredBy?: string | null;
  unitOrTeam?: string | null;
  category?: string | null;
  description?: string | null;
}

export function AchievementsFilter({ initialAchievements }: { initialAchievements: AchievementItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'ALL') return initialAchievements;
    return initialAchievements.filter(item => item.category === selectedCategory);
  }, [initialAchievements, selectedCategory]);

  return (
    <div>
      {/* Category Filter Bar */}
      <div className="bg-warm-100/60 border border-warm-200 p-4 rounded-[2px] mb-8 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-warm-400 font-semibold uppercase tracking-wider mr-2">Filter Category:</span>
        {[
          { label: 'All Achievements', value: 'ALL' },
          { label: 'IEEE Recognition', value: 'IEEE Recognition' },
          { label: 'Competitions', value: 'Competition' },
          { label: 'Awards', value: 'Award' },
        ].map(item => (
          <button
            key={item.value}
            onClick={() => setSelectedCategory(item.value)}
            className={`px-3 py-1.5 rounded-[2px] transition-colors ${
              selectedCategory === item.value
                ? 'bg-ieee-blue text-white font-bold'
                : 'bg-white border border-warm-200 text-ink hover:border-ieee-blue'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="border-t border-warm-200">
        {filteredAchievements.map(item => (
          <AchievementRow
            key={item.id}
            year={item.year}
            title={item.title}
            conferredBy={item.conferredBy || undefined}
            unitOrTeam={item.unitOrTeam || undefined}
            category={item.category || undefined}
          />
        ))}

        {filteredAchievements.length === 0 && (
          <div className="p-8 text-center font-sans text-sm text-warm-400">
            No achievements match your selected category filter.
          </div>
        )}
      </div>
    </div>
  );
}

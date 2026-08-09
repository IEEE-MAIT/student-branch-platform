'use client';

/**
 * @file src/app/achievements/page.tsx
 * @description Historical achievements ledger with interactive category filter and year search.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ACHIEVEMENTS_DATA } from '@/lib/data';

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'ALL') return ACHIEVEMENTS_DATA;
    return ACHIEVEMENTS_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Historical Record"
            title="Achievements Ledger"
            subtitle="Permanent institutional record of awards, competitions, and branch recognitions."
          />

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
                conferredBy={item.conferredBy}
                unitOrTeam={item.unitOrTeam}
                category={item.category}
              />
            ))}

            {filteredAchievements.length === 0 && (
              <div className="p-8 text-center font-sans text-sm text-warm-400">
                No achievements match your selected category filter.
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

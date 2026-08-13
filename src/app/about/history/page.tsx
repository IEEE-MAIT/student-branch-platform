/**
 * @file src/app/about/history/page.tsx
 * @description Institutional History & Milestones page — dynamic from DB with static fallback.
 *
 * Fetches from the milestones table. Falls back to MILESTONES_DATA from data.ts
 * if the table is empty (before seeding) so the page is never blank.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getDynamicMilestones } from '@/lib/api';
import { MILESTONES_DATA } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 3600; // Milestones change rarely — 1-hour cache

export const metadata: Metadata = {
  title: 'History & Milestones | IEEE MAIT Student Branch',
  description:
    'Tracing over two decades of growth, chapter charters, IEEE recognition, and institutional impact at Maharaja Agrasen Institute of Technology since 2005.',
};

export default async function HistoryPage() {
  interface MilestoneItem {
    year: string | number;
    title: string;
    description?: string | null;
    category?: string | null;
  }

  const dbMilestones = await getDynamicMilestones();

  // Fallback to static data if DB has nothing yet
  const milestones: MilestoneItem[] =
    dbMilestones.length > 0
      ? dbMilestones.map((m: any) => ({
          year: m.year,
          title: m.title,
          description: m.description ?? '',
          category: m.category,
        }))
      : MILESTONES_DATA;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'History & Milestones' },
            ]}
          />

          <SectionHeading
            category="Institutional Timeline"
            title="History & Key Milestones"
            subtitle="Tracing two decades of growth, chapter charters, and institutional impact at MAIT."
          />

          <div className="max-w-3xl mx-auto pt-12">
            {/* Category legend */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { label: 'Establishment', color: 'bg-ieee-blue' },
                { label: 'Award / Recognition', color: 'bg-mait-warm' },
                { label: 'Chapter Charter', color: 'bg-warm-400' },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-1.5 font-mono text-xs text-warm-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${cat.color}`} />
                  {cat.label}
                </div>
              ))}
            </div>

            <div className="relative border-l-2 border-warm-200 pl-8 space-y-12 ml-4 sm:ml-8">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-white border-2 border-ieee-blue group-hover:bg-ieee-blue transition-colors duration-200" />

                  <span className="font-mono text-sm font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px] inline-block mb-2">
                    {milestone.year}
                  </span>

                  <h3 className="font-serif text-2xl text-ink font-normal leading-snug">
                    {milestone.title}
                  </h3>

                  {milestone.description && (
                    <p className="text-sm text-warm-400 font-sans mt-1.5 leading-relaxed">
                      {milestone.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Source note */}
            <div className="mt-16 pt-6 border-t border-warm-200">
              <p className="font-mono text-xs text-warm-300">
                {dbMilestones.length > 0
                  ? `${milestones.length} milestones loaded from database.`
                  : 'Milestones loaded from static record. Upload new milestones via the Admin panel.'}
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

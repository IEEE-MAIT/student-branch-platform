/**
 * @file src/app/people/archive/page.tsx
 * @description Leadership Archive Directory — Historical ExeCom records by academic year with react-icons.
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
import Link from '@/components/ui/AppLink';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leadership Archive | IEEE MAIT Student Branch',
  description:
    'Historical record of IEEE MAIT Student Branch executive committees across academic years since 2005.',
};

// Academic years for which archive records exist (past 20+ years back to 2005–06)
const ARCHIVE_YEARS = Array.from({ length: 21 }, (_, i) => {
  const start = 2025 - i;
  const end = (start + 1).toString().slice(-2);
  return {
    label: `${start}–${end}`,
    slug: `${start}-${end}`,
    isCurrent: i === 0,
    decade: start >= 2020 ? '2020s' : start >= 2010 ? '2010s' : '2000s',
  };
});

export default function PeopleArchivePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People', href: '/people' },
              { label: 'Leadership Archive' },
            ]}
          />

          <SectionHeading
            category="Historical Record"
            title="Leadership Archive"
            subtitle="Past executive committees, student chairpersons, and organizational leadership across academic years since 2005."
          />

          <div className="pt-8 max-w-3xl space-y-8">
            {/* Decade Grouped Grid */}
            <div className="space-y-6">
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-warm-200 dark:divide-gray-800 rounded-xl overflow-hidden shadow-xs">
                {ARCHIVE_YEARS.map((year) => (
                  <Link
                    key={year.slug}
                    href={`/people/archive/${year.slug}`}
                    className="flex items-center justify-between px-6 py-4.5 bg-white dark:bg-gray-900 hover:bg-warm-50 dark:hover:bg-gray-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-sm font-bold text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                          Academic Session {year.label}
                        </span>
                        <p className="text-[11px] text-warm-400 dark:text-gray-500 font-sans">
                          {year.isCurrent ? 'Current Serving Committee' : 'Historical Term Roster'}
                        </p>
                      </div>
                      {year.isCurrent && (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-300 rounded-full border border-ieee-blue/20 dark:border-sky-800">
                          Active Term
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                      <span>View Roster</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Historical Documentation Note */}
            <div className="p-5 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2">
              <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                Institutional Ledger
              </span>
              <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                Leadership records and student membership ledgers prior to 2021–22 are preserved in physical branch records at Maharaja Agrasen Institute of Technology. Contact the branch secretary or webmaster to request historical certifications.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

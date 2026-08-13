/**
 * @file src/app/people/archive/page.tsx
 * @description Leadership Archive — past executive committees by academic year.
 * Links to per-year pages when those exist. Currently shows known years.
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
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leadership Archive | IEEE MAIT Student Branch',
  description:
    'Historical record of IEEE MAIT Student Branch executive committees across academic years since 2005.',
};

// Academic years for which archive pages exist or will exist (past 20 years back to 2005–06)
const ARCHIVE_YEARS = Array.from({ length: 21 }, (_, i) => {
  const start = 2025 - i;
  const end = (start + 1).toString().slice(-2);
  return {
    label: `${start}–${end}`,
    slug: `${start}-${end}`,
    isCurrent: i === 0,
  };
});

export default function PeopleArchivePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
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
            subtitle="Past executive committees and organizational leadership across academic years."
          />

          <div className="pt-8 max-w-2xl">
            <div className="border border-warm-200 divide-y divide-warm-200 rounded-[2px]">
              {ARCHIVE_YEARS.map((year) => (
                <Link
                  key={year.slug}
                  href={`/people/archive/${year.slug}`}
                  className="flex items-center justify-between px-6 py-4 bg-white hover:bg-warm-100/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-ink group-hover:text-ieee-blue transition-colors">
                      {year.label}
                    </span>
                    {year.isCurrent && (
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-ieee-subtle text-ieee-blue rounded-[2px] border border-ieee-blue/20">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-warm-300 group-hover:text-ieee-blue transition-colors">
                    View Roster →
                  </span>
                </Link>
              ))}
            </div>

            <div className="pt-6">
              <p className="font-mono text-xs text-warm-300">
                Leadership records prior to 2021–22 are maintained in physical branch records at MAIT.
                Contact the branch secretary to request historical documentation.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

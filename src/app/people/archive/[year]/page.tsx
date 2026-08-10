/**
 * @file src/app/people/archive/[year]/page.tsx
 * @description Dynamic Leadership Archive Roster for a specific Academic Year (e.g. 2024-25).
 * 
 * BRAND & UX SPECIFICATIONS:
 * - Decodes academic year URL parameters (e.g. 2024-25 -> 2024–25).
 * - Provides interactive academic year tabs to quickly navigate between archive terms.
 * - Displays counsellors, SEC officers, leads, and chapter executives for that term.
 * - Shows an institutional archived notice if physical records exist for past terms.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PersonCard } from '@/components/content/PersonCard';
import { getDynamicPeopleByAcademicYear } from '@/lib/api';
import Link from 'next/link';

interface LeadershipArchiveYearPageProps {
  params: Promise<{ year: string }>;
}

const KNOWN_ARCHIVE_YEARS = Array.from({ length: 21 }, (_, i) => {
  const start = 2025 - i;
  const end = (start + 1).toString().slice(-2);
  return {
    label: `${start}–${end}`,
    slug: `${start}-${end}`,
    isCurrent: i === 0,
  };
});

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: LeadershipArchiveYearPageProps) {
  const resolvedParams = await params;
  const rawYear = resolvedParams.year;
  const displayYear = rawYear.replace('-', '–');

  return {
    title: `Leadership Roster ${displayYear} | IEEE MAIT Student Branch`,
    description: `Executive committee and operational leadership roster for IEEE MAIT Student Branch during academic year ${displayYear}.`,
    openGraph: {
      title: `Leadership Roster ${displayYear} | IEEE MAIT`,
      description: `Official leadership record of IEEE MAIT Student Branch for ${displayYear}.`,
    },
  };
}

export default async function LeadershipArchiveYearPage({ params }: LeadershipArchiveYearPageProps) {
  const resolvedParams = await params;
  const rawYear = resolvedParams.year;
  const displayYear = rawYear.replace('-', '–');

  const peopleForYear = await getDynamicPeopleByAcademicYear(rawYear);

  const counsellors = peopleForYear.filter((p: any) => p.category === 'Counsellor' || p.category === 'Counsellor / Mentor');
  const sec = peopleForYear.filter((p: any) => p.category === 'SEC' || p.category === 'Senior Executive Committee');
  const webAndOp = peopleForYear.filter((p: any) => p.category === 'Web' || p.category === 'Operations' || p.category === 'Operational Leads' || p.category === 'Operational' || p.category === 'Lead');
  const chapterLeads = peopleForYear.filter((p: any) => p.category === 'EDS Chapter' || p.category === 'Affinity Group' || p.category === 'EDS' || p.category === 'WIE' || p.category === 'Chapter');

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People', href: '/people' },
              { label: 'Leadership Archive', href: '/people/archive' },
              { label: displayYear },
            ]}
          />

          <SectionHeading
            category="Leadership Archive"
            title={`Leadership Roster — ${displayYear}`}
            subtitle={`The Executive Committee, Faculty Counsellors, and Operational Leads who served during academic year ${displayYear}.`}
          />

          {/* Academic Year Tab Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-12 border-b border-warm-200">
            <span className="font-mono text-xs font-semibold text-warm-400 uppercase tracking-wider mr-2">
              Select Year:
            </span>
            {KNOWN_ARCHIVE_YEARS.map((y) => {
              const isSelected = y.slug === rawYear || y.label === displayYear;
              return (
                <Link
                  key={y.slug}
                  href={`/people/archive/${y.slug}`}
                  className={`px-3 py-1.5 font-mono text-xs rounded-[2px] transition-colors ${
                    isSelected
                      ? 'bg-ieee-blue text-white font-semibold'
                      : 'bg-warm-100/70 text-ink hover:bg-ieee-subtle hover:text-ieee-blue border border-warm-200'
                  }`}
                >
                  {y.label} {y.isCurrent ? '(Current)' : ''}
                </Link>
              );
            })}
          </div>

          {/* Counsellors & Mentors */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Branch Mentors & Counsellors ({displayYear})
            </h3>
            {counsellors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {counsellors.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 italic bg-warm-100/40 p-4 border border-warm-200 rounded-[2px]">
                Faculty mentors for {displayYear} are recorded in IEEE MAIT institutional archives.
              </p>
            )}
          </div>

          {/* Senior Executive Committee */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Senior Executive Committee ({displayYear})
            </h3>
            {sec.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sec.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 italic bg-warm-100/40 p-4 border border-warm-200 rounded-[2px]">
                Executive Committee records for {displayYear} are digitized as part of the annual transition record.
              </p>
            )}
          </div>

          {/* Operational Leads & Chapter Executives */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Operational Leads & Chapter Officers ({displayYear})
            </h3>
            {webAndOp.length > 0 || chapterLeads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...webAndOp, ...chapterLeads].map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 italic bg-warm-100/40 p-4 border border-warm-200 rounded-[2px]">
                Operational leads for {displayYear} are documented in branch annual reports available in Resources.
              </p>
            )}
          </div>

          {/* Back to main archive link */}
          <div className="pt-8 border-t border-warm-200 flex justify-between items-center">
            <Link
              href="/people/archive"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ieee-blue hover:underline"
            >
              ← Back to All Leadership Archive Years
            </Link>
            <span className="font-mono text-xs text-warm-300">
              IEEE MAIT Institutional Record · Est. 2005
            </span>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

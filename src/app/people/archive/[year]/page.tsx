/**
 * @file src/app/people/archive/[year]/page.tsx
 * @description Dynamic Leadership Archive Roster for a specific Academic Year (e.g. 2024-25).
 * 
 * BRAND & UX SPECIFICATIONS:
 * - Decodes academic year URL parameters (e.g. 2024-25 -> 2024–25).
 * - Provides interactive academic year tabs to quickly navigate between archive terms.
 * - Displays counsellors, SEC officers, leads, and chapter executives for that term.
 * - Features Annual Dossier Statistics Summary and Annual Activity Report access.
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
import { StatMetric } from '@/components/content/StatMetric';
import { Button } from '@/components/ui/Button';
import { getDynamicPeopleByAcademicYear } from '@/lib/api';
import { PEOPLE_DATA } from '@/lib/data';
import Link from '@/components/ui/AppLink';

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

  let peopleForYear = await getDynamicPeopleByAcademicYear(rawYear);

  // If no DB records yet exist for this specific past year, fallback gracefully to PEOPLE_DATA for current term
  if (peopleForYear.length === 0 && (rawYear === '2025-26' || displayYear === '2025–26')) {
    peopleForYear = PEOPLE_DATA;
  }

  const counsellors = peopleForYear.filter(
    (p: any) => p.category === 'Counsellor' || p.category === 'Counsellor / Mentor' || p.category === 'Mentor'
  );
  const sec = peopleForYear.filter(
    (p: any) => p.category === 'SEC' || p.category === 'Senior Executive Committee' || p.category === 'Executive'
  );
  const webAndOp = peopleForYear.filter(
    (p: any) =>
      p.category === 'Web' ||
      p.category === 'Operations' ||
      p.category === 'Operational Leads' ||
      p.category === 'Operational' ||
      p.category === 'Lead'
  );
  const chapterLeads = peopleForYear.filter(
    (p: any) =>
      p.category === 'EDS Chapter' ||
      p.category === 'Affinity Group' ||
      p.category === 'EDS' ||
      p.category === 'WIE' ||
      p.category === 'Chapter'
  );

  const totalOfficers = peopleForYear.length;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
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
            category="Annual Institutional Dossier"
            title={`Leadership Roster — ${displayYear}`}
            subtitle={`The Executive Committee, Faculty Counsellors, and Operational Leads who served during academic year ${displayYear}.`}
          />

          {/* Academic Year Tab Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b border-warm-200">
            <span className="font-mono text-xs font-semibold text-warm-400 uppercase tracking-wider mr-2">
              Select Term:
            </span>
            {KNOWN_ARCHIVE_YEARS.slice(0, 10).map((y) => {
              const isSelected = y.slug === rawYear || y.label === displayYear;
              return (
                <Link
                  key={y.slug}
                  href={`/people/archive/${y.slug}`}
                  className={`px-3 py-1.5 font-mono text-xs rounded-[2px] transition-all ${
                    isSelected
                      ? 'bg-ieee-blue text-white font-semibold shadow-xs'
                      : 'bg-warm-100/70 text-ink hover:bg-ieee-subtle hover:text-ieee-blue border border-warm-200'
                  }`}
                >
                  {y.label} {y.isCurrent ? '(Current)' : ''}
                </Link>
              );
            })}
          </div>

          {/* Annual Session Metrics Strip */}
          <div className="border border-warm-200 bg-warm-100/30 p-6 rounded-[2px] mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200">
              <StatMetric
                label="Officers on Record"
                value={`${totalOfficers > 0 ? totalOfficers : 'Archived'}`}
                description="Serving Executive Team"
              />
              <StatMetric
                label="Parent Unit"
                value="IEEE Delhi"
                description="Section Charter"
              />
              <StatMetric
                label="Academic Session"
                value={displayYear}
                description="Institutional Year"
              />
              <StatMetric
                label="Archive Status"
                value={totalOfficers > 0 ? 'Verified' : 'Physical Archive'}
                description="MAIT Branch Ledger"
              />
            </div>
          </div>

          {/* Annual Activity Report Banner */}
          <div className="border border-ieee-blue/20 bg-ieee-subtle/30 p-6 rounded-[2px] mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ieee-blue block">
                Session Documentation
              </span>
              <h4 className="font-serif text-xl text-ink font-normal mt-0.5">
                Annual Activity & Transition Report ({displayYear})
              </h4>
              <p className="text-xs text-warm-400 font-sans mt-1">
                Official branch report detailing symposiums, financial audits, technical competitions, and executive transitions for {displayYear}.
              </p>
            </div>
            <Button href="/resources" variant="secondary" size="md" className="shrink-0 font-mono text-xs">
              View Activity Reports →
            </Button>
          </div>

          {/* Counsellors & Mentors */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue">
                Branch Mentors & Counsellors ({displayYear})
              </h3>
              <span className="font-mono text-xs text-warm-400">
                {counsellors.length} Faculty Mentors
              </span>
            </div>

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
                    imageSrc={person.imageSrc}
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
                Faculty mentor records for {displayYear} are recorded in IEEE MAIT institutional archives.
              </p>
            )}
          </div>

          {/* Senior Executive Committee */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue">
                Senior Executive Committee ({displayYear})
              </h3>
              <span className="font-mono text-xs text-warm-400">
                {sec.length} Officers
              </span>
            </div>

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
                    imageSrc={person.imageSrc}
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
                Executive Committee records for {displayYear} are preserved in the branch physical ledger.
              </p>
            )}
          </div>

          {/* Operational Leads & Chapter Executives */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue">
                Operational Leads & Chapter Officers ({displayYear})
              </h3>
              <span className="font-mono text-xs text-warm-400">
                {webAndOp.length + chapterLeads.length} Leads
              </span>
            </div>

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
                    imageSrc={person.imageSrc}
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
                Operational leads for {displayYear} are documented in the branch annual reports available in Resources.
              </p>
            )}
          </div>

          {/* Back to main archive link */}
          <div className="pt-8 border-t border-warm-200 flex justify-between items-center flex-wrap gap-4">
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

/**
 * @file src/app/people/page.tsx
 * @description People & Leadership Directory with react-icons.
 * 
 * DESIGN SPECIFICATIONS:
 * - Academic Year Pill Filter: 2025–26 (Current), 2024–25, 2023–24, etc.
 * - Hierarchy Hierarchy:
 *   1. Faculty Mentors (Branch Counselor & Advisor) — large portrait layout.
 *   2. Senior Executive Committee (Chairperson, Vice Chair, Secretary, Hardware Head, Treasurer, Webmaster) — 4-column grid.
 *   3. Chapter & Affinity Group Leads (EDS Chair, WIE Chair, SIG Leads) — 3-column grid.
 *   4. Operational & Technical Leads (PR, Logistics, Design, Content).
 * - Full SSR hydration with ISR revalidation.
 * - Unified react-icons system.
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
import { PersonCard } from '@/components/content/PersonCard';
import { getDynamicPeople } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import { FiClock, FiBookOpen, FiAward, FiZap, FiCpu, FiArrowRight } from 'react-icons/fi';

export const metadata = {
  title: 'People & Leadership Directory | IEEE MAIT Student Branch',
  description: 'Meet the executive committee, branch counselors, technical chapter chairs, and student volunteers leading IEEE MAIT.',
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function PeoplePage() {
  const allPeople = await getDynamicPeople();

  // Sort people into standardized hierarchical groups
  const counsellors = allPeople.filter((p: any) => 
    p.category === 'Counsellor / Mentor' || 
    p.category === 'Counsellor' || 
    p.hierarchy === 'mentor' ||
    p.role?.toLowerCase().includes('counselor') ||
    p.role?.toLowerCase().includes('advisor')
  );

  const sec = allPeople.filter((p: any) => 
    (p.category === 'Senior Executive Committee' || 
     p.category === 'ExeCom' || 
     p.hierarchy === 'featured' ||
     p.role?.toLowerCase().includes('chair') ||
     p.role?.toLowerCase().includes('secretary') ||
     p.role?.toLowerCase().includes('treasurer') ||
     p.role?.toLowerCase().includes('hardware head') ||
     p.role?.toLowerCase().includes('webmaster')) &&
    !counsellors.some((c: any) => c.id === p.id)
  );

  const chapterLeads = allPeople.filter((p: any) => 
    (p.category === 'Chapter Leads' || 
     p.category === 'Affinity Group Leads' || 
     p.category === 'SIG Leads' || 
     p.role?.toLowerCase().includes('eds') ||
     p.role?.toLowerCase().includes('wie')) &&
    !counsellors.some((c: any) => c.id === p.id) &&
    !sec.some((s: any) => s.id === p.id)
  );

  const webAndOp = allPeople.filter((p: any) => 
    !counsellors.some((c: any) => c.id === p.id) &&
    !sec.some((s: any) => s.id === p.id) &&
    !chapterLeads.some((cl: any) => cl.id === p.id)
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="wide">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People & Leadership' },
            ]}
          />

          {/* Header Banner with Direct Link to Leadership Archive */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-warm-200 dark:border-gray-800 pb-8">
            <SectionHeading
              category="Organization Map"
              title="People & Leadership"
              subtitle="The Branch Counsellor, Senior Executive Committee, Operational Leads, and Chapter Officers guiding IEEE MAIT."
              className="mb-0"
            />

            <Link
              href="/people/archive"
              className="inline-flex items-center gap-2 px-4 py-2 bg-warm-100 dark:bg-gray-800 hover:bg-ieee-subtle dark:hover:bg-sky-950 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 border border-warm-200 dark:border-gray-700 rounded-xl font-mono text-xs font-semibold transition-all shrink-0 self-start md:self-auto shadow-xs"
            >
              <FiClock className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
              <span>Leadership Archive (2005–Present)</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 1. Branch Mentors & Counsellors */}
          <section className="mb-20 space-y-6">
            <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
              <div className="w-9 h-9 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400">
                <FiBookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                  Branch Mentors & Counsellors
                </h3>
                <p className="text-xs text-warm-400 dark:text-gray-400 font-sans">
                  Institutional mentorship and faculty advisory under Maharaja Agrasen Institute of Technology.
                </p>
              </div>
            </div>

            {counsellors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {counsellors.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || 'Department of Electrical & Electronics Engineering (EEE)'}
                    academicYear={person.academicYear || '2025–26'}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy || 'mentor'}
                    size="mentor"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 bg-warm-50 dark:bg-gray-900 p-6 rounded-xl border border-warm-200 dark:border-gray-800">
                No faculty counselor records found.
              </p>
            )}
          </section>

          {/* 2. Senior Executive Committee */}
          <section className="mb-20 space-y-6">
            <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
              <div className="w-9 h-9 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                  Senior Executive Committee (ExeCom)
                </h3>
                <p className="text-xs text-warm-400 dark:text-gray-400 font-sans">
                  Elected branch officers managing operations, strategic partnerships, finances, and section coordination.
                </p>
              </div>
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
                    academicYear={person.academicYear || '2025–26'}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy || 'featured'}
                    size="featured"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 bg-warm-50 dark:bg-gray-900 p-6 rounded-xl border border-warm-200 dark:border-gray-800">
                No Executive Committee records found.
              </p>
            )}
          </section>

          {/* 3. Chapter & Affinity Group Leadership */}
          {chapterLeads.length > 0 && (
            <section className="mb-20 space-y-6">
              <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
                <div className="w-9 h-9 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400">
                  <FiZap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                    Society Chapters & Affinity Group Leadership
                  </h3>
                  <p className="text-xs text-warm-400 dark:text-gray-400 font-sans">
                    Student chairs directing autonomous society sub-units and domain-focused activities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterLeads.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || '2025–26'}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy || 'standard'}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4. Operational & Technical Leads */}
          <section className="mb-20 space-y-6">
            <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
              <div className="w-9 h-9 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400">
                <FiCpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                  Operational & Technical Leads
                </h3>
                <p className="text-xs text-warm-400 dark:text-gray-400 font-sans">
                  Domain heads driving web development, technical workshops, PR, design, and event logistics.
                </p>
              </div>
            </div>

            {webAndOp.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {webAndOp.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || '2025–26'}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy || 'standard'}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 bg-warm-50 dark:bg-gray-900 p-6 rounded-xl border border-warm-200 dark:border-gray-800">
                No operational lead records found.
              </p>
            )}
          </section>

          {/* 5. Leadership Archive Transition Banner */}
          <div className="p-8 border border-warm-200 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/60 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-wider">
                  Historical Record
                </span>
                <span className="font-mono text-[10px] bg-warm-200 dark:bg-gray-800 text-warm-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  Since 2005
                </span>
              </div>
              <h4 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                Past Leadership & Historical ExeCom Archive
              </h4>
              <p className="text-xs text-warm-500 dark:text-gray-300 font-sans max-w-xl leading-relaxed">
                Explore executive committee rosters, leadership tenures, and student contributions across every academic year since our founding in 2005.
              </p>
            </div>

            <Link
              href="/people/archive"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0"
            >
              <span>Explore All Archive Years</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

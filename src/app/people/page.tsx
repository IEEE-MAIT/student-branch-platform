/**
 * @file src/app/people/page.tsx
 * @description People & Leadership Directory for IEEE MAIT Student Branch.
 * 
 * HIERARCHICAL STRUCTURE:
 * 1. Branch Mentors & Counsellors (Faculty Counselor from Dept of EEE)
 * 2. Senior Executive Committee (ExeCom)
 * 3. Society Chapters & Affinity Group Leadership (EDS, WIE, SIGs)
 * 4. Operational & Technical Leads (Webmaster, Technical, PR/Media, Design, Logistics)
 * 5. Historical Leadership Archive Banner
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

export const metadata = {
  title: 'People & Leadership | IEEE MAIT Student Branch',
  description:
    'The Branch Counsellor, Student Mentors, Senior Executive Committee, Operational Leads, and Chapter Executives of IEEE MAIT.',
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function PeoplePage() {
  const allPeople = await getDynamicPeople();

  // Helper check for executive roles
  const isExecutiveRole = (role: string = '') => {
    const r = role.toLowerCase();
    return (
      r.includes('chair') ||
      r.includes('secretary') ||
      r.includes('treasurer') ||
      r.includes('web master') ||
      r.includes('webmaster') ||
      r.includes('head')
    );
  };

  // 1. Counsellors & Mentors (Faculty Counselor & Student Mentors only)
  const counsellors = allPeople.filter((p: any) => {
    const roleLower = (p.role || '').toLowerCase();
    const catLower = (p.category || '').toLowerCase();
    if (isExecutiveRole(p.role) && !roleLower.includes('counsellor') && !roleLower.includes('counselor')) {
      return false;
    }
    return (
      p.isFacultyAdvisor ||
      catLower === 'counsellor' ||
      catLower === 'counsellor / mentor' ||
      catLower === 'mentor' ||
      roleLower.includes('counsellor') ||
      roleLower.includes('counselor') ||
      roleLower === 'mentor' ||
      roleLower.includes('student mentor')
    );
  });

  // 2. Senior Executive Committee (ExeCom)
  const sec = allPeople.filter((p: any) => {
    const catLower = (p.category || '').toLowerCase();
    const roleLower = (p.role || '').toLowerCase();
    if (counsellors.some((c: any) => c.id === p.id)) return false;
    return (
      catLower === 'sec' ||
      catLower === 'senior executive committee' ||
      catLower === 'executive committee' ||
      isExecutiveRole(p.role)
    );
  });

  // 3. Society Chapters & Affinity Group Leadership
  const chapterLeads = allPeople.filter((p: any) => {
    const catLower = (p.category || '').toLowerCase();
    if (counsellors.some((c: any) => c.id === p.id) || sec.some((s: any) => s.id === p.id)) return false;
    return (
      catLower.includes('eds') ||
      catLower.includes('wie') ||
      catLower.includes('chapter') ||
      catLower.includes('affinity')
    );
  });

  // 4. Operational & Technical Leads
  const webAndOp = allPeople.filter((p: any) => {
    if (
      counsellors.some((c: any) => c.id === p.id) ||
      sec.some((s: any) => s.id === p.id) ||
      chapterLeads.some((ch: any) => ch.id === p.id)
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People' },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              category="Organization Map"
              title="People & Leadership"
              subtitle="The Branch Counsellor, Senior Executive Committee, Operational Leads, and Chapter Officers guiding IEEE MAIT."
              className="mb-0"
            />

            <Link
              href="/people/archive"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-100 dark:bg-gray-800 hover:bg-ieee-subtle dark:hover:bg-sky-950 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 border border-warm-200 dark:border-gray-700 rounded-xl font-mono text-xs font-semibold transition-all shrink-0 self-start md:self-auto shadow-xs"
            >
              <span>🏛️ Leadership Archive (2005–Present) →</span>
            </Link>
          </div>

          {/* 1. Branch Mentors & Counsellors */}
          <section className="mb-20 space-y-6">
            <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
              <span className="text-xl">🎓</span>
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
              <span className="text-xl">🏛️</span>
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
                <span className="text-xl">⚡</span>
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
              <span className="text-xl">🛠️</span>
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
              <span>Explore All Archive Years →</span>
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

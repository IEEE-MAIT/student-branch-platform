/**
 * @file src/app/people/page.tsx
 * @description People & Leadership (Server Component) fetching dynamic records from Prisma DB.
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

export const metadata = {
  title: 'People & Leadership | IEEE MAIT Student Branch',
  description: 'The Branch Counsellor, Student Mentors, Senior Executive Committee, Operational Leads, and Chapter Executives of IEEE MAIT.',
};

export const revalidate = 60; // ISR Cache

export default async function PeoplePage() {
  const allPeople = await getDynamicPeople();

  const counsellors = allPeople.filter((p: any) => p.category === 'Counsellor' || p.category === 'Counsellor / Mentor');
  const sec = allPeople.filter((p: any) => p.category === 'SEC' || p.category === 'Senior Executive Committee');
  const chapterLeads = allPeople.filter((p: any) => p.category === 'EDS Chapter' || p.category === 'Affinity Group' || p.category === 'EDS' || p.category === 'WIE' || p.category === 'Chapter');
  const webAndOp = allPeople.filter((p: any) => p.category === 'Web' || p.category === 'Operations' || p.category === 'Operational Leads' || p.category === 'Operational' || p.category === 'Lead');

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People' },
            ]}
          />

          <SectionHeading
            category="Organization Map"
            title="People & Leadership"
            subtitle="The Branch Counsellor, Student Mentors, Senior Executive Committee, Operational Leads, and Chapter Executives guiding IEEE MAIT."
          />

          {/* Counsellors & Mentors */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Branch Mentors & Counsellors
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
                    academicYear={person.academicYear || undefined}
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
              <p className="text-sm font-mono text-warm-400">No records found.</p>
            )}
          </div>

          {/* Senior Executive Committee */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Senior Executive Committee
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
                    academicYear={person.academicYear || undefined}
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
              <p className="text-sm font-mono text-warm-400">No records found.</p>
            )}
          </div>

          {/* Chapter & Affinity Group Leadership */}
          {chapterLeads.length > 0 && (
            <div className="mb-16 space-y-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
                Society Chapter & Affinity Group Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterLeads.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || undefined}
                    imageUrl={person.imageUrl}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Operational Leads */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Operational & Technical Leads
            </h3>
            {webAndOp.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {webAndOp.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || undefined}
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
              <p className="text-sm font-mono text-warm-400">No records found.</p>
            )}
          </div>

          {/* Leadership Archive CTA Banner */}
          <div className="pt-8 border-t border-warm-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-warm-100/40 p-6 rounded-[2px]">
            <div>
              <h4 className="font-serif text-xl text-ink font-normal">Past Leadership & Historical Committees</h4>
              <p className="text-xs text-warm-400 font-sans mt-0.5">
                Explore executive committee rosters and student leadership across previous academic years since 2005.
              </p>
            </div>
            <a
              href="/people/archive"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-ieee-blue text-white font-mono text-xs font-semibold rounded-[2px] hover:bg-ieee-dark transition-colors shrink-0"
            >
              Browse Leadership Archive →
            </a>
          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}

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

  const counsellors = allPeople.filter((p: any) => p.category === 'Counsellor');
  const sec = allPeople.filter((p: any) => p.category === 'SEC');
  const webAndOp = allPeople.filter((p: any) => p.category === 'Web' || p.category === 'Operations');

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
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
                    department={person.department || undefined}
                    academicYear={person.academicYear || undefined}
                    hierarchy={person.hierarchy as any}
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
                    department={person.department || undefined}
                    academicYear={person.academicYear || undefined}
                    hierarchy={person.hierarchy as any}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400">No records found.</p>
            )}
          </div>

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
                    department={person.department || undefined}
                    academicYear={person.academicYear || undefined}
                    hierarchy={person.hierarchy as any}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400">No records found.</p>
            )}
          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}

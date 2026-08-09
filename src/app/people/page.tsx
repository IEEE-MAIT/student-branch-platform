import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PersonCard } from '@/components/content/PersonCard';

export default function PeoplePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Organization Map"
            title="People & Leadership"
            subtitle="The faculty counselors, executive officers, and operational leads guiding IEEE MAIT."
          />

          {/* Section 1: Mentors */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Faculty Mentors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PersonCard
                name="Dr. Faculty Counselor"
                role="Branch Counselor"
                department="Department of Electronics & Communication Engineering"
                academicYear="2025–26"
                hierarchy="mentor"
              />
              <PersonCard
                name="Prof. Co-Counselor Name"
                role="Faculty Advisor"
                department="Department of Computer Science Engineering"
                academicYear="2025–26"
                hierarchy="mentor"
              />
            </div>
          </div>

          {/* Section 2: Senior Executive Committee */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Senior Executive Committee (SEC 2025–26)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <PersonCard
                name="Chairperson Name"
                role="Chairperson"
                department="3rd Year, CSE"
                academicYear="2025–26"
                hierarchy="featured"
              />
              <PersonCard
                name="Vice Chairperson"
                role="Vice Chairperson"
                department="3rd Year, ECE"
                academicYear="2025–26"
                hierarchy="standard"
              />
              <PersonCard
                name="General Secretary"
                role="General Secretary"
                department="3rd Year, IT"
                academicYear="2025–26"
                hierarchy="standard"
              />
              <PersonCard
                name="Joint Secretary"
                role="Joint Secretary"
                department="2nd Year, ECE"
                academicYear="2025–26"
                hierarchy="standard"
              />
            </div>
          </div>

          {/* Section 3: Operational Leads */}
          <div className="space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Operational Leads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PersonCard
                name="Webmaster Lead"
                role="Webmaster"
                department="3rd Year, CSE"
                hierarchy="compact"
              />
              <PersonCard
                name="Creative Lead"
                role="Creative Head"
                department="3rd Year, IT"
                hierarchy="compact"
              />
              <PersonCard
                name="PR & Outreach Head"
                role="PR Lead"
                department="3rd Year, ECE"
                hierarchy="compact"
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

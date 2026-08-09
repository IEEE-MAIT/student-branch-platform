import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PersonCard } from '@/components/content/PersonCard';

export const metadata = {
  title: 'People & Leadership | IEEE MAIT Student Branch',
  description: 'The Branch Counsellor, Student Mentors, Senior Executive Committee, Operational Leads, and Chapter Executives of IEEE MAIT.',
};

export default function PeoplePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Organization Map"
            title="People & Leadership"
            subtitle="The Branch Counsellor, Student Mentors, Senior Executive Committee, Operational Leads, and Chapter Executives guiding IEEE MAIT."
          />

          {/* 1. Branch Counsellor */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Branch Counsellor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PersonCard
                name="Dr. Faculty Counselor"
                role="Branch Counsellor"
                department="Department of Electronics & Communication Engineering"
                academicYear="2025–26"
                hierarchy="mentor"
              />
            </div>
          </div>

          {/* 2. Student Mentor of Student Branch */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Student Mentor of Student Branch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PersonCard
                name="Student Mentor Name"
                role="Student Branch Mentor"
                department="4th Year, ECE"
                academicYear="2025–26"
                hierarchy="mentor"
              />
            </div>
          </div>

          {/* 3. Senior Executive Committee */}
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

          {/* 4. Operational Lead */}
          <div className="mb-16 space-y-6">
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

          {/* 5. EDS Executive Committee member */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              EDS Executive Committee Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PersonCard
                name="EDS Chair Name"
                role="EDS Student Chair"
                department="3rd Year, ECE"
                hierarchy="compact"
              />
              <PersonCard
                name="EDS Vice Chair"
                role="EDS Vice Chair"
                department="3rd Year, ECE"
                hierarchy="compact"
              />
            </div>
          </div>

          {/* 6. WIE AAG Executive Committee member */}
          <div className="space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              WIE AAG Executive Committee Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PersonCard
                name="WIE Chair Name"
                role="WIE Student Chair"
                department="3rd Year, IT"
                hierarchy="compact"
              />
              <PersonCard
                name="WIE Vice Chair"
                role="WIE Vice Chair"
                department="3rd Year, CSE"
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

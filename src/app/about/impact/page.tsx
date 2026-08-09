import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { StatMetric } from '@/components/content/StatMetric';

export default function ImpactPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Branch Impact' },
            ]}
          />

          <SectionHeading
            category="Evidence of Excellence"
            title="Branch Impact & Outcomes"
            subtitle="Documented outcomes, student reach, and community contributions of IEEE MAIT."
          />

          {/* Stat Bar */}
          <div className="border border-warm-200 bg-warm-100/40 rounded-[2px] mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-warm-200">
              <StatMetric label="Total Students Reached" value="2,500+" subtext="Across 20+ years" />
              <StatMetric label="Workshops Delivered" value="120+" subtext="Technical sessions" />
              <StatMetric label="National Awards" value="10+" subtext="Section & Regional" />
              <StatMetric label="Active Alumnus Base" value="500+" subtext="Global tech leaders" />
            </div>
          </div>

          <div className="space-y-8 max-w-3xl">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl text-ink font-normal">
                Academic & Professional Advancement
              </h3>
              <p className="text-sm text-warm-400 leading-relaxed">
                IEEE MAIT alumni go on to pursue higher education at premier global universities (IITs, IISc, MS in US/Europe) and secure roles at leading technology organizations. The branch serves as an early incubator for research papers, open-source projects, and technical leadership.
              </p>
            </div>

            <div className="space-y-3 border-t border-warm-200 pt-6">
              <h3 className="font-serif text-2xl text-ink font-normal">
                Gender Diversity & WIE Initiatives
              </h3>
              <p className="text-sm text-warm-400 leading-relaxed">
                Our Women in Engineering (WIE) Affinity Group actively leads mentorship networks, coding bootcamps, and leadership roundtables, raising female participation in technical activities across the institute.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

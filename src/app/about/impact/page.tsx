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

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
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
          <div className="border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 rounded-xl mb-12 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-warm-200 dark:divide-gray-800">
              <StatMetric label="Total Students Reached" value="2,500+" description="Across 20+ years" />
              <StatMetric label="Workshops Delivered" value="120+" description="Technical sessions" />
              <StatMetric label="National Awards" value="10+" description="Section & Regional" />
              <StatMetric label="Active Alumnus Base" value="500+" description="Global tech leaders" />
            </div>
          </div>

          <div className="space-y-8 max-w-3xl">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                Academic & Professional Advancement
              </h3>
              <p className="text-sm text-warm-500 dark:text-gray-300 leading-relaxed font-sans">
                IEEE MAIT alumni go on to pursue higher education at premier global universities (IITs, IISc, MS in US/Europe) and secure roles at leading technology organizations. The branch serves as an early incubator for research papers, open-source projects, and technical leadership.
              </p>
            </div>

            <div className="space-y-3 border-t border-warm-200 dark:border-gray-800 pt-6">
              <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                Gender Diversity & WIE Initiatives
              </h3>
              <p className="text-sm text-warm-500 dark:text-gray-300 leading-relaxed font-sans">
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

/**
 * @file src/app/opportunities/page.tsx
 * @description Opportunities, Scholarships, Fellowships & Volunteer Calls Portal.
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
import { OpportunitiesFilter } from '@/components/content/OpportunitiesFilter';
import { getDynamicOpportunities } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Opportunities, Scholarships & Grants | IEEE MAIT',
  description:
    'Explore global IEEE scholarships, undergraduate research fellowships, conference travel grants, and student branch volunteer calls.',
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function OpportunitiesPage() {
  const opportunities = await getDynamicOpportunities();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Opportunities & Grants' },
            ]}
          />

          <SectionHeading
            category="Career & Research Pathways"
            title="Opportunities, Scholarships & Grants"
            subtitle="Explore funded IEEE research fellowships, undergraduate international travel grants, hackathons, and student branch volunteer openings."
          />

          {/* Interactive Opportunities Filter Engine */}
          <OpportunitiesFilter initialOpportunities={opportunities} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

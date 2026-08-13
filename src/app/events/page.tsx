/**
 * @file src/app/events/page.tsx
 * @description Events landing page (Server Component) fetching dynamic records from Prisma DB.
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
import { EventsFilter } from '@/components/content/EventsFilter';
import { getDynamicEvents } from '@/lib/api';

// Enforce dynamic rendering if data updates frequently, or use ISR
export const revalidate = 60; // ISR cache for 60 seconds

export default async function EventsPage() {
  // Fetch live data directly from the Prisma Postgres Database via Server Component
  const eventsList = await getDynamicEvents();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Events' },
            ]}
          />

          <SectionHeading
            category="Activities & Workshops"
            title="Events Archive & Calendar"
            subtitle="Browse upcoming technical sessions, workshops, and historical activity records."
          />

          {/* Interactive Client Component for Filtering */}
          <EventsFilter initialEvents={eventsList} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

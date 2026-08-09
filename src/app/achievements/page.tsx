/**
 * @file src/app/achievements/page.tsx
 * @description Historical achievements ledger (Server Component) fetching dynamic records from Prisma DB.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AchievementsFilter } from '@/components/content/AchievementsFilter';
import { getDynamicAchievements } from '@/lib/api';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function AchievementsPage() {
  // Fetch live data directly from the Prisma Postgres Database via Server Component
  const achievementsList = await getDynamicAchievements();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Historical Record"
            title="Achievements Ledger"
            subtitle="Permanent institutional record of awards, competitions, and branch recognitions."
          />

          {/* Interactive Client Component for Filtering */}
          <AchievementsFilter initialAchievements={achievementsList} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

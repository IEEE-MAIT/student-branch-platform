import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AchievementRow } from '@/components/content/AchievementRow';

export default function AchievementsPage() {
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

          <div className="border-t border-warm-200 pt-4">
            <AchievementRow
              year="2025"
              title="Exemplary Student Branch Award"
              conferredBy="IEEE Delhi Section"
              unitOrTeam="IEEE MAIT SB"
              category="IEEE Recognition"
            />
            <AchievementRow
              year="2025"
              title="First Place — National Robotics & Hardware Hackathon"
              conferredBy="National Tech Summit"
              unitOrTeam="EDS Student Team"
              category="Competition"
            />
            <AchievementRow
              year="2024"
              title="Best Technical Event Organization Award"
              conferredBy="IEEE Delhi Section Student Activities"
              unitOrTeam="WIE Affinity Group"
              category="Award"
            />
            <AchievementRow
              year="2023"
              title="Outstanding Student Branch Counselor Recognition"
              conferredBy="IEEE Region 10"
              unitOrTeam="Faculty Mentors"
              category="Award"
            />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

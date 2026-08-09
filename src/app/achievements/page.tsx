import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ACHIEVEMENTS_DATA } from '@/lib/data';

export const metadata = {
  title: 'Achievements Ledger | IEEE MAIT Student Branch',
  description: 'Documented institutional awards, hackathon recognitions, and IEEE Delhi Section achievements.',
};

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
            {ACHIEVEMENTS_DATA.map(item => (
              <AchievementRow
                key={item.id}
                year={item.year}
                title={item.title}
                conferredBy={item.conferredBy}
                unitOrTeam={item.unitOrTeam}
                category={item.category}
              />
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

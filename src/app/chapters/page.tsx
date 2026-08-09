import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChapterPanel } from '@/components/content/ChapterPanel';
import { CHAPTERS_DATA } from '@/lib/data';

export const metadata = {
  title: 'Chapters & Affinity Groups | IEEE MAIT Student Branch',
  description: 'Explore active IEEE MAIT chapters including WIE Affinity Group and IEEE EDS Chapter.',
};

export default function ChaptersPage() {
  const chaptersList = Object.values(CHAPTERS_DATA);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Organizational Structure"
            title="Chapters & Affinity Groups"
            subtitle="IEEE MAIT supports specialized technical chapters and affinity groups for targeted domain learning and professional growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {chaptersList.map(ch => (
              <ChapterPanel
                key={ch.id}
                name={ch.name}
                slug={ch.slug}
                type={ch.type}
                parentSociety={ch.parentSociety}
                description={ch.description}
                memberCount={ch.memberCount}
                eventCount={ch.eventCount}
              />
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

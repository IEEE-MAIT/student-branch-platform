import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChapterPanel } from '@/components/content/ChapterPanel';

export default function ChaptersPage() {
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
            <ChapterPanel
              name="WIE Affinity Group"
              slug="wie"
              type="Affinity Group"
              parentSociety="IEEE Women in Engineering"
              description="IEEE WIE is a global network of IEEE members and volunteers dedicated to promoting women engineers and scientists, and inspiring girls around the world to follow their academic interests in STEM."
              memberCount="60+"
              eventCount="15+"
            />

            <ChapterPanel
              name="IEEE EDS Chapter"
              slug="eds"
              type="Technical Chapter"
              parentSociety="Electron Devices Society"
              description="Focusing on field of electron devices, semiconductor physics, microelectronics, integrated circuits, and hardware engineering workshops."
              memberCount="45+"
              eventCount="12+"
            />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

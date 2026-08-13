/**
 * @file src/app/chapters/page.tsx
 * @description Chapters & Affinity Groups (Server Component) fetching dynamic records from Prisma DB.
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
import { ChapterPanel } from '@/components/content/ChapterPanel';
import { getDynamicChapters } from '@/lib/api';

export const metadata = {
  title: 'Chapters & Affinity Groups | IEEE MAIT Student Branch',
  description: 'Explore active IEEE MAIT chapters including WIE Affinity Group and IEEE EDS Chapter.',
};

export const revalidate = 60; // ISR Cache

export default async function ChaptersPage() {
  const chaptersList = await getDynamicChapters();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Chapters & Affinity Groups' },
            ]}
          />

          <SectionHeading
            category="Organizational Structure"
            title="Chapters & Affinity Groups"
            subtitle="IEEE MAIT supports specialized technical chapters and affinity groups for targeted domain learning and professional growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {chaptersList.map((ch: any) => (
              <ChapterPanel
                key={ch.id}
                name={ch.name}
                slug={ch.slug}
                type={ch.type as any}
                parentSociety={ch.parentSociety || undefined}
                description={ch.description || undefined}
                memberCount={ch.memberCount}
                eventCount={ch.eventCount}
              />
            ))}
            {chaptersList.length === 0 && (
              <div className="col-span-full p-8 text-center text-sm font-mono text-warm-400 border border-warm-200 bg-warm-50 rounded-[2px]">
                No chapters registered yet.
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

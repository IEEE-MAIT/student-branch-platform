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
import { StatMetric } from '@/components/content/StatMetric';
import { ChapterFilterGrid } from '@/components/content/ChapterFilterGrid';
import { Button } from '@/components/ui/Button';
import { getDynamicChapters } from '@/lib/api';

export const metadata = {
  title: 'Chapters & Affinity Groups | IEEE MAIT Student Branch',
  description: 'Explore active IEEE MAIT chapters including WIE Affinity Group and IEEE EDS Chapter. Learn how specialized technical societies accelerate engineering careers.',
};

export const revalidate = 60; // ISR Cache

export default async function ChaptersPage() {
  const chaptersList = await getDynamicChapters();

  // Aggregate statistics across units
  const totalUnits = chaptersList.length;
  const totalMembers = chaptersList.reduce((acc: number, ch: any) => acc + (Number(ch.memberCount) || 0), 0);
  const totalEvents = chaptersList.reduce((acc: number, ch: any) => acc + (Number(ch.eventCount) || 0), 0);

  const formattedChapters = chaptersList.map((ch: any) => ({
    name: ch.name,
    slug: ch.slug,
    type: ch.type,
    tagline: ch.tagline || undefined,
    description: ch.description || undefined,
    logoUrl: ch.logoUrl || undefined,
    accentColor: ch.accentColor || undefined,
    instagramUrl: ch.instagramUrl || undefined,
    linkedinUrl: ch.linkedinUrl || undefined,
    githubUrl: ch.githubUrl || undefined,
    parentSociety: ch.parentSociety || undefined,
    establishedYear: ch.establishedYear || undefined,
    memberCount: ch.memberCount,
    eventCount: ch.eventCount,
  }));

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
            subtitle="IEEE MAIT supports specialized technical societies and affinity groups for targeted domain expertise, global networking, and student leadership."
          />

          {/* Quick Metrics Bar */}
          <div className="border-y border-warm-200 bg-warm-100/40 py-6 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200">
              <StatMetric label="Active Units" value={`${totalUnits}`} description="Chapters & Affinity Groups" />
              <StatMetric label="Affiliated Members" value={`${totalMembers}+`} description="Across Specialized Domains" />
              <StatMetric label="Technical Events" value={`${totalEvents}+`} description="Workshops, Talks & Symposia" />
              <StatMetric label="Global Affiliation" value="IEEE R10" description="Delhi Section Charter" />
            </div>
          </div>

          {/* Filter Tabs & Chapter Cards Grid */}
          <div className="mb-20">
            <ChapterFilterGrid chapters={formattedChapters} />
          </div>

          {/* Why Join a Chapter Section */}
          <section className="border-t border-warm-200 pt-16 mt-16">
            <div className="max-w-3xl mb-10">
              <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block mb-2">
                Member Value Proposition
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
                Why Join a Specialized Unit?
              </h2>
              <p className="text-base text-warm-400 font-sans leading-relaxed mt-2">
                While IEEE MAIT Student Branch provides broad professional development, chapters and affinity groups offer deep, focused immersion in specific technical and leadership tracks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-warm-200 bg-warm-100/30 p-6 rounded-[2px] space-y-3">
                <span className="font-mono text-xs font-bold text-ieee-blue uppercase tracking-wider block">
                  01 · Domain Immersion
                </span>
                <h3 className="font-serif text-xl text-ink font-normal">
                  Focused Technical Depth
                </h3>
                <p className="text-sm text-warm-400 font-sans leading-relaxed">
                  Deep-dive into specialized fields like semiconductor physics, EDA tooling, VLSI design, and diversity in STEM with structured workshops.
                </p>
              </div>

              <div className="border border-warm-200 bg-warm-100/30 p-6 rounded-[2px] space-y-3">
                <span className="font-mono text-xs font-bold text-ieee-blue uppercase tracking-wider block">
                  02 · Global Society Network
                </span>
                <h3 className="font-serif text-xl text-ink font-normal">
                  Direct Global Affiliation
                </h3>
                <p className="text-sm text-warm-400 font-sans leading-relaxed">
                  Gain access to IEEE Societies publications, global travel grants, international paper contests, and mentorship from industry specialists.
                </p>
              </div>

              <div className="border border-warm-200 bg-warm-100/30 p-6 rounded-[2px] space-y-3">
                <span className="font-mono text-xs font-bold text-ieee-blue uppercase tracking-wider block">
                  03 · Executive Leadership
                </span>
                <h3 className="font-serif text-xl text-ink font-normal">
                  Unit Governance Track
                </h3>
                <p className="text-sm text-warm-400 font-sans leading-relaxed">
                  Lead dedicated chapter committees, manage budgets, curate symposiums, and build verified leadership credentials acknowledged worldwide.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 border border-ieee-blue/20 bg-ieee-subtle/30 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h4 className="font-serif text-2xl text-ink font-normal">Ready to get involved?</h4>
                <p className="text-sm text-warm-400 font-sans mt-1">
                  Join IEEE MAIT today and activate your chapter and affinity group affiliations.
                </p>
              </div>
              <Button href="/join" variant="primary" size="md" className="shrink-0">
                Join IEEE MAIT →
              </Button>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
}


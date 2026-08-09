import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

export default function StoriesPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Publications & Writings"
            title="Stories & Technical Reports"
            subtitle="Articles, event post-mortems, technical reflections, and student writing."
          />

          <div className="space-y-6 pt-4">
            <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-3">
              <div className="flex items-center gap-3 font-mono text-xs text-ieee-blue">
                <span>AUG 08, 2026</span>
                <span>·</span>
                <span>IEEE EDS Chapter</span>
                <span>·</span>
                <span>5 min read</span>
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Reflections on Our Applied Neural Networks Workshop Series
              </h3>
              <p className="text-sm text-warm-400 leading-relaxed">
                A technical summary of key concepts covered during the 3-day deep learning session, student project highlights, and resources for further learning.
              </p>
              <Link href="#" className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-ieee-blue hover:underline pt-2">
                <span>Read Full Article</span>
                <span>→</span>
              </Link>
            </div>

            <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-3">
              <div className="flex items-center gap-3 font-mono text-xs text-ieee-blue">
                <span>JUL 25, 2026</span>
                <span>·</span>
                <span>WIE Affinity Group</span>
                <span>·</span>
                <span>4 min read</span>
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Empowering Women in Engineering: WIE MAIT 2026 Roadmap
              </h3>
              <p className="text-sm text-warm-400 leading-relaxed">
                An overview of upcoming mentorship programs, scholarship opportunities, and community outreach initiatives planned for the current academic year.
              </p>
              <Link href="#" className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-ieee-blue hover:underline pt-2">
                <span>Read Full Article</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

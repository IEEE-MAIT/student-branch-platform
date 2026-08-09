import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MILESTONES_DATA } from '@/lib/data';

export default function HistoryPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Institutional Timeline"
            title="History & Key Milestones"
            subtitle="Tracing two decades of growth, chapter charters, and institutional impact at MAIT."
          />

          <div className="max-w-3xl mx-auto pt-8">
            <div className="relative border-l-2 border-warm-200 pl-8 space-y-12 ml-4 sm:ml-8">
              {MILESTONES_DATA.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-ieee-blue group-hover:bg-ieee-blue transition-colors" />

                  <span className="font-mono text-sm font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px] inline-block mb-2">
                    {milestone.year}
                  </span>

                  <h3 className="font-serif text-2xl text-ink font-normal leading-snug">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-warm-400 font-sans mt-1.5 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';

export default function EventsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Activities & Workshops"
            title="Events Archive & Calendar"
            subtitle="Browse upcoming technical sessions, workshops, and historical activity records."
          />

          {/* Upcoming Section */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Upcoming Events
            </h3>

            <EventPreview
              isFeatured
              title="Workshop on Machine Learning Fundamentals & Applied Neural Networks"
              slug="workshop-machine-learning-fundamentals"
              date="AUG 20, 2026"
              time="2:00 PM – 5:00 PM"
              venue="Seminar Hall, Block A"
              unit="IEEE EDS Chapter"
              category="Technical Workshop"
              description="Join us for an intensive hands-on session exploring deep learning architectures, practical model evaluation, and deployment strategies using Python."
            />

            <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
              <EventPreview
                title="WIE Women in Tech Leadership Panel 2026"
                slug="wie-women-in-tech-leadership-panel"
                date="SEP 05, 2026"
                venue="Auditorium, Block IX"
                unit="WIE Affinity Group"
                category="Panel Discussion"
              />
              <EventPreview
                title="Annual Branch Orientation & Membership Drive"
                slug="branch-orientation-2026"
                date="SEP 15, 2026"
                venue="Main Auditorium"
                unit="IEEE MAIT SB"
                category="Branch Event"
              />
            </div>
          </div>

          {/* Past Events Section */}
          <div className="space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-muted border-b border-warm-200 pb-2">
              Past Events (2025–26 Archive)
            </h3>

            <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
              <EventPreview
                title="IEEE Day 2025 Flagship Technical Exhibition"
                slug="ieee-day-2025-celebration"
                date="OCT 07, 2025"
                venue="MAIT Campus Courtyard"
                unit="IEEE MAIT SB"
                category="Flagship Event"
              />
              <EventPreview
                title="Hands-on Workshop on PCB Design & Soldering"
                slug="pcb-design-workshop"
                date="AUG 12, 2025"
                venue="ECE Hardware Lab"
                unit="IEEE EDS Chapter"
                category="Workshop"
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

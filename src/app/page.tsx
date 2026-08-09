import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatMetric } from '@/components/content/StatMetric';
import { EventPreview } from '@/components/content/EventPreview';
import { PersonCard } from '@/components/content/PersonCard';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ChapterPanel } from '@/components/content/ChapterPanel';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-warm-200 bg-grid-pattern overflow-hidden">
          <Container size="default">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ieee-subtle border border-ieee-blue/20 rounded-[2px]">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">
                  IEEE Region 10 · Delhi Section
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.08] tracking-tight">
                IEEE MAIT <br />
                <span className="italic text-ieee-blue">Student Branch</span>
              </h1>

              <p className="text-lg sm:text-xl text-warm-400 font-sans leading-relaxed max-w-2xl">
                Advancing technology, building community, and fostering technical excellence at Maharaja Agrasen Institute of Technology, Delhi. Established in 2005.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button href="/join" variant="primary" size="lg">
                  Join IEEE MAIT →
                </Button>
                <Button href="/about" variant="secondary" size="lg">
                  Explore Our Work
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. BRANCH AT A GLANCE (Horizontal Monospaced Bar) */}
        <section className="border-b border-warm-200 bg-warm-100/60 py-2">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-warm-200">
              <StatMetric label="Active Members" value="150+" subtext="Students across all years" />
              <StatMetric label="Events Organized" value="50+" subtext="Workshops & seminars" />
              <StatMetric label="Active Units" value="2+" subtext="WIE AG & EDS Chapter" />
              <StatMetric label="Years Active" value="Since 2005" subtext="20+ years of continuity" />
            </div>
          </Container>
        </section>

        {/* 3. UPCOMING EVENTS */}
        <section className="py-16 sm:py-24 border-b border-warm-200 bg-white">
          <Container size="default">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
              <SectionHeading
                category="Current Activity"
                title="Upcoming Workshops & Events"
                subtitle="Hands-on sessions, technical workshops, and guest lectures hosted by IEEE MAIT."
                className="mb-0"
              />
              <Link
                href="/events"
                className="inline-flex items-center gap-1 text-sm font-mono text-ieee-blue hover:underline font-semibold mt-4 md:mt-0"
              >
                <span>View Full Calendar</span>
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-8">
              {/* Featured Next Event */}
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

              {/* Compact List Rows */}
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
          </Container>
        </section>

        {/* 4. ABOUT IEEE MAIT (Editorial Asymmetric Layout) */}
        <section className="py-16 sm:py-24 border-b border-warm-200 bg-warm-100/30">
          <Container size="default">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <SectionHeading
                  category="Our Institution"
                  title="Building a Legacy of Technical Excellence at MAIT"
                  className="mb-4"
                />
                <p className="text-base text-ink-muted leading-relaxed">
                  Established in 2005, the IEEE MAIT Student Branch serves as the primary professional and technical student body at Maharaja Agrasen Institute of Technology, Rohini, Delhi.
                </p>
                <p className="text-base text-warm-400 leading-relaxed">
                  We empower engineering students by providing access to IEEE&apos;s worldwide technical network, practical hands-on workshops, research opportunities, and leadership experience.
                </p>
                <div className="pt-2">
                  <Button href="/about" variant="secondary" size="md">
                    Learn More About Our Story →
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 border border-warm-200 bg-white p-6 rounded-[2px] space-y-4">
                <div className="relative h-64 bg-warm-100 border border-warm-200 rounded-[2px] flex items-center justify-center text-center p-6">
                  <div className="space-y-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-ieee-blue">Campus Context</span>
                    <h4 className="font-serif text-xl text-ink">MAIT Rohini Campus</h4>
                    <p className="text-xs text-warm-400">PSP Area, Plot No-1, Sector-22, Rohini, Delhi-110086</p>
                  </div>
                </div>
                <div className="text-xs text-warm-400 font-mono flex items-center justify-between pt-2">
                  <span>Affiliation: IEEE Delhi Section</span>
                  <span>Est. 2005</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. PEOPLE PREVIEW */}
        <section className="py-16 sm:py-24 border-b border-warm-200 bg-white">
          <Container size="default">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
              <SectionHeading
                category="Leadership"
                title="Branch Executive Committee"
                subtitle="Meet the faculty mentors and student officers guiding IEEE MAIT."
                className="mb-0"
              />
              <Link
                href="/people"
                className="inline-flex items-center gap-1 text-sm font-mono text-ieee-blue hover:underline font-semibold mt-4 md:mt-0"
              >
                <span>View Full Team & History</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <PersonCard
                name="Dr. Faculty Counselor"
                role="Faculty Branch Counselor"
                department="Department of ECE"
                academicYear="2025–26"
                hierarchy="standard"
              />
              <PersonCard
                name="Chairperson Name"
                role="Branch Chairperson"
                department="3rd Year, CSE"
                academicYear="2025–26"
                hierarchy="featured"
              />
              <PersonCard
                name="Vice Chair Name"
                role="Vice Chairperson"
                department="3rd Year, ECE"
                academicYear="2025–26"
                hierarchy="standard"
              />
              <PersonCard
                name="General Secretary"
                role="General Secretary"
                department="3rd Year, IT"
                academicYear="2025–26"
                hierarchy="standard"
              />
            </div>
          </Container>
        </section>

        {/* 6. ACHIEVEMENTS LEDGER */}
        <section className="py-16 sm:py-24 border-b border-warm-200 bg-warm-100/20">
          <Container size="default">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
              <SectionHeading
                category="Recognition"
                title="Branch Achievements & Awards"
                subtitle="Documented evidence of organizational excellence and student accolades."
                className="mb-0"
              />
              <Link
                href="/achievements"
                className="inline-flex items-center gap-1 text-sm font-mono text-ieee-blue hover:underline font-semibold mt-4 md:mt-0"
              >
                <span>View Complete Archive</span>
                <span>→</span>
              </Link>
            </div>

            <div className="border-t border-warm-200">
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
            </div>
          </Container>
        </section>

        {/* 7. CHAPTERS & AFFINITY GROUPS */}
        <section className="py-16 sm:py-24 border-b border-warm-200 bg-white">
          <Container size="default">
            <SectionHeading
              category="Organizational Units"
              title="Chapters & Affinity Groups"
              subtitle="Autonomous units focused on specialized technical domains and community outreach."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ChapterPanel
                name="WIE Affinity Group"
                slug="wie"
                type="Affinity Group"
                parentSociety="IEEE Women in Engineering"
                description="Dedicated to promoting women engineers and scientists, and inspiring girls around the world to follow their academic interests in STEM."
                memberCount="60+"
                eventCount="15+"
              />

              <ChapterPanel
                name="IEEE EDS Chapter"
                slug="eds"
                type="Technical Chapter"
                parentSociety="Electron Devices Society"
                description="Focusing on field of electron devices, semiconductor technologies, solid-state physics, and integrated circuit design workshops."
                memberCount="45+"
                eventCount="12+"
              />
            </div>
          </Container>
        </section>

        {/* 8. JOIN CONVERSION CTA BAND */}
        <section className="py-16 lg:py-20 bg-ieee-blue text-white">
          <Container size="default">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div className="space-y-3 max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-ieee-subtle">
                  Membership Drive 2025–26
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                  Ready to be part of IEEE MAIT?
                </h2>
                <p className="text-ieee-subtle text-base font-sans">
                  Connect with 150+ active students, gain access to IEEE&apos;s global technical resources of 460,000+ members, and build real leadership experience.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button href="/join" variant="accent" size="lg" className="bg-white text-ieee-blue border-white hover:bg-warm-100 font-bold">
                  Start Your Registration →
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

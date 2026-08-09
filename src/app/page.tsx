import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatMetric } from '@/components/content/StatMetric';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import { ChapterPanel } from '@/components/content/ChapterPanel';
import { BRANCH_STATS } from '@/lib/data';
import { getDynamicEvents, getDynamicAchievements, getDynamicChapters } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [eventsList, achievementsList, chaptersList] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    getDynamicChapters(),
  ]);

  const upcomingEvents = eventsList.filter((e: any) => e.status === 'upcoming');
  const featuredEvent = upcomingEvents[0];
  const remainingUpcoming = upcomingEvents.slice(1);
  const featuredAchievements = achievementsList.slice(0, 3);

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
                  {BRANCH_STATS.region} · {BRANCH_STATS.section}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.08] tracking-tight">
                IEEE MAIT <br />
                <span className="italic text-ieee-blue">Student Branch</span>
              </h1>

              <p className="text-lg sm:text-xl text-warm-400 font-sans leading-relaxed max-w-2xl">
                Advancing technology, building community, and fostering technical excellence at {BRANCH_STATS.institution}. Established in {BRANCH_STATS.establishedYear}.
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
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-warm-200 py-4">
              <StatMetric label="Active Members" value={BRANCH_STATS.activeMembers} description="Student Branch & Chapters" />
              <StatMetric label="Events Organized" value={BRANCH_STATS.eventsOrganized} description="Workshops, Seminars & Panels" />
              <StatMetric label="Active Units" value={BRANCH_STATS.activeUnits} description="WIE Affinity Group & EDS Chapter" />
              <StatMetric label="Established" value={BRANCH_STATS.establishedYear} description="Chartered under Delhi Section" />
            </div>
          </Container>
        </section>

        {/* 3. UPCOMING EVENTS & WORKSHOPS */}
        <section className="py-16 sm:py-24 bg-white border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="Branch Calendar"
              title="Upcoming Events & Technical Workshops"
              subtitle="Participate in hands-on technical sessions, leadership panels, and mentorship workshops."
            />

            <div className="space-y-6 pt-4">
              {featuredEvent && (
                <EventPreview
                  isFeatured
                  title={featuredEvent.title}
                  slug={featuredEvent.slug}
                  date={featuredEvent.date}
                  time={featuredEvent.time}
                  venue={featuredEvent.venue}
                  unit={featuredEvent.unit}
                  category={featuredEvent.category}
                  description={featuredEvent.description}
                />
              )}

              {remainingUpcoming.length > 0 && (
                <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                  {remainingUpcoming.map((event) => (
                    <EventPreview
                      key={event.id}
                      title={event.title}
                      slug={event.slug}
                      date={event.date}
                      venue={event.venue}
                      unit={event.unit}
                      category={event.category}
                    />
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-warm-200">
                <Link href="/events" className="text-xs font-mono text-ieee-blue font-semibold hover:underline">
                  View Full Events Archive →
                </Link>
                <span className="font-mono text-xs text-warm-300">
                  Updated Dynamic REST Feed
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. ABOUT IEEE MAIT NARRATIVE */}
        <section className="py-16 sm:py-24 bg-warm-100/30 border-b border-warm-200">
          <Container size="narrow">
            <div className="space-y-6 text-center">
              <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                Institutional Narrative
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
                Fostering Engineering Innovation Since 2005
              </h2>
              <p className="text-base text-warm-400 font-sans leading-relaxed">
                The IEEE MAIT Student Branch serves as a hub for engineering students at Maharaja Agrasen Institute of Technology, Delhi. Through our technical workshops, hardware hackathons, and society chapters, we provide students with hands-on technical skills and mentorship.
              </p>
              <div className="pt-2">
                <Link href="/about/history" className="text-xs font-mono text-ieee-blue font-semibold hover:underline">
                  Read Our 20-Year Institutional History →
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. CHAPTERS & AFFINITY GROUPS */}
        <section className="py-16 sm:py-24 bg-white border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="Specialized Units"
              title="Active Chapters & Affinity Groups"
              subtitle="Explore specialized societies focusing on electron devices, semiconductor hardware, and women in engineering."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {chaptersList.map((chapter) => (
                <ChapterPanel
                  key={chapter.id}
                  name={chapter.name}
                  slug={chapter.slug}
                  type={chapter.type}
                  parentSociety={chapter.parentSociety}
                  establishedYear={chapter.establishedYear}
                  description={chapter.description}
                  memberCount={chapter.memberCount}
                  eventCount={chapter.eventCount}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* 6. ACHIEVEMENTS & RECOGNITIONS LEDGER */}
        <section className="py-16 sm:py-24 bg-white border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="Institutional Record"
              title="Recent Achievements & Recognitions"
              subtitle="A permanent record of branch honors, hackathon victories, and section recognitions."
            />

            <div className="border-t border-warm-200 pt-4">
              {featuredAchievements.map((item) => (
                <AchievementRow
                  key={item.id}
                  year={item.year}
                  title={item.title}
                  conferredBy={item.conferredBy}
                  unitOrTeam={item.unitOrTeam}
                  category={item.category}
                />
              ))}

              <div className="pt-6 flex justify-between items-center">
                <Link href="/achievements" className="text-xs font-mono text-ieee-blue font-semibold hover:underline">
                  View Full Achievements Ledger →
                </Link>
                <span className="font-mono text-xs text-warm-300">
                  Delhi Section Record
                </span>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

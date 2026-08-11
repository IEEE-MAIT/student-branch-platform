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
import { PersonCard } from '@/components/content/PersonCard';
import { BRANCH_STATS } from '@/lib/data';
import { prisma } from '@/lib/db';
import Link from '@/components/ui/AppLink';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  let upcomingEvents: any[] = [];
  let featuredAchievements: any[] = [];
  let chaptersList: any[] = [];
  let topLeadership: any[] = [];

  try {
    [upcomingEvents, featuredAchievements, chaptersList, topLeadership] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'upcoming' },
        orderBy: { date: 'asc' },
        take: 4
      }),
      prisma.achievement.findMany({
        orderBy: { year: 'desc' },
        take: 3
      }),
      prisma.chapter.findMany(),
      prisma.person.findMany({
        orderBy: { hierarchy: 'asc' },
        take: 4
      })
    ]);
  } catch (e) {
    console.error("Homepage DB fetch error:", e);
    // Fallback to empty arrays if DB fails
  }

  const featuredEvent = upcomingEvents[0];
  const remainingUpcoming = upcomingEvents.slice(1);

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

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Button href="/join" variant="primary" size="lg" className="w-full sm:w-auto justify-center">
                  Join IEEE MAIT →
                </Button>
                <Button href="/about" variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                  Explore Our Work
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. BRANCH AT A GLANCE */}
        <section className="border-b border-warm-200 bg-warm-100/60 py-2">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 py-4">
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
                  {remainingUpcoming.map((event: any) => (
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

              {!featuredEvent && upcomingEvents.length === 0 && (
                <p className="font-mono text-sm text-warm-300 py-8 text-center border border-warm-200 rounded-[2px]">
                  No upcoming events scheduled. Check back soon or view past events below.
                </p>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-warm-200">
                <Link href="/events" className="text-xs font-mono text-ieee-blue font-semibold hover:underline">
                  View Full Events Archive →
                </Link>
                <span className="font-mono text-xs text-warm-300">Updated Live from Database</span>
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

        {/* 5. PEOPLE PREVIEW — Meet the Leadership */}
        {topLeadership.length > 0 && (
          <section className="py-16 sm:py-24 bg-white border-b border-warm-200">
            <Container size="default">
              <SectionHeading
                category="Leadership"
                title="Meet the Executive Committee"
                subtitle="The student leaders steering IEEE MAIT's technical initiatives, chapter operations, and community outreach."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {topLeadership.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department}
                    imageUrl={person.imageUrl}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy={person.hierarchy}
                    size="standard"
                  />
                ))}
              </div>

              <div className="pt-8 flex justify-between items-center border-t border-warm-200 mt-8">
                <Link href="/people" className="text-xs font-mono text-ieee-blue font-semibold hover:underline">
                  View Full Leadership Roster →
                </Link>
                <span className="font-mono text-xs text-warm-300">{BRANCH_STATS.activeMembers}+ Active Members</span>
              </div>
            </Container>
          </section>
        )}

        {/* 6. CHAPTERS & AFFINITY GROUPS */}
        <section className="py-16 sm:py-24 bg-warm-100/30 border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="Specialized Units"
              title="Active Chapters & Affinity Groups"
              subtitle="Explore specialized societies focusing on electron devices, semiconductor hardware, and women in engineering."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {chaptersList.map((chapter: any) => (
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

        {/* 7. ACHIEVEMENTS & RECOGNITIONS LEDGER */}
        <section className="py-16 sm:py-24 bg-white border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="Institutional Record"
              title="Recent Achievements & Recognitions"
              subtitle="A permanent record of branch honors, hackathon victories, and section recognitions."
            />

            <div className="border-t border-warm-200 pt-4">
              {featuredAchievements.map((item: any) => (
                <AchievementRow
                  key={item.id}
                  id={item.id}
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
                <span className="font-mono text-xs text-warm-300">Delhi Section Record</span>
              </div>
            </div>
          </Container>
        </section>

        {/* 8. REAL MOMENTS — Photography Band */}
        <section className="py-16 sm:py-24 bg-ink border-b border-white/5">
          <Container size="default">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-light uppercase tracking-widest block mb-2">
                  Documentary Record
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                  Real Moments, Real Work
                </h2>
              </div>
              <Link href="/gallery" className="text-xs font-mono text-ieee-light hover:underline font-semibold shrink-0">
                View Full Gallery →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'IEEE Day 2025 — Opening Ceremony' },
                { label: 'PCB Design Workshop — EDS Chapter' },
                { label: 'WIE Leadership Summit 2025' },
                { label: 'Hardware Hackathon Finals' },
              ].map((photo, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-white/5 border border-white/10 flex items-end p-3 group hover:border-ieee-blue/40 transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10px] text-warm-300/50 group-hover:text-warm-300 transition-colors leading-tight">
                    {photo.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] text-white/20 mt-4 text-center">
              Photo placeholders — upload real event photography via the Admin Gallery panel
            </p>
          </Container>
        </section>

        {/* 9. JOIN CTA BAND */}
        <section className="py-20 sm:py-28 bg-ieee-blue">
          <Container size="narrow">
            <div className="text-center space-y-6">
              <span className="font-mono text-xs font-semibold text-white/60 uppercase tracking-widest block">
                Become a Member
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                Join IEEE MAIT Student Branch
              </h2>
              <p className="text-base sm:text-lg text-white/80 font-sans leading-relaxed max-w-xl mx-auto">
                Connect with {BRANCH_STATS.activeMembers}+ engineers, access IEEE&apos;s global network of 460,000+ technologists, and build the skills that matter.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button href="/join" variant="primary" size="lg" className="!bg-white !text-ieee-blue hover:!bg-warm-100">
                  Start Your Membership →
                </Button>
                <Button href="/contact" variant="secondary" size="lg" className="!border-white/40 !text-white hover:!bg-white/10">
                  Ask a Question
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

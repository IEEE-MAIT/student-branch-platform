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
import {
  getDynamicEvents,
  getDynamicAchievements,
  getDynamicChapters,
  getDynamicPeople,
  getDynamicGalleries,
} from '@/lib/api';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  // Fetch dynamic records with resilient fallback layers
  const [allEvents, allAchievements, rawChapters, allPeople, allGalleries] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    getDynamicChapters(),
    getDynamicPeople(),
    getDynamicGalleries(),
  ]);

  // 1. Filter upcoming events for the spotlight and upcoming list
  const upcomingEvents = allEvents.filter(
    (e: any) => e.status === 'upcoming' || e.status === 'Upcoming'
  );
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : allEvents[0];
  const remainingUpcoming = upcomingEvents.length > 0 ? upcomingEvents.slice(1, 4) : allEvents.slice(1, 4);

  // 2. Featured achievements (top 4 latest)
  const featuredAchievements = allAchievements.slice(0, 4);

  // 3. Chapters list (ensure 3 core units: SB, EDS, WIE)
  const chaptersList = rawChapters.slice(0, 3);

  // 4. Leadership spotlight (top 4-6 key officers)
  const topLeadership = allPeople.slice(0, 4);

  // 5. Gallery highlights (extract 4 representative photos)
  const galleryPhotos: Array<{ caption: string; url?: string | null; albumSlug: string; albumTitle: string }> = [];
  for (const album of allGalleries) {
    if (album.photos && Array.isArray(album.photos)) {
      for (const photo of album.photos) {
        if (galleryPhotos.length < 4) {
          galleryPhotos.push({
            caption: photo.caption || album.title,
            url: photo.url,
            albumSlug: album.slug,
            albumTitle: album.title,
          });
        }
      }
    }
  }

  // Fallback photo items if no photos found
  const fallbackMoments = [
    { title: 'IEEE Day 2025 — Opening Ceremony', subtitle: 'MAIT Courtyard', href: '/gallery' },
    { title: 'PCB Design & Soldering Workshop', subtitle: 'ECE Hardware Lab', href: '/gallery' },
    { title: 'WIE Women in Tech Leadership Panel', subtitle: 'Block IX Auditorium', href: '/gallery' },
    { title: 'Hardware Hackathon Project Demos', subtitle: 'Robotics Center', href: '/gallery' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-warm-200 bg-grid-pattern overflow-hidden">
          <Container size="default">
            <div className="max-w-3xl space-y-6">
              {/* Region & Section Identifier */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ieee-subtle border border-ieee-blue/20 rounded-[2px]">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">
                  {BRANCH_STATS.region} · {BRANCH_STATS.section}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.08] tracking-tight">
                IEEE MAIT <br />
                <span className="italic text-ieee-blue">Student Branch</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-warm-400 font-sans leading-relaxed max-w-2xl">
                Advancing technology, building community, and fostering technical excellence at {BRANCH_STATS.institution}. Chartered in {BRANCH_STATS.establishedYear}.
              </p>

              {/* Action Buttons */}
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

        {/* 2. LIVE METRIC STRIP */}
        <section className="border-b border-warm-200 bg-warm-100/60 py-2">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 py-4">
              <StatMetric 
                label="Active Members" 
                value={BRANCH_STATS.activeMembers} 
                description="Student Branch & Chapters" 
              />
              <StatMetric 
                label="Events Organized" 
                value={BRANCH_STATS.eventsOrganized} 
                description="Workshops, Seminars & Panels" 
              />
              <StatMetric 
                label="Chartered Units" 
                value="3 Units" 
                description="Parent SB, EDS & WIE AG" 
              />
              <StatMetric 
                label="Established" 
                value={BRANCH_STATS.establishedYear} 
                description="Chartered under Delhi Section" 
              />
            </div>
          </Container>
        </section>

        {/* 3. FEATURED EVENT SPOTLIGHT */}
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
                  imageSrc={featuredEvent.imageSrc}
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

              {!featuredEvent && (
                <p className="font-mono text-sm text-warm-400 py-8 text-center border border-warm-200 rounded-[2px]">
                  No upcoming events currently scheduled. Explore our past event dossiers and reports below.
                </p>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-warm-200">
                <Link href="/events" className="text-xs font-mono text-ieee-blue font-semibold hover:underline flex items-center gap-1">
                  <span>View Full Events Archive →</span>
                </Link>
                <span className="font-mono text-xs text-warm-400">Live Database Feed</span>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. THE IEEE MAIT ECOSYSTEM (3 PILLARS) */}
        <section className="py-16 sm:py-24 bg-warm-100/30 border-b border-warm-200">
          <Container size="default">
            <SectionHeading
              category="The Ecosystem"
              title="Communities & Chartered Units"
              subtitle="Explore our parent student branch and specialized chapters focusing on semiconductor hardware and women in engineering."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {chaptersList.map((chapter: any) => (
                <ChapterPanel
                  key={chapter.id || chapter.slug}
                  name={chapter.name}
                  slug={chapter.slug}
                  type={chapter.type}
                  tagline={chapter.tagline}
                  description={chapter.description}
                  logoUrl={chapter.logoUrl}
                  accentColor={chapter.accentColor}
                  instagramUrl={chapter.instagramUrl}
                  linkedinUrl={chapter.linkedinUrl}
                  githubUrl={chapter.githubUrl}
                  parentSociety={chapter.parentSociety}
                  establishedYear={chapter.establishedYear}
                  memberCount={chapter.memberCount}
                  eventCount={chapter.eventCount}
                />
              ))}
            </div>

            <div className="pt-8 flex justify-between items-center border-t border-warm-200 mt-8">
              <Link href="/chapters" className="text-xs font-mono text-ieee-blue font-semibold hover:underline flex items-center gap-1">
                <span>Explore All Communities & Sub-Portals →</span>
              </Link>
              <span className="font-mono text-xs text-warm-400">
                {chaptersList.length} Chartered Units
              </span>
            </div>
          </Container>
        </section>

        {/* 5. RECENT RECOGNITIONS LEDGER */}
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
                <Link href="/achievements" className="text-xs font-mono text-ieee-blue font-semibold hover:underline flex items-center gap-1">
                  <span>View Full Achievements Ledger →</span>
                </Link>
                <span className="font-mono text-xs text-warm-400">Delhi Section Record</span>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. LEADERSHIP SPOTLIGHT */}
        {topLeadership.length > 0 && (
          <section className="py-16 sm:py-24 bg-warm-100/30 border-b border-warm-200">
            <Container size="default">
              <SectionHeading
                category="Leadership"
                title="Branch Executive Leadership"
                subtitle="The faculty counselors and student leaders steering IEEE MAIT's technical initiatives and chapter operations."
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
                    imageSrc={person.imageSrc}
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
                <Link href="/people" className="text-xs font-mono text-ieee-blue font-semibold hover:underline flex items-center gap-1">
                  <span>View Full Leadership Directory & Archive →</span>
                </Link>
                <span className="font-mono text-xs text-warm-400">{BRANCH_STATS.activeMembers} Active Members</span>
              </div>
            </Container>
          </section>
        )}

        {/* 7. REAL MOMENTS — Documentary Photography Band */}
        <section className="py-16 sm:py-24 bg-ink text-white border-b border-white/10">
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
                View Full Photo Gallery →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPhotos.length > 0 ? (
                galleryPhotos.map((photo, idx) => (
                  <Link
                    key={idx}
                    href={photo.albumSlug ? `/gallery/${photo.albumSlug}` : `/gallery`}
                    className="group relative aspect-4/3 bg-white/5 border border-white/10 overflow-hidden rounded-[2px] flex flex-col justify-end p-4 hover:border-ieee-light/60 transition-all duration-300"
                  >
                    {photo.url ? (
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    )}
                    <div className="relative z-10">
                      <span className="font-mono text-[10px] text-ieee-light uppercase tracking-wider block mb-1">
                        {photo.albumTitle}
                      </span>
                      <p className="font-sans text-xs text-warm-200 line-clamp-2 leading-snug">
                        {photo.caption}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                fallbackMoments.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group aspect-4/3 bg-white/5 border border-white/10 rounded-[2px] flex flex-col justify-end p-4 hover:border-ieee-light/60 transition-all duration-300"
                  >
                    <span className="font-mono text-[10px] text-ieee-light uppercase tracking-wider block mb-1">
                      {item.subtitle}
                    </span>
                    <h4 className="font-serif text-sm text-white group-hover:text-ieee-light transition-colors leading-snug">
                      {item.title}
                    </h4>
                  </Link>
                ))
              )}
            </div>
            <div className="mt-6 text-center">
              <span className="font-mono text-[11px] text-warm-400">
                Official documentary archive curated by the IEEE MAIT Creative & Media Team
              </span>
            </div>
          </Container>
        </section>

        {/* 8. HIGH-CONVERSION JOIN CALLOUT */}
        <section className="py-20 sm:py-28 bg-ieee-blue text-white">
          <Container size="narrow">
            <div className="text-center space-y-6">
              <span className="font-mono text-xs font-semibold text-white/70 uppercase tracking-widest block">
                Become a Member
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                Join IEEE MAIT Student Branch
              </h2>
              <p className="text-base sm:text-lg text-white/90 font-sans leading-relaxed max-w-xl mx-auto">
                Connect with {BRANCH_STATS.activeMembers} engineers, access IEEE&apos;s global network of 460,000+ technologists, and build hands-on skills in hardware, AI, and leadership.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button href="/join" variant="primary" size="lg" className="!bg-white !text-ieee-blue hover:!bg-warm-100 font-semibold shadow-md">
                  Start Your Membership →
                </Button>
                <Button href="/contact" variant="secondary" size="lg" className="!border-white/50 !text-white hover:!bg-white/10">
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

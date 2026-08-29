import React from 'react';
import { Metadata } from 'next';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatMetric } from '@/components/content/StatMetric';
import { EventPreview } from '@/components/content/EventPreview';
import { ChapterPanel } from '@/components/content/ChapterPanel';
import { AchievementRow } from '@/components/content/AchievementRow';
import { HomeLeadershipSection } from '@/components/content/HomeLeadershipSection';
import { BRANCH_STATS } from '@/lib/data';
import { 
  getDynamicEvents, 
  getDynamicChapters, 
  getDynamicAchievements, 
  getDynamicPeople, 
  getDynamicGalleries 
} from '@/lib/api';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'IEEE MAIT Student Branch · Advancing Technology for Humanity',
  description:
    'Official digital platform of IEEE Student Branch at Maharaja Agrasen Institute of Technology (MAIT), Delhi. Explore our chartered chapters (EDS, WIE), workshops, research, hackathons, and leadership.',
};

/**
 * IEEE MAIT Student Branch — Institutional Homepage
 * Server Component with Dynamic Prisma Database Integration & Fallback Hydration.
 */
export default async function HomePage() {
  // Fetch real-time data from database with automatic static fallbacks
  const [
    events,
    chaptersList,
    achievementsList,
    peopleList,
    galleries
  ] = await Promise.all([
    getDynamicEvents(),
    getDynamicChapters(),
    getDynamicAchievements(),
    getDynamicPeople(),
    getDynamicGalleries()
  ]);

  // Flatten gallery photos for documentary showcase
  const galleryPhotos = (galleries as any[])
    .flatMap((g: any) =>
      (g.photos || []).map((p: any) => ({
        url: p.url || p.imageUrl,
        caption: p.caption,
        albumTitle: g.title,
        albumSlug: g.slug,
      }))
    )
    .filter((p: any) => Boolean(p.url))
    .slice(0, 4);

  // Featured Event: Next upcoming event or most recent
  const featuredEvent = events.length > 0 ? events[0] : null;
  const remainingUpcoming = events.length > 1 ? events.slice(1, 4) : [];

  // 1. Top Leadership: Core Parent Student Branch Executive Officers
  const sbLeadership = (peopleList as any[])
    .filter((p: any) => {
      const cat = (p.category || '').toLowerCase();
      const role = (p.role || '').toLowerCase();
      const cId = (p.chapterId || p.chapterSlug || '').toLowerCase();
      if (
        p.isFacultyAdvisor ||
        cat.includes('counsellor') ||
        cat.includes('counselor') ||
        cat.includes('mentor') ||
        role.includes('counsellor') ||
        role.includes('counselor') ||
        role.includes('mentor')
      ) {
        return false;
      }
      const isEds = p.id?.startsWith('p-eds') || cId === 'eds' || role.includes('eds') || cat.includes('eds');
      const isWie = p.id?.startsWith('p-wie') || cId === 'wie' || role.includes('wie') || cat.includes('wie');
      const isOp = p.id?.startsWith('p-op') || cat.includes('operational');
      if (isEds || isWie || isOp) return false;
      return (
        p.id?.startsWith('p-sec') ||
        cat.includes('senior executive') ||
        cat.includes('execom') ||
        role.includes('chair') ||
        role.includes('secretary') ||
        role.includes('treasurer') ||
        role.includes('web master')
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99))
    .slice(0, 4);

  // 2. Top Leadership: IEEE WIE Affinity Group Executive Officers
  const wieLeadership = (peopleList as any[])
    .filter((p: any) => {
      const cId = (p.chapterId || p.chapterSlug || '').toLowerCase();
      const roleLower = (p.role || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      return (
        p.id?.startsWith('p-wie') ||
        cId === 'wie' ||
        roleLower.includes('wie') ||
        catLower.includes('wie')
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99))
    .slice(0, 4);

  // 3. Top Leadership: IEEE EDS Technical Chapter Executive Officers
  const edsLeadership = (peopleList as any[])
    .filter((p: any) => {
      const cId = (p.chapterId || p.chapterSlug || '').toLowerCase();
      const roleLower = (p.role || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      return (
        p.id?.startsWith('p-eds') ||
        cId === 'eds' ||
        roleLower.includes('eds') ||
        catLower.includes('eds')
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99))
    .slice(0, 4);

  // Featured Achievements
  const featuredAchievements = achievementsList.slice(0, 5);

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
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-warm-200 dark:border-gray-800 bg-grid-pattern overflow-hidden">
          <Container size="default">
            <div className="max-w-3xl space-y-6">
              {/* Region & Section Identifier */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ieee-subtle dark:bg-sky-950/80 border border-ieee-blue/20 dark:border-sky-800/60 rounded-md">
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-300 uppercase tracking-wider">
                  {BRANCH_STATS.region} · {BRANCH_STATS.section}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink dark:text-gray-100 font-normal leading-[1.08] tracking-tight">
                IEEE MAIT <br />
                <span className="italic text-ieee-blue dark:text-sky-400">Student Branch</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-warm-400 dark:text-gray-300 font-sans leading-relaxed max-w-2xl">
                Advancing technology, building community, and fostering technical excellence at {BRANCH_STATS.institution}. Chartered in {BRANCH_STATS.establishedYear}.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Button href="/join" variant="primary" size="lg" className="w-full sm:w-auto justify-center flex items-center gap-2">
                  <span>Join IEEE MAIT</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/about" variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                  Explore Our Work
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. LIVE METRIC STRIP */}
        <section className="border-b border-warm-200 dark:border-gray-800 bg-warm-100/60 dark:bg-gray-900/60 py-2">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 dark:divide-gray-800 py-4">
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
        <section className="py-16 sm:py-24 bg-white dark:bg-gray-950 border-b border-warm-200 dark:border-gray-800">
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
                <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg divide-y divide-warm-200 dark:divide-gray-800 overflow-hidden shadow-xs">
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
                <p className="font-mono text-sm text-warm-400 dark:text-gray-400 py-8 text-center border border-warm-200 dark:border-gray-800 rounded-lg">
                  No upcoming events currently scheduled. Explore our past event dossiers and reports below.
                </p>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-warm-200 dark:border-gray-800">
                <Link href="/events" className="text-xs font-mono text-ieee-blue dark:text-sky-400 font-semibold hover:underline flex items-center gap-1.5">
                  <span>View Full Events Archive</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="font-mono text-xs text-warm-400 dark:text-gray-400">Live Database Feed</span>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. THE IEEE MAIT ECOSYSTEM (3 PILLARS) */}
        <section className="py-16 sm:py-24 bg-warm-100/30 dark:bg-gray-900/40 border-b border-warm-200 dark:border-gray-800">
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

            <div className="pt-8 flex justify-between items-center border-t border-warm-200 dark:border-gray-800 mt-8">
              <Link href="/chapters" className="text-xs font-mono text-ieee-blue dark:text-sky-400 font-semibold hover:underline flex items-center gap-1.5">
                <span>Explore All Communities & Sub-Portals</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                {chaptersList.length} Chartered Units
              </span>
            </div>
          </Container>
        </section>

        {/* 5. RECENT RECOGNITIONS LEDGER */}
        <section className="py-16 sm:py-24 bg-white dark:bg-gray-950 border-b border-warm-200 dark:border-gray-800">
          <Container size="default">
            <SectionHeading
              category="Institutional Record"
              title="Recent Achievements & Recognitions"
              subtitle="A permanent record of branch honors, hackathon victories, and section recognitions."
            />

            <div className="border-t border-warm-200 dark:border-gray-800 pt-4">
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
                <Link href="/achievements" className="text-xs font-mono text-ieee-blue dark:text-sky-400 font-semibold hover:underline flex items-center gap-1.5">
                  <span>View Full Achievements Ledger</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="font-mono text-xs text-warm-400 dark:text-gray-400">Delhi Section Record</span>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. LEADERSHIP SPOTLIGHT (Parent SB, WIE AG & EDS Chapter) */}
        {(sbLeadership.length > 0 || wieLeadership.length > 0 || edsLeadership.length > 0) && (
          <HomeLeadershipSection
            sbLeadership={sbLeadership}
            wieLeadership={wieLeadership}
            edsLeadership={edsLeadership}
            totalMembers={BRANCH_STATS.activeMembers}
          />
        )}

        {/* 7. REAL MOMENTS — Documentary Photography Band */}
        <section className="py-16 sm:py-24 bg-warm-100/40 dark:bg-gray-950 border-b border-warm-200 dark:border-gray-800 transition-colors duration-200">
          <Container size="default">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block mb-2">
                  Documentary Record
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ink dark:text-white font-normal leading-tight">
                  Real Moments, Real Work
                </h2>
              </div>
              <Link href="/gallery" className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 hover:underline font-semibold shrink-0 flex items-center gap-1.5">
                <span>View Full Photo Gallery</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPhotos.length > 0 ? (
                galleryPhotos.map((photo: any, idx: number) => (
                  <Link
                    key={idx}
                    href={photo.albumSlug ? `/gallery/${photo.albumSlug}` : `/gallery`}
                    className="group relative aspect-4/3 bg-warm-200/60 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 overflow-hidden rounded-lg flex flex-col justify-end p-4 hover:border-ieee-blue/40 dark:hover:border-sky-400/50 shadow-xs transition-all duration-300"
                  >
                    {photo.url ? (
                      <Image
                        src={photo.url}
                        alt={photo.caption || photo.albumTitle || 'Documentary Photo'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="relative z-10">
                      <span className="font-mono text-[10px] text-sky-300 uppercase tracking-wider block mb-1">
                        {photo.albumTitle}
                      </span>
                      <p className="font-sans text-xs text-white line-clamp-2 leading-snug">
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
                    className="group relative aspect-4/3 bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-lg flex flex-col justify-between p-4 hover:border-ieee-blue/40 dark:hover:border-sky-400/50 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-ieee-blue dark:text-sky-400 uppercase tracking-wider font-semibold">
                        {item.subtitle}
                      </span>
                      <FiExternalLink className="w-3.5 h-3.5 text-warm-400 dark:text-gray-500 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-ink dark:text-white group-hover:text-ieee-blue dark:group-hover:text-sky-300 transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="mt-6 text-center">
              <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
                Official documentary archive curated by the IEEE MAIT Creative & Media Team
              </span>
            </div>
          </Container>
        </section>

        {/* 8. HIGH-CONVERSION JOIN CALLOUT */}
        <section className="py-20 sm:py-28 bg-white dark:bg-gray-950 border-b border-warm-200 dark:border-gray-800 transition-colors duration-200">
          <Container size="narrow">
            <div className="text-center space-y-6">
              <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                Become a Member
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-ink dark:text-white font-normal leading-tight">
                Join IEEE MAIT Student Branch
              </h2>
              <p className="text-base sm:text-lg text-warm-500 dark:text-gray-300 font-sans leading-relaxed max-w-xl mx-auto">
                Connect with {BRANCH_STATS.activeMembers} engineers, access IEEE&apos;s global network of 460,000+ technologists, and build hands-on skills in hardware, AI, and leadership.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button href="/join" variant="primary" size="lg" className="shadow-md flex items-center gap-2">
                  <span>Start Your Membership</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
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

import React from 'react';
import { notFound } from 'next/navigation';
import Link from '@/components/ui/AppLink';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { StatMetric } from '@/components/content/StatMetric';
import { EventPreview } from '@/components/content/EventPreview';
import { AchievementRow } from '@/components/content/AchievementRow';
import { PersonCard } from '@/components/content/PersonCard';
import { ChapterHero } from '@/components/content/ChapterHero';
import { ChapterSocialLinks } from '@/components/content/ChapterSocialLinks';
import { ProjectCard } from '@/components/content/ProjectCard';
import { InitiativeCard } from '@/components/content/InitiativeCard';
import {
  getDynamicChapterBySlug,
  getDynamicChapters,
  getDynamicEvents,
  getDynamicAchievements,
  getDynamicChapterMemberships,
  getDynamicProjects,
  getDynamicInitiatives,
  getDynamicPeople,
} from '@/lib/api';
import { FiArrowRight } from 'react-icons/fi';

export async function generateStaticParams() {
  const chapters = await getDynamicChapters();
  return chapters.map((chapter: any) => ({
    slug: chapter.slug,
  }));
}

interface ChapterPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const chapter = await getDynamicChapterBySlug(resolvedParams.slug);
  if (!chapter) return { title: 'Chapter Not Found — IEEE MAIT' };

  const desc = chapter.tagline || chapter.description || `IEEE MAIT ${chapter.name}`;

  return {
    title: `${chapter.name} | IEEE MAIT Student Branch`,
    description: desc,
    openGraph: {
      title: `${chapter.name} | IEEE MAIT`,
      description: desc,
      images: chapter.coverImageUrl ? [{ url: chapter.coverImageUrl }] : [],
    },
  };
}

export default async function ChapterDetailPage({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const chapter = await getDynamicChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  // Fetch related chapter entities concurrently
  const [allEvents, allAchievements, chapterMemberships, chapterProjects, chapterInitiatives, allPeople] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    chapter.id ? getDynamicChapterMemberships(chapter.id) : Promise.resolve([]),
    getDynamicProjects(slug),
    getDynamicInitiatives(slug),
    getDynamicPeople(),
  ]);

  // Filter events by chapter slug or chapterId
  const chapterEvents = allEvents.filter(
    (e: any) => e.unitSlug === chapter.slug || (e.chapterId && e.chapterId === chapter.id)
  );

  // Fallback chapter leadership team
  const chapterTeam = chapterMemberships.length > 0
    ? chapterMemberships.map((m: any) => ({
        id: m.id || m.person?.id,
        name: m.person?.name || 'Officer',
        role: m.role?.title || m.person?.role || 'Executive Member',
        department: m.person?.department,
        imageUrl: m.person?.imageUrl,
        imageSrc: m.person?.imageSrc,
        linkedIn: m.person?.linkedIn,
        github: m.person?.github,
        email: m.person?.email,
        bio: m.person?.bio,
      }))
    : allPeople.filter((p: any) => {
        const cId = (p.chapterId || p.chapterSlug || '').toLowerCase();
        const r = (p.role || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        if (slug === 'eds') return cId === 'eds' || r.includes('eds') || cat.includes('eds');
        if (slug === 'wie') return cId === 'wie' || r.includes('wie') || cat.includes('wie');
        if (slug === 'sb') return cId === 'sb' || cat.includes('sec') || r.includes('chair') || r.includes('secretary') || r.includes('treasurer');
        return false;
      });

  // Filter achievements by chapterId or unit name match
  const chapterAchievements = allAchievements.filter(
    (a: any) =>
      (a.chapterId && a.chapterId === chapter.id) ||
      (a.unitOrTeam && a.unitOrTeam.toLowerCase().includes(chapter.slug))
  );

  const chapterStories = chapter.stories || [];
  const chapterGalleries = chapter.galleries || [];

  // Specialized flags for differentiated portals
  const isEDS = slug === 'eds';
  const isWIE = slug === 'wie';
  const isSB = slug === 'sb';

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 py-3.5">
          <Container size="default">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Communities & Chapters', href: '/chapters' },
                { label: chapter.name },
              ]}
            />
          </Container>
        </div>

        {/* Chapter Hero Band */}
        <ChapterHero
          name={chapter.name}
          slug={chapter.slug}
          type={chapter.type}
          parentSociety={chapter.parentSociety}
          establishedYear={chapter.establishedYear}
          tagline={chapter.tagline}
          description={chapter.description}
          logoUrl={chapter.logoUrl}
          coverImageUrl={chapter.coverImageUrl}
          accentColor={chapter.accentColor}
          instagramUrl={chapter.instagramUrl}
          linkedinUrl={chapter.linkedinUrl}
          githubUrl={chapter.githubUrl}
        />

        {/* Quick Chapter Stat Metrics Strip */}
        <div className="border-b border-warm-200 dark:border-gray-800 bg-warm-100/30 dark:bg-gray-900/40 py-4">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 dark:divide-gray-800 py-2">
              <StatMetric 
                label="Active Members" 
                value={`${chapter.memberCount || '50+'}`} 
                description="Enrolled Unit Members" 
              />
              <StatMetric 
                label="Events Organized" 
                value={`${chapter.eventCount || chapterEvents.length || '10+'}`} 
                description="Workshops & Symposia" 
              />
              <StatMetric 
                label="Active Projects" 
                value={`${chapterProjects.length || '3+'}`} 
                description={isEDS ? 'Hardware & VLSI Builds' : isWIE ? 'Mentorship Circles' : 'Flagship Operations'} 
              />
              <StatMetric 
                label="Unit Charter" 
                value={chapter.establishedYear || 'Active'} 
                description={chapter.parentSociety || 'Delhi Section'} 
              />
            </div>
          </Container>
        </div>

        {/* Main Sub-Portal Content & Sidebar Layout */}
        <Container size="default" className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Primary Column */}
            <div className="lg:col-span-8 space-y-14">
              {/* Mission Statement */}
              <section className="space-y-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                  Charter & Purpose
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                  Mission & Focus
                </h2>
                <p className="text-base text-warm-500 dark:text-gray-300 leading-relaxed font-sans pt-1">
                  {chapter.mission || chapter.description}
                </p>
              </section>

              {/* ---------------------------------------------------- */}
              {/* EDS SUB-PORTAL SPECIALIZATION: Hardware Workshop Tracks */}
              {/* ---------------------------------------------------- */}
              {isEDS && (
                <section className="space-y-6">
                  <div className="border-b border-warm-200 dark:border-gray-800 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                      Technical Curriculum
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      EDS Technical Workshop Tracks
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/60 p-5 rounded-xl space-y-2.5 shadow-xs">
                      <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">
                        Track 01
                      </span>
                      <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                        KiCad PCB Design & Prototyping
                      </h4>
                      <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                        Schematic capture, multi-layer routing, design rule checks, Gerber export, and hands-on SMD soldering.
                      </p>
                    </div>

                    <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/60 p-5 rounded-xl space-y-2.5 shadow-xs">
                      <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">
                        Track 02
                      </span>
                      <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                        Digital VLSI & CMOS Simulation
                      </h4>
                      <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                        Verilog HDL modeling, gate-level simulation, timing constraints, and FPGA synthesis using Vivado.
                      </p>
                    </div>

                    <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/60 p-5 rounded-xl space-y-2.5 shadow-xs">
                      <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">
                        Track 03
                      </span>
                      <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                        Embedded Edge-AI & TinyML
                      </h4>
                      <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                        Deploying quantized neural networks onto ESP32-S3 and ARM Cortex microcontrollers with sub-50ms latency.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* ---------------------------------------------------- */}
              {/* WIE SUB-PORTAL SPECIALIZATION: Travel Grants & Scholarships */}
              {/* ---------------------------------------------------- */}
              {isWIE && (
                <section className="border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 p-6 sm:p-8 rounded-xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-0.5 rounded-full uppercase">
                      Advancement Guide
                    </span>
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">Global Opportunities</span>
                  </div>
                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                    IEEE WIE Travel Grants & Student Scholarships
                  </h3>
                  <p className="text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                    IEEE Women in Engineering provides travel grants to attend flagship IEEE conferences, student project funding awards, and leadership development bursaries. Our advisory cell assists student authors in preparing award-winning proposals.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <Button href="/contact" variant="primary" size="md" className="!bg-purple-700 hover:!bg-purple-800 dark:!bg-purple-600 dark:hover:!bg-purple-700 flex items-center gap-1.5 shadow-xs">
                      <span>Request Application Review</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Button>
                    <Button href="/publications/empowering-women-in-engineering-roadmap" variant="secondary" size="md" className="!border-purple-300 dark:!border-purple-800 !text-purple-800 dark:!text-purple-300">
                      Read 2026 Roadmap
                    </Button>
                  </div>
                </section>
              )}

              {/* ---------------------------------------------------- */}
              {/* PROJECTS SHOWCASE (EDS Hardware Builds / Parent SB Projects) */}
              {/* ---------------------------------------------------- */}
              {chapterProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Student Builds
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                        {isEDS ? 'Hardware & VLSI Project Showcase' : 'Active Technical Projects'}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                      {chapterProjects.length} Projects
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {chapterProjects.map((project: any) => (
                      <ProjectCard
                        key={project.id || project.slug}
                        title={project.title}
                        slug={project.slug}
                        summary={project.summary}
                        description={project.description}
                        githubUrl={project.githubUrl}
                        demoUrl={project.demoUrl}
                        coverImage={project.coverImage}
                        year={project.year}
                        tags={project.tags}
                        accentColor={chapter.accentColor || undefined}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ---------------------------------------------------- */}
              {/* INITIATIVES SHOWCASE (WIE Mentorship Circles / Chapter Programs) */}
              {/* ---------------------------------------------------- */}
              {chapterInitiatives.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Programs & Impact
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                        {isWIE ? 'Mentorship Circles & Outreach Drives' : 'Strategic Chapter Initiatives'}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                      {chapterInitiatives.length} Initiatives
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {chapterInitiatives.map((init: any) => (
                      <InitiativeCard
                        key={init.id || init.slug}
                        title={init.title}
                        slug={init.slug}
                        description={init.description}
                        status={init.status}
                        targetAudience={init.targetAudience}
                        iconName={init.iconName}
                        accentColor={chapter.accentColor || undefined}
                        actionHref="/join"
                        actionText="Join Initiative"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Team Section */}
              {chapterTeam.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Leadership
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                        Executive Committee & Leadership
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                      {chapterTeam.length} Officers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapterTeam.map((officer: any) => (
                      <PersonCard
                        key={officer.id}
                        name={officer.name}
                        role={officer.role}
                        department={officer.department}
                        imageUrl={officer.imageUrl}
                        imageSrc={officer.imageSrc}
                        linkedIn={officer.linkedIn}
                        github={officer.github}
                        email={officer.email}
                        bio={officer.bio}
                        size="compact"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Events */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                      Activities
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      Events & Workshops
                    </h2>
                  </div>
                  {chapterEvents.length > 0 && (
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                      {chapterEvents.length} Recorded
                    </span>
                  )}
                </div>

                {chapterEvents.length > 0 ? (
                  <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl divide-y divide-warm-200 dark:divide-gray-800 overflow-hidden shadow-xs">
                    {chapterEvents.map((event: any) => (
                      <EventPreview
                        key={event.id}
                        title={event.title}
                        slug={event.slug}
                        date={event.date || undefined}
                        venue={event.venue || undefined}
                        unit={event.unit || undefined}
                        category={event.category || undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 text-center rounded-xl text-warm-400 dark:text-gray-400 text-sm font-sans">
                    No upcoming events scheduled for this unit at present. Check back soon for announcements.
                  </div>
                )}
              </section>

              {/* Chapter Achievements */}
              {chapterAchievements.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Institutional Record
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                        Chapter Achievements & Honors
                      </h2>
                    </div>
                  </div>

                  <div className="border-t border-warm-200 dark:border-gray-800 divide-y divide-warm-200 dark:divide-gray-800">
                    {chapterAchievements.map((item: any) => (
                      <AchievementRow
                        key={item.id}
                        id={item.id}
                        year={item.year}
                        title={item.title}
                        conferredBy={item.conferredBy}
                        unitOrTeam={item.unitOrTeam}
                        category={item.category}
                        imageSrc={item.imageSrc || undefined}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Stories / Reports */}
              {chapterStories.length > 0 && (
                <section className="space-y-6">
                  <div className="border-b border-warm-200 dark:border-gray-800 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                      Publications
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      Stories & Event Reports
                    </h2>
                  </div>

                  <div className="divide-y divide-warm-200 dark:divide-gray-800 border-t border-warm-200 dark:border-gray-800">
                    {chapterStories.map((story: any) => (
                      <Link
                        key={story.id}
                        href={`/publications/${story.slug}`}
                        className="block py-4 group hover:bg-warm-50/50 dark:hover:bg-gray-900/60 transition-colors px-3 -mx-3 rounded-lg"
                      >
                        <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
                          {story.date} · {story.category}
                        </span>
                        <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal mt-1 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                          {story.title}
                        </h4>
                        {story.excerpt && (
                          <p className="text-xs text-warm-500 dark:text-gray-300 font-sans mt-1 line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Photo Galleries */}
              {chapterGalleries.length > 0 && (
                <section className="space-y-6">
                  <div className="border-b border-warm-200 dark:border-gray-800 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                      Documentary
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      Photo Galleries
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapterGalleries.map((album: any) => (
                      <Link
                        key={album.id}
                        href={`/gallery/${album.slug}`}
                        className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 rounded-xl group hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-colors block shadow-xs"
                      >
                        <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                          {album.title}
                        </h4>
                        <span className="font-mono text-xs text-warm-400 dark:text-gray-400 mt-1 block">
                          {album.date} · {album.imageCount || 0} Photos
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Action Band */}
              <div className="pt-4 flex items-center gap-4 flex-wrap">
                <Button href="/join" variant="primary" size="lg" className="flex items-center gap-1.5 shadow-xs">
                  <span>Join {chapter.name}</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/chapters" variant="secondary" size="lg">
                  Browse All Units
                </Button>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Chapter Specification Card */}
              <div className="border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 p-6 rounded-xl space-y-6 shadow-xs">
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                  Unit Specification
                </h3>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 dark:text-gray-400 block uppercase">Classification</span>
                    <span className="text-ink dark:text-gray-100 font-semibold text-sm">{chapter.type}</span>
                  </div>
                  {chapter.parentSociety && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-400 block uppercase">Parent Society</span>
                      <span className="text-ink dark:text-gray-100 font-semibold text-sm">{chapter.parentSociety}</span>
                    </div>
                  )}
                  {chapter.establishedYear && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-400 block uppercase">Chartered Year</span>
                      <span className="text-ink dark:text-gray-100 font-semibold text-sm">{chapter.establishedYear}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 dark:text-gray-400 block uppercase">Active Members</span>
                    <span className="text-ieee-blue dark:text-sky-400 font-semibold text-sm">{chapter.memberCount || '50+'}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 dark:text-gray-400 block uppercase">Events Organized</span>
                    <span className="text-ink dark:text-gray-100 font-semibold text-sm">{chapter.eventCount || chapterEvents.length || '10+'}</span>
                  </div>
                </div>
              </div>

              {/* Leadership Spotlight Card */}
              {chapter.leader ? (
                <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-xl space-y-4 shadow-xs">
                  <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                    Student Leadership
                  </h3>
                  <PersonCard
                    name={chapter.leader.name}
                    role={chapter.leaderRole || chapter.leader.role || 'Chapter Chair'}
                    department={chapter.leader.department}
                    imageUrl={chapter.leader.imageUrl}
                    imageSrc={chapter.leader.imageSrc}
                    linkedIn={chapter.leader.linkedIn}
                    github={chapter.leader.github}
                    email={chapter.leader.email}
                    size="compact"
                  />
                  <div className="pt-2">
                    <Link
                      href={`/people?team=${chapter.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline"
                    >
                      <span>View Full {chapter.name} ExeCom</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : chapter.leaderName ? (
                <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-xl space-y-3 shadow-xs">
                  <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                    Student Leadership
                  </h3>
                  <div>
                    <span className="font-mono text-xs text-ieee-blue dark:text-sky-400 uppercase tracking-wider block font-semibold">
                      {chapter.leaderRole || 'Chapter Lead'}
                    </span>
                    <span className="font-serif text-lg text-ink dark:text-gray-100 font-normal block mt-1">
                      {chapter.leaderName}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/people?team=${chapter.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline"
                    >
                      <span>View Full {chapter.name} ExeCom</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Social Channels Card */}
              {(chapter.instagramUrl || chapter.linkedinUrl || chapter.githubUrl) && (
                <div className="border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 p-6 rounded-xl space-y-4 shadow-xs">
                  <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                    Connect with Chapter
                  </h3>
                  <p className="text-xs font-sans text-warm-500 dark:text-gray-400">
                    Follow dedicated social channels for real-time announcements, workshop slides, and team updates.
                  </p>
                  <ChapterSocialLinks
                    instagram={chapter.instagramUrl}
                    linkedin={chapter.linkedinUrl}
                    github={chapter.githubUrl}
                    size="md"
                    className="flex-col !items-start gap-3 pt-2"
                  />
                </div>
              )}

              {/* Branch Affiliation Notice */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-xl space-y-2 shadow-xs">
                <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400 uppercase tracking-widest block font-semibold">
                  Institutional Charter
                </span>
                <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                  Chartered under IEEE Delhi Section (Region 10) at Maharaja Agrasen Institute of Technology, PSP Area, Sector 22, Rohini, Delhi.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

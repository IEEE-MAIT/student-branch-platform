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
import {
  getDynamicChapterBySlug,
  getDynamicChapters,
  getDynamicEvents,
  getDynamicAchievements,
  getDynamicChapterMemberships,
} from '@/lib/api';

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
  const chapter = await getDynamicChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    notFound();
  }

  // Fetch related chapter entities concurrently
  const [allEvents, allAchievements, chapterMemberships] = await Promise.all([
    getDynamicEvents(),
    getDynamicAchievements(),
    chapter.id ? getDynamicChapterMemberships(chapter.id) : Promise.resolve([]),
  ]);

  // Filter events by chapter slug or chapterId
  const chapterEvents = allEvents.filter(
    (e: any) => e.unitSlug === chapter.slug || (e.chapterId && e.chapterId === chapter.id)
  );

  // Filter achievements by chapterId or unit name match
  const chapterAchievements = allAchievements.filter(
    (a: any) =>
      (a.chapterId && a.chapterId === chapter.id) ||
      (a.unitOrTeam && a.unitOrTeam.toLowerCase().includes(chapter.slug))
  );

  const chapterStories = chapter.stories || [];
  const chapterGalleries = chapter.galleries || [];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white page-enter">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-warm-200 bg-warm-50/50 py-3.5">
          <Container size="default">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Chapters & Affinity Groups', href: '/chapters' },
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
        <div className="border-b border-warm-200 bg-warm-100/30 py-4">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 py-2">
              <StatMetric label="Active Members" value={`${chapter.memberCount || '50+'}`} description="Enrolled Student Members" />
              <StatMetric label="Events Organized" value={`${chapter.eventCount || chapterEvents.length || '10+'}`} description="Workshops & Symposia" />
              <StatMetric label="Achievements" value={`${chapterAchievements.length || '3+'}`} description="Institutional Recognitions" />
              <StatMetric label="Chartered Unit" value={chapter.establishedYear || 'Active'} description={chapter.parentSociety || 'Delhi Section'} />
            </div>
          </Container>
        </div>

        {/* Main Content & Sidebar Layout */}
        <Container size="default" className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Primary Column */}
            <div className="lg:col-span-8 space-y-14">
              {/* Mission Statement */}
              <section className="space-y-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Charter & Purpose
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal border-b border-warm-200 pb-3">
                  Mission & Focus
                </h2>
                <p className="text-base text-warm-400 leading-relaxed font-sans pt-1">
                  {chapter.mission || chapter.description}
                </p>
              </section>

              {/* Chapter Team Section */}
              {chapterMemberships.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Leadership
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                        Executive Committee
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-warm-400">
                      {chapterMemberships.length} Officers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapterMemberships.map((m: any) => (
                      <PersonCard
                        key={m.id}
                        name={m.person?.name || 'Officer'}
                        role={m.role?.title || m.person?.role || 'Executive Member'}
                        department={m.person?.department}
                        imageUrl={m.person?.imageUrl}
                        linkedIn={m.person?.linkedIn}
                        github={m.person?.github}
                        email={m.person?.email}
                        bio={m.person?.bio}
                        size="compact"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Events */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-warm-200 pb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                      Activities
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                      Events & Workshops
                    </h2>
                  </div>
                  {chapterEvents.length > 0 && (
                    <span className="font-mono text-xs text-warm-400">
                      {chapterEvents.length} Recorded
                    </span>
                  )}
                </div>

                {chapterEvents.length > 0 ? (
                  <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
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
                  <div className="p-8 border border-warm-200 bg-warm-100/40 text-center rounded-[2px] text-warm-400 text-sm font-sans">
                    No upcoming events scheduled for this unit at present. Check back soon for announcements.
                  </div>
                )}
              </section>

              {/* Chapter Achievements */}
              {chapterAchievements.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Institutional Record
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                        Chapter Achievements
                      </h2>
                    </div>
                  </div>

                  <div className="border-t border-warm-200 divide-y divide-warm-200">
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
                  <div className="border-b border-warm-200 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                      Publications
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                      Stories & Event Reports
                    </h2>
                  </div>

                  <div className="divide-y divide-warm-200 border-t border-warm-200">
                    {chapterStories.map((story: any) => (
                      <Link
                        key={story.id}
                        href={`/stories/${story.slug}`}
                        className="block py-4 group hover:bg-warm-50/50 transition-colors px-2 -mx-2 rounded-[2px]"
                      >
                        <span className="font-mono text-[11px] text-warm-400">
                          {story.date} · {story.category}
                        </span>
                        <h4 className="font-serif text-xl text-ink font-normal mt-1 group-hover:text-ieee-blue transition-colors">
                          {story.title}
                        </h4>
                        {story.excerpt && (
                          <p className="text-xs text-warm-400 font-sans mt-1 line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Chapter Galleries */}
              {chapterGalleries.length > 0 && (
                <section className="space-y-6">
                  <div className="border-b border-warm-200 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                      Documentary
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                      Photo Galleries
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapterGalleries.map((album: any) => (
                      <Link
                        key={album.id}
                        href={`/gallery/${album.slug}`}
                        className="border border-warm-200 bg-white p-4 rounded-[2px] group hover:border-ieee-blue/40 transition-colors block"
                      >
                        <h4 className="font-serif text-lg text-ink font-normal group-hover:text-ieee-blue transition-colors">
                          {album.title}
                        </h4>
                        <span className="font-mono text-xs text-warm-400 mt-1 block">
                          {album.date} · {album.imageCount || 0} Photos
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Action Band */}
              <div className="pt-4 flex items-center gap-4">
                <Button href="/join" variant="primary" size="lg">
                  Join {chapter.name} →
                </Button>
                <Button href="/chapters" variant="secondary" size="lg">
                  Browse All Units
                </Button>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Chapter Specification Card */}
              <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6">
                <h3 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                  Unit Specification
                </h3>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 block uppercase">Classification</span>
                    <span className="text-ink font-semibold text-sm">{chapter.type}</span>
                  </div>
                  {chapter.parentSociety && (
                    <div>
                      <span className="text-warm-400 block uppercase">Parent Society</span>
                      <span className="text-ink font-semibold text-sm">{chapter.parentSociety}</span>
                    </div>
                  )}
                  {chapter.establishedYear && (
                    <div>
                      <span className="text-warm-400 block uppercase">Established Year</span>
                      <span className="text-ink font-semibold text-sm">{chapter.establishedYear}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 block uppercase">Active Members</span>
                    <span className="text-ieee-blue font-semibold text-sm">{chapter.memberCount || '50+'}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Events Organized</span>
                    <span className="text-ink font-semibold text-sm">{chapter.eventCount || chapterEvents.length || '10+'}</span>
                  </div>
                </div>
              </div>

              {/* Leadership Spotlight Card */}
              {chapter.leader ? (
                <div className="border border-warm-200 bg-white p-6 rounded-[2px] space-y-4">
                  <h3 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                    Student Leadership
                  </h3>
                  <PersonCard
                    name={chapter.leader.name}
                    role={chapter.leaderRole || chapter.leader.role || 'Chapter Chair'}
                    department={chapter.leader.department}
                    imageUrl={chapter.leader.imageUrl}
                    linkedIn={chapter.leader.linkedIn}
                    github={chapter.leader.github}
                    email={chapter.leader.email}
                    size="compact"
                  />
                </div>
              ) : chapter.leaderName ? (
                <div className="border border-warm-200 bg-white p-6 rounded-[2px] space-y-3">
                  <h3 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                    Student Leadership
                  </h3>
                  <div>
                    <span className="font-mono text-xs text-ieee-blue uppercase tracking-wider block font-semibold">
                      {chapter.leaderRole || 'Chapter Lead'}
                    </span>
                    <span className="font-serif text-lg text-ink font-normal block mt-1">
                      {chapter.leaderName}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Social Channels Card */}
              {(chapter.instagramUrl || chapter.linkedinUrl || chapter.githubUrl) && (
                <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-4">
                  <h3 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                    Connect with Chapter
                  </h3>
                  <p className="text-xs font-sans text-warm-400">
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
              <div className="border border-warm-200 bg-white p-6 rounded-[2px] space-y-2">
                <span className="font-mono text-[10px] text-warm-400 uppercase tracking-widest block">
                  Institutional Charter
                </span>
                <p className="text-xs text-warm-400 font-sans leading-relaxed">
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


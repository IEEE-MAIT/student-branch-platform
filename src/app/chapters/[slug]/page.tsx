import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { EventPreview } from '@/components/content/EventPreview';
import { getDynamicChapterBySlug } from '@/lib/api';

interface ChapterPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const chapter = await getDynamicChapterBySlug(resolvedParams.slug);
  if (!chapter) return { title: 'Chapter Not Found — IEEE MAIT' };

  return {
    title: `${chapter.name} | IEEE MAIT Student Branch`,
    description: chapter.description || `IEEE MAIT ${chapter.name}`,
  };
}

export default async function ChapterDetailPage({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const chapter = await getDynamicChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    notFound();
  }

  // To fetch chapter specific events dynamically we would need an API call.
  // For now we'll just fetch all events and filter them on the server.
  // Wait, I can just use getDynamicEvents. I need to import it.
  const { getDynamicEvents } = await import('@/lib/api');
  const allEvents = await getDynamicEvents();
  const chapterEvents = allEvents.filter((e: any) => e.unitSlug === chapter.slug);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          {/* Chapter Identity Header */}
          <SectionHeading
            category={chapter.type}
            title={chapter.name}
            subtitle={chapter.description || undefined}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            <div className="lg:col-span-8 space-y-10">
              {/* Mission Statement */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                  Chapter Mission & Focus
                </h3>
                <p className="text-base text-warm-400 leading-relaxed font-sans">
                  {chapter.mission}
                </p>
              </div>

              {/* Chapter Events */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                  Chapter Events & Activities
                </h3>

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
                    No upcoming events scheduled for this chapter at present. Check back soon for announcements.
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button href="/join" variant="primary" size="md">
                  Join {chapter.name} →
                </Button>
              </div>
            </div>

            {/* Sidebar Overview */}
            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                Chapter Details
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 block uppercase">Parent Society</span>
                  <span className="text-ink font-semibold text-sm">{chapter.parentSociety}</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Established Year</span>
                  <span className="text-ink font-semibold text-sm">{chapter.establishedYear}</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Active Members</span>
                  <span className="text-ieee-blue font-semibold text-sm">{chapter.memberCount}</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Events Organized</span>
                  <span className="text-ink font-semibold text-sm">{chapter.eventCount}</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Student Leadership</span>
                  <span className="text-ink font-semibold text-sm">{chapter.leaderName} ({chapter.leaderRole})</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

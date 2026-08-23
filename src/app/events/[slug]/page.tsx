import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getDynamicEventBySlug,
  getDynamicEvents,
  getDynamicStoryBySlug,
  getDynamicGalleryAlbumBySlug,
} from '@/lib/api';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';

export async function generateStaticParams() {
  const events = await getDynamicEvents();
  return events.map((event: any) => ({
    slug: event.slug,
  }));
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = await getDynamicEventBySlug(resolvedParams.slug);
  if (!event) return { title: 'Event Not Found — IEEE MAIT' };

  return {
    title: `${event.title} | IEEE MAIT Events`,
    description: event.description || `Event organized by ${event.unit || 'IEEE MAIT Student Branch'}.`,
    openGraph: {
      title: event.title,
      description: event.description || `Event organized by ${event.unit || 'IEEE MAIT Student Branch'}.`,
      type: 'article',
      siteName: 'IEEE MAIT Student Branch',
      ...(event.imageSrc && { images: [{ url: event.imageSrc }] }),
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const event = await getDynamicEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Resolve relational content (Story report and Photo Gallery album)
  const isUpcoming = event.status?.toLowerCase() === 'upcoming';
  const isPast = !isUpcoming;

  // Try matching related story from relation or slug lookup
  const relatedStory =
    event.story ||
    (await getDynamicStoryBySlug(event.storyId || slug)) ||
    null;

  // Try matching related gallery from relation or slug lookup
  const relatedGallery =
    event.gallery ||
    (await getDynamicGalleryAlbumBySlug(event.galleryId || slug)) ||
    null;

  // Generate .ics calendar download data URL
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IEEE MAIT Student Branch//Events//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${(event.description || '').replace(/\n/g, ' ')}
LOCATION:${event.venue || 'Maharaja Agrasen Institute of Technology'}
END:VEVENT
END:VCALENDAR`;

  const icsDownloadUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`;

  const unitSlug = event.unitSlug || (event.unit?.toLowerCase().includes('wie') ? 'wie' : event.unit?.toLowerCase().includes('eds') ? 'eds' : 'sb');

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          {/* Back Navigation */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
          >
            <span>← Back to Events & Workshops Hub</span>
          </Link>

          {/* Status & Unit Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-[2px] ${
                isUpcoming
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-warm-100 text-warm-500 border border-warm-200'
              }`}
            >
              {isUpcoming ? '● Upcoming Session' : '● Past Event Dossier'}
            </span>
            {event.category && <Badge variant="ieee">{event.category}</Badge>}
            {event.unit && (
              <Link href={`/chapters/${unitSlug}`}>
                <Badge variant="neutral" className="hover:bg-warm-200 transition-colors">
                  {event.unit}
                </Badge>
              </Link>
            )}
          </div>

          <SectionHeading title={event.title} className="mb-8" />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            {/* Primary Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Event Cover Photo if available */}
              {event.imageSrc && (
                <div className="relative w-full h-72 sm:h-96 rounded-[2px] overflow-hidden border border-warm-200 bg-warm-100">
                  <Image
                    src={event.imageSrc}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Event Description */}
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Event Briefing
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal border-b border-warm-200 pb-2">
                  About This Session
                </h3>
                <p className="text-base text-warm-400 leading-relaxed font-sans whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* ---------------------------------------------------- */}
              {/* UPCOMING EVENT FLOW: Schedule, Speakers, Registration */}
              {/* ---------------------------------------------------- */}
              {isUpcoming && (
                <>
                  {/* Schedule Timeline */}
                  {event.schedule && event.schedule.length > 0 && (
                    <div className="space-y-4">
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Agenda Breakdown
                      </span>
                      <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                        Event Schedule & Timeline
                      </h3>
                      <div className="border border-warm-200 rounded-[2px] divide-y divide-warm-200 bg-white">
                        {event.schedule.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-start gap-4 hover:bg-warm-50/50 transition-colors">
                            <span className="font-mono text-xs font-semibold text-ieee-blue w-24 flex-shrink-0 pt-0.5">
                              {item.time}
                            </span>
                            <span className="text-sm text-ink font-sans">
                              {item.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Speakers */}
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="space-y-4">
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Instructors & Guests
                      </span>
                      <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                        Featured Speakers
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {event.speakers.map((sp: any, idx: number) => (
                          <div key={idx} className="p-5 border border-warm-200 rounded-[2px] bg-warm-50/50 space-y-1">
                            <h4 className="font-serif text-lg text-ink font-normal">{sp.name}</h4>
                            <p className="text-xs text-ieee-blue font-medium">{sp.title}</p>
                            <p className="text-xs text-warm-400">{sp.organization}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Callout */}
                  <div className="p-8 border border-ieee-blue/30 bg-ieee-subtle/40 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <h4 className="font-serif text-2xl text-ink font-normal">Reserve Your Seat</h4>
                      <p className="text-sm text-warm-400 font-sans mt-1">
                        Open to all MAIT engineering students. IEEE Members receive priority lab bench access.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button href={event.registrationLink || '/join'} variant="primary" size="lg">
                        Register for Workshop →
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------------------------------------------- */}
              {/* PAST EVENT FLOW: Relational Story Report, Gallery, Materials */}
              {/* ---------------------------------------------------- */}
              {isPast && (
                <div className="space-y-12 pt-4">
                  {/* Relational Post-Event Story Report Embed */}
                  {relatedStory && (
                    <div className="space-y-4">
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Post-Event Documentation
                      </span>
                      <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                        Story & Technical Report
                      </h3>
                      <div className="border border-warm-200 bg-warm-50/40 p-6 sm:p-7 rounded-[2px] space-y-4 hover:border-ieee-blue/30 transition-all group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-ieee-blue font-semibold uppercase">
                            {relatedStory.publishedDate || relatedStory.date} · {relatedStory.readingTime || '4 min read'}
                          </span>
                          <span className="font-mono text-[10px] bg-white border border-warm-200 px-2 py-0.5 rounded text-warm-400">
                            {relatedStory.type || 'Event Report'}
                          </span>
                        </div>
                        <h4 className="font-serif text-xl sm:text-2xl text-ink font-normal group-hover:text-ieee-blue transition-colors">
                          {relatedStory.title}
                        </h4>
                        <p className="text-sm text-warm-400 font-sans leading-relaxed line-clamp-3">
                          {relatedStory.excerpt || (Array.isArray(relatedStory.content) ? relatedStory.content[0] : '')}
                        </p>
                        <div className="pt-2">
                          <Link
                            href={`/stories/${relatedStory.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ieee-blue hover:underline"
                          >
                            <span>Read Full Report & Key Takeaways →</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Relational Photo Gallery Embed */}
                  {relatedGallery && relatedGallery.photos && relatedGallery.photos.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-warm-200 pb-2">
                        <div>
                          <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                            Visual Archive
                          </span>
                          <h3 className="font-serif text-2xl text-ink font-normal">
                            Photo Gallery ({relatedGallery.photos.length} Photographs)
                          </h3>
                        </div>
                        <Link
                          href={`/gallery/${relatedGallery.slug}`}
                          className="font-mono text-xs text-ieee-blue hover:underline font-semibold"
                        >
                          View Album →
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {relatedGallery.photos.slice(0, 4).map((photo: any, idx: number) => (
                          <Link
                            key={photo.id || idx}
                            href={`/gallery/${relatedGallery.slug}`}
                            className="group relative aspect-square bg-warm-100 border border-warm-200 rounded-[2px] overflow-hidden block"
                          >
                            {photo.url ? (
                              <Image
                                src={photo.url}
                                alt={photo.caption || `Photo ${idx + 1}`}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-warm-400 p-2 text-center">
                                {photo.caption}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workshop Materials & Downloads */}
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                      Digital Library
                    </span>
                    <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                      Workshop Materials & Code Repositories
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 border border-warm-200 bg-white rounded-[2px] space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-ieee-blue">📄 Slide Deck</span>
                        </div>
                        <h4 className="font-serif text-base text-ink font-normal">
                          Presentation Slides & Lab Notes
                        </h4>
                        <p className="text-xs text-warm-400">
                          Complete technical slide deck and theory references curated by the workshop leads.
                        </p>
                        <div className="pt-2">
                          <Link href="/resources" className="text-xs font-mono font-semibold text-ieee-blue hover:underline">
                            Browse Resources Archive →
                          </Link>
                        </div>
                      </div>

                      <div className="p-5 border border-warm-200 bg-white rounded-[2px] space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-warm-500">💻 Source Code</span>
                        </div>
                        <h4 className="font-serif text-base text-ink font-normal">
                          GitHub Repository & Schematics
                        </h4>
                        <p className="text-xs text-warm-400">
                          Starter templates, Python notebooks, and KiCad PCB schematics for this event.
                        </p>
                        <div className="pt-2">
                          <a
                            href="https://github.com/IEEE-MAIT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-semibold text-warm-500 hover:text-ink hover:underline"
                          >
                            Open on GitHub →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Logistics Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Logistics & Details Card */}
              <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6">
                <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                  Logistics & Schedule
                </h4>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 block uppercase">Date</span>
                    <span className="text-ink font-semibold text-sm">{event.date}</span>
                  </div>
                  {event.time && (
                    <div>
                      <span className="text-warm-400 block uppercase">Time</span>
                      <span className="text-ink font-semibold text-sm">{event.time}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 block uppercase">Venue</span>
                    <span className="text-ink font-semibold text-sm">{event.venue}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Organizing Unit</span>
                    <Link href={`/chapters/${unitSlug}`} className="text-ieee-blue font-semibold text-sm hover:underline block mt-0.5">
                      {event.unit} →
                    </Link>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Status</span>
                    <span className="text-ink font-semibold text-sm capitalize">{event.status}</span>
                  </div>
                </div>

                {/* iCal Button */}
                <div className="pt-2">
                  <a
                    href={icsDownloadUrl}
                    download={`${event.slug}.ics`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono border border-warm-300/80 hover:border-ieee-blue text-ink hover:text-ieee-blue bg-white rounded-[2px] transition-colors shadow-xs"
                  >
                    <span>📅 Add to Calendar (.ics)</span>
                  </a>
                </div>
              </div>

              {/* Organizing Unit Quick Bio */}
              <div className="border border-warm-200 bg-white p-6 rounded-[2px] space-y-3">
                <span className="font-mono text-[10px] text-warm-400 uppercase tracking-widest block">
                  Organizing Society
                </span>
                <h4 className="font-serif text-lg text-ink font-normal">
                  {event.unit}
                </h4>
                <p className="text-xs text-warm-400 font-sans leading-relaxed">
                  Chartered under IEEE Delhi Section. Dedicated to technical excellence and student career mentorship at MAIT.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/chapters/${unitSlug}`}
                    className="text-xs font-mono font-semibold text-ieee-blue hover:underline"
                  >
                    View Chapter Sub-Portal →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

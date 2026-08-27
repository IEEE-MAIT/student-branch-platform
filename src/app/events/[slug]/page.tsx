import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EventSlideshow } from '@/components/content/EventSlideshow';
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

export const revalidate = 60; // ISR Cache for 60 seconds

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

  // Resolve status flags
  const isUpcoming = event.status?.toLowerCase() === 'upcoming';
  const isOngoing = Boolean(event.isLive || event.status?.toLowerCase() === 'ongoing');
  const isPast = !isUpcoming && !isOngoing;
  const isFlagship = Boolean(
    event.eventType?.toLowerCase() === 'flagship' ||
    event.category?.toLowerCase().includes('flagship')
  );

  // Resolve relational content (Story report and Photo Gallery album)
  const relatedStory =
    event.story ||
    (await getDynamicStoryBySlug(event.storyId || slug)) ||
    null;

  const relatedGallery =
    event.gallery ||
    (await getDynamicGalleryAlbumBySlug(event.galleryId || slug)) ||
    null;

  // Prepare photos for EventSlideshow if available
  const slideshowPhotos: Array<{ id?: string; url: string; caption?: string | null; photographer?: string | null }> = [];
  if (relatedGallery && relatedGallery.photos && relatedGallery.photos.length > 0) {
    relatedGallery.photos.forEach((p: any) => {
      if (p.url || p.imageUrl) {
        slideshowPhotos.push({
          id: p.id,
          url: p.url || p.imageUrl,
          caption: p.caption || relatedGallery.title,
          photographer: p.photographer,
        });
      }
    });
  } else if (Array.isArray(event.images) && event.images.length > 0) {
    event.images.forEach((imgUrl: string, idx: number) => {
      slideshowPhotos.push({
        id: `img-${idx}`,
        url: imgUrl,
        caption: `${event.title} — Photo ${idx + 1}`,
      });
    });
  }

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

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 page-enter transition-colors duration-200">
        <Container size="default">
          {/* Back Navigation */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 mb-8 transition-colors"
          >
            <span>← Back to Events & Workshops Hub</span>
          </Link>

          {/* Status, Flagship & Unit Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {isOngoing && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider animate-pulse border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ● Live Now
              </span>
            )}
            {isUpcoming && (
              <span className="font-mono text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ● Upcoming Session
              </span>
            )}
            {isPast && (
              <span className="font-mono text-xs font-bold uppercase px-3 py-1 rounded-full bg-warm-100 dark:bg-gray-800 text-warm-500 dark:text-gray-400 border border-warm-200 dark:border-gray-700">
                ● Past Event Dossier
              </span>
            )}
            {isFlagship && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-700 shadow-xs">
                ⭐ Flagship Event
              </span>
            )}
            {event.category && <Badge variant="ieee">{event.category}</Badge>}
            {event.unit && (
              <Link href={`/chapters/${unitSlug}`}>
                <Badge variant="neutral" className="hover:bg-warm-200 dark:hover:bg-gray-700 transition-colors">
                  {event.unit}
                </Badge>
              </Link>
            )}
            {event.vtoolsLink && (
              <a
                href={event.vtoolsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-ieee-blue dark:text-sky-300 font-mono text-xs font-medium border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
              >
                <span>IEEE vTools Verified</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}
          </div>

          <SectionHeading title={event.title} className="mb-8" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            {/* Primary Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Event Visual Media: Slideshow or Single Cover Photo */}
              {slideshowPhotos.length > 1 ? (
                <EventSlideshow photos={slideshowPhotos} title={`${event.title} Visual Gallery`} />
              ) : event.imageSrc ? (
                <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-warm-200 dark:border-gray-800 bg-warm-100 dark:bg-gray-900 shadow-sm">
                  <Image
                    src={event.imageSrc}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : null}

              {/* Event Description */}
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                  Event Briefing
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                  About This Session
                </h3>
                <p className="text-base text-warm-500 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* ---------------------------------------------------- */}
              {/* UPCOMING / ONGOING EVENT FLOW: Agenda, Speakers, Registration */}
              {/* ---------------------------------------------------- */}
              {(isUpcoming || isOngoing) && (
                <>
                  {/* Schedule Timeline */}
                  {event.schedule && event.schedule.length > 0 && (
                    <div className="space-y-4">
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Agenda Breakdown
                      </span>
                      <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                        Event Schedule & Timeline
                      </h3>
                      <div className="border border-warm-200 dark:border-gray-800 rounded-xl divide-y divide-warm-200 dark:divide-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
                        {event.schedule.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-start gap-4 hover:bg-warm-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 w-24 shrink-0 pt-0.5">
                              {item.time}
                            </span>
                            <span className="text-sm text-ink dark:text-gray-200 font-sans">
                              {item.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Speakers & Instructors */}
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="space-y-4">
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Instructors & Guests
                      </span>
                      <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                        Featured Speakers
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {event.speakers.map((sp: any, idx: number) => (
                          <div key={idx} className="p-5 border border-warm-200 dark:border-gray-800 rounded-xl bg-warm-50/50 dark:bg-gray-900/50 space-y-1">
                            <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">{sp.name}</h4>
                            <p className="text-xs text-ieee-blue dark:text-sky-400 font-medium">{sp.title || sp.role}</p>
                            <p className="text-xs text-warm-400 dark:text-gray-400">{sp.organization}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration & Virtual Portal Card */}
                  <div className="p-8 border border-ieee-blue/30 dark:border-sky-800/50 bg-ieee-subtle/40 dark:bg-sky-950/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
                    <div>
                      <h4 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">Reserve Your Seat</h4>
                      <p className="text-sm text-warm-500 dark:text-gray-300 font-sans mt-1">
                        Open to all MAIT engineering students. IEEE Members receive priority lab bench access and verification certificates.
                      </p>
                      {event.virtualLink && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-ieee-blue dark:text-sky-400">
                          <span>🌐 Virtual Session Link Available</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                      {event.virtualLink && (
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Join Live Room →
                        </a>
                      )}
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
                      <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                        Post-Event Documentation
                      </span>
                      <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                        Story & Technical Report
                      </h3>
                      <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/40 dark:bg-gray-900/40 p-6 sm:p-7 rounded-xl space-y-4 hover:border-ieee-blue/30 dark:hover:border-sky-500/30 transition-all group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-ieee-blue dark:text-sky-400 font-semibold uppercase">
                            {relatedStory.publishedDate || relatedStory.date} · {relatedStory.readingTime || '4 min read'}
                          </span>
                          <span className="font-mono text-[10px] bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 px-2 py-0.5 rounded text-warm-400 dark:text-gray-400">
                            {relatedStory.type || 'Event Report'}
                          </span>
                        </div>
                        <h4 className="font-serif text-xl sm:text-2xl text-ink dark:text-gray-100 font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                          {relatedStory.title}
                        </h4>
                        <p className="text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed line-clamp-3">
                          {relatedStory.excerpt || (Array.isArray(relatedStory.content) ? relatedStory.content[0] : '')}
                        </p>
                        <div className="pt-2">
                          <Link
                            href={`/stories/${relatedStory.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ieee-blue dark:text-sky-400 hover:underline"
                          >
                            <span>Read Full Report & Key Takeaways →</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workshop Materials & Downloads */}
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
                      Digital Library & Resources
                    </span>
                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                      Workshop Materials & Code Repositories
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-ieee-blue dark:text-sky-400">📄 Slide Deck</span>
                        </div>
                        <h4 className="font-serif text-base text-ink dark:text-gray-100 font-normal">
                          Presentation Slides & Lab Notes
                        </h4>
                        <p className="text-xs text-warm-400 dark:text-gray-400">
                          Complete technical slide deck and theory references curated by the workshop leads.
                        </p>
                        <div className="pt-2">
                          <Link href="/resources" className="text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline">
                            Browse Resources Archive →
                          </Link>
                        </div>
                      </div>

                      <div className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-warm-500 dark:text-gray-400">💻 Source Code</span>
                        </div>
                        <h4 className="font-serif text-base text-ink dark:text-gray-100 font-normal">
                          GitHub Repository & Schematics
                        </h4>
                        <p className="text-xs text-warm-400 dark:text-gray-400">
                          Starter templates, Python notebooks, and KiCad PCB schematics for this event.
                        </p>
                        <div className="pt-2">
                          <a
                            href="https://github.com/IEEE-MAIT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-semibold text-warm-500 dark:text-gray-300 hover:text-ink dark:hover:text-white hover:underline"
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
              {/* Logistics & Schedule Card */}
              <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 p-6 rounded-xl space-y-6">
                <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                  Logistics & Schedule
                </h4>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 dark:text-gray-500 block uppercase">Date</span>
                    <span className="text-ink dark:text-gray-200 font-semibold text-sm">{event.date}</span>
                  </div>
                  {event.time && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-500 block uppercase">Time</span>
                      <span className="text-ink dark:text-gray-200 font-semibold text-sm">{event.time}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 dark:text-gray-500 block uppercase">Venue</span>
                    <span className="text-ink dark:text-gray-200 font-semibold text-sm">{event.venue}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 dark:text-gray-500 block uppercase">Organizing Unit</span>
                    <Link href={`/chapters/${unitSlug}`} className="text-ieee-blue dark:text-sky-400 font-semibold text-sm hover:underline block mt-0.5">
                      {event.unit} →
                    </Link>
                  </div>
                  <div>
                    <span className="text-warm-400 dark:text-gray-500 block uppercase">Status</span>
                    <span className="text-ink dark:text-gray-200 font-semibold text-sm capitalize">{event.status}</span>
                  </div>
                  {event.vtoolsLink && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-500 block uppercase">IEEE vTools</span>
                      <a
                        href={event.vtoolsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ieee-blue dark:text-sky-400 font-semibold text-xs hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>View Official vTools Dossier</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* iCal Button */}
                <div className="pt-2">
                  <a
                    href={icsDownloadUrl}
                    download={`${event.slug}.ics`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono border border-warm-300 dark:border-gray-700 hover:border-ieee-blue dark:hover:border-sky-400 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 bg-white dark:bg-gray-800 rounded-lg transition-colors shadow-xs"
                  >
                    <span>📅 Add to Calendar (.ics)</span>
                  </a>
                </div>
              </div>

              {/* Organizing Unit Quick Bio */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-xl space-y-3">
                <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400 uppercase tracking-widest block">
                  Organizing Society
                </span>
                <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                  {event.unit}
                </h4>
                <p className="text-xs text-warm-400 dark:text-gray-400 font-sans leading-relaxed">
                  Chartered under IEEE Delhi Section. Dedicated to technical excellence and student career mentorship at MAIT.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/chapters/${unitSlug}`}
                    className="text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline"
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
